import { fileLinesToStringArray } from '../helpers';

type Direction = 'L' | 'R';

type Node = string;
type NodeDirections = {
  L: string;
  R: string;
};

const findPossibleEndNodes = (start: Node, instructions: Direction[]) => {
  // list of steps in instructions at which the node was found.
  // Used to determine if we have a cycle and can stop
  const foundEndNodes: Map<Node, number[]> = new Map();

  const instructionLength = instructions.length;
  let step = 0;

  let hasFoundEndOrCycle = false;
  let currentNode = start;
  const endNodeSteps: number[] = [];

  while (!hasFoundEndOrCycle) {
    const instructionStep = step % instructionLength;
    const instruction = instructions[instructionStep];

    const nextNode = map[currentNode][instruction];
    // console.debug('instruction and step', {
    //   step,
    //   instructionStep,
    //   instruction,
    //   currentNode,
    //   nextNode,
    // });

    if (nextNode.at(2) === 'Z') {
      console.debug(`Found end node [${nextNode}]. Adding node to found list`, {
        step,
        instructionStep,
        instruction,
      });

      if (foundEndNodes.has(nextNode)) {
        const existingInstructionSteps = foundEndNodes.get(nextNode);

        if (existingInstructionSteps?.includes(instructionStep)) {
          return {
            steps: endNodeSteps,
            instructionSteps: existingInstructionSteps,
            repeatedStep: step,
          };
        }

        existingInstructionSteps?.push(instructionStep);
      } else {
        foundEndNodes.set(nextNode, [instructionStep]);
      }

      endNodeSteps.push(step + 1);
    }
    currentNode = nextNode;
    step++;
  }
};

const lines = await fileLinesToStringArray('./input-1.txt');

const instructions = lines[0].split('') as Direction[];
// console.info('The instructions: ', instructions);

const mapLines = lines.slice(2);

// console.debug('the mapLines', mapLines);
const map = mapLines.reduce(
  (acc, next) => {
    acc[next.substring(0, 3)] = {
      L: next.substring(7, 10),
      R: next.substring(12, 15),
    };

    return acc;
  },
  {} as Record<Node, NodeDirections>
);

// console.info('Parsed Map', map);

const startNodes: Node[] = Object.keys(map).filter((k) => k.at(2) === 'A');

console.info('List of start and end nodes', {
  startNodes,
});

const endNodeData = startNodes.map((startNode) =>
  findPossibleEndNodes(startNode, instructions)
);

console.debug('Possible end nodes given start node', endNodeData);

const possibleEndNodeSteps = endNodeData
  .flatMap((d) => d?.steps ?? [])
  .toSorted();

console.debug('possible end node steps', possibleEndNodeSteps);

// Iterate over multiples of smalled step until all steps divide evenly
// This is the brute force approach
//
// let i = 1;
// const minMultiple = possibleEndNodeSteps[0];
//
// console.debug('testing all versus minMultiple', minMultiple);
//
// while (true) {
//   const currentTest = minMultiple * i;
//
//   if (possibleEndNodeSteps.slice(1).every((s) => currentTest % s === 0)) {
//     break;
//   }
//
//   i++;
// }

// console.log('Found the least common multiple of end nodes! ', i * minMultiple);

// It might would be better to ge the factors shared amount the
// steps and multiple together to get the least common multiple
// Here we go!
const gcd = (a: number, b: number): number => {
  if (a < b) {
    const temp = b;
    b = a;
    a = temp;
  }
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

// lcm of 2 ints is a * b / lcm(a,b)

let currentLCM = possibleEndNodeSteps[0];
for (let i = 1; i < possibleEndNodeSteps.length; i++) {
  const n1 = possibleEndNodeSteps[i];
  const n2 = currentLCM;
  const numerator = n1 * n2;
  const greatestCommonDenominator = gcd(n1, n2);

  console.debug('common denomoniator', {
    n1,
    n2,
    numerator,
    greatestCommonDenominator,
  });

  currentLCM = (n1 * n2) / gcd(n1, n2);
}

console.log('The result: ', currentLCM);
