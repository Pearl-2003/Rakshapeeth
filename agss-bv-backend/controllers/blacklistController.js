const Whitelist = require("../models/whitelist");
const Blacklist = require("../models/Blacklist");

/**
 * =====================================================
 * GET BLACKLIST
 * Supports:
 *  - search (vehicleNo / idProof.value / reason)
 *  - filter by idProof type
 *  - filter by date range
 * =====================================================
 */
const getBlacklist = async (req, res) => {
  try {
    const { search, idType, fromDate, toDate } = req.query;

    const filter = {};

    // 🔍 SEARCH: vehicle number / id proof value / reason
    if (search) {
      filter.$or = [
        { vehicleNo: { $regex: search, $options: "i" } },
        { "idProof.value": { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } }
      ];
    }

    // 🔽 FILTER: ID proof type
    if (idType) {
      filter["idProof.type"] = idType;
    }

    // 📅 FILTER: Date range
    if (fromDate || toDate) {
      filter.dateAdded = {};
      if (fromDate) {
        filter.dateAdded.$gte = new Date(fromDate);
      }
      if (toDate) {
        filter.dateAdded.$lte = new Date(toDate);
      }
    }

    const blacklist = await Blacklist.find(filter).sort({ dateAdded: -1 });

    return res.status(200).json({
      success: true,
      total: blacklist.length,
      data: blacklist
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * =====================================================
 * ADD TO BLACKLIST
 * - ADMIN OVERRIDE
 * - Removes from whitelist if exists
 * =====================================================
 */
const addToBlacklist = async (req, res) => {
  try {
    if (!req.body.vehicleNo) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number is required"
      });
    }

    const vehicleNo = req.body.vehicleNo.toUpperCase().trim();

    // 🚫 Remove from whitelist if exists
    await Whitelist.deleteOne({ vehicleNo });

    const blacklisted = await Blacklist.create({
      ...req.body,
      vehicleNo
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle blacklisted. Whitelist entry (if any) removed.",
      blacklisted
    });
  } catch (err) {
    // 🔁 Duplicate vehicleNo
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This vehicle is already blacklisted"
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({ error: err.message });
  }
};

/**
 * =====================================================
 * REMOVE FROM BLACKLIST
 * =====================================================
 */
const removeFromBlacklist = async (req, res) => {
  try {
    const removed = await Blacklist.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from blacklist"
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBlacklist,
  addToBlacklist,
  removeFromBlacklist
};
