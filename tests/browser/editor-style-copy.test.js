import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';

const root=resolve(import.meta.dirname,'../../public');

test('copy appearance between text elements preserves content and geometry through draft, responsive preview and Publish',async t=>{
  const original=createDocument();
  const pageId=original.activePageId;
  let draft=structuredClone(original),published=null,version=1;
  const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/test'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});

  const tab=await browser.newPage({viewport:{width:1366,height:900}});
  tab.setDefaultTimeout(7000);
  const errors=[];tab.on('pageerror',error=>errors.push(error.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await tab.locator('.rail-btn[data-tab="elements"]').click();
  await tab.locator('.element-group-title').filter({hasText:'Szöveg'}).click();
  await tab.locator('#elementList .element').filter({hasText:'Heading'}).click();
  const sourceId=await tab.locator('.node[data-node-id]').last().getAttribute('data-node-id');
  await tab.locator('#elementList .element').filter({hasText:'Szöveg'}).click();
  const targetId=await tab.locator('.node[data-node-id]').last().getAttribute('data-node-id');
  assert.notEqual(sourceId,targetId);
  await tab.locator('#openInspector').click();

  const ensureGroupOpen=async name=>{
    const title=tab.locator('.inspector-group-title').filter({hasText:name});
    await title.waitFor();
    const group=title.locator('..');
    if(!(await group.evaluate(el=>el.classList.contains('is-open'))))await title.click();
  };
  const editColor=async(id,value)=>{
    const field=tab.locator(`.typed-inspector-field[data-property-id="${id}"]`);
    await field.locator('input[type="text"]').fill(value);
    await field.locator('input[type="text"]').press('Tab');
  };
  const editDimension=async(id,value,unit='px')=>{
    const field=tab.locator(`.typed-inspector-field[data-property-id="${id}"]`);
    await field.locator('.dimension-controls select').selectOption(unit);
    await field.locator('input[type="number"]').fill(value);
    await field.locator('input[type="number"]').press('Tab');
  };

  await ensureGroupOpen('Geometria');
  await editDimension('size.width','360');
  await tab.locator(`.node[data-node-id="${sourceId}"]`).click();

  await ensureGroupOpen('Háttér');
  await editColor('background.color','#19375b');
  await ensureGroupOpen('Térközök');
  for(const [side,value] of [['Felül','12px'],['Jobb','20px'],['Alul','12px'],['Bal','20px']]){
    const field=tab.locator('.typed-inspector-field[data-property-id="spacing.padding"]');
    const input=field.getByRole('spinbutton',{name:`Belső térköz – ${side} értéke`});
    await input.fill(value.replace('px',''));await input.press('Tab');
  }
  await ensureGroupOpen('Szegély');
  await editDimension('border.width','2');
  const borderStyle=tab.locator('.typed-inspector-field[data-property-id="border.style"] select');
  await borderStyle.selectOption('solid');
  await editColor('border.color','#aabbcc');
  await ensureGroupOpen('Lekerekítés');
  await editDimension('radius.all','14');
  await ensureGroupOpen('Árnyék');
  await tab.locator('.typed-inspector-field[data-property-id="shadow.box"] select:not(.property-token-picker)').selectOption('0 2px 8px #0003');
  await ensureGroupOpen('Tipográfia');
  await editDimension('typography.fontSize','30');
  await tab.locator('.typed-inspector-field[data-property-id="typography.fontWeight"] select').selectOption('700');
  await tab.locator('.typed-inspector-field[data-property-id="typography.textTransform"] select').selectOption('uppercase');

  const originalCanvasColor=await tab.locator(`.node[data-node-id="${sourceId}"]`).evaluate(el=>getComputedStyle(el).backgroundColor);
  const invalidColor=tab.locator('.typed-inspector-field[data-property-id="background.color"] input[type="text"]');
  await invalidColor.fill('not-a-color');await invalidColor.press('Tab');
  assert.match(await tab.locator('.typed-inspector-field[data-property-id="background.color"] .property-validation').textContent(),/HEX/i);
  assert.equal(await tab.locator(`.node[data-node-id="${sourceId}"]`).evaluate(el=>getComputedStyle(el).backgroundColor),originalCanvasColor,'invalid color must not reach the model or canvas');
  await editColor('background.color','#19375b');

  await tab.locator('.canvas-device-btn[data-device="mobile"]').click();
  await ensureGroupOpen('Háttér');
  await editColor('background.color','#284e72');
  await ensureGroupOpen('Tipográfia');
  await editDimension('typography.fontSize','22');
  await tab.locator(`.node[data-node-id="${sourceId}"]`).click();
  await ensureGroupOpen('Háttér');
  const backgroundGroup=tab.locator('.inspector-group').filter({has:tab.locator('.typed-inspector-field[data-property-id="background.color"]')});
  const resetBackground=backgroundGroup.locator('button.property-reset');
  assert.equal(await resetBackground.count(),1,'a mobile-only value should offer a clear inheritance reset');
  await resetBackground.click();
  assert.equal(await tab.locator(`.node[data-node-id="${sourceId}"]`).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(25, 55, 91)');
  assert.match(await tab.locator('.typed-inspector-field[data-property-id="background.color"] label').textContent(),/örökölt/);
  await editColor('background.color','#284e72');
  await tab.getByRole('button',{name:'Megjelenés másolása'}).click();
  assert.match(await tab.locator('#saveStatus').textContent(),/Megjelenés másolva/);
  await tab.locator(`.node[data-node-id="${targetId}"]`).click();
  const paste=tab.getByRole('button',{name:'Másolt stílus alkalmazása'});
  assert.equal(await paste.isEnabled(),true);
  await paste.click();
  const readNode=async(id,key)=>tab.locator(`.node[data-node-id="${id}"]`).evaluate((el,property)=>getComputedStyle(el)[property],key);
  assert.equal(await readNode(targetId,'backgroundColor'),'rgb(40, 78, 114)');
  assert.equal(await readNode(targetId,'paddingTop'),'12px');
  assert.equal(await readNode(targetId,'paddingLeft'),'20px');
  assert.equal(await readNode(targetId,'borderWidth'),'2px');
  assert.equal(await readNode(targetId,'borderStyle'),'solid');
  assert.equal(await readNode(targetId,'borderColor'),'rgb(170, 187, 204)');
  assert.equal(await readNode(targetId,'borderRadius'),'14px');
  assert.equal(await readNode(targetId,'boxShadow'),'rgba(0, 0, 0, 0.2) 0px 2px 8px 0px');
  assert.equal(await readNode(targetId,'fontSize'),'22px');
  assert.equal(await readNode(targetId,'fontWeight'),'700');
  assert.equal(await readNode(targetId,'textTransform'),'uppercase');
  assert.equal(await readNode(targetId,'width'),'360px','copying appearance must preserve the target element geometry');

  await tab.locator('#undo').click();
  assert.notEqual(await readNode(targetId,'backgroundColor'),'rgb(40, 78, 114)');
  await tab.locator('#redo').click();
  assert.equal(await readNode(targetId,'backgroundColor'),'rgb(40, 78, 114)');
  await tab.setViewportSize({width:390,height:844});
  const actionBounds=await tab.locator('.style-copy-actions button').evaluateAll(buttons=>buttons.map(button=>{const rect=button.getBoundingClientRect();return {left:rect.left,right:rect.right,width:rect.width,height:rect.height}}));
  assert.equal(actionBounds.length,2);
  assert.ok(actionBounds.every(rect=>rect.width>=40&&rect.height>=44&&rect.left>=0&&rect.right<=390),'style actions must remain readable and tappable in the mobile Inspector');
  await tab.setViewportSize({width:1366,height:900});
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.equal(published,null,'draft Save must not publish copied styles');

  await tab.reload();
  await tab.locator(`.node[data-node-id="${targetId}"]`).waitFor();
  assert.equal(await readNode(targetId,'backgroundColor'),'rgb(25, 55, 91)');
  assert.equal(await readNode(targetId,'width'),'360px');
  await tab.locator('#publish').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true);

  const publicTab=await browser.newPage({viewport:{width:1366,height:900}});
  await publicTab.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  const publicText=publicTab.locator('.visual-text').filter({hasText:'Szöveg'});
  await publicText.waitFor();
  assert.equal(await publicText.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(25, 55, 91)');
  assert.equal(await publicText.evaluate(el=>getComputedStyle(el).paddingLeft),'20px');
  assert.equal(await publicText.evaluate(el=>getComputedStyle(el).fontSize),'30px');
  await publicTab.setViewportSize({width:390,height:844});
  await publicTab.waitForFunction(()=>getComputedStyle(document.querySelector('.visual-text')).backgroundColor==='rgb(40, 78, 114)');
  assert.equal(await publicText.evaluate(el=>getComputedStyle(el).fontSize),'22px');
  assert.equal(await publicText.evaluate(el=>getComputedStyle(el).paddingLeft),'20px','unmodified mobile spacing inherits the copied desktop value');
  assert.deepEqual(errors,[]);
});
