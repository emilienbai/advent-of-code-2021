import * as fs from "fs";

const PriorityQueue = require('js-priority-queue')

type Point = { x: number; y: number; value: number; shortest: number };
let minValue!: number;

function findAdjacents(
    start: Point,
    matrix: Point[][],
): Point[] {
    const adjacents = [];
    if (start.y > 0) {
        const top = matrix[start.y - 1][start.x];
        adjacents.push(top);

    }
    if (start.x > 0) {
        const left = matrix[start.y][start.x - 1];
        adjacents.push(left);

    }
    if (start.y < matrix.length - 1) {
        const bottom = matrix[start.y + 1][start.x];
        adjacents.push(bottom);

    }
    if (start.x < matrix[start.y].length - 1) {
        const right = matrix[start.y][start.x + 1];
        adjacents.push(right);
    }
    return adjacents;
}

function main_part1() {
    const matrix: Point[][] = [
        ...fs
            .readFileSync("day_15/input.txt")
            .toString()
            .split("\n")
            .map((lines, y) =>
                lines.split("").map((v, x) => ({
                    x,
                    y,
                    value: parseInt(v),
                    shortest: +Infinity,
                }))
            ),
    ];
    /* determine an arbitrary min value following borders */

    console.log(minValue);
    const priorityQueue = new PriorityQueue({
        comparator: function (p1: Point, p2: Point) {
            return matrix[p1.y][p1.x].shortest - matrix[p2.y][p2.x].shortest
        },
    });
    const length = matrix[0].length;
    const depth = matrix.length;
    matrix[0][0].shortest = 0;
    priorityQueue.queue({ x: 0, y: 0 })
    while (priorityQueue.length) {
        const currentPos = priorityQueue.dequeue()
        const pathCost = matrix[currentPos.y][currentPos.x].shortest;
        const adjacents = findAdjacents(currentPos, matrix);
        for (const adjacent of adjacents) {
            const newPathCost = pathCost + adjacent.value;
            if (matrix[adjacent.y][adjacent.x].shortest > newPathCost) {
                matrix[adjacent.y][adjacent.x].shortest = newPathCost;
                priorityQueue.queue({x: adjacent.x, y: adjacent.y})
            }
        }
    }
    console.log(matrix[depth-1][length-1].shortest)
}

main_part1();
