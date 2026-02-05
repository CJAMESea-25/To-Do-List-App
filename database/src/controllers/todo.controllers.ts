import { Response } from "express";
import { Todo } from "../models/todo";
import { AuthedRequest } from "../middleware/auth.middleware";

type TodoStatus = "not_started" | "in_progress" | "completed";
const ALLOWED_STATUS: TodoStatus[] = ["not_started", "in_progress", "completed"];

export const createTodo = async (req: AuthedRequest, res: Response) => {
  try {
    const { title, description, status, dueDate, category } = req.body as {
      title?: string;
      description?: string;
      status?: TodoStatus;
      dueDate?: string | null;
      category?: string;
    };

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (status && !ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (dueDate !== undefined && dueDate !== null && typeof dueDate !== "string") {
      return res.status(400).json({ message: "Invalid dueDate" });
    }

    if (category !== undefined && typeof category !== "string") {
      return res.status(400).json({ message: "Invalid category" });
    }

    const todo = await Todo.create({
      userId: req.user!.userId,
      title: title.trim(),
      description: description ?? "",
      status: status ?? "not_started",
      dueDate: dueDate ?? null,
      category: category ?? "",
    });

    return res.status(201).json(todo);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTodos = async (req: AuthedRequest, res: Response) => {
  try {
    const todos = await Todo.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
    return res.status(200).json(todos);
  } catch (err) {
    return res.status(500).json({ message: "Failed to access task" });
  }
};

export const updateTodo = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { title, description, status, dueDate, category } = req.body as {
      title?: string;
      description?: string;
      status?: TodoStatus;
      dueDate?: string | null;
      category?: string;
    };

    // validate status if provided
    if (status !== undefined && !ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const update: Record<string, any> = {};

    if (title !== undefined) update.title = String(title).trim();
    if (description !== undefined) update.description = String(description);
    if (status !== undefined) update.status = status;

    if (dueDate !== undefined) {
      if (dueDate === null) update.dueDate = null;
      else if (typeof dueDate === "string") update.dueDate = String(dueDate);
      else return res.status(400).json({ message: "Invalid dueDate" });
    }

    if (category !== undefined) update.category = String(category);

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user!.userId },
      update,
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTodo = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user!.userId });
    if (!todo) return res.status(404).json({ message: "Task not found" });

    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete task" });
  }
};
