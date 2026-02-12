// models/StudentLogHistory.js
const mongoose = require("mongoose");

const studentLogHistorySchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },

  studentName: String,

  entryDate: String,
  entryTime: String,

  exitDate: String,
  exitTime: String,

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 365 // 1 year
  }
});

studentLogHistorySchema.index({ studentId: 1, exitDate: -1 });

module.exports = mongoose.model(
  "StudentLogHistory",
  studentLogHistorySchema
);
