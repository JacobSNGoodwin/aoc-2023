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

const doCoordinatesMatch = (c1: Coordinates, c2: Coordinates) => {
  return c1[0] === c2[0] && c1[1] === c2[1];
};

const getStartingElement = (
  grid: GridElement[][],
  [row, col]: Coordinates
): GridElement => {
  const upElement = grid?.[row - 1]?.[col];
  const downElement = grid?.[row + 1]?.[col];
  const rightElement = grid?.[row]?.[col + 1];
  const leftElement = grid?.[row]?.[col - 1];

  if (canProceed('S', upElement, 'up') && canProceed('S', downElement, 'down'))
    return '|';

  if (
    canProceed('S', leftElement, 'left') &&
    canProceed('S', rightElement, 'right')
  )
    return '-';

  if (
    canProceed('S', upElement, 'up') &&
    canProceed('S', rightElement, 'right')
  )
    return 'L';

  if (canProceed('S', upElement, 'up') && canProceed('S', leftElement, 'left'))
    return 'J';

  if (
    canProceed('S', downElement, 'down') &&
    canProceed('S', rightElement, 'right')
  )
    return 'F';

  if (
    canProceed('S', downElement, 'down') &&
    canProceed('S', leftElement, 'left')
  )
    return '7';

  return 'S';
};

const buildPath = (grid: GridElement[][], startCoordinates: Coordinates) => {
  // will start either up or to the right (or down and to the left)
  let currentCoordinates = startCoordinates;
  let currentElement = getStartingElement(grid, startCoordinates);
  let step = 0;
  const foundCoordinates = new Set<string>([
    stringifyCoordinates(startCoordinates),
  ]);

  console.debug('starting trace', {
    currentCoordinates,
    currentElement,
  });

  while (
    step === 0 ||
    !doCoordinatesMatch(currentCoordinates, startCoordinates)
  ) {
    const [row, col] = currentCoordinates;

    const upElement = grid?.[row - 1]?.[col];
    const downElement = grid?.[row + 1]?.[col];
    const rightElement = grid?.[row]?.[col + 1];
    const leftElement = grid?.[row]?.[col - 1];

    // console.debug({
    //   row,
    //   col,
    //   currentElement,
    //   upElement,
    //   downElement,
    //   leftElement,
    //   rightElement,
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
      return foundCoordinates;
    }

    foundCoordinates.add(stringifyCoordinates(currentCoordinates));

    step++;
  }

  // console.debug('steps count', step);

  return foundCoordinates;
};

const getVertices = (coordinates: { x: number; y: number }[]) => {
  const vertices = [];
  const n = coordinates.length;
  for (let i = 0; i < n; i++) {
    const c1 = coordinates?.[i - 1] ?? coordinates[n - 1];
    const c2 = coordinates?.[i + 1] ?? coordinates[0];

    if (c1.x !== c2.x && c1.y !== c2.y) {
      vertices.push(coordinates[i]);
    }
  }

  return vertices;
};

const getPolygonArea = (vertices: { x: number; y: number }[]): number => {
  let sum = 0;
  const n = vertices.length;

  for (let i = 0; i < n; i++) {
    const x2 = vertices?.[i + 1]?.x ?? vertices[0].x;
    const x1 = vertices[i].x;

    const y2 = vertices?.[i + 1]?.y ?? vertices[0].y;
    const y1 = vertices[i].y;

    // console.debug({
    //   x2,
    //   x1,
    //   y2,
    //   y1,
    //   sum,
    // });

    sum += x1 * y2 - y1 * x2;
  }

  return sum < 0 ? -sum / 2 : sum / 2;
};

const isNetClockWise = (vertices: { x: number; y: number }[]) => {
  // TODO someday - clean up an combine with buildInnerVertices
  const n = vertices.length;
  // vector in which to move the bounary.
  let net = 0; // add 1 for clockwise turns and -1 for anticlockwise

  for (let i = 0; i < n; i++) {
    const prev = vertices?.[i - 1] ?? vertices[n - 1];
    const current = vertices[i];
    const next = vertices?.[i + 1] ?? vertices[0];

    if (current.y > prev.y && next.x > current.x) {
      // up - right
      net += 1;
    } else if (current.y > prev.y && next.x < current.x) {
      // up - left
      net -= 1;
    } else if (current.x > prev.x && next.y > current.y) {
      // right - up
      net -= 1;
    } else if (current.x > prev.x && next.y < current.y) {
      // right - down
      net += 1;
    } else if (current.y < prev.y && next.x > current.x) {
      // down - right
      net -= 1;
    } else if (current.y < prev.y && next.x < current.x) {
      // down - left
      net += 1;
    } else if (current.x < prev.x && next.y > prev.y) {
      // left - up
      net += 1;
    } else {
      // left down
      net -= 1;
    }
  }

  return net > 0;
};

// we'll look at the points/vertices on either side of the
// vertices of interest to determine what direction in which to move the
// polygon points
// probably could have done this preserving bend letters
const buildInnerVertices = (
  vertices: { x: number; y: number }[],
  isNetClockWise: boolean
) => {
  // vector in which to move the bounary.
  const n = vertices.length;
  const resultVertices: { x: number; y: number }[] = [];

  for (let i = 0; i < n; i++) {
    const prev = vertices?.[i - 1] ?? vertices[n - 1];
    const current = vertices[i];
    const next = vertices?.[i + 1] ?? vertices[0];

    const a = isNetClockWise ? 1 : -1;

    if (current.y > prev.y && next.x > current.x) {
      // up - right
      resultVertices.push({ x: current.x + a * 0.5, y: current.y - a * 0.5 });
    } else if (current.y > prev.y && next.x < current.x) {
      // up - left
      resultVertices.push({ x: current.x + a * 0.5, y: current.y + a * 0.5 });
    } else if (current.x > prev.x && next.y > current.y) {
      // right - up
      resultVertices.push({ x: current.x + a * 0.5, y: current.y - a * 0.5 });
    } else if (current.x > prev.x && next.y < current.y) {
      // right - down
      resultVertices.push({ x: current.x - a * 0.5, y: current.y - a * 0.5 });
    } else if (current.y < prev.y && next.x > current.x) {
      // down - right
      resultVertices.push({ x: current.x - a * 0.5, y: current.y - a * 0.5 });
    } else if (current.y < prev.y && next.x < current.x) {
      // down - left
      resultVertices.push({ x: current.x - a * 0.5, y: current.y + a * 0.5 });
    } else if (current.x < prev.x && next.y > prev.y) {
      // left - up
      resultVertices.push({ x: current.x + a * 0.5, y: current.y + a * 0.5 });
    } else {
      // left down
      resultVertices.push({ x: current.x - a * 0.5, y: current.y + a * 0.5 });
    }
  }

  return resultVertices;
};

const grid = (await fileLineToGrid('input.txt')) as GridElement[][];

// console.log('the grid', grid);

const startCoordinates: Coordinates = findGridElement(grid, 'S') ?? [0, 0];

const strCoordinates = Array.from(buildPath(grid, startCoordinates).values());

const path = strCoordinates.map(parseCoordinates);

// console.info('The path', path);

const pathCartersianCoordinates = path.map(([row, col]) => {
  const yMax = grid.length; // number or rows

  return {
    x: col,
    y: yMax - 1 - row,
  }; // x,y coordinates
});

// console.debug('Path points: ', pathCartersianCoordinates);

const vertices = getVertices(pathCartersianCoordinates);

// get coorinates of area "inside" of the walls as the
// area of the "dots" should not include the walls
// while maintaining the proper rotation
const innerVertices = buildInnerVertices(vertices, isNetClockWise(vertices));

// console.log('Polygon points', innerVertices);

const polygonArea = getPolygonArea(innerVertices);
console.info('Polygon area: ', polygonArea);

// edges of polygon not includes in area here
