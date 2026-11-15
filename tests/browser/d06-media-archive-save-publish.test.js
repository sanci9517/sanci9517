import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

test('D-06 media usage, archive, Editor Save/reload, Publish, public delivery and site scope stay separate',async t=>{
  const editorState=createEditorState(createDocument());
  const pageId=editorState.document.activePageId;
  const rootId=activePage(editorState).rootId;
  const pageNode=()=>{
    execute(editorState,{type:'element.add',payload:{type:'image',parentId:rootId,props:{assetId:oldAssetId,src:'',alt:'Korábbi kép'}}});
    return editorState.selection.primaryId;
  };
  const oldAssetId='5a8d3ed2-8530-4b55-9a35-000000000001';
  const newAssetId='5a8d3ed2-8530-4b55-9a35-000000000002';
  const foreignAssetId='5a8d3ed2-8530-4b55-9a35-000000000003';
  const nodeId=pageNode();
  let draft=structuredClone(editorState.document),published=structuredClone(draft),revision=1;
  const posts=[],archiveChanges=[];
  const sites={'127.0.0.1':'site-default','site-other.local':'site-other'};
  const assets=new Map([
    [oldAssetId,{id:oldAssetId,siteId:'site-default',name:'korabbi-kep.png',mimeType:'image/png',altText:'Korábbi kép',archived:false}],
    [newAssetId,{id:newAssetId,siteId:'site-default',name:'uj-kep.png',mimeType:'image/png',altText:'Új kép leírása',archived:false}],
    [foreignAssetId,{id:foreignAssetId,siteId:'site-other',name:'masik-oldal.png',mimeType:'image/png',altText:'Másik oldal képe',archived:false}]
  ]);
  const refs=(document,id)=>{
    const page=document?.pages?.[pageId];
    return Object.values(page?.nodes||{}).filter(node=>node?.props?.assetId===id)
      .map(node=>({pageId,pageTitle:'Tesztoldal',slug:'test',source:'page',nodeId:node.id,nodeName:'Kép',path:'props.assetId'}));
  };
  const usage=(siteId,id)=>{
    const asset=assets.get(id);
    if(!asset||asset.siteId!==siteId)return null;
    return {assetId:id,complete:true,references:[
      ...(siteId==='site-default'?refs(draft,id).map(ref=>({...ref,source:'draft'})):[]),
      ...(siteId==='site-default'?refs(published,id).map(ref=>({...ref,source:'published'})):[])
    ]};
  };
  const json=(res,status,payload)=>{res.statusCode=status;res.setHeader('content-type','application/json');res.end(JSON.stringify(payload));};
  const png=Buffer.from([137,80,78,71,13,10,26,10]);
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://'+req.headers.host);
    const siteId=sites[url.hostname]||'site-default';
    if(url.pathname==='/api/admin/pages')return json(res,200,{ok:true,data:[{id:pageId,slug:'test',title:'Tesztoldal',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json(res,200,{ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let text='';for await(const part of req)text+=part;
      const body=JSON.parse(text);posts.push(body);draft=structuredClone(body.document);revision++;
      if(body.publish)published=structuredClone(body.document);
      return json(res,200,{ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(body.publish)}});
    }
    if(url.pathname==='/api/admin/media'&&req.method==='GET'&&url.searchParams.get('retentionStatus')==='1')
      return json(res,200,{ok:true,data:{migrationActive:true,requests:[],complete:true,permanentDeletionAuthorized:false}});
    if(url.pathname==='/api/admin/media'&&req.method==='GET'&&url.searchParams.has('usage')){
      const report=usage(siteId,url.searchParams.get('usage'));
      return report?json(res,200,{ok:true,data:report}):json(res,404,{ok:false,error:{code:'MEDIA_NOT_FOUND'}});
    }
    if(url.pathname==='/api/admin/media'&&req.method==='GET'&&url.searchParams.has('id')){
      const asset=assets.get(url.searchParams.get('id'));
      if(!asset||asset.siteId!==siteId||asset.archived)return json(res,404,{ok:false,error:{code:'MEDIA_NOT_FOUND'}});
      res.setHeader('content-type',asset.mimeType);return res.end(png);
    }
    if(url.pathname==='/api/admin/media'&&req.method==='GET'){
      const state=url.searchParams.get('state')||'active';
      const listed=[...assets.values()].filter(asset=>asset.siteId===siteId&&asset.archived===(state==='archived'))
        .map(asset=>({...asset,sizeBytes:png.length,archivedAt:asset.archived?'2026-11-15T00:00:00Z':null,previewUrl:'/fixture.png'}));
      return json(res,200,{ok:true,data:{assets:listed,nextCursor:null}});
    }
    if(url.pathname==='/api/admin/media'&&req.method==='PATCH'){
      let text='';for await(const part of req)text+=part;
      const body=JSON.parse(text),id=url.searchParams.get('id'),asset=assets.get(id);
      archiveChanges.push({siteId,id,archived:body.archived});
      if(!asset||asset.siteId!==siteId)return json(res,404,{ok:false,error:{code:'MEDIA_NOT_FOUND'}});
      if(typeof body.archived!=='boolean'||Object.keys(body).length!==1)return json(res,400,{ok:false,error:{code:'INVALID_MEDIA_METADATA'}});
      if(body.archived&&usage(siteId,id)?.references.length)return json(res,409,{ok:false,error:{code:'MEDIA_ASSET_IN_USE'}});
      asset.archived=body.archived;
      return json(res,200,{ok:true,data:{id,archived:asset.archived,changed:true}});
    }
    if(url.pathname==='/api/public/pages')return json(res,200,{ok:true,data:{id:pageId,slug:'test',title:'Tesztoldal',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json(res,200,{ok:true,data:{items:[]}});
    if(url.pathname==='/api/public/site-settings')return json(res,200,{ok:true,data:{siteName:'Tesztoldal'}});
    if(url.pathname==='/api/integrations/twitch/connection')return json(res,200,{ok:true,data:{connected:false}});
    if(url.pathname==='/media/'+oldAssetId||url.pathname==='/media/'+newAssetId||url.pathname==='/media/'+foreignAssetId){
      const id=url.pathname.slice('/media/'.length),asset=assets.get(id);
      if(!asset||asset.siteId!==siteId||asset.archived||!refs(published,id).length)return json(res,404,{ok:false,error:{code:'MEDIA_NOT_FOUND'}});
      res.setHeader('content-type',asset.mimeType);return res.end(png);
    }
    if(url.pathname==='/fixture.png'){res.setHeader('content-type','image/png');return res.end(png)}
    const publicDir=resolve(import.meta.dirname,'../../public');
    const target=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!target.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{
      res.setHeader('content-type',{'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml'}[extname(target)]||'application/octet-stream');
      res.end(await readFile(target));
    }catch{return res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const port=server.address().port,base=`http://127.0.0.1:${port}`;
  const editor=await browser.newPage({viewport:{width:1366,height:900}});
  const viewer=await browser.newPage({viewport:{width:1280,height:900}});
  editor.setDefaultTimeout(8000);viewer.setDefaultTimeout(8000);
  const canvasNode=()=>editor.locator(`.node[data-node-id="${nodeId}"]`);
  const publicNode=()=>viewer.locator(`[data-node-id="${nodeId}"]`);

  await editor.goto(base+'/editor-v2/index.html');
  await viewer.goto(base+'/p/test');
  await canvasNode().waitFor();await publicNode().waitFor();
  assert.equal(await publicNode().evaluate(node=>node.tagName.toLowerCase()),'img','the initial published image renders directly');
  assert.match(await publicNode().getAttribute('src'),/\/media\/5a8d3ed2-8530-4b55-9a35-000000000001$/,'the initial published image is served from the public media route');
  await canvasNode().evaluate(node=>node.click());
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  await editor.getByRole('tab',{name:'Tartalom és szöveg'}).click();
  const inspector=editor.locator('.legacy-media-inspector');
  await inspector.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await inspector.getByRole('button',{name:'uj-kep.png kiválasztása'}).click();
  assert.equal(await canvasNode().locator('.media-preview img').getAttribute('src'),'/api/admin/media?id='+newAssetId,'the Editor previews the replacement through the same-site private route');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'Save persists a draft only');
  assert.equal(refs(draft,newAssetId).length,1);assert.equal(refs(published,oldAssetId).length,1);
  await editor.reload();await canvasNode().waitFor();
  assert.equal(await canvasNode().locator('.media-preview img').getAttribute('src'),'/api/admin/media?id='+newAssetId,'reload restores the saved draft selection');
  await viewer.reload();await publicNode().waitFor();
  assert.match(await publicNode().getAttribute('src'),/\/media\/5a8d3ed2-8530-4b55-9a35-000000000001$/,'Save does not change public rendering');

  const mediaPage=await browser.newPage({viewport:{width:1366,height:900}});mediaPage.setDefaultTimeout(12000);
  await mediaPage.goto(base+'/admin-media.html');await mediaPage.locator('.tile').first().waitFor();
  const oldTile=mediaPage.locator('.tile').filter({hasText:'korabbi-kep.png'});
  assert.equal(await oldTile.count(),1,'the same-site active library still contains the published asset');
  await oldTile.getByRole('button',{name:'Médiafájl archiválása'}).click();
  await mediaPage.getByRole('button',{name:'Archiválás megerősítése'}).click();
  await mediaPage.getByText(/A médiafájlra oldal vagy korábbi verzió hivatkozik/).waitFor();
  assert.equal(assets.get(oldAssetId).archived,false,'usage in the published snapshot prevents archive after Save');
  assert.ok(archiveChanges.at(-1)?.archived,'the archive request reaches the route contract');

  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  assert.equal(posts.at(-1).publish,true,'Publish is a separate explicit request');
  await viewer.reload();await publicNode().waitFor();
  assert.match(await publicNode().getAttribute('src'),/\/media\/5a8d3ed2-8530-4b55-9a35-000000000002$/,'Publish changes the public snapshot to the selected asset');
  assert.equal(refs(published,oldAssetId).length,0);
  await mediaPage.reload();await mediaPage.locator('.tile').first().waitFor();
  const refreshedOldTile=mediaPage.locator('.tile').filter({hasText:'korabbi-kep.png'});
  await refreshedOldTile.getByRole('button',{name:'Médiafájl archiválása'}).click();
  await mediaPage.getByRole('button',{name:'Archiválás megerősítése'}).click();
  await refreshedOldTile.waitFor({state:'detached'});
  assert.equal(await mediaPage.locator('.tile').filter({hasText:'uj-kep.png'}).count(),1,'archiving A leaves the other active asset visible');
  assert.equal(assets.get(oldAssetId).archived,true,'an unreferenced asset can be archived after Publish');
  await viewer.evaluate(async id=>{const response=await fetch('/media/'+id);window.archivedStatus=response.status},oldAssetId);
  assert.equal(await viewer.evaluate(()=>window.archivedStatus),404,'archived assets are no longer publicly delivered');
  await mediaPage.getByLabel('Médiatár nézet').selectOption('archived');
  await mediaPage.locator('.tile').first().waitFor();
  assert.equal(await mediaPage.locator('.tile').filter({hasText:'korabbi-kep.png'}).count(),1,'archive preserves the asset in the archived library view');

  const otherSite=await browser.newPage();
  const otherSiteHeaders={host:`site-other.local:${port}`};
  const foreignRead=await otherSite.request.get(base+'/api/admin/media?id='+oldAssetId,{headers:otherSiteHeaders});
  const foreignArchive=await otherSite.request.patch(base+'/api/admin/media?id='+oldAssetId,{headers:otherSiteHeaders,data:{archived:false}});
  const foreignPublic=await otherSite.request.get(base+'/media/'+newAssetId,{headers:otherSiteHeaders});
  assert.equal(foreignRead.status(),404,'another site cannot read this site\'s private media');
  assert.equal(foreignArchive.status(),404,'another site cannot mutate this site\'s media');
  assert.equal(foreignPublic.status(),404,'another site cannot receive this site\'s published asset');
  assert.equal(assets.get(oldAssetId).archived,true,'cross-site requests do not alter the archived state');
  const ownForeignAsset=await otherSite.request.get(base+'/api/admin/media?id='+foreignAssetId,{headers:otherSiteHeaders});
  assert.equal(ownForeignAsset.status(),200,'the other site can access its own scoped media');
  assert.deepEqual(posts.map(post=>post.publish),[false,true],'only Save and Publish write Page Model snapshots');
  assert.deepEqual(archiveChanges.map(change=>[change.siteId,change.id,change.archived]),[
    ['site-default',oldAssetId,true],['site-default',oldAssetId,true],['site-other',oldAssetId,false]
  ]);
});
