import { draw } from "./renderer.js";

import {
  createGameRun,
  submitGameScore,
  fetchLeaderboard
} from "./leaderboardApi.js";

import {
  initializeAudio,
  playFoodSound,
  playStartSound,
  playGameOverSound,
  playVictorySound,
  playPauseSound,
  isSoundEnabled,
  setSoundEnabled
} from "./audio.js";

import {
  getHighScore,
  saveHighScore
} from "./storage.js";

import {
  setupKeyboardControls,
  setupMobileControls,
  setupButtonControls,
  setupHelpModal,
  setupSettingsModal
} from "./controls.js";

import {
  createGameState,
  calculateNextSpeed,
  resetGameState,
  startGameTimer,
  runGameTick,
  togglePause,
  finishGame
} from "./game.js";

// Canvas element used for visibility controls
const canvas = document.getElementById("gameBoard");

// Game variables
const game = createGameState();

let highScore = getHighScore();

// Global leaderboard session state
let currentRunId = null;
let isStartingGame = false;
let gameStartRequestId = 0;
let completedRunId = null;

document.getElementById("highScore").innerText =
  `High Score: ${highScore}`;


// Initialize game
function startGame() {
  resetGameState(game);

  document.getElementById("score").innerText =
    `Score: ${game.score}`;

  startGameTimer(game, gameLoop);
}


// Start a new game and synchronize the interface
async function handleStartGame() {
  // Prevent overlapping game-start requests.
  if (isStartingGame) {
    return;
  }

  isStartingGame = true;
  const requestId = ++gameStartRequestId;

  // Invalidate the previous run immediately.
  currentRunId = null;
  completedRunId = null;

  // Stop any previous game while preparing a new session.
  finishGame(game);

  try {
    const run = await createGameRun();

    // Ignore responses from outdated requests.
    if (requestId !== gameStartRequestId) {
      return;
    }

    currentRunId = run.run_id;
  } catch (error) {
    console.warn(
      "Leaderboard unavailable. Starting a local-only game.",
      error
    );

    // The player can still play without leaderboard access.
    currentRunId = null;
  } finally {
    if (requestId === gameStartRequestId) {
      isStartingGame = false;
    }
  }

  if (requestId !== gameStartRequestId) {
    return;
  }

  // Unlock browser audio when the player starts the game.
  initializeAudio().then(() => {
    playStartSound();
  });

  // Hide the previous result screen.
  document.getElementById("resultOverlay").hidden = true;

  // Restore the game controls.
  document.getElementById("controls").inert = false;

  startGame();

  game.gameStarted = true;

  // Hide the splash screen and leaderboard button.
  document.getElementById("splashImage").style.display = "none";
  document.getElementById("startText").style.display = "none";
  document.getElementById("leaderboardBtn").hidden = true;

  // Display the game board.
  canvas.style.display = "block";

  // Reset the Pause button label.
  document.getElementById("pauseBtn").innerText = "Pause";

  // Restore keyboard focus after closing the result dialog.
  document.getElementById("pauseBtn").focus();

  // Update the gameplay status.
  updateGameStatus("playing");
}


// Game loop
function gameLoop() {
    runGameTick(game, {
        onFoodEaten: increaseSpeed,
        onScoreChange: score => {
            document.getElementById("score").innerText = `Score: ${score}`;
        },
        onGameOver: endGame,
        onVictory: handleVictory,
        onRender: draw
    });
}

// Pause or resume the current game
function handlePause() {
  const changed = togglePause(game);

  if (!changed) {
    return;
  }

  // Play the appropriate pause or resume sound.
  playPauseSound(game.isPaused);

  // Update the Pause / Resume button.
  document.getElementById("pauseBtn").innerText =
    game.isPaused ? "Resume" : "Pause";

  // Show the leaderboard button only while paused.
  document.getElementById("leaderboardBtn").hidden =
    !game.isPaused;

  // Update the gameplay status.
  updateGameStatus(game.isPaused ? "paused" : "playing");
}

// Increase speed
function increaseSpeed() {
  // Play food collection sound
  playFoodSound();

  game.gameSpeedDelay = calculateNextSpeed(
    game.gameSpeedDelay
  );

  startGameTimer(game, gameLoop);
}

// End game
function endGame() {
    // Stop the game and reset its lifecycle state
    finishGame(game);

    // Play the game-over sound
    playGameOverSound();

    // Save a new high score if achieved
    if (game.score > highScore) {
        highScore = game.score;
        saveHighScore(highScore);

        document.getElementById("highScore").innerText =
            `High Score: ${highScore}`;
    }

    // Display the game-over overlay
    showResultOverlay(false);

    // Update the gameplay status
    updateGameStatus("game-over");

    // Keep the final game board visible
    document.getElementById("splashImage").style.display = "none";
    document.getElementById("startText").style.display = "none";
    document.getElementById("leaderboardBtn").hidden = true;

    canvas.style.display = "block";

    document.getElementById("pauseBtn").innerText = "Pause";
}


function handleVictory() {
    // Stop the game and reset its lifecycle state
    finishGame(game);

    // Play the victory melody
    playVictorySound();

    // Save a new high score if achieved
    if (game.score > highScore) {
        highScore = game.score;
        saveHighScore(highScore);

        document.getElementById("highScore").innerText =
            `High Score: ${highScore}`;
    }

    // Display the victory overlay
    showResultOverlay(true);

    // Update the gameplay status
    updateGameStatus("victory");

    // Keep the completed board visible
    document.getElementById("splashImage").style.display = "none";
    document.getElementById("startText").style.display = "none";
    document.getElementById("leaderboardBtn").hidden = true;

    canvas.style.display = "block";

    document.getElementById("pauseBtn").innerText = "Pause";
}

// Display the game-over or victory result overlay
function showResultOverlay(hasWon) {
    const overlay = document.getElementById("resultOverlay");
    const title = document.getElementById("resultTitle");
    const message = document.getElementById("resultMessage");
    const score = document.getElementById("resultScore");

    // Update the result content
    title.innerText = hasWon ? "Victory!" : "Game Over";

    message.innerText = hasWon
        ? "You've conquered the entire board!"
        : "Your run has ended. Ready for another?";

    score.innerText = game.score;

    // Preserve the session belonging to this completed game.
    completedRunId = currentRunId;
    currentRunId = null;

    // Prepare the leaderboard submission interface.
    const submissionForm = document.getElementById("scoreSubmissionForm");
    const submissionStatus = document.getElementById("scoreSubmissionStatus");
    const nicknameInput = document.getElementById("playerNickname");
    const submitButton = document.getElementById("submitScoreBtn");

    // Only allow submission when a backend session exists.
    submissionForm.hidden = !completedRunId;

    // Reset the form for the completed run.
    submissionForm.reset();
    submitButton.disabled = false;

    // Clear feedback from previous runs.
    submissionStatus.hidden = true;
    submissionStatus.textContent = "";

    // Prevent automatic keyboard focus on an unavailable form.
    nicknameInput.disabled = !completedRunId;

    // Apply the appropriate visual appearance
    overlay.classList.toggle(
        "result-overlay--victory",
        hasWon
    );

    // Prevent interaction with controls outside the result dialog
    document.getElementById("controls").inert = true;

    // Display the result overlay
    overlay.hidden = false;

    // Move keyboard focus to the primary action
    document.getElementById("playAgainBtn").focus();
}

// Update the gameplay status indicator
function updateGameStatus(status) {
  const statusElement = document.getElementById("gameStatus");
  const statusText = document.getElementById("gameStatusText");

  const statusLabels = {
    ready: "READY",
    playing: "PLAYING",
    paused: "PAUSED",
    "game-over": "GAME OVER",
    victory: "VICTORY"
  };

  // Remove any previous status appearance
  statusElement.classList.remove(
    "game-status--ready",
    "game-status--playing",
    "game-status--paused",
    "game-status--game-over",
    "game-status--victory"
  );

  // Apply the new status appearance
  statusElement.classList.add(`game-status--${status}`);

  // Update the displayed status text
  statusText.textContent = statusLabels[status];
}


setupKeyboardControls(
  () => game.direction,

  (newDirection) => {
    game.direction = newDirection;
    game.directionLocked = true;
  },

  () => game.gameStarted,

  () => {
    // Let the result dialog handle its own keyboard interaction
    if (!document.getElementById("resultOverlay").hidden) {
      return;
    }

    if (!game.gameStarted) {
      handleStartGame();
    } else {
      handlePause();
    }
  },

  () => game.directionLocked
);


// Initialize mobile directional controls
setupMobileControls(
  () => game.direction,

  (newDirection) => {
    game.direction = newDirection;
    game.directionLocked = true;
  },

  () => game.gameStarted,

  () => game.directionLocked
);

setupButtonControls({
  onRestart: handleStartGame,

  onPause: handlePause,

  onEnd: () => {
    if (game.gameStarted) {
      endGame();
    }
  }
});

// Initialize mobile start button
const mobileStartBtn = document.getElementById("mobileStartBtn");

if (mobileStartBtn) {
  mobileStartBtn.addEventListener("click", handleStartGame);
}

setupHelpModal();
setupSettingsModal();

// ========================================
// SOUND TOGGLE
// ========================================

const soundBtn = document.getElementById("soundBtn");

// Keep the sound button synchronized with the saved preference
function updateSoundButton() {
  const enabled = isSoundEnabled();

  soundBtn.textContent = enabled ? "🔊" : "🔇";

  soundBtn.setAttribute(
    "aria-label",
    enabled ? "Mute sound" : "Unmute sound"
  );

  soundBtn.setAttribute(
    "aria-pressed",
    String(!enabled)
  );

  soundBtn.title = enabled ? "Mute sound" : "Unmute sound";
}

// Restore the correct icon when the page loads
updateSoundButton();

// Toggle sound when clicked
soundBtn.addEventListener("click", () => {
  const newSoundState = !isSoundEnabled();

  setSoundEnabled(newSoundState);

  updateSoundButton();
});



// Submit a completed run to the global leaderboard.
document.getElementById("scoreSubmissionForm").addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const nicknameInput = document.getElementById("playerNickname");
    const submitButton = document.getElementById("submitScoreBtn");
    const status = document.getElementById("scoreSubmissionStatus");

    const nickname = nicknameInput.value.trim();
    const runId = completedRunId;
    const finalScore = game.score;

    if (!runId || submitButton.disabled) {
      return;
    }

    if (!/^[A-Za-z0-9_]{3,12}$/.test(nickname)) {
      status.textContent =
        "Nickname must be 3–12 letters, numbers, or underscores.";
      status.hidden = false;
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    status.hidden = false;
    status.textContent = "Submitting your score...";

    try {
      await submitGameScore(runId, nickname, finalScore);

      // Only update the interface if this run is still displayed.
      if (completedRunId !== runId) {
        return;
      }

      completedRunId = null;
      form.hidden = true;

      status.textContent = "Score submitted successfully!";

      // Automatically show the updated Global Top 10.
      openLeaderboard(document.getElementById("playAgainBtn"));
    } catch (error) {
      if (completedRunId !== runId) {
        return;
      }

      status.textContent =
        error.message || "Unable to submit your score.";

      submitButton.disabled = false;
    } finally {
      // Only reset the button if this run still owns the form.
      if (completedRunId === runId) {
        submitButton.textContent = "Submit Score";
      }
    }
  }
);




// Restart the game from the result overlay
document.getElementById("playAgainBtn").addEventListener(
    "click",
    handleStartGame
);

// Keep keyboard focus inside the Game Over dialog.
document.getElementById("resultOverlay").addEventListener(
  "keydown",
  (event) => {
    if (event.key !== "Tab") return;

    const overlay = event.currentTarget;

    const focusableElements = Array.from(
      overlay.querySelectorAll(
        'input:not([disabled]), button:not([disabled])'
      )
    ).filter((element) => element.getClientRects().length > 0);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }
);


// Global leaderboard modal elements
const leaderboardBtn = document.getElementById("leaderboardBtn");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");

let leaderboardReturnFocus = leaderboardBtn;

// Open the leaderboard modal
async function openLeaderboard(returnFocusTo = leaderboardBtn) {
  leaderboardReturnFocus = returnFocusTo;

  leaderboardModal.hidden = false;
  closeLeaderboardBtn.focus();

  const leaderboardStatus =
    document.getElementById("leaderboardStatus");

  const leaderboardTable =
    document.getElementById("leaderboardTable");

  const leaderboardTableBody =
    document.getElementById("leaderboardTableBody");

  leaderboardStatus.hidden = false;
  leaderboardStatus.textContent = "Loading leaderboard...";

  leaderboardTable.hidden = true;
  leaderboardTableBody.replaceChildren();

  try {
    const data = await fetchLeaderboard();
    const scores = data.leaderboard;

    // Don't update the modal if the player already closed it.
    if (leaderboardModal.hidden) {
      return;
    }

    if (!Array.isArray(scores)) {
      throw new Error("Invalid leaderboard response.");
    }

    if (scores.length === 0) {
      leaderboardStatus.textContent =
        "No scores yet. Be the first to join the leaderboard!";
      return;
    }

    scores.slice(0, 10).forEach((player, index) => {
      const row = document.createElement("tr");

      const rankCell = document.createElement("td");
      const nicknameCell = document.createElement("td");
      const scoreCell = document.createElement("td");

      rankCell.textContent = index + 1;
      nicknameCell.textContent = player.nickname;
      scoreCell.textContent = player.score;

      row.append(rankCell, nicknameCell, scoreCell);
      leaderboardTableBody.appendChild(row);
    });

    leaderboardStatus.hidden = true;
    leaderboardTable.hidden = false;
  } catch (error) {
    if (leaderboardModal.hidden) {
      return;
    }

    console.error("Failed to load leaderboard:", error);

    leaderboardStatus.textContent =
      "Unable to load leaderboard. Please try again.";
  }
}

// Open from the splash screen.
leaderboardBtn.addEventListener("click", () => {
  openLeaderboard(leaderboardBtn);
});

// Close the leaderboard and restore keyboard focus.
function closeLeaderboard() {
  leaderboardModal.hidden = true;

  if (leaderboardReturnFocus?.isConnected) {
    leaderboardReturnFocus.focus();
  }
}

// Close using the X button.
closeLeaderboardBtn.addEventListener("click", closeLeaderboard);

// Keep keyboard interaction inside the leaderboard modal.
leaderboardModal.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeLeaderboard();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  // The close button is currently the modal's only focusable control.
  event.preventDefault();
  closeLeaderboardBtn.focus();
});