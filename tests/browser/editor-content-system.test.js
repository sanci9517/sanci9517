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
import {CONTENT_FIELDS,MAX_AUTHORED_TABLE_TSV_CHARS} from '../../public/editor-v2/core/authored-content.js';
import {serializeTableTsv} from '../../public/editor-v2/core/table-tsv.js';

// editor-sample.webm is a 619-byte, procedurally generated purple VP9 frame (ffmpeg lavfi color).
test('typed authored elements survive Inspector edits, reload and separate Publish with real accessible content and interactions',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId,rootId=activePage(state).rootId,ids={},assetId='6b1c2e65-e46e-4764-b234-123456789abc';
  execute(state,{type:'root.appearance.enable',payload:{nodeId:rootId}});
  execute(state,{type:'responsive.set',payload:{nodeId:rootId,device:'desktop',patch:{padding:'16px',color:'#182335',backgroundColor:'#ffffff'}}});
  const tableRows=Array.from({length:21},(_,row)=>[
    `${row===0?'Fejléc':'Sor '+row} ${'N'.repeat(1000)}`,
    `${row===0?'Oszlop':'Érték'} ${row} ${'V'.repeat(1000)}`
  ]);
  const expectedTableRows=structuredClone(tableRows);expectedTableRows.at(-1)[1]+='!';
  const definitions={
    heading:{text:'Alkotói főcím',level:'1'},text:{text:'Egyedi szöveg'},button:{text:'Tovább',href:'/p/home',target:'_blank'},link:{text:'Kapcsolat',href:'mailto:creator@example.com'},
    quote:{text:'A kreativitás tanulható.',citation:'Egy alkotó'},badge:{text:'Új sorozat'},icon:{icon:'star',ariaLabel:'Kedvenc'},
    image:{src:'/fixture.svg',alt:'Tesztillusztráció',caption:'Képaláírás',fit:'contain',ratio:'1 / 1'},video:{src:'/fixture.webm',poster:'/fixture.svg',controls:true,muted:false,autoplay:false,loop:false},audio:{src:'/fixture.mp3',controls:true},
    list:{ordered:true,items:[{text:'Első hivatkozás',href:'/p/home'},{text:'Második elem'}]},table:{caption:'Eredmények',header:true,rows:tableRows},
    tabs:{ariaLabel:'Eredeti fülek',items:[{title:'Videók',text:'Videólista'},{title:'Bemutatkozás',text:'Személyes történet'}]},accordion:{items:[{title:'Hogyan készült?',text:'A kulisszák mögött.'},{title:'Hol találom?',text:'A szerkesztőben.'}]},dropdown:{items:[{title:'További részletek',text:'Kiegészítés'},{title:'Másik rész',text:'Új információ'}]},
    gallery:{ariaLabel:'Eredeti képrács',columns:'3',items:[{src:'/fixture.svg',alt:'Első kép'},{src:'/fixture.svg',alt:'  Második kép  ',caption:'  Második képaláírás  '}]},carousel:{ariaLabel:'Alkotói galéria',items:[{src:'/fixture.svg',alt:'Első dia'},{src:'/fixture.svg',alt:'Második dia'}]},
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
  const mediaAssets=[
    {id:assetId,name:'brand-mark.png',mimeType:'image/png',sizeBytes:128,altText:'Márkajel',previewUrl:'/api/admin/media?id='+assetId},
    {id:'00000000-0000-4000-8000-000000000126',name:'bed.mp3',mimeType:'audio/mpeg',sizeBytes:42,altText:'',previewUrl:'/media/audio'},
    {id:'00000000-0000-4000-8000-000000000127',name:'clip.webm',mimeType:'video/webm',sizeBytes:84,altText:'',previewUrl:'/media/video'}
  ];
  const mediaListRequests=[];

  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id')){
      const mime=url.searchParams.get('mime');mediaListRequests.push(mime);
      const assets=mime==='image'?mediaAssets.filter(asset=>asset.mimeType.startsWith('image/')):mime==='audio'||mime==='video'?mediaAssets.filter(asset=>asset.mimeType.startsWith(mime+'/')):mediaAssets;
      return json({ok:true,data:{assets}});
    }
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
  const touchContext=await browser.newContext({viewport:{width:390,height:800},isMobile:true,hasTouch:true});
  const touchEditor=await touchContext.newPage();touchEditor.setDefaultTimeout(15000);touchEditor.setDefaultNavigationTimeout(30000);touchEditor.on('pageerror',e=>errors.push(e.message));
  t.after(()=>touchContext.close());
  // This fixture mounts every authored content type and exercises multiple
  // Inspector/Canvas/save/reload routes; keep the assertion strict while
  // allowing the same interaction budget as the other full Inspector tests.
  const dContentTypes=new Set(['button','link','icon','image','video','audio','list','table','tabs','accordion','dropdown','gallery','carousel']);
  editor.setDefaultTimeout(15000);live.setDefaultTimeout(15000);editor.setDefaultNavigationTimeout(30000);live.setDefaultNavigationTimeout(30000);editor.on('pageerror',e=>errors.push(e.message));live.on('pageerror',e=>errors.push(e.message));
  const node=(tab,type)=>tab.locator(`.creator-node[data-node-id="${ids[type]}"]`);
  const select=async type=>{await node(editor,type).evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();await editor.locator('.inspector-tabs button').nth(1).click()};
  const touchNode=type=>node(touchEditor,type);
  const touchSelect=async type=>{
    const dock=touchEditor.locator('#rightDock');
    if(!await dock.evaluate(el=>el.classList.contains('closed')))await touchEditor.locator('#openInspector').tap();
    await touchNode(type).evaluate(el=>el.click());
    if(await dock.evaluate(el=>el.classList.contains('closed')))await touchEditor.locator('#openInspector').tap();
    await touchEditor.locator('.inspector-tabs button').nth(1).tap();
  };
  const assertNamedMediaPicker=async picker=>{
    const metadata=await picker.evaluate(el=>({role:el.getAttribute('role'),labelId:el.getAttribute('aria-labelledby'),labelText:document.getElementById(el.getAttribute('aria-labelledby'))?.textContent.trim(),descriptionId:el.getAttribute('aria-describedby'),openDescriptionId:el.querySelector('button[aria-controls]')?.getAttribute('aria-describedby')}));
    assert.equal(metadata.role,'group','Media picker exposes a semantic group');assert.ok(metadata.labelId&&metadata.labelText,'Media picker has a visible field label');
    if(metadata.descriptionId)assert.equal(metadata.openDescriptionId,metadata.descriptionId,'the primary picker control references its validation feedback');
    return metadata;
  };
  await editor.goto(base+'/editor-v2/index.html');
  await live.goto(base+'/p/test');
  assert.equal(await node(live,'image').locator('img').evaluate(el=>getComputedStyle(el).objectFit),'contain',
    'the existing published image keeps its original fit before the draft edit');
  assert.equal(await node(live,'image').locator('.creator-image-frame').evaluate(el=>getComputedStyle(el).aspectRatio),'1 / 1',
    'the existing published image keeps its original square ratio before the draft edit');
  // Tie every visible authored field to the command and Page Model path that
  // actually receives its edit, including repeater child and table cell paths.
  for(const type of Object.keys(definitions)){
    await select(type);
    const fields=await editor.locator('.content-schema-field').evaluateAll((elements,type)=>elements.map(field=>{
      const repeater=field.closest('.content-repeater');
      const path=type==='table'&&field.dataset.contentKey==='rows'?'rows[][]':
        (repeater?repeater.dataset.contentKey+'[].':'')+field.dataset.contentKey;
      return {contentKey:field.dataset.contentKey,key:field.dataset.inspectorKey,command:field.dataset.inspectorCommand,expected:'props.'+path};
    }),type);
    const plainTextTypes=new Set(['heading','text','button','link']);
    const expectedSchemaKeys=CONTENT_FIELDS[type].flatMap(field=>{
      if(plainTextTypes.has(type)&&field.key==='text')return [];
      if(field.type==='repeater')return Array.from({length:Array.isArray(definitions[type][field.key])?definitions[type][field.key].length:0},()=>field.itemFields.map(item=>item.key)).flat();
      return [field.key];
    });
    if(dContentTypes.has(type))assert.deepEqual(fields.map(field=>field.contentKey),expectedSchemaKeys,`${type} renders every declared Inspector field exactly once`);
    if(plainTextTypes.has(type))assert.equal(await editor.locator(`.plain-text-editor[data-text-node-id="${ids[type]}"]`).count(),1,`${type} exposes text in its dedicated Editor control`);
    for(const field of fields){
      assert.equal(field.command,'content.properties.set',`${type}/${field.expected} command`);
      assert.equal(field.key,field.expected,`${type} field route`);
    }
    const table=editor.locator('.content-schema-field[data-content-key="rows"]');
    if(type==='table'){
      assert.equal(await table.getAttribute('data-inspector-command'),'content.properties.set');
      assert.equal(await table.getAttribute('data-inspector-key'),'props.rows[][]','table cells map to nested row/cell values');
      const rowsField=table.locator('textarea');
      assert.equal(await rowsField.inputValue(),serializeTableTsv(tableRows),'a supported authored table larger than 40,000 characters opens without truncation');
      assert.equal(await rowsField.evaluate(el=>el.maxLength),MAX_AUTHORED_TABLE_TSV_CHARS,
        'Inspector maxLength derives from the full row/column/cell contract, not a smaller legacy cap');
      await rowsField.fill('Fejléc\tMásodik\r\nZárósor\tÉrték\r\n');
      assert.equal(await rowsField.getAttribute('aria-invalid'),null,
        'a trailing Excel CRLF is accepted as the final record delimiter, not a malformed extra row');
      assert.equal(await node(editor,'table').locator('tbody tr').count(),2,
        'a final clipboard line ending does not add a one-cell row to the authored table');
      assert.equal(await node(editor,'table').locator('tbody tr').last().locator('td').last().textContent(),'Érték');
      assert.equal(posts.length,0,'pasting a complete TSV remains draft-only before Save');
      await rowsField.fill(serializeTableTsv(tableRows));
      await rowsField.evaluate(el=>{el.focus();el.setSelectionRange(el.value.length,el.value.length)});
      await rowsField.pressSequentially('!');
      assert.equal(await rowsField.inputValue(),serializeTableTsv(expectedTableRows),
        'a user can edit the final cell after the existing 40,000-character boundary');
      assert.equal(posts.length,0,'large-table Inspector edits remain draft-only before Save');
      const oversizedRows=Array.from({length:4},()=>Array(16).fill('x'.repeat(2000)));
      const oversizedTsv=serializeTableTsv(oversizedRows);
      assert.ok(oversizedTsv.length<MAX_AUTHORED_TABLE_TSV_CHARS,
        'the fixture remains inside the Inspector textarea limit');
      assert.ok(JSON.stringify(oversizedRows).length>120_000,
        'the fixture exceeds the Page Model table payload limit');
      const tableRowsBeforeInvalidEdit=await node(editor,'table').locator('tbody tr').count();
      await rowsField.fill(oversizedTsv);
      assert.equal(await rowsField.getAttribute('aria-invalid'),'true',
        'a TSV-valid but unsaveable table is marked invalid');
      const tableValidationId=await rowsField.getAttribute('aria-describedby');
      assert.equal(await editor.locator(`#${tableValidationId}`).getAttribute('role'),'status',
        'the rejected edit is announced through the associated status region');
      assert.match(await table.locator('.content-field-help').textContent(),/120\s?000/,
        'persistent table guidance explains the Page Model size limit');
      assert.equal(await node(editor,'table').locator('tbody tr').count(),tableRowsBeforeInvalidEdit,
        'an oversized table does not replace the last valid Canvas content');
      await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
      assert.equal(await editor.locator('.canvas-device-btn[data-device="desktop"]').getAttribute('aria-pressed'),'true',
        'an invalid table prevents switching away from the current responsive breakpoint');
      assert.equal(await editor.locator('.canvas-device-btn[data-device="mobile"]').getAttribute('aria-pressed'),'false');
      await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a hibás mezőt a nézetváltás előtt.'));
      assert.equal(await rowsField.getAttribute('aria-invalid'),'true','a blocked responsive switch retains the invalid table feedback');
      assert.equal(await rowsField.inputValue(),oversizedTsv,'a blocked responsive switch retains the exact table draft for correction');
      assert.equal(await node(editor,'table').locator('tbody tr').count(),tableRowsBeforeInvalidEdit,
        'a blocked responsive switch preserves the last valid table Canvas content');
      assert.equal(posts.length,0,'a blocked responsive switch never Saves or Publishes');
      await editor.locator('#save').click();
      await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt'));
      assert.equal(posts.length,0,'Save is blocked while the authored table is unsaveable');
      await rowsField.fill(serializeTableTsv(expectedTableRows));
      assert.equal(await rowsField.getAttribute('aria-invalid'),null,
        'correcting the table clears the invalid state');
      assert.equal(posts.length,0,'correcting the table still does not autosave');
      for(const [device,width] of [['mobile',390],['tablet',768],['desktop',1366]]){
        await editor.setViewportSize({width:1366,height:900});
        await editor.locator(`.canvas-device-btn[data-device="${device}"]`).click();
        await editor.setViewportSize({width,height:900});
        assert.equal(await editor.locator(`.canvas-device-btn[data-device="${device}"]`).getAttribute('aria-pressed'),'true',
          `the corrected table can switch to the ${device} breakpoint`);
        assert.equal(await node(editor,'table').locator('tbody tr').count(),tableRowsBeforeInvalidEdit,
          `the corrected table Canvas content remains intact at the ${device} breakpoint`);
        assert.equal(posts.length,0,`valid responsive table checks remain draft-only at the ${device} breakpoint`);
      }
      const tableCaption=editor.getByLabel('Táblázat címe',{exact:true});
      await tableCaption.fill('Frissített eredmények');
      const tableHeader=editor.getByLabel('Az első sor fejléc',{exact:true});
      await tableHeader.uncheck();
      assert.equal(await node(editor,'table').locator('caption').textContent(),'Frissített eredmények',
        'the authored table caption changes immediately in the Canvas');
      assert.equal(await node(editor,'table').locator('th[scope=col]').count(),0,
        'turning off the authored header converts the first row to ordinary data cells');
      assert.equal(await node(editor,'table').locator('tbody tr').first().locator('td').count(),2,
        'the header toggle preserves every first-row table cell');
      assert.equal(posts.length,0,'authored table caption and header edits remain local until explicit Save');
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
  await select('icon');const iconName=editor.getByLabel('Ikon leírása',{exact:true});
  await iconName.fill('   ');
  assert.equal(await node(editor,'icon').getAttribute('aria-label'),null,'whitespace-only icon name is omitted from the Canvas');
  assert.equal(await node(editor,'icon').getAttribute('role'),null,'an empty name never turns a decorative icon into an image');
  assert.equal(await node(editor,'icon').getAttribute('aria-hidden'),'true','an unnamed icon is hidden from assistive technology');
  await iconName.fill('  Kedvenc  ');
  assert.equal(await node(editor,'icon').getAttribute('aria-label'),'Kedvenc','Canvas accessible names are trimmed');
  assert.equal(await node(editor,'icon').getAttribute('role'),'img');
  await iconName.fill('   ');
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
  const backgroundMetadata=await assertNamedMediaPicker(backgroundAsset.locator('.editor-media-picker'));assert.equal(backgroundMetadata.labelText,'Háttérkép');
  await backgroundAsset.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await editor.waitForFunction(()=>document.querySelectorAll('[data-property-id="background.image"] .editor-media-choice').length===1);
  assert.deepEqual(await backgroundAsset.locator('.editor-media-choice').allTextContents(),['brand-mark.png'],'background image picker excludes audio and video files');
  assert.equal(mediaListRequests.at(-1),'image','background image picker requests the image MIME family');
  await backgroundAsset.locator('.editor-media-choice').click();
  await editor.locator('[data-property-id="background.size"] select').selectOption('cover');
  await editor.locator('[data-property-id="background.position"] select').selectOption('center top');
  assert.match(await node(editor,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/api\/admin\/media\?id=/,'canvas uses authenticated background preview');
  await editor.locator('.inspector-tabs button').nth(1).click();
  const buttonHref=editor.locator('[data-content-key="href"] input');
  for(const privateHref of [
    '/api/admin/media?id='+assetId,
    '/api/%61dmin/media?id='+assetId,
    '/%61pi/admin/media?id='+assetId,
    '/api%2fadmin%2fmedia?id='+assetId,
    '/%252fapi%252fadmin%252fmedia?id='+assetId,
    '/%255capi%255cadmin%255cmedia?id='+assetId,
    '/public/../api/admin/media?id='+assetId
  ]){
    await buttonHref.fill(privateHref);
    assert.equal(await buttonHref.getAttribute('aria-invalid'),'true','button CTA cannot publish private Editor media URL: '+privateHref);
    assert.equal(posts.length,0,'blocked button CTA remains an unsaved draft: '+privateHref);
  }
  await buttonHref.fill('/p/updated');
  assert.equal(await buttonHref.inputValue(),'/p/updated','the content Inspector retains the edited link');
  await editor.locator('#undo').click();assert.equal(await editor.locator('[data-content-key="href"] input').inputValue(),'/p/home','Undo restores the previous link');
  await editor.locator('#redo').click();assert.equal(await editor.locator('[data-content-key="href"] input').inputValue(),'/p/updated','Redo restores the selected link');
  await select('link');
  let authoredLinkHref='https://artist.example.com/story?source=editor&mode=public';
  const authoredLinkText='Olvasd el az alkotó történetét';
  const authoredLinkLabel='Alkotói történet megnyitása';
  const linkHrefField=editor.locator('[data-content-key="href"] input');
  await editor.locator(`.plain-text-editor[data-text-node-id="${ids.link}"]`).fill(authoredLinkText);
  await linkHrefField.fill('javascript:alert(1)');
  assert.equal(await linkHrefField.getAttribute('aria-invalid'),'true','the authored link Inspector rejects an unsafe script URL');
  const linkValidationId=await linkHrefField.getAttribute('aria-describedby');
  assert.match(await editor.locator(`#${linkValidationId}`).textContent(),/Csak biztonságos/,'the invalid link exposes an accessible validation explanation');
  assert.equal(posts.length,0,'an invalid authored link never reaches Save or Publish');
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  assert.equal(await editor.locator('.canvas-device-btn[data-device="desktop"]').getAttribute('aria-pressed'),'true',
    'an invalid authored link keeps the current desktop breakpoint selected');
  assert.equal(await editor.locator('.canvas-device-btn[data-device="mobile"]').getAttribute('aria-pressed'),'false',
    'a rejected link cannot silently discard its draft when switching to mobile');
  assert.equal(await linkHrefField.getAttribute('aria-invalid'),'true',
    'the invalid link remains visibly associated with its Inspector validation after the blocked switch');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt'));
  assert.equal(posts.length,0,'the invalid authored link remains blocked from Save after a breakpoint-switch attempt');
  for(const privateHref of [
    '/api/admin/media?id='+assetId,
    '/api/%61dmin/media?id='+assetId,
    '/%61pi/admin/media?id='+assetId,
    '/api%2fadmin%2fmedia?id='+assetId,
    '/%252fapi%252fadmin%252fmedia?id='+assetId,
    '/%255capi%255cadmin%255cmedia?id='+assetId,
    '/public/../api/admin/media?id='+assetId
  ]){
    await linkHrefField.fill(privateHref);
    assert.equal(await linkHrefField.getAttribute('aria-invalid'),'true','authored text link cannot publish private Editor media URL: '+privateHref);
    assert.equal(posts.length,0,'blocked text link remains an unsaved draft: '+privateHref);
  }
  await linkHrefField.fill(authoredLinkHref);
  assert.equal(await linkHrefField.getAttribute('aria-invalid'),null,'a valid HTTPS URL clears the link validation error');
  await editor.locator('[data-content-key="target"] select').selectOption('_blank');
  await editor.locator('[data-content-key="ariaLabel"] input').fill(authoredLinkLabel);
  assert.equal(await node(editor,'link').locator('.node-content').textContent(),authoredLinkText,'the authored link preview renders its edited text without making the canvas navigable');
  assert.equal(await linkHrefField.inputValue(),authoredLinkHref,'the link Inspector retains the edited HTTPS destination');
  assert.equal(await editor.locator('[data-content-key="target"] select').inputValue(),'_blank','the link Inspector retains the selected window target');
  assert.equal(await editor.locator('[data-content-key="ariaLabel"] input').inputValue(),authoredLinkLabel,'the link Inspector retains its explicit accessible name');
  assert.equal(posts.length,0,'editing authored link fields does not Save or Publish');
  await select('button');
  await editor.locator('.inspector-tabs button').first().click();
  await editor.locator('.inspector-tabs button').nth(2).click();await openGroup('Rámutatás és fókusz');
  await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('hover');
  const hoverColor=editor.locator('[data-state-property="backgroundColor"]');assert.equal(await hoverColor.getAttribute('data-property-command'),'states.set');assert.equal(await hoverColor.getAttribute('data-property-key'),'backgroundColor');
  await hoverColor.locator('input[type=text]').fill('#dc143c');await hoverColor.locator('input[type=text]').press('Tab');
  const resetHoverColor=editor.getByRole('button',{name:'Állapotérték öröklésének visszaállítása'});
  assert.equal(await resetHoverColor.getAttribute('data-property-command'),'states.set');
  assert.equal(await resetHoverColor.getAttribute('data-property-key'),'backgroundColor');
  await resetHoverColor.click();
  await editor.locator('[data-state-property="backgroundColor"] input[type=text]').fill('#dc143c');
  await editor.locator('[data-state-property="backgroundColor"] input[type=text]').press('Tab');
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
  await editor.getByLabel('Képarány',{exact:true}).selectOption('16 / 9');
  assert.equal(await node(editor,'image').locator('.creator-image-frame').evaluate(el=>getComputedStyle(el).aspectRatio),'16 / 9',
    'the authored image ratio changes the real Canvas frame immediately');
  const setCrop=async(label,value,index=0)=>editor.getByLabel(label,{exact:true}).nth(index).evaluate((input,next)=>{input.value=String(next);input.dispatchEvent(new Event('input',{bubbles:true}))},value);
  await setCrop('Kivágás vízszintesen',18);await setCrop('Kivágás függőlegesen',82);
  assert.equal(await node(editor,'image').locator('img').evaluate(el=>getComputedStyle(el).objectPosition),'18% 82%');
  const imageAssetField=editor.locator('[data-content-key="assetId"]'),imageAssetMetadata=await assertNamedMediaPicker(imageAssetField.locator('.editor-media-picker'));assert.equal(imageAssetMetadata.labelText,'Médiatár');
  await editor.locator('.editor-media-picker').getByRole('button',{name:'Médiatár megnyitása'}).click();
  await editor.waitForFunction(()=>document.querySelectorAll('[data-content-key="assetId"] .editor-media-choice').length===1);
  assert.deepEqual(await imageAssetField.locator('.editor-media-choice').allTextContents(),['brand-mark.png'],'authored image picker excludes audio and video files');
  assert.equal(mediaListRequests.at(-1),'image','authored image picker requests the image MIME family');
  await editor.locator('.editor-media-choice').click();
  await editor.waitForFunction(id=>document.querySelector(`[data-node-id="${id}"] img`)?.getAttribute('src')==='/api/admin/media?id=6b1c2e65-e46e-4764-b234-123456789abc',ids.image);
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'Új képleírás','choosing an asset preserves a manually written alt');
  const authoredImageAlt=editor.getByLabel('Kép szöveges leírása',{exact:true});
  const authoredImageDecorative=editor.getByLabel('Csak díszítő kép',{exact:true});
  await authoredImageAlt.fill('Megőrzött kép leírása');
  await authoredImageDecorative.check();
  assert.equal(await authoredImageAlt.inputValue(),'Megőrzött kép leírása','decorative mode never deletes the authored image description');
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'','decorative authored images expose an empty alternative text in the Canvas');
  await authoredImageDecorative.uncheck();
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'Megőrzött kép leírása','turning decorative mode off restores the preserved description without retyping');
  await authoredImageAlt.fill('');
  await editor.waitForFunction(()=>document.querySelector('.editor-publication-warning')?.textContent.includes('Adj meg képleírást, vagy jelöld a képet díszítőnek.'));
  assert.equal(await authoredImageDecorative.isChecked(),false,'a content image with an empty alt is not silently treated as decorative');
  await authoredImageDecorative.check();
  await editor.waitForFunction(()=>document.querySelector('.editor-publication-warning')?.hidden===true);
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'','an explicitly decorative content image clears its required-alt publication warning');
  assert.equal(posts.length,1,'authored image accessibility edits stay in the local draft until explicit Save');
  await authoredImageDecorative.uncheck();
  assert.equal(await node(editor,'image').locator('img').getAttribute('alt'),'','switching a deliberately empty-alt image back to informative mode does not invent a description');
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
  const authoredImageLoading=editor.locator('[data-content-key="loading"] select');
  await authoredImageLoading.selectOption('eager');
  assert.equal(await node(editor,'image').locator('img').getAttribute('loading'),'eager','the authored image loading Inspector choice updates the Canvas element');
  await authoredImageAlt.fill('Mentés után is megőrzött leírás');
  await authoredImageDecorative.check();
  assert.equal(await authoredImageAlt.inputValue(),'Mentés után is megőrzött leírás','enabling decorative mode preserves alt metadata through the next Save');
  await authoredImageAlt.fill('');
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
  const accordionRepeater=editor.locator('.content-repeater[data-content-key="items"]');
  await accordionRepeater.getByRole('button',{name:'Lenyitható részek hozzáadása',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Rész címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='3. elem');
  const addedAccordionItem=accordionRepeater.locator(':scope > fieldset').nth(2);
  await addedAccordionItem.getByLabel('Rész címe',{exact:true}).fill('Új kérdés');
  await addedAccordionItem.getByLabel('Szöveg',{exact:true}).fill('Új válasz');
  assert.deepEqual(await node(editor,'accordion').locator('summary').allTextContents(),
    ['Hogyan készült?','Hol találom?','Új kérdés'],'Accordion Add immediately creates an authored Canvas section');
  await accordionRepeater.getByRole('button',{name:'3. elem: Fel',exact:true}).press('Enter');
  assert.deepEqual(await node(editor,'accordion').locator('summary').allTextContents(),
    ['Hogyan készült?','Új kérdés','Hol találom?'],'Accordion reorder moves its complete authored row');
  await accordionRepeater.getByRole('button',{name:'3. elem: Eltávolítás',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Rész címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='2. elem');
  assert.deepEqual(await node(editor,'accordion').locator('summary').allTextContents(),
    ['Hogyan készült?','Új kérdés'],'Accordion Delete removes only the selected section');
  assert.equal(posts.length,countBeforeStructuralEdit,
    'Accordion Add/edit/reorder/Delete stays draft-only without implicit Save or Publish');
  await select('dropdown');
  await editor.getByLabel('Lenyitható csoport elnevezése',{exact:true}).fill('További lehetőségek');
  await editor.getByLabel('Első rész kezdetben nyitva',{exact:true}).check();
  const canvasDropdown=node(editor,'dropdown').getByRole('group',{name:'További lehetőségek'});
  assert.equal(await canvasDropdown.locator('details').first().evaluate(el=>el.open),true,
    'native first-open state is visible immediately on the Canvas');
  assert.equal(await canvasDropdown.locator('details').last().getAttribute('name'),null,
    'multi-open default does not accidentally make separate dropdown items exclusive');
  const dropdownSingleOpen=editor.getByLabel('Egyszerre csak egy nyitott rész',{exact:true});
  const canvasDropdownDetails=canvasDropdown.locator('details');
  await canvasDropdownDetails.last().locator('summary').click();
  assert.deepEqual(await canvasDropdownDetails.evaluateAll(items=>items.map(el=>el.open)),[true,true],
    'the default multi-open Dropdown keeps the first section open when its second section opens');
  await dropdownSingleOpen.check();
  const dropdownGroupName=await canvasDropdownDetails.first().getAttribute('name');
  assert.ok(dropdownGroupName,'single-open Dropdown assigns a native details group name');
  assert.equal(await canvasDropdownDetails.last().getAttribute('name'),dropdownGroupName,
    'single-open Dropdown shares one native details name across its sections');
  assert.deepEqual(await canvasDropdownDetails.evaluateAll(items=>items.map(el=>el.open)),[true,false],
    'single-open and initially-open options can be combined in the Dropdown Canvas');
  await canvasDropdownDetails.last().locator('summary').click();
  assert.deepEqual(await canvasDropdownDetails.evaluateAll(items=>items.map(el=>el.open)),[false,true],
    'opening another Canvas Dropdown section closes the previously open section');
  const dropdownRepeater=editor.locator('.content-repeater[data-content-key="items"]');
  await dropdownRepeater.getByRole('button',{name:'Lenyitható részek hozzáadása',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Rész címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='3. elem');
  const addedDropdownItem=dropdownRepeater.locator(':scope > fieldset').nth(2);
  await addedDropdownItem.getByLabel('Rész címe',{exact:true}).fill('Új rész');
  await addedDropdownItem.getByLabel('Szöveg',{exact:true}).fill('Új információ');
  assert.deepEqual(await node(editor,'dropdown').locator('summary').allTextContents(),
    ['További részletek','Másik rész','Új rész'],'Dropdown Add immediately creates an authored Canvas section');
  await dropdownRepeater.getByRole('button',{name:'3. elem: Fel',exact:true}).press('Enter');
  assert.deepEqual(await node(editor,'dropdown').locator('summary').allTextContents(),
    ['További részletek','Új rész','Másik rész'],'Dropdown reorder moves its complete authored row');
  await dropdownRepeater.getByRole('button',{name:'3. elem: Eltávolítás',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Rész címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='2. elem');
  assert.deepEqual(await node(editor,'dropdown').locator('summary').allTextContents(),
    ['További részletek','Új rész'],'Dropdown Delete removes only the selected section');
  assert.equal(posts.length,countBeforeStructuralEdit,
    'Dropdown Add/edit/reorder/Delete stays draft-only without implicit Save or Publish');
  await select('gallery');
  const galleryRepeater=editor.locator('.content-repeater[data-content-key="items"]');
  await galleryRepeater.getByRole('button',{name:'Képek hozzáadása',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Külső média címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='3. elem');
  const addedGalleryItem=galleryRepeater.locator(':scope > fieldset').nth(2);
  await addedGalleryItem.getByLabel('Külső média címe',{exact:true}).fill('/fixture.svg');
  await addedGalleryItem.getByLabel('Képleírás',{exact:true}).fill('Új képgaléria-kép');
  await addedGalleryItem.getByLabel('Képaláírás',{exact:true}).fill('Új képaláírás');
  assert.deepEqual(await node(editor,'gallery').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első kép','Második kép','Új képgaléria-kép'],'Gallery Add creates an editable image and Canvas item');
  await galleryRepeater.getByRole('button',{name:'3. elem: Fel',exact:true}).press('Enter');
  assert.deepEqual(await node(editor,'gallery').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első kép','Új képgaléria-kép','Második kép'],'Gallery reorder moves the selected image with its authored data');
  await galleryRepeater.getByRole('button',{name:'3. elem: Eltávolítás',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Külső média címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='2. elem');
  assert.equal(await galleryRepeater.locator(':scope > fieldset').count(),2,'Gallery Delete removes only the selected image row');
  assert.deepEqual(await node(editor,'gallery').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első kép','Új képgaléria-kép'],'Gallery Delete removes the original row without deleting the reordered new image');
  const survivingGalleryItem=galleryRepeater.locator(':scope > fieldset').nth(1);
  await survivingGalleryItem.getByLabel('Képleírás',{exact:true}).fill('Második kép');
  await survivingGalleryItem.getByLabel('Képaláírás',{exact:true}).fill('Második képaláírás');
  assert.equal(posts.length,countBeforeStructuralEdit,'Gallery Add/edit/reorder/Delete stays draft-only');
  await editor.getByLabel('Képgaléria elnevezése',{exact:true}).fill('Műhelyem & képeim');
  const galleryColumns=editor.getByLabel('Oszlopok asztalon',{exact:true});
  await galleryColumns.selectOption('4');
  const galleryTracks=tab=>tab.locator('.creator-gallery').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
  assert.equal(await galleryTracks(editor),4,'the authored desktop gallery column count updates the Canvas immediately');
  for(const [device,width,expected] of [['tablet',768,2],['mobile',390,1]]){
    await editor.locator(`.canvas-device-btn[data-device="${device}"]`).click();
    await editor.setViewportSize({width:1366,height:900});
    assert.equal(await galleryTracks(editor),expected,`${device} keeps its responsive gallery column override`);
  }
  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  assert.equal(await galleryTracks(editor),4,'returning to desktop restores the authored gallery column count');
  assert.equal(await node(editor,'gallery').getByRole('region',{name:'Műhelyem & képeim'}).count(),1,
    'the real Canvas image grid is a named gallery region');
  assert.equal(await node(editor,'gallery').locator('img').nth(1).getAttribute('alt'),'Második kép',
    'Canvas image descriptions are trimmed without rewriting the saved text');
  assert.equal(await node(editor,'gallery').locator('img').nth(1).locator('xpath=ancestor::figure').locator('figcaption').textContent(),'Második képaláírás',
    'Canvas captions and their accessible preview label use the trimmed text');
  assert.equal(await node(editor,'gallery').locator('.creator-image-zoom').nth(1).getAttribute('aria-label'),'Kép nagyítása: Második képaláírás',
    'the gallery zoom control must not expose surrounding whitespace');
  await setCrop('Kivágás vízszintesen',24);await setCrop('Kivágás függőlegesen',68);
  assert.equal(await node(editor,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectPosition),'24% 68%','repeater image crop edits the selected gallery item');
  const galleryItem=editor.locator('.content-repeater fieldset').first();
  const galleryItemFit=galleryItem.getByLabel('Kép illesztése',{exact:true});
  assert.equal(await node(editor,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectFit),'cover',
    'an authored gallery item starts with its current public fit mode');
  await galleryItemFit.selectOption('contain');
  assert.equal(await node(editor,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectFit),'contain',
    'a gallery item fit edit updates only the selected Canvas image immediately');
  assert.equal(posts.length,1,'gallery item fit remains draft-only before explicit Save');
  const gallerySecondItem=editor.locator('.content-repeater fieldset').nth(1);
  await gallerySecondItem.getByLabel('Képleírás',{exact:true}).fill('  Frissített képleírás  ');
  await gallerySecondItem.getByLabel('Képaláírás',{exact:true}).fill('  Frissített képaláírás  ');
  assert.equal(await node(editor,'gallery').locator('img').nth(1).getAttribute('alt'),'Frissített képleírás',
    'gallery Canvas exposes trimmed authored alt text without changing the repeater value');
  assert.equal(await node(editor,'gallery').locator('img').nth(1).locator('xpath=ancestor::figure').locator('figcaption').textContent(),
    'Frissített képaláírás','gallery Canvas exposes the authored caption immediately');
  assert.equal(await node(editor,'gallery').locator('.creator-image-zoom').nth(1).getAttribute('aria-label'),
    'Kép nagyítása: Frissített képaláírás','the gallery lightbox control tracks its edited accessible name');
  await galleryItem.getByLabel('Képleírás',{exact:true}).fill('');
  await galleryItem.getByRole('button',{name:'Médiatár megnyitása'}).click();await galleryItem.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'gallery').locator('img').first().getAttribute('alt'),'Márkajel','gallery item inherits metadata only when its own alt is empty');
  assert.equal(await node(editor,'gallery').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/api/admin/media?id='+assetId,'canvas zoom uses the selected private asset');
  await select('carousel');
  const carouselRepeater=editor.locator('.content-repeater[data-content-key="items"]');
  await carouselRepeater.getByRole('button',{name:'Lapozható képek hozzáadása',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Külső média címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='3. elem');
  const addedCarouselItem=carouselRepeater.locator(':scope > fieldset').nth(2);
  await addedCarouselItem.getByLabel('Külső média címe',{exact:true}).fill('/fixture.svg');
  await addedCarouselItem.getByLabel('Képleírás',{exact:true}).fill('Új dia');
  assert.deepEqual(await node(editor,'carousel').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első dia','Második dia','Új dia'],'Carousel Add immediately creates an editable slide');
  await carouselRepeater.getByRole('button',{name:'3. elem: Fel',exact:true}).press('Enter');
  assert.deepEqual(await node(editor,'carousel').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első dia','Új dia','Második dia'],'Carousel reorder moves the complete authored slide');
  await carouselRepeater.getByRole('button',{name:'3. elem: Eltávolítás',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Külső média címe'&&
    document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='2. elem');
  assert.equal(await carouselRepeater.locator(':scope > fieldset').count(),2,'Carousel Delete removes only the selected slide row');
  assert.deepEqual(await node(editor,'carousel').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első dia','Új dia'],'Carousel Delete removes the original slide rather than the moved new one');
  await carouselRepeater.locator(':scope > fieldset').nth(1).getByLabel('Képleírás',{exact:true}).fill('Második dia');
  assert.equal(posts.length,countBeforeStructuralEdit,'Carousel Add/edit/reorder/Delete stays draft-only');
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
  const carouselMetadata=await assertNamedMediaPicker(carouselItem.locator('.editor-media-picker'));assert.equal(carouselMetadata.labelText,'Médiatár');
  await carouselItem.getByRole('button',{name:'Médiatár megnyitása'}).click();await carouselItem.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'carousel').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/api/admin/media?id='+assetId);
  assert.equal(await node(editor,'carousel').locator('img').first().getAttribute('alt'),'Első dia','a manually written carousel alt is preserved');
  const carouselSecondItem=editor.locator('.content-repeater fieldset').nth(1);
  await carouselSecondItem.getByLabel('Képleírás',{exact:true}).fill('');
  await carouselSecondItem.getByRole('button',{name:'Médiatár megnyitása'}).click();await carouselSecondItem.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'carousel').locator('img').nth(1).getAttribute('alt'),'Márkajel',
    'an empty carousel alt inherits Media Library metadata while a manual alt remains unchanged');
  await select('video');
  assert.equal(await node(editor,'video').locator('video').getAttribute('poster'),'/fixture.svg','existing cover URL remains unchanged until selection');
  const posterPicker=editor.locator('[data-content-key="posterAssetId"]');
  const posterMetadata=await assertNamedMediaPicker(posterPicker.locator('.editor-media-picker'));assert.equal(posterMetadata.labelText,'Borítókép a Médiatárból');
  await posterPicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await posterPicker.locator('.editor-media-choice').click();
  assert.equal(await node(editor,'video').locator('video').getAttribute('poster'),'/api/admin/media?id='+assetId,'Editor video poster uses authenticated preview');
  assert.equal(await node(editor,'video').locator('video').getAttribute('src'),'/fixture.webm','choosing a cover does not change video source');
  const mutedField=editor.locator('[data-content-key="muted"] input'),autoplayField=editor.locator('[data-content-key="autoplay"] input'),loopField=editor.locator('[data-content-key="loop"] input');
  const postsBeforeAutoplay=posts.length;
  await autoplayField.check();
  assert.equal(await autoplayField.getAttribute('aria-invalid'),'true','Editor refuses unmuted autoplay at the authored-field boundary');
  assert.equal(await node(editor,'video').locator('video').getAttribute('autoplay'),null,'rejected autoplay never reaches the Canvas');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt'));
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt'));
  assert.equal(posts.length,postsBeforeAutoplay,'invalid unmuted autoplay blocks both Save and Publish');
  await autoplayField.uncheck();
  assert.equal(await autoplayField.getAttribute('aria-invalid'),null,'the invalid autoplay choice can be safely discarded');
  await mutedField.check();await autoplayField.check();await loopField.check();
  assert.equal(await node(editor,'video').locator('video').getAttribute('muted'),'', 'muted state previews immediately in the Canvas');
  assert.equal(await node(editor,'video').locator('video').getAttribute('loop'),'', 'loop state previews immediately in the Canvas');
  assert.equal(await node(editor,'video').locator('video').getAttribute('autoplay'),null, 'Editor preview never starts playback without an explicit user gesture');
  assert.equal(posts.length,postsBeforeAutoplay,'valid video settings remain draft-only before explicit Save');
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
  const listRepeater=editor.locator('.content-repeater[data-content-key="items"]');
  const postsBeforeListStructure=posts.length;
  await listRepeater.getByRole('button',{name:'Listaelemek hozzáadása',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='3. elem');
  assert.equal(await listRepeater.locator(':scope > fieldset').count(),3,'the List Add control creates a third editable row');
  const addedListItem=listRepeater.locator(':scope > fieldset').nth(2);
  await addedListItem.getByLabel('Szöveg',{exact:true}).fill('Új listapont');
  await addedListItem.getByLabel('Hivatkozás',{exact:true}).fill('/p/home');
  assert.equal(await node(editor,'list').locator('ol li').nth(2).getByRole('link',{name:'Új listapont'}).getAttribute('href'),'/p/home',
    'the added list item keeps its safe internal link in the Canvas');
  const addedListText=addedListItem.getByLabel('Szöveg',{exact:true});
  const listCanvasBeforeOversize=await node(editor,'list').locator('ol li').evaluateAll(items=>items.map(item=>item.textContent));
  await addedListText.evaluate(input=>{
    input.value='X'.repeat(20001);
    input.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false,inputType:'insertText',data:null}));
  });
  assert.equal(await addedListText.getAttribute('aria-invalid'),'true','the List repeater rejects text above its 20,000-character authored-content contract');
  assert.deepEqual(await node(editor,'list').locator('ol li').evaluateAll(items=>items.map(item=>item.textContent)),listCanvasBeforeOversize,
    'a rejected oversized List edit preserves the last-valid Canvas content and order');
  const postsBeforeInvalidListSave=posts.length;
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt mentés vagy publikálás előtt'));
  assert.equal(posts.length,postsBeforeInvalidListSave,'Save cannot persist an oversized List repeater text value');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt mentés vagy publikálás előtt'));
  assert.equal(posts.length,postsBeforeInvalidListSave,'Publish cannot bypass an invalid List repeater text value');
  assert.equal(published.pages[pageId].nodes[ids.list].props.items[0].text,'Első hivatkozás',
    'invalid List text leaves the existing published Page Model untouched');
  await addedListText.fill('Új listapont');
  assert.equal(await addedListText.getAttribute('aria-invalid'),null,'repairing oversized List text clears the inline validation error');
  assert.equal(posts.length,postsBeforeInvalidListSave,'repairing the List field remains draft-only until explicit Save');
  await listRepeater.getByRole('button',{name:'3. elem: Fel',exact:true}).press('Enter');
  assert.deepEqual(await node(editor,'list').locator('ol li').evaluateAll(items=>items.map(item=>item.textContent)),
    ['Második elem','Új listapont','Átírt listaelem'],'List reorder moves the complete text/link item one position up');
  await listRepeater.getByRole('button',{name:'3. elem: Eltávolítás',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='2. elem');
  assert.equal(await listRepeater.locator(':scope > fieldset').count(),2,'Delete removes only the selected list row');
  assert.deepEqual(await node(editor,'list').locator('ol li').evaluateAll(items=>items.map(item=>item.textContent)),
    ['Második elem','Új listapont'],'deleting a different row preserves the newly added item and its order');
  assert.equal(await node(editor,'list').locator('ol li').nth(1).getByRole('link',{name:'Új listapont'}).getAttribute('href'),'/p/home');
  assert.equal(posts.length,postsBeforeListStructure,'list Add, edit, reorder, and Delete stay draft-only without implicit Save or Publish');
  // Repeater keyboard actions also need to remain usable in the narrow phone
  // Inspector, with focus restored to the surviving row after each rerender.
  await editor.setViewportSize({width:390,height:800});
  await select('list');
  assert.equal(await editor.evaluate(()=>innerWidth),390,'the repeater keyboard path uses a real narrow mobile viewport');
  for(const name of ['Listaelemek hozzáadása','2. elem: Fel','2. elem: Eltávolítás']){
    assert.equal(await listRepeater.getByRole('button',{name,exact:true}).isVisible(),true,`mobile Inspector exposes ${name}`);
  }
  await listRepeater.getByRole('button',{name:'Listaelemek hozzáadása',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='3. elem');
  assert.equal(await editor.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Szöveg',
    'mobile Add restores keyboard focus to the new row text field');
  const mobileAddedRow=listRepeater.locator(':scope > fieldset').nth(2);
  await mobileAddedRow.getByLabel('Szöveg',{exact:true}).fill('Mobil listaelem');
  await listRepeater.getByRole('button',{name:'3. elem: Fel',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='2. elem: Le');
  assert.deepEqual(await node(editor,'list').locator('ol li').evaluateAll(items=>items.map(item=>item.textContent)),
    ['Második elem','Mobil listaelem','Új listapont'],'mobile keyboard reorder moves the complete row and preserves list content');
  await listRepeater.getByRole('button',{name:'2. elem: Eltávolítás',exact:true}).press('Enter');
  await editor.waitForFunction(()=>document.activeElement?.closest('fieldset')?.querySelector('legend')?.textContent==='2. elem');
  assert.equal(await editor.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Szöveg',
    'mobile Delete restores focus to the surviving row text field');
  assert.deepEqual(await node(editor,'list').locator('ol li').evaluateAll(items=>items.map(item=>item.textContent)),
    ['Második elem','Új listapont'],'mobile Delete restores the original valid list order');
  assert.equal(posts.length,postsBeforeListStructure,'mobile Add/reorder/Delete stays draft-only without implicit Save or Publish');
  await editor.setViewportSize({width:1366,height:900});
  const authoredMediaSources={video:'/fixture.webm?source=creator&v=2',audio:'/fixture.mp3?source=creator&v=2'};
  for(const [type,tag,originalSource] of [['video','video','/fixture.webm'],['audio','audio','/fixture.mp3']]){
    await select(type);
    const sourceField=editor.locator('.content-schema-field[data-content-key="src"] input');
    await sourceField.fill('javascript:alert(1)');
    assert.equal(await sourceField.getAttribute('aria-invalid'),'true',`${type} rejects executable media URLs at the Inspector boundary`);
    assert.equal(await node(editor,type).locator(tag).getAttribute('src'),originalSource,`invalid ${type} input leaves the previously committed playback source intact`);
    await editor.locator('#save').click();
    await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt'));
    assert.equal(posts.length,1,`an invalid ${type} source cannot be written by Save`);
    await sourceField.fill(authoredMediaSources[type]);
    assert.equal(await sourceField.getAttribute('aria-invalid'),null,`a safe same-site ${type} URL clears the field error`);
    assert.equal(await node(editor,type).locator(tag).getAttribute('src'),authoredMediaSources[type],`valid ${type} source edits reach the Canvas without saving`);
    assert.equal(posts.length,1,`valid ${type} edits remain draft-only until explicit Save`);
    const privatePreviews=[
      `/api/admin/media?id=${assetId}`,
      `/api/%61dmin/media?id=${assetId}`,
      `/%61pi/admin/media?id=${assetId}`,
      `/public/../api/admin/media?id=${assetId}`
    ];
    for(const privatePreview of privatePreviews){
      await sourceField.fill(privatePreview);
      assert.equal(await sourceField.getAttribute('aria-invalid'),'true',`${type} rejects authenticated Editor preview URL ${privatePreview} at the authored-content boundary`);
      assert.equal(await node(editor,type).locator(tag).getAttribute('src'),authoredMediaSources[type],`a private ${type} preview cannot replace the safe draft playback URL`);
      await editor.locator('#save').click();
      await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt mentés vagy publikálás előtt'))
        .catch(async error=>{throw new Error(`${error.message}; status=${await editor.locator('#saveStatus').textContent()}`)});
      assert.equal(posts.length,1,`Save cannot send rejected private ${type} preview ${privatePreview}`);
      await editor.locator('#publish').click();
      await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt mentés vagy publikálás előtt'));
      assert.equal(posts.length,1,`Publish cannot send rejected private ${type} preview ${privatePreview}`);
      assert.equal(published.pages[pageId].nodes[ids[type]].props.src,originalSource,`rejected ${type} publication leaves the public playback URL unchanged`);
    }
    await sourceField.fill(authoredMediaSources[type]);
    assert.equal(posts.length,1,`repairing the ${type} source still does not Save or Publish implicitly`);
  }
  // A 1440x900 desktop at 200% zoom exposes this 720x450 effective viewport.
  // Exercise a real authored Inspector field and its complete draft lifecycle
  // at that size; the shell-only layout test cannot detect a clipped or
  // unreachable content control.
  await editor.setViewportSize({width:720,height:450});
  assert.equal(await editor.evaluate(()=>[innerWidth,innerHeight].join('×')),'720×450','authored-field lifecycle runs at the planned 200% effective zoom / short viewport');
  await select('link');
  assert.equal(await editor.locator('#rightDock').getAttribute('aria-hidden'),'false','the Inspector is open at the short effective viewport');
  assert.equal(await editor.locator('#inspectorBody > .inspector-search').evaluate(el=>getComputedStyle(el).position),'static',
    'the sticky search header yields the short Inspector when it would otherwise cover its authored controls');
  const shortViewportLinkHref=editor.locator('[data-content-key="href"] input');
  await shortViewportLinkHref.scrollIntoViewIfNeeded();
  authoredLinkHref='https://artist.example.com/story?source=editor&mode=public&viewport=720x450';
  await shortViewportLinkHref.click();
  assert.equal(await shortViewportLinkHref.evaluate(el=>document.activeElement===el),true,'the actual authored link control accepts a pointer click at 200% effective zoom');
  await shortViewportLinkHref.fill(authoredLinkHref);
  const shortViewportField=await shortViewportLinkHref.evaluate(el=>{
    const r=el.getBoundingClientRect(),dock=el.closest('#rightDock .dock-content'),d=dock.getBoundingClientRect();
    return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,dockLeft:d.left,dockRight:d.right,dockTop:d.top,dockBottom:d.bottom,
      horizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,
      focused:document.activeElement===el};
  });
  assert.ok(shortViewportField.left>=0&&shortViewportField.right<=720&&shortViewportField.top>=shortViewportField.dockTop&&shortViewportField.bottom<=shortViewportField.dockBottom,
    `the actual Inspector link field is not clipped at 200% effective zoom: ${JSON.stringify(shortViewportField)}`);
  assert.equal(shortViewportField.horizontalOverflow,false,'the authored Inspector interaction adds no page-level horizontal overflow');
  assert.equal(shortViewportField.focused,true,'the authored link control remains keyboard-focusable');
  await select('gallery');
  const shortGalleryItem=editor.locator('.content-repeater fieldset').nth(1);
  for(const [label,name] of [['Képleírás','gallery item alt'],['Képaláírás','gallery item caption']]){
    const field=shortGalleryItem.getByLabel(label,{exact:true});
    await field.scrollIntoViewIfNeeded();await field.click();
    const bounds=await field.evaluate(el=>{
      const r=el.getBoundingClientRect(),dock=el.closest('#rightDock .dock-content').getBoundingClientRect();
      return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,dockLeft:dock.left,dockRight:dock.right,dockTop:dock.top,dockBottom:dock.bottom,
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,focused:document.activeElement===el};
    });
    assert.ok(bounds.left>=Math.max(0,bounds.dockLeft)&&bounds.right<=Math.min(720,bounds.dockRight)
      &&bounds.top>=bounds.dockTop&&bounds.bottom<=bounds.dockBottom,
      `${name} field is fully reachable in the 200% effective viewport: ${JSON.stringify(bounds)}`);
    assert.equal(bounds.overflow,false,`${name} field adds no horizontal page overflow at 200% effective zoom`);
    assert.equal(bounds.focused,true,`${name} field is pointer/keyboard focusable at 200% effective zoom`);
  }
  assert.equal(posts.length,1,'editing the authored field at short viewport remains draft-only before Save');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));assert.equal(posts.at(-1).publish,false);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.link].props.href,authoredLinkHref,'Save stores the authored link destination in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.link].props.target,'_blank','Save stores the authored link target in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.link].props.ariaLabel,authoredLinkLabel,'Save stores the authored link accessible name in the draft');
  assert.deepEqual(posts.at(-1).document.pages[pageId].nodes[ids.list].props.items,
    [{text:'Második elem'},{text:'Új listapont',href:'/p/home'}],
    'explicit Save persists the list Add/reorder/Delete result and its internal link');
  assert.deepEqual(posts.at(-1).document.pages[pageId].nodes[ids.accordion].props.items,
    [{title:'Hogyan készült?',text:'A kulisszák mögött.'},{title:'Új kérdés',text:'Új válasz'}],
    'explicit Save persists the Accordion Add/reorder/Delete result as exact Page Model rows');
  assert.deepEqual(posts.at(-1).document.pages[pageId].nodes[ids.dropdown].props.items,
    [{title:'További részletek',text:'Kiegészítés'},{title:'Új rész',text:'Új információ'}],
    'explicit Save persists the Dropdown Add/reorder/Delete result as exact Page Model rows');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.items.length,2,
    'explicit Save retains exactly the two surviving Gallery rows after Add/reorder/Delete');
  assert.deepEqual(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.items.map(item=>item.alt),
    ['Márkajel','  Frissített képleírás  '],'Save preserves Gallery row order and exact authored description values');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.carousel].props.items.length,2,
    'explicit Save retains exactly the two surviving Carousel slides after Add/reorder/Delete');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.carousel].props.items[1].alt,'Márkajel',
    'Save preserves the selected Carousel row and its inherited Media Library alt');
  assert.deepEqual(posts.at(-1).document.pages[pageId].nodes[ids.table].props.rows,expectedTableRows,
    'Save retains every long table cell and its final edit in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.table].props.caption,'Frissített eredmények',
    'Save persists the authored table caption without publishing it');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.table].props.header,false,
    'Save persists the authored first-row header setting in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.video].props.posterAssetId,assetId,'Save retains poster ID as draft only');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.video].props.src,authoredMediaSources.video,'Save stores the validated video playback URL in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.video].props.muted,true,'Save persists the required mute state with autoplay');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.video].props.autoplay,true,'Save persists the authored muted-autoplay setting');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.video].props.loop,true,'Save persists the authored loop setting');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.audio].props.src,authoredMediaSources.audio,'Save stores the validated audio playback URL in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.image].props.assetId,assetId,'Save persists the site asset reference but never publishes it');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.image].props.decorative,true,'Save persists the explicit decorative choice');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.image].props.alt,'','Save keeps the empty alt separate from the preserved description case');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.image].props.loading,'eager','Save persists the authored image loading strategy');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.image].props.fit,'cover','Save persists the authored image fit mode in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.image].props.ratio,'16 / 9','Save persists the authored image ratio in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.columns,'4','Save persists the authored desktop gallery column count in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.dropdown].props.singleOpen,true,
    'Save persists the Dropdown single-open setting in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.dropdown].props.openFirst,true,
    'Save persists the Dropdown initial-open setting separately in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.items[0].fit,'contain','Save persists the selected gallery item fit in the draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.items[0].assetId,assetId);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.items[0].alt,'Márkajel',
    'Save persists inherited Media Library alt metadata as the gallery item description');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.items[1].alt,'  Frissített képleírás  ',
    'Save retains the authored gallery alt value exactly instead of normalizing source data');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.gallery].props.items[1].caption,'  Frissített képaláírás  ',
    'Save retains the authored gallery caption exactly instead of normalizing source data');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.carousel].props.items[1].alt,'Márkajel',
    'Save persists the inherited Media Library description on the carousel item');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.button].responsive.desktop.backgroundAssetId,assetId,'Save stores the background asset ID');
  await live.goto(base+'/p/test');assert.equal(await live.locator('h1[data-node-id]').textContent(),'Alkotói főcím');
  assert.equal(await galleryTracks(live),3,'draft Save leaves the original published gallery column count unchanged');
  assert.equal(await node(live,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectFit),'cover',
    'draft Save leaves the previously published gallery item fit unchanged');
  assert.equal(await node(live,'image').locator('.creator-image-frame').evaluate(el=>getComputedStyle(el).aspectRatio),'1 / 1',
    'the current published image keeps its original square ratio after draft Save');
  assert.equal(await node(live,'link').getAttribute('href'),'mailto:creator@example.com','draft Save does not publish the authored link destination');
  assert.equal(await node(live,'link').textContent(),'Kapcsolat','draft Save does not publish the authored link text');
  assert.deepEqual(await node(live,'list').locator('ol li').evaluateAll(items=>items.map(item=>item.textContent)),
    ['Első hivatkozás','Második elem'],'draft Save leaves the original public List unchanged');
  assert.equal(await node(live,'list').locator('ol li').first().getByRole('link',{name:'Első hivatkozás'}).getAttribute('href'),'/p/home');
  assert.equal(await node(live,'table').locator('caption').textContent(),'Eredmények','draft Save leaves the previous public table caption unchanged');
  assert.equal(await node(live,'table').locator('th[scope=col]').count(),2,'draft Save leaves the previous public table header unchanged');
  assert.equal(await node(live,'icon').getAttribute('aria-label'),'Kedvenc','Save keeps the previous published icon name live');
  assert.equal(await node(live,'icon').getAttribute('role'),'img');
  assert.equal(await node(live,'video').locator('video').getAttribute('poster'),'/fixture.svg','Save never publishes the newly chosen poster');
  assert.equal(await node(live,'video').locator('video').getAttribute('src'),'/fixture.webm','video source Save remains separate from the currently published page');
  assert.equal(await node(live,'video').locator('video').getAttribute('muted'),null,'Save does not publish the newly authored mute state');
  assert.equal(await node(live,'video').locator('video').getAttribute('autoplay'),null,'Save does not publish autoplay');
  assert.equal(await node(live,'video').locator('video').getAttribute('loop'),null,'Save does not publish loop');
  assert.equal(await node(live,'audio').locator('audio').getAttribute('src'),'/fixture.mp3','audio source Save remains separate from the currently published page');
  assert.equal(await node(live,'gallery').locator('.creator-image-zoom').first().getAttribute('data-lightbox-src'),'/fixture.svg','Save does not publish the new gallery image');
  assert.equal(await node(live,'gallery').locator('img').nth(1).getAttribute('alt'),'Második kép',
    'draft Save leaves the prior public gallery description live');
  assert.equal(await node(live,'gallery').locator('img').nth(1).locator('xpath=ancestor::figure').locator('figcaption').textContent(),
    'Második képaláírás','draft Save leaves the prior public gallery caption live');
  assert.equal(await node(live,'gallery').getByRole('region',{name:'Eredeti képrács'}).count(),1,
    'gallery Inspector name stays draft-only after Save');
  assert.equal(await node(live,'gallery').locator('img').count(),2,'draft Save does not expose the authored Gallery structure');
  assert.deepEqual(await node(live,'gallery').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első kép','Második kép'],'draft Save leaves the old public Gallery slides unchanged');
  assert.equal(await node(live,'tabs').getByRole('tablist',{name:'Eredeti fülek'}).count(),1,
    'tablist Inspector name stays draft-only after Save');
  assert.equal(await node(live,'accordion').getByRole('group',{name:'Harmonika'}).count(),1,
    'Accordion naming changes remain draft-only until Publish');
  assert.deepEqual(await node(live,'accordion').locator('summary').allTextContents(),
    ['Hogyan készült?','Hol találom?'],'draft Save leaves the public Accordion items unchanged');
  assert.deepEqual(await node(live,'accordion').locator('details').evaluateAll(items=>items.map(item=>item.textContent.trim())),
    ['Hogyan készült?A kulisszák mögött.','Hol találom?A szerkesztőben.'],
    'draft Save leaves the original public Accordion answers unchanged');
  assert.deepEqual(await node(live,'dropdown').locator('summary').allTextContents(),
    ['További részletek','Másik rész'],'draft Save leaves the public Dropdown items unchanged');
  assert.equal(await node(live,'dropdown').locator('details').first().evaluate(el=>el.open),false,
    'first-open setting remains private after Save');
  assert.equal(await node(live,'carousel').locator('img').count(),2,'draft Save does not expose the authored Carousel structure');
  assert.deepEqual(await node(live,'carousel').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első dia','Második dia'],'draft Save leaves the old public Carousel slides unchanged');
  assert.deepEqual(await node(live,'dropdown').locator('details').evaluateAll(items=>items.map(el=>el.getAttribute('name'))),[null,null],
    'single-open remains private on the public page until the separate Publish action');
  assert.deepEqual(await node(live,'dropdown').locator('details').evaluateAll(items=>items.map(el=>el.open)),[false,false],
    'draft Save keeps the previous public Dropdown state unchanged');
  assert.equal(await node(live,'button').getAttribute('href'),'/p/home','Save keeps the prior published link live');
  assert.equal(await node(live,'carousel').locator('.creator-carousel').getAttribute('aria-label'),'Alkotói galéria',
    'a newly named carousel is still draft-only after Save');
  assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),'none','draft background stays private before Publish');
  assert.equal(await node(live,'image').locator('img').evaluate(el=>getComputedStyle(el).objectPosition),'50% 50%','Save does not publish image crop');
  assert.equal(await node(live,'image').locator('.creator-image-frame').evaluate(el=>getComputedStyle(el).aspectRatio),'1 / 1','draft Save keeps the original published image ratio');
  assert.equal(await node(live,'image').locator('img').evaluate(el=>getComputedStyle(el).objectFit),'contain','draft Save keeps the original published image fit');
  assert.equal(await node(live,'image').locator('img').getAttribute('loading'),'lazy','draft Save does not publish the authored image loading strategy');
  await editor.reload();await select('table');
  await select('list');
  assert.deepEqual(await node(editor,'list').locator('ol li').evaluateAll(items=>items.map(item=>item.textContent)),
    ['Második elem','Új listapont'],'Editor reload restores the saved list order before separate Publish');
  assert.equal(await listRepeater.locator(':scope > fieldset').count(),2,'Editor reload restores the exact saved list row count');
  assert.equal(await listRepeater.locator(':scope > fieldset').nth(1).getByLabel('Hivatkozás',{exact:true}).inputValue(),'/p/home');
  await select('accordion');
  assert.deepEqual(await accordionRepeater.locator(':scope > fieldset').evaluateAll(rows=>rows.map(row=>[
    row.querySelector('input')?.value,row.querySelector('textarea')?.value
  ])),[['Hogyan készült?','A kulisszák mögött.'],['Új kérdés','Új válasz']],
  'Editor reload restores the saved Accordion row order and content before separate Publish');
  assert.deepEqual(await node(editor,'accordion').locator('summary').allTextContents(),
    ['Hogyan készült?','Új kérdés'],'the reloaded Accordion Canvas matches the saved repeater order');
  await select('table');
  assert.equal(await editor.locator('.content-schema-field[data-content-key="rows"] textarea').inputValue(),serializeTableTsv(expectedTableRows),
    'reload restores the complete long table before separate Publish');
  assert.equal(await editor.getByLabel('Táblázat címe',{exact:true}).inputValue(),'Frissített eredmények',
    'reload restores the authored table caption from the saved draft');
  assert.equal(await editor.getByLabel('Az első sor fejléc',{exact:true}).isChecked(),false,
    'reload restores the authored first-row header setting from the saved draft');
  assert.equal(await node(editor,'table').locator('caption').textContent(),'Frissített eredmények');
  assert.equal(await node(editor,'table').locator('th[scope=col]').count(),0,
    'the reloaded Canvas preserves the authored data-row semantics');
  for(const type of ['video','audio']){
    await select(type);
    assert.equal(await editor.locator('.content-schema-field[data-content-key="src"] input').inputValue(),authoredMediaSources[type],
      `Editor reload restores the saved ${type} source without publishing it`);
  }
  await select('video');
  assert.equal(await mutedField.isChecked(),true,'Editor reload restores the authored video mute state');
  assert.equal(await autoplayField.isChecked(),true,'Editor reload restores the authored autoplay setting');
  assert.equal(await loopField.isChecked(),true,'Editor reload restores the authored loop setting');
  await select('image');
  assert.equal(await editor.getByLabel('Kép illesztése',{exact:true}).inputValue(),'cover','Editor reload restores the authored image fit mode');
  assert.equal(await editor.getByLabel('Csak díszítő kép',{exact:true}).isChecked(),true,'Editor reload restores the authored decorative image mode');
  assert.equal(await editor.getByLabel('Képarány',{exact:true}).inputValue(),'16 / 9','Editor reload restores the authored image ratio');
  assert.equal(await editor.getByLabel('Kép szöveges leírása',{exact:true}).inputValue(),'','Editor reload preserves the intentionally empty alt value');
  assert.equal(await editor.locator('[data-content-key="loading"] select').inputValue(),'eager','Editor reload restores the authored image loading strategy');
  await select('gallery');
  assert.equal(await galleryRepeater.locator(':scope > fieldset').count(),2,'Editor reload restores the exact saved Gallery row count');
  assert.deepEqual(await node(editor,'gallery').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Márkajel','Frissített képleírás'],'Editor reload restores the saved Gallery item order and normalized Canvas descriptions');
  assert.equal(await editor.getByLabel('Képgaléria elnevezése',{exact:true}).inputValue(),'Műhelyem & képeim',
    'Editor reload restores the authored gallery region name from the saved draft');
  await select('dropdown');
  assert.deepEqual(await dropdownRepeater.locator(':scope > fieldset').evaluateAll(rows=>rows.map(row=>[
    row.querySelector('input')?.value,row.querySelector('textarea')?.value
  ])),[['További részletek','Kiegészítés'],['Új rész','Új információ']],
  'Editor reload restores the saved Dropdown row order and content before separate Publish');
  assert.deepEqual(await node(editor,'dropdown').locator('summary').allTextContents(),
    ['További részletek','Új rész'],'the reloaded Dropdown Canvas matches the saved repeater order');
  assert.equal(await dropdownSingleOpen.isChecked(),true,'Editor reload restores the saved Dropdown single-open setting');
  assert.equal(await editor.getByLabel('Első rész kezdetben nyitva',{exact:true}).isChecked(),true,
    'Editor reload restores the saved Dropdown initial-open setting');
  const reloadedDropdown=node(editor,'dropdown').getByRole('group',{name:'További lehetőségek'}).locator('details');
  const reloadedDropdownName=await reloadedDropdown.first().getAttribute('name');
  assert.ok(reloadedDropdownName,'reloaded Dropdown retains its native single-open group name');
  assert.equal(await reloadedDropdown.last().getAttribute('name'),reloadedDropdownName,
    'reloaded Dropdown keeps both sections in the same exclusive group');
  assert.deepEqual(await reloadedDropdown.evaluateAll(items=>items.map(el=>el.open)),[true,false],
    'Editor reload restores the initial-open Canvas state');
  await select('gallery');
  assert.equal(await editor.getByLabel('Oszlopok asztalon',{exact:true}).inputValue(),'4','Editor reload restores the authored gallery column count');
  assert.equal(await galleryTracks(editor),4,'reloaded desktop Canvas retains the authored gallery column count');
  assert.equal(await editor.locator('.content-repeater fieldset').first().getByLabel('Kép illesztése',{exact:true}).inputValue(),'contain',
    'Editor reload restores the authored gallery item fit');
  assert.equal(await editor.locator('.content-repeater fieldset').first().getByLabel('Képleírás',{exact:true}).inputValue(),'Márkajel',
    'Editor reload restores the alt description inherited when the Media Library image was selected');
  assert.equal(await editor.locator('.content-repeater fieldset').nth(1).getByLabel('Képleírás',{exact:true}).inputValue(),
    '  Frissített képleírás  ','Editor reload restores the exact authored gallery alt value');
  assert.equal(await editor.locator('.content-repeater fieldset').nth(1).getByLabel('Képaláírás',{exact:true}).inputValue(),
    '  Frissített képaláírás  ','Editor reload restores the exact authored gallery caption');
  await select('carousel');
  assert.equal(await carouselRepeater.locator(':scope > fieldset').count(),2,'Editor reload restores the exact saved Carousel row count');
  assert.deepEqual(await node(editor,'carousel').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első dia','Márkajel'],'Editor reload restores the saved Carousel slide order and inherited media metadata');
  assert.equal(await editor.locator('.content-repeater fieldset').nth(1).getByLabel('Képleírás',{exact:true}).inputValue(),'Márkajel',
    'Editor reload restores inherited Media Library alt metadata on the carousel item');
  await select('link');
  assert.equal(await editor.locator(`.plain-text-editor[data-text-node-id="${ids.link}"]`).inputValue(),authoredLinkText,'Editor reload restores the authored link text');
  assert.equal(await editor.locator('[data-content-key="href"] input').inputValue(),authoredLinkHref,'Editor reload restores the authored link destination');
  assert.equal(await editor.locator('[data-content-key="target"] select').inputValue(),'_blank','Editor reload restores the authored link target');
  assert.equal(await editor.locator('[data-content-key="ariaLabel"] input').inputValue(),authoredLinkLabel,'Editor reload restores the authored link accessible name');
  await select('heading');assert.equal(await editor.getByLabel('Címsor szemantikai szintje',{exact:true}).inputValue(),'3');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  await live.setViewportSize({width:720,height:450});await live.reload();
  assert.deepEqual(await node(live,'list').locator('ol li').evaluateAll(items=>items.map(item=>item.textContent)),
    ['Második elem','Új listapont'],'separate Publish exposes the saved List order on the public page');
  assert.equal(await node(live,'list').locator('ol li').nth(1).getByRole('link',{name:'Új listapont'}).getAttribute('href'),'/p/home',
    'separate Publish exposes the saved safe internal list link');
  assert.equal(await node(live,'link').getAttribute('href'),authoredLinkHref,'separate Publish exposes the authored link destination');
  assert.equal(await node(live,'link').getAttribute('target'),'_blank');
  assert.equal(await node(live,'link').getAttribute('rel'),'noopener noreferrer');
  assert.equal(await node(live,'link').getAttribute('aria-label'),authoredLinkLabel);
  assert.equal(await node(live,'link').textContent(),authoredLinkText,'separate Publish exposes the authored link text');
  // Continue the remaining rich-media regression at its original desktop
  // viewport; the short-viewport Save/Publish assertions above are complete.
  await editor.setViewportSize({width:1366,height:900});await live.setViewportSize({width:1366,height:900});
  assert.equal(await node(live,'icon').getAttribute('aria-label'),null,'Publish removes a whitespace-only icon name');
  assert.equal(await node(live,'icon').getAttribute('role'),null);
  assert.equal(await node(live,'icon').getAttribute('aria-hidden'),'true','published unnamed icon is decorative');
  assert.equal(await node(live,'video').locator('video').getAttribute('poster'),'/media/'+assetId,'Publish uses guarded site image route for poster');
  assert.equal(await node(live,'video').locator('video').getAttribute('src'),authoredMediaSources.video,'separate Publish exposes the validated video source to the public page');
  assert.equal(await node(live,'video').locator('video').getAttribute('muted'),'', 'separate Publish exposes the authored muted setting');
  assert.equal(await node(live,'video').locator('video').getAttribute('autoplay'),'', 'separate Publish exposes autoplay only with the required mute state');
  assert.equal(await node(live,'video').locator('video').getAttribute('loop'),'', 'separate Publish exposes the authored loop setting');
  assert.equal(await node(live,'audio').locator('audio').getAttribute('src'),authoredMediaSources.audio,'separate Publish exposes the validated audio source to the public page');
  assert.equal(await node(live,'image').locator('img').getAttribute('src'),'/media/'+assetId,'published content resolves the public media route');
  assert.equal(await live.locator(`h3[data-node-id="${ids.heading}"]`).textContent(),'Módosított főcím');
  assert.equal(await node(live,'button').getAttribute('href'),'/p/updated');assert.equal(await node(live,'button').getAttribute('rel'),'noopener noreferrer');
  assert.equal(await node(live,'button').getAttribute('aria-label'),'Alkotói bemutatkozás megnyitása');
  // The public hover state intentionally removes this image. Move the pointer
  // outside the centered page before asserting its non-hover published style;
  // Chromium can preserve pointer coordinates across reload and viewport resize.
  await live.mouse.move(1350,890);
  assert.equal(await node(live,'button').evaluate(el=>el.matches(':hover')),false,'published base background is checked outside the intentionally image-free hover state');
  assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),/\/media\/6b1c2e65-e46e-4764-b234-123456789abc/,'Publish serves the background through the guarded public route');
  assert.match(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundPosition),/^50% 0%/);
  await node(live,'button').hover();await live.waitForFunction(id=>getComputedStyle(document.querySelector(`[data-node-id="${id}"]`)).backgroundColor==='rgb(220, 20, 60)',ids.button);
  assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
  await live.keyboard.press('Tab');await node(live,'button').focus();await live.waitForFunction(id=>getComputedStyle(document.querySelector(`[data-node-id="${id}"]`)).backgroundColor==='rgb(37, 99, 235)',ids.button);
  assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).rotate),'3deg');
  await live.emulateMedia({reducedMotion:'reduce'});assert.equal(await node(live,'button').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  assert.equal(await node(live,'image').locator('img').getAttribute('alt'),'','separate Publish exposes the explicit decorative image as empty alt');assert.equal(await node(live,'image').locator('img').getAttribute('role'),null,'native empty-alt semantics remain intact without an unnecessary role override');assert.equal(await node(live,'image').locator('img').evaluate(el=>getComputedStyle(el).objectPosition),'18% 82%');assert.equal(await node(live,'image').locator('figcaption').textContent(),'Képaláírás');
  assert.equal(await node(live,'image').locator('.creator-image-frame').evaluate(el=>getComputedStyle(el).aspectRatio),'16 / 9','separate Publish exposes the authored image ratio on the public page');
  assert.equal(await node(live,'image').locator('img').evaluate(el=>getComputedStyle(el).objectFit),'cover','separate Publish exposes the authored image fit mode on the public page');
  assert.equal(await node(live,'image').locator('img').getAttribute('loading'),'eager','separate Publish exposes the authored loading strategy');
  assert.equal(await galleryTracks(live),4,'separate Publish exposes the authored desktop gallery column count');
  assert.equal(await node(live,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectFit),'contain',
    'separate Publish exposes the authored gallery item fit on the public page');
  assert.equal(await node(live,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectPosition),'24% 68%','published gallery item retains its independent crop');
  assert.equal(await node(live,'gallery').locator('img').first().getAttribute('alt'),'Márkajel',
    'separate Publish exposes the inherited Media Library alt on the public gallery image');
  assert.equal(await node(live,'gallery').locator('img').nth(1).getAttribute('alt'),'Frissített képleírás',
    'separate Publish renders the authored gallery alt after Save/reload');
  assert.equal(await node(live,'gallery').locator('img').nth(1).locator('xpath=ancestor::figure').locator('figcaption').textContent(),
    'Frissített képaláírás','separate Publish renders the authored gallery caption after Save/reload');
  assert.equal(await node(live,'gallery').locator('.creator-image-zoom').nth(1).getAttribute('aria-label'),
    'Kép nagyítása: Frissített képaláírás','published gallery zoom control uses the authored accessible caption');
  assert.equal(await node(live,'gallery').getByRole('region',{name:'Műhelyem & képeim'}).count(),1,
    'Publish exposes the new image grid accessible name');
  assert.equal(await node(live,'tabs').getByRole('tablist',{name:'Bemutatkozás & videók'}).count(),1,
    'Publish exposes the new tablist accessible name');
  assert.equal(await node(live,'accordion').getByRole('group',{name:'Kérdések & válaszok'}).count(),1,
    'Publish exposes the editable Accordion group name');
  assert.equal(await node(live,'dropdown').getByRole('group',{name:'További lehetőségek'}).count(),1,
    'Publish exposes the editable Dropdown group name');
  assert.deepEqual(await node(live,'accordion').locator('summary').allTextContents(),
    ['Hogyan készült?','Új kérdés'],'separate Publish exposes the saved Accordion row order');
  assert.deepEqual(await node(live,'accordion').locator('details').evaluateAll(items=>items.map(item=>item.textContent.trim())),
    ['Hogyan készült?A kulisszák mögött.','Új kérdésÚj válasz'],
    'separate Publish exposes the saved Accordion answers');
  assert.deepEqual(await node(live,'dropdown').locator('summary').allTextContents(),
    ['További részletek','Új rész'],'separate Publish exposes the saved Dropdown row order');
  assert.deepEqual(await node(live,'dropdown').locator('details').evaluateAll(items=>items.map(item=>item.textContent.trim())),
    ['További részletekKiegészítés','Új részÚj információ'],
    'separate Publish exposes the saved Dropdown content');
  assert.equal(await node(live,'gallery').locator('img').count(),2,'separate Publish exposes only the two saved Gallery rows');
  assert.deepEqual(await node(live,'gallery').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Márkajel','Frissített képleírás'],'separate Publish exposes the saved Gallery row order and descriptions');
  assert.equal(await node(live,'carousel').locator('img').count(),2,'separate Publish exposes only the two saved Carousel slides');
  assert.deepEqual(await node(live,'carousel').locator('img').evaluateAll(items=>items.map(item=>item.getAttribute('alt'))),
    ['Első dia','Márkajel'],'separate Publish exposes the saved Carousel row order and media metadata');
  const publishedDropdown=node(live,'dropdown').getByRole('group',{name:'További lehetőségek'}).locator('details');
  const publishedDropdownName=await publishedDropdown.first().getAttribute('name');
  assert.ok(publishedDropdownName,'separate Publish exposes the native Dropdown group');
  assert.equal(await publishedDropdown.last().getAttribute('name'),publishedDropdownName,
    'separate Publish groups the Dropdown sections under one native details name');
  assert.equal(await node(live,'carousel').getByRole('region',{name:'Képes történeteim & fotók'}).count(),1,
    'published carousel region inherits the exact accessible Inspector name');
  assert.equal(await node(live,'carousel').locator('img').nth(1).getAttribute('alt'),'Márkajel',
    'separate Publish renders the inherited Media Library description on the public carousel slide');
  // Audio playback controls are part of the authored lifecycle, not merely a
  // renderer default: an incomplete draft may be saved, but must stay private
  // until the required native controls are restored and explicitly Published.
  await select('audio');
  const controlsField=editor.locator('.content-schema-field[data-content-key="controls"] input');
  const audioLoopDraft=editor.locator('.content-schema-field[data-content-key="loop"] input');
  assert.equal(await controlsField.isChecked(),true,'audio controls default to the accessible native player');
  const beforeAudioLoopEdit=posts.length;
  await audioLoopDraft.check();
  assert.equal(await node(editor,'audio').locator('audio').getAttribute('loop'),'', 'audio loop previews immediately in the Canvas');
  assert.equal(posts.length,beforeAudioLoopEdit,'audio loop editing remains local until explicit Save');
  await controlsField.uncheck();
  assert.equal(await node(editor,'audio').locator('audio').getAttribute('controls'),null,'the invalid audio draft visibly reflects the missing controls');
  assert.match(await editor.locator('.editor-publication-warning').textContent(),/hanglejátszó vezérlőit nem rejtheted el/,
    'the Inspector explains why hiding native audio controls cannot be published');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'an incomplete but normalized audio state can be saved only as a draft');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.audio].props.controls,false);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.audio].props.loop,true);
  await live.reload();
  assert.equal(await node(live,'audio').locator('audio').getAttribute('controls'),'', 'draft Save leaves the previous accessible public audio player unchanged');
  assert.equal(await node(live,'audio').locator('audio').getAttribute('loop'),null, 'draft Save leaves the previous published loop setting unchanged');
  await editor.reload();
  await select('audio');
  const controlsAfterReload=editor.locator('.content-schema-field[data-content-key="controls"] input');
  const loopAfterReload=editor.locator('.content-schema-field[data-content-key="loop"] input');
  assert.equal(await controlsAfterReload.isChecked(),false,'reload restores the intentionally incomplete audio draft');
  assert.equal(await loopAfterReload.isChecked(),true,'reload restores the authored audio loop setting');
  assert.equal(await editor.locator('#publish').isDisabled(),false,
    'the separate Publish action remains available; the server is the authoritative content-validation gate');
  await controlsAfterReload.check();
  assert.equal(await editor.locator('#publish').isDisabled(),false,'restoring native controls clears the publication blocker');
  const beforeAudioPublish=posts.length;
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  assert.equal(posts.length,beforeAudioPublish+1);
  assert.equal(posts.at(-1).publish,true,'the repaired audio content reaches the distinct Publish operation');
  await live.reload();
  assert.equal(await node(live,'audio').locator('audio').getAttribute('controls'),'', 'Publish exposes accessible native audio controls');
  assert.equal(await node(live,'audio').locator('audio').getAttribute('loop'),'', 'Publish exposes the authored audio loop setting');
  // Exercise the complete authored background-video contract. Hiding video
  // controls is allowed only when muted autoplay is also enabled; an
  // incomplete combination can be saved privately, then repaired and
  // published as a distinct operation.
  await select('video');
  const videoControlsField=editor.locator('.content-schema-field[data-content-key="controls"] input');
  const videoMutedField=editor.locator('.content-schema-field[data-content-key="muted"] input');
  const videoAutoplayField=editor.locator('.content-schema-field[data-content-key="autoplay"] input');
  assert.equal(await videoControlsField.isChecked(),true,'video starts with accessible playback controls');
  assert.equal(await videoMutedField.isChecked(),true,'video starts with the previously authored mute setting');
  assert.equal(await videoAutoplayField.isChecked(),true,'video starts with the previously authored autoplay setting');
  // Disable autoplay before unmuting so every intermediate command still
  // satisfies the Editor's invariant that autoplay video is muted.
  await videoAutoplayField.uncheck();await videoMutedField.uncheck();await videoControlsField.uncheck();
  assert.equal(await node(editor,'video').locator('video').getAttribute('controls'),null,
    'the Canvas immediately reflects the controls-free video draft');
  assert.equal(await node(editor,'video').locator('video').getAttribute('autoplay'),null,
    'the Editor never starts the invalid unmuted video automatically');
  assert.match(await editor.locator('.editor-publication-warning').textContent(),
    /háttérvideó csak némítva, automatikusan indulhat/,
    'the Inspector explains the complete muted-autoplay requirement for a background video');
  const beforeInvalidVideoSave=posts.length;
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.startsWith('Mentve'));
  assert.equal(posts.length,beforeInvalidVideoSave+1,'the incomplete video state requires an explicit draft Save');
  assert.equal(posts.at(-1).publish,false,'the incomplete video state is saved without implicit Publish');
  assert.deepEqual(
    (({controls,muted,autoplay})=>({controls,muted,autoplay}))(posts.at(-1).document.pages[pageId].nodes[ids.video].props),
    {controls:false,muted:false,autoplay:false},'Save retains the exact incomplete video flags in the private draft');
  await live.reload();
  assert.equal(await node(live,'video').locator('video').getAttribute('controls'),'',
    'draft Save leaves the previously published video controls unchanged');
  assert.equal(await node(live,'video').locator('video').getAttribute('autoplay'),'',
    'draft Save leaves the previously published autoplay behavior unchanged');
  assert.equal(await node(live,'video').locator('video').getAttribute('muted'),'',
    'draft Save leaves the previously published mute behavior unchanged');
  await editor.reload();await select('video');
  const videoControlsAfterReload=editor.locator('.content-schema-field[data-content-key="controls"] input');
  const videoMutedAfterReload=editor.locator('.content-schema-field[data-content-key="muted"] input');
  const videoAutoplayAfterReload=editor.locator('.content-schema-field[data-content-key="autoplay"] input');
  assert.equal(await videoControlsAfterReload.isChecked(),false,'Editor reload restores the intentionally controls-free draft');
  assert.equal(await videoMutedAfterReload.isChecked(),false,'Editor reload restores the incomplete unmuted draft');
  assert.equal(await videoAutoplayAfterReload.isChecked(),false,'Editor reload restores the incomplete non-autoplay draft');
  await videoMutedAfterReload.check();await videoAutoplayAfterReload.check();
  assert.equal(await editor.locator('.editor-publication-warning').textContent(),'',
    'muted autoplay clears the only blocker for a controls-free background video');
  assert.equal(await node(editor,'video').locator('video').getAttribute('controls'),null,
    'the valid background video preview keeps controls hidden');
  assert.equal(await node(editor,'video').locator('video').getAttribute('autoplay'),null,
    'the editor Canvas never autoplays even for the valid background-video configuration');
  assert.equal(await node(editor,'video').locator('video').getAttribute('muted'),'',
    'the repaired video preview remains muted');
  const beforeBackgroundVideoSave=posts.length;
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.startsWith('Mentve'));
  assert.equal(posts.length,beforeBackgroundVideoSave+1);
  assert.equal(posts.at(-1).publish,false,'repairing background-video flags still saves only a draft');
  assert.deepEqual(
    (({controls,muted,autoplay})=>({controls,muted,autoplay}))(posts.at(-1).document.pages[pageId].nodes[ids.video].props),
    {controls:false,muted:true,autoplay:true},'Save persists the complete valid background-video configuration');
  await live.reload();
  assert.equal(await node(live,'video').locator('video').getAttribute('controls'),'',
    'a valid but draft-only background video does not alter the public player');
  assert.equal(await node(live,'video').locator('video').getAttribute('autoplay'),'',
    'a draft Save does not publish muted autoplay');
  await editor.reload();await select('video');
  assert.equal(await editor.locator('.content-schema-field[data-content-key="controls"] input').isChecked(),false,
    'Editor reload restores the saved controls-free mode');
  assert.equal(await editor.locator('.content-schema-field[data-content-key="muted"] input').isChecked(),true,
    'Editor reload restores the saved mute mode');
  assert.equal(await editor.locator('.content-schema-field[data-content-key="autoplay"] input').isChecked(),true,
    'Editor reload restores the saved autoplay mode');
  const beforeBackgroundVideoPublish=posts.length;
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  assert.equal(posts.length,beforeBackgroundVideoPublish+1);
  assert.equal(posts.at(-1).publish,true,'controls-free background video becomes public only through Publish');
  await live.reload();
  assert.equal(await node(live,'video').locator('video').getAttribute('controls'),null,
    'separate Publish exposes the controls-free background-video mode');
  assert.equal(await node(live,'video').locator('video').getAttribute('muted'),'',
    'separate Publish exposes the required muted mode');
  assert.equal(await node(live,'video').locator('video').getAttribute('autoplay'),'',
    'separate Publish exposes autoplay only with the required mute state');
  assert.equal(await node(live,'video').locator('video').getAttribute('loop'),'',
    'separate Publish preserves the independently authored loop flag');
  await editor.reload();await select('video');
  assert.equal(await editor.locator('.content-schema-field[data-content-key="controls"] input').isChecked(),false,
    'a subsequent Editor reload keeps controls hidden in the published revision');
  assert.equal(await editor.locator('.content-schema-field[data-content-key="muted"] input').isChecked(),true,
    'a subsequent Editor reload keeps the published revision muted');
  assert.equal(await editor.locator('.content-schema-field[data-content-key="autoplay"] input').isChecked(),true,
    'a subsequent Editor reload keeps the published revision set to autoplay');
  assert.equal(await node(live,'table').locator('caption').textContent(),'Frissített eredmények',
    'separate Publish exposes the authored table caption and accessible region name');
  assert.equal(await node(live,'table').locator('.creator-table-scroll').getAttribute('aria-label'),'Frissített eredmények');
  assert.equal(await node(live,'table').locator('th[scope=col]').count(),0,
    'separate Publish renders the first row as data cells when the authored header is disabled');
  assert.equal(await node(live,'table').locator('tbody tr').first().locator('td').count(),2);
  assert.equal(await node(live,'table').locator('tbody tr').count(),expectedTableRows.length,'Publish preserves all supported rows');
  assert.equal(await node(live,'table').locator('tbody tr').last().locator('td').last().textContent(),expectedTableRows.at(-1)[1],
    'separate Publish exposes the final long cell without truncation');
  // Prove the reverse header transition is a separate draft/public lifecycle too.
  await select('table');
  const tableHeader=editor.getByLabel('Az első sor fejléc',{exact:true});
  await tableHeader.check();
  assert.equal(await node(editor,'table').locator('th[scope=col]').count(),2,
    'turning the authored header back on converts both first-row cells to column headings');
  assert.equal(await node(editor,'table').locator('tbody tr').first().locator('th[scope=col]').first().textContent(),tableRows[0][0],
    're-enabling the header preserves the original first cell text and order');
  assert.equal(await node(editor,'table').locator('tbody tr').count(),expectedTableRows.length,
    're-enabling the header changes only the first row semantics');
  assert.equal(await node(editor,'table').locator('tbody tr').last().locator('td').last().textContent(),expectedTableRows.at(-1)[1],
    're-enabling the header preserves the final edited long data cell');
  const beforeHeaderSave=posts.length;
  assert.equal(beforeHeaderSave>0,true,'the initial header-off Publish has already completed');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.length,beforeHeaderSave+1,'re-enabling the table header requires an explicit Save');
  assert.equal(posts.at(-1).publish,false,'the reverse header transition remains a draft-only Save');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[ids.table].props.header,true,
    'Save persists the restored header setting in the draft');
  await live.reload();
  assert.equal(await node(live,'table').locator('th[scope=col]').count(),0,
    'draft Save keeps the previously published header-off table unchanged');
  assert.equal(await node(live,'table').locator('tbody tr').count(),expectedTableRows.length,
    'draft Save keeps every previously published first-row data cell');
  assert.equal(await node(live,'table').locator('tbody tr').first().locator('td').first().textContent(),tableRows[0][0],
    'draft Save keeps the first cell text in the previously published data row');
  await editor.reload();await select('table');
  assert.equal(await editor.getByLabel('Az első sor fejléc',{exact:true}).isChecked(),true,
    'Editor reload restores the reverse header transition from the saved draft');
  assert.equal(await node(editor,'table').locator('th[scope=col]').count(),2,
    'reloaded Canvas restores both heading cells before the separate Publish');
  const beforeHeaderPublish=posts.length;
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  assert.equal(posts.length,beforeHeaderPublish+1,'restoring the public header requires a separate Publish');
  assert.equal(posts.at(-1).publish,true,'the reverse transition reaches Publish only after draft Save');
  await live.reload();
  assert.equal(await node(live,'table').locator('th[scope=col]').count(),2,
    'separate Publish restores both accessible column headers on the public page');
  assert.equal(await node(live,'table').locator('tbody tr').first().locator('th[scope=col]').count(),2,
    'the restored public heading applies only to the first row');
  assert.equal(await node(live,'table').locator('tbody tr').first().locator('td').count(),0,
    'the first row is no longer duplicated as ordinary public data');
  assert.equal(await node(live,'table').locator('tbody tr').nth(1).locator('td').count(),2,
    'rows after the heading keep their data-cell semantics');
  assert.equal(await node(live,'table').locator('tbody tr').first().locator('th[scope=col]').first().textContent(),tableRows[0][0],
    'published column headings preserve first-row text and order');
  assert.equal(await node(live,'table').locator('tbody tr').count(),expectedTableRows.length,
    'published header semantics do not duplicate the first row as data');
  assert.equal(await node(live,'table').locator('tbody tr').last().locator('td').last().textContent(),expectedTableRows.at(-1)[1],
    'separate Publish retains the last authored long table value');
  assert.equal(await node(live,'video').locator('video[controls]').count(),0);assert.equal(await node(live,'audio').locator('audio[controls]').count(),1);
  for(const type of ['video','audio']){const playback=await node(live,type).locator(type).evaluate(async media=>{if(media.readyState<1)await new Promise((resolve,reject)=>{media.addEventListener('loadedmetadata',resolve,{once:true});media.addEventListener('error',reject,{once:true})});media.muted=true;await media.play();const result={playing:!media.paused,duration:media.duration,readyState:media.readyState};media.pause();return result});assert.equal(playback.playing,true);assert.ok(playback.duration>0);assert.ok(playback.readyState>=2)}
  assert.equal(await node(live,'code').locator('script').count(),0);assert.match(await node(live,'code').locator('code').textContent(),/<script>/);
  const liveTabs=node(live,'tabs'),publicTablist=liveTabs.getByRole('tablist',{name:'Bemutatkozás & videók'});
  const publicTabs=publicTablist.getByRole('tab'),publicPanels=liveTabs.locator('[role="tabpanel"]');
  const assertPublicTabState=async(index,content)=>{
    try{
      await live.waitForFunction(({id,selectedIndex})=>{
        const tabs=[...document.querySelectorAll(`.visual-editor-node[data-node-id="${id}"] [role="tab"]`)];
        return tabs.length===2&&tabs.every((tab,i)=>tab.getAttribute('aria-selected')===String(i===selectedIndex));
      },{id:ids.tabs,selectedIndex:index},{timeout:5000});
    }catch(error){
      const state=await live.evaluate(id=>({tabs:[...document.querySelectorAll(`.visual-editor-node[data-node-id="${id}"] [role="tab"]`)].map(tab=>({selected:tab.getAttribute('aria-selected'),tabindex:tab.tabIndex,id:tab.id})),active:document.activeElement?.id,hash:location.hash,search:location.search}),ids.tabs);
      error.message+=`; tab state did not settle: ${JSON.stringify(state)}`;throw error;
    }
    const tabIds=await publicTabs.evaluateAll(items=>items.map(tab=>({id:tab.id,controls:tab.getAttribute('aria-controls'),selected:tab.getAttribute('aria-selected'),tabindex:tab.getAttribute('tabindex')})));
    const panelIds=await publicPanels.evaluateAll(items=>items.map(panel=>({id:panel.id,labelledby:panel.getAttribute('aria-labelledby'),visible:!panel.hidden,text:panel.textContent})));
    assert.equal(tabIds.length,2,'published tabs expose every tab exactly once');
    assert.equal(panelIds.length,2,'published tabs expose one panel for each tab');
    assert.equal(new Set(tabIds.map(tab=>tab.id)).size,tabIds.length,'published tab IDs are unique');
    assert.equal(new Set(panelIds.map(panel=>panel.id)).size,panelIds.length,'published panel IDs are unique');
    assert.deepEqual(tabIds.map(tab=>tab.selected),tabIds.map((_,i)=>String(i===index)),'exactly the requested published tab is selected');
    assert.deepEqual(tabIds.map(tab=>tab.tabindex),tabIds.map((_,i)=>i===index?'0':'-1'),'published tabs keep one roving keyboard tab stop');
    assert.deepEqual(panelIds.map(panel=>panel.visible),panelIds.map((_,i)=>i===index),'only the selected published panel is visible');
    assert.equal(tabIds[index].controls,panelIds[index].id,'selected tab controls its corresponding panel');
    assert.equal(panelIds[index].labelledby,tabIds[index].id,'selected panel is labelled by its corresponding tab');
    assert.equal(panelIds[index].text,content,'keyboard selection displays the matching published content');
    await live.waitForFunction(id=>document.activeElement?.id===id,tabIds[index].id);
    const focusState=await publicTabs.nth(index).evaluate(tab=>({selected:document.activeElement===tab,activeId:document.activeElement?.id,activeText:document.activeElement?.textContent?.trim()}));
    assert.equal(focusState.selected,true,'keyboard selection moves focus to the selected tab; '+JSON.stringify(focusState));
  };
  await publicTabs.nth(1).click();await assertPublicTabState(1,'Személyes történet');
  await publicTabs.nth(1).press('ArrowRight');await assertPublicTabState(0,'Videólista');
  await publicTabs.nth(0).press('ArrowLeft');await assertPublicTabState(1,'Személyes történet');
  await publicTabs.nth(1).press('Home');await assertPublicTabState(0,'Videólista');
  await publicTabs.nth(0).press('End');await assertPublicTabState(1,'Személyes történet');
  // Other fixture pages are open (Editor and touch preview); explicitly
  // activate the published page before exercising real keyboard focus.
  await live.bringToFront();await live.setViewportSize({width:390,height:640});
  await publicTabs.nth(1).focus();await publicTabs.nth(1).press('ArrowRight');
  await assertPublicTabState(0,'Videólista');
  const mobileTabsLayout=await live.evaluate(()=>({
    viewport:innerWidth,document:document.scrollingElement.scrollWidth,
    tablist:document.querySelector('[role="tablist"]')?.getBoundingClientRect().toJSON()
  }));
  assert.ok(mobileTabsLayout.document<=mobileTabsLayout.viewport,
    'published keyboard tabs at 390px do not introduce document-level horizontal scrolling');
  assert.ok(mobileTabsLayout.tablist.left>=0&&mobileTabsLayout.tablist.right<=mobileTabsLayout.viewport,
    'published tablist remains inside the narrow mobile viewport');
  assert.equal(await publicTabs.nth(0).evaluate(tab=>tab.getBoundingClientRect().width>=44),true,
    'the focused mobile tab keeps the minimum 44px touch target');
  // A 1440x900 browser at 200% effective zoom exposes 720x450. Exercise the
  // published tabs at that exact short viewport as well as on a phone: the
  // keyboard path must remain reachable without clipping the tablist.
  await live.bringToFront();await live.setViewportSize({width:720,height:450});
  assert.equal(await live.evaluate(()=>[innerWidth,innerHeight].join('×')),'720×450',
    'published keyboard tabs use the planned 200% effective zoom viewport');
  await publicTabs.nth(0).focus();await live.keyboard.press('End');
  await assertPublicTabState(1,'Személyes történet');
  const zoomTabsLayout=await live.evaluate(()=>({
    viewport:innerWidth,document:document.scrollingElement.scrollWidth,
    tablist:document.querySelector('[role="tablist"]')?.getBoundingClientRect().toJSON()
  }));
  assert.ok(zoomTabsLayout.document<=zoomTabsLayout.viewport,
    'published tabs at 200% effective zoom do not introduce document-level horizontal scrolling');
  assert.ok(zoomTabsLayout.tablist.left>=0&&zoomTabsLayout.tablist.right<=zoomTabsLayout.viewport,
    'published tablist remains inside the 200% effective zoom viewport');
  assert.equal(await publicTabs.nth(1).evaluate(tab=>tab.getBoundingClientRect().height>=44),true,
    'the keyboard-focused tab keeps a minimum 44px target at 200% effective zoom');
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
  assert.deepEqual(await dropdown.locator('details').evaluateAll(items=>items.map(el=>el.open)),[false,true],
    'published single-open Dropdown closes its first section when keyboard focus opens the second');
  await dropdown.locator('summary').first().press('Enter');
  assert.deepEqual(await dropdown.locator('details').evaluateAll(items=>items.map(el=>el.open)),[true,false],
    'published single-open Dropdown restores the first section when it is reopened by keyboard');
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
  assert.equal(await lightbox.locator('img').getAttribute('alt'),'Frissített képleírás',
    'arrow key navigates to the next image without closing the dialog');
  assert.equal(await lightbox.locator('.creator-lightbox-caption').textContent(),'Frissített képaláírás');
  await live.keyboard.press('Home');
  assert.equal(await lightbox.locator('img').getAttribute('alt'),'Márkajel');
  await live.keyboard.press('End');
  assert.equal(await lightbox.locator('.creator-lightbox-nav [role=status]').textContent(),'2 / 2');
  await lightbox.getByRole('button',{name:'Előző kép'}).click();
  assert.equal(await lightbox.locator('img').getAttribute('alt'),'Márkajel');
  await lightbox.getByRole('button',{name:'Előző kép'}).click();
  assert.equal(await lightbox.locator('img').getAttribute('alt'),'Frissített képleírás',
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
    assert.deepEqual(await node(live,'dropdown').locator('details').evaluateAll(items=>items.map(el=>el.getAttribute('name'))),
      [publishedDropdownName,publishedDropdownName],
      `published single-open Dropdown keeps its native group semantics at ${width}px`);
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
    const expected=width<=700?1:width<=900?2:4;assert.equal((await node(live,'gallery').locator('.creator-gallery').evaluate(el=>getComputedStyle(el).gridTemplateColumns)).split(' ').length,expected);
    assert.equal(await node(live,'gallery').locator('img').first().evaluate(el=>getComputedStyle(el).objectFit),'contain',`published gallery item fit remains authored at ${width}px`);
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
  // The authored table uses one lossless TSV field for structural edits. Keep
  // this final lifecycle separate from the large-table boundary assertions
  // above: add one row and one column, Save/reload the draft, then Publish.
  await select('table');
  const structuralRowsField=editor.locator('.content-schema-field[data-content-key="rows"] textarea');
  const expandedTableRows=expectedTableRows.map((row,index)=>[...row,`Új oszlop ${index+1}`]);
  expandedTableRows.push(['Új táblázatsor','Új cella','Új harmadik cella']);
  const postsBeforeTableStructure=posts.length;
  await structuralRowsField.fill(serializeTableTsv(expandedTableRows));
  assert.equal(await structuralRowsField.getAttribute('aria-invalid'),null,
    'adding a table row and column through valid TSV remains within the Page Model contract');
  assert.equal(await node(editor,'table').locator('tbody tr').count(),expandedTableRows.length,
    'the Canvas renders the added TSV row immediately');
  assert.equal(await node(editor,'table').locator('tbody tr').last().locator('td').count(),3,
    'the Canvas renders the added TSV column on the new row');
  assert.equal(await node(editor,'table').locator('tbody tr').first().locator('th[scope=col]').count(),3,
    'the new column is included in the accessible table header');
  assert.deepEqual(await node(editor,'table').locator('tbody tr').last().locator('td').evaluateAll(cells=>cells.map(cell=>cell.textContent)),
    expandedTableRows.at(-1),'TSV structural edits preserve row and cell order in the Canvas');
  assert.equal(posts.length,postsBeforeTableStructure,'adding a table row and column does not implicitly Save or Publish');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.length,postsBeforeTableStructure+1,'the structural table draft requires explicit Save');
  assert.equal(posts.at(-1).publish,false,'table structure Save remains separate from Publish');
  assert.deepEqual(posts.at(-1).document.pages[pageId].nodes[ids.table].props.rows,expandedTableRows,
    'Save persists the exact expanded TSV row and column structure');
  await live.goto(base+'/p/test');
  assert.equal(await node(live,'table').locator('tbody tr').count(),expectedTableRows.length,
    'draft Save leaves the previously published table row count unchanged');
  assert.equal(await node(live,'table').locator('tbody tr').first().locator('th[scope=col]').count(),2,
    'draft Save leaves the previously published table column count unchanged');
  await editor.reload();
  await select('table');
  assert.equal(await structuralRowsField.inputValue(),serializeTableTsv(expandedTableRows),
    'Editor reload restores the complete expanded TSV draft without truncation');
  assert.equal(await node(editor,'table').locator('tbody tr').count(),expandedTableRows.length);
  assert.equal(await node(editor,'table').locator('tbody tr').first().locator('th[scope=col]').count(),3);
  const postsBeforeStructuralPublish=posts.length;
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  assert.equal(posts.length,postsBeforeStructuralPublish+1,'the expanded table requires a separate Publish');
  assert.equal(posts.at(-1).publish,true,'the structural table Publish follows the saved draft');
  assert.deepEqual(posts.at(-1).document.pages[pageId].nodes[ids.table].props.rows,expandedTableRows,
    'Publish sends the same row and column structure that Save persisted');
  await live.reload();
  assert.equal(await node(live,'table').locator('tbody tr').count(),expandedTableRows.length,
    'separate Publish exposes the added table row');
  assert.equal(await node(live,'table').locator('tbody tr').first().locator('th[scope=col]').count(),3,
    'separate Publish exposes the added table column in the accessible header');
  assert.deepEqual(await node(live,'table').locator('tbody tr').last().locator('td').evaluateAll(cells=>cells.map(cell=>cell.textContent)),
    expandedTableRows.at(-1),'the public table preserves every newly added TSV cell in order');
  const emptyRepeaterCases=[
    {type:'list',add:'Listaelemek hozzáadása',field:'Szöveg',value:'Visszaállított listaelem',canvas:'ol li'},
    {type:'tabs',add:'Fülek hozzáadása',field:'Fül címe',value:'Visszaállított fül',canvas:'[role="tab"]',textField:'Szöveg',textValue:'Visszaállított tartalom'},
    {type:'accordion',add:'Lenyitható részek hozzáadása',field:'Rész címe',value:'Visszaállított harmonika',canvas:'details > summary',textField:'Szöveg',textValue:'Visszaállított válasz'},
    {type:'dropdown',add:'Lenyitható részek hozzáadása',field:'Rész címe',value:'Visszaállított lenyíló elem',canvas:'details > summary',textField:'Szöveg',textValue:'Visszaállított leírás'},
    {type:'gallery',add:'Képek hozzáadása',field:'Külső média címe',value:'/fixture.svg',canvas:'img',mediaAlt:'Képleírás',altValue:'Visszaállított galériakép'},
    {type:'carousel',add:'Lapozható képek hozzáadása',field:'Külső média címe',value:'/fixture.svg',canvas:'img',mediaAlt:'Képleírás',altValue:'Visszaállított diasor'}
  ];
  await touchEditor.goto(base+'/editor-v2/index.html');
  assert.equal(await touchEditor.evaluate(()=>[innerWidth,innerHeight].join('×')),'390×800',
    'repeater lifecycle runs at the real 390px touch-emulated viewport');
  assert.equal(await touchEditor.evaluate(()=>matchMedia('(pointer: coarse)').matches),true,
    'repeater actions run with a coarse-pointer touch browser context');
  await live.goto(base+'/p/test');
  for(const item of emptyRepeaterCases){
    await touchSelect(item.type);
    const repeater=touchEditor.locator('.content-repeater[data-content-key="items"]');
    const initialRows=await repeater.locator(':scope > fieldset').count();
    if(initialRows>1){
      const beforeDelete=posts.length;
      await repeater.getByRole('button',{name:'1. elem: Eltávolítás',exact:true}).tap();
      await touchEditor.waitForFunction(expected=>document.querySelectorAll('.content-repeater[data-content-key="items"] > fieldset').length===expected,initialRows-1);
      assert.equal(await repeater.locator(':scope > fieldset').count(),initialRows-1,
        `${item.type} touch Delete removes only the selected repeater row`);
      assert.equal(posts.length,beforeDelete,
        `${item.type} touch row deletion stays draft-only`);
    }
    while(await repeater.locator(':scope > fieldset').count()){
      const count=await repeater.locator(':scope > fieldset').count();
      await repeater.getByRole('button',{name:`${count}. elem: Eltávolítás`,exact:true}).tap();
      await touchEditor.waitForFunction(expected=>document.querySelectorAll('.content-repeater[data-content-key="items"] > fieldset').length===expected,count-1);
    }
    assert.equal(await repeater.getByRole('button',{name:item.add,exact:true}).isVisible(),true,
      `${item.type} touch final-row Delete leaves its Add action visible`);
    assert.equal(await touchNode(item.type).locator(item.canvas).count(),0,
      `${item.type} supports an intentionally empty repeater without leaving stale Canvas items`);
    assert.equal(await repeater.getByRole('button',{name:item.add,exact:true}).isEnabled(),true,
      `${item.type} keeps its Add action available after deleting the final row`);
    const beforeAdd=posts.length;
    await repeater.getByRole('button',{name:item.add,exact:true}).tap();
    await repeater.locator(':scope > fieldset').first().waitFor({state:'visible'});
    const restoredRow=repeater.locator(':scope > fieldset').first();
    await restoredRow.getByLabel(item.field,{exact:true}).fill(item.value);
    if(item.textField)await restoredRow.getByLabel(item.textField,{exact:true}).fill(item.textValue);
    if(item.mediaAlt)await restoredRow.getByLabel(item.mediaAlt,{exact:true}).fill(item.altValue);
    assert.equal(await touchNode(item.type).locator(item.canvas).count(),1,
      `${item.type} Add recovers the empty Canvas and exposes its authored row`);
    assert.equal(posts.length,beforeAdd,`${item.type} touch final-row Delete and Add remain draft-only`);
  }
  const beforeEmptyRepeaterSave=posts.length;
  await touchEditor.locator('#save').tap();
  await touchEditor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.length,beforeEmptyRepeaterSave+1,'touch-recovered repeaters are persisted only by explicit Save');
  assert.equal(posts.at(-1).publish,false,'touch repeater Save does not Publish');
  const savedPage=posts.at(-1).document.pages[pageId];
  for(const item of emptyRepeaterCases){
    const items=savedPage.nodes[ids[item.type]].props.items;
    assert.equal(items.length,1,`Save persists one recovered ${item.type} item`);
    assert.equal(items[0][item.field==='Szöveg'?'text':item.field==='Fül címe'?'title':item.field==='Rész címe'?'title':'src'],item.value,
      `Save preserves the recovered ${item.type} primary field`);
  }
  await live.reload();
  for(const item of emptyRepeaterCases)assert.equal(await node(live,item.type).locator(item.canvas).count(),2,
    `draft Save leaves the previously published ${item.type} repeater unchanged`);
  await touchEditor.reload();
  for(const item of emptyRepeaterCases){
    await touchSelect(item.type);
    const repeater=touchEditor.locator('.content-repeater[data-content-key="items"]');
    assert.equal(await repeater.locator(':scope > fieldset').count(),1,`Editor reload restores one saved ${item.type} row`);
    assert.equal(await touchNode(item.type).locator(item.canvas).count(),1,`Editor reload restores the ${item.type} Canvas row`);
  }
  const beforeRecoveredRepeaterPublish=posts.length;
  await touchEditor.locator('#publish').tap();
  await touchEditor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  assert.equal(posts.length,beforeRecoveredRepeaterPublish+1,'recovered repeater publication requires a separate Publish');
  assert.equal(posts.at(-1).publish,true,'recovered repeater content reaches the public snapshot only via Publish');
  await live.reload();
  for(const item of emptyRepeaterCases){
    assert.equal(await node(live,item.type).locator(item.canvas).count(),1,`Publish exposes one recovered ${item.type} row`);
    if(item.mediaAlt)assert.equal(await node(live,item.type).locator('img').getAttribute('alt'),item.altValue,
      `Publish retains the recovered ${item.type} media description`);
  }
  await touchSelect('image');await touchEditor.screenshot({path:'/tmp/creator-ux-p0-content-mobile.png'});
  assert.deepEqual(errors,[]);
});
