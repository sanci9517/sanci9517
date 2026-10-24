import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';

for(const width of [390,1366])test(`draft and live page paths remain readable at ${width}px`,async t=>{
 const document=createDocument(),id=document.activePageId,slug='new-'+ 'long-path-'.repeat(7)+'end',publishedSlug='old-'+ 'long-path-'.repeat(7)+'end';
 const root=resolve(import.meta.dirname,'../../public'),errors=[];
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({ok:true,data}));};
  if(url.pathname==='/api/admin/pages')return json(url.searchParams.has('archived')?[]:[{id,slug,publishedSlug,title:'URL test',content:document,isPublished:true,hasUnpublishedChanges:true,revision:1}]);
  if(url.pathname==='/api/admin/editor')return json({page:{id,document,publishedRevisionId:'r1'},revisions:[{id:'r1',version:1}]});
  if(url.pathname.startsWith('/api/'))return json({});
  const file=resolve(root,'.'+url.pathname);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const page=await browser.newPage({viewport:{width,height:900}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
 await page.locator('.page-paths').waitFor({state:'attached'});
 // Exercise the real responsive Pages panel without altering saved application data.
 await page.evaluate(()=>{document.querySelector('.workspace').classList.add('left-open');document.querySelector('#leftDock').classList.remove('closed');document.querySelector('[data-tab="pages"]')?.click();});
 const paths=page.locator('.page-paths');assert.equal(await paths.textContent(),`Piszkozat: /p/${slug} · Élő: /p/${publishedSlug}`);
 assert.equal(await paths.evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,'long paths wrap inside their control');
 assert.deepEqual(errors,[]);
});
