const TWITCH_AUTHORIZE_URL = 'https://id.twitch.tv/oauth2/authorize';
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const TWITCH_VALIDATE_URL = 'https://id.twitch.tv/oauth2/validate';
const STATE_TTL_SECONDS = 10 * 60;
const TOKEN_ROW_ID = 'primary';
const REQUIRED_SCOPES = ['channel:manage:broadcast'];

function base64UrlEncode(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function encryptionKey(secret) {
  if (!secret) throw new Error('Twitch token encryption is not configured.');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function encryptValue(value, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(secret);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(value));
  return `${base64UrlEncode(iv)}.${base64UrlEncode(new Uint8Array(ciphertext))}`;
}

async function decryptValue(value, secret) {
  const [ivPart, ciphertextPart] = String(value || '').split('.');
  if (!ivPart || !ciphertextPart) throw new Error('Invalid encrypted Twitch token.');
  const key = await encryptionKey(secret);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64UrlDecode(ivPart) }, key, base64UrlDecode(ciphertextPart));
  return new TextDecoder().decode(plaintext);
}

function redirectUri(env) {
  return env.TWITCH_REDIRECT_URI || 'https://sanci9517-api.sandor-bogadi95.workers.dev/twitch/oauth/callback';
}

function adminOrigin(env) {
  return env.PUBLIC_ORIGIN || 'https://sanci9517.github.io';
}

function configured(env) {
  return Boolean(env.TWITCH_CLIENT_ID && env.TWITCH_CLIENT_SECRET && env.TWITCH_TOKEN_ENCRYPTION_KEY);
}

async function requireAdmin(request, env, isAdminRequestAuthenticated) {
  return isAdminRequestAuthenticated(request, env);
}

export async function twitchOAuthStart(request, env, json, isAdminRequestAuthenticated) {
  if (!(await requireAdmin(request, env, isAdminRequestAuthenticated))) return json({ ok: false, error: 'Unauthorized.' }, 401, { 'cache-control': 'no-store' }, request, env);
  if (!configured(env)) return json({ ok: false, error: 'Twitch OAuth is not configured.' }, 503, { 'cache-control': 'no-store' }, request, env);
  const stateBytes = crypto.getRandomValues(new Uint8Array(32));
  const state = base64UrlEncode(stateBytes);
  await env.CACHE.put(`twitch-oauth-state:${state}`, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: STATE_TTL_SECONDS });
  const params = new URLSearchParams({
    client_id: env.TWITCH_CLIENT_ID,
    redirect_uri: redirectUri(env),
    response_type: 'code',
    scope: REQUIRED_SCOPES.join(' '),
    state,
    force_verify: 'true',
  });
  return json({ ok: true, authorizationUrl: `${TWITCH_AUTHORIZE_URL}?${params.toString()}` }, 200, { 'cache-control': 'no-store' }, request, env);
}

export async function twitchOAuthCallback(request, env) {
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';
  if (!state || !env.CACHE) return new Response('Invalid Twitch OAuth state.', { status: 400 });
  const stateKey = `twitch-oauth-state:${state}`;
  const storedState = await env.CACHE.get(stateKey);
  await env.CACHE.delete(stateKey);
  if (!storedState) return new Response('Twitch OAuth state expired or invalid.', { status: 400 });
  const error = url.searchParams.get('error');
  if (error) return Response.redirect(`${adminOrigin(env)}/admin/?twitch=error&reason=${encodeURIComponent(error)}`, 302);
  const code = url.searchParams.get('code') || '';
  if (!code || !configured(env)) return new Response('Twitch OAuth configuration is incomplete.', { status: 503 });

  const body = new URLSearchParams({ client_id: env.TWITCH_CLIENT_ID, client_secret: env.TWITCH_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: redirectUri(env) });
  const tokenResponse = await fetch(TWITCH_TOKEN_URL, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body });
  if (!tokenResponse.ok) return new Response('Twitch token exchange failed.', { status: 502 });
  const token = await tokenResponse.json();
  if (!token.access_token || !token.refresh_token) return new Response('Twitch did not return the required tokens.', { status: 502 });

  const validateResponse = await fetch(TWITCH_VALIDATE_URL, { headers: { authorization: `Bearer ${token.access_token}` } });
  if (!validateResponse.ok) return new Response('Twitch token validation failed.', { status: 502 });
  const identity = await validateResponse.json();
  const scopes = Array.isArray(token.scope) ? token.scope : [];
  if (!REQUIRED_SCOPES.every((scope) => scopes.includes(scope))) return new Response('The required Twitch permission was not granted.', { status: 403 });

  const accessTokenCiphertext = await encryptValue(token.access_token, env.TWITCH_TOKEN_ENCRYPTION_KEY);
  const refreshTokenCiphertext = await encryptValue(token.refresh_token, env.TWITCH_TOKEN_ENCRYPTION_KEY);
  const expiresAt = new Date(Date.now() + Number(token.expires_in || 0) * 1000).toISOString();
  await env.DB.prepare(`INSERT INTO twitch_oauth_tokens (id, twitch_user_id, twitch_login, twitch_display_name, access_token_ciphertext, refresh_token_ciphertext, scopes_json, expires_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET twitch_user_id=excluded.twitch_user_id, twitch_login=excluded.twitch_login, twitch_display_name=excluded.twitch_display_name, access_token_ciphertext=excluded.access_token_ciphertext, refresh_token_ciphertext=excluded.refresh_token_ciphertext, scopes_json=excluded.scopes_json, expires_at=excluded.expires_at, updated_at=CURRENT_TIMESTAMP`).bind(TOKEN_ROW_ID, identity.user_id, identity.login, identity.login, accessTokenCiphertext, refreshTokenCiphertext, JSON.stringify(scopes), expiresAt).run();
  return Response.redirect(`${adminOrigin(env)}/admin/?twitch=connected`, 302);
}

export async function twitchOAuthStatus(request, env, json, isAdminRequestAuthenticated) {
  if (!(await requireAdmin(request, env, isAdminRequestAuthenticated))) return json({ ok: false, error: 'Unauthorized.' }, 401, { 'cache-control': 'no-store' }, request, env);
  const row = await env.DB.prepare('SELECT twitch_user_id, twitch_login, twitch_display_name, scopes_json, expires_at, updated_at FROM twitch_oauth_tokens WHERE id = ?').bind(TOKEN_ROW_ID).first();
  return json({ ok: true, configured: configured(env), connected: Boolean(row), account: row ? { userId: row.twitch_user_id, login: row.twitch_login, displayName: row.twitch_display_name, scopes: JSON.parse(row.scopes_json || '[]'), expiresAt: row.expires_at, updatedAt: row.updated_at } : null }, 200, { 'cache-control': 'no-store' }, request, env);
}

export async function getStoredTwitchUserToken(env) {
  const row = await env.DB.prepare('SELECT * FROM twitch_oauth_tokens WHERE id = ?').bind(TOKEN_ROW_ID).first();
  if (!row) return null;
  return { ...row, accessToken: await decryptValue(row.access_token_ciphertext, env.TWITCH_TOKEN_ENCRYPTION_KEY), refreshToken: await decryptValue(row.refresh_token_ciphertext, env.TWITCH_TOKEN_ENCRYPTION_KEY), scopes: JSON.parse(row.scopes_json || '[]') };
}
