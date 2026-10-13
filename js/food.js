import {
    GRID_WIDTH,
    GRID_HEIGHT
} from "./config.js";

// Generate food in an unoccupied grid square
export function generateFood(snake) {
    const availableCells = [];

    // Find every grid square not occupied by the snake
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const occupied = snake.some(
                (segment) => segment.x === x && segment.y === y
            );

            if (!occupied) {
                availableCells.push({ x, y });
            }
        }
    }

    // No available cells means the board is full
    if (availableCells.length === 0) {
        return null;
    }

    // Select a random available square
    const randomIndex = Math.floor(
        Math.random() * availableCells.length
    );

    return availableCells[randomIndex];
}