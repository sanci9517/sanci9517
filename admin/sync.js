import { apiUrl } from '../core/config.js';
import { getAdminAuthorizationHeader } from './auth.js';

const REMOTE_KEYS = new Set(['site-settings', 'navigation-settings-v2', 'page-settings']);
let initialized = false;
let saveQueue = Promise.resolve();

export function initAdminSync() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  window.addEventListener('sanci:storage-changed', (event) => {
    const { key, value } = event.detail || {};
    if (!REMOTE_KEYS.has(key)) return;
    queueSave(key, value);
  });
}

function queueSave(key, value) {
  saveQueue = saveQueue.then(async () => {
    emitStatus({ key, status: 'saving' });
    try {
      const authorization = getAdminAuthorizationHeader();
      const response = await fetch(apiUrl('/admin/settings'), {
        method: 'PUT',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          ...(authorization ? { authorization } : {}),
        },
        body: JSON.stringify({ settings: { [key]: value } }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || `Szervermentési hiba (${response.status}).`);
      }
      emitStatus({ key, status: 'saved' });
    } catch (error) {
      emitStatus({
        key,
        status: 'error',
        error: error instanceof Error ? error.message : 'Ismeretlen szervermentési hiba.',
      });
    }
  }).catch(() => {});

  return saveQueue;
}

function emitStatus(detail) {
  window.dispatchEvent(new CustomEvent('sanci:remote-save', { detail }));
}
