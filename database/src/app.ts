import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") ?? [],
  credentials: true
}));

app.use(express.json());

app.get("/", (_req, res) => res.send("API Running"));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use(errorHandler);

export default app;
