import { draw } from "./renderer.js";

import {
  getHighScore,
  saveHighScore
} from "./storage.js";

import {
  setupKeyboardControls,
  setupButtonControls,
  setupHelpModal
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
function handleStartGame() {
  // Hide the previous result screen
  document.getElementById("resultOverlay").hidden = true;

  // Restore the game controls
  document.getElementById("controls").inert = false;

  startGame();

  game.gameStarted = true;

  // Hide the splash screen
  document.getElementById("splashImage").style.display = "none";
  document.getElementById("startText").style.display = "none";

  // Display the game board
  canvas.style.display = "block";

  // Reset the Pause button label
  document.getElementById("pauseBtn").innerText = "Pause";

  // Restore keyboard focus after closing the result dialog
  document.getElementById("pauseBtn").focus();

  // Update the gameplay status
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

  document.getElementById("pauseBtn").innerText =
    game.isPaused ? "Resume" : "Pause";

  // Update the gameplay status
  updateGameStatus(game.isPaused ? "paused" : "playing");
}

// Increase speed
function increaseSpeed() {
  game.gameSpeedDelay = calculateNextSpeed(
    game.gameSpeedDelay
  );

  startGameTimer(game, gameLoop);
}

// End game
function endGame() {
    // Stop the game and reset its lifecycle state
    finishGame(game);

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

    canvas.style.display = "block";

    document.getElementById("pauseBtn").innerText = "Pause";
}


function handleVictory() {
    // Stop the game and reset its lifecycle state
    finishGame(game);

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

setupButtonControls({
  onRestart: handleStartGame,

  onPause: handlePause,

  onEnd: () => {
    if (game.gameStarted) {
      endGame();
    }
  }
});

setupHelpModal();

// Restart the game from the result overlay
document.getElementById("playAgainBtn").addEventListener(
    "click",
    handleStartGame
);

// Keep keyboard focus inside the result dialog
document.getElementById("resultOverlay").addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Tab") {
      event.preventDefault();

      document.getElementById("playAgainBtn").focus();
    }
  }
);