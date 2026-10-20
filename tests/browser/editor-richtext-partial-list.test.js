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

test('Inspector transforms selected LI only, caret-selected LI, and maintains canvas/public parity',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:state.document.pages[pageId].rootId}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:{
    schemaVersion:1,type:'richtext-document',blocks:[
      {type:'bulleted-list',items:[
        [{type:'text',text:'Alpha',marks:[]}],
        [{type:'text',text:'Beta',marks:['bold'],link:{href:'/p/beta'}}],
        [{type:'text',text:'Gamma',marks:['italic']}]
      ]},
      {type:'paragraph',children:[{type:'text',text:'Outro',marks:[]}]},
      {type:'table',rows:[{cells:[{header:true,align:'center',children:[{type:'text',text:'Safe',marks:[]}]}]}]}
    ]
  }}});
  const initial=structuredClone(state.document);
  let draft=structuredClone(initial),published=null,version=1;const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,title:'Partial LI',slug:'partial-li',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[]}});
      let body='';for await(const part of req)body+=part;
      const data=JSON.parse(body);posts.push(data);draft=structuredClone(data.document);version++;
      if(data.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'test-'+version,published:Boolean(data.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'partial-li',title:'Partial LI',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/partial-li'?'/visual-page.html':url.pathname;
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
    draft=structuredClone(initial);published=null;version=1;posts.length=0;
    const page=await browser.newPage({viewport:{width,height:860}});
    page.setDefaultTimeout(10000);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/editor-v2/index.html');
    await page.locator(`.node[data-node-id="${nodeId}"]`).waitFor();
    await page.locator(`.node[data-node-id="${nodeId}"]`).evaluate(el=>el.click());
    await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
    await page.locator('.inspector-tabs button').nth(1).evaluate(el=>el.click());
    const editor=page.locator('.richtext-editor-surface');await editor.waitFor();
    await page.getByRole('tab',{name:'Bekezdés',exact:true}).click();
    const blockType=page.getByRole('combobox',{name:'Szövegblokkok típusa'});

    const targets=await editor.evaluate(async el=>{
      const {getRichTextBlockTransformSelection}=await import('/editor-v2/core/richtext-links.js');
      const li=el.querySelector('ul li:nth-child(2)');
      const text=document.createTreeWalker(li,NodeFilter.SHOW_TEXT).nextNode();
      el.focus();const range=document.createRange();range.setStart(text,0);range.setEnd(text,text.length);
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
      return getRichTextBlockTransformSelection(el);
    });
    assert.deepEqual(targets,[{blockIndex:0,from:5,to:9}],`LI substring selection at ${width}px`);
    await blockType.selectOption('heading-3');
    assert.deepEqual(await editor.locator('ul').allTextContents(),['Alpha','Gamma']);
    assert.deepEqual(await editor.locator('h3').allTextContents(),['Beta']);
    assert.equal(await editor.locator('h3 a strong').textContent(),'Beta');
    const canvas=page.locator(`.node[data-node-id="${nodeId}"] .richtext-content`).first();
    assert.deepEqual(await canvas.locator('ul > li').allTextContents(),['Alpha','Gamma']);
    assert.equal(await canvas.locator('h3 a').getAttribute('href'),'/p/beta');

    const caret=await editor.evaluate(async el=>{
      const {getRichTextBlockTransformSelection}=await import('/editor-v2/core/richtext-links.js');
      const li=el.querySelector('ul:last-of-type li');
      const text=document.createTreeWalker(li,NodeFilter.SHOW_TEXT).nextNode();
      el.focus();const range=document.createRange();range.setStart(text,2);range.collapse(true);
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
      return getRichTextBlockTransformSelection(el);
    });
    assert.deepEqual(caret,[{blockIndex:2,itemIndex:0}],`collapsed LI caret at ${width}px`);
    await blockType.selectOption('quote');
    assert.deepEqual(await editor.locator('ul > li').allTextContents(),['Alpha']);
    assert.equal(await editor.locator('h3').textContent(),'Beta');
    assert.equal(await editor.locator('blockquote em').textContent(),'Gamma');
    assert.equal(await editor.locator('table th').textContent(),'Safe');
    assert.deepEqual(await canvas.locator('ul > li').allTextContents(),['Alpha']);
    assert.equal(await canvas.locator('blockquote em').textContent(),'Gamma');
    assert.equal(posts.length,0,'no server write before explicit Save');

    if(width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(posts.length,1);assert.equal(posts[0].publish,false);
      assert.equal(published,null);
      await page.locator('#publish').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
      assert.equal(posts.at(-1).publish,true);
      const model=published.pages[pageId].nodes[nodeId].props.richText;
      assert.deepEqual(model.blocks.map(block=>block.type),['bulleted-list','heading','quote','paragraph','table']);
      assert.equal(model.blocks[1].children[0].link.href,'/p/beta');
      assert.equal(model.blocks[2].children[0].text,'Gamma');
      const publicTab=await browser.newPage({viewport:{width:390,height:850}});
      await publicTab.goto(base+'/p/partial-li');
      const rendered=publicTab.locator('.visual-richtext');await rendered.waitFor();
      assert.deepEqual(await rendered.locator('ul li').allTextContents(),['Alpha']);
      assert.equal(await rendered.locator('h3 a strong').textContent(),'Beta');
      assert.equal(await rendered.locator('blockquote em').textContent(),'Gamma');
      assert.equal(await rendered.locator('table th').textContent(),'Safe');
      await publicTab.close();
    }
    assert.deepEqual(errors,[],`no page errors at ${width}px`);
    await page.close();
  }
});
