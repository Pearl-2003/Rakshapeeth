// models/VehicleScanLog.js
const mongoose = require("mongoose");

const vehicleScanLogSchema = new mongoose.Schema(
  {
    vehicleNo: {
      type: String,
      trim: true,
      uppercase: true,
      index: true
    },


    decision: {
      type: String,
      enum: ["ALLOWED", "DENIED", "MANUAL_REQUIRED", "NOT_DETECTED"],
      required: true
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1
    },

    decisionSource: {
      type: String,
      enum: ["WHITELIST", "BLACKLIST", "OCCASIONAL", "MANUAL", "SYSTEM"],
      required: true
    },

    scanSource: {
      type: {
        type: String,
        enum: ["ANPR", "MANUAL"],
        required: true
      },
      cameraId: String,
      guardId: String
    },

    scanTime: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

vehicleScanLogSchema.index({ vehicleNo: 1, scanTime: -1 });

module.exports = mongoose.model("VehicleScanLog", vehicleScanLogSchema);
