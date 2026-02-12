// models/GatePass.js
const mongoose = require("mongoose");

const gatePassSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true
    },

    // Snapshot only (NOT identity)
    studentName: {
      type: String,
      trim: true
    },

    // Expected exit date (YYYY-MM-DD)
    expectedExitDate: {
      type: String,
      required: true
    },

    // Expected exit time (HH:mm - 24 hour)
    expectedExitTime: {
      type: String,
      required: true
    },

    // Gatepass lifecycle
    status: {
      type: String,
      enum: ["ACTIVE", "USED", "EXPIRED"],
      default: "ACTIVE"
    },

    usedAt: {
      type: Date
    },

    notificationStatus: {
      type: String,
      enum: ["sent", "not sent"],
      default: "not sent"
    }
  },
  { timestamps: true }
);

// 🔥 Fast lookups during exit verification
gatePassSchema.index({ studentId: 1, expectedExitDate: -1 });

module.exports =
  mongoose.models.GatePass || mongoose.model("GatePass", gatePassSchema);
