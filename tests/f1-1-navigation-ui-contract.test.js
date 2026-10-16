import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const site = readFileSync(new URL('../public/assets/site.js', import.meta.url), 'utf8');
const publicNavigation = readFileSync(new URL('../src/routes/public/navigation.ts', import.meta.url), 'utf8');
const editor = readFileSync(new URL('../public/editor-v2/ui/navigation-editor.js', import.meta.url), 'utf8');
const editorHtml = readFileSync(new URL('../public/editor-v2/index.html', import.meta.url), 'utf8');

test('public menu consumes the canonical navigation API and builds nested links with DOM text nodes', () => {
  assert.match(site, /fetch\('\/api\/public\/navigation'/);
  assert.doesNotMatch(site, /fetch\('\/api\/public\/pages'/);
  assert.match(site, /menu-nav-children/);
  assert.match(site, /title\.textContent=item\.label/);
  assert.match(publicNavigation, /published_json/);
  assert.match(publicNavigation, /is_published=1/);
});

test('Editor exposes page/external menu items, hierarchy controls, draft save and explicit publish', () => {
  assert.match(editorHtml, /data-content="navigation"/);
  for (const id of ['navigationPageSelect','navigationAddPage','navigationAddExternal','navigationItemList','navigationSave','navigationPublish','navigationReload']) assert.match(editorHtml, new RegExp(`id="${id}"`));
  assert.match(editor, /Beágyazás az előző menüpont alá/);
  assert.match(editor, /Visszaemelés a főszintre/);
  assert.match(editor, /request\('PUT'/);
  assert.match(editor, /request\('POST'/);
  assert.match(editor, /REVISION_CONFLICT/);
  assert.match(editor, /nem írtuk felül/);
});
