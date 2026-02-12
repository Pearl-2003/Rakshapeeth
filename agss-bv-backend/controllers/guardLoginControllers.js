// controllers/guardLoginControllers.js
const Guard = require("../models/Guard");
const GuardDutyLog = require("../models/GuardDutyLog");
const bcrypt = require("bcryptjs");

// ✅ ADD THIS IMPORT
const jwt = require("jsonwebtoken");

/* ===================== LOGIN ===================== */
exports.loginGuard = async (req, res) => {
  try {
    const { guardId, password } = req.body;

    if (!guardId || !password) {
      return res.status(400).json({
        msg: "Guard ID and password are required",
      });
    }

    // 1️⃣ Find guard
    const guard = await Guard.findOne({ guardId });
    if (!guard) {
      return res.status(404).json({ msg: "Guard not found" });
    }

    // 2️⃣ Verify password
    const isMatch = await bcrypt.compare(password, guard.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // 3️⃣ Check active duty
    const activeDuty = await GuardDutyLog.findOne({
      guard: guard._id,
      logoutAt: null,
    });

    if (activeDuty) {
      return res.status(409).json({
        msg: "Guard already on duty. Logout first.",
      });
    }

    // 4️⃣ Create duty log
    const dutyLog = await GuardDutyLog.create({
      guard: guard._id,
      loginAt: new Date(),
    });

    // ✅ ADD TOKEN GENERATION (NO LOGIC CHANGE)
    // controllers/guardLoginControllers.js
const token = jwt.sign(
  {
    guardMongoId: guard._id,   // ✅ explicit & clear
    role: "guard"
  },
  process.env.JWT_SECRET || "AGSS_BV_SECRET_KEY",
  { expiresIn: "12h" }
);
console.log("TOKEN:", token);

    // ✅ ADD token in response
    res.status(200).json({
      msg: "Guard logged in and duty started",
      token,
      dutyLog,
    });
  } catch (err) {
    console.error("Guard login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ===================== LOGOUT ===================== */
exports.logoutGuard = async (req, res) => {
  try {
    const { guardId } = req.body;

    if (!guardId) {
      return res.status(400).json({
        msg: "Guard ID is required for logout",
      });
    }

    // 1️⃣ Find guard
    const guard = await Guard.findOne({ guardId });
    if (!guard) {
      return res.status(404).json({ msg: "Guard not found" });
    }

    // 2️⃣ Find active duty for THIS guard
    const activeDuty = await GuardDutyLog.findOne({
      guard: guard._id,
      logoutAt: null,
    });

    if (!activeDuty) {
      return res.status(404).json({
        msg: "No active duty session found for this guard",
      });
    }

    // 3️⃣ Close duty
    activeDuty.logoutAt = new Date();
    activeDuty.closedBy = "guard";
    await activeDuty.save();

    res.status(200).json({
      msg: "Guard logged out successfully",
      dutyLog: activeDuty,
    });
  } catch (err) {
    console.error("Guard logout error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
