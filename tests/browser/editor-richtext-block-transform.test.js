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

const root=resolve(import.meta.dirname,'../../public');

test('Inspector multi-block conversion retains list items and matches canvas/published renderer at mobile and desktop widths',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:state.document.pages[pageId].rootId}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:{
    schemaVersion:1,type:'richtext-document',blocks:[
      {type:'paragraph',children:[{type:'text',text:'Intro',marks:[]}]},
      {type:'bulleted-list',items:[
        [{type:'text',text:'Alpha',marks:['bold'],link:{href:'/p/alpha'}}],
        [{type:'text',text:'Beta',marks:['italic']}]
      ]},
      {type:'paragraph',children:[{type:'text',text:'Outro',marks:[]}]},
      {type:'table',rows:[{cells:[{header:true,align:'center',children:[{type:'text',text:'Cell',marks:[]}]}]}]}
    ]
  }}});
  const fixture=structuredClone(state.document);
  let draft=structuredClone(fixture),published=null,version=1;
  const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=value=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(value))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,title:'Block conversion',slug:'block-change',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'test-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'block-change',title:'Block conversion',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/block-change'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,1366]){
    draft=structuredClone(fixture);published=null;version=1;posts.length=0;
    const page=await browser.newPage({viewport:{width,height:870}});
    page.setDefaultTimeout(9000);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/editor-v2/index.html');
    await page.locator(`.node[data-node-id="${nodeId}"]`).waitFor();
    await page.locator(`.node[data-node-id="${nodeId}"]`).evaluate(node=>node.click());
    await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
    await page.locator('.inspector-tabs button').nth(1).evaluate(button=>button.click());
    const editor=page.locator('.richtext-editor-surface');await editor.waitFor();
    await page.getByRole('tab',{name:'Bekezdés',exact:true}).click();
    const blockType=page.getByRole('combobox',{name:'Szövegblokkok típusa'});

    // Select two distinct list items; conversion must yield two H2s, not one.
    await editor.evaluate(el=>{
      const a=el.querySelector('ul li:first-child');
      const b=el.querySelector('ul li:last-child');
      const first=document.createTreeWalker(a,NodeFilter.SHOW_TEXT).nextNode();
      const last=document.createTreeWalker(b,NodeFilter.SHOW_TEXT).nextNode();
      el.focus();const range=document.createRange();
      range.setStart(first,0);range.setEnd(last,last.length);
      const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
    });
    await blockType.selectOption('heading-2');
    assert.deepEqual(await editor.locator('h2').allTextContents(),['Alpha','Beta']);
    assert.equal(await editor.locator('h2 a strong').textContent(),'Alpha');
    assert.equal(await editor.locator('h2 em').textContent(),'Beta');
    const canvas=page.locator(`.node[data-node-id="${nodeId}"] .richtext-content`).first();
    assert.deepEqual(await canvas.locator('h2').allTextContents(),['Alpha','Beta']);
    assert.equal(await canvas.locator('h2 a').getAttribute('href'),'/p/alpha');

    // Convert all four contiguous text blocks to one numbered list, leaving
    // the adjacent table untouched and keeping each original item separate.
    await editor.evaluate(el=>{
      const first=el.querySelector('p:first-child');
      const last=[...el.querySelectorAll('p')].at(-1);
      const a=document.createTreeWalker(first,NodeFilter.SHOW_TEXT).nextNode();
      const b=document.createTreeWalker(last,NodeFilter.SHOW_TEXT).nextNode();
      el.focus();const range=document.createRange();
      range.setStart(a,0);range.setEnd(b,b.length);
      const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
    });
    await blockType.selectOption('numbered-list');
    const expected=['Intro','Alpha','Beta','Outro'];
    assert.deepEqual(await editor.locator('ol > li').allTextContents(),expected);
    assert.equal(await editor.locator('ol').count(),1);
    assert.equal(await editor.locator('ol > li:nth-child(2) a strong').textContent(),'Alpha');
    assert.equal(await editor.locator('ol > li:nth-child(3) em').textContent(),'Beta');
    assert.equal(await editor.locator('table th').textContent(),'Cell');
    assert.deepEqual(await canvas.locator('ol > li').allTextContents(),expected);
    assert.equal(await canvas.locator('ol > li:nth-child(2) a').getAttribute('href'),'/p/alpha');
    assert.equal(await canvas.locator('table th').textContent(),'Cell');
    assert.equal(posts.length,0,'block changes are local draft edits, not implicit saves');

    if(width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(posts.length,1);assert.equal(posts[0].publish,false);
      assert.equal(published,null,'Save must not publish');
      await page.locator('#publish').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
      assert.equal(posts.at(-1).publish,true);
      const model=published.pages[pageId].nodes[nodeId].props.richText;
      assert.deepEqual(model.blocks.map(block=>block.type),['numbered-list','table']);
      assert.deepEqual(model.blocks[0].items.map(item=>item.map(run=>run.text).join('')),expected);
      assert.equal(model.blocks[0].items[1][0].link.href,'/p/alpha');
      assert.equal(model.blocks[1].rows[0].cells[0].header,true);
      const publicTab=await browser.newPage({viewport:{width:390,height:870}});
      await publicTab.goto(base+'/p/block-change');
      const output=publicTab.locator('.visual-richtext');await output.waitFor();
      assert.deepEqual(await output.locator('ol > li').allTextContents(),expected);
      assert.equal(await output.locator('ol > li:nth-child(2) a strong').textContent(),'Alpha');
      assert.equal(await output.locator('ol > li:nth-child(3) em').textContent(),'Beta');
      assert.equal(await output.locator('table th').textContent(),'Cell');
      await publicTab.close();
    }
    assert.deepEqual(errors,[],`no uncaught browser errors at ${width}px`);
    await page.close();
  }
});
