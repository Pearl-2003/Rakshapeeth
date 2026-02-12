const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: true,
      trim: true
    },

    studentName: {
      type: String,
      trim: true
    },

    studentId: {
      type: String,
      trim: true
    },

    idProofType: {
      type: String,
      enum: ["PAN", "AADHAAR", "DL"],
      required: true
    },

    visitorIdProof: {
      type: String,
      required: true,
      trim: true
    },

    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [
        /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/,
        "Invalid vehicle number format"
      ]
    },

    dateOfVisit: {
      type: String,
      required: true
    },

    numberOfPeople: {
      type: Number,
      required: true,
      min: 1
    },

    // 🔥 REQUEST TABLE IS ONLY FOR "OTHER"
    reasonOfVisit: {
      type: String,
      enum: ["Other"],
      required: true
    },

    otherReason: {
      type: String,
      required: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{6,15}$/, "Invalid phone number"]
    },

    type: {
      type: String,
      enum: ["parent", "non-parent"],
      required: true
    },

    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Index for admin dashboard
requestSchema.index({ dateOfVisit: -1, status: 1 });

module.exports = mongoose.model("Request", requestSchema);
