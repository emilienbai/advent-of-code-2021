import * as fs from "fs";

const isLowerCase = (str: string): boolean => str === str.toLowerCase();

class Graph {
  public vertices: { [nodeKey: string]: string[] };

  constructor() {
    this.vertices = {};
  }

  addEdge(vertex1: string, vertex2: string): void {
    if (this.vertices[vertex1]) {
      this.vertices[vertex1].push(vertex2);
    } else {
      this.vertices[vertex1] = [vertex2];
    }

    if (this.vertices[vertex2]) {
      this.vertices[vertex2].push(vertex1);
    } else {
      this.vertices[vertex2] = [vertex1];
    }
  }

  private countPathsEndingBetween(
    start: string,
    end: string,
    alreadyVisitedVertices: Set<string>,
    pathCount: number
  ): number {
    alreadyVisitedVertices.add(start);
    if (start === end) {
      pathCount++;
    } else {
      const relevantAdjacentToExplore = this.vertices[start].filter(
        (vertex) => !isLowerCase(vertex) || !alreadyVisitedVertices.has(vertex)
      );
      for (const adjacent of relevantAdjacentToExplore) {
        pathCount = this.countPathsEndingBetween(
          adjacent,
          end,
          new Set(alreadyVisitedVertices),
          pathCount
        );
      }
    }
    return pathCount;
  }

  public countPaths(start: string, end: string) {
    let pathCount = 0;
    pathCount = this.countPathsEndingBetween(start, end, new Set(),  pathCount);
    return pathCount;
  }
}

function main_part1() {
  const graphLines: string[][] = [
    ...fs
      .readFileSync("day_12/input.txt")
      .toString()
      .split("\n")
      .map((line) => line.split("-")),
  ];

  const graph = new Graph();
  graphLines.forEach((line) => graph.addEdge(line[0], line[1]));
  console.log(graph);
  console.log(graph.countPaths('start', 'end'))
}

main_part1();
