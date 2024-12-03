import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

// levels are either ALL increasing or ALL decreasing
// adjacent levels differ by 1 - 3
const part1 = () => {
  const lines = getLines("./days/02/input.txt");

  const reports: number[][] = lines.map((line) => {
    const arr = line.split(" ");
    return arr.map((elem) => parseInt(elem));
  });

  const numSafeReports = reports.reduce((acc, curr) => {
    if (isSafe(curr)) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return numSafeReports;
};

const part2 = () => {
  const lines = getLines("./days/02/input.txt");

  const reports: number[][] = lines.map((line) => {
    const arr = line.split(" ");
    return arr.map((elem) => parseInt(elem));
  });

  const numSafeReports = reports.reduce((acc, curr) => {
    if (isSafe(curr) || attemptDampen(curr, isSafe)) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return numSafeReports;
};

const attemptDampen = (
  arr: number[],
  safeFn: (arr: number[]) => boolean
): boolean => {
  // Iterate over each element in the array, remove it, attempt to re-check if it's safe.
  // Brute-forcey, but works :shrug:
  for (let i = 0; i < arr.length; i++) {
    const newArr =
      i == 0 ? arr.slice(1) : arr.slice(0, i).concat(arr.slice(i + 1));

    if (safeFn(newArr)) {
      return true;
    }
  }

  return false;
};

const isSafe = (arr: number[]): boolean => {
  // Less than 2 items means it must be safe by definition
  if (arr.length < 2) {
    return true;
  }

  // If it starts neither increasing nor decreasing, it is unsafe
  if (arr[0] == arr[1]) {
    return false;
  }

  let isIncreasing = arr[1] - arr[0] > 0;

  for (let i = 1; i < arr.length; i++) {
    const delta = arr[i] - arr[i - 1];
    if (!isBelowMaxDelta(delta)) {
      return false;
    }

    if (isIncreasing && delta > 0) {
      continue;
    } else if (!isIncreasing && delta < 0) {
      continue;
    } else {
      return false;
    }
  }

  return true;
};

const isBelowMaxDelta = (delta: number) => {
  const MAX_DELTA = 3;
  return Math.abs(delta) <= MAX_DELTA;
};

solutionPrinter(2, 1, part1());
solutionPrinter(2, 2, part2());
