const MIN_MOVE_INTERVAL_MS = 50;
const MAX_POINTS_PER_MOVE = 11;
const TIMING_TOLERANCE_MS = 2000;

export function isScorePlausible(score, startedAt, submittedAt) {
  const elapsedMs =
    new Date(submittedAt).getTime() -
    new Date(startedAt).getTime();

  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
    return false;
  }

  const allowedMs = elapsedMs + TIMING_TOLERANCE_MS;

  const maximumMoves = Math.floor(
    allowedMs / MIN_MOVE_INTERVAL_MS
  );

  const maximumScore = maximumMoves * MAX_POINTS_PER_MOVE;

  return score <= maximumScore;
}
