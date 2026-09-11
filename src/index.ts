import { dbHealthRoute } from "./routes/db-health";
import { authBootstrapRoute } from "./routes/auth/bootstrap";
import { authLoginRoute } from "./routes/auth/login";
import { authLogoutRoute } from "./routes/auth/logout";
import { authSessionRoute } from "./routes/auth/session";
import { adminSettingsRoute } from "./routes/admin/settings";
import { adminScheduleRoute } from "./routes/admin/schedule";
import { adminPagesRoute } from "./routes/admin/pages";
import { publicSiteSettingsRoute } from "./routes/public/site-settings";
import { publicScheduleRoute } from "./routes/public/schedule";
import { publicPagesRoute } from "./routes/public/pages";
import { getAuthenticatedUser } from "./core/auth/require-auth";
import { healthRoute } from "./routes/health";
import type { Env } from "./types/env";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") return healthRoute();
    if (url.pathname === "/api/db-health") return dbHealthRoute(env);
    if (url.pathname === "/api/auth/bootstrap") return authBootstrapRoute(request, env);
    if (url.pathname === "/api/auth/login") return authLoginRoute(request, env);
    if (url.pathname === "/api/auth/logout") return authLogoutRoute(request, env);
    if (url.pathname === "/api/auth/session") return authSessionRoute(request, env);
    if (url.pathname === "/api/admin/settings") return adminSettingsRoute(request, env);
    if (url.pathname === "/api/admin/schedule") return adminScheduleRoute(request, env);
    if (url.pathname === "/api/admin/pages") return adminPagesRoute(request, env);
    if (url.pathname === "/api/public/site-settings") return publicSiteSettingsRoute(env);
    if (url.pathname === "/api/public/schedule") return publicScheduleRoute(env);
    if (url.pathname === "/api/public/pages") return publicPagesRoute(request, env);

    if (url.pathname === "/admin/login" || url.pathname === "/admin-login.html") {
      return env.ASSETS.fetch(assetRequest("/admin-login.html", request));
    }

    if (url.pathname === "/admin" || url.pathname === "/admin.html") {
      const user = await getAuthenticatedUser(request, env);
      if (!user) {
        return Response.redirect(new URL("/admin/login", request.url).toString(), 302);
      }
      return env.ASSETS.fetch(assetRequest("/admin.html", request));
    }

    if (url.pathname.startsWith("/p/") && url.pathname.length > 3) {
      return env.ASSETS.fetch(assetRequest("/page.html", request));
    }

    // Keep the two common homepage entry points on exactly the same asset.
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return env.ASSETS.fetch(assetRequest("/index.html", request));
    }

    return env.ASSETS.fetch(request);
  }
};

function assetRequest(pathname: string, request: Request): Request {
  const url = new URL(pathname, request.url);
  return new Request(url.toString(), {
    method: "GET",
    headers: request.headers
  });
}
