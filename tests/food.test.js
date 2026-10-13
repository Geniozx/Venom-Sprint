import test from "node:test";
import assert from "node:assert/strict";

import { generateFood } from "../js/food.js";

import {
  GRID_WIDTH,
  GRID_HEIGHT
} from "../js/config.js";

test("generateFood places food on an unoccupied square", () => {
  const snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ];

  const food = generateFood(snake);

  // Food should exist when the board has available cells
  assert.notEqual(food, null);

  // Food must remain within the game board
  assert.ok(food.x >= 0 && food.x < GRID_WIDTH);
  assert.ok(food.y >= 0 && food.y < GRID_HEIGHT);

  // Food must not overlap any snake segment
  const overlapsSnake = snake.some(
    (segment) => segment.x === food.x && segment.y === food.y
  );

  assert.equal(overlapsSnake, false);
});


test("generateFood returns null when the board is full", () => {
  const snake = [];

  // Occupy every square on the board
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      snake.push({ x, y });
    }
  }

  const food = generateFood(snake);

  assert.equal(food, null);
});


