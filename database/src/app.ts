import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Define allowed origins
const allowedOrigins = [
  "https://to-do-list-app-psi-lemon.vercel.app",
  "https://to-do-list-app-git-main-cjamesea-25s-projects.vercel.app",
  "https://to-do-list-8yp85cgc8-cjamesea-25s-projects.vercel.app",
  "http://localhost:3000"
];

// CRITICAL: Add CORS headers to EVERY response
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "86400");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("✈️ Preflight request handled");
    return res.status(200).end();
  }
  
  next();
});

// Also use cors middleware as backup
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());

// Test endpoints
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "✅ API is running",
    cors: "Enabled",
    timestamp: new Date().toISOString()
  });
});

// Special test endpoint for CORS
app.post("/api/test-cors", (req, res) => {
  console.log("Test CORS POST received:", req.body);
  res.json({
    message: "✅ POST request CORS test successful!",
    yourData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Your routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

export default app;