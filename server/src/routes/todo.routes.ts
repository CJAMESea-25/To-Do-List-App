import { Router } from "express";
import { Todo } from "../models/todo";
import { requireAuth, AuthedRequest } from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const todo = await Todo.create({
      userId: req.user!.userId,
      title,
      description: description ?? ""
    });

    return res.status(201).json(todo);
  } catch {
    return res.status(500).json({ message: "Failed to create todo" });
  }
});

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const todos = await Todo.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
    return res.status(200).json(todos);
  } catch {
    return res.status(500).json({ message: "Failed to fetch todos" });
  }
});

router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { id } = req.params;
    const update: any = {};

    if (req.body.title !== undefined) update.title = req.body.title;
    if (req.body.description !== undefined) update.description = req.body.description;
    if (req.body.completed !== undefined) update.completed = req.body.completed;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user!.userId }, // important security filter
      update,
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: "Todo not found" });
    return res.status(200).json(todo);
  } catch {
    return res.status(500).json({ message: "Failed to update todo" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user!.userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    return res.status(200).json({ message: "Todo deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete todo" });
  }
});

export default router;