export const pages = Object.freeze([
  {
    id: 'home',
    path: '/',
    title: 'Főoldal',
    status: 'active',
    menu: true,
  },
  {
    id: 'twitch',
    path: '/twitch',
    title: 'Twitch',
    status: 'planned',
    menu: false,
  },
  {
    id: 'streams',
    path: '/adasok',
    title: 'Adások',
    status: 'planned',
    menu: false,
  },
  {
    id: 'clips',
    path: '/klipek',
    title: 'Klipek',
    status: 'planned',
    menu: false,
  },
  {
    id: 'about',
    path: '/bemutatkozas',
    title: 'Bemutatkozás',
    status: 'planned',
    menu: false,
  },
  {
    id: 'stats',
    path: '/statisztikak',
    title: 'Statisztikák',
    status: 'planned',
    menu: false,
  },
  {
    id: 'schedule',
    path: '/menetrend',
    title: 'Menetrend',
    status: 'planned',
    menu: false,
  },
  {
    id: 'discord',
    path: '/discord',
    title: 'Discord',
    status: 'planned',
    menu: false,
  },
]);

export function getPageById(id) {
  return pages.find((page) => page.id === id) || null;
}

export function getPageByPath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  return pages.find((page) => page.path === clean) || null;
}

export function getMenuPages() {
  return pages.filter((page) => page.menu && page.status === 'active');
}
