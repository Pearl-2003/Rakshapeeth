// routes/parentVisit.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const OccasionalVisitor = require("../models/OccasionalVisitor");
const parentAuth = require("../middleware/verifyParent");
const { sendWhatsApp } = require("../utils/sendNotification");

// 🔹 utility
const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

// POST /api/parent/visit-request
router.post("/visit-request", parentAuth, async (req, res) => {
  try {
    const { dateOfVisit, vehicleNo, noOfCompanions } = req.body;

    if (!dateOfVisit || noOfCompanions === undefined) {
      return res.status(400).json({
        message: "dateOfVisit and noOfCompanions are required",
      });
    }

    // 🔑 Parent email from JWT
    const parentEmail = normalizeEmail(req.parentEmail);
    if (!parentEmail) {
      return res.status(401).json({ message: "Parent email missing in token" });
    }

    // 🧑 Fetch student
    const student = await mongoose.connection
      .collection("students")
      .findOne({
        $or: [{ fatherEmail: parentEmail }, { motherEmail: parentEmail }],
      });

    if (!student) {
      return res.status(404).json({
        message: "No student linked to this parent",
      });
    }

    // 👨‍👩‍👧 Resolve parent role
    const fatherEmail = normalizeEmail(student.fatherEmail);
    const motherEmail = normalizeEmail(student.motherEmail);

    let visitorName;
    let phoneNumber;

    if (fatherEmail === parentEmail) {
      visitorName = student.fatherName;
      phoneNumber = student.fatherPhone || student.motherPhone;
    } else if (motherEmail === parentEmail) {
      visitorName = student.motherName;
      phoneNumber = student.motherPhone || student.fatherPhone;
    } else {
      return res.status(400).json({
        message: "Parent email not linked to student record",
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        message: "No parent phone number available",
      });
    }

    // 📅 DATE NORMALIZATION (⭐ CORRECT PLACE)
    const visitDate = new Date(dateOfVisit);

    const startOfDay = new Date(visitDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(visitDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 🚫 DUPLICATE CHECK (FIXED)
    const existingRequest = await OccasionalVisitor.findOne({
      visitorType: "Parent",
      phoneNumber,
      dateOfVisit: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "Visit request already made for this date",
      });
    }

    // ✅ SAVE VISIT
    const visit = new OccasionalVisitor({
      visitorName,
      visitorType: "Parent",
      phoneNumber,
      vehicleNo,
      noOfCompanions,
      dateOfVisit: visitDate,
      reason: "Child Visit",
    });

    await visit.save();

    // 🔔 NOTIFICATION
    const message =
      "AGSS-BV Visit Request Confirmed ✅\n\n" +
      "Hello " + visitorName + ",\n\n" +
      "Your visit request for " + visitDate.toDateString() + " has been successfully submitted.\n\n" +
      "Vehicle No: " + (vehicleNo || "N/A") + "\n" +
      "Companions: " + noOfCompanions + "\n\n" +
      "You will be notified once the request is approved.\n\n" +
      "- AGSS-BV Security";

    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber}`;

    sendWhatsApp(formattedPhone, message);

    return res.status(201).json({
      message: "Parent visit request submitted successfully",
      visit,
    });

  } catch (err) {
    console.error("❌ Parent visit error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
