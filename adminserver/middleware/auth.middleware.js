import jwt from "jsonwebtoken";
import user from "../models/user.models.js";

const verifyToken = async (req, res, next) => {
  try {
    // Check if request is coming from allowed origin (gyapak.in)
    const origin = req.headers.origin || req.headers.referer;
    const allowedOrigins = ["https://gyapak.in", "http://localhost:5174"];

    // Debug logging
    console.log('=== Auth Middleware Debug ===');
    console.log('Origin:', origin);
    console.log('Referer:', req.headers.referer);
    console.log('Authorization:', req.headers.authorization);

    // Check if the origin matches any allowed origin
    const isAllowedOrigin = allowedOrigins.some(
      (allowedOrigin) => origin && origin.startsWith(allowedOrigin)
    );

    console.log('Is Allowed Origin:', isAllowedOrigin);

    // If request is from gyapak.in, skip token verification
    if (isAllowedOrigin) {
      console.log('✓ Allowing public access from:', origin);
      // Set a default user object for public access
      req.user = {
        id: null,
        email: null,
        role: "public",
      };
      return next();
    }

    let token;

    // Check Authorization header for Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    // If no token found, return unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
      error: err.message,
    });
  }
};

/**
 * Middleware to check if user has required role(s)
 * Usage: authorizeRoles("admin") or authorizeRoles("admin", "data entry")
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    // Allow public role users (from allowed origins) to bypass role checks
    if (req.user.role === "public") {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};

export { verifyToken, authorizeRoles };
