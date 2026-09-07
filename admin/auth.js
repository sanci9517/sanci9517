import { apiUrl } from '../core/config.js';

let adminSession = { checked: false, authenticated: false, username: '' };

export function isAdminAuthenticated() {
  return adminSession.authenticated;
}

export function getAdminUser() {
  return adminSession.username;
}

export async function checkAdminSession() {
  try {
    const response = await fetch(apiUrl('/admin/auth/check'), {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    const data = await response.json().catch(() => ({}));
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
    if (!response.ok || !data.ok) {
      adminSession = { checked: true, authenticated: false, username: '' };
      return { ok: false, error: data.error || 'Sikertelen adminisztrációs belépés.' };
    }
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
      headers: { accept: 'application/json' },
    });
  } finally {
    adminSession = { checked: true, authenticated: false, username: '' };
  }
}
