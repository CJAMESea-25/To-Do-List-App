import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// CORS Configuration - Manual headers to guarantee CORS works
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} from origin: ${req.headers.origin}`);
  
  // Set CORS headers for all responses
  const allowedOrigins = [
    "https://to-do-list-app-psi-lemon.vercel.app",
    "https://to-do-list-app-git-main-cjamesea-25s-projects.vercel.app",
    "https://to-do-list-8yp85cgc8-cjamesea-25s-projects.vercel.app"
  ];
  
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
    console.log("[CORS] Handling OPTIONS preflight request");
    return res.status(200).end();
  }
  
  next();
});

// Also use cors package for additional CORS handling
app.use(cors({
  origin: [
    "https://to-do-list-app-psi-lemon.vercel.app",
    "https://to-do-list-app-git-main-cjamesea-25s-projects.vercel.app",
    "https://to-do-list-8yp85cgc8-cjamesea-25s-projects.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());

// Health check endpoint
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "✅ To-Do List API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        updateUsername: "PATCH /api/auth/username",
        changePassword: "PATCH /api/auth/password"
      },
      todos: {
        getAll: "GET /api/todos",
        create: "POST /api/todos",
        update: "PATCH /api/todos/:id",
        delete: "DELETE /api/todos/:id"
      }
    }
  });
});

// Debug endpoint to test CORS and routes
app.get("/api/debug", (req, res) => {
  res.json({
    message: "✅ Debug endpoint is working",
    yourOrigin: req.headers.origin,
    timestamp: new Date().toISOString(),
    routes: {
      auth: ["POST /signup", "POST /login", "GET /me", "PATCH /username", "PATCH /password"],
      todos: ["GET /", "POST /", "PATCH /:id", "DELETE /:id"]
    }
  });
});

// Use your existing routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    availableEndpoints: {
      root: "GET /",
      debug: "GET /api/debug",
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me (requires auth)",
        updateUsername: "PATCH /api/auth/username (requires auth)",
        changePassword: "PATCH /api/auth/password (requires auth)"
      },
      todos: {
        getAll: "GET /api/todos (requires auth)",
        create: "POST /api/todos (requires auth)",
        update: "PATCH /api/todos/:id (requires auth)",
        delete: "DELETE /api/todos/:id (requires auth)"
      }
    }
  });
});

// Error handler
app.use(errorHandler);

export default app;