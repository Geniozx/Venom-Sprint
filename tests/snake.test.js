import test from "node:test";
import assert from "node:assert/strict";

import {
  createSnake,
  moveSnake,
  hasCollision
} from "../js/snake.js";

import {
  GRID_WIDTH,
  GRID_HEIGHT
} from "../js/config.js";

test("createSnake initializes the snake at the center", () => {
  const snake = createSnake();

  const expectedX = Math.floor(GRID_WIDTH / 2);
  const expectedY = Math.floor(GRID_HEIGHT / 2);

  assert.deepEqual(snake, [
    {
      x: expectedX,
      y: expectedY
    }
  ]);
});


test("moveSnake moves the snake one square to the right", () => {
  const snake = [{ x: 5, y: 5 }];

  const ateFood = moveSnake(snake, "right", null);

  assert.deepEqual(snake, [
    { x: 6, y: 5 }
  ]);

  assert.equal(ateFood, false);
});


test("moveSnake moves the snake one square to the left", () => {
  const snake = [{ x: 5, y: 5 }];

  const ateFood = moveSnake(snake, "left", null);

  assert.deepEqual(snake, [
    { x: 4, y: 5 }
  ]);

  assert.equal(ateFood, false);
});


test("moveSnake moves the snake one square up", () => {
  const snake = [{ x: 5, y: 5 }];

  const ateFood = moveSnake(snake, "up", null);

  assert.deepEqual(snake, [
    { x: 5, y: 4 }
  ]);

  assert.equal(ateFood, false);
});


test("moveSnake moves the snake one square down", () => {
  const snake = [{ x: 5, y: 5 }];

  const ateFood = moveSnake(snake, "down", null);

  assert.deepEqual(snake, [
    { x: 5, y: 6 }
  ]);

  assert.equal(ateFood, false);
});


test("moveSnake grows the snake when food is eaten", () => {
  const snake = [{ x: 5, y: 5 }];

  const food = { x: 6, y: 5 };

  const ateFood = moveSnake(snake, "right", food);

  assert.deepEqual(snake, [
    { x: 6, y: 5 },
    { x: 5, y: 5 }
  ]);

  assert.equal(ateFood, true);
  assert.equal(snake.length, 2);
});


test("hasCollision detects a collision with the left wall", () => {
  const snake = [{ x: 0, y: 5 }];

  // Move the snake beyond the left boundary
  moveSnake(snake, "left", null);

  assert.deepEqual(snake, [
    { x: -1, y: 5 }
  ]);

  assert.equal(hasCollision(snake), true);
});


test("hasCollision detects a collision with the right wall", () => {
  const snake = [{ x: GRID_WIDTH - 1, y: 5 }];

  // Move beyond the right boundary
  moveSnake(snake, "right", null);

  assert.deepEqual(snake, [
    { x: GRID_WIDTH, y: 5 }
  ]);

  assert.equal(hasCollision(snake), true);
});


test("hasCollision detects a collision with the top wall", () => {
  const snake = [{ x: 5, y: 0 }];

  // Move beyond the top boundary
  moveSnake(snake, "up", null);

  assert.deepEqual(snake, [
    { x: 5, y: -1 }
  ]);

  assert.equal(hasCollision(snake), true);
});


test("hasCollision detects a collision with the bottom wall", () => {
  const snake = [{ x: 5, y: GRID_HEIGHT - 1 }];

  // Move beyond the bottom boundary
  moveSnake(snake, "down", null);

  assert.deepEqual(snake, [
    { x: 5, y: GRID_HEIGHT }
  ]);

  assert.equal(hasCollision(snake), true);
});


test("hasCollision detects when the snake hits its own body", () => {
  const snake = [
    { x: 5, y: 5 }, // Head
    { x: 5, y: 6 },
    { x: 4, y: 6 },
    { x: 4, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 4 }, // Body segment
    { x: 6, y: 4 }  // Tail
  ];

  // Move upward into an occupied body square
  moveSnake(snake, "up", null);

  assert.deepEqual(snake[0], {
    x: 5,
    y: 4
  });

  assert.equal(hasCollision(snake), true);
});