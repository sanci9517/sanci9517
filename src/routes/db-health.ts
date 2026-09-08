import { json } from "../core/router";
import type { Env } from "../index";

export async function dbHealthRoute(env: Env): Promise<Response> {
  if (!env.DB) {
    return json({ ok: false, service: "d1", error: "DB_BINDING_MISSING" }, 500);
  }

  try {
    const result = await env.DB.prepare("SELECT 1 AS connected").first<{ connected: number }>();

    if (result?.connected !== 1) {
      return json({ ok: false, service: "d1", error: "DB_QUERY_FAILED" }, 500);
    }

    return json({
      ok: true,
      service: "d1",
      database: "sanci9517-db",
      connected: true
    });
  } catch {
    return json({ ok: false, service: "d1", error: "DB_CONNECTION_FAILED" }, 500);
  }
}
