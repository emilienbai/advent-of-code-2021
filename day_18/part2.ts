import * as fs from "fs";

const reverseString = (str: string): string => str.split("").reverse().join("");
const isNumber = (str: string): boolean => /\d/.test(str);

function findPrevNum(
  line: string
): { prevValue: number; prevIndex: number; prevLength: number } | undefined {
  let match = reverseString(line).match(/\d+/);

  if (!match) {
    return {
      prevValue: undefined,
      prevIndex: undefined,
      prevLength: undefined,
    };
  }

  return {
    prevValue: Number(reverseString(match[0])),
    prevIndex: line.length - (match.index ?? -1) - match[0].length,
    prevLength: match[0].length,
  };
}

function findNextNum(line: string): {
  nextValue: number;
  nextIndex: number;
  nextLength: number;
} {
  let match = line.match(/\d+/);

  if (!match) {
    return {
      nextValue: undefined,
      nextIndex: undefined,
      nextLength: undefined,
    };
  }

  return {
    nextValue: Number(match[0]),
    nextIndex: match.index ?? -1,
    nextLength: match[0].length,
  };
}

function findFirstPair(remainingLine: string): {
  left: number;
  right: number;
  index: number;
  pairLength: number;
} {
  let match = remainingLine.match(/\[(\d+),(\d+)\]/);

  if (!match) {
    return {
      left: undefined,
      right: undefined,
      index: undefined,
      pairLength: undefined,
    };
  }

  return {
    left: Number(match[1]),
    right: Number(match[2]),
    index: match.index ?? -1,
    pairLength: match[0].length,
  };
}

function explode(line: string): string {
  let depth = 0;

  for (let i = 0; i < line.length; i += 1) {
    let currentChar = line[i];

    if (currentChar === "[" && depth >= 4) {
      // @ts-ignore
      let { left, right, index, pairLength } = findFirstPair(line.slice(i));

      if (pairLength && index === 0) {
        // @ts-ignore
        let { prevValue, prevIndex, prevLength } = findPrevNum(
          line.slice(0, i)
        );
        // @ts-ignore
        let { nextValue, nextIndex, nextLength } = findNextNum(
          line.slice(i + pairLength)
        );
        nextIndex += i + pairLength;

        if (!prevLength) {
          return [
            line.slice(0, i),
            0,
            line.slice(i + pairLength, nextIndex),
            right + nextValue,
            line.slice(nextIndex + nextLength),
          ].join("");
        }

        if (!nextLength) {
          return [
            line.slice(0, prevIndex),
            left + prevValue,
            line.slice(prevIndex + prevLength, i),
            0,
            line.slice(i + pairLength),
          ].join("");
        }

        return [
          line.slice(0, prevIndex),
          left + prevValue,
          line.slice(prevIndex + prevLength, i),
          0,
          line.slice(i + pairLength, nextIndex),
          right + nextValue,
          line.slice(nextIndex + nextLength),
        ].join("");
      }
    }

    if (currentChar === "[") {
      depth += 1;
    }
    if (currentChar === "]") {
      depth -= 1;
    }
  }

  return line;
}

function snailSplit(line: string): string {
  for (let i = 0; i < line.length; i += 1) {
    let snailChar = line[i];
    let nextChar = line[i + 1];

    if (isNumber(snailChar) && isNumber(nextChar)) {
      let num = Number(snailChar + nextChar);

      return [
        line.slice(0, i),
        "[",
        Math.floor(num / 2),
        ",",
        Math.ceil(num / 2),
        "]",
        line.slice(i + 2),
      ].join("");
    }
  }

  return line;
}

function reduce(line: string): string {
  let exploded = explode(line);
  if (exploded !== line) {
    return reduce(exploded);
  }

  let splitted = snailSplit(exploded);
  if (splitted !== exploded) {
    return reduce(splitted);
  }

  return line;
}

function sum(left: string, right: string): string {
  return reduce(`[${left},${right}]`);
}

function magnitude(line: string): number {
    const snailVals = JSON.parse(line);

    if (!Array.isArray(snailVals)) {
        return snailVals;
    }

    let x = JSON.stringify(snailVals[0]);
    let y = JSON.stringify(snailVals[1]);

    return 3 * magnitude(x) + 2 * magnitude(y);
};

function main_part1() {
  const lines: string[] = fs
    .readFileSync("day_18/input.txt")
    .toString()
    .split("\n");

  let max = -Infinity;
  for(const lineA of lines) {
    for (const lineB of lines) {
      if(lineA !== lineB) {
        const result = sum(lineA, lineB)
        const mag = magnitude(result);
        if(mag > max) {
          max = mag;
        }
      }
    }
  }
  console.log(max);
}

main_part1();
