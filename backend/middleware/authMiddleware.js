const jwt = require('jsonwebtoken');
const User = require('../models/Users');

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.error("User not found for ID:", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

exports.adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized. Please log in." });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next(); // ✅ THIS WAS MISSING

  } catch (error) {
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.superAdminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized. Please log in." });
    }

    if (!req.user.isSuperAdmin) {
      return res.status(403).json({ message: "Super Admin access required" });
    }

    next(); // ✅ THIS WAS MISSING

  } catch (error) {
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.optionalProtect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return next(); // No token = anonymous, just continue

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        next(); // Invalid token = treat as anonymous
    }
};