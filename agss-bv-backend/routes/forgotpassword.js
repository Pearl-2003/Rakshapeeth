//routes/forgotpassword.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const twilio = require("twilio");

const Parent = require("../models/Parent");
const Admin = require("../models/Admin");
const Guard = require("../models/Guard");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

// ✅ FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { role, identifier } = req.body;
    let user;

    if (role === "parent")
      user = await Parent.findOne({ email: identifier });

    else if (role === "admin")
      user = await Admin.findOne({ email: identifier });

    else if (role === "guard")
      user = await Guard.findOne({ guardId: identifier });

    if (!user)
      return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${user.phone}`,
      body: `Your OTP is ${otp}`
    });

    res.json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { role, identifier, otp } = req.body;
  let user;

  if (role === "parent")
    user = await Parent.findOne({ email: identifier });

  else if (role === "admin")
    user = await Admin.findOne({ email: identifier });

  else if (role === "guard")
    user = await Guard.findOne({ guardId: identifier });
console.log("Identifier received:", identifier);
console.log("Role received:", role);

  if (!user.resetOtp || user.resetOtp.toString().trim() !== otp.toString().trim()) {
  return res.status(400).json({ msg: "Invalid OTP" });
}


  if (Date.now() > user.otpExpiry)
    return res.status(400).json({ msg: "OTP expired" });

  res.json({ msg: "OTP verified" });
});

// ✅ RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { role, identifier, newPassword } = req.body;
  let user;

  if (role === "parent")
    user = await Parent.findOne({ email: identifier });

  else if (role === "admin")
    user = await Admin.findOne({ email: identifier });

  else if (role === "guard")
    user = await Guard.findOne({ guardId: identifier });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ msg: "Password reset successful" });
});

module.exports = router;