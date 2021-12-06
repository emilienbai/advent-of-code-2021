import * as fs from "fs";

type Vent = { x1: number; x2: number; y1: number; y2: number };

function buildVentsMatrix(vents: Vent[]): (number | undefined)[][] {
  const matrix: number[][] = [];
  for (const vent of vents) {
    if (vent.x1 === vent.x2) {
      if (!matrix[vent.x1]) {
        matrix[vent.x1] = [];
      }
      const start = vent.y1 < vent.y2 ? vent.y1 : vent.y2;
      const end = vent.y1 > vent.y2 ? vent.y1 : vent.y2;
      for (let index = start; index <= end; index++) {
        matrix[vent.x1][index] =
          matrix[vent.x1][index] === undefined ? 1 : matrix[vent.x1][index] + 1;
      }
    } else if (vent.y1 === vent.y2) {
      const start = vent.x1 < vent.x2 ? vent.x1 : vent.x2;
      const end = vent.x1 > vent.x2 ? vent.x1 : vent.x2;
      for (let index = start; index <= end; index++) {
        if (!matrix[index]) {
          matrix[index] = [];
        }
        matrix[index][vent.y1] =
          matrix[index][vent.y1] === undefined ? 1 : matrix[index][vent.y1] + 1;
      }
    } else {
      const { startX, startY } =
        vent.x1 < vent.x2
          ? { startX: vent.x1, startY: vent.y1 }
          : { startX: vent.x2, startY: vent.y2 };
      const { endX, endY } =
        vent.x1 > vent.x2
          ? { endX: vent.x1, endY: vent.y1 }
          : {
              endX: vent.x2,
              endY: vent.y2,
            };
      const ascending = startY < endY;
      for (let index = 0; index <= endX - startX; ++index) {
        const x = startX + index;
        const y = startY + index * (ascending ? 1 : -1);
        if (!matrix[x]) {
          matrix[x] = [];
        }
        matrix[x][y] = matrix[x][y] === undefined ? 1 : matrix[x][y] + 1;
      }
    }
  }
  return matrix;
}

function main_part2() {
  const LineSplitterRegexp = new RegExp(/(\d+),(\d+) -> (\d+),(\d+)/);
  const vents: Vent[] = fs
    .readFileSync("day_5/input.txt")
    .toString()
    .split("\n")
    .map((line) => {
      const executedRegexp = LineSplitterRegexp.exec(line) ?? [];
      return {
        x1: parseInt(executedRegexp[1]),
        y1: parseInt(executedRegexp[2]),
        x2: parseInt(executedRegexp[3]),
        y2: parseInt(executedRegexp[4]),
      };
    });

  const ventMatrix = buildVentsMatrix(vents);
  let total: number = 0;
  ventMatrix.forEach((line) =>
    line.forEach((value) => {
      if (value && value >= 2) {
        total++;
      }
    })
  );
  console.log(total);
}

main_part2();
