import { commentService } from "../services/commentService.js";
import { successResponse } from "../utils/response.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const commentController = {
  addComment: asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { text } = req.body;

    const comment = await commentService.addComment(
      taskId,
      req.user.userId,
      text,
    );
    successResponse(res, comment, "Comment added successfully", 201);
  }),

  getTaskComments: asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const comments = await commentService.getTaskComments(
      taskId,
      req.user.userId,
    );
    successResponse(res, comments, "Comments fetched successfully");
  }),

  deleteComment: asyncHandler(async (req, res) => {
    const result = await commentService.deleteComment(
      req.params.commentId,
      req.user.userId,
    );
    successResponse(res, result, "Comment deleted successfully");
  }),
};
