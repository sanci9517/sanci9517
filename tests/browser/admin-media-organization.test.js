import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

test('Media organization UI creates scoped groups, assigns assets and filters without mobile overflow',async t=>{
 const root=resolve(import.meta.dirname,'../../public');
 const folders=[],tags=[{id:'tag-0001',name:'Stream'}],collections=[{id:'collection-1',name:'Klipek'}];
 const patches=[],queries=[];let nextId=1;
 const asset={id:'asset-0001',name:'cover.png',mimeType:'image/png',sizeBytes:321,altText:'',folderId:null,tagIds:[],collectionIds:[],archivedAt:null};
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  res.setHeader('content-type','application/json');
  if(url.pathname==='/api/admin/media'&&req.method==='GET'&&url.searchParams.get('retentionStatus')==='1')
   return res.end(JSON.stringify({ok:true,data:{migrationActive:true,requests:[],complete:true,permanentDeletionAuthorized:false}}));
  if(url.pathname==='/api/admin/media'&&url.searchParams.get('organization')==='1'){
   if(req.method==='GET')return res.end(JSON.stringify({ok:true,data:{folders,tags,collections}}));
   if(req.method==='POST'){
    let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw);
    const group={id:`${body.kind}-${nextId++}`,name:body.name};
    ({folder:folders,tag:tags,collection:collections})[body.kind].push(group);
    res.statusCode=201;return res.end(JSON.stringify({ok:true,data:{...group,kind:body.kind,assetCount:0}}));
   }
   if(req.method==='PATCH'){
    let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw);
    const group=({folder:folders,tag:tags,collection:collections})[body.kind].find(item=>item.id===body.id);
    if(!group){res.statusCode=404;return res.end(JSON.stringify({ok:false,error:{code:'MEDIA_ORGANIZATION_NOT_FOUND'}}));}
    group.name=body.name;return res.end(JSON.stringify({ok:true,data:{id:group.id,kind:body.kind,name:group.name}}));
   }
   if(req.method==='DELETE'){
    const kind=url.searchParams.get('kind'),id=url.searchParams.get('id');
    const list=({folder:folders,tag:tags,collection:collections})[kind],index=list.findIndex(item=>item.id===id);
    if(index<0){res.statusCode=404;return res.end(JSON.stringify({ok:false,error:{code:'MEDIA_ORGANIZATION_NOT_FOUND'}}));}
    list.splice(index,1);if(kind==='folder')asset.folderId=null;if(kind==='tag')asset.tagIds=[];if(kind==='collection')asset.collectionIds=[];
    return res.end(JSON.stringify({ok:true,data:{id,kind,deleted:true}}));
   }
  }
  if(url.pathname==='/api/admin/media'&&req.method==='GET'){
   queries.push(Object.fromEntries(url.searchParams));
   const included=(!url.searchParams.get('folderId')||url.searchParams.get('folderId')===asset.folderId||url.searchParams.get('folderId')==='root'&&!asset.folderId)&&(!url.searchParams.get('tagId')||asset.tagIds.includes(url.searchParams.get('tagId')))&&(!url.searchParams.get('collectionId')||asset.collectionIds.includes(url.searchParams.get('collectionId')));
   return res.end(JSON.stringify({ok:true,data:{assets:included?[asset]:[],nextCursor:null,quota:{usedBytes:asset.sizeBytes,activeBytes:asset.sizeBytes,archivedBytes:0,remainingBytes:5*1024**3-asset.sizeBytes},siteQuotaBytes:5*1024**3}}));
  }
  if(url.pathname==='/api/admin/media'&&req.method==='PATCH'){
   let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw);patches.push(body);Object.assign(asset,body);
   return res.end(JSON.stringify({ok:true,data:body}));
  }
  if(url.pathname==='/image.png'){res.setHeader('content-type','image/png');return res.end(Buffer.from([137,80,78,71,13,10,26,10]));}
  const file=resolve(root,'.'+url.pathname);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript'}[extname(file)]||'application/octet-stream');res.end(await readFile(file));}
  catch{return res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(5000);
 const pageErrors=[];page.on('pageerror',error=>pageErrors.push(error.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/admin-media.html`);
 await page.locator('.tile').waitFor();
 await page.getByLabel('Elem típusa').selectOption('folder');
 await page.getByLabel('Új név').fill('Adás borítók');
 await page.getByRole('button',{name:'Létrehozás'}).click();
 await page.getByText('Mappa létrehozva.').waitFor();
 const folder=folders[0];assert.equal(folder.name,'Adás borítók');
 await page.getByLabel('Mappa szűrő').selectOption(folder.id);
 await page.waitForFunction(()=>document.querySelector('#mediaListStatus')?.textContent==='Nincs találat.');
 await page.getByLabel('Mappa szűrő').selectOption({label:'Minden mappa'});
 assert.equal(await page.getByLabel('Mappa szűrő').inputValue(),'');
 await page.waitForFunction(()=>document.querySelector('#mediaListStatus')?.textContent.includes('1 médiafájl'));
 assert.ok(queries.at(-1)?.folderId===undefined,`clear folder filter should request all assets: ${JSON.stringify(queries.at(-1))}, ${await page.locator('#mediaListStatus').textContent()}`);
 await page.locator('.tile').waitFor();
 await page.getByLabel('cover.png mappája').selectOption(folder.id);
 await page.waitForFunction(()=>document.querySelector('#mediaListStatus')?.textContent.includes('1 médiafájl'));
 await page.getByLabel('cover.png címkéi').selectOption('tag-0001');
 await page.getByRole('button',{name:'Címkék mentése'}).click();
 await page.waitForTimeout(100);
 assert.equal(await page.locator('.media-organization-controls [role=status]').textContent(),'Mentve.');
 await page.getByLabel('cover.png gyűjteményei').selectOption('collection-1');
 await page.getByRole('button',{name:'Gyűjtemények mentése'}).click();
 await page.getByText('Mentve.',{exact:true}).waitFor();
 assert.deepEqual(patches,[{folderId:folder.id},{tagIds:['tag-0001']},{collectionIds:['collection-1']}]);
 await page.getByLabel('Gyűjtemény szűrő').selectOption('collection-1');
 await page.waitForFunction(()=>document.querySelector('#mediaListStatus')?.textContent.includes('1 médiafájl'));
 await page.getByLabel('Gyűjtemény szűrő').selectOption('');
 await page.waitForFunction(()=>document.querySelector('#mediaListStatus')?.textContent.includes('1 médiafájl'));
 await page.getByRole('button',{name:'Mappa átnevezése: Adás borítók'}).click();
 await page.getByLabel('Mappa új neve: Adás borítók').fill('Stream borítók');
 await page.getByRole('button',{name:'Név mentése'}).click();
 await page.getByText('Mappa átnevezve.').waitFor();
 await page.getByRole('button',{name:'Mappa törlése: Stream borítók'}).click();
 await page.getByRole('button',{name:'Mappa törlése: Stream borítók'}).click();
 await page.getByText('Mappa törölve; a fájlok megmaradtak.').waitFor();
 assert.equal(asset.folderId,null,'deleting a folder returns its media to root, without deleting the object');
 await page.getByRole('button',{name:'Címke átnevezése: Stream'}).click();
 await page.getByLabel('Címke új neve: Stream').fill('Élő adás');
 await page.getByRole('button',{name:'Név mentése'}).click();
 await page.getByText('Címke átnevezve.').waitFor();
 await page.getByRole('button',{name:'Címke törlése: Élő adás'}).click();
 await page.getByRole('button',{name:'Címke törlése: Élő adás'}).click();
 await page.getByText('Címke törölve; a fájlok megmaradtak.').waitFor();
 await page.getByRole('button',{name:'Gyűjtemény átnevezése: Klipek'}).click();
 await page.getByLabel('Gyűjtemény új neve: Klipek').fill('Klipválogatás');
 await page.getByRole('button',{name:'Név mentése'}).click();
 await page.getByText('Gyűjtemény átnevezve.').waitFor();
 await page.getByRole('button',{name:'Gyűjtemény törlése: Klipválogatás'}).click();
 await page.getByRole('button',{name:'Gyűjtemény törlése: Klipválogatás'}).click();
 await page.getByText('Gyűjtemény törölve; a fájlok megmaradtak.').waitFor();
 assert.equal(asset.collectionIds.length,0);
 assert.ok(queries.some(query=>query.folderId===folder.id));
 assert.ok(queries.some(query=>query.collectionId==='collection-1'));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'organization controls fit mobile view');
 await page.setViewportSize({width:1366,height:900});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'organization controls fit desktop view');
 assert.deepEqual(pageErrors,[],'organization controls run without uncaught browser errors');
});
