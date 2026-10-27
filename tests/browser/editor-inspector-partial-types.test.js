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
import {getElementCapability,getElementInspectorContract} from '../../public/editor-v2/core/capability-matrix.js';
import {listProperties} from '../../public/editor-v2/core/property-registry.js';
import {isLayoutPropertyRelevant} from '../../public/editor-v2/core/layout-presets.js';
import {plainTextToRichText} from '../../public/editor-v2/core/richtext-engine.js';

const publicDir=resolve(import.meta.dirname,'../../public');
const primaryGroups=new Set(['layout','size','spacing','flex','grid','position','typography','background','border','radius','shadow','opacity','transform','filter','animation']);
const duplicatePrimaryIds=new Set(['content.text','content.href','advanced.nodeName']);

test('every PARTIAL type renders Inspector routes and preserves Save versus Publish for responsive, visibility, hover, and keyboard focus state',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Inspector-típus próba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Inspector-típus próba'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  assert.equal(nodes.length,45,'fixture includes every declared PARTIAL type, including root');
  let editorErrors=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-partial-types',title:'Inspector type fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-partial-types',title:'Inspector type fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}});
  const viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(12000);
  editor.on('pageerror',error=>editorErrors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody');

  for(const {type,id} of nodes){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>{if(!el.classList.contains('selected'))el.click()});
    const contract=getElementInspectorContract(type);
    assert.equal(contract.status,'PARTIAL',`${type}: current capability contract`);
    const pageNode=page.nodes[id],parent=page.nodes[pageNode.parentId];
    const typeProperties=listProperties({nodeType:type}).filter(property=>
      primaryGroups.has(property.group)&&
      !['flex','grid'].includes(property.group)&&
      !duplicatePrimaryIds.has(property.id)&&
      isLayoutPropertyRelevant(property,pageNode,parent,'desktop')
    );
    const contextualLayoutProperties=['flex','grid'].flatMap(group=>listProperties({group})).filter(property=>
      isLayoutPropertyRelevant(property,pageNode,parent,'desktop')
    );
    const expected=[...typeProperties,...contextualLayoutProperties];
    const actual=await inspector.locator('.typed-inspector-field[data-property-id]').evaluateAll(fields=>fields.map(field=>({
      id:field.dataset.propertyId,
      command:field.dataset.propertyCommand,
      key:field.dataset.propertyKey
    })));
    assert.deepEqual(actual.map(field=>field.id).sort(),expected.map(property=>property.id).sort(),`${type}: rendered Inspector fields must match its applicable registry contract`);
    const emptyGroups=await inspector.locator('.inspector-group').evaluateAll(groups=>groups.filter(group=>{
      const title=group.querySelector(':scope > .inspector-group-title');
      const content=group.querySelector(':scope > .inspector-group-content');
      return title&&(content?content.childElementCount===0:group.childElementCount<=1);
    }).map(group=>group.querySelector(':scope > .inspector-group-title')?.textContent?.trim()||'(névtelen csoport)'));
    assert.deepEqual(emptyGroups,[],`${type}: no empty or misleading Inspector groups are rendered`);
    for(const field of actual){
      const property=expected.find(candidate=>candidate.id===field.id);
      assert.ok(property,`${type}/${field.id}: no undeclared field`);
      assert.equal(field.command,property.command,`${type}/${field.id}: actual command route`);
      assert.equal(field.key,property.key,`${type}/${field.id}: actual Page Model route`);
    }
    const nameField=inspector.locator('.field[data-property-id="advanced.nodeName"]');
    assert.equal(await nameField.getAttribute('data-property-command'),contract.fields.find(field=>field.id==='advanced.nodeName').command,`${type}: node name command`);
    assert.equal(await nameField.getAttribute('data-property-key'),contract.fields.find(field=>field.id==='advanced.nodeName').key,`${type}: node name key`);
  }

  const asRgb=hex=>{const value=hex.slice(1);return `rgb(${parseInt(value.slice(0,2),16)}, ${parseInt(value.slice(2,4),16)}, ${parseInt(value.slice(4,6),16)})`};
  const editableNodes=nodes.filter(({type})=>type!=='root');
  const colors=editableNodes.map((_,index)=>'#'+((0x102030+index*0x030507)&0xffffff).toString(16).padStart(6,'0'));
  const publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  const publicBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await publicNode(id).evaluate(el=>getComputedStyle(el).backgroundColor)])));
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    const field=inspector.locator('.typed-inspector-field[data-property-id="background.color"]');
    assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}: shared style command`);
    assert.equal(await field.getAttribute('data-property-key'),'backgroundColor',`${type}: shared style Page Model key`);
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    await field.locator('input[type="color"]').evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}))},colors[index]);
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(colors[index]),`${type}: Inspector style reaches Canvas`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(draft.pages[pageId].nodes[id].responsive.desktop.backgroundColor,colors[index],`${type}: draft Save stores Inspector color`);
    assert.equal(published.pages[pageId].nodes[id].responsive?.desktop?.backgroundColor,undefined,`${type}: Save leaves published snapshot unchanged`);
  }
  await viewer.reload();
  for(const {id} of editableNodes)assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).backgroundColor),publicBaseline[id],'draft Save preserves public rendering');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(published.pages[pageId].nodes[id].responsive.desktop.backgroundColor,colors[index],`${type}: explicit Publish copies Inspector color to public snapshot`);
    assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(colors[index]),`${type}: published style matches the Inspector edit`);
  }

  // The same Inspector route must write a distinct mobile override for every
  // PARTIAL type without replacing its already-published desktop style.
  const mobileColors=editableNodes.map((_,index)=>'#'+((0xc04020+index*0x020509)&0xffffff).toString(16).padStart(6,'0'));
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const field=inspector.locator('.typed-inspector-field[data-property-id="background.color"]');
    assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}: mobile style command`);
    assert.equal(await field.getAttribute('data-property-key'),'backgroundColor',`${type}: mobile style Page Model key`);
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    await field.locator('input[type="color"]').evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}))},mobileColors[index]);
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(mobileColors[index]),`${type}: mobile Inspector override reaches the Canvas`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.backgroundColor,mobileColors[index],`${type}: draft Save stores the mobile override`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.backgroundColor,undefined,`${type}: mobile Save leaves published mobile style unchanged`);
    assert.equal(published.pages[pageId].nodes[id].responsive.desktop.backgroundColor,colors[index],`${type}: mobile Save preserves the published desktop style`);
  }
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(colors[index]),`${type}: mobile draft Save keeps inherited public desktop color`);
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const [index,{type,id}] of editableNodes.entries()){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const field=inspector.locator('.typed-inspector-field[data-property-id="background.color"]');
    assert.equal(await field.locator('input[type="color"]').inputValue(),mobileColors[index],`${type}: mobile color survives Editor reload`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.backgroundColor,mobileColors[index],`${type}: explicit Publish stores the mobile override`);
    assert.equal(published.pages[pageId].nodes[id].responsive.desktop.backgroundColor,colors[index],`${type}: mobile Publish preserves the desktop override`);
    assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(mobileColors[index]),`${type}: published mobile color matches the Inspector`);
  }
  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(colors[index]),`${type}: mobile Publish preserves desktop public color`);

  // The shared responsive visibility controls are also part of each type's
  // Inspector contract. Exercise the mobile route for every partial type and
  // keep Save isolated from the published page until the explicit Publish.
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  for(const {type,id} of editableNodes){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').nth(2).click();
    const visibilityGroup=inspector.locator('.inspector-group').filter({hasText:'Akadálymentesség és láthatóság'});
    const title=visibilityGroup.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const toggle=visibilityGroup.locator('[data-inspector-key="visibility.mobile"]');
    assert.equal(await toggle.getAttribute('data-inspector-command'),'element.visibility.set',`${type}: mobile visibility command`);
    assert.equal(await toggle.getAttribute('data-inspector-key'),'visibility.mobile',`${type}: mobile visibility Page Model key`);
    const checkbox=toggle.locator('input[type="checkbox"]');
    assert.equal(await checkbox.isChecked(),true,`${type}: mobile visibility starts enabled`);
    await checkbox.uncheck();
    assert.equal(await canvasNode.getAttribute('data-visibility'),'hidden',`${type}: mobile visibility updates the Canvas`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    assert.equal(draft.pages[pageId].nodes[id].visibility.mobile,false,`${type}: Save stores mobile visibility in draft`);
    assert.equal(published.pages[pageId].nodes[id].visibility.mobile,true,`${type}: Save does not change published visibility`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.equal(await publicNode(id).count(),1,`${type}: Save preserves mobile public visibility`);
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.equal(published.pages[pageId].nodes[id].visibility.mobile,false,`${type}: Publish stores hidden mobile visibility`);
    assert.equal(await publicNode(id).count(),0,`${type}: published mobile output hides the node`);
  }

  // Verify the separate interactive-state route for every partial type. The
  // public renderer must keep the previous state through Save and apply the
  // Inspector-authored hover style only after the explicit Publish.
  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  const prepareHoverTargets=async()=>{
    await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
    await viewer.evaluate(()=>{
    for(const element of document.querySelectorAll('.visual-editor-node[data-node-id]')){
      const rect=element.getBoundingClientRect();
      if(rect.width===0||rect.height===0){
        element.style.setProperty('display','block','important');
        element.style.setProperty('width','32px','important');
        element.style.setProperty('height','24px','important');
      }
    }
    });
  };
  await prepareHoverTargets();
  const publicHoverBaseline={};
  for(const {id} of editableNodes){
    await publicNode(id).hover();
    publicHoverBaseline[id]=await publicNode(id).evaluate(el=>({background:getComputedStyle(el).backgroundColor,tabindex:el.getAttribute('tabindex')}));
  }
  const hoverColors=editableNodes.map((_,index)=>'#'+((0x804020+index*0x020307)&0xffffff).toString(16).padStart(6,'0'));
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').nth(2).click();
    let stateGroup=inspector.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
    let stateTitle=stateGroup.locator(':scope > .inspector-group-title');
    if(await stateTitle.getAttribute('aria-expanded')==='false')await stateTitle.click();
    await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('hover');
    stateGroup=inspector.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
    stateTitle=stateGroup.locator(':scope > .inspector-group-title');
    if(await stateTitle.getAttribute('aria-expanded')==='false')await stateTitle.click();
    const stateColor=stateGroup.locator('[data-state-property="backgroundColor"]');
    assert.equal(await stateColor.getAttribute('data-property-command'),'states.set',`${type}: hover command`);
    assert.equal(await stateColor.getAttribute('data-property-key'),'backgroundColor',`${type}: hover Page Model key`);
    const input=stateColor.locator('input[type="text"]');
    await input.fill(hoverColors[index]);
    await input.press('Tab');
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(hoverColors[index]),`${type}: hover preview reaches Canvas`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(draft.pages[pageId].nodes[id].states.hover.desktop.backgroundColor,hoverColors[index],`${type}: Save stores hover state in the draft`);
    assert.equal(published.pages[pageId].nodes[id].states?.hover?.desktop?.backgroundColor,undefined,`${type}: Save leaves the published hover state unchanged`);
  }
  await viewer.reload();
  await prepareHoverTargets();
  for(const {id} of editableNodes){
    await publicNode(id).hover();
    const appearance=await publicNode(id).evaluate(el=>({background:getComputedStyle(el).backgroundColor,tabindex:el.getAttribute('tabindex')}));
    assert.equal(appearance.background,publicHoverBaseline[id].background,'draft Save preserves published hover appearance');
    assert.equal(appearance.tabindex,publicHoverBaseline[id].tabindex,'hover-only style does not add a keyboard stop');
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await prepareHoverTargets();
  for(const [index,{type,id}] of editableNodes.entries()){
    await publicNode(id).hover();
    assert.equal(published.pages[pageId].nodes[id].states.hover.desktop.backgroundColor,hoverColors[index],`${type}: Publish stores hover style`);
    const appearance=await publicNode(id).evaluate(el=>({background:getComputedStyle(el).backgroundColor,tabindex:el.getAttribute('tabindex')}));
    assert.equal(appearance.background,asRgb(hoverColors[index]),`${type}: published hover style reaches public output`);
    assert.equal(appearance.tabindex,publicHoverBaseline[id].tabindex,`${type}: hover-only style adds no keyboard stop`);
  }

  // Keyboard focus styles must make a non-interactive rendered node reachable
  // by keyboard, while native controls must not gain a redundant tab stop.
  const focusColors=editableNodes.map((_,index)=>'#'+((0x306090+index*0x030509)&0xffffff).toString(16).padStart(6,'0'));
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').nth(2).click();
    let stateGroup=inspector.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
    let stateTitle=stateGroup.locator(':scope > .inspector-group-title');
    if(await stateTitle.getAttribute('aria-expanded')==='false')await stateTitle.click();
    await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('focus-visible');
    stateGroup=inspector.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
    stateTitle=stateGroup.locator(':scope > .inspector-group-title');
    if(await stateTitle.getAttribute('aria-expanded')==='false')await stateTitle.click();
    const stateColor=stateGroup.locator('[data-state-property="backgroundColor"]');
    assert.equal(await stateColor.getAttribute('data-property-command'),'states.set',`${type}: focus command`);
    assert.equal(await stateColor.getAttribute('data-property-key'),'backgroundColor',`${type}: focus Page Model key`);
    const input=stateColor.locator('input[type="text"]');
    await input.fill(focusColors[index]);
    await input.press('Tab');
    assert.equal(await canvasNode.getAttribute('data-editor-state'),'focus-visible',`${type}: focus preview is active on Canvas`);
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(focusColors[index]),`${type}: focus preview reaches Canvas`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(draft.pages[pageId].nodes[id].states['focus-visible'].desktop.backgroundColor,focusColors[index],`${type}: Save stores focus style in the draft`);
    assert.equal(published.pages[pageId].nodes[id].states?.['focus-visible']?.desktop?.backgroundColor,undefined,`${type}: Save leaves published focus state unchanged`);
  }
  await viewer.reload();
  await viewer.keyboard.press('Tab');
  for(const [index,{type,id}] of editableNodes.entries()){
    const element=publicNode(id);
    const baseline=await element.evaluate(el=>{el.focus();return{background:getComputedStyle(el).backgroundColor}});
    assert.equal(baseline.background,publicHoverBaseline[id].background,`${type}: draft Save preserves published focus appearance`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await viewer.keyboard.press('Tab');
  for(const [index,{type,id}] of editableNodes.entries()){
    const element=publicNode(id);
    const focus=await element.evaluate(el=>{el.focus();return{background:getComputedStyle(el).backgroundColor,focusVisible:el.matches(':focus-visible'),tabIndex:el.tabIndex,tag:el.tagName.toLowerCase(),href:el.hasAttribute('href'),ariaHidden:el.getAttribute('aria-hidden')==='true'}});
    assert.equal(published.pages[pageId].nodes[id].states['focus-visible'].desktop.backgroundColor,focusColors[index],`${type}: Publish stores focus style`);
    if(focus.ariaHidden){
      assert.equal(focus.tabIndex,-1,`${type}: aria-hidden public output stays outside the keyboard order`);
      assert.equal(await element.getAttribute('tabindex'),null,`${type}: aria-hidden output receives no tabindex`);
      assert.equal(focus.focusVisible,false,`${type}: aria-hidden output cannot receive keyboard focus`);
      continue;
    }
    assert.equal(focus.background,asRgb(focusColors[index]),`${type}: published keyboard focus style reaches public output`);
    assert.equal(focus.focusVisible,true,`${type}: public node matches keyboard focus-visible`);
    const nativeFocusable=['button','input','select','textarea','summary','iframe','object','embed'].includes(focus.tag)||(['a','area'].includes(focus.tag)&&focus.href);
    assert.equal(focus.tabIndex,0,`${type}: public node is keyboard reachable`);
    if(nativeFocusable)assert.equal(await element.getAttribute('tabindex'),null,`${type}: no redundant tabindex on native control`);
    else assert.equal(await element.getAttribute('tabindex'),'0',`${type}: Inspector focus style adds a keyboard tab stop`);
  }
  assert.deepEqual(editorErrors,[],'opening every partial type must not throw');
});
