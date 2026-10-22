import test from 'node:test';
import assert from 'node:assert/strict';
import {createDocument} from '../core/schema.js';
import {createEditorState,activePage} from '../core/state.js';
import {execute} from '../core/commands.js';
import {authoredNodeHtml,contentAttributes,contentTag,normalizeElementContent,validateElementContent,validatePageForPublication,contentProperties} from '../core/authored-content.js';
import {opaqueContrast} from '../core/accessibility.js';
import {legacyImageSource,legacyPlaybackSettings,legacyImagePresentation} from '../core/legacy-media-source.js';

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

test('legacy accessibility attributes have one canonical Canvas/Public interpretation',()=>{
  const base={type:'icon',props:{ariaLabel:'Tulajdonság neve'},accessibility:{
    id:'current-anchor',anchorId:'legacy-anchor',label:'Inspector név',ariaLabel:'Régi elnevezés'
  }};
  assert.deepEqual(contentAttributes(base),{
    'aria-label':'Régi elnevezés',role:'img',id:'legacy-anchor'
  },'legacy label/anchor have the same precedence as the original published renderer');
  assert.deepEqual(contentAttributes({...base,accessibility:{id:'current-anchor',label:'Inspector név'}}),{
    'aria-label':'Tulajdonság neve',role:'img',id:'current-anchor'
  },'new editor properties remain functional');
  assert.equal(contentAttributes({...base,accessibility:{id:'current-anchor',anchorId:'not valid',label:'Inspector név'}}).id,'current-anchor');
  assert.equal(contentAttributes({...base,type:'image',props:{},accessibility:{ariaLabel:'Legacy media label'}})['aria-label'],undefined,
    'old public renderer deliberately excluded legacy media labels');
});

test('image focal position supports precise two-axis crops while preserving legacy presets',()=>{
  const image={id:'crop',type:'image',metadata:{contentVersion:1},props:{src:'/image.jpg',alt:'Teszt'}};
  assert.match(authoredNodeHtml({...image,props:{...image.props,focalX:18,focalY:82}}),/object-position:18% 82%/);
  assert.match(authoredNodeHtml({...image,props:{...image.props,focalPoint:'top'}}),/object-position:50% 0%/);
  assert.deepEqual([contentProperties({...image,props:{...image.props,focalPoint:'left'}}).focalX,contentProperties({...image,props:{...image.props,focalPoint:'left'}}).focalY],[0,50]);
  assert.equal(normalizeElementContent(image,{focalX:0,focalY:100}).focalY,100);
  assert.throws(()=>normalizeElementContent(image,{focalX:-1}),/közé/);
  assert.throws(()=>normalizeElementContent(image,{focalY:101}),/közé/);
  assert.match(authoredNodeHtml({...image,type:'gallery',props:{items:[{src:'/image.jpg',alt:'Kép',focalX:20,focalY:70}]}}),/object-position:20% 70%/);
});

test('Médiatár asset ID renders as a private canvas preview and a public route only in published output',()=>{
  const assetId='6b1c2e65-e46e-4764-b234-123456789abc';
  const node={id:'media',type:'image',metadata:{contentVersion:1},props:{assetId,alt:'Márkajel'}};
  assert.equal(normalizeElementContent(node,{assetId}).assetId,assetId);
  assert.match(authoredNodeHtml(node,{editor:true}),new RegExp(`/api/admin/media\\?id=${assetId}`));
  assert.match(authoredNodeHtml(node),new RegExp(`/media/${assetId}`));
  for(const type of ['gallery','carousel']){
    const collection={...node,type,props:{items:[{assetId,src:'/old-image.jpg',alt:'Márkajel'}]}};
    assert.match(authoredNodeHtml(collection,{editor:true}),new RegExp(`data-lightbox-src="/api/admin/media\\?id=${assetId}"`));
    assert.match(authoredNodeHtml(collection),new RegExp(`data-lightbox-src="/media/${assetId}"`));
  }
  assert.throws(()=>normalizeElementContent(node,{assetId:'../private'}),/azonosító/);
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

test('legacy image media library source separates draft and published paths and rejects invalid asset IDs',()=>{
 const assetId='00000000-0000-4000-8000-000000000123';
 const image={assetId,src:'https://example.com/previous.png'};
 assert.equal(legacyImageSource(image,{editor:true}),'/api/admin/media?id='+assetId);
 assert.equal(legacyImageSource(image,{editor:false}),'/media/'+assetId);
 assert.equal(legacyImageSource({assetId:'../../../secret',src:'/fallback.png'}),'/fallback.png');
 assert.equal(legacyImageSource({assetId:'not-an-asset',src:'//untrusted.invalid/image.png'}),'');
 assert.equal(legacyImageSource({assetId:'',src:'https://example.com/photo.png'}),'https://example.com/photo.png');
 assert.equal(legacyImageSource({assetId:'',src:'javascript:alert(1)'}),'');
});

test('legacy playback settings preserve prior controls defaults and prohibit unmuted autoplay',()=>{
 const posterId='00000000-0000-4000-8000-000000000123';
 assert.deepEqual(legacyPlaybackSettings({}, {video:true,editor:false}),{controls:true,loop:false,muted:false,autoplay:false,poster:''});
 assert.deepEqual(legacyPlaybackSettings({controls:false,loop:true,muted:false,autoplay:true,poster:'/poster.svg'},{video:true}),{
  controls:false,loop:true,muted:false,autoplay:false,poster:'/poster.svg'
 });
 const movie={controls:false,loop:true,muted:true,autoplay:true,posterAssetId:posterId,poster:'//blocked.invalid/p.png'};
 assert.deepEqual(legacyPlaybackSettings(movie,{video:true,editor:true}),{
  controls:false,loop:true,muted:true,autoplay:false,poster:'/api/admin/media?id='+posterId
 });
 assert.deepEqual(legacyPlaybackSettings(movie,{video:true,editor:false}),{
  controls:false,loop:true,muted:true,autoplay:true,poster:'/media/'+posterId
 });
 assert.deepEqual(legacyPlaybackSettings({controls:false,loop:true,muted:true,autoplay:true,poster:'/poster.svg'}),{
  controls:false,loop:true,muted:false,autoplay:false,poster:''
 });
 assert.equal(legacyPlaybackSettings({poster:'https://valid.example/path.png',posterAssetId:'invalid'},{video:true}).poster,'https://valid.example/path.png');
 assert.equal(legacyPlaybackSettings({poster:'javascript:alert(1)'},{video:true}).poster,'');
});

test('legacy image crop, ratio and load settings share allowlisted defaults and safe bounds',()=>{
 const defaults=legacyImagePresentation({});
 assert.deepEqual(defaults,{fit:'cover',ratio:'auto',focalX:50,focalY:50,objectPosition:'50% 50%',loading:'lazy',alt:'',decorative:false});
 assert.deepEqual(legacyImagePresentation({objectFit:'contain',ratio:'16 / 9',focalX:17,focalY:82,loading:'eager',alt:'Napló kép'}),{
  fit:'contain',ratio:'16 / 9',focalX:17,focalY:82,objectPosition:'17% 82%',loading:'eager',alt:'Napló kép',decorative:false
 });
 const decorative=legacyImagePresentation({objectFit:'scale-down',ratio:'3 / 4',focalX:'125',focalY:-20,decorative:true,alt:'Megőrzendő szöveg'});
 assert.equal(decorative.objectPosition,'100% 0%');
 assert.equal(decorative.alt,'');assert.equal(decorative.decorative,true);
 assert.equal(legacyImagePresentation({focalPoint:'top'}).objectPosition,'50% 0%');
 assert.deepEqual(legacyImagePresentation({fit:'url(javascript:bad)',objectFit:'unknown',ratio:'666 / 0',focalX:'NaN',focalY:'Infinity',loading:'script'}),defaults);
 assert.equal(legacyImagePresentation({fit:'fill',ratio:'1 / 1'}).fit,'fill');
 assert.equal(legacyImagePresentation({fit:'fill',objectFit:'contain'}).fit,'contain','the legacy Inspector must override an older fit alias');
});
