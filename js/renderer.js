import {
    GRID_WIDTH,
    GRID_HEIGHT
} from "./config.js";

// Canvas setup
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

// Calculate grid cell dimensions
const cellWidth = canvas.width / GRID_WIDTH;
const cellHeight = canvas.height / GRID_HEIGHT;

// Draw the game
export function draw(snake, food) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lightgreen";

        ctx.fillRect(
            segment.x * cellWidth,
            segment.y * cellHeight,
            cellWidth,
            cellHeight
        );
    });

    // Draw food only when food is available
    if (food) {
        ctx.fillStyle = "red";

        ctx.fillRect(
            food.x * cellWidth,
            food.y * cellHeight,
            cellWidth,
            cellHeight
        );
    }
}