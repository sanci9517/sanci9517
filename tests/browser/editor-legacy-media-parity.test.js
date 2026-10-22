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
import {safeMediaUrl} from '../../public/editor-v2/core/element-content.js';

test('legacy image video audio share guarded media URLs in Inspector Canvas and public Save/Publish',async t=>{
  const model=createEditorState(createDocument());
  const pageId=model.document.activePageId,rootId=activePage(model).rootId,ids={};
  const entries=[
    ['badImage','image','//untrusted.invalid/track.png'],
    ['badVideo','video','https://user:pass@untrusted.invalid/private.mp4'],
    ['badAudio','audio','relative/sound.mp3'],
    ['goodImage','image','/fixture.svg'],
    ['goodVideo','video','/fixture.webm'],
    ['goodAudio','audio','/fixture.webm']
  ];
  for(const [key,type,src] of entries){
    execute(model,{type:'element.add',payload:{type,parentId:rootId,props:{src,alt:'Tesztkép'}}});
    ids[key]=model.selection.primaryId;
  }
  execute(model,{type:'element.add',payload:{type:'image',parentId:rootId,props:{src:'',alt:''}}});
  ids.libraryImage=model.selection.primaryId;
  const mediaId='00000000-0000-4000-8000-000000000123',videoMediaId='00000000-0000-4000-8000-000000000124';
  assert.equal(safeMediaUrl('//untrusted.invalid/track.png'),'');
  assert.equal(safeMediaUrl('https://user:pass@untrusted.invalid/private.mp4'),'');
  assert.equal(safeMediaUrl('relative/sound.mp3'),'');
  assert.equal(safeMediaUrl('/fixture.svg'),'/fixture.svg');

  let draft=structuredClone(model.document),published=structuredClone(draft),revision=1;
  const posts=[],errors=[],externalRequests=[];
  const publicDir=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'test',title:'Test',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);
      draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id')){
      const playable=url.searchParams.get('mime');
      const asset=playable==='video'?{id:videoMediaId,name:'bemutatkozas.webm',mimeType:'video/webm',altText:'Bemutatkozó videó',previewUrl:'/api/admin/media?id='+videoMediaId}:{id:mediaId,name:'saját-kép.svg',mimeType:'image/svg+xml',altText:'Médiatárból választott kép',previewUrl:'/api/admin/media?id='+mediaId};
      return json({ok:true,data:{assets:[asset],nextCursor:null}});
    }
    if((url.pathname==='/api/admin/media'&&(url.searchParams.get('id')===mediaId||url.searchParams.get('id')===videoMediaId))||url.pathname==='/media/'+mediaId||url.pathname==='/media/'+videoMediaId){
      res.setHeader('content-type','image/svg+xml');
      return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="#56f"/></svg>');
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const target=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!target.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml'}[extname(target)]||'application/octet-stream');res.end(await readFile(target))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base='http://127.0.0.1:'+server.address().port;
  const editor=await browser.newPage({viewport:{width:1366,height:900}});
  const viewer=await browser.newPage({viewport:{width:1440,height:900}});
  for(const [name,page] of [['editor',editor],['public',viewer]]){
    page.setDefaultTimeout(9000);
    page.on('pageerror',error=>errors.push(name+': '+error.message));
    page.on('request',request=>{if(request.url().includes('untrusted.invalid'))externalRequests.push(request.url())});
  }
  const canvasNode=id=>editor.locator(`.node[data-node-id="${id}"]`);
  const publishedNode=id=>viewer.locator(`[data-node-id="${id}"]`);

  await editor.goto(base+'/editor-v2/index.html');
  await viewer.goto(base+'/p/test');
  await canvasNode(ids.goodImage).waitFor();
  await publishedNode(ids.goodImage).waitFor();
  for(const [key,mediaType] of [['badImage','img'],['badVideo','video'],['badAudio','audio']]){
    assert.equal(await canvasNode(ids[key]).locator('.media-preview '+mediaType).count(),0,key+' rejected on Editor Canvas');
    assert.equal(await publishedNode(ids[key]).locator(mediaType).count(),0,key+' rejected in public DOM');
    assert.equal(await publishedNode(ids[key]).count(),1,'legacy placeholder survives for '+key);
  }
  for(const [key,mediaType] of [['goodImage','img'],['goodVideo','video'],['goodAudio','audio']]){
    assert.equal(await canvasNode(ids[key]).locator('.media-preview '+mediaType).count(),1,key+' rendered on Canvas');
    assert.equal(await publishedNode(ids[key]).evaluate(el=>el.tagName.toLowerCase()),mediaType,key+' rendered publicly as the media element itself');
  }
  assert.deepEqual(externalRequests,[],'invalid external media never makes a network request');

  // Inspectors for legacy media must allow repair rather than displaying a
  // generic "missing detailed editor" message.
  await canvasNode(ids.badImage).evaluate(el=>el.click());
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  await editor.getByRole('button',{name:'Tartalom és szöveg'}).click();
  const inspector=editor.locator('.legacy-media-inspector');
  await inspector.waitFor();
  assert.equal(await inspector.locator('.property-validation[role="status"]').count(),1,'invalid URL is explained to the editor user');
  assert.equal(posts.length,0,'selecting and inspecting the node cannot persist or publish');
  await inspector.getByRole('textbox',{name:'Kép URL'}).fill('/fixture.svg');
  await inspector.getByRole('textbox',{name:'Kép URL'}).press('Tab');
  await canvasNode(ids.badImage).locator('.media-preview img').waitFor();
  assert.equal(await inspector.locator('.property-validation[role="status"]').count(),0,'warning disappears once URL is repaired');
  await inspector.getByRole('textbox',{name:'Kép leírása (alt)'}).fill('Javított képleírás');
  await inspector.getByRole('textbox',{name:'Kép leírása (alt)'}).press('Tab');
  await inspector.getByRole('textbox',{name:'Képaláírás (opcionális)'}).fill('A javított kép képaláírása');
  await inspector.getByRole('textbox',{name:'Képaláírás (opcionális)'}).press('Tab');
  await inspector.getByRole('combobox',{name:'Kép illesztése'}).selectOption('contain');
  assert.equal(await canvasNode(ids.badImage).locator('img').getAttribute('alt'),'Javított képleírás');
  assert.equal(await canvasNode(ids.badImage).locator('figcaption').textContent(),'A javított kép képaláírása');
  assert.equal(await canvasNode(ids.badImage).locator('img').evaluate(el=>getComputedStyle(el).objectFit),'contain');
  assert.equal(await publishedNode(ids.badImage).locator('img').count(),0,'public site unchanged before Save and Publish');

  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'Save only persists the draft');
  await viewer.reload();
  assert.equal(await publishedNode(ids.badImage).locator('img').count(),0,'Save never updates the published invalid media');

  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  assert.equal(posts.at(-1).publish,true);
  await viewer.reload();
  const repaired=publishedNode(ids.badImage);
  await repaired.waitFor();
  assert.equal(await repaired.evaluate(el=>el.tagName.toLowerCase()),'figure');
  assert.match(await repaired.locator('img').getAttribute('src'),/\/fixture\.svg$/);
  assert.equal(await repaired.locator('img').getAttribute('alt'),'Javított képleírás');
  assert.equal(await repaired.locator('figcaption').textContent(),'A javított kép képaláírása');
  assert.equal(await repaired.locator('img').evaluate(el=>getComputedStyle(el).objectFit),'contain');

  // The existing R2 image picker must also work for legacy image nodes.
  // Library selection updates only the draft and uses the private Admin route
  // while editing; public output becomes available only after Publish.
  await canvasNode(ids.libraryImage).evaluate(el=>el.click());
  await inspector.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await inspector.getByRole('button',{name:'saját-kép.svg kiválasztása'}).click();
  const draftAsset=canvasNode(ids.libraryImage).locator('.media-preview img');
  await draftAsset.waitFor();
  assert.match(await draftAsset.getAttribute('src'),/\/api\/admin\/media\?id=00000000-0000-4000-8000-000000000123$/);
  assert.equal(await draftAsset.getAttribute('alt'),'Médiatárból választott kép','picker transfers asset alt text to empty legacy alt');
  assert.equal(await publishedNode(ids.libraryImage).evaluate(el=>el.tagName.toLowerCase()),'div','asset selection never auto-publishes');

  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.equal(draft.pages[pageId].nodes[ids.libraryImage].props.assetId,mediaId);
  await viewer.reload();
  assert.equal(await publishedNode(ids.libraryImage).evaluate(el=>el.tagName.toLowerCase()),'div','saved image remains private until Publish');

  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  assert.equal(posts.at(-1).publish,true);
  await viewer.reload();
  const publishedAsset=publishedNode(ids.libraryImage);
  await publishedAsset.waitFor();
  assert.equal(await publishedAsset.evaluate(el=>el.tagName.toLowerCase()),'img');
  assert.match(await publishedAsset.getAttribute('src'),/\/media\/00000000-0000-4000-8000-000000000123$/);
  assert.equal(await publishedAsset.getAttribute('alt'),'Médiatárból választott kép');

  await viewer.setViewportSize({width:390,height:820});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const [key,mediaType] of [['badVideo','video'],['badAudio','audio']]){
    assert.equal(await canvasNode(ids[key]).locator('.media-preview '+mediaType).count(),0,'invalid '+key+' still hidden in mobile Editor');
    assert.equal(await publishedNode(ids[key]).locator(mediaType).count(),0,'invalid '+key+' still hidden on mobile public');
  }
  assert.equal(await publishedNode(ids.badImage).evaluate(el=>el.tagName.toLowerCase()),'figure','captioned repaired image visible in mobile public');
  assert.equal(await canvasNode(ids.badImage).locator('img').count(),1,'repaired image visible in mobile Canvas');
  assert.equal(await publishedNode(ids.libraryImage).evaluate(el=>el.tagName.toLowerCase()),'img','R2 library image visible publicly on mobile');
  assert.match(await canvasNode(ids.libraryImage).locator('img').getAttribute('src'),/\/api\/admin\/media\?id=/);

  // A manual source URL can replace a previously selected media-library asset;
  // the obsolete asset ID must not silently override the Inspector input.
  await canvasNode(ids.libraryImage).evaluate(el=>el.click());
  await inspector.getByRole('textbox',{name:'Kép URL'}).fill('/fixture.svg');
  await inspector.getByRole('textbox',{name:'Kép URL'}).press('Tab');
  assert.equal((await canvasNode(ids.libraryImage).locator('img').getAttribute('src')).endsWith('/fixture.svg'),true);
  assert.equal(draft.pages[pageId].nodes[ids.libraryImage].props.assetId,mediaId,'unsaved manual source cannot mutate the saved revision');
  // Both legacy playback blocks have functional Inspector controls. Their
  // Canvas preview and public markup must honor exactly the same flags, except
  // that autoplay is always suppressed on the Editor Canvas.
  await viewer.setViewportSize({width:1440,height:900});
  await canvasNode(ids.goodVideo).evaluate(el=>el.click());
  const videoInspector=editor.locator('.legacy-media-inspector');
  await videoInspector.getByRole('checkbox',{name:'Lejátszóvezérlők megjelenítése'}).uncheck();
  await videoInspector.getByRole('checkbox',{name:'Folyamatos ismétlés'}).check();
  await videoInspector.getByRole('checkbox',{name:'Videó némítása'}).check();
  await videoInspector.getByRole('checkbox',{name:'Automatikus videóindítás (csak némítva)'}).check();
  await videoInspector.getByRole('button',{name:'Médiatár megnyitása'}).first().click();
  await videoInspector.getByRole('button',{name:'bemutatkozas.webm kiválasztása'}).click();
  assert.match(await canvasNode(ids.goodVideo).locator('video').getAttribute('src'),/\/api\/admin\/media\?id=00000000-0000-4000-8000-000000000124$/,'video picker uses its private editor source');
  await videoInspector.getByRole('button',{name:'Médiatár megnyitása'}).nth(1).click();
  await videoInspector.getByRole('button',{name:'saját-kép.svg kiválasztása'}).click();
  const moviePreview=canvasNode(ids.goodVideo).locator('video');
  assert.equal(await moviePreview.evaluate(el=>el.controls),false);
  assert.equal(await moviePreview.evaluate(el=>el.loop),true);
  assert.equal(await moviePreview.evaluate(el=>el.muted),true);
  assert.equal(await moviePreview.evaluate(el=>el.autoplay),false,'Canvas never autoplays while editing');
  assert.match(await moviePreview.getAttribute('poster'),/\/api\/admin\/media\?id=00000000-0000-4000-8000-000000000123$/);
  assert.equal(await publishedNode(ids.goodVideo).getAttribute('poster'),null,'unsaved new poster never appears publicly');
  assert.equal(await publishedNode(ids.goodVideo).evaluate(el=>el.controls),true,'published controls unchanged before Save');

  await canvasNode(ids.goodAudio).evaluate(el=>el.click());
  const audioInspector=editor.locator('.legacy-media-inspector');
  await audioInspector.getByRole('checkbox',{name:'Lejátszóvezérlők megjelenítése'}).uncheck();
  await audioInspector.getByRole('checkbox',{name:'Folyamatos ismétlés'}).check();
  const soundPreview=canvasNode(ids.goodAudio).locator('audio');
  assert.equal(await soundPreview.evaluate(el=>el.controls),false);
  assert.equal(await soundPreview.evaluate(el=>el.loop),true);

  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'playback controls do not auto-publish');
  await viewer.reload();
  assert.equal(await publishedNode(ids.goodVideo).getAttribute('poster'),null,'Save keeps old public video');
  assert.equal(await publishedNode(ids.goodAudio).evaluate(el=>el.controls),true,'Save keeps old public audio');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  assert.equal(posts.at(-1).publish,true);
  await viewer.reload();
  const publishedMovie=publishedNode(ids.goodVideo),publishedSound=publishedNode(ids.goodAudio);
  assert.equal(await publishedMovie.getAttribute('controls'),null);
  assert.equal(await publishedMovie.getAttribute('loop'),'');
  assert.equal(await publishedMovie.getAttribute('muted'),'');
  assert.equal(await publishedMovie.getAttribute('autoplay'),'','public autoplay only on muted video');
  assert.match(await publishedMovie.getAttribute('poster'),/\/media\/00000000-0000-4000-8000-000000000123$/);
  assert.equal(await publishedSound.getAttribute('controls'),null);
  assert.equal(await publishedSound.getAttribute('loop'),'');
  await viewer.setViewportSize({width:390,height:820});
  assert.equal(await publishedMovie.getAttribute('poster')!==null,true,'mobile public poster is preserved');
  assert.equal(await publishedSound.getAttribute('loop'),'','mobile audio still loops');

  // The legacy image needs the same crop/focal/loading/decorative controls
  // on Editor Canvas and the published page, at mobile and desktop widths.
  await canvasNode(ids.badImage).evaluate(el=>el.click());
  const imageInspector=editor.locator('.legacy-media-inspector');
  await imageInspector.getByRole('combobox',{name:'Kép illesztése'}).selectOption('cover');
  await imageInspector.getByRole('combobox',{name:'Képarány'}).selectOption('1 / 1');
  for(const [name,value] of [['Kivágás vízszintesen','25'],['Kivágás függőlegesen','80']]){
    await imageInspector.getByRole('slider',{name}).evaluate((el,next)=>{
      el.value=next;
      el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
    },value);
  }
  await imageInspector.getByRole('combobox',{name:'Kép betöltése'}).selectOption('eager');
  await imageInspector.getByRole('checkbox',{name:'Csak díszítő kép'}).check();
  const croppedCanvas=canvasNode(ids.badImage).locator('img');
  assert.equal(await croppedCanvas.evaluate(el=>getComputedStyle(el).objectFit),'cover');
  assert.equal(await croppedCanvas.evaluate(el=>getComputedStyle(el).objectPosition),'25% 80%');
  assert.equal(await croppedCanvas.evaluate(el=>getComputedStyle(el).aspectRatio),'1 / 1');
  assert.equal(await croppedCanvas.getAttribute('loading'),'eager');
  assert.equal(await croppedCanvas.getAttribute('alt'),'','decorative image has no accessible alt');
  assert.equal(await croppedCanvas.getAttribute('role'),'presentation');
  assert.equal(await publishedNode(ids.badImage).locator('img').evaluate(el=>getComputedStyle(el).objectFit),'contain','public crop remains unchanged before Save');

  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.equal(draft.pages[pageId].nodes[ids.badImage].props.alt,'Javított képleírás','decorative mode does not delete the authored alt text');
  await viewer.reload();
  assert.equal(await publishedNode(ids.badImage).locator('img').getAttribute('role'),null,'Save does not publish decorative mode');
  assert.equal(await publishedNode(ids.badImage).locator('img').getAttribute('loading'),'lazy');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  assert.equal(posts.at(-1).publish,true);
  await viewer.reload();
  for(const width of [390,1440]){
    await viewer.setViewportSize({width,height:820});
    // A viewport change starts a fresh async Page Model render. Wait for its
    // attached, restyled image rather than sampling a node being replaced.
    await viewer.waitForFunction(id=>{
      const img=document.querySelector('[data-node-id="'+id+'"] img');
      if(!(img instanceof HTMLImageElement)||!img.isConnected)return false;
      const css=getComputedStyle(img);
      return css.objectFit==='cover'&&css.objectPosition==='25% 80%'&&css.aspectRatio==='1 / 1';
    },ids.badImage);
    const image=publishedNode(ids.badImage).locator('img');
    assert.equal(await image.evaluate(el=>el.style.objectFit),'cover');
    assert.equal(await image.evaluate(el=>el.style.objectPosition),'25% 80%');
    assert.equal(await image.evaluate(el=>el.style.aspectRatio),'1 / 1');
    assert.equal(await image.getAttribute('loading'),'eager');
    assert.equal(await image.getAttribute('alt'),'');
    assert.equal(await image.getAttribute('role'),'presentation');
  }
  // Turning decorative mode off restores the stored alt without retyping.
  await imageInspector.getByRole('checkbox',{name:'Csak díszítő kép'}).uncheck();
  assert.equal(await canvasNode(ids.badImage).locator('img').getAttribute('alt'),'Javított képleírás');

  assert.deepEqual(externalRequests,[],'invalid media are blocked at all viewport sizes');
  assert.deepEqual(errors,[]);
});
