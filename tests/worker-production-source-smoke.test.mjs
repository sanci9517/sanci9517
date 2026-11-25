import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/worker-production-source-smoke.yml', import.meta.url), 'utf8');
const sourceList = workflow.match(/^\s+source_files=\(([^\n]*)\)$/m)?.[1];
const sources = sourceList?.match(/"([^"]+)"/g)?.map(value => value.slice(1, -1)) ?? [];

test('production source smoke hashes changed public Editor runtime modules before rollout', () => {
  assert.ok(sourceList, 'workflow declares its exact public source hash set');
  assert.equal(new Set(sources).size, sources.length, 'source list contains no duplicate paths');
  for (const path of [
    'public/editor-v2/core/page-interactions.js',
    'public/editor-v2/core/authored-content.js',
    'public/editor-v2/core/schema.js',
    'public/editor-v2/core/canvas-engine.js',
    'public/editor-v2/core/motion-style.js',
    'public/editor-v2/core/property-registry.js',
    'public/editor-v2/core/inspector-style-contract.js',
    'public/editor-v2/core/state-styles.js',
    'public/editor-v2/editor-motion.css',
    'public/editor-v2/editor-templates.css',
    'public/editor-v2/diagnostics.js',
    'public/editor-v2/core/editor-templates.js',
    'public/editor-v2/core/design-system/template-catalog.js',
    'public/editor-v2/ui/page-interaction-controls.js',
    'public/editor-v2/tests/core.test.js',
    'public/editor-v2/ui/element-content-controls.js',
    'public/editor-v2/tests/capability-contract.test.js',
    'public/editor-v2/tests/inspector-richtext.test.js',
    'public/editor-v2/ui/geometry-presets.js',
    'public/editor-v2/ui/forms-inspector.js',
    'public/editor-v2/index.html',
    'public/editor-v2/app.js',
    'public/assets/page-renderer.js',
    'public/visual-page.html'
  ]) {
    assert.ok(sources.includes(path), `${path} is checked against the live Worker bytes`);
    assert.doesNotThrow(() => readFileSync(new URL(`../${path}`, import.meta.url)));
  }
});

test('production source smoke checks Editor index through its routed public URL', () => {
  assert.match(
    workflow,
    /if \[\[ "\$file" == "public\/editor-v2\/index\.html" \]\]; then\s+relative_path="editor-v2\/"\s+fi/,
    'the Worker serves the Editor index at /editor-v2/; the literal /editor-v2/index.html path returns 410'
  );
});
