import { fileLinesToStringArray } from '../helpers';

type Direction = 'L' | 'R';

type Node = {
  L: string;
  R: string;
};

const lines = await fileLinesToStringArray('./input-1.txt');

const instructions = lines[0].split('') as Direction[];

console.info('The instructions: ', instructions);

const mapLines = lines.slice(2);

console.debug('the mapLines', mapLines);
const map = mapLines.reduce(
  (acc, next) => {
    acc[next.substring(0, 3)] = {
      L: next.substring(7, 10),
      R: next.substring(12, 15),
    };

    return acc;
  },
  {} as Record<string, Node>
);

console.info('Parsed Map', map);

let currentNode = map['AAA'];
const goalNode = map['ZZZ'];
let stepCount = 0;

let i = 0; // instruction index
const instructionLength = instructions.length;

while (currentNode != goalNode) {
  const instruction = instructions[i];
  currentNode = map[currentNode[instruction]];
  stepCount++;

  if (i === instructionLength - 1) {
    i = 0;
  } else {
    i++;
  }
}

console.info('Number of steps: ', stepCount);
