import { apiUrl } from '../core/config.js';

async function request(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    credentials: 'include',
    cache: 'no-store',
    ...options,
    headers: { accept: 'application/json', ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.error || `Admin backend error (${response.status}).`);
  return data;
}

export async function getAdminSettings() {
  return request('/admin/settings');
}

export async function saveAdminSettings(settings) {
  return request('/admin/settings', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ settings }),
  });
}

export async function getAdminAudit() {
  return request('/admin/audit');
}
