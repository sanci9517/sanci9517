import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const requiredFiles = [
  'index.html', '404.html', 'admin.html', 'core/app.js', 'core/device.js', 'core/router.js', 'core/api.js', 'core/config.js', 'core/storage.js', 'core/ui.js',
  'core/site-state.js', 'core/page-state.js', 'core/navigation-state.js', 'data/site.js', 'data/navigation.js', 'data/pages.js',
  'pages/home.js', 'pages/generic.js', 'components/header.js', 'components/navigation.js', 'components/card.js',
  'admin/entry.js', 'admin/index.js', 'admin/dashboard.js', 'admin/auth.js', 'admin/backend.js', 'admin/backend-auth.js', 'admin/sync.js', 'admin/website/index.js',
  'admin/modules/api.js', 'admin/modules/platform.js', 'admin/modules/registry.js', 'admin/modules/tests.js',
  'integrations/index.js', 'integrations/registry.js', 'integrations/tiktok/client.js', 'schemas/integration-state.schema.json',
  'styles/tokens.css', 'styles/base.css', 'styles/components.css', 'styles/navigation.css',
  'styles/admin.css', 'schemas/site.schema.json', 'schemas/page.schema.json', 'schemas/menu.schema.json',
  'worker/src/index.js', 'worker/src/http.js', 'worker/src/auth.js', 'worker/src/admin.js',
  'worker/src/routes/index.js', 'worker/src/routes/auth.js', 'worker/src/routes/admin.js', 'worker/src/routes/health.js', 'worker/src/routes/public.js', 'worker/src/routes/twitch.js', 'worker/src/routes/youtube.js',
  'worker/migrations/0001_initial.sql', 'worker/wrangler.jsonc', 'twitch/status.js', 'youtube/status.js',
];
const obsoleteFiles = ['admin/website/layout-enhancer.js'];
const jsFiles = requiredFiles.filter((file) => file.endsWith('.js'));
const jsonFiles = ['schemas/site.schema.json', 'schemas/page.schema.json', 'schemas/menu.schema.json', 'schemas/integration-state.schema.json', 'worker/wrangler.jsonc'];
const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length) { console.error(`Missing required files:\n${missing.map((file) => `- ${file}`).join('\n')}`); process.exit(1); }
const stale = obsoleteFiles.filter((file) => existsSync(file));
if (stale.length) { console.error(`Obsolete files must be removed:\n${stale.map((file) => `- ${file}`).join('\n')}`); process.exit(1); }
for (const file of jsFiles) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
for (const file of jsonFiles) {
  try { JSON.parse(readFileSync(file, 'utf8').replace(/^\/\/.*$/gm, '')); }
  catch (error) { console.error(`Invalid JSON: ${file}`); console.error(error.message); process.exit(1); }
}

const worker = readFileSync('worker/src/index.js', 'utf8');
const routes = readFileSync('worker/src/routes/index.js', 'utf8');
const routeAuth = readFileSync('worker/src/routes/auth.js', 'utf8');
const workerAuth = readFileSync('worker/src/auth.js', 'utf8');
const workerAdmin = readFileSync('worker/src/admin.js', 'utf8');
const registry = readFileSync('integrations/registry.js', 'utf8');
const pageState = readFileSync('core/page-state.js', 'utf8');
const navigationState = readFileSync('core/navigation-state.js', 'utf8');
const pageData = readFileSync('data/pages.js', 'utf8');
const navigationData = readFileSync('data/navigation.js', 'utf8');
const config = readFileSync('core/config.js', 'utf8');
const router = readFileSync('core/router.js', 'utf8');
const app = readFileSync('core/app.js', 'utf8');
const device = readFileSync('core/device.js', 'utf8');
const navigation = readFileSync('components/navigation.js', 'utf8');
const auth = readFileSync('admin/auth.js', 'utf8');
const adminBackendAuth = readFileSync('admin/backend-auth.js', 'utf8');
const admin = readFileSync('admin/index.js', 'utf8');
const entry = readFileSync('admin/entry.js', 'utf8');
const dashboard = readFileSync('admin/dashboard.js', 'utf8');
const adminWebsite = readFileSync('admin/website/index.js', 'utf8');
const adminApi = readFileSync('admin/modules/api.js', 'utf8');
const adminSync = readFileSync('admin/sync.js', 'utf8');
const platform = readFileSync('admin/modules/platform.js', 'utf8');
const tests = readFileSync('admin/modules/tests.js', 'utf8');
const storage = readFileSync('core/storage.js', 'utf8');
const index = readFileSync('index.html', 'utf8');
const fallback = readFileSync('404.html', 'utf8');
const adminPage = readFileSync('admin.html', 'utf8');
const baseCss = readFileSync('styles/base.css', 'utf8');
const componentCss = readFileSync('styles/components.css', 'utf8');
const navigationCss = readFileSync('styles/navigation.css', 'utf8');
const wrangler = readFileSync('worker/wrangler.jsonc', 'utf8');

for (const route of ['/health', '/health/storage', '/integrations/status', '/twitch/status', '/twitch/channel', '/twitch/statistics', '/twitch/videos', '/twitch/clips', '/twitch/data', '/youtube/channel', '/youtube/videos', '/youtube/live', '/admin/auth/login', '/admin/auth/check', '/admin/auth/logout', '/admin/settings', '/admin/audit', '/site-state']) {
  if (!routes.includes(`url.pathname === '${route}'`)) { console.error(`Missing worker route: ${route}`); process.exit(1); }
}
for (const platformName of ['twitch', 'youtube', 'tiktok']) {
  if (!registry.includes(`${platformName}: Object.freeze`)) { console.error(`Missing integration registry platform: ${platformName}`); process.exit(1); }
}
if (!worker.includes("from './routes/index.js'") || !worker.includes('createRouteDispatcher')) { console.error('Worker entry must delegate requests to the modular route dispatcher.'); process.exit(1); }
for (const moduleName of ['./auth.js', './admin.js', './health.js', './public.js', './twitch.js', './youtube.js']) {
  if (!routes.includes(`from '${moduleName}'`)) { console.error(`Worker route dispatcher must use isolated module: ${moduleName}`); process.exit(1); }
}
if (!routeAuth.includes('token: result.token')) { console.error('Worker login route must return the short-lived session bearer.'); process.exit(1); }
if (!routes.includes('handleAdminLogin') || !routes.includes('handleAdminLogout') || !routes.includes('handleAdminAuthCheck')) { console.error('Worker route dispatcher must expose isolated admin auth handlers.'); process.exit(1); }

if (!/basePath:\s*['"]\/sanci9517['"]/.test(config)) { console.error('Missing configured GitHub Pages basePath.'); process.exit(1); }
if (!/apiBaseUrl:\s*['"]https:\/\/sanci9517-api\.sandor-bogadi95\.workers\.dev['"]/.test(config)) { console.error('Frontend API must point to the production Cloudflare Worker.'); process.exit(1); }
if (!/["']name["']\s*:\s*["']sanci9517-api["']/.test(wrangler)) { console.error('Cloudflare Worker name mismatch.'); process.exit(1); }
if (!wrangler.includes('5a4a5e96-fdad-421a-a33c-143daaf33e98') || !wrangler.includes('9f0f691c10a34b8381f3ff07a032fc4a')) { console.error('Cloudflare D1/KV bindings mismatch.'); process.exit(1); }
if (!router.includes('config.basePath')) { console.error('Router must use config.basePath for site paths.'); process.exit(1); }
if (!app.includes('config.basePath')) { console.error('App route resolution must use config.basePath.'); process.exit(1); }
if (!navigation.includes('config.basePath')) { console.error('Navigation route resolution must use config.basePath.'); process.exit(1); }
if (!app.includes("from './device.js'") || !app.includes('initDeviceClass()')) { console.error('Public app must initialize the mobile-device fallback.'); process.exit(1); }
if (!device.includes('maxTouchPoints') || !device.includes('mobile-device') || !device.includes('userAgentData')) { console.error('Mobile-device fallback detection is incomplete.'); process.exit(1); }
if (!navigation.includes('admin.html') || !navigation.includes('Admin belépés')) { console.error('Public menu must expose the protected Admin entry point.'); process.exit(1); }
if (app.includes('../admin/index.js') || app.includes("registerRoute('/admin'")) { console.error('Public runtime must never import or register the private admin runtime.'); process.exit(1); }
if (adminWebsite.includes("from '../../core/router.js'") || adminWebsite.includes("navigate('/admin'")) { console.error('Private Control Center must not depend on public SPA routing.'); process.exit(1); }
if (!auth.includes('sessionStorage') || !auth.includes('ADMIN_TOKEN_KEY') || !auth.includes('Bearer')) { console.error('Admin session bearer transport is missing.'); process.exit(1); }
if (!auth.includes('fetchInterceptorInstalled') || !auth.includes('installAdminFetchInterceptor')) { console.error('Admin API authentication interceptor is missing.'); process.exit(1); }
if (!adminBackendAuth.includes('getAdminAuthorizationHeader') || !adminBackendAuth.includes('authorization')) { console.error('Bearer-aware admin backend client is missing.'); process.exit(1); }
if (!adminApi.includes('getAdminAuthorizationHeader') || !adminApi.includes('adminApiFetch')) { console.error('Admin modules must use the isolated authenticated API client.'); process.exit(1); }
if (!platform.includes("from './api.js'") || !tests.includes("from './api.js'")) { console.error('Admin platform and Test Center must use the isolated API boundary.'); process.exit(1); }
if (!platform.includes('/youtube/videos') || !platform.includes('/youtube/live')) { console.error('Admin platform module must expose the modular YouTube content endpoints.'); process.exit(1); }
if (!tests.includes('/youtube/videos') || !tests.includes('/youtube/live')) { console.error('Test Center must verify the modular YouTube content endpoints.'); process.exit(1); }
if (!adminSync.includes('sanci:storage-changed') || !adminSync.includes('/admin/settings') || !adminSync.includes('getAdminAuthorizationHeader')) { console.error('Admin remote synchronization must live inside the admin boundary.'); process.exit(1); }
if (!admin.includes("from './sync.js'") || !admin.includes('initAdminSync()')) { console.error('Admin entry must initialize the isolated synchronization module.'); process.exit(1); }
if (!entry.includes('renderAdmin(root)')) { console.error('Admin page must use the isolated admin entry module.'); process.exit(1); }
if (!adminPage.includes('admin/entry.js')) { console.error('admin.html must load the isolated admin entry module.'); process.exit(1); }
if (!dashboard.includes('await logoutAdmin()')) { console.error('Admin logout must invalidate the server session.'); process.exit(1); }
if (!workerAuth.includes("crypto.subtle.verify('HMAC'") || !workerAuth.includes('HttpOnly') || !workerAuth.includes('SameSite=None')) { console.error('Admin authentication must use verified signed tokens and secure cookies.'); process.exit(1); }
if (!workerAuth.includes('getBearerToken') || !workerAuth.includes('Bearer')) { console.error('Worker must accept the session bearer token.'); process.exit(1); }
if (!workerAuth.includes("const ADMIN_COOKIE_NAME = '__Host-sanci_admin'")) { console.error('Admin cookie must use a host-prefixed secure cookie name.'); process.exit(1); }
if (!workerAuth.includes('ADMIN_LOGIN_MAX_FAILURES') || !workerAuth.includes('expirationTtl')) { console.error('Admin login must use KV-backed brute-force rate limiting.'); process.exit(1); }
const http = readFileSync('worker/src/http.js', 'utf8');
if (!http.includes('access-control-allow-credentials') || !http.includes('vary')) { console.error('Worker CORS must allow credentialed requests and vary by Origin.'); process.exit(1); }
if (!workerAdmin.includes('isAllowedAdminOrigin') || !workerAdmin.includes('authenticate')) { console.error('Admin backend must enforce origin and server authentication checks.'); process.exit(1); }
if (!storage.includes('sanci:storage-changed') || storage.includes('remoteSaveQueue') || storage.includes('/admin/settings')) { console.error('Core storage must not contain admin remote-save logic.'); process.exit(1); }
if (!storage.includes('hydratePublicStorage')) { console.error('Core storage must retain public state hydration.'); process.exit(1); }
if (!app.includes('await hydratePublicStorage()')) { console.error('Public app boot must hydrate published state before rendering.'); process.exit(1); }
if (index.includes('admin/website/layout-enhancer.js') || fallback.includes('admin/website/layout-enhancer.js')) { console.error('Admin-only layout enhancer must never be loaded by public pages.'); process.exit(1); }
if (pageData.includes("path: '/admin'") || navigationData.includes("path: '/admin'") || !pageState.includes('RESERVED_PUBLIC_PATHS') || !navigationState.includes('RESERVED_PUBLIC_PATHS')) { console.error('Private admin path must not exist in the public page/navigation model.'); process.exit(1); }
if (!pageState.includes('RESERVED_PUBLIC_PATHS.has(path)') || !navigationState.includes('RESERVED_PUBLIC_PATHS.has(normalized.path)')) { console.error('Public state normalization must reject private admin paths.'); process.exit(1); }
if (!baseCss.includes('@media (max-width: 760px)') || !componentCss.includes('@media (max-width: 760px)') || !navigationCss.includes('@media (max-width: 760px)')) { console.error('Responsive public layout is missing the protected mobile breakpoint.'); process.exit(1); }
if (!baseCss.includes('@media (min-width: 761px)') || !componentCss.includes('@media (min-width: 761px)')) { console.error('Desktop-only layout rules are missing.'); process.exit(1); }
if (!index.includes('html.mobile-device .page-blocks') || !index.includes('html.mobile-device .home-hero')) { console.error('Public HTML is missing the desktop-site mobile fallback styles.'); process.exit(1); }
for (const script of ['core/block-layout.js', 'core/app.js']) {
  if (!index.includes(script) || !fallback.includes(script)) { console.error(`GitHub Pages public bootstrap mismatch: ${script}`); process.exit(1); }
}
console.log(`Validation passed: ${requiredFiles.length} required files, modular Worker route boundary, isolated public storage, isolated admin API/auth/sync boundaries, integration registry/schema, YouTube content/live endpoints, private-route isolation, mobile-device desktop-site fallback, responsive desktop/mobile breakpoints, GitHub Pages bootstrap, production API endpoint, Cloudflare Worker/D1/KV bindings, secure admin authentication, CORS, login rate limiting, D1 admin backend, and public state hydration checks passed.`);