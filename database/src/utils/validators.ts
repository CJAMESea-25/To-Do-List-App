import { Request, Response, NextFunction } from "express";

export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (username.length < 6) {
    return res.status(400).json({ message: "Username must be at least 6 characters" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  next();
};

export const validateTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "Todo title is required" });
  }

  if (title.length < 2) {
    return res.status(400).json({ message: "Todo title is too short" });
  }

  next();
};
