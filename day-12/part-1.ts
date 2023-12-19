import { fileLinesToStringArray } from '../helpers';

// const buildCombinations = (schematic: string, splits: number[]) => {
//   const sch = schematic.split('');
//   let allowable = sch;
//
//   console.debug(allowable);
// };

const lines = await fileLinesToStringArray('sample-1.txt');

const springSchematics = lines.map((line) => {
  const [schematic, strSplits] = line.split(' ');

  const splits = strSplits.split(',').map((n) => parseInt(n, 10));

  return {
    schematic,
    splits,
  };
});

// console.info('Parsed schematics: ', springSchematics);

const test = '.#..###';
const matches = test.match(/[?#]+/g);

console.debug('matches', {
  schematic: test,
  matches,
});
