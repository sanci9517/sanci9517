import assert from 'node:assert/strict';
import test from 'node:test';
import { CONTENT_FIELDS } from '../public/editor-v2/core/authored-content.js';
import { isStructuredType } from '../public/editor-v2/core/element-content.js';
import { defaultCardContent, normalizeCardContent } from '../public/editor-v2/core/card-content.js';
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
  video: ['src', 'poster', 'posterAssetId', 'controls', 'muted', 'loop', 'autoplay'],
  audio: ['src', 'controls', 'loop'],
  list: ['ordered', 'items'],
  table: ['caption', 'header', 'rows'],
  tabs: ['ariaLabel', 'items'],
  accordion: ['ariaLabel', 'singleOpen', 'openFirst', 'items'],
  dropdown: ['ariaLabel', 'singleOpen', 'openFirst', 'items'],
  gallery: ['ariaLabel', 'columns', 'items'],
  carousel: ['ariaLabel', 'items']
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
