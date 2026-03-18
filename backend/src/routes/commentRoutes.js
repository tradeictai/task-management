import express from "express";
import { authenticate } from "../middleware/authentication.js";
import { commentController } from "../controllers/commentController.js";

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router.post("/", commentController.addComment);
router.get("/", commentController.getTaskComments);
router.delete("/:commentId", commentController.deleteComment);

export default router;
