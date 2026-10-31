import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {NODE_TYPES,createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {getElementCapability} from '../../public/editor-v2/core/capability-matrix.js';
import {plainTextToRichText} from '../../public/editor-v2/core/richtext-engine.js';

const publicDir=resolve(import.meta.dirname,'../../public');
const properties=[
  {id:'typography.fontFamily',key:'fontFamily',type:'select',css:'fontFamily',desktop:{value:'Georgia',expected:'Georgia'},tablet:{value:'Arial',expected:'Arial'},mobile:{value:'Verdana',expected:'Verdana'}},
  {id:'typography.fontSize',key:'fontSize',type:'dimension',css:'fontSize',desktop:{value:'24px',expected:'24px'},tablet:{value:'26px',expected:'26px'},mobile:{value:'20px',expected:'20px'}},
  {id:'typography.fontWeight',key:'fontWeight',type:'select',css:'fontWeight',desktop:{value:'800',expected:'800'},tablet:{value:'600',expected:'600'},mobile:{value:'900',expected:'900'}},
  {id:'typography.fontStyle',key:'fontStyle',type:'select',css:'fontStyle',desktop:{value:'italic',expected:'italic'},tablet:{value:'normal',expected:'normal'},mobile:{value:'italic',expected:'italic'}},
  {id:'typography.lineHeight',key:'lineHeight',type:'number',css:'lineHeight',desktop:{value:'1.7',expected:'40.8px'},tablet:{value:'1.4',expected:'36.4px'},mobile:{value:'2',expected:'40px'}},
  {id:'typography.letterSpacing',key:'letterSpacing',type:'dimension',css:'letterSpacing',desktop:{value:'2px',expected:'2px'},tablet:{value:'1px',expected:'1px'},mobile:{value:'3px',expected:'3px'}},
  {id:'typography.textAlign',key:'textAlign',type:'select',css:'textAlign',desktop:{value:'center',expected:'center'},tablet:{value:'left',expected:'left'},mobile:{value:'right',expected:'right'}},
  {id:'typography.textTransform',key:'textTransform',type:'select',css:'textTransform',desktop:{value:'uppercase',expected:'uppercase'},tablet:{value:'lowercase',expected:'lowercase'},mobile:{value:'capitalize',expected:'capitalize'}},
  {id:'typography.textDecoration',key:'textDecoration',type:'select',css:'textDecorationLine',desktop:{value:'underline',expected:'underline'},tablet:{value:'line-through',expected:'line-through'},mobile:{value:'overline',expected:'overline'}},
  {id:'typography.textWrap',key:'textWrap',type:'select',css:'textWrap',desktop:{value:'nowrap',expected:'nowrap'},tablet:{value:'wrap',expected:'wrap'},mobile:{value:'nowrap',expected:'nowrap'}},
  {id:'typography.overflowWrap',key:'overflowWrap',type:'select',css:'overflowWrap',desktop:{value:'anywhere',expected:'anywhere'},tablet:{value:'break-word',expected:'break-word'},mobile:{value:'normal',expected:'normal'}},
  {id:'typography.wordSpacing',key:'wordSpacing',type:'dimension',css:'wordSpacing',desktop:{value:'3px',expected:'3px'},tablet:{value:'1px',expected:'1px'},mobile:{value:'4px',expected:'4px'}},
  {id:'typography.textIndent',key:'textIndent',type:'dimension',css:'textIndent',desktop:{value:'8px',expected:'8px'},tablet:{value:'4px',expected:'4px'},mobile:{value:'12px',expected:'12px'}},
  {id:'typography.textShadow',key:'textShadow',type:'select',css:'textShadow',desktop:{value:'0 2px 8px #0006',expected:'rgba(0, 0, 0, 0.4) 0px 2px 8px'},tablet:{value:'0 4px 16px #000a',expected:'rgba(0, 0, 0, 0.667) 0px 4px 16px'},mobile:{value:'0 0 16px #7c3aed80',expected:'rgba(124, 58, 237, 0.5) 0px 0px 16px'}}
];

test('all editable PARTIAL types preserve typed typography fields through Inspector, Canvas, draft Save, reload and Publish',async t=>{
  const model=createEditorState(createDocument()),pageId=model.document.activePageId;
  const rootId=model.document.pages[pageId].rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}],authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Tipográfia próbaszöveg')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Tipográfia próbaszöveg'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  assert.equal(nodes.length,45,'fixture contains root plus every editable PARTIAL type');
  const editableNodes=nodes.filter(node=>node.type!==NODE_TYPES.ROOT);
  let draft=structuredClone(model.document),published=structuredClone(draft),revision=1;
  const requests=[],editorErrors=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-typography-partials',title:'Typography Inspector fixtures',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);requests.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-typography-partials',title:'Typography Inspector fixtures',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Typography Inspector test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(30000);editor.on('pageerror',error=>editorErrors.push(error.message));
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
    await viewer.setViewportSize({width,height:900});
    if(rendered)await rendered;
    await viewer.waitForFunction(expected=>window.innerWidth===expected&&document.querySelector('.visual-editor-node[data-node-id]')!==null,width);
  };
  const setField=async({type,id},property,device)=>{
    await canvas(id).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const control=field(property.id);await ensureGroupOpen(control);
    const {value,expected}=property[device];
    assert.equal(await control.count(),1,`${type}: ${property.id} renders as one typed Inspector field`);
    assert.equal(await control.getAttribute('data-property-command'),'responsive.set',`${type}: ${property.id} uses the responsive command`);
    assert.equal(await control.getAttribute('data-property-key'),property.key,`${type}: ${property.id} maps to the Page Model key`);
    if(property.type==='select')await control.locator('select:not(.property-token-picker)').selectOption(value);
    else if(property.type==='dimension'){
      await control.locator('.dimension-controls select:not(.property-token-picker)').selectOption('px');
      const input=control.locator('.dimension-controls input[type="number"]');await input.fill(value.replace(/px$/,''));await input.press('Tab');
    }else{const input=control.locator('input[type="number"]');await input.fill(value);await input.press('Tab')}
    assert.equal(await canvas(id).evaluate((el,key)=>getComputedStyle(el)[key],property.css),expected,`${type}: ${device} ${property.key} reaches Canvas CSS`);
  };
  const readCss=node=>node.evaluate((el,keys)=>Object.fromEntries(keys.map(key=>[key,getComputedStyle(el)[key]])),properties.map(property=>property.css));
  const expectedFor=device=>Object.fromEntries(properties.map(property=>[property.css,property[device].expected]));
  const baseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));

  await activateEditorDevice('desktop');
  for(const node of editableNodes)for(const property of properties)await setField(node,property,'desktop');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(requests.at(-1).publish,false,'Save remains draft-only');
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(draft.pages[pageId].nodes[id].responsive?.desktop?.[property.key],property.desktop.value,`${type}: Save stores ${property.key} in the desktop draft`);
    assert.equal(published.pages[pageId].nodes[id].responsive?.desktop?.[property.key],undefined,`${type}: Save does not publish ${property.key}`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),baseline[id],`${type}: draft Save leaves published typography unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id);await ensureGroupOpen(control);
      const input=property.type==='select'?control.locator('select:not(.property-token-picker)'):property.type==='dimension'?control.locator('.dimension-controls input[type="number"]'):control.locator('input[type="number"]');
      assert.equal(await input.inputValue(),property.type==='dimension'?property.desktop.value.replace(/px$/,''):property.desktop.value,`${type}: ${property.key} restores in Inspector after reload`);
    }
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  assert.equal(requests.at(-1).publish,true,'Publish is an explicit second operation');
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),expectedFor('desktop'),`${type}: published typography CSS matches the Inspector and Canvas`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[property.key],property.desktop.value,`${type}: Publish stores ${property.key}`);
  }

  const restoreDeviceInInspector=async device=>{
    await editor.reload({waitUntil:'domcontentloaded'});await activateEditorDevice(device);
    for(const {type,id} of editableNodes){
      await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
      for(const property of properties){
        const control=field(property.id);await ensureGroupOpen(control);
        const input=property.type==='select'?control.locator('select:not(.property-token-picker)'):property.type==='dimension'?control.locator('.dimension-controls input[type="number"]'):control.locator('input[type="number"]');
        const expectedValue=property[device].value;
        assert.equal(await input.inputValue(),property.type==='dimension'?expectedValue.replace(/px$/,''):expectedValue,`${type}: ${device} ${property.key} restores after Editor reload`);
      }
    }
  };
  const assertDraftDevice=({type,id},device)=>{
    for(const property of properties)assert.equal(draft.pages[pageId].nodes[id].responsive?.[device]?.[property.key],property[device].value,`${type}: draft stores ${device} ${property.key}`);
  };
  const assertPublishedDevice=({type,id},device)=>{
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive?.[device]?.[property.key],property[device].value,`${type}: Publish stores ${device} ${property.key}`);
  };

  await activateEditorDevice('tablet');await activateViewerDevice('tablet');
  for(const node of editableNodes)for(const property of properties)await setField(node,property,'tablet');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(requests.at(-1).publish,false,'tablet Save remains draft-only');
  for(const node of editableNodes){
    assertDraftDevice(node,'tablet');
    for(const property of properties){
      assert.equal(published.pages[pageId].nodes[node.id].responsive?.tablet?.[property.key],undefined,`${node.type}: tablet Save leaves published ${property.key} unchanged`);
      assert.equal(draft.pages[pageId].nodes[node.id].responsive.desktop[property.key],property.desktop.value,`${node.type}: tablet Save preserves desktop ${property.key}`);
    }
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),expectedFor('desktop'),`${type}: tablet draft Save leaves the published desktop typography visible`);
  await restoreDeviceInInspector('tablet');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  assert.equal(requests.at(-1).publish,true,'tablet Publish is a separate explicit operation');
  await viewer.reload();
  for(const node of editableNodes){
    assert.deepEqual(await readCss(publicNode(node.id)),expectedFor('tablet'),`${node.type}: tablet Publish applies all typography overrides`);
    assertPublishedDevice(node,'tablet');
  }
  await activateViewerDevice('desktop');
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),expectedFor('desktop'),`${type}: tablet overrides do not change desktop typography`);
  await activateViewerDevice('mobile');
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),expectedFor('tablet'),`${type}: mobile inherits tablet typography before its own override`);

  await activateEditorDevice('mobile');await activateViewerDevice('mobile');
  for(const node of editableNodes)for(const property of properties)await setField(node,property,'mobile');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(requests.at(-1).publish,false,'mobile Save remains draft-only');
  for(const node of editableNodes){
    assertDraftDevice(node,'mobile');
    for(const property of properties){
      assert.equal(published.pages[pageId].nodes[node.id].responsive?.mobile?.[property.key],undefined,`${node.type}: mobile Save leaves published ${property.key} unchanged`);
      assert.equal(draft.pages[pageId].nodes[node.id].responsive.tablet[property.key],property.tablet.value,`${node.type}: mobile Save preserves independent tablet ${property.key}`);
      assert.equal(draft.pages[pageId].nodes[node.id].responsive.desktop[property.key],property.desktop.value,`${node.type}: mobile Save preserves desktop ${property.key}`);
    }
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),expectedFor('tablet'),`${type}: mobile draft Save leaves the published tablet fallback visible`);
  await restoreDeviceInInspector('mobile');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  assert.equal(requests.at(-1).publish,true,'mobile Publish is a separate explicit operation');
  await viewer.reload();
  for(const node of editableNodes){
    assert.deepEqual(await readCss(publicNode(node.id)),expectedFor('mobile'),`${node.type}: mobile Publish applies all typography overrides`);
    assertPublishedDevice(node,'mobile');
  }
  await activateViewerDevice('tablet');
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),expectedFor('tablet'),`${type}: mobile overrides do not change tablet typography`);
  await activateViewerDevice('desktop');
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),expectedFor('desktop'),`${type}: mobile overrides do not change desktop typography`);

  await activateEditorDevice('mobile');
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const control=field('typography.fontSize');await ensureGroupOpen(control);
    const reset=inspector.locator('.property-reset[data-property-key="fontSize"]');
    assert.equal(await reset.count(),1,`${type}: mobile font size exposes responsive inheritance reset`);
    assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: mobile font size reset uses the shared responsive command`);
    await reset.click();
    assert.equal(await canvas(id).evaluate(el=>getComputedStyle(el).fontSize),propertyValue('typography.fontSize','tablet'),`${type}: mobile font-size reset inherits tablet on Canvas`);
  }
  function propertyValue(id,device){return properties.find(property=>property.id===id)[device].expected}
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const node of editableNodes){
    assert.equal(draft.pages[pageId].nodes[node.id].responsive.mobile.fontSize,undefined,`${node.type}: mobile reset removes only the mobile font-size draft override`);
    assert.equal(published.pages[pageId].nodes[node.id].responsive.mobile.fontSize,properties.find(property=>property.key==='fontSize').mobile.value,`${node.type}: reset Save leaves published mobile font size intact`);
  }
  await activateViewerDevice('mobile');await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),expectedFor('mobile'),`${type}: mobile reset Save does not change published typography`);
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    const css=await readCss(publicNode(id));
    assert.equal(css.fontSize,propertyValue('typography.fontSize','tablet'),`${type}: mobile reset Publish inherits tablet font size`);
    for(const property of properties.filter(property=>property.key!=='fontSize')){
      const expected=property.key==='lineHeight'?`${Number(propertyValue('typography.fontSize','tablet').replace('px',''))*Number(property.mobile.value)}px`:property.mobile.expected;
      assert.equal(css[property.css],expected,`${type}: mobile reset preserves its other ${property.key} override`);
    }
  }
  await activateViewerDevice('tablet');
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),expectedFor('tablet'),`${type}: mobile reset leaves tablet typography unchanged`);
  await activateViewerDevice('desktop');
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),expectedFor('desktop'),`${type}: mobile reset leaves desktop typography unchanged`);
  assert.deepEqual(editorErrors,[],'opening all PARTIAL typography fields produces no browser errors');
});
