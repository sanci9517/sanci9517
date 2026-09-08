import { apiUrl } from '../../core/config.js';
import { getAdminAuthorizationHeader } from '../auth.js';

const DEFAULT_TIMEOUT = 10000;

export async function adminApiFetch(path, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, ...requestOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const authorization = getAdminAuthorizationHeader();

  try {
    const response = await fetch(apiUrl(path), {
      credentials: 'include',
      cache: 'no-store',
      ...requestOptions,
      headers: {
        accept: 'application/json',
        ...(authorization ? { authorization } : {}),
        ...(requestOptions.headers || {}),
      },
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok || data?.ok === false) {
      throw new Error(data?.error || `Admin API hiba (${response.status}).`);
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

export const adminApi = Object.freeze({
  get(path, options = {}) {
    return adminApiFetch(path, { ...options, method: 'GET' });
  },
  put(path, body, options = {}) {
    return adminApiFetch(path, {
      ...options,
      method: 'PUT',
      headers: { 'content-type': 'application/json', ...(options.headers || {}) },
      body: JSON.stringify(body),
    });
  },
});
