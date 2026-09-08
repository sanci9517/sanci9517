import { json } from "../core/router";

export function healthRoute(): Response {
  return json({
    ok: true,
    service: "sanci9517-streamer-brand",
    version: "2.0.0",
    server: "cloudflare-worker"
  });
}
