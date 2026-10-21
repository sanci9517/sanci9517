import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

// editor-sample.webm is a 619-byte, procedurally generated purple VP9 frame (ffmpeg lavfi color).
test('typed authored elements survive Inspector edits, reload and separate Publish with real accessible content and interactions',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId,rootId=activePage(state).rootId,ids={},assetId='6b1c2e65-e46e-4764-b234-123456789abc';
  execute(state,{type:'root.appearance.enable',payload:{nodeId:rootId}});
  execute(state,{type:'responsive.set',payload:{nodeId:rootId,device:'desktop',patch:{padding:'16px',color:'#182335',backgroundColor:'#ffffff'}}});
  const definitions={
    heading:{text:'Alkotói főcím',level:'1'},text:{text:'Egyedi szöveg'},button:{text:'Tovább',href:'/p/home',target:'_blank'},link:{text:'Kapcsolat',href:'mailto:creator@example.com'},
    quote:{text:'A kreativitás tanulható.',citation:'Egy alkotó'},badge:{text:'Új sorozat'},icon:{icon:'star',ariaLabel:'Kedvenc'},
    image:{src:'/fixture.svg',alt:'Tesztillusztráció',caption:'Képaláírás',fit:'contain',ratio:'1 / 1'},video:{src:'/fixture.webm',poster:'/fixture.svg',controls:true,muted:true},audio:{src:'/fixture.mp3',controls:true},
    list:{ordered:true,items:[{text:'Első hivatkozás',href:'/p/home'},{text:'Második elem'}]},table:{caption:'Eredmények',header:true,rows:[['Név','Érték'],['Nézők','42']]},
    tabs:{items:[{title:'Videók',text:'Videólista'},{title:'Bemutatkozás',text:'Személyes történet'}]},accordion:{items:[{title:'Hogyan készült?',text:'A kulisszák mögött.'}]},dropdown:{items:[{title:'További részletek',text:'Kiegészítés'}]},
    gallery:{columns:'3',items:[{src:'/fixture.svg',alt:'Első kép'},{src:'/fixture.svg',alt:'Második kép'}]},carousel:{ariaLabel:'Alkotói galéria',items:[{src:'/fixture.svg',alt:'Első dia'},{src:'/fixture.svg',alt:'Második dia'}]},
    code:{code:'<script>alert("Nem futok le")</script>',wrap:true},tooltip:{text:'Mi ez?',description:'Részletes magyarázat'},divider:{},spacer:{}
  };
  for(const [type,props] of Object.entries(definitions)){
    execute(state,{type:'element.add',payload:{type,parentId:rootId,name:type,style:{width:'320px',margin:'0 0 24px'}}});const id=state.selection.primaryId;ids[type]=id;
    execute(state,{type:'content.properties.set',payload:{nodeId:id,patch:props}});
  }
  let draft=structuredClone(state.document),published=structuredClone(state.document),version=1;const posts=[];
  const root=resolve(import.meta.dirname,'../../public');
  const video=await readFile(new URL('../fixtures/editor-sample.webm',import.meta.url));
  const audio=Buffer.alloc(44+4000);audio.write('RIFF',0);audio.writeUInt32LE(audio.length-8,4);audio.write('WAVEfmt ',8);audio.writeUInt32LE(16,16);audio.writeUInt16LE(1,20);audio.writeUInt16LE(1,22);audio.writeUInt32LE(8000,24);audio.writeUInt32LE(16000,28);audio.writeUInt16LE(2,32);audio.writeUInt16LE(16,34);audio.write('data',36);audio.writeUInt32LE(4000,40);

  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id'))return json({ok:true,data:{assets:[{id:assetId,name:'brand-mark.png',mimeType:'image/png',sizeBytes:128,altText:'Márkajel',previewUrl:'/api/admin/media?id='+assetId}]}});
    if(url.pathname==='/api/admin/media'&&url.searchParams.get('id')===assetId||url.pathname==='/media/'+assetId){res.setHeader('content-type','image/svg+xml');return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#7047eb"/></svg>')}
    if(url.pathname==='/fixture.svg'){res.setHeader('content-type','image/svg+xml');return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#7047eb"/></svg>')}
    if(url.pathname==='/fixture.webm'){res.setHeader('content-type','video/webm');return res.end(video)}if(url.pathname==='/fixture.mp3'){res.setHeader('content-type','audio/wav');return res.end(audio)}
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;if(request.publish)published=structuredClone(draft);return json({ok:true,data:{pageId,version,revisionId:'revision-'+version}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`,editor=await browser.newPage({viewport:{width:1366,height:900}}),live=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];
  editor.setDefaultTimeout(6000);live.setDefaultTimeout(6000);editor.on('pageerror',e=>errors.push(e.message));live.on('pageerror',e=>errors.push(e.message));
  const node=(tab,type)=>tab.locator(`.creator-node[data-node-id="${ids[type]}"]`);
  const select=async type=>{await node(editor,type).evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();await editor.locator('.inspector-tabs button').nth(1).click()};
  await editor.goto(base+'/editor-v2/index.html');await select('heading');
  await editor.getByLabel('Címsor szemantikai szintje',{exact:true}).selectOption('3');
  assert.equal(await node(editor,'heading').evaluate(el=>getComputedStyle(el).fontSize),'28px');
  await editor.getByRole('textbox',{name:'Szöveg tartalma',exact:true}).fill('Módosított főcím');
  await select('button');await editor.locator('.inspector-tabs button').first().click();
  const openGroup=async name=>{const title=editor.locator('.inspector-group-title').filter({has:editor.getByText(name,{exact:true})});if(await title.getAttribute('aria-expanded')==='false')await title.click()};
  await openGroup('Animáció');await editor.locator('[data-property-id="animation.transition"] select').selectOption('all 180ms ease');
  await openGroup('Transzformáció');const rotation=editor.locator('[data-property-id="transform.rotate"]');await rotation.locator('input').fill('3');await rotation.locator('input').press('Tab');
  await openGroup('Háttér');await editor.locator('[data-property-id="background.gradient"] select').selectOption('linear-gradient(135deg, #7047eb 0%, #17b8a6 100%)');
  await editor.locator('[data-property-id="background.image"]').getByRole('button',{name:'Médiatár megnyitása'}).click();
  await editor.locator('[data-property-id="background.image"] .editor-media-choice').click();
  await editor.locator('[data-property-id="background.size"] select').selectOption('cover');
  await editor.locator('[data-property-id="background.position"] select').selectOption('center top');
  assert.match(await node(editor,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/api\/admin\/media\?id=/,'canvas uses authenticated background preview');
  await editor.locator('.inspector-tabs button').nth(2).click();await openGroup('Rámutatás és fókusz');
  await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('hover');
  await editor.locator('[data-state-property="backgroundColor"] input[type=text]').fill('#dc143c');await editor.locator('[data-state-property="backgroundColor"] input[type=text]').press('Tab');
  await editor.locator('[data-state-property="backgroundImage"] select').selectOption('none');
  assert.equal(await node(editor,'button').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(220, 20, 60)');
  await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('focus-visible');
  await editor.locator('[data-state-property="backgroundColor"] input[type=text]').fill('#2563eb');await editor.locator('[data-state-property="backgroundColor"] input[type=text]').press('Tab');
  await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('none');
  await openGroup('Akadálymentesség és láthatóság');
  await editor.getByText('Képernyőolvasó elnevezés',{exact:true}).locator('..').locator('input').fill('Alkotói bemutatkozás megnyitása');await editor.getByText('Képernyőolvasó elnevezés',{exact:true}).locator('..').locator('input').press('Control+s');await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));assert.equal(posts.length,1,'Ctrl+S commits a focused advanced field without blur');
  await select('image');await editor.getByLabel('Kép szöveges leírása',{exact:true}).fill('Új képleírás');
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'Új képleírás');
  await editor.getByLabel('Kép illesztése',{exact:true}).selectOption('cover');assert.equal(await node(editor,'image').locator('img').evaluate(el=>getComputedStyle(el).objectFit),'cover');
  const setCrop=async(label,value,index=0)=>editor.getByLabel(label,{exact:true}).nth(index).evaluate((input,next)=>{input.value=String(next);input.dispatchEvent(new Event('input',{bubbles:true}))},value);
  await setCrop('Kivágás vízszintesen',18);await setCrop('Kivágás függőlegesen',82);
  assert.equal(await node(editor,'image').locator('img').evaluate(el=>getComputedStyle(el).objectPosition),'18% 82%');
  await editor.locator('.editor-media-picker').getByRole('button',{name:'Médiatár megnyitása'}).click();
  await editor.locator('.editor-media-choice').click();
  await editor.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] img`)?.getAttribute('src')==='/api/admin/media?id=6b1c2e65-e46e-4764-b234-123456789abc',ids.image);
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'Új képleírás','choosing an asset preserves a manually written alt');
  await editor.getByLabel('Kép szöveges leírása',{exact:true}).fill('');
  await editor.locator('[data-content-key="assetId"]').getByRole('button',{name:'Médiatár megnyitása'}).click();
  await editor.locator('[data-content-key="assetId"] .editor-media-choice').click();
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'Márkajel','empty image alt adopts the Media library description');
  assert.equal(await editor.locator('.content-range-value').first().textContent(),'18%');
  await editor.getByLabel('Külső média címe',{exact:true}).fill('javascript:alert(1)');assert.equal(await editor.locator('[aria-invalid=true]').count(),1);
  await editor.getByLabel('Külső média címe',{exact:true}).fill('/fixture.svg');
  await select('gallery');await setCrop('Kivágás vízszintesen',24);await setCrop('Kivágás függőlegesen',68);
  assert.equal(await node(editor,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectPosition),'24% 68%','repeater image crop edits the selected gallery item');
  const galleryItem=editor.locator('.content-repeater fieldset').first();
  await galleryItem.getByLabel('Képleírás',{exact:true}).fill('');
  await galleryItem.getByRole('button',{name:'Médiatár megnyitása'}).click();await galleryItem.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'gallery').locator('img').first().getAttribute('alt'),'Márkajel','gallery item inherits metadata only when its own alt is empty');
  assert.equal(await node(editor,'gallery').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/api/admin/media?id='+assetId,'canvas zoom uses the selected private asset');
  await select('carousel');
  await editor.getByLabel('Galéria elnevezése',{exact:true}).fill('Képes történeteim & fotók');
  const carouselRegion=node(editor,'carousel').locator('.creator-carousel[role="region"]');
  assert.equal(await carouselRegion.getAttribute('aria-label'),'Képes történeteim & fotók',
    'Inspector name must be exposed on the actual keyboard-focusable canvas carousel');
  const carouselItem=editor.locator('.content-repeater fieldset').first();
  await carouselItem.getByRole('button',{name:'Médiatár megnyitása'}).click();await carouselItem.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'carousel').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/api/admin/media?id='+assetId);
  assert.equal(await node(editor,'carousel').locator('img').first().getAttribute('alt'),'Első dia','a manually written carousel alt is preserved');
  await select('video');
  assert.equal(await node(editor,'video').locator('video').getAttribute('poster'),'/fixture.svg','existing cover URL remains unchanged until selection');
  const posterPicker=editor.locator('[data-content-key="posterAssetId"]');
  await posterPicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await posterPicker.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'video').locator('video').getAttribute('poster'),'/api/admin/media?id='+assetId,'Editor video poster uses authenticated preview');
  assert.equal(await node(editor,'video').locator('video').getAttribute('src'),'/fixture.webm','choosing a cover does not change video source');
  await select('list');const texts=editor.locator('.content-repeater textarea');await texts.first().fill('Átírt listaelem');
  await editor.getByRole('button',{name:'1. elem: Le',exact:true}).click();assert.match(await node(editor,'list').locator('ol').textContent(),/^Második elem/);
  assert.equal(posts.length,1);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));assert.equal(posts.at(-1).publish,false);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.video].props.posterAssetId,assetId,'Save retains poster ID as draft only');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.video].props.src,'/fixture.webm','video source is not overwritten by image picker');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.image].props.assetId,assetId,'Save persists the site asset reference but never publishes it');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.items[0].assetId,assetId);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.button].responsive.desktop.backgroundAssetId,assetId,'Save stores the background asset ID');
  await live.goto(base+'/p/test');assert.equal(await live.locator('h1[data-node-id]').textContent(),'Alkotói főcím');
  assert.equal(await node(live,'video').locator('video').getAttribute('poster'),'/fixture.svg','Save never publishes the newly chosen poster');
  assert.equal(await node(live,'gallery').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/fixture.svg','Save does not publish the new gallery image');
  assert.equal(await node(live,'carousel').locator('.creator-carousel').getAttribute('aria-label'),'Alkotói galéria',
    'a newly named carousel is still draft-only after Save');
  assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),'none','draft background stays private before Publish');
  assert.equal(await node(live,'image').locator('img').evaluate(el=>getComputedStyle(el).objectPosition),'50% 50%','Save does not publish image crop');
  await editor.reload();await select('heading');assert.equal(await editor.getByLabel('Címsor szemantikai szintje',{exact:true}).inputValue(),'3');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');await live.reload();
  assert.equal(await node(live,'video').locator('video').getAttribute('poster'),'/media/'+assetId,'Publish uses guarded site image route for poster');
  assert.equal(await node(live,'video').locator('video').getAttribute('src'),'/fixture.webm','original video playback URL survives Publish');
  assert.equal(await node(live,'image').locator('img').getAttribute('src'),'/media/'+assetId,'published content resolves the public media route');
  assert.equal(await live.locator(`h3[data-node-id="${ids.heading}"]`).textContent(),'Módosított főcím');
  assert.equal(await node(live,'button').getAttribute('href'),'/p/home');assert.equal(await node(live,'button').getAttribute('rel'),'noopener noreferrer');
  assert.equal(await node(live,'button').getAttribute('aria-label'),'Alkotói bemutatkozás megnyitása');
  assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\/6b1c2e65-e46e-4764-b234-123456789abc/,'Publish serves the background through the guarded public route');
  assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundPosition),/^50% 0%/);
  await node(live,'button').hover();await live.waitForFunction(id=>getComputedStyle(document.querySelector(`[data-node-id="${id}"]`)).backgroundColor==='rgb(220, 20, 60)',ids.button);
  assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
  await live.keyboard.press('Tab');await node(live,'button').focus();await live.waitForFunction(id=>getComputedStyle(document.querySelector(`[data-node-id="${id}"]`)).backgroundColor==='rgb(37, 99, 235)',ids.button);
  assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).rotate),'3deg');
  await live.emulateMedia({reducedMotion:'reduce'});assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  assert.equal(await node(live,'image').locator('img').getAttribute('alt'),'Márkajel');assert.equal(await node(live,'image').locator('img').evaluate(el=>getComputedStyle(el).objectPosition),'18% 82%');assert.equal(await node(live,'image').locator('figcaption').textContent(),'Képaláírás');
  assert.equal(await node(live,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectPosition),'24% 68%','published gallery item retains its independent crop');
  assert.equal(await node(live,'carousel').getByRole('region',{name:'Képes történeteim & fotók'}).count(),1,
    'published carousel region inherits the exact accessible Inspector name');
  assert.equal(await node(live,'table').locator('th[scope=col]').count(),2);assert.equal(await node(live,'video').locator('video[controls]').count(),1);assert.equal(await node(live,'audio').locator('audio[controls]').count(),1);
  for(const type of ['video','audio']){const playback=await node(live,type).locator(type).evaluate(async media=>{if(media.readyState<1)await new Promise((resolve,reject)=>{media.addEventListener('loadedmetadata',resolve,{once:true});media.addEventListener('error',reject,{once:true})});media.muted=true;await media.play();const result={playing:!media.paused,duration:media.duration,readyState:media.readyState};media.pause();return result});assert.equal(playback.playing,true);assert.ok(playback.duration>0);assert.ok(playback.readyState>=2)}
  assert.equal(await node(live,'code').locator('script').count(),0);assert.match(await node(live,'code').locator('code').textContent(),/<script>/);
  await node(live,'tabs').getByRole('tab',{name:'Bemutatkozás',exact:true}).click();assert.equal(await node(live,'tabs').getByRole('tabpanel').textContent(),'Személyes történet');
  await node(live,'tabs').getByRole('tab',{name:'Bemutatkozás',exact:true}).press('Home');assert.equal(await node(live,'tabs').getByRole('tabpanel').textContent(),'Videólista');
  await node(live,'accordion').locator('summary').click();assert.equal(await node(live,'accordion').locator('details').evaluate(el=>el.open),true);
  await node(live,'dropdown').locator('summary').click();assert.equal(await node(live,'dropdown').locator('details').evaluate(el=>el.open),true);
  await node(live,'carousel').getByRole('button',{name:'Következő kép',exact:true}).click();await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft>0,ids.carousel);
  assert.equal(await node(live,'gallery').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/media/'+assetId);
  assert.equal(await node(live,'carousel').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/media/'+assetId);
  await node(live,'gallery').locator('.creator-image-zoom').first().click();await live.getByRole('dialog',{name:'Kép előnézete'}).waitFor();assert.equal(await live.locator('dialog.creator-lightbox img').getAttribute('src'),'/media/'+assetId,'lightbox renders the same published asset as the thumbnail');await live.keyboard.press('Escape');await live.locator('dialog.creator-lightbox').waitFor({state:'detached'});assert.equal(await live.getByRole('dialog').count(),0);assert.equal(await node(live,'gallery').locator('.creator-image-zoom').first().evaluate(el=>document.activeElement===el),true);
  await node(live,'tooltip').locator('button').focus();assert.equal(await node(live,'tooltip').getByRole('tooltip').isVisible(),true);
  for(const width of [1366,768,390]){
    await live.setViewportSize({width,height:900});await live.reload();await node(live,'gallery').waitFor();
    assert.ok(await live.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'modern root does not inherit a narrower legacy template or horizontal overflow');
    const keyboardCarousel=node(live,'carousel').getByRole('region',{name:'Képes történeteim & fotók'});
    await keyboardCarousel.focus();
    await keyboardCarousel.press('ArrowRight');
    await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft>0,ids.carousel);
    await keyboardCarousel.press('Home');
    await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft===0,ids.carousel);
    await keyboardCarousel.press('End');
    await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft>0,ids.carousel);
    await keyboardCarousel.press('ArrowLeft');
    await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft===0,ids.carousel);
    assert.equal(await keyboardCarousel.evaluate(el=>document.activeElement===el),true,
      `arrow and Home/End carousel controls preserve focused region at ${width}px`);
    const expected=width<=700?1:width<=900?2:3;assert.equal((await node(live,'gallery').locator('.creator-gallery').evaluate(el=>getComputedStyle(el).gridTemplateColumns)).split(' ').length,expected);
    for(const type of ['heading','text','button','image','quote']){
      await editor.locator(`.canvas-device-btn[data-device="${width<=700?'mobile':width<=900?'tablet':'desktop'}"]`).click();
      const metric=el=>{const css=getComputedStyle(el);return {fontSize:css.fontSize,lineHeight:css.lineHeight,color:css.color,padding:css.padding,borderRadius:css.borderRadius}};
      assert.deepEqual(await node(live,type).evaluate(metric),await node(editor,type).evaluate(metric),`${type}/${width} content parity`);
      if(type==='image')assert.equal(await node(live,type).locator('img').evaluate(el=>getComputedStyle(el).objectPosition),await node(editor,type).locator('img').evaluate(el=>getComputedStyle(el).objectPosition),`image crop parity/${width}`);
    }
    const backgroundMetric=el=>{const css=getComputedStyle(el);return {size:css.backgroundSize,position:css.backgroundPosition,repeat:css.backgroundRepeat}};
    assert.deepEqual(await node(live,'button').evaluate(backgroundMetric),await node(editor,'button').evaluate(backgroundMetric),`background image style parity/${width}`);
    assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\/6b1c2e65-e46e-4764-b234-123456789abc/,`published background survives ${width}px`);
  }
  for(const [device,width] of [['desktop',1440],['tablet',768],['mobile',390]]){await live.goto(base+'/p/test?preview=1&device='+device);await live.locator('.visual-root-authored').waitFor();assert.equal(await live.locator('.preview-frame').evaluate(el=>el.getBoundingClientRect().width),width,'preview uses the declared artboard width, even on a small outer viewport')}
  await select('button');await editor.locator('.inspector-tabs button').first().click();await openGroup('Háttér');
  await editor.locator('[data-property-id="background.image"]').getByRole('button',{name:'Kép eltávolítása'}).click();
  assert.doesNotMatch(await node(editor,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/api\/admin\/media/);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  await live.goto(base+'/p/test');assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\/6b1c2e65-e46e-4764-b234-123456789abc/,'Save does not remove the live background');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');await live.reload();
  assert.doesNotMatch(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\//,'Publish removes the background reference without removing the gradient');
  await live.setViewportSize({width:1366,height:900});await live.reload();
  assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\/6b1c2e65-e46e-4764-b234-123456789abc/,'desktop retains its image after mobile-only removal');
  await editor.setViewportSize({width:390,height:800});await select('image');await editor.screenshot({path:'/tmp/creator-ux-p0-content-mobile.png'});
  assert.deepEqual(errors,[]);
});
