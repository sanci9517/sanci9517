import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,NODE_TYPES} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {getElementCapability} from '../../public/editor-v2/core/capability-matrix.js';
import {listProperties} from '../../public/editor-v2/core/property-registry.js';
import {plainTextToRichText} from '../../public/editor-v2/core/richtext-engine.js';

const publicDir=resolve(import.meta.dirname,'../../public');
const backgroundAssetId='a44f0ce3-6273-4a8f-991e-572c4a89cdd4';

test('background image media picker reaches Canvas, draft and public renderer for every Inspector-compatible PARTIAL type',async t=>{
  const model=createEditorState(createDocument(undefined,{modern:true}));
  const pageId=model.document.activePageId,rootId=model.document.pages[pageId].rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Inspector háttér teszt')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Inspector háttér teszt'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  const applicable=nodes.filter(({type})=>listProperties({nodeType:type}).some(property=>property.id==='background.image'));
  assert.equal(nodes.length,45,'fixture contains root and all 44 editable PARTIAL types');
  assert.equal(applicable.length,45,'all current PARTIAL types register the background image field');

  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id'))return json({ok:true,data:{assets:[{
      id:backgroundAssetId,name:'Inspector-mátrix háttér.png',mimeType:'image/png',altText:'Teszt háttér',
      previewUrl:`/api/admin/media?id=${backgroundAssetId}`
    }],nextCursor:null}});
    const mediaId=url.pathname==='/api/admin/media'?url.searchParams.get('id'):url.pathname.startsWith('/media/')?url.pathname.slice('/media/'.length):null;
    if(mediaId===backgroundAssetId){
      res.setHeader('content-type','image/svg+xml');
      return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#16a34a"/></svg>');
    }
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-background-image-matrix',title:'Inspector background matrix',content:draft,revision:version,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-background-image-matrix',title:'Inspector background matrix',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`;
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(20000);viewer.setDefaultTimeout(20000);
  const errors=[];editor.on('pageerror',error=>errors.push(error.message));viewer.on('pageerror',error=>errors.push(error.message));
  await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const canvasNode=id=>editor.locator(`.node[data-node-id="${id}"]`);
  const publicNode=id=>id===rootId?viewer.locator(`#content-canvas[data-node-id="${id}"]`):viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  const canvasImage=id=>canvasNode(id).evaluate(el=>getComputedStyle(el).backgroundImage);
  const publicImage=id=>publicNode(id).evaluate(el=>getComputedStyle(el).backgroundImage);
  const inspector=editor.locator('#inspectorBody');
  const publicBaseline=Object.fromEntries(await Promise.all(applicable.map(async({id})=>[id,await publicImage(id)])));

  for(const {type,id} of applicable){
    const node=canvasNode(id);
    assert.equal(await node.count(),1,`${type}: Canvas renders the fixture node`);
    await node.evaluate(el=>{if(!el.classList.contains('selected'))el.click()});
    const tab=editor.locator('.inspector-tabs button').first();
    if(await tab.getAttribute('aria-selected')!=='true')await tab.click();
    const field=inspector.locator('.typed-inspector-field[data-property-id="background.image"]');
    assert.equal(await field.count(),1,`${type}: image field is present in the actual Inspector`);
    assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}: Inspector uses the registered responsive command`);
    assert.equal(await field.getAttribute('data-property-key'),'backgroundAssetId',`${type}: Inspector writes the registered Page Model key`);
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const picker=field.locator('.editor-media-picker');
    await picker.getByRole('button',{name:'Médiatár megnyitása'}).click();
    await picker.locator('[role="region"][aria-label="Médiatár találatok"]').waitFor();
    await picker.getByRole('button',{name:'Inspector-mátrix háttér.png kiválasztása',exact:true}).click();
    assert.ok((await canvasImage(id)).includes(`/api/admin/media?id=${backgroundAssetId}`),`${type}: picker selection reaches the authenticated Canvas renderer`);
  }

  // Exercise history on the final type while keeping the all-type route matrix
  // in a single draft and publication lifecycle.
  const last=applicable.at(-1);
  assert.ok((await canvasImage(last.id)).includes(`/api/admin/media?id=${backgroundAssetId}`));
  await editor.locator('#undo').click();
  assert.equal((await canvasImage(last.id)).includes(`/api/admin/media?id=${backgroundAssetId}`),false,`${last.type}: Undo removes the pending selection`);
  await editor.locator('#redo').click();
  assert.ok((await canvasImage(last.id)).includes(`/api/admin/media?id=${backgroundAssetId}`),`${last.type}: Redo restores the selection`);
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  for(const {type,id} of applicable){
    assert.equal(draft.pages[pageId].nodes[id].responsive.desktop.backgroundAssetId,backgroundAssetId,`${type}: Save persists the selected asset ID`);
    assert.equal(published.pages[pageId].nodes[id].responsive?.desktop?.backgroundAssetId,undefined,`${type}: draft Save leaves public content unchanged`);
  }
  await viewer.reload();
  for(const {type,id} of applicable)assert.equal(await publicImage(id),publicBaseline[id],`${type}: unsaved publication snapshot stays unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const {type,id} of applicable){
    await canvasNode(id).evaluate(el=>el.click());
    assert.ok((await canvasImage(id)).includes(`/api/admin/media?id=${backgroundAssetId}`),`${type}: draft selection survives Editor reload`);
  }
  const previousStatus=await editor.locator('#saveStatus').textContent();
  await editor.locator('#publish').click();
  await editor.waitForFunction(previous=>document.querySelector('#saveStatus')?.textContent!==previous,previousStatus);
  assert.match(await editor.locator('#saveStatus').textContent(),/^Publikálva/,`explicit Publish should succeed: ${await editor.locator('#saveStatus').textContent()}`);
  await viewer.reload();
  for(const {type,id} of applicable){
    assert.equal(published.pages[pageId].nodes[id].responsive.desktop.backgroundAssetId,backgroundAssetId,`${type}: explicit Publish copies the image ID to the public snapshot`);
    assert.ok((await publicImage(id)).includes(`/media/${backgroundAssetId}`),`${type}: public renderer resolves the image through its public media route`);
  }
  assert.deepEqual(errors,[],'media picker and both renderers produce no uncaught browser errors');
});
