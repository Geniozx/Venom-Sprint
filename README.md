![alt text](<Venom Sprint.png>)

Game name - Vemon Sprint

Link - https://geniozx.github.io/Venom-Sprint/

Attributions - https://developer.mozilla.org/en-US/docs/Web/CSS/position 
<!-- Helped me position the logo and instruction text   -->


https://www.google.com/search?q=typing+js+code+for+arrow+keys+in+javascript&sca_esv=9faf4b2dd5f8b9e4&sxsrf=AE3TifNxeVtb6zSp8bw32FXKeDk3C8GGNQ%3A1752349219929&source=hp&ei=I7pyaIzANZG5mtkPprqsuA8&iflsig=AOw8s4IAAAAAaHLIM5Vsrplq7bszlap81iUy5p2hppNz&oq=typing+JS+code+for+arrow+keys&gs_lp=Egdnd3Mtd2l6Ih10eXBpbmcgSlMgY29kZSBmb3IgYXJyb3cga2V5cyoCCAIyBRAhGKABMgUQIRigATIFECEYoAEyBRAhGKABMgUQIRirAjIFECEYqwJI3YoCUPMxWIbqAXAOeACQAQCYAYMBoAGTHqoBBTI5LjEzuAEByAEA-AEBmAI4oALzHqgCCsICBxAjGCcY6gLCAgcQLhgnGOoCwgIKECMYgAQYJxiKBcICBBAjGCfCAhEQLhiABBixAxjRAxiDARjHAcICCxAAGIAEGLEDGIMBwgIOEAAYgAQYsQMYgwEYigXCAg4QLhiABBixAxjRAxjHAcICCBAuGIAEGLEDwgIFEAAYgATCAgUQLhiABMICDRAjGPAFGIAEGCcYigXCAggQABiABBjJA8ICCxAAGIAEGLEDGIoFwgIEEAAYA8ICCBAAGIAEGLEDwgILEC4YgAQY0QMYxwHCAgsQLhiABBixAxiDAcICERAuGIAEGLEDGIMBGMcBGK8BwgIHEAAYgAQYCsICBhAAGBYYHsICCBAAGBYYChgewgILEAAYgAQYhgMYigXCAggQABiABBiiBMICBRAAGO8FmAME8QWhxNKkodvcTZIHBTQzLjEzoAfEpAKyBwUyOS4xM7gH1R7CBwcxNS40MC4xyAdF&sclient=gws-wiz#vhid=zephyr:0&vssid=atritem-
<!-- For arrow key functionality and assitance with using correct code **Thank you AI OVERVIEW** Example:
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
-->


https://generalassembly.instructure.com/courses/821/pages/intro-to-the-dom?module_item_id=75305
<!-- Helped me review to place elements in the DOM correctly, for Example: 
//Draw snake
function drawSnake() { //using an array and object inside let snake = [{ x: 10, y: 10 }]; 
  snake.forEach((segment) => { //array method, for each children thats inside the array, arrow function
    const snakeElement = createGameElement("div", "snake"); // shows snake div and class the image based on whats on the css
    setPosition(snakeElement, segment); 
    board.appendChild(snakeElement);
  });
} 
or 
//create a snake, food (div)
function createGameElement(tag, className) {  // create an argument, tag is the div, and the className is the snake
  const element = document.createElement(tag); 
  element.className = className; 
  return element;
}
 -->




======Technologies Used=======
HTML,JavsScript, CSS, PNG File

