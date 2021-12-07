import * as fs from "fs";

function main_part1() {
  const initialPositions = fs
    .readFileSync("day_7/input.txt")
    .toString()
    .split(",")
    .map((value: string) => parseInt(value));

  const amountPerPosition: { [initialPosition: number]: number } = {};
  for (const position of initialPositions) {
    if (!amountPerPosition[position]) {
      amountPerPosition[position] = 1;
    } else {
      amountPerPosition[position] = amountPerPosition[position] + 1;
    }
  }

  const costPerPosition: { [position: number]: number } = {};
  for (let currentPosition = 0; currentPosition < 2000; currentPosition += 1) {
    let cost = 0;
    for (const [position, amount] of Object.entries(amountPerPosition)) {
      const numberOfMoves = Math.abs(parseInt(position) - currentPosition)
      const costForPosition = (numberOfMoves + 1) * (numberOfMoves) / 2
      cost += costForPosition * amount;
    }
    costPerPosition[currentPosition] = cost;
  }

  console.log(costPerPosition);
  console.log(Math.min(...Object.values(costPerPosition)));
}

main_part1();
