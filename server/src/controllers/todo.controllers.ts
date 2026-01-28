import { Response } from "express";
import { Todo } from "../models/todo";
import { AuthedRequest } from "../middleware/auth.middleware";

export const createTodo = async (req: AuthedRequest, res: Response) => {
  try {
    const { title, description } = req.body as { title?: string; description?: string };

    if (!title) return res.status(400).json({ message: "Title is required" });

    const todo = await Todo.create({
      userId: req.user!.userId,
      title,
      description: description ?? ""
    });

    return res.status(201).json(todo);
  } catch {
    return res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTodos = async (req: AuthedRequest, res: Response) => {
  try {
    const todos = await Todo.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
    return res.status(200).json(todos);
  } catch {
    return res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const updateTodo = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const update: Record<string, any> = {};

    if (req.body.title !== undefined) update.title = req.body.title;
    if (req.body.description !== undefined) update.description = req.body.description;
    if (req.body.completed !== undefined) update.completed = req.body.completed;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user!.userId },
      update,
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json(todo);
  } catch {
    return res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTodo = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user!.userId });
    if (!todo) return res.status(404).json({ message: "Task not found" });

    return res.status(200).json({ message: "Task deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete task" });
  }
};
