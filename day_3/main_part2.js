const fs = require("fs");

function main_part2() {
  const report = fs.readFileSync("input.txt").toString().split("\n");

  let oxygenReport = [...report];
  let index = 0;
  while (oxygenReport.length > 1) {
    let numberOfOnes = 0;
    for (const line of oxygenReport) {
      if (line.charAt(index) === "1") {
        ++numberOfOnes;
      }
    }
    oxygenReport = oxygenReport.filter(
      (line) =>
        line.charAt(index) ===
        (numberOfOnes >= oxygenReport.length / 2 ? "1" : "0")
    );
    ++index;
  }
  const oxygen = parseInt(oxygenReport.pop(), 2);

  let co2Report = [...report];
  index = 0;
  while (co2Report.length > 1) {
    let numberOfOnes = 0;
    for (const line of co2Report) {
      if (line.charAt(index) === "1") {
        ++numberOfOnes;
      }
    }
    co2Report = co2Report.filter(
      (line) =>
        line.charAt(index) === (numberOfOnes < co2Report.length / 2 ? "1" : "0")
    );
    ++index;
  }
  const co2 = parseInt(co2Report.pop(), 2);

  console.log(oxygen);
  console.log(co2);
  console.log(oxygen * co2);
}

main_part2();
