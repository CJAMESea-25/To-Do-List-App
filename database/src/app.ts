import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

console.log("CORS Configuration:");
console.log("CORS_ORIGIN env:", process.env.CORS_ORIGIN);
console.log("Allowed Origins:", allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    console.log("Incoming origin:", origin);
    
    if (!origin) {
      console.log("No origin header, allowing");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log("Origin allowed:", origin);
      return callback(null, true);
    }

    console.log("Origin blocked:", origin);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use(errorHandler);

export default app;