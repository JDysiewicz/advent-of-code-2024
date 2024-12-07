import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";
type Inputs = number[];

interface ResultMap {
  [key: string]: Inputs[];
}

const part1 = () => {
  const lines = getLines("./days/07/test-input.txt");

  const solvableResults: number[] = [];
  const resultMap = createResultInputMap(lines);

  for (let [k, v] of Object.entries(resultMap)) {
    const target = parseInt(k);
    for (let input of v) {
      const isSolveable = determineIfSolvable(target, input);
      if (isSolveable) {
        solvableResults.push(target);
      }
    }
  }

  const sum = solvableResults.reduce((acc, curr) => acc + curr, 0);

  return sum;
};

const determineIfSolvable = (target: number, inputs: Inputs): boolean => {
  // Always -1 as always 1 less operator than number of inputs
  const operatorCombinations = getAllOperatorCombinations(inputs.length - 1);

  // Try each combinatino of operators on the inputs left-to-right evaluation
  // if any match then return true
  return false;
};

const getAllOperatorCombinations = (size: number): Operator[][] => {
  const results: Operator[][] = [];

  // Get arrays with the correct number of + and *,
  // so can then get all permutations of these and add these to the results
  const baseArrays: Operator[][] = [new Array(size).fill("+")];
  for (let i = 0; i < size; i++) {
    let arr: Operator[] = new Array(size).fill("+");
    for (let j = 0; j <= i; j++) {
      arr[j] = "*";
    }
    baseArrays.push(arr);
  }

  // Get all permuations of the base arrays
  // then push each unique permutation to the results

  return results;
};

type Operator = "+" | "*";

const createResultInputMap = (lines: string[]): ResultMap => {
  const res: ResultMap = {};
  for (let line of lines) {
    const splt = line.split(":");
    const result = splt[0];
    const inputs = splt[1]
      .trim()
      .split(" ")
      .map((s) => parseInt(s));

    if (!!res[result]) {
      res[result] = [...res[result], inputs];
    } else {
      res[result] = [inputs];
    }
  }
  return res;
};

const part2 = () => {
  const lines = getLines("./days/07/test-input.txt");
};

solutionPrinter(7, 1, part1());
solutionPrinter(7, 2, part2());
