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
test('Rich Text preserves HTML and native hard breaks, rejects empty clipboard and publishes unchanged content',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:state.document.pages[pageId].rootId}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:{
    schemaVersion:1,type:'richtext-document',blocks:[
      {type:'paragraph',children:[{type:'text',text:'BaseText',marks:[]}]},
      {type:'bulleted-list',items:[
        [{type:'text',text:'First',marks:[]}],[{type:'text',text:'Item',marks:[]}]
      ]},
      {type:'table',rows:[{cells:[
        {header:true,children:[{type:'text',text:'Header',marks:[]}]},
        {header:false,children:[{type:'text',text:'Cell',marks:[]}]}
      ]}]},
      {type:'paragraph',children:[{type:'text',text:'Extra',marks:[]}]}
    ]
  }}});
  const fixture=structuredClone(state.document);
  let draft=structuredClone(fixture),published=null,version=1;const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,title:'Hard breaks',slug:'hard-breaks',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;
      const data=JSON.parse(body);posts.push(data);draft=structuredClone(data.document);version++;
      if(data.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'hard-break-'+version,published:Boolean(data.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'hard-breaks',title:'Hard breaks',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/hard-breaks'?'/visual-page.html':url.pathname;
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
    const page=await browser.newPage({viewport:{width,height:860}});
    page.setDefaultTimeout(10000);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/editor-v2/index.html');
    const node=page.locator(`.node[data-node-id="${nodeId}"]`);await node.waitFor();
    await node.evaluate(el=>el.click());
    await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
    await page.locator('.inspector-tabs button').nth(1).evaluate(el=>el.click());
    const inspector=page.locator('.richtext-editor-surface');await inspector.waitFor();

    const clip=async(selector,from,to,html,text)=>{
      return inspector.evaluate((el,{selector,from,to,html,text})=>{
        const root=el.querySelector(selector),node=document.createTreeWalker(root,NodeFilter.SHOW_TEXT).nextNode();
        el.focus();const range=document.createRange();
        range.setStart(node,from);range.setEnd(node,to);
        const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
        const clipboard=new DataTransfer();
        if(html!==null)clipboard.setData('text/html',html);
        if(text!==null)clipboard.setData('text/plain',text);
        const before=el.innerHTML;
        el.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:clipboard}));
        return {unchanged:before===el.innerHTML};
      },{selector,from,to,html,text});
    };
    assert.equal((await clip('p:first-child',4,4,'<p><strong>One<br>Two</strong></p>','One\nTwo')).unchanged,false);
    assert.equal(await inspector.locator('p:first-child').textContent(),'BaseOne\nTwoText');
    assert.equal(await inspector.locator('p:first-child strong').textContent(),'One\nTwo');
    assert.equal(await inspector.locator('p:first-child strong span').evaluate(el=>getComputedStyle(el).whiteSpace),'pre-wrap');

    await clip('ul li:nth-child(2)',2,2,'<p><a href="/p/link">A<br>B</a></p>','A\nB');
    assert.equal(await inspector.locator('ul li:nth-child(2)').textContent(),'ItA\nBem');
    assert.equal(await inspector.locator('ul li:nth-child(2) a').getAttribute('href'),'/p/link');
    await clip('table td',2,2,'<p>C<br>D</p>','C\nD');
    assert.equal(await inspector.locator('table td').textContent(),'CeC\nDll');

    // Native Shift+Enter is represented as a BR element by browsers, so
    // save it as a canonical newline (without a phantom extra paragraph).
    await inspector.evaluate(el=>{
      const p=[...el.querySelectorAll('p')].at(-1);
      p.replaceChildren(document.createTextNode('North'),document.createElement('br'),document.createTextNode('South'));
      el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertLineBreak'}));
    });
    const expected={
      paragraph:'BaseOne\nTwoText',list:'ItA\nBem',cell:'CeC\nDll',native:'North\nSouth'
    };
    const canvas=node.locator('.node-content.richtext-content');
    assert.equal(await canvas.locator('p:first-child').textContent(),expected.paragraph);
    assert.equal(await canvas.locator('ul li:nth-child(2)').textContent(),expected.list);
    assert.equal(await canvas.locator('table td').textContent(),expected.cell);
    assert.equal(await canvas.locator('p:last-child').textContent(),expected.native);

    // An empty clipboard or unsupported-only markup must be a no-op even
    // with noncollapsed selected content, both in Inspector and canvas.
    for(const [html,text] of [
      ['', ''],
      ['<script>alert(1)</script>',''],
      ['<p><img src=x onerror=alert(1)></p>',''],
      ['<p></p>','']
    ]){
      const result=await clip('p:first-child',0,4,html,text);
      assert.equal(result.unchanged,true,`unsafe or empty clipboard cannot delete text: ${html}`);
      assert.match(await page.locator('.richtext-format-feedback').textContent(),/nincs beilleszthető szöveg/);
    }
    const direct=await inspector.evaluate(async el=>{
      const {pasteRichTextDocument}=await import('/editor-v2/core/richtext-paste.js');
      const text=document.createTreeWalker(el.querySelector('p'),NodeFilter.SHOW_TEXT).nextNode();
      const sel=window.getSelection(),range=document.createRange();range.setStart(text,0);range.setEnd(text,4);
      sel.removeAllRanges();sel.addRange(range);const before=el.innerHTML;
      let error;
      try{pasteRichTextDocument(el,{schemaVersion:1,type:'richtext-document',blocks:[
        {type:'paragraph',children:[{type:'text',text:'',marks:[]}]}
      ]})}catch(e){error=e.message}
      const {richTextEditorToDocument}=await import('/editor-v2/core/richtext-engine.js');
      const empty=document.createElement('div');empty.innerHTML='<p><br></p>';
      return {unchanged:before===el.innerHTML,error,
        emptyParagraph:richTextEditorToDocument(empty).blocks[0].children[0].text};
    });
    assert.equal(direct.unchanged,true);
    assert.match(direct.error,/nincs beilleszthető szöveg/);
    assert.equal(direct.emptyParagraph,'','placeholder BR in an empty paragraph is not a hard break');
    assert.equal(posts.length,0,'no clipboard operation triggers automatic server save');

    if(width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(posts.length,1);assert.equal(posts[0].publish,false);assert.equal(published,null);
      const model=draft.pages[pageId].nodes[nodeId].props.richText;
      assert.equal(model.blocks[0].children.map(run=>run.text).join(''),expected.paragraph);
      assert.equal(model.blocks[1].items[1].map(run=>run.text).join(''),expected.list);
      assert.equal(model.blocks[1].items[1].find(run=>run.link)?.link.href,'/p/link');
      assert.equal(model.blocks[2].rows[0].cells[1].children.map(run=>run.text).join(''),expected.cell);
      assert.equal(model.blocks[3].children.map(run=>run.text).join(''),expected.native);
      await page.locator('#publish').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
      assert.equal(posts.at(-1).publish,true);
      const publicPage=await browser.newPage({viewport:{width:390,height:860}});
      await publicPage.goto(base+'/p/hard-breaks');
      const rendered=publicPage.locator('.visual-richtext');await rendered.waitFor();
      assert.equal(await rendered.locator('p:first-child').textContent(),expected.paragraph);
      assert.equal(await rendered.locator('p:first-child strong').textContent(),'One\nTwo');
      assert.equal(await rendered.locator('ul li:nth-child(2)').textContent(),expected.list);
      assert.equal(await rendered.locator('ul li:nth-child(2) a').getAttribute('href'),'/p/link');
      assert.equal(await rendered.locator('table td').textContent(),expected.cell);
      assert.equal(await rendered.locator('p:last-child').textContent(),expected.native);
      assert.equal(await rendered.evaluate(el=>getComputedStyle(el).whiteSpace),'pre-wrap');
      await publicPage.close();
    }
    assert.deepEqual(errors,[],`no browser errors at ${width}px`);
    await page.close();
  }
});
