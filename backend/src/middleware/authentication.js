// ============================================
// AUTHENTICATION MIDDLEWARE
// Validates JWT tokens, extracts user info
// ============================================

import { verifyToken } from "../utils/jwt.js";
import { createError } from "../utils/errors.js";

export const authenticate = (req, res, next) => {
  try {
    // Get token from headers: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError.unauthorized("No token provided");
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const decoded = verifyToken(token);

    // Attach user info to request for controllers to use
    req.user = decoded;
    next();
  } catch (error) {
    next(createError.unauthorized("Invalid token"));
  }
};

// Optional: Add this for routes that might not require auth
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      req.user = decoded;
    }
  } catch (error) {
    // Silently fail - user remains unauthorized
  }
  next();
};
