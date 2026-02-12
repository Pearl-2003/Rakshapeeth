const Guard = require("../models/Guard");
const bcrypt = require("bcryptjs");

// ---------------------------
// REGISTER GUARD
// ---------------------------
exports.registerGuard = async (req, res) => {
  try {
    const { firstName, lastName, gender, phone, email, password } = req.body;

    // 🔴 Required fields (gender added)
    if (!firstName || !lastName || !gender || !phone || !password) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // 🔴 Gender enum validation (schema-safe)
    const allowedGenders = ["Male", "Female", "Other"];
    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({ msg: "Invalid gender value" });
    }

    // 🔴 Email uniqueness (if provided)
    if (email) {
      const existing = await Guard.findOne({ email });
      if (existing) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const guard = new Guard({
      firstName,
      lastName,
      gender,
      phone,
      email: email || null,
      password: hashedPassword,
    });

    await guard.save();

    res.status(201).json({
      msg: "Guard registered successfully",
      guard,
      guardId: guard.guardId,  
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
