import {
    INITIAL_SPEED,
    MIN_SPEED,
    SPEED_INCREMENT
} from "./config.js";

import {
    createSnake,
    moveSnake,
    hasCollision
} from "./snake.js";

import { generateFood } from "./food.js";

// Create the initial game state
export function createGameState() {
    return {
        snake: [],
        food: null,
        score: 0,
        direction: "right",
        directionLocked: false,
        gameInterval: null,
        gameSpeedDelay: INITIAL_SPEED,
        isPaused: false,
        gameStarted: false
    };
}

// Calculate the next game speed
export function calculateNextSpeed(currentSpeed) {
    return Math.max(
        MIN_SPEED,
        currentSpeed - SPEED_INCREMENT
    );
}

// Reset the game state for a new session
export function resetGameState(game) {
    game.snake = createSnake();
    game.food = generateFood(game.snake);
    game.score = 0;
    game.direction = "right";
    game.directionLocked = false;
    game.gameSpeedDelay = INITIAL_SPEED;
    game.isPaused = false;
}


// Update the game by one movement tick
export function updateGame(game) {
    const ateFood = moveSnake(
        game.snake,
        game.direction,
        game.food
    );

    // Allow another direction change after this movement
    game.directionLocked = false;

    // Check collisions before awarding points
    if (hasCollision(game.snake)) {
        return {
        moveSucceeded: false,
        ateFood: false
        };
    }

    // Award one point for each valid movement
    game.score += 1;

    if (ateFood) {
        // Award ten additional points for food
        game.score += 10;

        // Generate new food
        game.food = generateFood(game.snake);
    }

    // The player wins when the snake fills the board
    const hasWon = ateFood && game.food === null;

    return {
        moveSucceeded: true,
        ateFood,
        hasWon
    };
}


// Start or restart the game timer
export function startGameTimer(game, onTick) {
    // Prevent multiple intervals from running simultaneously
    stopGameTimer(game);

    game.gameInterval = setInterval(
        onTick,
        game.gameSpeedDelay
    );
}

// Stop the game timer
export function stopGameTimer(game) {
    if (game.gameInterval !== null) {
        clearInterval(game.gameInterval);
        game.gameInterval = null;
    }
}


// Run one gameplay tick
export function runGameTick(
    game,
    { onFoodEaten, onScoreChange, onGameOver, onVictory, onRender }
) {
    // Do nothing while paused
    if (game.isPaused) {
        return;
    }

    // Update movement, collision detection, and scoring
    const result = updateGame(game);

    // End the game if the snake collided
    if (!result.moveSucceeded) {
        onGameOver();
        return;
    }

    // Increase difficulty when food is eaten
    if (result.ateFood) {
        onFoodEaten();
    }

    // Notify the application that the score changed
    onScoreChange(game.score);

    // Notify the application that the board needs rendering
    onRender(game.snake, game.food, game.direction);

    // End the session when the player fills the board
    if (result.hasWon) {
        onVictory();
        return;
    }
}


// Toggle between paused and playing
export function togglePause(game) {
  if (!game.gameStarted) {
    return false;
  }

  game.isPaused = !game.isPaused;

  return true;
}


// Finish the current game session
export function finishGame(game) {
    // Stop the active game timer
    stopGameTimer(game);

    // Reset lifecycle state
    game.gameStarted = false;
    game.isPaused = false;
}
