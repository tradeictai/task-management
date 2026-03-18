// ============================================
// TASK ROUTES
// Phase 4: Tasks endpoints
// ============================================

import express from "express";
import { taskController } from "../controllers/taskController.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router({ mergeParams: true });

// All task routes require authentication
router.use(authenticate);

// Tasks within a project
router.post("/", taskController.createTask);
router.get("/", taskController.getProjectTasks);
router.get("/status/:status", taskController.getTasksByStatus);

// Single task operations
router.get("/:id", taskController.getTaskById);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
