import express from "express";
import pool from "./db/pool.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import runRoutes from "./routes/runs.js";
import scoreRoutes from "./routes/scores.js";

const app = express();

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
