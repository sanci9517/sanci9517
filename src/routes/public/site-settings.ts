import type { Env } from "../../types/env";

const DEFAULT_SITE = {
  siteName: "Sanci9517",
  tagline: "Streamer"
};

export async function publicSiteSettingsRoute(env: Env): Promise<Response> {
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
