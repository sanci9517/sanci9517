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

test('Rich Text native cross-paragraph and list selection survives marks, Save and Publish on mobile and desktop',async t=>{
  const model=createEditorState(createDocument());
  const pageId=model.document.activePageId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT,parentId:model.document.pages[pageId].rootId}});
  const nodeId=model.selection.primaryId;
  execute(model,{type:'richtext.content.set',payload:{nodeId,document:{
    schemaVersion:1,type:'richtext-document',
    blocks:[{type:'paragraph',children:[{type:'text',text:'Alpha Beta',marks:[]}]},
      {type:'paragraph',children:[{type:'text',text:'Gamma Delta',marks:[]}]},
      {type:'bulleted-list',items:[
        [{type:'text',text:'List One',marks:[]}],
        [{type:'text',text:'List Two',marks:[]}]
      ]}]
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
      if(payload.publish)published=structuredClone(draft);
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
    draft=structuredClone(model.document);published=null;version=1;writes.length=0;
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
    await surface.scrollIntoViewIfNeeded();
    const endpoints=await surface.evaluate(editor=>{
      const blocks=[...editor.querySelectorAll('[data-rich-block]')];
      const first=document.createTreeWalker(blocks[0],NodeFilter.SHOW_TEXT).nextNode();
      const second=document.createTreeWalker(blocks[1],NodeFilter.SHOW_TEXT).nextNode();
      if(first?.nodeValue!=='Alpha Beta'||second?.nodeValue!=='Gamma Delta')throw new Error('Rich Text fixture missing');
      const characterRect=(node,offset)=>{
        const range=document.createRange();range.setStart(node,offset);range.setEnd(node,offset+1);
        const rect=range.getBoundingClientRect();
        if(!rect.width||!rect.height)throw new Error('Cannot measure native selection endpoints');
        return {left:rect.left,right:rect.right,y:rect.top+rect.height/2};
      };
      return {start:characterRect(first,6),end:characterRect(second,4)};
    });
    // Exercise the browser's native user-selection path, not addRange(): this
    // is the same cross-paragraph drag gesture used to select text in the UI.
    await page.mouse.move(endpoints.start.left+1,endpoints.start.y);
    await page.mouse.down();
    await page.mouse.move(endpoints.end.right-1,endpoints.end.y,{steps:12});
    await page.mouse.up();
    const selectionText=await page.evaluate(()=>window.getSelection()?.toString()??'');
    assert.match(selectionText,/Beta[\s\S]*Gamma/,'native drag must select the intended text across paragraphs');
    const segments=await surface.evaluate(async editor=>{
      const {getRichTextFormattingSelection}=await import('/editor-v2/core/richtext-links.js');
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
    await page.getByLabel('Hivatkozás címe').fill('/p/multi-block');
    await page.getByRole('button',{name:'Link beállítása',exact:true}).click();
    assert.deepEqual(await surface.locator('a').allTextContents(),['Beta','Gamma'],'one selected phrase spanning paragraphs must link each selected block segment');
    assert.ok((await surface.locator('a').evaluateAll(anchors=>anchors.every(anchor=>anchor.getAttribute('href')==='/p/multi-block'))),'every block segment must receive the same safe destination');
    assert.match(await page.evaluate(()=>window.getSelection()?.toString()??''),/Beta[\s\S]*Gamma/,'cross-block link insertion must preserve the native selection');
    await page.getByRole('button',{name:'Link eltávolítása',exact:true}).click();
    assert.equal(await surface.locator('a').count(),0,'unlink removes only the selected links across all selected blocks');
    await page.getByLabel('Hivatkozás címe').fill('/p/multi-block');
    await page.getByRole('button',{name:'Link beállítása',exact:true}).click();
    assert.deepEqual(await surface.locator('a').allTextContents(),['Beta','Gamma'],'link insertion remains repeatable after unlink');
    const canvas=page.locator(`.node[data-node-id="${nodeId}"] .richtext-content`).first();
    assert.deepEqual(await canvas.locator('strong').allTextContents(),['Beta','Gamma'],'canvas must mirror the Inspector model');
    assert.deepEqual(await canvas.locator('em').allTextContents(),['Beta','Gamma']);
    assert.deepEqual(await canvas.locator('code').allTextContents(),['Beta','Gamma']);
    const listItems=surface.locator('ul > li');
    await listItems.nth(1).scrollIntoViewIfNeeded();
    const listEndpoints=await listItems.evaluateAll(items=>{
      const point=(item,offset)=>{
        const text=document.createTreeWalker(item,NodeFilter.SHOW_TEXT).nextNode();
        if(!text)throw new Error('Rich Text list item has no text');
        const range=document.createRange();range.setStart(text,offset);range.setEnd(text,offset+1);
        const rect=range.getBoundingClientRect();
        if(!rect.width||!rect.height)throw new Error('Cannot measure native list selection endpoint');
        return {left:rect.left,right:rect.right,y:rect.top+rect.height/2};
      };
      return {start:point(items[0],1),end:point(items[1],6)};
    });
    await page.mouse.move(listEndpoints.start.left+1,listEndpoints.start.y);
    await page.mouse.down();
    await page.mouse.move(listEndpoints.end.right-1,listEndpoints.end.y,{steps:8});
    await page.mouse.up();
    assert.match(await page.evaluate(()=>window.getSelection()?.toString()??''),/ist One[\s\S]*List Tw/,
      'native drag must select through both list items');
    const listSegments=await surface.evaluate(async editor=>{
      const {getRichTextFormattingSelection}=await import('/editor-v2/core/richtext-links.js');
      return getRichTextFormattingSelection(editor)?.segments;
    });
    assert.deepEqual(listSegments,[{blockIndex:2,from:1,to:15}],
      'model offsets must omit the visual separator between nested list items');
    await page.getByRole('button',{name:'Aláhúzott',exact:true}).click();
    assert.deepEqual(await listItems.locator('u').allTextContents(),['ist One','List Tw'],
      'one native selection formats both list-item segments');
    assert.match(await page.evaluate(()=>window.getSelection()?.toString()??''),/ist One[\s\S]*List Tw/,
      'list selection must survive the Inspector re-render');
    assert.deepEqual(await canvas.locator('ul > li u').allTextContents(),['ist One','List Tw'],
      'Canvas must mirror inline marks across both list items');
    const reverseEndpoints=await listItems.evaluateAll(items=>{
      const point=(item,offset)=>{
        const walker=document.createTreeWalker(item,NodeFilter.SHOW_TEXT),texts=[];let text,total=0;
        while(text=walker.nextNode()){texts.push({node:text,start:total});total+=text.nodeValue.length}
        const match=texts.find(part=>offset<part.start+part.node.nodeValue.length);
        if(!match)throw new Error('Cannot locate native reverse-selection character');
        const local=offset-match.start,range=document.createRange();range.setStart(match.node,local);range.setEnd(match.node,local+1);
        const rect=range.getBoundingClientRect();return {left:rect.left,right:rect.right,y:rect.top+rect.height/2};
      };
      return {start:point(items[1],6),end:point(items[0],1)};
    });
    // Collapse the previous selection with an ordinary click first; dragging
    // from inside an existing contenteditable selection otherwise extends its
    // old anchor instead of beginning a new reverse selection in Chromium.
    await page.mouse.click(reverseEndpoints.start.right-1,reverseEndpoints.start.y);
    await page.mouse.move(reverseEndpoints.start.right-1,reverseEndpoints.start.y);
    await page.mouse.down();
    await page.mouse.move(reverseEndpoints.end.left+1,reverseEndpoints.end.y,{steps:8});
    await page.mouse.up();
    const backwardSelection=await surface.evaluate(async editor=>{
      const {getRichTextFormattingSelection}=await import('/editor-v2/core/richtext-links.js');
      const {getSelectionOffsets}=await import('/editor-v2/core/richtext-engine.js');
      const native=window.getSelection();
      return {format:getRichTextFormattingSelection(editor),offsets:getSelectionOffsets(editor),text:native?.toString(),
        anchor:[native?.anchorNode?.nodeValue,native?.anchorOffset],focus:[native?.focusNode?.nodeValue,native?.focusOffset]};
    });
    assert.match(backwardSelection.text,/ist One[\s\S]*List Tw/,'reverse native drag must select the same list text');
    assert.deepEqual(backwardSelection.format,{segments:[{blockIndex:2,from:1,to:15}],backward:true},
      `the Page Model range must retain native backward direction: ${JSON.stringify(backwardSelection)}`);
    assert.equal(backwardSelection.offsets.backward,true,'the DOM bookmark must report backward selection');
    await page.getByRole('button',{name:'Áthúzott',exact:true}).click();
    assert.deepEqual(await listItems.locator('s').allTextContents(),['ist One','List Tw'],
      'reverse selection formatting must update both list items');
    const restoredBackward=await surface.evaluate(async editor=>{
      const {getRichTextFormattingSelection}=await import('/editor-v2/core/richtext-links.js');
      const native=window.getSelection();
      const item=node=>(node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement)?.closest('li')?.textContent;
      return {range:getRichTextFormattingSelection(editor),anchorItem:item(native?.anchorNode),focusItem:item(native?.focusNode)};
    });
    assert.equal(restoredBackward.range.backward,true,'Inspector rerender must preserve backward direction');
    assert.equal(restoredBackward.anchorItem,'List Two','backward anchor must remain in the second list item');
    assert.equal(restoredBackward.focusItem,'List One','backward focus must remain in the first list item');

    // A native range can cross a paragraph/list boundary even though the
    // canonical document stores these as different block shapes.
    await surface.evaluate(editor=>{
      const body=editor.closest('.inspector-body');
      const startRoot=editor.querySelectorAll('[data-rich-block]')[1],endRoot=editor.querySelector('ul > li:nth-child(2)');
      const point=(root,offset)=>{
        const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];let node,total=0;
        while(node=walker.nextNode()){nodes.push({node,start:total});total+=node.nodeValue.length}
        const part=nodes.find(item=>offset<item.start+item.node.nodeValue.length);
        const range=document.createRange(),local=offset-part.start;range.setStart(part.node,local);range.setEnd(part.node,local+1);
        const rect=range.getBoundingClientRect();return {x:(rect.left+rect.right)/2,y:rect.top+rect.height/2};
      };
      // On narrow screens the sticky Inspector title can cover the first
      // paragraph; scroll its own body until both native endpoints are hit-testable.
      for(let attempt=0;attempt<12;attempt++){
        const start=point(startRoot,2),end=point(endRoot,3);
        if(editor.contains(document.elementFromPoint(start.x,start.y))&&editor.contains(document.elementFromPoint(end.x,end.y)))return;
        if(!body||body.scrollTop<=0)break;
        body.scrollTop=Math.max(0,body.scrollTop-24);
      }
      throw new Error('Paragraph/list selection endpoints are covered by the Inspector overlay');
    });
    const mixedEndpoints=await surface.evaluate(editor=>{
      const point=(root,offset)=>{
        const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];let node,total=0;
        while(node=walker.nextNode()){nodes.push({node,start:total});total+=node.nodeValue.length}
        const part=nodes.find(item=>offset<item.start+item.node.nodeValue.length);
        if(!part)throw new Error('Cannot locate mixed paragraph/list selection endpoint');
        const range=document.createRange(),local=offset-part.start;
        range.setStart(part.node,local);range.setEnd(part.node,local+1);
        const rect=range.getBoundingClientRect();
        if(!rect.width||!rect.height)throw new Error('Cannot measure mixed selection endpoint');
        return {left:rect.left,right:rect.right,y:rect.top+rect.height/2};
      };
      return {start:point(editor.querySelectorAll('[data-rich-block]')[1],2),
        end:point(editor.querySelector('ul > li:nth-child(2)'),3)};
    });
    await page.mouse.click(mixedEndpoints.start.right-1,mixedEndpoints.start.y);
    await page.mouse.move(mixedEndpoints.start.left+1,mixedEndpoints.start.y);
    await page.mouse.down();
    await page.mouse.move(mixedEndpoints.end.right-1,mixedEndpoints.end.y,{steps:10});
    await page.mouse.up();
    assert.match(await page.evaluate(()=>window.getSelection()?.toString()??''),
      /mma Delta[\s\S]*List One[\s\S]*List/,
      `native selection must cross paragraph into list content: ${JSON.stringify(mixedEndpoints)}`);
    const mixedSegments=await surface.evaluate(async editor=>{
      const {getRichTextFormattingSelection}=await import('/editor-v2/core/richtext-links.js');
      return getRichTextFormattingSelection(editor)?.segments;
    });
    assert.deepEqual(mixedSegments,[{blockIndex:1,from:2,to:11},{blockIndex:2,from:0,to:12}],
      'paragraph and list-item text must use separate canonical block offsets');
    await page.getByRole('button',{name:'Alsó index',exact:true}).click();
    assert.deepEqual(await surface.locator('p').nth(1).locator('sub').allTextContents(),['mma',' Delta']);
    assert.deepEqual(await listItems.locator('sub').allTextContents(),['L','ist One','List'],
      'one cross-structure mark operation updates both block types');
    assert.match(await page.evaluate(()=>window.getSelection()?.toString()??''),
      /mma Delta[\s\S]*List One[\s\S]*List/,'paragraph-to-list selection must survive Inspector rerender');
    const canvasMixed=page.locator(`.node[data-node-id="${nodeId}"] .richtext-content`).first();
    assert.deepEqual(await canvasMixed.locator('p').nth(1).locator('sub').allTextContents(),['mma',' Delta']);
    assert.deepEqual(await canvasMixed.locator('ul > li sub').allTextContents(),['L','ist One','List'],
      'Canvas mirrors the mixed-block selection from the Page Model');
    await page.getByLabel('Hivatkozás címe').fill('/p/paragraph-list');
    await page.getByRole('button',{name:'Link beállítása',exact:true}).click();
    assert.equal((await surface.locator('p').nth(1).locator('a[href="/p/paragraph-list"]').allTextContents()).join(''),'mma Delta',
      'a native cross-structure selection links only its selected paragraph range');
    assert.deepEqual(await listItems.locator('a[href="/p/paragraph-list"]').allTextContents(),['L','ist One','List'],
      'the same link operation applies only selected text in each list item');
    assert.ok(await surface.locator('a[href="/p/paragraph-list"]').count()>=3,
      'the link destination is applied across the paragraph and both selected list items');
    assert.equal((await canvasMixed.locator('a[href="/p/paragraph-list"]').allTextContents()).join(''),'mma DeltaList OneList',
      'Canvas mirrors mixed-structure links without losing nested marks');
    assert.match(await page.evaluate(()=>window.getSelection()?.toString()??''),
      /mma Delta[\\s\\S]*List One[\\s\\S]*List/,'mixed-structure link insertion preserves the native selection');
    if(width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(writes.length,1);
      assert.equal(writes[0].publish,false,'draft Save must not publish');
      const persisted=writes[0].document.pages[pageId].nodes[nodeId].props.richText;
      assert.equal(persisted.blocks[0].children.find(run=>run.text==='Beta')?.marks?.includes('bold'),true);
      assert.equal(persisted.blocks[1].children.filter(run=>run.marks?.includes('italic')).map(run=>run.text).join(''),'Gamma');
      assert.equal(persisted.blocks[0].children.find(run=>run.text==='Beta')?.marks?.includes('code'),true);
      assert.equal(persisted.blocks[1].children.filter(run=>run.marks?.includes('code')).map(run=>run.text).join(''),'Gamma');
      assert.equal(persisted.blocks[0].children.find(run=>run.text==='Beta')?.link?.href,'/p/multi-block');
      assert.equal(persisted.blocks[1].children.filter(run=>run.link?.href==='/p/multi-block').map(run=>run.text).join(''),'Ga');
      assert.equal(persisted.blocks[1].children.filter(run=>run.marks?.includes('subscript')).map(run=>run.text).join(''),'mma Delta');
      assert.deepEqual(persisted.blocks[2].items.map(item=>item.filter(run=>run.marks?.includes('underline')).map(run=>run.text).join('')),
        ['ist One','List Tw'],'Save must retain native list selection formatting');
      assert.deepEqual(persisted.blocks[2].items.map(item=>item.filter(run=>run.marks?.includes('strikethrough')).map(run=>run.text).join('')),
        ['ist One','List Tw'],'Save must retain backward native selection formatting');
      assert.deepEqual(persisted.blocks[2].items.map(item=>item.filter(run=>run.marks?.includes('subscript')).map(run=>run.text).join('')),
        ['List One','List'],'Save retains subscript formatting across paragraph/list boundary');
      assert.equal(persisted.blocks[1].children.filter(run=>run.link?.href==='/p/paragraph-list').map(run=>run.text).join(''),'mma Delta',
        'Save retains the selected paragraph segment link');
      assert.deepEqual(persisted.blocks[2].items.map(item=>item.filter(run=>run.link?.href==='/p/paragraph-list').map(run=>run.text).join('')),
        ['List One','List'],'Save retains links only on the selected list-item segments');
      assert.equal(persisted.blocks[0].children.map(run=>run.text).join(''),'Alpha Beta');
      assert.equal(persisted.blocks[1].children.map(run=>run.text).join(''),'Gamma Delta');
      assert.equal(published,null,'desktop Save must leave the public page unchanged');
      await page.locator('#publish').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
      assert.equal(writes.at(-1).publish,true,'multi-block link changes require a separate Publish');
    }else{
      assert.equal(writes.length,0,'mobile format remains an uncommitted draft until explicit Save');
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(writes.length,1);
      assert.equal(writes[0].publish,false,'mobile multi-block Save must remain draft-only');
      assert.equal(published,null,'mobile Save must leave the public page unchanged');
      const persisted=writes[0].document.pages[pageId].nodes[nodeId].props.richText;
      assert.equal(persisted.blocks[0].children.find(run=>run.text==='Beta')?.marks?.includes('bold'),true);
      assert.equal(persisted.blocks[1].children.filter(run=>run.marks?.includes('italic')).map(run=>run.text).join(''),'Gamma');
      assert.equal(persisted.blocks[0].children.find(run=>run.text==='Beta')?.link?.href,'/p/multi-block');
      assert.equal(persisted.blocks[1].children.filter(run=>run.link?.href==='/p/multi-block').map(run=>run.text).join(''),'Gamma');
      assert.equal(persisted.blocks[1].children.filter(run=>run.marks?.includes('subscript')).map(run=>run.text).join(''),'mma Delta');
      assert.deepEqual(persisted.blocks[2].items.map(item=>item.filter(run=>run.marks?.includes('underline')).map(run=>run.text).join('')),
        ['ist One','List Tw'],'mobile Save must retain native list selection formatting');
      assert.deepEqual(persisted.blocks[2].items.map(item=>item.filter(run=>run.marks?.includes('strikethrough')).map(run=>run.text).join('')),
        ['ist One','List Tw'],'mobile Save must retain backward native selection formatting');
      assert.deepEqual(persisted.blocks[2].items.map(item=>item.filter(run=>run.marks?.includes('subscript')).map(run=>run.text).join('')),
        ['List One','List'],'mobile Save retains cross-structure subscript formatting');
      assert.equal(persisted.blocks[1].children.filter(run=>run.link?.href==='/p/paragraph-list').map(run=>run.text).join(''),'mma Delta',
        'mobile Save retains the selected paragraph segment link');
      assert.deepEqual(persisted.blocks[2].items.map(item=>item.filter(run=>run.link?.href==='/p/paragraph-list').map(run=>run.text).join('')),
        ['List One','List'],'mobile Save retains links only on selected list-item segments');
      await page.locator('#publish').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
      assert.equal(writes.at(-1).publish,true,'mobile multi-block changes require a separate Publish');
    }
    assert.equal(published.pages[pageId].nodes[nodeId].props.richText.blocks[0].children.find(run=>run.text==='Beta')?.link?.href,'/p/multi-block');
    assert.equal(published.pages[pageId].nodes[nodeId].props.richText.blocks[1].children.filter(run=>run.link?.href==='/p/multi-block').map(run=>run.text).join(''),'Ga');
    const publicPage=await browser.newPage({viewport:{width:390,height:850}});
    await publicPage.goto('http://127.0.0.1:'+server.address().port+'/p/selection-test');
    const publicSurface=publicPage.locator('.visual-richtext');await publicSurface.waitFor();
    assert.equal((await publicSurface.locator('strong').allTextContents()).join(''),'BetaGamma');
    assert.equal((await publicSurface.locator('em').allTextContents()).join(''),'BetaGamma');
    assert.equal((await publicSurface.locator('a[href="/p/multi-block"]').allTextContents()).join(''),'BetaGa',
      'the published renderer preserves the untouched part of a previously linked phrase');
    assert.ok((await publicSurface.locator('a[href="/p/multi-block"]').evaluateAll(anchors=>anchors.every(anchor=>anchor.getAttribute('href')==='/p/multi-block'))));
    const publishedListItems=publicSurface.locator('ul > li');
    const publishedMarkText=async tag=>publishedListItems.evaluateAll((items,tag)=>items.map(item=>[...item.querySelectorAll(tag)].map(node=>node.textContent).join('')),tag);
    assert.equal((await publicSurface.locator('a[href="/p/paragraph-list"]').allTextContents()).join(''),'mma DeltaList OneList',
      'the published renderer retains linked text across paragraph and list structures');
    assert.equal((await publicSurface.locator('a[href="/p/paragraph-list"]').evaluateAll(anchors=>new Set(anchors.map(anchor=>anchor.closest('li')).filter(Boolean)).size)),2,
      'published links remain scoped to the two selected list-item containers');
    assert.deepEqual(await publishedMarkText('u'),['ist One','List Tw'],
      'published rendering must retain marks applied across list items');
    assert.deepEqual(await publishedMarkText('s'),['ist One','List Tw'],
      'published rendering must retain formatting from the backward selection');
    assert.deepEqual(await publicSurface.locator('p').nth(1).locator('sub').allTextContents(),['mma',' Delta']);
    assert.deepEqual(await publishedMarkText('sub'),['List One','List'],
      'published rendering retains subscript formatting across paragraph/list boundary');
    await publicPage.close();
    assert.deepEqual(errors,[],`no browser errors at ${width}px`);
    await page.close();
  }
});
