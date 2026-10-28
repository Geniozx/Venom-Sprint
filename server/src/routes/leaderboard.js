import { Router } from "express";
import pool from "../db/pool.js";

const router = Router();

// GET /api/leaderboard
// Retrieve the global Top 10 individual game runs.
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        nickname,
        score,
        created_at
      FROM leaderboard_scores
      ORDER BY score DESC, created_at ASC, id ASC
      LIMIT 10
    `);

    res.status(200).json({
      leaderboard: result.rows,
    });
  } catch (error) {
    console.error("Failed to retrieve leaderboard:", error.message);

    res.status(500).json({
      error: "Unable to retrieve leaderboard.",
    });
  }
});

export default router;
