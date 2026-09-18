import { dbHealthRoute } from "./routes/db-health";
import { healthRoute } from "./routes/health";
import { authBootstrapRoute } from "./routes/auth/bootstrap";
import { authLoginRoute } from "./routes/auth/login";
import { authLogoutRoute } from "./routes/auth/logout";
import { authSessionRoute } from "./routes/auth/session";
import { adminSettingsRoute } from "./routes/admin/settings";
import { adminScheduleRoute } from "./routes/admin/schedule";
import { adminPagesRoute } from "./routes/admin/pages";
import { adminSystemPagesRoute } from "./routes/admin/system-pages";
import { adminEditorRoute } from "./routes/admin/editor";
import { publicSiteSettingsRoute } from "./routes/public/site-settings";
import { publicScheduleRoute } from "./routes/public/schedule";
import { publicPagesRoute } from "./routes/public/pages";
import { publicSystemPagesRoute } from "./routes/public/system-pages";
import { getAuthenticatedUser } from "./core/auth/require-auth";
import type { Env } from "./types/env";

const LEGACY_REDIRECTS: Record<string, string> = {
  "/about.html": "/p/about",
  "/community.html": "/p/community",
  "/contact.html": "/p/contact",
  "/schedule.html": "/p/schedule",
  "/tiktok.html": "/p/tiktok",
  "/twitch.html": "/p/twitch",
  "/vod.html": "/p/vod",
  "/youtube.html": "/p/youtube",
};

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
    if (pathname === "/api/admin/pages") return adminPagesRoute(request, env);
    if (pathname === "/api/admin/system-pages") return adminSystemPagesRoute(request, env);
    if (pathname === "/api/admin/editor") return adminEditorRoute(request, env);
    if (pathname === "/api/public/site-settings") return publicSiteSettingsRoute(env);
    if (pathname === "/api/public/schedule") return publicScheduleRoute(env);
    if (pathname === "/api/public/pages") return publicPagesRoute(request, env);
    if (pathname === "/api/public/system-pages") return publicSystemPagesRoute(request, env);
    if (pathname === "/admin/login" || pathname === "/admin-login.html") return env.ASSETS.fetch(assetRequest("/admin-login.html", request));
    if (pathname === "/admin" || pathname === "/admin.html") {
      const user = await getAuthenticatedUser(request, env);
      if (!user) return Response.redirect(new URL("/admin/login", request.url).toString(), 302);
      return env.ASSETS.fetch(assetRequest("/admin.html", request));
    }
    if (pathname === "/admin/editor") {
      const user = await getAuthenticatedUser(request, env);
      if (!user) return Response.redirect(new URL("/admin/login", request.url).toString(), 302);
      return env.ASSETS.fetch(assetRequest("/editor-v2/index.html", request));
    }
    const legacyTarget = LEGACY_REDIRECTS[pathname];
    if (legacyTarget) return Response.redirect(new URL(legacyTarget, request.url).toString(), 301);
    if (pathname === "/" || pathname === "/index.html") return env.ASSETS.fetch(assetRequest("/visual-page.html", request));
    if (pathname.startsWith("/p/") && pathname.length > 3) return env.ASSETS.fetch(assetRequest("/visual-page.html", request));
    const asset = await env.ASSETS.fetch(request);
    return injectSystemRuntime(asset);
  }
};
function assetRequest(pathname: string, request: Request): Request { const url = new URL(pathname, request.url); url.search = new URL(request.url).search; return new Request(url.toString(), { method: "GET", headers: request.headers }); }
async function injectSystemRuntime(response: Response): Promise<Response> { const type=response.headers.get("content-type")||""; if(!type.includes("text/html"))return response; const html=await response.text(); if(html.includes('/assets/system-page-runtime.js'))return new Response(html,{status:response.status,headers:response.headers}); const out=html.replace('</body>','<script src="/assets/system-page-runtime.js"></script></body>'); const headers=new Headers(response.headers); headers.delete('content-length'); return new Response(out,{status:response.status,statusText:response.statusText,headers}); }
