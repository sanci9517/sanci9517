import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

test('Admin media search and alt-text editing work on desktop and mobile without overflow',async t=>{
  const root=resolve(import.meta.dirname,'../../public'),patches=[],queries=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/api/admin/media'&&req.method==='GET'&&url.searchParams.has('usage')){
      res.setHeader('content-type','application/json');
      return res.end(JSON.stringify({ok:true,data:{assetId:url.searchParams.get('usage'),complete:true,references:[{pageId:'page-1',pageTitle:'Bemutatkozás',slug:'about',archived:false,source:'published',nodeId:'hero',nodeName:'Fő szakasz',path:'responsive.mobile.backgroundAssetId'},{pageId:'old',pageTitle:'Régi oldal',slug:'old',archived:true,source:'revision',version:2,nodeId:'photo',nodeName:'Kép',path:'props.assetId'}]}}));
    }
    if(url.pathname==='/api/admin/media'&&req.method==='GET'){
      queries.push(url.searchParams.get('q')||'');
      res.setHeader('content-type','application/json');
      return res.end(JSON.stringify({ok:true,data:{assets:[{id:'6b1c2e65-e46e-4764-b234-123456789abc',name:'creator portrait.png',mimeType:'image/png',sizeBytes:512,altText:'Régi leírás',previewUrl:'/image.png'}]}}));
    }
    if(url.pathname==='/api/admin/media'&&req.method==='PATCH'){
      let body='';for await(const chunk of req)body+=chunk;patches.push({id:url.searchParams.get('id'),body:JSON.parse(body)});
      res.setHeader('content-type','application/json');return res.end(JSON.stringify({ok:true,data:JSON.parse(body)}));
    }
    if(url.pathname==='/image.png'){res.setHeader('content-type','image/png');return res.end(Buffer.from([137,80,78,71,13,10,26,10]))}
    const file=resolve(root,'.'+url.pathname);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}catch{return res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(5000);
  await page.goto(`http://127.0.0.1:${server.address().port}/admin-media.html`);
  await page.locator('.tile').waitFor();
  await page.getByRole('searchbox',{name:'Keresés a képek között'}).fill('portrait');
  await page.waitForTimeout(300);
  await page.waitForFunction(()=>document.querySelector('#gallery .tile'));
  await page.locator('.tile input').fill('Alkotó félalakos portré');
  await page.getByRole('button',{name:'Leírás mentése'}).click();
  await page.getByText('Mentve',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Használati helyek'}).click();
  await page.getByRole('link',{name:/Publikált: Bemutatkozás/}).waitFor();
  assert.match(await page.locator('.media-usage').textContent(),/Korábbi verzió v2 · archivált/);
  assert.equal(await page.locator('.media-usage a').getAttribute('href'),'/editor-v2/index.html?pageId=page-1');
  assert.deepEqual(patches,[{id:'6b1c2e65-e46e-4764-b234-123456789abc',body:{altText:'Alkotó félalakos portré'}}]);
  assert.ok(queries.includes('portrait'));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile library must not create horizontal scrolling');
  await page.setViewportSize({width:1366,height:900});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'desktop library must not create horizontal scrolling');
});


test('Admin image upload supports real progress, explicit retry and cancellation without automatic duplicates',async t=>{
 const root=resolve(import.meta.dirname,'../../public');let uploads=0,saved=false;
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/admin/media'&&req.method==='GET'){
   res.setHeader('content-type','application/json');
   return res.end(JSON.stringify({ok:true,data:{assets:saved?[{id:'6b1c2e65-e46e-4764-b234-123456789abc',name:'portrait.png',sizeBytes:120,altText:'',previewUrl:'/image.png'}]:[]}}));
  }
  if(url.pathname==='/api/admin/media'&&req.method==='POST'){
   const name=url.searchParams.get('name');assert.ok(['portrait.png','cancel.png'].includes(name));
   const chunks=[];for await(const chunk of req)chunks.push(chunk);
   assert.ok(Buffer.concat(chunks).length>0);uploads++;
   res.setHeader('content-type','application/json');
   if(uploads===1){res.statusCode=503;return res.end(JSON.stringify({ok:false,error:{code:'MEDIA_STORAGE_FAILED'}}))}
   if(uploads===2){saved=true;res.statusCode=201;return res.end(JSON.stringify({ok:true,data:{id:'6b1c2e65-e46e-4764-b234-123456789abc'}}))}
   if(uploads===3){res.statusCode=200;return res.end(JSON.stringify({ok:true,data:{id:'6b1c2e65-e46e-4764-b234-123456789abc',duplicate:true}}))}
   return setTimeout(()=>{if(!res.destroyed){res.statusCode=201;res.end(JSON.stringify({ok:true,data:{id:'ignored-after-abort'}}))}},1800);
  }
  if(url.pathname==='/image.png'){res.setHeader('content-type','image/png');return res.end(Buffer.from([137,80,78,71,13,10,26,10]))}
  const file=resolve(root,'.'+url.pathname);
  if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
  catch{return res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(6000);
 await page.goto('http://127.0.0.1:'+server.address().port+'/admin-media.html');
 const file={name:'portrait.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l5sAAAAASUVORK5CYII=','base64')};
 await page.locator('#imageInput').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('not an image')});
 await page.getByRole('button',{name:'Feltöltés a médiatárba'}).click();
 await page.getByText(/PNG, JPG, GIF vagy WebP képet válassz/).waitFor();
 assert.equal(uploads,0,'unsupported files must not reach the server');
 await page.locator('#imageInput').setInputFiles(file);
 await page.getByRole('button',{name:'Feltöltés a médiatárba'}).click();
 await page.getByText(/A tárhely jelenleg nem elérhető/).waitFor();
 assert.equal(uploads,1,'failed upload sends one request only');
 assert.equal(await page.locator('#imageInput').evaluate(el=>el.files.length),1,'file stays selected for explicit retry');
 assert.equal(await page.locator('#uploadProgress').isVisible(),true);
 await page.getByRole('button',{name:'Feltöltés újrapróbálása'}).click();
 await page.getByText('A kép sikeresen bekerült a privát médiatárba.').waitFor();
 await page.locator('.tile').waitFor();
 assert.equal(uploads,2,'exactly one new request follows manual retry');
 assert.equal(await page.locator('#uploadProgress').evaluate(el=>el.value),100);
 assert.equal(await page.locator('#imageInput').evaluate(el=>el.files.length),0);
 assert.equal(await page.locator('#uploadRetry').isVisible(),false);
 await page.locator('#imageInput').setInputFiles(file);
 await page.getByRole('button',{name:'Feltöltés a médiatárba'}).click();
 await page.getByText(/Ez a kép már szerepel a Médiatárban/).waitFor();
 assert.equal(uploads,3,'duplicate response shows reuse, not a new success message');
 await page.locator('#imageInput').setInputFiles({...file,name:'cancel.png'});
 await page.getByRole('button',{name:'Feltöltés a médiatárba'}).click();
 await page.getByRole('button',{name:'Feltöltés megszakítása'}).click();
 await page.getByText(/A feltöltést megszakítottad/).waitFor();
 assert.equal(await page.locator('#uploadRetry').isVisible(),false,'cancel is not an automatic retry');
 assert.equal(await page.locator('#uploadButton').isEnabled(),true);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile upload controls do not overflow');
 await page.setViewportSize({width:1366,height:900});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'desktop upload controls do not overflow');
});


test('Media library archives only after confirmation and restores in mobile and desktop views',async t=>{
 const root=resolve(import.meta.dirname,'../../public');
 const id='6b1c2e65-e46e-4764-b234-123456789abc';
 let archived=false,used=true;
 const changes=[];
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/admin/media'&&req.method==='GET'&&url.searchParams.has('usage')){
   res.setHeader('content-type','application/json');
   return res.end(JSON.stringify({ok:true,data:{assetId:id,complete:true,references:used?[{pageId:'page-1',pageTitle:'Bemutatkozás',source:'draft',nodeName:'Kép',path:'props.assetId'}]:[]}}));
  }
  if(url.pathname==='/api/admin/media'&&req.method==='GET'){
   res.setHeader('content-type','application/json');
   const wanted=url.searchParams.get('state')||'active';
   return res.end(JSON.stringify({ok:true,data:{assets:(wanted==='archived')===archived?[{id,name:'portrait.png',sizeBytes:2048,altText:'Meglévő képleírás',archivedAt:archived?'2026-10-19':null,previewUrl:'/image.png'}]:[]}}));
  }
  if(url.pathname==='/api/admin/media'&&req.method==='PATCH'){
   let text='';for await(const part of req)text+=part;
   const body=JSON.parse(text);changes.push(body);
   res.setHeader('content-type','application/json');
   if(body.archived&&used){res.statusCode=409;return res.end(JSON.stringify({ok:false,error:{code:'MEDIA_ASSET_IN_USE'}}))}
   archived=body.archived;
   return res.end(JSON.stringify({ok:true,data:{id,archived,changed:true}}));
  }
  if(url.pathname==='/image.png'){res.setHeader('content-type','image/png');return res.end(Buffer.from([137,80,78,71,13,10,26,10]))}
  const file=resolve(root,'.'+url.pathname);
  if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
  catch{return res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(6000);
 await page.goto('http://127.0.0.1:'+server.address().port+'/admin-media.html');
 await page.locator('.tile').waitFor();
 const archive=page.getByRole('button',{name:'Kép archiválása'});
 await archive.click();
 assert.equal(changes.length,0,'first click must only arm, never archive');
 await page.getByRole('button',{name:'Archiválás megerősítése'}).click();
 await page.getByText(/A képre oldal vagy korábbi verzió hivatkozik/).waitFor();
 await page.getByRole('link',{name:/Piszkozat: Bemutatkozás/}).waitFor();
 assert.equal(archived,false,'a referenced image remains active');
 used=false;
 await page.getByRole('button',{name:'Kép archiválása'}).click();
 await page.getByRole('button',{name:'Archiválás megerősítése'}).click();
 await page.getByText('Még nincs feltöltött kép.').waitFor();
 assert.equal(archived,true);
 await page.getByLabel('Médiatár nézet').selectOption('archived');
 await page.locator('.tile').waitFor();
 assert.match(await page.locator('.tile').textContent(),/portrait.png/);
 await page.getByRole('button',{name:'Kép visszaállítása'}).click();
 await page.getByText('Nincs archivált kép.').waitFor();
 assert.equal(archived,false);
 await page.getByLabel('Médiatár nézet').selectOption('active');
 await page.locator('.tile').waitFor();
 assert.equal(await page.locator('.tile input').inputValue(),'Meglévő képleírás');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile lifecycle controls stay within viewport');
 await page.setViewportSize({width:1366,height:900});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'desktop lifecycle controls stay within viewport');
 assert.deepEqual(changes,[{archived:true},{archived:true},{archived:false}]);
});
