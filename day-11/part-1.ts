import { fileLineToGrid, transpose } from '../helpers';

const EXPANSION_SIZE = 1000000;

const grid = await fileLineToGrid('input.txt');

// console.debug('grid', { expandedGrid, rows: expandedGrid.length });

const galaxyCoordinates = grid.reduce(
  (acc, current, i) => {
    for (let j = 0; j < current.length; j++) {
      if (grid[i][j] === '#') {
        acc.push({ x: j, y: grid.length - i - 1 });
      }
    }

    return acc;
  },
  [] as Array<{ x: number; y: number }>
);

// console.debug('The galaxy coordiantes: ', galaxyCoordinates);

const expandedY = grid.reduce((emptyRowIndices, currentRow, i) => {
  if (!currentRow.includes('#')) {
    emptyRowIndices.push(grid.length - i - 1);
  }

  return emptyRowIndices;
}, [] as number[]);

const expandedX = transpose(grid).reduce((emptyColIndices, currentCol, i) => {
  if (!currentCol.includes('#')) {
    emptyColIndices.push(i);
  }

  return emptyColIndices;
}, [] as number[]);

console.info('The empty rows and columns', {
  expandedX,
  expandedY,
});

const distancesSum = galaxyCoordinates.reduce((total, currentCoordinate, i) => {
  let coordinateTotal = 0;

  for (let j = i + 1; j < galaxyCoordinates.length; j++) {
    const x1 = galaxyCoordinates[j].x;
    const x0 = currentCoordinate.x;

    const y1 = galaxyCoordinates[j].y;
    const y0 = currentCoordinate.y;

    const emptyXBetween = expandedX.filter(
      (x) => (x > x1 && x < x0) || (x > x0 && x < x1)
    ).length;
    const emptyYBetween = expandedY.filter(
      (y) => (y > y1 && y < y0) || (y > y0 && y < y1)
    ).length;

    const diffX = galaxyCoordinates[j].x - currentCoordinate.x;
    const diffY = galaxyCoordinates[j].y - currentCoordinate.y;

    const magX = diffX < 0 ? -diffX : diffX;
    const magY = diffY < 0 ? -diffY : diffY;

    coordinateTotal +=
      magX +
      emptyXBetween * (EXPANSION_SIZE - 1) +
      magY +
      emptyYBetween * (EXPANSION_SIZE - 1);

    // console.debug('distance from i to j', {
    //   c1: galaxyCoordinates[i],
    //   c2: galaxyCoordinates[j],
    //   magX,
    //   magY,
    //   distance,
    // });
  }

  return total + coordinateTotal;
}, 0);

console.info('Part 1 sum: ', distancesSum);
