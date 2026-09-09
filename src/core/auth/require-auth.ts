import type { Env } from "../../types/env";
import { getSessionToken, hashSessionToken } from "./session";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "editor" | "viewer";
};

export async function getAuthenticatedUser(
  request: Request,
  env: Env
): Promise<AuthUser | null> {
  const token = getSessionToken(request);
  if (!token) return null;

  const tokenHash = await hashSessionToken(token);
  const row = await env.DB.prepare(
    `SELECT
       u.id,
       u.email,
       u.display_name AS displayName,
       u.role
     FROM sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?
       AND s.expires_at > CURRENT_TIMESTAMP
       AND u.is_active = 1
     LIMIT 1`
  )
    .bind(tokenHash)
    .first<AuthUser>();

  if (!row) return null;

  return row;
}

export async function requireAuthenticatedUser(
  request: Request,
  env: Env
): Promise<AuthUser | Response> {
  const user = await getAuthenticatedUser(request, env);

  if (!user) {
    return Response.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  return user;
}

export function hasRole(user: AuthUser, minimumRole: AuthUser["role"]): boolean {
  const rank: Record<AuthUser["role"], number> = {
    viewer: 1,
    editor: 2,
    admin: 3
  };

  return rank[user.role] >= rank[minimumRole];
}
