// models/SecurityAlert.js
const mongoose = require("mongoose");

const SecurityAlertSchema = new mongoose.Schema(
  {
    /* ================= STUDENT INFO ================= */
    studentId: {
      type: String,
      required: true
    },

    studentName: {
      type: String,
      required: true
    },

    /* ================= ALERT INFO ================= */
    alertType: {
      type: String,
      enum: ["ENTRY", "EXIT"],
      required: true
    },

    reason: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },

    evidenceImageUrl: {
      type: String,
      required: true
    },

    guardNote: {
      type: String,
      default: ""
    },

    /* ================= GUARD INFO ================= */
    raisedBy: {
      guardId: {
        type: String,
        required: true
      },
      guardName: {
        type: String,
        required: true
      }
    },

    gate: {
      gateId: String,
      gateName: String
    },

    /* ================= ADMIN ACTION ================= */
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "HOLD"],
      default: "PENDING"
    },

    adminAction: {
      adminId: String,
      adminName: String,
      decision: String,
      reason: String,
      actionAt: Date
    },

    /* ================= GUARD NOTIFICATION ================= */
    // ⚠️ NO DEFAULT HERE
    guardNotification: {
      message: String,
      status: {
        type: String,
        enum: ["UNSEEN", "SEEN"]
      },
      seenAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SecurityAlert", SecurityAlertSchema);