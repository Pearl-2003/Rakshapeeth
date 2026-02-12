const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");

// Temporary folder for uploaded images
const upload = multer({ dest: "temp/" });

// POST /api/verify/iris-verify
router.post("/iris-verify", upload.array("images", 5), async (req, res) => {
  try {
    const { student_id } = req.body;

    // Validation
    if (!student_id || !req.files || req.files.length === 0) {
      return res.status(400).json({
        msg: "Student ID or iris images missing",
      });
    }

    // Prepare FormData for Flask
    const formData = new FormData();
    formData.append("student_id", student_id);

    // Append all images
    req.files.forEach((file) => {
      formData.append("images", fs.createReadStream(file.path));
    });

    // Call Flask server
    const response = await axios.post(
      "http://127.0.0.1:5000/verify",
      formData,
      { headers: formData.getHeaders() }
    );

    // Delete temp files
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    // Send Flask response back to frontend
    return res.json(response.data);

  } catch (error) {
    console.error("❌ Iris verify error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return res
      .status(500)
      .json(error.response?.data || { error: "Iris verification failed" });
  }
});

module.exports = router;
