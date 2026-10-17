import type { Env } from "../../types/env";
import { error } from "../response";
import { getAuthenticatedUser, type AuthUser } from "./require-auth";

/** Tenant roles are separate from users.role (the legacy default-site role). */
export type SiteRole = "viewer" | "editor" | "admin";
export type SiteGrant = {
  user: AuthUser;
  siteId: string;
  role: SiteRole;
};

const ROLE_RANK: Record<SiteRole, number> = {
  viewer: 1,
  editor: 2,
  admin: 3
};

export function siteRoleAllows(actual: unknown, required: SiteRole): boolean {
  return typeof actual === "string" &&
    Object.hasOwn(ROLE_RANK, actual) &&
    ROLE_RANK[actual as SiteRole] >= ROLE_RANK[required];
}

/**
 * Server-only site authorization, deliberately fail-closed.
 * - siteId must be resolved from the trusted request host; never from headers,
 *   request bodies, or a query parameter.
 * - No implicit membership for admins, or for the default site.
 * - This must only be wired to live routes after 0026 is installed and its
 *   default-site compatibility seed is verified.
 */
export async function requireSiteGrant(
  request: Request,
  env: Env,
  siteId: string,
  requiredRole: SiteRole
): Promise<SiteGrant | Response> {
  if (typeof siteId !== "string" || !siteId.trim()) {
    return error("SITE_CONTEXT_INVALID", 403, "A webhely nem azonosítható.");
  }

  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");

  let row: { role: unknown } | null;
  try {
    row = await env.DB.prepare(`
      SELECT m.role
      FROM site_memberships m
      INNER JOIN sites s ON s.id = m.site_id
      INNER JOIN users u ON u.id = m.user_id
      WHERE m.user_id = ? AND m.site_id = ?
        AND m.status = 'active'
        AND s.status = 'active'
        AND u.is_active = 1
      LIMIT 1
    `).bind(user.id, siteId).first<{ role: unknown }>();
  } catch {
    // Missing/pending schema or a D1 error must never grant access.
    return error("SITE_ACCESS_UNAVAILABLE", 503, "A webhely hozzáférése nem ellenőrizhető.");
  }

  if (!siteRoleAllows(row?.role, requiredRole)) {
    return error("SITE_ACCESS_DENIED", 403, "Nincs megfelelő jogosultság ezen a webhelyen.");
  }

  return { user, siteId, role: row!.role as SiteRole };
}
