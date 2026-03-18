// ============================================
// PROJECT ROUTES
// Phase 3: Projects CRUD endpoints
// ============================================

import express from "express";
import { projectController } from "../controllers/projectController.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

// All project routes require authentication
router.use(authenticate);

router.post("/", projectController.createProject);
router.get("/", projectController.getUserProjects);
router.get("/:id", projectController.getProjectById);
router.patch("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;
