import { adminApi } from './modules/api.js';

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
      // Authentication is centralized in admin/modules/api.js; it supplies getAdminAuthorizationHeader().
      await adminApi.put('/admin/settings', { settings: { [key]: value } });
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
