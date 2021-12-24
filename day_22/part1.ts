import * as fs from "fs";

class Cuboid {
  private readonly effectiveMinX: number;
  private readonly effectiveMaxX: number;
  private readonly effectiveMinY: number;
  private readonly effectiveMaxY: number;
  private readonly effectiveMinZ: number;
  private readonly effectiveMaxZ: number;

  constructor(
    public minX: number,
    public maxX: number,
    public minY: number,
    public maxY: number,
    public minZ: number,
    public maxZ: number
  ) {
    this.effectiveMinX = Math.max(this.minX, -50);
    this.effectiveMinY = Math.max(this.minY, -50);
    this.effectiveMinZ = Math.max(this.minZ, -50);
    this.effectiveMaxX = Math.min(this.maxX, 50);
    this.effectiveMaxY = Math.min(this.maxY, 50);
    this.effectiveMaxZ = Math.min(this.maxZ, 50);
  }

  toCubeHashArray(): string[] {
    const hashes = [];
    for (let x = this.effectiveMinX; x <= this.effectiveMaxX; ++x) {
      for (let y = this.effectiveMinY; y <= this.effectiveMaxY; ++y) {
        for (let z = this.effectiveMinZ; z <= this.effectiveMaxZ; ++z) {
          hashes.push(`x${x}y${y}z${z}`);
        }
      }
    }
    return hashes;
  }
}

class CuboidCollection {
  private litCubes: Set<string>;

  constructor() {
    this.litCubes = new Set();
  }

  add(cuboid: Cuboid): void {
    cuboid.toCubeHashArray().forEach((hash) => {
      this.litCubes.add(hash);
    });
  }

  remove(cuboid: Cuboid): void {
    cuboid.toCubeHashArray().forEach((hash) => {
      this.litCubes.delete(hash);
    });
  }

  get litTotal() {
    return this.litCubes.size;
  }
}

function main() {
  const steps: string[] = fs
    .readFileSync("day_22/input.txt")
    .toString()
    .split("\n");

  const inputRegexp = new RegExp(
    /^(on|off) x=(-{0,1}\d*)..(-{0,1}\d*),y=(-{0,1}\d*)..(-{0,1}\d*),z=(-{0,1}\d*)..(-{0,1}\d*)$/
  );

  let collection = new CuboidCollection();
  steps.forEach((step) => {
    // @ts-ignore
    const [, action, minX, maxX, minY, maxY, minZ, maxZ] =
      step.match(inputRegexp);
    const cuboid = new Cuboid(
      parseInt(minX),
      parseInt(maxX),
      parseInt(minY),
      parseInt(maxY),
      parseInt(minZ),
      parseInt(maxZ)
    );
    if (action === "on") {
      collection.add(cuboid);
    } else {
      collection.remove(cuboid);
    }
  });
  console.log(collection.litTotal);
}

main();
