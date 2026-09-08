import { apiUrl } from '../core/config.js';

const ADMIN_TOKEN_KEY = 'sanci9517:admin-session-token';
let adminSession = { checked: false, authenticated: false, username: '' };
let fetchInterceptorInstalled = false;

function getAdminToken() {
  try { return sessionStorage.getItem(ADMIN_TOKEN_KEY) || ''; } catch { return ''; }
}

function setAdminToken(token) {
  try {
    if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch { /* Session storage may be unavailable. */ }
}

function authHeaders(extra = {}) {
  const token = getAdminToken();
  return token ? { ...extra, authorization: `Bearer ${token}` } : extra;
}

function installAdminFetchInterceptor() {
  if (fetchInterceptorInstalled || typeof window === 'undefined') return;
  const originalFetch = window.fetch.bind(window);
  const apiPrefix = apiUrl('/');
  window.fetch = (input, init = {}) => {
    const token = getAdminToken();
    const url = typeof input === 'string' ? input : input?.url || '';
    if (!token || !url.startsWith(apiPrefix)) return originalFetch(input, init);
    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    headers.set('Authorization', `Bearer ${token}`);
    return originalFetch(input, { ...init, headers });
  };
  fetchInterceptorInstalled = true;
}

export function isAdminAuthenticated() {
  return adminSession.authenticated;
}

export function getAdminUser() {
  return adminSession.username;
}

export function getAdminAuthorizationHeader() {
  const token = getAdminToken();
  return token ? `Bearer ${token}` : '';
}

export async function checkAdminSession() {
  installAdminFetchInterceptor();
  try {
    const response = await fetch(apiUrl('/admin/auth/check'), {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: authHeaders({ accept: 'application/json' }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.authenticated) setAdminToken('');
    adminSession = {
      checked: true,
      authenticated: Boolean(response.ok && data.authenticated),
      username: String(data.username || adminSession.username || ''),
    };
    return adminSession;
  } catch {
    adminSession = { checked: true, authenticated: false, username: '' };
    return adminSession;
  }
}

export async function loginAdmin(username, password) {
  const validUsername = String(username || '').trim();
  const validPassword = String(password || '');
  if (!validUsername || !validPassword) return { ok: false, error: 'Hiányzó belépési adatok.' };

  try {
    const response = await fetch(apiUrl('/admin/auth/login'), {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ username: validUsername, password: validPassword }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok || !data.token) {
      adminSession = { checked: true, authenticated: false, username: '' };
      return { ok: false, error: data.error || 'Sikertelen adminisztrációs belépés.' };
    }
    setAdminToken(data.token);
    installAdminFetchInterceptor();
    adminSession = { checked: true, authenticated: true, username: data.username || validUsername };
    return { ok: true, username: adminSession.username };
  } catch {
    adminSession = { checked: true, authenticated: false, username: '' };
    return { ok: false, error: 'Az admin hitelesítési szolgáltatás nem érhető el.' };
  }
}

export async function logoutAdmin() {
  try {
    await fetch(apiUrl('/admin/auth/logout'), {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: authHeaders({ accept: 'application/json' }),
    });
  } finally {
    setAdminToken('');
    adminSession = { checked: true, authenticated: false, username: '' };
  }
}
