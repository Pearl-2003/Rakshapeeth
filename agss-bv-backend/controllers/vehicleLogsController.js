const VehicleLog = require("../models/VehicleLog");

exports.fetchVehicleLogs = async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      status,       // inside | outside
      source,
      scanSource,
      guardId,
      vehicleNo,
      page = 1,
      limit = 20
    } = req.query;

    const filters = {};

    /* 🔎 VEHICLE NUMBER SEARCH */
    if (vehicleNo) {
      filters.vehicleNo = { $regex: vehicleNo, $options: "i" };
    }

    /* 🔹 SOURCE FILTER */
    if (source) {
      filters.source = source;
    }

    /* 🔹 SCAN SOURCE FILTER */
    if (scanSource) {
      filters.scanSource = scanSource;
    }

    /* 🔹 MANUAL ENTRY → GUARD FILTER */
    if (guardId) {
      filters.guardId = guardId;
    }

    /* 🔹 DATE RANGE FILTER (ENTRY TIME) */
    if (fromDate || toDate) {
      filters.entryTime = {};
      if (fromDate) filters.entryTime.$gte = new Date(fromDate);
      if (toDate) filters.entryTime.$lte = new Date(toDate);
    }

    /* 🔹 STATUS FILTER (DERIVED FROM exitTime) */
    if (status === "inside") {
      filters.exitTime = null;
    }

    if (status === "outside") {
      filters.exitTime = { $ne: null };
    }

    /* 🚗 FETCH VEHICLE LOGS */
    const logs = await VehicleLog.find(filters)
      .sort({ entryTime: -1 })
      .lean();

    /* 🔁 DERIVE STATUS CORRECTLY */
    const enrichedLogs = logs.map((log) => ({
      ...log,
      status: log.exitTime ? "outside" : "inside"
    }));

    /* 📄 PAGINATION */
    const start = (page - 1) * limit;
    const paginatedData = enrichedLogs.slice(
      start,
      start + Number(limit)
    );

    return res.json({
      total: enrichedLogs.length,
      page: Number(page),
      limit: Number(limit),
      data: paginatedData
    });

  } catch (err) {
    console.error("Vehicle logs fetch error:", err);
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch vehicle logs"
    });
  }
};
