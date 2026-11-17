import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/worker-production-source-smoke.yml', import.meta.url), 'utf8');
const sourceList = workflow.match(/^\s+source_files=\(([^\n]*)\)$/m)?.[1];
const sources = sourceList?.match(/"([^"]+)"/g)?.map(value => value.slice(1, -1)) ?? [];

test('production source smoke hashes every new page-interaction runtime module', () => {
  assert.ok(sourceList, 'workflow declares its exact public source hash set');
  assert.equal(new Set(sources).size, sources.length, 'source list contains no duplicate paths');
  for (const path of [
    'public/editor-v2/core/page-interactions.js',
    'public/editor-v2/core/schema.js',
    'public/editor-v2/ui/page-interaction-controls.js',
    'public/editor-v2/ui/element-content-controls.js',
    'public/editor-v2/index.html',
    'public/editor-v2/app.js',
    'public/assets/page-renderer.js',
    'public/visual-page.html'
  ]) {
    assert.ok(sources.includes(path), `${path} is checked against the live Worker bytes`);
    assert.doesNotThrow(() => readFileSync(new URL(`../${path}`, import.meta.url)));
  }
});
