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

test('Inspector links in list items and table cells match canvas and published page at mobile/desktop widths',async t=>{
  const state=createEditorState(createDocument());
  const pageId=state.document.activePageId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:state.document.pages[pageId].rootId}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:{
    schemaVersion:1,type:'richtext-document',blocks:[
      {type:'bulleted-list',items:[
        [{type:'text',text:'Alpha',marks:[]}],
        [{type:'text',text:'Beta',marks:['bold']}]
      ]},
      {type:'table',rows:[{cells:[
        {header:true,align:'center',children:[{type:'text',text:'Gamma',marks:[]}]},
        {header:false,align:'right',children:[{type:'text',text:'Delta',marks:['italic']}]}
      ]}]}
    ]
  }}});
  const fixture=structuredClone(state.document);
  let draft=structuredClone(fixture),published=null,version=1;
  const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=value=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(value))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,title:'Nested Rich Text',slug:'nested-links',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;
      const payload=JSON.parse(body);posts.push(payload);
      draft=structuredClone(payload.document);version++;
      if(payload.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'test-revision-'+version,published:Boolean(payload.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'nested-links',title:'Nested Rich Text',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/nested-links'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(resolve=>server.close(resolve))});
  const base='http://127.0.0.1:'+server.address().port;

  for(const width of [390,1366]){
    draft=structuredClone(fixture);published=null;version=1;posts.length=0;
    const page=await browser.newPage({viewport:{width,height:860}});
    page.setDefaultTimeout(8500);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/editor-v2/index.html');
    await page.locator(`.node[data-node-id="${nodeId}"]`).waitFor();
    await page.locator(`.node[data-node-id="${nodeId}"]`).evaluate(node=>node.click());
    await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
    await page.locator('.inspector-tabs button').nth(1).evaluate(button=>button.click());
    const editor=page.locator('.richtext-editor-surface');await editor.waitFor();

    const selectText=async(selector,expected)=>{
      const blockRange=await editor.evaluate(async(el,{selector})=>{
        const {getRichTextBlockSelection}=await import('/editor-v2/core/richtext-links.js');
        const node=el.querySelector(selector);
        const text=document.createTreeWalker(node,NodeFilter.SHOW_TEXT).nextNode();
        el.focus();
        const range=document.createRange();range.selectNodeContents(text);
        const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
        document.dispatchEvent(new Event('selectionchange'));
        return getRichTextBlockSelection(el);
      },{selector});
      assert.deepEqual(blockRange,expected,`structured link range for ${selector} at ${width}px`);
    };
    await selectText('ul li:nth-child(2)',{blockIndex:0,from:5,to:9});
    await page.getByLabel('Hivatkozás címe').fill('/p/list');
    await page.getByRole('button',{name:'Link beállítása'}).click();
    assert.equal(await editor.locator('ul li:nth-child(2) a').getAttribute('href'),'/p/list');
    assert.equal(await editor.locator('ul li:first-child a').count(),0);
    assert.equal(await editor.locator('ul li:nth-child(2) a strong').textContent(),'Beta');

    await selectText('table td', {blockIndex:1,from:5,to:10});
    await page.getByLabel('Hivatkozás címe').fill('https://example.org/table');
    await page.getByRole('button',{name:'Link beállítása'}).click();
    assert.equal(await editor.locator('table td a').getAttribute('href'),'https://example.org/table');
    assert.equal(await editor.locator('table td a em').textContent(),'Delta');
    assert.equal(await editor.locator('table th a').count(),0);
    assert.equal(await editor.locator('table th').evaluate(el=>el.style.textAlign),'center');

    const canvas=page.locator(`.node[data-node-id="${nodeId}"] .richtext-content`).first();
    assert.equal(await canvas.locator('ul li:nth-child(2) a').getAttribute('href'),'/p/list');
    assert.equal(await canvas.locator('table td a').getAttribute('href'),'https://example.org/table');
    assert.equal(await canvas.locator('table td a em').textContent(),'Delta');
    assert.equal(posts.length,0,'local editing must never implicitly Save/Publish');

    if(width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(posts.length,1);
      assert.equal(posts[0].publish,false);
      assert.equal(published,null,'Save must not publish');
      await page.locator('#publish').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
      assert.equal(posts.at(-1).publish,true);
      const rich=published.pages[pageId].nodes[nodeId].props.richText;
      assert.equal(rich.blocks[0].items[1].some(run=>run.link?.href==='/p/list'),true);
      assert.equal(rich.blocks[1].rows[0].cells[1].children.some(run=>run.link?.href==='https://example.org/table'),true);
      assert.equal(rich.blocks[1].rows[0].cells[0].header,true);
      assert.equal(rich.blocks[1].rows[0].cells[1].align,'right');
      const publicPage=await browser.newPage({viewport:{width:390,height:860}});
      await publicPage.goto(base+'/p/nested-links');
      const output=publicPage.locator('.visual-richtext');
      await output.waitFor();
      assert.equal(await output.locator('ul li:nth-child(2) a').getAttribute('href'),'/p/list');
      assert.equal(await output.locator('ul li:nth-child(2) a strong').textContent(),'Beta');
      assert.equal(await output.locator('table td a').getAttribute('href'),'https://example.org/table');
      assert.equal(await output.locator('table td a em').textContent(),'Delta');
      assert.equal(await output.locator('table th').evaluate(el=>el.style.textAlign),'center');
      assert.equal(await output.locator('table td').evaluate(el=>el.style.textAlign),'right');
      await publicPage.close();
    }
    assert.deepEqual(errors,[],`unexpected browser errors at ${width}px`);
    await page.close();
  }
});
