const ADMIN_TOKEN_TTL_SECONDS = 8 * 60 * 60;
const ADMIN_COOKIE_NAME = '__Host-sanci_admin';

function base64UrlEncode(value) {
  const bytes = value instanceof Uint8Array ? value : new TextEncoder().encode(value);
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

async function signAdminToken(payload, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encodedPayload));
  return `${encodedPayload}.${base64UrlEncode(new Uint8Array(signature))}`;
}

async function verifyAdminToken(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encodedPayload, encodedSignature] = parts;
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.sub !== 'admin' || !Number.isInteger(payload.exp) || payload.exp <= now) return false;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    return await crypto.subtle.verify('HMAC', key, base64UrlDecode(encodedSignature), new TextEncoder().encode(encodedPayload));
  } catch {
    return false;
  }
}

function parseCookies(request) {
  const header = request.headers.get('cookie') || '';
  return Object.fromEntries(header.split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter(([key, value]) => key && value));
}

function createAdminCookie(token) {
  return `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${ADMIN_TOKEN_TTL_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Strict`;
}

export function clearAdminCookie() {
  return `${ADMIN_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`;
}

export async function loginAdminRequest(request, env) {
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD || !env.ADMIN_AUTH_SECRET) return { ok: false, status: 503, error: 'Admin authentication is not configured.' };
  let body;
  try { body = await request.json(); } catch { return { ok: false, status: 400, error: 'Invalid request.' }; }
  const username = String(body?.username || '').trim();
  const password = String(body?.password || '');
  if (!username || !password) return { ok: false, status: 400, error: 'Missing credentials.' };
  if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) return { ok: false, status: 401, error: 'Invalid credentials.', noStore: true };
  const now = Math.floor(Date.now() / 1000);
  const token = await signAdminToken({ sub: 'admin', iat: now, exp: now + ADMIN_TOKEN_TTL_SECONDS }, env.ADMIN_AUTH_SECRET);
  return { ok: true, status: 200, username, token, noStore: true, setCookie: createAdminCookie(token) };
}

export async function isAdminRequestAuthenticated(request, env) {
  const cookies = parseCookies(request);
  const token = cookies[ADMIN_COOKIE_NAME] || '';
  return verifyAdminToken(token, env.ADMIN_AUTH_SECRET);
}
