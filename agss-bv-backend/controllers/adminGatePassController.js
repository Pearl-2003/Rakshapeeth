const GatePass = require("../models/GatePass");

// ----------------------------------------
// GET ONLY ACTIVE GATEPASSES (ADMIN VIEW)
// ----------------------------------------
exports.getActiveGatePasses = async (req, res) => {
  try {
    const { search, studentId, date } = req.query;

    // 📅 Today in YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    let query = {
      status: "ACTIVE",
      expectedExitDate: { $gte: today }
    };

    // 🔍 Search (studentId or studentName)
    if (search) {
      query.$or = [
        { studentId: { $regex: search, $options: "i" } },
        { studentName: { $regex: search, $options: "i" } }
      ];
    }

    // 🎓 Exact studentId filter
    if (studentId) {
      query.studentId = studentId;
    }

    // 📆 Filter by specific exit date (optional)
    if (date) {
      query.expectedExitDate = date;
    }

    const gatepasses = await GatePass
      .find(query)
      .sort({ expectedExitDate: 1, expectedExitTime: 1 });

    res.status(200).json(gatepasses);
  } catch (err) {
    console.error("Active gatepass fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
