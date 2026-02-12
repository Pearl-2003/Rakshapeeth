const multer = require("multer");
const path = require("path");
const fs = require("fs");

const alertDir = path.join(__dirname, "../uploads/security-alerts");

if (!fs.existsSync(alertDir)) {
  fs.mkdirSync(alertDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, alertDir),
  filename: (_, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `alert-${unique}${path.extname(file.originalname)}`);
  }
});

module.exports = multer({ storage });
