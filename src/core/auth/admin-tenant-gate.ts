import type { Env } from "../../types/env";
import { requireSiteGrant, type SiteRole } from "./site-access";

/**
 * Transitional enforcement at the central Worker ingress.
 *
 * Only enable SITE_MEMBERSHIP_ENFORCEMENT after 0026 has been installed and
 * existing default-site sessions/users have been verified. Nondefault Admin
 * routes still have the independent 403 boundary in src/index.ts; this gate
 * does NOT make them available.
 *
 * No role or site identity comes from a client-controlled X-Site-ID header.
 */
export function requiredSiteRole(pathname: string, url: URL): SiteRole | null {
  if (pathname === "/admin") return "viewer";
  if (pathname === "/admin/editor" || pathname === "/admin/media") return "editor";
  if (pathname.startsWith("/api/admin/")) {
    if (pathname === "/api/admin/settings") return "admin";
    return "editor";
  }
  if (url.searchParams.get("preview") === "1" &&
      (pathname === "/api/public/pages" || pathname.startsWith("/p/"))) {
    return "editor";
  }
  return null;
}

export async function enforceAdminTenantGate(
  request: Request,
  env: Env,
  siteId: string,
  pathname: string
): Promise<Response | null> {
  if (env.SITE_MEMBERSHIP_ENFORCEMENT !== "enabled") return null;
  const required = requiredSiteRole(pathname, new URL(request.url));
  if (!required) return null;
  const granted = await requireSiteGrant(request, env, siteId, required);
  if (granted instanceof Response) {
    // Keep the browser's existing login redirect behavior for HTML Admin pages.
    if (granted.status === 401 && (pathname === "/admin" || pathname === "/admin/editor" || pathname === "/admin/media")) {
      return Response.redirect(new URL("/admin/login", request.url).toString(), 302);
    }
    return granted;
  }
  return null;
}
