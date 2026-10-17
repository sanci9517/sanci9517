import type { Env } from "../../types/env";
import { getCanonicalSiteContext } from "../../core/site-context";

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const xmlEscape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function sitemapRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method Not Allowed", { status: 405 });
  const origin = new URL(request.url).origin;
  const { siteId } = getCanonicalSiteContext();
  try {
    const locations = [origin + "/"];
    let afterSlug = "";
    let complete = false;
    // Keyset pagination keeps the sitemap complete beyond the first 1000 pages.
    // The sitemap protocol permits at most 50,000 URLs, including the home page.
    for (let batch = 0; batch < 50; batch++) {
      const pages = await env.DB.prepare(
        "SELECT published_slug FROM pages WHERE site_id=? AND archived_at IS NULL AND is_published=1 AND published_slug IS NOT NULL AND published_slug>? ORDER BY published_slug ASC LIMIT 1000"
      ).bind(siteId, afterSlug).all<{ published_slug: string }>();
      for (const page of pages.results) {
        if (validSlug.test(page.published_slug)) locations.push(origin + "/p/" + encodeURIComponent(page.published_slug));
      }
      if (pages.results.length < 1000) { complete = true; break; }
      afterSlug = pages.results[pages.results.length - 1].published_slug;
    }
    if (!complete || locations.length > 50000) throw new Error("SITEMAP_LIMIT_EXCEEDED");
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      locations.map(location => "  <url><loc>" + xmlEscape(location) + "</loc></url>").join("\n") +
      "\n</urlset>\n";
    return new Response(request.method === "HEAD" ? null : xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
  } catch {
    return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

export function robotsRoute(request: Request): Response {
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method Not Allowed", { status: 405 });
  const origin = new URL(request.url).origin;
  const body = "User-agent: *\nDisallow: /admin\nDisallow: /api/\nSitemap: " + origin + "/sitemap.xml\n";
  return new Response(request.method === "HEAD" ? null : body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
