import { apiUrl } from '../core/config.js';

const ADMIN_TOKEN_KEY = 'sanci-admin-token';
const ADMIN_USER_KEY = 'sanci-admin-user';

export function isAdminAuthenticated() {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  return Boolean(token);
}

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

export function getAdminUser() {
  return sessionStorage.getItem(ADMIN_USER_KEY) || '';
}

export async function loginAdmin(username, password) {
  const validUsername = String(username || '').trim();
  const validPassword = String(password || '');
  if (!validUsername || !validPassword) return { ok: false, error: 'Hiányzó belépési adatok.' };

  try {
    const response = await fetch(apiUrl('/admin/auth/login'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: validUsername, password: validPassword }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.token) {
      clearAdminSession();
      return { ok: false, error: data.error || 'Sikertelen adminisztrációs belépés.' };
    }

    sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    sessionStorage.setItem(ADMIN_USER_KEY, data.username || validUsername);
    return { ok: true, username: data.username || validUsername };
  } catch {
    clearAdminSession();
    return { ok: false, error: 'Az admin hitelesítési szolgáltatás nem érhető el.' };
  }
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
}

export function logoutAdmin() {
  clearAdminSession();
}
