// const input = "target area: x=138..184, y=-125..-71";
const minX = 138;
const maxX = 184;
const minY = -125;
const maxY = -71;
const minVx = 0;
const maxVx = 185;
const minVy = -130
const maxVy = 200;

function getPosition(
  vx: number,
  vy: number,
  step: number
): { x: number; y: number } {
  const y = vy * step - ((step - 1) * step) / 2;
  const x =
    step <= vx ? step * vx - ((step - 1) * step) / 2 : (vx * (vx + 1)) / 2;
  return { x, y };
}

const isIn = (point: { x: number; y: number }) =>
  point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;

const notMovingOrOutsideX = (currentX: number, vx: number, step: number) =>
  currentX > maxX || step >= vx;

function main() {
  let solutionCount = 0;
  for (let vx = minVx; vx < maxVx; vx++) {
    for (let vy = minVy; vy < maxVy; vy++) {
      let stop = false;
      let found = false;
      let step = 0;
      while (!stop) {
        const point = getPosition(vx, vy, step);
        if (isIn(point)) {
          stop = true;
          found = true;
        }
        if(notMovingOrOutsideX(point.x, vx, step) && point.y < minY) {
            stop = true
        }
        step++
      }
      if (found) {
        solutionCount++;
      }
    }
  }
  console.log(solutionCount)
}

main()
