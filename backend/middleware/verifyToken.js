const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Requires 'cookie-parser' in server.js
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Matches the key used in generatTokenAndSetCookies
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { verifyToken };