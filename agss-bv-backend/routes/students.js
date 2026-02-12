const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const OccasionalVisitor = require("../models/OccasionalVisitor");
const parentAuth = require("../middleware/verifyParent");

// helper
const normalize = (val) =>
  typeof val === "string" ? val.trim().toLowerCase() : "";

// POST /api/parent/visit-request
router.post("/visit-request", parentAuth, async (req, res) => {
  try {
    const { dateOfVisit, vehicleNo, noOfCompanions } = req.body;

    if (!dateOfVisit || noOfCompanions === undefined) {
      return res.status(400).json({
        message: "dateOfVisit and noOfCompanions are required"
      });
    }

    // 🔑 1️⃣ parentEmail JWT se aayega
    // Tumhara verifyParent middleware JWT payload me parentEmail daalta ho
    // Example: jwt.sign({ parentEmail: parent.email }, ...)
    const parentEmail = normalize(req.parentEmail);

    if (!parentEmail) {
      return res.status(401).json({
        message: "Parent email missing in token"
      });
    }

    // 🧑 2️⃣ DIRECT students collection read
    const student = await mongoose.connection
      .collection("students")
      .findOne({
        $or: [
          { fatherEmail: parentEmail },
          { motherEmail: parentEmail }
        ]
      });

    if (!student) {
      return res.status(404).json({
        message: "No student linked to this parent"
      });
    }

    // 👨‍👩‍👧 3️⃣ Decide father / mother
    const fatherEmail = normalize(student.fatherEmail);
    const motherEmail = normalize(student.motherEmail);

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
        message: "Parent email not linked to student record"
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        message: "No parent phone number available"
      });
    }

    // 🚪 4️⃣ Save Occasional Visitor
    const visit = new OccasionalVisitor({
      visitorName,
      visitorType: "Parent",
      phoneNumber,
      vehicleNo,
      noOfCompanions,
      dateOfVisit,
      reason: "Child Visit"
    });

    await visit.save();

    res.status(201).json({
      message: "Parent visit request submitted successfully",
      visit
    });

  } catch (err) {
    console.error("❌ Parent visit error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
