const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password -otp -otpExpires");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// Role-based access: authorizeRoles("admin", "doctor")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not allowed.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };