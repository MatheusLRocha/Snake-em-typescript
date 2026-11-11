import {
  BOARD_COLUMNS,
  BOARD_ROWS,
  GAME_SPEED,
  INITIAL_SNAKE_SIZE,
} from "./constants.js";
import { isCoordinateEqualToLinear, randomCoordinate } from "./helpers.js";
import type { Coordinate } from "./types.js";

let snakeCoordinates: [Coordinate, ...Coordinate[]];
let foodCoordinate: Coordinate;

const pixels: HTMLDivElement[] = [];

let scoreDiv: HTMLDivElement = document.getElementById("hud") as HTMLDivElement;
let scorePoints: number = 0;

const setupBoard = (columns: number, rows: number) => {
  const board: HTMLDivElement = document.getElementById(
    "board",
  ) as HTMLDivElement;

  board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  for (let i = 0; i < columns * rows; i++) {
    const pixel = document.createElement("div");
    pixel.className = "pixel";

    if (i === 17) {
      pixel.className = "pixel snake";
    }

    board.appendChild(pixel);
    pixels.push(pixel);
  }
};

const initializeSnake = (
  columns: number,
  rows: number,
): [Coordinate, ...Coordinate[]] => {
  const head: Coordinate = {
    x: Math.floor(columns / 2),
    y: Math.floor(rows / 2),
  };

  const snake: [Coordinate, ...Coordinate[]] = [head];
  for (let i = 1; i < INITIAL_SNAKE_SIZE; i++) {
    const bodyCoordinate: Coordinate = { x: head.x - i, y: head.y };
    snake.push(bodyCoordinate);
  }

  return snake;
};

let foodInterval: number;
const generateFood = () => {
  foodCoordinate = randomCoordinate(BOARD_COLUMNS, BOARD_ROWS);

  foodInterval = setInterval(() => {
    if (
      snakeCoordinates[0].x === foodCoordinate.x &&
      snakeCoordinates[0].y === foodCoordinate.y
    ) {
      scorePoints++;
      scoreDiv.textContent = `Score: ${scorePoints}`;

      let lastIndex: number = snakeCoordinates.length - 1;

      const bodyCoordinate: Coordinate = {
        x: snakeCoordinates[lastIndex]!.x - 1,
        y: snakeCoordinates[lastIndex]!.y,
      };

      snakeCoordinates.push(bodyCoordinate);

      foodCoordinate = randomCoordinate(BOARD_COLUMNS, BOARD_ROWS);

      paint();
    }
  }, GAME_SPEED);
};

const paint = () => {
  pixels.forEach((pixel, linear) => {
    // Limpar o tabuleiro
    pixel.className = "pixel";

    // Desenhar a cobra
    snakeCoordinates.forEach((snakeCoordinate) => {
      if (isCoordinateEqualToLinear(snakeCoordinate, linear, BOARD_COLUMNS)) {
        pixel.className = "pixel snake";
      }
    });

    // Desenhar a comida
    if (isCoordinateEqualToLinear(foodCoordinate, linear, BOARD_COLUMNS)) {
      pixel.className = "pixel food";
    }
  });
};

const endGame = () => {
  alert("Game Over!");
  window.location.reload();
};

let gameInterval: number;

let left: boolean = false;
let right: boolean = false;
let up: boolean = false;
let down: boolean = false;

const moveRight = () => {
  clearInterval(gameInterval);

  right = true;
  left = false;
  up = false;
  down = false;

  gameInterval = setInterval(() => {
    for (let i = snakeCoordinates.length - 1; i > 0; i--) {
      if (snakeCoordinates[i]!.x === BOARD_COLUMNS - 1) {
        endGame();
        break;
      }

      let nextCoord: Coordinate = { ...snakeCoordinates[i - 1]! };

      snakeCoordinates[i] = nextCoord;
    }

    snakeCoordinates[0].x += 1;

    paint();
  }, GAME_SPEED);
};

const moveLeft = () => {
  clearInterval(gameInterval);

  left = true;
  right = false;
  up = false;
  down = false;

  gameInterval = setInterval(() => {
    for (let i = snakeCoordinates.length - 1; i > 0; i--) {
      if (snakeCoordinates[i]!.x === 0) {
        endGame();
        break;
      }

      let nextCoord: Coordinate = { ...snakeCoordinates[i - 1]! };

      snakeCoordinates[i] = nextCoord;
    }

    snakeCoordinates[0].x -= 1;

    paint();
  }, GAME_SPEED);
};

const moveUp = () => {
  clearInterval(gameInterval);

  up = true;
  down = false;
  right = false;
  left = false;

  gameInterval = setInterval(() => {
    for (let i = snakeCoordinates.length - 1; i > 0; i--) {
      if (snakeCoordinates[i]!.y === 0) {
        endGame();
        break;
      }

      let nextCoord: Coordinate = { ...snakeCoordinates[i - 1]! };

      snakeCoordinates[i] = nextCoord;
    }

    snakeCoordinates[0].y -= 1;

    paint();
  }, GAME_SPEED);
};

const moveDown = () => {
  clearInterval(gameInterval);

  down = true;
  up = false;
  right = false;
  left = false;

  gameInterval = setInterval(() => {
    for (let i = snakeCoordinates.length - 1; i > 0; i--) {
      if (snakeCoordinates[i]!.y === BOARD_ROWS - 1) {
        endGame();
        break;
      }

      let nextCoord: Coordinate = { ...snakeCoordinates[i - 1]! };

      snakeCoordinates[i] = nextCoord;
    }

    snakeCoordinates[0].y += 1;

    paint();
  }, GAME_SPEED);
};

setupBoard(BOARD_COLUMNS, BOARD_ROWS);

snakeCoordinates = initializeSnake(BOARD_COLUMNS, BOARD_ROWS);

generateFood();

paint();

document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === "d") {
    if (!left) moveRight();
  }

  if (e.key === "w") {
    if (!down) moveUp();
  }

  if (e.key === "s") {
    if (!up) moveDown();
  }

  if (e.key === "a") {
    if (!right) moveLeft();
  }
});
