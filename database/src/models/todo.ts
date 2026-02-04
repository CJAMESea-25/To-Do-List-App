import { Schema, model, Types } from "mongoose";

const todoSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      required: true,
    },

    category: { type: String, default: "", trim: true },

    dueDate: { type: String, default: null },
  },
  { timestamps: true }
);

export const Todo = model("Todo", todoSchema);
