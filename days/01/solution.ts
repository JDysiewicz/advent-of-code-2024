import { getLines } from "../../utils/getLines";

const sortAsc = (arr: number[]) => arr.sort((a, b) => a - b);

const part1 = () => {
  const lines = getLines("./days/01/input.txt");

  const first: number[] = [];
  const second: number[] = [];

  for (const line of lines) {
    const split = line.split(" ");

    const firstNum = parseInt(split[0]);
    const secondNum = parseInt(split[split.length - 1]);

    first.push(firstNum);
    second.push(secondNum);
  }

  const sortedFirstCol = sortAsc(first);
  const sortedSecondCol = sortAsc(second);

  const total = sortedFirstCol.reduce<number>((acc, _, i) => {
    return (acc += Math.abs(sortedFirstCol[i] - sortedSecondCol[i]));
  }, 0);

  return total;
};

const part2 = () => {
  const lines = getLines("./days/01/input.txt");

  const first: number[] = [];
  const second: number[] = [];

  for (const line of lines) {
    const split = line.split(" ");

    const firstNum = parseInt(split[0]);
    const secondNum = parseInt(split[split.length - 1]);

    first.push(firstNum);
    second.push(secondNum);
  }

  const numFreqRightMap = first.reduce<Record<string, number>>((acc, curr) => {
    if (!(curr.toString() in acc)) {
      let freq = 0;
      for (let i = 0; i < second.length; i++) {
        if (second[i] == curr) {
          freq += 1;
        }
      }

      acc[curr.toString()] = freq;
    }
    return acc;
  }, {} as Record<string, number>);

  const numFreqLeftMap = first.reduce<Record<string, number>>((acc, curr) => {
    if (!(curr.toString() in acc)) {
      acc[curr.toString()] = 1;
    } else {
      acc[curr.toString()] = acc[curr.toString()] + 1;
    }

    return acc;
  }, {} as Record<string, number>);

  const score = Object.entries(numFreqRightMap).reduce((acc, [k, v]) => {
    return (acc += parseInt(k) * v * numFreqLeftMap[k]);
  }, 0);

  return score;
};

console.log(part1());
console.log(part2());
