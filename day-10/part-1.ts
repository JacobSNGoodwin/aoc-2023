import { fileLineToGrid } from '../helpers';

type GridElement = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
type MoveDirection = 'up' | 'down' | 'left' | 'right';
type Coordinates = [number, number];

const findGridElement = (grid: GridElement[][], element: GridElement) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === element) {
        return [i, j]; // return as x,y
      }
    }
  }

  return undefined;
};

const stringifyCoordinates = (c: Coordinates) => JSON.stringify(c);
const parseCoordinates = (s: string) => JSON.parse(s) as Coordinates;

const validUpCombinations: Array<string> = (
  ['|', 'L', 'J', 'S'] as GridElement[]
).flatMap((from) => {
  return (['7', 'F', '|', 'S'] as GridElement[]).map((to) => `${from}:${to}`);
});

const validUpMoves = new Set(validUpCombinations);

const validDownCombinations: Array<string> = (
  ['|', '7', 'F', 'S'] as GridElement[]
).flatMap((from) => {
  return (['|', 'L', 'J', 'S'] as GridElement[]).map((to) => `${from}:${to}`);
});

const validDownMoves = new Set(validDownCombinations);

const validRightCombinations: Array<string> = (
  ['-', 'L', 'F', 'S'] as GridElement[]
).flatMap((from) => {
  return (['-', 'J', '7', 'S'] as GridElement[]).map((to) => `${from}:${to}`);
});

const validRightMoves = new Set(validRightCombinations);

const validLeftCombinations: Array<string> = (
  ['-', 'J', '7', 'S'] as GridElement[]
).flatMap((from) => {
  return (['-', 'L', 'F', 'S'] as GridElement[]).map((to) => `${from}:${to}`);
});

const validLeftMoves = new Set(validLeftCombinations);

// console.debug({
//   validUpMoves,
//   validDownMoves,
//   validRightMoves,
//   validLeftMoves,
// });

const canProceed = (
  startElement: GridElement,
  endElement: GridElement,
  direction: MoveDirection
): boolean => {
  if (!startElement || !endElement) {
    return false;
  }

  const setVal = `${startElement}:${endElement}`;

  if (direction === 'up') {
    return validUpMoves.has(setVal);
  }

  if (direction === 'down') {
    return validDownMoves.has(setVal);
  }

  if (direction === 'left') {
    return validLeftMoves.has(setVal);
  }

  if (direction === 'right') {
    return validRightMoves.has(setVal);
  }

  return false;
};

const intersect = <U>(set1: Set<U>, set2: Set<U>): Set<U> => {
  const intersection = new Set<U>();

  set1.forEach((el) => {
    if (set2.has(el)) {
      intersection.add(el);
    }
  });
  return intersection;
};

// finds valid paths in up and down directions, storing coordinates
const findGreatestDistance = (
  grid: GridElement[][],
  startCoordinates: Coordinates
) => {
  let step = 0;

  let foundCoordinates = new Set<string>();
  let currentCoordinates = new Set<string>([JSON.stringify(startCoordinates)]);
  // console.debug('start coordinates', currentCoordinates);

  while (currentCoordinates.size) {
    const nextCoordinates: Set<string> = new Set();
    currentCoordinates.forEach((strCoordinates) => {
      const [row, col] = parseCoordinates(strCoordinates);
      const fromElement = grid[row][col];
      const upElement = grid?.[row - 1]?.[col];
      const downElement = grid?.[row + 1]?.[col];
      const leftElement = grid?.[row]?.[col - 1];
      const rightElement = grid?.[row]?.[col + 1];

      if (canProceed(fromElement, upElement, 'up')) {
        nextCoordinates.add(stringifyCoordinates([row - 1, col]));
      }
      if (canProceed(fromElement, downElement, 'down')) {
        nextCoordinates.add(stringifyCoordinates([row + 1, col]));
      }
      if (canProceed(fromElement, leftElement, 'left')) {
        nextCoordinates.add(stringifyCoordinates([row, col - 1]));
      }
      if (canProceed(fromElement, rightElement, 'right')) {
        nextCoordinates.add(stringifyCoordinates([row, col + 1]));
      }
    });

    // console.debug('Found next coordinates for given step', {
    //   step,
    //   foundCoordinates,
    //   nextCoordinates,
    // });
    //
    const intersection = intersect(foundCoordinates, nextCoordinates);

    // we have found errthing
    if (intersection.size === nextCoordinates.size) {
      return step;
    }

    nextCoordinates.forEach((c) => foundCoordinates.add(c));

    currentCoordinates = nextCoordinates;

    step++;
  }
};

const grid = (await fileLineToGrid('input.txt')) as GridElement[][];

// console.log('the grid', grid);

const [r0, c0] = findGridElement(grid, 'S') ?? [0, 0];

// console.info('The starting point: ', { r0, c0 });

console.info('Part 1 result: ', findGreatestDistance(grid, [r0, c0]));
