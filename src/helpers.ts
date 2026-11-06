import type { Coordinate } from "./types.js";

const coordinateToLinear = (coord: Coordinate, columns: number): number => {
  return coord.y * columns + coord.x;
};

export const isCoordinateEqualToLinear = (
  coord: Coordinate,
  linear: number,
  columns: number,
): boolean => coordinateToLinear(coord, columns) === linear;

export const randomCoordinate = (
  columns: number,
  rows: number,
): Coordinate => ({
  x: Math.floor(Math.random() * columns),
  y: Math.floor(Math.random() * rows),
});
