import { fileLinesToGrid } from '../helpers';

// could do regex, but meh!
const digits = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);

type NumberInfo = {
  startIndex: number;
  endIndex: number;
  row: number;
  value: number;
  rawValue: string;
};

const getRowNumbers = (row: string[], rowNumber: number): Array<NumberInfo> => {
  const numberData: Array<NumberInfo> = [];
  let i = 0;
  let currentStartIndex: number | null = null;
  let currentEndIndex: number | null = null;

  while (i < row.length) {
    const isDigit = digits.has(row[i]);
    // console.debug('has element?', {
    //   i,
    //   rowNumber,
    //   val: row[i],
    //   isDigit,
    //   currentStartIndex,
    //   currentEndIndex,
    // });

    if (isDigit && currentStartIndex === null) {
      currentStartIndex = i;
      currentEndIndex = i;
    } else if (isDigit && i === row.length - 1) {
      // caveat for last on line

      const rawValue = row.slice(currentStartIndex ?? i, i + 1).join('');
      const value = parseInt(rawValue);
      numberData.push({
        startIndex: currentStartIndex ?? i, // single digit number fallback
        endIndex: i,
        row: rowNumber,
        value,
        rawValue,
      });
    } else if (isDigit && currentStartIndex !== null) {
      currentEndIndex = i;
    } else if (
      !isDigit &&
      currentStartIndex !== null &&
      currentEndIndex !== null
    ) {
      const rawValue = row
        .slice(currentStartIndex, currentEndIndex + 1)
        .join('');
      const value = parseInt(rawValue);
      numberData.push({
        startIndex: currentStartIndex,
        endIndex: currentEndIndex,
        row: rowNumber,
        value,
        rawValue,
      });
      currentStartIndex = null;
      currentEndIndex = null;
    } else {
    }

    i++;
  }

  return numberData;
};

const getSurroundingSymbols = (
  grid: string[][],
  numberInfo: NumberInfo
): Set<string> => {
  const symbols = new Set<string>();

  // console.debug('numberInfo', {
  //   numberInfo,
  // });
  // top and botton
  for (let i = numberInfo.startIndex - 1; i <= numberInfo.endIndex + 1; i++) {
    const top = grid?.[numberInfo.row - 1]?.[i];
    // console.debug('top element', {
    //   top,
    //   i,
    // });
    if (top && !digits.has(top) && top !== '.') {
      symbols.add(top);
    }
    const bottom = grid?.[numberInfo.row + 1]?.[i];

    // console.debug('bottom element', {
    //   bottom,
    //   i,
    // });
    if (bottom && !digits.has(bottom) && bottom !== '.') {
      symbols.add(bottom);
    }
  }

  // sides
  const leftSide = grid[numberInfo.row][numberInfo.startIndex - 1];
  const rightSide = grid[numberInfo.row][numberInfo.endIndex + 1];
  // console.debug({
  //   leftSide,
  //   rightSide,
  // });
  if (leftSide && !digits.has(leftSide) && leftSide !== '.') {
    symbols.add(leftSide);
  }

  if (rightSide && !digits.has(rightSide) && rightSide !== '.') {
    symbols.add(rightSide);
  }
  return symbols;
};

type NumberSymbols = NumberInfo & {
  symbols: Set<string>;
};

const grid: string[][] = await fileLinesToGrid('input-1.txt');

// console.debug('the grid', grid);

const allNumbers: NumberInfo[] = [];

for (let r = 0; r < grid.length; r++) {
  const row = grid[r];
  // console.debug(`row ${r}`, row);
  const rowData = getRowNumbers(row, r);
  // console.debug('Row number data', rowData);
  allNumbers.push(...rowData);
}

// console.debug('all row data', allNumbers);

const numbersWithSymbols: NumberSymbols[] = allNumbers.map((numberInfo) => {
  return {
    ...numberInfo,
    symbols: getSurroundingSymbols(grid, numberInfo),
  };
});

console.debug(numbersWithSymbols);

const part1Total = numbersWithSymbols.reduce<number>(
  (total, { symbols, value }) => {
    if (symbols.size) {
      return total + value;
    }

    return total;
  },
  0
);

console.debug('part 1', part1Total);
