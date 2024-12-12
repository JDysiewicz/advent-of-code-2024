import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

type Results = {
  [plantType: string]: Plot[];
};

type Plot = {
  coords: Set<string>;
  perimeter: number;
  perimieterCoords: Set<string>;
};

const part1 = () => {
  const lines = getLines("./days/12/input.txt");

  const grid: string[][] = [];

  for (let line of lines) {
    grid.push(line.split(""));
  }

  let results: Results = {};

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      results = checkForPlot(x, y, grid, results);
    }
  }

  let sum = 0;
  for (let [k, v] of Object.entries(results)) {
    for (let plot of v) {
      sum = sum + plot.coords.size * plot.perimeter;
    }
  }

  return sum;
};

const checkForPlot = (
  x: number,
  y: number,
  grid: string[][],
  results: Results
): Results => {
  const plotType = grid[y][x];
  const coords = `${x},${y}`;

  // Already checked this coord
  if (
    !!results[plotType] &&
    results[plotType].some((plot) => plot.coords.has(coords))
  ) {
    return results;
  }

  // This is a new plot
  const plot: Plot = {
    coords: new Set<string>(),
    perimeter: 0,
    perimieterCoords: new Set<string>(),
  };

  let coordsToCheck: string[] = [coords];

  while (coordsToCheck.length > 0) {
    const currCoords = coordsToCheck[0];
    if (plot.coords.has(currCoords)) {
      coordsToCheck.shift();
      continue;
    }

    plot.coords.add(currCoords);
    const [currX, currY] = currCoords.split(",").map((a) => parseInt(a));

    // up
    if (isUpValid(currX, currY, plotType, grid)) {
      const newY = currY - 1;
      const newCoords = `${currX},${newY}`;
      coordsToCheck.push(newCoords);
    } else {
      plot.perimeter += 1;
      plot.perimieterCoords.add(`${currX},${currY - 1}`);
    }
    // right
    if (isRightValid(currX, currY, plotType, grid)) {
      const newX = currX + 1;
      const newCoords = `${newX},${currY}`;
      coordsToCheck.push(newCoords);
    } else {
      plot.perimeter += 1;
      plot.perimieterCoords.add(`${currX + 1},${currY}`);
    }

    // down
    if (isDownValid(currX, currY, plotType, grid)) {
      const newY = currY + 1;
      const newCoords = `${currX},${newY}`;
      coordsToCheck.push(newCoords);
    } else {
      plot.perimeter += 1;
      plot.perimieterCoords.add(`${currX},${currY + 1}`);
    }

    // left
    if (isLeftValid(currX, currY, plotType, grid)) {
      const newX = currX - 1;
      const newCoords = `${newX},${currY}`;
      coordsToCheck.push(newCoords);
    } else {
      plot.perimeter += 1;
      plot.perimieterCoords.add(`${currX - 1},${currY}`);
    }

    coordsToCheck.shift();
  }

  // Add plot to results and return
  if (!!results[plotType]) {
    results[plotType].push(plot);
  } else {
    results[plotType] = [plot];
  }

  return results;
};

const isUpValid = (x: number, y: number, target: string, grid: string[][]) =>
  y - 1 >= 0 && grid[y - 1][x] === target;

const isRightValid = (x: number, y: number, target: string, grid: string[][]) =>
  x + 1 < grid[0].length && grid[y][x + 1] === target;

const isDownValid = (x: number, y: number, target: string, grid: string[][]) =>
  y + 1 < grid.length && grid[y + 1][x] === target;

const isLeftValid = (x: number, y: number, target: string, grid: string[][]) =>
  x - 1 >= 0 && grid[y][x - 1] === target;

const part2 = () => {
  const lines = getLines("./days/12/test-input.txt");

  const grid: string[][] = [];

  for (let line of lines) {
    grid.push(line.split(""));
  }

  let results: Results = {};

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      results = checkForPlot(x, y, grid, results);
    }
  }

  let sum = 0;
  for (let [k, v] of Object.entries(results)) {
    for (let plot of v) {
      const numSides = calculateNumSides(plot.perimieterCoords);

      console.log(`sides for plot ${k} = ${numSides}`);
      sum = sum + numSides * plot.coords.size;
    }
  }

  return sum;
};

const calculateNumSides = (permieterCoords: Set<string>): number => {
  const uniqueY = new Set<string>();
  const uniqueX = new Set<string>();

  for (let coord of permieterCoords.values()) {
    const [x, y] = coord.split(",");
    uniqueY.add(y);
    uniqueX.add(x);
  }
  return uniqueY.size;
};

solutionPrinter(12, 1, part1());
solutionPrinter(12, 2, part2());
