// Snake

// What do you need to creat the game?
// Grid background, food to expand snake length, data structure for snake, score tracking.

//What i need to render it ?

// As a user i want to be able to be able to see a start button at the landing page.
// As a user i want to be able to control the snake with keyboard arrow keys.
// As a user i want to see the grid of gameplay.
// As a user i want to see score
// As a user i want to see food
// As a user i want to see snake expand after each food earned

// Define score - each snake movement will incease points by 2, score will increase once by 10 each time snake
// eats food

// Define snake Head - initial snake position, place snake at the center of the screen to start off

// Define snake lenght and growth - square will extend snake length in between head and tail after the 1st time snake
// eats food, and each time snake eats food thereafter

// Define snake movement based on players choices (x and y axis movements) - Snake body will move according to snakes
// head based on players movement commands

// Define snake speed - every time ssnake eats food, speed will increase

// Define keystrokes - players movements - keyboard keys used will be the directional keys on board
//cursorUp, cursorRight, cursorDown, cursorLeft?

//Define game win - player wins game once score reaches 25000 points

// Define game over - if snake runs into itself or goes to the borders

// Define food position - food will start at a random location, food will appear in random location
// on grid after each time snake eats previous food

//Define HTML elements
const board = document.getElementById("game-board"); 
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById('score')
const highScoreText = document.getElementById('highScore');

//Define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10 }];
let food = generateFood();
let highScore = 0
let direction = "right";
let gameInterval;
let gameSpeedDelay = 250;
let gameStarted = false;
let movementScore = 0;
let foodScore = 0;

//Draw game map, snake, food.
function draw() { 
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

//Draw snake
function drawSnake() { //using an array and object inside let snake = [{ x: 10, y: 10 }]; 
  snake.forEach((segment) => { //array method, for each children thats inside the array, arrow function
    const snakeElement = createGameElement("div", "snake"); // shows snake div and class the image based on whats on the css
    setPosition(snakeElement, segment); 
    board.appendChild(snakeElement);
  });
}

//create a snake, food (div)
function createGameElement(tag, className) {  // create an argument, tag is the div, and the className is the snake
  const element = document.createElement(tag); 
  element.className = className; 
  return element;
}

// Set position of snake or food on the board
function setPosition(element, position) { 
  element.style.gridColumn = position.x; 
  element.style.gridRow = position.y; 
}

// Testing draw function
draw();

//Draw food function
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);}
  
}

//Generating the food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

//Move the snake
function move() {
  const head = { ...snake[0] }; //this will let us start with the snake variable array and let the snake head 
  // move instead of keeping snake head at the same position
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "up":
      head.y--;
      break;
    case "left":
      head.x--;
      break;
    case "down":
      head.y++;
      break;
  }
  snake.unshift(head)
    if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Patch move to add food score when snake eats food
const prevMove = move;
move = function() {
    const prevHead = { ...snake[0] };
    prevMove.apply(this, arguments);
    // If snake head is now at food position, add food score
    if (prevHead.x !== food.x || prevHead.y !== food.y) {
        // Snake did not eat food
        return;
    }
    addFoodScore();
};

// Patch updateScore to include foodScore
const prevUpdateScore = updateScore;
updateScore = function() {
    const currentScore = snake.length - 1 + movementScore + foodScore;
    score.textContent = currentScore.toString().padStart(5, '0');
};


  // Starting the game
  function startGame() {
    gameStarted = true; //Keeping track of running game
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval(() => {
      move();
      checkCollision(); 
      draw();
    }, gameSpeedDelay);
  }

//   Create keypress event listener
  function handleKeyPress(event) {
    if (
      (!gameStarted && event.code === 'Space') ||
      (!gameStarted && event.key === ' ')
    ) {
      startGame();
    } else {
      switch (event.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
      }
    }
  }


document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100 ) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50 ) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 25 ) {
    gameSpeedDelay -= 3;
  }
}

function checkCollision () {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 250;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(4,'0');
}

function addMovementScore() {
    movementScore += 10;
    updateScore();
}

// Update updateScore to include movementScore
const originalUpdateScore = updateScore;
updateScore = function() {
    const currentScore = snake.length - 1 + movementScore;
    score.textContent = currentScore.toString().padStart(4, '0');
}

// Add movement score on each move
const originalMoveWithWin = move;
move = function() {
    addMovementScore();
    originalMoveWithWin.apply(this, arguments);
    checkWin();
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length - 1 + movementScore + foodScore;
    if (currentScore > highScore) {
        highScore = currentScore;
    }
    highScoreText.textContent = currentScore.toString().padStart(4, '0');
    highScoreText.style.display = 'block';
}

function checkWin() {
    const currentScore = (snake.length - 1) + movementScore + foodScore;
    if (currentScore >= 5000) {
        renderEndMessage("You Win! 🎉");
        stopGame();
        resetGame();
    }
}

function renderEndMessage(message) {
    instructionText.textContent = message;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

// Modify resetGame to show lose message
function resetGame() {
    updateHighScore();
    stopGame();
    renderEndMessage("Game Over! Try Again.");
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 250;
    updateScore();
}

// Call checkWin after each move
const originalMove = move;
move = function() {
    originalMove.apply(this, arguments);
    checkWin();
};

function addFoodScore() {
    foodScore += 100;
    updateScore();
}