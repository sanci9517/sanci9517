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
  const requests=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/'){
      res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><body><div id="fixture"></div></body></html>');return;
    }
    if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id')){
      requests.push({method:req.method,before:url.searchParams.get('before'),q:url.searchParams.get('q')});
      const q=(url.searchParams.get('q')||'').toLowerCase();
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
    assert.deepEqual(errors,[],`no uncaught picker error at ${width}px`);
    await page.close();
  }
  assert.equal(requests.filter(x=>x.before!==null).length,4,'every page 2 and 3 uses a cursor rather than repeating page 1');
  assert.ok(requests.every(x=>x.method==='GET'),'asset browsing never sends a Save, Publish or upload request');
});
