const express = require("express");
const router = express.Router();
const OccasionalVisitor = require("../models/OccasionalVisitor");
const { sendWhatsApp, sendSMS } = require("../utils/sendNotification");
const {
  getOccasionalVisitors,
  deleteOccasionalVisitor
} = require("../controllers/occasionalVisitorController");


router.post("/", async (req, res) => {
  try {
    const {
      visitorName,
      noOfCompanions,
      vehicleNo,
      visitorType,
      reason,
      phoneNumber,
      dateOfVisit
    } = req.body;

    // 🔐 BASIC VALIDATION
    if (
      !visitorName ||
      noOfCompanions === undefined ||
      !visitorType ||
      !reason ||
      !phoneNumber ||
      !dateOfVisit
    ) {
      return res.status(400).json({
        message: "Please provide all required fields."
      });
    }

    // 🔍 DUPLICATE OCCASIONAL VISITOR CHECK (DATE-SAFE)
    const visitDate = new Date(dateOfVisit);

    const startOfDay = new Date(visitDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(visitDate);
    endOfDay.setHours(23, 59, 59, 999);

    const duplicateVisit = await OccasionalVisitor.findOne({
      visitorName,
      vehicleNo: vehicleNo ? vehicleNo.toUpperCase() : undefined,
      reason,
      dateOfVisit: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (duplicateVisit) {
      return res.status(409).json({
        message: "Occasional visit already registered for this date"
      });
    }

    // 💾 SAVE OCCASIONAL VISITOR
    const newVisitor = new OccasionalVisitor({
      visitorName,
      noOfCompanions,
      vehicleNo: vehicleNo ? vehicleNo.toUpperCase() : undefined,
      visitorType,
      reason,
      phoneNumber,
      dateOfVisit
    });

    await newVisitor.save();

    // 🔔 REAL-TIME NOTIFICATION (AFTER SAVE ✅)
    if (phoneNumber) {
      const formattedPhone = `+91${phoneNumber}`;

      const message = `
AGSS-BV Update 👋

Your pre-visit request has been accepted successfully.

👤 Visitor: ${visitorName}
📅 Date: ${visitDate.toDateString()}
📌 Status: Approved

Have a safe visit to our campus!!.
`;

      // Fire-and-forget (do NOT block API)
      sendWhatsApp(formattedPhone, message);
      sendSMS(formattedPhone, message);
      // ✅ NEW: TextBelt SMS (demo-safe, no sandbox)
     
    }

    // ✅ RESPONSE
    return res.status(201).json({
      message: "Occasional visitor added & notification sent ✅",
      visitor: newVisitor
    });

  } catch (error) {
    console.error("OccasionalVisitor error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

router.get("/", getOccasionalVisitors);

// ❌ DELETE occasional visitor by ID
router.delete("/:id", deleteOccasionalVisitor);

module.exports = router;
