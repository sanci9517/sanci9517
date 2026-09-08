import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const requiredFiles = [
  'index.html', '404.html', 'admin.html', 'core/app.js', 'core/router.js', 'core/api.js', 'core/config.js', 'core/storage.js', 'core/ui.js',
  'core/site-state.js', 'core/page-state.js', 'core/navigation-state.js', 'data/site.js', 'data/navigation.js', 'data/pages.js',
  'pages/home.js', 'pages/generic.js', 'components/header.js', 'components/navigation.js', 'components/card.js',
  'admin/entry.js', 'admin/index.js', 'admin/dashboard.js', 'admin/auth.js', 'admin/backend.js', 'admin/website/index.js',
  'integrations/index.js', 'integrations/registry.js', 'integrations/tiktok/client.js', 'schemas/integration-state.schema.json',
  'styles/tokens.css', 'styles/base.css', 'styles/components.css', 'styles/navigation.css',
  'styles/admin.css', 'schemas/site.schema.json', 'schemas/page.schema.json', 'schemas/menu.schema.json',
  'worker/src/index.js', 'worker/src/auth.js', 'worker/src/admin.js', 'worker/migrations/0001_initial.sql', 'worker/wrangler.jsonc',
  'twitch/status.js', 'youtube/status.js',
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
const workerAuth = readFileSync('worker/src/auth.js', 'utf8');
const workerAdmin = readFileSync('worker/src/admin.js', 'utf8');
const registry = readFileSync('integrations/registry.js', 'utf8');
const pageState = readFileSync('core/page-state.js', 'utf8');
const navigationState = readFileSync('core/navigation-state.js', 'utf8');
const pageData = readFileSync('data/pages.js', 'utf8');
const navigationData = readFileSync('data/navigation.js', 'utf8');
for (const route of ['/health', '/health/storage', '/integrations/status', '/twitch/status', '/twitch/channel', '/twitch/statistics', '/twitch/videos', '/twitch/clips', '/twitch/data', '/youtube/channel', '/admin/auth/login', '/admin/auth/check', '/admin/auth/logout', '/admin/settings', '/admin/audit', '/site-state']) {
  if (!worker.includes(`url.pathname === '${route}'`)) { console.error(`Missing worker route: ${route}`); process.exit(1); }
}
for (const platform of ['twitch', 'youtube', 'tiktok']) {
  if (!registry.includes(`${platform}: Object.freeze`)) { console.error(`Missing integration registry platform: ${platform}`); process.exit(1); }
  if (!worker.includes(`${platform}: {`)) { console.error(`Missing worker integration platform: ${platform}`); process.exit(1); }
}

const config = readFileSync('core/config.js', 'utf8');
const router = readFileSync('core/router.js', 'utf8');
const app = readFileSync('core/app.js', 'utf8');
const navigation = readFileSync('components/navigation.js', 'utf8');
const auth = readFileSync('admin/auth.js', 'utf8');
const admin = readFileSync('admin/index.js', 'utf8');
const entry = readFileSync('admin/entry.js', 'utf8');
const dashboard = readFileSync('admin/dashboard.js', 'utf8');
const adminWebsite = readFileSync('admin/website/index.js', 'utf8');
const storage = readFileSync('core/storage.js', 'utf8');
const index = readFileSync('index.html', 'utf8');
const fallback = readFileSync('404.html', 'utf8');
const adminPage = readFileSync('admin.html', 'utf8');
const baseCss = readFileSync('styles/base.css', 'utf8');
const componentCss = readFileSync('styles/components.css', 'utf8');
const navigationCss = readFileSync('styles/navigation.css', 'utf8');
const wrangler = readFileSync('worker/wrangler.jsonc', 'utf8');

if (!/basePath:\s*['"]\/sanci9517['"]/.test(config)) { console.error('Missing configured GitHub Pages basePath.'); process.exit(1); }
if (!/apiBaseUrl:\s*['"]https:\/\/sanci9517-api\.sandor-bogadi95\.workers\.dev['"]/.test(config)) { console.error('Frontend API must point to the production Cloudflare Worker.'); process.exit(1); }
if (!/name:\s*['"]sanci9517-api['"]/.test(wrangler)) { console.error('Cloudflare Worker name mismatch.'); process.exit(1); }
if (!wrangler.includes('5a4a5e96-fdad-421a-a33c-143daaf33e98') || !wrangler.includes('9f0f691c10a34b8381f3ff07a032fc4a')) { console.error('Cloudflare D1/KV bindings mismatch.'); process.exit(1); }
if (!router.includes('config.basePath')) { console.error('Router must use config.basePath for site paths.'); process.exit(1); }
if (!app.includes('config.basePath')) { console.error('App route resolution must use config.basePath.'); process.exit(1); }
if (!navigation.includes('config.basePath')) { console.error('Navigation route resolution must use config.basePath.'); process.exit(1); }
if (app.includes("../admin/index.js") || app.includes("registerRoute('/admin'")) { console.error('Public runtime must never import or register the private admin runtime.'); process.exit(1); }
if (adminWebsite.includes("from '../../core/router.js'") || adminWebsite.includes("navigate('/admin'")) { console.error('Private Control Center must not depend on public SPA routing.'); process.exit(1); }
if (auth.includes('sessionStorage') || auth.includes('localStorage') || auth.includes('ADMIN_TOKEN_KEY') || auth.includes('Bearer')) { console.error('Admin token must not be stored or sent from client-side JavaScript.'); process.exit(1); }
if (!auth.includes("credentials: 'include'") || !auth.includes("/admin/auth/login") || !auth.includes("/admin/auth/check") || !auth.includes("/admin/auth/logout")) { console.error('Admin client must use cookie-backed server sessions.'); process.exit(1); }
if (!admin.includes('checkAdminSession().then')) { console.error('Admin entry must check the server session before rendering the dashboard.'); process.exit(1); }
if (!entry.includes("renderAdmin(root)")) { console.error('Admin page must use the isolated admin entry module.'); process.exit(1); }
if (!adminPage.includes('admin/entry.js')) { console.error('admin.html must load the isolated admin entry module.'); process.exit(1); }
if (!dashboard.includes('await logoutAdmin()')) { console.error('Admin logout must invalidate the server session.'); process.exit(1); }
if (!worker.includes("import { clearAdminCookie, isAdminRequestAuthenticated, loginAdminRequest } from './auth.js'")) { console.error('Worker must use the isolated admin authentication module.'); process.exit(1); }
if (!workerAuth.includes("crypto.subtle.verify('HMAC'") || !workerAuth.includes('HttpOnly') || !workerAuth.includes('SameSite=None')) { console.error('Cross-origin admin authentication must use verified signed tokens in secure HttpOnly cookies.'); process.exit(1); }
if (!workerAuth.includes("const ADMIN_COOKIE_NAME = '__Host-sanci_admin'")) { console.error('Admin cookie must use a host-prefixed secure cookie name.'); process.exit(1); }
if (!workerAuth.includes('ADMIN_LOGIN_MAX_FAILURES') || !workerAuth.includes('expirationTtl')) { console.error('Admin login must use KV-backed brute-force rate limiting.'); process.exit(1); }
if (!worker.includes('access-control-allow-credentials')) { console.error('Worker CORS must allow credentialed admin requests.'); process.exit(1); }
if (!worker.includes('vary')) { console.error('Worker CORS must vary by Origin.'); process.exit(1); }
if (!workerAdmin.includes('isAllowedAdminOrigin') || !workerAdmin.includes('authenticate')) { console.error('Admin backend must enforce origin and server authentication checks.'); process.exit(1); }
if (!storage.includes('remoteSaveQueue') || !storage.includes("sanci:remote-save") || !storage.includes('hydratePublicStorage')) { console.error('Storage must support serialized admin saves and public remote hydration.'); process.exit(1); }
if (!app.includes('await hydratePublicStorage()')) { console.error('Public app boot must hydrate published state before rendering.'); process.exit(1); }
if (index.includes('admin/website/layout-enhancer.js') || fallback.includes('admin/website/layout-enhancer.js')) { console.error('Admin-only layout enhancer must never be loaded by public pages.'); process.exit(1); }
if (pageData.includes("path: '/admin'") || navigationData.includes("path: '/admin'") || pageState.includes("RESERVED_PUBLIC_PATHS") === false || navigationState.includes("RESERVED_PUBLIC_PATHS") === false) { console.error('Private admin path must not exist in the public page/navigation model.'); process.exit(1); }
if (pageState.includes("RESERVED_PUBLIC_PATHS.has(path)") === false || navigationState.includes("RESERVED_PUBLIC_PATHS.has(normalized.path)") === false) { console.error('Public state normalization must reject private admin paths.'); process.exit(1); }
if (!baseCss.includes('@media (max-width: 760px)') || !componentCss.includes('@media (max-width: 760px)') || !navigationCss.includes('@media (max-width: 760px)')) { console.error('Responsive public layout is missing the protected mobile breakpoint.'); process.exit(1); }
if (!baseCss.includes('@media (min-width: 761px)') || !componentCss.includes('@media (min-width: 761px)')) { console.error('Desktop-only layout rules are missing.'); process.exit(1); }

for (const script of ['core/block-layout.js', 'core/app.js']) {
  if (!index.includes(script) || !fallback.includes(script)) { console.error(`GitHub Pages public bootstrap mismatch: ${script}`); process.exit(1); }
}

console.log(`Validation passed: ${requiredFiles.length} required files, obsolete-file checks, route checks, integration registry/schema, isolated admin entry, public/admin runtime separation, private-route isolation, responsive desktop/mobile breakpoints, GitHub Pages bootstrap, production API endpoint, Cloudflare Worker/D1/KV bindings, secure cookie/CORS, login rate limiting, D1 admin backend, serialized remote saves, and public D1 state hydration checks passed.`);
