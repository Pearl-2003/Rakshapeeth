// routes/dashBoardAdminVehicleCountRoutes.js
const express = require("express");
const router = express.Router();
const { getTodayEntries } = require("../controllers/dashboardAdminVehicleCount");

// GET /api/dashboard/today-entries
router.get("/today-entries", getTodayEntries);

module.exports = router;