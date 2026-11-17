import test from 'node:test';
import assert from 'node:assert/strict';
import { createDocument, validateDocument } from '../core/schema.js';
import { normalizePageInteractions, pageInteractionAttributes, safePageInteraction } from '../core/page-interactions.js';
import { contentAttributes, getPublicationContentGuidance, validatePageForPublication } from '../core/authored-content.js';

function fixture() {
  const document = createDocument();
  const page = document.pages[document.activePageId];
  const root = page.nodes[page.rootId];
  const source = { id: 'button_one', type: 'button', parentId: root.id, children: [], props: {}, metadata: { contentVersion: 1 }, interactions: [] };
  const target = { id: 'tabs_one', type: 'tabs', parentId: root.id, children: [], props: { items: [{ title: 'Első' }, { title: 'Második' }] }, metadata: { contentVersion: 1 }, interactions: [] };
  const disclosure = { id: 'details_one', type: 'accordion', parentId: root.id, children: [], props: { items: [{ title: 'Első' }] }, metadata: { contentVersion: 1 }, interactions: [] };
  page.nodes[source.id] = source; page.nodes[target.id] = target; page.nodes[disclosure.id] = disclosure;
  root.children.push(source.id, target.id, disclosure.id);
  return { document, page, source, target, disclosure };
}

test('Page Action registry normalizes only the supported same-page typed action schemas', () => {
  const { page, source, target, disclosure } = fixture();
  assert.deepEqual(normalizePageInteractions([{ schemaVersion: 1, event: 'click', action: 'select-tab', targetId: target.id, itemIndex: 1 }], source, page.nodes), [
    { schemaVersion: 1, event: 'click', action: 'select-tab', targetId: target.id, itemIndex: 1 }
  ]);
  assert.deepEqual(normalizePageInteractions([{ schemaVersion: 1, event: 'click', action: 'toggle-disclosure', targetId: disclosure.id, itemIndex: 0 }], source, page.nodes), [
    { schemaVersion: 1, event: 'click', action: 'toggle-disclosure', targetId: disclosure.id, itemIndex: 0 }
  ]);
  assert.deepEqual(normalizePageInteractions([{ schemaVersion: 1, event: 'click', action: 'scroll-to', targetId: target.id }], source, page.nodes), [
    { schemaVersion: 1, event: 'click', action: 'scroll-to', targetId: target.id }
  ]);
  assert.deepEqual(normalizePageInteractions(undefined, source, page.nodes), []);
});

test('Page Action registry rejects scripts, selectors, foreign/missing nodes, type confusion, invalid indexes and link hijacking', () => {
  const { page, source, target, disclosure } = fixture();
  const action = (patch = {}) => ({ schemaVersion: 1, event: 'click', action: 'scroll-to', targetId: target.id, ...patch });
  for (const invalid of [
    action({ action: 'javascript', code: 'alert(1)' }),
    action({ targetId: '#anything' }),
    action({ targetId: 'not_on_this_page' }),
    action({ targetId: source.id }),
    action({ selector: 'body' }),
    action({ event: 'load' }),
    { schemaVersion: 1, event: 'click', action: 'select-tab', targetId: target.id, itemIndex: 2 },
    { schemaVersion: 1, event: 'click', action: 'toggle-disclosure', targetId: target.id, itemIndex: 0 }
  ]) assert.throws(() => normalizePageInteractions([invalid], source, page.nodes));
  assert.throws(() => normalizePageInteractions([action(), action()], source, page.nodes));
  source.props.href = '/p/home';
  assert.throws(() => normalizePageInteractions([action()], source, page.nodes));
});

test('invalid persisted page actions fail Page Model validation and are omitted from rendered attributes', () => {
  const { document, page, source, target } = fixture();
  source.interactions = [{ schemaVersion: 1, event: 'click', action: 'run-code', targetId: target.id, code: '<script>bad()</script>' }];
  assert.match(validateDocument(document).join('\n'), /invalid page interaction/);
  assert.equal(safePageInteraction(source, page.nodes), null);
  assert.deepEqual(pageInteractionAttributes(source, page.nodes), {});
  assert.equal(contentAttributes(source, { pageNodes: page.nodes })['data-page-action'], undefined);
  source.interactions = [{ schemaVersion: 1, event: 'click', action: 'select-tab', targetId: target.id, itemIndex: 0 }];
  assert.deepEqual(validateDocument(document), [], 'the Page Model accepts the declared same-page action');
  assert.equal(contentAttributes(source, { pageNodes: page.nodes })['data-page-action'], 'select-tab');
  assert.equal(contentAttributes(source, { pageNodes: page.nodes })['data-page-action-target'], target.id);
  source.props = { text: 'Tovább', href: '' };
  assert.equal(getPublicationContentGuidance(source, { pageNodes: page.nodes }), null, 'the declared action satisfies button publication guidance');
  assert.doesNotThrow(() => validatePageForPublication(page), 'an action button can publish without a fake destination URL');
  source.interactions[0].targetId = 'foreign_node';
  assert.match(getPublicationContentGuidance(source, { pageNodes: page.nodes }).message, /hivatkozási célt/,
    'an invalid action cannot bypass the required navigation/publication guard');
});
