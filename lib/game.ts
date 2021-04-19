import type { WebSocket } from "https://deno.land/std@0.93.0/ws/mod.ts";
import { v4 } from "https://deno.land/std@0.93.0/uuid/mod.ts";

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
  onMessage: (ctx: Game, type: string, payload: any) => null | Record<string, number>;
}

const games: Map<string, Game> = new Map();

export class Game {
  id: string;
  conns: Set<WebSocket>;
  players: Map<string, Player>;

  activeRound: null | Round;

  constructor() {
    this.id = v4.generate();
    this.conns = new Set();
    this.players = new Map();
    this.activeRound = null;
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

  async connect(socket: WebSocket) {
    console.log(`[${new Date()}] New WebSocket client connected.`);
    // sync initial state
    this.syncPlayerList(socket);
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
            if (this.activeRound != null) {
              // This is only allowed IF we are not in a round. Otherwise, the round
              // can mark players as ready ...
              console.warn(`[${new Date()}] Invalid tried to set player ready.`);
              continue;
            }
            this.setPlayerReady(payload.playerId);
            break;
        }
      }
    } catch (err) {
      console.error(`[${new Date()}] Socket error: ${err}`);
    }
    // handle disconnect
    this.conns.delete(socket);
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
