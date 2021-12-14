import * as fs from "fs";

type CountByString = { [pair: string]: number };
type Rules = { [match: string]: string };

function handleRules(rules: Rules, pairs: CountByString): CountByString {
  const newPairs: CountByString = {};
  for (const key in pairs) {
    const value = pairs[key];
    if (rules[key]) {
      const keyA = `${key[0]}${rules[key]}`;
      const keyB = `${rules[key]}${key[1]}`;

      if (!newPairs.hasOwnProperty(keyA)) {
        newPairs[keyA] = 0;
      }
      if (!newPairs.hasOwnProperty(keyB)) {
        newPairs[keyB] = 0;
      }
      newPairs[keyA] = newPairs[keyA] + value;
      newPairs[keyB] = newPairs[keyB] + value;
    }
  }
  return newPairs;
}

function countLetters(pairs: CountByString): CountByString {
  const count: CountByString = {};
  for (const key in pairs) {
    const [letterA, letterB] = key.split("");
    if (!count.hasOwnProperty(letterA)) {
      count[letterA] = 0;
    }
    if (!count.hasOwnProperty(letterB)) {
      count[letterB] = 0;
    }
    count[letterA] = count[letterA] + pairs[key];
    count[letterB] = count[letterB] + pairs[key];
  }
  return count;
}

function main_part1() {
  const [startSentence, rawRules] = [
    ...fs
      .readFileSync("day_14/input.txt")
      .toString()
      .split("\n\n")
      .map((lines) => lines.split("\n")),
  ];
  let pairCount: { [pair: string]: number } = {};
  startSentence[0].split("").forEach((char, index) => {
    if (index !== 0) {
      const pair = startSentence[0][index - 1] + startSentence[0][index];
      if (!pairCount[pair]) {
        pairCount[pair] = 0;
      }
      pairCount[pair] = pairCount[pair] + 1;
    }
  });
  const rules: Rules = {};
  rawRules.forEach((rule) => {
    const [matchString, insertChar] = rule.split(" -> ");
    rules[matchString] = insertChar;
  });

  for (let i = 0; i < 40; i++) {
    pairCount = handleRules(rules, pairCount);
  }
  console.log(pairCount);
  const countByLetter = countLetters(pairCount);
  console.log(countByLetter);
  const max = Object.entries(countByLetter).reduce(
    (prev, current) => {
      if (prev[1] > current[1]) {
        return prev;
      }
      return current;
    },
    ["X", 0]
  );

  const min = Object.entries(countByLetter).reduce(
    (prev, current) => {
      if (prev[1] < current[1]) {
        return prev;
      }
      return current;
    },
    ["X", +Infinity]
  );

  console.log(Math.ceil(max[1] / 2) - Math.ceil(min[1] / 2));
}

main_part1();
