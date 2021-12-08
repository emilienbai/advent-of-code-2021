import * as fs from "fs";

const isKnownValue = (str: string) => [2, 3, 4, 7].includes(str.length);

function main_part1() {
  const signals = fs
    .readFileSync("day_8/input.txt")
    .toString()
    .split("\n")
    .map((value: string) => {
      const [input, output] = value.split(" | ");
      return {
        inputs: input.split(" "),
        outputs: output.split(" "),
      };
    });

  let total = 0;
  for (const signal of signals) {
    for (const output of signal.outputs) {
      total += isKnownValue(output) ? 1 : 0;
    }
  }
  console.log(total);
}

main_part1();
