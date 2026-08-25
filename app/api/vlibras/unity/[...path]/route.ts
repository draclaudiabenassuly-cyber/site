import { NextRequest } from "next/server";

const UPSTREAM_ROOT = "https://vlibras.gov.br/app/unity";
const ALLOWED_FILES = new Set([
  "index.html",
  "index.js",
  "unity-loader.js",
  "playerweb.json",
  "playerweb.data.unityweb",
  "playerweb.wasm.code.unityweb",
  "playerweb.wasm.framework.unityweb",
]);

const PLAYER_HTML = `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <title>Unity WebGL Player | VLibras</title>
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
      #gameContainer { width: 100vw; height: 100vh; background: transparent !important; }
      canvas { width: 100% !important; height: 100% !important; }
    </style>
  </head>
  <body>
    <div id="gameContainer"></div>
    <script src="unity-loader.js"></script>
    <script src="index.js"></script>
  </body>
</html>`;

function contentTypeFor(file: string) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const file = path?.length === 1 ? path[0] : "";
  if (!ALLOWED_FILES.has(file)) {
    return new Response("Not found", { status: 404 });
  }

  if (file === "index.html") {
    return new Response(PLAYER_HTML, {
      headers: {
        "cache-control": "public, max-age=3600, s-maxage=3600",
        "content-type": "text/html; charset=utf-8",
      },
    });
  }

  const upstreamUrl = `${UPSTREAM_ROOT}/${file}${request.nextUrl.search}`;
  const upstream = await fetch(upstreamUrl, { cache: "force-cache" });
  if (!upstream.ok || !upstream.body) {
    return new Response("VLibras asset unavailable", { status: upstream.status || 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "content-type": contentTypeFor(file),
    },
  });
}
