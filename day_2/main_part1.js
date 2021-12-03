const fs = require("fs");

function main_part1() {
  const commands = fs
    .readFileSync("input.txt")
    .toString()
    .split("\n")
    .map((line) => {
      const splitted = line.split(" ");
      return { type: splitted[0], amount: Number(splitted[1]) };
    });

  let coordinates = { x: 0, y: 0 };
  commands.forEach((command) => {
    switch (command.type) {
      case "forward":
        coordinates.x = coordinates.x + command.amount;
        break;
      case "down":
        coordinates.y = coordinates.y + command.amount;
        break;
      case "up":
        coordinates.y = coordinates.y - command.amount;
        break;
    }
  });

  console.log(coordinates);
  console.log(coordinates.x * coordinates.y);
}

main_part1();
