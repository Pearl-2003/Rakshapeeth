const Guard = require("../models/Guard");
const bcrypt = require("bcryptjs");

/**
 * ================================
 * GET ALL GUARDS
 * ================================
 * (Later we’ll extend this for search)
 */
exports.getAllGuards = async (req, res) => {
  try {
    const { search, gender } = req.query;

    let query = {};

    // 🔍 Search by guardId, name, or phone
    if (search) {
      query.$or = [
        { guardId: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    // 🚻 Gender filter
    if (gender) {
      query.gender = gender;
    }

    const guards = await Guard.find(query).sort({ createdAt: -1 });

    res.status(200).json(guards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


/**
 * ================================
 * ADD NEW GUARD
 * ================================
 */
exports.addGuard = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      phone,
      email,
      password,
      status,
      guardId
    } = req.body;

    // 🔴 Required field validation
    if (!firstName || !lastName || !gender || !phone || !password) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // 🔴 Gender validation
    const allowedGenders = ["Male", "Female", "Other"];
    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({ msg: "Invalid gender value" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const guard = new Guard({
      firstName,
      lastName,
      gender,
      phone,
      email: email || null,
      password: hashedPassword,
      status: status || "free",
      guardId
    });

    await guard.save();

    res.status(201).json({
      msg: "Guard added successfully",
      guard
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * ================================
 * UPDATE GUARD
 * ================================
 */
exports.updateGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // 🔐 Hash password if updating
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // 🔴 Validate gender if updated
    if (updateData.gender) {
      const allowedGenders = ["Male", "Female", "Other"];
      if (!allowedGenders.includes(updateData.gender)) {
        return res.status(400).json({ msg: "Invalid gender value" });
      }
    }

    const guard = await Guard.findByIdAndUpdate(id, updateData, { new: true });
    if (!guard) {
      return res.status(404).json({ msg: "Guard not found" });
    }

    res.status(200).json({
      msg: "Guard updated successfully",
      guard
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * ================================
 * DELETE GUARD
 * ================================
 */
exports.removeGuard = async (req, res) => {
  try {
    const { id } = req.params;

    const guard = await Guard.findByIdAndDelete(id);
    if (!guard) {
      return res.status(404).json({ msg: "Guard not found" });
    }

    res.status(200).json({ msg: "Guard removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
