import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {NODE_TYPES,createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {getElementCapability} from '../../public/editor-v2/core/capability-matrix.js';
import {plainTextToRichText} from '../../public/editor-v2/core/richtext-engine.js';

const publicDir=resolve(import.meta.dirname,'../../public');
const properties=['margin','padding'];
const sides=['Top','Right','Bottom','Left'];
const values={
  desktop:{margin:['2px','4px','6px','8px'],padding:['10px','12px','14px','16px']},
  mobile:{margin:['18px','20px','22px','24px'],padding:['26px','28px','30px','32px']}
};
const cssValues=(device)=>Object.fromEntries(properties.flatMap(key=>sides.map((side,index)=>[`${key}${side}`,values[device][key][index]])));

test('all editable PARTIAL types preserve responsive margin and padding through Inspector, Canvas, Save and Publish',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Responsive térköz próba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Responsive térköz próba'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  assert.equal(nodes.length,45,'fixture contains root plus every editable PARTIAL type');
  const editableNodes=nodes.filter(node=>node.type!==NODE_TYPES.ROOT);
  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  const editorErrors=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-spacing-partials',title:'Inspector spacing fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-spacing-partials',title:'Inspector spacing fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector spacing test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(30000);
  editor.on('pageerror',error=>editorErrors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody');
  const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`);
  const publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  await viewer.waitForFunction(count=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=count,editableNodes.length);
  const field=key=>inspector.locator(`[data-property-id="spacing.${key}"]`);
  const readCss=node=>node.evaluate(el=>{
    const css=getComputedStyle(el),result={};
    for(const property of ['margin','padding'])for(const side of ['Top','Right','Bottom','Left'])result[`${property}${side}`]=css[`${property}${side}`];
    return result;
  });
  const setSpacing=async(type,id,device)=>{
    await canvas(id).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    for(const key of properties){
      const control=field(key),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      assert.equal(await control.getAttribute('data-property-command'),'responsive.set',`${type}: ${device} spacing.${key} command`);
      assert.equal(await control.getAttribute('data-property-key'),key,`${type}: ${device} spacing.${key} Page Model key`);
      for(let index=0;index<sides.length;index++){
        const input=control.locator('.typed-box-side input[type="number"]').nth(index);
        await input.fill(values[device][key][index].slice(0,-2));
        await input.press('Tab');
      }
    }
    assert.deepEqual(await readCss(canvas(id)),cssValues(device),`${type}: ${device} margin/padding sides reach Canvas CSS`);
  };
  const readModel=(nodeId,device,key)=>draft.pages[pageId].nodes[nodeId].responsive?.[device]?.[key];

  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  const publicDesktopBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  for(const {type,id} of editableNodes)await setSpacing(type,id,'desktop');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const key of properties){
    assert.equal(readModel(id,'desktop',key),values.desktop[key].join(' '),`${type}: desktop draft Save stores four ${key} sides`);
    assert.equal(published.pages[pageId].nodes[id].responsive?.desktop?.[key],undefined,`${type}: desktop Save does not publish ${key}`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicDesktopBaseline[id],`${type}: desktop draft Save leaves public spacing unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const key of properties){
      const group=field(key).locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      assert.deepEqual(await field(key).locator('.typed-box-side input[type="number"]').evaluateAll(inputs=>inputs.map(input=>input.value)),values.desktop[key].map(value=>value.slice(0,-2)),`${type}: desktop ${key} sides survive Editor reload`);
    }
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),cssValues('desktop'),`${type}: desktop Publish renders all margin/padding sides`);
    for(const key of properties)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[key],values.desktop[key].join(' '),`${type}: desktop Publish stores ${key}`);
  }

  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  const publicMobileBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  for(const {type,id} of editableNodes)await setSpacing(type,id,'mobile');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const key of properties){
    assert.equal(readModel(id,'mobile',key),values.mobile[key].join(' '),`${type}: mobile draft Save stores all ${key} sides`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.desktop[key],values.desktop[key].join(' '),`${type}: mobile Save preserves desktop ${key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.[key],undefined,`${type}: mobile Save does not publish ${key}`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicMobileBaseline[id],`${type}: mobile draft Save preserves public spacing`);
  await editor.reload({waitUntil:'domcontentloaded'});await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const key of properties){
      const group=field(key).locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      assert.deepEqual(await field(key).locator('.typed-box-side input[type="number"]').evaluateAll(inputs=>inputs.map(input=>input.value)),values.mobile[key].map(value=>value.slice(0,-2)),`${type}: mobile ${key} sides survive Editor reload`);
    }
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),cssValues('mobile'),`${type}: mobile Publish renders all spacing sides`);
  await viewer.setViewportSize({width:1366,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),cssValues('desktop'),`${type}: mobile Publish preserves desktop spacing`);

  await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const key of properties){
      const control=field(key),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=group.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${type}: mobile ${key} exposes inheritance reset`);
      assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: ${key} reset uses responsive.set`);
      await reset.click();
    }
    assert.deepEqual(await readCss(canvas(id)),cssValues('desktop'),`${type}: mobile resets restore desktop spacing`);
  }
  const lastNode=editableNodes.at(-1);
  await editor.locator('#undo').click();
  assert.deepEqual(await readCss(canvas(lastNode.id)),{...cssValues('desktop'),paddingTop:'26px',paddingRight:'28px',paddingBottom:'30px',paddingLeft:'32px'},`${lastNode.type}: Undo restores the final mobile padding override as a four-side box value`);
  await editor.locator('#redo').click();
  assert.deepEqual(await readCss(canvas(lastNode.id)),cssValues('desktop'),`${lastNode.type}: Redo restores inherited desktop spacing`);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const key of properties){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile[key],undefined,`${type}: reset Save removes mobile ${key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile[key],values.mobile[key].join(' '),`${type}: reset Save leaves published mobile ${key}`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),cssValues('mobile'),`${type}: reset Save leaves public mobile spacing unchanged`);
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),cssValues('desktop'),`${type}: reset Publish restores inherited spacing on mobile`);
    for(const key of properties)assert.equal(published.pages[pageId].nodes[id].responsive.mobile[key],undefined,`${type}: reset Publish removes mobile ${key}`);
  }
  assert.deepEqual(editorErrors,[],'opening every PARTIAL spacing Inspector must not throw');
});
