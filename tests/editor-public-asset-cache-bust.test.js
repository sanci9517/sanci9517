import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'../public/editor-v2');

test('the palette-favorites stylesheet release token invalidates the previous CSS cache entry',async()=>{
  const [html,css]=await Promise.all([
    readFile(resolve(root,'index.html'),'utf8'),
    readFile(resolve(root,'editor-refresh.css'),'utf8')
  ]);
  assert.match(html,/href="\/editor-v2\/editor-refresh\.css\?v=20261121-edt044-palette-favorites-v1"/,
    'the deployed HTML must request the stylesheet version containing palette-favorites styles');
  assert.match(css,/\.element-favorite-toggle\s*\{/,
    'the stylesheet referenced by the versioned link must include the palette-favorites UI');
  assert.match(html,/src="\/editor-v2\/app\.js\?v=20261121-edt044-account-preferences-v1"/,
    'the deployed entry page must request the Editor script containing account-synced preferences');
});
