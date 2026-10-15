import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const admin = readFileSync(new URL('../src/routes/admin/pages.ts', import.meta.url), 'utf8');
const publicRoute = readFileSync(new URL('../src/routes/public/pages.ts', import.meta.url), 'utf8');

test('page metadata PATCH must not automatically publish draft content', () => {
  assert.doesNotMatch(admin, /if\s*\(contentChanged\s*&&\s*existing\.is_published\)\s*statements\.push\(env\.DB\.prepare\('UPDATE pages SET published_content_json=/);
});

test('public page API reads published snapshot and gates draft preview', () => {
  assert.match(publicRoute, /useDraft\s*\?\s*row\.content_json\s*:\s*row\.published_content_json/);
  assert.match(publicRoute, /if\s*\(explicitPreview\)/);
  assert.match(publicRoute, /hasRole\(user,'editor'\)/);
});


test('preview requires authenticated editor and responses cannot be cached', () => {
  assert.match(publicRoute, /if\s*\(explicitPreview\)/);
  assert.match(publicRoute, /if\s*\(!user\)return noStore\(error\('UNAUTHORIZED',401/);
  assert.match(publicRoute, /if\s*\(!hasRole\(user,'editor'\)\)return noStore\(error\('FORBIDDEN',403/);
  assert.match(publicRoute, /headers\.set\('Cache-Control','private, no-store, max-age=0'\)/);
  assert.match(publicRoute, /headers\.set\('Vary','Cookie'\)/);
});
