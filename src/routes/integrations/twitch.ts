import { error, ok } from "../../core/response";
import { getAuthenticatedUser, requireAuthenticatedUser } from "../../core/auth/require-auth";
import { auditStatement } from "../../core/audit";
import {
  createTwitchAuthorizationUrl,
  exchangeTwitchCode,
  getTwitchConnection,
  getValidTwitchAccessToken,
  revokeTwitchConnection
} from "../../core/twitch-oauth";
import type { Env } from "../../types/env";
import { getCanonicalSiteContext } from "../../core/site-context.ts";
import { hashTwitchOAuthState } from "../../core/twitch-crypto.ts";
import { assertTwitchConnectionOwnership, getOwnedTwitchConnection } from "../../core/twitch-site-ownership.ts";

function redirect(request: Request, status: string): Response {
  const url = new URL("/admin/editor", request.url);
  url.searchParams.set("twitch", status);
  return Response.redirect(url.toString(), 303);
}

export async function twitchConfigDiagnosticRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return error("METHOD_NOT_ALLOWED", 405);
  const auth = await requireAuthenticatedUser(request, env);
  if (auth instanceof Response) return auth;
  return ok({
    TWITCH_CLIENT_ID: Boolean(env.TWITCH_CLIENT_ID),
    TWITCH_CLIENT_SECRET: Boolean(env.TWITCH_CLIENT_SECRET),
    TWITCH_TOKEN_ENCRYPTION_KEY: Boolean(env.TWITCH_TOKEN_ENCRYPTION_KEY)
  });
}

export async function twitchConnectRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return error("METHOD_NOT_ALLOWED", 405);
  const user = await getAuthenticatedUser(request, env);
  if (!user) return Response.redirect(new URL("/admin/login", request.url).toString(), 302);

  try {
    const { siteId } = getCanonicalSiteContext();
    const target = await createTwitchAuthorizationUrl(request, env, user.id, siteId);
    return Response.redirect(target, 302);
  } catch (err) {
    if (err instanceof Error && err.message === "TWITCH_INTEGRATION_NOT_CONFIGURED") {
      return error("TWITCH_INTEGRATION_NOT_CONFIGURED", 503);
    }
    return error("TWITCH_OAUTH_START_FAILED", 500);
  }
}

export async function twitchCallbackRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return error("METHOD_NOT_ALLOWED", 405);
  const user = await getAuthenticatedUser(request, env);
  if (!user) return Response.redirect(new URL("/admin/login", request.url).toString(), 302);

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) return redirect(request, "denied");
  if (!code || !state) return redirect(request, "invalid");

  const { siteId } = getCanonicalSiteContext();
  try {
    const stateHash = await hashTwitchOAuthState(state);
    const stateOwnership = await env.DB.prepare(
      "SELECT id FROM twitch_oauth_states WHERE state_hash=? AND user_id=? AND site_id=? " +
      "AND julianday(expires_at)>julianday('now') AND used_at IS NULL LIMIT 1"
    ).bind(stateHash, user.id, siteId).first<{ id: string }>();
    if (!stateOwnership) throw new Error("TWITCH_OAUTH_STATE_INVALID");
    const connectionId = await exchangeTwitchCode(request, env, code, state, user.id, siteId);
    if (!(await assertTwitchConnectionOwnership(env, siteId, user.id, connectionId))) {
      throw new Error("TWITCH_CONNECTION_SITE_BIND_FAILED");
    }
    const connection = await getOwnedTwitchConnection(env, siteId, user.id);
    if (connection) {
      await env.DB.prepare("INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) VALUES (?,?,?,?,?,?)")
        .bind(crypto.randomUUID(), user.id, "integration.twitch.connect", "twitch_connection", connection.id, JSON.stringify({ broadcasterId: connection.broadcasterId }))
        .run();
    }
    return redirect(request, "connected");
  } catch (err) {
    const codeName = err instanceof Error ? err.message : "TWITCH_OAUTH_UNKNOWN";
    const status = codeName === "TWITCH_OAUTH_STATE_INVALID" ? "invalid" : "error";
    const target = new URL("/admin/editor", request.url);
    target.searchParams.set("twitch", status);
    target.searchParams.set("code", codeName);
    return Response.redirect(target.toString(), 303);
  }
}

export async function twitchConnectionRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return error("METHOD_NOT_ALLOWED", 405);
  const auth = await requireAuthenticatedUser(request, env);
  if (auth instanceof Response) return auth;

  const { siteId } = getCanonicalSiteContext();
  const owned = await getOwnedTwitchConnection(env, siteId, auth.id);
  if (!owned) return ok({ connected: false });
  const connection = await getTwitchConnection(env, auth.id, siteId);
  if (!connection || connection.id !== owned.id) return ok({ connected: false });
  let scopes: string[] = [];
  try { scopes = JSON.parse(connection.scopesJson); } catch {}
  return ok({
    connected: connection.status === "connected",
    status: connection.status,
    broadcaster: { id: connection.broadcasterId, login: connection.broadcasterLogin },
    scopes,
    accessTokenExpiresAt: connection.accessTokenExpiresAt,
    lastValidatedAt: connection.lastValidatedAt
  });
}

export async function twitchValidationRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return error("METHOD_NOT_ALLOWED", 405);
  const auth = await requireAuthenticatedUser(request, env);
  if (auth instanceof Response) return auth;

  const { siteId } = getCanonicalSiteContext();
  const owned = await getOwnedTwitchConnection(env, siteId, auth.id);
  if (!owned) return error("TWITCH_CONNECTION_NOT_FOUND", 404);
  const connection = await getTwitchConnection(env, auth.id, siteId);
  if (!connection || connection.id !== owned.id) return error("TWITCH_CONNECTION_NOT_FOUND", 404);

  try {
    if (!(await assertTwitchConnectionOwnership(env, siteId, auth.id, connection.id))) return error("TWITCH_CONNECTION_NOT_FOUND", 404);
    await getValidTwitchAccessToken(env, siteId, auth.id, connection.id, { forceValidation: true });
    const refreshedOwned = await getOwnedTwitchConnection(env, siteId, auth.id);
    const refreshed = refreshedOwned ? await getTwitchConnection(env, auth.id, siteId) : null;
    if (refreshed && refreshed.id !== refreshedOwned?.id) return error("TWITCH_CONNECTION_NOT_FOUND", 404);
    if (!refreshed) return error("TWITCH_CONNECTION_NOT_FOUND", 404);

    return ok({
      valid: true,
      status: refreshed.status,
      broadcaster: { id: refreshed.broadcasterId, login: refreshed.broadcasterLogin },
      accessTokenExpiresAt: refreshed.accessTokenExpiresAt,
      lastValidatedAt: refreshed.lastValidatedAt
    });
  } catch (err) {
    if (!(err instanceof Error)) return error("TWITCH_TOKEN_VALIDATION_FAILED", 502);
    switch (err.message) {
      case "TWITCH_CONNECTION_NOT_FOUND":
        return error("TWITCH_CONNECTION_NOT_FOUND", 404);
      case "TWITCH_ACCESS_TOKEN_INVALID":
        return error("TWITCH_ACCESS_TOKEN_INVALID", 401);
      case "TWITCH_REFRESH_FAILED":
        return error("TWITCH_REAUTHORIZATION_REQUIRED", 401);
      case "TWITCH_TOKEN_IDENTITY_MISMATCH":
        return error("TWITCH_TOKEN_IDENTITY_MISMATCH", 502);
      case "TWITCH_INTEGRATION_NOT_CONFIGURED":
        return error("TWITCH_INTEGRATION_NOT_CONFIGURED", 503);
      default:
        return error("TWITCH_TOKEN_VALIDATION_FAILED", 502);
    }
  }
}

export async function twitchDisconnectRoute(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return error("METHOD_NOT_ALLOWED", 405);
  const auth = await requireAuthenticatedUser(request, env);
  if (auth instanceof Response) return auth;

  const { siteId } = getCanonicalSiteContext();
  const connection = await getOwnedTwitchConnection(env, siteId, auth.id);
  if (!connection) return ok({ disconnected: true });

  try {
    if (!(await assertTwitchConnectionOwnership(env, siteId, auth.id, connection.id))) return error("TWITCH_CONNECTION_NOT_FOUND", 404);
    await revokeTwitchConnection(env, siteId, auth.id, connection.id);
    await env.DB.batch([
      auditStatement(env, auth.id, "integration.twitch.disconnect", "twitch_connection", connection.id, {})
    ]);
    return ok({ disconnected: true });
  } catch {
    return error("TWITCH_DISCONNECT_FAILED", 502);
  }
}
