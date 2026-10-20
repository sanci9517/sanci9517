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

test('Rich Text paste stays inside LI/TD, rejects cross-cell replacement and preserves published parity',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:state.document.pages[pageId].rootId}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:{
    schemaVersion:1,type:'richtext-document',blocks:[
      {type:'bulleted-list',items:[
        [{type:'text',text:'Alpha',marks:[]}],
        [{type:'text',text:'Beta',marks:[]}],
        [{type:'text',text:'Gamma',marks:['italic']}]
      ]},
      {type:'table',rows:[{cells:[
        {header:true,align:'center',children:[{type:'text',text:'Head',marks:[]}]},
        {header:false,align:'right',children:[{type:'text',text:'Cell',marks:[]}]}
      ]}]},
      {type:'paragraph',children:[{type:'text',text:'Outro',marks:[]}]}
    ]
  }}});
  const fixture=structuredClone(state.document);
  let draft=structuredClone(fixture),published=null,version=1;const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,title:'Nested paste',slug:'nested-paste',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'test-revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'nested-paste',title:'Nested paste',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/nested-paste'?'/visual-page.html':url.pathname;
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
    page.setDefaultTimeout(9500);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/editor-v2/index.html');
    await page.locator(`.node[data-node-id="${nodeId}"]`).waitFor();
    await page.locator(`.node[data-node-id="${nodeId}"]`).evaluate(node=>node.click());
    await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
    await page.locator('.inspector-tabs button').nth(1).evaluate(button=>button.click());
    const editor=page.locator('.richtext-editor-surface');await editor.waitFor();

    const dispatchPaste=async(startSelector,startOffset,endSelector,endOffset,html,text)=>{
      return editor.evaluate((el,{startSelector,startOffset,endSelector,endOffset,html,text})=>{
        const startEl=el.querySelector(startSelector),endEl=el.querySelector(endSelector);
        const start=document.createTreeWalker(startEl,NodeFilter.SHOW_TEXT).nextNode();
        const end=document.createTreeWalker(endEl,NodeFilter.SHOW_TEXT).nextNode();
        el.focus();
        const range=document.createRange();range.setStart(start,startOffset);range.setEnd(end,endOffset);
        const selected=window.getSelection();selected.removeAllRanges();selected.addRange(range);
        const data=new DataTransfer();data.setData('text/html',html);data.setData('text/plain',text);
        const before=el.innerHTML;
        el.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:data}));
        return {before,after:el.innerHTML,selected:selected.toString()};
      },{startSelector,startOffset,endSelector,endOffset,html,text});
    };

    // A Word-like inline formatting selection affects just one LI.
    await dispatchPaste('ul li:nth-child(2)',1,'ul li:nth-child(2)',3,
      '<p><a href="/p/inserted"><strong>NEW</strong></a></p>','NEW');
    assert.deepEqual(await editor.locator('ul > li').allTextContents(),['Alpha','BNEWa','Gamma']);
    assert.equal(await editor.locator('ul li:nth-child(2) a strong').textContent(),'NEW');
    assert.equal(await editor.locator('ul').count(),1,'never insert another list inside an LI');
    const canvas=page.locator(`.node[data-node-id="${nodeId}"] .richtext-content`).first();
    assert.deepEqual(await canvas.locator('ul > li').allTextContents(),['Alpha','BNEWa','Gamma']);
    assert.equal(await canvas.locator('ul li:nth-child(2) a').getAttribute('href'),'/p/inserted');

    // Multiple source paragraphs inside one table cell become plain text,
    // preserving table structure and the header + alignment metadata.
    await dispatchPaste('table td',2,'table td',2,
      '<p>One</p><p>Two</p>','One\nTwo');
    assert.equal(await editor.locator('table').count(),1);
    assert.equal(await editor.locator('table td').textContent(),'CeOne\nTwoll');
    assert.equal(await editor.locator('table th').textContent(),'Head');
    assert.equal(await canvas.locator('table td').textContent(),'CeOne\nTwoll');
    assert.equal(await canvas.locator('table td').evaluate(el=>el.style.textAlign),'right');

    // A selection spanning two different cells must be rejected atomically.
    const rejected=await dispatchPaste('table th',1,'table td',1,'<p>Unsafe</p>','Unsafe');
    assert.equal(rejected.before,rejected.after,'cross-cell replacement cannot change the DOM');
    assert.match(await page.locator('.richtext-format-feedback').textContent(),/Több listaelem vagy táblázatcella/);
    assert.equal(await editor.locator('table th').textContent(),'Head');
    assert.equal(await editor.locator('table td').textContent(),'CeOne\nTwoll');
    // A single pasted paragraph is inline at the selection: no unintended
    // sibling paragraphs, while the native caret stays beside the new mark.
    await dispatchPaste('p:last-child',2,'p:last-child',2,
      '<p><strong>INSERT</strong></p>','INSERT');
    assert.deepEqual(await editor.locator('p').allTextContents(),['OuINSERTtro']);
    assert.equal(await editor.locator('p strong').textContent(),'INSERT');
    assert.equal(await editor.locator('p').count(),1,'single-block paste must keep the destination paragraph');
    const caretAfterPaste=await editor.evaluate(el=>{
      const native=window.getSelection();
      const anchor=native?.anchorNode;
      const node=anchor?.nodeType===Node.ELEMENT_NODE?anchor:anchor?.parentElement;
      return {inside:el.contains(anchor),paragraph:node?.closest('p')?.textContent??null,collapsed:native?.isCollapsed};
    });
    assert.deepEqual(caretAfterPaste,{inside:true,paragraph:'OuINSERTtro',collapsed:true},
      'caret remains inside the inserted paragraph, not a detached root marker');
    await editor.evaluate(el=>{el.focus();document.execCommand('insertText',false,'!')});
    assert.deepEqual(await editor.locator('p').allTextContents(),['OuINSERT!tro'],
      'typing continues directly after the pasted Rich Text');
    assert.match(await editor.locator('p strong').textContent(),/INSERT/,'insertion does not remove the pasted bold style');

    // A mobile toolbar may steal selection. Never silently append at page end.
    const outsidePaste=await editor.evaluate(el=>{
      const outside=document.getElementById('save');
      outside.focus();
      const range=document.createRange();range.selectNodeContents(outside);
      const native=window.getSelection();native.removeAllRanges();native.addRange(range);
      const before=el.innerHTML;
      const data=new DataTransfer();data.setData('text/html','<p>LOST</p>');data.setData('text/plain','LOST');
      el.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:data}));
      return {unchanged:before===el.innerHTML,selectionOutside:!el.contains(native.anchorNode)};
    });
    assert.deepEqual(outsidePaste,{unchanged:true,selectionOutside:true},
      'lost selection cannot change the document');
    assert.match(await page.locator('.richtext-format-feedback').textContent(),/beillesztés helye elveszett/);

    assert.equal(posts.length,0,'pasting locally never invokes Save or Publish');

    if(width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(posts.length,1);assert.equal(posts[0].publish,false);
      assert.equal(published,null,'draft Save must not publish');
      await page.locator('#publish').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
      assert.equal(posts.at(-1).publish,true);
      const model=published.pages[pageId].nodes[nodeId].props.richText;
      assert.equal(model.blocks[0].items.length,3);
      assert.equal(model.blocks[0].items[1].map(item=>item.text).join(''),'BNEWa');
      assert.equal(model.blocks[0].items[1].find(item=>item.text==='NEW')?.link?.href,'/p/inserted');
      assert.equal(model.blocks[1].rows[0].cells[0].header,true);
      assert.equal(model.blocks[1].rows[0].cells[0].align,'center');
      assert.equal(model.blocks[1].rows[0].cells[1].align,'right');
      assert.equal(model.blocks[1].rows[0].cells[1].children.map(item=>item.text).join(''),'CeOne\nTwoll');
      assert.deepEqual(model.blocks.slice(2).map(block=>block.children.map(run=>run.text).join('')),['OuINSERT!tro']);
      assert.equal(model.blocks[2].children.some(run=>run.text.includes('INSERT')&&run.marks?.includes('bold')),true,
        'formatted runs may merge with the next typed character but retain their bold mark');
      const publicTab=await browser.newPage({viewport:{width:390,height:870}});
      await publicTab.goto(base+'/p/nested-paste');
      const output=publicTab.locator('.visual-richtext');await output.waitFor();
      assert.deepEqual(await output.locator('ul li').allTextContents(),['Alpha','BNEWa','Gamma']);
      assert.equal(await output.locator('ul li:nth-child(2) a strong').textContent(),'NEW');
      assert.equal(await output.locator('table td').textContent(),'CeOne\nTwoll');
      assert.equal(await output.locator('table th').textContent(),'Head');
      assert.deepEqual(await output.locator('p').allTextContents(),['OuINSERT!tro']);
      assert.match(await output.locator('p strong').textContent(),/INSERT/,'published paste retains its bold text');
      await publicTab.close();
    }
    // Inserting at the editor root boundary must not replace the first UL.
    const rootInsert=await editor.evaluate(async el=>{
      const {pasteRichTextDocument}=await import('/editor-v2/core/richtext-paste.js');
      const native=window.getSelection(),range=document.createRange();
      range.setStart(el,0);range.collapse(true);
      native.removeAllRanges();native.addRange(range);
      const ok=pasteRichTextDocument(el,{
        schemaVersion:1,type:'richtext-document',
        blocks:[{type:'paragraph',children:[{type:'text',text:'PREFIX',marks:[]}]}]
      });
      const anchor=native.anchorNode;
      const element=anchor?.nodeType===Node.ELEMENT_NODE?anchor:anchor?.parentElement;
      return {ok,first:el.firstElementChild?.textContent,
        listCount:el.querySelectorAll('ul').length,
        caretParagraph:element?.closest('p')?.textContent};
    });
    assert.deepEqual(rootInsert,{ok:true,first:'PREFIX',listCount:1,caretParagraph:'PREFIX'},
      'root-level insertion is zero-width and does not delete the first list');

    // Two imported blocks intentionally remain separate, unlike one inline
    // fragment. Check the pure shared paste engine without touching the draft.
    const multi=await page.evaluate(async()=>{
      const {renderRichTextEditor}=await import('/editor-v2/core/richtext-engine.js');
      const {pasteRichTextDocument}=await import('/editor-v2/core/richtext-paste.js');
      const host=document.createElement('div');host.contentEditable='true';
      document.body.append(host);
      renderRichTextEditor(host,{schemaVersion:1,type:'richtext-document',blocks:[
        {type:'paragraph',children:[{type:'text',text:'BeforeAfter',marks:[]}]}
      ]});
      const text=document.createTreeWalker(host.firstElementChild,NodeFilter.SHOW_TEXT).nextNode();
      const range=document.createRange();range.setStart(text,6);range.collapse(true);
      const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
      const ok=pasteRichTextDocument(host,{schemaVersion:1,type:'richtext-document',blocks:[
        {type:'paragraph',children:[{type:'text',text:'First',marks:['bold']}]},
        {type:'paragraph',children:[{type:'text',text:'Second',marks:['italic']}]}
      ]});
      const result={ok,paragraphs:[...host.children].map(el=>el.textContent),
        strong:host.querySelector('strong')?.textContent,
        italic:host.querySelector('em')?.textContent};
      host.remove();return result;
    });
    assert.deepEqual(multi,{ok:true,paragraphs:['Before','First','Second','After'],strong:'First',italic:'Second'});

    assert.deepEqual(errors,[],`no page errors at ${width}px`);
    await page.close();
  }
});
