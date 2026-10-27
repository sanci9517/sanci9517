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
  editor.setDefaultTimeout(30000);
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
  await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
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

  // Resetting each mobile override must inherit the already-published
  // desktop value, while the old mobile publication remains live until the
  // explicit Publish action.
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const field=inspector.locator('.typed-inspector-field[data-property-id="background.color"]');
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const reset=group.locator('.property-reset[data-property-key="backgroundColor"]');
    assert.equal(await reset.count(),1,`${type}: mobile background color exposes its inheritance reset`);
    assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: mobile reset uses the responsive command`);
    await reset.click();
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(colors[index]),`${type}: mobile reset restores the desktop Canvas color`);
    await editor.locator('#undo').click();
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(mobileColors[index]),`${type}: Undo restores the mobile override`);
    await editor.locator('#redo').click();
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(colors[index]),`${type}: Redo restores inherited desktop color`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.backgroundColor,undefined,`${type}: mobile reset removes the draft override`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.backgroundColor,mobileColors[index],`${type}: reset Save preserves published mobile color`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.desktop.backgroundColor,colors[index],`${type}: mobile reset keeps the desktop draft value`);
  }
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(mobileColors[index]),`${type}: mobile reset Save leaves published CSS in place`);
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const [index,{type,id}] of editableNodes.entries()){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const field=inspector.locator('.typed-inspector-field[data-property-id="background.color"]');
    assert.equal(await field.locator('input[type="color"]').inputValue(),colors[index],`${type}: reset mobile color reloads as inherited desktop value`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.backgroundColor,undefined,`${type}: reset Publish removes public mobile override`);
    assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(colors[index]),`${type}: reset Publish restores inherited desktop public color on mobile`);
  }

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

  // The shared border controls must also be real type-by-type routes. Enable
  // a visible border so the color is observable in both Canvas and public CSS.
  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  const borderColors=editableNodes.map((_,index)=>'#'+((0xa04020+index*0x020509)&0xffffff).toString(16).padStart(6,'0'));
  const publicBorderBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await publicNode(id).evaluate(el=>({width:getComputedStyle(el).borderTopWidth,style:getComputedStyle(el).borderTopStyle,color:getComputedStyle(el).borderTopColor}))])));
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const group=inspector.locator('.inspector-group').filter({hasText:'Szegély'});
    const title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const style=group.locator('[data-property-id="border.style"]');
    const width=group.locator('[data-property-id="border.width"]');
    const color=group.locator('[data-property-id="border.color"]');
    for(const [field,key] of [[style,'borderStyle'],[width,'borderWidth'],[color,'borderColor']]){
      assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}/${key}: Inspector command`);
      assert.equal(await field.getAttribute('data-property-key'),key,`${type}/${key}: Page Model route`);
    }
    await style.locator('select:not(.property-token-picker)').selectOption('solid');
    const widthInput=width.locator('.dimension-controls input[type="number"]');
    await widthInput.fill('2');
    await widthInput.press('Tab');
    await color.locator('input[type="color"]').evaluate((input,value)=>{input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}))},borderColors[index]);
    assert.deepEqual(await canvasNode.evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),{width:'2px',style:'solid',color:asRgb(borderColors[index])},`${type}: Inspector border reaches Canvas CSS`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    const saved=draft.pages[pageId].nodes[id].responsive.desktop;
    assert.equal(saved.borderStyle,'solid',`${type}: Save stores border style`);
    assert.equal(saved.borderWidth,'2px',`${type}: Save stores border width`);
    assert.equal(saved.borderColor,borderColors[index],`${type}: Save stores border color`);
    assert.deepEqual(await publicNode(id).evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),publicBorderBaseline[id],`${type}: border Save leaves published CSS unchanged`);
  }
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  for(const [index,{type,id}] of editableNodes.entries()){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const group=inspector.locator('.inspector-group').filter({hasText:'Szegély'});
    const title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    assert.equal(await group.locator('[data-property-id="border.style"] select:not(.property-token-picker)').inputValue(),'solid',`${type}: saved border style reloads`);
    assert.equal(await group.locator('[data-property-id="border.width"] input[type="number"]').inputValue(),'2',`${type}: saved border width reloads`);
    assert.equal(await group.locator('[data-property-id="border.color"] input[type="color"]').inputValue(),borderColors[index],`${type}: saved border color reloads`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.deepEqual(await publicNode(id).evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),{width:'2px',style:'solid',color:asRgb(borderColors[index])},`${type}: explicit Publish applies the Inspector border`);
    assert.equal(published.pages[pageId].nodes[id].responsive.desktop.borderColor,borderColors[index],`${type}: published Page Model preserves border color`);
  }

  // Mobile border overrides are isolated from the published desktop route;
  // resetting the three fields must restore desktop inheritance atomically
  // in the public appearance after the separate Publish action.
  const mobileBorderColors=editableNodes.map((_,index)=>'#'+((0x20a060+index*0x020509)&0xffffff).toString(16).padStart(6,'0'));
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  // The preceding visibility lifecycle deliberately hid all nodes on mobile.
  // Restore visibility through the real Inspector so public CSS assertions
  // below exercise rendered elements instead of a hidden fixture.
  for(const {type,id} of editableNodes){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').nth(2).click();
    const group=inspector.locator('.inspector-group').filter({hasText:'Akadálymentesség és láthatóság'});
    const title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const checkbox=group.locator('[data-inspector-key="visibility.mobile"] input[type="checkbox"]');
    if(!await checkbox.isChecked())await checkbox.check();
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const group=inspector.locator('.inspector-group').filter({hasText:'Szegély'});
    const title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    await group.locator('[data-property-id="border.style"] select:not(.property-token-picker)').selectOption('dashed');
    const widthInput=group.locator('[data-property-id="border.width"] .dimension-controls input[type="number"]');
    await widthInput.fill('3');
    await widthInput.press('Tab');
    await group.locator('[data-property-id="border.color"] input[type="color"]').evaluate((input,value)=>{input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}))},mobileBorderColors[index]);
    assert.deepEqual(await canvasNode.evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),{width:'3px',style:'dashed',color:asRgb(mobileBorderColors[index])},`${type}: mobile border override reaches Canvas CSS`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    const saved=draft.pages[pageId].nodes[id].responsive.mobile;
    assert.equal(saved.borderStyle,'dashed',`${type}: Save stores mobile border style`);
    assert.equal(saved.borderWidth,'3px',`${type}: Save stores mobile border width`);
    assert.equal(saved.borderColor,mobileBorderColors[index],`${type}: Save stores mobile border color`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.borderColor,undefined,`${type}: mobile Save does not publish the override`);
    assert.equal(published.pages[pageId].nodes[id].responsive.desktop.borderColor,borderColors[index],`${type}: mobile Save preserves desktop border`);
  }
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const [index,{type,id}] of editableNodes.entries()){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const group=inspector.locator('.inspector-group').filter({hasText:'Szegély'});
    const title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    assert.equal(await group.locator('[data-property-id="border.style"] select:not(.property-token-picker)').inputValue(),'dashed',`${type}: mobile border style reloads`);
    assert.equal(await group.locator('[data-property-id="border.width"] input[type="number"]').inputValue(),'3',`${type}: mobile border width reloads`);
    assert.equal(await group.locator('[data-property-id="border.color"] input[type="color"]').inputValue(),mobileBorderColors[index],`${type}: mobile border color reloads`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.deepEqual(await publicNode(id).evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),{width:'3px',style:'dashed',color:asRgb(mobileBorderColors[index])},`${type}: mobile Publish applies the responsive border`);
    assert.equal(published.pages[pageId].nodes[id].responsive.desktop.borderColor,borderColors[index],`${type}: mobile Publish preserves desktop border color`);
  }
  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
  for(const [index,{type,id}] of editableNodes.entries())assert.deepEqual(await publicNode(id).evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),{width:'2px',style:'solid',color:asRgb(borderColors[index])},`${type}: mobile Publish keeps desktop public border`);

  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const group=inspector.locator('.inspector-group').filter({hasText:'Szegély'});
    const title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const resets=['borderStyle','borderWidth','borderColor'].map(key=>group.locator(`.property-reset[data-property-key="${key}"]`));
    for(const [field,key] of [[group.locator('[data-property-id="border.style"]'),'borderStyle'],[group.locator('[data-property-id="border.width"]'),'borderWidth'],[group.locator('[data-property-id="border.color"]'),'borderColor']]){
      assert.equal(await group.locator(`.property-reset[data-property-key="${key}"]`).count(),1,`${type}: mobile ${key} reset is available`);
      assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}: mobile ${key} reset stays on the responsive route`);
    }
    for(const reset of resets)await reset.click();
    assert.deepEqual(await canvasNode.evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),{width:'2px',style:'solid',color:asRgb(borderColors[index])},`${type}: mobile border reset restores desktop Canvas values`);
    await editor.locator('#undo').click();
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).borderTopColor),asRgb(mobileBorderColors[index]),`${type}: Undo restores mobile border color`);
    await editor.locator('#redo').click();
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).borderTopColor),asRgb(borderColors[index]),`${type}: Redo restores inherited desktop border color`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.borderStyle,undefined,`${type}: reset Save removes mobile border style`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.borderWidth,undefined,`${type}: reset Save removes mobile border width`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.borderColor,undefined,`${type}: reset Save removes mobile border color`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.borderColor,mobileBorderColors[index],`${type}: reset Save keeps the currently published mobile border`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.deepEqual(await publicNode(id).evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),{width:'2px',style:'solid',color:asRgb(borderColors[index])},`${type}: reset Publish restores inherited desktop border on mobile`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.borderColor,undefined,`${type}: reset Publish removes mobile border override`);
  }

  // Shared opacity and shadow styles must also survive every specialized
  // PARTIAL renderer across the full mobile draft/reload/Publish lifecycle.
  const desktopVisualBaseline={};
  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
  for(const {id} of editableNodes)desktopVisualBaseline[id]=await publicNode(id).evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow}));
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
  const mobileVisualBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await publicNode(id).evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow}))])));
  const mobileVisualValues=editableNodes.map((_,index)=>({opacity:(0.45+(index%5)*0.08).toFixed(2),shadow:['0 2px 8px #0003','0 8px 24px #0005','0 16px 48px #0007'][index%3]}));
  const mobileCanvasVisualValues={};
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const opacityField=inspector.locator('[data-property-id="opacity.value"]');
    const shadowField=inspector.locator('[data-property-id="shadow.box"]');
    assert.equal(await opacityField.getAttribute('data-property-command'),'responsive.set',`${type}: opacity command route`);
    assert.equal(await opacityField.getAttribute('data-property-key'),'opacity',`${type}: opacity Page Model key`);
    assert.equal(await shadowField.getAttribute('data-property-command'),'responsive.set',`${type}: shadow command route`);
    assert.equal(await shadowField.getAttribute('data-property-key'),'boxShadow',`${type}: shadow Page Model key`);
    const opacityGroup=opacityField.locator('xpath=ancestor::section[1]');
    const opacityTitle=opacityGroup.locator(':scope > .inspector-group-title');
    if(await opacityTitle.getAttribute('aria-expanded')==='false')await opacityTitle.click();
    const shadowGroup=shadowField.locator('xpath=ancestor::section[1]');
    const shadowTitle=shadowGroup.locator(':scope > .inspector-group-title');
    if(await shadowTitle.getAttribute('aria-expanded')==='false')await shadowTitle.click();
    const value=mobileVisualValues[index];
    const opacityInput=opacityField.locator('input[type="number"]');
    await opacityInput.fill(value.opacity);await opacityInput.press('Tab');
    await shadowField.locator('select:not(.property-token-picker)').selectOption(value.shadow);
    mobileCanvasVisualValues[id]=await canvasNode.evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow}));
    assert.equal(mobileCanvasVisualValues[id].opacity,value.opacity,`${type}: mobile opacity Inspector edit reaches Canvas`);
    assert.notEqual(mobileCanvasVisualValues[id].boxShadow,mobileVisualBaseline[id].boxShadow,`${type}: mobile shadow Inspector edit reaches Canvas`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    const responsive=draft.pages[pageId].nodes[id].responsive.mobile;
    assert.equal(responsive.opacity,mobileVisualValues[index].opacity,`${type}: draft Save stores mobile opacity`);
    assert.equal(responsive.boxShadow,mobileVisualValues[index].shadow,`${type}: draft Save stores mobile shadow`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.opacity,undefined,`${type}: mobile opacity Save stays unpublished`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.boxShadow,undefined,`${type}: mobile shadow Save stays unpublished`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await publicNode(id).evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow})),mobileVisualBaseline[id],`${type}: draft Save preserves published mobile opacity and shadow`);
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const [index,{type,id}] of editableNodes.entries()){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    assert.equal(await inspector.locator('[data-property-id="opacity.value"] input[type="number"]').inputValue(),mobileVisualValues[index].opacity,`${type}: mobile opacity survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="shadow.box"] select:not(.property-token-picker)').inputValue(),mobileVisualValues[index].shadow,`${type}: mobile shadow survives Editor reload`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await publicNode(id).evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow})),mobileCanvasVisualValues[id],`${type}: explicit Publish applies mobile opacity and shadow`);
  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await publicNode(id).evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow})),desktopVisualBaseline[id],`${type}: mobile Publish preserves desktop opacity and shadow`);

  // Reset each mobile override to the desktop value; Save remains draft-only,
  // and public mobile styles change only after a separate Publish.
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  for(const {type,id} of editableNodes){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const opacityField=inspector.locator('[data-property-id="opacity.value"]');
    const shadowField=inspector.locator('[data-property-id="shadow.box"]');
    const opacityGroup=opacityField.locator('xpath=ancestor::section[1]');
    const shadowGroup=shadowField.locator('xpath=ancestor::section[1]');
    for(const [group,key] of [[opacityGroup,'opacity'],[shadowGroup,'boxShadow']]){
      const title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=group.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${type}: mobile ${key} exposes inheritance reset`);
      assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: mobile ${key} reset uses responsive command`);
      await reset.click();
    }
    assert.deepEqual(await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow})),desktopVisualBaseline[id],`${type}: mobile reset restores desktop Canvas styles`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.opacity,undefined,`${type}: reset Save removes mobile opacity override`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.boxShadow,undefined,`${type}: reset Save removes mobile shadow override`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.opacity,mobileVisualValues[editableNodes.findIndex(node=>node.id===id)].opacity,`${type}: reset Save keeps currently published mobile opacity`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await publicNode(id).evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow})),mobileCanvasVisualValues[id],`${type}: reset Save leaves public mobile styles unchanged`);
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await publicNode(id).evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow})),desktopVisualBaseline[id],`${type}: reset Publish restores desktop opacity and shadow on mobile`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.opacity,undefined,`${type}: reset Publish removes mobile opacity override`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.boxShadow,undefined,`${type}: reset Publish removes mobile shadow override`);
  }
  assert.deepEqual(editorErrors,[],'opening every partial type must not throw');
});
