import { fileLinesToStringArray } from '../helpers';

const fileLines = await fileLinesToStringArray('sample-1.txt');

// console.debug(fileLines);

const times = fileLines[0]
  .split(':')[1]
  .match(/\d+/g)!
  .map((v: string) => parseInt(v, 10));

const distances = fileLines[1]
  .split(':')[1]
  .match(/\d+/g)!
  .map((v: string) => parseInt(v, 10));

const races = times.map((time, i) => ({
  time,
  distance: distances[i],
}));

// console.debug('parsed game input', races);

// Glad I remember high school maths!
const computeBoundaries = ({
  time,
  distance,
}: {
  time: number;
  distance: number;
}) => {
  const min = (time - Math.sqrt(Math.pow(time, 2) - 4 * distance)) / 2;
  const max = (time + Math.sqrt(Math.pow(time, 2) - 4 * distance)) / 2;

  // console.debug('quadratic formula boundares', {
  //   min,
  //   max,
  // });

  return {
    min,
    max,
  };
};

const computeRangeFromBoundaries = ({
  min,
  max,
}: {
  min: number;
  max: number;
}): number => {
  const rangeMin = Number.isInteger(min) ? min + 1 : Math.ceil(min);
  const rangeMax = Number.isInteger(max) ? max - 1 : Math.floor(max);

  // console.debug('range', { rangeMax, rangeMin });
  return rangeMax - rangeMin + 1;
};

const raceRanges = races.map(computeBoundaries).map(computeRangeFromBoundaries);

console.debug('raceRanges', raceRanges);

const part1Result = raceRanges.reduce((tot, next) => {
  return next * tot;
}, 1);

console.log('Part 1 result: ', part1Result);
