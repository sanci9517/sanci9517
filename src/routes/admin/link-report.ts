import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import { getCanonicalSiteContext } from "../../core/site-context";
import type { Env } from "../../types/env";

type NavigationItem = { id?: string; type?: string; pageId?: string; label?: string; url?: string; children?: NavigationItem[] };
type PageRow = { id: string; published_slug: string | null; is_published: number; archived_at: string | null; published_content_json: string | null };

export async function adminLinkReportRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return error("METHOD_NOT_ALLOWED", 405);
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");
  const { siteId } = getCanonicalSiteContext();
  const navigation = await env.DB.prepare("SELECT published_json FROM site_navigation WHERE site_id=? LIMIT 1").bind(siteId).first<{ published_json: string }>();
  const pages = await env.DB.prepare("SELECT id,published_slug,is_published,archived_at,published_content_json FROM pages WHERE site_id=?").bind(siteId).all<PageRow>();
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
  const publishedSlugs = new Set(pages.results.filter(page => !page.archived_at && page.is_published && page.published_slug).map(page => page.published_slug));
  const redirects = await env.DB.prepare("SELECT from_slug,page_id FROM page_slug_redirects WHERE site_id=?").bind(siteId).all<{from_slug:string;page_id:string}>();
  const redirectedSlugs = new Map(redirects.results.map(redirect => [redirect.from_slug, redirect.page_id]));
  const contentFindings: { sourcePageId: string; nodeId: string; href: string; reason: string }[] = [];
  const redirectedContentLinks: { sourcePageId: string; nodeId: string; href: string; targetPageId: string }[] = [];
  let checkedContentLinks = 0;
  let contentTruncated = false;
  let missingPublishedContentPages = 0;
  let unparseablePublishedPages = 0;
  let unsupportedPublishedDocuments = 0;
  for (const page of pages.results) {
    if (page.archived_at || !page.is_published) continue;
    if (!page.published_content_json) { missingPublishedContentPages++; continue; }
    let document: any;
    try { document = JSON.parse(page.published_content_json); } catch { unparseablePublishedPages++; continue; }
    const nodes = document?.pages?.[page.id]?.nodes;
    if (!nodes || typeof nodes !== "object" || Array.isArray(nodes)) { unsupportedPublishedDocuments++; continue; }
    for (const [nodeId, node] of Object.entries<any>(nodes)) {
      if (checkedContentLinks >= 2000) { contentTruncated = true; break; }
      const candidates = [node?.props?.href, node?.props?.url, node?.props?.link?.href, node?.props?.link?.url];
      // Rich-text HTML can contain internal anchors that are not explicit node link props.
      for (const html of [node?.props?.html, node?.props?.richText, node?.props?.content?.html]) {
        if (typeof html !== "string" || html.length > 100000) continue;
        const anchors = /<a\b[^>]*?\bhref\s*=\s*(?:["']([^"']*)["']|([^\s>]+))/gi;
        let match: RegExpExecArray | null;
        while ((match = anchors.exec(html)) !== null && candidates.length < 2000) candidates.push((match[1] ?? match[2]).replace(/&amp;/gi, "&"));
      }
      for (const href of candidates) {
        if (typeof href !== "string" || !href.startsWith("/p/")) continue;
        if (checkedContentLinks >= 2000) { contentTruncated = true; break; }
        checkedContentLinks++;
        const pathname = href.split(/[?#]/, 1)[0];
        let slug: string;
        try { slug = decodeURIComponent(pathname.slice(3)); } catch { slug = ""; }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !publishedSlugs.has(slug)) {
          const redirectedPageId = redirectedSlugs.get(slug);
          const redirectedPage = redirectedPageId ? byId.get(redirectedPageId) : null;
          if (redirectedPage && !redirectedPage.archived_at && redirectedPage.is_published && redirectedPage.published_slug && !redirectedSlugs.has(redirectedPage.published_slug)) {
            redirectedContentLinks.push({ sourcePageId: page.id, nodeId, href: href.slice(0, 300), targetPageId: redirectedPage.id });
            continue;
          }
          contentFindings.push({ sourcePageId: page.id, nodeId, href: href.slice(0, 300), reason: "TARGET_NOT_PUBLISHED" });
        }
      }
    }
    if (contentTruncated) break;
  }
  const response = ok({ scope: "published-navigation-and-content-page-references", checked, truncated: checked >= 2000, findings, checkedContentLinks, contentTruncated, contentFindings, redirectedContentLinks, missingPublishedContentPages, unparseablePublishedPages, unsupportedPublishedDocuments });
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store");
  return new Response(response.body, { status: response.status, headers });
}
