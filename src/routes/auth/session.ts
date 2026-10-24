import { getAuthenticatedUser } from "../../core/auth/require-auth";
import { getSessionToken } from "../../core/auth/session";
import { error, ok } from "../../core/response";
import type { Env } from "../../types/env";

export async function authSessionRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") {
    return error("METHOD_NOT_ALLOWED", 405);
  }

  try {
    const hasSessionCookie = getSessionToken(request) !== null;
    if (!hasSessionCookie) return ok({ authenticated: false, user: null, reason: "COOKIE_MISSING" });
    const user = await getAuthenticatedUser(request, env);

    if (!user) {
      return ok({ authenticated: false, user: null, reason: "SESSION_INVALID" });
    }

    return ok({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }
    });
  } catch {
    return error("SESSION_CHECK_FAILED", 500);
  }
}
