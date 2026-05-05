// models/Guard.js
const mongoose = require('mongoose');

const GuardSchema = new mongoose.Schema({
  guardId: { type: String, unique: true },

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  phone: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },
  resetOtp: {
  type: String
},

otpExpiry: {
  type: Date
},


  createdAt: { type: Date, default: Date.now }
});

// ➤ Auto-generate guardId
GuardSchema.pre('save', async function (next) {
  if (!this.guardId) {
    const lastGuard = await mongoose.model('Guard').findOne().sort({ _id: -1 });
    let number = 1;

    if (lastGuard && lastGuard.guardId) {
      const lastNum = parseInt(lastGuard.guardId.replace("GID", ""));
      if (!isNaN(lastNum)) number = lastNum + 1;
    }

    this.guardId = "GID" + String(number).padStart(3, "0");
  }

  next();
});

module.exports = mongoose.model('Guard', GuardSchema);
