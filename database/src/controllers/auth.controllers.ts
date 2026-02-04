import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { AuthedRequest } from "../middleware/auth.middleware";

const signToken = (userId: string, username: string) => {
  return jwt.sign(
    { userId, username },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as { username?: string; password?: string };

    const cleanUsername = username?.trim();

    if (!cleanUsername || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (cleanUsername.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ username: cleanUsername });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username: cleanUsername, passwordHash });

    return res.status(201).json({ message: "User registered successfully" });
  } catch {
    return res.status(500).json({ message: "Signup failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as { username?: string; password?: string };
    const cleanUsername = username?.trim();

    if (!cleanUsername || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username: cleanUsername });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = signToken(user._id.toString(), user.username);

    return res.status(200).json({ message: "Login successful", token });
  } catch {
    return res.status(500).json({ message: "Login failed" });
  }
};

export const getMe = async (req: AuthedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId).select("username");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ username: user.username });
  } catch {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const updateUsername = async (req: AuthedRequest, res: Response) => {
  try {
    const { username } = req.body as { username?: string };
    const cleanUsername = username?.trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    const existing = await User.findOne({ username: cleanUsername });
    if (existing) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user!.userId,
      { username: cleanUsername },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    const token = signToken(updatedUser._id.toString(), updatedUser.username);

    return res.status(200).json({
      message: "Username updated",
      token,
      username: updatedUser.username,
    });
  } catch {
    return res.status(500).json({ message: "Failed to update username" });
  }
};

export const changePassword = async (req: AuthedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user!.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Current password is incorrect" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    const token = signToken(user._id.toString(), user.username);

    return res.status(200).json({
      message: "Password updated",
      token,
    });
  } catch {
    return res.status(500).json({ message: "Failed to change password" });
  }
};
