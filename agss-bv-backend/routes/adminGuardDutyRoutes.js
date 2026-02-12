const express = require("express");
const router = express.Router();

// Controller imports
const {
  getLiveGuards,
  getDutyHistory,
} = require("../controllers/adminGuardDutyController");

// 🔐 (Optional later)
// const verifyAdmin = require("../middleware/verifyAdmin");

/*
|--------------------------------------------------------------------------
| Admin Guard Duty Routes
|--------------------------------------------------------------------------
| These routes are READ-ONLY and used by Admin Dashboard
| Status is DERIVED from logoutAt
|--------------------------------------------------------------------------
*/

// 🔹 Get all currently ON-DUTY guards
// GET /api/admin/guard-duty/live
router.get(
  "/live",
  // verifyAdmin,   // enable later if needed
  getLiveGuards
);

// 🔹 Get complete guard duty history
// GET /api/admin/guard-duty/history
router.get(
  "/history",
  // verifyAdmin,
  getDutyHistory
);

module.exports = router;
