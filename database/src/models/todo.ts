import { Schema, model, Types } from "mongoose";

const todoSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Todo = model("Todo", todoSchema);
