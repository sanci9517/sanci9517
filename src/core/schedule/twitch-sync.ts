import type { Env } from "../../types/env";
import { fetchTwitchSchedule } from "./twitch-adapter";
import { syncCanonicalTwitchSchedule } from "./sync";
import { normalizeScheduleSyncWindow, type ScheduleSyncWindow } from "./types";

export async function getTwitchScheduleConnectionIdentity(
  env: Env,
  siteId: string,
  userId: string,
  connectionId: string
): Promise<{ broadcasterId: string }> {
  const row = await env.DB.prepare(
    "SELECT broadcaster_id AS broadcasterId FROM twitch_connections " +
    "WHERE id=? AND user_id=? AND site_id=? LIMIT 1"
  ).bind(connectionId, userId, siteId).first<{ broadcasterId: string }>();

  if (!row?.broadcasterId) throw new Error("TWITCH_CONNECTION_NOT_FOUND");
  return row;
}

export async function syncTwitchSchedule(
  env: Env,
  siteId: string,
  userId: string,
  connectionId: string,
  window: ScheduleSyncWindow,
  options: { maxPages?: number } = {}
) {
  const normalized = normalizeScheduleSyncWindow(window);
  const row = await getTwitchScheduleConnectionIdentity(env, siteId, userId, connectionId);

  return syncCanonicalTwitchSchedule(
    env.DB,
    normalized,
    async () => fetchTwitchSchedule(env, siteId, userId, connectionId, normalized, options),
    row.broadcasterId,
    siteId
  );
}
