// middleware/authGuard.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access Denied. Token missing or malformed."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "AGSS_BV_SECRET_KEY"
    );
console.log("Decoded Guard:", decoded);
    // ✅ store Mongo _id clearly
    req.guard = {
      mongoId: decoded.guardMongoId,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or Expired Token."
    });
  }
};
