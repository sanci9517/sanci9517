import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve, extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument, NODE_TYPES} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

const root=resolve(import.meta.dirname,'../../public');

test('real Inspector layout survives selection, undo, save/reload and separate publish with canvas/public parity',async t=>{
  const model=createEditorState(createDocument());
  const pageId=model.document.activePageId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.GRID,parentId:model.document.pages[pageId].rootId}});
  const gridId=model.selection.primaryId;
  execute(model,{type:'element.update',payload:{nodeId:gridId,patch:{name:'<img src=x onerror=alert(1)>'}}});
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:gridId,props:{text:'Grid item'}}});
  const itemId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.FLEX,parentId:model.document.pages[pageId].rootId}});
  const flexId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:flexId,props:{text:'Flex item'}}});
  const flexItemId=model.selection.primaryId;
  let draft=structuredClone(model.document), published=null, version=1;
  const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/test'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`;
  const editor=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(5000);
  const errors=[];
  editor.on('pageerror',error=>errors.push(error.message));
  await editor.goto(base+'/editor-v2/index.html');
  const select=async id=>{
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  };
  const field=id=>editor.locator(`.typed-inspector-field[data-property-id="${id}"]`);
  await select(gridId);
  assert.equal(await editor.locator(`.node[data-node-id="${gridId}"] > .node-head img`).count(),0);
  assert.equal(await editor.locator(`.layer-row[data-node-id="${gridId}"] img`).count(),0);
  await editor.locator('.inspector-group-title').evaluateAll(elements=>elements.forEach(el=>el.click()));
  await field('layout.display').locator('select').selectOption('grid');
  await field('grid.columns').locator('select').selectOption('repeat(2, minmax(0, 1fr))');
  assert.equal(await editor.locator(`.node[data-node-id="${gridId}"]`).evaluate(el=>getComputedStyle(el).display),'grid');
  // Editor chrome must not consume a grid cell.
  assert.equal(await editor.locator(`.node[data-node-id="${gridId}"] > .node-head`).evaluate(el=>getComputedStyle(el).position),'absolute');
  await select(itemId);
  await field('grid.column').locator('select').selectOption('2');
  await field('size.minWidth').locator('input').fill('80px');
  await field('size.minWidth').locator('input').press('Tab');
  await field('radius.topLeft').locator('input').fill('12px');
  await field('radius.topLeft').locator('input').press('Tab');
  const item=editor.locator(`.node[data-node-id="${itemId}"]`);
  const css=()=>item.evaluate(el=>{const style=getComputedStyle(el);return {column:style.gridColumnStart,minWidth:style.minWidth,radius:style.borderTopLeftRadius}});
  assert.deepEqual(await css(),{column:'2',minWidth:'80px',radius:'12px'});
  await editor.locator('#undo').click();
  assert.equal((await css()).radius,'0px');
  await editor.locator('#redo').click();
  assert.equal((await css()).radius,'12px');
  await select(gridId);await select(itemId);
  assert.equal(await field('radius.topLeft').locator('input').inputValue(),'12px');
  await select(flexId);
  await field('layout.display').locator('select').selectOption('flex');
  await field('flex.direction').locator('select').selectOption('column');
  await select(flexItemId);
  await field('flex.basis').locator('input').fill('30%');
  await field('flex.basis').locator('input').press('Tab');
  await field('size.maxWidth').locator('input').fill('120px');
  await field('size.maxWidth').locator('input').press('Tab');
  const flexCss=()=>editor.locator(`.node[data-node-id="${flexItemId}"]`).evaluate(el=>{const style=getComputedStyle(el);return {basis:style.flexBasis,maxWidth:style.maxWidth}});
  assert.deepEqual(await flexCss(),{basis:'30%',maxWidth:'120px'});
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.equal(published,null);
  await editor.reload();await select(itemId);
  assert.deepEqual(await css(),{column:'2',minWidth:'80px',radius:'12px'});
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true);
  const publicPage=await browser.newPage({viewport:{width:1366,height:900}});
  publicPage.on('pageerror',error=>errors.push(error.message));
  await publicPage.goto(base+'/p/test');
  await publicPage.locator('.visual-card > .visual-text').first().waitFor();
  const publicCss=()=>publicPage.locator('.visual-card > .visual-text').first().evaluate(el=>{const style=getComputedStyle(el);return {column:style.gridColumnStart,minWidth:style.minWidth,radius:style.borderTopLeftRadius}});
  await select(itemId);
  assert.deepEqual(await publicCss(),await css());
  assert.deepEqual(await publicPage.locator('.visual-card:nth-child(2) > .visual-text').evaluate(el=>{const style=getComputedStyle(el);return {basis:style.flexBasis,maxWidth:style.maxWidth}}),await flexCss());
  // A real mobile viewport edits only its own override; the published page stays unchanged.
  await editor.setViewportSize({width:390,height:800});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').evaluate(el=>el.click());
  await select(itemId);
  await editor.locator('.inspector-group-title').filter({hasText:'Lekerekítés'}).click();
  assert.ok((await field('radius.topLeft').locator('input').boundingBox()).height>=44);
  await field('radius.topLeft').locator('input').fill('6px');
  await field('radius.topLeft').locator('input').press('Tab');
  assert.equal((await css()).radius,'6px');
  await publicPage.setViewportSize({width:390,height:800});
  await publicPage.waitForFunction(()=>getComputedStyle(document.querySelector('.visual-card > .visual-text')).borderTopLeftRadius==='12px');
  assert.equal((await publicCss()).radius,'12px');
  assert.deepEqual(errors,[]);
});
