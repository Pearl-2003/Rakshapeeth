const jwt = require("jsonwebtoken");
const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  const parentEmail = normalizeEmail(req.parentEmail);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied — Token missing"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "AGSS_BV_SECRET_KEY");

    console.log("Decoded Parent:", decoded);

    req.parent = {
      mongoId: decoded.parentMongoId,
      role: decoded.role
    };
 req.parentEmail = decoded.parentEmail;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
