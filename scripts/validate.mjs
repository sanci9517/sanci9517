import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const requiredFiles = [
  'index.html', '404.html', 'core/app.js', 'core/router.js', 'core/api.js', 'core/config.js', 'core/storage.js', 'core/ui.js',
  'core/site-state.js', 'core/page-state.js', 'core/navigation-state.js', 'data/site.js', 'data/navigation.js', 'data/pages.js',
  'pages/home.js', 'pages/generic.js', 'components/header.js', 'components/navigation.js', 'components/card.js',
  'admin/index.js', 'admin/dashboard.js', 'admin/auth.js', 'admin/website/index.js',
  'integrations/tiktok/client.js', 'styles/tokens.css', 'styles/base.css', 'styles/components.css', 'styles/navigation.css',
  'styles/admin.css', 'schemas/site.schema.json', 'schemas/page.schema.json', 'schemas/menu.schema.json',
  'worker/src/index.js', 'worker/src/auth.js', 'worker/wrangler.jsonc', 'twitch/status.js', 'youtube/status.js',
];
const jsFiles = requiredFiles.filter((file) => file.endsWith('.js'));
const jsonFiles = ['schemas/site.schema.json', 'schemas/page.schema.json', 'schemas/menu.schema.json', 'worker/wrangler.jsonc'];
const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length) { console.error(`Missing required files:\n${missing.map((file) => `- ${file}`).join('\n')}`); process.exit(1); }
for (const file of jsFiles) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
for (const file of jsonFiles) {
  try { JSON.parse(readFileSync(file, 'utf8').replace(/^\/\/.*$/gm, '')); }
  catch (error) { console.error(`Invalid JSON: ${file}`); console.error(error.message); process.exit(1); }
}

const worker = readFileSync('worker/src/index.js', 'utf8');
const workerAuth = readFileSync('worker/src/auth.js', 'utf8');
for (const route of ['/health', '/integrations/status', '/twitch/status', '/youtube/channel', '/admin/auth/login', '/admin/auth/check']) {
  if (!worker.includes(`url.pathname === '${route}'`)) { console.error(`Missing worker route: ${route}`); process.exit(1); }
}

const config = readFileSync('core/config.js', 'utf8');
const router = readFileSync('core/router.js', 'utf8');
const app = readFileSync('core/app.js', 'utf8');
const navigation = readFileSync('components/navigation.js', 'utf8');
const auth = readFileSync('admin/auth.js', 'utf8');
const admin = readFileSync('admin/index.js', 'utf8');
const index = readFileSync('index.html', 'utf8');
const fallback = readFileSync('404.html', 'utf8');

if (!/basePath:\s*['"]\/sanci9517['"]/.test(config)) { console.error('Missing configured GitHub Pages basePath.'); process.exit(1); }
if (!router.includes('config.basePath')) { console.error('Router must use config.basePath for site paths.'); process.exit(1); }
if (!app.includes('config.basePath')) { console.error('App route resolution must use config.basePath.'); process.exit(1); }
if (!navigation.includes('config.basePath')) { console.error('Navigation route resolution must use config.basePath.'); process.exit(1); }
if (auth.includes("sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated')") || auth.includes('Temporary foundation')) { console.error('Insecure client-only admin authentication is still present.'); process.exit(1); }
if (!auth.includes("/admin/auth/login") || !auth.includes('Bearer')) { console.error('Admin client must use server-backed authentication.'); process.exit(1); }
if (!admin.includes('await loginAdmin(')) { console.error('Admin login UI must await server authentication.'); process.exit(1); }
if (!worker.includes("import { isAdminRequestAuthenticated, loginAdminRequest } from './auth.js'")) { console.error('Worker must use the isolated admin authentication module.'); process.exit(1); }
if (!workerAuth.includes("crypto.subtle.verify('HMAC'")) { console.error('Admin token verification must use Web Crypto signature verification.'); process.exit(1); }
if (!workerAuth.includes('ADMIN_AUTH_SECRET') && !worker.includes('ADMIN_AUTH_SECRET')) { console.error('Worker admin authentication configuration is incomplete.'); process.exit(1); }
if (!worker.includes('ADMIN_USERNAME') || !worker.includes('ADMIN_PASSWORD')) { console.error('Worker admin credentials configuration is incomplete.'); process.exit(1); }

for (const script of ['admin/website/layout-enhancer.js', 'core/block-layout.js', 'core/app.js']) {
  if (!index.includes(script) || !fallback.includes(script)) { console.error(`GitHub Pages fallback bootstrap mismatch: ${script}`); process.exit(1); }
}

console.log(`Validation passed: ${requiredFiles.length} required files, public route checks, fallback bootstrap checks, and isolated server-backed admin auth checks passed.`);
