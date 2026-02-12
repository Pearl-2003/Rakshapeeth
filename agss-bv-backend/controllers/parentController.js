// controllers/parentController.js
const mongoose = require("mongoose");
// Access Flask-created students collection
const Parent = require('../models/Parent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Parent
exports.registerParent = async (req, res) => {
  try {
    let { firstName, lastName, email, phone, password } = req.body;

    // Trim and normalize inputs
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    password = password?.trim();

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ msg: 'Please fill all required fields' });
    }

    const existing = await Parent.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    const newParent = new Parent({ firstName, lastName, email, phone, password: hashed });
    await newParent.save();

    const { password: pw, ...parentSafe } = newParent.toObject();
    res.status(201).json({ msg: 'Parent registered', parent: parentSafe });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login Parent
exports.loginParent = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const parent = await Parent.findOne({ email });
    if (!parent) return res.status(400).json({ msg: "Parent not found" });

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });
const token = jwt.sign(
  {
    parentMongoId: parent._id,
    parentEmail: parent.email,   // 🔥 THIS WAS MISSING
    role: "parent"
  },
  "AGSS_BV_SECRET_KEY",
  { expiresIn: "1d" }
);


res.json({
  msg: "Login successful",
  token,
  parent: {
    id: parent._id,
    firstName: parent.firstName,
    lastName: parent.lastName,
    email: parent.email
  }
});

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get children linked to logged-in parent
/* ===================== STEP-1: GET CHILDREN ===================== */
exports.getChildren = async (req, res) => {
  try {
    const parentEmail = req.parentEmail;

    if (!parentEmail) {
      return res.status(400).json({ msg: "Parent email missing from token" });
    }

    // ✅ SAFE access to Flask-created collection
    const Students = mongoose.connection.db.collection("students");

    const students = await Students.find({
      $or: [
        { fatherEmail: parentEmail },
        { motherEmail: parentEmail }
      ]
    })
      .project({
        _id: 0,
        student_id: 1,
        firstName: 1,
        lastName: 1
      })
      .toArray();

    const children = students.map(s => ({
      student_id: s.student_id,
      name: `${s.firstName} ${s.lastName}`
    }));

    res.json({
      count: children.length,
      children
    });

  } catch (err) {
    console.error("Get children error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.getChildrenWithStatus = async (req, res) => {
  try {
    const parentEmail = req.parentEmail;

    if (!parentEmail) {
      return res.status(400).json({ msg: "Parent email missing from token" });
    }

    const Students = mongoose.connection.db.collection("students");
    const StudentLogs = mongoose.connection.db.collection("studentlogs");

    // 1️⃣ Get children owned by parent
    const students = await Students.find({
      $or: [
        { fatherEmail: parentEmail },
        { motherEmail: parentEmail }
      ]
    })
      .project({
        _id: 0,
        student_id: 1,
        firstName: 1,
        lastName: 1
      })
      .toArray();

    // 2️⃣ Attach current status from studentlogs
    const result = [];

    for (const s of students) {
      const log = await StudentLogs.findOne({
        studentId: s.student_id
      });

      result.push({
        student_id: s.student_id,
        name: `${s.firstName} ${s.lastName}`,
        currentStatus: log ? log.status : "unknown",
        lastEntry: log?.entryTime || null,
        lastExit: log?.exitTime || null
      });
    }

    res.json({
      count: result.length,
      children: result
    });

  } catch (err) {
    console.error("Error fetching children status:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.getChildHistory = async (req, res) => {
  try {
    const parentEmail = req.parentEmail;
    const { studentId } = req.params;

    if (!parentEmail || !studentId) {
      return res.status(400).json({ msg: "Missing data" });
    }

    const Students = mongoose.connection.db.collection("students");
    const StudentLogs = mongoose.connection.db.collection("studentlogs");
    const StudentLogsHistory = mongoose.connection.db.collection("studentloghistory");

    // 1️⃣ OWNERSHIP CHECK
    const student = await Students.findOne({
      student_id: studentId,
      $or: [
        { fatherEmail: parentEmail },
        { motherEmail: parentEmail }
      ]
    });

    if (!student) {
      return res.status(403).json({ msg: "Access denied to this student" });
    }

    // 2️⃣ FETCH PAST HISTORY
    const history = await StudentLogsHistory
      .find({ studentId })
      .project({
        _id: 0,
        entryDate: 1,
        entryTime: 1,
        exitDate: 1,
        exitTime: 1,
        createdAt: 1
      })
      .sort({ createdAt: -1 })
      .toArray();

    // 3️⃣ FETCH CURRENT / LATEST SESSION
    const currentLog = await StudentLogs.findOne(
      { studentId },
      {
        projection: {
          _id: 0,
          entryDate: 1,
          entryTime: 1,
          exitDate: 1,
          exitTime: 1,
          status: 1
        }
      }
    );

    // 4️⃣ MERGE DATA
    let fullHistory = [...history];

    if (currentLog) {
      fullHistory.unshift({
        entryDate: currentLog.entryDate,
        entryTime: currentLog.entryTime,
        exitDate: currentLog.exitDate || null,
        exitTime: currentLog.exitTime || null,
        status: currentLog.status
      });
    }

    res.json({
      student: {
        student_id: student.student_id,
        name: `${student.firstName} ${student.lastName}`
      },
      totalRecords: fullHistory.length,
      history: fullHistory
    });

  } catch (err) {
    console.error("Error fetching child history:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
