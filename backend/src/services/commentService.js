import { Comment } from "../models/Comment.js";
import { Task } from "../models/Task.js";
import { Project } from "../models/Project.js";
import { createError } from "../utils/errors.js";

const ensureTaskAccess = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw createError.notFound("Task not found");
  }

  const project = await Project.findById(task.project);
  if (!project || project.owner.toString() !== userId) {
    throw createError.forbidden(
      "You can only access comments for your own tasks",
    );
  }

  return task;
};

export const commentService = {
  addComment: async (taskId, userId, text) => {
    await ensureTaskAccess(taskId, userId);

    const comment = new Comment({
      task: taskId,
      author: userId,
      text,
    });

    await comment.save();
    await comment.populate("author", "name email");
    return comment;
  },

  getTaskComments: async (taskId, userId) => {
    await ensureTaskAccess(taskId, userId);

    const comments = await Comment.find({ task: taskId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return comments;
  },

  deleteComment: async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw createError.notFound("Comment not found");
    }

    await ensureTaskAccess(comment.task, userId);

    await Comment.findByIdAndDelete(commentId);
    return { message: "Comment deleted successfully" };
  },
};
