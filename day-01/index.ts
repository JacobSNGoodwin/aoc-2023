import { fileLinesToStringArray } from '../helpers';

const fileArray = await fileLinesToStringArray('input.txt');

console.debug('the file', {
  fileArray,
});

const codeVals = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const codeValEntries = Object.entries(codeVals);

// const reverseCodeMap = Object.fromEntries(
//   Object.entries(codeVals).map(([code, codeVal]) => [
//     code.split('').reverse().join(''),
//     codeVal,
//   ])
// );

// console.debug('codeValEntries', codeValEntries);

const getFirstDigit = (word: string) => {
  const n = word.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < codeValEntries.length; j++) {
      if (word.startsWith(codeValEntries[j][0], i)) {
        return codeValEntries[j][1];
      }
    }
  }

  return 0;
};

const getLastDigit = (word: string) => {
  // const reversedWord = word.split('').reverse().join('');
  const n = word.length;

  for (let i = n; i > 0; i--) {
    for (let j = 0; j < codeValEntries.length; j++) {
      if (word.endsWith(codeValEntries[j][0], i)) {
        return codeValEntries[j][1];
      }
    }
  }
  return 0;
};
const result = fileArray.reduce((prev: number, nextString: string) => {
  const [v1, v2] = [getFirstDigit(nextString), getLastDigit(nextString)];
  console.debug('line values', v1, v2);
  return prev + 10 * v1 + v2;
}, 0);

console.debug('the result', result);
