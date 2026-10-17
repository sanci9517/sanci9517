import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import { getCanonicalSiteContext } from "../../core/site-context";
import type { Env } from "../../types/env";

type NavigationItem = { id?: string; type?: string; pageId?: string; label?: string; url?: string; children?: NavigationItem[] };
type PageRow = { id: string; published_slug: string | null; is_published: number; archived_at: string | null; published_content_json: string | null };
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Only links resolved on this site's current origin belong to this report.
function internalPageSlug(href: string, origin: string): string | null {
  const value = href.trim();
  if (!value.startsWith("/") && !/^https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || url.username || url.password || !url.pathname.startsWith("/p/")) return null;
    try { return decodeURIComponent(url.pathname.slice(3)); } catch { return ""; }
  } catch { return null; }
}

export async function adminLinkReportRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return error("METHOD_NOT_ALLOWED", 405);
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");
  const { siteId } = getCanonicalSiteContext();
  const origin = new URL(request.url).origin;
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
  const navigationUrlFindings: { itemId: string; label: string; href: string; reason: string }[] = [];
  const redirectedNavigationLinks: { itemId: string; label: string; href: string; targetPageId: string }[] = [];
  let checked = 0;
  let navigationDepthTruncated = false;
  function visit(items: NavigationItem[], depth: number): void {
    if (depth > 20) { navigationDepthTruncated = true; return; }
    if (checked >= 2000) return;
    for (const item of items) {
      if (checked >= 2000) break;
      checked++;
      if (item?.type === "page") {
        const pageId = typeof item.pageId === "string" ? item.pageId : "";
        const page = byId.get(pageId);
        const reason = !page ? "PAGE_NOT_FOUND" : page.archived_at ? "PAGE_ARCHIVED" : !page.is_published || !page.published_slug ? "PAGE_NOT_PUBLISHED" : null;
        if (reason) findings.push({ itemId: item.id || "", label: item.label || "", pageId, reason });
      } else if (item?.type === "external" && typeof item.url === "string") {
        const slug = internalPageSlug(item.url, origin);
        if (slug !== null) {
          const status = linkStatus(slug);
          if (status.kind === "broken") navigationUrlFindings.push({ itemId: item.id || "", label: item.label || "", href: item.url.slice(0, 300), reason: "TARGET_NOT_PUBLISHED" });
          if (status.kind === "redirected") redirectedNavigationLinks.push({ itemId: item.id || "", label: item.label || "", href: item.url.slice(0, 300), targetPageId: status.targetPageId });
        }
      }
      if (Array.isArray(item?.children)) visit(item.children, depth + 1);
    }
  }
  const publishedSlugs = new Set(pages.results.filter(page => !page.archived_at && page.is_published && page.published_slug).map(page => page.published_slug));
  const redirects = await env.DB.prepare("SELECT from_slug,page_id FROM page_slug_redirects WHERE site_id=?").bind(siteId).all<{from_slug:string;page_id:string}>();
  const redirectedSlugs = new Map(redirects.results.map(redirect => [redirect.from_slug, redirect.page_id]));
  function linkStatus(slug: string): { kind: "published" } | { kind: "redirected"; targetPageId: string } | { kind: "broken" } {
    if (validSlug.test(slug) && publishedSlugs.has(slug)) return { kind: "published" };
    const redirectedPageId = redirectedSlugs.get(slug);
    const redirectedPage = redirectedPageId ? byId.get(redirectedPageId) : null;
    if (redirectedPage && !redirectedPage.archived_at && redirectedPage.is_published && redirectedPage.published_slug && !redirectedSlugs.has(redirectedPage.published_slug)) {
      return { kind: "redirected", targetPageId: redirectedPage.id };
    }
    return { kind: "broken" };
  }
  if (root?.items) visit(root.items, 0);
  const contentFindings: { sourcePageId: string; nodeId: string; href: string; reason: string }[] = [];
  const redirectedContentLinks: { sourcePageId: string; nodeId: string; href: string; targetPageId: string }[] = [];
  let checkedContentLinks = 0;
  let contentTruncated = false;
  let missingPublishedContentPages = 0;
  let unparseablePublishedPages = 0;
  let unsupportedPublishedDocuments = 0;
  let oversizedRichTextFields = 0;
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
      const richText = node?.props?.richText;
      if (richText?.type === "richtext-document" && richText.schemaVersion === 1 && Array.isArray(richText.blocks)) {
        for (const block of richText.blocks) {
          const groups = Array.isArray(block?.items) ? block.items.map((item: any) => Array.isArray(item) ? item : item?.children) : [block?.children];
          for (const group of groups) {
            if (!Array.isArray(group)) continue;
            for (const inline of group) {
              if (candidates.length >= 2000) { contentTruncated = true; break; }
              if (typeof inline?.link?.href === "string") candidates.push(inline.link.href);
            }
            if (contentTruncated) break;
          }
          if (contentTruncated) break;
        }
      }
      // Rich-text HTML can contain internal anchors that are not explicit node link props.
      for (const html of [node?.props?.html, node?.props?.richText, node?.props?.content?.html]) {
        if (typeof html !== "string") continue;
        if (html.length > 100000) { oversizedRichTextFields++; continue; }
        const anchors = /<a\b[^>]*?\s+href\s*=\s*(?:["']([^"']*)["']|([^\s>]+))/gi;
        let match: RegExpExecArray | null;
        while ((match = anchors.exec(html)) !== null) {
          if (candidates.length >= 2000) { contentTruncated = true; break; }
          candidates.push((match[1] ?? match[2]).replace(/&amp;/gi, "&"));
        }
      }
      for (const href of candidates) {
        if (typeof href !== "string") continue;
        const slug = internalPageSlug(href, origin);
        if (slug === null) continue;
        if (checkedContentLinks >= 2000) { contentTruncated = true; break; }
        checkedContentLinks++;
        const status = linkStatus(slug);
        if (status.kind === "redirected") redirectedContentLinks.push({ sourcePageId: page.id, nodeId, href: href.slice(0, 300), targetPageId: status.targetPageId });
        if (status.kind === "broken") contentFindings.push({ sourcePageId: page.id, nodeId, href: href.slice(0, 300), reason: "TARGET_NOT_PUBLISHED" });
      }
    }
    if (contentTruncated) break;
  }
  const response = ok({ scope: "published-navigation-and-content-page-references", checked, truncated: checked >= 2000 || navigationDepthTruncated, navigationDepthTruncated, findings, navigationUrlFindings, redirectedNavigationLinks, checkedContentLinks, contentTruncated, contentFindings, redirectedContentLinks, missingPublishedContentPages, unparseablePublishedPages, unsupportedPublishedDocuments, oversizedRichTextFields });
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store");
  return new Response(response.body, { status: response.status, headers });
}
