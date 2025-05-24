import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import moodRoutes from "./routes/mood-routes.js"; // Uncomment this line
import journalRoutes from "./routes/journal-routes.js";

config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: err.message 
  });
});

app.use("/api/v1", appRouter);
app.use("/api/v1/mood", moodRoutes); // Uncomment this line
app.use("/api/v1/journal", journalRoutes);

export default app;
