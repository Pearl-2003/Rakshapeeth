const express = require("express");
const router = express.Router();

const Request = require("../models/Request");
const OccasionalVisitor = require("../models/OccasionalVisitor");
const adminAuth = require("../middleware/verifyAdmin");
const { sendWhatsApp } = require("../utils/sendNotification");

// 🔒 Apply adminAuth to ALL admin routes
router.use(adminAuth);

/* =========================================================
   🔵 GET ALL PENDING REQUESTS
   ========================================================= */
router.get("/requests/pending", async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" })
      .sort({ createdAt: -1 });

    return res.json({
      count: requests.length,
      requests
    });
  } catch (err) {
    console.error("Fetch pending error:", err);
    return res.status(500).json({
      message: "Failed to fetch requests"
    });
  }
});

/* =========================================================
   🟢 APPROVE REQUEST
   ========================================================= */
router.post("/requests/:id/approve", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    /* =======================
       🔧 FIX INVALID REQUEST DATA
       ======================= */

    // Request table ONLY supports "Other"
    request.reasonOfVisit = "Other";

    // otherReason MUST exist
    request.otherReason =
      request.otherReason && request.otherReason.trim().length > 0
        ? request.otherReason
        : "Approved by Admin";

    /* =======================
       📅 DATE VALIDATION
       ======================= */
    const parsedDate = new Date(request.dateOfVisit);
    if (isNaN(parsedDate)) {
      return res.status(400).json({
        message: "Invalid date format in request"
      });
    }

    /* =======================
       ➜ CREATE OCCASIONAL VISITOR
       ======================= */
    const occasionalVisitor = new OccasionalVisitor({
  visitorName: request.visitorName,
  noOfCompanions: request.numberOfPeople,
  vehicleNo: request.vehicleNumber,
  vehicleType: request.vehicleType,   // ⭐ NEW

  // ⭐ NEW (Public Transport)
  driverName: request.driverName,
  driverPhone: request.driverPhone,
  driverVehicleNumber: request.driverVehicleNumber,

  visitorType: request.type === "parent" ? "Parent" : "Non-Parent",
  reason: request.otherReason,
  phoneNumber: request.phoneNumber,
  dateOfVisit: parsedDate
});

    await occasionalVisitor.save();

    /* =======================
       ✅ UPDATE REQUEST STATUS
       ======================= */
    request.status = "approved";
    await request.save();

    /* =======================
       🔔 NOTIFICATION (SAFE)
       ======================= */
    const formattedPhone = request.phoneNumber.startsWith("+")
      ? request.phoneNumber
      : `+91${request.phoneNumber}`;

    const approveMessage =
      "AGSS-BV Update ✅\n\n" +
      "Hello " + request.visitorName + ",\n\n" +
      "Your visit request for " +
      parsedDate.toDateString() +
      " has been APPROVED.\n\n" +
      "Please carry a valid ID proof at the gate.\n\n" +
      "- AGSS-BV Security";

    try {
      sendWhatsApp(formattedPhone, approveMessage);
    } catch (notifyErr) {
      console.error("WhatsApp approve notify failed:", notifyErr.message);
    }

    return res.json({
      message: "Request approved and visitor added",
      occasionalVisitor
    });

  } catch (err) {
    console.error("Approve request error:", err);
    return res.status(500).json({
      message: "Approval failed"
    });
  }
});

/* =========================================================
   🔴 REJECT REQUEST
   ========================================================= */
router.post("/requests/:id/reject", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    /* 🔧 Normalize invalid legacy data before save */
    request.reasonOfVisit = "Other";
    request.otherReason =
      request.otherReason && request.otherReason.trim().length > 0
        ? request.otherReason
        : "Rejected by Admin";

    request.status = "rejected";
    await request.save();

    /* 🔔 NOTIFICATION */
    const formattedPhone = request.phoneNumber.startsWith("+")
      ? request.phoneNumber
      : `+91${request.phoneNumber}`;

    const rejectMessage =
      "AGSS-BV Update ❌\n\n" +
      "Hello " + request.visitorName + ",\n\n" +
      "Your visit request for " +
      new Date(request.dateOfVisit).toDateString() +
      " has been REJECTED.\n\n" +
      "For queries, please contact campus security.\n\n" +
      "- AGSS-BV Security";

    try {
      sendWhatsApp(formattedPhone, rejectMessage);
    } catch (notifyErr) {
      console.error("WhatsApp reject notify failed:", notifyErr.message);
    }

    return res.json({
      message: "Request rejected successfully"
    });

  } catch (err) {
    console.error("Reject request error:", err);
    return res.status(500).json({
      message: "Rejection failed"
    });
  }
});

module.exports = router;
