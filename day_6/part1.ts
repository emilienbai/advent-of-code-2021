import * as fs from "fs";

function main_part2() {
  const initialStates = fs
    .readFileSync("day_6/input.txt")
    .toString()
    .split(",")
    .map((value: string) => parseInt(value));

  const dayCount = 256;

  let fishCountPerAge: Map<number, number> = new Map();
  for (const state of initialStates) {
    fishCountPerAge.set(state, (fishCountPerAge.get(state) ?? 0) + 1);
  }
  for (let dayIndex = 0; dayIndex < dayCount; dayIndex++) {
    const newMap = new Map();
    for (let i = 0; i < 9; ++i) {
      if (i === 6) {
        newMap.set(
          i,
          (fishCountPerAge.get(i + 1) ?? 0) + (fishCountPerAge.get(0) ?? 0)
        );
      } else if (i === 8) {
        newMap.set(i, fishCountPerAge.get(0) ?? 0);
      } else {
        newMap.set(i, fishCountPerAge.get(i + 1) ?? 0);
      }
    }
    fishCountPerAge = newMap;
  }
  console.log(
    Array.from(fishCountPerAge.values()).reduce(
      (previous, current) => previous + current,
      0
    )
  );
}

main_part2();
