import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

const part1 = () => {
  const lines = getLines("./days/03/input.txt");
  const line = lines.join();

  const matches = getMultInstructions(line);

  const sum = matches.reduce((acc, curr) => {
    return acc + execMult(curr);
  }, 0);

  return sum;
};

const part2 = () => {
  const lines = getLines("./days/03/input.txt");
  const line = lines.join();

  const cleanInput = getCleanInputPart2(line);
  const matches = getMultInstructions(cleanInput);

  const sum = matches.reduce((acc, curr) => {
    return acc + execMult(curr);
  }, 0);

  return sum;
};

// Somewhat hacky way to extract all parts of the raw string
// which are between a `do()` and a `don't()`, and throw away any
// parts which are between a `don't()` and `do()`.
const getCleanInputPart2 = (raw: string): string => {
  let cleanInput = "";
  const uncleanDos = raw.split("do()");
  for (let elem of uncleanDos) {
    const clean = elem.split("don't()");
    cleanInput += clean[0];
  }

  return cleanInput;
};

const getMultInstructions = (line: string): string[] => {
  // Extract the string `mul(X,Y)` where X/Y are 1-3 digit numbers
  const extractMulRegex = /mul\(\d{1,3},\d{1,3}\)/g;
  const matchesIterator = line.matchAll(extractMulRegex);

  const matches: string[] = [];
  for (let match of matchesIterator) {
    matches.push(match[0]);
  }

  return matches;
};

const execMult = (s: string): number => {
  // Capture group on the two numbers between ( and ).
  const reg = /\((-?\d+,-?\d+)\)/;

  const [num1, num2] = s.match(reg)[1].split(",");
  return parseInt(num1) * parseInt(num2);
};

solutionPrinter(3, 1, part1());
solutionPrinter(3, 2, part2());
