import { getAuthenticatedUser } from "../../core/auth/require-auth";
import { error, ok } from "../../core/response";
import type { Env } from "../../types/env";

export async function authSessionRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") {
    return error("METHOD_NOT_ALLOWED", 405);
  }

  try {
    const user = await getAuthenticatedUser(request, env);

    if (!user) {
      return ok({ authenticated: false, user: null });
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
