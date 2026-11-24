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

test('the Editor and public renderer release tokens bust the structured accessibility assets',async()=>{
  const [html,css,publicHtml,publicRenderer]=await Promise.all([
    readFile(resolve(root,'index.html'),'utf8'),
    readFile(resolve(root,'editor-refresh.css'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/visual-page.html'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/assets/page-renderer.js'),'utf8')
  ]);
  assert.match(html,/href="\/editor-v2\/editor-refresh\.css\?v=20261121-edt044-palette-favorites-v1"/,
    'the deployed HTML must request the stylesheet version containing palette-favorites styles');
  assert.match(css,/\.element-favorite-toggle\s*\{/,
    'the stylesheet referenced by the versioned link must include the palette-favorites UI');
  const recoveryVersion='20261124-edt042-publish-recovery-safe-label-v1';
  const editorEntryVersion='20261124-edt044-import-tree-budget-v2';
  assert.match(html,new RegExp(`src="/editor-v2/app\\.js\\?v=${editorEntryVersion}"`),
    'the deployed entry page must request the unsupported-Publish recovery handler');
  assert.match(html,/src="\/editor-v2\/ui\/shell\.js\?v=20261123-edt044-account-scoped-preferences-v2"/,
    'the deployed entry page must request the account-scoped shell module');
  const app=await readFile(resolve(root,'app.js'),'utf8');
  assert.match(app,/core\/richtext-import\.js\?v=20261124-edt044-import-tree-budget-v2/,
    'the cache-keyed Editor entry must request the linear hard-break traversal implementation');
  assert.match(app,new RegExp(`core/publication-recovery\\.js\\?v=${recoveryVersion}`),
    'the cache-keyed entry must request the targeted recovery module');
  assert.match(app,/core\/responsive\.js\?v=20261122-edt024-responsive-prototype-safety-v1/,
    'the versioned entry script must request the responsive resolver cache key');
  assert.match(app,/ui\/structured-inspector\.js\?v=20261123-d06-single-slide-carousel-v1/,
    'the versioned entry script must request the structured Inspector accessible-name controls');
  assert.match(publicHtml,/page-renderer\.js\?v=20261124-d06-safe-content-dom-id-v1/,
    'published pages must request the renderer version containing the in-view motion behavior');
  assert.match(publicRenderer,/authored-content\.js\?v=20261124-d06-safe-content-dom-id-v1/,
    'the public renderer must request the cache-busted authored content and detail-group IDs');
  assert.match(publicRenderer,/element-content\.js\?v=20261124-d06-safe-content-dom-id-v1/,
    'the public renderer must request the shared collision-resistant content DOM ID helper');
});

test('the EDT-040 in-view trigger refreshes both renderers and the shared motion registry',async()=>{
  const [editorHtml,editor,canvasEngine,motionStyle,publicHtml,publicRenderer,css]=await Promise.all([
    readFile(resolve(root,'index.html'),'utf8'),
    readFile(resolve(root,'app.js'),'utf8'),
    readFile(resolve(root,'core/canvas-engine.js'),'utf8'),
    readFile(resolve(root,'core/motion-style.js'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/visual-page.html'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/assets/page-renderer.js'),'utf8'),
    readFile(resolve(root,'editor-motion.css'),'utf8')
  ]);
  const motionVersion='20261123-edt040-in-view-motion-v1';
  const domIdVersion='20261124-d06-safe-content-dom-id-v1';
  const editorEntryVersion='20261124-edt044-import-tree-budget-v2';
  assert.match(editorHtml,new RegExp(`editor-motion\\.css\\?v=${motionVersion}`));
  assert.match(editorHtml,new RegExp(`app\\.js\\?v=${editorEntryVersion}`));
  assert.match(editor,new RegExp(`core/property-registry\\.js\\?v=${motionVersion}`));
  assert.match(editor,new RegExp(`core/motion-style\\.js\\?v=${motionVersion}`));
  assert.match(editor,/dataset\.motionTrigger=motionTrigger/);
  assert.match(canvasEngine,/motion-style\.js/);
  assert.match(motionStyle,/MOTION_TRIGGER_OPTIONS/);
  assert.match(publicHtml,new RegExp(`editor-motion\\.css\\?v=${motionVersion}`));
  assert.match(publicHtml,new RegExp(`page-renderer\\.js\\?v=${domIdVersion}`));
  assert.match(publicRenderer,new RegExp(`motion-style\\.js\\?v=${motionVersion}`));
  assert.match(publicRenderer,/data-motion-trigger="\$\{motionTrigger\}"/);
  assert.match(css,/animation-timeline:\s*view\(\)/);
  assert.match(css,/animation-range:\s*entry 0% entry 100%/);
});
