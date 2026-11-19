import test from 'node:test';
import assert from 'node:assert/strict';
import { listEditorTemplates, instantiateEditorTemplate } from '../core/editor-templates.js';
import { assertValidEditorDocument } from '../core/validation.js';

test('EDT-041 catalog returns versioned, non-executable preview metadata', () => {
  const first = listEditorTemplates();
  assert.deepEqual(first.map(item => item.id), ['blank-page', 'creator-home', 'creator-schedule']);
  assert.ok(first.every(item => item.version === 1 && item.schemaVersion === 1));
  assert.ok(first.every(item => item.preview.every(line => typeof line === 'string')));
  first[1].preview[0] = '<img src=x onerror=alert(1)>';
  assert.match(listEditorTemplates()[1].preview[0], /^SANCI9517/);
  assert.match(listEditorTemplates()[2].preview[0], /^Következő adások$/);
  assert.ok(first.every(item => !('html' in item) && !('script' in item) && !('customCode' in item)));
});

test('EDT-041 template install creates a valid draft and remaps every node reference', () => {
  const first = instantiateEditorTemplate('creator-home', { title: 'Saját bemutatkozás', slug: 'sajat-bemutatkozas' });
  const second = instantiateEditorTemplate('creator-home', { title: 'Második oldal', slug: 'masodik-oldal' });
  assert.doesNotThrow(() => assertValidEditorDocument(first));
  assert.equal(first.pages[first.activePageId].status, 'draft');
  assert.equal(first.pages[first.activePageId].settings.templateId, 'creator-home');
  assert.deepEqual(first.pages[first.activePageId].settings.customCode, { head: '', bodyStart: '', bodyEnd: '' });
  const nodes = Object.values(first.pages[first.activePageId].nodes);
  const ids = nodes.map(node => node.id);
  assert.equal(new Set(ids).size, ids.length, 'each instance has unique node IDs');
  assert.ok(ids.every(id => !Object.hasOwn(second.pages[second.activePageId].nodes, id)), 'new installs remap every node ID');
  const page = first.pages[first.activePageId];
  for (const node of Object.values(page.nodes)) {
    for (const childId of node.children) assert.equal(page.nodes[childId].parentId, node.id);
  }
  assert.ok(nodes.some(node => node.props?.text === 'Játék. Kikapcsolódás. Közösség.'));
  assert.ok(nodes.every(node => !JSON.stringify(node).includes('/p/twitch')));
});

test('EDT-041 empty start contains only the canonical root and never publishes', () => {
  const document = instantiateEditorTemplate('blank-page', { title: 'Üres indítás', slug: 'ures-inditas' });
  const page = document.pages[document.activePageId];
  assert.doesNotThrow(() => assertValidEditorDocument(document));
  assert.equal(page.status, 'draft');
  assert.equal(Object.keys(page.nodes).length, 1);
  assert.deepEqual(page.nodes[page.rootId].children, []);
  assert.equal(page.settings.templateId, 'blank-page');
  assert.equal(page.isPublished, undefined);
});

test('EDT-041 schedule template is a safe editable draft without invented creator data', () => {
  const first = instantiateEditorTemplate('creator-schedule', { title: 'Menetrendem', slug: 'menetrendem' });
  const second = instantiateEditorTemplate('creator-schedule', { title: 'Másik menetrend', slug: 'masik-menetrend' });
  const page = first.pages[first.activePageId], clone = second.pages[second.activePageId];
  assert.doesNotThrow(() => assertValidEditorDocument(first));
  assert.equal(page.status, 'draft');
  assert.equal(page.isPublished, undefined);
  assert.equal(page.settings.templateId, 'creator-schedule');
  const nodes = Object.values(page.nodes), ids = nodes.map(node => node.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every(id => !Object.hasOwn(clone.nodes, id)), 'separate schedule pages receive disjoint node IDs');
  assert.equal(nodes.filter(node => node.type === 'section').length, 4, 'the schedule and its three editable slots are authored sections');
  assert.ok(nodes.some(node => node.props?.text === 'Írd ide a napot és az időpontot.'));
  assert.ok(nodes.some(node => node.props?.text === 'Írd ide a közösségi eseményed időpontját.'));
  for (const node of nodes) {
    for (const childId of node.children) assert.equal(page.nodes[childId].parentId, node.id);
    assert.equal(Object.hasOwn(node.props || {}, 'href'), false, 'the template invents no channel or community URL');
    assert.equal(Object.hasOwn(node.props || {}, 'assetId'), false, 'the template assumes no media-library assets');
    assert.equal(Object.hasOwn(node.metadata || {}, 'customCode'), false, 'templates cannot ship executable content');
  }
  assert.ok(!JSON.stringify(nodes).includes('http'), 'the starter remains independent of unverified external channels');
});

test('EDT-041 rejects unknown templates and invalid page metadata before creating a document', () => {
  for (const input of [
    ['other-site-template', { title: 'Átvenném', slug: 'atvennem' }],
    ['blank-page', { title: ' ', slug: 'ures' }],
    ['blank-page', { title: 'x'.repeat(161), slug: 'ures' }],
    ['creator-home', { title: 'Oldal', slug: '../live' }],
    ['creator-home', { title: 'Oldal', slug: 'too--many' }]
  ]) assert.throws(() => instantiateEditorTemplate(...input));
  const normalized = instantiateEditorTemplate('creator-home', { title: 'Oldal', slug: 'Uppercase' });
  assert.equal(normalized.pages[normalized.activePageId].slug, 'uppercase');
});
