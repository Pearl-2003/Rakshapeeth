const GuardDutyLog = require("../models/GuardDutyLog");

/**
 * ===============================
 * GET LIVE (ON-DUTY) GUARDS
 * ===============================
 * logoutAt === null → ON DUTY
 */
exports.getLiveGuards = async (req, res) => {
  try {
    const liveGuards = await GuardDutyLog.find({
      logoutAt: null,
    })
      .populate("guard", "guardId firstName lastName phone")
      .sort({ loginAt: -1 });

    res.status(200).json({
      count: liveGuards.length,
      guards: liveGuards,
    });
  } catch (err) {
    console.error("Get live guards error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * ===============================
 * GET FULL DUTY HISTORY
 * ===============================
 */
exports.getDutyHistory = async (req, res) => {
  try {
    const history = await GuardDutyLog.find()
      .populate("guard", "guardId firstName lastName phone")
      .sort({ loginAt: -1 });

    res.status(200).json({
      count: history.length,
      history,
    });
  } catch (err) {
    console.error("Get duty history error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
