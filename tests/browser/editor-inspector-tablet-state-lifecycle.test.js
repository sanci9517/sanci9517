import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

test('tablet hover and focus-visible Inspector states save, publish, reset, and inherit independently',async t=>{
  const model=createEditorState(createDocument()),pageId=model.document.activePageId;
  const rootId=model.document.pages[pageId].rootId;
  execute(model,{type:'element.add',payload:{type:'text',parentId:rootId,props:{text:'Tablet interactive state fixture'}}});
  const nodeId=model.selection.primaryId;
  execute(model,{type:'style.set',payload:{nodeId,patch:{backgroundColor:'#e2e8f0'}}});
  const desktopHover={color:'#2563eb',backgroundColor:'#16a34a',backgroundImage:'linear-gradient(135deg, #111827 0%, #475569 100%)',borderColor:'#f59e0b',boxShadow:'0 8px 24px #0005',opacity:'0.75',textDecoration:'underline',fontWeight:'700',rotate:'4deg',scale:'0.95'};
  const desktopFocus={color:'#334155',backgroundColor:'#f8fafc',backgroundImage:'linear-gradient(180deg, #ffffff 0%, #e0e7ff 100%)',borderColor:'#64748b',boxShadow:'0 8px 24px #0005',opacity:'0.8',textDecoration:'none',fontWeight:'600',rotate:'2deg',scale:'1.05'};
  execute(model,{type:'states.set',payload:{nodeId,state:'hover',device:'desktop',patch:desktopHover}});
  execute(model,{type:'states.set',payload:{nodeId,state:'focus-visible',device:'desktop',patch:desktopFocus}});
  let draft=structuredClone(model.document),published=structuredClone(draft),revision=1;
  const posts=[],errors=[],publicDir=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'tablet-hover',title:'Tablet hover',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'tablet-hover',title:'Tablet hover',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const route=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(publicDir,'.'+route);
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`;
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  for(const page of [editor,viewer]){page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(15000);page.on('pageerror',error=>errors.push(error.message))}
  const canvas=()=>editor.locator(`.node[data-node-id="${nodeId}"]`),publicNode=()=>viewer.locator(`.visual-editor-node[data-node-id="${nodeId}"]`);
  const reloadViewer=async()=>{const rendered=viewer.waitForResponse(response=>response.url().includes('/api/public/presentation'));await viewer.reload({waitUntil:'domcontentloaded'});await rendered};
  const setViewerWidth=async width=>{await viewer.setViewportSize({width,height:900});await reloadViewer()};
  const activateEditor=async device=>{const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);if(!await button.evaluate(el=>el.classList.contains('active')))await button.click()};
  const selectNode=async()=>{await canvas().evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click()};
  const openStateProperty=async(state,key)=>{
    await selectNode();await editor.locator('.inspector-tabs button').nth(2).click();
    let group=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'}),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption(state);
    group=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    return group.locator(`[data-state-property="${key}"]`);
  };
  const openStateColor=state=>openStateProperty(state,'backgroundColor');
  const openHoverColor=()=>openStateColor('hover');
  const computedHover=async()=>{await publicNode().hover();return publicNode().evaluate(el=>{const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale}})};
  const editStateValue=async(state,key,value,type)=>{
    const field=await openStateProperty(state,key);
    assert.equal(await field.getAttribute('data-property-command'),'states.set',`${key} exposes the shared state command`);
    const input=type==='select'?field.locator('select:not(.property-token-picker)'):type==='number'?field.locator('input[type="number"]'):field.locator('input[type="text"]');
    const raw=key==='rotate'?String(value).replace(/deg$/,''):value;
    if(type==='select')await input.selectOption(value);else{await input.fill(raw);await input.press('Tab')}
    return field;
  };

  await editor.goto(base+'/editor-v2/index.html');await selectNode();await viewer.goto(base+'/p/test');
  const tabletButton=editor.locator('.canvas-device-btn[data-device="tablet"]');await tabletButton.click();
  const tabletHover={color:'#dc2626',backgroundColor:'#c026d3',backgroundImage:'linear-gradient(135deg, #fb7185 0%, #fbbf24 100%)',borderColor:'#0ea5e9',boxShadow:'0 16px 48px #0007',opacity:'0.85',textDecoration:'line-through',fontWeight:'900',rotate:'7deg',scale:'1.1'};
  const hoverFields=[['color','color','typography.color'],['backgroundColor','color','background.color'],['backgroundImage','select','background.gradient'],['borderColor','color','border.color'],['boxShadow','select','shadow.box'],['opacity','number','opacity.value'],['textDecoration','select','typography.textDecoration'],['fontWeight','select','typography.fontWeight'],['rotate','number','transform.rotate'],['scale','number','transform.scale']];
  const desktopHoverExpected={color:'rgb(37, 99, 235)',backgroundColor:'rgb(22, 163, 74)',backgroundImage:'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(71, 85, 105) 100%)',borderColor:'rgb(245, 158, 11)',boxShadow:'rgba(0, 0, 0, 0.333) 0px 8px 24px 0px',opacity:'0.75',textDecorationLine:'underline',fontWeight:'700',rotate:'4deg',scale:'0.95'};
  const desktopFocusExpected={color:'rgb(51, 65, 85)',backgroundColor:'rgb(248, 250, 252)',backgroundImage:'linear-gradient(rgb(255, 255, 255) 0%, rgb(224, 231, 255) 100%)',borderColor:'rgb(100, 116, 139)',boxShadow:'rgba(0, 0, 0, 0.333) 0px 8px 24px 0px',opacity:'0.8',textDecorationLine:'none',fontWeight:'600',rotate:'2deg',scale:'1.05'};
  const tabletHoverExpected={color:'rgb(220, 38, 38)',backgroundColor:'rgb(192, 38, 211)',backgroundImage:'linear-gradient(135deg, rgb(251, 113, 133) 0%, rgb(251, 191, 36) 100%)',borderColor:'rgb(14, 165, 233)',boxShadow:'rgba(0, 0, 0, 0.467) 0px 16px 48px 0px',opacity:'0.85',textDecorationLine:'line-through',fontWeight:'900',rotate:'7deg',scale:'1.1'};
  const mobileFocusStyles={color:'#9333ea',backgroundColor:'#facc15',backgroundImage:'linear-gradient(135deg, #111827 0%, #475569 100%)',borderColor:'#f97316',boxShadow:'0 8px 24px #0005',opacity:'0.9',textDecoration:'line-through',fontWeight:'900',rotate:'3deg',scale:'1.2'};
  const mobileFocusExpected={color:'rgb(147, 51, 234)',backgroundColor:'rgb(250, 204, 21)',backgroundImage:'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(71, 85, 105) 100%)',borderColor:'rgb(249, 115, 22)',boxShadow:'rgba(0, 0, 0, 0.333) 0px 8px 24px 0px',opacity:'0.9',textDecorationLine:'line-through',fontWeight:'900',rotate:'3deg',scale:'1.2'};
  for(const [key,type,id] of hoverFields){
    const control=await editStateValue('hover',key,tabletHover[key],type);
    assert.equal(await control.getAttribute('data-property-id'),id,`${key} maps to its declared registry property`);
    assert.equal(await control.getAttribute('data-property-key'),key,`${key} exposes its Page Model key`);
    assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],key),key==='backgroundImage'?'linear-gradient(135deg, rgb(251, 113, 133) 0%, rgb(251, 191, 36) 100%)':key==='color'?'rgb(220, 38, 38)':key==='backgroundColor'?'rgb(192, 38, 211)':key==='borderColor'?'rgb(14, 165, 233)':key==='boxShadow'?'rgba(0, 0, 0, 0.467) 0px 16px 48px 0px':tabletHover[key],`${key} reaches the tablet Canvas preview`);
  }
  const field=await openHoverColor();
  assert.equal(await field.getAttribute('data-property-command'),'states.set','tablet hover exposes the state command route');
  assert.equal(await field.getAttribute('data-property-key'),'backgroundColor','tablet hover exposes the backgroundColor Page Model key');
  assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(192, 38, 211)','tablet Canvas previews the complete responsive hover override');
  const tabletColor='#c026d3',input=field.locator('input[type="text"]');await input.fill(tabletColor);await input.press('Tab');
  assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(192, 38, 211)','tablet hover override reaches Canvas preview');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet hover Save remains draft-only');
  assert.equal(draft.pages[pageId].nodes[nodeId].states.hover.tablet.backgroundColor,tabletColor,'tablet hover value is saved to the draft Page Model');
  for(const [key] of hoverFields)assert.equal(draft.pages[pageId].nodes[nodeId].states.hover.tablet[key],tabletHover[key],`${key} is persisted in the tablet draft state`);
  assert.equal(published.pages[pageId].nodes[nodeId].states.hover.tablet?.backgroundColor,undefined,'draft Save leaves tablet published state unchanged');
  assert.equal(published.pages[pageId].nodes[nodeId].states.hover.desktop.backgroundColor,'#16a34a','draft Save preserves published desktop state');
  await editor.reload({waitUntil:'domcontentloaded'});await activateEditor('tablet');
  const reloadedField=await openHoverColor();
  assert.equal(await reloadedField.locator('input[type="text"]').inputValue(),tabletColor,'tablet hover value survives Editor reload');
  await setViewerWidth(768);
  assert.deepEqual(await computedHover(),desktopHoverExpected,'tablet draft remains unpublished and public desktop hover styles remain intact');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await reloadViewer();
  assert.equal(published.pages[pageId].nodes[nodeId].states.hover.tablet.backgroundColor,tabletColor,'explicit Publish stores the tablet hover state');
  assert.deepEqual(await computedHover(),tabletHoverExpected,'tablet Publish applies every state property to the public CSS');
  await setViewerWidth(1366);assert.deepEqual(await computedHover(),desktopHoverExpected,'tablet Publish preserves every independent desktop hover style');
  await setViewerWidth(390);assert.deepEqual(await computedHover(),tabletHoverExpected,'mobile hover inherits all published tablet state styles');

  for(const [key] of hoverFields){
    const field=await openStateProperty('hover',key),reset=editor.locator(`.property-reset[data-property-key="${key}"]`).filter({hasText:'Állapotérték öröklésének visszaállítása'}),cssKey=key==='textDecoration'?'textDecorationLine':key;
    assert.equal(await field.getAttribute('data-property-command'),'states.set',`${key} reset remains on the shared state command route`);
    assert.equal(await reset.count(),1,`${key} exposes its own responsive inheritance reset`);
    assert.equal(await reset.getAttribute('data-property-command'),'states.set');
    assert.equal(await reset.getAttribute('data-property-key'),key);
    await reset.click();assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),desktopHoverExpected[cssKey],`${key} reset restores desktop inheritance on Canvas`);
    await editor.locator('#undo').click();assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),tabletHoverExpected[cssKey],`Undo restores tablet ${key}`);
    await editor.locator('#redo').click();assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),desktopHoverExpected[cssKey],`Redo restores inherited ${key}`);
    await editor.locator('#undo').click();assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),tabletHoverExpected[cssKey],`test cleanup restores the tablet ${key} override`);
  }

  const resetField=await openHoverColor(),reset=editor.locator('.property-reset[data-property-key="backgroundColor"]').filter({hasText:'Állapotérték öröklésének visszaállítása'});
  assert.equal(await reset.count(),1,'tablet hover override exposes a reset-to-inheritance action');
  assert.equal(await reset.getAttribute('data-property-command'),'states.set');assert.equal(await reset.getAttribute('data-property-key'),'backgroundColor');
  await reset.click();assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(22, 163, 74)','reset restores inherited desktop hover on Canvas');
  await editor.locator('#undo').click();assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(192, 38, 211)','Undo restores the tablet hover override');
  await editor.locator('#redo').click();assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(22, 163, 74)','Redo restores tablet inheritance');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet state reset Save remains draft-only');
  assert.equal(draft.pages[pageId].nodes[nodeId].states.hover.tablet.backgroundColor,undefined,'reset removes the tablet hover override from the draft');
  assert.equal((await computedHover()).backgroundColor,'rgb(192, 38, 211)','published tablet hover remains until reset Publish');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await setViewerWidth(768);assert.equal((await computedHover()).backgroundColor,'rgb(22, 163, 74)','published tablet reset inherits desktop hover');
  await setViewerWidth(390);assert.equal((await computedHover()).backgroundColor,'rgb(22, 163, 74)','mobile inherits desktop after tablet reset is published');

  const focusStyles={color:'#1d4ed8',backgroundColor:'#0ea5e9',backgroundImage:'linear-gradient(135deg, #7047eb 0%, #17b8a6 100%)',borderColor:'#a855f7',boxShadow:'0 2px 8px #0003',opacity:'0.65',textDecoration:'overline',fontWeight:'800',rotate:'-5deg',scale:'0.9'};
  const focusExpected={color:'rgb(29, 78, 216)',backgroundColor:'rgb(14, 165, 233)',backgroundImage:'linear-gradient(135deg, rgb(112, 71, 235) 0%, rgb(23, 184, 166) 100%)',borderColor:'rgb(168, 85, 247)',boxShadow:'rgba(0, 0, 0, 0.2) 0px 2px 8px 0px',opacity:'0.65',textDecorationLine:'overline',fontWeight:'800',rotate:'-5deg',scale:'0.9'};
  for(const [key,type,id] of hoverFields){
    const control=await editStateValue('focus-visible',key,focusStyles[key],type);
    assert.equal(await control.getAttribute('data-property-id'),id,`${key} keeps its registry route for focus-visible`);
    assert.equal(await control.getAttribute('data-property-key'),key,`${key} exposes the focus-visible Page Model key`);
    const cssKey=key==='textDecoration'?'textDecorationLine':key;
    assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),focusExpected[cssKey],`${key} reaches the tablet focus-visible Canvas preview`);
  }
  const focusField=await openStateColor('focus-visible');
  assert.equal(await focusField.getAttribute('data-property-command'),'states.set','tablet focus-visible exposes the state command route');
  assert.equal(await focusField.getAttribute('data-property-key'),'backgroundColor','tablet focus-visible exposes the backgroundColor Page Model key');
  const focusColor=focusStyles.backgroundColor,focusInput=focusField.locator('input[type="text"]');await focusInput.fill(focusColor);await focusInput.press('Tab');
  assert.equal(await canvas().getAttribute('data-editor-state'),'focus-visible','tablet focus preview marks the Canvas node');
  assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(14, 165, 233)','tablet focus-visible override reaches Canvas preview');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet focus-visible Save remains draft-only');
  for(const [key] of hoverFields)assert.equal(draft.pages[pageId].nodes[nodeId].states['focus-visible'].tablet[key],focusStyles[key],`${key} is saved in the tablet focus-visible draft state`);
  for(const [key] of hoverFields)assert.equal(published.pages[pageId].nodes[nodeId].states['focus-visible']?.tablet?.[key],undefined,`focus-visible draft Save leaves published ${key} unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});await activateEditor('tablet');
  const reloadedFocusField=await openStateColor('focus-visible');
  assert.equal(await reloadedFocusField.locator('input[type="text"]').inputValue(),focusColor,'tablet focus-visible value survives Editor reload');
  const focusGroup=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
  for(const [key,type] of hoverFields){
    const field=focusGroup.locator(`[data-state-property="${key}"]`),control=type==='select'?field.locator('select:not(.property-token-picker)'):type==='number'?field.locator('input[type="number"]'):field.locator('input[type="text"]');
    const expected=key==='rotate'?'-5':focusStyles[key];
    assert.equal(await control.inputValue(),expected,`${key} focus-visible override survives Editor reload`);
  }
  await setViewerWidth(768);
  assert.equal(await publicNode().getAttribute('tabindex'),'0','tablet inherits the published desktop keyboard focus affordance');
  await viewer.keyboard.press('Tab');
  const unpublishedFocus=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,focusVisible:el.matches(':focus-visible'),tabIndex:el.tabIndex}});
  assert.deepEqual(unpublishedFocus,{...desktopFocusExpected,focusVisible:true,tabIndex:0},'tablet draft remains unpublished and inherits the independent published desktop focus styles');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await reloadViewer();
  for(const [key] of hoverFields)assert.equal(published.pages[pageId].nodes[nodeId].states['focus-visible'].tablet[key],focusStyles[key],`explicit Publish stores tablet focus-visible ${key}`);
  assert.equal(await publicNode().getAttribute('tabindex'),'0','published tablet focus-visible state makes the text node keyboard reachable');
  await publicNode().hover();
  await viewer.keyboard.press('Tab');
  const publishedFocus=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,hover:el.matches(':hover'),focusVisible:el.matches(':focus-visible'),tabIndex:el.tabIndex}});
  assert.deepEqual(publishedFocus,{...focusExpected,hover:true,focusVisible:true,tabIndex:0},'when hover and keyboard focus coincide, all published focus-visible styles win');
  await setViewerWidth(1366);
  assert.equal(await publicNode().getAttribute('tabindex'),'0','tablet focus-visible Publish preserves the independent desktop keyboard stop');
  await viewer.keyboard.press('Tab');
  const desktopFocusOutput=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,focusVisible:el.matches(':focus-visible')}});
  assert.deepEqual(desktopFocusOutput,{...desktopFocusExpected,focusVisible:true},'tablet Publish preserves all independent desktop focus-visible styles');
  await setViewerWidth(390);
  assert.equal(await publicNode().getAttribute('tabindex'),'0','mobile inherits the tablet focus-visible keyboard affordance');
  await viewer.keyboard.press('Tab');
  const mobileFocus=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,focusVisible:el.matches(':focus-visible')}});
  assert.deepEqual(mobileFocus,{...focusExpected,focusVisible:true},'mobile inherits all published tablet keyboard focus styles');

  await activateEditor('mobile');
  for(const [key,type,id] of hoverFields){
    const field=await editStateValue('focus-visible',key,mobileFocusStyles[key],type);
    assert.equal(await field.getAttribute('data-property-id'),id,`${key} keeps its registry route for the mobile focus override`);
    assert.equal(await field.getAttribute('data-property-key'),key,`${key} keeps its Page Model key for the mobile focus override`);
    const cssKey=key==='textDecoration'?'textDecorationLine':key;
    assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),mobileFocusExpected[cssKey],`${key} mobile override reaches Canvas preview`);
  }
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'mobile focus Save remains draft-only');
  for(const [key] of hoverFields){
    assert.equal(draft.pages[pageId].nodes[nodeId].states['focus-visible'].mobile[key],mobileFocusStyles[key],`${key} mobile focus override is saved in the draft Page Model`);
    assert.equal(published.pages[pageId].nodes[nodeId].states['focus-visible']?.mobile?.[key],undefined,`mobile focus Save leaves published ${key} unchanged`);
  }
  const publicMobileDraft=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,focusVisible:el.matches(':focus-visible')}});
  assert.deepEqual(publicMobileDraft,{...focusExpected,focusVisible:true},'mobile focus draft does not change the tablet-inherited public styles');
  await editor.reload({waitUntil:'domcontentloaded'});await activateEditor('mobile');
  await openStateProperty('focus-visible','color');
  const mobileFocusGroup=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
  for(const [key,type] of hoverFields){
    const field=mobileFocusGroup.locator(`[data-state-property="${key}"]`),control=type==='select'?field.locator('select:not(.property-token-picker)'):type==='number'?field.locator('input[type="number"]'):field.locator('input[type="text"]');
    const expected=key==='rotate'?'3':mobileFocusStyles[key];
    assert.equal(await control.inputValue(),expected,`mobile focus ${key} survives Editor reload`);
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await reloadViewer();
  for(const [key] of hoverFields){
    assert.equal(published.pages[pageId].nodes[nodeId].states['focus-visible'].mobile[key],mobileFocusStyles[key],`explicit Publish stores mobile focus ${key}`);
    assert.equal(published.pages[pageId].nodes[nodeId].states['focus-visible'].tablet[key],focusStyles[key],`mobile focus Publish preserves tablet ${key}`);
  }
  const publishedMobileFocus=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,focusVisible:el.matches(':focus-visible')}});
  assert.deepEqual(publishedMobileFocus,{...mobileFocusExpected,focusVisible:true},'explicit Publish applies all ten independent mobile focus styles');
  await setViewerWidth(768);
  const tabletAfterMobilePublish=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,focusVisible:el.matches(':focus-visible')}});
  assert.deepEqual(tabletAfterMobilePublish,{...focusExpected,focusVisible:true},'mobile focus Publish leaves every tablet focus style independent');
  await activateEditor('tablet');

  for(const [key] of hoverFields){
    const field=await openStateProperty('focus-visible',key),reset=editor.locator(`.property-reset[data-property-key="${key}"]`).filter({hasText:'Állapotérték öröklésének visszaállítása'}),cssKey=key==='textDecoration'?'textDecorationLine':key;
    assert.equal(await field.getAttribute('data-property-command'),'states.set',`${key} focus reset uses the shared state command route`);
    assert.equal(await reset.count(),1,`${key} focus-visible exposes its own inheritance reset`);
    await reset.click();assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),desktopFocusExpected[cssKey],`focus ${key} reset restores the desktop Canvas value`);
    await editor.locator('#undo').click();assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),focusExpected[cssKey],`Undo restores tablet focus ${key}`);
    await editor.locator('#redo').click();assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),desktopFocusExpected[cssKey],`Redo restores inherited desktop focus ${key}`);
    await editor.locator('#undo').click();assert.equal(await canvas().evaluate((el,property)=>getComputedStyle(el)[property],cssKey),focusExpected[cssKey],`test cleanup restores tablet focus ${key}`);
  }
  for(const [key] of hoverFields){
    const reset=editor.locator(`.property-reset[data-property-key="${key}"]`).filter({hasText:'Állapotérték öröklésének visszaállítása'});
    await reset.click();
  }
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'resetting all tablet focus fields remains a draft-only Save');
  for(const [key] of hoverFields){
    assert.equal(draft.pages[pageId].nodes[nodeId].states['focus-visible'].tablet[key],undefined,`focus reset removes draft ${key}`);
    assert.equal(published.pages[pageId].nodes[nodeId].states['focus-visible'].tablet[key],focusStyles[key],`focus reset Save preserves published ${key}`);
  }
  await editor.reload({waitUntil:'domcontentloaded'});await activateEditor('tablet');
  const clearedFocusField=await openStateColor('focus-visible');
  assert.equal(await clearedFocusField.locator('input[type="text"]').inputValue(),desktopFocus.backgroundColor,'tablet focus reset persists through Editor reload as inherited desktop value');
  const clearedFocusGroup=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
  for(const [key,type] of hoverFields){
    const field=clearedFocusGroup.locator(`[data-state-property="${key}"]`),control=type==='select'?field.locator('select:not(.property-token-picker)'):type==='number'?field.locator('input[type="number"]'):field.locator('input[type="text"]');
    const expected=key==='rotate'?'2':desktopFocus[key];
    assert.equal(await control.inputValue(),expected,`reset tablet focus ${key} reloads with desktop inheritance`);
  }
  await setViewerWidth(768);
  assert.equal(await publicNode().getAttribute('tabindex'),'0','focus draft reset does not change the published tablet keyboard stop');
  const publishedBeforeReset=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,focusVisible:el.matches(':focus-visible')}});
  assert.deepEqual(publishedBeforeReset,{...focusExpected,focusVisible:true},'focus reset draft leaves every published tablet style in place');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await reloadViewer();
  for(const [key] of hoverFields)assert.equal(published.pages[pageId].nodes[nodeId].states['focus-visible'].tablet[key],undefined,`focus reset Publish clears public tablet ${key}`);
  assert.equal(await publicNode().getAttribute('tabindex'),'0','published tablet focus reset inherits the desktop keyboard tab stop');
  await viewer.keyboard.press('Tab');
  const resetTabletFocus=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,focusVisible:el.matches(':focus-visible'),tabIndex:el.tabIndex}});
  assert.deepEqual(resetTabletFocus,{...desktopFocusExpected,focusVisible:true,tabIndex:0},'published tablet focus reset inherits desktop styles and keyboard affordance');
  await setViewerWidth(390);
  assert.equal(await publicNode().getAttribute('tabindex'),'0','mobile inherits the desktop keyboard affordance after tablet focus reset');
  await viewer.keyboard.press('Tab');
  const resetMobileFocus=await publicNode().evaluate(el=>{el.focus();const css=getComputedStyle(el);return{color:css.color,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,borderColor:css.borderColor,boxShadow:css.boxShadow,opacity:css.opacity,textDecorationLine:css.textDecorationLine,fontWeight:css.fontWeight,rotate:css.rotate,scale:css.scale,focusVisible:el.matches(':focus-visible')}});
  assert.deepEqual(resetMobileFocus,{...mobileFocusExpected,focusVisible:true},'tablet reset preserves the independently published mobile focus styles');
  assert.deepEqual(errors,[],'tablet state lifecycle produces no browser errors');
});
