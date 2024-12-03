import * as fs from "fs";
import { exit } from "process";

export const getLines = (path: string) => {
  try {
    const lines = fs.readFileSync(path, "utf8");
    return lines.split("\n");
  } catch {
    console.error(`failed to read input from path ${path}`);
    exit(1);
  }
};
