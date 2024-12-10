import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

const part1 = () => {
  const lines = getLines("./days/10/input.txt");
  const grid: number[][] = [];

  for (let line of lines) {
    grid.push(line.split("").map((x) => parseInt(x)));
  }

  let score = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 0) {
        const s = dfs(x, y, 0, grid, new Set<string>());
        score += s.size;
      }
    }
  }

  return score;
};

const dfs = (
  x: number,
  y: number,
  target: number,
  grid: number[][],
  unique9Positions: Set<string>
): Set<string> => {
  const isTarget = grid[y][x] === target;

  if (!isTarget) {
    return unique9Positions;
  }

  if (target === 9 && isTarget) {
    const newSet = new Set(unique9Positions);
    newSet.add(`${x},${y}`);
    return newSet;
  }

  const newTarget = targetMap[target];

  // up
  if (isUpValid(y)) {
    const newY = y - 1;
    unique9Positions = dfs(x, newY, newTarget, grid, unique9Positions);
  }

  // right
  if (isRightValid(x, grid[0].length - 1)) {
    const newX = x + 1;
    unique9Positions = dfs(newX, y, newTarget, grid, unique9Positions);
  }

  // down
  if (isDownValid(y, grid.length - 1)) {
    const newY = y + 1;
    unique9Positions = dfs(x, newY, newTarget, grid, unique9Positions);
  }

  // left
  if (isLeftValid(x)) {
    const newX = x - 1;
    unique9Positions = dfs(newX, y, newTarget, grid, unique9Positions);
  }

  const score = unique9Positions.size;

  return unique9Positions;
};

const isUpValid = (y: number) => y - 1 >= 0;
const isRightValid = (x: number, maxX: number) => x + 1 <= maxX;
const isDownValid = (y: number, maxY: number) => y + 1 <= maxY;
const isLeftValid = (x: number) => x - 1 >= 0;

const targetMap = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 8,
  8: 9,
};

const part2 = () => {};

solutionPrinter(10, 1, part1());
solutionPrinter(10, 2, part2());
