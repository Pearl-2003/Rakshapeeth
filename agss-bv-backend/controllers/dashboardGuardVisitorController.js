const Visitor = require("../models/OccasionalVisitor");

exports.getExpectedVisitorsToday = async (req, res) => {
  try {

    const now = new Date();

    const startOfDay = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    startOfDay.setHours(0,0,0,0);

    const endOfDay = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    endOfDay.setHours(23,59,59,999);

    const count = await Visitor.countDocuments({
      dateOfVisit: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    console.log("📊 Expected Visitors Today:", count);

    res.status(200).json({
      expectedVisitors: count,
    });

  } catch (error) {
    console.error("❌ Dashboard Count Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
