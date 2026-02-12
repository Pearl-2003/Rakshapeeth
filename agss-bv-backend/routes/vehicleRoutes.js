// routes/vehicleRoutes.js
const express = require("express");
const router = express.Router();

const { verifyVehicle } = require("../controllers/vehicleController");

/*
  @route   POST /api/vehicle/verify
  @desc    Verify vehicle (whitelist / blacklist / occasional / manual)
  @access  Guard / ANPR service
*/
router.post("/verify", verifyVehicle);
const { handleVehicleMovement } = require("../controllers/vehicleMovementController");

router.post("/move", handleVehicleMovement);
const { processVehicle } = require("../controllers/processVehicleController");

router.post("/process", processVehicle);


module.exports = router;
