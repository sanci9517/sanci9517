import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const requiredFiles = [
  'index.html', 'core/app.js', 'core/router.js', 'core/api.js', 'core/config.js', 'core/storage.js', 'core/ui.js',
  'core/site-state.js', 'core/page-state.js', 'core/navigation-state.js', 'data/site.js', 'data/navigation.js', 'data/pages.js',
  'pages/home.js', 'pages/generic.js', 'components/header.js', 'components/navigation.js', 'components/card.js',
  'admin/index.js', 'admin/dashboard.js', 'admin/auth.js', 'admin/website/index.js',
  'integrations/tiktok/client.js', 'styles/tokens.css', 'styles/base.css', 'styles/components.css', 'styles/navigation.css',
  'styles/admin.css', 'schemas/site.schema.json', 'schemas/page.schema.json', 'schemas/menu.schema.json',
  'worker/src/index.js', 'worker/wrangler.jsonc', 'twitch/status.js', 'youtube/status.js',
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
for (const route of ['/health', '/integrations/status', '/twitch/status', '/youtube/channel']) {
  if (!worker.includes(`url.pathname === '${route}'`)) { console.error(`Missing worker route: ${route}`); process.exit(1); }
}

const config = readFileSync('core/config.js', 'utf8');
const router = readFileSync('core/router.js', 'utf8');
const app = readFileSync('core/app.js', 'utf8');
const navigation = readFileSync('components/navigation.js', 'utf8');

if (!/basePath:\s*['"]\/sanci9517['"]/.test(config)) {
  console.error('Missing configured GitHub Pages basePath.');
  process.exit(1);
}
if (!router.includes('config.basePath')) {
  console.error('Router must use config.basePath for site paths.');
  process.exit(1);
}
if (!app.includes('config.basePath')) {
  console.error('App route resolution must use config.basePath.');
  process.exit(1);
}
if (!navigation.includes('config.basePath')) {
  console.error('Navigation route resolution must use config.basePath.');
  process.exit(1);
}

console.log(`Validation passed: ${requiredFiles.length} required files and public route base-path checks passed.`);
