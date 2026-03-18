// ============================================
// AUTH CONTROLLER
// Handles HTTP requests for auth routes
// Phase 2: Authentication
// ============================================

import { authService } from "../services/authService.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const authController = {
  // POST /api/auth/register
  register: asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    const { user, token } = await authService.register(email, password, name);

    successResponse(res, { user, token }, "User registered successfully", 201);
  }),

  // POST /api/auth/login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { user, token } = await authService.login(email, password);

    successResponse(res, { user, token }, "Login successful");
  }),

  // GET /api/auth/me (protected)
  getCurrentUser: asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.user.userId);

    successResponse(res, { user }, "User fetched successfully");
  }),
};
