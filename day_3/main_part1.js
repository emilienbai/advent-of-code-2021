const fs = require("fs");

function main_part1() {
  const report = fs.readFileSync("input.txt").toString().split("\n");
  const amountOfOnesByColumns = [];
  for (const line of report) {
    [...line].forEach((char, index) => {
      if (char === "1") {
        amountOfOnesByColumns[index] = (amountOfOnesByColumns[index] ?? 0) + 1;
      }
    });
  }
  const reportLength = report.length;
  let gamma = "";
  let epsilon = "";
  amountOfOnesByColumns.forEach((entry) => {
    if (entry > reportLength / 2) {
      gamma += "1";
      epsilon += "0";
    } else {
      gamma += "0";
      epsilon += "1";
    }
  });

  const gammaAsNumber = parseInt(gamma, 2);
  const epsilonAsNumber = parseInt(epsilon, 2);
  console.log(epsilonAsNumber * gammaAsNumber);
}

main_part1();
