//feedbackRoutes.js
const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackControllers");

router.post("/submit", feedbackController.submitFeedback);

module.exports = router;