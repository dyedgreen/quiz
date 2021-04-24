import { serve } from "https://deno.land/std@0.93.0/http/server.ts";
import serveFiles from "./lib/files.ts";
import { serveApi } from "./lib/api.ts";

async function run() {
  const server = serve({ port: 8080 });
  console.log("Server Started ...");

  for await (const req of server) {
    console.log(`[${new Date()}] ${req.method} ${req.url}`);
    try {
      if (/^\/api\/.+/.test(req.url)) {
        serveApi(req);
      } else {
        serveFiles(req, "www")
          .then(resp => req.respond(resp))
          .catch(err => console.error(`[${new Date()}] www error: ${err}`));
      }
    } catch (err) {
      console.error(`[${new Date()}] Request error: ${err}`);
    }
  }
}

function retry() {
  run().catch(err => {
    console.error(`[${new Date()}] Overall error: ${err}`);
    retry();
  });
}

retry();
