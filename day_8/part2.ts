import * as fs from "fs";

function getIntersectionLength<T>(a: T[], setB: Set<T>): number {
  let intersect = new Set([...a].filter((element) => setB.has(element)));
  return intersect.size;
}

function extractFromInputLengthAndIntersection(
  inputs: string[],
  inputLength: number,
  referenceSet?: Set<string>,
  intersectionLength?: number
): Set<string> {
  const lengthMatches: string[][] = inputs
    .filter((i) => i.length === inputLength)
    .map((str) => str.split(""));
  if (!referenceSet || !intersectionLength) {
    return new Set<string>(lengthMatches[0]);
  }
  return new Set<string>(
    lengthMatches.find(
      (inputMatchingLenght) =>
        getIntersectionLength(inputMatchingLenght, referenceSet) ===
        intersectionLength
    )
  );
}

function extractValues(inputs: string[]) {
  const one = extractFromInputLengthAndIntersection(inputs, 2);
  const four = extractFromInputLengthAndIntersection(inputs, 4);
  const seven = extractFromInputLengthAndIntersection(inputs, 3);
  const eight = extractFromInputLengthAndIntersection(inputs, 7);
  const nine = extractFromInputLengthAndIntersection(inputs, 6, four, 4);
  const three = extractFromInputLengthAndIntersection(inputs, 5, one, 2);
  const six = extractFromInputLengthAndIntersection(inputs, 6, one, 1);
  const five = extractFromInputLengthAndIntersection(inputs, 5, six, 5);
  const two = extractFromInputLengthAndIntersection(inputs, 5, five, 3);
  const zero = extractFromInputLengthAndIntersection(inputs, 6, five, 4);
  return {
    0: zero,
    1: one,
    2: two,
    3: three,
    4: four,
    5: five,
    6: six,
    7: seven,
    8: eight,
    9: nine,
  };
}

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
    let localTotal: string = "";
    const valuesForSignal = extractValues(signal.inputs);
    for (const output of signal.outputs) {
      const [value] = Object.entries(valuesForSignal).find(
        ([, s]) =>
          s.size === output.length &&
          getIntersectionLength(output.split(""), s) === s.size
      ) as [string, Set<string>];
      localTotal += value.toString();
    }
    total += parseInt(localTotal);
  }
  console.log(total);
}

main_part1();
