// controllers/vehicleController.js
const Whitelist = require("../models/Whitelist");
const Blacklist = require("../models/Blacklist");
const OccasionalVisitor = require("../models/OccasionalVisitor");
const VehicleScanLog = require("../models/VehicleScanLog");

const normalizeVehicleNo = require("../utils/normalizeVehicleNo");

exports.verifyVehicle = async (req, res) => {
  try {
    const {
      vehicleNo,
      confidence,
      scanSource // "ANPR" | "MANUAL"
    } = req.body;

    const normalizedVehicleNo = normalizeVehicleNo(vehicleNo);

    /* 🚶 STEP-1: WALKING VISITOR */
    if (!normalizedVehicleNo) {
      await VehicleScanLog.create({
        vehicleNo: null,
        decision: "MANUAL_REQUIRED",
        decisionSource: "SYSTEM",
        confidence: null,
        scanSource: { type: scanSource }
      });

      return res.json({
        status: "MANUAL_REQUIRED",
        message: "Manual entry required (no vehicle detected)"
      });
    }

    /* 🟢 STEP-2: WHITELIST */
    const whitelistEntry = await Whitelist.findOne({
      vehicleNo: normalizedVehicleNo
    });

    if (whitelistEntry) {
      await VehicleScanLog.create({
        vehicleNo: normalizedVehicleNo,
        decision: "ALLOWED",
        decisionSource: "WHITELIST",
        confidence,
        scanSource: { type: scanSource }
      });

      return res.json({
        status: "ALLOWED",
        source: "WHITELIST",
        message: "Vehicle allowed (whitelisted)"
      });
    }

    /* 🔴 STEP-3: BLACKLIST */
    const blacklistEntry = await Blacklist.findOne({
      vehicleNo: normalizedVehicleNo
    });

    if (blacklistEntry) {
      await VehicleScanLog.create({
        vehicleNo: normalizedVehicleNo,
        decision: "DENIED",
        decisionSource: "BLACKLIST",
        confidence,
        scanSource: { type: scanSource }
      });

      return res.status(403).json({
        status: "DENIED",
        message: "Vehicle is blacklisted"
      });
    }

    /* 🟡 STEP-4: OCCASIONAL (DATE BASED) */
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const occasionalEntry = await OccasionalVisitor.findOne({
      vehicleNo: normalizedVehicleNo,
      dateOfVisit: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    if (occasionalEntry) {
      await VehicleScanLog.create({
        vehicleNo: normalizedVehicleNo,
        decision: "ALLOWED",
        decisionSource: "OCCASIONAL",
        confidence,
        scanSource: { type: scanSource }
      });

      return res.json({
        status: "ALLOWED",
        source: "OCCASIONAL",
        message: "Vehicle allowed (occasional visitor)"
      });
    }

    /* 🔵 STEP-5: MANUAL FALLBACK */
    await VehicleScanLog.create({
      vehicleNo: normalizedVehicleNo,
      decision: "MANUAL_REQUIRED",
      decisionSource: "SYSTEM",
      confidence,
      scanSource: { type: scanSource }
    });

    return res.json({
      status: "MANUAL_REQUIRED",
      message: "Vehicle not recognized, manual entry required"
    });

  } catch (err) {
    console.error("Vehicle verification error:", err);
    return res.status(500).json({
      status: "ERROR",
      message: "Vehicle verification failed"
    });
  }
};
