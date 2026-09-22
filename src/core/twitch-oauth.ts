import type { Env } from "../types/env";
import { decryptTwitchToken, encryptTwitchToken, hashTwitchOAuthState } from "./twitch-crypto";

const AUTHORIZE_URL = "https://id.twitch.tv/oauth2/authorize";
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const VALIDATE_URL = "https://id.twitch.tv/oauth2/validate";
const REVOKE_URL = "https://id.twitch.tv/oauth2/revoke";

export const TWITCH_OAUTH_STATE_TTL_SECONDS = 600;

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string[];
};

type ValidateResponse = {
  client_id: string;
  scopes: string[];
  expires_in: number;
  login: string;
  user_id: string;
};

function requireConfig(env: Env) {
  if (!env.TWITCH_CLIENT_ID || !env.TWITCH_CLIENT_SECRET || !env.TWITCH_TOKEN_ENCRYPTION_KEY) {
    throw new Error("TWITCH_INTEGRATION_NOT_CONFIGURED");
  }
  return {
    clientId: env.TWITCH_CLIENT_ID,
    clientSecret: env.TWITCH_CLIENT_SECRET,
    encryptionKey: env.TWITCH_TOKEN_ENCRYPTION_KEY
  };
}

export function getTwitchRedirectUri(request: Request): string {
  return new URL("/api/integrations/twitch/callback", request.url).toString();
}

function randomState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function createTwitchAuthorizationUrl(request: Request, env: Env, userId: string): Promise<string> {
  const { clientId } = requireConfig(env);
  const state = randomState();
  const stateHash = await hashTwitchOAuthState(state);
  const expiresAt = new Date(Date.now() + TWITCH_OAUTH_STATE_TTL_SECONDS * 1000).toISOString();

  await env.DB.batch([
    env.DB.prepare("DELETE FROM twitch_oauth_states WHERE expires_at <= CURRENT_TIMESTAMP"),
    env.DB.prepare("INSERT INTO twitch_oauth_states (id,user_id,state_hash,expires_at) VALUES (?,?,?,?)")
      .bind(crypto.randomUUID(), userId, stateHash, expiresAt)
  ]);

  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", getTwitchRedirectUri(request));
  url.searchParams.set("scope", "");
  url.searchParams.set("state", state);
  return url.toString();
}

async function validateAccessToken(env: Env, accessToken: string): Promise<ValidateResponse> {
  const response = await fetch(VALIDATE_URL, {
    headers: { Authorization: "OAuth " + accessToken }
  });
  if (!response.ok) throw new Error("TWITCH_ACCESS_TOKEN_INVALID");
  return response.json<ValidateResponse>();
}

export async function exchangeTwitchCode(
  request: Request,
  env: Env,
  code: string,
  state: string,
  userId: string
): Promise<void> {
  const { clientId, clientSecret, encryptionKey } = requireConfig(env);
  const stateHash = await hashTwitchOAuthState(state);
  const stateRow = await env.DB.prepare(
    "SELECT id,user_id FROM twitch_oauth_states WHERE state_hash=? AND expires_at>CURRENT_TIMESTAMP AND used_at IS NULL LIMIT 1"
  ).bind(stateHash).first<{ id: string; user_id: string }>();

  if (!stateRow || stateRow.user_id !== userId) throw new Error("TWITCH_OAUTH_STATE_INVALID");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: getTwitchRedirectUri(request)
    })
  });
  if (!response.ok) throw new Error("TWITCH_TOKEN_EXCHANGE_FAILED");

  const token = await response.json<TokenResponse>();
  if (!token.access_token || !token.refresh_token || !Number.isFinite(token.expires_in)) {
    throw new Error("TWITCH_TOKEN_RESPONSE_INVALID");
  }

  const identity = await validateAccessToken(env, token.access_token);
  if (identity.client_id !== clientId) throw new Error("TWITCH_CLIENT_MISMATCH");

  const access = await encryptTwitchToken(encryptionKey, token.access_token);
  const refresh = await encryptTwitchToken(encryptionKey, token.refresh_token);
  const scopes = Array.isArray(token.scope) ? token.scope : [];
  const existing = await env.DB.prepare("SELECT id FROM twitch_connections WHERE broadcaster_id=? LIMIT 1")
    .bind(identity.user_id).first<{ id: string }>();
  const id = existing?.id ?? crypto.randomUUID();

  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO twitch_connections (id,user_id,broadcaster_id,broadcaster_login,access_token_ciphertext,access_token_iv,refresh_token_ciphertext,refresh_token_iv,scopes_json,access_token_expires_at,status,last_validated_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,'connected',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) " +
      "ON CONFLICT(broadcaster_id) DO UPDATE SET user_id=excluded.user_id,broadcaster_login=excluded.broadcaster_login,access_token_ciphertext=excluded.access_token_ciphertext,access_token_iv=excluded.access_token_iv,refresh_token_ciphertext=excluded.refresh_token_ciphertext,refresh_token_iv=excluded.refresh_token_iv,scopes_json=excluded.scopes_json,access_token_expires_at=excluded.access_token_expires_at,status='connected',last_validated_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP"
    ).bind(
      id, userId, identity.user_id, identity.login,
      access.ciphertext, access.iv, refresh.ciphertext, refresh.iv,
      JSON.stringify(scopes),
      new Date(Date.now() + (token.expires_in as number) * 1000).toISOString()
    ),
    env.DB.prepare("UPDATE twitch_oauth_states SET used_at=CURRENT_TIMESTAMP WHERE id=?").bind(stateRow.id)
  ]);
}

export async function getTwitchConnection(env: Env, userId: string) {
  return env.DB.prepare(
    "SELECT id,broadcaster_id AS broadcasterId,broadcaster_login AS broadcasterLogin,scopes_json AS scopesJson,access_token_expires_at AS accessTokenExpiresAt,status,last_validated_at AS lastValidatedAt FROM twitch_connections WHERE user_id=? ORDER BY updated_at DESC LIMIT 1"
  ).bind(userId).first<{
    id: string; broadcasterId: string; broadcasterLogin: string; scopesJson: string;
    accessTokenExpiresAt: string; status: string; lastValidatedAt: string | null;
  }>();
}

export async function refreshTwitchConnection(env: Env, connectionId: string): Promise<string> {
  const { clientId, clientSecret, encryptionKey } = requireConfig(env);
  const row = await env.DB.prepare(
    "SELECT refresh_token_ciphertext AS ciphertext,refresh_token_iv AS iv FROM twitch_connections WHERE id=? AND status='connected' LIMIT 1"
  ).bind(connectionId).first<{ ciphertext: string; iv: string }>();
  if (!row) throw new Error("TWITCH_CONNECTION_NOT_FOUND");

  const refreshToken = await decryptTwitchToken(encryptionKey, row.ciphertext, row.iv);
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });
  if (!response.ok) {
    await env.DB.prepare("UPDATE twitch_connections SET status='reauthorization_required',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(connectionId).run();
    throw new Error("TWITCH_REFRESH_FAILED");
  }

  const token = await response.json<TokenResponse>();
  if (!token.access_token || !token.refresh_token || !Number.isFinite(token.expires_in)) {
    throw new Error("TWITCH_REFRESH_RESPONSE_INVALID");
  }
  const expiresIn = token.expires_in;

  const access = await encryptTwitchToken(encryptionKey, token.access_token);
  const refresh = await encryptTwitchToken(encryptionKey, token.refresh_token);
  await env.DB.prepare(
    "UPDATE twitch_connections SET access_token_ciphertext=?,access_token_iv=?,refresh_token_ciphertext=?,refresh_token_iv=?,scopes_json=?,access_token_expires_at=?,status='connected',updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).bind(
    access.ciphertext, access.iv, refresh.ciphertext, refresh.iv,
    JSON.stringify(Array.isArray(token.scope) ? token.scope : []),
    new Date(Date.now() + expiresIn * 1000).toISOString(), connectionId
  ).run();

  return token.access_token;
}

export async function revokeTwitchConnection(env: Env, connectionId: string): Promise<void> {
  const { clientId, encryptionKey } = requireConfig(env);
  const row = await env.DB.prepare(
    "SELECT access_token_ciphertext AS ciphertext,access_token_iv AS iv FROM twitch_connections WHERE id=? LIMIT 1"
  ).bind(connectionId).first<{ ciphertext: string; iv: string }>();
  if (!row) throw new Error("TWITCH_CONNECTION_NOT_FOUND");

  const token = await decryptTwitchToken(encryptionKey, row.ciphertext, row.iv);
  const response = await fetch(REVOKE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, token })
  });
  if (!response.ok && response.status !== 400) throw new Error("TWITCH_REVOKE_FAILED");

  await env.DB.prepare("UPDATE twitch_connections SET status='revoked',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(connectionId).run();
}
