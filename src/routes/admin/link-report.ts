import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import { getCanonicalSiteContext } from "../../core/site-context";
import type { Env } from "../../types/env";

type NavigationItem = { id?: string; type?: string; pageId?: string; label?: string; url?: string; children?: NavigationItem[] };
type PageRow = { id: string; published_slug: string | null; is_published: number; archived_at: string | null };

export async function adminLinkReportRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return error("METHOD_NOT_ALLOWED", 405);
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");
  const { siteId } = getCanonicalSiteContext();
  const navigation = await env.DB.prepare("SELECT published_json FROM site_navigation WHERE site_id=? LIMIT 1").bind(siteId).first<{ published_json: string }>();
  const pages = await env.DB.prepare("SELECT id,published_slug,is_published,archived_at FROM pages WHERE site_id=?").bind(siteId).all<PageRow>();
  const byId = new Map(pages.results.map(page => [page.id, page]));
  let parsed: unknown = null;
  try { parsed = navigation ? JSON.parse(navigation.published_json) : null; } catch {
    return error("NAVIGATION_INVALID", 503, "Published navigation is invalid");
  }
  const root = parsed as { schemaVersion?: number; items?: NavigationItem[] } | null;
  if (root && (root.schemaVersion !== 1 || !Array.isArray(root.items))) return error("NAVIGATION_INVALID", 503);
  const findings: { itemId: string; label: string; pageId: string; reason: string }[] = [];
  let checked = 0;
  function visit(items: NavigationItem[], depth: number): void {
    if (depth > 20 || checked >= 2000) return;
    for (const item of items) {
      if (checked >= 2000) break;
      checked++;
      if (item?.type === "page") {
        const pageId = typeof item.pageId === "string" ? item.pageId : "";
        const page = byId.get(pageId);
        const reason = !page ? "PAGE_NOT_FOUND" : page.archived_at ? "PAGE_ARCHIVED" : !page.is_published || !page.published_slug ? "PAGE_NOT_PUBLISHED" : null;
        if (reason) findings.push({ itemId: item.id || "", label: item.label || "", pageId, reason });
      }
      if (Array.isArray(item?.children)) visit(item.children, depth + 1);
    }
  }
  if (root?.items) visit(root.items, 0);
  const response = ok({ scope: "published-navigation-page-references", checked, truncated: checked >= 2000, findings });
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store");
  return new Response(response.body, { status: response.status, headers });
}
