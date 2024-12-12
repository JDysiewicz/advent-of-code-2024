import { link } from "fs";
import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

type Node = {
  value: number;
  next?: Node;
};

const part1 = () => {
  const lines = getLines("./days/11/input.txt");
  const input: number[] = lines[0].split(" ").map((x) => parseInt(x));

  let linkedList = createInitialLinkedList(input);

  const NUM_BLINKS = 25;
  for (let i = 0; i < NUM_BLINKS; i++) {
    performOperations(linkedList);
  }

  let count = 0;
  let next = linkedList;
  while (!!next) {
    count++;
    next = next.next;
  }

  return count;
};

const performOperations = (linkedList: Node) => {
  let next = linkedList;

  while (!!next) {
    if (isZero(next.value)) {
      next.value = 1;
      next = next.next;
    } else if (isEvenDigits(next.value)) {
      const str = next.value.toString();
      const lenHalf = str.length / 2;
      const num1 = parseInt(str.slice(0, lenHalf));
      const num2 = parseInt(str.slice(lenHalf));
      next.value = num1;

      const tmp = next.next;
      next.next = {
        value: num2,
        next: tmp,
      };

      // Don't operate on the newly added node as it's already been handled;
      // skip over it
      next = next.next.next;
    } else {
      next.value = next.value * 2024;
      next = next.next;
    }
  }
  return linkedList;
};

const isZero = (n: number) => n === 0;
const isEvenDigits = (n: number) => {
  const str = n.toString();
  return str.length % 2 === 0;
};

const createInitialLinkedList = (arr: number[]): Node => {
  const root: Node = {
    value: arr[0],
  };
  let next = root;
  for (let i = 0; i < arr.length; i++) {
    next.value = arr[i];
    if (i + 1 < arr.length) {
      next.next = {
        value: 0,
      };
      next = next.next;
    } else {
      next.next = null;
    }
  }

  return root;
};

const part2 = () => {
  const NUM_BLINKS = 25;
  const lines = getLines("./days/11/input.txt");
  const input: number[] = lines[0].split(" ").map((x) => parseInt(x));
  const cache: { [key: number]: number[] } = {};

  for (let elem of input) {
    cache[elem] = operate(elem);
  }

  let count = 0;
  for (let elem of input) {
    for (let i = 0; i < NUM_BLINKS; i++) {
      count += operate(elem).length;
    }
  }

  return count;
};

const operate = (n: number): number[] => {
  console.log(`Operating on ${n}`);
  if (isZero(n)) {
    return [1];
  } else if (isEvenDigits(n)) {
    const str = n.toString();
    const lenHalf = str.length / 2;
    const num1 = parseInt(str.slice(0, lenHalf));
    const num2 = parseInt(str.slice(lenHalf));

    return [num1, num2];
  } else {
    return [n * 2024];
  }
};

solutionPrinter(11, 1, part1());
solutionPrinter(11, 2, part2());
