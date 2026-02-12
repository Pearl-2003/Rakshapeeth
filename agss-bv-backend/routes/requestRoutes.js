const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// =======================================================
// CREATE NEW VISITOR REQUEST (WITH DUPLICATE PREVENTION)
// =======================================================
router.post("/create", async (req, res) => {
  try {
    // ==============================
    // 1️⃣ NORMALIZE INPUT (SAFETY)
    // ==============================
    req.body.visitorName = req.body.visitorName?.trim();
    req.body.visitorIdProof = req.body.visitorIdProof?.trim();
    req.body.reasonOfVisit = req.body.reasonOfVisit?.trim();
    req.body.otherReason = req.body.otherReason?.trim();

    // ==============================
    // 2️⃣ DUPLICATE REQUEST CHECK
    // ==============================
    const query = {
      visitorName: req.body.visitorName,
      visitorIdProof: req.body.visitorIdProof,
      dateOfVisit: req.body.dateOfVisit,
      reasonOfVisit: req.body.reasonOfVisit
    };

    // Only include otherReason when reason is "Other"
    if (req.body.reasonOfVisit === "Other") {
      query.otherReason = req.body.otherReason;
    }

    const duplicateRequest = await Request.findOne(query);

    if (duplicateRequest) {
      return res.status(409).json({
        success: false,
        message: "Request already made for this date"
      });
    }

    // ==============================
    // 3️⃣ CLEAN DATA BEFORE SAVE
    // ==============================
    // If reason is NOT "Other", remove otherReason
    if (req.body.reasonOfVisit !== "Other") {
      req.body.otherReason = undefined;
    }

    // ==============================
    // 4️⃣ SAVE REQUEST
    // ==============================
    const request = new Request(req.body);
    await request.save();

    return res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      data: request
    });

  } catch (error) {
    console.error("❌ Request creation error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to submit request",
      error: error.message
    });
  }
});

module.exports = router;
