const express = require("express");
const router = express.Router();

const OccasionalVisitor = require("../models/OccasionalVisitor");
const adminAuth = require("../middleware/verifyAdmin");

// 🔒 Admin-only
router.use(adminAuth);

/* =========================================================
   🔵 GET ALL OCCASIONAL VISITORS
   ========================================================= */
router.get("/occasional-visitors", async (req, res) => {
  try {
    const visitors = await OccasionalVisitor.find()
      .sort({ createdAt: -1 });

    res.json({
      count: visitors.length,
      visitors
    });
  } catch (err) {
    console.error("Fetch visitors error:", err);
    res.status(500).json({
      message: "Failed to fetch visitors"
    });
  }
});

/* =========================================================
   🟢 ADD OCCASIONAL VISITOR (ADMIN)
   ========================================================= */
router.post("/occasional-visitors", async (req, res) => {
  try {
    const {
  visitorName,
  noOfCompanions,
  vehicleNo,
  vehicleType,   // ⭐ NEW
  driverName,    // ⭐ NEW
  driverPhone,   // ⭐ NEW
  driverVehicleNumber, // ⭐ NEW
  visitorType,
  reason,
  phoneNumber,
  dateOfVisit
} = req.body;

    if (
      !visitorName ||
      noOfCompanions === undefined ||
      !visitorType ||
      !reason ||
      !phoneNumber ||
      !dateOfVisit
    ) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    const visitor = new OccasionalVisitor({
  visitorName,
  noOfCompanions,
  vehicleNo,
  vehicleType,   // ⭐ NEW
  driverName,
  driverPhone,
  driverVehicleNumber,
  visitorType,
  reason,
  phoneNumber,
  dateOfVisit: new Date(dateOfVisit)
});

    await visitor.save();

    res.status(201).json({
      message: "Occasional visitor added successfully",
      visitor
    });

  } catch (err) {
    console.error("Add visitor error:", err);
    res.status(500).json({
      message: "Failed to add visitor"
    });
  }
});

/* =========================================================
   🔴 DELETE OCCASIONAL VISITOR
   ========================================================= */
router.delete("/occasional-visitors/:id", async (req, res) => {
  try {
    const deleted = await OccasionalVisitor.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    res.json({
      message: "Occasional visitor deleted successfully"
    });

  } catch (err) {
    console.error("Delete visitor error:", err);
    res.status(500).json({
      message: "Failed to delete visitor"
    });
  }
});

module.exports = router;
