import * as fs from "fs";

type Point = { x: number; y: number; height: number };

class Basin {
  private includedPoints: Set<string>;
  private visitedPoints: Set<string>;
  private toVisitPoints: Point[];

  constructor(origin: Point, heightMatrix: number[][]) {
    this.includedPoints = new Set<string>();
    this.visitedPoints = new Set<string>();
    this.toVisitPoints = [];
    this.includedPoints.add(JSON.stringify(origin));
    this.visitedPoints.add(JSON.stringify(origin));
    this.toVisitPoints = getAdjacentPoints(origin, heightMatrix);
    this.buildBasin(heightMatrix);
  }

  get size() {
    return this.includedPoints.size;
  }

  private buildBasin(heightMatrix: number[][]): void {
    while (this.toVisitPoints.length > 0) {
      let pointsToVisitLater: Point[] = [];
      this.toVisitPoints.forEach((visitedPoint) => {
        this.visitedPoints.add(JSON.stringify(visitedPoint));
        if (visitedPoint.height !== 9) {
          this.includedPoints.add(JSON.stringify(visitedPoint));
            getAdjacentPoints(visitedPoint, heightMatrix).forEach(
                (adjacentPoint: Point) => {
                    if (adjacentPoint.height !== 9 && !this.visitedPoints.has(JSON.stringify(adjacentPoint))) {
                        pointsToVisitLater.push(adjacentPoint);
                    }
                }
            );
        }
      });
      this.toVisitPoints = [...pointsToVisitLater];
    }
  }
}

function getAdjacentPoints(
  { x, y, height }: Point,
  lines: number[][]
): Point[] {
  const points = [];
  if (x > 0) {
    points.push({ x: x - 1, y: y, height: lines[x - 1][y] });
  }
  if (x + 1 < lines.length) {
    points.push({ x: x + 1, y: y, height: lines[x + 1][y] });
  }
  if (y > 0) {
    points.push({ x: x, y: y - 1, height: lines[x][y - 1] });
  }
  if (y + 1 < lines[x].length) {
    points.push({ x: x, y: y + 1, height: lines[x][y + 1] });
  }
  return points;
}

function main_part1() {
  const heightMatrix = [
    ...fs
      .readFileSync("day_9/input.txt")
      .toString()
      .split("\n")
      .map((line) => line.split("").map((h) => parseInt(h, 10))),
  ];
  console.log(heightMatrix);
  const basins = [];
  for (let x = 0; x < heightMatrix.length; ++x) {
    for (let y = 0; y < heightMatrix[x].length; ++y) {
      const height = heightMatrix[x][y];
      const point: Point = { x, y, height };
      const adjacent = getAdjacentPoints(point, heightMatrix);
      if (adjacent.every((p) => p.height > height)) {
        basins.push(new Basin(point, heightMatrix));
      }
    }
  }
  basins.sort((b1, b2) => b2.size - b1.size);
  console.log(basins[0].size * basins[1].size * basins[2].size);
}

main_part1();
