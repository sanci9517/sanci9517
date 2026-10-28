import assert from 'node:assert/strict';
import test from 'node:test';

import { createDocument } from '../core/schema.js';
import { activePage, createEditorState } from '../core/state.js';
import { execute } from '../core/commands.js';
import { applyStyleSnapshot, captureStyleSnapshot } from '../core/style-snapshot.js';
import {backgroundImageValue} from '../core/background-asset.js';

test('appearance snapshots copy responsive visual styles without copying content or geometry', () => {
  const source = {
    id: 'source',
    props: { text: 'Forrás tartalom' },
    style: { color: '#112233', fontSize: '28px', width: '640px', position: 'absolute' },
    responsive: {
      desktop: { backgroundColor: '#fefefe', backgroundAssetId:'6b1c2e65-e46e-4764-b234-123456789abc', padding: '16px 20px', height: '240px' },
      tablet: { borderRadius: '12px', width: '75%' },
      mobile: { fontSize: '22px', opacity: '0.8', backgroundAssetId:'none', left: '20px' }
    }
  };
  const snapshot = captureStyleSnapshot(source);
  const target = {
    id: 'target',
    props: { text: 'Másik tartalom' },
    style: { color: '#ffffff', fontSize: '16px', width: '320px', position: 'relative' },
    responsive: {
      desktop: { backgroundColor: '#000000', backgroundAssetId:'0c2360d8-c100-4b4c-b8bb-4628e69f26ad', padding: '4px', height: '120px' },
      tablet: { borderRadius: '4px', width: '50%' },
      mobile: { fontSize: '14px', opacity: '1', left: '0' }
    }
  };

  const applied = applyStyleSnapshot(target, snapshot);
  assert.deepEqual(applied.style, {
    width: '320px', position: 'relative', color: '#112233', fontSize: '28px'
  });
  assert.deepEqual(applied.responsive, {
    desktop: { height: '120px', backgroundColor: '#fefefe', backgroundAssetId:'6b1c2e65-e46e-4764-b234-123456789abc', padding: '16px 20px' },
    tablet: { width: '50%', borderRadius: '12px' },
    mobile: { left: '0', fontSize: '22px', opacity: '0.8', backgroundAssetId:'none' }
  });
  assert.equal(target.props.text, 'Másik tartalom');
  assert.equal(snapshot.style.width, undefined);
  assert.equal(snapshot.responsive.mobile.left, undefined);
});

test('style snapshot command is one undoable edit and preserves the destination node', () => {
  const state = createEditorState(createDocument());
  const rootId = activePage(state).rootId;
  execute(state, { type: 'element.add', payload: { type: 'heading', parentId: rootId, props: { text: 'Forrás' } } });
  const sourceId = state.selection.primaryId;
  execute(state, { type: 'responsive.set', payload: { nodeId: sourceId, device: 'desktop', patch: { backgroundColor: '#123456', padding: '12px 20px' } } });
  execute(state, { type: 'responsive.set', payload: { nodeId: sourceId, device: 'mobile', patch: { fontSize: '22px' } } });
  execute(state, { type: 'element.add', payload: { type: 'text', parentId: rootId, props: { text: 'Cél' } } });
  const targetId = state.selection.primaryId;
  execute(state, { type: 'responsive.set', payload: { nodeId: targetId, device: 'desktop', patch: { backgroundColor: '#ffffff', width: '320px' } } });
  const page = activePage(state);
  const snapshot = captureStyleSnapshot(page.nodes[sourceId]);
  const beforePaste = structuredClone(page.nodes[targetId]);

  execute(state, { type: 'style.snapshot.apply', payload: { nodeId: targetId, snapshot } });
  assert.equal(page.nodes[targetId].props.text, 'Cél');
  assert.equal(page.nodes[targetId].responsive.desktop.backgroundColor, '#123456');
  assert.equal(page.nodes[targetId].responsive.desktop.width, '320px');
  assert.equal(page.nodes[targetId].responsive.desktop.padding, '12px 20px');
  assert.equal(page.nodes[targetId].responsive.mobile.fontSize, '22px');

  execute(state, { type: 'history.undo' });
  assert.deepEqual(activePage(state).nodes[targetId], beforePaste);
  execute(state, { type: 'history.redo' });
  assert.equal(activePage(state).nodes[targetId].responsive.desktop.backgroundColor, '#123456');

  const stableDocument = structuredClone(state.document);
  assert.throws(() => execute(state, {
    type: 'style.snapshot.apply', payload: { nodeId: targetId, snapshot: { version: 999 } }
  }), /stílusmásolat/i);
  assert.deepEqual(state.document, stableDocument, 'invalid clipboard data cannot partially change the document');
});

test('background rendering and style snapshots reject non-RFC media UUIDs',()=>{
  for(const backgroundAssetId of ['-'.repeat(36),'1'.repeat(36),'6b1c2e65-e46e-0764-b234-123456789abc','6b1c2e65-e46e-4764-0234-123456789abc']){
    assert.equal(backgroundImageValue({backgroundAssetId}), 'none');
    const snapshot=captureStyleSnapshot({id:'source',style:{backgroundAssetId},responsive:{desktop:{backgroundAssetId}}});
    assert.deepEqual(snapshot.style,{});
    assert.deepEqual(snapshot.responsive.desktop,{});
  }
});
