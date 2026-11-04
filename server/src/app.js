import express from "express";
import cors from "cors";
import pool from "./db/pool.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import runRoutes from "./routes/runs.js";
import scoreRoutes from "./routes/scores.js";

const app = express();

// Trust Render's immediate reverse proxy.
app.set("trust proxy", 1);

// Allow requests from local development and GitHub Pages.
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://geniozx.github.io"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "venom-sprint-api",
    version: "1.0.0",
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(503).json({
      status: "error",
      database: "unavailable",
    });
  }
});

// Global leaderboard routes
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/runs", runRoutes);
app.use("/api/scores", scoreRoutes);

export default app;
