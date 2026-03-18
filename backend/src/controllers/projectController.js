// ============================================
// PROJECT CONTROLLER
// Handles HTTP requests for project routes
// Phase 3: Projects CRUD
// ============================================

import { projectService } from "../services/projectService.js";
import { successResponse } from "../utils/response.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const projectController = {
  // POST /api/projects (create)
  createProject: asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const project = await projectService.createProject(
      title,
      description,
      req.user.userId,
    );

    successResponse(res, project, "Project created successfully", 201);
  }),

  // GET /api/projects (get all user's projects)
  getUserProjects: asyncHandler(async (req, res) => {
    const projects = await projectService.getUserProjects(
      req.user.userId,
      req.query,
    );

    successResponse(res, projects, "Projects fetched successfully");
  }),

  // GET /api/projects/:id (get single)
  getProjectById: asyncHandler(async (req, res) => {
    const project = await projectService.getProjectById(
      req.params.id,
      req.user.userId,
    );

    successResponse(res, project, "Project fetched successfully");
  }),

  // PATCH /api/projects/:id (update)
  updateProject: asyncHandler(async (req, res) => {
    const project = await projectService.updateProject(
      req.params.id,
      req.user.userId,
      req.body,
    );

    successResponse(res, project, "Project updated successfully");
  }),

  // DELETE /api/projects/:id (delete)
  deleteProject: asyncHandler(async (req, res) => {
    const result = await projectService.deleteProject(
      req.params.id,
      req.user.userId,
    );

    successResponse(res, result, "Project deleted successfully");
  }),
};
