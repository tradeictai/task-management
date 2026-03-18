// ============================================
// VALIDATION MIDDLEWARE
// Phase 2: We'll expand validations here
// ============================================

import { createError } from "../utils/errors.js";

export const validateRegister = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw createError.validation("Email, password, and name are required");
  }

  if (password.length < 6) {
    throw createError.validation("Password must be at least 6 characters");
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError.validation("Email and password are required");
  }

  next();
};
