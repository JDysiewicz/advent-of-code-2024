import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";
import * as permutation from "array-permutation";

type Inputs = number[];

interface ResultMap {
  [key: string]: Inputs[];
}

const part1 = () => {
  const lines = getLines("./days/07/input.txt");

  const resultMap = createResultInputMap(lines);

  let sum = 0;
  for (let [k, v] of Object.entries(resultMap)) {
    const target = parseInt(k);
    for (let input of v) {
      const isSolveable = determineIfSolvable(target, input);
      if (isSolveable) {
        sum += target;
      }
    }
  }

  return sum;
};

const determineIfSolvable = (target: number, inputs: Inputs): boolean => {
  // Short circuit
  const sum = inputs.reduce((acc, curr) => acc + curr, 0);
  if (sum > target) {
    return false;
  }
  const product = inputs.reduce((acc, curr) => acc * curr, 1);
  if (product < target) {
    return false;
  }

  // Always -1 as always 1 less operator than number of inputs
  console.log(`CHECKING ${target} ${inputs}`);
  const operatorCombinations = getAllOperatorCombinations(inputs.length - 1);
  let checked = 0;

  for (let i = 0; i < operatorCombinations.length; i++) {
    console.log(`Checked ${checked} of ${operatorCombinations.length}`);
    console.log(target, inputs, operatorCombinations[i]);
    if (target === getResultOfCombination(inputs, operatorCombinations[i])) {
      return true;
    }
    checked++;
  }

  return false;
};

// [1,2,3]
// [+,*]

// i=0; 1, +
// i=1; 2, *
// i=2;3, out of bounds

const getResultOfCombination = (
  inputs: Inputs,
  combination: Operator[]
): number => {
  let res = 0;
  for (let i = 0; i < inputs.length; i++) {
    if (i === 0) {
      res = inputs[0];
    }
    if (combination[i - 1] === "+") {
      res += inputs[i];
    } else if (combination[i - 1] === "*") {
      res *= inputs[i];
    }
  }

  return res;
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

  console.log(baseArrays);

  for (let i = 0; i < baseArrays.length; i++) {
    const perms = combinateWithoutReplacement(baseArrays[i]);
    // const iter = permutation.permutation(baseArrays[i]);
    console.log(perms);
    for (let res of perms) {
      results.push(res);
    }
  }

  // dedupe via string conversion of array
  const dedupe = Array.from(
    new Set(results.map((r) => JSON.stringify(r))),
    (a) => JSON.parse(a)
  );

  return dedupe;
};

type Operator = "+" | "*";

const createResultInputMap = (lines: string[]): ResultMap => {
  const res: ResultMap = {};
  for (let line of lines) {
    if (line.length === 0) {
      continue;
    }
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

export function* combinateWithoutReplacement<T>(candidates: T[]) {
  const indices = candidates.map((_, i) => i);

  yield indices.map((i) => candidates[i]);

  const c = indices.map(() => 0);
  let i = 1;
  while (i < indices.length) {
    if (c[i] < i) {
      if (i % 2 === 0) {
        swap(indices, 0, i);
      } else {
        swap(indices, c[i], i);
      }

      yield indices.map((i) => candidates[i]);

      c[i] += 1;
      i = 1;
    } else {
      c[i] = 0;
      i += 1;
    }
  }
}

function swap<T>(list: T[], a: number, b: number) {
  const t = list[a];
  list[a] = list[b];
  list[b] = t;
}
