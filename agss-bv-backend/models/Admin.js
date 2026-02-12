//models/Admin.js
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }, // ✅ added
  password: { type: String, required: true } // will be encrypted
});

module.exports = mongoose.model("Admin", AdminSchema);
