import * as fs from "fs";

function getExpected(input: string) {
  switch (input) {
    case ")":
      return "(";
    case "]":
      return "[";
    case "}":
      return "{";
    case ">":
      return "<";
    default:
      throw new Error();
  }
}

function main_part1() {
  const inputLines: string[][] = [
    ...fs
      .readFileSync("day_10/input.txt")
      .toString()
      .split("\n")
      .map((line) => line.split("")),
  ];
  const scoreMap: { [key: string]: number } = {
    "(": 1,
    "[": 2,
    "{": 3,
    "<": 4,
  };
  const scores: number[] = [];
  for (const line of inputLines) {
    const stack = [];
    let illegal = false;
    for (const char of line) {
      if (["(", "[", "{", "<"].includes(char)) {
        stack.push(char);
      } else {
        const lastOpened = stack.pop() ?? "";
        const expected = getExpected(char);
        if (lastOpened !== expected) {
          illegal = true;
          break;
        }
      }
    }
    if (!illegal && stack.length) {
      let localScore = 0;
      let openedChar = "";
      do {
        openedChar = stack.pop() ?? "";
        localScore = localScore * 5 + scoreMap[openedChar];
      } while (stack.length);
      scores.push(localScore);
    }
  }
  const sortedScores = scores.sort((v1, v2) => v2 - v1);
  console.log(sortedScores);
  console.log(sortedScores[Math.trunc(sortedScores.length / 2)]);
}

main_part1();
