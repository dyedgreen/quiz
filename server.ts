import { serve } from "https://deno.land/std@0.93.0/http/server.ts";
import serveFiles from "./lib/files.ts";
import { serveApi } from "./lib/api.ts";

const server = serve({ port: 8080 });
console.log("Serving from http://localhost:8000/");

for await (const req of server) {
  console.log(`[${new Date()}] ${req.method} ${req.url}`);
  if (/^\/api\/.+/.test(req.url)) {
    serveApi(req);
  } else {
    serveFiles(req, "www").then(resp => req.respond(resp));
  }
}
