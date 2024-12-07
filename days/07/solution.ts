import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";
import * as permutation from "array-permutation";

// The only valid operators we have
type Operator = "+" | "*" | "||";

// Account for case where duplicate totals occur with separate inputs
interface ResultMap {
  [key: string]: number[][];
}

const part1 = () => {
  const lines = getLines("./days/07/input.txt");

  const resultMap = createResultInputMap(lines);

  let sum = 0;
  for (let [k, v] of Object.entries(resultMap)) {
    const target = parseInt(k);
    for (let input of v) {
      // i=0 is short-circuited, so operator doesn't matter; could be "*" here too
      const isSolveable = checkSolveable(0, "+", 0, input, target, false);
      if (isSolveable) {
        sum += target;
      }
    }
  }

  return sum;
};

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
  const lines = getLines("./days/07/input.txt");

  const resultMap = createResultInputMap(lines);

  let sum = 0;
  for (let [k, v] of Object.entries(resultMap)) {
    const target = parseInt(k);
    for (let input of v) {
      const isSolveable = checkSolveable(0, "+", 0, input, target, true);
      if (isSolveable) {
        sum += target;
      }
    }
  }

  return sum;
};

const checkSolveable = (
  total: number,
  op: Operator,
  i: number,
  sequence: number[],
  target: number,
  isPart2: boolean
): boolean => {
  // Base case: check the total is what we want here to avoid index-out-of-bounds
  if (i >= sequence.length) {
    return total === target;
  }

  const num = sequence[i];

  // i=0 special case as root node; begin fan out here
  if (i === 0) {
    return (
      checkSolveable(num, "+", i + 1, sequence, target, isPart2) ||
      checkSolveable(num, "*", i + 1, sequence, target, isPart2) ||
      (isPart2
        ? checkSolveable(num, "||", i + 1, sequence, target, isPart2)
        : false)
    );
  }

  // Apply operand to num and total, then branch out other + or * paths
  if (op === "+") {
    return (
      checkSolveable(total + num, "+", i + 1, sequence, target, isPart2) ||
      checkSolveable(total + num, "*", i + 1, sequence, target, isPart2) ||
      (isPart2
        ? checkSolveable(total + num, "||", i + 1, sequence, target, isPart2)
        : false)
    );
  } else if (op == "*") {
    return (
      checkSolveable(total * num, "+", i + 1, sequence, target, isPart2) ||
      checkSolveable(total * num, "*", i + 1, sequence, target, isPart2) ||
      (isPart2
        ? checkSolveable(total * num, "||", i + 1, sequence, target, isPart2)
        : false)
    );
  } else {
    // Part2 by definition
    const newTotal = parseInt(total.toString() + num.toString());
    return (
      checkSolveable(newTotal, "+", i + 1, sequence, target, isPart2) ||
      checkSolveable(newTotal, "*", i + 1, sequence, target, isPart2) ||
      checkSolveable(newTotal, "||", i + 1, sequence, target, isPart2)
    );
  }
};

solutionPrinter(7, 1, part1());
solutionPrinter(7, 2, part2());
