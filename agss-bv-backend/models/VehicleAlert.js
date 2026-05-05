// models/VehicleAlert.js
const mongoose = require("mongoose");

const VehicleAlertSchema = new mongoose.Schema(
  {
    /* ================= VEHICLE INFO ================= */
    vehicleNo: {
      type: String,
      required: true,
      trim: true
    },

    /* ================= ALERT INFO ================= */
    alertType: {
      type: String,
      enum: ["BLACKLISTED", "MANUAL_REQUIRED"],
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

    /* ================= GUARD INFO ================= */
    raisedBy: {
      guardId: {
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

module.exports = mongoose.model("VehicleAlert", VehicleAlertSchema);