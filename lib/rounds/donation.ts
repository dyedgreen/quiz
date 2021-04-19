/*
Donation

Every player receives 10 points. They can now choose to donate
N points to another player.

Scores are given to everyone as (10 - N) + sum(donations)

The player with the lowest donation receives nothing.
*/

export default function donation() {
  const donations: Map<string, number> = new Map();

  return {
    id: "donation",
    title: "Donations",
    description: "Each player receives 10 points. Donate as many points as you want to another player. Whoever donates the least points will receive nothing.",
    onMessage: (ctx: Game, type: string, payload: any): null | Record<string, number> => {
      switch ()
    },
  };
}
