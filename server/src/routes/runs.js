import { Router } from "express";
import pool from "../db/pool.js";
import { createRunLimiter } from "../middleware/rateLimiters.js";

const router = Router();

// POST /api/runs
// Register a new game session.
router.post("/", createRunLimiter, async (req, res) => {
  try {
    const result = await pool.query(`
      INSERT INTO game_runs DEFAULT VALUES
      RETURNING id, started_at, expires_at, status
    `);

    const run = result.rows[0];

    res.status(201).json({
      run_id: run.id,
      started_at: run.started_at,
      expires_at: run.expires_at,
      status: run.status
    });
  } catch (error) {
    console.error("Failed to create game run:", error.message);

    res.status(500).json({
      error: "Unable to create game session."
    });
  }
});

export default router;
