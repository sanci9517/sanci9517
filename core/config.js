export const config = Object.freeze({
  appName: 'Sanci9517',
  basePath: '/sanci9517',
  apiBaseUrl: '',
  environment: 'production',
});

export function apiUrl(path) {
  const base = config.apiBaseUrl.replace(/\/$/, '');
  const target = String(path).startsWith('/') ? path : `/${path}`;
  return `${base}${target}`;
}

export function siteUrl(path = '/') {
  const clean = String(path || '/').replace(/^\/+/, '');
  return clean ? `${config.basePath}/${clean}` : `${config.basePath}/`;
}
