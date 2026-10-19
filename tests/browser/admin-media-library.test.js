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
  await page.locator('.tile button').click();
  await page.getByText('Mentve',{exact:true}).waitFor();
  assert.deepEqual(patches,[{id:'6b1c2e65-e46e-4764-b234-123456789abc',body:{altText:'Alkotó félalakos portré'}}]);
  assert.ok(queries.includes('portrait'));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile library must not create horizontal scrolling');
  await page.setViewportSize({width:1366,height:900});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'desktop library must not create horizontal scrolling');
});
