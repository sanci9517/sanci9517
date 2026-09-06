import { apiUrl } from './config.js';

const DEFAULT_TIMEOUT = 10000;

export async function apiFetch(path, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, ...requestOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(apiUrl(path), {
      ...requestOptions,
      headers: {
        accept: 'application/json',
        ...(requestOptions.headers || {}),
      },
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(body?.error || `API request failed: ${response.status}`);
    }

    return body;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get(path, options = {}) {
    return apiFetch(path, { ...options, method: 'GET' });
  },
};
