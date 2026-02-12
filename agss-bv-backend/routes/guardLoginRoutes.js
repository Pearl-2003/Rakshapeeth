// routes/guardLoginRoutes.js
const express = require("express");
const router = express.Router();
const {
  loginGuard,
  logoutGuard,
} = require("../controllers/guardLoginControllers");

router.post("/login", loginGuard);
router.post("/logout", logoutGuard);

module.exports = router;
