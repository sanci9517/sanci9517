import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const editor = readFileSync(new URL('../src/routes/admin/editor.ts', import.meta.url), 'utf8');
const publicRoute = readFileSync(new URL('../src/routes/public/pages.ts', import.meta.url), 'utf8');

test('rollback is a new revision and does not overwrite published snapshot', () => {
  const rollback = editor.slice(editor.indexOf("if(request.method==='PUT')"));
  assert.match(rollback, /const next=currentVersion\+1/);
  assert.match(rollback, /INSERT INTO editor_revisions/);
  assert.match(rollback, /page\.rollback/);
  assert.doesNotMatch(rollback, /UPDATE pages SET published_content_json/);
  assert.match(rollback, /REVISION_CONFLICT/);
});

test('public API returns published snapshot, never draft, and forbids caching', () => {
  assert.match(publicRoute, /useDraft\?row\.content_json:row\.published_content_json/);
  assert.match(publicRoute, /useDraft\?'slug':'published_slug'/);
  assert.match(publicRoute, /AND is_published=1/);
  assert.match(publicRoute, /Cache-Control','private, no-store, max-age=0'/);
  assert.match(publicRoute, /Vary','Cookie'/);
});

test('preview requires editor authentication before reading draft', () => {
  assert.match(publicRoute, /if\(explicitPreview\)\{/);
  assert.match(publicRoute, /requireSiteGrant\(request,env,siteId,'editor'\)/);
  assert.match(publicRoute, /if\(grant instanceof Response\)return noStore\(grant\)/);
  assert.match(publicRoute, /if\(siteId!==DEFAULT_SITE_ID\)return noStore\(error\('SITE_ACCESS_DENIED',403\)\)/);
  assert.match(publicRoute, /if\(!user\)return noStore\(error\('UNAUTHORIZED',401/);
  assert.match(publicRoute, /if\(!hasRole\(user,'editor'\)\)return noStore\(error\('FORBIDDEN',403/);
});
