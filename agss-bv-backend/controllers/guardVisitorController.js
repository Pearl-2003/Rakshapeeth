const OccasionalVisitor = require("../models/OccasionalVisitor");

// -------------------------------
// GET TODAY'S OCCASIONAL VISITORS (GUARD VIEW)
// -------------------------------
exports.getTodayVisitorsForGuard = async (req, res) => {
  try {
    const { search, visitorType, vehicleNo } = req.query;

    // 🕛 Calculate today's date range (server local time)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    let query = {
      dateOfVisit: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    };

    // 🔍 Search (name / phone / vehicle / reason)
    if (search) {
      query.$or = [
        { visitorName: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { vehicleNo: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
      ];
    }

    // 🎭 Visitor Type filter
    if (visitorType) {
      query.visitorType = visitorType;
    }

    // 🚗 Vehicle filter (exact / partial)
    if (vehicleNo) {
      query.vehicleNo = { $regex: vehicleNo, $options: "i" };
    }

    const visitors = await OccasionalVisitor
      .find(query)
      .sort({ createdAt: -1 });

    res.status(200).json(visitors);
  } catch (err) {
    console.error("Guard visitor fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
