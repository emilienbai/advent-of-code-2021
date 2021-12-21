function main() {
  let p1Position = 10;
  let p2Position = 8;
  let p1Score = 0,
    p2Score = 0;
  let numberOfRolls = 0;
  while (p1Score < 1000 && p2Score < 1000) {
    const draw = 3 * numberOfRolls + 6;
    if (numberOfRolls % 2 === 0) {
      const relativePosition = p1Position + draw;
      p1Position = relativePosition % 10 === 0 ? 10 : relativePosition % 10;
      p1Score += p1Position;
    } else {
      const relativePosition = p2Position + draw;
      p2Position = relativePosition % 10 === 0 ? 10 : relativePosition % 10;
      p2Score += p2Position;
    }
    numberOfRolls += 3;
  }
  console.log(Math.min(p1Score, p2Score) * numberOfRolls);
}

main();
