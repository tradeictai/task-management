// ============================================
// TASK SERVICE
// Business logic for tasks
// Phase 4: Tasks system
// ============================================

import { Task } from "../models/Task.js";
import { Project } from "../models/Project.js";
import { createError } from "../utils/errors.js";

export const taskService = {
  // Create task in a project
  createTask: async (projectId, userId, taskData) => {
    // Verify project exists and user owns it
    const project = await Project.findById(projectId);
    if (!project) {
      throw createError.notFound("Project not found");
    }

    if (project.owner.toString() !== userId) {
      throw createError.forbidden(
        "You can only add tasks to your own projects",
      );
    }

    const task = new Task({
      ...taskData,
      project: projectId,
    });

    await task.save();
    await task.populate("assignee", "name email");
    return task;
  },

  // Get all tasks for a project (with status/search/pagination)
  getProjectTasks: async (projectId, userId, query = {}) => {
    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project) {
      throw createError.notFound("Project not found");
    }

    if (project.owner.toString() !== userId) {
      throw createError.forbidden(
        "You can only view tasks in your own projects",
      );
    }

    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const filter = { project: projectId };
    if (query.status) {
      filter.status = query.status;
    }
    if (query.search) {
      filter.title = { $regex: query.search, $options: "i" };
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("assignee", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter),
    ]);

    return {
      items: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  // Get single task
  getTaskById: async (taskId, userId) => {
    const task = await Task.findById(taskId).populate("assignee", "name email");

    if (!task) {
      throw createError.notFound("Task not found");
    }

    // Verify access: user must own the project
    const project = await Project.findById(task.project);
    if (project.owner.toString() !== userId) {
      throw createError.forbidden(
        "You can only view tasks in your own projects",
      );
    }

    return task;
  },

  // Update task
  updateTask: async (taskId, userId, updates) => {
    const task = await Task.findById(taskId);

    if (!task) {
      throw createError.notFound("Task not found");
    }

    // Verify access
    const project = await Project.findById(task.project);
    if (project.owner.toString() !== userId) {
      throw createError.forbidden(
        "You can only update tasks in your own projects",
      );
    }

    // Update allowed fields
    const allowedUpdates = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
      "assignee",
    ];
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    });

    await task.save();
    await task.populate("assignee", "name email");
    return task;
  },

  // Delete task
  deleteTask: async (taskId, userId) => {
    const task = await Task.findById(taskId);

    if (!task) {
      throw createError.notFound("Task not found");
    }

    // Verify access
    const project = await Project.findById(task.project);
    if (project.owner.toString() !== userId) {
      throw createError.forbidden(
        "You can only delete tasks in your own projects",
      );
    }

    await Task.findByIdAndDelete(taskId);
    return { message: "Task deleted successfully" };
  },

  // Filter tasks by status
  getTasksByStatus: async (projectId, userId, status) => {
    return taskService.getProjectTasks(projectId, userId, {
      status,
      page: 1,
      limit: 100,
    });
  },
};
