export const navigation = Object.freeze([
  {
    label: 'Főoldal',
    path: '/',
    type: 'route',
  },
  {
    label: 'Twitch',
    urlKey: 'twitch',
    type: 'external',
  },
]);

export function getNavigationRoute(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  return navigation.find((item) => item.type === 'route' && item.path === clean) || null;
}
