const express = require("express");
const router = express.Router();

const {
  getTodayVisitorsForGuard,
} = require("../controllers/guardVisitorController");

// Guard view – TODAY'S visitors only
router.get("/today-visitors", getTodayVisitorsForGuard);

module.exports = router;
