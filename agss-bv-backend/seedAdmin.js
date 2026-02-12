const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./connectDB");
const Admin = require("./models/Admin");

(async () => {
  await connectDB();

  const existingAdmin = await Admin.findOne({ email: "admin@agssbv.com" });

  if (existingAdmin) {
    console.log("ℹ️ Admin already exists in database.");
  } else {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await Admin.create({
      name: "System Admin",
      email: "admin@agssbv.com",
      phone: "9876543210",
      password: hashedPassword
    });
    console.log("✅ Admin user inserted successfully");
  }

  process.exit();
})();
