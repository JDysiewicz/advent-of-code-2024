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

// Part 2 uses different approach as LinkedList is not scalable.
// This uses just a simple map of keys to their counts, as the order doesn't
// actually matter for this problem.
const part2 = () => {
  const NUM_BLINKS = 75;
  const lines = getLines("./days/11/input.txt");
  const input: number[] = lines[0].split(" ").map((x) => parseInt(x));

  // Initial population of cache containing keys (numbers in list)
  // and their counts + result of operating on the key (for optimisation purposes)
  let cache: { [num: string]: { count: number; opRes?: number[] } } = {};
  for (let elem of input) {
    cache[elem] = {
      count: 1,
      opRes: operate(elem),
    };
  }

  for (let i = 0; i < NUM_BLINKS; i++) {
    // Operate on copy so we only deal with each node in the
    // iteration exactly once.
    let cacheCopy = structuredClone(cache);
    for (const k in cache) {
      // If we already have the results of operation cached, use it else calculate it
      // and add operation results to cache
      let res = cacheCopy[k].opRes;
      if (!!res) {
        res = operate(parseInt(k));
        cacheCopy[k].opRes = res;
      }

      // We know operating on k gives [a, Maybe<b>], so can
      // just add cache[k] number of a (and b, if exists)
      for (let elem of res) {
        if (elem in cacheCopy) {
          cacheCopy[elem].count += cache[k].count;
        } else {
          cacheCopy[elem] = {
            count: cache[k].count,
            opRes: operate(res[0]),
          };
        }
      }

      // We will have operated on k cache[k] number of times so subtract this
      // Don't use cacheCopy[k] count as otherwise we prematurely delete keys which were
      // created from operating on a different number
      cacheCopy[k].count -= cache[k].count;
      if (cacheCopy[k].count <= 0) {
        delete cacheCopy[k];
      }
    }

    cache = cacheCopy;
  }

  // Calculate sum of all keys
  let count = 0;
  for (let k of Object.keys(cache)) {
    count += cache[k].count;
  }

  return count;
};

const operate = (n: number): number[] => {
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
