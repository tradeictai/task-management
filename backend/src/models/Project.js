// ============================================
// PROJECT MODEL
// Phase 3: Projects CRUD
// ============================================

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // We'll add collaborators in Phase 6+
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries (important for scaling)
projectSchema.index({ owner: 1, status: 1 });

export const Project = mongoose.model("Project", projectSchema);
