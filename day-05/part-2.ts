import { fileLinesToStringArray } from '../helpers';

type MapData = {
  destination: number;
  source: number;
  range: number;
};

const getSeedRanges = (lines: string[]) => {
  const seedRanges = lines[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .map((v) => parseInt(v, 10));
  return seedRanges;
};

const getSteps = (lines: string[]) => {
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

const buildMapStage =
  ({ source, destination, range }: MapData) =>
  (input: number) => {
    const shift = source - destination;

    if (input >= source && input < source + range) {
      // console.debug('input in map stage', {
      //   input,
      //   source,
      //   destination,
      //   range,
      // });
      return input - shift;
    }

    return input;
  };

const processMap = (input: number, map: MapData[]): number => {
  let output = input;

  let i = 0;
  while (output === input && i < map.length) {
    output = buildMapStage(map[i])(output);
    i++;
  }

  return output;
};

const createPipeline = (steps: Map<string, MapData[]>) => (seed: number) => {
  // console.debug(
  //   `
  //   -----------------------------------
  //   Running pipeline for seed: ${seed}
  //   -----------------------------------
  //   `
  // );

  let output = seed;

  const stepsIterator = steps.entries();
  let currentStep = stepsIterator.next();
  while (!currentStep.done) {
    const [stepTitle, map] = currentStep.value;
    // console.debug('\nProcessing map step', { stepTitle, input: output, map });

    output = processMap(output, map);

    // console.debug('Stage output', output);
    currentStep = stepsIterator.next();
  }

  return output;
};

const lines = await fileLinesToStringArray('sample-1.txt');

const seedRanges = getSeedRanges(lines);

console.debug('seed ranges', seedRanges);

const steps = getSteps(lines.slice(1));

const processVal = createPipeline(steps);

let min: number | null = null;

for (let i = 0; i < seedRanges.length; i = i + 2) {
  const start = seedRanges[i];
  const size = seedRanges[i + 1];
  console.debug('processing range', { start, size });
  for (let j = start; j < start + size; j++) {
    const seedResult = processVal(j);
    if (min === null || seedResult < min) {
      min = seedResult;
    }
    // console.debug('seed result', {
    //   seed: j,
    //   seedResult,
    //   min,
    // });
  }
  console.debug('Range calculated. current min: ', min);
}

// const results = seeds.map(pipeline);

// console.debug('seed results', results);

console.debug('Part 2 result', min);
