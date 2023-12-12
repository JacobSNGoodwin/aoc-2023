import { fileLinesToStringArray } from '../helpers';

type MapData = {
  destination: number;
  source: number;
  range: number;
};

const getSeeds = (lines: string[]) =>
  lines[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .map((s) => parseInt(s, 10));

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
  console.debug(
    `
    -----------------------------------
    Running pipeline for seed: ${seed}
    -----------------------------------
    `
  );

  let output = seed;

  const stepsIterator = steps.entries();
  let currentStep = stepsIterator.next();
  while (!currentStep.done) {
    const [stepTitle, map] = currentStep.value;
    console.debug('\nProcessing map step', { stepTitle, input: output, map });

    output = processMap(output, map);

    console.debug('Stage output', output);
    currentStep = stepsIterator.next();
  }

  return output;
};

const lines = await fileLinesToStringArray('input-1.txt');

const seeds = getSeeds(lines);
// console.debug('parsed text', seeds);

const steps = getSteps(lines.slice(1));

// console.log('the steps', steps);

const pipeline = createPipeline(steps);

const results = seeds.map(pipeline);

console.debug('seed results', results);

console.debug('Part 1 result', Math.min(...results));
