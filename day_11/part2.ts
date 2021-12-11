import * as fs from "fs";

class Octopus {
  constructor(
    public id: number,
    public energy: number,
    public x: number,
    public y: number
  ) {}

  public getAdjacents(matrix: Octopus[][]): Octopus[] {
    const octopuses = [];
    if (this.x > 0) {
      octopuses.push(matrix[this.y][this.x - 1]);
      if (this.y < 9) {
        octopuses.push(matrix[this.y + 1][this.x - 1]);
      }
      if (this.y > 0) {
        octopuses.push(matrix[this.y - 1][this.x - 1]);
      }
    }

    if (this.x < 9) {
      octopuses.push(matrix[this.y][this.x + 1]);
      if (this.y < 9) {
        octopuses.push(matrix[this.y + 1][this.x + 1]);
      }
      if (this.y > 0) {
        octopuses.push(matrix[this.y - 1][this.x + 1]);
      }
    }
    if (this.y < 9) {
      octopuses.push(matrix[this.y + 1][this.x]);
    }
    if (this.y > 0) {
      octopuses.push(matrix[this.y - 1][this.x]);
    }
    return octopuses;
  }
}

function handleFlashes(octopusMatrix: Octopus[][]): number {
  let numberOfFlashes = 0;
  let flashed = false;
  const flashedId = new Set<number>();
  do {
    flashed = false;
    let toIncrease: Octopus[] = [];
    octopusMatrix.forEach((line) =>
      line.forEach((currentOctopus) => {
        if (currentOctopus.energy > 9) {
          numberOfFlashes++;
          flashed = true;
          currentOctopus.energy = 0;
          flashedId.add(currentOctopus.id);
          const notFlashedAdjacent = currentOctopus
            .getAdjacents(octopusMatrix)
            .filter((o) => !flashedId.has(o.id) && o.energy <= 9);
          toIncrease = toIncrease.concat(notFlashedAdjacent);
        }
      })
    );

    toIncrease.forEach((octopus) => (octopus.energy = octopus.energy + 1));
  } while (flashed);
  return numberOfFlashes;
}

function main_part2() {
  let id = 0;
  const octopusMatrix: Octopus[][] = [
    ...fs
      .readFileSync("day_11/input.txt")
      .toString()
      .split("\n")
      .map((line, y: number) =>
        line
          .split("")
          .map(
            (h: string, x: number) => new Octopus(id++, parseInt(h, 10), x, y)
          )
      ),
  ];
  for (let step = 1; step <= 1000; ++step) {
    octopusMatrix.forEach((line) =>
      line.forEach((octopus) => (octopus.energy = octopus.energy + 1))
    );
    if(handleFlashes(octopusMatrix) === 100) {
      console.log(step);
      break;
    }
  }
}

main_part2();
