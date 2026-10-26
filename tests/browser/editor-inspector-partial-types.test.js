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

const publicDir=resolve(import.meta.dirname,'../../public');
const primaryGroups=new Set(['layout','size','spacing','flex','grid','position','typography','background','border','radius','shadow','opacity','transform','filter','animation']);
const duplicatePrimaryIds=new Set(['content.text','content.href','advanced.nodeName']);

test('every PARTIAL type renders declared Inspector routes and publishes responsive styles only after Publish',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(authoredTypes.has(type)&&type!=='richtext')execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Inspector-típus próba'}});
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
  assert.deepEqual(editorErrors,[],'opening every partial type must not throw');
});
