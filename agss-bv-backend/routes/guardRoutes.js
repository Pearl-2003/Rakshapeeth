const express = require("express");
const router = express.Router();
const guardAdminController = require("../controllers/guardAdminController");

// GET all guards
router.get("/", guardAdminController.getAllGuards);

// ADD a new guard
router.post("/", guardAdminController.addGuard);

// UPDATE guard
router.put("/:id", guardAdminController.updateGuard);

// DELETE guard
router.delete("/:id", guardAdminController.removeGuard);

module.exports = router;