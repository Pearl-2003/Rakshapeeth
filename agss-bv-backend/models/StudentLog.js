// models/StudentLog.js
const mongoose = require("mongoose");

const studentLogSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },

  studentName: {
    type: String,
    trim: true
  },

  entryDate: String,
  entryTime: String,

  exitDate: String,
  exitTime: String,

  status: {
    type: String,
    enum: ["inside", "outside"],
    default: "inside"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

/* 🔥 Only ONE active entry allowed */
studentLogSchema.index(
  { studentId: 1 },
  { unique: true, partialFilterExpression: { status: "inside" } }
);

module.exports = mongoose.models.StudentLog || mongoose.model("StudentLog", studentLogSchema);

