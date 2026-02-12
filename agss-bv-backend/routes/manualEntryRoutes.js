const express = require("express");
const router = express.Router();

const { createManualEntry } = require("../controllers/manualEntryController");
const authMiddleware = require("../middleware/authGuard");

router.post(
  "/",
  authMiddleware,          // 🔒 guard must be logged in
  createManualEntry
);

module.exports = router;
