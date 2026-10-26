import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

// editor-sample.webm is a 619-byte, procedurally generated purple VP9 frame (ffmpeg lavfi color).
test('typed authored elements survive Inspector edits, reload and separate Publish with real accessible content and interactions',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId,rootId=activePage(state).rootId,ids={},assetId='6b1c2e65-e46e-4764-b234-123456789abc';
  execute(state,{type:'root.appearance.enable',payload:{nodeId:rootId}});
  execute(state,{type:'responsive.set',payload:{nodeId:rootId,device:'desktop',patch:{padding:'16px',color:'#182335',backgroundColor:'#ffffff'}}});
  const definitions={
    heading:{text:'Alkotói főcím',level:'1'},text:{text:'Egyedi szöveg'},button:{text:'Tovább',href:'/p/home',target:'_blank'},link:{text:'Kapcsolat',href:'mailto:creator@example.com'},
    quote:{text:'A kreativitás tanulható.',citation:'Egy alkotó'},badge:{text:'Új sorozat'},icon:{icon:'star',ariaLabel:'Kedvenc'},
    image:{src:'/fixture.svg',alt:'Tesztillusztráció',caption:'Képaláírás',fit:'contain',ratio:'1 / 1'},video:{src:'/fixture.webm',poster:'/fixture.svg',controls:true,muted:true},audio:{src:'/fixture.mp3',controls:true},
    list:{ordered:true,items:[{text:'Első hivatkozás',href:'/p/home'},{text:'Második elem'}]},table:{caption:'Eredmények',header:true,rows:[['Név','Érték'],['Nézők','42']]},
    tabs:{ariaLabel:'Eredeti fülek',items:[{title:'Videók',text:'Videólista'},{title:'Bemutatkozás',text:'Személyes történet'}]},accordion:{items:[{title:'Hogyan készült?',text:'A kulisszák mögött.'},{title:'Hol találom?',text:'A szerkesztőben.'}]},dropdown:{items:[{title:'További részletek',text:'Kiegészítés'},{title:'Másik rész',text:'Új információ'}]},
    gallery:{ariaLabel:'Eredeti képrács',columns:'3',items:[{src:'/fixture.svg',alt:'Első kép'},{src:'/fixture.svg',alt:'Második kép',caption:'Második képaláírás'}]},carousel:{ariaLabel:'Alkotói galéria',items:[{src:'/fixture.svg',alt:'Első dia'},{src:'/fixture.svg',alt:'Második dia'}]},
    code:{code:'<script>alert("Nem futok le")</script>',wrap:true},tooltip:{text:'Mi ez?',description:'Részletes magyarázat'},divider:{},spacer:{}
  };
  for(const [type,props] of Object.entries(definitions)){
    execute(state,{type:'element.add',payload:{type,parentId:rootId,name:type,style:{width:'320px',margin:'0 0 24px'}}});const id=state.selection.primaryId;ids[type]=id;
    execute(state,{type:'content.properties.set',payload:{nodeId:id,patch:props}});
  }
  let draft=structuredClone(state.document),published=structuredClone(state.document),version=1;const posts=[];
  const root=resolve(import.meta.dirname,'../../public');
  const video=await readFile(new URL('../fixtures/editor-sample.webm',import.meta.url));
  const audio=Buffer.alloc(44+4000);audio.write('RIFF',0);audio.writeUInt32LE(audio.length-8,4);audio.write('WAVEfmt ',8);audio.writeUInt32LE(16,16);audio.writeUInt16LE(1,20);audio.writeUInt16LE(1,22);audio.writeUInt32LE(8000,24);audio.writeUInt32LE(16000,28);audio.writeUInt16LE(2,32);audio.writeUInt16LE(16,34);audio.write('data',36);audio.writeUInt32LE(4000,40);

  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id'))return json({ok:true,data:{assets:[{id:assetId,name:'brand-mark.png',mimeType:'image/png',sizeBytes:128,altText:'Márkajel',previewUrl:'/api/admin/media?id='+assetId}]}});
    if(url.pathname==='/api/admin/media'&&url.searchParams.get('id')===assetId||url.pathname==='/media/'+assetId){res.setHeader('content-type','image/svg+xml');return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#7047eb"/></svg>')}
    if(url.pathname==='/fixture.svg'){res.setHeader('content-type','image/svg+xml');return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#7047eb"/></svg>')}
    if(url.pathname==='/fixture.webm'){res.setHeader('content-type','video/webm');return res.end(video)}if(url.pathname==='/fixture.mp3'){res.setHeader('content-type','audio/wav');return res.end(audio)}
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;if(request.publish)published=structuredClone(draft);return json({ok:true,data:{pageId,version,revisionId:'revision-'+version}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`,editor=await browser.newPage({viewport:{width:1366,height:900}}),live=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];
  editor.setDefaultTimeout(6000);live.setDefaultTimeout(6000);live.setDefaultNavigationTimeout(12000);editor.on('pageerror',e=>errors.push(e.message));live.on('pageerror',e=>errors.push(e.message));
  const node=(tab,type)=>tab.locator(`.creator-node[data-node-id="${ids[type]}"]`);
  const select=async type=>{await node(editor,type).evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();await editor.locator('.inspector-tabs button').nth(1).click()};
  await editor.goto(base+'/editor-v2/index.html');
  // Tie every visible authored field to the command and Page Model path that
  // actually receives its edit, including repeater child and table cell paths.
  for(const type of Object.keys(definitions)){
    await select(type);
    const fields=await editor.locator('.content-schema-field').evaluateAll((elements,type)=>elements.map(field=>{
      const repeater=field.closest('.content-repeater');
      const path=type==='table'&&field.dataset.contentKey==='rows'?'rows[][]':
        (repeater?repeater.dataset.contentKey+'[].':'')+field.dataset.contentKey;
      return {key:field.dataset.inspectorKey,command:field.dataset.inspectorCommand,expected:'props.'+path};
    }),type);
    for(const field of fields){
      assert.equal(field.command,'content.properties.set',`${type}/${field.expected} command`);
      assert.equal(field.key,field.expected,`${type} field route`);
    }
    const table=editor.locator('.content-schema-field[data-content-key="rows"]');
    if(type==='table'){
      assert.equal(await table.getAttribute('data-inspector-command'),'content.properties.set');
      assert.equal(await table.getAttribute('data-inspector-key'),'props.rows[][]','table cells map to nested row/cell values');
    }
    const repeater=editor.locator('.content-repeater');
    if(await repeater.count()){
      const collection=repeater.getAttribute('data-content-key');
      assert.equal(await repeater.getAttribute('data-inspector-command'),'content.properties.set');
      assert.equal(await repeater.getAttribute('data-inspector-key'),`props.${await collection}`);
      for(const action of await repeater.locator('.content-repeater-actions button, :scope > button').all()){
        assert.equal(await action.getAttribute('data-inspector-command'),'content.properties.set',`${type}/${await action.getAttribute('aria-label')||await action.textContent()} action route`);
        assert.equal(await action.getAttribute('data-inspector-key'),`props.${await collection}`);
      }
    }
  }
  await select('heading');
  await editor.getByLabel('Címsor szemantikai szintje',{exact:true}).selectOption('3');
  assert.equal(await node(editor,'heading').evaluate(el=>getComputedStyle(el).fontSize),'28px');
  const plainHeading=editor.getByRole('textbox',{name:'Szöveg tartalma',exact:true});
  await plainHeading.fill('');
  await editor.waitForFunction(()=>document.querySelector('.editor-publication-warning')?.textContent.includes('A címsor nem lehet üres'));
  assert.equal(await editor.locator('.plain-text-content').evaluate(el=>el.classList.contains('editor-publication-required')),true);
  const headingJump=editor.getByRole('button',{name:'Ugrás a mezőhöz'});
  await headingJump.click();
  assert.equal(await plainHeading.evaluate(el=>el===document.activeElement),true,'jump focuses separately mounted heading text control');
  await plainHeading.fill('Módosított főcím');
  await editor.waitForFunction(()=>document.querySelector('.editor-publication-warning')?.hidden===true);
  assert.equal(await headingJump.isHidden(),true);
  assert.equal(await editor.locator('.plain-text-content').evaluate(el=>el.classList.contains('editor-publication-required')),false);
  await select('button');await editor.locator('.inspector-tabs button').first().click();
  const openGroup=async name=>{const title=editor.locator('.inspector-group-title').filter({has:editor.getByText(name,{exact:true})});if(await title.getAttribute('aria-expanded')==='false')await title.click()};
  await openGroup('Animáció');const transition=editor.locator('[data-property-id="animation.transition"]');assert.equal(await transition.getAttribute('data-property-command'),'responsive.set');assert.equal(await transition.getAttribute('data-property-key'),'transition');await transition.locator('select').selectOption('all 180ms ease');
  await openGroup('Transzformáció');const rotation=editor.locator('[data-property-id="transform.rotate"]');assert.equal(await rotation.getAttribute('data-property-command'),'responsive.set');assert.equal(await rotation.getAttribute('data-property-key'),'rotate');await rotation.locator('input').fill('3');await rotation.locator('input').press('Tab');
  await openGroup('Háttér');const gradient=editor.locator('[data-property-id="background.gradient"]');assert.equal(await gradient.getAttribute('data-property-command'),'responsive.set');assert.equal(await gradient.getAttribute('data-property-key'),'backgroundImage');await gradient.locator('select').selectOption('linear-gradient(135deg, #7047eb 0%, #17b8a6 100%)');
  const backgroundAsset=editor.locator('[data-property-id="background.image"]');assert.equal(await backgroundAsset.getAttribute('data-property-command'),'responsive.set');assert.equal(await backgroundAsset.getAttribute('data-property-key'),'backgroundAssetId');
  await backgroundAsset.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await backgroundAsset.locator('.editor-media-choice').click();
  await editor.locator('[data-property-id="background.size"] select').selectOption('cover');
  await editor.locator('[data-property-id="background.position"] select').selectOption('center top');
  assert.match(await node(editor,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/api\/admin\/media\?id=/,'canvas uses authenticated background preview');
  await editor.locator('.inspector-tabs button').nth(1).click();
  const buttonHref=editor.locator('[data-content-key="href"] input');
  await buttonHref.fill('/p/updated');
  assert.equal(await buttonHref.inputValue(),'/p/updated','the content Inspector retains the edited link');
  await editor.locator('#undo').click();assert.equal(await editor.locator('[data-content-key="href"] input').inputValue(),'/p/home','Undo restores the previous link');
  await editor.locator('#redo').click();assert.equal(await editor.locator('[data-content-key="href"] input').inputValue(),'/p/updated','Redo restores the selected link');
  await editor.locator('.inspector-tabs button').first().click();
  await editor.locator('.inspector-tabs button').nth(2).click();await openGroup('Rámutatás és fókusz');
  await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('hover');
  const hoverColor=editor.locator('[data-state-property="backgroundColor"]');assert.equal(await hoverColor.getAttribute('data-property-command'),'states.set');assert.equal(await hoverColor.getAttribute('data-property-key'),'backgroundColor');
  await hoverColor.locator('input[type=text]').fill('#dc143c');await hoverColor.locator('input[type=text]').press('Tab');
  const hoverGradient=editor.locator('[data-state-property="backgroundImage"]');assert.equal(await hoverGradient.getAttribute('data-property-command'),'states.set');assert.equal(await hoverGradient.getAttribute('data-property-key'),'backgroundImage');await hoverGradient.locator('select').selectOption('none');
  assert.equal(await node(editor,'button').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(220, 20, 60)');
  await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('focus-visible');
  await editor.locator('[data-state-property="backgroundColor"] input[type=text]').fill('#2563eb');await editor.locator('[data-state-property="backgroundColor"] input[type=text]').press('Tab');
  await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('none');
  await openGroup('Akadálymentesség és láthatóság');
  await editor.getByText('Képernyőolvasó elnevezés',{exact:true}).locator('..').locator('input').fill('Alkotói bemutatkozás megnyitása');await editor.getByText('Képernyőolvasó elnevezés',{exact:true}).locator('..').locator('input').press('Control+s');await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));assert.equal(posts.length,1,'Ctrl+S commits a focused advanced field without blur');
  await select('image');await editor.getByLabel('Kép szöveges leírása',{exact:true}).fill('Új képleírás');
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'Új képleírás');
  await editor.getByLabel('Kép illesztése',{exact:true}).selectOption('cover');assert.equal(await node(editor,'image').locator('img').evaluate(el=>getComputedStyle(el).objectFit),'cover');
  const setCrop=async(label,value,index=0)=>editor.getByLabel(label,{exact:true}).nth(index).evaluate((input,next)=>{input.value=String(next);input.dispatchEvent(new Event('input',{bubbles:true}))},value);
  await setCrop('Kivágás vízszintesen',18);await setCrop('Kivágás függőlegesen',82);
  assert.equal(await node(editor,'image').locator('img').evaluate(el=>getComputedStyle(el).objectPosition),'18% 82%');
  await editor.locator('.editor-media-picker').getByRole('button',{name:'Médiatár megnyitása'}).click();
  await editor.locator('.editor-media-choice').click();
  await editor.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] img`)?.getAttribute('src')==='/api/admin/media?id=6b1c2e65-e46e-4764-b234-123456789abc',ids.image);
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'Új képleírás','choosing an asset preserves a manually written alt');
  await editor.getByLabel('Kép szöveges leírása',{exact:true}).fill('');
  await editor.locator('[data-content-key="assetId"]').getByRole('button',{name:'Médiatár megnyitása'}).click();
  await editor.locator('[data-content-key="assetId"] .editor-media-choice').click();
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'Márkajel','empty image alt adopts the Media library description');
  assert.equal(await editor.locator('.content-range-value').first().textContent(),'18%');
  await editor.getByLabel('Külső média címe',{exact:true}).fill('javascript:alert(1)');assert.equal(await editor.locator('[aria-invalid=true]').count(),1);
  await editor.getByLabel('Külső média címe',{exact:true}).fill('/fixture.svg');
  assert.equal(await node(editor,'image').locator('img').getAttribute('src'),'/fixture.svg','a valid handwritten URL replaces the prior asset');
  assert.equal(await editor.locator('[data-content-key="assetId"] .editor-media-selected').count(),0);
  // Choose the library image explicitly again for the publication checks below.
  await editor.locator('[data-content-key="assetId"]').getByRole('button',{name:'Médiatár megnyitása'}).click();
  await editor.locator('[data-content-key="assetId"] .editor-media-choice').click();
  await select('tabs');
  await node(editor,'tabs').getByRole('tab',{name:'Bemutatkozás',exact:true}).click();
  assert.equal(await node(editor,'tabs').getByRole('tab',{name:'Bemutatkozás',exact:true}).getAttribute('aria-selected'),'true');
  await editor.getByLabel('Fülcsoport elnevezése',{exact:true}).fill('Bemutatkozás & videók');
  assert.equal(await node(editor,'tabs').getByRole('tab',{name:'Bemutatkozás',exact:true}).getAttribute('aria-selected'),'true',
    'typing in the Inspector keeps the selected Canvas tab instead of resetting to the first');
  assert.equal(await node(editor,'tabs').getByRole('tabpanel').last().isVisible(),true,
    'the previously selected panel remains visible after Canvas re-render');
  assert.equal(await node(editor,'tabs').getByRole('tablist',{name:'Bemutatkozás & videók'}).count(),1,
    'the real Canvas tablist inherits the Inspector name');
  // Reordering the Inspector repeater must move the selected *item*, not leave
  // a stale selected index pointing at the old position.
  await editor.locator('.content-repeater').getByRole('button',{name:'2. elem: Fel'}).press('Enter');
  assert.equal(await node(editor,'tabs').getByRole('tab').first().textContent(),'Bemutatkozás');
  assert.equal(await node(editor,'tabs').getByRole('tab').first().getAttribute('aria-selected'),'true',
    'Canvas selection follows the moved tab item');
  assert.equal(await node(editor,'tabs').getByRole('tabpanel').first().isVisible(),true);
  await editor.waitForFunction(()=>document.activeElement?.textContent==='Le'&&
    document.activeElement?.getAttribute('aria-label')==='1. elem: Le');
  await editor.locator('.content-repeater').getByRole('button',{name:'1. elem: Le'}).press('Enter');
  assert.equal(await node(editor,'tabs').getByRole('tab').last().getAttribute('aria-selected'),'true',
    'moving the tab back keeps the same content selected');
  const countBeforeStructuralEdit=posts.length;
  const tabRepeater=editor.locator('.content-repeater');
  await tabRepeater.getByRole('button',{name:'Fülek hozzáadása'}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Fül címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='3. elem');
  assert.equal(await tabRepeater.locator('fieldset').count(),3,'Add creates an editable third row');
  await tabRepeater.locator('fieldset').nth(2).getByLabel('Fül címe').fill('Próba fül');
  await tabRepeater.locator('fieldset').nth(2).getByLabel('Szöveg').fill('Próba tartalom');
  assert.equal(await node(editor,'tabs').getByRole('tab',{name:'Próba fül'}).count(),1);
  await tabRepeater.getByRole('button',{name:'3. elem: Fel'}).press('Enter');
  assert.equal(await node(editor,'tabs').getByRole('tab').nth(1).textContent(),'Próba fül');
  await node(editor,'tabs').getByRole('tab',{name:'Próba fül'}).click();
  await tabRepeater.getByRole('button',{name:'2. elem: Eltávolítás'}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Fül címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='2. elem');
  assert.equal(await tabRepeater.locator('fieldset').count(),2,'Delete removes only the selected row');
  assert.equal(await node(editor,'tabs').getByRole('tab').last().textContent(),'Bemutatkozás');
  assert.equal(await node(editor,'tabs').getByRole('tab').last().getAttribute('aria-selected'),'true',
    'deleting a selected tab falls back to the nearest existing tab');
  assert.equal(posts.length,countBeforeStructuralEdit,
    'Inspector structural edits stay in the draft; neither Save nor Publish runs automatically');
  await select('accordion');
  await node(editor,'accordion').locator('summary').last().click();
  assert.deepEqual(await node(editor,'accordion').locator('details').evaluateAll(items=>items.map(el=>el.open)),[false,true]);
  await editor.getByLabel('Harmonikacsoport elnevezése',{exact:true}).fill('Kérdések & válaszok');
  assert.deepEqual(await node(editor,'accordion').locator('details').evaluateAll(items=>items.map(el=>el.open)),[false,true],
    'changing a group label preserves already expanded Canvas sections');
  await editor.locator('.content-repeater').getByRole('button',{name:'2. elem: Fel'}).press('Enter');
  assert.equal(await node(editor,'accordion').locator('summary').first().textContent(),'Hol találom?');
  assert.deepEqual(await node(editor,'accordion').locator('details').evaluateAll(items=>items.map(el=>el.open)),[true,false],
    'the expanded Accordion follows the reordered section, rather than its old index');
  await editor.locator('.content-repeater').getByRole('button',{name:'1. elem: Le'}).press('Enter');
  assert.deepEqual(await node(editor,'accordion').locator('details').evaluateAll(items=>items.map(el=>el.open)),[false,true],
    'expanded section remains open after reversing the move');
  await editor.getByLabel('Egyszerre csak egy nyitott rész',{exact:true}).check();
  await editor.getByLabel('Első rész kezdetben nyitva',{exact:true}).check();
  const canvasAccordion=node(editor,'accordion').getByRole('group',{name:'Kérdések & válaszok'});
  assert.equal(await canvasAccordion.count(),1,'Inspector names the real Canvas accordion group');
  assert.equal(await canvasAccordion.locator('details').count(),2);
  assert.deepEqual(await canvasAccordion.locator('details').evaluateAll(items=>items.map(el=>el.open)),[true,false],
    'single-open and initially-open options can be combined in the Canvas');
  assert.equal(await canvasAccordion.locator('details').first().getAttribute('name'),
    await canvasAccordion.locator('details').last().getAttribute('name'),
    'single-open uses the same native details name within this accordion');
  await select('dropdown');
  await editor.getByLabel('Lenyitható csoport elnevezése',{exact:true}).fill('További lehetőségek');
  await editor.getByLabel('Első rész kezdetben nyitva',{exact:true}).check();
  const canvasDropdown=node(editor,'dropdown').getByRole('group',{name:'További lehetőségek'});
  assert.equal(await canvasDropdown.locator('details').first().evaluate(el=>el.open),true,
    'native first-open state is visible immediately on the Canvas');
  assert.equal(await canvasDropdown.locator('details').last().getAttribute('name'),null,
    'multi-open default does not accidentally make separate dropdown items exclusive');
  await select('gallery');
  await editor.getByLabel('Képgaléria elnevezése',{exact:true}).fill('Műhelyem & képeim');
  assert.equal(await node(editor,'gallery').getByRole('region',{name:'Műhelyem & képeim'}).count(),1,
    'the real Canvas image grid is a named gallery region');
  await setCrop('Kivágás vízszintesen',24);await setCrop('Kivágás függőlegesen',68);
  assert.equal(await node(editor,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectPosition),'24% 68%','repeater image crop edits the selected gallery item');
  const galleryItem=editor.locator('.content-repeater fieldset').first();
  await galleryItem.getByLabel('Képleírás',{exact:true}).fill('');
  await galleryItem.getByRole('button',{name:'Médiatár megnyitása'}).click();await galleryItem.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'gallery').locator('img').first().getAttribute('alt'),'Márkajel','gallery item inherits metadata only when its own alt is empty');
  assert.equal(await node(editor,'gallery').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/api/admin/media?id='+assetId,'canvas zoom uses the selected private asset');
  await select('carousel');
  await editor.emulateMedia({reducedMotion:'reduce'});
  await node(editor,'carousel').getByRole('button',{name:'Következő kép',exact:true}).click();
  await editor.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`)?.scrollLeft>0,ids.carousel);
  await editor.getByLabel('Galéria elnevezése',{exact:true}).fill('Képes történeteim & fotók');
  assert.ok(await node(editor,'carousel').locator('.creator-carousel').evaluate(el=>el.scrollLeft)>0,
    'the Canvas carousel retains its previewed scroll position during Inspector editing');
  const carouselRegion=node(editor,'carousel').locator('.creator-carousel[role="region"]');
  assert.equal(await carouselRegion.getAttribute('aria-label'),'Képes történeteim & fotók',
    'Inspector name must be exposed on the actual keyboard-focusable canvas carousel');
  const carouselItem=editor.locator('.content-repeater fieldset').first();
  await carouselItem.getByRole('button',{name:'Médiatár megnyitása'}).click();await carouselItem.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'carousel').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/api/admin/media?id='+assetId);
  assert.equal(await node(editor,'carousel').locator('img').first().getAttribute('alt'),'Első dia','a manually written carousel alt is preserved');
  await select('video');
  assert.equal(await node(editor,'video').locator('video').getAttribute('poster'),'/fixture.svg','existing cover URL remains unchanged until selection');
  const posterPicker=editor.locator('[data-content-key="posterAssetId"]');
  await posterPicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await posterPicker.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'video').locator('video').getAttribute('poster'),'/api/admin/media?id='+assetId,'Editor video poster uses authenticated preview');
  assert.equal(await node(editor,'video').locator('video').getAttribute('src'),'/fixture.webm','choosing a cover does not change video source');
  // Desktop and narrow-screen Inspector text fields must not persist an
  // unfinished IME candidate; the confirmed replacement may arrive after
  // compositionend, or the compositionend may be the last event.
  for(const width of [1366,390]){
    await editor.setViewportSize({width,height:900});
    await select('list');
    const listField=editor.locator('.content-repeater fieldset').first().getByLabel('Szöveg',{exact:true});
    const initialPosts=posts.length;
    const partial=await listField.evaluate(el=>{
      el.focus();
      el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));
      el.value='Köztes';
      el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,inputType:'insertCompositionText',data:'Köztes'}));
      const canvasBefore=document.querySelector('.creator-node[data-content-type="list"] ol li')?.textContent;
      el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'Végleges'}));
      const canvasBeforeFinal=document.querySelector('.creator-node[data-content-type="list"] ol li')?.textContent;
      el.value='Végleges';
      el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false,inputType:'insertText',data:'Végleges'}));
      return {canvasBefore,canvasBeforeFinal};
    });
    assert.deepEqual(partial,{canvasBefore:'Első hivatkozás',canvasBeforeFinal:'Első hivatkozás'},
      'IME partial input and compositionend do not persist intermediate list text at '+width+'px');
    await editor.waitForFunction(()=>document.querySelector('.creator-node[data-content-type="list"] ol li')?.textContent==='Végleges');
    assert.equal(await listField.inputValue(),'Végleges');
    await listField.evaluate(el=>{
      el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));
      el.value='Köztes második';
      el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,inputType:'insertCompositionText'}));
      el.value='Kész';
      el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'Kész'}));
    });
    await editor.waitForFunction(()=>document.querySelector('.creator-node[data-content-type="list"] ol li')?.textContent==='Kész');
    assert.equal(posts.length,initialPosts,'IME only updates local draft and never saves or publishes at '+width+'px');
    await listField.fill('Első hivatkozás');
  }
  await editor.setViewportSize({width:1366,height:900});
  await select('list');const texts=editor.locator('.content-repeater textarea');await texts.first().fill('Átírt listaelem');
  await editor.getByRole('button',{name:'1. elem: Le',exact:true}).click();assert.match(await node(editor,'list').locator('ol').textContent(),/^Második elem/);
  assert.equal(posts.length,1);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));assert.equal(posts.at(-1).publish,false);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.video].props.posterAssetId,assetId,'Save retains poster ID as draft only');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.video].props.src,'/fixture.webm','video source is not overwritten by image picker');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.image].props.assetId,assetId,'Save persists the site asset reference but never publishes it');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.items[0].assetId,assetId);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.button].responsive.desktop.backgroundAssetId,assetId,'Save stores the background asset ID');
  await live.goto(base+'/p/test');assert.equal(await live.locator('h1[data-node-id]').textContent(),'Alkotói főcím');
  assert.equal(await node(live,'video').locator('video').getAttribute('poster'),'/fixture.svg','Save never publishes the newly chosen poster');
  assert.equal(await node(live,'gallery').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/fixture.svg','Save does not publish the new gallery image');
  assert.equal(await node(live,'gallery').getByRole('region',{name:'Eredeti képrács'}).count(),1,
    'gallery Inspector name stays draft-only after Save');
  assert.equal(await node(live,'tabs').getByRole('tablist',{name:'Eredeti fülek'}).count(),1,
    'tablist Inspector name stays draft-only after Save');
  assert.equal(await node(live,'accordion').getByRole('group',{name:'Harmonika'}).count(),1,
    'Accordion naming changes remain draft-only until Publish');
  assert.equal(await node(live,'dropdown').locator('details').first().evaluate(el=>el.open),false,
    'first-open setting remains private after Save');
  assert.equal(await node(live,'button').getAttribute('href'),'/p/home','Save keeps the prior published link live');
  assert.equal(await node(live,'carousel').locator('.creator-carousel').getAttribute('aria-label'),'Alkotói galéria',
    'a newly named carousel is still draft-only after Save');
  assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),'none','draft background stays private before Publish');
  assert.equal(await node(live,'image').locator('img').evaluate(el=>getComputedStyle(el).objectPosition),'50% 50%','Save does not publish image crop');
  await editor.reload();await select('heading');assert.equal(await editor.getByLabel('Címsor szemantikai szintje',{exact:true}).inputValue(),'3');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');await live.reload();
  assert.equal(await node(live,'video').locator('video').getAttribute('poster'),'/media/'+assetId,'Publish uses guarded site image route for poster');
  assert.equal(await node(live,'video').locator('video').getAttribute('src'),'/fixture.webm','original video playback URL survives Publish');
  assert.equal(await node(live,'image').locator('img').getAttribute('src'),'/media/'+assetId,'published content resolves the public media route');
  assert.equal(await live.locator(`h3[data-node-id="${ids.heading}"]`).textContent(),'Módosított főcím');
  assert.equal(await node(live,'button').getAttribute('href'),'/p/updated');assert.equal(await node(live,'button').getAttribute('rel'),'noopener noreferrer');
  assert.equal(await node(live,'button').getAttribute('aria-label'),'Alkotói bemutatkozás megnyitása');
  assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\/6b1c2e65-e46e-4764-b234-123456789abc/,'Publish serves the background through the guarded public route');
  assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundPosition),/^50% 0%/);
  await node(live,'button').hover();await live.waitForFunction(id=>getComputedStyle(document.querySelector(`[data-node-id="${id}"]`)).backgroundColor==='rgb(220, 20, 60)',ids.button);
  assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
  await live.keyboard.press('Tab');await node(live,'button').focus();await live.waitForFunction(id=>getComputedStyle(document.querySelector(`[data-node-id="${id}"]`)).backgroundColor==='rgb(37, 99, 235)',ids.button);
  assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).rotate),'3deg');
  await live.emulateMedia({reducedMotion:'reduce'});assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  assert.equal(await node(live,'image').locator('img').getAttribute('alt'),'Márkajel');assert.equal(await node(live,'image').locator('img').evaluate(el=>getComputedStyle(el).objectPosition),'18% 82%');assert.equal(await node(live,'image').locator('figcaption').textContent(),'Képaláírás');
  assert.equal(await node(live,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectPosition),'24% 68%','published gallery item retains its independent crop');
  assert.equal(await node(live,'gallery').getByRole('region',{name:'Műhelyem & képeim'}).count(),1,
    'Publish exposes the new image grid accessible name');
  assert.equal(await node(live,'tabs').getByRole('tablist',{name:'Bemutatkozás & videók'}).count(),1,
    'Publish exposes the new tablist accessible name');
  assert.equal(await node(live,'accordion').getByRole('group',{name:'Kérdések & válaszok'}).count(),1,
    'Publish exposes the editable Accordion group name');
  assert.equal(await node(live,'dropdown').getByRole('group',{name:'További lehetőségek'}).count(),1,
    'Publish exposes the editable Dropdown group name');
  assert.equal(await node(live,'carousel').getByRole('region',{name:'Képes történeteim & fotók'}).count(),1,
    'published carousel region inherits the exact accessible Inspector name');
  assert.equal(await node(live,'table').locator('th[scope=col]').count(),2);assert.equal(await node(live,'video').locator('video[controls]').count(),1);assert.equal(await node(live,'audio').locator('audio[controls]').count(),1);
  for(const type of ['video','audio']){const playback=await node(live,type).locator(type).evaluate(async media=>{if(media.readyState<1)await new Promise((resolve,reject)=>{media.addEventListener('loadedmetadata',resolve,{once:true});media.addEventListener('error',reject,{once:true})});media.muted=true;await media.play();const result={playing:!media.paused,duration:media.duration,readyState:media.readyState};media.pause();return result});assert.equal(playback.playing,true);assert.ok(playback.duration>0);assert.ok(playback.readyState>=2)}
  assert.equal(await node(live,'code').locator('script').count(),0);assert.match(await node(live,'code').locator('code').textContent(),/<script>/);
  await node(live,'tabs').getByRole('tab',{name:'Bemutatkozás',exact:true}).click();assert.equal(await node(live,'tabs').getByRole('tabpanel').textContent(),'Személyes történet');
  await node(live,'tabs').getByRole('tab',{name:'Bemutatkozás',exact:true}).press('Home');assert.equal(await node(live,'tabs').getByRole('tabpanel').textContent(),'Videólista');
  const accordion=node(live,'accordion').getByRole('group',{name:'Kérdések & válaszok'});
  assert.deepEqual(await accordion.locator('details').evaluateAll(items=>items.map(el=>el.open)),[true,false],
    'Accordion opens its first section initially after Publish');
  await accordion.locator('summary').last().press('Enter');
  assert.deepEqual(await accordion.locator('details').evaluateAll(items=>items.map(el=>el.open)),[false,true],
    'native details name closes the old Accordion item when opening another with Enter');
  const dropdown=node(live,'dropdown').getByRole('group',{name:'További lehetőségek'});
  assert.deepEqual(await dropdown.locator('details').evaluateAll(items=>items.map(el=>el.open)),[true,false],
    'published Dropdown honors initial first-open setting');
  await dropdown.locator('summary').last().press('Enter');
  assert.deepEqual(await dropdown.locator('details').evaluateAll(items=>items.map(el=>el.open)),[true,true],
    'Dropdown default allows multiple simultaneously open sections and keyboard access');
  assert.deepEqual(await accordion.locator('details').evaluateAll(items=>items.map(el=>el.open)),[false,true],
    'interacting with a second details group cannot close the first group');
  await node(live,'carousel').getByRole('button',{name:'Következő kép',exact:true}).click();await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft>0,ids.carousel);
  assert.equal(await node(live,'gallery').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/media/'+assetId);
  assert.equal(await node(live,'carousel').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/media/'+assetId);
  await node(live,'gallery').locator('.creator-image-zoom').first().click();
  const lightbox=live.getByRole('dialog',{name:'Kép előnézete'});
  await lightbox.waitFor();
  assert.equal(await lightbox.locator('img').getAttribute('src'),'/media/'+assetId,
    'lightbox renders the same published asset as its first thumbnail');
  assert.equal(await lightbox.locator('.creator-lightbox-nav [role=status]').textContent(),'1 / 2');
  await live.keyboard.press('ArrowRight');
  assert.equal(await lightbox.locator('img').getAttribute('alt'),'Második kép',
    'arrow key navigates to the next image without closing the dialog');
  assert.equal(await lightbox.locator('.creator-lightbox-caption').textContent(),'Második képaláírás');
  await live.keyboard.press('Home');
  assert.equal(await lightbox.locator('img').getAttribute('alt'),'Márkajel');
  await live.keyboard.press('End');
  assert.equal(await lightbox.locator('.creator-lightbox-nav [role=status]').textContent(),'2 / 2');
  await lightbox.getByRole('button',{name:'Előző kép'}).click();
  assert.equal(await lightbox.locator('img').getAttribute('alt'),'Márkajel');
  await lightbox.getByRole('button',{name:'Előző kép'}).click();
  assert.equal(await lightbox.locator('img').getAttribute('alt'),'Második kép',
    'previous-image control wraps within only this gallery');
  await live.keyboard.press('Escape');
  await live.locator('dialog.creator-lightbox').waitFor({state:'detached'});
  assert.equal(await live.getByRole('dialog').count(),0);
  assert.equal(await node(live,'gallery').locator('.creator-image-zoom').first().evaluate(el=>document.activeElement===el),true,
    'Escape restores keyboard focus to the exact thumbnail that opened the preview');
  await node(live,'tooltip').locator('button').focus();assert.equal(await node(live,'tooltip').getByRole('tooltip').isVisible(),true);
  for(const width of [1366,768,390]){
    await live.setViewportSize({width,height:900});await live.reload();await node(live,'gallery').waitFor();
    assert.ok(await live.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'modern root does not inherit a narrower legacy template or horizontal overflow');
    assert.equal(await node(live,'gallery').getByRole('region',{name:'Műhelyem & képeim'}).count(),1);
    assert.equal(await node(live,'tabs').getByRole('tablist',{name:'Bemutatkozás & videók'}).count(),1);
    assert.equal(await node(live,'accordion').getByRole('group',{name:'Kérdések & válaszok'}).count(),1);
    assert.deepEqual(await node(live,'accordion').locator('details').evaluateAll(items=>items.map(el=>el.open)),[true,false],
      'single-open Accordion starts with its first section open on every responsive viewport');
    assert.deepEqual(await node(live,'dropdown').locator('details').evaluateAll(items=>items.map(el=>el.open)),[true,false],
      'Dropdown starts with first section open on every responsive viewport');
    const keyboardCarousel=node(live,'carousel').getByRole('region',{name:'Képes történeteim & fotók'});
    await keyboardCarousel.focus();
    await keyboardCarousel.press('ArrowRight');
    await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft>0,ids.carousel);
    await keyboardCarousel.press('Home');
    await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft===0,ids.carousel);
    await keyboardCarousel.press('End');
    await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft>0,ids.carousel);
    await keyboardCarousel.press('ArrowLeft');
    await live.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] .creator-carousel`).scrollLeft===0,ids.carousel);
    assert.equal(await keyboardCarousel.evaluate(el=>document.activeElement===el),true,
      `arrow and Home/End carousel controls preserve focused region at ${width}px`);
    const expected=width<=700?1:width<=900?2:3;assert.equal((await node(live,'gallery').locator('.creator-gallery').evaluate(el=>getComputedStyle(el).gridTemplateColumns)).split(' ').length,expected);
    for(const type of ['heading','text','button','image','quote']){
      await editor.locator(`.canvas-device-btn[data-device="${width<=700?'mobile':width<=900?'tablet':'desktop'}"]`).click();
      const metric=el=>{const css=getComputedStyle(el);return {fontSize:css.fontSize,lineHeight:css.lineHeight,color:css.color,padding:css.padding,borderRadius:css.borderRadius}};
      assert.deepEqual(await node(live,type).evaluate(metric),await node(editor,type).evaluate(metric),`${type}/${width} content parity`);
      if(type==='image')assert.equal(await node(live,type).locator('img').evaluate(el=>getComputedStyle(el).objectPosition),await node(editor,type).locator('img').evaluate(el=>getComputedStyle(el).objectPosition),`image crop parity/${width}`);
    }
    const backgroundMetric=el=>{const css=getComputedStyle(el);return {size:css.backgroundSize,position:css.backgroundPosition,repeat:css.backgroundRepeat}};
    assert.deepEqual(await node(live,'button').evaluate(backgroundMetric),await node(editor,'button').evaluate(backgroundMetric),`background image style parity/${width}`);
    assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\/6b1c2e65-e46e-4764-b234-123456789abc/,`published background survives ${width}px`);
  }
  // Preview uses a genuine viewport so both responsive Page Model values AND
  // browser CSS media queries match the real public page, regardless of outer size.
  const standalone=await browser.newPage({viewport:{width:1440,height:900}});
  standalone.on('pageerror',error=>errors.push('standalone: '+error.message));
  await live.setViewportSize({width:900,height:900});
  for(const [device,width] of [['desktop',1440],['tablet',768],['mobile',390]]){
    await live.goto(base+'/p/test?preview=1&device='+device);
    const frame=live.locator('.preview-frame'),iframe=live.locator('iframe.preview-viewport');
    const embedded=iframe.contentFrame();
    await embedded.locator('.visual-root-authored').waitFor();
    assert.equal(await frame.evaluate(el=>el.getBoundingClientRect().width),width,'preview keeps the exact '+device+' width in a narrower parent');
    assert.equal(await iframe.evaluate(el=>el.contentWindow.innerWidth),width,'CSS viewport matches '+device);
    assert.equal(await iframe.getAttribute('title'),'Weboldal előnézete');
    assert.match(await iframe.getAttribute('src'),/preview=1.*embed=1/,'embedded preview retains the preview API contract');
    await standalone.setViewportSize({width,height:900});await standalone.goto(base+'/p/test');
    await standalone.locator('.visual-root-authored').waitFor();
    const mediaMetrics=el=>({
      headerHeight:getComputedStyle(el.querySelector('.nav')).height,
      pagePadding:getComputedStyle(el.querySelector('main.page')).paddingTop,
      menuColumns:getComputedStyle(el.querySelector('.menu-grid')).gridTemplateColumns,
      rootColor:getComputedStyle(el.querySelector('#content-canvas')).backgroundColor
    });
    assert.deepEqual(await embedded.locator('body').evaluate(mediaMetrics),await standalone.locator('body').evaluate(mediaMetrics),device+' preview/public CSS parity');
    assert.equal(await embedded.locator('.creator-node').count(),await standalone.locator('.creator-node').count(),device+' content parity');
    assert.equal(await embedded.locator('.preview-toolbar').count(),0,'embedded page never creates nested preview controls');
  }
  assert.equal(await live.locator('[data-preview-device="mobile"]').getAttribute('aria-pressed'),'true');
  await live.locator('[data-preview-device="desktop"]').click();
  await live.locator('iframe.preview-viewport').contentFrame().locator('.visual-root-authored').waitFor();
  assert.equal(await live.locator('iframe.preview-viewport').evaluate(el=>el.contentWindow.innerWidth),1440,'switching devices updates the real CSS viewport');
  assert.equal(await live.locator('[data-preview-device="desktop"]').getAttribute('aria-pressed'),'true');
  // Restore the mobile viewport expected by the following publish-isolation test.
  // That test verifies a mobile-only background removal leaves desktop intact.
  await live.setViewportSize({width:390,height:900});
  await select('button');await editor.locator('.inspector-tabs button').first().click();await openGroup('Háttér');
  await editor.locator('[data-property-id="background.image"]').getByRole('button',{name:'Kép eltávolítása'}).click();
  assert.doesNotMatch(await node(editor,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/api\/admin\/media/);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  await live.goto(base+'/p/test');assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\/6b1c2e65-e46e-4764-b234-123456789abc/,'Save does not remove the live background');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');await live.reload();
  assert.doesNotMatch(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\//,'Publish removes the background reference without removing the gradient');
  await live.setViewportSize({width:1366,height:900});await live.reload();
  assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\/6b1c2e65-e46e-4764-b234-123456789abc/,'desktop retains its image after mobile-only removal');
  await editor.setViewportSize({width:390,height:800});await select('image');await editor.screenshot({path:'/tmp/creator-ux-p0-content-mobile.png'});
  assert.deepEqual(errors,[]);
});
