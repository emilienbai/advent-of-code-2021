// #############
// #...........#
// ###A#D#C#A###
//   #D#C#B#A#
//   #D#B#A#C#
//   #C#D#B#B#
//   #########

const PriorityQueue = require("js-priority-queue");

type Amphipod = "A" | "B" | "C" | "D" | ".";
const roomIndexesMap = {
  0: 2,
  1: 4,
  2: 6,
  3: 8,
};

const possibleHallWayStayingPositionsIndexes = [0, 1, 3, 5, 7, 9, 10];

class Labyrinth {
  public hallWay: Amphipod[];
  public rooms: Amphipod[][];

  constructor(h: Amphipod[], r: Amphipod[][]) {
    this.hallWay = [...h];
    this.rooms = [...r.map((values) => [...values])];
  }

  get hash(): string {
    return (
      this.hallWay.join("") +
      " " +
      this.rooms.map((room) => room.join("")).join(" ")
    );
  }

  public getNextPossiblePositions() {
    return [
      ...this.getAllPossibilitiesOfLeaving(),
      ...this.getAllPossibilitiesOfOrganizing(),
    ];
  }

  private getAllPossibilitiesOfLeaving(): [number, Labyrinth][] {
    const possibilities: [number, Labyrinth][] = [];
    for (let roomIndex = 0; roomIndex < 4; roomIndex++) {
      const room = this.rooms[roomIndex];
      let topCharIndex = room.length - 1;
      for (topCharIndex; topCharIndex >= 0; --topCharIndex) {
        if (room[topCharIndex] !== ".") {
          break;
        }
      }
      if (topCharIndex === -1) continue;

      const topChar: Amphipod = room[topCharIndex];
      const availableDestinations =
        this.getAvailableHallWayPositionFromRoomIndex(roomIndex);
      const costOfLeavingTheRoom = room.length - topCharIndex;
      const multiplier = Labyrinth.getMultiplierForChar(topChar);
      for (const destination of availableDestinations) {
        const costOfReachingDestination = Math.abs(
          // @ts-ignore
          roomIndexesMap[roomIndex] - destination
        );
        const cost =
          (costOfLeavingTheRoom + costOfReachingDestination) * multiplier;
        const newHallway = [...this.hallWay];
        newHallway[destination] = topChar;
        const newRooms = this.rooms.map((r) => [...r]);
        newRooms[roomIndex][topCharIndex] = ".";
        possibilities.push([cost, new Labyrinth(newHallway, newRooms)]);
      }
    }

    return possibilities;
  }

  private getAllPossibilitiesOfOrganizing(): [number, Labyrinth][] {
    const possibilities: [number, Labyrinth][] = [];
    for (
      let hallWayIndex = 0;
      hallWayIndex < this.hallWay.length;
      hallWayIndex++
    ) {
      const currentChar = this.hallWay[hallWayIndex];
      if (currentChar === ".") continue;

      const destinationRoomIndex = Labyrinth.getDestinationRoomIndex(currentChar);
      // @ts-ignore
      const roomHallwayIndex = roomIndexesMap[destinationRoomIndex];

      if (
        !this.rooms[destinationRoomIndex].every((amph) =>
          [currentChar, "."].includes(amph)
        )
      ) {
        continue;
      }

      const between =
        hallWayIndex > roomHallwayIndex
          ? this.hallWay.slice(roomHallwayIndex, hallWayIndex)
          : this.hallWay.slice(hallWayIndex + 1, roomHallwayIndex);
      const obstacles = between.some((amph) => amph != ".");
      if (obstacles) {
        continue;
      }

      const costOfReachingRoom = Math.abs(hallWayIndex - roomHallwayIndex);
      const costOfEnteringRoom = this.rooms[destinationRoomIndex].filter(
        (amph) => amph === "."
      ).length;
      const multiplier = Labyrinth.getMultiplierForChar(currentChar);
      const totalCost = (costOfReachingRoom + costOfEnteringRoom) * multiplier;
      const newHallWay = [...this.hallWay];
      newHallWay[hallWayIndex] = ".";
      const newRooms = this.rooms.map((r) => [...r]);
      newRooms[destinationRoomIndex][4 - costOfEnteringRoom] = currentChar;
      possibilities.push([totalCost, new Labyrinth(newHallWay, newRooms)]);
    }
    return possibilities;
  }

  private getAvailableHallWayPositionFromRoomIndex(
    roomIndex: number
  ): number[] {
    const possibleHallWayPosition: number[] = [];
    for (const finish of possibleHallWayStayingPositionsIndexes) {
      if (this.hallWay[finish] !== ".") continue;
      // @ts-ignore
        let min = Math.min(roomIndexesMap[roomIndex], finish);
      // @ts-ignore
        const max = Math.max(roomIndexesMap[roomIndex], finish);
      const hallway = this.hallWay.slice(min, max);
      if (hallway.every((v) => v === ".")) {
        possibleHallWayPosition.push(finish);
      }
    }
    return possibleHallWayPosition;
  }

  private static getMultiplierForChar(char: Amphipod): number {
    switch (char) {
      case "A":
        return 1;
      case "B":
        return 10;
      case "C":
        return 100;
      case "D":
        return 1000;
      case ".":
      default:
        throw new Error("wesh !");
    }
  }

  private static getDestinationRoomIndex(char: Amphipod): number {
    switch (char) {
      case "A":
        return 0;
      case "B":
        return 1;
      case "C":
        return 2;
      case "D":
        return 3;
      case ".":
      default:
        throw new Error("wesh !");
    }
  }
}

function main() {
  const lab = new Labyrinth("...........".split("") as Amphipod[], [
    ["C", "D", "D", "A"],
    ["D", "B", "C", "D"],
    ["B", "A", "B", "C"],
    ["B", "C", "A", "A"],
  ]);

  const finalLab = new Labyrinth("...........".split("") as Amphipod[], [
    ["A", "A", "A", "A"],
    ["B", "B", "B", "B"],
    ["C", "C", "C", "C"],
    ["D", "D", "D", "D"],
  ]);

  const priorityQueue = new PriorityQueue({
    comparator: function (a: { cost: number }, b: { cost: number }) {
      return a.cost - b.cost;
    },
  });
  const dijkstraMap: { [hash: string]: number } = { [lab.hash]: 0 };
  priorityQueue.queue({ cost: 0, lab });

  while (priorityQueue.length) {
    const { cost, lab }: { cost: number; lab: Labyrinth } =
      priorityQueue.dequeue();
    const adjacents = lab.getNextPossiblePositions();
    for (const adjacent of adjacents) {
      const newPathCost = cost + adjacent[0];
      const destinationLab = adjacent[1];
      if (
        !dijkstraMap.hasOwnProperty(destinationLab.hash) ||
        dijkstraMap[destinationLab.hash] > newPathCost
      ) {
        dijkstraMap[destinationLab.hash] = newPathCost;
        priorityQueue.queue({ cost: newPathCost, lab: destinationLab });
      }
    }
  }
  console.log(dijkstraMap[finalLab.hash]);
}

main();
