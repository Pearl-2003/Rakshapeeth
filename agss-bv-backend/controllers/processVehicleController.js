// controllers/processVehicleController.js
const { verifyVehicle } = require("./vehicleController");
const { handleVehicleMovement } = require("./vehicleMovementController");
const VehicleLog = require("../models/VehicleLog");
const normalizeVehicleNo = require("../utils/normalizeVehicleNo");

/**
 * SINGLE ENTRY POINT FOR VEHICLE PROCESSING
 * - EXIT check FIRST
 * - ENTRY verification only if not exiting
 */
exports.processVehicle = async (req, res) => {
  try {
    const { vehicleNo } = req.body;
    const normalizedVehicleNo = normalizeVehicleNo(vehicleNo);

    if (!normalizedVehicleNo) {
      return res.json({
        status: "MANUAL_REQUIRED",
        message: "Manual entry required (no vehicle detected)"
      });
    }

    /* 🔴 STEP-1: EXIT CHECK (ABSOLUTE PRIORITY) */
    const activeLog = await VehicleLog.findOne({
      vehicleNo: normalizedVehicleNo,
      status: "inside"
    });

    if (activeLog) {
      // EXIT must bypass verification completely
      return handleVehicleMovement(req, res);
    }

    /* 🟢 STEP-2: VERIFY VEHICLE (ENTRY ONLY) */
    let verificationResult;

    const fakeRes = {
      json: (data) => {
        verificationResult = data;
        return data;
      },
      status: function () {
        return this;
      }
    };

    await verifyVehicle(req, fakeRes);

    if (verificationResult.status !== "ALLOWED") {
      return res.json(verificationResult);
    }

    /* 🟢 STEP-3: ENTRY MOVEMENT */
    return handleVehicleMovement(
      {
        body: {
          vehicleNo,
          source: verificationResult.source, // WHITELIST | OCCASIONAL
          scanSource: req.body.scanSource,
          confidence: req.body.confidence
        }
      },
      res
    );

  } catch (err) {
    console.error("Process vehicle error:", err);
    return res.status(500).json({
      status: "ERROR",
      message: "Vehicle processing failed"
    });
  }
};
