
-- Venom Sprint 2.1
-- Migration 002: Create game run tracking table.

CREATE TABLE game_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    expires_at TIMESTAMPTZ NOT NULL
        DEFAULT (NOW() + INTERVAL '24 hours'),

    completed_at TIMESTAMPTZ,

    status VARCHAR(12) NOT NULL DEFAULT 'active',

    score_id BIGINT UNIQUE
        REFERENCES leaderboard_scores(id),

    CONSTRAINT game_runs_valid_status
        CHECK (status IN ('active', 'completed', 'abandoned')),

    CONSTRAINT game_runs_valid_expiration
        CHECK (expires_at > started_at),

    CONSTRAINT game_runs_valid_completion
        CHECK (
            (status = 'completed'
                AND completed_at IS NOT NULL
                AND score_id IS NOT NULL)
            OR
            (status <> 'completed'
                AND completed_at IS NULL
                AND score_id IS NULL)
        )
);

-- Support queries for active and expired runs.
CREATE INDEX idx_game_runs_active_expiration
ON game_runs (expires_at)
WHERE status = 'active';
