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
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  // Close browser connections before awaiting HTTP server shutdown.
  t.after(async()=>{await browser.close();await new Promise(resolve=>server.close(resolve))});
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
      root.innerHTML='<p>abc</p>';
      const textNode=root.querySelector('p').firstChild;
      const prior=document.createRange();prior.setStart(textNode,1);prior.collapse(true);
      native.removeAllRanges();native.addRange(prior);
      const staleOffset=restoreSelectionOffsets(root,{from:4,to:4});
      const staleRange=restoreSelectionOffsets(root,{from:2,to:5});
      const preserved=native.anchorNode===textNode&&native.anchorOffset===1;
      const validEnd=restoreSelectionOffsets(root,{from:3,to:3});
      const validEndOffset=native.anchorOffset;
      native.setBaseAndExtent(textNode,3,textNode,1);
      const backwardCaptured=getSelectionOffsets(root);
      const backwardRestored=restoreSelectionOffsets(root,backwardCaptured);
      const backwardPreserved=native.anchorOffset===3&&native.focusOffset===1;
      // Mobile WebKit may not expose Selection.setBaseAndExtent. Exercise the
      // standards-based collapse/extend fallback in the real browser too.
      const proto=Object.getPrototypeOf(native);
      const original=Object.getOwnPropertyDescriptor(proto,'setBaseAndExtent');
      Object.defineProperty(proto,'setBaseAndExtent',{configurable:true,writable:true,value:undefined});
      native.removeAllRanges();
      const fallbackRestored=restoreSelectionOffsets(root,backwardCaptured);
      const fallbackBackwardPreserved=native.anchorOffset===3&&native.focusOffset===1;
      if(original)Object.defineProperty(proto,'setBaseAndExtent',original);else delete proto.setBaseAndExtent;
      root.innerHTML='<p>North<br>South</p>';
      const south=root.querySelector('p').lastChild;
      const afterBreak=document.createRange();afterBreak.setStart(south,0);afterBreak.collapse(true);
      native.removeAllRanges();native.addRange(afterBreak);
      const newlineOffset=getSelectionOffsets(root);
      const restoredAfterBreak=restoreSelectionOffsets(root,{from:6,to:6});
      const roundtripAfterBreak=getSelectionOffsets(root);
      const beforeBreak=restoreSelectionOffsets(root,{from:5,to:5});
      const roundtripBeforeBreak=getSelectionOffsets(root);
      const invalidPastBreak=restoreSelectionOffsets(root,{from:12,to:12});
      root.remove();
      return {restored,caretInBlock,offsets,invalidNegative,invalidNoncollapsed,unchanged,staleOffset,staleRange,preserved,validEnd,validEndOffset,newlineOffset,restoredAfterBreak,roundtripAfterBreak,beforeBreak,roundtripBeforeBreak,invalidPastBreak,backwardCaptured,backwardRestored,backwardPreserved,fallbackRestored,fallbackBackwardPreserved};
    });
    assert.equal(result.restored,true);
    assert.equal(result.caretInBlock,true);
    assert.deepEqual(result.offsets,{from:0,to:0,collapsed:true});
    assert.equal(result.invalidNegative,false);
    assert.equal(result.invalidNoncollapsed,false);
    assert.equal(result.unchanged,true);
    assert.equal(result.staleOffset,false);
    assert.equal(result.staleRange,false);
    assert.equal(result.preserved,true);
    assert.equal(result.validEnd,true);
    assert.equal(result.validEndOffset,3);
    assert.deepEqual(result.backwardCaptured,{from:1,to:3,collapsed:false,backward:true});
    assert.equal(result.backwardRestored,true);
    assert.equal(result.backwardPreserved,true);
    assert.equal(result.fallbackRestored,true);
    assert.equal(result.fallbackBackwardPreserved,true);
    assert.deepEqual(result.newlineOffset,{from:6,to:6,collapsed:true});
    assert.equal(result.restoredAfterBreak,true);
    assert.deepEqual(result.roundtripAfterBreak,{from:6,to:6,collapsed:true});
    assert.equal(result.beforeBreak,true);
    assert.deepEqual(result.roundtripBeforeBreak,{from:5,to:5,collapsed:true});
    assert.equal(result.invalidPastBreak,false);
    await page.close();
  }
});
