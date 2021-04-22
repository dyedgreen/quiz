import type { WebSocket } from "https://deno.land/std@0.93.0/ws/mod.ts";
import { v4 } from "https://deno.land/std@0.93.0/uuid/mod.ts";

import roundDonation from "./rounds/donation.ts";
import roundTwoThirds from "./rounds/guess_two_thirds.ts";
import roundPublicGood from "./rounds/public_good.ts";
import roundPirates from "./rounds/pirates.ts";

type Color = "6D28D9" | "DB2777" | "059669" | "F59E0B" | "DC2626";
const colors: Array<Color> = ["6D28D9", "DB2777", "059669", "F59E0B", "DC2626"];

interface Player {
  id: string;
  name: string;
  score: number;
  color: Color;
  ready: boolean;
}

export interface Round {
  id: string;
  title: string;
  description: string;
  messageTypes: Array<string>,
  onMessage: (ctx: Game, type: string, playerId: string, data: any) => null | { scores: Record<string, number>; data: any; };
  getState: (ctx: Game) => any;
}

const games: Map<string, Game> = new Map();

function genId(): string {
  let id;
  do {
    id = v4.generate().split("-")[1];
  } while (games.has(id));
  return id;
}

export class Game {
  id: string;
  conns: Set<WebSocket>;
  players: Map<string, Player>;

  activeRound: null | Round;
  roundEndedData: null | any;
  roundsLeft: Array<() => Round>;

  constructor() {
    this.id = genId();
    this.conns = new Set();
    this.players = new Map();
    this.activeRound = null;
    this.roundsLeft = [
      roundDonation,
      roundTwoThirds,
      roundPublicGood,
      () => roundPirates(this),
    ];
    this.roundsLeft.sort((_, __) => 0.5 - Math.random());
  }

  addPlayer(id: string, name: string) {
    if (this.players.has(id)) {
      this.players.get(id)!.name = name;
    } else {
      const color = colors[this.players.size % colors.length];
      this.players.set(id, { id, name, score: 0, color, ready: false });
      console.log(`[${new Date()}] Registered player ${id}`);
    }
    for (const conn of this.conns) {
      this.syncPlayerList(conn);
    }
  }

  setPlayerReady(id: string) {
    if (this.players.has(id)) {
      let player = this.players.get(id)!;
      this.players.set(id, {...player, ready: true});
    } else {
      console.warn(`[${new Date()}] Invalid player ID in setPlayerReady`);
    }
    for (const conn of this.conns) {
      this.syncPlayerList(conn);
    }
    if ([...this.players.values()].every(({ready}) => ready) && this.players.size >= 4) {
      // everyone is ready! If there are enough players start the game
      // (minimum is 4 players!)
      this.clearPlayersReady();
      this.setNextRound();
    }
  }

  setPlayerDone(id: string) {
    // similar to set player ready, but does not advance round if everyone is ready
    // (this is done by returning a set of scores!)
    if (this.players.has(id)) {
      let player = this.players.get(id)!;
      this.players.set(id, {...player, ready: true});
    } else {
      console.warn(`[${new Date()}] Invalid player ID in setPlayerDoneForRound`);
    }
    for (const conn of this.conns) {
      this.syncPlayerList(conn);
    }
  }

  clearPlayersReady() {
    for (const [key, val] of this.players) {
      this.players.set(key, {...val, ready: false});
    }
    for (const conn of this.conns) {
      this.syncPlayerList(conn);
    }
  }

  syncPlayerList(conn: WebSocket) {
    conn.send(JSON.stringify({
      type: "player-list",
      players: [...this.players.values()],
    }));
  }

  handleRoundMessage(type: string, playerId: string, data: any) {
    if (this.activeRound != null && this.activeRound.messageTypes.includes(type) && this.players.has(playerId)) {
      let results = this.activeRound.onMessage(this, type, playerId, data);
      if (results != null) {
        // Update score and go to next round.
        for (const [id, player] of this.players) {
          let score = player.score + (results.scores[id] ?? 0);
          this.players.set(id, {...player, score});
        }
        this.clearPlayersReady(); // also syncs the player list (!)
        this.roundEndedData = results.data;
      }
      // Send new round state to everyone
      for (const conn of this.conns) {
        this.syncRound(conn);
      }
    } else {
      console.warn(`[${new Date()}] Invalid message of type ${type} for player ${playerId}`);
    }
  }

  setNextRound() {
    const nextRound = this.roundsLeft.shift();
    if (nextRound) {
      // go to next round
      this.activeRound = nextRound();
    } else {
      // go to done
      this.activeRound = {
        id: "done",
        title: "That's it!", description: "Thank you for playing.",
        messageTypes: [],
        onMessage: (_, __, ___) => { return null; },
        getState: (_) => {},
      };
    }
    this.roundEndedData = null;
    for (const conn of this.conns) {
      this.syncRound(conn);
    }
  }

  syncRound(conn: WebSocket) {
    conn.send(JSON.stringify({
      type: "round-data",
      roundId: this.activeRound?.id,
      title: this.activeRound?.title,
      description: this.activeRound?.description,
      data: this.activeRound?.getState(this),
      endData: this.roundEndedData,
    }));
  }

  async connect(socket: WebSocket) {
    console.log(`[${new Date()}] New WebSocket client connected.`);
    // sync initial state
    this.syncPlayerList(socket);
    this.syncRound(socket);
    // handle incoming events
    this.conns.add(socket);
    try {
      for await (const message of socket) {
        if (typeof message !== "string")
          continue;
        const payload = JSON.parse(message);
        switch (payload.type) {
          case "add-player":
            this.addPlayer(payload.playerId, payload.name);
            break;
          case "set-player-ready":
            if (this.activeRound != null && this.roundEndedData == null) {
              // This is only allowed IF we are not in a round. Otherwise, the round
              // can mark players as ready ...
              console.warn(`[${new Date()}] Invalid tried to set player ready.`);
              continue;
            }
            this.setPlayerReady(payload.playerId);
            break;
          default:
            this.handleRoundMessage(payload.type, payload.playerId, payload.data);
            break;
        }
      }
    } catch (err) {
      console.error(`[${new Date()}] Socket error: ${err}`);
    }
    // handle disconnect
    this.conns.delete(socket);
    console.log(`[${new Date()}] WebSocket client disconnected.`);
  }

  static start(): Game {
    let game = new Game();
    games.set(game.id, game);
    return game;
  }

  static get(id: string): Game | null {
    return games.get(id) ?? null;
  }
}
