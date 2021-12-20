import * as fs from "fs";

type Pixel = "." | "#";

const expandMatrix = (matrix: Pixel[][]): Pixel[][] => {
  const newMatrix: Pixel[][] = [];
  const originalHeight = matrix.length;
  const originalWidth = matrix[0].length;
  for (let y = -originalHeight; y < originalHeight * 2; ++y) {
    for (let x = -originalWidth; x < originalWidth * 2; ++x) {
      const offsetY = y + originalHeight;
      const offsetX = x + originalWidth;
      if (!newMatrix[offsetY]) {
        newMatrix[offsetY] = [];
      }
      if (x < 0 || x > originalWidth - 1 || y < 0 || y > originalHeight - 1) {
        newMatrix[offsetY][offsetX] = ".";
      } else {
        newMatrix[offsetY][offsetX] = matrix[y][x];
      }
    }
  }
  return newMatrix;
};

const enhance = (image: Pixel[][], algorithm: Pixel[]): Pixel[][] => {
  let newImage: Pixel[][] = [];
  image.forEach((line, y) => {
    line.forEach((pixel, x) => {
      if (!newImage[y]) {
        newImage[y] = [];
      }

      newImage[y][x] = algorithm[getPixelValue(image, y, x)];
    });
  });
  return newImage;
};

const getPixelValue = (matrix: Pixel[][], y: number, x: number): number => {
  let valueAsString =
    matrix[y - 1] && matrix[y - 1][x - 1]
      ? matrix[y - 1][x - 1] === "."
        ? "0"
        : "1"
      : "0";
  valueAsString +=
    matrix[y - 1] && matrix[y - 1][x]
      ? matrix[y - 1][x] === "."
        ? "0"
        : "1"
      : "0";
  valueAsString +=
    matrix[y - 1] && matrix[y - 1][x + 1]
      ? matrix[y - 1][x + 1] === "."
        ? "0"
        : "1"
      : "0";
  valueAsString += matrix[y][x - 1]
    ? matrix[y][x - 1] === "."
      ? "0"
      : "1"
    : "0";
  valueAsString += matrix[y][x] ? (matrix[y][x] === "." ? "0" : "1") : "0";
  valueAsString += matrix[y][x + 1]
    ? matrix[y][x + 1] === "."
      ? "0"
      : "1"
    : "0";
  valueAsString +=
    matrix[y + 1] && matrix[y + 1][x - 1]
      ? matrix[y + 1][x - 1] === "."
        ? "0"
        : "1"
      : "0";
  valueAsString +=
    matrix[y + 1] && matrix[y + 1][x]
      ? matrix[y + 1][x] === "."
        ? "0"
        : "1"
      : "0";
  valueAsString +=
    matrix[y + 1] && matrix[y + 1][x + 1]
      ? matrix[y + 1][x + 1] === "."
        ? "0"
        : "1"
      : "0";
  return parseInt(valueAsString, 2);
};

function main() {
  const [rawAlgorithm, rawMatrix]: string[] = fs
    .readFileSync("day_20/input.txt")
    .toString()
    .split("\n\n")
  const algorithm: Pixel[] = rawAlgorithm.split("") as Pixel[];
  const matrix: Pixel[][] = rawMatrix
    .split("\n")
    .map((lines) => lines.split("")) as Pixel[][];
  const expandedMatrix = expandMatrix(matrix);
  const enhanced1 = enhance(expandedMatrix, algorithm);
  const enhanced2 = enhance(enhanced1, algorithm);
  for (const line of enhanced2) {
    console.log(line.join(""));
  }
  console.log(
    enhanced2.reduce((amountOfLines: number, line) => {
      return (
        amountOfLines +
        line.reduce((countOnThisLine: number, pixel: Pixel) => {
          return countOnThisLine + (pixel === "#" ? 1 : 0);
        }, 0)
      );
    }, 0) - ((enhanced2.length -1) * 2)
  );
}

main();
