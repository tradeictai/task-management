// ============================================
// TASK CONTROLLER
// Handles HTTP requests for task routes
// Phase 4: Tasks system
// ============================================

import { taskService } from "../services/taskService.js";
import { successResponse } from "../utils/response.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const taskController = {
  // POST /api/projects/:projectId/tasks (create)
  createTask: asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const task = await taskService.createTask(
      projectId,
      req.user.userId,
      req.body,
    );

    successResponse(res, task, "Task created successfully", 201);
  }),

  // GET /api/projects/:projectId/tasks (get all)
  getProjectTasks: asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const tasks = await taskService.getProjectTasks(
      projectId,
      req.user.userId,
      req.query,
    );

    successResponse(res, tasks, "Tasks fetched successfully");
  }),

  // GET /api/tasks/:id (get single)
  getTaskById: asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id, req.user.userId);

    successResponse(res, task, "Task fetched successfully");
  }),

  // PATCH /api/tasks/:id (update)
  updateTask: asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(
      req.params.id,
      req.user.userId,
      req.body,
    );

    successResponse(res, task, "Task updated successfully");
  }),

  // DELETE /api/tasks/:id (delete)
  deleteTask: asyncHandler(async (req, res) => {
    const result = await taskService.deleteTask(req.params.id, req.user.userId);

    successResponse(res, result, "Task deleted successfully");
  }),

  // GET /api/projects/:projectId/tasks/status/:status (filter by status)
  getTasksByStatus: asyncHandler(async (req, res) => {
    const { projectId, status } = req.params;
    const tasks = await taskService.getTasksByStatus(
      projectId,
      req.user.userId,
      status,
    );

    successResponse(
      res,
      tasks,
      `Tasks with status "${status}" fetched successfully`,
    );
  }),
};
