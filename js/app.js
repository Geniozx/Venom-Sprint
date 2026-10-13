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
  startGame();

  game.gameStarted = true;

  // Hide the splash screen
  document.getElementById("splashImage").style.display = "none";
  document.getElementById("startText").style.display = "none";

  // Display the game board
  canvas.style.display = "block";

  // Reset the Pause button label
  document.getElementById("pauseBtn").innerText = "Pause";
}

// Game loop
function gameLoop() {
  runGameTick(game, {
    onFoodEaten: increaseSpeed,

    onScoreChange: (score) => {
      document.getElementById("score").innerText =
        `Score: ${score}`;
    },

    onGameOver: endGame,

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
  // Stop gameplay and reset lifecycle state
  finishGame(game);

  // Display final score
  alert(`Game Over! Final Score: ${game.score}`);

  // Update high score if necessary
  if (game.score > highScore) {
    highScore = game.score;
    saveHighScore(highScore);

    document.getElementById("highScore").innerText =
      `High Score: ${highScore}`;
  }

  // Restore splash screen
  document.getElementById("splashImage").style.display = "block";
  document.getElementById("startText").style.display = "block";

  canvas.style.display = "none";

  // Restore Pause button to its default state
  document.getElementById("pauseBtn").innerText = "Pause";
}

setupKeyboardControls(
  () => game.direction,

  (newDirection) => {
    game.direction = newDirection;
  },

  () => game.gameStarted,

  () => {
    if (!game.gameStarted) {
      handleStartGame();
    } else {
      handlePause();
    }
  }
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