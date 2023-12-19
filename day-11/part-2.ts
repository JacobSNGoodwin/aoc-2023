import { fileLineToGrid, transpose } from '../helpers';

const addEmptyRows = (grid: string[][]) =>
  grid.reduce((expanded, line) => {
    if (!line.includes('#')) {
      const emptyLine = new Array(line.length).fill('.', 0, line.length);
      expanded.push(emptyLine);
      expanded.push(line);
    } else {
      expanded.push(line);
    }

    return expanded;
  }, [] as string[][]);

const expandUniverse = (grid: string[][]): string[][] => {
  const expandedRows = addEmptyRows(grid);
  const transposed = transpose(expandedRows);
  const expandedCols = addEmptyRows(transposed);

  return transpose(expandedCols);
};

const grid = await fileLineToGrid('input.txt');
const expandedGrid = expandUniverse(grid);

// console.debug('grid', { expandedGrid, rows: expandedGrid.length });

const galaxyCoordinates = expandedGrid.reduce(
  (acc, current, i) => {
    for (let j = 0; j < current.length; j++) {
      if (expandedGrid[i][j] === '#') {
        acc.push({ x: j, y: expandedGrid.length - i - 1 });
      }
    }

    return acc;
  },
  [] as Array<{ x: number; y: number }>
);

// console.debug('The galaxy coordiantes: ', galaxyCoordinates);

const distancesSum = galaxyCoordinates.reduce((total, currentCoordinate, i) => {
  let coordinateTotal = 0;

  for (let j = i + 1; j < galaxyCoordinates.length; j++) {
    const diffX = galaxyCoordinates[j].x - currentCoordinate.x;
    const diffY = galaxyCoordinates[j].y - currentCoordinate.y;

    const magX = diffX < 0 ? -diffX : diffX;
    const magY = diffY < 0 ? -diffY : diffY;

    const distance = magX + magY;

    coordinateTotal += magX + magY;

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
