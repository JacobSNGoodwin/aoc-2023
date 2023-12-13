import { fileLinesToStringArray } from '../helpers';

const diff = (input: number[]) => {
  const result = [];

  for (let i = 1; i < input.length; i++) {
    result.push(input[i] - input[i - 1]);
  }

  return result;
};

const getLastElements = (input: number[]) => {
  const lastElements: number[] = [];

  let current: number[] = input;
  // 0 falsey
  while (current.some((c) => !!c)) {
    lastElements.push(current[current.length - 1]);

    current = diff(current);
  }

  return lastElements;
};

const strLines = await fileLinesToStringArray('input.txt');
const lines: number[][] = strLines.map((line) =>
  line
    .trim()
    .split(' ')
    .map((d) => parseInt(d, 10))
    .reverse()
);

// console.debug('lines: ', lines);

const sumOfLasts = lines.map(getLastElements).reduce((acc, currentLastVals) => {
  const innerSum = currentLastVals.reduce((prev, curr) => prev + curr, 0);

  return innerSum + acc;
}, 0);

console.debug('sum of lasts', sumOfLasts);
