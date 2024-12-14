import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

const part1 = () => {
  const lines = getLines("./days/14/input.txt");

  const NUM_ITERATIONS = 100;
  const X_WIDTH = 101;
  const Y_LENGTH = 103;

  let q1Count = 0;
  let q2Count = 0;
  let q3Count = 0;
  let q4Count = 0;

  // Can calculate each robot's position independantly of each other
  for (let robot of lines) {
    const [startX, startY] = getStartingCoords(robot);
    const [velX, velY] = getVelcoity(robot);

    const xPos = determineLocationAfterNIterations(
      startX,
      velX,
      NUM_ITERATIONS,
      X_WIDTH
    );
    const yPos = determineLocationAfterNIterations(
      startY,
      velY,
      NUM_ITERATIONS,
      Y_LENGTH
    );

    const quadrant = determineQuadrant(xPos, yPos, X_WIDTH, Y_LENGTH);

    switch (quadrant) {
      case 0:
        continue;
      case 1:
        q1Count++;
        continue;
      case 2:
        q2Count++;
        continue;
      case 3:
        q3Count++;
        continue;
      case 4:
        q4Count++;
        continue;
    }
  }

  return q1Count * q2Count * q3Count * q4Count;
};
const part2 = () => {};

// Get the position after N iterations, then
// normalise it back to in-bounds so can modulo to get
// position on grid
const determineLocationAfterNIterations = (
  n: number,
  velocity: number,
  iterations: number,
  size: number
) => {
  let total = n + velocity * iterations;
  while (total < 0) {
    total += size;
  }

  const position = total % size;
  return position;
};

// return [x,y]
const getStartingCoords = (robot: string): [number, number] => {
  const match = robot.match(/p=.*,.* /);
  const split = match[0].trim().split(",");

  return [parseInt(split[0].split("=")[1]), parseInt(split[1])];
};

// return velocity as [Vx,Vy]
const getVelcoity = (robot: string): [number, number] => {
  const match = robot.match(/v=.*,.*$/);
  const split = match[0].trim().split(",");

  return [parseInt(split[0].split("=")[1]), parseInt(split[1])];
};

// 0 = on the midline
const determineQuadrant = (
  x: number,
  y: number,
  xWith: number,
  yLength: number
): 0 | 1 | 2 | 3 | 4 => {
  const midX = (xWith - 1) / 2;
  const midY = (yLength - 1) / 2;

  // q1 or q3
  if (x < midX) {
    if (y < midY) {
      return 1;
    }
    if (y > midY) {
      return 3;
    }
  }

  if (x > midX) {
    if (y < midY) {
      return 2;
    }
    if (y > midY) {
      return 4;
    }
  }

  return 0;
};

solutionPrinter(14, 1, part1());
solutionPrinter(14, 2, part2());
