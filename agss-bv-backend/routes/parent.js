// routes/parent.js
const express = require('express');
const router = express.Router();
const { registerParent, loginParent } = require('../controllers/parentController');
const verifyParent = require("../middleware/verifyParent");
const parentController = require("../controllers/parentController");

// POST /api/parents/register
router.post('/register', registerParent);

// POST /api/parents/login
router.post('/login', loginParent);

// STEP-1: Get children list
router.get("/children", verifyParent, parentController.getChildren);
// STEP-2: Get children with current status
router.get(
  "/children/status",
  verifyParent,
  parentController.getChildrenWithStatus
);
// STEP-3: Get full entry–exit history of one child
router.get(
  "/history/:studentId",
  verifyParent,
  parentController.getChildHistory
);

module.exports = router;
