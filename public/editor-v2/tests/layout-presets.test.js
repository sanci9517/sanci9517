import test from 'node:test';
import assert from 'node:assert/strict';
import {createDocument} from '../core/schema.js';
import {createEditorState,activePage} from '../core/state.js';
import {execute} from '../core/commands.js';
import {LAYOUT_TYPES,LAYOUT_PRESETS,isManagedLayout,isLayoutPropertyRelevant,explicitGridColumnCount} from '../core/layout-presets.js';
import {resolveNodeStyle} from '../core/canvas-engine.js';
import {getProperty,listProperties} from '../core/property-registry.js?v=20261030-inspector-layout-container-contract';
import {normalizeInspectorValue} from '../core/property-values.js';

function fixture(){
  const state=createEditorState(createDocument());
  execute(state,{type:'element.add',payload:{type:'container',parentId:activePage(state).rootId,props:{text:'Megőrzendő'},style:{width:'320px',color:'#123456'}}});
  const id=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:'text',parentId:id,props:{text:'Gyermek'}}});
  return {state,id,childId:state.selection.primaryId};
}

test('responsive layout recipes preserve content, geometry, descendants and history boundaries',()=>{
  const {state,id,childId}=fixture();
  const before=structuredClone(activePage(state).nodes);
  const count=state.history.past.length;
  execute(state,{type:'layout.preset.apply',payload:{nodeId:id,presetId:'cards'}});
  let node=activePage(state).nodes[id];
  assert.equal(state.history.past.length,count+1);
  assert.deepEqual(node.style,before[id].style);assert.deepEqual(node.props,before[id].props);
  assert.deepEqual(node.children,[childId]);assert.deepEqual(activePage(state).nodes[childId],before[childId]);
  assert.equal(resolveNodeStyle(node,'desktop').gridTemplateColumns,'repeat(3, minmax(0, 1fr))');
  assert.equal(resolveNodeStyle(node,'tablet').gridTemplateColumns,'repeat(2, minmax(0, 1fr))');
  assert.equal(resolveNodeStyle(node,'mobile').gridTemplateColumns,'1fr');
  assert.equal(isManagedLayout(node),true);
  execute(state,{type:'history.undo'});assert.deepEqual(activePage(state).nodes,before);
  execute(state,{type:'history.redo'});assert.equal(isManagedLayout(activePage(state).nodes[id]),true);
  for(const preset of LAYOUT_PRESETS){
    execute(state,{type:'layout.preset.apply',payload:{nodeId:id,presetId:preset.id}});
    node=activePage(state).nodes[id];
    for(const device of ['desktop','tablet','mobile'])for(const [key,value] of Object.entries(node.responsive[device])){
      const property=listProperties().find(item=>item.key===key);assert.ok(property,key);
      assert.equal(normalizeInspectorValue(property,value),value,`${preset.id}/${device}/${key}`);
    }
  }
});

test('automatic child placement is scoped to one device, atomic with locks and undoable',()=>{
  const {state,id,childId}=fixture();
  execute(state,{type:'layout.preset.apply',payload:{nodeId:id,presetId:'split'}});
  execute(state,{type:'responsive.set',payload:{nodeId:childId,device:'desktop',patch:{gridColumn:'2',width:'120px'}}});
  execute(state,{type:'responsive.set',payload:{nodeId:childId,device:'mobile',patch:{gridColumn:'2',width:'80px',x:'8px'}}});
  const before=structuredClone(activePage(state).nodes[childId]);
  execute(state,{type:'layout.children.auto',payload:{nodeId:id,device:'mobile'}});
  const node=activePage(state).nodes[childId];assert.equal(node.responsive.mobile.gridColumn,'auto');
  assert.equal(node.responsive.mobile.width,'80px');assert.equal(node.responsive.mobile.x,'8px');assert.deepEqual(node.responsive.desktop,before.responsive.desktop);assert.deepEqual(node.props,before.props);
  execute(state,{type:'history.undo'});assert.deepEqual(activePage(state).nodes[childId],before);
  execute(state,{type:'element.add',payload:{type:'text',parentId:id}});const lockedId=state.selection.primaryId;
  execute(state,{type:'element.lock.set',payload:{nodeId:lockedId,locked:true}});
  const document=structuredClone(state.document),history=state.history.past.length;
  assert.throws(()=>execute(state,{type:'layout.children.auto',payload:{nodeId:id,device:'mobile'}}),/locked/);
  assert.deepEqual(state.document,document);assert.equal(state.history.past.length,history);
  assert.throws(()=>execute(state,{type:'layout.preset.apply',payload:{nodeId:lockedId,presetId:'stack'}}),/locked/);
  assert.throws(()=>execute(state,{type:'layout.preset.apply',payload:{nodeId:childId,presetId:'stack'}}),/tároló/);
  assert.throws(()=>execute(state,{type:'layout.preset.apply',payload:{nodeId:id,presetId:'invalid'}}),/Ismeretlen/);
  assert.deepEqual(state.document,document);
});

test('Inspector layout fields follow declared container types, actual parent display, and breakpoint',()=>{
  const node={type:'text',style:{},responsive:{}};
  const parent={type:'container',responsive:{desktop:{display:'grid'},mobile:{display:'flex'}}};
  assert.equal(isLayoutPropertyRelevant(getProperty('grid.column'),node,parent,'desktop'),true);
  assert.equal(isLayoutPropertyRelevant(getProperty('flex.grow'),node,parent,'desktop'),false);
  assert.equal(isLayoutPropertyRelevant(getProperty('grid.column'),node,parent,'mobile'),false);
  assert.equal(isLayoutPropertyRelevant(getProperty('flex.grow'),node,parent,'mobile'),true);
  assert.equal(isLayoutPropertyRelevant(getProperty('grid.columns'),parent,null,'desktop'),true);
  assert.equal(isLayoutPropertyRelevant(getProperty('flex.direction'),parent,null,'mobile'),true);
  for(const property of listProperties().filter(item=>['flex','grid'].includes(item.group)))assert.ok(property.layoutContext,`${property.id} declares its visibility context`);
  assert.deepEqual(getProperty('flex.grow').layoutContext,{kind:'item',parentModes:['flex']});
  assert.deepEqual(getProperty('flex.alignSelf').layoutContext,{kind:'item',parentModes:['flex','grid']});
  assert.deepEqual(getProperty('grid.columns').layoutContext,{kind:'container',modes:['grid']});
  assert.deepEqual(getProperty('flex.gap').layoutContext,{kind:'container',modes:['flex','grid']});
  for(const id of ['flex.direction','flex.justify','flex.align','flex.wrap','flex.gap','grid.columns','grid.rows','grid.rowGap','grid.columnGap'])
    assert.deepEqual(getProperty(id).appliesTo,LAYOUT_TYPES,`${id} shares the canonical layout-container type list`);
  assert.ok(listProperties({group:'grid',nodeType:'container'}).some(property=>property.id==='grid.columns'),'generic layout containers expose Grid fields when their current mode is Grid');
  assert.equal(listProperties({group:'flex',nodeType:'text'}).some(property=>property.id==='flex.direction'),false,'text is not a layout-container type, even when an extension changes display to flex');
  assert.equal(isManagedLayout(parent),false,'legacy documents are not silently opted in');
  assert.equal(explicitGridColumnCount('repeat(3, minmax(0, 1fr))'),3);
  assert.equal(explicitGridColumnCount('minmax(0, 2fr) minmax(0, 1fr)'),2);
  assert.equal(explicitGridColumnCount('1fr'),1);
  assert.equal(explicitGridColumnCount('repeat(auto-fit, minmax(100px, 1fr))'),null);
});
