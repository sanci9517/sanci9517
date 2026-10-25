import test from 'node:test';
import assert from 'node:assert/strict';
import {createDocument} from '../core/schema.js';
import {createEditorState,activePage} from '../core/state.js';
import {execute} from '../core/commands.js';
import {defaultTokens,normalizeTokens,tokenReference,parseTokenReference,compatibleTokens} from '../core/design-tokens.js';
import {normalizeInspectorValue} from '../core/property-values.js';
import {getProperty} from '../core/property-registry.js?v=20261025-content-property-route-contract';
import {buildStateStyles} from '../core/state-styles.js';

test('token bindings are canonical, compatible with the target field and cannot introduce cycles or scripts',()=>{
  assert.equal(parseTokenReference(tokenReference('colors.primary')),'colors.primary');
  assert.equal(normalizeInspectorValue(getProperty('typography.color'),tokenReference('colors.primary')),tokenReference('colors.primary'));
  assert.throws(()=>normalizeInspectorValue(getProperty('size.width'),tokenReference('colors.primary')));
  assert.equal(compatibleTokens(getProperty('typography.fontFamily')).includes('typography.font'),true);
  for(const value of ['url(https://external.test)','var(--creator-colors-text)','</style><script>bad</script>']){const tokens=defaultTokens();tokens.colors.primary=value;assert.throws(()=>normalizeTokens(tokens))}
  const tokens=defaultTokens();tokens.typography.font='bad;font-size:0';assert.throws(()=>normalizeTokens(tokens));
});

test('hover/focus styles inherit by device, remain independent of the base style and Undo is atomic',()=>{
  const state=createEditorState(createDocument());execute(state,{type:'element.add',payload:{type:'button',authored:true,style:{color:'#112233'}}});const id=state.selection.primaryId;
  execute(state,{type:'states.set',payload:{nodeId:id,state:'hover',device:'desktop',patch:{color:'#aabbcc',scale:'1.1'}}});
  const node=activePage(state).nodes[id];assert.equal(node.style.color,'#112233');assert.match(buildStateStyles(activePage(state),'mobile'),/color:#aabbcc!important/);
  execute(state,{type:'states.set',payload:{nodeId:id,state:'hover',device:'mobile',patch:{color:'#ff6600'}}});assert.match(buildStateStyles(activePage(state),'mobile'),/color:#ff6600!important/);
  execute(state,{type:'history.undo'});assert.match(buildStateStyles(activePage(state),'mobile'),/color:#aabbcc!important/);
  assert.throws(()=>execute(state,{type:'states.set',payload:{nodeId:id,state:'hover',device:'desktop',patch:{backgroundImage:'url(javascript:bad())'}}}));
  assert.throws(()=>execute(state,{type:'states.set',payload:{nodeId:id,state:'fake',device:'desktop',patch:{color:'#aabbcc'}}}));
  execute(state,{type:'element.lock.set',payload:{nodeId:id,locked:true}});assert.throws(()=>execute(state,{type:'states.set',payload:{nodeId:id,state:'hover',device:'desktop',patch:{color:'#000000'}}}),/locked/);
});
