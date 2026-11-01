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

test('Rich Text keyboard selection across paragraphs retains direction through Inspector, Save and Publish',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:state.document.pages[pageId].rootId}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:{schemaVersion:1,type:'richtext-document',blocks:[
    {type:'paragraph',children:[{type:'text',text:'Alpha Beta',marks:[]}]},
    {type:'paragraph',children:[{type:'text',text:'Gamma Delta',marks:[]}]}
  ]}}});
  let draft=structuredClone(state.document),published=null,revision=1;
  const writes=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=value=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(value))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,title:'Keyboard selection',slug:'keyboard-selection',content:draft,revision,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;
      const payload=JSON.parse(body);writes.push(payload);draft=structuredClone(payload.document);revision++;
      if(payload.publish)published=structuredClone(payload.document);
      return json({ok:true,data:{pageId,version:revision,revisionId:`keyboard-${revision}`}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'keyboard-selection',title:'Keyboard selection',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{}});
    const file=resolve(root,'.'+(url.pathname==='/p/keyboard-selection'?'/visual-page.html':url.pathname));
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(resolve=>server.close(resolve))});
  const page=await browser.newPage({viewport:{width:1366,height:850}});page.setDefaultTimeout(7000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await page.locator(`.node[data-node-id="${nodeId}"]`).waitFor();
  await page.locator(`.node[data-node-id="${nodeId}"]`).evaluate(element=>element.click());
  await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
  await page.locator('.inspector-tabs button').nth(1).evaluate(button=>button.click());
  const surface=page.locator('.richtext-editor-surface');await surface.waitFor();

  // Put only the caret with DOM APIs; create the actual range by native
  // Shift+ArrowRight input, crossing the paragraph boundary in Chromium.
  await surface.evaluate(editor=>{
    const block=editor.querySelector('[data-rich-block]'),text=document.createTreeWalker(block,NodeFilter.SHOW_TEXT).nextNode();
    const range=document.createRange();range.setStart(text,6);range.collapse(true);editor.focus();
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
  });
  for(let i=0;i<10;i++)await page.keyboard.press('Shift+ArrowRight');
  const forward=await surface.evaluate(async editor=>{
    const [{getRichTextFormattingSelection},{getSelectionOffsets}]=await Promise.all([
      import('/editor-v2/core/richtext-links.js'),import('/editor-v2/core/richtext-engine.js')]);
    return {text:window.getSelection()?.toString(),format:getRichTextFormattingSelection(editor),offsets:getSelectionOffsets(editor)};
  });
  assert.equal(forward.text,'Beta\n\nGamma','native keyboard selection must cross the paragraph separator');
  assert.deepEqual(forward.format,{segments:[{blockIndex:0,from:6,to:10},{blockIndex:1,from:0,to:5}]});
  assert.equal(forward.offsets.backward,undefined,'rightward keyboard selection must stay forward');
  await page.getByRole('button',{name:'Félkövér',exact:true}).click();
  assert.deepEqual(await surface.locator('strong').allTextContents(),['Beta','Gamma']);
  assert.equal(await page.evaluate(()=>window.getSelection()?.toString()),'Beta\n\nGamma');

  // Rebuild the reverse direction from the other endpoint through native
  // Shift+ArrowLeft and ensure the toolbar re-render cannot normalize it.
  await surface.evaluate(editor=>{
    const block=editor.querySelectorAll('[data-rich-block]')[1],text=document.createTreeWalker(block,NodeFilter.SHOW_TEXT).nextNode();
    const range=document.createRange();range.setStart(text,5);range.collapse(true);editor.focus();
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
  });
  for(let i=0;i<10;i++)await page.keyboard.press('Shift+ArrowLeft');
  const backward=await surface.evaluate(async editor=>{
    const {getRichTextFormattingSelection}=await import('/editor-v2/core/richtext-links.js');
    const selection=window.getSelection();
    const block=node=>(node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement)?.closest('[data-rich-block]')?.textContent;
    return {text:selection?.toString(),format:getRichTextFormattingSelection(editor),anchor:block(selection?.anchorNode),
      focus:block(selection?.focusNode)};
  });
  assert.equal(backward.text,'Beta\n\nGamma');
  assert.deepEqual(backward.format,{segments:[{blockIndex:0,from:6,to:10},{blockIndex:1,from:0,to:5}],backward:true});
  assert.equal(backward.anchor,'Gamma Delta','reverse keyboard selection anchor must remain at the later paragraph');
  assert.equal(backward.focus,'Alpha Beta','reverse keyboard selection focus must remain at the earlier paragraph');
  await page.getByRole('button',{name:'Dőlt',exact:true}).click();
  assert.deepEqual(await surface.locator('em').allTextContents(),['Beta','Gamma']);
  const restored=await surface.evaluate(async editor=>{
    const {getRichTextFormattingSelection}=await import('/editor-v2/core/richtext-links.js');
    const native=window.getSelection(),block=node=>(node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement)?.closest('[data-rich-block]')?.textContent;
    return {selection:getRichTextFormattingSelection(editor),anchor:block(native?.anchorNode),focus:block(native?.focusNode)};
  });
  assert.equal(restored.selection.backward,true);
  assert.equal(restored.anchor,'Gamma Delta');assert.equal(restored.focus,'Alpha Beta');

  await page.locator('#save').click();await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(writes.length,1);assert.equal(writes[0].publish,false);assert.equal(published,null);
  const saved=writes[0].document.pages[pageId].nodes[nodeId].props.richText.blocks;
  assert.deepEqual(saved[0].children.filter(run=>run.text==='Beta').map(run=>run.marks.sort()),[['bold','italic']]);
  assert.deepEqual(saved[1].children.filter(run=>run.text==='Gamma').map(run=>run.marks.sort()),[['bold','italic']]);
  await page.locator('#publish').click();await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(writes.at(-1).publish,true,'Publish must remain a separate action after draft Save');
  const publicPage=await browser.newPage({viewport:{width:390,height:844}});
  await publicPage.goto(`http://127.0.0.1:${server.address().port}/p/keyboard-selection`);
  const rendered=publicPage.locator('.visual-richtext');await rendered.waitFor();
  assert.deepEqual(await rendered.locator('strong').allTextContents(),['Beta','Gamma']);
  assert.deepEqual(await rendered.locator('em').allTextContents(),['Beta','Gamma']);
  assert.deepEqual(errors,[],'keyboard selection lifecycle must not produce browser errors');
});
