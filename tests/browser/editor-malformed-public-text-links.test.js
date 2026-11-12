import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,NODE_TYPES} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

const publicDir=resolve(import.meta.dirname,'../../public');

test('published page and Canvas handle malformed text, links and CSS without Save or Publish',async t=>{
  const state=createEditorState(createDocument(undefined,{modern:true}));
  const pageId=state.document.activePageId, rootId=state.document.pages[pageId].rootId;
  const add=type=>{
    execute(state,{type:'element.add',payload:{type,parentId:rootId}});
    return state.selection.primaryId;
  };
  const corruptedHeadingId=add(NODE_TYPES.HEADING);
  const buttonId=add(NODE_TYPES.BUTTON);
  const linkId=add(NODE_TYPES.LINK);
  const validLinkId=add(NODE_TYPES.LINK);
  const intactHeadingId=add(NODE_TYPES.HEADING);
  const page=state.document.pages[pageId];
  const invalid={toString:null};
  // An old published snapshot may have malformed child collections or IDs.
  // Neither may discard healthy siblings or turn a read-only page into a 404.
  page.nodes[corruptedHeadingId].children=invalid;
  page.nodes[rootId].children.splice(1,0,invalid);
  page.nodes[corruptedHeadingId].props={text:invalid};
  page.nodes[corruptedHeadingId].style={color:invalid,border:invalid,background:invalid,backgroundSize:invalid,margin:invalid,radius:invalid,fontSize:invalid,x:invalid,padding:'12px',height:'38px'};
  page.nodes[buttonId].responsive={mobile:{width:invalid,padding:'8px'}};
  page.nodes[buttonId].props={text:'Biztonságos gomb',url:invalid};
  page.nodes[linkId].props={text:'Biztonságos hivatkozás',href:invalid};
  page.nodes[validLinkId].props={text:'Érvényes cél',href:'/p/valid'};
  page.nodes[intactHeadingId].props={text:'A teljes oldal megmarad'};
  let writes=0;
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data));};
    if(req.method!=='GET'&&req.method!=='HEAD')writes++;
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Biztonságos oldal',description:'',content:page}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Biztonságos oldal'}});
    const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname;
    const filename=resolve(publicDir,'.'+path);
    if(!filename.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{
      res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(filename)]||'application/octet-stream');
      res.end(await readFile(filename));
    }catch{res.writeHead(404).end();}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
  const tab=await browser.newPage({viewport:{width:390,height:800}});
  const errors=[];tab.on('pageerror',err=>errors.push(err.message));
  await tab.goto('http://127.0.0.1:'+server.address().port+'/p/test');
  const root=selector=>tab.locator('[data-node-id="'+selector+'"]');
  await root(intactHeadingId).waitFor({timeout:20000});
  assert.equal((await root(intactHeadingId).textContent()).trim(),'A teljes oldal megmarad');
  assert.equal((await root(corruptedHeadingId).textContent()).trim(),'','bad text must not be coerced to an object label');
  assert.equal(await root(corruptedHeadingId).evaluate(el=>el.style.padding),'12px','valid CSS on the same malformed node is preserved');
  assert.equal(await root(corruptedHeadingId).evaluate(el=>el.style.color),'','malformed CSS must not become a public color');
  assert.equal(await root(corruptedHeadingId).evaluate(el=>el.style.border),'','malformed legacy border must not become CSS');
  assert.equal(await root(buttonId).evaluate(el=>el.style.padding),'8px','valid mobile CSS survives a malformed responsive width');
  assert.equal(await root(buttonId).evaluate(el=>el.style.width),'','malformed responsive width must not become public CSS');
  assert.equal((await root(buttonId).textContent()).trim(),'Biztonságos gomb');
  assert.equal(await root(buttonId).getAttribute('href'),null,'malformed URL cannot become a clickable button');
  assert.equal((await root(linkId).textContent()).trim(),'Biztonságos hivatkozás');
  assert.equal(await root(linkId).getAttribute('href'),null,'malformed URL cannot become a clickable link');
  assert.equal(await root(validLinkId).getAttribute('href'),'/p/valid','valid same-site links stay clickable');
  const canvas=await tab.evaluate(async()=>{
    const {applyNodeStyle}=await import('/editor-v2/core/canvas-engine.js?v=20261112-safe-css-parity');
    const invalid={toString:null};
    const element=document.createElement('div');
    applyNodeStyle(element,{type:'heading',style:{color:invalid,border:invalid,backgroundAssetId:invalid,x:invalid,padding:'14px',height:'42px'},responsive:{mobile:{width:invalid}}},'mobile');
    return {padding:element.style.padding,height:element.style.height,color:element.style.color,border:element.style.border,width:element.style.width,left:element.style.left};
  });
  assert.deepEqual(canvas,{padding:'14px',height:'42px',color:'',border:'',width:'',left:''},
    'Canvas ignores invalid JSON CSS without changing valid dimensions or persisting defaults');
  const visibility=await tab.evaluate(async()=>{
    const {collectVisibleDescendants,safeNodeChildIds}=await import('/editor-v2/core/visibility.js?v=20261112-safe-node-children');
    const invalid={toString:null};
    const fixture={rootId:'root',nodes:{
      root:{id:'root',children:['a',invalid,42,'b','root','a']},
      a:{id:'a',children:['a','b']},
      b:{id:'b',children:[invalid,null,'c','root']},
      c:{id:'c',children:['a']}
    }};
    return {
      ids:collectVisibleDescendants(fixture,'mobile').map(node=>node.id),
      rootChildCount:fixture.nodes.root.children.length,
      invalidRootChildren:safeNodeChildIds({children:invalid}),
      validChildren:safeNodeChildIds(fixture.nodes.root)
    };
  });
  assert.deepEqual(visibility,{ids:['a','b','c'],rootChildCount:6,invalidRootChildren:[],validChildren:['a','b','root','a']},
    'Canvas/public visibility traversal ignores malformed child data without changing the saved tree');
  assert.deepEqual(errors,[],'malformed persisted data must not abort public page rendering or Canvas style calculation');
  // Older imports can contain self-references, back-edges, root references,
  // or duplicated child IDs. The public renderer must visit each node once,
  // like Canvas visibility, and keep healthy siblings without rewriting data.
  // A leaf heading with a broken reference to a later healthy root sibling
  // must not consume that sibling before its own root-level turn to render.
  page.nodes[corruptedHeadingId].children=[corruptedHeadingId,intactHeadingId];
  page.nodes[intactHeadingId].children=[intactHeadingId,buttonId];
  page.nodes[rootId].children.push(rootId,buttonId);
  await tab.reload();
  await root(intactHeadingId).waitFor({timeout:20000});
  assert.equal((await root(intactHeadingId).textContent()).trim(),'A teljes oldal megmarad');
  assert.equal(await root(intactHeadingId).count(),1,'self-cycle does not duplicate its heading');
  assert.equal(await root(buttonId).count(),1,'duplicate root child and back-edge render button only once');
  assert.equal(await root(validLinkId).count(),1,'valid sibling survives cyclic legacy references');
  assert.deepEqual(errors,[],'cyclic and duplicate child references cannot crash public rendering');
  assert.deepEqual(page.nodes[intactHeadingId].children,[intactHeadingId,buttonId],'read-only rendering preserves the cyclic Page Model');
  assert.deepEqual(page.nodes[corruptedHeadingId].children,[corruptedHeadingId,intactHeadingId],
    'invalid leaf child reference is neither consumed nor silently persisted away');
  // An authored content leaf ignores its saved child pointers too. The older
  // legacy-heading regression above alone would miss this eager traversal bug.
  page.nodes[corruptedHeadingId].metadata={...page.nodes[corruptedHeadingId].metadata,contentVersion:1};
  await tab.reload();
  await root(intactHeadingId).waitFor({timeout:20000});
  assert.equal(await root(intactHeadingId).count(),1,
    'authored heading with a corrupt child edge must not consume a healthy root sibling');
  assert.equal((await root(intactHeadingId).textContent()).trim(),'A teljes oldal megmarad');
  assert.equal(await root(buttonId).count(),1,'other root siblings remain visible with authored leaf corruption');
  assert.deepEqual(errors,[],'authored leaf child pointers cannot cause public page errors');
  // The root itself may have a corrupted collection in a legacy snapshot.
  // A safe empty-page fallback is correct; displaying a 404 is not.
  page.nodes[rootId].children=invalid;
  await tab.reload();
  await tab.locator('.builder-text').waitFor({timeout:20000});
  assert.match(await tab.locator('.builder-text').textContent(),/oldalnak még nincs tartalma/i);
  assert.deepEqual(errors,[],'a malformed root must not generate an unhandled page error');
  assert.equal(writes,0,'rendering public content must never Save or Publish');
});
