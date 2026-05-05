// routes/visitorRoutes.js
const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/dashboardGuardVisitorController.js");

// GET expected visitors for today
router.get("/expected-today", visitorController.getExpectedVisitorsToday);

module.exports = router;