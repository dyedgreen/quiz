import type { ServerRequest, Response } from "https://deno.land/std@0.93.0/http/server.ts";
import { acceptWebSocket } from "https://deno.land/std@0.93.0/ws/mod.ts";
import { Game } from "./game.ts";

const methods: Record<string, (req: ServerRequest, args: any) => Promise<void>> = {
  start: async (req) => {
    let game = Game.start();
    req.respond({
      status: 200,
      body: JSON.stringify({ gameId: game.id }),
    });
  },
  live: async (req, [id]) => {
    let game = Game.get(id);
    if (game != null) {
      let socket = await acceptWebSocket({...req, bufReader: req.r, bufWriter: req.w});
      game.connect(socket);
    } else {
      req.respond({
        status: 404,
        body: JSON.stringify({ error: "Game not found." }),
      });
    }
  },
};

export function serveApi(req: ServerRequest) {
  let [method, ...args] = req.url.replace(/^\/api\//, "").split("/");
  if (methods.hasOwnProperty(method)) {
    methods[method](req, args)
      .catch(err => {
        console.error("API error:", err);
        req.respond({
          status: 500,
          body: JSON.stringify({ error: "Something went wrong." }),
        });
      });
  } else {
    req.respond({
      status: 404,
      body: JSON.stringify({ error: "Unknown method." }),
    });
  }
}
