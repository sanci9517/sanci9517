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

test('published page handles malformed text and link URLs without Save or Publish',async t=>{
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
  page.nodes[corruptedHeadingId].props={text:invalid};
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
  t.after(()=>new Promise(done=>server.close(done)));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(()=>browser.close());
  const tab=await browser.newPage({viewport:{width:390,height:800}});
  const errors=[];tab.on('pageerror',err=>errors.push(err.message));
  await tab.goto('http://127.0.0.1:'+server.address().port+'/p/test');
  const root=selector=>tab.locator('[data-node-id="'+selector+'"]');
  await root(intactHeadingId).waitFor({timeout:20000});
  assert.equal((await root(intactHeadingId).textContent()).trim(),'A teljes oldal megmarad');
  assert.equal((await root(corruptedHeadingId).textContent()).trim(),'','bad text must not be coerced to an object label');
  assert.equal((await root(buttonId).textContent()).trim(),'Biztonságos gomb');
  assert.equal(await root(buttonId).getAttribute('href'),null,'malformed URL cannot become a clickable button');
  assert.equal((await root(linkId).textContent()).trim(),'Biztonságos hivatkozás');
  assert.equal(await root(linkId).getAttribute('href'),null,'malformed URL cannot become a clickable link');
  assert.equal(await root(validLinkId).getAttribute('href'),'/p/valid','valid same-site links stay clickable');
  assert.deepEqual(errors,[],'malformed persisted data must not abort public page rendering');
  assert.equal(writes,0,'rendering public content must never Save or Publish');
});
