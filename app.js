// Snake

// What do you need to creat the game?
// Grid background, food to expand snake length, data structure for snake, score tracking.

//What i need to render it ?

// As a user i want to see the landing page when i arrive to the website to know im in the right place
// As a user i want to be able to be able to see a start button at the landing page.
// As a user i want to be able to control the snake with keyboard arrow keys.
// As a user i want to see the grid of gameplay.
// As a user i want to see score
// As a user i want to see food
// As a user i want to see snake expand after each food earned

// Define score - each snake movement will incease points by 2, score will increase once by 10 each time snake
// eats food

// Define snake Head - initial snake position, place snake at the center of the screen to start off

// Define snake Tail - tail will move farther away from head by one sqaure each time snake eats snake

// Define snake lenght and growth - square will extend snake length in between head and tail after the 1st time snake
// eats food, and each time snake eats food thereafter

// Define snake movement based on players choices (x and y axis movements) - Snake body will move according to snakes
// head based on players movement commands

// Define snake speed - every time score increases 200, speed will increase by .25%, snake will start moving one square
// per second

// Define keystrokes - players movements - keyboard keys used will be the directional keys on board
//cursorUp, cursorRight, cursorDown, cursorLeft

//Define game win - player wins game once score reaches 25000 points

// Define game over - if snake runs into itself

// Define food position - food will start at a random location, food will appear in random location
// on grid after each time snake eats previous food

//Define HTML elements
const board = document.getElementById("game-board"); // console.log(board); 
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");

//Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = "right";
let gameInterval;
let gameSpeedDelay = 250;
let gameStarted = false;

//Draw game map, snake, food.
function draw() { 
  board.innerHTML = '';
  drawSnake();
  drawFood();
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
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

//Generating the food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

//Move the snake
function move() {
  const head = { ...snake[0] };
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
  snake.unshift(head);
  snake.pop();

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      move();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }}

  //Test moving
  // setInterval(() => {
  //     move(); // move snake first
  //     draw(); //draw again to the new position
  // }, 250);

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
      (!gameStarted && event.code === "Space") ||
      (!gameStarted && event.key === " ")
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


document.addEventListener("keydown", function (event) {
    console.log(gameStarted, event.code)
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
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
});

function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  }
}
