import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';

const root=resolve(import.meta.dirname,'../../public');

test('empty Rich Text has direct desktop and mobile editing, typed presets, Save and separate Publish',async t=>{
  const original=createDocument();
  const pageId=original.activePageId;
  let draft=structuredClone(original),published=null,version=1;
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
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
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
  const tab=await browser.newPage({viewport:{width:1366,height:900}});
  tab.setDefaultTimeout(7000);
  const errors=[];tab.on('pageerror',e=>errors.push(e.message));
  await tab.goto(base+'/editor-v2/index.html');
  assert.equal(await tab.evaluate(async()=>{const {richTextEditorToDocument}=await import('/editor-v2/core/richtext-engine.js');const host=document.createElement('div');host.append(document.createTextNode('Beillesztett szöveg'),document.createElement('p'));return richTextEditorToDocument(host).blocks[0].children[0].text}),'Beillesztett szöveg');
  await tab.locator('.page-canvas .node').first().waitFor();
  await tab.locator('.rail-btn[data-tab="elements"]').click();
  await tab.locator('.element-group-title').filter({hasText:'Szöveg'}).click();
  assert.equal(await tab.locator('#elementList .element:disabled').count()>0,true);
  await tab.locator('#elementList .element').filter({hasText:'Rich Text'}).click();
  const inline=tab.getByRole('textbox',{name:'Rich Text közvetlen szerkesztése'});
  await inline.waitFor();
  assert.equal(await inline.evaluate(el=>document.activeElement===el),true);
  assert.equal(await inline.textContent(),'');
  assert.equal(await tab.locator('.richtext-empty .canvas-edit-richtext:not(.canvas-format-richtext)').count(),0);
  await inline.type('Első közvetlen tartalom');
  await tab.screenshot({path:'/tmp/creator-ux-p0-desktop.png'});
  await tab.locator('.canvas-format-richtext').click();
  await tab.locator('.richtext-toolbar').waitFor();
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.equal(published,null);
  const richId=Object.values(draft.pages[pageId].nodes).find(n=>n.type==='richtext').id;
  assert.equal(draft.pages[pageId].nodes[richId].props.richText.blocks[0].children[0].text,'Első közvetlen tartalom');
  await tab.reload();
  const rich=tab.locator(`.node[data-node-id="${richId}"]`);
  await rich.waitFor();
  assert.match(await rich.locator('.node-content').textContent(),/Első közvetlen tartalom/);
  await rich.getByRole('button',{name:'Tartalom szerkesztése'}).click();
  await inline.waitFor();
  await inline.press('End');await inline.type(' frissítve');
  await tab.locator('.inspector-tabs button').first().click();
  for(const [label,values] of [['Szélesség',['auto','50%','100%']],['Magasság',['auto','100px','200px','300px']]]){
    for(const value of values){
      const button=tab.locator(`.geometry-presets[aria-label="${label} gyorsbeállítások"] button[data-value="${value}"]`);
      await button.click();
      assert.equal(await button.getAttribute('aria-pressed'),'true');
      assert.equal(await tab.locator('.property-validation:not(:empty)').count(),0);
    }
  }
  await tab.locator('.geometry-presets[aria-label="Szélesség gyorsbeállítások"] button[data-value="50%"]').click();
  assert.equal(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>getComputedStyle(el).width), '720px');
  assert.equal(await tab.locator('.geometry-presets[aria-label="Szélesség gyorsbeállítások"] button[data-value="50%"]').getAttribute('aria-pressed'),'true');
  await tab.locator('#undo').click();
  assert.notEqual(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>getComputedStyle(el).width),'720px');
  await tab.locator('#redo').click();
  assert.equal(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>getComputedStyle(el).width),'720px');
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(published,null);
  await tab.locator('.rail-btn[data-tab="elements"]').click();
  await tab.locator('.element-group-title').filter({hasText:'Szöveg'}).click();
  await tab.locator('#elementList .element').filter({hasText:'Rich Text'}).click();
  await inline.waitFor();
  assert.equal(await inline.textContent(),'');
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  await tab.locator('#publish').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true);
  const publicTab=await browser.newPage({viewport:{width:1366,height:900}});
  await publicTab.goto(base+'/p/test');
  await publicTab.locator('.visual-text').first().waitFor();
  assert.match(await publicTab.locator('.visual-text').first().textContent(),/Első közvetlen tartalom frissítve/);
  assert.equal(await publicTab.locator('.visual-text').last().textContent(),'');
  await tab.setViewportSize({width:390,height:800});
  await tab.locator(`.node[data-node-id="${richId}"] .canvas-edit-richtext`).evaluate(el=>el.click());
  const mobileEditor=tab.locator('.richtext-editor-surface');
  await mobileEditor.waitFor();
  assert.equal(await mobileEditor.evaluate(el=>document.activeElement===el),true);
  assert.equal(await tab.locator('#rightDock').evaluate(el=>el.classList.contains('closed')),false);
  await tab.screenshot({path:'/tmp/creator-ux-p0-mobile.png'});
  await mobileEditor.press('End');await mobileEditor.type(' mobil');
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.match(draft.pages[pageId].nodes[richId].props.richText.blocks[0].children[0].text,/mobil$/);
  assert.doesNotMatch(published.pages[pageId].nodes[richId].props.richText.blocks[0].children[0].text,/mobil$/);
  assert.deepEqual(errors,[]);
});
