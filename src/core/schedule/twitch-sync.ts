import type { Env } from "../../types/env";
import { fetchTwitchSchedule } from "./twitch-adapter";
import { syncCanonicalTwitchSchedule } from "./sync";
import { normalizeScheduleSyncWindow, type ScheduleSyncWindow } from "./types";

export async function syncTwitchSchedule(
  env: Env,
  siteId: string,
  connectionId: string,
  window: ScheduleSyncWindow,
  options: { maxPages?: number } = {}
) {
  const normalized = normalizeScheduleSyncWindow(window);
  const row = await env.DB.prepare(
    "SELECT broadcaster_id AS broadcasterId FROM twitch_connections WHERE id=? AND site_id=? LIMIT 1"
  ).bind(connectionId,siteId).first<{ broadcasterId: string }>();

  if (!row?.broadcasterId) throw new Error("TWITCH_CONNECTION_NOT_FOUND");

  return syncCanonicalTwitchSchedule(
    env.DB,
    normalized,
    async () => fetchTwitchSchedule(env, connectionId, normalized, options),
    row.broadcasterId,
    siteId
  );
}
