const mongoose = require("mongoose");

exports.getCurrentStatus = async (req, res) => {
  try {
    const StudentLogs = mongoose.connection.db.collection("studentlogs");

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Optional filter
    const statusFilter = req.query.status;
    const query = statusFilter ? { status: statusFilter } : {};

    // Counts (for summary cards)
    const [insideCount, outsideCount] = await Promise.all([
      StudentLogs.countDocuments({ status: "inside" }),
      StudentLogs.countDocuments({ status: "outside" })
    ]);

    // Fetch data
    const logs = await StudentLogs.find(query)
      .project({
        _id: 0,
        studentId: 1,
        studentName: 1,
        status: 1,
        entryTime: 1,
        exitTime: 1,
        entryDate: 1
      })
      .sort({ entryDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Attach duration (backend-level optimization)
    const now = new Date();
    const students = logs.map(log => {
      let duration = null;

      if (log.status === "inside" && log.entryTime) {
        const entry = new Date(`1970-01-01T${log.entryTime}:00`);
        const diffMs = now - entry;
        const hrs = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs / (1000 * 60)) % 60);
        duration = `${hrs}h ${mins}m`;
      }

      return {
        ...log,
        duration
      };
    });

    res.json({
      page,
      limit,
      insideCount,
      outsideCount,
      totalOnPage: students.length,
      students
    });

  } catch (err) {
    console.error("Admin current status error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


