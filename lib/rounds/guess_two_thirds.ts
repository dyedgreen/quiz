/*
Guess 2/3 of the Average

Every player can make a guess between 1 and 20. Whoever
guesses closest to the average guess will receive their
guess in points.
*/

import type { Game } from "../game.ts";

export default function guess_two_thirds() {
  const guesses: Map<string, number> = new Map();

  return {
    id: "guess_two_thirds",
    title: "Guess ²/₃ of the Average",
    description:
      "Each player can make a guess between 1 and 20. Whoever guesses closest to the average guess will receive their guess as points.",
    messageTypes: ["set-guess"],
    onMessage: (
      ctx: Game,
      type: string,
      playerId: string,
      data: any,
    ): null | { scores: Record<string, number>; data: any } => {
      const guess = Math.floor(+data);
      if (guess < 1 || guess > 20) {
        console.warn(`[${new Date()}] Invalid guess of ${guess}`);
        return null;
      }

      guesses.set(playerId, guess);
      ctx.setPlayerDone(playerId);

      if (guesses.size === ctx.players.size) {
        // closest guess will win!
        let inOrder = [...guesses].map(([playerId, guess]) => {
          return { playerId, guess };
        });
        let average = inOrder.reduce((acc, { guess }) => acc + guess, 0) /
          inOrder.length;
        inOrder.sort(({ guess: a }, { guess: b }) =>
          Math.abs(a - average) - Math.abs(b - average)
        );

        let scores = { [inOrder[0].playerId]: inOrder[0].guess };
        let data = { guesses: inOrder, average };
        return { scores, data };
      } else {
        return null;
      }
    },
    getState: (ctx: Game) => {
      return {
        minGuess: 1,
        maxGuess: 20,
      };
    },
  };
}
