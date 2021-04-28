import type { ServerRequest } from "https://deno.land/std@0.93.0/http/mod.ts";
import { posix } from "https://deno.land/std@0.93.0/path/mod.ts";
import { serveFile } from "https://deno.land/std@0.93.0/http/file_server.ts";

function normalizeURL(url: string) {
  let normalizedUrl = url;
  try {
    normalizedUrl = decodeURI(normalizedUrl);
  } catch (e) {
    if (!(e instanceof URIError)) {
      throw e;
    }
  }

  try {
    //allowed per https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html
    const absoluteURI = new URL(normalizedUrl);
    normalizedUrl = absoluteURI.pathname;
  } catch (e) { //wasn't an absoluteURI
    if (!(e instanceof TypeError)) {
      throw e;
    }
  }

  if (normalizedUrl[0] !== "/") {
    throw new URIError("The request URI is malformed.");
  }

  normalizedUrl = posix.normalize(normalizedUrl);
  const startOfParams = normalizedUrl.indexOf("?");
  return startOfParams > -1
    ? normalizedUrl.slice(0, startOfParams)
    : normalizedUrl;
}

export default async function serve(req: ServerRequest, dir: string) {
  const url = normalizeURL(req.url);
  const fsPath = posix.join(dir, url !== "/" ? url : "/index.html");

  if (fsPath.indexOf(dir) !== 0) {
    return { status: 400, body: "Invalid file path.\n" };
  }

  const { isFile } = await Deno.stat(fsPath).catch(() => {
    return { isFile: false };
  });
  if (!isFile) {
    return { status: 404, body: "File not found.\n" };
  }

  return await serveFile(req, fsPath);
}
