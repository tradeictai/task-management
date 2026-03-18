import express from "express";
import { taskController } from "../controllers/taskController.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.use(authenticate);

router.get("/:id", taskController.getTaskById);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
