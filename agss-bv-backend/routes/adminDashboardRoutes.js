// routes/adminDashboardRoutes.js
const express = require("express");

const router = express.Router();

const Request = require("../models/Request");
const SecurityAlert = require("../models/SecurityAlert");
const VehicleAlert = require("../models/VehicleAlert");
   // adjust if model path differs

const adminAuth = require("../middleware/verifyAdmin");

// Protect route
router.use(adminAuth);

/* =========================================================
   🟢 GET DASHBOARD NOTIFICATIONS (TODAY ONLY)
   ========================================================= */
router.get("/dashboard/notifications", async (req, res) => {
  try {
    // IST date handling
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    /* ===============================
       1️⃣ TODAY PENDING REQUESTS
    =============================== */
    const requests = await Request.find({
      status: "pending",
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: -1 });

    const requestNotifications = requests.map(r => ({
      id: r._id,
      message: `New visit request from ${r.visitorName}`,
      time: r.createdAt
    }));

    /* ===============================
       2️⃣ TODAY SECURITY ALERTS
    =============================== */

    // If you have alert models, import correctly.
    // For now assuming you have collections named securityalerts & vehiclealerts.

    /* ===============================
   2️⃣ TODAY SECURITY ALERTS
================================ */

const securityAlerts = await SecurityAlert.find({
  createdAt: { $gte: today, $lt: tomorrow }
}).sort({ createdAt: -1 });

const vehicleAlerts = await VehicleAlert.find({
  createdAt: { $gte: today, $lt: tomorrow }
}).sort({ createdAt: -1 });

const alertNotifications = [
  ...securityAlerts.map(a => ({
    id: a._id,
    message: a.message || "Security alert detected",
    time: a.createdAt
  })),
  ...vehicleAlerts.map(v => ({
    id: v._id,
    message: v.reason || "Vehicle alert detected",
    time: v.createdAt
  }))
];

    return res.status(200).json({
      success: true,
      requestNotifications,
      alertNotifications
    });

  } catch (err) {
    console.error("Dashboard notification error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard notifications"
    });
  }
});

module.exports = router;