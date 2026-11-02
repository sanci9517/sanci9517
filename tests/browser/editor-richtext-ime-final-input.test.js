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

test('mobile IME final input commits once after compositionend in Inspector and direct canvas editing',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:state.document.pages[pageId].rootId}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:{
    schemaVersion:1,type:'richtext-document',blocks:[
      {type:'paragraph',children:[{type:'text',text:'Base',marks:[]}]},
      {type:'bulleted-list',items:[
        [{type:'text',text:'List Base',marks:['bold'],link:{href:'/p/list-item'}}],
        [{type:'text',text:'Keep Item',marks:[]}]
      ]},
      {type:'paragraph',children:[{type:'text',text:'Unchanged',marks:[]}]}
    ]
  }}});
  const fixture=structuredClone(state.document);
  let draft=structuredClone(fixture),published=null,version=1;const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,title:'IME test',slug:'ime-test',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;
      const data=JSON.parse(body);posts.push(data);draft=structuredClone(data.document);version++;
      if(data.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'ime-'+version,published:Boolean(data.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'ime-test',title:'IME test',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/ime-test'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base='http://127.0.0.1:'+server.address().port;
  for(const {width,mode} of [{width:390,mode:'inspector'},{width:1366,mode:'inspector'},{width:1366,mode:'canvas'}]){
    draft=structuredClone(fixture);published=null;version=1;posts.length=0;
    const page=await browser.newPage({viewport:{width,height:850}});
    page.setDefaultTimeout(9000);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/editor-v2/index.html');
    const node=page.locator(`.node[data-node-id="${nodeId}"]`);await node.waitFor();
    await node.evaluate(el=>el.click());
    if(mode==='inspector'){
      await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
      await page.locator('.inspector-tabs button').nth(1).evaluate(el=>el.click());
    }else await node.locator('.canvas-edit-richtext').click();
    const source=mode==='inspector'?page.locator('.richtext-editor-surface'):page.locator(`.node[data-node-id="${nodeId}"] .richtext-inline-surface`);
    await source.waitFor();
    const mirrorSelector=mode==='inspector'
      ?`.node[data-node-id="${nodeId}"] .richtext-content`
      :'.richtext-editor-surface';
    const before=await source.evaluate((el,{nodeId})=>{
      const native=window.getSelection();
      el.focus();
      const text=document.createTreeWalker(el.querySelector('p'),NodeFilter.SHOW_TEXT).nextNode();
      const range=document.createRange();range.selectNodeContents(text);
      native.removeAllRanges();native.addRange(range);
      el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true,data:''}));
      text.nodeValue='Vé';
      el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,inputType:'insertCompositionText',data:'Vé'}));
      const intermediate=el.querySelector('p')?.textContent;
      el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'Végleges'}));
      // Some Android keyboards send this replacement after compositionend.
      text.nodeValue='Végleges';
      el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false,inputType:'insertText',data:'Végleges'}));
      const nativeAfter=window.getSelection();
      const canvasBefore=document.querySelector(`.node[data-node-id="${nodeId}"] .node-content.richtext-content p`)?.textContent;
      return {intermediate,final:el.querySelector('p')?.textContent,
        canvasBefore,stillFocused:document.activeElement===el,
        selectionInside:el.contains(nativeAfter?.anchorNode)};
    },{nodeId});
    assert.deepEqual(before,{intermediate:'Vé',final:'Végleges',
      canvasBefore:mode==='inspector'?'Base':'Végleges',stillFocused:true,selectionInside:true},
      `IME DOM events should not detach the active ${mode} at ${width}px`);
    await page.waitForFunction(({nodeId,mode})=>{
      const node=document.querySelector(`.node[data-node-id="${nodeId}"]`);
      if(!node)return false;
      const canvas=node.querySelector('.node-content.richtext-content');
      if(mode==='canvas')return canvas?.querySelector('p')?.textContent==='Végleges';
      return canvas?.querySelector('p')?.textContent==='Végleges';
    },{nodeId,mode});
    assert.deepEqual(await node.locator('.richtext-content p').allTextContents(),['Végleges','Unchanged']);
    assert.equal(posts.length,0,'IME editing is a local draft, not a network save');

    if(mode==='inspector'&&width===1366){
      await page.locator('#undo').click();
      assert.deepEqual(await node.locator('.richtext-content p').allTextContents(),['Base','Unchanged'],
        'Undo must restore the complete pre-IME value in one step');
      await page.locator('#redo').click();
      assert.deepEqual(await node.locator('.richtext-content p').allTextContents(),['Végleges','Unchanged']);
    }
    if(mode==='inspector'&&width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(posts.length,1);assert.equal(posts[0].publish,false);
      assert.equal(published,null);
      assert.equal(draft.pages[pageId].nodes[nodeId].props.richText.blocks[0].children.map(x=>x.text).join(''),'Végleges');
      await page.locator('#publish').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
      assert.equal(posts.at(-1).publish,true);
      const publicPage=await browser.newPage({viewport:{width:390,height:850}});
      await publicPage.goto(base+'/p/ime-test');
      const output=publicPage.locator('.visual-richtext');await output.waitFor();
      assert.deepEqual(await output.locator('p').allTextContents(),['Végleges','Unchanged']);
      await publicPage.close();
    }
    assert.deepEqual(errors,[],`no uncaught browser errors in ${mode} at ${width}px`);
    await page.close();
  }

  // List editing is a distinct structural path from paragraph composition:
  // replacing the text inside an LI must keep its list membership, marks,
  // safe link and the other item while a mobile IME sends its delayed final
  // non-composition input.
  for(const width of [390,1366]){
    draft=structuredClone(fixture);published=null;version=1;posts.length=0;
    const page=await browser.newPage({viewport:{width,height:850}});
    page.setDefaultTimeout(9000);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/editor-v2/index.html');
    const node=page.locator(`.node[data-node-id="${nodeId}"]`);await node.waitFor();
    await node.evaluate(el=>el.click());
    await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
    await page.locator('.inspector-tabs button').nth(1).evaluate(el=>el.click());
    const editor=page.locator('.richtext-editor-surface');await editor.waitFor();
    const result=await editor.locator('ul > li').first().evaluate(async li=>{
      const editor=li.closest('.richtext-editor-surface');
      const text=document.createTreeWalker(li,NodeFilter.SHOW_TEXT).nextNode();
      editor.focus();
      const range=document.createRange();range.selectNodeContents(text);
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      editor.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true,data:''}));
      text.nodeValue='List';
      editor.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,inputType:'insertCompositionText',data:'List'}));
      const intermediate=li.textContent;
      editor.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'List Final'}));
      // Match Android keyboards which replace the composing text after end.
      text.nodeValue='List Final';
      editor.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false,inputType:'insertText',data:'List Final'}));
      const native=window.getSelection();
      return {intermediate,final:li.textContent,stillFocused:document.activeElement===editor,
        selectionInside:editor.contains(native?.anchorNode)};
    });
    assert.deepEqual(result,{intermediate:'List',final:'List Final',stillFocused:true,selectionInside:true},
      `list IME must accept the final input without detaching the editor at ${width}px`);
    await page.waitForFunction(nodeId=>document.querySelector(`.node[data-node-id="${nodeId}"] ul li`)?.textContent==='List Final',nodeId);
    const canvasItems=node.locator('.richtext-content ul > li');
    assert.deepEqual(await canvasItems.allTextContents(),['List Final','Keep Item'],
      'Canvas should mirror the confirmed list item and retain sibling item');
    assert.equal(await canvasItems.first().locator('a strong').textContent(),'List Final',
      'IME replacement must retain the existing linked bold run');
    assert.equal(posts.length,0,'list IME stays in the local draft until explicit Save');
    if(width===1366){
      await page.locator('#undo').click();
      assert.deepEqual(await canvasItems.allTextContents(),['List Base','Keep Item'],
        'Undo restores the original list item without changing list structure');
      assert.equal(await canvasItems.first().locator('a strong').textContent(),'List Base');
      await page.locator('#redo').click();
      assert.deepEqual(await canvasItems.allTextContents(),['List Final','Keep Item']);
    }
    await page.locator('#save').click();
    await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
    assert.equal(posts.length,1);assert.equal(posts[0].publish,false);
    assert.equal(published,null,'list Save cannot update the public snapshot');
    const saved=draft.pages[pageId].nodes[nodeId].props.richText;
    assert.deepEqual(saved.blocks[1].items.map(item=>item.map(run=>run.text).join('')),
      ['List Final','Keep Item']);
    assert.deepEqual(saved.blocks[1].items[0][0],{
      type:'text',text:'List Final',marks:['bold'],link:{href:'/p/list-item'}
    },'list Save retains link and marks around confirmed IME text');
    await page.locator('#publish').click();
    await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
    assert.equal(posts.at(-1).publish,true,'publishing list text requires the separate Publish action');
    const publicPage=await browser.newPage({viewport:{width:390,height:850}});
    await publicPage.goto(base+'/p/ime-test');
    const publicItems=publicPage.locator('.visual-richtext ul > li');
    await publicItems.first().waitFor();
    assert.deepEqual(await publicItems.allTextContents(),['List Final','Keep Item']);
    assert.equal(await publicItems.first().locator('a strong').textContent(),'List Final');
    assert.deepEqual(errors,[],`no uncaught browser errors during list IME at ${width}px`);
    await publicPage.close();await page.close();
  }
});
