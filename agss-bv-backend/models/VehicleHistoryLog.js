// models/VehicleHistoryLog.js
const mongoose = require("mongoose");

const vehicleHistorySchema = new mongoose.Schema(
  {
    vehicleNo: String,
    entryTime: Date,
    exitTime: Date,
    source: String,
    manualEntryId: mongoose.Schema.Types.ObjectId,
    guardId: String,
    entryImageRef: String,
    exitImageRef: String
  },
  {
    timestamps: true,
    expires: "365d"
  }
);

module.exports = mongoose.model("VehicleHistoryLog", vehicleHistorySchema);


