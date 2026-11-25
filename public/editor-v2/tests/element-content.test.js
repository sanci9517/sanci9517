import {countdownISOToLocal,countdownLocalToISO} from '../core/countdown-local-time.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDocument} from '../core/schema.js';
import {createEditorState,activePage} from '../core/state.js';
import {execute} from '../core/commands.js';
import {AUTHORED_TABLE_LIMITS,MAX_AUTHORED_TABLE_JSON_CHARS,MAX_AUTHORED_TABLE_TSV_CHARS,authoredNodeHtml,contentAttributes,contentTag,normalizeElementContent,normalizeContentField,CONTENT_FIELDS,validateElementContent,validatePageForPublication,contentProperties,imageFocalPosition} from '../core/authored-content.js';
import {parseTableTsv,serializeTableTsv} from '../core/table-tsv.js';
import {normalizeAccessibility,opaqueContrast} from '../core/accessibility.js';
import {legacyImageSource,legacyPlayableSource,legacyPlaybackSettings,legacyImagePresentation,legacyImageCaption,legacyMediaInspectorValues,applyReducedMotionVideoPlayback} from '../core/legacy-media-source.js';
import {safePublishedMediaUrl as safeStructuredPublishedMediaUrl} from '../core/element-content.js';

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
  assert.throws(()=>normalizeElementContent(node('table'),{rows:[['Fejléc','Érték'],['Csak egy cella']]}),/oszlop/);
  assert.throws(()=>normalizeElementContent(node('table'),{rows:[[]]}),/oszlop/);
  assert.throws(()=>validateElementContent({...node('table'),props:{rows:[['Fejléc','Érték'],['Hiányos']]} }),/oszlop/);
  assert.throws(()=>normalizeElementContent(node('gallery'),{items:new Array(41).fill({src:'/a.png'})}));
  assert.equal(contentProperties(node('video')).controls,true);
  assert.equal(contentProperties(node('heading')).level,'2');
  assert.throws(()=>validateElementContent({...node('heading'),props:{level:'8'}}));
});

test('authored muted autoplay becomes manually controllable for reduced-motion visitors',()=>{
 const video={id:'motion-aware-video',type:'video',metadata:{contentVersion:1},props:{src:'/video.webm',controls:false,muted:true,autoplay:true,loop:true}};
 const standard=authoredNodeHtml(video);
 assert.match(standard,/<video[^>]* muted autoplay[^>]*>/,'standard motion preference retains the explicitly authored muted background mode');
 assert.match(standard,/data-reduced-motion-autoplay="true" data-reduced-motion-controls="false"/,'the renderer records only the safe playback preference needed for an in-place update');
 assert.doesNotMatch(standard,/<video[^>]* controls/);
 const reduced=authoredNodeHtml(video,{reducedMotion:true});
 assert.match(reduced,/<video[^>]* controls[^>]* muted/,'reduced-motion mode reveals a native play/pause control');
 assert.doesNotMatch(reduced,/<video[^>]* autoplay/,'reduced-motion mode disables automatic playback');
 assert.match(authoredNodeHtml(video,{editor:true}),/<video[^>]* controls[^>]* muted/,'the Editor suppresses autoplay without hiding the manual playback control');
});

test('authored carousel controls reference their own navigable region',()=>{
 const html=authoredNodeHtml({id:'featured-images',type:'carousel',metadata:{contentVersion:1},props:{items:[
  {src:'/first.jpg',alt:'Első kép'},{src:'/second.jpg',alt:'Második kép'}
 ]}});
 const regionId=html.match(/<div class="creator-carousel" id="([^"]+)"/)?.[1];
 assert.equal(regionId,'creator-safe-featured-images-carousel','the carousel region has a stable, node-scoped ID');
 const controlIds=[...html.matchAll(/data-carousel-step="-?1" aria-controls="([^"]+)"/g)].map(match=>match[1]);
 assert.deepEqual(controlIds,[regionId,regionId],'both external navigation buttons identify the carousel they move');
 const slides=[...html.matchAll(/<figure role="group" aria-roledescription="dia" aria-label="([^"]+)">/g)].map(match=>match[1]);
 assert.deepEqual(slides,['1. / 2. dia','2. / 2. dia'],'each slide exposes its position within the named carousel');
 assert.match(html,/<span class="creator-carousel-status" data-carousel-status role="status" aria-live="polite" aria-atomic="true">1 \/ 2<\/span>/,
  'the carousel starts with an atomic, polite live position for assistive technology');
});

test('reduced-motion changes update only eligible videos and preserve their DOM identity',()=>{
 const video={dataset:{reducedMotionAutoplay:'true',reducedMotionControls:'false'},muted:true,autoplay:true,controls:false,paused:false,pause(){this.paused=true}};
 const root={querySelectorAll:selector=>{assert.equal(selector,'video[data-reduced-motion-autoplay="true"]');return [video]}};
 assert.equal(applyReducedMotionVideoPlayback(root,{reducedMotion:true}),1);
 assert.equal(video.autoplay,false);assert.equal(video.controls,true);assert.equal(video.paused,true);
 assert.equal(applyReducedMotionVideoPlayback(root,{reducedMotion:false}),1);
 assert.equal(video.autoplay,true);assert.equal(video.controls,false);assert.equal(video.paused,true);
 assert.equal(applyReducedMotionVideoPlayback(root,{reducedMotion:false,editor:true}),1);
 assert.equal(video.autoplay,false);assert.equal(video.controls,true,'the Editor always keeps controls while suppressing authored autoplay');
 const unmuted={dataset:{reducedMotionAutoplay:'true',reducedMotionControls:'false'},muted:false,autoplay:false,controls:false,pause(){throw new Error('unmuted media is never paused or auto-started by preference handling')}};
 assert.equal(applyReducedMotionVideoPlayback({querySelectorAll:()=>[unmuted]},{reducedMotion:false}),1);
 assert.equal(unmuted.autoplay,false);assert.equal(unmuted.controls,false);
});

test('authored tables retain their own 100-row and 16-column contract through public rendering',()=>{
  const authored={id:'authored-table-boundaries',type:'table',metadata:{contentVersion:1},props:{header:true}};
  const rows=Array.from({length:100},(_,row)=>Array.from({length:16},(_,column)=>`r${row}-c${column}`));
  const normalized=normalizeElementContent(authored,{rows});
  assert.equal(normalized.rows.length,100);
  assert.equal(normalized.rows[0].length,16);
  assert.equal(normalized.rows[99][15],'r99-c15');
  validateElementContent({...authored,props:normalized});
  const html=authoredNodeHtml({...authored,props:normalized});
  assert.equal((html.match(/<tr>/g)||[]).length,100,'published renderer retains every supported row');
  assert.equal((html.match(/<td>/g)||[]).length,99*16,'published renderer retains every supported body cell');
  assert.equal((html.match(/<th scope="col">/g)||[]).length,16,'published renderer retains the full header width');
  assert.doesNotThrow(()=>validatePageForPublication({rootId:'root',nodes:{
    root:{id:'root',type:'root',children:[authored.id]},
    [authored.id]:{...authored,children:[],props:normalized}
  }}),'the page-level Publish gate accepts the same authored-v1 boundary');
  assert.throws(()=>normalizeElementContent(authored,{rows:[...rows,Array(16).fill('extra')]}),/100 sor/);
  assert.throws(()=>normalizeElementContent(authored,{rows:[Array(17).fill('extra')]}),/1–16 oszlop/);
});

test('authored table TSV contract covers the full model and preserves quoted cell delimiters',()=>{
  assert.equal(AUTHORED_TABLE_LIMITS.rows,100);
  assert.equal(AUTHORED_TABLE_LIMITS.columns,16);
  assert.equal(AUTHORED_TABLE_LIMITS.cellCharacters,2000);
  assert.equal(MAX_AUTHORED_TABLE_JSON_CHARS,120000,
    'serialized table content reserves room under the server 180,000-character Page Model cap');
  assert.equal(MAX_AUTHORED_TABLE_TSV_CHARS,180000,
    'the textarea does not truncate at the smaller serialized content budget');
  assert.equal(CONTENT_FIELDS.table.find(field=>field.key==='rows').max,MAX_AUTHORED_TABLE_TSV_CHARS);
  const tableNode={id:'table-budget',type:'table',metadata:{contentVersion:1},props:{}};
  const withinBudget=Array.from({length:3},()=>Array(16).fill('x'.repeat(2000)));
  const accepted=normalizeContentField(CONTENT_FIELDS.table.find(field=>field.key==='rows'),withinBudget);
  assert.ok(JSON.stringify(accepted).length<=MAX_AUTHORED_TABLE_JSON_CHARS,
    'a dense table near 100 KB JSON remains within the persistable table budget');
  const state=createEditorState(createDocument()),parentId=activePage(state).rootId;
  execute(state,{type:'element.add',payload:{type:'table',parentId}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'content.properties.set',payload:{nodeId,patch:{rows:accepted}}});
  assert.ok(JSON.stringify(state.document).length<180000,
    'a dense table inside its budget fits a minimal saved Page Model under the route limit');
  const overBudget=[...withinBudget,Array(16).fill('x'.repeat(2000))];
  assert.throws(()=>normalizeElementContent(tableNode,{rows:overBudget}),/120 000 karakter/,
    'the Inspector rejects a valid cell/row shape that could not fit in the documented Save limit');
  const quoteHeavy=Array.from({length:3},()=>Array(16).fill('"'.repeat(1300)));
  assert.ok(serializeTableTsv(quoteHeavy).length<MAX_AUTHORED_TABLE_TSV_CHARS,
    'escaped quotes remain below the generous textarea ceiling');
  assert.throws(()=>normalizeElementContent(tableNode,{rows:quoteHeavy}),/120 000 karakter/,
    'the persisted JSON budget accounts for quote escaping rather than raw TSV length alone');
  const before=structuredClone(state.document);
  assert.throws(()=>execute(state,{type:'content.properties.set',payload:{nodeId,patch:{rows:overBudget}}}),/120 000 karakter/,
    'the command rejects the over-budget table before a draft mutation');
  assert.deepEqual(state.document,before,'an invalid large table cannot mutate the saved editor model');
  const rows=[['Fejléc','Második'],['Tabulátor\t a cellában','Két sor\nfolytatás'],['Idézet: "igen"','CRLF\r\nmegmarad']];
  const text=serializeTableTsv(rows);
  assert.deepEqual(parseTableTsv(text),rows,'quotes, embedded tabs, LF and CRLF survive an Inspector edit round trip');
  for(const value of ['x'.repeat(2000),'"'.repeat(2000),'\\'.repeat(2000),'\t'.repeat(2000),'\n'.repeat(2000),'\r'.repeat(2000),'\r\n'.repeat(1000),'\u0000'.repeat(2000)]){
    const encoded=serializeTableTsv([[value]]),decoded=parseTableTsv(encoded);
    assert.ok(encoded.length<=JSON.stringify(decoded).length,
      'the 180,000-character textarea cap cannot truncate a table whose serialized rows fit the 120,000-character persisted budget');
  }
  assert.deepEqual(parseTableTsv('A\tB\r\nC\tD'),[['A','B'],['C','D']],
    'ordinary Excel-style CRLF TSV remains supported');
  assert.deepEqual(parseTableTsv('A\tB\r\nC\tD\r\n'),[['A','B'],['C','D']],
    'a terminal Excel line ending does not create a phantom one-cell row');
  assert.deepEqual(parseTableTsv('A\tB\n'),[['A','B']],
    'a terminal LF has the same no-phantom-row behavior as Excel CRLF');
  assert.deepEqual(parseTableTsv('A\tB\rC\tD\r'),[['A','B'],['C','D']],
    'legacy CR-only records and one terminal CR do not create a phantom row');
  assert.deepEqual(parseTableTsv('A\tB\n\n'),[['A','B'],['']],
    'an additional blank record remains distinguishable from one terminal line ending');
  assert.deepEqual(parseTableTsv('A\tB\r\r'),[['A','B'],['']],
    'an explicit blank CR-only record remains distinguishable from one terminal CR');
  assert.throws(()=>parseTableTsv('"lezáratlan\tcell'),/nincs lezárva/);
  assert.throws(()=>parseTableTsv('"idézett"utótag\tB'),/záró idézőjel/);
});

test('authored public media never coerces malformed persisted sources into URLs',()=>{
 const src='/media/00000000-0000-4000-8000-000000000123';
 const node=(type,props)=>({id:'malformed-source',type,metadata:{contentVersion:1},props});
 for(const malformed of [[src],{toString:()=>src}]){
  for(const type of ['image','video','audio']){
   assert.doesNotMatch(authoredNodeHtml(node(type,{src:malformed,alt:'Kép'})),/\/media\/00000000/);
  }
  for(const type of ['gallery','carousel']){
   assert.doesNotMatch(authoredNodeHtml(node(type,{items:[{src:malformed,alt:'Kép',label:'Dia',content:'Tartalom'}]})),/\/media\/00000000/);
  }
 }
 assert.match(authoredNodeHtml(node('image',{src,alt:'Kép'})),/\/media\/00000000/);
});

test('authored markup escapes text, preserves link security and uses native accessible structures',()=>{
  const node={id:'node-1',type:'button',metadata:{contentVersion:1},props:{text:'<img src=x onerror=alert(1)>',href:'/p/home',target:'_blank',ariaLabel:'Kezdőlap'}};
  assert.equal(contentTag(node),'a');assert.deepEqual(contentAttributes(node),{href:'/p/home',target:'_blank',rel:'noopener noreferrer','aria-label':'Kezdőlap'});
  assert.match(authoredNodeHtml(node),/&lt;img/);assert.doesNotMatch(authoredNodeHtml(node),/<img/);
  assert.match(authoredNodeHtml({...node,type:'tabs',props:{items:[{title:'Első',text:'<script>test</script>'},{title:'Második',text:'Második tartalom'}]}}),/role="tabpanel"/);
  assert.match(authoredNodeHtml({...node,type:'accordion',props:{items:[{title:'Kérdés',text:'Válasz'}]}}),/<details><summary>Kérdés/);
  const authoredTable=authoredNodeHtml({...node,type:'table',props:{caption:'Eredmények',header:true,rows:[['Név','Érték'],['Teszt','42']]}});
  assert.match(authoredTable,/<div class="creator-table-scroll" role="region" aria-label="Eredmények" tabindex="0"><table aria-label="Eredmények"><caption>Eredmények<\/caption>/);
  assert.match(authoredTable,/<th scope="col">/);
  const unnamedTable=authoredNodeHtml({...node,type:'table',props:{header:false,rows:[['Név'],['Teszt']]}});
  assert.match(unnamedTable,/<table aria-label="Táblázat">/,'the native public table role has a name even when the optional caption is blank');
  const escapedTable=authoredNodeHtml({...node,type:'table',props:{caption:'Éves <eredmények>',rows:[['Név'],['Teszt']]}});
  assert.match(escapedTable,/<table aria-label="Éves &lt;eredmények&gt;"><caption>Éves &lt;eredmények&gt;<\/caption>/,'caption text is escaped in both visible and accessible names');
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

test('gallery crop views preserve legacy presets and partial axes without materializing saved defaults',()=>{
 const presets={center:[50,50],top:[50,0],bottom:[50,100],left:[0,50],right:[100,50]};
 for(const [focalPoint,[focalX,focalY]] of Object.entries(presets)){
  const item=Object.freeze({src:'/image.jpg',alt:'Régi kép',focalPoint});
  const before=structuredClone(item);
  assert.deepEqual(imageFocalPosition(item),{focalX,focalY});
  for(const type of ['gallery','carousel']){
   const node={id:'legacy-crop',type,metadata:{contentVersion:1},props:{items:Object.freeze([item])}};
   assert.match(authoredNodeHtml(node),new RegExp(`object-position:${focalX}% ${focalY}%`));
   const changed=normalizeElementContent(node,{items:[{...item,caption:'Új felirat'}]});
   assert.equal(Object.hasOwn(changed.items[0],'focalX'),false);
   assert.equal(Object.hasOwn(changed.items[0],'focalY'),false);
  }
  assert.deepEqual(item,before);
 }
 assert.deepEqual(imageFocalPosition({focalPoint:'top',focalX:24}),{focalX:24,focalY:0});
 assert.deepEqual(imageFocalPosition({focalPoint:'right',focalY:68}),{focalX:100,focalY:68});
 assert.deepEqual(imageFocalPosition({focalPoint:'top',focalX:-5,focalY:120}),{focalX:0,focalY:100});
 assert.deepEqual(imageFocalPosition({focalPoint:'right',focalX:'invalid'}),{focalX:100,focalY:50});
 for(const focalPoint of ['constructor','__proto__','unknown',null])assert.deepEqual(imageFocalPosition({focalPoint}),{focalX:50,focalY:50});
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

test('authored audio and video expose only their playable Media Library formats',()=>{
  const assetId='6b1c2e65-e46e-4764-b234-123456789abc';
  for(const {type,kind,label,mimes} of [
    {type:'audio',kind:'audio',label:'Hang a Médiatárból',mimes:['audio/mpeg','audio/ogg','audio/wav']},
    {type:'video',kind:'video',label:'Videó a Médiatárból',mimes:['video/webm']}
  ]){
    const definition=CONTENT_FIELDS[type].find(field=>field.key==='assetId');
    assert.ok(definition,`${type} has a typed Media Library source field`);
    assert.equal(definition.label,label);
    assert.equal(definition.type,'asset');
    assert.equal(definition.selectedKind,kind);
    assert.deepEqual(definition.mimes,mimes);
    const props={src:'',assetId,controls:true,loop:false,muted:true,autoplay:false,poster:'',posterAssetId:''};
    const node={id:'authored-'+type,type,metadata:{contentVersion:1},props};
    assert.equal(normalizeElementContent(node,{assetId}).assetId,assetId);
    validateElementContent(node);
    assert.match(authoredNodeHtml(node,{editor:true}),new RegExp(`/api/admin/media\\?id=${assetId}`));
    assert.match(authoredNodeHtml(node),new RegExp(`/media/${assetId}`));
    assert.throws(()=>normalizeElementContent(node,{assetId:'../untrusted'}),/azonosító/);
  }
});

test('structured public media rejects multiply encoded private Editor preview routes',()=>{
  const privateUrls=[
    '/api/admin/media?id=asset',
    '/api/%61dmin/media?id=asset',
    '/%2fapi%2fadmin%2fmedia?id=asset',
    '/%252fapi%252fadmin%252fmedia?id=asset',
    '/%255capi%255cadmin%255cmedia?id=asset',
    '/%2561pi%252fadmin%252fmedia?id=asset',
    '/%25252561pi%2525252fadmin%2525252fmedia?id=asset',
    '/public/%252e%252e/%2561pi/%61dmin/media?id=asset'
  ];
  for(const src of privateUrls){
    assert.equal(safeStructuredPublishedMediaUrl(src),'',src);
    for(const type of ['gallery','carousel']){
      const content=type==='gallery'
        ? {version:1,items:[{src,alt:'Privát kép',caption:''}]}
        : {version:1,items:[{src,label:'Dia',content:'Leírás',alt:'Privát kép'}]};
      const html=renderStructuredContent(type,content,'private-'+type);
      assert.doesNotMatch(html,/<img[^>]*src=/,`${type} cannot render private media URL: ${src}`);
      assert.doesNotMatch(html,/data-lightbox-src=/,`${type} cannot create a private lightbox URL: ${src}`);
    }
  }
  assert.equal(safeStructuredPublishedMediaUrl('/media/00000000-0000-4000-8000-000000000123'),'/media/00000000-0000-4000-8000-000000000123');
  assert.equal(safeStructuredPublishedMediaUrl('https://cdn.example.test/image.webp'),'https://cdn.example.test/image.webp');
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

test('legacy image focal points reject malformed persisted values without shifting the crop',()=>{
 const top={focalPoint:'top',focalX:' ',focalY:true};
 assert.deepEqual([legacyImagePresentation(top).focalX,legacyImagePresentation(top).focalY],[50,0]);
 const right={focalPoint:'right',focalX:[],focalY:{value:90}};
 assert.deepEqual([legacyImagePresentation(right).focalX,legacyImagePresentation(right).focalY],[100,50]);
 assert.equal(legacyImagePresentation({focalX:' 75 ',focalY:22.6}).objectPosition,'75% 23%');
 assert.equal(legacyImagePresentation({focalPoint:'right',focalX:'0x10',focalY:'0b11'}).objectPosition,'100% 50%');
 assert.equal(legacyImagePresentation({focalPoint:'top',focalX:'0o12',focalY:'12px'}).objectPosition,'50% 0%');
 assert.equal(legacyImagePresentation({focalX:-8,focalY:111}).objectPosition,'0% 100%');
});

test('legacy image presets ignore inherited object properties in old saved pages',()=>{
 for(const focalPoint of ['constructor','toString','valueOf','__proto__','hasOwnProperty']){
  const appearance=legacyImagePresentation({focalPoint,focalX:null,focalY:'invalid'});
  assert.equal(appearance.objectPosition,'50% 50%',focalPoint);
 }
 for(const focalPoint of [null,42,true,[],{toString:null},{valueOf:null,toString:null}]){
  assert.equal(legacyImagePresentation({focalPoint}).objectPosition,'50% 50%');
 }
 assert.equal(legacyImagePresentation({focalPoint:'right'}).objectPosition,'100% 50%');
 assert.equal(legacyImagePresentation({focalPoint:'top',focalX:'80'}).objectPosition,'80% 0%');
});

test('legacy image alt safely handles malformed persisted structured values',()=>{
 for(const alt of [{toString:null},{valueOf:null,toString:null},['not','an','alt'],true,{}]){
  assert.equal(legacyImagePresentation({alt}).alt,'');
 }
 assert.equal(legacyImagePresentation({alt:'Saját fotó'}).alt,'Saját fotó');
 assert.equal(legacyImagePresentation({alt:12}).alt,'12');
 assert.equal(legacyImagePresentation({alt:'Megőrzött leírás',decorative:true}).alt,'');
});

test('legacy image captions keep only supported visible text',()=>{
 assert.equal(legacyImageCaption({caption:'  Saját képaláírás  '}),'Saját képaláírás');
 assert.equal(legacyImageCaption({caption:{toString:null}}),'');
 assert.equal(legacyImageCaption({caption:12}),'');
 assert.equal(legacyImageCaption({caption:'x'.repeat(1200)}).length,1000);
});

test('legacy media source ignores malformed structured URLs without throwing',()=>{
 for(const src of [{toString:null},{valueOf:null,toString:null},['/unsafe.svg'],true,123]){
  assert.equal(legacyImageSource({src}), '');
  assert.equal(legacyPlaybackSettings({poster:src},{video:true}).poster,'');
 }
 assert.equal(legacyImageSource({src:'/valid.svg'}),'/valid.svg');
 assert.equal(legacyImageSource({src:'https://example.com/media.png'}),'https://example.com/media.png');
});

test('legacy public media sources never expose private editor previews',()=>{
 const preview='/api/admin/media?id=00000000-0000-4000-8000-000000000123';
 for(const source of [legacyImageSource,legacyPlayableSource]){
  for(const src of [preview,'/api/%61dmin/media?id=x','/foo/../api/admin/media?id=x'])assert.equal(source({src}), '');
  assert.equal(source({src:preview},{editor:true}),preview);
  assert.equal(source({src:'/media/00000000-0000-4000-8000-000000000123'}),'/media/00000000-0000-4000-8000-000000000123');
 }
 assert.equal(legacyPlaybackSettings({poster:preview},{video:true}).poster,'');
 assert.equal(legacyPlaybackSettings({poster:preview},{video:true,editor:true}).poster,preview);
});

test('legacy video and audio reject corrupt nonstring source without coercion',()=>{
 const assetId='00000000-0000-4000-8000-000000000123';
 for(const src of [null,42,true,['/fixture.webm'],{toString:null},{valueOf:null,toString:null}]){
  assert.equal(legacyPlayableSource({src}), '',String(typeof src));
 }
 assert.equal(legacyPlayableSource({src:'/fixture.webm'}),'/fixture.webm');
 assert.equal(legacyPlayableSource({src:'https://example.com/audio.mp3'}),'https://example.com/audio.mp3');
 assert.equal(legacyPlayableSource({src:'javascript:alert(1)'}),'');
 assert.equal(legacyPlayableSource({assetId,src:'https://example.com/old.webm'},{editor:true}),'/api/admin/media?id='+assetId);
 assert.equal(legacyPlayableSource({assetId,src:'https://example.com/old.webm'}),'/media/'+assetId);
 assert.equal(legacyPlayableSource({assetId:'not-an-asset',src:'/fixture.webm'}),'/fixture.webm');
});

test('legacy playback settings preserve prior controls defaults and prohibit unmuted autoplay',()=>{
 const posterId='00000000-0000-4000-8000-000000000123';
 assert.deepEqual(legacyPlaybackSettings({}, {video:true,editor:false}),{controls:true,loop:false,muted:false,autoplay:false,poster:''});
 assert.deepEqual(legacyPlaybackSettings({controls:false,loop:true,muted:false,autoplay:true,poster:'/poster.svg'},{video:true}),{
  controls:false,loop:true,muted:false,autoplay:false,poster:'/poster.svg'
 });
 const movie={controls:false,loop:true,muted:true,autoplay:true,posterAssetId:posterId,poster:'//blocked.invalid/p.png'};
 assert.deepEqual(legacyPlaybackSettings(movie,{video:true,editor:true}),{
  controls:true,loop:true,muted:true,autoplay:false,poster:'/api/admin/media?id='+posterId
 });
 assert.deepEqual(legacyPlaybackSettings(movie,{video:true,editor:false}),{
  controls:false,loop:true,muted:true,autoplay:true,poster:'/media/'+posterId
 });
 assert.deepEqual(legacyPlaybackSettings(movie,{video:true,editor:false,reducedMotion:true}),{
  controls:true,loop:true,muted:true,autoplay:false,poster:'/media/'+posterId
 },'reduced-motion visitors receive manual controls instead of a controls-free autoplay video');
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


test('legacy media Inspector rejects structured JSON without coercion or mutating persisted values',()=>{
 const bad={toString:'not callable',valueOf:'not callable'};
 for(const value of [bad,{},[],['/image.png'],true,false,19,Infinity]){
  const props=Object.freeze({src:value,poster:value,assetId:value,posterAssetId:value,alt:value});
  const before=structuredClone(props);
  const view=legacyMediaInspectorValues(props);
  assert.equal(view.src,'');assert.equal(view.poster,'');assert.equal(view.assetId,'');assert.equal(view.posterAssetId,'');
  assert.equal(view.alt,typeof value==='number'&&Number.isFinite(value)?String(value):'');
  assert.ok(view.invalidFields.includes('src'));assert.ok(view.invalidFields.includes('posterAssetId'));
  assert.deepEqual(props,before);
 }
 const id='00000000-0000-4000-8000-000000000123';
 assert.deepEqual(legacyMediaInspectorValues({src:'/image.png',poster:'/poster.png',alt:0,assetId:id,posterAssetId:id}),{
  src:'/image.png',poster:'/poster.png',alt:'0',assetId:id,posterAssetId:id,invalidFields:[]
 });
 assert.deepEqual(legacyMediaInspectorValues(null),{src:'',poster:'',alt:'',assetId:'',posterAssetId:'',invalidFields:[]});
 const decorative=legacyMediaInspectorValues({alt:'Megőrzött képleírás',decorative:true,assetId:'invalid'});
 assert.equal(decorative.alt,'Megőrzött képleírás');assert.deepEqual(decorative.invalidFields,['assetId']);
});

test('Countdown local time rejects nonexistent wall times in multiple time zones',()=>{
 const previousTimezone=process.env.TZ;
 try{
  for(const [zone,gap,valid,iso] of [
   ['Europe/Budapest','2030-03-31T02:30','2030-03-31T03:30','2030-03-31T01:30:00.000Z'],
   ['America/New_York','2030-03-10T02:30','2030-03-10T03:30','2030-03-10T07:30:00.000Z']]){
   process.env.TZ=zone;assert.throws(()=>countdownLocalToISO(gap),/nem létezik/);assert.equal(countdownLocalToISO(valid),iso);
  }
  process.env.TZ='UTC';
  for(const invalid of ['2030-02-30T12:00','2030-12-31T24:00','2030-13-01T12:00','2030-01-01T12:60','not a date','2030-01-01T12:00Z'])assert.throws(()=>countdownLocalToISO(invalid));
  for(const outside of ['1999-12-31T23:59','2101-01-01T00:00'])assert.throws(()=>countdownLocalToISO(outside),/2000 és 2100/);
  assert.equal(countdownLocalToISO(''),'');
 }finally{if(previousTimezone===undefined)delete process.env.TZ;else process.env.TZ=previousTimezone;}
});
test('Countdown local view preserves sub-minute precision and canonical instants',()=>{
 const previousTimezone=process.env.TZ;
 try{
  for(const zone of ['Europe/Budapest','America/New_York','UTC']){
   process.env.TZ=zone;
   for(const iso of ['2030-12-31T20:30:00.000Z','2030-12-31T20:30:42.000Z','2030-12-31T20:30:42.123Z','2030-12-31T20:30:00.007Z'])assert.equal(countdownLocalToISO(countdownISOToLocal(iso)),iso);
  }
  for(const invalid of ['',null,undefined,'invalid'])assert.equal(countdownISOToLocal(invalid),'');
 }finally{if(previousTimezone===undefined)delete process.env.TZ;else process.env.TZ=previousTimezone;}
});


test('explicit accessibility edits replace their own legacy alias and Undo restores the full snapshot',()=>{
 const state=createEditorState(createDocument());execute(state,{type:'element.add',payload:{type:'section'}});const id=state.selection.primaryId;
 const legacy={label:'Old canonical',id:'old-canonical',ariaLabel:'Legacy label',anchorId:'legacy-anchor',lang:'hu'};
 execute(state,{type:'element.update',payload:{nodeId:id,patch:{accessibility:legacy}}});const before=structuredClone(activePage(state).nodes[id]);
 execute(state,{type:'accessibility.set',payload:{nodeId:id,patch:{label:'New label'}}});let node=activePage(state).nodes[id];
 assert.equal(Object.hasOwn(node.accessibility,'ariaLabel'),false);assert.equal(node.accessibility.anchorId,'legacy-anchor');assert.equal(contentAttributes(node)['aria-label'],'New label');
 execute(state,{type:'history.undo'});assert.deepEqual(activePage(state).nodes[id],before);
 execute(state,{type:'accessibility.set',payload:{nodeId:id,patch:{id:'new-anchor'}}});node=activePage(state).nodes[id];
 assert.equal(Object.hasOwn(node.accessibility,'anchorId'),false);assert.equal(node.accessibility.ariaLabel,'Legacy label');assert.equal(contentAttributes(node).id,'new-anchor');
 execute(state,{type:'history.undo'});assert.deepEqual(activePage(state).nodes[id],before);
});
test('accessibility validation remains pure and preserves unrelated aliases and root identity rules',()=>{
 const node={id:'node',type:'section',accessibility:{ariaLabel:'Legacy label',anchorId:'legacy-anchor',lang:'hu'}},before=structuredClone(node);
 const changed=normalizeAccessibility(node,{lang:'de'},{node});assert.equal(changed.ariaLabel,'Legacy label');assert.equal(changed.anchorId,'legacy-anchor');assert.deepEqual(node,before);
 assert.throws(()=>normalizeAccessibility(node,{id:'taken'},{node,other:{id:'other',accessibility:{id:'taken'}}}),/foglalt/);
 assert.throws(()=>normalizeAccessibility(node,{lang:'h'}),/nyelv/);assert.throws(()=>normalizeAccessibility({...node,type:'root'},{id:'new-root'}),/védett/);assert.deepEqual(node,before);
});


import {safeMediaUrl as safeStructuredMediaUrl,renderElementContent as renderStructuredContent,validateElementContent as validateStructuredContent} from '../core/element-content.js';

test('legacy structured content ignores malformed JSON object values without losing safe neighboring items',()=>{
  const malformed={toString:null};
  const objectWithUrl={toString:()=>'/media/00000000-0000-4000-8000-000000000123'};
  assert.equal(safeStructuredMediaUrl(malformed),'','malformed object must not be String-coerced');
  assert.equal(safeStructuredMediaUrl(objectWithUrl),'','custom toString cannot fabricate a media URL');
  assert.equal(safeStructuredMediaUrl(['/media/00000000-0000-4000-8000-000000000123']),'','array cannot fabricate a URL');
  assert.equal(safeStructuredMediaUrl('/image.png'),'/image.png','valid relative URL preserved');
  const list=renderStructuredContent('list',{version:1,ordered:false,items:[malformed,'Ép listaelem']},'list-legacy');
  assert.match(list,/Ép listaelem/);
  assert.doesNotMatch(list,/\[object Object\]|visual-structured-error/);
  const table=renderStructuredContent('table',{version:1,rows:[['Cím'],[malformed],['Ép sor']]},'table-legacy');
  assert.match(table,/<td>Ép sor<\/td>/);
  assert.doesNotMatch(table,/\[object Object\]|visual-structured-error/);
  const gallery={version:1,items:[{src:objectWithUrl,alt:'Régi kép'},{src:'/image.jpg',alt:'Ép kép'}]};
  assert.equal(validateStructuredContent('gallery',gallery),'INVALID_GALLERY_IMAGE','invalid item remains unpublishable');
  const galleryHtml=renderStructuredContent('gallery',gallery,'gallery-legacy');
  assert.match(galleryHtml,/<img src="\/image.jpg"/);
  assert.doesNotMatch(galleryHtml,/\/media\/00000000-0000-4000-8000-000000000123|\[object Object\]/);
  const validEscaped=renderStructuredContent('list',{version:1,items:['<script>alert("x")<\/script>']},'list-escaped');
  assert.match(validEscaped,/&lt;script&gt;/);
  assert.doesNotMatch(validEscaped,/<script>/);
});

test('structured tables, tabs, gallery and carousel render escaped, bounded accessible names',()=>{
 const gallery={version:1,items:[{src:'/image.jpg',alt:'Egy kép',caption:''}]};
 const carousel={version:1,items:[{label:'Dia',content:'Szöveg',src:'',alt:''}]};
 const table={version:1,rows:[['Fejléc'],['Adat']]};
 const tabs={version:1,items:[{label:'Fül',content:'Tartalom'}]};
 const namedGallery=renderStructuredContent('gallery',gallery,'gallery',{ariaLabel:' Műhely & <képek> '});
 const namedCarousel=renderStructuredContent('carousel',carousel,'carousel',{ariaLabel:'Kiemelt <stream>'});
 const namedTable=renderStructuredContent('table',table,'table',{ariaLabel:'Táblázat & <adat>'});
 const namedTabs=renderStructuredContent('tabs',tabs,'tabs',{ariaLabel:'Fülek & <témák>'});
 assert.match(namedGallery,/<div class="visual-structured-gallery"[^>]*role="region"[^>]*aria-label="Műhely &amp; &lt;képek&gt;"/,
  'the gallery has a named region and the label is HTML-escaped');
 assert.match(namedCarousel,/<section class="visual-structured-carousel"[^>]*aria-label="Kiemelt &lt;stream&gt;"/,
  'the carousel region is named and the label is HTML-escaped');
 assert.match(namedTable,/<div class="visual-structured-table-scroll"[^>]*role="region"[^>]*aria-label="Táblázat &amp; &lt;adat&gt;"/,
  'the scrollable table region uses its authored escaped accessible name');
 assert.match(namedTabs,/<div role="tablist" aria-label="Fülek &amp; &lt;témák&gt;"/,
  'the tablist uses its authored escaped accessible name');
 assert.match(renderStructuredContent('gallery',gallery,'gallery'),/role="region"[^>]*aria-label="Képgaléria"/,
  'older structured documents retain an accessible Hungarian fallback name');
 assert.match(renderStructuredContent('carousel',carousel,'carousel',{ariaLabel:{toString(){throw Error('must not coerce objects')}}}),/aria-label="Képkörhinta"/,
  'invalid object-valued labels are not coerced into public markup');
 assert.match(renderStructuredContent('gallery',gallery,'gallery',{ariaLabel:'x'.repeat(200)}),new RegExp(`aria-label="${'x'.repeat(160)}"`),
  'public region names stay within the authored field limit');
 assert.match(renderStructuredContent('table',table,'table'),/role="region"[^>]*aria-label="Táblázat"/,
  'older tables retain their existing fallback name');
 assert.match(renderStructuredContent('tabs',tabs,'tabs',{ariaLabel:{toString(){throw Error('must not coerce objects')}}}),/role="tablist" aria-label="Tartalomfülek"/,
  'malformed persisted labels retain the safe tablist fallback without object coercion');
 assert.match(renderStructuredContent('tabs',tabs,'tabs',{ariaLabel:'x'.repeat(200)}),new RegExp(`aria-label="${'x'.repeat(160)}"`),
  'tablist labels stay within the authored field limit');
});

test('structured accordions expose their Inspector name as an escaped accessible group',()=>{
 const accordion={version:1,items:[{label:'GYIK',content:'Válasz'}]};
 const named=renderStructuredContent('accordion',accordion,'faq',{ariaLabel:'  Közösségi & <GYIK>  '});
 assert.match(named,/<div class="visual-structured-accordion" role="group" aria-label="Közösségi &amp; &lt;GYIK&gt;">/,
  'the Accordion name set in the Inspector is exposed safely in the public DOM');
 assert.match(renderStructuredContent('accordion',accordion,'faq'),/role="group" aria-label="Részletek"/,
  'older structured Accordions keep a useful accessible fallback name');
 assert.match(renderStructuredContent('accordion',accordion,'faq',{ariaLabel:{toString(){throw Error('must not coerce objects')}}}),/role="group" aria-label="Részletek"/,
  'malformed legacy names fall back without object coercion');
 assert.match(renderStructuredContent('accordion',accordion,'faq',{ariaLabel:'x'.repeat(200)}),new RegExp(`aria-label="${'x'.repeat(160)}"`),
  'public Accordion names stay within the existing 160-character field contract');
});

test('a single-slide carousel does not render active no-op navigation controls',()=>{
 const html=renderStructuredContent('carousel',{version:1,items:[{label:'Egy dia',content:'Egyetlen tartalom',src:'',alt:''}]},'one-slide');
 assert.match(html,/<button type="button" class="visual-carousel-prev" aria-controls="carousel-safe-one-slide" aria-label="Előző dia" disabled>/,
  'previous navigation is natively disabled when there is no other slide');
 assert.match(html,/<span class="visual-carousel-count" aria-live="polite">1 \/ 1<\/span>/,
  'the live counter remains visible for a one-slide carousel');
 assert.match(html,/<button type="button" class="visual-carousel-next" aria-controls="carousel-safe-one-slide" aria-label="Következő dia" disabled>/,
  'next navigation is natively disabled when there is no other slide');
});
