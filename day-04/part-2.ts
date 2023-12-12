import { createSemanticDiagnosticsBuilderProgram } from 'typescript';
import { fileLinesToStringArray } from '../helpers';

const scoreCards = await fileLinesToStringArray('input-1.txt');

// console.debug('the score scards', scoreCards);
type CardNumber = number;
type CardData = {
  winningCount: number;
  cardCount: number;
};
type ScoreCards = Map<CardNumber, CardData>;

const scoreCardData = scoreCards.reduce<ScoreCards>((current, scoreLine) => {
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

  const winningCount = [...handSet].reduce((currCount, nextCard) => {
    if (winningSet.has(nextCard)) {
      return currCount + 1;
    }

    return currCount;
  }, 0);

  current.set(cardNumber, {
    winningCount,
    cardCount: 1,
  });

  return current;
}, new Map());

// console.debug('originalScoreCards', originalScoreCards);

scoreCardData.forEach(
  (
    { cardCount: currentCardCount, winningCount: currentCardWinningCount },
    currentCardNumber
  ) => {
    for (
      let i = currentCardNumber + 1;
      i <= currentCardNumber + currentCardWinningCount;
      i++
    ) {
      if (scoreCardData.has(i)) {
        const ithCardData = scoreCardData.get(i)!;
        scoreCardData.set(i, {
          winningCount: ithCardData.winningCount,
          cardCount: ithCardData.cardCount + currentCardCount,
        });
      }
    }
  }
);

// console.debug('updated scoreCardData', scoreCardData);

const part2Result = Array.from(scoreCardData.values()).reduce(
  (prevTot, nextCard) => {
    return prevTot + nextCard.cardCount;
  },
  0
);

console.debug('part 2 result', part2Result);
