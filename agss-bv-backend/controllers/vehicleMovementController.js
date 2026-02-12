// controllers/vehicleMovementController.js
const VehicleLog = require("../models/VehicleLog");
const VehicleHistoryLog = require("../models/VehicleHistoryLog");
const normalizeVehicleNo = require("../utils/normalizeVehicleNo");
const OccasionalVisitor = require("../models/OccasionalVisitor");
exports.handleVehicleMovement = async (req, res) => {
  try {
    const {
      vehicleNo,
      source,       // WHITELIST | OCCASIONAL | MANUAL
      scanSource,   // ANPR | MANUAL
      confidence
    } = req.body;

    const normalizedVehicleNo = normalizeVehicleNo(vehicleNo);
    const now = new Date();

    if (!normalizedVehicleNo) {
      return res.status(400).json({
        status: "ERROR",
        message: "Vehicle number required"
      });
    }

    /* 🔴 STEP-1: EXIT CHECK (MOST IMPORTANT) */
    const activeLog = await VehicleLog.findOne({
      vehicleNo: normalizedVehicleNo,
      status: "inside"
    });

    if (activeLog) {
      activeLog.exitTime = now;
      activeLog.status = "outside";
      await activeLog.save();

      return res.json({
        status: "EXIT_SUCCESS",
        gate: "OPEN",
        message: "Vehicle exit recorded"
      });
    }

    /* 🟢 STEP-2: ENTRY FLOW */

    // Move previous outside logs to history
    const oldLogs = await VehicleLog.find({
      vehicleNo: normalizedVehicleNo,
      status: "outside"
    });

    for (const log of oldLogs) {
      await VehicleHistoryLog.create(log.toObject());
      await log.deleteOne();
    }

    // Create ENTRY log
    await VehicleLog.create({
      vehicleNo: normalizedVehicleNo,
      entryTime: now,
      status: "inside",
      source,
      scanSource,
      confidence
    });
    /* 🟡 STEP-3: OCCASIONAL CLEANUP (DATE-SAFE) */
if (source === "OCCASIONAL") {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  await OccasionalVisitor.deleteOne({
    vehicleNo: normalizedVehicleNo,
    dateOfVisit: {
      $gte: todayStart,
      $lte: todayEnd
    }
  });
}

    return res.json({
      status: "ENTRY_SUCCESS",
      gate: "OPEN",
      message: "Vehicle entry recorded"
    });

  } catch (err) {
    console.error("Vehicle movement error:", err);
    return res.status(500).json({
      status: "ERROR",
      message: "Vehicle entry/exit failed"
    });
  }
};
