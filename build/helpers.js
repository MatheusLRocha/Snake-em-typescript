const coordinateToLinear = (coord, columns) => {
    return coord.y * columns + coord.x;
};
export const isCoordinateEqualToLinear = (coord, linear, columns) => coordinateToLinear(coord, columns) === linear;
export const randomCoordinate = (columns, rows) => ({
    x: Math.floor(Math.random() * columns),
    y: Math.floor(Math.random() * rows),
});
//# sourceMappingURL=helpers.js.map