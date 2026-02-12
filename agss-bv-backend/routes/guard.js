// routes/guard.js
const express = require("express");
const router = express.Router();

const { registerGuard } = require("../controllers/guardController");
const { loginGuard } = require("../controllers/guardLoginControllers");

// Register Guard
router.post("/register", registerGuard);

// Login Guard
router.post("/login", loginGuard);

module.exports = router;