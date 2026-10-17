import type { Env } from "../types/env";

export type SiteDisplaySettings = { siteName: string; tagline: string };
const SITE_SETTINGS_KEY = "site";

export async function loadScopedSiteSettings(
  env: Env,
  siteId: string,
  fallbackName: string
): Promise<SiteDisplaySettings> {
  if (!siteId || !siteId.trim()) throw new Error("SITE_CONTEXT_INVALID");
  const row = await env.DB.prepare(
    "SELECT value_json FROM site_scoped_settings WHERE site_id=? AND key=? LIMIT 1"
  ).bind(siteId, SITE_SETTINGS_KEY).first<{ value_json: string }>();

  const fallback: SiteDisplaySettings = {
    siteName: fallbackName || "",
    tagline: ""
  };
  if (!row) return fallback;
  const parsed: unknown = JSON.parse(row.value_json);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("SITE_SETTINGS_INVALID");
  }
  const data = parsed as Record<string, unknown>;
  return {
    siteName: typeof data.siteName === "string" && data.siteName.trim()
      ? data.siteName.trim() : fallback.siteName,
    tagline: typeof data.tagline === "string" ? data.tagline.trim() : ""
  };
}

export function scopedSettingsUpsert(
  env: Env,
  siteId: string,
  settings: SiteDisplaySettings
): D1PreparedStatement {
  if (!siteId || !siteId.trim()) throw new Error("SITE_CONTEXT_INVALID");
  return env.DB.prepare(`
    INSERT INTO site_scoped_settings (site_id,key,value_json,updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(site_id,key) DO UPDATE SET
      value_json=excluded.value_json,
      updated_at=CURRENT_TIMESTAMP
  `).bind(siteId, SITE_SETTINGS_KEY, JSON.stringify(settings));
}
