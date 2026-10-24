import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

// 77.44.7.A: exercise the real Inspector controls, not a duplicate warning mock.
test('Inspector publication warning navigates to required field and updates without blocking draft edits on desktop and mobile',async t=>{
 const publicRoot=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/')return res.end('<!doctype html><html><body><main id="host"></main></body></html>');
  const file=resolve(publicRoot,'.'+pathname);
  if(!file.startsWith(publicRoot+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.js':'text/javascript','.css':'text/css'}[extname(file)]||'text/plain');res.end(await readFile(file))}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 for(const width of [1366,390]){
  const page=await browser.newPage({viewport:{width,height:800}});
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.evaluate(async()=>{
   const {renderElementContentControls}=await import('/editor-v2/ui/element-content-controls.js');
   const node={type:'heading',name:'Főcím',props:{text:''},metadata:{contentVersion:1},locked:false};
   const panel=renderElementContentControls(node,{apply:patch=>{Object.assign(node.props,patch);return true},pending:()=>{}});
   document.querySelector('#host').append(panel);
   window.__draftNode=node;
  });
  const warning=page.locator('.editor-publication-warning');
  const jump=page.getByRole('button',{name:'Ugrás a mezőhöz'});
  const field=page.locator('[data-content-key="text"]');
  assert.match(await warning.textContent(),/A címsor nem lehet üres/);
  assert.equal(await field.evaluate(el=>el.classList.contains('editor-publication-required')),true);
  await jump.click();
  assert.equal(await field.locator('textarea').evaluate(el=>el===document.activeElement),true);
  await field.locator('textarea').fill('Kitöltött főcím');
  await page.waitForFunction(()=>document.querySelector('.editor-publication-warning').hidden);
  assert.equal(await jump.isHidden(),true);
  assert.equal(await field.evaluate(el=>el.classList.contains('editor-publication-required')),false);
  assert.equal(await page.evaluate(()=>window.__draftNode.props.text),'Kitöltött főcím');

  // The same warning must redirect to the *next* required field after an edit.
  await page.evaluate(async()=>{
   const {renderElementContentControls}=await import('/editor-v2/ui/element-content-controls.js');
   const node={type:'tooltip',name:'Magyarázat',props:{text:'',description:''},metadata:{contentVersion:1},locked:false};
   document.querySelector('#host').replaceChildren(renderElementContentControls(node,{
    apply:patch=>{Object.assign(node.props,patch);return true},pending:()=>{}
   }));
   window.__draftNode=node;
  });
  assert.match(await warning.textContent(),/Felirat és magyarázat/);
  assert.equal(await page.locator('[data-content-key="text"]').evaluate(el=>el.classList.contains('editor-publication-required')),true);
  await jump.click();
  const titleInput=page.locator('[data-content-key="text"] input');
  assert.equal(await titleInput.evaluate(el=>el===document.activeElement),true);
  await titleInput.fill('Rövid felirat');
  const description=page.locator('[data-content-key="description"] textarea');
  await page.waitForFunction(()=>document.querySelector('[data-content-key="description"]').classList.contains('editor-publication-required'));
  assert.equal(await jump.isVisible(),true);
  await jump.click();
  assert.equal(await description.evaluate(el=>el===document.activeElement),true);
  await description.fill('Részletes magyarázat');
  await page.waitForFunction(()=>document.querySelector('.editor-publication-warning').hidden);
  assert.equal(await jump.isHidden(),true);
  assert.equal(await page.locator('[aria-invalid="true"]').count(),0);
  assert.deepEqual(await page.evaluate(()=>window.__draftNode.props),{text:'Rövid felirat',description:'Részletes magyarázat'});

  assert.deepEqual(errors,[]);
  await page.close();
 }
});
