//middleware/verifyAdmin.js

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers["authorization"]; // ✅ frontend will send: Authorization: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access denied — No token provided" });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], "AGSS_BV_SECRET_KEY");
    req.adminId = verified.adminId; // ✅ backend now knows which admin
    next(); // ✅ allow route to continue
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
