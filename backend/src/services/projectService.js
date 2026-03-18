// ============================================
// PROJECT SERVICE
// Business logic for projects
// Phase 3: Projects CRUD
// ============================================

import { Project } from "../models/Project.js";
import { createError } from "../utils/errors.js";

export const projectService = {
  // Create project
  createProject: async (title, description, userId) => {
    const project = new Project({
      title,
      description,
      owner: userId,
    });

    await project.save();
    // Populate owner info for response
    await project.populate("owner", "name email");
    return project;
  },

  // Get all projects for user (with search + pagination)
  getUserProjects: async (userId, query = {}) => {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const filter = { owner: userId, status: "active" };
    if (query.search) {
      filter.title = { $regex: query.search, $options: "i" };
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(filter),
    ]);

    return {
      items: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  // Get single project
  getProjectById: async (projectId, userId) => {
    const project = await Project.findById(projectId).populate(
      "owner",
      "name email",
    );

    if (!project) {
      throw createError.notFound("Project not found");
    }

    if (project.owner._id.toString() !== userId) {
      throw createError.forbidden("You can only view your own projects");
    }

    return project;
  },

  // Update project
  updateProject: async (projectId, userId, updates) => {
    const project = await Project.findById(projectId);

    if (!project) {
      throw createError.notFound("Project not found");
    }

    // Verify ownership
    if (project.owner.toString() !== userId) {
      throw createError.forbidden("You can only update your own projects");
    }

    // Update allowed fields
    const allowedUpdates = ["title", "description", "status"];
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        project[field] = updates[field];
      }
    });

    await project.save();
    await project.populate("owner", "name email");
    return project;
  },

  // Delete project
  deleteProject: async (projectId, userId) => {
    const project = await Project.findById(projectId);

    if (!project) {
      throw createError.notFound("Project not found");
    }

    // Verify ownership
    if (project.owner.toString() !== userId) {
      throw createError.forbidden("You can only delete your own projects");
    }

    await Project.findByIdAndDelete(projectId);
    return { message: "Project deleted successfully" };
  },
};
