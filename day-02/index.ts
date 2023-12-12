import { fileLinesToStringArray } from '../helpers';

const maxPerColor = {
  red: 12,
  green: 13,
  blue: 14,
};

const parseGame = (game: string) => {
  const [gameStr, roundsStr] = game.split(':');

  const gameNumber = parseInt(gameStr.split(' ')[1]);

  const roundResultStrings = roundsStr.split(';');

  const roundSets: Array<{
    red?: number;
    green?: number;
    blue?: number;
  }> = roundResultStrings.map((roundStr) => {
    console.debug('mapping roundsStr', roundStr);
    const colorCounts = roundStr.split(',').reduce((counts, colorStr) => {
      const colorCount = colorStr.split(' ');
      counts[colorCount[2]] = parseInt(colorCount[1]);
      return counts;
    }, {});

    return colorCounts;
  });

  const colorHighs = roundSets.reduce<{
    red: number;
    green: number;
    blue: number;
  }>(
    (highs, colorResult) => {
      if (colorResult.red && colorResult.red > highs.red) {
        highs.red = colorResult.red;
      }
      if (colorResult.green && colorResult.green > highs.green) {
        highs.green = colorResult.green;
      }
      if (colorResult.blue && colorResult?.blue > highs.blue) {
        highs.blue = colorResult.blue;
      }

      return highs;
    },
    {
      red: 0,
      green: 0,
      blue: 0,
    }
  );

  return { gameNumber, roundSets, colorHighs };
};

const gameRounds: Array<string> = await fileLinesToStringArray('input-1.txt');

// console.debug('gameRounds', gameRounds);

const gameData = gameRounds.map(parseGame);

// console.debug('gameData', gameData);

const validRounds = gameData.filter(({ colorHighs }) => {
  return (
    colorHighs.red <= maxPerColor.red &&
    colorHighs.green <= maxPerColor.green &&
    colorHighs.blue <= maxPerColor.blue
  );
});

// part 1
console.debug('validRounds', validRounds);

const result1 = validRounds.reduce(
  (tot: number, curr) => tot + curr.gameNumber,
  0
);

console.log('Result1', result1);

// part 2
const total = gameData.reduce<number>((total, { colorHighs }) => {
  return total + colorHighs.red * colorHighs.green * colorHighs.blue;
}, 0);

console.debug('Result 2', total);
