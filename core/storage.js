const PREFIX = 'sanci9517:';
const REMOTE_KEYS = new Set(['site-settings', 'navigation-settings-v2', 'page-settings']);

export const storage = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(PREFIX + key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      if (REMOTE_KEYS.has(key)) queueRemoteAdminSave(key, value);
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch {
      return false;
    }
  },
};

function queueRemoteAdminSave(key, value) {
  if (typeof window === 'undefined' || !document?.body?.dataset?.adminAuthenticated) return;
  const settings = { [key]: value };
  const apiBase = window.SANCI_API_BASE || '';
  fetch(`${apiBase}/admin/settings`, {
    method: 'PUT',
    credentials: 'include',
    cache: 'no-store',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ settings }),
  }).catch(() => {});
}

export function hydrateAdminStorage(settings) {
  if (!settings || typeof settings !== 'object') return;
  for (const key of REMOTE_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(settings, key)) continue;
    try { localStorage.setItem(PREFIX + key, JSON.stringify(settings[key])); } catch {}
  }
}
