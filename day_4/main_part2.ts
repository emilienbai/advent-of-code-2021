import * as fs from "fs";

class Zone {
  public value: number;
  public discovered: boolean;

  constructor(_value: number) {
    this.value = _value;
    this.discovered = false;
  }
}

class Grid {
  private grid: Zone[][];
  public won: boolean;

  constructor() {
    this.grid = [];
    this.won = false;
  }

  static fromString(input: string): Grid {
    const newGrid = new Grid();
    const lines = input.split("\n");
    lines.forEach((line: string, lineIndex: number) => {
      newGrid.grid[lineIndex] = (line.match(new RegExp(/.{1,3}/g)) ?? []).map(
        (value) => new Zone(parseInt(value))
      );
    });
    return newGrid;
  }

  public handleDraw(drawnNumber: number): number {
    let matched = false;
    let line = 0,
      column = 0;
    for (line; line < this.grid.length; ++line) {
      column = 0;
      for (column; column < this.grid[line].length; ++column) {
        if (this.grid[line][column].value === drawnNumber) {
          this.grid[line][column].discovered = true;
          matched = true;
          break;
        }
      }
      if (matched) {
        break;
      }
    }

    if (matched) {
      const wins = this.handleMatchAt(line, column);
      if (wins) {
        this.won = true;
        return this.computeRemainingValue();
      }
    }
    return -1;
  }

  private handleMatchAt(line: number, column: number): boolean {
    const matchOnLine = this.grid[line].every((zone) => zone.discovered);
    const matchOnColumn = this.grid.every((a) => a[column].discovered);
    return matchOnColumn || matchOnLine;
  }

  private computeRemainingValue(): number {
    let total = 0;
    this.grid.forEach((line) => {
      line.forEach((zone) => {
        total += zone.discovered ? 0 : zone.value;
      });
    });
    return total;
  }
}

function main_part1() {
  const [rawDraw, ...rawGrids] = fs
    .readFileSync("day_4/input.txt")
    .toString()
    .split("\n\n");

  console.log(rawDraw);
  console.log(rawGrids);

  const grids = rawGrids.map((grid) => Grid.fromString(grid));
  const draw = rawDraw.split(",").map((value) => parseInt(value));

  let d!: number;
  let gridResult!: number;
  let remainingGrids = grids.filter((g) => !g.won);
  for (d of draw) {
    for (const grid of remainingGrids) {
      gridResult = grid.handleDraw(d);
    }
    remainingGrids = remainingGrids.filter((g) => !g.won);
    if (!remainingGrids.length) {
      break;
    }
  }

  console.log(d);
  console.log(gridResult);
  console.log(d * gridResult);
}

main_part1();
