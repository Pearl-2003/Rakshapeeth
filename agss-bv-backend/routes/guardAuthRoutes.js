const express = require("express");
const router = express.Router();

const {
  loginGuard,
  logoutGuard
} = require("../controllers/guardLoginControllers");

// LOGIN
router.post("/login", loginGuard);

// LOGOUT  ✅ THIS WAS MISSING
router.post("/logout", logoutGuard);

module.exports = router;
