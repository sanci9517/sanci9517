import type { Env } from "../types/env";
import { decryptTwitchToken, encryptTwitchToken, hashTwitchOAuthState } from "./twitch-crypto";

const AUTHORIZE_URL = "https://id.twitch.tv/oauth2/authorize";
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const VALIDATE_URL = "https://id.twitch.tv/oauth2/validate";
const REVOKE_URL = "https://id.twitch.tv/oauth2/revoke";

export const TWITCH_OAUTH_STATE_TTL_SECONDS = 600;
const TWITCH_VALIDATION_TTL_SECONDS = 3600;
const TWITCH_REFRESH_LOCK_SECONDS = 60;
const TWITCH_REFRESH_WAIT_MS = 250;
const TWITCH_REFRESH_WAIT_ATTEMPTS = 20;

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string[];
};

function requireExpiresIn(value: unknown, errorCode: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(errorCode);
  }
  return value;
}

type ValidateResponse = {
  client_id: string;
  scopes: string[] | null;
  expires_in: number;
  login: string;
  user_id: string;
};

type TwitchConnectionRow = {
  id: string;
  userId: string;
  broadcasterId: string;
  broadcasterLogin: string;
  accessCiphertext: string;
  accessIv: string;
  refreshCiphertext: string;
  refreshIv: string;
  scopesJson: string;
  accessTokenExpiresAt: string;
  status: string;
  lastValidatedAt: string | null;
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

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function readConnection(env: Env, connectionId: string): Promise<TwitchConnectionRow | null> {
  return env.DB.prepare(
    "SELECT id,user_id AS userId,broadcaster_id AS broadcasterId,broadcaster_login AS broadcasterLogin," +
    "access_token_ciphertext AS accessCiphertext,access_token_iv AS accessIv," +
    "refresh_token_ciphertext AS refreshCiphertext,refresh_token_iv AS refreshIv," +
    "scopes_json AS scopesJson,access_token_expires_at AS accessTokenExpiresAt,status," +
    "last_validated_at AS lastValidatedAt FROM twitch_connections WHERE id=? LIMIT 1"
  ).bind(connectionId).first<TwitchConnectionRow>();
}

async function updateValidation(
  env: Env,
  connectionId: string,
  validation: ValidateResponse
): Promise<void> {
  await env.DB.prepare(
    "UPDATE twitch_connections SET broadcaster_login=?,scopes_json=?,access_token_expires_at=?," +
    "last_validated_at=CURRENT_TIMESTAMP,status='connected',updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).bind(
    validation.login,
    JSON.stringify(Array.isArray(validation.scopes) ? validation.scopes : []),
    new Date(Date.now() + validation.expires_in * 1000).toISOString(),
    connectionId
  ).run();
}

export async function createTwitchAuthorizationUrl(request: Request, env: Env, userId: string): Promise<string> {
  const { clientId } = requireConfig(env);
  const state = randomState();
  const stateHash = await hashTwitchOAuthState(state);
  const expiresAt = new Date(Date.now() + TWITCH_OAUTH_STATE_TTL_SECONDS * 1000).toISOString();

  await env.DB.batch([
    env.DB.prepare("DELETE FROM twitch_oauth_states WHERE julianday(expires_at) <= julianday('now')"),
    env.DB.prepare("INSERT INTO twitch_oauth_states (id,user_id,state_hash,expires_at) VALUES (?,?,?,?)")
      .bind(crypto.randomUUID(), userId, stateHash, expiresAt)
  ]);

  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", getTwitchRedirectUri(request));
  url.searchParams.set("scope", "channel:manage:schedule");
  url.searchParams.set("state", state);
  return url.toString();
}

async function validateAccessToken(env: Env, accessToken: string): Promise<ValidateResponse> {
  const response = await fetch(VALIDATE_URL, {
    headers: { Authorization: "OAuth " + accessToken }
  });

  if (response.status === 401) throw new Error("TWITCH_ACCESS_TOKEN_INVALID");
  if (!response.ok) throw new Error("TWITCH_TOKEN_VALIDATION_FAILED");

  const validation = await response.json<ValidateResponse>();
  if (
    typeof validation.client_id !== "string" ||
    typeof validation.user_id !== "string" ||
    typeof validation.login !== "string" ||
    (validation.scopes !== null && !Array.isArray(validation.scopes)) ||
    typeof validation.expires_in !== "number" ||
    !Number.isFinite(validation.expires_in)
  ) {
    throw new Error("TWITCH_TOKEN_VALIDATION_INVALID");
  }
  return validation;
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
    "SELECT id,user_id AS userId FROM twitch_oauth_states " +
    "WHERE state_hash=? AND julianday(expires_at)>julianday('now') AND used_at IS NULL LIMIT 1"
  ).bind(stateHash).first<{ id: string; userId: string }>();

  if (!stateRow || stateRow.userId !== userId) throw new Error("TWITCH_OAUTH_STATE_INVALID");

  const claimed = await env.DB.prepare(
    "UPDATE twitch_oauth_states SET used_at=CURRENT_TIMESTAMP " +
    "WHERE id=? AND user_id=? AND julianday(expires_at)>julianday('now') AND used_at IS NULL"
  ).bind(stateRow.id, userId).run();

  if (claimed.meta.changes !== 1) throw new Error("TWITCH_OAUTH_STATE_INVALID");

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
  if (!token.access_token || !token.refresh_token) {
    throw new Error("TWITCH_TOKEN_RESPONSE_INVALID");
  }
  const expiresIn = requireExpiresIn(token.expires_in, "TWITCH_TOKEN_RESPONSE_INVALID");

  const identity = await validateAccessToken(env, token.access_token);
  if (identity.client_id !== clientId) throw new Error("TWITCH_CLIENT_MISMATCH");

  const access = await encryptTwitchToken(encryptionKey, token.access_token);
  const refresh = await encryptTwitchToken(encryptionKey, token.refresh_token);
  const scopes = Array.isArray(token.scope) ? token.scope : [];
  const existing = await env.DB.prepare("SELECT id FROM twitch_connections WHERE broadcaster_id=? LIMIT 1")
    .bind(identity.user_id).first<{ id: string }>();
  const id = existing?.id ?? crypto.randomUUID();

  await env.DB.prepare(
    "INSERT INTO twitch_connections " +
    "(id,user_id,broadcaster_id,broadcaster_login,access_token_ciphertext,access_token_iv," +
    "refresh_token_ciphertext,refresh_token_iv,scopes_json,access_token_expires_at,status," +
    "last_validated_at,updated_at,refresh_lock_token,refresh_lock_until) " +
    "VALUES (?,?,?,?,?,?,?,?,?,?,'connected',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL,NULL) " +
    "ON CONFLICT(broadcaster_id) DO UPDATE SET " +
    "user_id=excluded.user_id,broadcaster_login=excluded.broadcaster_login," +
    "access_token_ciphertext=excluded.access_token_ciphertext,access_token_iv=excluded.access_token_iv," +
    "refresh_token_ciphertext=excluded.refresh_token_ciphertext,refresh_token_iv=excluded.refresh_token_iv," +
    "scopes_json=excluded.scopes_json,access_token_expires_at=excluded.access_token_expires_at," +
    "status='connected',last_validated_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP," +
    "refresh_lock_token=NULL,refresh_lock_until=NULL"
  ).bind(
    id, userId, identity.user_id, identity.login,
    access.ciphertext, access.iv, refresh.ciphertext, refresh.iv,
    JSON.stringify(scopes),
    new Date(Date.now() + expiresIn * 1000).toISOString()
  ).run();
}

export async function getTwitchConnection(env: Env, userId: string) {
  return env.DB.prepare(
    "SELECT id,broadcaster_id AS broadcasterId,broadcaster_login AS broadcasterLogin," +
    "scopes_json AS scopesJson,access_token_expires_at AS accessTokenExpiresAt,status," +
    "last_validated_at AS lastValidatedAt FROM twitch_connections WHERE user_id=? " +
    "ORDER BY updated_at DESC LIMIT 1"
  ).bind(userId).first<{
    id: string; broadcasterId: string; broadcasterLogin: string; scopesJson: string;
    accessTokenExpiresAt: string; status: string; lastValidatedAt: string | null;
  }>();
}

async function acquireRefreshLock(env: Env, connectionId: string, lockToken: string): Promise<boolean> {
  const lockUntil = new Date(Date.now() + TWITCH_REFRESH_LOCK_SECONDS * 1000).toISOString();
  const result = await env.DB.prepare(
    "UPDATE twitch_connections SET refresh_lock_token=?,refresh_lock_until=? " +
    "WHERE id=? AND status='connected' AND " +
    "(refresh_lock_until IS NULL OR julianday(refresh_lock_until)<=julianday('now'))"
  ).bind(lockToken, lockUntil, connectionId).run();
  return result.meta.changes === 1;
}

async function releaseRefreshLock(env: Env, connectionId: string, lockToken: string): Promise<void> {
  await env.DB.prepare(
    "UPDATE twitch_connections SET refresh_lock_token=NULL,refresh_lock_until=NULL " +
    "WHERE id=? AND refresh_lock_token=?"
  ).bind(connectionId, lockToken).run();
}

export async function refreshTwitchConnection(
  env: Env,
  connectionId: string,
  observedAccessCiphertext?: string
): Promise<string> {
  const { clientId, clientSecret, encryptionKey } = requireConfig(env);
  const lockToken = crypto.randomUUID();

  for (let attempt = 0; attempt < TWITCH_REFRESH_WAIT_ATTEMPTS; attempt++) {
    if (await acquireRefreshLock(env, connectionId, lockToken)) {
      try {
        const row = await readConnection(env, connectionId);
        if (!row || row.status !== "connected") throw new Error("TWITCH_CONNECTION_NOT_FOUND");

        if (observedAccessCiphertext && row.accessCiphertext !== observedAccessCiphertext) {
          return decryptTwitchToken(encryptionKey, row.accessCiphertext, row.accessIv);
        }

        const refreshToken = await decryptTwitchToken(encryptionKey, row.refreshCiphertext, row.refreshIv);
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
          await env.DB.prepare(
            "UPDATE twitch_connections SET status='reauthorization_required',updated_at=CURRENT_TIMESTAMP " +
            "WHERE id=? AND refresh_lock_token=?"
          ).bind(connectionId, lockToken).run();
          throw new Error("TWITCH_REFRESH_FAILED");
        }

        const token = await response.json<TokenResponse>();
        if (!token.access_token || !token.refresh_token) {
          throw new Error("TWITCH_REFRESH_RESPONSE_INVALID");
        }
        const expiresIn = requireExpiresIn(token.expires_in, "TWITCH_REFRESH_RESPONSE_INVALID");
        const access = await encryptTwitchToken(encryptionKey, token.access_token);
        const refresh = await encryptTwitchToken(encryptionKey, token.refresh_token);

        await env.DB.prepare(
          "UPDATE twitch_connections SET access_token_ciphertext=?,access_token_iv=?," +
          "refresh_token_ciphertext=?,refresh_token_iv=?,scopes_json=?,access_token_expires_at=?," +
          "status='connected',updated_at=CURRENT_TIMESTAMP,refresh_lock_token=NULL,refresh_lock_until=NULL " +
          "WHERE id=? AND refresh_lock_token=?"
        ).bind(
          access.ciphertext, access.iv, refresh.ciphertext, refresh.iv,
          JSON.stringify(Array.isArray(token.scope) ? token.scope : []),
          new Date(Date.now() + expiresIn * 1000).toISOString(),
          connectionId, lockToken
        ).run();

        return token.access_token;
      } finally {
        await releaseRefreshLock(env, connectionId, lockToken);
      }
    }

    await sleep(TWITCH_REFRESH_WAIT_MS);
  }

  throw new Error("TWITCH_REFRESH_CONCURRENCY_TIMEOUT");
}

export async function getValidTwitchAccessToken(
  env: Env,
  connectionId: string,
  options: { forceValidation?: boolean } = {}
): Promise<string> {
  const { encryptionKey, clientId } = requireConfig(env);
  let row = await readConnection(env, connectionId);
  if (!row || row.status !== "connected") throw new Error("TWITCH_CONNECTION_NOT_FOUND");

  let accessToken = await decryptTwitchToken(encryptionKey, row.accessCiphertext, row.accessIv);
  const expiresAt = Date.parse(row.accessTokenExpiresAt);
  const lastValidatedAt = row.lastValidatedAt ? Date.parse(row.lastValidatedAt) : 0;
  const now = Date.now();

  if (!options.forceValidation &&
      Number.isFinite(expiresAt) && expiresAt > now + 60_000 &&
      Number.isFinite(lastValidatedAt) && now - lastValidatedAt < TWITCH_VALIDATION_TTL_SECONDS * 1000) {
    return accessToken;
  }

  try {
    const validation = await validateAccessToken(env, accessToken);
    if (validation.client_id !== clientId || validation.user_id !== row.broadcasterId) {
      throw new Error("TWITCH_TOKEN_IDENTITY_MISMATCH");
    }
    await updateValidation(env, connectionId, validation);
    return accessToken;
  } catch (err) {
    if (!(err instanceof Error) || err.message !== "TWITCH_ACCESS_TOKEN_INVALID") throw err;

    accessToken = await refreshTwitchConnection(env, connectionId, row.accessCiphertext);
    row = await readConnection(env, connectionId);
    if (!row || row.status !== "connected") throw new Error("TWITCH_CONNECTION_NOT_FOUND");

    const validation = await validateAccessToken(env, accessToken);
    if (validation.client_id !== clientId || validation.user_id !== row.broadcasterId) {
      throw new Error("TWITCH_TOKEN_IDENTITY_MISMATCH");
    }
    await updateValidation(env, connectionId, validation);
    return accessToken;
  }
}

export async function revokeTwitchConnection(env: Env, connectionId: string): Promise<void> {
  const { clientId, encryptionKey } = requireConfig(env);
  const row = await env.DB.prepare(
    "SELECT access_token_ciphertext AS ciphertext,access_token_iv AS iv FROM twitch_connections WHERE id=? LIMIT 1"
  ).bind(connectionId).first<{ ciphertext: string; iv: string }>();
  if (!row) throw new Error("TWITCH_CONNECTION_NOT_FOUND");

  await env.DB.prepare(
    "UPDATE twitch_connections SET status='revocation_pending',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='connected'"
  ).bind(connectionId).run();

  const token = await decryptTwitchToken(encryptionKey, row.ciphertext, row.iv);
  const response = await fetch(REVOKE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, token })
  });
  if (!response.ok && response.status !== 400) {
    throw new Error("TWITCH_REVOKE_FAILED");
  }

  await env.DB.prepare(
    "UPDATE twitch_connections SET status='revoked',refresh_lock_token=NULL,refresh_lock_until=NULL,updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='revocation_pending'"
  ).bind(connectionId).run();
}
