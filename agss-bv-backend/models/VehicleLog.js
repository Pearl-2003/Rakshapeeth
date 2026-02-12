const mongoose = require("mongoose");

const vehicleLogSchema = new mongoose.Schema(
  {
    vehicleNo: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true
    },

    entryTime: {
      type: Date,
      required: true
    },

    exitTime: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["inside", "outside"],
      required: true,
      index: true
    },

    source: {
      type: String,
      enum: ["WHITELIST", "OCCASIONAL", "MANUAL"],
      required: true
    },

    scanSource: {
      type: String,
      enum: ["ANPR", "MANUAL"],
      required: true
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  { timestamps: true }
);

/* One active session per vehicle */
vehicleLogSchema.index(
  { vehicleNo: 1 },
  { unique: true, partialFilterExpression: { status: "inside" } }
);

module.exports =
  mongoose.models.VehicleLog ||
  mongoose.model("VehicleLog", vehicleLogSchema);
