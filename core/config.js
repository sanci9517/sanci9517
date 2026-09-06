export const config = Object.freeze({
  appName: 'Sanci9517',
  apiBaseUrl: '',
  environment: 'production',
});

export function apiUrl(path) {
  const base = config.apiBaseUrl.replace(/\/$/, '');
  const target = String(path).startsWith('/') ? path : `/${path}`;
  return `${base}${target}`;
}
