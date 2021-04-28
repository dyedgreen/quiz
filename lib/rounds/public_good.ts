/*
Public Good

Every player can donate between 0 and 10 points to
a shared pot. The money in the pot is doubled and
given back.

The lowest contributor is excluded.
*/

import type { Game } from "../game.ts";

export default function public_good() {
  const contributions: Map<string, number> = new Map();

  return {
    id: "public_good",
    title: "Public Good",
    description:
      "Each player receives 10 points. Between 0 and 10 points can be put towards a shared pot. The pot is doubled and the points are distributed back evenly to all players, except for the player making the smallest contribution, who receives nothing. Every player keeps the points they don't contribute.",
    messageTypes: ["set-contribution"],
    onMessage: (
      ctx: Game,
      type: string,
      playerId: string,
      data: any,
    ): null | { scores: Record<string, number>; data: any } => {
      const contribution = Math.floor(+data);
      if (contribution < 0 || contribution > 10) {
        console.warn(`[${new Date()}] Invalid contribution of ${contribution}`);
        return null;
      }

      contributions.set(playerId, contribution);
      ctx.setPlayerDone(playerId);

      if (contributions.size === ctx.players.size) {
        let inOrder = [...contributions].map(([playerId, contribution]) => {
          return { playerId, contribution };
        });
        let total = inOrder.reduce(
          (acc, { contribution }) => acc + contribution,
          0,
        );
        inOrder.sort(({ contribution: a }, { contribution: b }) => b - a);

        const scores: Record<string, number> = {};
        for (let i = 0; i < inOrder.length; i++) {
          scores[inOrder[i].playerId] = 10 - inOrder[i].contribution;
          if (i < inOrder.length - 1) {
            // only get from pot if your not the lowest contributor
            scores[inOrder[i].playerId] += Math.floor(
              2 * total / (inOrder.length - 1),
            );
          }
        }

        let data = { contributions: inOrder, total };
        return { scores, data };
      } else {
        return null;
      }
    },
    getState: (ctx: Game) => {
      return {
        totalPoints: 10,
      };
    },
  };
}
