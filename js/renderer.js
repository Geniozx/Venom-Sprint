import {
    GRID_WIDTH,
    GRID_HEIGHT
} from "./config.js";

import { getSettings } from "./settings.js";

// Canvas setup
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

// Calculate grid cell dimensions
const cellWidth = canvas.width / GRID_WIDTH;
const cellHeight = canvas.height / GRID_HEIGHT;

function drawBoardBackground() {
    // Draw the dark arcade background
    ctx.fillStyle = "#080b12";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Respect the player's grid visibility preference
    if (!getSettings().showGrid) {
        return;
    }

    // Draw subtle grid lines
    ctx.save();

    ctx.strokeStyle = "rgba(168, 85, 247, 0.10)";
    ctx.lineWidth = 1;

    ctx.beginPath();

    // Vertical grid lines
    for (let column = 1; column < GRID_WIDTH; column++) {
        const x = column * cellWidth;

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    // Horizontal grid lines
    for (let row = 1; row < GRID_HEIGHT; row++) {
        const y = row * cellHeight;

        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();

    ctx.restore();
}

function drawSnakeHead(head, direction) {
    const x = head.x * cellWidth;
    const y = head.y * cellHeight;

    const padding = cellWidth * 0.08;
    const size = cellWidth - padding * 2;

    // Neon head
    ctx.save();

    // Apply glow only when Visual Effects is enabled
    if (getSettings().visualEffects) {
        ctx.shadowColor = "rgba(57, 255, 136, 0.95)";
        ctx.shadowBlur = cellWidth * 1.2;
    }

    ctx.fillStyle = "#39ff88";

    ctx.beginPath();

    ctx.roundRect(
        x + padding,
        y + padding,
        size,
        cellHeight - padding * 2,
        cellWidth * 0.25
    );

    ctx.fill();

    // Prevent the glow from affecting the snake's eyes
    ctx.restore();

    // Eyes
    ctx.fillStyle = "#080b12";

    const eyeRadius = cellWidth * 0.07;

    let eyes;

    switch (direction) {
        case "up":
            eyes = [
                [0.3, 0.3],
                [0.7, 0.3]
            ];
            break;

        case "down":
            eyes = [
                [0.3, 0.7],
                [0.7, 0.7]
            ];
            break;

        case "left":
            eyes = [
                [0.3, 0.3],
                [0.3, 0.7]
            ];
            break;

        case "right":
        default:
            eyes = [
                [0.7, 0.3],
                [0.7, 0.7]
            ];
    }

    eyes.forEach(([offsetX, offsetY]) => {
        ctx.beginPath();

        ctx.arc(
            x + cellWidth * offsetX,
            y + cellHeight * offsetY,
            eyeRadius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}


// Draw the game
export function draw(snake, food, direction = "right") {
    // Draw the arcade board background and grid
    drawBoardBackground();

    snake.forEach((segment, index) => {
        if (index === 0) {
            drawSnakeHead(segment, direction);
            return;
        }

        // Preserve existing body rendering for Phase 5.1B
        // Draw rounded snake body segments
        const x = segment.x * cellWidth;
        const y = segment.y * cellHeight;

        const padding = cellWidth * 0.08;

        const width = cellWidth - padding * 2;
        const height = cellHeight - padding * 2;

        // Subtle neon glow
        ctx.save();

        if (getSettings().visualEffects) {
            ctx.shadowColor = "rgba(57, 255, 136, 0.85)";
            ctx.shadowBlur = cellWidth * 0.9;
        }

        // Draw rounded snake body segments
        ctx.fillStyle = "#25cc70";

        ctx.beginPath();

        ctx.roundRect(
            x + padding,
            y + padding,
            width,
            height,
            cellWidth * 0.2
        );

        ctx.fill();

        // Restore Canvas settings so the glow doesn't affect other elements
        ctx.restore();
    });

    // Draw food only when food is available
    if (food) {
        // Calculate the center of the food's grid cell
        const centerX = (food.x + 0.5) * cellWidth;
        const centerY = (food.y + 0.5) * cellHeight;

        // Keep the food centered and proportional to the grid
        const radius = Math.min(cellWidth, cellHeight) * 0.325;

        // Isolate the glow from other Canvas elements
        ctx.save();

        // Add a soft purple halo when Visual Effects are enabled
        if (getSettings().visualEffects) {
            const glowRadius = radius * 2.5;

            const glow = ctx.createRadialGradient(
                centerX,
                centerY,
                radius * 0.5,
                centerX,
                centerY,
                glowRadius
            );

            glow.addColorStop(0, "rgba(168, 85, 247, 0.52)");
            glow.addColorStop(0.45, "rgba(168, 85, 247, 0.19)");
            glow.addColorStop(1, "rgba(168, 85, 247, 0)");

            ctx.fillStyle = glow;

            ctx.beginPath();

            ctx.arc(
                centerX,
                centerY,
                glowRadius,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        // Purple neon glow
        if (getSettings().visualEffects) {
            ctx.shadowColor = "rgba(168, 85, 247, 0.95)";
            ctx.shadowBlur = Math.min(cellWidth, cellHeight) * 1.3;
        }

        // Draw the circular food
        ctx.fillStyle = "#a855f7";

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Restore previous Canvas settings
        ctx.restore();
    }
}