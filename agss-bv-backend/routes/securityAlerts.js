const express = require("express");
const SecurityAlert = require("../models/SecurityAlert");
const upload = require("../middleware/uploadAlertImage");

const router = express.Router();

/**
 * 🔴 Guard → Admin (Create Alert)
 */
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        studentId,
        studentName,
        alertType,
        reason,
        guardNote,
        guardId,
        guardName,
        gateId,
        gateName
      } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Image required" });
      }

      const severity =
        reason.toLowerCase().includes("iris")
          ? "HIGH"
          : reason.toLowerCase().includes("gatepass")
          ? "MEDIUM"
          : "LOW";

      const alert = await SecurityAlert.create({
        studentId,
        studentName,
        alertType,
        reason,
        severity,
        guardNote,
        evidenceImageUrl: `/uploads/security-alerts/${req.file.filename}`,
        raisedBy: { guardId, guardName },
        gate: { gateId, gateName }
      });

      res.status(201).json({
        success: true,
        alert
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * 🧑‍💼 Admin – Get alerts
 */
router.get("/", async (req, res) => {
  try {
    const alerts = await SecurityAlert.find()
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🧑‍💼 Admin decision
 */
router.post("/:id/action", async (req, res) => {
  const { decision, reason, adminId, adminName } = req.body;

  const alert = await SecurityAlert.findById(req.params.id);

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
});
router.get("/notifications/guard/:guardId", async (req, res) => {
  try {
    const alerts = await SecurityAlert.find({
      "raisedBy.guardId": req.params.guardId,
      "guardNotification.status": "UNSEEN"
    }).sort({ updatedAt: -1 });

    const notifications = alerts.map(a => ({
      id: a._id,
      studentId: a.studentId,
      alertType: a.alertType,
      message: a.guardNotification.message,
      createdAt: a.updatedAt
    }));

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});
router.post("/notifications/:id/seen", async (req, res) => {
  try {
    const alert = await SecurityAlert.findById(req.params.id);

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
