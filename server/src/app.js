
import express from "express";

const app = express();

// Parse incoming JSON requests.
app.use(express.json());

// Health check endpoint.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "venom-sprint-api",
    version: "1.0.0",
  });
});

export default app;
