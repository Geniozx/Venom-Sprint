import { Router } from "express";
import pool from "../db/pool.js";
import { submitScoreLimiter } from "../middleware/rateLimiters.js";
import { isScorePlausible } from "../utils/scorePlausibility.js";

const router = Router();

// POST /api/scores
// Validate and submit a completed game run.
router.post("/", submitScoreLimiter, async (req, res) => {
  const { run_id, nickname, score } = req.body ?? {};

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (typeof run_id !== "string" || !uuidPattern.test(run_id)) {
    return res.status(400).json({
      error: "A valid run ID is required."
    });
  }

  const nicknamePattern = /^[A-Za-z0-9_]{3,12}$/;

  if (
    typeof nickname !== "string" ||
    !nicknamePattern.test(nickname)
  ) {
    return res.status(400).json({
      error: "Nickname must be 3–12 letters, numbers, or underscores."
    });
  }

  if (
    !Number.isSafeInteger(score) ||
    score < 0 ||
    score > 1000000
  ) {
    return res.status(400).json({
      error: "Score must be an integer between 0 and 1000000."
    });
  }

  let client;

  try {
    client = await pool.connect();

    await client.query("BEGIN");

    // Lock this run until the transaction finishes.
    const runResult = await client.query(
      `
        SELECT id, status, started_at, expires_at
        FROM game_runs
        WHERE id = $1
        FOR UPDATE
      `,
      [run_id]
    );

    if (runResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Game session not found."
      });
    }

    const run = runResult.rows[0];

    if (run.status !== "active") {
      await client.query("ROLLBACK");

      return res.status(409).json({
        error: "Game session is no longer active."
      });
    }

    if (new Date(run.expires_at).getTime() <= Date.now()) {
      await client.query("ROLLBACK");

      return res.status(410).json({
        error: "Game session has expired."
      });
    }

    // Reject scores that exceed the theoretical gameplay limit.
    const submittedAt = new Date();

    if (!isScorePlausible(score, run.started_at, submittedAt)) {
      await client.query("ROLLBACK");

      return res.status(422).json({
        error: "Score exceeds the plausible gameplay limit."
      });
    }

    // Save the individual run's score.
    const scoreResult = await client.query(
      `
        INSERT INTO leaderboard_scores (nickname, score)
        VALUES ($1, $2)
        RETURNING id, nickname, score, created_at
      `,
      [nickname, score]
    );

    const savedScore = scoreResult.rows[0];

    // Mark this run as completed.
    await client.query(
      `
        UPDATE game_runs
        SET
          status = 'completed',
          completed_at = NOW(),
          score_id = $1
        WHERE id = $2
      `,
      [savedScore.id, run_id]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Score submitted successfully.",
      run_id,
      leaderboard_entry: savedScore
    });

  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Transaction rollback failed:", rollbackError.message);
      }
    }

    console.error("Score submission failed:", error.message);

    return res.status(500).json({
      error: "Unable to submit score."
    });

  } finally {
    if (client) {
      client.release();
    }
  }
});

export default router;
