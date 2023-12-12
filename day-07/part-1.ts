import { fileLinesToStringArray } from '../helpers';

const cardVals: Record<string, number> = {
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

const buildHandCounts = (hand: string): Record<string, number> => {
  return hand
    .split('')
    .reduce<Record<string, number>>((acc, currCard: string) => {
      if (acc[currCard]) {
        acc[currCard] = acc[currCard] + 1;
      } else {
        acc[currCard] = 1;
      }

      return acc;
    }, {});
};

const assignHandValue = (hand: string): number => {
  return (
    cardVals[hand[0]] * Math.pow(13, 4) +
    cardVals[hand[1]] * Math.pow(13, 3) +
    cardVals[hand[2]] * Math.pow(13, 2) +
    cardVals[hand[3]] * Math.pow(13, 1) +
    cardVals[hand[4]] * Math.pow(13, 0)
  );
};

const assignHandRank = (handCounts: Record<string, number>): number => {
  const counts = Object.values(handCounts);
  const countSet = new Set(counts);

  if (countSet.has(5)) {
    return 7;
  }

  if (countSet.has(4)) {
    return 6;
  }

  if (countSet.has(3) && countSet.has(2)) {
    return 5;
  }

  if (countSet.has(3) && !countSet.has(2)) {
    return 4;
  }

  if (counts.filter((c) => c === 2).length === 2) {
    return 3;
  }

  if (countSet.has(2)) {
    return 2;
  }

  return 1;
};

const lines = await fileLinesToStringArray('input-1.txt');

const parsedHands = lines.map((l) => {
  const [hand, bidStr] = l.trim().split(' ');

  const bid = parseInt(bidStr, 10);
  const handCounts = buildHandCounts(hand);

  return {
    hand,
    bid,
    value: assignHandValue(hand),
    rank: assignHandRank(handCounts),
    handCounts,
  };
});

console.debug('parsedHands', parsedHands);

const sortedCards = parsedHands.sort((h1, h2) => {
  if (h1.rank !== h2.rank) {
    return h1.rank - h2.rank;
  }

  return h1.value - h2.value;
});

console.debug('Cards sorted by rank then value', sortedCards);

const score = sortedCards.reduce((acc, { bid }, i) => {
  return acc + (i + 1) * bid;
}, 0);

console.debug('Part 1 result: ', score);
