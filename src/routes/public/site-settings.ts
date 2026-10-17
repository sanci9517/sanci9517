import type { Env } from "../../types/env";
import { DEFAULT_SITE_ID } from "../../core/site-context";
import { loadScopedSiteSettings } from "../../core/site-scoped-settings";

const DEFAULT_SITE = {
  siteName: "Sanci9517",
  tagline: "Streamer"
};

export async function publicSiteSettingsRoute(env: Env, siteId = DEFAULT_SITE_ID, siteName?: string): Promise<Response> {
  if (env.SITE_SCOPED_SETTINGS_ENABLED === "enabled") {
    try {
      const fallbackName = siteName || (siteId === DEFAULT_SITE_ID ? DEFAULT_SITE.siteName : "");
      const settings = await loadScopedSiteSettings(env, siteId, fallbackName);
      return Response.json(settings, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return Response.json({ error: "SITE_SETTINGS_UNAVAILABLE" }, {
        status: 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" }
      });
    }
  }
  if (siteId !== DEFAULT_SITE_ID) return Response.json(
    { siteName: siteName || "", tagline: "" },
    { headers: { "Cache-Control": "no-store" } }
  );
  const row = await env.DB.prepare(
    "SELECT value_json FROM site_settings WHERE key = ?1 LIMIT 1"
  )
    .bind("site")
    .first<{ value_json: string }>();

  let settings = DEFAULT_SITE;

  if (row?.value_json) {
    try {
      const parsed = JSON.parse(row.value_json) as Partial<typeof DEFAULT_SITE>;
      settings = {
        siteName:
          typeof parsed.siteName === "string" && parsed.siteName.trim()
            ? parsed.siteName.trim()
            : DEFAULT_SITE.siteName,
        tagline:
          typeof parsed.tagline === "string"
            ? parsed.tagline.trim()
            : DEFAULT_SITE.tagline
      };
    } catch {
      settings = DEFAULT_SITE;
    }
  }

  return Response.json(
    { siteName: settings.siteName, tagline: settings.tagline },
    { headers: { "Cache-Control": "no-store" } }
  );
}
