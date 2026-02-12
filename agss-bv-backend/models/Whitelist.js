const mongoose = require("mongoose");

const whitelistSchema = new mongoose.Schema({
  vehicleOwnerName: {
    type: String,
    required: true,
    trim: true
  },

  vehicleNo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  type: {
    type: String,
    enum: [
      "faculty",
      "staff",
      "staff family",
      "shop owner",
      "hospital worker",
      "hostel worker",
      "worker"
    ],
    required: true
  },

  // 🆕 Reference faculty/staff (ONLY for staff family)
  referenceFacultyName: {
    type: String,
    trim: true,
    required: function () {
      return this.type === "staff family";
    }
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true
  },

  approvedBy: {
    type: String,
    default: "system"
  }

}, { timestamps: true });

/* 🔍 Indexes for admin filters & search */
whitelistSchema.index({
  type: 1,
  gender: 1,
  vehicleOwnerName: 1,
  referenceFacultyName: 1,
  vehicleNo: 1
});

module.exports =
  mongoose.models.Whitelist ||
  mongoose.model("Whitelist", whitelistSchema);
