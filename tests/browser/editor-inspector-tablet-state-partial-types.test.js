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
const desktopColor='#16a34a';
const tabletColor='#c026d3';
const desktopFocusColor='#1d4ed8';
const tabletFocusColor='#0ea5e9';
const desktopHoverGradient='linear-gradient(135deg, #111827 0%, #475569 100%)';
const tabletHoverGradient='linear-gradient(135deg, #fb7185 0%, #fbbf24 100%)';
const desktopFocusGradient='linear-gradient(180deg, #ffffff 0%, #e0e7ff 100%)';
const tabletFocusGradient='linear-gradient(135deg, #7047eb 0%, #17b8a6 100%)';
const desktopHoverGradientCss='linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(71, 85, 105) 100%)';
const tabletHoverGradientCss='linear-gradient(135deg, rgb(251, 113, 133) 0%, rgb(251, 191, 36) 100%)';
const desktopFocusGradientCss='linear-gradient(rgb(255, 255, 255) 0%, rgb(224, 231, 255) 100%)';
const tabletFocusGradientCss='linear-gradient(135deg, rgb(112, 71, 235) 0%, rgb(23, 184, 166) 100%)';
const desktopBoxShadow='0 8px 24px #0005';
const tabletHoverBoxShadow='0 16px 48px #0007';
const tabletFocusBoxShadow='0 2px 8px #0003';
const desktopBoxShadowCss='rgba(0, 0, 0, 0.333) 0px 8px 24px 0px';
const tabletHoverBoxShadowCss='rgba(0, 0, 0, 0.467) 0px 16px 48px 0px';
const tabletFocusBoxShadowCss='rgba(0, 0, 0, 0.2) 0px 2px 8px 0px';
const desktopHoverBorder='#f59e0b';
const tabletHoverBorder='#0ea5e9';
const desktopFocusBorder='#64748b';
const tabletFocusBorder='#a855f7';
const desktopHoverTextColor='#2563eb';
const tabletHoverTextColor='#dc2626';
const desktopFocusTextColor='#334155';
const tabletFocusTextColor='#1d4ed8';
const desktopHoverFontWeight='700';
const tabletHoverFontWeight='900';
const desktopFocusFontWeight='600';
const tabletFocusFontWeight='800';
const desktopHoverDecoration='underline';
const tabletHoverDecoration='line-through';
const desktopFocusDecoration='none';
const tabletFocusDecoration='overline';
const desktopHoverOpacity='0.75';
const tabletHoverOpacity='0.85';
const desktopFocusOpacity='0.8';
const tabletFocusOpacity='0.65';
const desktopHoverRotate='4deg';
const tabletHoverRotate='7deg';
const desktopFocusRotate='2deg';
const tabletFocusRotate='-5deg';
const desktopHoverScale='0.95';
const tabletHoverScale='1.1';
const desktopFocusScale='1.05';
const tabletFocusScale='0.9';

test('editable PARTIAL types preserve responsive hover/focus visual and typography states through Inspector, Canvas, Save and Publish',async t=>{
  const model=createEditorState(createDocument()),pageId=model.document.activePageId;
  const rootId=model.document.pages[pageId].rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    execute(model,{type:'style.set',payload:{nodeId:id,patch:{minHeight:'30px',padding:'4px'}}});
    execute(model,{type:'states.set',payload:{nodeId:id,state:'hover',device:'desktop',patch:{backgroundColor:desktopColor,backgroundImage:desktopHoverGradient,borderColor:desktopHoverBorder,boxShadow:desktopBoxShadow,color:desktopHoverTextColor,fontWeight:desktopHoverFontWeight,textDecoration:desktopHoverDecoration,opacity:desktopHoverOpacity,rotate:desktopHoverRotate,scale:desktopHoverScale}}});
    execute(model,{type:'states.set',payload:{nodeId:id,state:'focus-visible',device:'desktop',patch:{backgroundColor:desktopFocusColor,backgroundImage:desktopFocusGradient,borderColor:desktopFocusBorder,boxShadow:desktopBoxShadow,color:desktopFocusTextColor,fontWeight:desktopFocusFontWeight,textDecoration:desktopFocusDecoration,opacity:desktopFocusOpacity,rotate:desktopFocusRotate,scale:desktopFocusScale}}});
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Tablet state próba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Tablet state próba'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  assert.equal(nodes.length,45,'fixture contains root plus every editable PARTIAL type');
  const editableNodes=nodes.filter(node=>node.type!==NODE_TYPES.ROOT);
  let draft=structuredClone(model.document),published=structuredClone(draft),revision=1;
  const posts=[],editorErrors=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'tablet-hover-partials',title:'Tablet hover fixtures',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'tablet-hover-partials',title:'Tablet hover fixtures',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Tablet state test'}});
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
  const inspector=editor.locator('#inspectorBody');
  const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`);
  const publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  await viewer.waitForFunction(count=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=count,editableNodes.length);
  const focusableNodes=[];
  for(const node of editableNodes){
    const hidden=await publicNode(node.id).getAttribute('aria-hidden')==='true';
    if(hidden){
      assert.equal(await publicNode(node.id).getAttribute('tabindex'),null,`${node.type}: aria-hidden content is not added to keyboard navigation`);
      continue;
    }
    focusableNodes.push(node);
  }
  const activateEditorDevice=async device=>{
    const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);
    if(!await button.evaluate(el=>el.classList.contains('active')))await button.click();
  };
  const activateViewerDevice=async device=>{
    const width={desktop:1366,tablet:768,mobile:390}[device];
    const changed=await viewer.evaluate(next=>window.innerWidth!==next,width);
    const rendered=changed?viewer.waitForResponse(response=>response.url().includes('/api/public/presentation')):null;
    await viewer.setViewportSize({width,height:900});
    if(rendered)await rendered;
    await viewer.waitForFunction(({expected,id})=>window.innerWidth===expected&&document.querySelector(`[data-node-id="${id}"]`)!==null,{expected:width,id:editableNodes[0].id});
  };
  const openTabletStateField=async(id,state,key)=>{
    await canvas(id).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').nth(2).click();
    let group=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
    let title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    let stateSelect=group.getByLabel('Állapot előnézete',{exact:true});
    if(await stateSelect.inputValue()!==state)await stateSelect.selectOption(state);
    group=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
    title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    return group.locator(`[data-state-property="${key}"]`);
  };
  const stateKeys=['backgroundColor','backgroundImage','borderColor','boxShadow','color','fontWeight','textDecoration','opacity','rotate','scale'];
  const stateValues={hover:{backgroundColor:tabletColor,backgroundImage:tabletHoverGradient,borderColor:tabletHoverBorder,boxShadow:tabletHoverBoxShadow,color:tabletHoverTextColor,fontWeight:tabletHoverFontWeight,textDecoration:tabletHoverDecoration,opacity:tabletHoverOpacity,rotate:tabletHoverRotate,scale:tabletHoverScale},'focus-visible':{backgroundColor:tabletFocusColor,backgroundImage:tabletFocusGradient,borderColor:tabletFocusBorder,boxShadow:tabletFocusBoxShadow,color:tabletFocusTextColor,fontWeight:tabletFocusFontWeight,textDecoration:tabletFocusDecoration,opacity:tabletFocusOpacity,rotate:tabletFocusRotate,scale:tabletFocusScale}};
  const stateCss={hover:{backgroundColor:'rgb(192, 38, 211)',backgroundImage:tabletHoverGradientCss,borderColor:'rgb(14, 165, 233)',boxShadow:tabletHoverBoxShadowCss,color:'rgb(220, 38, 38)',fontWeight:'900',textDecoration:'line-through',opacity:'0.85',rotate:'7deg',scale:'1.1'},'focus-visible':{backgroundColor:'rgb(14, 165, 233)',backgroundImage:tabletFocusGradientCss,borderColor:'rgb(168, 85, 247)',boxShadow:tabletFocusBoxShadowCss,color:'rgb(29, 78, 216)',fontWeight:'800',textDecoration:'overline',opacity:'0.65',rotate:'-5deg',scale:'0.9'}};
  const desktopStateCss={hover:{backgroundColor:'rgb(22, 163, 74)',backgroundImage:desktopHoverGradientCss,borderColor:'rgb(245, 158, 11)',boxShadow:desktopBoxShadowCss,color:'rgb(37, 99, 235)',fontWeight:'700',textDecoration:'underline',opacity:'0.75',rotate:'4deg',scale:'0.95'},'focus-visible':{backgroundColor:'rgb(29, 78, 216)',backgroundImage:desktopFocusGradientCss,borderColor:'rgb(100, 116, 139)',boxShadow:desktopBoxShadowCss,color:'rgb(51, 65, 85)',fontWeight:'600',textDecoration:'none',opacity:'0.8',rotate:'2deg',scale:'1.05'}};
  const desktopStateValues={hover:{backgroundColor:desktopColor,backgroundImage:desktopHoverGradient,borderColor:desktopHoverBorder,boxShadow:desktopBoxShadow,color:desktopHoverTextColor,fontWeight:desktopHoverFontWeight,textDecoration:desktopHoverDecoration,opacity:desktopHoverOpacity,rotate:desktopHoverRotate,scale:desktopHoverScale},'focus-visible':{backgroundColor:desktopFocusColor,backgroundImage:desktopFocusGradient,borderColor:desktopFocusBorder,boxShadow:desktopBoxShadow,color:desktopFocusTextColor,fontWeight:desktopFocusFontWeight,textDecoration:desktopFocusDecoration,opacity:desktopFocusOpacity,rotate:desktopFocusRotate,scale:desktopFocusScale}};
  const mobileStateValues={hover:{backgroundColor:'#facc15',backgroundImage:'linear-gradient(135deg, #111827 0%, #475569 100%)',borderColor:'#f97316',boxShadow:'0 16px 48px #0007',color:'#9333ea',fontWeight:'800',textDecoration:'line-through',opacity:'0.9',rotate:'3deg',scale:'1.2'},'focus-visible':{backgroundColor:'#fde68a',backgroundImage:'linear-gradient(180deg, #ffffff 0%, #e0e7ff 100%)',borderColor:'#c2410c',boxShadow:'0 2px 8px #0003',color:'#be123c',fontWeight:'900',textDecoration:'underline',opacity:'0.55',rotate:'-3deg',scale:'0.85'}};
  const mobileStateCss={hover:{backgroundColor:'rgb(250, 204, 21)',backgroundImage:'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(71, 85, 105) 100%)',borderColor:'rgb(249, 115, 22)',boxShadow:tabletHoverBoxShadowCss,color:'rgb(147, 51, 234)',fontWeight:'800',textDecoration:'line-through',opacity:'0.9',rotate:'3deg',scale:'1.2'},'focus-visible':{backgroundColor:'rgb(253, 230, 138)',backgroundImage:'linear-gradient(rgb(255, 255, 255) 0%, rgb(224, 231, 255) 100%)',borderColor:'rgb(194, 65, 12)',boxShadow:tabletFocusBoxShadowCss,color:'rgb(190, 18, 60)',fontWeight:'900',textDecoration:'underline',opacity:'0.55',rotate:'-3deg',scale:'0.85'}};
  const cssKey=key=>key==='textDecoration'?'textDecorationLine':key;
  const selectKeys=['backgroundImage','boxShadow','fontWeight','textDecoration'];
  const numberKeys=['opacity','rotate','scale'];
  const getStateControl=(field,key)=>selectKeys.includes(key)?field.locator('select:not(.property-token-picker)'):numberKeys.includes(key)?field.locator('input[type="number"]'):field.locator('input[type="text"]');
  const stateInputValue=(state,key)=>key==='rotate'?state[key].replace(/deg$/,''):state[key];
  const mobileOnly=process.env.INSPECTOR_STATE_MOBILE_ONLY==='1';
  const editTabletStateField=async({type,id},state,key)=>{
    const field=await openTabletStateField(id,state,key);
    assert.equal(await field.getAttribute('data-property-command'),'states.set',`${type}: ${state} ${key} uses the shared state command`);
    assert.equal(await field.getAttribute('data-property-key'),key,`${type}: ${state} ${key} maps to the Page Model key`);
    const input=getStateControl(field,key);
    if(selectKeys.includes(key))await input.selectOption(stateValues[state][key]);else{await input.fill(stateInputValue(stateValues[state],key));await input.press('Tab')}
    assert.equal(await canvas(id).getAttribute('data-editor-state'),state,`${type}: tablet ${state} preview is marked on Canvas`);
    assert.equal(await canvas(id).evaluate((el,property)=>getComputedStyle(el)[property],cssKey(key)),stateCss[state][key],`${type}: tablet ${state} ${key} reaches Canvas CSS`);
  };
  const readStateProperty=async(id,state,key)=>{
    if(state==='hover'){
      await viewer.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur()});
      await publicNode(id).hover();
    }else await publicNode(id).focus();
    return publicNode(id).evaluate((el,property)=>getComputedStyle(el)[property],cssKey(key));
  };
  const assertPublicProperty=async(state,key,expected,label)=>{
    const nodes=state==='focus-visible'?focusableNodes:editableNodes;
    for(const {type,id} of nodes)assert.equal(await readStateProperty(id,state,key),expected,`${type}: ${label}`);
    if(state==='focus-visible')for(const {type,id} of editableNodes.filter(node=>!focusableNodes.includes(node)))
      assert.equal(await publicNode(id).getAttribute('tabindex'),null,`${type}: aria-hidden content remains outside keyboard navigation after ${label}`);
  };
  const assertPublicState=async(state,expected,label)=>{for(const key of stateKeys)await assertPublicProperty(state,key,expected[key],`${label} (${key})`)};

  if(!mobileOnly){
  await activateEditorDevice('tablet');await activateViewerDevice('tablet');
  for(const node of editableNodes)for(const state of ['hover','focus-visible'])for(const key of stateKeys)await editTabletStateField(node,state,key);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet state Save remains draft-only');
  for(const {type,id} of editableNodes){
    for(const [state,key,desktopValue] of [['hover','backgroundColor',desktopColor],['hover','backgroundImage',desktopHoverGradient],['hover','borderColor',desktopHoverBorder],['hover','boxShadow',desktopBoxShadow],['hover','color',desktopHoverTextColor],['hover','fontWeight',desktopHoverFontWeight],['hover','textDecoration',desktopHoverDecoration],['hover','opacity',desktopHoverOpacity],['hover','rotate',desktopHoverRotate],['hover','scale',desktopHoverScale],['focus-visible','backgroundColor',desktopFocusColor],['focus-visible','backgroundImage',desktopFocusGradient],['focus-visible','borderColor',desktopFocusBorder],['focus-visible','boxShadow',desktopBoxShadow],['focus-visible','color',desktopFocusTextColor],['focus-visible','fontWeight',desktopFocusFontWeight],['focus-visible','textDecoration',desktopFocusDecoration],['focus-visible','opacity',desktopFocusOpacity],['focus-visible','rotate',desktopFocusRotate],['focus-visible','scale',desktopFocusScale]]){
      assert.equal(draft.pages[pageId].nodes[id].states[state].tablet[key],stateValues[state][key],`${type}: tablet ${state} ${key} is in the saved draft`);
      assert.equal(published.pages[pageId].nodes[id].states[state].tablet?.[key],undefined,`${type}: tablet ${state} ${key} Save does not publish`);
      assert.equal(published.pages[pageId].nodes[id].states[state].desktop[key],desktopValue,`${type}: tablet Save preserves desktop ${state} ${key}`);
    }
  }
  await editor.reload({waitUntil:'domcontentloaded'});await activateEditorDevice('tablet');
  for(const state of ['hover','focus-visible'])for(const key of stateKeys){
    const field=await openTabletStateField(editableNodes[0].id,state,key),input=getStateControl(field,key);
    assert.equal(await input.inputValue(),stateInputValue(stateValues[state],key),`tablet ${state} ${key} Inspector restores its value after Editor reload`);
  }
  await activateViewerDevice('tablet');
  await assertPublicState('hover',desktopStateCss.hover,'tablet draft Save leaves public hover unchanged');
  await assertPublicState('focus-visible',desktopStateCss['focus-visible'],'tablet draft Save leaves public focus-visible unchanged');

  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await assertPublicState('hover',stateCss.hover,'tablet Publish renders hover colors and gradients on every PARTIAL type');
  await assertPublicState('focus-visible',stateCss['focus-visible'],'tablet Publish renders focus-visible colors and gradients on every eligible PARTIAL type');
  await activateViewerDevice('desktop');
  await assertPublicState('hover',desktopStateCss.hover,'tablet Publish preserves desktop hover colors and gradients');
  await assertPublicState('focus-visible',desktopStateCss['focus-visible'],'tablet Publish preserves desktop focus-visible colors and gradients');
  await activateViewerDevice('mobile');
  await assertPublicState('hover',stateCss.hover,'mobile inherits the published tablet hover colors and gradients');
  await assertPublicState('focus-visible',stateCss['focus-visible'],'mobile inherits the published tablet focus-visible colors and gradients');

  await activateEditorDevice('tablet');
  for(const state of ['hover','focus-visible'])for(const {type,id} of editableNodes)for(const key of stateKeys){
    const field=await openTabletStateField(id,state,key),reset=editor.locator(`.property-reset[data-property-key="${key}"]`).filter({hasText:'Állapotérték öröklésének visszaállítása'});
    assert.equal(await field.getAttribute('data-property-command'),'states.set',`${type}: tablet ${state} ${key} reset uses the shared command`);
    assert.equal(await reset.count(),1,`${type}: tablet ${state} ${key} override exposes an inheritance reset`);
    await reset.click();
    assert.equal(await canvas(id).evaluate((el,property)=>getComputedStyle(el)[property],cssKey(key)),desktopStateCss[state][key],`${type}: reset Canvas preview inherits desktop ${state} ${key}`);
  }
  const lastNode=editableNodes.at(-1);
  await editor.locator('#undo').click();
  assert.equal(await canvas(lastNode.id).evaluate(el=>getComputedStyle(el).scale),tabletFocusScale,'Undo restores the final tablet focus-visible scale override');
  await editor.locator('#redo').click();
  assert.equal(await canvas(lastNode.id).evaluate(el=>getComputedStyle(el).scale),desktopFocusScale,'Redo restores desktop focus-visible scale inheritance');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    for(const [state,key] of [['hover','backgroundColor'],['hover','backgroundImage'],['hover','borderColor'],['hover','boxShadow'],['hover','color'],['hover','fontWeight'],['hover','textDecoration'],['hover','opacity'],['hover','rotate'],['hover','scale'],['focus-visible','backgroundColor'],['focus-visible','backgroundImage'],['focus-visible','borderColor'],['focus-visible','boxShadow'],['focus-visible','color'],['focus-visible','fontWeight'],['focus-visible','textDecoration'],['focus-visible','opacity'],['focus-visible','rotate'],['focus-visible','scale']]){
      assert.equal(draft.pages[pageId].nodes[id].states[state].tablet[key],undefined,`${type}: reset Save removes tablet ${state} ${key}`);
      assert.equal(published.pages[pageId].nodes[id].states[state].tablet[key],stateValues[state][key],`${type}: reset Save preserves published tablet ${state} ${key}`);
    }
  }
  await activateViewerDevice('tablet');await viewer.reload();
  await assertPublicState('hover',stateCss.hover,'tablet reset Save leaves published hover colors and gradients unchanged');
  await assertPublicState('focus-visible',stateCss['focus-visible'],'tablet reset Save leaves published focus-visible colors and gradients unchanged');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await assertPublicState('hover',desktopStateCss.hover,'tablet reset Publish returns every type to desktop hover inheritance');
  await assertPublicState('focus-visible',desktopStateCss['focus-visible'],'tablet reset Publish returns eligible types to desktop focus-visible inheritance');
  await activateViewerDevice('mobile');
  await assertPublicState('hover',desktopStateCss.hover,'mobile inherits desktop after tablet hover reset Publish');
  await assertPublicState('focus-visible',desktopStateCss['focus-visible'],'mobile inherits desktop after tablet focus-visible reset Publish');
  }

  await activateEditorDevice('mobile');await activateViewerDevice('mobile');
  for(const {type,id} of editableNodes)for(const state of ['hover','focus-visible'])for(const key of stateKeys){
    const field=await openTabletStateField(id,state,key);
    assert.equal(await field.getAttribute('data-property-command'),'states.set',`${type}: mobile ${state} ${key} uses the shared state command`);
    assert.equal(await field.getAttribute('data-property-key'),key,`${type}: mobile ${state} ${key} maps to the Page Model key`);
    const input=getStateControl(field,key),value=mobileStateValues[state][key];
    if(selectKeys.includes(key))await input.selectOption(value);else{await input.fill(key==='rotate'?value.replace(/deg$/,''):value);await input.press('Tab')}
    assert.equal(await canvas(id).getAttribute('data-editor-state'),state,`${type}: mobile ${state} preview is marked on Canvas`);
    assert.equal(await canvas(id).evaluate((el,property)=>getComputedStyle(el)[property],cssKey(key)),mobileStateCss[state][key],`${type}: mobile ${state} ${key} reaches Canvas CSS`);
  }
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'mobile state Save remains draft-only');
  for(const {type,id} of editableNodes)for(const state of ['hover','focus-visible'])for(const key of stateKeys){
    assert.equal(draft.pages[pageId].nodes[id].states[state].mobile[key],mobileStateValues[state][key],`${type}: mobile ${state} ${key} is in the saved draft`);
    assert.equal(published.pages[pageId].nodes[id].states[state].mobile?.[key],undefined,`${type}: mobile ${state} ${key} Save does not publish`);
    assert.equal(published.pages[pageId].nodes[id].states[state].tablet?.[key],undefined,`${type}: mobile Save preserves the independently reset tablet ${state} ${key}`);
    assert.equal(published.pages[pageId].nodes[id].states[state].desktop[key],desktopStateValues[state][key],`${type}: mobile Save preserves desktop ${state} ${key}`);
  }
  await editor.reload({waitUntil:'domcontentloaded'});await activateEditorDevice('mobile');
  for(const state of ['hover','focus-visible'])for(const key of stateKeys){
    const field=await openTabletStateField(editableNodes[0].id,state,key),input=getStateControl(field,key);
    assert.equal(await input.inputValue(),stateInputValue(mobileStateValues[state],key),`mobile ${state} ${key} Inspector restores its value after Editor reload`);
  }
  await activateViewerDevice('mobile');
  await assertPublicState('hover',desktopStateCss.hover,'mobile draft Save leaves public hover unchanged');
  await assertPublicState('focus-visible',desktopStateCss['focus-visible'],'mobile draft Save leaves public focus-visible unchanged');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await assertPublicState('hover',mobileStateCss.hover,'mobile Publish renders all ten hover state fields on every PARTIAL type');
  await assertPublicState('focus-visible',mobileStateCss['focus-visible'],'mobile Publish renders all ten focus-visible fields on every focusable PARTIAL type');
  await activateViewerDevice('tablet');
  await assertPublicState('hover',desktopStateCss.hover,'mobile Publish preserves the independently reset tablet hover fallback');
  await assertPublicState('focus-visible',desktopStateCss['focus-visible'],'mobile Publish preserves the independently reset tablet focus fallback');
  await activateViewerDevice('desktop');
  await assertPublicState('hover',desktopStateCss.hover,'mobile Publish preserves desktop hover values');
  await assertPublicState('focus-visible',desktopStateCss['focus-visible'],'mobile Publish preserves desktop focus values');
  await activateViewerDevice('mobile');
  await assertPublicState('hover',mobileStateCss.hover,'mobile responsive overrides remain active after desktop and tablet checks');
  await assertPublicState('focus-visible',mobileStateCss['focus-visible'],'mobile focus overrides remain active after desktop and tablet checks');
  assert.deepEqual(editorErrors,[],'all PARTIAL state Inspector controls open without browser errors');
});
