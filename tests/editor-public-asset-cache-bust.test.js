import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'../public/editor-v2');

test('the authenticated media admin entry and retention module request the refreshed cursor behavior',async()=>{
  const [html,entry]=await Promise.all([
    readFile(resolve(import.meta.dirname,'../public/admin-media.html'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/assets/admin-media.js'),'utf8')
  ]);
  const version='20261123-d06-retention-refresh-cursor-v1';
  assert.match(html,new RegExp(`<script type="module" src="/assets/admin-media\\.js\\?v=${version}"></script>`),
    'the protected media-admin HTML must request the cache-keyed entry');
  assert.match(entry,new RegExp(`from "\\./admin-media-retention\\.js\\?v=${version}"`),
    'the cache-keyed entry must request the fixed retention-pagination controller');
});

test('the Editor release tokens bust the stylesheet, account-scoped app and shell caches',async()=>{
  const [html,css]=await Promise.all([
    readFile(resolve(root,'index.html'),'utf8'),
    readFile(resolve(root,'editor-refresh.css'),'utf8')
  ]);
  assert.match(html,/href="\/editor-v2\/editor-refresh\.css\?v=20261121-edt044-palette-favorites-v1"/,
    'the deployed HTML must request the stylesheet version containing palette-favorites styles');
  assert.match(css,/\.element-favorite-toggle\s*\{/,
    'the stylesheet referenced by the versioned link must include the palette-favorites UI');
  assert.match(html,/src="\/editor-v2\/app\.js\?v=20261123-edt044-account-scoped-preferences-v2"/,
    'the deployed entry page must request the account-scoped Editor entry script');
  assert.match(html,/src="\/editor-v2\/ui\/shell\.js\?v=20261123-edt044-account-scoped-preferences-v2"/,
    'the deployed entry page must request the account-scoped shell module');
  const app=await readFile(resolve(root,'app.js'),'utf8');
  assert.match(app,/core\/responsive\.js\?v=20261122-edt024-responsive-prototype-safety-v1/,
    'the versioned entry script must request the responsive resolver cache key');
  assert.match(app,/ui\/structured-inspector\.js\?v=20261122-d03-table-object-cell-recovery-v1/,
    'the versioned entry script must request the structured Inspector containing explicit table-row recovery');
});
