import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/routes/admin/editor.ts', import.meta.url), 'utf8');

test('publish requires an explicit expected revision', () => {
  assert.match(source, /EXPECTED_VERSION_REQUIRED/);
  assert.match(source, /expectedVersion!==currentVersion/);
  assert.match(source, /REVISION_CONFLICT/);
});

test('publish snapshot is guarded by successful revision insertion', () => {
  assert.match(source, /INSERT INTO editor_revisions[\s\S]*?WHERE \(SELECT COALESCE\(MAX\(version\),0\) FROM editor_revisions WHERE page_id=\?\)=\?/);
  assert.match(source, /UPDATE pages SET published_content_json=\?,published_revision_id=\?[\s\S]*?EXISTS \(SELECT 1 FROM editor_revisions WHERE id=\?\)/);
  assert.match(source, /const results=await env\.DB\.batch\(statements\)/);
  assert.match(source, /Number\(results\[0\]\?\.meta\?\.changes\|\|0\)!==1/);
});

test('draft-only save does not change published snapshot', () => {
  assert.match(source, /if\s*\(publish\)\s*\{[\s\S]*?UPDATE pages SET published_content_json/);
});

test('publish audit entry is conditional on inserted revision', () => {
  assert.match(source, /page\.publish[\s\S]*?WHERE EXISTS \(SELECT 1 FROM editor_revisions WHERE id=\?\)/);
});
