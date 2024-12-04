import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

/*
Find all instances of the word XMAS.
This word search allows words to be
    horizontal,
    vertical,
    diagonal,
    written backwards,
    overlapping other words
*/
const part1 = () => {
  const lines = getLines("./days/04/test-input.txt");
  return lines;
};

const part2 = () => {
  const lines = getLines("./days/04/test-input.txt");
  return 0;
};

solutionPrinter(4, 1, part1());
solutionPrinter(4, 2, part2());
