const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");


// ✅ 1. GET LOGGED-IN ADMIN PROFILE
// GET /api/settings/admin
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (err) {
    console.error("Get admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ 2. VERIFY ADMIN PASSWORD
// POST /api/settings/admin/verify-password
exports.verifyAdminPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    res.status(200).json({ valid: isMatch });
  } catch (err) {
    console.error("Verify password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ 3. UPDATE ADMIN PROFILE + OPTIONAL PASSWORD CHANGE
// PUT /api/settings/admin
exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const updateData = { name, email, phone };

    // 🔐 If password is provided, hash & update it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.adminId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: password
        ? "Profile & password updated successfully"
        : "Profile updated successfully",
      admin: updatedAdmin
    });
  } catch (err) {
    console.error("Update admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
