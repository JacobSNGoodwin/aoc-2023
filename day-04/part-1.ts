import { createSemanticDiagnosticsBuilderProgram } from 'typescript';
import { fileLinesToStringArray } from '../helpers';

const scoreCards = await fileLinesToStringArray('input-1.txt');

// console.debug('the score scards', scoreCards);

const formattedScoreScards = scoreCards.map((scoreLine) => {
  const [cardNumStr, cardsStr] = scoreLine.split(':');

  const [winnersStr, handStr] = cardsStr.split('|');

  const cardNumber = parseInt(cardNumStr.split(/\s+/)[1], 10);

  const winningSet = new Set(
    winnersStr
      .split(/\s+/)
      .filter((n) => n !== '')
      .map((val) => parseInt(val, 10))
  );

  const handSet = new Set(
    handStr
      .split(/\s+/)
      .filter((n) => n !== '')
      .map((val) => parseInt(val, 10))
  );

  const winnerCount = [...handSet].reduce((currCount, nextCard) => {
    if (winningSet.has(nextCard)) {
      return currCount + 1;
    }

    return currCount;
  }, 0);

  return {
    cardNumber,
    winningSet,
    handSet,
    winnerCount,
  };
});

// console.debug('formattedScoreCards', formattedScoreScards);

const round1Total = formattedScoreScards.reduce((tot, nextCard) => {
  if (nextCard.winnerCount === 0) {
    return tot;
  }

  return tot + Math.pow(2, nextCard.winnerCount - 1);
}, 0);

console.debug('round 1 result', round1Total);
