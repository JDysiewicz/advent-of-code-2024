import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
const part1 = () => {
  const lines = getLines("./days/05/input.txt");
  const instructions = lines.filter((line: string) => line.includes("|"));
  const updates = lines.filter((line: string) => line.includes(","));

  // key = the target number, value = arr of all
  // numbers which must come before the target in a sequence
  const instructionMap = instructions.reduce<Record<string, number[]>>(
    (acc, curr) => {
      const [beforeStr, after] = curr.split("|");
      const before = parseInt(beforeStr);
      if (!!acc[after] && !acc[after].includes(before)) {
        acc[after] = [before, ...acc[after]];
      } else {
        acc[after] = [before];
      }
      return acc;
    },
    {} as Record<string, number[]>
  );

  const correctUpdates = updates.reduce<number[][]>((acc, curr) => {
    const arr = curr.split(",").map((x) => parseInt(x));
    const isCorrect = isCorrectUpdate(arr, instructionMap);
    if (isCorrect) {
      return [...acc, arr];
    }
    return acc;
  }, [] as number[][]);

  const sumOfMiddleValues = correctUpdates.reduce((acc, curr) => {
    const len = curr.length;
    const middleIdx = (len - 1) / 2;
    return acc + curr[middleIdx];
  }, 0);
  return sumOfMiddleValues;
};

const isCorrectUpdate = (
  update: number[],
  instructionMap: Record<string, number[]>
): boolean => {
  for (let i = 0; i < update.length; i++) {
    const target = update[i];

    // if not in instruction map, there are no rules about it
    // so ignore it.
    if (!instructionMap[target.toString()]) {
      continue;
    }

    const beforeArr = instructionMap[target.toString()];

    for (let j = 0; j < beforeArr.length; j++) {
      // for each number which must be before target

      const checkNumber = beforeArr[j];

      // if number is not in update, it's rules don't matter
      if (!update.includes(checkNumber)) {
        continue;
      }

      const indexOfEveryOcc = getIndexOfEveryOccurence(update, checkNumber);
      const isEveryOccObeyRules = indexOfEveryOcc.every((idx) => idx < i);

      if (!isEveryOccObeyRules) {
        return false;
      }
    }
  }

  return true;
};

const getIndexOfEveryOccurence = (arr: number[], target: number): number[] => {
  return arr.reduce<number[]>((acc, curr, i) => {
    if (curr != target) {
      return acc;
    }
    return [...acc, i];
  }, [] as number[]);
};

const part2 = () => {
  const lines = getLines("./days/05/input.txt");
  const instructions = lines.filter((line: string) => line.includes("|"));
  const updates = lines.filter((line: string) => line.includes(","));

  // key = the target number, value = arr of all
  // numbers which must come before the target in a sequence
  const instructionMap = instructions.reduce<Record<string, number[]>>(
    (acc, curr) => {
      const [beforeStr, after] = curr.split("|");
      const before = parseInt(beforeStr);
      if (!!acc[after] && !acc[after].includes(before)) {
        acc[after] = [before, ...acc[after]];
      } else {
        acc[after] = [before];
      }
      return acc;
    },
    {} as Record<string, number[]>
  );

  const incorrectUpdates = updates.reduce<number[][]>((acc, curr) => {
    const arr = curr.split(",").map((x) => parseInt(x));
    const isCorrect = isCorrectUpdate(arr, instructionMap);
    if (!isCorrect) {
      return [...acc, arr];
    }
    return acc;
  }, [] as number[][]);

  const correctedUpdates = incorrectUpdates.map((curr) =>
    sortUpdate(curr, instructionMap)
  );

  const sumOfMiddleValues = correctedUpdates.reduce((acc, curr) => {
    const len = curr.length;
    const middleIdx = (len - 1) / 2;
    return acc + curr[middleIdx];
  }, 0);
  return sumOfMiddleValues;
};

const sortUpdate = (
  arr: number[],
  instructionMap: Record<string, number[]>
): number[] => {
  const sortedArr = arr.sort((a, b) => {
    if (
      !!instructionMap[a.toString()] &&
      instructionMap[a.toString()].includes(b)
    ) {
      return -1;
    }
    if (
      !!instructionMap[b.toString()] &&
      instructionMap[b.toString()].includes(a)
    ) {
      return 1;
    }

    return 0;
  });

  return sortedArr;
};

solutionPrinter(5, 1, part1());
solutionPrinter(5, 2, part2());
