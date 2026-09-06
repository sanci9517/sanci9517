import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const requiredFiles = [
  'index.html',
  'core/app.js',
  'core/router.js',
  'core/api.js',
  'core/config.js',
  'core/storage.js',
  'core/ui.js',
  'data/site.js',
  'data/navigation.js',
  'pages/home.js',
  'components/header.js',
  'components/navigation.js',
  'components/card.js',
  'styles/tokens.css',
  'styles/base.css',
  'styles/components.css',
  'styles/navigation.css',
  'schemas/site.schema.json',
  'schemas/page.schema.json',
  'worker/src/index.js',
  'worker/wrangler.jsonc',
];

const jsFiles = requiredFiles.filter((file) => file.endsWith('.js'));
const jsonFiles = ['schemas/site.schema.json', 'schemas/page.schema.json', 'worker/wrangler.jsonc'];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length) {
  console.error(`Missing required files:\n${missing.map((file) => `- ${file}`).join('\n')}`);
  process.exit(1);
}

for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

for (const file of jsonFiles) {
  try {
    const raw = readFileSync(file, 'utf8').replace(/^\/\/.*$/gm, '');
    JSON.parse(raw);
  } catch (error) {
    console.error(`Invalid JSON: ${file}`);
    console.error(error.message);
    process.exit(1);
  }
}

console.log(`Validation passed: ${requiredFiles.length} required files checked.`);
