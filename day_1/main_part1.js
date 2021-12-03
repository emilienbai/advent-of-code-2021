const fs = require("fs");

function main_part1() {
  const inputFile = fs.readFileSync("input.txt");
  const fileAsArray = inputFile
    .toString()
    .split("\n")
    .map((input) => Number(input));
  let increaseCount = 0;
  for (let i = 1; i < fileAsArray.length; i++) {
    if (fileAsArray[i] > fileAsArray[i - 1]) {
      increaseCount++;
    }
  }
  console.log(increaseCount);
}

main_part1();
