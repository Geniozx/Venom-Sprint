// Set up keyboard direction controls
export function setupKeyboardControls(
    getDirection,
    setDirection,
    isGameStarted,
    onSpace,
    isDirectionLocked
)   {
    document.addEventListener("keydown", (event) => {
        // Handle Space Bar
if (event.code === "Space") {
        // Allow focused buttons to handle Space naturally
        if (event.target instanceof Element &&
            event.target.closest("button")) {
            return;
        }

        event.preventDefault();

        // Prevent holding Space from repeatedly toggling pause
        if (event.repeat) {
            return;
        }

        onSpace();
        return;
    }

        // Ignore directional input when the game is inactive
        if (!isGameStarted()) {
            return;
        }

        const directionKeys = {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right"
        };

        const newDirection = directionKeys[event.key];

        if (!newDirection) {
            return;
        }

        event.preventDefault();

        // Ignore additional direction changes until the next movement tick
        if (isDirectionLocked()) {
            return;
        }

        const currentDirection = getDirection();

        const oppositeDirections = {
            up: "down",
            down: "up",
            left: "right",
            right: "left"
        };

        // Prevent reversing directly into the snake
        if (newDirection === oppositeDirections[currentDirection]) {
            return;
        }

        setDirection(newDirection);
    });
}

// Set up game button controls
export function setupButtonControls({
    onRestart,
    onPause,
    onEnd
})  {
    const restartBtn = document.getElementById("restartBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const endBtn = document.getElementById("endBtn");

    restartBtn.addEventListener("click", onRestart);

    pauseBtn.addEventListener("click", onPause);

    endBtn.addEventListener("click", onEnd);
}

// Set up Help modal interactions
export function setupHelpModal() {
    const modal = document.getElementById("helpModal");
    const helpBtn = document.getElementById("helpBtn");
    const closeBtn = document.querySelector(".close");

    // Open the Help modal
    helpBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close the Help modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}