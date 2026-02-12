const express = require("express");
const VehicleAlert = require("../models/VehicleAlert");

const router = express.Router();

/**
 * 🚨 Guard → Admin (Create Vehicle Alert)
 */
router.post("/", async (req, res) => {
  try {
    const {
      vehicleNo,
      alertType,        // BLACKLISTED | MANUAL_REQUIRED
      reason,
      guardId,
      gateId,
      gateName
    } = req.body;

    if (!vehicleNo || !alertType || !reason || !guardId) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const severity =
      alertType === "BLACKLISTED"
        ? "HIGH"
        : "MEDIUM";

    const alert = await VehicleAlert.create({
      vehicleNo,
      alertType,
      reason,
      severity,
      raisedBy: { guardId },
      gate: { gateId, gateName }
    });

    res.status(201).json({
      success: true,
      alert
    });
  } catch (err) {
    console.error("Vehicle alert error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🧑‍💼 Admin – Get all vehicle alerts
 */
router.get("/", async (req, res) => {
  try {
    const alerts = await VehicleAlert.find()
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🧑‍💼 Admin decision → Guard notification
 */
router.post("/:id/action", async (req, res) => {
  try {
    const { decision, reason, adminId, adminName } = req.body;

    const alert = await VehicleAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.status = decision;
    alert.adminAction = {
      adminId,
      adminName,
      decision,
      reason,
      actionAt: new Date()
    };

    alert.guardNotification = {
      message: reason || `Admin marked alert as ${decision}`,
      status: "UNSEEN"
    };

    await alert.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🔔 Guard – Fetch unseen notifications
 */
router.get("/notifications/guard/:guardId", async (req, res) => {
  try {
    const alerts = await VehicleAlert.find({
      "raisedBy.guardId": req.params.guardId,
      "guardNotification.status": "UNSEEN"
    }).sort({ updatedAt: -1 });

    const notifications = alerts.map(a => ({
      id: a._id,
      vehicleNo: a.vehicleNo,
      alertType: a.alertType,
      message: a.guardNotification.message,
      createdAt: a.updatedAt
    }));

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

/**
 * ✅ Guard – Mark notification as seen
 */
router.post("/notifications/:id/seen", async (req, res) => {
  try {
    const alert = await VehicleAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    alert.guardNotification.status = "SEEN";
    alert.guardNotification.seenAt = new Date();

    await alert.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
  }
});

module.exports = router;
