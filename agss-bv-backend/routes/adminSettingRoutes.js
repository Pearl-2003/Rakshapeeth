const express = require("express");
const router = express.Router();

const verifyAdmin = require("../middleware/verifyAdmin");
const {
  getAdminProfile,
  verifyAdminPassword,
  updateAdminProfile
} = require("../controllers/adminSettingController");

// 🔐 Protected routes
router.get("/admin", verifyAdmin, getAdminProfile);
router.post("/admin/verify-password", verifyAdmin, verifyAdminPassword);
router.put("/admin", verifyAdmin, updateAdminProfile);

module.exports = router;
