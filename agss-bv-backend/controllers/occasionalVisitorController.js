const OccasionalVisitor = require("../models/OccasionalVisitor");

/**
 * =====================================================
 * GET OCCASIONAL VISITORS
 * Supports:
 *  - search (name / phone / vehicle / reason)
 *  - filter by visitorType
 *  - filter by date range
 *  - filter by vehicle presence
 *  - filter by companions count
 * =====================================================
 */
const getOccasionalVisitors = async (req, res) => {
  try {
    const {
      search,
      visitorType,
      fromDate,
      toDate,
      hasVehicle,
      companions
    } = req.query;

    const filter = {};

    /* 🔍 SEARCH */
    if (search) {
      filter.$or = [
        { visitorName: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { vehicleNo: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } }
      ];
    }

    /* 🔽 VISITOR TYPE FILTER */
    if (visitorType) {
      filter.visitorType = visitorType;
    }

    /* 🚗 VEHICLE PRESENCE FILTER */
    if (hasVehicle === "yes") {
      filter.vehicleNo = { $exists: true, $ne: "" };
    }
    if (hasVehicle === "no") {
      filter.$or = [
        { vehicleNo: { $exists: false } },
        { vehicleNo: "" }
      ];
    }

    /* 👨‍👩‍👧 COMPANIONS FILTER */
    if (companions === "solo") {
      filter.noOfCompanions = 0;
    }
    if (companions === "group") {
      filter.noOfCompanions = { $gte: 1 };
    }

    /* 📅 DATE RANGE FILTER */
    if (fromDate || toDate) {
      filter.dateOfVisit = {};
      if (fromDate) filter.dateOfVisit.$gte = new Date(fromDate);
      if (toDate) filter.dateOfVisit.$lte = new Date(toDate);
    }

    const visitors = await OccasionalVisitor
      .find(filter)
      .sort({ dateOfVisit: -1 });

    return res.status(200).json({
      success: true,
      total: visitors.length,
      data: visitors
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * =====================================================
 * DELETE OCCASIONAL VISITOR
 * =====================================================
 */
const deleteOccasionalVisitor = async (req, res) => {
  try {
    const removed = await OccasionalVisitor.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Visitor entry not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Occasional visitor removed successfully"
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOccasionalVisitors,
  deleteOccasionalVisitor
};
