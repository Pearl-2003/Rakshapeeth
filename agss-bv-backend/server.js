require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./connectDB');
const StudentLog = require('./models/StudentLog');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('✅ AGSS-BV Backend with Mongoose is running!');
});

// ✅ Student Entry API (POST)
app.post('/student-entry', async (req, res) => {
  try {
    console.log("📥 Incoming data:", req.body);

    const { studentId, entryType, name, department, year } = req.body;

    const newLog = new StudentLog({
      studentId,
      entryType,
      name,
      department,
      year,
      timestamp: new Date()
    });

    await newLog.save();
    res.status(200).json({ message: "Logged successfully ✅" });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ ADMIN ROUTES — already working, untouched
const adminRoutes = require("./routes/adminRoutes");
app.use('/api', adminRoutes); 

// ✅ ADDING GUARD & PARENT ROUTES (NEW ✅)
const parentRoutes = require('./routes/parent');
app.use('/api/parents', parentRoutes);

// GUARD ROUTES (REGISTER + LOGIN) — FIXED
const guardRoutes = require("./routes/guard");
const guardLoginRoutes = require("./routes/guardLoginRoutes");

// BOTH under SAME BASE PATH (IMPORTANT)
app.use("/api/guard", guardRoutes);       // /api/guard/register
app.use("/api/guard", guardLoginRoutes);  // /api/guard/login

// VERIFY ROUTES
const verifyRoutes = require("./routes/verify");
app.use("/api/verify", verifyRoutes);

const registerRoute = require("./routes/register");
app.use("/api/register", registerRoute);
const requestRoutes = require("./routes/requestRoutes");
app.use("/api/requests", requestRoutes);
const occasionalVisitorRoutes = require("./routes/occasionalVisitorRoutes");
app.use("/api/occasional-visitors", occasionalVisitorRoutes);
const studentRoutes = require("./routes/students");
app.use("/api/students", studentRoutes);
const { sendWhatsApp } = require("./utils/sendNotification");
const parentVisitRoutes = require("./routes/parentVisit");
app.use("/api/parent", parentVisitRoutes);
// in server.js or any test route
app.get("/debug-parent-whatsapp", async (req, res) => {
  sendWhatsApp(
    "+918081308337",
    "AGSS-BV debug test from parent route"
  );
  res.send("Debug message triggered");
});
const adminRequestRoutes = require("./routes/adminRequestRoutes");
app.use("/api/admin", adminRequestRoutes);
// ✅ GATE PASS ROUTES (ADD THIS)
// WHITELIST ROUTES
const whitelistRoutes = require('./routes/whitelistRoutes');
app.use('/api/whitelist', whitelistRoutes);

// BLACKLIST ROUTES
const blacklistRoutes = require('./routes/blacklistRoutes');
app.use('/api/blacklist', blacklistRoutes);

// GUARD MANAGEMENT ROUTES
const guardAdminRoutes = require("./routes/guardRoutes");
app.use("/api/guard", guardAdminRoutes);
const adminOccasionalVisitorRoutes = require("./routes/adminOccasionalVisitorRoutes");
app.use("/api/admin", adminOccasionalVisitorRoutes);
const autoCloseMissedDuties = require("./utils/autoCloseDuty");
app.use(
  "/api/admin/guard-duty",
  require("./routes/adminGuardDutyRoutes")
);
// Run every 10 minutes
setInterval(autoCloseMissedDuties, 10 * 60 * 1000);
app.use("/api/parent", require("./routes/parent"));
app.use("/api/admin", require("./routes/adminRoutes"));
const manualEntryRoutes = require("./routes/manualEntryRoutes");
//in server,js add these routes
const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);
app.use("/api/manual-entry", manualEntryRoutes);
const adminSettingRoutes = require("./routes/adminSettingRoutes");

app.use("/api/settings", adminSettingRoutes);
const guardSettingRoutes = require("./routes/guardSettingRoutes");
app.use("/api/settings", guardSettingRoutes);
const parentSettingRoutes = require("./routes/parentSettingRoutes");
app.use("/api/settings", parentSettingRoutes);
//server.js
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);
const guardVisitorRoutes = require("./routes/guardVisitorRoutes");

app.use("/api/guard", guardVisitorRoutes);

const adminGatePassRoutes = require("./routes/adminGatePassRoutes");

app.use("/api/admin", adminGatePassRoutes);
const vehicleRoutes = require("./routes/vehicleRoutes");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 vehicle routes
app.use("/api/vehicle", vehicleRoutes);
const vehicleLogsRoutes = require("./routes/vehicleLogs.routes");
app.use("/api", vehicleLogsRoutes);

const securityAlertRoutes = require("./routes/securityAlerts");

app.use("/uploads", express.static("uploads"));
app.use("/api/security-alerts", securityAlertRoutes);

const vehicleAlertRoutes = require("./routes/vehicleAlerts");
app.use("/api/vehicle-alerts", vehicleAlertRoutes);

//forgot password
const forgotPasswordRoutes = require("./routes/forgotpassword");
app.use("/api/auth", forgotPasswordRoutes);

const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
app.use("/api/admin", adminDashboardRoutes);
const dashboardRoutes = require("./routes/dashBoardAdminVehicleCountRoutes");
app.use("/api/dashboard", dashboardRoutes);
const dashboardExpectedVisitor = require("./routes/dashboardGuardExpectedVisitorRoutes");
app.use("/api/dashboardExpectedVisitor", dashboardExpectedVisitor);
const adminActivityRoutes = require("./routes/adminActivityRoutes");
app.use("/api/admin", adminActivityRoutes);

// ✅ LISTEN — always last
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));