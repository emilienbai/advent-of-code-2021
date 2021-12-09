import * as fs from "fs";

function main_part1() {
  const lines = [
    ...fs
      .readFileSync("day_9/input.txt")
      .toString()
      .split("\n")
      .map((line) => line.split("")),
  ];
  const lineLength = lines[0].length;
  // @ts-ignore
    const heightMatrix: number[] = []
    .concat(...lines)
    .map((height) => parseInt(height));
  const isFirstColumnIndex = (index: number) => index % lineLength === 0;
  const isLastColumnIndex = (index: number) =>
    index % lineLength === lineLength - 1;
  let riskLevel = 0;

  for (let index = 0; index < heightMatrix.length; ++index) {
    const height = heightMatrix[index];
    if (height === 9) {
      continue;
    }
    // check above
    if (
      (index - lineLength) >= 0 &&
      height >= heightMatrix[index - lineLength]
    ) {
      continue;
    }

    if (!isLastColumnIndex(index)) {
      //check right
      if (height >= heightMatrix[index + 1]) {
        continue;
      }
    }
    if (
      index + lineLength < heightMatrix.length &&
      height >= heightMatrix[index + lineLength]
    ) {
      continue;
    }

    if (!isFirstColumnIndex(index)) {
      //check below
      if (height >= heightMatrix[index - 1]) {
        continue;
      }
    }
    riskLevel += height + 1;
  }
  console.log(riskLevel);
}

main_part1();
