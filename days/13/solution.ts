import { getLines } from "../../utils/getLines";
import { solutionPrinter } from "../../utils/solutionPrinter";

const A_TOKEN_COST = 3;
const B_TOKEN_COST = 1;

type Coordinate = {
  x: number;
  y: number;
};

type Game = {
  A: Coordinate;
  B: Coordinate;
  prize: Coordinate;
};

type FnExecute = {
  currX: number;
  currY: number;
  currTokens: number;
  game: Game;
  opt: "A" | "B";
};

const part1 = () => {
  const lines = getLines("./days/13/test-input.txt");

  const games = buildGamesList(lines);

  let tokens = 0;
  for (let game of games) {
    let lowestCompletion: number | null = null;

    let fns: FnExecute[] = [
      { currX: 0, currY: 0, currTokens: 0, game: game, opt: "A" },
      { currX: 0, currY: 0, currTokens: 0, game: game, opt: "B" },
    ];

    while (fns.length > 0) {
      const fn = fns.shift();
      console.log(fns.length);
      let x: number;
      let y: number;
      let toks: number;

      if (fn.opt === "A") {
        x = fn.currX + game.A.x;
        y = fn.currY + game.A.y;
        toks = fn.currTokens + A_TOKEN_COST;
      } else {
        x = fn.currX + game.B.x;
        y = fn.currY + game.B.y;
        toks = fn.currTokens + B_TOKEN_COST;
      }

      // Reached the target; overwrite lowest if lower token count
      if (x === fn.game.prize.x && y === fn.game.prize.y) {
        if (lowestCompletion === null || toks < lowestCompletion) {
          lowestCompletion = toks;
        }
        continue;
      }

      // Gone over; remove from list and go to next iteration
      if (x > fn.game.prize.x || y > fn.game.prize.y) {
        continue;
      }

      // Push 2 new fns; one for going to A branch and one for B branch
      fns.push({
        currTokens: toks,
        currX: x,
        currY: y,
        game: game,
        opt: "A",
      });
      fns.push({
        currTokens: toks,
        currX: x,
        currY: y,
        game: game,
        opt: "B",
      });
    }

    tokens += lowestCompletion;
  }

  return tokens;
};

const buildGamesList = (lines: string[]): Game[] => {
  const games: Game[] = [];

  let currGame: Game = {
    A: { x: 0, y: 0 },
    B: { x: 0, y: 0 },
    prize: { x: 0, y: 0 },
  };
  for (let line of lines) {
    if (line.includes("A:")) {
      const reg = /X\+\d*, Y\+\d*/;
      const m = line.match(reg);
      const split = m[0].split(", ");
      for (let i = 0; i < 2; i++) {
        const v = split[i].split("+");
        if (v[0] === "X") {
          currGame.A.x = parseInt(v[1]);
        } else {
          currGame.A.y = parseInt(v[1]);
        }
      }
    } else if (line.includes("B:")) {
      const reg = /X\+\d*, Y\+\d*/;
      const m = line.match(reg);
      const split = m[0].split(", ");
      for (let i = 0; i < 2; i++) {
        const v = split[i].split("+");
        if (v[0] === "X") {
          currGame.B.x = parseInt(v[1]);
        } else {
          currGame.B.y = parseInt(v[1]);
        }
      }
    } else if (line.includes("Prize:")) {
      const reg = /X=\d*, Y=\d*/;
      const m = line.match(reg);
      const split = m[0].split(", ");
      for (let i = 0; i < 2; i++) {
        const v = split[i].split("=");
        if (v[0] === "X") {
          currGame.prize.x = parseInt(v[1]);
        } else {
          currGame.prize.y = parseInt(v[1]);
        }
      }
    } else {
      games.push(currGame);
      currGame = structuredClone(currGame);
    }
  }

  return games;
};

const part2 = () => {};

solutionPrinter(13, 1, part1());
solutionPrinter(13, 2, part2());
