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
  {id:'typography.fontFamily',key:'fontFamily',type:'select',value:'Georgia',css:'fontFamily',expected:'Georgia'},
  {id:'typography.fontSize',key:'fontSize',type:'dimension',value:'24px',css:'fontSize',expected:'24px'},
  {id:'typography.fontWeight',key:'fontWeight',type:'select',value:'800',css:'fontWeight',expected:'800'},
  {id:'typography.fontStyle',key:'fontStyle',type:'select',value:'italic',css:'fontStyle',expected:'italic'},
  {id:'typography.lineHeight',key:'lineHeight',type:'number',value:'1.7',css:'lineHeight',expected:'40.8px'},
  {id:'typography.letterSpacing',key:'letterSpacing',type:'dimension',value:'2px',css:'letterSpacing',expected:'2px'},
  {id:'typography.textAlign',key:'textAlign',type:'select',value:'center',css:'textAlign',expected:'center'},
  {id:'typography.textTransform',key:'textTransform',type:'select',value:'uppercase',css:'textTransform',expected:'uppercase'},
  {id:'typography.textDecoration',key:'textDecoration',type:'select',value:'underline',css:'textDecorationLine',expected:'underline'},
  {id:'typography.textWrap',key:'textWrap',type:'select',value:'nowrap',css:'textWrap',expected:'nowrap'},
  {id:'typography.overflowWrap',key:'overflowWrap',type:'select',value:'anywhere',css:'overflowWrap',expected:'anywhere'},
  {id:'typography.wordSpacing',key:'wordSpacing',type:'dimension',value:'3px',css:'wordSpacing',expected:'3px'},
  {id:'typography.textIndent',key:'textIndent',type:'dimension',value:'8px',css:'textIndent',expected:'8px'},
  {id:'typography.textShadow',key:'textShadow',type:'select',value:'0 2px 8px #0006',css:'textShadow',expected:'rgba(0, 0, 0, 0.4) 0px 2px 8px'}
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
  const setField=async({type,id},property)=>{
    await canvas(id).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const control=field(property.id);await ensureGroupOpen(control);
    assert.equal(await control.count(),1,`${type}: ${property.id} renders as one typed Inspector field`);
    assert.equal(await control.getAttribute('data-property-command'),'responsive.set',`${type}: ${property.id} uses the responsive command`);
    assert.equal(await control.getAttribute('data-property-key'),property.key,`${type}: ${property.id} maps to the Page Model key`);
    if(property.type==='select')await control.locator('select:not(.property-token-picker)').selectOption(property.value);
    else if(property.type==='dimension'){
      await control.locator('.dimension-controls select:not(.property-token-picker)').selectOption('px');
      const input=control.locator('.dimension-controls input[type="number"]');await input.fill(property.value.replace(/px$/,''));await input.press('Tab');
    }else{const input=control.locator('input[type="number"]');await input.fill(property.value);await input.press('Tab')}
    assert.equal(await canvas(id).evaluate((el,key)=>getComputedStyle(el)[key],property.css),property.expected,`${type}: ${property.key} reaches Canvas CSS`);
  };
  const readCss=node=>node.evaluate((el,keys)=>Object.fromEntries(keys.map(key=>[key,getComputedStyle(el)[key]])),properties.map(property=>property.css));
  const expected=Object.fromEntries(properties.map(property=>[property.css,property.expected]));
  const baseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));

  for(const node of editableNodes)for(const property of properties)await setField(node,property);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(requests.at(-1).publish,false,'Save remains draft-only');
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(draft.pages[pageId].nodes[id].responsive?.desktop?.[property.key],property.value,`${type}: Save stores ${property.key} in the desktop draft`);
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
      assert.equal(await input.inputValue(),property.type==='dimension'?property.value.replace(/px$/,''):property.value,`${type}: ${property.key} restores in Inspector after reload`);
    }
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  assert.equal(requests.at(-1).publish,true,'Publish is an explicit second operation');
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),expected,`${type}: published typography CSS matches the Inspector and Canvas`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[property.key],property.value,`${type}: Publish stores ${property.key}`);
  }
  assert.deepEqual(editorErrors,[],'opening all PARTIAL typography fields produces no browser errors');
});
