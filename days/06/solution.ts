import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

const part1 = () => {
  const lines = getLines("./days/06/input.txt");
  const grid: string[][] = [];

  for (let line of lines) {
    const arr = line.split("");
    grid.push(arr);
  }

  const MAX_Y_COORD = grid.length - 1;
  const MAX_X_COORD = grid[0].length - 1;
  const objects = getObjectSet(grid);

  const [x, y, direction] = getStartingParams(grid);

  const uniquePositions = getUniquePositions(
    x,
    y,
    direction,
    objects,
    MAX_X_COORD,
    MAX_Y_COORD
  );

  return uniquePositions.size;
};

const getUniquePositions = (
  startingX: number,
  startingY: number,
  startingDirection: Direction,
  objects: Set<string>,
  maxX: number,
  maxY: number
): Set<string> => {
  let x = startingX;
  let y = startingY;
  let direction = startingDirection;
  const positionsHit = new Set<string>();
  while (!hasLeftArea(x, maxX, y, maxY)) {
    positionsHit.add(`${x},${y}`);
    const isAboutToHit = isInFrontOfObject(x, y, direction, objects);
    if (isAboutToHit) {
      direction = changeDirection(direction);
      continue;
    } else {
      [x, y] = moveInDirection(x, y, direction);
    }
  }

  return positionsHit;
};

const getStartingParams = (grid: string[][]): [number, number, Direction] => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      switch (grid[y][x]) {
        case "^":
          return [x, y, Direction.UP];
        case ">":
          return [x, y, Direction.RIGHT];
        case "v":
          return [x, y, Direction.DOWN];
        case "<":
          return [x, y, Direction.LEFT];
      }
    }
  }
};

const changeDirection = (direction: Direction) => {
  switch (direction) {
    case Direction.UP:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.LEFT;
    case Direction.LEFT:
      return Direction.UP;
  }
};

const moveInDirection = (
  x: number,
  y: number,
  direction: Direction
): [number, number] => {
  switch (direction) {
    case Direction.UP:
      return [x, y - 1];
    case Direction.RIGHT:
      return [x + 1, y];
    case Direction.DOWN:
      return [x, y + 1];
    case Direction.LEFT:
      return [x - 1, y];
  }
};

const hasLeftArea = (x: number, maxX: number, y: number, maxY: number) => {
  return x > maxX || y > maxY || x < 0 || y < 0;
};

const isInFrontOfObject = (
  x: number,
  y: number,
  direction: Direction,
  objectsSet: Set<string>
): boolean => {
  let newX = x;
  let newY = y;

  if (direction === Direction.UP) {
    newX = x;
    newY = y - 1;
  } else if (direction === Direction.RIGHT) {
    newX = x + 1;
    newY = y;
  } else if (direction === Direction.DOWN) {
    newX = x;
    newY = y + 1;
  } else if (direction === Direction.LEFT) {
    newX = x - 1;
    newY = y;
  } else {
    throw new Error(`wee woo direction was ${direction}`);
  }

  const newCoord = `${newX},${newY}`;

  if (objectsSet.has(newCoord)) {
    return true;
  }

  return false;
};

const getObjectSet = (grid: string[][]): Set<string> => {
  const objects = new Set<string>();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "#") {
        objects.add(`${x},${y}`);
      }
    }
  }

  return objects;
};

const part2 = () => {
  const lines = getLines("./days/06/input.txt");
  const grid: string[][] = [];

  for (let line of lines) {
    const arr = line.split("");
    grid.push(arr);
  }

  const MAX_Y_COORD = grid.length - 1;
  const MAX_X_COORD = grid[0].length - 1;
  const objects = getObjectSet(grid);

  const [x, y, direction] = getStartingParams(grid);

  const uniquePositions = getUniquePositions(
    x,
    y,
    direction,
    objects,
    MAX_X_COORD,
    MAX_Y_COORD
  );

  let count = 0;
  let checkedCount = 0;
  for (let pos of uniquePositions.values()) {
    // add this position to a list of objects
    objects.add(pos);

    if (
      checkForInfiniteLoop(x, MAX_X_COORD, y, MAX_Y_COORD, objects, direction)
    ) {
      count += 1;
    }

    // delete pos to get back to original `objects` so okay for next iteration
    objects.delete(pos);
    checkedCount += 1;
  }

  return count;
};

const checkForInfiniteLoop = (
  startingX: number,
  maxX: number,
  startingY: number,
  maxY: number,
  objects: Set<string>,
  startingDirection: Direction
): boolean => {
  let x = startingX;
  let y = startingY;
  let direction = startingDirection;
  const positionsHit: Set<string> = new Set();

  while (!hasLeftArea(x, maxX, y, maxY)) {
    // If we've been on this coord going the same direction
    // then we must be in a loop.
    const k = `${x},${y},${direction}`;
    if (positionsHit.has(k)) {
      return true;
    } else {
      positionsHit.add(k);
    }

    const isAboutToHit = isInFrontOfObject(x, y, direction, objects);
    if (isAboutToHit) {
      direction = changeDirection(direction);
      continue;
    } else {
      [x, y] = moveInDirection(x, y, direction);
    }
  }

  return false;
};

solutionPrinter(6, 1, part1());
solutionPrinter(6, 2, part2());
