// routes/vehicleLogs.routes.js
const express = require("express");

const router = express.Router();
const { fetchVehicleLogs } = require("../controllers/vehicleLogsController");

router.get("/vehicle-logs", fetchVehicleLogs);

module.exports = router;
