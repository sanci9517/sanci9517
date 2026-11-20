import assert from 'node:assert/strict';
import test from 'node:test';
import { CONTENT_FIELDS, getPublicationContentGuidance, validatePageForPublication } from '../public/editor-v2/core/authored-content.js';
import { validatedLinkHref } from '../public/editor-v2/core/richtext-links.js';
import { isStructuredType, safePublishedMediaUrl } from '../public/editor-v2/core/element-content.js';
import { defaultCardContent, normalizeCardContent } from '../public/editor-v2/core/card-content.js';
import { createDocument, validateDocument } from '../public/editor-v2/core/schema.js';
import { assertValidEditorDocument } from '../public/editor-v2/core/validation.js';
import {
  getElementContentContract,
  getElementContentProfileMetadata,
  hasContentProfile
} from '../public/editor-v2/core/content-profiles.js';

// Keep the canonical D (element-specific content and media) surface explicit.
// This is a schema/registration guard, not a claim that the complete browser,
// production-media or physical-device acceptance matrix is closed.
const D_CONTENT_FIELDS = Object.freeze({
  button: ['text', 'href', 'target', 'ariaLabel'],
  link: ['text', 'href', 'target', 'ariaLabel'],
  icon: ['icon', 'ariaLabel'],
  image: ['src', 'assetId', 'alt', 'decorative', 'caption', 'fit', 'ratio', 'focalX', 'focalY', 'loading'],
  video: ['src', 'assetId', 'poster', 'posterAssetId', 'controls', 'muted', 'loop', 'autoplay'],
  audio: ['src', 'assetId', 'controls', 'loop'],
  list: ['ordered', 'items'],
  table: ['caption', 'header', 'rows'],
  tabs: ['ariaLabel', 'items'],
  accordion: ['ariaLabel', 'singleOpen', 'openFirst', 'items'],
  dropdown: ['ariaLabel', 'singleOpen', 'openFirst', 'items'],
  gallery: ['ariaLabel', 'columns', 'items'],
  carousel: ['ariaLabel', 'items']
});

test('D authored CTA links reject private Editor media-preview routes after URL normalization', () => {
  const id = '00000000-0000-4000-8000-000000000123';
  const blocked = [
    `/api/admin/media?id=${id}`,
    `/api/%61dmin/media?id=${id}`,
    `/%61pi/admin/media?id=${id}`,
    `/api%2fadmin%2fmedia?id=${id}`,
    `/%2fapi%2fadmin%2fmedia?id=${id}`,
    `/%252fapi%252fadmin%252fmedia?id=${id}`,
    `/%255capi%255cadmin%255cmedia?id=${id}`,
    `/public/../api/admin/media?id=${id}`,
    `/api/admin/%6dedia?id=${id}`,
    `/api/admin/media/preview?id=${id}`
  ];
  for (const href of blocked) assert.throws(
    () => validatedLinkHref(href),
    /Privát szerkesztői média-előnézeti URL/,
    href
  );
  for (const href of ['/p/home', '/portfolio/item?tab=work', '#bemutatkozas', 'https://artist.example.com/story', 'mailto:creator@example.com']) {
    assert.equal(validatedLinkHref(href), href, `ordinary authored navigation remains valid: ${href}`);
  }
});

test('D published media guard fails closed beyond its encoded-path normalization bound', () => {
  let deeplyEncodedPrivateRoute = '/api/admin/media?id=asset';
  for (let layer = 0; layer < 11; layer += 1) {
    deeplyEncodedPrivateRoute = `/${deeplyEncodedPrivateRoute.slice(1).replace(/%/g, '%25').replace(/^a/i, '%61')}`;
  }

  assert.equal(safePublishedMediaUrl(deeplyEncodedPrivateRoute), '', 'unusually deep private URL encodings never pass the public-media guard');
});

test('D authored content types keep every declared Inspector field in the canonical contract', () => {
  for (const [type, expectedKeys] of Object.entries(D_CONTENT_FIELDS)) {
    const fields = CONTENT_FIELDS[type];
    assert.ok(fields, `${type} has a shared authored-content schema`);
    assert.deepEqual(fields.map(field => field.key), expectedKeys, `${type} field order and set`);
    assert.equal(new Set(expectedKeys).size, expectedKeys.length, `${type} has no duplicate field keys`);

    const node = { type, metadata: { contentVersion: 1 }, props: {} };
    const contract = getElementContentContract(node);
    assert.deepEqual(contract.fields.map(field => field.key), expectedKeys, `${type} fields reach the Inspector contract`);
    assert.ok(contract.profiles.some(profile => profile.id === 'authored-v1'), `${type} retains authored-v1 validation`);
  }
});

test('D structured repeaters and media types retain their versioned validation profiles', () => {
  for (const type of ['list', 'table', 'tabs', 'accordion', 'gallery', 'carousel']) {
    assert.equal(isStructuredType(type), true, `${type} has the structured public renderer`);
    const metadata = getElementContentProfileMetadata(type);
    assert.equal(metadata.structuredContentVersion, 1, `${type} opts into structured-v1`);
    assert.equal(hasContentProfile({ type, metadata, props: {} }, 'structured-v1'), true, `${type} remains behind structured validation`);
  }

  for (const type of ['image', 'video', 'audio']) {
    const metadata = getElementContentProfileMetadata(type);
    assert.equal(metadata.editorContentVersion, 1, `${type} opts into media-v1`);
    assert.equal(hasContentProfile({ type, metadata, props: {} }, 'media-v1'), true, `${type} remains behind media validation`);
  }

  const cardContent = normalizeCardContent(defaultCardContent());
  const card = { type: 'card', metadata: getElementContentProfileMetadata('card'), props: { cardContent } };
  assert.equal(card.metadata.cardContentVersion, 1, 'Card content is versioned independently from authored props');
  assert.equal(hasContentProfile(card, 'card-v1'), true, 'Card retains its own validation gate');
  assert.ok(getElementContentContract(card).profiles.some(profile => profile.id === 'card-v1'));
});

test('D structured content repeaters share the same minimum-content contract in Inspector guidance and Publish', () => {
  const cases = [
    { type: 'list', props: { items: [] }, validProps: { items: [{ text: 'Első listaelem' }] } },
    { type: 'tabs', props: { items: [] }, validProps: { items: [{ title: 'Bemutatkozás', text: 'Történet' }] } },
    { type: 'accordion', props: { items: [] }, validProps: { items: [{ title: 'Kérdés', text: 'Válasz' }] } },
    { type: 'dropdown', props: { items: [{ title: '  ', text: 'Tartalom' }] }, validProps: { items: [{ title: 'Részletek', text: 'Tartalom' }] } },
    { type: 'gallery', props: { items: [] }, validProps: { items: [{ src: '/media/image.png', alt: 'Alkotói kép' }] } },
    { type: 'carousel', props: { items: [{ src: '/media/image.png', alt: '  ' }] }, validProps: { items: [{ src: '/media/image.png', caption: 'Első dia' }] } }
  ];

  const publicationError = node => {
    const pageNode = { ...node, children: [] };
    assert.throws(() => validatePageForPublication({
      rootId: 'root',
      nodes: {
        root: { id: 'root', type: 'root', children: [pageNode.id] },
        [pageNode.id]: pageNode
      }
    }), new RegExp(pageNode.type === 'list' ? 'Adj meg legalább egy nem üres listaelemet' :
      pageNode.type === 'gallery' || pageNode.type === 'carousel' ? 'A képekhez Médiatár-fájl' : 'Legalább egy elnevezett rész'));
  };

  for (const [index, item] of cases.entries()) {
    const invalid = { id: `d-repeater-invalid-${index}`, type: item.type, metadata: { contentVersion: 1 }, props: item.props };
    const guidance = getPublicationContentGuidance(invalid);
    assert.ok(guidance, `${item.type} shows an Inspector publication warning for incomplete repeaters`);
    assert.equal(guidance.fieldKey, 'items', `${item.type} guidance points to the repeater that needs correction`);
    publicationError(invalid);

    const valid = { ...invalid, props: item.validProps };
    assert.equal(getPublicationContentGuidance(valid), null, `${item.type} clears its guidance after its minimum valid content is restored`);
    assert.doesNotThrow(() => validatePageForPublication({
      rootId: 'root',
      nodes: { root: { id: 'root', type: 'root', children: [valid.id] }, [valid.id]: { ...valid, children: [] } }
    }), `${item.type} Publish gate accepts the same content the Inspector reports as ready`);
  }

  for (const type of ['gallery', 'carousel']) {
    const node = { id: `d-repeater-invalid-${type}`, type, metadata: { contentVersion: 1 }, props: { items: [{ src: 'javascript:alert(1)', alt: 'Kép' }] } };
    assert.equal(getPublicationContentGuidance(node)?.fieldKey, 'items', `${type} rejects an unsafe source in a repeated media row`);
    publicationError(node);
  }
});

test('D Inspector field controls and nested repeaters stay inside supported contracts', () => {
  const controls = new Set(['text', 'textarea', 'url', 'media-url', 'asset', 'boolean', 'select', 'range', 'repeater', 'table']);
  for (const [type, fields] of Object.entries(D_CONTENT_FIELDS)) {
    for (const field of CONTENT_FIELDS[type]) {
      assert.ok(controls.has(field.type), `${type}.${field.key} uses a supported control`);
      if (field.type === 'repeater') {
        assert.ok(Array.isArray(field.itemFields) && field.itemFields.length > 0, `${type}.${field.key} declares nested fields`);
        assert.equal(new Set(field.itemFields.map(item => item.key)).size, field.itemFields.length, `${type}.${field.key} has unique nested field keys`);
        for (const item of field.itemFields) assert.ok(controls.has(item.type), `${type}.${field.key}.${item.key} uses a supported control`);
      }
    }
  }
});

test('D persisted Page identity mismatch fails validation without coercion or mutation', () => {
  const document = createDocument();
  const pageId = document.activePageId;
  assert.deepEqual(validateDocument(document), []);

  document.pages[pageId].id = { toString: null };
  const persisted = JSON.stringify(document);

  assert.doesNotThrow(() => validateDocument(document));
  assert.match(validateDocument(document).join('; '), /page id mismatch: \[invalid\] != .+/);
  assert.throws(() => assertValidEditorDocument(document), /page id mismatch/);
  assert.equal(JSON.stringify(document), persisted, 'validation does not rewrite malformed Page identity');
});
