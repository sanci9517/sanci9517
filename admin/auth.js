const ADMIN_SESSION_KEY = 'admin-session';

export function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
}

export function loginAdmin(username, password) {
  const validUsername = String(username || '').trim();
  const validPassword = String(password || '');

  if (!validUsername || !validPassword) return false;

  // Temporary foundation only. Real authentication will be implemented server-side.
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
  return true;
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
