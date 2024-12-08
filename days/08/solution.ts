import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

interface AntennaMap {
  [frequency: string]: NodePositions;
}

interface NodePositions {
  nodes: Set<string>;
  antinodes: Set<string>;
}

const part1 = () => {
  const lines = getLines("./days/08/input.txt");

  const grid: string[][] = [];
  for (let line of lines) {
    const row = line.split("");
    grid.push(row);
  }
  const maxY = grid.length - 1;
  const maxX = grid[0].length - 1;

  let map: AntennaMap = {};
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      map = createAntennaMap(x, maxX, y, maxY, map, grid);
    }
  }

  const result: Set<string> = new Set();
  for (let elem of Object.values(map)) {
    for (let x of elem.antinodes.values()) {
      result.add(x);
    }
  }

  return result.size;
};

const createAntennaMap = (
  x: number,
  maxX: number,
  y: number,
  maxY: number,
  currMap: AntennaMap,
  grid: string[][]
): AntennaMap => {
  let newMap = structuredClone(currMap);
  const key = grid[y][x];
  // early exit if not a character
  if (key === ".") {
    return newMap;
  }

  // If first time seeing this key, can't create any antinodes
  // so just mark it as existing and move on
  if (!newMap[key]) {
    const nodeSet = new Set<string>();
    nodeSet.add(`${x},${y}`);
    const antiNodeSet = new Set<string>();
    newMap[key] = {
      nodes: nodeSet,
      antinodes: antiNodeSet,
    };

    return newMap;
  }

  const nodeSet = new Set(newMap[key].nodes);
  const antiNodeSet = new Set(newMap[key].antinodes);

  for (let elem of nodeSet.values()) {
    const [targetX, targetY] = elem.split(",").map((x) => parseInt(x));
    const xDelta = x - targetX;
    const yDelta = y - targetY;

    const newAntinode1X = targetX - xDelta;
    const newAntinode1Y = targetY - yDelta;

    if (
      newAntinode1X <= maxX &&
      newAntinode1X >= 0 &&
      newAntinode1Y <= maxY &&
      newAntinode1Y >= 0
    ) {
      antiNodeSet.add(`${newAntinode1X},${newAntinode1Y}`);
    }

    const newAntinode2X = x + xDelta;
    const newAntinode2Y = y + yDelta;

    if (
      newAntinode2X <= maxX &&
      newAntinode2X >= 0 &&
      newAntinode2Y <= maxY &&
      newAntinode2Y >= 0
    ) {
      antiNodeSet.add(`${newAntinode2X},${newAntinode2Y}`);
    }
  }

  nodeSet.add(`${x},${y}`);

  newMap[key] = {
    nodes: nodeSet,
    antinodes: antiNodeSet,
  };
  return newMap;
};

const part2 = () => {
  const lines = getLines("./days/08/input.txt");

  const grid: string[][] = [];
  for (let line of lines) {
    const row = line.split("");
    grid.push(row);
  }
  const maxY = grid.length - 1;
  const maxX = grid[0].length - 1;

  let map: AntennaMap = {};
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      map = createAntennaMapPart2(x, maxX, y, maxY, map, grid);
    }
  }

  const result: Set<string> = new Set();
  for (let elem of Object.values(map)) {
    for (let x of elem.antinodes.values()) {
      result.add(x);
    }
  }

  return result.size;
};

const createAntennaMapPart2 = (
  x: number,
  maxX: number,
  y: number,
  maxY: number,
  currMap: AntennaMap,
  grid: string[][]
): AntennaMap => {
  let newMap = structuredClone(currMap);
  const key = grid[y][x];
  // early exit if not a character
  if (key === ".") {
    return newMap;
  }

  // If first time seeing this key, can't create any antinodes
  // so just mark it as existing and move on
  if (!newMap[key]) {
    const nodeSet = new Set<string>();
    nodeSet.add(`${x},${y}`);
    const antiNodeSet = new Set<string>();
    newMap[key] = {
      nodes: nodeSet,
      antinodes: antiNodeSet,
    };

    return newMap;
  }

  const nodeSet = new Set(newMap[key].nodes);
  const antiNodeSet = new Set(newMap[key].antinodes);

  for (let elem of nodeSet.values()) {
    const [targetX, targetY] = elem.split(",").map((x) => parseInt(x));
    const xDelta = x - targetX;
    const yDelta = y - targetY;

    let currX = targetX - xDelta;
    let currY = targetY - yDelta;

    while (currX <= maxX && currX >= 0 && currY <= maxY && currY >= 0) {
      antiNodeSet.add(`${currX},${currY}`);
      currX = currX - xDelta;
      currY = currY - yDelta;
    }

    currX = x + xDelta;
    currY = y + yDelta;

    while (currX <= maxX && currX >= 0 && currY <= maxY && currY >= 0) {
      antiNodeSet.add(`${currX},${currY}`);
      currX = currX + xDelta;
      currY = currY + yDelta;
    }
  }

  nodeSet.add(`${x},${y}`);

  // Any node with more than 1 frequency
  // becomes an antinode
  for (let node of nodeSet) {
    antiNodeSet.add(node);
  }

  newMap[key] = {
    nodes: nodeSet,
    antinodes: antiNodeSet,
  };
  return newMap;
};

solutionPrinter(8, 1, part1());
solutionPrinter(8, 2, part2());
