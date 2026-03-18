// ============================================
// AUTH SERVICE
// Business logic for authentication
// Controllers call this, never talk to DB directly
// Phase 2: Authentication
// ============================================

import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { createError } from "../utils/errors.js";

export const authService = {
  // Register new user
  register: async (email, password, name) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError.conflict("Email already registered");
    }

    // Create new user (password gets hashed by schema middleware)
    const user = new User({ email, password, name });
    await user.save();

    // Generate token for immediate login
    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  },

  // Login user
  login: async (email, password) => {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw createError.unauthorized("Invalid email or password");
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw createError.unauthorized("Invalid email or password");
    }

    // Generate token
    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  },

  // Get user by ID (for protected routes)
  getUserById: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw createError.notFound("User not found");
    }
    return user;
  },
};
