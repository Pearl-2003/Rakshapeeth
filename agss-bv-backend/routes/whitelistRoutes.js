// routes/whitelistRoutes.js
const express = require("express");
const router = express.Router();

const whitelistController = require("../controllers/whitelistController");

// ✅ GET all whitelist entries
router.get("/", whitelistController.getWhitelist);

// ✅ POST add to whitelist
router.post("/", whitelistController.addToWhitelist);

router.delete("/:id", whitelistController.removeFromWhitelist);

module.exports = router;