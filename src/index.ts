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
import type { Env } from "./types/env";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    if (pathname === "/api/health") return healthRoute();
    if (pathname === "/api/db-health") return dbHealthRoute(env);
    if (pathname === "/api/auth/bootstrap") return authBootstrapRoute(request, env);
    if (pathname === "/api/auth/login") return authLoginRoute(request, env);
    if (pathname === "/api/auth/logout") return authLogoutRoute(request, env);
    if (pathname === "/api/auth/session") return authSessionRoute(request, env);
    if (pathname === "/api/admin/settings") return adminSettingsRoute(request, env);
    if (pathname === "/api/admin/schedule") return adminScheduleRoute(request, env);
    if (pathname === "/api/admin/twitch/schedule-sync") return adminTwitchScheduleSyncRoute(request, env);
    if (pathname === "/api/admin/pages") return adminPagesRoute(request, env);
    if (pathname === "/api/admin/navigation") return adminNavigationRoute(request, env);
    if (pathname === "/api/admin/editor") return adminEditorRoute(request, env);
    if (pathname === "/api/public/site-settings") return publicSiteSettingsRoute(env);
    if (pathname === "/api/public/schedule") return publicScheduleRoute(request, env);
    if (pathname === "/api/integrations/twitch/diagnostic") return twitchConfigDiagnosticRoute(request, env);
    if (pathname === "/api/integrations/twitch/connect") return twitchConnectRoute(request, env);
    if (pathname === "/api/integrations/twitch/callback") return twitchCallbackRoute(request, env);
    if (pathname === "/api/integrations/twitch/connection") return twitchConnectionRoute(request, env);
    if (pathname === "/api/integrations/twitch/validation") return twitchValidationRoute(request, env);
    if (pathname === "/api/integrations/twitch/disconnect") return twitchDisconnectRoute(request, env);
    if (pathname === "/api/public/pages") return publicPagesRoute(request, env);
    if (pathname === "/api/public/navigation") return publicNavigationRoute(env);
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
    if (["/admin-login.html", "/admin-home.html", "/admin.html", "/admin/home", "/editor-v2", "/editor-v2/index.html", "/about.html", "/community.html", "/contact.html", "/schedule.html", "/tiktok.html", "/twitch.html", "/vod.html", "/youtube.html"].includes(pathname)) {
      return new Response("Gone", { status: 410 });
    }
    if (pathname === "/" || pathname === "/index.html") return env.ASSETS.fetch(assetRequest("/visual-page.html", request));
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
      const pageResponse = await publicPagesRoute(new Request(pageUrl, { method: "GET", headers: request.headers }), env);
      if (pageResponse.status === 404) {
        if (!preview) {
          const targetSlug = await resolvePublishedPageRedirect(env, slug);
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
      return env.ASSETS.fetch(assetRequest("/visual-page.html", request));
    }
    return env.ASSETS.fetch(request);
  }
};
function assetRequest(pathname: string, request: Request): Request { const url = new URL(pathname, request.url); url.search = new URL(request.url).search; return new Request(url.toString(), { method: "GET", headers: request.headers }); }

async function publicPageWithStatus(request: Request, env: Env, status: number): Promise<Response> {
  const page = await env.ASSETS.fetch(assetRequest("/visual-page.html", request));
  const headers = new Headers(page.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(page.body, { status, headers });
}
