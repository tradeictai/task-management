// ============================================
// AUTH ROUTES
// Phase 2: Authentication endpoints
// ============================================

import express from "express";
import { authController } from "../controllers/authController.js";
import { authenticate } from "../middleware/authentication.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

// Public routes
router.post(
  "/register",
  asyncHandler(validateRegister),
  authController.register,
);
router.post("/login", asyncHandler(validateLogin), authController.login);

// Protected routes
router.get("/me", authenticate, authController.getCurrentUser);

export default router;
