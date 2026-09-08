import { apiUrl } from './config.js';

const PREFIX = 'sanci9517:';
const PUBLIC_REMOTE_KEYS = new Set(['site-settings', 'navigation-settings-v2', 'page-settings']);

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
      if (PUBLIC_REMOTE_KEYS.has(key) && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sanci:storage-changed', { detail: { key, value } }));
      }
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

function writeRemoteSettings(settings) {
  for (const key of PUBLIC_REMOTE_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(settings, key)) continue;
    try { localStorage.setItem(PREFIX + key, JSON.stringify(settings[key])); } catch {}
  }
}

export function hydrateAdminStorage(settings) {
  if (!settings || typeof settings !== 'object') return;
  writeRemoteSettings(settings);
}

export async function hydratePublicStorage() {
  try {
    const response = await fetch(apiUrl('/site-state'), { method: 'GET', cache: 'no-store', headers: { accept: 'application/json' } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) throw new Error(data.error || `Site state request failed: ${response.status}`);
    writeRemoteSettings(data.settings || {});
    return true;
  } catch (error) {
    console.warn('[Sanci9517] Public site state hydration failed; using local/default state:', error);
    return false;
  }
}
