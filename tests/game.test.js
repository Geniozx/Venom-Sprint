import test from "node:test";
import assert from "node:assert/strict";

import {
  createGameState,
  resetGameState,
  updateGame,
  togglePause,
  finishGame,
  startGameTimer,
  stopGameTimer,
  runGameTick,
  calculateNextSpeed
} from "../js/game.js";

import {
  GRID_WIDTH,
  GRID_HEIGHT,
  INITIAL_SPEED,
  MIN_SPEED,
  SPEED_INCREMENT
} from "../js/config.js";

test("updateGame awards one point for a successful movement", () => {
  const game = createGameState();

  // Set up a predictable game state
  game.snake = [{ x: 5, y: 5 }];
  game.direction = "right";
  game.food = { x: 10, y: 10 };
  game.score = 0;

  // Advance the game by one movement tick
  const result = updateGame(game);

  // Verify the snake moved correctly
  assert.deepEqual(game.snake, [
    { x: 6, y: 5 }
  ]);

  // Verify the score increased by exactly one point
  assert.equal(game.score, 1);

  // Verify the movement was successful
  assert.equal(result.moveSucceeded, true);

  // Verify no food was consumed
  assert.equal(result.ateFood, false);

  // Verify the game was not won
  assert.equal(result.hasWon, false);
});


test("updateGame awards eleven points when food is eaten", () => {
  const game = createGameState();

  // Set up a predictable game state
  game.snake = [{ x: 5, y: 5 }];
  game.direction = "right";
  game.food = { x: 6, y: 5 };
  game.score = 0;

  // Advance the game by one movement tick
  const result = updateGame(game);

  // Verify the snake moved onto the food
  assert.deepEqual(game.snake, [
    { x: 6, y: 5 },
    { x: 5, y: 5 }
  ]);

  // Verify the score includes movement and food bonuses
  assert.equal(game.score, 11);

  // Verify food was consumed
  assert.equal(result.moveSucceeded, true);
  assert.equal(result.ateFood, true);

  // Verify new food was generated
  assert.notEqual(game.food, null);

  // Verify the game was not won
  assert.equal(result.hasWon, false);
});


test("updateGame does not award points after a collision", () => {
  const game = createGameState();

  // Position the snake against the right wall
  game.snake = [
    { x: GRID_WIDTH - 1, y: 5 }
  ];

  game.direction = "right";
  game.food = { x: 5, y: 5 };
  game.score = 25;

  // Move beyond the right boundary
  const result = updateGame(game);

  // Verify the movement failed
  assert.equal(result.moveSucceeded, false);

  // Verify no food was consumed
  assert.equal(result.ateFood, false);

  // Verify the score remains unchanged
  assert.equal(game.score, 25);
});


test("updateGame detects victory when the snake fills the board", () => {
  const game = createGameState();

  const finalFood = { x: 0, y: 0 };

  // Fill every square except the final food location
  const snake = [];

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (x === finalFood.x && y === finalFood.y) {
        continue;
      }

      snake.push({ x, y });
    }
  }

  // Ensure the snake's head is next to the final food
  const headIndex = snake.findIndex(
    (segment) => segment.x === 1 && segment.y === 0
  );

  const [head] = snake.splice(headIndex, 1);
  snake.unshift(head);

  game.snake = snake;
  game.food = finalFood;
  game.direction = "left";
  game.score = 0;

  const result = updateGame(game);

  assert.equal(result.moveSucceeded, true);
  assert.equal(result.ateFood, true);
  assert.equal(result.hasWon, true);

  assert.equal(game.snake.length, GRID_WIDTH * GRID_HEIGHT);
  assert.equal(game.food, null);
  assert.equal(game.score, 11);
});


test("resetGameState restores the initial gameplay settings", () => {
  const game = createGameState();

  // Simulate a game that has already been played
  game.snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ];

  game.score = 125;
  game.direction = "up";
  game.directionLocked = true;
  game.gameSpeedDelay = 50;
  game.isPaused = true;

  // Restart the game
  resetGameState(game);

  // Verify the gameplay settings were restored
  assert.equal(game.score, 0);
  assert.equal(game.direction, "right");
  assert.equal(game.directionLocked, false);
  assert.equal(game.isPaused, false);

  // Verify the snake was reset to one segment
  assert.equal(game.snake.length, 1);

  // Verify new food was generated
  assert.notEqual(game.food, null);

  // Verify food does not overlap the snake
  const overlapsSnake = game.snake.some(
    (segment) =>
      segment.x === game.food.x &&
      segment.y === game.food.y
  );

  assert.equal(overlapsSnake, false);
});


test("resetGameState restores the initial game speed", () => {
  const game = createGameState();

  // Simulate a game that has increased in difficulty
  game.gameSpeedDelay = 50;

  // Restart the game
  resetGameState(game);

  // Verify the original speed was restored
  assert.equal(game.gameSpeedDelay, INITIAL_SPEED);
});


test("togglePause pauses an active game", () => {
  const game = createGameState();

  // Simulate an active game
  game.gameStarted = true;
  game.isPaused = false;

  // Pause the game
  const changed = togglePause(game);

  // Verify the pause operation succeeded
  assert.equal(changed, true);

  // Verify the game is now paused
  assert.equal(game.isPaused, true);

  // Verify the game session remains active
  assert.equal(game.gameStarted, true);
});


test("togglePause resumes a paused game", () => {
  const game = createGameState();

  // Simulate an active but paused game
  game.gameStarted = true;
  game.isPaused = true;

  // Resume the game
  const changed = togglePause(game);

  // Verify the operation succeeded
  assert.equal(changed, true);

  // Verify the game is no longer paused
  assert.equal(game.isPaused, false);

  // Verify the game session remains active
  assert.equal(game.gameStarted, true);
});


test("togglePause does not pause an inactive game", () => {
  const game = createGameState();

  // Simulate a game that has not started
  game.gameStarted = false;
  game.isPaused = false;

  // Attempt to pause the inactive game
  const changed = togglePause(game);

  // Verify the operation was rejected
  assert.equal(changed, false);

  // Verify the game remains unpaused
  assert.equal(game.isPaused, false);

  // Verify the game remains inactive
  assert.equal(game.gameStarted, false);
});


test("finishGame ends the active game and clears its timer", () => {
  const game = createGameState();

  // Simulate an active, paused game
  game.gameStarted = true;
  game.isPaused = true;

  // Create an active timer
  game.gameInterval = setInterval(() => {}, 1000);

  try {
    // End the game
    finishGame(game);

    // Verify the game is no longer active
    assert.equal(game.gameStarted, false);

    // Verify the paused state was cleared
    assert.equal(game.isPaused, false);

    // Verify the timer reference was cleared
    assert.equal(game.gameInterval, null);
  } finally {
    // Ensure the timer is cleaned up even if an assertion fails
    if (game.gameInterval !== null) {
      clearInterval(game.gameInterval);
    }
  }
});


test("startGameTimer schedules gameplay ticks", (t) => {
  // Replace real timers with controlled mock timers
  t.mock.timers.enable({ apis: ["setInterval"] });

  const game = createGameState();

  game.gameSpeedDelay = 100;

  let tickCount = 0;

  try {
    // Start the game timer
    startGameTimer(game, () => {
      tickCount += 1;
    });

    // Verify a timer was created
    assert.notEqual(game.gameInterval, null);

    // Advance time by 300 milliseconds
    t.mock.timers.tick(300);

    // Verify the callback ran three times
    assert.equal(tickCount, 3);
  } finally {
    // Clean up the timer
    stopGameTimer(game);
  }

  // Verify the timer reference was cleared
  assert.equal(game.gameInterval, null);
});



test("stopGameTimer prevents additional gameplay ticks", (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });

  const game = createGameState();

  game.gameSpeedDelay = 100;

  let tickCount = 0;

  try {
    // Start the timer
    startGameTimer(game, () => {
      tickCount += 1;
    });

    // Allow two ticks
    t.mock.timers.tick(200);

    assert.equal(tickCount, 2);

    // Stop the timer
    stopGameTimer(game);

    assert.equal(game.gameInterval, null);

    // Advance another 500 milliseconds
    t.mock.timers.tick(500);

    // No additional ticks should occur
    assert.equal(tickCount, 2);
  } finally {
    stopGameTimer(game);
  }
});



test("runGameTick does not update gameplay while paused", () => {
  const game = createGameState();

  // Create a valid gameplay state
  game.snake = [{ x: 5, y: 5 }];
  game.direction = "right";
  game.food = { x: 10, y: 10 };
  game.score = 25;

  // Pause the game
  game.gameStarted = true;
  game.isPaused = true;

  // Track whether any callbacks execute
  let callbackCount = 0;

  const callbacks = {
    onFoodEaten: () => callbackCount++,
    onScoreChange: () => callbackCount++,
    onGameOver: () => callbackCount++,
    onVictory: () => callbackCount++,
    onRender: () => callbackCount++
  };

  // Attempt to process a gameplay tick
  runGameTick(game, callbacks);

  // Verify the snake did not move
  assert.deepEqual(game.snake, [{ x: 5, y: 5 }]);

  // Verify the score did not change
  assert.equal(game.score, 25);

  // Verify no callbacks executed
  assert.equal(callbackCount, 0);

  // Verify the game remains paused
  assert.equal(game.isPaused, true);
});



test("updateGame unlocks direction after a movement tick", () => {
  const game = createGameState();

  // Set up a valid gameplay state
  game.snake = [{ x: 5, y: 5 }];
  game.direction = "right";
  game.food = { x: 10, y: 10 };

  // Simulate a direction change before the tick
  game.directionLocked = true;

  // Process one movement tick
  const result = updateGame(game);

  // Verify movement succeeded
  assert.equal(result.moveSucceeded, true);

  // Verify the snake moved right
  assert.deepEqual(game.snake[0], { x: 6, y: 5 });

  // Verify direction is unlocked for the next input
  assert.equal(game.directionLocked, false);
});



test("calculateNextSpeed accelerates without exceeding the speed limit", () => {
  // Verify normal acceleration
  const nextSpeed = calculateNextSpeed(INITIAL_SPEED);

  assert.equal(
    nextSpeed,
    Math.max(MIN_SPEED, INITIAL_SPEED - SPEED_INCREMENT)
  );

  // Verify the minimum movement delay is respected
  const minimumSpeed = calculateNextSpeed(MIN_SPEED);

  assert.equal(minimumSpeed, MIN_SPEED);

  // Verify repeated acceleration cannot go below the limit
  let currentSpeed = INITIAL_SPEED;

  for (let i = 0; i < 100; i++) {
    currentSpeed = calculateNextSpeed(currentSpeed);
  }

  assert.equal(currentSpeed, MIN_SPEED);
});