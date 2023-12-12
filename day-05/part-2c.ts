import { fileLinesToStringArray } from '../helpers';

type MapData = {
  destination: number;
  source: number;
  range: number;
};

type Steps = Map<string, Array<MapData>>;

const getSeedRanges = (lines: string[]) => {
  const seedRanges = lines[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .map((v) => parseInt(v, 10));
  return seedRanges;
};

const getSteps = (lines: string[]): Steps => {
  // JS maps are ordered these days
  const steps = new Map<string, MapData[]>();

  let currentLabel: string = '';
  let i = 0;

  while (i < lines.length) {
    const isMapHeader = lines[i].includes('map');
    const lineHasText = lines[i].length;

    if (isMapHeader) {
      const label = lines[i].split(' ')[0];
      steps.set(label, new Array());
      currentLabel = label;
    }

    if (lineHasText && currentLabel && !isMapHeader) {
      const digits = lines[i]
        .trim()
        .split(' ')
        .map((val) => parseInt(val, 10));

      const currentStepMaps = steps.get(currentLabel);
      currentStepMaps?.push({
        destination: digits[0],
        source: digits[1],
        range: digits[2],
      });
    }

    i++;
  }

  return steps;
};

// Can we build a single function here instead of passing over a function for each
// stage?
type MapFn = (input: number) => number;

const buildSingleMap = (reversedSteps: Array<MapData>): MapFn => {
  const step = reversedSteps.pop();

  if (step) {
    step.
  }
};

const lines = await fileLinesToStringArray('sample-1.txt');

const seedRanges = getSeedRanges(lines);

console.debug('seed ranges', seedRanges);

const steps = getSteps(lines.slice(1));

const reversedSteps = Array.from(steps.values()).reverse();

console.debug('reversedSteps', reversedSteps);

// test seed 82 -> 46

// console.log('The final resultaroo: ', min);
// for (let i = 0; i < seedRanges.length; i = i + 2) {
//   const start = seedRanges[i];
//   const size = seedRanges[i + 1];
//   // console.debug('processing range', { start, size });
//   for (let j = start; j < start + size; j++) {
//     // const seedResult = computePipelineForVal(j);
//     // if (min === null || seedResult < min) {
//     // min = seedResult;
//     // }
//     // console.debug('seed result', {
//     //   seed: j,
//     //   seedResult,
//     //   min,
//     // });
//   }
//   // console.debug('Range calculated. current min: ', min);
// }

// console.debug('finished');
