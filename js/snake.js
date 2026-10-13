import {
    GRID_WIDTH,
    GRID_HEIGHT
} from "./config.js";

// Create a new snake at the center of the board
export function createSnake() {
    return [
        {
            x: Math.floor(GRID_WIDTH / 2),
            y: Math.floor(GRID_HEIGHT / 2)
        }
    ];
}

// Move the snake one grid square
export function moveSnake(snake, direction, food) {
    const head = { ...snake[0] };

    switch (direction) {
        case "right":
            head.x++;
            break;

        case "left":
            head.x--;
            break;

        case "up":
            head.y--;
            break;

        case "down":
            head.y++;
            break;
    }

    // Add the new head position
    snake.unshift(head);

    // Check whether the snake ate food
    const ateFood = food !== null &&
        head.x === food.x &&
        head.y === food.y;

    // Remove the tail unless food was eaten
    if (!ateFood) {
        snake.pop();
    }

    return ateFood;
}


// Check whether the snake has hit a wall or itself
export function hasCollision(snake) {
    const head = snake[0];

    // Check wall collisions
    const hitWall =
        head.x < 0 ||
        head.x >= GRID_WIDTH ||
        head.y < 0 ||
        head.y >= GRID_HEIGHT;

    if (hitWall) {
        return true;
    }

    // Check self-collisions
    return snake.slice(1).some((segment) => {
        return segment.x === head.x && segment.y === head.y;
    });
}