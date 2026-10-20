import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(import.meta.dirname,'../../public');
test('Rich Text selection restores an empty editable block without inventing text',async t=>{
  const server=createServer(async(req,res)=>{
    const pathname=new URL(req.url,'http://localhost').pathname;
    if(pathname==='/'){res.setHeader('content-type','text/html');res.end('<!doctype html><html><body></body></html>');return}
    const file=resolve(root,'.'+pathname);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.js':'text/javascript','.html':'text/html'}[extname(file)]||'text/plain');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(()=>browser.close());
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,1366]){
    const page=await browser.newPage({viewport:{width,height:800}});
    await page.goto(base+'/');
    const result=await page.evaluate(async()=>{
      const {restoreSelectionOffsets,getSelectionOffsets}=await import('/editor-v2/core/richtext-engine.js');
      const root=document.createElement('div');root.contentEditable='true';
      root.innerHTML='<p><br></p>';
      document.body.append(root);
      const restored=restoreSelectionOffsets(root,{from:0,to:0});
      const native=window.getSelection();
      const caretInBlock=native.rangeCount===1&&root.querySelector('p').contains(native.anchorNode);
      const offsets=getSelectionOffsets(root);
      const invalidNegative=restoreSelectionOffsets(root,{from:-1,to:0});
      const invalidNoncollapsed=restoreSelectionOffsets(root,{from:0,to:1});
      const unchanged=root.innerHTML==='<p><br></p>';
      root.remove();
      return {restored,caretInBlock,offsets,invalidNegative,invalidNoncollapsed,unchanged};
    });
    assert.equal(result.restored,true);
    assert.equal(result.caretInBlock,true);
    assert.deepEqual(result.offsets,{from:0,to:0,collapsed:true});
    assert.equal(result.invalidNegative,false);
    assert.equal(result.invalidNoncollapsed,false);
    assert.equal(result.unchanged,true);
    await page.close();
  }
});
