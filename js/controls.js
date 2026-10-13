// Validate and apply a direction change
export function changeDirection(
    newDirection,
    getDirection,
    setDirection,
    isGameStarted,
    isDirectionLocked
) {
    // Ignore direction changes when the game is inactive
    if (!isGameStarted()) {
        return;
    }

    // Prevent multiple direction changes during one movement tick
    if (isDirectionLocked()) {
        return;
    }

    const oppositeDirections = {
        up: "down",
        down: "up",
        left: "right",
        right: "left"
    };

    // Ignore invalid directions
    if (!Object.hasOwn(oppositeDirections, newDirection)) {
        return;
    }

    const currentDirection = getDirection();

    // Prevent reversing directly into the snake
    if (newDirection === oppositeDirections[currentDirection]) {
        return;
    }

    setDirection(newDirection);
}

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

        // Apply shared direction validation
        changeDirection(
            newDirection,
            getDirection,
            setDirection,
            isGameStarted,
            isDirectionLocked
        );
    });
}


// Set up mobile directional controls
export function setupMobileControls(
    getDirection,
    setDirection,
    isGameStarted,
    isDirectionLocked
) {
    const mobileControls = document.getElementById("mobileControls");

    if (!mobileControls) {
        return;
    }

    mobileControls.addEventListener("click", (event) => {
        const button = event.target.closest("[data-direction]");

        if (!button || !mobileControls.contains(button)) {
            return;
        }

        const newDirection = button.dataset.direction;

        // Reuse the same validation as keyboard controls
        changeDirection(
            newDirection,
            getDirection,
            setDirection,
            isGameStarted,
            isDirectionLocked
        );
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

        // Move keyboard focus into the modal
        closeBtn.focus();
    });

    // Close the Help modal and restore keyboard focus
    function closeHelpModal() {
        modal.style.display = "none";
        helpBtn.focus();
    }

    closeBtn.addEventListener("click", closeHelpModal);

    // Close when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeHelpModal();
        }
    });


    // Close the Help modal when Escape is pressed
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.style.display === "block") {
            closeHelpModal();
        }
    });

    // Keep keyboard focus inside the Help modal
    modal.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            event.preventDefault();

            // The close button is currently the only focusable element
            closeBtn.focus();
        }
    });
}