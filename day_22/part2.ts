import * as fs from "fs";

class Cuboid {
  constructor(
    public minX: number,
    public maxX: number,
    public minY: number,
    public maxY: number,
    public minZ: number,
    public maxZ: number
  ) {}

  get volume(): number {
    return (
      (this.maxX - this.minX + 1) *
      (this.maxY - this.minY + 1) *
      (this.maxZ - this.minZ + 1)
    );
  }

  public doesNotTouch(otherCube: Cuboid): boolean {
    return (
      Math.max(this.minX, otherCube.minX) >
        Math.min(this.maxX, otherCube.maxX) ||
      Math.max(this.minY, otherCube.minY) >
        Math.min(this.maxY, otherCube.maxY) ||
      Math.max(this.minZ, otherCube.minZ) > Math.min(this.maxZ, otherCube.maxZ)
    );
  }
}

class CuboidCollection {
  private litCubes: Cuboid[];

  constructor() {
    this.litCubes = [];
  }

  get totalLit(): number {
    return this.litCubes.reduce(
      (acc: number, curr: Cuboid) => acc + curr.volume,
      0
    );
  }

  add(cuboid: Cuboid): void {
    this.action(cuboid, true);
  }

  remove(cuboid: Cuboid): void {
    this.action(cuboid, false);
  }

  private action(cuboid: Cuboid, additive: boolean): void {
    const cubesToKeep: Cuboid[] = [];
    if (additive) {
      cubesToKeep.push(cuboid);
    }
    this.litCubes.forEach((existingCuboids) => {
      if (existingCuboids.doesNotTouch(cuboid)) {
        cubesToKeep.push(existingCuboids);
      } else {
        // cut left of existing cuboid
        if (existingCuboids.minX < cuboid.minX) {
          cubesToKeep.push(
            new Cuboid(
              existingCuboids.minX,
              cuboid.minX - 1,
              existingCuboids.minY,
              existingCuboids.maxY,
              existingCuboids.minZ,
              existingCuboids.maxZ
            )
          );
          existingCuboids.minX = cuboid.minX;
        }
        //right
        if (existingCuboids.maxX > cuboid.maxX) {
          cubesToKeep.push(
            new Cuboid(
              cuboid.maxX + 1,
              existingCuboids.maxX,
              existingCuboids.minY,
              existingCuboids.maxY,
              existingCuboids.minZ,
              existingCuboids.maxZ
            )
          );
          existingCuboids.maxX = cuboid.maxX;
        }
        //cut top
        if (existingCuboids.minY < cuboid.minY) {
          cubesToKeep.push(
            new Cuboid(
              existingCuboids.minX,
              existingCuboids.maxX,
              existingCuboids.minY,
              cuboid.minY - 1,
              existingCuboids.minZ,
              existingCuboids.maxZ
            )
          );
          existingCuboids.minY = cuboid.minY;
        }
        //cut bottom
        if (existingCuboids.maxY > cuboid.maxY) {
          cubesToKeep.push(
            new Cuboid(
              existingCuboids.minX,
              existingCuboids.maxX,
              cuboid.maxY + 1,
              existingCuboids.maxY,
              existingCuboids.minZ,
              existingCuboids.maxZ
            )
          );
          existingCuboids.maxY = cuboid.maxY;
        }
        // cut front
        if (existingCuboids.minZ < cuboid.minZ) {
          cubesToKeep.push(
            new Cuboid(
              existingCuboids.minX,
              existingCuboids.maxX,
              existingCuboids.minY,
              existingCuboids.maxY,
              existingCuboids.minZ,
              cuboid.minZ - 1
            )
          );
          existingCuboids.minZ = cuboid.minZ;
        }
        // cut back
        if (existingCuboids.maxZ > cuboid.maxZ) {
          cubesToKeep.push(
            new Cuboid(
              existingCuboids.minX,
              existingCuboids.maxX,
              existingCuboids.minY,
              existingCuboids.maxY,
              cuboid.maxZ + 1,
              existingCuboids.maxZ
            )
          );
          existingCuboids.maxZ = cuboid.maxZ;
        }
      }
    });
    this.litCubes = [...cubesToKeep];
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
  console.log(collection.totalLit);
}

main();
