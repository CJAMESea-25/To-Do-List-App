import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

const allowedOrigins = [
  'https://to-do-list-app-psi-lemon.vercel.app',
  'https://to-do-list-app-git-main-cjamesea-25s-projects.vercel.app',
  'https://to-do-list-8yp85cgc8-cjamesea-25s-projects.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log(`CORS blocked: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); 

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ 
    message: "API Running",
    corsEnabled: true,
    allowedOrigins: allowedOrigins
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use(errorHandler);

export default app;