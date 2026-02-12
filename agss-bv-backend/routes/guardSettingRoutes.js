// routes/guardSettingRoutes.js
const express = require("express");
const router = express.Router();

const authGuard = require("../middleware/authGuard");
const {
  getGuardProfile,
  verifyGuardPassword,
  updateGuardProfile
} = require("../controllers/guardSettingController");

// 🔐 ALL ROUTES PROTECTED
router.get("/guard", authGuard, getGuardProfile);
router.post("/guard/verify-password", authGuard, verifyGuardPassword);
router.put("/guard", authGuard, updateGuardProfile);


module.exports = router;
