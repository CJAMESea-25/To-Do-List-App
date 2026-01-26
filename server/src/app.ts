import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("API Running"));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

export default app;
