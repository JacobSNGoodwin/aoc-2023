import { fileLineToGrid } from '../helpers';

type GridElement = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
type MoveDirection = 'up' | 'down' | 'left' | 'right';
type Coordinates = [number, number];

const findGridElement = (
  grid: GridElement[][],
  element: GridElement
): Coordinates => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === element) {
        return [i, j]; // return as x,y
      }
    }
  }

  return [0, 0];
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

console.debug({
  validUpMoves,
  validDownMoves,
  validRightMoves,
  validLeftMoves,
});

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

const doCoordinatesMatch = (c1: Coordinates, c2: Coordinates) => {
  return c1[0] === c2[0] && c1[1] === c2[1];
};

const buildLoop = (grid: GridElement[][], startCoordinates: Coordinates) => {
  // will start either up or to the right (or down and to the left)
  let currentCoordinates = startCoordinates;
  let currentElement = grid[startCoordinates[0]][startCoordinates[1]];
  let step = 0;
  const foundCoordinates = new Set<string>([
    stringifyCoordinates(startCoordinates),
  ]);

  // console.debug('starting trace', {
  //   currentCoordinates,
  //   currentElement,
  // });

  while (
    step === 0 ||
    !doCoordinatesMatch(currentCoordinates, startCoordinates)
  ) {
    const [row, col] = currentCoordinates;
    const upElement = grid?.[row - 1]?.[col];
    const downElement = grid?.[row + 1]?.[col];
    const rightElement = grid?.[row]?.[col + 1];
    const leftElement = grid?.[row]?.[col - 1];

    // console.debug('Finding next coordinates for', {
    //   row,
    //   col,
    //   currentElement,
    //   upElement,
    //   downElement,
    //   leftElement,
    //   rightElement,
    //   step,
    // });

    if (
      canProceed(currentElement, upElement, 'up') &&
      !foundCoordinates.has(stringifyCoordinates([row - 1, col]))
    ) {
      currentCoordinates = [row - 1, col];
      currentElement = grid[row - 1][col];
    } else if (
      canProceed(currentElement, rightElement, 'right') &&
      !foundCoordinates.has(stringifyCoordinates([row, col + 1]))
    ) {
      currentCoordinates = [row, col + 1];
      currentElement = grid[row][col + 1];
    } else if (
      canProceed(currentElement, downElement, 'down') &&
      !foundCoordinates.has(stringifyCoordinates([row + 1, col]))
    ) {
      currentCoordinates = [row + 1, col];
      currentElement = grid[row + 1][col];
    } else if (
      canProceed(currentElement, leftElement, 'left') &&
      !foundCoordinates.has(stringifyCoordinates([row, col - 1]))
    ) {
      currentCoordinates = [row, col - 1];
      currentElement = grid[row][col - 1];
    } else {
      // it's the last element
      return step + 1;
    }

    foundCoordinates.add(stringifyCoordinates(currentCoordinates));
    console.debug('Found next coordinates/element: ', {
      currentCoordinates,
      currentElement,
      // foundCoordinates,
    });

    step++;
  }

  return step;
};

// TODO - build paths starting in each direction. Return only the valid path,
// then we can calculate inner squares by following that path and eliminating all squares
// inside of each turn.
// up - to - right eliminates all everything to the right of source element and bottom of dest element

const grid = (await fileLineToGrid('input.txt')) as GridElement[][];

// console.log('the grid', grid);

const startCoordinates: Coordinates = findGridElement(grid, 'S') ?? [0, 0];

const totalSteps = buildLoop(grid, startCoordinates);

console.info('Total steps: ', totalSteps);

console.info('Part 1 result: ', Math.ceil(totalSteps / 2));
