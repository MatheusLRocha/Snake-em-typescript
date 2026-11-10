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

const generateFood = () => {
  foodCoordinate = randomCoordinate(BOARD_COLUMNS, BOARD_ROWS);
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

const moveFoward = () => {
  clearInterval(gameInterval);

  gameInterval = setInterval(() => {
    for (const coord of snakeCoordinates) {
      if (coord.x === BOARD_COLUMNS - 1) {
        endGame();
        clearInterval(gameInterval);
        return;
      }

      coord.x += 1;
      console.log(coord.x);

      paint();
    }
  }, GAME_SPEED);
};

const moveUpward = () => {
  clearInterval(gameInterval);

  gameInterval = setInterval(() => {
    for (const coord of snakeCoordinates) {
      if (coord.y === 0) {
        endGame();
        clearInterval(gameInterval);
        return;
      }

      coord.y -= 1;
      console.log(coord.y);

      paint();
    }
  }, GAME_SPEED);
};
setupBoard(BOARD_COLUMNS, BOARD_ROWS);

snakeCoordinates = initializeSnake(BOARD_COLUMNS, BOARD_ROWS);

generateFood();

paint();

document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    moveFoward();
  }

  if (e.key === "w") {
    moveUpward();
  }
});
