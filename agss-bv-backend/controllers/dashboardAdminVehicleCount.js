// // controllers/dashboardAdminVehicleCount.js

// const VehicleLog = require("../models/VehicleLog");

// exports.getTodayEntries = async (req, res) => {
//   try {
//     const now = new Date();

//     const startOfDay = new Date(now);
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date(now);
//     endOfDay.setHours(23, 59, 59, 999);

//     const count = await VehicleLog.countDocuments({
//       entryTime: {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       count,
//     });

//   } catch (error) {
//     console.error("Dashboard today entries error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch today's vehicle count",
//     });
//   }
// };
const VehicleLog = require("../models/VehicleLog");

exports.getTodayEntries = async (req, res) => {
  try {
    const now = new Date();

    // Get IST date parts safely
    const istString = now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const istNow = new Date(istString);

    // IST day start
    const startOfDayIST = new Date(istNow);
    startOfDayIST.setHours(0, 0, 0, 0);

    // IST day end
    const endOfDayIST = new Date(istNow);
    endOfDayIST.setHours(23, 59, 59, 999);

    const count = await VehicleLog.countDocuments({
      entryTime: {
        $gte: startOfDayIST,
        $lte: endOfDayIST,
      },
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Dashboard today entries error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch today's vehicle count",
    });
  }
};