/*
Donation

Every player receives 10 points. They can now choose to donate
N points to another player.

Scores are given to everyone as (10 - N) + sum(donations)

The player with the lowest donation receives nothing.
*/

import type { Game } from "../game.ts";

export default function donation() {
  const donations: Map<string, { to: string; amount: number }> = new Map();

  return {
    id: "donation",
    title: "Donations",
    description:
      "Each player receives 10 points. Donate as many points as you want to another player. Whoever donates the least points will receive nothing.",
    messageTypes: ["set-donation"],
    onMessage: (
      ctx: Game,
      type: string,
      playerId: string,
      data: any,
    ): null | { scores: Record<string, number>; data: any } => {
      const to = data?.to ?? null;
      const amount = Math.floor(data?.amount ?? 0);
      if (!ctx.players.has(to) || amount < 0 || amount > 10) {
        return null;
      }

      donations.set(playerId, { to, amount });
      ctx.setPlayerDone(playerId);

      if (donations.size === ctx.players.size) {
        // We are done!
        const inOrder = [...donations].map(([from, { to, amount }]) => {
          return { from, to, amount };
        });
        const scores: Record<string, number> = {};
        inOrder.sort((a, b) => b.amount - a.amount);
        for (const { from, to, amount } of inOrder) {
          // only players who are not ranked lowest get something!
          if (inOrder[inOrder.length - 1].from !== from) {
            scores[from] = (scores[from] ?? 0) + 10 - amount;
          }
          if (inOrder[inOrder.length - 1].from !== to) {
            scores[to] = (scores[to] ?? 0) + amount;
          }
        }
        return { scores, data: inOrder };
      } else {
        return null;
      }
    },
    getState: (ctx: Game) => {
      return {
        maxDonation: 10,
      };
    },
  };
}
