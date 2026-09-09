import { clearSessionCookie, getSessionToken, hashSessionToken } from "../../core/auth/session";
import { ok, error } from "../../core/response";
import type { Env } from "../../types/env";

export async function authLogoutRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return error("METHOD_NOT_ALLOWED", 405);
  }

  const token = getSessionToken(request);
  if (token) {
    const tokenHash = await hashSessionToken(token);
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
  }

  const response = ok({ loggedOut: true });
  response.headers.set("Set-Cookie", clearSessionCookie());
  return response;
}
