import { fileLinesToStringArray } from './helpers';

const file = fileLinesToStringArray('input.txt');

console.debug('the file', {
  file,
});
