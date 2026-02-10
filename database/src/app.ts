import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// ===== CORS CONFIG =====
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests explicitly
app.options("*", cors());

// ===== BODY PARSER =====
app.use(express.json());

// ===== HEALTH CHECK =====
app.get("/", (_req, res) => {
  res.status(200).send("API Running");
});

// ===== ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// ===== ERROR HANDLER =====
app.use(errorHandler);

export default app;
