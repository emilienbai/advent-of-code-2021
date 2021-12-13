import * as fs from "fs";

type Point = { x: number; y: number };

function uniqWith<T>(arr: T[], fn: (element: T, index: T) => boolean): T[] {
  return arr.filter(
    (element, index) => arr.findIndex((step) => fn(element, step)) === index
  );
}

function executeCommand(command: string, points: Point[]): Point[] {
  const [direction, index] = command.substr(11).split("=");
  const foldAt = parseInt(index);
  const newPoints: Point[] = [];
  for (const currentPoint of points) {
    if (direction === "x") {
      const newX =
        currentPoint.x < foldAt ? currentPoint.x : 2 * foldAt - currentPoint.x;
      newPoints.push({ x: newX, y: currentPoint.y });
    } else {
      const newY =
        currentPoint.y < foldAt ? currentPoint.y : 2 * foldAt - currentPoint.y;
      newPoints.push({ x: currentPoint.x, y: newY });
    }
  }
  return uniqWith(newPoints, (p1, p2) => p1.x === p2.x && p1.y === p2.y);
}

function main_part1() {
  const [points, commands] = [
    ...fs
      .readFileSync("day_13/input.txt")
      .toString()
      .split("\n\n")
      .map((lines) => lines.split("\n")),
  ];

  const parsedPoints: Point[] = points.map((point) => {
    const split = point.split(",");
    return { x: parseInt(split[0]), y: parseInt(split[1]) };
  });
  const pointsAfterOnCommand = executeCommand(commands[0], parsedPoints);
  console.log(pointsAfterOnCommand.length);
}

main_part1();
