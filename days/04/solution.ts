import { Dir } from "fs";
import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

enum Direction {
  NONE,
  TOP,
  TOP_RIGHT,
  RIGHT,
  BOTTOM_RIGHT,
  BOTTOM,
  BOTTOM_LEFT,
  LEFT,
  TOP_LEFT,
}

const topValid = (vertCoord: number) => vertCoord - 1 >= 0;
const rightValid = (horCoord: number, maxHorCoord: number) =>
  horCoord + 1 <= maxHorCoord;
const bottomValid = (vertCoord: number, maxVertCoord: number) =>
  vertCoord + 1 <= maxVertCoord;
const leftValid = (horCoord: number) => horCoord - 1 >= 0;

const topLeftValid = (vertCoord: number, horCoord: number) =>
  topValid(vertCoord) && leftValid(horCoord);
const topRightValid = (
  vertCoord: number,
  horCoord: number,
  maxHorCoord: number
) => topValid(vertCoord) && rightValid(horCoord, maxHorCoord);
const bottomRightValid = (
  vertCoord: number,
  horCoord: number,
  maxHorCoord: number,
  maxVertCoord: number
) => bottomValid(vertCoord, maxVertCoord) && rightValid(horCoord, maxHorCoord);
const bottomLeftValid = (
  vertCoord: number,
  horCoord: number,
  maxHorCoord: number,
  maxVertCoord: number
) => bottomValid(vertCoord, maxVertCoord) && leftValid(horCoord);

const getNewTarget = (curr: string) => {
  const map = {
    X: "M",
    M: "A",
    A: "S",
  };

  return map[curr];
};

const getNewTargetPart2 = (curr: string, dir: Direction) => {
  if (
    curr == "A" &&
    (dir === Direction.TOP_LEFT || dir === Direction.BOTTOM_LEFT)
  ) {
    return "M";
  }
  return "S";
};

/*
Find all instances of the word XMAS.
This word search allows words to be
    horizontal,
    vertical,
    diagonal,
    written backwards,
    overlapping other words
*/
const part1 = () => {
  const lines = getLines("./days/04/input.txt");
  const grid: string[][] = [];

  for (let line of lines) {
    const arr = line.split("");
    grid.push(arr);
  }

  let count = 0;

  for (let vertCoord = 0; vertCoord < grid.length; vertCoord++) {
    for (let horCoord = 0; horCoord < grid[0].length; horCoord++) {
      count += dfs(grid, vertCoord, horCoord, "X", Direction.NONE);
    }
  }

  return count;
};

// Returns the number of XMAS that can be made starting from coords
const dfs = (
  grid: string[][],
  vertCoord: number,
  horCoord: number,
  target: string,
  dir: Direction
): number => {
  const isTarget = grid[vertCoord][horCoord] == target;
  if (!isTarget) {
    return 0;
  }

  if (target == "S" && isTarget) {
    return 1;
  }

  const newTarget = getNewTarget(target);
  const VERT_MAX_COORD = grid.length - 1;
  const HOR_MAX_COORD = grid[0].length - 1;
  let thisCoordCount = 0;

  if (
    topValid(vertCoord) &&
    (dir === Direction.NONE || dir === Direction.TOP)
  ) {
    thisCoordCount += dfs(
      grid,
      vertCoord - 1,
      horCoord,
      newTarget,
      Direction.TOP
    );
  }
  if (
    topRightValid(vertCoord, horCoord, HOR_MAX_COORD) &&
    (dir === Direction.NONE || dir === Direction.TOP_RIGHT)
  ) {
    thisCoordCount += dfs(
      grid,
      vertCoord - 1,
      horCoord + 1,
      newTarget,
      Direction.TOP_RIGHT
    );
  }
  if (
    rightValid(horCoord, VERT_MAX_COORD) &&
    (dir === Direction.NONE || dir === Direction.RIGHT)
  ) {
    thisCoordCount += dfs(
      grid,
      vertCoord,
      horCoord + 1,
      newTarget,
      Direction.RIGHT
    );
  }
  if (
    bottomRightValid(vertCoord, horCoord, HOR_MAX_COORD, VERT_MAX_COORD) &&
    (dir === Direction.NONE || dir === Direction.BOTTOM_RIGHT)
  ) {
    thisCoordCount += dfs(
      grid,
      vertCoord + 1,
      horCoord + 1,
      newTarget,
      Direction.BOTTOM_RIGHT
    );
  }
  if (
    bottomValid(vertCoord, VERT_MAX_COORD) &&
    (dir === Direction.NONE || dir === Direction.BOTTOM)
  ) {
    thisCoordCount += dfs(
      grid,
      vertCoord + 1,
      horCoord,
      newTarget,
      Direction.BOTTOM
    );
  }
  if (
    bottomLeftValid(vertCoord, horCoord, HOR_MAX_COORD, VERT_MAX_COORD) &&
    (dir === Direction.NONE || dir === Direction.BOTTOM_LEFT)
  ) {
    thisCoordCount += dfs(
      grid,
      vertCoord + 1,
      horCoord - 1,
      newTarget,
      Direction.BOTTOM_LEFT
    );
  }
  if (
    leftValid(horCoord) &&
    (dir === Direction.NONE || dir === Direction.LEFT)
  ) {
    thisCoordCount += dfs(
      grid,
      vertCoord,
      horCoord - 1,
      newTarget,
      Direction.LEFT
    );
  }
  if (
    topLeftValid(vertCoord, horCoord) &&
    (dir === Direction.NONE || dir === Direction.TOP_LEFT)
  ) {
    thisCoordCount += dfs(
      grid,
      vertCoord - 1,
      horCoord - 1,
      newTarget,
      Direction.TOP_LEFT
    );
  }

  return thisCoordCount;
};

const part2 = () => {
  const lines = getLines("./days/04/input.txt");
  const grid: string[][] = [];

  for (let line of lines) {
    const arr = line.split("");
    grid.push(arr);
  }

  let count = 0;

  for (let vertCoord = 0; vertCoord < grid.length; vertCoord++) {
    for (let horCoord = 0; horCoord < grid[0].length; horCoord++) {
      if (isValidXMas(grid, vertCoord, horCoord)) {
        count += 1;
      }
    }
  }

  return count;
};

const isValidXMas = (grid: string[][], y: number, x: number): boolean => {
  if (grid[y][x] != "A") {
    return false;
  }
  try {
    if (
      (grid[y - 1][x - 1] === "M" && grid[y + 1][x + 1] === "S") ||
      (grid[y - 1][x - 1] === "S" && grid[y + 1][x + 1] === "M")
    ) {
      if (
        (grid[y + 1][x - 1] === "M" && grid[y - 1][x + 1] === "S") ||
        (grid[y + 1][x - 1] === "S" && grid[y - 1][x + 1] === "M")
      ) {
        return true;
      }
    }
  } catch (err) {
    if (err instanceof TypeError) {
      return false;
    }
    throw err;
  }

  return false;
};

solutionPrinter(4, 1, part1());
solutionPrinter(4, 2, part2());
