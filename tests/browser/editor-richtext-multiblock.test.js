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

test('Rich Text cross-paragraph selection survives repeated marks and draft Save on mobile and desktop',async t=>{
  const model=createEditorState(createDocument());
  const pageId=model.document.activePageId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:model.document.pages[pageId].rootId}});
  const nodeId=model.selection.primaryId;
  execute(model,{type:'richtext.content.set',payload:{nodeId,document:{
    schemaVersion:1,type:'richtext-document',
    blocks:[{type:'paragraph',children:[{type:'text',text:'Alpha Beta',marks:[]}]},
      {type:'paragraph',children:[{type:'text',text:'Gamma Delta',marks:[]}]}]
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
    const segments=await surface.evaluate(async editor=>{
      const {getRichTextFormattingSelection}=await import('/editor-v2/core/richtext-links.js');
      const blocks=[...editor.querySelectorAll('[data-rich-block]')];
      const first=document.createTreeWalker(blocks[0],NodeFilter.SHOW_TEXT).nextNode();
      const second=document.createTreeWalker(blocks[1],NodeFilter.SHOW_TEXT).nextNode();
      if(first?.nodeValue!=='Alpha Beta'||second?.nodeValue!=='Gamma Delta')throw new Error('Rich Text fixture missing');
      editor.focus();
      const range=document.createRange();
      range.setStart(first,6);range.setEnd(second,5);
      const selected=window.getSelection();
      selected.removeAllRanges();selected.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
      return getRichTextFormattingSelection(editor)?.segments;
    });
    assert.deepEqual(segments,[{blockIndex:0,from:6,to:10},{blockIndex:1,from:0,to:5}]);
    await page.getByRole('button',{name:'Félkövér',exact:true}).click();
    assert.deepEqual(await surface.locator('strong').allTextContents(),['Beta','Gamma'],'both paragraphs must receive bold');
    assert.match(await page.evaluate(()=>window.getSelection()?.toString()??''),/Beta[\s\S]*Gamma/,'cross-block selection must survive first render');
    await page.getByRole('button',{name:'Dőlt',exact:true}).click();
    assert.deepEqual(await surface.locator('strong').allTextContents(),['Beta','Gamma'],'bold must survive subsequent mark');
    assert.deepEqual(await surface.locator('em').allTextContents(),['Beta','Gamma'],'italic must affect both paragraphs');
    assert.match(await page.evaluate(()=>window.getSelection()?.toString()??''),/Beta[\s\S]*Gamma/,'cross-block selection must survive second render');
    await page.getByRole('button',{name:'Kódformázás',exact:true}).click();
    assert.deepEqual(await surface.locator('code').allTextContents(),['Beta','Gamma'],'code formatting must use the same multi-block Page Model range');
    assert.match(await page.evaluate(()=>window.getSelection()?.toString()??''),/Beta[\s\S]*Gamma/,'cross-block selection must survive code formatting');
    const canvas=page.locator(`.node[data-node-id="${nodeId}"] .richtext-content`).first();
    assert.deepEqual(await canvas.locator('strong').allTextContents(),['Beta','Gamma'],'canvas must mirror the Inspector model');
    assert.deepEqual(await canvas.locator('em').allTextContents(),['Beta','Gamma']);
    assert.deepEqual(await canvas.locator('code').allTextContents(),['Beta','Gamma']);
    if(width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(writes.length,1);
      assert.equal(writes[0].publish,false,'draft Save must not publish');
      const persisted=writes[0].document.pages[pageId].nodes[nodeId].props.richText;
      assert.equal(persisted.blocks[0].children.find(run=>run.text==='Beta')?.marks?.includes('bold'),true);
      assert.equal(persisted.blocks[1].children.find(run=>run.text==='Gamma')?.marks?.includes('italic'),true);
      assert.equal(persisted.blocks[0].children.find(run=>run.text==='Beta')?.marks?.includes('code'),true);
      assert.equal(persisted.blocks[1].children.find(run=>run.text==='Gamma')?.marks?.includes('code'),true);
      assert.equal(persisted.blocks[0].children.map(run=>run.text).join(''),'Alpha Beta');
      assert.equal(persisted.blocks[1].children.map(run=>run.text).join(''),'Gamma Delta');
    }else{
      assert.equal(writes.length,0,'mobile format remains an uncommitted draft until explicit Save');
    }
    assert.deepEqual(errors,[],`no browser errors at ${width}px`);
    await page.close();
  }
});
