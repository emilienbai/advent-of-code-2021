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
  const illegalFound = { ")": 0, "]": 0, "}": 0, ">": 0 };
  for (const line of inputLines) {
    const stack = [];
    for (const char of line) {
      if (["(", "[", "{", "<"].includes(char)) {
        stack.push(char);
      } else {
        const lastOpened = stack.pop() ?? "";
        const expected = getExpected(char);
        if (lastOpened !== expected) {
          // @ts-ignore
          illegalFound[char] = illegalFound[char] + 1;
          break;
        }
      }
    }
  }
  console.log(illegalFound);
  console.log(
    3 * illegalFound[")"] +
      57 * illegalFound["]"] +
      1197 * illegalFound["}"] +
      25137 * illegalFound[">"]
  );
}

main_part1();
