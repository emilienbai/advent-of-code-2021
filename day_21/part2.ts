type Player = { pos: number; score: number };

const diceOutcomesProbability: { [outcome: number]: number } = {};
for (let i = 1; i <= 3; ++i) {
  for (let j = 1; j <= 3; ++j) {
    for (let k = 1; k <= 3; ++k) {
      const currentOutcome = i + j + k;
      if (!diceOutcomesProbability.hasOwnProperty(currentOutcome))
        diceOutcomesProbability[currentOutcome] = 0;
      diceOutcomesProbability[currentOutcome] =
        diceOutcomesProbability[currentOutcome] + 1;
    }
  }
}

const memo: { [key: string]: { p1: number; p2: number } } = {};

function computeWins(
  p1: Player,
  p2: Player,
  playerOnePlays: boolean
): { p1: number; p2: number } {
  const key = `p1s${p1.score}p1p${p1.pos}p2s${p2.score}p2p${p2.pos}${
    playerOnePlays ? 1 : 0
  }`;
  if (memo[key] !== undefined) {
    return memo[key];
  }

  if (p1.score >= 21) {
    return { p1: 1, p2: 0 };
  }
  if (p2.score >= 21) {
    return { p1: 0, p2: 1 };
  }

  let totalWins = { p1: 0, p2: 0 };
  for (let outcome = 3; outcome <= 9; outcome++) {
    if (playerOnePlays) {
      const newPosition = ((p1.pos + outcome - 1) % 10) + 1;
      const localWins = computeWins(
        {
          pos: newPosition,
          score: p1.score + newPosition,
        },
        { ...p2 },
        !playerOnePlays
      );
      totalWins = {
        p1: totalWins.p1 + localWins.p1 * diceOutcomesProbability[outcome],
        p2: totalWins.p2 + localWins.p2 * diceOutcomesProbability[outcome],
      };
    } else {
      const newPosition = ((p2.pos + outcome - 1) % 10) + 1;
      const localWins = computeWins(
        { ...p1 },
        {
          pos: newPosition,
          score: p2.score + newPosition,
        },
        !playerOnePlays
      );
      totalWins = {
        p1: totalWins.p1 + localWins.p1 * diceOutcomesProbability[outcome],
        p2: totalWins.p2 + localWins.p2 * diceOutcomesProbability[outcome],
      };
    }
  }
  memo[key] = totalWins;
  return totalWins;
}

function main() {
  const p1 = { pos: 10, score: 0 };
  const p2 = { pos: 8, score: 0 };
  console.log(computeWins(p1, p2, true));
}

main();
