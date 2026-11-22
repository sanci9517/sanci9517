import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'../public/editor-v2');

test('the Editor release tokens bust the stylesheet, app, and responsive resolver caches',async()=>{
  const [html,css]=await Promise.all([
    readFile(resolve(root,'index.html'),'utf8'),
    readFile(resolve(root,'editor-refresh.css'),'utf8')
  ]);
  assert.match(html,/href="\/editor-v2\/editor-refresh\.css\?v=20261121-edt044-palette-favorites-v1"/,
    'the deployed HTML must request the stylesheet version containing palette-favorites styles');
  assert.match(css,/\.element-favorite-toggle\s*\{/,
    'the stylesheet referenced by the versioned link must include the palette-favorites UI');
  assert.match(html,/src="\/editor-v2\/app\.js\?v=20261122-edt024-responsive-prototype-safety-v1"/,
    'the deployed entry page must request the Editor script containing the responsive property-safety fix');
  const app=await readFile(resolve(root,'app.js'),'utf8');
  assert.match(app,/core\/responsive\.js\?v=20261122-edt024-responsive-prototype-safety-v1/,
    'the versioned entry script must request the responsive resolver cache key');
});
