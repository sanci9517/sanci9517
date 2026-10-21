import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

test('hidden or hidden-parent schedules never fetch or break the public mobile page; wider breakpoints still fetch',async t=>{
  const model=createEditorState(createDocument());
  const rootId=activePage(model).rootId,pageId=model.document.activePageId;
  execute(model,{type:'element.add',payload:{type:'text',parentId:rootId,props:{text:'Minden nézetben látható'}}});
  const textId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:'schedule',parentId:rootId}});
  const visibleScheduleId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:'schedule',parentId:rootId}});
  const directHiddenId=model.selection.primaryId;
  execute(model,{type:'schedule.config.set',payload:{nodeId:directHiddenId,patch:{mode:'next'}}});
  execute(model,{type:'element.visibility.set',payload:{nodeId:directHiddenId,device:'mobile',visible:false}});
  execute(model,{type:'element.add',payload:{type:'container',parentId:rootId}});
  const parentId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:'schedule',parentId}});
  const nestedHiddenId=model.selection.primaryId;
  execute(model,{type:'schedule.config.set',payload:{nodeId:nestedHiddenId,patch:{mode:'all'}}});
  execute(model,{type:'element.visibility.set',payload:{nodeId:parentId,device:'mobile',visible:false}});
  const published=structuredClone(model.document),requests=[],errorModes=new Set(['next','all']);
  const publicDir=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=(data,status=200)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(data))};
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,title:'Működő oldal',description:'',slug:'test',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/schedule'){
      const mode=url.searchParams.get('mode');
      requests.push(mode);
      if(errorModes.has(mode))return json({ok:false,error:{message:'A rejtett adásrend forrása nem érhető el'}},503);
      return json({ok:true,data:[{id:mode,title:'Stream '+mode,platform:'Twitch',startsAt:'2030-10-21T16:00:00Z',status:'scheduled'}]});
    }
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{}});
    const filepath=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!filepath.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(filepath)]||'application/octet-stream');res.end(await readFile(filepath))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const url='http://127.0.0.1:'+server.address().port+'/p/test',errors=[];
  const open=async width=>{
    const page=await browser.newPage({viewport:{width,height:850}});
    page.setDefaultTimeout(8000);
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(url);
    await page.locator(`[data-node-id="${textId}"]`).waitFor();
    assert.equal(await page.locator('#page-title').textContent(),'Működő oldal');
    return page;
  };
  // Both hidden schedules deliberately return HTTP 503. A mobile page still
  // loads its actual visible data without requesting either hidden source.
  const mobile=await open(390);
  assert.deepEqual(requests,['upcoming'],'mobile must not call any hidden schedule endpoint');
  assert.equal(await mobile.locator(`[data-node-id="${visibleScheduleId}"]`).count(),1);
  assert.equal(await mobile.locator(`[data-node-id="${directHiddenId}"]`).count(),0);
  assert.equal(await mobile.locator(`[data-node-id="${parentId}"]`).count(),0);
  assert.equal(await mobile.locator(`[data-node-id="${nestedHiddenId}"]`).count(),0);
  assert.match(await mobile.locator('.visual-schedule-title').textContent(),/Stream upcoming/);
  await mobile.close();

  // An embedded Preview must obey the same device and data-fetch contract.
  requests.length=0;
  const preview=await browser.newPage({viewport:{width:1200,height:850}});
  await preview.goto(url+'?preview=1&device=mobile');
  const inner=preview.locator('iframe.preview-viewport').contentFrame();
  await inner.locator(`[data-node-id="${textId}"]`).waitFor();
  assert.deepEqual(requests,['upcoming'],'mobile preview fetches only visible schedule');
  assert.equal(await inner.locator(`[data-node-id="${directHiddenId}"]`).count(),0);
  await preview.close();

  // A *visible* failing data-driven block is a local error, never a page 404.
  // Healthy schedule and unrelated content must survive the two 503 responses.
  requests.length=0;
  const degraded=await open(768);
  assert.deepEqual(requests,['upcoming','next','all'],'tablet requests all three visible sources');
  assert.equal(await degraded.locator('.visual-schedule-error[role="status"]').count(),2,'failed schedules have accessible local fallbacks');
  assert.equal(await degraded.locator('.visual-schedule-title').count(),1,'healthy sibling schedule still renders');
  assert.equal(await degraded.locator(`[data-node-id="${directHiddenId}"] .visual-schedule-error`).count(),1);
  assert.equal(await degraded.locator(`[data-node-id="${nestedHiddenId}"] .visual-schedule-error`).count(),1);
  assert.match(await degraded.locator(`[data-node-id="${textId}"]`).textContent(),/Minden nézetben látható/);
  assert.equal(await degraded.locator('.content-error').count(),0,'a schedule 503 is never displayed as a missing page');
  assert.equal(await degraded.locator('#page-title').textContent(),'Működő oldal');

  // Failed queries must be retried after recovery, not cached as empty data.
  errorModes.clear();requests.length=0;
  await degraded.reload();
  await degraded.locator('.visual-schedule-title').last().waitFor();
  assert.deepEqual(requests,['upcoming','next','all'],'the recovered page retries all schedule configurations');
  assert.equal(await degraded.locator('.visual-schedule-error').count(),0);
  assert.equal(await degraded.locator('.visual-schedule-title').count(),3);
  await degraded.close();

  // Wider devices must not lose data or visibility after a mobile hide.
  requests.length=0;
  for(const width of [768,1440]){
    const page=await open(width);
    assert.equal(await page.locator(`[data-node-id="${directHiddenId}"]`).count(),1);
    assert.equal(await page.locator(`[data-node-id="${parentId}"]`).count(),1);
    assert.equal(await page.locator(`[data-node-id="${nestedHiddenId}"]`).count(),1);
    assert.deepEqual(requests.slice(-3).sort(),['all','next','upcoming'],width+' loads all visible schedules');
    await page.close();
  }
  assert.deepEqual(errors,[]);
});
