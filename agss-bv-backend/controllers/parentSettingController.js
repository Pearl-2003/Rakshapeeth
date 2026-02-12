const Parent = require("../models/Parent");
const bcrypt = require("bcryptjs");

/* ===================== GET PROFILE ===================== */
// GET /api/settings/parent
exports.getParentProfile = async (req, res) => {
  try {
    const parent = await Parent.findById(req.parent.mongoId)
      .select("-password");

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.json(parent);
  } catch (err) {
    console.error("Get parent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== VERIFY PASSWORD ===================== */
// POST /api/settings/parent/verify-password
exports.verifyParentPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const parent = await Parent.findById(req.parent.mongoId);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const isMatch = await bcrypt.compare(password, parent.password);
    res.json({ valid: isMatch });
  } catch (err) {
    console.error("Verify parent password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== UPDATE PROFILE ===================== */
// PUT /api/settings/parent
exports.updateParentProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    const updateData = { firstName, lastName, phone, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedParent = await Parent.findByIdAndUpdate(
      req.parent.mongoId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.json({
      message: password
        ? "Profile & password updated"
        : "Profile updated",
      parent: updatedParent
    });
  } catch (err) {
    console.error("Update parent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
