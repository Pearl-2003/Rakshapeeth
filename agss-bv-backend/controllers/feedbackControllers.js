//controllers/feedbackControllers.js
const Feedback = require("../models/Feedback");

// POST feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, feedbackType, message } = req.body;

    // validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled"
      });
    }

    const feedback = new Feedback({
      name,
      email,
      feedbackType,
      message
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully"
    });
  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};