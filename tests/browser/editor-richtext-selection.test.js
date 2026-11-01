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

test('Rich Text selection survives consecutive formatting, link edits and draft Save on mobile and desktop',async t=>{
  const model=createEditorState(createDocument());
  const pageId=model.document.activePageId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:model.document.pages[pageId].rootId}});
  const nodeId=model.selection.primaryId;
  execute(model,{type:'richtext.content.set',payload:{nodeId,document:{
    schemaVersion:1,type:'richtext-document',
    blocks:[{type:'paragraph',children:[{type:'text',text:'Alpha Beta Gamma',marks:[]}]}]
  }}});
  let draft=structuredClone(model.document),published=null,version=1;
  const writes=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=value=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(value))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,title:'Rich Text test',slug:'selection-test',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'selection-test',title:'Rich Text test',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;
      const payload=JSON.parse(body);writes.push(payload);
      draft=structuredClone(payload.document);version++;
      if(payload.publish)published=structuredClone(payload.document);
      return json({ok:true,data:{pageId,version,revisionId:'test-revision-'+version}});
    }
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{}});
    const asset=url.pathname==='/p/selection-test'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(resolve=>server.close(resolve))});
  for(const width of [390,1366]){
    const page=await browser.newPage({viewport:{width,height:850}});
    page.setDefaultTimeout(7000);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:'+server.address().port+'/editor-v2/index.html');
    await page.locator(`.node[data-node-id="${nodeId}"]`).waitFor();
    await page.locator(`.node[data-node-id="${nodeId}"]`).evaluate(element=>element.click());
    await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
    await page.locator('.inspector-tabs button').nth(1).evaluate(button=>button.click());
    const surface=page.locator('.richtext-editor-surface');
    await surface.waitFor();
    const selection=await surface.evaluate(editor=>{
      const block=editor.querySelector('[data-rich-block]');
      const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT);
      const text=walker.nextNode();
      if(!text?.nodeValue.includes('Alpha Beta Gamma'))throw new Error('Rich Text fixture missing');
      editor.focus();
      const range=document.createRange();
      range.setStart(text,6);range.setEnd(text,10);
      const selected=window.getSelection();selected.removeAllRanges();selected.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
      return selected.toString();
    });
    assert.equal(selection,'Beta');
    await page.getByRole('button',{name:'Félkövér',exact:true}).click();
    assert.equal(await surface.locator('strong').textContent(),'Beta',`bold must affect only Beta at ${width}px`);
    assert.equal(await page.evaluate(()=>window.getSelection()?.toString()),'Beta','selection must survive first formatting');
    await page.getByRole('button',{name:'Dőlt',exact:true}).click();
    assert.equal(await surface.locator('strong').textContent(),'Beta');
    assert.equal(await surface.locator('em').textContent(),'Beta');
    assert.equal(await page.evaluate(()=>window.getSelection()?.toString()),'Beta','same selection must survive second formatting');
    await page.getByLabel('Hivatkozás címe').fill('/p/selection-test');
    await page.getByRole('button',{name:'Link beállítása'}).click();
    assert.equal(await surface.locator('a[href="/p/selection-test"]').textContent(),'Beta','link must use the preserved selection after URL focus');
    const canvas=page.locator(`.node[data-node-id="${nodeId}"] .richtext-content`).first();
    assert.equal(await canvas.locator('strong').textContent(),'Beta','Inspector and canvas must use the same model');
    assert.equal(await canvas.locator('em').textContent(),'Beta');
    assert.equal(await canvas.locator('a[href="/p/selection-test"]').textContent(),'Beta');
    if(width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(writes.length,1);
      assert.equal(writes[0].publish,false,'formatting and draft Save must never publish');
      const persisted=writes[0].document.pages[pageId].nodes[nodeId].props.richText;
      assert.equal(persisted.blocks[0].children.find(item=>item.text==='Beta')?.link?.href,'/p/selection-test');
    }else{
      assert.equal(writes.length,0,'formatting is draft-only before explicit Save');
    }
    assert.deepEqual(errors,[],`unexpected browser errors at ${width}px`);
    await page.close();
  }

  // Mobile emulation uses the browser's actual text selection action rather
  // than a Range constructed in page JavaScript. The resulting selection must
  // remain attached to the Rich Text command and the draft/public lifecycle.
  draft=structuredClone(model.document);published=null;version=1;writes.length=0;
  const mobileContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mobile=await mobileContext.newPage();mobile.setDefaultTimeout(7000);
  const mobileErrors=[];mobile.on('pageerror',error=>mobileErrors.push(error.message));
  await mobile.goto('http://127.0.0.1:'+server.address().port+'/editor-v2/index.html');
  await mobile.locator(`.node[data-node-id="${nodeId}"]`).waitFor();
  await mobile.locator(`.node[data-node-id="${nodeId}"]`).evaluate(element=>element.click());
  await mobile.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
  await mobile.locator('.inspector-tabs button').nth(1).evaluate(button=>button.click());
  const mobileSurface=mobile.locator('.richtext-editor-surface');await mobileSurface.waitFor();
  await mobileSurface.locator('p').first().locator('span').first().selectText();
  assert.equal(await mobile.evaluate(()=>window.getSelection()?.toString()),'Alpha Beta Gamma','mobile browser text selection must expose the selected inline run');
  await mobile.getByRole('button',{name:'Félkövér',exact:true}).click();
  assert.equal(await mobileSurface.locator('strong').textContent(),'Alpha Beta Gamma','mobile native selection must reach the canonical mark command');
  assert.equal(await mobile.evaluate(()=>window.getSelection()?.toString()),'Alpha Beta Gamma','the selection must survive the Inspector rerender');
  await mobile.locator(`.node[data-node-id="${nodeId}"] .richtext-content strong`).waitFor();
  await mobile.locator('#save').click();await mobile.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(writes.at(-1)?.publish,false,'mobile selection Save remains draft-only');
  assert.equal(published,null,'mobile selection Save leaves the published page unchanged');
  await mobile.goto('http://127.0.0.1:'+server.address().port+'/editor-v2/index.html');
  await mobile.locator(`.node[data-node-id="${nodeId}"]`).waitFor();
  await mobile.locator(`.node[data-node-id="${nodeId}"]`).evaluate(element=>element.click());
  await mobile.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
  await mobile.locator('.inspector-tabs button').nth(1).evaluate(button=>button.click());
  await mobile.locator('.richtext-editor-surface strong').waitFor();
  await mobile.locator('#publish').click();await mobile.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  const mobilePublic=await mobileContext.newPage();
  await mobilePublic.goto('http://127.0.0.1:'+server.address().port+'/p/selection-test');
  await mobilePublic.locator('.visual-richtext strong').waitFor();
  assert.equal(await mobilePublic.locator('.visual-richtext strong').textContent(),'Alpha Beta Gamma','explicit Publish exposes mobile formatting publicly');
  assert.deepEqual(mobileErrors,[],'mobile Editor selection has no browser errors');
  await mobileContext.close();
});
