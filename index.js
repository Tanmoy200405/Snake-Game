const grid = document.getElementById("grid");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const levelElement = document.getElementById("level");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

const GRID_SIZE = 20;
let cells = [];

let snake;
let direction;
let food;
let score;
let level;
let gameInterval;

let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.textContent = highScore;

// Build grid
for (let y = 0; y < GRID_SIZE; y++) {
  for (let x = 0; x < GRID_SIZE; x++) {
    const cell = document.createElement("div");
    grid.appendChild(cell);
    cells.push(cell);
  }
}

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  score = 0;
  level = 1;

  scoreElement.textContent = score;
  levelElement.textContent = level;

  placeFood();
  draw();

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 200);
}

function resetGame() {
  clearInterval(gameInterval);
  highScore = 0;
  localStorage.removeItem("highScore");
  highScoreElement.textContent = 0;
  startGame();
}

function gameLoop() {
  move();
}

function move() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Wall collision
  if (
    head.x < 0 ||
    head.x >= GRID_SIZE ||
    head.y < 0 ||
    head.y >= GRID_SIZE
  ) {
    gameOver();
    return;
  }

  // Self collision
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreElement.textContent = highScore;
    }

    if (score % 5 === 0) {
      level++;
      levelElement.textContent = level;
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, Math.max(60, 200 - level * 15));
    }

    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function placeFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));

  food = newFood;
}

function draw() {
  cells.forEach(cell => (cell.style.background = ""));

  snake.forEach((segment, index) => {
    const i = segment.y * GRID_SIZE + segment.x;
    cells[i].style.background =
      index === 0 ? "#00ff88" : "#00cc66";
  });

  const foodIndex = food.y * GRID_SIZE + food.x;
  cells[foodIndex].style.background = "red";
}

function gameOver() {
  clearInterval(gameInterval);
  alert("Game Over! Score: " + score);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction.y !== 1)
    direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y !== -1)
    direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x !== 1)
    direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x !== -1)
    direction = { x: 1, y: 0 };
});

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
