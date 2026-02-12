// models/guardLogin.js
const mongoose = require("mongoose");

const guardLoginSchema = new mongoose.Schema({
  guard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guard",       // Reference to Guard collection
    required: true
  },

  guardId: {
    type: String,
    required: true,
    trim: true
  },

  loginTime: {
    type: String,       // e.g., "08:30"
    required: true
  },

  logoutTime: {
    type: String,       // e.g., "18:00"
    required: false
  },

  loginDate: {
    type: String,       // e.g., "2025-11-06"
    default: () => new Date().toISOString().split('T')[0]
  },

  status: {
    type: String,
    enum: ["logged-in", "logged-out"],
    default: "logged-in"
  },

  createdAt: {
    type: Date,
    default: Date.now,
expires: 60 * 60 * 24 * 365  // Auto-delete after 1 year
  }

}, { timestamps: true });

// Fast lookups for analytics or attendance reports
guardLoginSchema.index({ guardId: 1, loginDate: -1 });

module.exports = mongoose.model("GuardLogin", guardLoginSchema);