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

test('all PARTIAL types preserve three-breakpoint visual effects across Save, Publish, reset, and Undo/Redo',async t=>{
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
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-partial-effects',title:'Inspector visual effects fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-partial-effects',title:'Inspector visual effects fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  assert.equal(nodes.length,45,'fixture includes every declared PARTIAL type, including root');
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}});
  const viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(30000);
  const editorErrors=[];
  editor.on('pageerror',error=>editorErrors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody');
  const editableNodes=nodes.slice(1);
  assert.equal(editableNodes.length,44,'all editable PARTIAL types are covered');
  const publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);

  // The remaining shared visual-effect fields have distinct CSS keys and
  // typed Inspector controls. Exercise their complete three-breakpoint draft
  // and Publish lifecycle against every editable PARTIAL renderer.
  const effectKeys=['rotate','scale','filter','transition'];
  const effectPropertyIds={rotate:'transform.rotate',scale:'transform.scale',filter:'filter.effect',transition:'animation.transition'};
  const desktopEffects={rotate:'15deg',scale:'1.2',filter:'grayscale(1)',transition:'all 180ms ease'};
  const tabletEffects={rotate:'7deg',scale:'0.85',filter:'contrast(1.2)',transition:'all 300ms ease'};
  const mobileEffects={rotate:'30deg',scale:'0.8',filter:'sepia(.7)',transition:'all 180ms ease'};
  const computedEffects=node=>node.evaluate(el=>{const css=getComputedStyle(el);return{rotate:css.rotate,scale:css.scale,filter:css.filter,transitionProperty:css.transitionProperty,transitionDuration:css.transitionDuration,transitionTimingFunction:css.transitionTimingFunction}});
  const expectedEffects=values=>({rotate:values.rotate,scale:values.scale,filter:values.filter==='sepia(.7)'?'sepia(0.7)':values.filter,transitionProperty:'all',transitionDuration:values.transition==='all 180ms ease'?'0.18s':'0.3s',transitionTimingFunction:'ease'});
  const setEffectValues=async(type,id,values,label)=>{
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    for(const key of effectKeys){
      const field=inspector.locator(`[data-property-id="${effectPropertyIds[key]}"]`);
      assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}: ${label} ${key} command route`);
      assert.equal(await field.getAttribute('data-property-key'),key,`${type}: ${label} ${key} Page Model key`);
      const section=field.locator('xpath=ancestor::section[1]'),title=section.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      if(key==='rotate'){
        const input=field.locator('.dimension-controls input[type="number"]');
        await input.fill(values[key].replace('deg',''));await input.press('Tab');
      }else if(key==='scale'){
        const input=field.locator('input[type="number"]');
        await input.fill(values[key]);await input.press('Tab');
      }else await field.locator('select:not(.property-token-picker)').selectOption(values[key]);
    }
    assert.deepEqual(await computedEffects(editor.locator(`.node[data-node-id="${id}"]`)),expectedEffects(values),`${type}: ${label} Inspector values reach Canvas CSS`);
  };
  const desktopEffectBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await computedEffects(publicNode(id))])));
  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  await viewer.setViewportSize({width:1366,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)await setEffectValues(type,id,desktopEffects,'desktop');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    const saved=draft.pages[pageId].nodes[id].responsive.desktop;
    for(const key of effectKeys)assert.equal(saved[key],desktopEffects[key],`${type}: desktop draft Save stores ${key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive?.desktop?.rotate,undefined,`${type}: desktop Save keeps rotation unpublished`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await computedEffects(publicNode(id)),desktopEffectBaseline[id],`${type}: desktop Save does not publish visual effects`);
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const {type,id} of editableNodes){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    assert.equal(await inspector.locator('[data-property-id="transform.rotate"] input[type="number"]').inputValue(),'15',`${type}: desktop rotation survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="transform.scale"] input[type="number"]').inputValue(),'1.2',`${type}: desktop scale survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="filter.effect"] select:not(.property-token-picker)').inputValue(),desktopEffects.filter,`${type}: desktop filter survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="animation.transition"] select:not(.property-token-picker)').inputValue(),desktopEffects.transition,`${type}: desktop transition survives Editor reload`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  const desktopComputedExpected=expectedEffects(desktopEffects);
  for(const {type,id} of editableNodes){
    assert.deepEqual(await computedEffects(publicNode(id)),desktopComputedExpected,`${type}: explicit Publish renders desktop visual effects`);
    for(const key of effectKeys)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[key],desktopEffects[key],`${type}: Publish stores desktop ${key}`);
  }

  await editor.locator('.canvas-device-btn[data-device="tablet"]').click();
  await viewer.setViewportSize({width:768,height:900});await viewer.reload();
  const tabletEffectBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await computedEffects(publicNode(id))])));
  for(const {type,id} of editableNodes)await setEffectValues(type,id,tabletEffects,'tablet');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    const saved=draft.pages[pageId].nodes[id].responsive.tablet;
    for(const key of effectKeys){
      assert.equal(saved[key],tabletEffects[key],`${type}: tablet draft Save stores ${key}`);
      assert.equal(draft.pages[pageId].nodes[id].responsive.desktop[key],desktopEffects[key],`${type}: tablet Save preserves desktop ${key}`);
      assert.equal(published.pages[pageId].nodes[id].responsive.tablet?.[key],undefined,`${type}: tablet Save keeps ${key} unpublished`);
    }
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await computedEffects(publicNode(id)),tabletEffectBaseline[id],`${type}: tablet draft Save leaves public effects unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="tablet"]').click();
  for(const {type,id} of editableNodes){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    assert.equal(await inspector.locator('[data-property-id="transform.rotate"] input[type="number"]').inputValue(),'7',`${type}: tablet rotation survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="transform.scale"] input[type="number"]').inputValue(),'0.85',`${type}: tablet scale survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="filter.effect"] select:not(.property-token-picker)').inputValue(),tabletEffects.filter,`${type}: tablet filter survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="animation.transition"] select:not(.property-token-picker)').inputValue(),tabletEffects.transition,`${type}: tablet transition survives Editor reload`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  const tabletComputedExpected=expectedEffects(tabletEffects);
  for(const {type,id} of editableNodes){
    assert.deepEqual(await computedEffects(publicNode(id)),tabletComputedExpected,`${type}: tablet Publish renders visual effects`);
    for(const key of effectKeys)assert.equal(published.pages[pageId].nodes[id].responsive.tablet[key],tabletEffects[key],`${type}: tablet Publish stores ${key}`);
  }
  await viewer.setViewportSize({width:1366,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await computedEffects(publicNode(id)),desktopComputedExpected,`${type}: tablet Publish preserves desktop visual effects`);

  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  const mobileEffectBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await computedEffects(publicNode(id))])));
  for(const {type,id} of editableNodes)assert.deepEqual(mobileEffectBaseline[id],tabletComputedExpected,`${type}: mobile inherits tablet effects before its own override`);
  for(const {type,id} of editableNodes)await setEffectValues(type,id,mobileEffects,'mobile');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    const saved=draft.pages[pageId].nodes[id].responsive.mobile;
    for(const key of effectKeys){
      assert.equal(saved[key],mobileEffects[key],`${type}: mobile draft Save stores ${key}`);
      assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.[key],undefined,`${type}: mobile Save keeps ${key} unpublished`);
      assert.equal(draft.pages[pageId].nodes[id].responsive.desktop[key],desktopEffects[key],`${type}: mobile Save preserves desktop ${key}`);
      assert.equal(draft.pages[pageId].nodes[id].responsive.tablet[key],tabletEffects[key],`${type}: mobile Save preserves tablet ${key}`);
      assert.equal(published.pages[pageId].nodes[id].responsive.tablet[key],tabletEffects[key],`${type}: mobile Save preserves published tablet ${key}`);
    }
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await computedEffects(publicNode(id)),mobileEffectBaseline[id],`${type}: mobile Save leaves public visual effects unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const {type,id} of editableNodes){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    assert.equal(await inspector.locator('[data-property-id="transform.rotate"] input[type="number"]').inputValue(),'30',`${type}: mobile rotation survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="transform.scale"] input[type="number"]').inputValue(),'0.8',`${type}: mobile scale survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="filter.effect"] select:not(.property-token-picker)').inputValue(),mobileEffects.filter,`${type}: mobile filter survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="animation.transition"] select:not(.property-token-picker)').inputValue(),mobileEffects.transition,`${type}: mobile transition survives Editor reload`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await computedEffects(publicNode(id)),expectedEffects(mobileEffects),`${type}: separate Publish renders mobile visual effects`);
    for(const key of effectKeys)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[key],desktopEffects[key],`${type}: mobile Publish preserves desktop ${key}`);
  }
  await viewer.setViewportSize({width:1366,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await computedEffects(publicNode(id)),desktopComputedExpected,`${type}: mobile Publish preserves desktop visual effects`);

  // Each mobile effect can be returned to tablet inheritance through its
  // own reset route; undo/redo and the Save/Publish boundary are checked too.
  await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  for(const {type,id} of editableNodes){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    for(const key of effectKeys){
      const field=inspector.locator(`[data-property-id="${effectPropertyIds[key]}"]`);
      const section=field.locator('xpath=ancestor::section[1]'),title=section.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=section.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${type}: mobile ${key} exposes inheritance reset`);
      assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: mobile ${key} reset uses responsive command`);
      await reset.click();
    }
    assert.deepEqual(await computedEffects(editor.locator(`.node[data-node-id="${id}"]`)),tabletComputedExpected,`${type}: mobile effect resets restore tablet Canvas values`);
  }
  const lastEffectNode=editableNodes.at(-1);
  await editor.locator('#undo').click();
  assert.deepEqual(await computedEffects(editor.locator(`.node[data-node-id="${lastEffectNode.id}"]`)),expectedEffects({...tabletEffects,transition:mobileEffects.transition}),`${lastEffectNode.type}: Undo restores the last mobile transition override`);
  await editor.locator('#redo').click();
  assert.deepEqual(await computedEffects(editor.locator(`.node[data-node-id="${lastEffectNode.id}"]`)),tabletComputedExpected,`${lastEffectNode.type}: Redo restores inherited tablet transition`);
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    for(const key of effectKeys){
      assert.equal(draft.pages[pageId].nodes[id].responsive.mobile[key],undefined,`${type}: reset Save removes mobile ${key}`);
      assert.equal(published.pages[pageId].nodes[id].responsive.mobile[key],mobileEffects[key],`${type}: reset Save keeps published mobile ${key}`);
    }
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await computedEffects(publicNode(id)),expectedEffects(mobileEffects),`${type}: reset Save preserves published mobile effects`);
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await computedEffects(publicNode(id)),tabletComputedExpected,`${type}: reset Publish restores tablet visual effects on mobile`);
    for(const key of effectKeys)assert.equal(published.pages[pageId].nodes[id].responsive.mobile[key],undefined,`${type}: reset Publish removes mobile ${key}`);
  }

  await editor.locator('.canvas-device-btn[data-device="tablet"]').click();
  await viewer.setViewportSize({width:768,height:900});await viewer.reload();
  for(const {type,id} of editableNodes){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    for(const key of effectKeys){
      const field=inspector.locator(`[data-property-id="${effectPropertyIds[key]}"]`);
      const section=field.locator('xpath=ancestor::section[1]'),title=section.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=section.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${type}: tablet ${key} exposes inheritance reset`);
      assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: tablet ${key} reset uses responsive command`);
      await reset.click();
    }
    assert.deepEqual(await computedEffects(editor.locator(`.node[data-node-id="${id}"]`)),desktopComputedExpected,`${type}: tablet effect resets restore desktop Canvas values`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    for(const key of effectKeys){
      assert.equal(draft.pages[pageId].nodes[id].responsive.tablet[key],undefined,`${type}: tablet reset Save removes ${key}`);
      assert.equal(published.pages[pageId].nodes[id].responsive.tablet[key],tabletEffects[key],`${type}: tablet reset Save preserves published ${key}`);
    }
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await computedEffects(publicNode(id)),tabletComputedExpected,`${type}: tablet reset Save leaves public CSS unchanged`);
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await computedEffects(publicNode(id)),desktopComputedExpected,`${type}: tablet reset Publish restores desktop effects`);
    for(const key of effectKeys)assert.equal(published.pages[pageId].nodes[id].responsive.tablet[key],undefined,`${type}: tablet reset Publish removes ${key}`);
  }
  await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await computedEffects(publicNode(id)),desktopComputedExpected,`${type}: tablet reset Publish restores mobile inheritance`);

  assert.deepEqual(editorErrors,[],'visual effect Inspector operations must not throw');
});
