import type { WebSocket } from "https://deno.land/std@0.93.0/ws/mod.ts";
import { v4 } from "https://deno.land/std@0.93.0/uuid/mod.ts";

interface Player {
  id: string;
  name: string;
  score: number;
}

const games: Map<string, Game> = new Map();

export class Game {
  id: string;
  conns: Set<WebSocket>;
  players: Map<string, Player>;

  constructor() {
    this.id = v4.generate();
    this.conns = new Set();
    this.players = new Map();
  }

  addPlayer(id: string, name: string) {
    if (this.players.has(id)) {
      this.players.get(id)!.name = name;
    } else {
      this.players.set(id, { id, name, score: 0 });
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
    console.log(`${new Date()} New WebSocket client connected.`);
    // sync initial state
    this.syncPlayerList(socket);
    // handle incoming events
    try {
      for await (const message of socket) {
        if (typeof message !== "string")
          continue;
        const payload = JSON.parse(message);
        switch (payload.type) {
          case "add-player":
            this.addPlayer(payload.playerId, payload.name);
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
    console.log(games);
    return game;
  }

  static get(id: string): Game | null {
    return games.get(id) ?? null;
  }
}
