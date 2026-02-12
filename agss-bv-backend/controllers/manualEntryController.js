const ManualEntry = require("../models/ManualEntry");
const { handleVehicleMovement } = require("./vehicleMovementController");
const normalizeVehicleNo = require("../utils/normalizeVehicleNo");
const Guard = require("../models/Guard");

exports.createManualEntry = async (req, res) => {
  try {
    // 🔑 logged-in guard mongo _id (from authGuard – DO NOT TOUCH)
    const guardMongoId = req.guard.mongoId;

    const {
      name,
      phoneNo,
      vehicleNo,
      idProof,
      idProofNumber,
      reasonOfVisit,
      otherReason
    } = req.body;

    const normalizedVehicleNo = vehicleNo
      ? normalizeVehicleNo(vehicleNo)
      : null;

    /* 🔑 STEP-0: FETCH GUARD GID (IMPORTANT FIX) */
    const guard = await Guard.findById(guardMongoId);

    if (!guard) {
      return res.status(404).json({
        status: "ERROR",
        message: "Guard not found"
      });
    }

    const guardGID = guard.guardId; // ✅ GIDxxx

    /* 1️⃣ SAVE MANUAL ENTRY */
    const manualEntry = await ManualEntry.create({
      name,
      phoneNo,
      vehicleNo: normalizedVehicleNo,
      idProof,
      idProofNumber,
      reasonOfVisit,
      otherReason,
      guardId: guardGID        // ✅ STORE GID INSTEAD OF MONGO _id
    });

    /* 2️⃣ IF VEHICLE EXISTS → CREATE ENTRY */
    if (normalizedVehicleNo) {
      return handleVehicleMovement(
        {
          body: {
            vehicleNo: normalizedVehicleNo,
            source: "MANUAL",
            scanSource: "MANUAL",
            confidence: null
          }
        },
        res
      );
    }

    /* 3️⃣ WALKING VISITOR */
    return res.json({
      status: "MANUAL_ENTRY_SUCCESS",
      message: "Manual entry recorded for walking visitor",
      data: manualEntry
    });

  } catch (err) {
    console.error("Manual entry error:", err);
    return res.status(500).json({
      status: "ERROR",
      message: "Manual entry failed"
    });
  }
};
