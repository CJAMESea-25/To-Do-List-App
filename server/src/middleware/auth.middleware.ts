import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

export const requireAuth = (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string; username: string };

    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };

    next(); // IMPORTANT
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};