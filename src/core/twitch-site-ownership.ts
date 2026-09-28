import type { Env } from "../types/env.ts";

export type OwnedTwitchConnection = {
  id: string;
  broadcasterId: string;
  broadcasterLogin: string;
  status: string;
};

export async function bindNewTwitchConnectionToSite(
  env: Env,
  siteId: string,
  userId: string
): Promise<void> {
  await env.DB.prepare(
    "UPDATE twitch_connections SET site_id=?,updated_at=CURRENT_TIMESTAMP " +
    "WHERE user_id=? AND site_id IS NULL"
  ).bind(siteId, userId).run();
}

export async function bindTwitchConnectionToSite(
  env: Env,
  siteId: string,
  connectionId: string
): Promise<boolean> {
  const result = await env.DB.prepare(
    "UPDATE twitch_connections SET site_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND site_id IS NULL"
  ).bind(siteId, connectionId).run();
  return result.meta.changes === 1;
}

export async function getOwnedTwitchConnection(
  env: Env,
  siteId: string,
  userId: string
): Promise<OwnedTwitchConnection | null> {
  return env.DB.prepare(
    "SELECT id,broadcaster_id AS broadcasterId,broadcaster_login AS broadcasterLogin,status " +
    "FROM twitch_connections WHERE id IS NOT NULL AND user_id=? AND site_id=? " +
    "ORDER BY updated_at DESC LIMIT 1"
  ).bind(userId, siteId).first<OwnedTwitchConnection>();
}

export async function assertTwitchConnectionOwnership(
  env: Env,
  siteId: string,
  userId: string,
  connectionId: string
): Promise<boolean> {
  const row = await env.DB.prepare(
    "SELECT id FROM twitch_connections WHERE id=? AND user_id=? AND site_id=? LIMIT 1"
  ).bind(connectionId, userId, siteId).first<{ id: string }>();
  return Boolean(row);
}
