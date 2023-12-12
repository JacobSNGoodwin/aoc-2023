import { fileLinesToStringArray } from '../helpers';

const cardVals: Record<string, number> = {
  J: 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
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

const getHandGroupingsAndJacks = (
  handCounts: Record<string, number>
): { counts: number[]; jacks: number } => {
  const { unsortedCounts, jacks } = Object.entries(handCounts).reduce(
    (built, [cardType, cardCount]) => {
      if (cardType === 'J') {
        built.jacks = built.jacks + cardCount;
        return built;
      }

      built.unsortedCounts.push(cardCount);

      return built;
    },
    {
      unsortedCounts: [] as number[],
      jacks: 0,
    }
  );

  return {
    counts: unsortedCounts.toSorted((a, b) => b - a),
    jacks,
  };
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

const assignHandRank = (counts: number[], jacks: number): number => {
  // must fallback in case of 5 jacks
  const maxCount = (counts?.[0] ?? 0) + jacks;

  // 5 of a kind
  if (maxCount === 5) {
    return 7;
  }

  // 4 of a kind
  if (maxCount === 4) {
    return 6;
  }

  // full house
  if (maxCount === 3 && counts[1] === 2) {
    return 5;
  }

  // 3 of a kind
  if (maxCount === 3) {
    return 4;
  }

  // two pair
  if (maxCount === 2 && counts[1] === 2) {
    return 3;
  }

  // single pair
  if (maxCount === 2) {
    return 2;
  }

  return 1;
};

const lines = await fileLinesToStringArray('input-1.txt');

const parsedHands = lines.map((l) => {
  const [hand, bidStr] = l.trim().split(' ');

  const bid = parseInt(bidStr, 10);
  const handCounts = buildHandCounts(hand);
  const { counts, jacks } = getHandGroupingsAndJacks(handCounts);

  const result = {
    hand,
    bid,
    value: assignHandValue(hand), // only rank will be affected by jokers - handValue updated by cardVals map
    rank: assignHandRank(counts, jacks),
    handCounts,
    // for debugging
    counts,
    jacks,
  };

  // if (hand === 'JJ44J') {
  //   console.debug(result);
  // }

  return result;
});

// console.debug('parsedHands', parsedHands);

const sortedCards = parsedHands.sort((h1, h2) => {
  if (h1.rank !== h2.rank) {
    return h1.rank - h2.rank;
  }

  return h1.value - h2.value;
});

console.debug(
  'Cards sorted by rank then value',
  sortedCards.filter(({ rank }) => rank === 1)
);

const score = sortedCards.reduce((acc, { bid }, i) => {
  return acc + (i + 1) * bid;
}, 0);

// Too low: 250595468
console.debug('Part 2 result: ', score);
