import test from 'node:test';
import assert from 'node:assert/strict';
import {createDocument} from '../core/schema.js';
import {createEditorState,activePage} from '../core/state.js';
import {execute} from '../core/commands.js';
import {authoredNodeHtml,contentAttributes,contentTag,normalizeElementContent,validateElementContent,validatePageForPublication,contentProperties} from '../core/authored-content.js';
import {opaqueContrast} from '../core/accessibility.js';

test('typed content edits preserve unknown legacy data and undo restores the complete node',()=>{
  const state=createEditorState(createDocument());execute(state,{type:'element.add',payload:{type:'heading',props:{text:'Eredeti cím',legacy:{kept:true}},style:{width:'240px'}}});
  const id=state.selection.primaryId,before=structuredClone(activePage(state).nodes[id]);
  execute(state,{type:'content.properties.set',payload:{nodeId:id,patch:{level:'1'}}});
  let node=activePage(state).nodes[id];assert.equal(contentTag(node),'h1');assert.equal(node.props.text,'Eredeti cím');assert.deepEqual(node.props.legacy,{kept:true});assert.deepEqual(node.style,before.style);
  execute(state,{type:'history.undo'});assert.deepEqual(activePage(state).nodes[id],before);
  execute(state,{type:'history.redo'});assert.equal(contentTag(activePage(state).nodes[id]),'h1');
  assert.throws(()=>execute(state,{type:'content.properties.set',payload:{nodeId:id,patch:{level:'7'}}}),/választás/);
  assert.equal(contentTag(activePage(state).nodes[id]),'h1');
  execute(state,{type:'element.lock.set',payload:{nodeId:id,locked:true}});
  assert.throws(()=>execute(state,{type:'content.properties.set',payload:{nodeId:id,patch:{level:'2'}}}),/locked/);
});

test('links, media, repeaters and table contents reject unsafe or invalid values',()=>{
  const node=type=>({id:'safe',type,metadata:{contentVersion:1},props:{}});
  for(const href of ['javascript:alert(1)','data:text/html,hi','//evil.test','https://user:pass@evil.test','/p/o\nk'])assert.throws(()=>normalizeElementContent(node('link'),{href}),undefined,href);
  for(const src of ['http://example.com/a.png','data:image/svg+xml,hi','javascript:alert(1)','mailto:x@example.com'])assert.throws(()=>normalizeElementContent(node('image'),{src}));
  assert.equal(normalizeElementContent(node('image'),{src:'/assets/a.png'}).src,'/assets/a.png');
  assert.throws(()=>normalizeElementContent(node('video'),{autoplay:true,muted:false}),/némítva/);
  assert.throws(()=>normalizeElementContent(node('list'),{items:[{text:'Hello',href:'javascript:evil()'}]}));
  assert.throws(()=>normalizeElementContent(node('table'),{rows:[new Array(17).fill('x')]}));
  assert.throws(()=>normalizeElementContent(node('gallery'),{items:new Array(41).fill({src:'/a.png'})}));
  assert.equal(contentProperties(node('video')).controls,true);
  assert.equal(contentProperties(node('heading')).level,'2');
  assert.throws(()=>validateElementContent({...node('heading'),props:{level:'8'}}));
});

test('authored markup escapes text, preserves link security and uses native accessible structures',()=>{
  const node={id:'node-1',type:'button',metadata:{contentVersion:1},props:{text:'<img src=x onerror=alert(1)>',href:'/p/home',target:'_blank',ariaLabel:'Kezdőlap'}};
  assert.equal(contentTag(node),'a');assert.deepEqual(contentAttributes(node),{href:'/p/home',target:'_blank',rel:'noopener noreferrer','aria-label':'Kezdőlap'});
  assert.match(authoredNodeHtml(node),/&lt;img/);assert.doesNotMatch(authoredNodeHtml(node),/<img/);
  assert.match(authoredNodeHtml({...node,type:'tabs',props:{items:[{title:'Első',text:'<script>test</script>'},{title:'Második',text:'Második tartalom'}]}}),/role="tabpanel"/);
  assert.match(authoredNodeHtml({...node,type:'accordion',props:{items:[{title:'Kérdés',text:'Válasz'}]}}),/<details><summary>Kérdés/);
  assert.match(authoredNodeHtml({...node,type:'table',props:{header:true,rows:[['Név','Érték'],['Teszt','42']]}}),/<th scope="col">/);
  assert.match(authoredNodeHtml({...node,type:'image',props:{src:'/image.svg',alt:'Illusztráció',ratio:'1 / 1',fit:'contain'}}),/alt="Illusztráció"/);
});

test('accessibility IDs are unique within a page and invalid mutations roll back',()=>{
  const state=createEditorState(createDocument());const ids=[];
  for(let i=0;i<2;i++){execute(state,{type:'element.add',payload:{type:'text',parentId:activePage(state).rootId}});ids.push(state.selection.primaryId)}
  execute(state,{type:'accessibility.set',payload:{nodeId:ids[0],patch:{id:'bemutato',label:'Bemutatkozás',lang:'hu'}}});
  assert.throws(()=>execute(state,{type:'accessibility.set',payload:{nodeId:ids[1],patch:{id:'bemutato'}}}),/foglalt/);
  assert.throws(()=>execute(state,{type:'accessibility.set',payload:{nodeId:ids[1],patch:{id:'x" onclick="bad'}}}));
  assert.throws(()=>execute(state,{type:'accessibility.set',payload:{nodeId:ids[1],patch:{role:'admin'}}}));
  assert.equal(activePage(state).nodes[ids[1]].accessibility.id,undefined);
});

test('adding an authored element is one Undo and subtree copies preserve their internal anchor relationships',()=>{
  const state=createEditorState(createDocument()),rootId=activePage(state).rootId;
  execute(state,{type:'element.add',payload:{type:'heading',parentId:rootId,authored:true}});const heading=state.selection.primaryId;
  assert.equal(activePage(state).nodes[heading].metadata.contentVersion,1);assert.equal(state.history.past.length,1);
  execute(state,{type:'history.undo'});assert.equal(activePage(state).nodes[heading],undefined);
  execute(state,{type:'element.add',payload:{type:'container',parentId:rootId,authored:true}});const group=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:'text',parentId:group,authored:true}});const text=state.selection.primaryId;
  execute(state,{type:'accessibility.set',payload:{nodeId:text,patch:{id:'belso-cel'}}});
  execute(state,{type:'element.add',payload:{type:'button',parentId:group,authored:true,props:{text:'Ugrás',href:'#belso-cel'}}});const button=state.selection.primaryId;
  execute(state,{type:'element.duplicate',payload:{nodeId:group}});const copy=activePage(state).nodes[state.selection.primaryId],children=copy.children.map(id=>activePage(state).nodes[id]);
  assert.notEqual(children[0].accessibility.id,'belso-cel');assert.equal(children[1].props.href,'#'+children[0].accessibility.id);
  assert.equal(activePage(state).nodes[button].props.href,'#belso-cel');assert.equal(activePage(state).nodes[text].accessibility.id,'belso-cel');
});

test('contrast feedback only claims a ratio for opaque known colors',()=>{
  assert.equal(opaqueContrast('rgb(0, 0, 0)','rgb(255, 255, 255)'),21);
  assert.equal(opaqueContrast('rgb(10, 20, 30)','rgb(10, 20, 30)'),1);
  assert.equal(opaqueContrast('rgba(10, 20, 30, 0.5)','rgb(255, 255, 255)'),null);
});

test('incomplete authored content may remain a draft but cannot publish visibly; hidden subtrees and legacy data are preserved',()=>{
  const state=createEditorState(createDocument()),rootId=activePage(state).rootId;
  execute(state,{type:'element.add',payload:{type:'container',parentId:rootId,authored:true}});const container=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:'image',parentId:container,authored:true}});const image=state.selection.primaryId;
  validateElementContent(activePage(state).nodes[image]);assert.throws(()=>validatePageForPublication(activePage(state)),/médiaforrást/);
  execute(state,{type:'content.properties.set',payload:{nodeId:image,patch:{src:'/fixture.svg'}}});assert.throws(()=>validatePageForPublication(activePage(state)),/képleírást/);
  execute(state,{type:'content.properties.set',payload:{nodeId:image,patch:{decorative:true}}});validatePageForPublication(activePage(state));
  execute(state,{type:'content.properties.set',payload:{nodeId:image,patch:{src:''}}});
  for(const device of ['desktop','tablet','mobile'])execute(state,{type:'element.visibility.set',payload:{nodeId:container,device,visible:false}});
  validatePageForPublication(activePage(state));assert.equal(activePage(state).nodes[image].props.src,'');
});
