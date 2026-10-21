import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

test('Admin Media lists all active and archived assets, with keyboard paging and guarded lifecycle on mobile and desktop',async t=>{
  const root=resolve(import.meta.dirname,'../../public');
  const id=index=>`00000000-0000-4000-8000-${String(index).padStart(12,'0')}`;
  const active=Array.from({length:121},(_,i)=>({id:id(120-i),name:`asset-${120-i}.png`,altText:'',sizeBytes:128,archivedAt:null}));
  const archived=Array.from({length:64},(_,i)=>({id:id(400+63-i),name:`archived-${63-i}.png`,altText:'',sizeBytes:128,archivedAt:'2026-10-20'}));
  const requests=[],mutations=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),send=(result,status=200)=>{res.statusCode=status;res.setHeader('content-type','application/json');res.end(JSON.stringify(result))};
    if(url.pathname==='/api/admin/media' && req.method==='GET' && url.searchParams.has('usage')){
      return send({ok:true,data:{complete:true,references:[{pageId:'page-1',source:'published',nodeName:'Kép',path:'props.assetId',pageTitle:'Rólam'}]}});
    }
    if(url.pathname==='/api/admin/media' && req.method==='GET' && url.searchParams.has('id')){
      res.setHeader('content-type','image/svg+xml');return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="purple"/></svg>');
    }
    if(url.pathname==='/api/admin/media' && req.method==='GET'){
      const state=url.searchParams.get('state')||'active',q=url.searchParams.get('q')||'',before=url.searchParams.get('before');
      requests.push({state,q,before,limit:url.searchParams.get('limit')});
      const assets=(state==='archived'?archived:active).filter(asset=>asset.name.toLowerCase().includes(q.toLowerCase()));
      const start=before?assets.findIndex(asset=>asset.id===before)+1:0;
      const position=before&&start===0?assets.length:start;
      const page=assets.slice(position,position+50);
      const nextCursor=assets.length>position+50?page.at(-1).id:null;
      return send({ok:true,data:{assets:page,nextCursor,siteQuotaBytes:5_000_000_000,
        quota:{usedBytes:0,activeBytes:0,archivedBytes:0,remainingBytes:5_000_000_000}}});
    }
    if(url.pathname==='/api/admin/media'&&req.method==='PATCH'){
      let body='';for await(const chunk of req)body+=chunk;
      const data=JSON.parse(body),assetId=url.searchParams.get('id');
      mutations.push({assetId,data});
      if('archived' in data)return send({ok:false,error:{code:'MEDIA_ASSET_IN_USE'}},409);
      const asset=active.find(asset=>asset.id===assetId);
      if(asset)asset.altText=data.altText;
      return send({ok:true,data:{id:assetId,altText:data.altText}});
    }
    const file=resolve(root,'.'+url.pathname);
    if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  for(const width of [390,1366]){
    const page=await browser.newPage({viewport:{width,height:860}});page.setDefaultTimeout(6500);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:'+server.address().port+'/admin-media.html');
    const tiles=page.locator('#gallery .tile');
    await page.waitForFunction(()=>document.querySelectorAll('#gallery .tile').length===50);
    assert.equal(await page.getByRole('button',{name:'További képek betöltése'}).isVisible(),true);
    await page.getByRole('button',{name:'További képek betöltése'}).click();
    await page.waitForFunction(()=>document.querySelectorAll('#gallery .tile').length===100);
    assert.equal(await tiles.nth(50).locator('a').evaluate(el=>document.activeElement===el),true,
      'focus moves to the first newly loaded image');
    await tiles.nth(50).locator('a').press('Tab');
    assert.equal(await tiles.nth(50).locator('input').evaluate(el=>document.activeElement===el),true,
      'Tab moves into the newly appended image details');
    await page.getByRole('button',{name:'További képek betöltése'}).click();
    await page.waitForFunction(()=>document.querySelectorAll('#gallery .tile').length===121);
    assert.equal(await tiles.nth(100).locator('a').evaluate(el=>document.activeElement===el),true,
      'final page keeps valid keyboard focus when load-more hides');
    assert.equal(await page.getByRole('button',{name:'További képek betöltése'}).isVisible(),false);
    assert.equal(await tiles.last().locator('.name').textContent(),'asset-0.png');
    await tiles.last().getByRole('button',{name:'Használati helyek'}).click();
    await tiles.last().getByRole('link',{name:/Publikált: Rólam/}).waitFor();
    await tiles.last().getByRole('button',{name:'Kép archiválása'}).click();
    await tiles.last().getByRole('button',{name:'Archiválás megerősítése'}).click();
    await tiles.last().getByText(/A képre oldal vagy korábbi verzió hivatkozik/).waitFor();
    assert.equal(tiles&&await tiles.count(),121,'in-use old asset remains visible and not archived');
    await tiles.last().getByLabel('asset-0.png alternatív képleírása').fill('Régi kép');
    await tiles.last().getByRole('button',{name:'Leírás mentése'}).click();
    await tiles.last().getByText('Mentve',{exact:true}).waitFor();
    await page.getByLabel('Médiatár nézet').selectOption('archived');
    await page.waitForFunction(()=>document.querySelectorAll('#gallery .tile').length===50);
    await page.getByRole('button',{name:'További képek betöltése'}).click();
    await page.waitForFunction(()=>document.querySelectorAll('#gallery .tile').length===64);
    assert.equal(await tiles.last().locator('.name').textContent(),'archived-0.png');
    await page.getByRole('searchbox',{name:'Keresés a képek között'}).fill('archived-0');
    await page.waitForFunction(()=>document.querySelectorAll('#gallery .tile').length===1);
    assert.equal(await page.getByRole('button',{name:'További képek betöltése'}).isVisible(),false);
    assert.equal(await tiles.first().locator('.name').textContent(),'archived-0.png');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow at '+width);
    assert.deepEqual(errors,[]);
    await page.close();
  }
  assert.equal(mutations.filter(x=>x.data.archived===true).length,2,'archive remains a separate confirmed request');
  assert.equal(mutations.filter(x=>x.data.altText==='Régi kép').length,2,'old asset metadata is editable');
  assert.ok(requests.some(x=>x.before&&x.state==='active'));
  assert.ok(requests.some(x=>x.before&&x.state==='archived'));
  assert.ok(requests.every(x=>x.limit==='50'),'Admin uses the same stable Media API paging limit');
  assert.ok(!requests.some(x=>x.state==='active'&&x.q),'search and archive state never leak across filters');
});
