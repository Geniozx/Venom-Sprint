const API_BASE_URL = "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to complete API request.");
  }

  return data;
}

// Create a unique session for a new game.
export async function createGameRun() {
  return apiRequest("/api/runs", {
    method: "POST"
  });
}

// Submit a completed game's score.
export async function submitGameScore(runId, nickname, score) {
  return apiRequest("/api/scores", {
    method: "POST",
    body: JSON.stringify({
      run_id: runId,
      nickname,
      score
    })
  });
}

// Retrieve the global Top 10 leaderboard.
export async function fetchLeaderboard() {
  return apiRequest("/api/leaderboard");
}
