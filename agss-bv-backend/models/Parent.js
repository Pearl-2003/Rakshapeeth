// models/Parent.js
const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, required: true },
  password:  { type: String, required: true },  // will be hashed
  resetOtp: {
  type: String
},

otpExpiry: {
  type: Date
},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Parent', ParentSchema);
