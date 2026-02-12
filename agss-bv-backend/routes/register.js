const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// temp folder for images
const upload = multer({ dest: "temp/" });

/**
 * POST /api/register/iris
 * 3–5 images → Flask → MongoDB
 */
router.post("/iris", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length < 3) {
      return res.status(400).json({
        error: "Upload minimum 3 iris images",
      });
    }

    // Prepare form-data for Flask
    const formData = new FormData();
    req.files.forEach((file) => {
      formData.append("images", fs.createReadStream(file.path));
    });

    // Call Flask
    const response = await axios.post(
      "http://127.0.0.1:5000/capture",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    // Delete temp images
    req.files.forEach((file) => fs.unlinkSync(file.path));

    return res.json({
      msg: "Iris registered successfully",
      flask_response: response.data,
    });

  } catch (err) {
    console.error("❌ Register error:", err.message);

    return res.status(500).json(
      err.response?.data || { error: "Iris registration failed" }
    );
  }
});

module.exports = router;
