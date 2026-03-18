// ============================================
// MAIN EXPRESS APP
// Sets up all middleware and routes
// ============================================

import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/database.js";
import { connectRedis } from "./config/redis.js";
import { errorHandler, asyncHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import taskItemRoutes from "./routes/taskItemRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow frontend to communicate
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// ============================================
// TEST ROUTE
// ============================================

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// ============================================
// API ROUTES
// ============================================

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
// Task routes nested under projects
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/tasks", taskItemRoutes);
app.use("/api/tasks/:taskId/comments", commentRoutes);

// ============================================
// ERROR HANDLING
// Must be last middleware
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    data: null,
    message: "Route not found",
  });
});

app.use(errorHandler);

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Connect to databases
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
