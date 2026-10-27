import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(import.meta.dirname,'../../public');
test('Inspector Media picker reaches older images and keeps filtered pages distinct on mobile and desktop',async t=>{
  const id=index=>`00000000-0000-4000-8000-${String(index).padStart(12,'0')}`;
  const all=Array.from({length:120},(_,i)=>({id:id(119-i),name:`asset-${119-i}.png`,altText:`Picture ${119-i}`,
    mimeType:'image/png',createdAt:'2026-10-21 10:00:00',previewUrl:'/api/admin/media?id='+id(119-i)}));
  const requests=[];let failAudioPage=true,failTemporarySearch=true;
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/'){
      res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><body><div id="fixture"></div></body></html>');return;
    }
    if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id')){
      requests.push({method:req.method,before:url.searchParams.get('before'),q:url.searchParams.get('q'),mime:url.searchParams.get('mime')});
      if(url.searchParams.get('mime')==='video'){
        const videos=[
          {id:'unsupported-video',name:'unsupported.mp4',altText:'',mimeType:'video/mp4',previewUrl:'/media/unsupported-video'},
          {id:'supported-video',name:'supported.webm',altText:'',mimeType:'video/webm',previewUrl:'/media/supported-video'}
        ];
        const before=url.searchParams.get('before');
        const page=before?videos.slice(1):videos.slice(0,1);
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({ok:true,data:{assets:page,nextCursor:before?null:'unsupported-video'}}));return;
      }
      if(url.searchParams.get('mime')==='audio'){
        const before=url.searchParams.get('before');
        if(!before){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,data:{assets:[{id:'first-audio',name:'first.mp3',mimeType:'audio/mpeg',previewUrl:'/media/first-audio'}],nextCursor:'first-audio'}}));return;}
        if(failAudioPage){failAudioPage=false;res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:{message:'A következő Médiatár-oldal most nem érhető el.'}}));return;}
        res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,data:{assets:[{id:'older-audio',name:'older.mp3',mimeType:'audio/mpeg',previewUrl:'/media/older-audio'}],nextCursor:null}}));return;
      }
      const q=(url.searchParams.get('q')||'').toLowerCase();
      if(q==='temporary-error'&&failTemporarySearch){failTemporarySearch=false;res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:{message:'A Médiatár keresése átmenetileg nem érhető el.'}}));return;}
      if(q==='temporary-error'){
        res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,data:{assets:[{id:'recovered-search',name:'recovered.png',mimeType:'image/png',previewUrl:'/media/recovered-search'}],nextCursor:null}}));return;
      }
      const before=url.searchParams.get('before');
      const filtered=all.filter(x=>x.name.toLowerCase().includes(q));
      const start=before?filtered.findIndex(x=>x.id===before)+1:0;
      const offset=before&&start===0?filtered.length:start;
      const page=filtered.slice(offset,offset+50);
      const nextCursor=filtered.length>offset+50?page.at(-1).id:null;
      res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify({ok:true,data:{assets:page,nextCursor}}));return;
    }
    if(url.pathname==='/api/admin/media'&&url.searchParams.has('id')){
      res.setHeader('Content-Type','image/svg+xml');
      res.end('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="purple"/></svg>');return;
    }
    const file=resolve(root,'.'+url.pathname);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,1366]){
    failAudioPage=true;failTemporarySearch=true;
    const page=await browser.newPage({viewport:{width,height:850}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/');
    await page.evaluate(async()=>{
      const {mediaAssetPicker}=await import('/editor-v2/ui/element-content-controls.js');
      window.__choices=[];window.__outerEscapeCount=0;
      document.addEventListener('keydown',event=>{if(event.key==='Escape')window.__outerEscapeCount++});
      const picker=mediaAssetPicker('',(assetId,asset)=>{window.__choices.push({id:assetId,alt:asset?.altText||''});return true});
      document.getElementById('fixture').append(picker);
    });
    const picker=page.locator('.editor-media-picker'),choices=picker.locator('.editor-media-choice');
    await picker.getByRole('button',{name:'Médiatár megnyitása'}).click();
    await page.waitForFunction(()=>document.querySelectorAll('.editor-media-choice').length===50);
    assert.equal(await choices.count(),50,`initial page at ${width}px`);
    assert.equal(await picker.getByRole('region',{name:'Médiatár találatok'}).getAttribute('aria-busy'),'false',
      'loaded asset results expose a settled state to assistive technology');
    await picker.getByRole('button',{name:'További médiafájl betöltése'}).click();
    await page.waitForFunction(()=>document.querySelectorAll('.editor-media-choice').length===100);
    assert.equal(await choices.nth(50).evaluate(el=>document.activeElement===el),true,
      'load-more keyboard focus moves to first newly appended tile');
    await choices.nth(50).press('Tab');
    assert.equal(await choices.nth(51).evaluate(el=>document.activeElement===el),true,
      'Tab reaches another newly appended tile without moving backwards');
    await picker.getByRole('button',{name:'További médiafájl betöltése'}).click();
    await page.waitForFunction(()=>document.querySelectorAll('.editor-media-choice').length===120);
    assert.equal(await choices.nth(100).evaluate(el=>document.activeElement===el),true,
      'last page hides load-more only after focus has moved to a valid new tile');
    assert.equal(await picker.getByRole('button',{name:'További médiafájl betöltése'}).isVisible(),false);
    const unique=await choices.evaluateAll(elements=>new Set(elements.map(el=>el.getAttribute('aria-label'))).size);
    assert.equal(unique,120,'no duplicate choices across pages with matching timestamps');
    assert.equal(await choices.last().getAttribute('aria-label'),'asset-0.png kiválasztása','oldest image is reachable');
    await choices.last().press('Escape');
    assert.equal(await picker.getByRole('button',{name:'Médiatár megnyitása'}).evaluate(el=>document.activeElement===el),true,
      'Escape from an asset choice returns focus to the picker opener');
    assert.equal(await page.evaluate(()=>window.__outerEscapeCount),0,
      'Escape should not bubble to the global Editor mobile sheet handler');
    await picker.getByRole('button',{name:'Médiatár megnyitása'}).click();
    await page.waitForFunction(()=>document.querySelectorAll('.editor-media-choice').length===50);
    const search=picker.getByRole('searchbox',{name:'Keresés a Médiatárban'});
    await search.focus();await search.press('Escape');
    assert.equal(await picker.getByRole('button',{name:'Médiatár megnyitása'}).evaluate(el=>document.activeElement===el),true,
      'Escape from the search box closes the picker, preserving the Editor sheet');
    assert.equal(await page.evaluate(()=>window.__outerEscapeCount),0);
    await picker.getByRole('button',{name:'Médiatár megnyitása'}).click();
    await page.waitForFunction(()=>document.querySelectorAll('.editor-media-choice').length===50);
    await search.fill('asset-11');
    await page.waitForFunction(()=>document.querySelectorAll('.editor-media-choice').length===11);
    assert.match(await picker.locator('[role=status]').textContent(),/11 médiafájl betöltve a kereséshez/,
      'search result status explains that the count belongs to the active query');
    assert.equal(await picker.getByRole('button',{name:'További médiafájl betöltése'}).isVisible(),false);
    await picker.getByRole('button',{name:'asset-119.png kiválasztása'}).click();
    const results=await page.evaluate(()=>window.__choices);
    assert.deepEqual(results,[{id:id(119),alt:'Picture 119'}]);
    assert.equal(await picker.getByRole('button',{name:'Médiatár megnyitása'}).evaluate(el=>document.activeElement===el),true,
      'selection returns keyboard focus to the opener');
    assert.equal(await picker.locator('.editor-media-selected').getAttribute('src'),'/api/admin/media?id='+id(119));
    await picker.getByRole('button',{name:'Médiatár megnyitása'}).click();
    const searchStatus=picker.locator('[role="status"]');
    await search.fill('missing');
    await page.waitForFunction(()=>document.querySelector('.editor-media-current')?.getAttribute('aria-busy')==='false'&&document.querySelector('.editor-media-current')?.parentElement?.querySelector('[role="status"]')?.textContent.startsWith('Nincs találat.'));
    assert.equal(await searchStatus.textContent(),'Nincs találat. Tölts fel médiafájlt az Admin → Médiatár oldalon.',
      'an unrestricted image picker reports no search matches rather than an unsupported MIME type');
    await search.fill('temporary-error');
    await searchStatus.getByText('A Médiatár keresése átmenetileg nem érhető el.').waitFor();
    assert.equal(await picker.locator('[role="region"]').getAttribute('aria-busy'),'false');
    assert.equal(await picker.locator('.editor-media-choice').count(),0,'a failed new search clears old results');
    await search.fill('temporary-error');
    await picker.getByRole('button',{name:'recovered.png kiválasztása'}).waitFor();
    assert.equal(await picker.locator('[role="status"]').textContent(),'1 médiafájl betöltve a kereséshez',
      'a failed search can be retried without reopening the picker');
    await page.evaluate(async()=>{
      const {mediaAssetPicker}=await import('/editor-v2/ui/element-content-controls.js');
      window.__videoChoices=[];
      document.getElementById('fixture').append(mediaAssetPicker('',assetId=>{window.__videoChoices.push(assetId);return true},{mimes:['video/webm']}));
    });
    const videoPicker=page.locator('.editor-media-picker').nth(1);
    await videoPicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
    await page.waitForFunction(()=>document.querySelectorAll('.editor-media-picker')[1]?.querySelector('[role="region"]')?.getAttribute('aria-busy')==='false');
    assert.equal(await videoPicker.locator('.editor-media-choice').count(),0,'unsupported MIME files stay out of a type-restricted picker');
    assert.match(await videoPicker.locator('[role="status"]').textContent(),/nincs támogatott médiafájl.*további fájlokat/i,
      'an empty filtered page explains that more media can be loaded');
    await videoPicker.getByRole('button',{name:'További médiafájl betöltése'}).click();
    await videoPicker.getByRole('button',{name:'supported.webm kiválasztása'}).waitFor();
    assert.equal(await videoPicker.locator('[role="status"]').textContent(),'1 médiafájl betöltve',
      'the result count includes only visible files, not filtered-out MIME types');
    await videoPicker.getByRole('button',{name:'supported.webm kiválasztása'}).click();
    assert.deepEqual(await page.evaluate(()=>window.__videoChoices),['supported-video']);
    await page.evaluate(async()=>{
      const {mediaAssetPicker}=await import('/editor-v2/ui/element-content-controls.js');
      window.__audioChoices=[];
      document.getElementById('fixture').append(mediaAssetPicker('',assetId=>{window.__audioChoices.push(assetId);return true},{mimes:['audio/mpeg']}));
    });
    const audioPicker=page.locator('.editor-media-picker').nth(2),audioRegion=audioPicker.getByRole('region',{name:'Médiatár találatok'});
    await audioPicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
    await audioPicker.getByRole('button',{name:'first.mp3 kiválasztása'}).waitFor();
    await audioPicker.getByRole('button',{name:'További médiafájl betöltése'}).click();
    await page.getByText('A következő Médiatár-oldal most nem érhető el.').waitFor();
    assert.equal(await audioRegion.getAttribute('aria-busy'),'false','a failed page returns the result region to a settled state');
    assert.equal(await audioPicker.locator('.editor-media-choice').count(),1,'failed pagination preserves already loaded choices');
    const retry=audioPicker.getByRole('button',{name:'További médiafájl betöltése'});
    assert.equal(await retry.isEnabled(),true,'a failed cursor page remains retryable');
    assert.equal(await retry.evaluate(el=>document.activeElement===el),true,'failure returns focus to the retry control');
    await retry.click();
    await audioPicker.getByRole('button',{name:'older.mp3 kiválasztása'}).waitFor();
    assert.equal(await audioPicker.locator('.editor-media-choice').count(),2,'retry appends the missing page once');
    assert.equal(await audioPicker.getByRole('button',{name:'További médiafájl betöltése'}).isVisible(),false);
    await audioPicker.getByRole('button',{name:'older.mp3 kiválasztása'}).click();
    assert.deepEqual(await page.evaluate(()=>window.__audioChoices),['older-audio']);
    assert.deepEqual(errors,[],`no uncaught picker error at ${width}px`);
    await page.close();
  }
  assert.equal(requests.filter(x=>x.before!==null&&x.mime===null).length,4,'every image page 2 and 3 uses a cursor rather than repeating page 1');
  assert.ok(requests.every(x=>x.method==='GET'),'asset browsing never sends a Save, Publish or upload request');
});
