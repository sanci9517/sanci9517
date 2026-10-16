import { error, ok } from "../../core/response";
import { getCanonicalSiteContext } from "../../core/site-context";
import type { Env } from "../../types/env";

type NavItem = { id: string; type: "page" | "external"; pageId?: string; url?: string; label?: string; children: NavItem[] };
type PageRow = { id: string; published_slug: string; published_title: string };

function noStore(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function parseTree(value: string): NavItem[] | null {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.items)) return null;
    return parsed.items as NavItem[];
  } catch { return null; }
}

export async function publicNavigationRoute(env: Env): Promise<Response> {
  const siteId = getCanonicalSiteContext().siteId;
  const row = await env.DB.prepare("SELECT published_json FROM site_navigation WHERE site_id=? LIMIT 1").bind(siteId).first<{ published_json: string }>();
  if (!row) return noStore(error("NAVIGATION_NOT_FOUND", 404));
  const items = parseTree(row.published_json);
  if (!items) return noStore(error("NAVIGATION_INVALID", 503, "A közzétett navigáció jelenleg nem érhető el."));
  const pages = await env.DB.prepare("SELECT id,published_slug,published_title FROM pages WHERE archived_at IS NULL AND site_id=? AND is_published=1 AND published_slug IS NOT NULL").bind(siteId).all<PageRow>();
  const byId = new Map(pages.results.map(page => [page.id, page]));

  const project = (nodes: NavItem[]): unknown[] => nodes.flatMap(item => {
    const children = project(Array.isArray(item.children) ? item.children : []);
    if (item.type === "page") {
      const page = typeof item.pageId === "string" ? byId.get(item.pageId) : undefined;
      if (!page) return [];
      return [{ id: item.id, type: "page", href: `/p/${encodeURIComponent(page.published_slug)}`, label: item.label || page.published_title, slug: page.published_slug, children }];
    }
    if (item.type === "external" && typeof item.url === "string" && typeof item.label === "string" && item.url.startsWith("https://")) {
      return [{ id: item.id, type: "external", href: item.url, label: item.label, children }];
    }
    return [];
  });

  return noStore(ok({ items: project(items) }));
}
