import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { createTodo, getTodos, updateTodo, deleteTodo, } from "../controllers/todo.controllers";
import { validateTodo } from "../utils/validators";

const router = Router();

router.use(requireAuth);

router.post("/", validateTodo, createTodo);
router.get("/", getTodos);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
