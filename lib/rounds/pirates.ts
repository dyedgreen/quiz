/*
Pirates

A captain is chosen at random. The captain then distributes the pot of 5*N to
all players. Players can vote if they like the split. If more than half
of people agree, the split is executed. Otherwise, the captain is thrown
over board and a new captain is chosen at random.
*/

import type { Game } from "../game.ts";

interface ClientState {
  captain: string;
  playersAlive: Array<string>;
  split: Record<string, number> | null;
  lastVotes: Record<string, boolean> | null;
  totalPoints: number;
};

export default function pirates(ctx: Game) {
  const playersAlive = new Set(ctx.players.keys());

  const totalPoints = playersAlive.size * 5;

  const chooseCaptain = (): string => {
    const playerIds = [...playersAlive];
    playerIds.sort(() => 0.5 - Math.random());
    return playerIds[0];
  };
  let captain: string = chooseCaptain()!;
  let split: Record<string, number> | null = null;

  let votes: Map<string, boolean> = new Map();
  let lastVotes: Record<string, boolean> | null = null;

  return {
    id: "pirates",
    title: "Pirates",
    description: `A captain is chosen at random. The captain then distributes the pot of ${totalPoints} points
                  to all players. Players can vote if they like the split. If half or more
                  agree, the split is executed. Otherwise, the captain is thrown
                  over board and a new captain is chosen at random.`,
    messageTypes: ["submit-split", "vote-on-split"],
    onMessage: (ctx: Game, type: string, playerId: string, data: any): null | { scores: Record<string, number>; data: any } => {
      if (split == null && type === "submit-split" && playerId === captain) {
        // update the split proposal
        let newSplit: Record<string, number> = {};
        for (const id of playersAlive) {
          newSplit[id] = (data ?? {})[id] ?? 0;
        }
        split = newSplit;
        // mark captain as done
        ctx.setPlayerDone(playerId);
      } else if (split != null && type === "vote-on-split" && playerId !== captain && playersAlive.has(playerId)) {
        // add a vote
        votes.set(playerId, !!data);

        // if everybody voted; tally the results
        if (votes.size === playersAlive.size - 1) {
          let totalAccept = 0;
          lastVotes = {};
          for (const [id, vote] of votes) {
            lastVotes[id] = vote;
            if (vote)
              totalAccept ++;
          }

          if (totalAccept >= (playersAlive.size - 1) / 2) {
            // majority accepts
            const scores: Record<string, number> = {};
            for (const id of playersAlive) {
              scores[id] = split[id] ?? 0;
            }
            const data = { totalAccept };
            return { scores, data };
          } else {
            // majority rejects
            playersAlive.delete(captain);

            if (playersAlive.size === 1) {
              const [lastPlayer] = [...playersAlive];
              captain = lastPlayer;
              split = { [lastPlayer]: totalPoints };
              return { scores: { [lastPlayer]: totalPoints }, data: { totalAccept: 1 } };
            } else {
              captain = chooseCaptain();
              votes = new Map();
              split = null;
              ctx.clearPlayersReady();
            }
          }
       } else {
          // otherwise mark player as ready
          ctx.setPlayerDone(playerId);
       }
      } else {
        console.warn(`[${new Date()}] Invalid pirate message.`);
      }
      return null;
    },
    getState: (ctx: Game): ClientState => {
      return {
        captain,
        split,
        playersAlive: [...playersAlive],
        lastVotes,
        totalPoints,
      };
    },
  };
}
