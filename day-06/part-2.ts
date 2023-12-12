import { fileLinesToStringArray } from '../helpers';

const fileLines = await fileLinesToStringArray('input-1.txt');

// console.debug(fileLines);

const time = parseInt(fileLines[0].split(':')[1].match(/\d+/g)!.join(''));
const distance = parseInt(fileLines[1].split(':')[1].match(/\d+/g)!.join(''));

console.debug('time/distance', {
  time,
  distance,
});

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

const boundaries = computeBoundaries({ time, distance });
console.debug('boundaries:', boundaries);

const result = computeRangeFromBoundaries(boundaries);

console.debug('Part 2 result: ', result);
