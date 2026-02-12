const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const adminController = require("../controllers/adminController");
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { adminId: admin._id }, 
      "AGSS_BV_SECRET_KEY", // we will move this later to .env
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token // ✅ frontend will store this in localStorage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Example PROTECTED route
router.get("/admin/dashboard", verifyAdmin, async (req, res) => {
  res.status(200).json({
    message: "Welcome Admin — Secure Dashboard Access ✅",
    adminId: req.adminId
  });
});
// ⚠️ TEMPORARY — ONLY FOR CHECKING
router.get("/admin/all", async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});

router.get(
  "/current-status",
  verifyAdmin,
  adminController.getCurrentStatus
);
module.exports = router;
