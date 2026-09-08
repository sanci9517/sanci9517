export const navigation = Object.freeze([
  {
    label: 'Főoldal',
    path: '/',
    type: 'route',
  },
  {
    label: 'Adások',
    path: '/adasok',
    type: 'route',
  },
  {
    label: 'Klipek',
    path: '/klipek',
    type: 'route',
  },
  {
    label: 'Bemutatkozás',
    path: '/bemutatkozas',
    type: 'route',
  },
  {
    label: 'Statisztikák',
    path: '/statisztikak',
    type: 'route',
  },
  {
    label: 'Menetrend',
    path: '/menetrend',
    type: 'route',
  },
  {
    label: 'Discord',
    path: '/discord',
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
