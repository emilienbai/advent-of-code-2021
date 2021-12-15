import * as fs from "fs";

const PriorityQueue = require("js-priority-queue");

type Point = { x: number; y: number; value: number; shortest: number };
let minValue!: number;

function extendMatrix(matrix: Point[][]) {
  const length = matrix[0].length;
  const depth = matrix.length;
  for (let y = 0; y < depth; ++y) {
    for (let x = 0; x < length; ++x) {
      for (let deltaY = 0; deltaY < 5; ++deltaY) {
        for (let deltaX = 0; deltaX < 5; ++deltaX) {
          const newY = y + deltaY * depth;
          const newX = x + deltaX * length;
          if (!matrix[newY]) {
            matrix[newY] = [];
          }
          const computedValue = matrix[y][x].value + deltaX + deltaY;
          const newValue =
            computedValue <= 9 ? computedValue : computedValue % 9;
          matrix[newY][newX] = {
            x: newX,
            y: newY,
            value: newValue,
            shortest: Infinity,
          };
        }
      }
    }
  }
}

function findAdjacents(start: Point, matrix: Point[][]): Point[] {
  const adjacents = [];
  if (start.y > 0) {
    const top = matrix[start.y - 1][start.x];
    adjacents.push(top);
  }
  if (start.x > 0) {
    const left = matrix[start.y][start.x - 1];
    adjacents.push(left);
  }
  if (start.y < matrix.length - 1) {
    const bottom = matrix[start.y + 1][start.x];
    adjacents.push(bottom);
  }
  if (start.x < matrix[start.y].length - 1) {
    const right = matrix[start.y][start.x + 1];
    adjacents.push(right);
  }
  return adjacents;
}

function main_part2() {
  const matrix: Point[][] = [
    ...fs
      .readFileSync("day_15/input.txt")
      .toString()
      .split("\n")
      .map((lines, y) =>
        lines.split("").map((v, x) => ({
          x,
          y,
          value: parseInt(v),
          shortest: +Infinity,
        }))
      ),
  ];
  /* determine an arbitrary min value following borders */

  console.log(minValue);
  const priorityQueue = new PriorityQueue({
    comparator: function (p1: Point, p2: Point) {
      return matrix[p1.y][p1.x].shortest - matrix[p2.y][p2.x].shortest;
    },
  });
  extendMatrix(matrix);
  const length = matrix[0].length;
  const depth = matrix.length;
  matrix[0][0].shortest = 0;
  priorityQueue.queue({ x: 0, y: 0 });
  while (priorityQueue.length) {
    const currentPos = priorityQueue.dequeue();
    const pathCost = matrix[currentPos.y][currentPos.x].shortest;
    const adjacents = findAdjacents(currentPos, matrix);
    for (const adjacent of adjacents) {
      const newPathCost = pathCost + adjacent.value;
      if (matrix[adjacent.y][adjacent.x].shortest > newPathCost) {
        matrix[adjacent.y][adjacent.x].shortest = newPathCost;
        priorityQueue.queue({ x: adjacent.x, y: adjacent.y });
      }
    }
  }
  console.log(matrix[depth - 1][length - 1].shortest);
}

main_part2();
