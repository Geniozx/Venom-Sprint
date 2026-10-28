
-- Venom Sprint 2.1
-- Migration 001: Create leaderboard scores table.

CREATE TABLE leaderboard_scores (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nickname VARCHAR(12) NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT leaderboard_nickname_format
        CHECK (nickname ~ '^[A-Za-z0-9_]{3,12}$'),

    CONSTRAINT leaderboard_score_nonnegative
        CHECK (score >= 0)
);

-- Optimize global leaderboard ranking queries.
-- Highest score first, then earliest submission.

CREATE INDEX idx_leaderboard_scores_ranking
ON leaderboard_scores (
    score DESC,
    created_at ASC,
    id ASC
);
