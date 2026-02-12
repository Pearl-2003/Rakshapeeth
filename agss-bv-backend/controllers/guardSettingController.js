// controllers/guardSettingController.js
const Guard = require("../models/Guard");
const bcrypt = require("bcryptjs");


// ✅ 1. GET LOGGED-IN GUARD PROFILE
// GET /api/settings/guard
exports.getGuardProfile = async (req, res) => {
  try {
    const guard = await Guard.findById(req.guard.mongoId).select("-password");

    if (!guard) {
      return res.status(404).json({ message: "Guard not found" });
    }

    res.status(200).json(guard);
  } catch (err) {
    console.error("Get guard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ 2. VERIFY GUARD PASSWORD
// POST /api/settings/guard/verify-password
exports.verifyGuardPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const guard = await Guard.findById(req.guard.mongoId);
    if (!guard) {
      return res.status(404).json({ message: "Guard not found" });
    }

    const isMatch = await bcrypt.compare(password, guard.password);
    res.status(200).json({ valid: isMatch });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ 3. UPDATE GUARD PROFILE + OPTIONAL PASSWORD CHANGE
// PUT /api/settings/guard
exports.updateGuardProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    const updateData = { firstName, lastName, phone, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedGuard = await Guard.findByIdAndUpdate(
      req.guard.mongoId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedGuard) {
      return res.status(404).json({ message: "Guard not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      guard: updatedGuard
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
