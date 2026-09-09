import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import type { Env } from "../../types/env";

type SettingsBody = {
  siteName?: unknown;
  tagline?: unknown;
};

type SettingRow = {
  key: string;
  value_json: string;
};

const SETTINGS_KEY = "site";

export async function adminSettingsRoute(request: Request, env: Env): Promise<Response> {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "admin")) return error("FORBIDDEN", 403, "Admin role required");

  if (request.method === "GET") {
    const row = await env.DB.prepare(
      "SELECT key, value_json FROM site_settings WHERE key = ? LIMIT 1"
    )
      .bind(SETTINGS_KEY)
      .first<SettingRow>();

    const defaults = { siteName: "Sanci9517", tagline: "Streamer" };
    if (!row) return ok(defaults);

    try {
      return ok({ ...defaults, ...(JSON.parse(row.value_json) as Record<string, unknown>) });
    } catch {
      return error("INVALID_SETTINGS", 500);
    }
  }

  if (request.method !== "PUT") return error("METHOD_NOT_ALLOWED", 405);

  let body: SettingsBody;
  try {
    body = (await request.json()) as SettingsBody;
  } catch {
    return error("INVALID_JSON", 400);
  }

  const siteName = typeof body.siteName === "string" ? body.siteName.trim() : "";
  const tagline = typeof body.tagline === "string" ? body.tagline.trim() : "";

  if (!siteName || siteName.length > 120 || tagline.length > 240) {
    return error("INVALID_SETTINGS", 400);
  }

  const valueJson = JSON.stringify({ siteName, tagline });
  await env.DB.prepare(
    `INSERT INTO site_settings (key, value_json, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET
       value_json = excluded.value_json,
       updated_at = CURRENT_TIMESTAMP`
  )
    .bind(SETTINGS_KEY, valueJson)
    .run();

  await env.DB.prepare(
    `INSERT INTO audit_log (id, user_id, action, entity_type, entity_id, metadata_json)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      user.id,
      "settings.update",
      "site_settings",
      SETTINGS_KEY,
      valueJson
    )
    .run();

  return ok({ siteName, tagline });
}
