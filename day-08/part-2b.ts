import { fileLinesToStringArray } from '../helpers';

const lines = await fileLinesToStringArray('./sample-3.txt');

const instructions = lines[0].split('');

console.info('The instructions: ', instructions);

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
  {} as Record<string, { L: string; R: string }>
);

console.info('Parsed Map', map);

// Build notes out from map

// let currentNodes = Object.keys(map).filter((k) => k.at(2) === 'A');
// const endNodes = new Set(Object.keys(map).filter((k) => k.at(2) === 'Z'));
//
// console.debug({
//   currentNodes,
//   endNodes,
// });
//
// let stepCount = 0;
//
// let i = 0; // instruction index
// const instructionLength = instructions.length;
//
// while (!currentNodes.every((cn) => endNodes.has(cn))) {
//   const instruction = instructions[i];
//   currentNodes = currentNodes.map((cn) => map[cn][instruction]);
//   stepCount++;
//
//   console.debug('New nodes and stepCount', {
//     currentNodes,
//     stepCount,
//   });
//
//   if (i === instructionLength - 1) {
//     i = 0;
//   } else {
//     i++;
//   }
// }
//
// console.info('Final nodes: ', currentNodes);
// console.info('Number of steps: ', stepCount);
