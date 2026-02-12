// models/ManualEntry.js
const mongoose = require("mongoose");

const ManualEntrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    phoneNo: {
      type: String,
      required: true
    },

    vehicleNo: {
      type: String,
      index: true
    },

    idProof: {
      type: String
    },

    idProofNumber: {
      type: String
    },

    reasonOfVisit: {
      type: String,
      required: true
    },

    otherReason: {
      type: String
    },

    // ✅ STORE HUMAN-READABLE GUARD ID (GIDxxx)
    guardId: {
      type: String,
      required: true
    },

    entryTime: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManualEntry", ManualEntrySchema);
