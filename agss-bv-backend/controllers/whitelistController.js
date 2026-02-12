// controllers/whitelistController.js
const Whitelist = require('../models/whitelist');
const Blacklist = require('../models/Blacklist');

exports.addToWhitelist = async (req, res) => {
  try {
    const {
      vehicleOwnerName,
      vehicleNo,
      type,
      referenceFacultyName,
      gender
    } = req.body;

    if (!vehicleNo || !vehicleOwnerName || !type || !gender) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const normalizedVehicleNo = vehicleNo.toUpperCase().trim();

    // 🚫 block if blacklisted
    const blacklisted = await Blacklist.findOne({
      vehicleNo: normalizedVehicleNo
    });
    if (blacklisted) {
      return res.status(403).json({
        success: false,
        message: "Vehicle is blacklisted. Remove from blacklist first."
      });
    }

    // 🚫 duplicate vehicle
    const vehicleExists = await Whitelist.findOne({
      vehicleNo: normalizedVehicleNo
    });
    if (vehicleExists) {
      return res.status(409).json({
        success: false,
        message: "This vehicle number is already whitelisted"
      });
    }

    // 🚫 duplicate person + type
    const personExists = await Whitelist.findOne({
      vehicleOwnerName,
      type
    });
    if (personExists) {
      return res.status(409).json({
        success: false,
        message: "This person is already whitelisted under the same type"
      });
    }

    // 🧠 staff family rules
    if (type === "staff family") {
      if (!referenceFacultyName) {
        return res.status(400).json({
          success: false,
          message: "Reference faculty/staff name is required for staff family"
        });
      }

      const referenceExists = await Whitelist.findOne({
        vehicleOwnerName: referenceFacultyName,
        type: { $in: ["faculty", "staff"] }
      });

      if (!referenceExists) {
        return res.status(400).json({
          success: false,
          message:
            "Referenced faculty/staff is not present in whitelist. Please whitelist them first."
        });
      }

      const familyDuplicate = await Whitelist.findOne({
        vehicleOwnerName,
        referenceFacultyName,
        type: "staff family"
      });

      if (familyDuplicate) {
        return res.status(409).json({
          success: false,
          message:
            "This staff family member is already linked to the given faculty/staff"
        });
      }
    }

    // ✅ CREATE ENTRY (THIS LINE CAUSED ERROR EARLIER)
    const whitelisted = await Whitelist.create({
      ...req.body,
      vehicleNo: normalizedVehicleNo
    });

    return res.status(201).json({
      success: true,
      whitelisted
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry detected"
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getWhitelist = async (req, res) => {
  try {
    const { type, gender, search } = req.query;

    const filter = {};

    // 🔹 Filter by type
    if (type) {
      filter.type = type;
    }

    // 🔹 Filter by gender
    if (gender) {
      filter.gender = gender;
    }

    // 🔹 Search by owner name / reference faculty / vehicle no
    if (search) {
      filter.$or = [
        { vehicleOwnerName: { $regex: search, $options: "i" } },
        { referenceFacultyName: { $regex: search, $options: "i" } },
        { vehicleNo: { $regex: search, $options: "i" } }
      ];
    }

    const whitelist = await Whitelist
      .find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: whitelist.length,
      data: whitelist
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const mongoose = require("mongoose");

exports.removeFromWhitelist = async (req, res) => {
  try {
    const { id } = req.params;

    // 🛑 invalid MongoDB id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid whitelist entry ID"
      });
    }

    const removed = await Whitelist.findByIdAndDelete(id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from whitelist successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
