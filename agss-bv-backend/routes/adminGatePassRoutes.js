const express = require("express");
const router = express.Router();

const {
  getActiveGatePasses
} = require("../controllers/adminGatePassController");

// Admin – active gatepasses only
router.get("/active-gatepasses", getActiveGatePasses);

module.exports = router;
