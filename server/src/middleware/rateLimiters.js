import { rateLimit } from "express-rate-limit";

// Limit how frequently a client can create game sessions.
export const createRunLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many game sessions created. Please try again later."
  }
});

// Limit score-submission attempts.
export const submitScoreLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many score submissions. Please try again later."
  }
});
