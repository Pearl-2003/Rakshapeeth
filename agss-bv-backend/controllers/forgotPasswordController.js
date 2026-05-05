//controller/forgotPasswordController.js
const bcrypt = require("bcryptjs");
const Parent = require("../models/Parent");
const Admin = require("../models/Admin");
const Guard = require("../models/Guard");

const twilio = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

/* =========================
   SEND OTP
========================= */
exports.sendOtp = async (req, res) => {
  try {
    const { role, identifier } = req.body;
    let user;

    if (role === "parent")
      user = await Parent.findOne({ email: identifier });

    else if (role === "admin")
      user = await Admin.findOne({ email: identifier });

    else if (role === "guard")
      user = await Guard.findOne({ guardId: identifier });

    else
      return res.status(400).json({ msg: "Invalid role" });

    if (!user)
      return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();


    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await twilio.messages.create({
  from: process.env.TWILIO_WHATSAPP_FROM,
  to: `whatsapp:+91${user.phone}`,
  body: `Your OTP for password reset is ${otp}. Valid for 10 minutes.`,
});


    res.json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* =========================
   VERIFY OTP
========================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { role, identifier, otp } = req.body;
    let user;

    if (role === "parent")
      user = await Parent.findOne({ email: identifier });

    else if (role === "admin")
      user = await Admin.findOne({ email: identifier });

    else if (role === "guard")
      user = await Guard.findOne({ guardId: identifier });

    if (!user || user.resetOtp !== Number(otp))
      return res.status(400).json({ msg: "Invalid OTP" });

    if (Date.now() > user.otpExpiry)
      return res.status(400).json({ msg: "OTP expired" });

    res.json({ msg: "OTP verified" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  try {
    const { role, identifier, newPassword } = req.body;
    let user;

    if (role === "parent")
      user = await Parent.findOne({ email: identifier });

    else if (role === "admin")
      user = await Admin.findOne({ email: identifier });

    else if (role === "guard")
      user = await Guard.findOne({ guardId: identifier });

    if (!user)
      return res.status(404).json({ msg: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ msg: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};