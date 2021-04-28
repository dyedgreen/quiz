/*
Second Most Popular

There are three options. Choose the second most popular one
to win points!
*/

import type { Game } from "../game.ts";

export default function secondMostPopular() {
  const choices: Map<string, number> = new Map();

  return {
    id: "second_most_popular",
    title: "Second Most Popular",
    description:
      "Choose from the options below. Players who select the second most popular choice will receive points according to their choice.",
    messageTypes: ["set-choice"],
    onMessage: (
      ctx: Game,
      type: string,
      playerId: string,
      data: any,
    ): null | { scores: Record<string, number>; data: any } => {
      const choice = parseInt(data);
      if (choice < 0 || choice > 2) {
        console.warn(`[${new Date()}] Invalid choice: ${choice}`);
        return null;
      }

      choices.set(playerId, choice);
      ctx.setPlayerDone(playerId);

      if (choices.size === ctx.players.size) {
        // We are done!
        const inOrder: { points: number; players: string[] }[] = [15, 10, 5]
          .map((points) => {
            return { points, players: [] };
          });
        for (const [player, choice] of choices) {
          inOrder[choice]?.players?.push(player);
        }
        inOrder.sort(({ players: a }, { players: b }) => b.length - a.length); // descending order
        const scores: Record<string, number> = {};
        for (const player of inOrder[1].players) {
          scores[player] = inOrder[1].points;
        }
        return { scores, data: inOrder };
      } else {
        return null;
      }
    },
    getState: (ctx: Game) => {
      return {
        options: [15, 10, 5],
      };
    },
  };
}
