import {adminPresentationRoute,presentationAccess} from "./routes/admin/presentation";
import {publicPresentationRoute} from "./routes/public/presentation";
import { adminLinkReportRoute } from "./routes/admin/link-report";
import { sitemapRoute, robotsRoute } from "./routes/public/seo";
import { dbHealthRoute } from "./routes/db-health";
import { healthRoute } from "./routes/health";
import { authBootstrapRoute } from "./routes/auth/bootstrap";
import { authLoginRoute } from "./routes/auth/login";
import { authLogoutRoute } from "./routes/auth/logout";
import { authSessionRoute } from "./routes/auth/session";
import { adminSettingsRoute } from "./routes/admin/settings";
import { adminScheduleRoute } from "./routes/admin/schedule";
import { adminTwitchScheduleSyncRoute } from "./routes/admin/twitch-schedule-sync";
import { adminPagesRoute } from "./routes/admin/pages";
import { adminEditorRoute } from "./routes/admin/editor";
import { adminMediaRoute } from "./routes/admin/media";
import { publicSiteSettingsRoute } from "./routes/public/site-settings";
import { publicScheduleRoute } from "./routes/public/schedule";
import {
  twitchConfigDiagnosticRoute,
  twitchConnectRoute,
  twitchCallbackRoute,
  twitchConnectionRoute,
  twitchValidationRoute,
  twitchDisconnectRoute
} from "./routes/integrations/twitch";
import { publicPagesRoute } from "./routes/public/pages";
import { adminNavigationRoute } from "./routes/admin/navigation";
import { publicNavigationRoute } from "./routes/public/navigation";
import { getAuthenticatedUser } from "./core/auth/require-auth";
import { resolvePublishedPageRedirect } from "./core/page-redirects";
import { getCanonicalSiteContext } from "./core/site-context";
import { resolveRequestSite } from "./core/site-domain";
import { enforceAdminTenantGate } from "./core/auth/admin-tenant-gate";
import type { Env } from "./types/env";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    if (pathname === "/api/health") return healthRoute();
    const site = await resolveRequestSite(request, env);
    if (!site) return new Response("Unknown site", { status: 421, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
    const { siteId } = site;
    if (siteId !== getCanonicalSiteContext().siteId &&
      (pathname.startsWith("/api/admin/") || pathname.startsWith("/api/auth/") || pathname.startsWith("/api/integrations/") || pathname.startsWith("/admin") ||
        ((pathname.startsWith("/p/") || (pathname === "/api/public/pages" || pathname === "/api/public/presentation")) && url.searchParams.get("preview") === "1"))) {
      return new Response("Site administration unavailable", { status: 403, headers: { "Cache-Control": "no-store" } });
    }
    const tenantDenial = await enforceAdminTenantGate(request, env, siteId, pathname);
    if (tenantDenial) return tenantDenial;
    if (pathname === "/sitemap.xml") return sitemapRoute(request, env, siteId);
    if (pathname === "/robots.txt") return robotsRoute(request);
    if (pathname === "/api/db-health") return dbHealthRoute(env);
    if (pathname === "/api/auth/bootstrap") return authBootstrapRoute(request, env);
    if (pathname === "/api/auth/login") return authLoginRoute(request, env);
    if (pathname === "/api/auth/logout") return authLogoutRoute(request, env);
    if (pathname === "/api/auth/session") return authSessionRoute(request, env);
    if (pathname === "/api/admin/presentation") return adminPresentationRoute(request, env, siteId);
    if (pathname === "/api/public/presentation") return publicPresentationRoute(request, env, siteId);
    if (pathname === "/admin/design") { const user=await presentationAccess(request,env,siteId);if(user instanceof Response)return user.status===401?Response.redirect(new URL("/admin/login",request.url).toString(),302):user;return env.ASSETS.fetch(assetRequest("/admin-design.html",request)); }
    if (pathname === "/api/admin/settings") return adminSettingsRoute(request, env, siteId, site.siteName);
    if (pathname === "/api/admin/schedule") return adminScheduleRoute(request, env);
    if (pathname === "/api/admin/twitch/schedule-sync") return adminTwitchScheduleSyncRoute(request, env);
    if (pathname === "/api/admin/link-report") return adminLinkReportRoute(request, env);
    if (pathname === "/api/admin/pages") return adminPagesRoute(request, env, siteId);
    if (pathname === "/api/admin/navigation") return adminNavigationRoute(request, env, siteId);
    if (pathname === "/api/admin/editor") return adminEditorRoute(request, env, siteId);
    if (pathname === "/api/admin/media") return adminMediaRoute(request, env, siteId);
    if (pathname === "/api/public/site-settings") return publicSiteSettingsRoute(env, siteId, site.siteName);
    if (pathname === "/api/public/schedule") return publicScheduleRoute(request, env, siteId);
    if (pathname === "/api/integrations/twitch/diagnostic") return twitchConfigDiagnosticRoute(request, env);
    if (pathname === "/api/integrations/twitch/connect") return twitchConnectRoute(request, env);
    if (pathname === "/api/integrations/twitch/callback") return twitchCallbackRoute(request, env);
    if (pathname === "/api/integrations/twitch/connection") return twitchConnectionRoute(request, env);
    if (pathname === "/api/integrations/twitch/validation") return twitchValidationRoute(request, env);
    if (pathname === "/api/integrations/twitch/disconnect") return twitchDisconnectRoute(request, env);
    if (pathname === "/api/public/pages") return publicPagesRoute(request, env, siteId);
    if (pathname === "/api/public/navigation") return publicNavigationRoute(env, siteId);
    if (pathname === "/admin/login") return env.ASSETS.fetch(assetRequest("/admin-login.html", request));
    if (pathname === "/admin") {
      const user = await getAuthenticatedUser(request, env);
      if (!user) return Response.redirect(new URL("/admin/login", request.url).toString(), 302);
      return env.ASSETS.fetch(assetRequest("/admin-home.html", request));
    }
    if (pathname === "/admin/editor") {
      const user = await getAuthenticatedUser(request, env);
      if (!user) return Response.redirect(new URL("/admin/login", request.url).toString(), 302);
      return env.ASSETS.fetch(assetRequest("/editor-v2/index.html", request));
    }
    // Retired entry points must not expose the backing HTML assets directly.
    if (["/admin-design.html", "/admin-login.html", "/admin-home.html", "/admin.html", "/admin/home", "/editor-v2", "/editor-v2/index.html", "/about.html", "/community.html", "/contact.html", "/schedule.html", "/tiktok.html", "/twitch.html", "/vod.html", "/youtube.html"].includes(pathname)) {
      return new Response("Gone", { status: 410 });
    }
    if (pathname === "/" || pathname === "/index.html") return publicPageHtml(request, env, "/", false, { title: site.siteName });
    if (pathname.startsWith("/p/") && pathname.length > 3) {
      let slug: string;
      try {
        slug = decodeURIComponent(pathname.slice(3));
      } catch {
        return publicPageWithStatus(request, env, 404);
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return publicPageWithStatus(request, env, 404);

      const pageUrl = new URL("/api/public/pages", request.url);
      pageUrl.searchParams.set("slug", slug);
      const preview = url.searchParams.get("preview") === "1";
      if (preview) pageUrl.searchParams.set("preview", "1");
      const pageResponse = await publicPagesRoute(new Request(pageUrl, { method: "GET", headers: request.headers }), env, siteId);
      if (pageResponse.status === 404) {
        if (!preview) {
          const targetSlug = await resolvePublishedPageRedirect(env, slug, siteId);
          if (targetSlug) return new Response(null, {
            status: 308,
            headers: {
              Location: `/p/${encodeURIComponent(targetSlug)}${url.search}`,
              "Cache-Control": "private, no-store, max-age=0"
            }
          });
        }
        return publicPageWithStatus(request, env, 404);
      }
      if (pageResponse.status === 401 || pageResponse.status === 403) {
        return publicPageWithStatus(request, env, pageResponse.status);
      }
      if (!pageResponse.ok) {
        return new Response("A közzétett oldal jelenleg nem érhető el.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
        });
      }
      const payload = await pageResponse.json() as { data?: { title?: string; description?: string } };
      return publicPageHtml(request, env, preview ? null : `/p/${encodeURIComponent(slug)}`, preview, payload.data);
    }
    return env.ASSETS.fetch(request);
  }
};
function assetRequest(pathname: string, request: Request): Request { const url = new URL(pathname, request.url); url.search = new URL(request.url).search; return new Request(url.toString(), { method: "GET", headers: request.headers }); }

type PublicPageSeo = { title?: string; description?: string };
const escapeHtml = (value: string): string => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

async function publicPageHtml(request: Request, env: Env, canonicalPath: string | null, noIndex = false, seo?: PublicPageSeo): Promise<Response> {
  const asset = await env.ASSETS.fetch(assetRequest("/visual-page.html", request));
  if (!asset.ok) return asset;
  const canonicalUrl = canonicalPath && !noIndex ? new URL(canonicalPath, request.url).toString() : null;
  const title = seo?.title?.trim() || "Sanci9517";
  const description = seo?.description?.trim() || "";
  let html = (await asset.text()).replace("<title>Sanci9517</title>", `<title>${escapeHtml(title)}</title>`)
    .replace('<meta name="robots" content="index,follow">', noIndex ? '<meta name="robots" content="noindex,nofollow">' : '<meta name="robots" content="index,follow">');
  const headTags = [
    description ? `<meta name="description" content="${escapeHtml(description)}">` : "",
    canonicalUrl ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">` : "",
    canonicalUrl && seo ? `<meta property="og:title" content="${escapeHtml(title)}"><meta property="og:url" content="${escapeHtml(canonicalUrl)}">` : "",
    canonicalUrl && description ? `<meta property="og:description" content="${escapeHtml(description)}">` : ""
  ].join("");
  html = html.replace("</head>", `${headTags}</head>`);
  const headers = new Headers(asset.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  if (noIndex) headers.set("X-Robots-Tag", "noindex, nofollow");
  headers.delete("Content-Length");
  return new Response(html, { status: asset.status, headers });
}

async function publicPageWithStatus(request: Request, env: Env, status: number): Promise<Response> {
  const page = await publicPageHtml(request, env, null, true);
  const headers = new Headers(page.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(page.body, { status, headers });
}
