//routes/adminActivityRoutes.js
const express = require("express");
const router = express.Router();

const StudentLog = require("../models/StudentLog");
const StudentLogHistory = require("../models/StudentLogHistory");
const VehicleLog = require("../models/VehicleLog");
const SecurityAlert = require("../models/SecurityAlert");
const VehicleAlert = require("../models/VehicleAlert");

const adminAuth = require("../middleware/verifyAdmin");

router.use(adminAuth);

/* =========================================================
   📊 LAST 24 HOURS ROLLING CAMPUS ACTIVITY
========================================================= */
router.get("/dashboard/activity", async (req, res) => {
  try {
    const now = new Date(); // UTC internally
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const buckets = [];

    for (let i = 23; i >= 0; i--) {
      const start = new Date(now.getTime() - i * 60 * 60 * 1000);
      start.setMinutes(0, 0, 0);

      const end = new Date(start.getTime() + 60 * 60 * 1000);

      buckets.push({
        label: start.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata"
        }),
        start,
        end,
        students: 0,
        vehicles: 0,
        alerts: 0
      });
    }

    const [
      studentLogs,
      studentHistory,
      vehicleLogs,
      securityAlerts,
      vehicleAlerts
    ] = await Promise.all([
      StudentLog.find({ createdAt: { $gte: startTime } }).lean(),
      StudentLogHistory.find({ createdAt: { $gte: startTime } }).lean(),
      VehicleLog.find({ entryTime: { $gte: startTime } }).lean(),
      SecurityAlert.find({ createdAt: { $gte: startTime } }).lean(),
      VehicleAlert.find({ createdAt: { $gte: startTime } }).lean()
    ]);

    const allStudents = [...studentLogs, ...studentHistory];

    // STUDENTS
    allStudents.forEach(log => {
      const time = new Date(log.createdAt);
      buckets.forEach(bucket => {
        if (time >= bucket.start && time < bucket.end) {
          bucket.students++;
        }
      });
    });

    // VEHICLES
    vehicleLogs.forEach(log => {
      const time = new Date(log.entryTime);
      buckets.forEach(bucket => {
        if (time >= bucket.start && time < bucket.end) {
          bucket.vehicles++;
        }
      });
    });

    // ALERTS
    [...securityAlerts, ...vehicleAlerts].forEach(alert => {
      const time = new Date(alert.createdAt);
      buckets.forEach(bucket => {
        if (time >= bucket.start && time < bucket.end) {
          bucket.alerts++;
        }
      });
    });

    return res.json({
      success: true,
      data: buckets.map(b => ({
        hour: b.label,
        students: b.students,
        vehicles: b.vehicles,
        alerts: b.alerts
      }))
    });

  } catch (err) {
    console.error("Activity dashboard error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity"
    });
  }
});


module.exports = router;