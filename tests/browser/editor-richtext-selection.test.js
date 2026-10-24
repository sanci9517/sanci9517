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
  let draft=structuredClone(model.document),version=1;
  const writes=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=value=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(value))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,title:'Rich Text test',slug:'selection-test',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;
      const payload=JSON.parse(body);writes.push(payload);
      draft=structuredClone(payload.document);version++;
      return json({ok:true,data:{pageId,version,revisionId:'test-revision-'+version}});
    }
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{}});
    const file=resolve(root,'.'+url.pathname);
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
});
