//models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    feedbackType: {
      type: String,
      enum: ["Suggestion", "Bug Report", "Compliment", "Other"],
      default: "Suggestion"
    },
    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true } // createdAt, updatedAt automatically
);

module.exports = mongoose.model("Feedback", feedbackSchema);