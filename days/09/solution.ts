import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

const part1 = () => {
  const lines = getLines("./days/09/test-input.txt");
  const input = lines[0].split("");

  const disk = createSparseFormat(input);

  for (let i = 0; i < disk.length; i++) {
    // ignore anything which is not empty space
    if (disk[i] != ".") {
      continue;
    }

    // if empty space, move blocks from end to fill it
    for (let j = disk.length - 1; j >= i; j--) {
      if (disk[j] === ".") {
        continue;
      } else {
        const n = disk[j];
        disk[j] = ".";
        disk[i] = n;
        break;
      }
    }
  }

  const checkSum = disk.reduce((acc, curr, i) => {
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
  const lines = getLines("./days/09/test-input.txt");
  const input = lines[0].split("");

  const disk = createSparseFormat(input);

  // Iterate back to front, moving blocks as they are possible
  // (attempt to move each block only once)
  for (let j = disk.length - 1; j >= 0; j--) {
    // Ignore empty spaces
    if (disk[j] === ".") {
      continue;
    }

    const n = disk[j];
    const blockSize = calculateBlockSize(
      n,
      disk.slice(j - 10 > 0 ? j - 10 : 0, j + 1), // safeguard against index out of bound
      "dec"
    );

    // Check for any empty space before this point in the array
    // which could fit this block
    for (let i = 0; i < j; i++) {
      // ignore anything which isn't empty space
      if (disk[i] != ".") {
        continue;
      }

      const emptySize = calculateBlockSize(".", disk.slice(i, i + 10), "inc");

      // If empty space big enough, iteratively move the block into it
      // then break as this block has been moved
      if (emptySize >= blockSize) {
        for (let k = j; k > j - blockSize; k--) {
          disk[k] = ".";
        }
        for (let k = i; k < i + blockSize; k++) {
          disk[k] = n;
        }
        break;
      }

      // -1 as inc by +1 each iteration and emptySize always > 0
      i = i + emptySize - 1;
    }

    // +1 as dec by 1 each iteration and blockSize always > 0
    j = j - blockSize + 1;
  }

  const checkSum = disk.reduce((acc, curr, i) => {
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
  arr: string[],
  dir: "inc" | "dec"
) => {
  let count = 0;

  // only count contiguous blocks; break once block ends
  let started = false;
  if (dir === "inc") {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === target) {
        count++;
        started = true;
      } else if (started) {
        break;
      }
    }
  } else {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === target) {
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
