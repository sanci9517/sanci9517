import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole, type AuthUser } from "../../core/auth/require-auth";
import { requireSiteGrant } from "../../core/auth/site-access";
import type { Env } from "../../types/env";
import { auditStatement } from "../../core/audit";
import { DEFAULT_SITE_ID } from "../../core/site-context";
import { loadScopedSiteSettings, scopedSettingsUpsert } from "../../core/site-scoped-settings";

type SettingsBody = {
  siteName?: unknown;
  tagline?: unknown;
};

type SettingRow = {
  key: string;
  value_json: string;
};

const SETTINGS_KEY = "site";

/**
 * siteId comes exclusively from the Worker's verified domain-to-site resolver,
 * never a user-supplied query parameter, header or JSON body.
 */
export async function adminSettingsRoute(
  request: Request, env: Env, siteId = DEFAULT_SITE_ID, siteName = "Sanci9517"
): Promise<Response> {
  if (!siteId || !siteId.trim()) return error("SITE_CONTEXT_INVALID", 403);
  let user: AuthUser;
  if (env.SITE_MEMBERSHIP_ENFORCEMENT === "enabled") {
    const grant = await requireSiteGrant(request, env, siteId, "admin");
    if (grant instanceof Response) return grant;
    user = grant.user;
  } else {
    // Legacy global roles are only valid for the default site's old route.
    if (siteId !== DEFAULT_SITE_ID) return error("SITE_ACCESS_DENIED", 403);
    const legacyUser = await getAuthenticatedUser(request, env);
    if (!legacyUser) return error("UNAUTHORIZED", 401, "Authentication required");
    if (!hasRole(legacyUser, "admin")) return error("FORBIDDEN", 403, "Admin role required");
    user = legacyUser;
  }
  if (siteId !== DEFAULT_SITE_ID && env.SITE_SCOPED_SETTINGS_ENABLED !== "enabled") {
    return error("SITE_SETTINGS_UNAVAILABLE", 503);
  }

  if (request.method === "GET") {
    if (env.SITE_SCOPED_SETTINGS_ENABLED === "enabled") {
      try {
        return ok(await loadScopedSiteSettings(env, siteId, siteName));
      } catch {
        return error("SITE_SETTINGS_UNAVAILABLE", 503);
      }
    }
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

  if (env.SITE_SCOPED_SETTINGS_ENABLED === "enabled") {
    try {
      await env.DB.batch([
        scopedSettingsUpsert(env, siteId, { siteName, tagline }),
        auditStatement(env, user.id, "settings.update", "site_scoped_settings", siteId, { siteName, tagline })
      ]);
      return ok({ siteName, tagline });
    } catch {
      return error("SITE_SETTINGS_UNAVAILABLE", 503);
    }
  }

  const valueJson = JSON.stringify({ siteName, tagline });
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO site_settings (key, value_json, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET
       value_json = excluded.value_json,
       updated_at = CURRENT_TIMESTAMP`).bind(SETTINGS_KEY, valueJson),
    auditStatement(env, user.id, "settings.update", "site_settings", SETTINGS_KEY, { siteName, tagline })
  ]);

  return ok({ siteName, tagline });
}
