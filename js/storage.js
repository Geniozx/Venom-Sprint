// Venom-Sprint 2.0 high-score storage

const HIGH_SCORE_KEY = "venomSprint_v2_highScore";

// Retrieve the saved high score
export function getHighScore() {
    const savedScore = localStorage.getItem(HIGH_SCORE_KEY);

    const parsedScore = Number(savedScore);

    return Number.isSafeInteger(parsedScore) && parsedScore >= 0
        ? parsedScore
        : 0;
}

// Save a new high score
export function saveHighScore(score) {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
}