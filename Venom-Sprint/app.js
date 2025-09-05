// Canvas & context
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

// Logical grid
const gridWidth = 20;
const gridHeight = 20;
const box = canvas.width / gridWidth; // 20 px per cell

// Game variables
let snake, food, score, highScore, direction, gameInterval, gameSpeedDelay, isPaused, gameStarted = false;

// Load high score
highScore = localStorage.getItem("highScore") 
  ? parseInt(localStorage.getItem("highScore")) 
  : 0;
document.getElementById("highScore").innerText = `High Score: ${highScore}`;

// Start game on Space Bar
document.addEventListener("keydown", function(e) {
  if (!gameStarted && e.code === "Space") {
    document.getElementById("splashImage").style.display = "none";
    document.getElementById("startText").style.display = "none";
    canvas.style.display = "block";
    startGame();
    gameStarted = true;
  }
});

// Initialize game
function startGame() {
  snake = [{ x: Math.floor(gridWidth/2), y: Math.floor(gridHeight/2) }];
  direction = "right";
  score = 0;
  gameSpeedDelay = 200;
  isPaused = false;

  document.getElementById("score").innerText = `Score: ${score}`;
  food = generateFood();

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, gameSpeedDelay);
}

// Game loop
function gameLoop() {
  if (!isPaused) {
    move();
    checkCollision();
    draw();
  }
}

// Move snake
function move() {
  const head = { ...snake[0] };
  switch(direction) {
    case "right": head.x++; break;
    case "up": head.y--; break;
    case "left": head.x--; break;
    case "down": head.y++; break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
    increaseSpeed();
  } else {
    snake.pop();
  }
}

// Generate food
function generateFood() {
  return {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight)
  };
}

// Increase speed
function increaseSpeed() {
  gameSpeedDelay = Math.max(50, gameSpeedDelay - 10);
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, gameSpeedDelay);
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "green" : "lightgreen";
    ctx.fillRect(segment.x * box, segment.y * box, box, box);
  });

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box, box);
}

// Collision detection
function checkCollision() {
  const head = snake[0];

  // Wall collision
  if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
    endGame();
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) endGame();
  }
}

// End game
function endGame() {
  clearInterval(gameInterval);
  alert(`Game Over! Final Score: ${score}`);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.getElementById("highScore").innerText = `High Score: ${highScore}`;
  }

  // Reset splash screen
  document.getElementById("splashImage").style.display = "block";
  document.getElementById("startText").style.display = "block";
  canvas.style.display = "none";
  gameStarted = false;
}

// Controls
document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

// Buttons
document.getElementById("restartBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", () => {
  if (!gameStarted) return;
  isPaused = !isPaused;
  document.getElementById("pauseBtn").innerText = isPaused ? "Resume" : "Pause";
});
document.getElementById("endBtn").addEventListener("click", () => {
  if (gameStarted) endGame();
});

// Modal
const modal = document.getElementById("helpModal");
const helpBtn = document.getElementById("helpBtn");
const closeBtn = document.querySelector(".close");

helpBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
