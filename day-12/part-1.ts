import { build } from 'bun';
import { fileLinesToStringArray } from '../helpers';

const isValid = (schematic: string, splits: number[]): boolean => {
  const matches = schematic.match(/[#]+/g) ?? [];
  const matchLengths = matches.map((v) => v.length);

  // console.debug('splits and matches', {
  //   splits,
  //   matches,
  //   matchLengths,
  // });

  return (
    splits.length === matchLengths.length &&
    splits.every((val, index) => val === matchLengths[index])
  );
};

const buildPermutations = (schematic: string) => {
  const unknownIndices: number[] = [...schematic.matchAll(/[?]/g)].map(
    (match) => match.index!
  );

  const permutationCount = Math.pow(2, unknownIndices.length);

  const permutations = [];

  for (let i = 0; i < permutationCount; i++) {
    const unknownPermutation = i
      .toString(2)
      .padStart(unknownIndices.length, '0')
      .split('')
      .map((c) => (c === '0' ? '.' : '#'));

    // console.debug('unknownPermutation', unknownIndices, unknownPermutation);

    const schematicPermutation = schematic.split('');

    // console.debug('schematicPermutation', schematicPermutation);
    for (let j = 0; j < unknownPermutation.length; j++) {
      schematicPermutation[unknownIndices[j]] = unknownPermutation[j];

      // console.debug('updated schematicPermutation', schematicPermutation);
    }
    permutations.push(schematicPermutation.join(''));
  }

  // console.debug(unknownIndices, permutationCount, permutations);
  return permutations;
};

const lines = await fileLinesToStringArray('input.txt');

const springSchematics = lines.map((line) => {
  const [schematic, strSplits] = line.split(' ');

  const splits = strSplits.split(',').map((n) => parseInt(n, 10));

  return {
    schematic,
    splits,
  };
});

// Brute forcing this, though there must be some sort of dynamic solution where we can match
// populate '?' up to a point and store potentially valid solutions

const totalValid = springSchematics.reduce((acc, { schematic, splits }) => {
  const validPermutations = buildPermutations(schematic).filter((s) =>
    isValid(s, splits)
  );

  // console.debug('Current schematic', {
  //   schematic,
  //   validPermutations,
  //   splits,
  // });

  return acc + validPermutations.length;
}, 0);

console.info('Part 1: ', totalValid);
