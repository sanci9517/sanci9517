import test from 'node:test';
import assert from 'node:assert/strict';
import {createDocument} from '../core/schema.js';
import {createEditorState,activePage} from '../core/state.js';
import {execute} from '../core/commands.js';
import {defaultTokens,normalizeTokens,tokenReference,parseTokenReference,compatibleTokens} from '../core/design-tokens.js';
import {normalizeInspectorValue} from '../core/property-values.js';
import {getProperty} from '../core/property-registry.js?v=20261030-inspector-layout-context-contract';
import {buildStateStyles,hasStateStyles} from '../core/state-styles.js';
import {assertValidEditorDocument} from '../core/validation.js';

test('token bindings are canonical, compatible with the target field and cannot introduce cycles or scripts',()=>{
  assert.equal(parseTokenReference(tokenReference('colors.primary')),'colors.primary');
  assert.equal(normalizeInspectorValue(getProperty('typography.color'),tokenReference('colors.primary')),tokenReference('colors.primary'));
  assert.throws(()=>normalizeInspectorValue(getProperty('size.width'),tokenReference('colors.primary')));
  assert.equal(compatibleTokens(getProperty('typography.fontFamily')).includes('typography.font'),true);
  for(const value of ['#abc','#abcd','#aabbcc','#aabbccdd']){const tokens=defaultTokens();tokens.colors.primary=value;assert.equal(normalizeTokens(tokens).colors.primary,value,`${value} is a supported CSS HEX color`)}
  for(const value of ['#abcde','#aabbccd','#gggg']){const tokens=defaultTokens();tokens.colors.primary=value;assert.throws(()=>normalizeTokens(tokens),`${value} is not a supported CSS HEX color`)}
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

test('keyboard focusability is derived from valid focus-visible styles at the active responsive breakpoint',()=>{
  const node={metadata:{stateVersion:1},states:{hover:{desktop:{color:'#aabbcc'}},'focus-visible':{desktop:{backgroundColor:'#112233'},mobile:{backgroundColor:'#445566'}}}};
  assert.equal(hasStateStyles(node,'hover','desktop'),true);
  assert.equal(hasStateStyles(node,'focus-visible','desktop'),true);
  assert.equal(hasStateStyles(node,'focus-visible','mobile'),true);
  assert.equal(hasStateStyles(node,'focus-visible','tablet'),true,'tablet inherits the desktop value');
  assert.equal(hasStateStyles(node,'fake','desktop'),false);
  assert.equal(hasStateStyles({...node,metadata:{}},'focus-visible','desktop'),false);
  assert.equal(hasStateStyles({...node,states:{'focus-visible':{desktop:{backgroundColor:'not-a-color'}}}},'focus-visible','desktop'),false);
  assert.equal(hasStateStyles({states:{focus:{outlineColor:'#09f'}}},'focus-visible','desktop'),true,'legacy focus outlines remain keyboard reachable');
  assert.equal(hasStateStyles({states:{focus:{outlineColor:'not-a-color'}}},'focus-visible','desktop'),false);
});

test('versioned saved interaction states reject invalid persisted CSS while legacy pages remain compatible',()=>{
  const invalid=[
    ['color','url(javascript:alert(1))'],['backgroundColor','url(javascript:alert(1))'],
    ['backgroundImage','url(javascript:alert(1))'],['borderColor','url(javascript:alert(1))'],
    ['boxShadow','url(javascript:alert(1))'],['opacity','2'],['textDecoration','blink'],
    ['fontWeight','1000'],['rotate','361deg'],['scale','0']
  ];
  for(const [key,value] of invalid){
    const state=createEditorState(createDocument());
    execute(state,{type:'element.add',payload:{type:'text',parentId:activePage(state).rootId,props:{text:'Validated interaction state'}}});
    const node=activePage(state).nodes[state.selection.primaryId];node.metadata.stateVersion=1;
    node.states={hover:{desktop:{[key]:value}}};
    assert.throws(()=>assertValidEditorDocument(state.document),`${key} rejects an invalid persisted value`);
    assert.equal(node.states.hover.desktop[key],value,`${key} validation does not mutate the rejected document`);
  }

  const legacy=createEditorState(createDocument());
  execute(legacy,{type:'element.add',payload:{type:'text',parentId:activePage(legacy).rootId,props:{text:'Legacy interaction state'}}});
  const legacyPage=activePage(legacy),legacyNode=legacyPage.nodes[legacy.selection.primaryId];
  legacyNode.states={hover:{desktop:{backgroundImage:'url(javascript:alert(1))'}}};
  assert.doesNotThrow(()=>assertValidEditorDocument(legacy.document),'unversioned legacy state data remains loadable');
  assert.equal(buildStateStyles(legacyPage,'desktop'),'','legacy state values do not enter versioned public CSS');
});
