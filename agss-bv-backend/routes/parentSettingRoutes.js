const express = require("express");
const router = express.Router();

const verifyParent = require("../middleware/verifyParent");
const {
  getParentProfile,
  verifyParentPassword,
  updateParentProfile
} = require("../controllers/parentSettingController");

router.get("/parent", verifyParent, getParentProfile);
router.post("/parent/verify-password", verifyParent, verifyParentPassword);
router.put("/parent", verifyParent, updateParentProfile);

module.exports = router;
