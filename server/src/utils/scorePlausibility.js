const INITIAL_SPEED_MS = 200;
const MIN_SPEED_MS = 50;
const SPEED_INCREMENT_MS = 3;

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

  let remainingMs = allowedMs;
  let movementIntervalMs = INITIAL_SPEED_MS;
  let maximumScore = 0;

  // Assume food is collected on every movement.
  // This creates a generous theoretical scoring ceiling.
  while (remainingMs >= movementIntervalMs) {
    remainingMs -= movementIntervalMs;
    maximumScore += MAX_POINTS_PER_MOVE;

    movementIntervalMs = Math.max(
      MIN_SPEED_MS,
      movementIntervalMs - SPEED_INCREMENT_MS
    );
  }

  return score <= maximumScore;
}
