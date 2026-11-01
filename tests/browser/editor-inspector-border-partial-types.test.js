import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {NODE_TYPES,createDocument} from '../../public/editor-v2/core/schema.js';
import {activePage,createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {getElementCapability} from '../../public/editor-v2/core/capability-matrix.js';
import {plainTextToRichText} from '../../public/editor-v2/core/richtext-engine.js';

const publicDir=resolve(import.meta.dirname,'../../public');
const properties=[
  {id:'border.style',key:'borderStyle',type:'select',css:'borderStyle',devices:{desktop:{value:'solid',expected:'solid'},tablet:{value:'dashed',expected:'dashed'},mobile:{value:'dotted',expected:'dotted'}}},
  {id:'border.width',key:'borderWidth',type:'dimension',css:'borderWidth',devices:{desktop:{value:'2px',expected:'2px'},tablet:{value:'5px',expected:'5px'},mobile:{value:'3px',expected:'3px'}}},
  {id:'border.color',key:'borderColor',type:'color',css:'borderColor',devices:{desktop:{value:'#334155',expected:'rgb(51, 65, 85)'},tablet:{value:'#db2777',expected:'rgb(219, 39, 119)'},mobile:{value:'#0891b2',expected:'rgb(8, 145, 178)'}}}
];
const cssFor=device=>Object.fromEntries(properties.map(property=>[property.css,property.devices[device].expected]));

test('all editable PARTIAL types preserve responsive border fields through Inspector, Canvas, Save, Publish and reset',async t=>{
  const model=createEditorState(createDocument()),page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}],authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Responsive szegély próba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Responsive szegély próba'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  assert.equal(nodes.length,45,'fixture includes root plus every editable PARTIAL type');
  const editableNodes=nodes.filter(node=>node.type!==NODE_TYPES.ROOT);
  let draft=structuredClone(model.document),published=structuredClone(draft),revision=1;
  const requests=[],errors=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-border-partials',title:'Inspector border fixtures',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);requests.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-border-partials',title:'Inspector border fixtures',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector border test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(30000);editor.on('pageerror',error=>errors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody'),canvas=id=>editor.locator(`.node[data-node-id="${id}"]`),publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  await viewer.waitForFunction(count=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=count,editableNodes.length);
  const field=id=>inspector.locator(`[data-property-id="${id}"]`);
  const ensureGroupOpen=async control=>{
    const group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
  };
  const activateEditorDevice=async device=>{
    const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);
    if(!await button.evaluate(el=>el.classList.contains('active')))await button.click();
  };
  const activateViewerDevice=async device=>{
    const width={desktop:1366,tablet:768,mobile:390}[device],changed=await viewer.evaluate(next=>window.innerWidth!==next,width);
    const rendered=changed?viewer.waitForResponse(response=>response.url().includes('/api/public/presentation')):null;
    await viewer.setViewportSize({width,height:900});if(rendered)await rendered;
    await viewer.waitForFunction(expected=>window.innerWidth===expected&&document.querySelector('.visual-editor-node[data-node-id]')!==null,width);
  };
  const readCss=node=>node.evaluate((el,keys)=>Object.fromEntries(keys.map(key=>[key,getComputedStyle(el)[key]])),properties.map(property=>property.css));
  const setBorder=async({type,id},property,device)=>{
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const control=field(property.id);await ensureGroupOpen(control);
    assert.equal(await control.getAttribute('data-property-command'),'responsive.set',`${type}: ${device} ${property.id} command`);
    assert.equal(await control.getAttribute('data-property-key'),property.key,`${type}: ${device} ${property.id} Page Model key`);
    const value=property.devices[device].value;
    if(property.type==='select')await control.locator('select:not(.property-token-picker)').selectOption(value);
    else if(property.type==='dimension'){
      await control.locator('.dimension-controls select:not(.property-token-picker)').selectOption('px');
      const input=control.locator('.dimension-controls input[type="number"]');await input.fill(value.replace(/px$/,''));await input.press('Tab');
    }else{
      const input=control.locator('.typed-color-controls input[type="text"]');await input.fill(value);await input.press('Tab');
    }
    assert.equal(await canvas(id).evaluate((el,key)=>getComputedStyle(el)[key],property.css),property.devices[device].expected,`${type}: ${device} ${property.key} reaches Canvas CSS`);
  };
  const restoreDevice=async device=>{
    await editor.reload({waitUntil:'domcontentloaded'});await activateEditorDevice(device);
    for(const {type,id} of editableNodes){
      await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
      for(const property of properties){
        const control=field(property.id);await ensureGroupOpen(control);
        const input=property.type==='select'?control.locator('select:not(.property-token-picker)'):property.type==='dimension'?control.locator('.dimension-controls input[type="number"]'):control.locator('.typed-color-controls input[type="text"]');
        const value=property.devices[device].value;
        assert.equal(await input.inputValue(),property.type==='dimension'?value.replace(/px$/,''):value,`${type}: ${device} ${property.key} restores after reload`);
      }
    }
  };
  const setDevice=async device=>{for(const node of editableNodes)for(const property of properties)await setBorder(node,property,device)};
  const assertDeviceStored=(node,device,snapshot)=>{
    const {type,id}=node;
    for(const property of properties)assert.equal(snapshot.pages[pageId].nodes[id].responsive?.[device]?.[property.key],property.devices[device].value,`${type}: ${device} ${property.key} is stored`);
  };
  const assertCssFor=async(device,label)=>{
    for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),cssFor(device),`${type}: ${label}`);
  };

  await activateEditorDevice('desktop');await setDevice('desktop');
  const desktopExpected=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(canvas(id))])));
  const publicBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(requests.at(-1).publish,false,'desktop Save remains draft-only');
  for(const node of editableNodes){
    assertDeviceStored(node,'desktop',draft);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[node.id].responsive?.desktop?.[property.key],undefined,`${node.type}: desktop Save does not publish ${property.key}`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicBaseline[id],`${type}: draft Save leaves public border unchanged`);
  await restoreDevice('desktop');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),desktopExpected[id],`${type}: desktop Publish matches Canvas`);
    assertDeviceStored({type,id},'desktop',published);
  }

  await activateEditorDevice('tablet');await activateViewerDevice('tablet');await setDevice('tablet');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const node of editableNodes){
    assertDeviceStored(node,'tablet',draft);
    for(const property of properties){
      assert.equal(published.pages[pageId].nodes[node.id].responsive?.tablet?.[property.key],undefined,`${node.type}: tablet Save does not publish ${property.key}`);
      assert.equal(draft.pages[pageId].nodes[node.id].responsive.desktop[property.key],property.devices.desktop.value,`${node.type}: tablet Save preserves desktop ${property.key}`);
    }
  }
  await viewer.reload();await assertCssFor('desktop','tablet draft Save leaves the desktop publication unchanged');
  await restoreDevice('tablet');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();await assertCssFor('tablet','tablet Publish applies border width/style/color');
  await activateViewerDevice('desktop');await assertCssFor('desktop','tablet Publish preserves independent desktop border values');
  await activateViewerDevice('mobile');await assertCssFor('tablet','mobile inherits published tablet border values');

  await activateEditorDevice('mobile');await activateViewerDevice('mobile');await setDevice('mobile');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const node of editableNodes){
    assertDeviceStored(node,'mobile',draft);
    for(const property of properties){
      assert.equal(published.pages[pageId].nodes[node.id].responsive?.mobile?.[property.key],undefined,`${node.type}: mobile Save does not publish ${property.key}`);
      assert.equal(draft.pages[pageId].nodes[node.id].responsive.tablet[property.key],property.devices.tablet.value,`${node.type}: mobile Save preserves tablet ${property.key}`);
      assert.equal(draft.pages[pageId].nodes[node.id].responsive.desktop[property.key],property.devices.desktop.value,`${node.type}: mobile Save preserves desktop ${property.key}`);
    }
  }
  await viewer.reload();await assertCssFor('tablet','mobile draft Save leaves the published tablet values unchanged');
  await restoreDevice('mobile');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();await assertCssFor('mobile','mobile Publish applies border width/style/color');
  await activateViewerDevice('tablet');await assertCssFor('tablet','mobile Publish preserves tablet border values');
  await activateViewerDevice('desktop');await assertCssFor('desktop','mobile Publish preserves desktop border values');

  await activateEditorDevice('mobile');
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id);await ensureGroupOpen(control);
      const reset=inspector.locator(`.property-reset[data-property-key="${property.key}"]`);
      assert.equal(await reset.count(),1,`${type}: mobile ${property.key} exposes inheritance reset`);
      assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: mobile ${property.key} reset uses the responsive command`);
      await reset.click();
    }
    assert.deepEqual(await readCss(canvas(id)),Object.fromEntries(properties.map(property=>[property.css,property.devices.tablet.expected])),`${type}: mobile border reset inherits tablet on Canvas`);
  }
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(requests.at(-1).publish,false,'mobile border reset Save remains draft-only');
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile[property.key],undefined,`${type}: reset Save removes mobile ${property.key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile[property.key],property.devices.mobile.value,`${type}: reset Save preserves published mobile ${property.key}`);
  }
  await activateViewerDevice('mobile');await viewer.reload();await assertCssFor('mobile','reset Save leaves mobile publication unchanged');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();await assertCssFor('tablet','reset Publish returns mobile to tablet border inheritance');
  await activateViewerDevice('desktop');await assertCssFor('desktop','mobile reset does not change desktop border values');
  await activateViewerDevice('mobile');await assertCssFor('tablet','mobile resolves its reset values from tablet');
  assert.deepEqual(errors,[],'all PARTIAL border Inspector controls open without browser errors');
});
