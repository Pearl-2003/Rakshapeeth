// routes/blacklistRoutes.js
const express = require("express");
const router = express.Router();
const blacklistController = require("../controllers/blacklistController");

router.get("/", blacklistController.getBlacklist);
router.post("/", blacklistController.addToBlacklist);
router.delete("/:id", blacklistController.removeFromBlacklist);

module.exports = router;