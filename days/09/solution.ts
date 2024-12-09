import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

const part1 = () => {
  const lines = getLines("./days/09/test-input.txt");
  const input = lines[0].split("");

  const diskFormat = createSparseFormat(input);

  for (let i = 0; i < diskFormat.length; i++) {
    if (diskFormat[i] != ".") {
      continue;
    }

    // if not, iterate from back of array towards begining
    for (let j = diskFormat.length - 1; j >= i; j--) {
      if (diskFormat[j] === ".") {
        continue;
      } else {
        const n = diskFormat[j];
        diskFormat[j] = ".";
        diskFormat[i] = n;
        break;
      }
    }
  }

  const checkSum = diskFormat.reduce((acc, curr, i) => {
    if (curr === ".") {
      return acc;
    }
    const n = parseInt(curr);
    const product = n * i;
    return acc + product;
  }, 0);

  return checkSum;
};

const createSparseFormat = (input: string[]): string[] => {
  const result: string[] = input.reduce<string[]>((acc, curr, i) => {
    const num = parseInt(curr);
    // is odd therefore is empty space
    if (i % 2 != 0) {
      for (let i = 0; i < num; i++) {
        acc = [...acc, "."];
      }

      return acc;
    }

    // is even
    const id = (i / 2).toString();
    for (let i = 0; i < num; i++) {
      acc = [...acc, id];
    }

    return acc;
  }, [] as string[]);

  return result;
};

const part2 = () => {
  const lines = getLines("./days/09/input.txt");
  const input = lines[0].split("");

  const diskFormat = createSparseFormat(input);

  for (let j = diskFormat.length - 1; j >= 0; j--) {
    if (diskFormat[j] === ".") {
      continue;
    }

    const n = diskFormat[j];
    const blockSize = calculateBlockSize(
      n,
      diskFormat.slice(j - 10 > 0 ? j - 10 : 0, j + 1),
      "dec"
    );

    for (let i = 0; i < j; i++) {
      if (diskFormat[i] != ".") {
        continue;
      }

      const emptySize = calculateBlockSize(
        ".",
        diskFormat.slice(i, i + 10),
        "inc"
      );

      if (emptySize >= blockSize) {
        for (let k = j; k > j - blockSize; k--) {
          diskFormat[k] = ".";
        }
        for (let k = i; k < i + blockSize; k++) {
          diskFormat[k] = n;
        }
        break;
      }

      // -1 as inc by +1 each iteration
      i = i + emptySize - 1;
    }

    // +1 as dec by 1 each loop iteration
    j = j - blockSize + 1;
  }

  //   for (let i = 0; i < diskFormat.length; i++) {
  //     if (diskFormat[i] != ".") {
  //       continue;
  //     }

  //     // if not, iterate from back of array towards begining
  //     for (let j = diskFormat.length - 1; j >= i; j--) {
  //       if (diskFormat[j] === ".") {
  //         continue;
  //       } else {
  //         const n = diskFormat[j];
  //         diskFormat[j] = ".";
  //         diskFormat[i] = n;
  //         break;
  //       }
  //     }
  //   }

  const checkSum = diskFormat.reduce((acc, curr, i) => {
    if (curr === ".") {
      return acc;
    }
    const n = parseInt(curr);
    const product = n * i;
    return acc + product;
  }, 0);

  return checkSum;
};

const calculateBlockSize = (
  target: string,
  arrSlice: string[],
  dir: "inc" | "dec"
) => {
  let count = 0;
  let started = false;
  if (dir === "inc") {
    for (let i = 0; i < arrSlice.length; i++) {
      if (arrSlice[i] === target) {
        count++;
        started = true;
      } else if (started) {
        break;
      }
    }
  } else {
    for (let i = arrSlice.length - 1; i >= 0; i--) {
      if (arrSlice[i] === target) {
        count++;
        started = true;
      } else if (started) {
        break;
      }
    }
  }

  return count;
};

solutionPrinter(9, 1, part1());
solutionPrinter(9, 2, part2());
