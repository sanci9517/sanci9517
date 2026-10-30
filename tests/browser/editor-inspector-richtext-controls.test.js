import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve, extname} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(import.meta.dirname,'../..','public');
function serve(){
  return createServer(async(req,res)=>{
    const path=new URL(req.url,'http://localhost').pathname;
    if(path==='/api/admin/media') {res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,data:{assets:[{id:'6b1c2e65-e46e-4764-b234-123456789abc',name:'background.png',mimeType:'image/png',previewUrl:'/media/6b1c2e65-e46e-4764-b234-123456789abc'}]}}));return;}
    const file=resolve(root,'.'+path);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return;}
    try {
      res.setHeader('Content-Type',{'.js':'text/javascript','.html':'text/html','.css':'text/css'}[extname(file)]||'text/plain');
      res.end(await readFile(file));
    }catch{res.writeHead(404).end();}
  });
}
test('typed Inspector controls and link selection work with real browser DOM at mobile and desktop widths',async t=>{
  const server=serve();
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({
    headless:true,
    executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),
    args:['--no-sandbox']
  });
  t.after(async()=>{await browser.close();await new Promise(r=>server.close(r));});
  for(const width of [390,1366]){
    const page=await browser.newPage({viewport:{width,height:850}});
    // The full serial browser suite runs for a long time; allow Chromium extra
    // time to complete initial navigation under accumulated process load.
    page.setDefaultNavigationTimeout(60000);
    await page.goto('http://127.0.0.1:'+server.address().port+'/editor-v2/index.html');
    const data=await page.evaluate(async()=>{
      const {renderPropertyInput}=await import('/editor-v2/ui/property-controls.js?v=20261029-media-picker-a11y');
      const {mediaAssetPicker}=await import('/editor-v2/ui/element-content-controls.js');
      const {getProperty,listProperties}=await import('/editor-v2/core/property-registry.js');
      const {getInspectorValueContract}=await import('/editor-v2/core/property-values.js');
      const {getRichTextBlockSelection,getRichTextFormattingSelection,updateRichTextInlineLink,updateRichTextInlineMark,updateRichTextInlineStyle,updateRichTextBlockAlignment}=await import('/editor-v2/core/richtext-links.js');
      const {renderRichTextEditor,richTextEditorToDocument,setBlockType,getSelectionOffsets,restoreSelectionOffsets}=await import('/editor-v2/core/richtext-engine.js');
      const {importRichTextClipboard}=await import('/editor-v2/core/richtext-import.js');
      const {normalizeRichText}=await import('/editor-v2/core/schema.js');
      const host=document.createElement('div');document.body.append(host);
      const helpLengths=listProperties().map(property=>{
        const field=renderPropertyInput(property,property.label,'16px',()=>{});
        const description=field.querySelector('.property-help')?.textContent||'';
        return [property.id,description.length];
      });
      const fieldMatrix=[];
      const matrixHost=document.createElement('div');matrixHost.style.cssText='position:absolute;left:-10000px;top:0;width:360px';host.append(matrixHost);
      for(const property of listProperties()){
        const editsForProperty=[];
        const control=renderPropertyInput(property,property.label,'16px',value=>editsForProperty.push(value));matrixHost.append(control);
        const type=property.type;
        if(type==='asset'){
          const label=control.querySelector('.property-heading > label'),picker=control.querySelector('.editor-media-picker');
          const open=picker.querySelector('button[aria-controls]'),error=control.querySelector('.property-validation');
          const accessibility={role:picker.getAttribute('role'),labelId:label.id,labelledBy:picker.getAttribute('aria-labelledby'),labelFor:label.htmlFor,
            groupDescriptionId:picker.getAttribute('aria-describedby'),controlDescriptionId:open.getAttribute('aria-describedby'),errorId:error.id,required:open.getAttribute('aria-required')};
          [...control.querySelectorAll('.editor-media-picker > button')].find(button=>button.textContent==='Médiatár megnyitása').click();
          for(let retry=0;retry<40&&!control.querySelector('.editor-media-choice');retry++)await new Promise(resolve=>setTimeout(resolve,20));
          control.querySelector('.editor-media-choice')?.click();
          fieldMatrix.push({id:property.id,type,callbackCount:editsForProperty.length,value:editsForProperty[0],accessibility});
          continue;
        }
        if(type==='dimension'){
          const number=control.querySelector('input[type="number"]'),unit=control.querySelector('select');
          const supported=(property.units||[]).find(value=>!['auto','0'].includes(value));
          unit.value=supported;number.value='12';number.dispatchEvent(new Event('change',{bubbles:true}));
        }else if(type==='box'){
          const input=control.querySelector('.typed-box-entry input');input.value='12';input.dispatchEvent(new Event('change',{bubbles:true}));
        }else if(type==='color'){
          const input=control.querySelector('input[type="text"]');input.value='#abcdef';input.dispatchEvent(new Event('change',{bubbles:true}));
        }else if(type==='number'){
          const input=control.querySelector('input[type="number"]');input.value=property.key==='opacity'?'0.75':property.key==='lineHeight'?'1.5':'2';input.dispatchEvent(new Event('change',{bubbles:true}));
        }else if(type==='font'||type==='shadow'||type==='select'){
          const select=control.querySelector('select');select.value=type==='font'?'system-ui':type==='shadow'?'none':property.options[0];select.dispatchEvent(new Event('change',{bubbles:true}));
        }else if(type==='text'&&getInspectorValueContract(property).multiline){
          const textarea=control.querySelector('textarea');
          textarea.value='  első sor\n második sor  ';textarea.dispatchEvent(new Event('change',{bubbles:true}));
          fieldMatrix.push({id:property.id,type,tagName:textarea.tagName,rows:textarea.rows,callbackCount:editsForProperty.length,value:editsForProperty[0],error:control.querySelector('.property-validation')?.textContent||''});
          continue;
        }else{
          const input=control.querySelector('input');input.value=type==='url'?'/p/teszt':'Teszt tartalom';input.dispatchEvent(new Event('change',{bubbles:true}));
        }
        fieldMatrix.push({id:property.id,type,callbackCount:editsForProperty.length,value:editsForProperty[0],maxLength:type==='url'?control.querySelector('input')?.maxLength:null,error:control.querySelector('.property-validation')?.textContent||''});
      }
      matrixHost.remove();
      const invalidMatrix=[];
      for(const [id,value,selector] of [
        ['size.width','-10','input[type="number"]'],
        ['spacing.padding','-10','input[type="number"]'],
        ['background.color','not-a-color','input[type="text"]'],
        ['opacity.value','2','input[type="number"]'],
        ['layout.display','not-a-display','select'],
        ['content.href','javascript:alert(1)','input']
      ]){
        const property=getProperty(id),editsForProperty=[],control=renderPropertyInput(property,property.label,
          id==='size.width'?'12px':id==='spacing.padding'?'8px':id==='background.color'?'#123456':id==='opacity.value'?'0.75':id==='content.href'?'/p/teszt':'block',
          next=>editsForProperty.push(next));
        const input=control.querySelector(selector);
        if(id==='size.width')control.querySelector('select').value='px';
        if(id==='layout.display'){const option=document.createElement('option');option.value=value;input.append(option)}
        input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}));
        invalidMatrix.push({id,callbackCount:editsForProperty.length,error:control.querySelector('.property-validation')?.textContent||''});
      }
      const assetControl=renderPropertyInput(getProperty('background.image'),'Háttérkép','',()=>{throw new Error('A parancs elutasítva.');});host.append(assetControl);
      const assetOpen=assetControl.querySelector('.editor-media-picker > button');
      const assetSearch=assetControl.querySelector('input[type="search"]');
      const assetInitiallyClosed=assetOpen.getAttribute('aria-expanded')==='false'&&assetSearch.hidden;
      assetOpen.click();
      for(let retry=0;retry<40&&!assetControl.querySelector('.editor-media-choice');retry++)await new Promise(resolve=>setTimeout(resolve,20));
      const assetExpanded=assetOpen.getAttribute('aria-expanded')==='true'&&!assetSearch.hidden;
      assetControl.querySelector('.editor-media-choice').click();
      const assetRejected=assetOpen.getAttribute('aria-expanded')==='true'&&!assetControl.querySelector('.editor-media-selected')&&assetControl.querySelector('.property-validation').textContent==='A parancs elutasítva.';
      const acceptedAsset=renderPropertyInput(getProperty('background.image'),'Háttérkép','',()=>{});host.append(acceptedAsset);
      const acceptedOpen=acceptedAsset.querySelector('.editor-media-picker > button');acceptedOpen.click();
      for(let retry=0;retry<40&&!acceptedAsset.querySelector('.editor-media-choice');retry++)await new Promise(resolve=>setTimeout(resolve,20));
      acceptedAsset.querySelector('.editor-media-choice').click();
      const assetClosedAfterSelection=acceptedOpen.getAttribute('aria-expanded')==='false'&&acceptedAsset.querySelector('input[type="search"]').hidden&&Boolean(acceptedAsset.querySelector('.editor-media-selected'));
      acceptedOpen.click();const assetReopened=acceptedOpen.getAttribute('aria-expanded')==='true'&&!acceptedAsset.querySelector('input[type="search"]').hidden;
      const originalFetch=window.fetch,pendingAssets=new Map();
      window.fetch=input=>new Promise(resolve=>pendingAssets.set(new URL(input).searchParams.get('q')||'',resolve));
      const racingPicker=mediaAssetPicker('',()=>{});host.append(racingPicker);racingPicker.querySelector(':scope > button').click();
      const racingSearch=racingPicker.querySelector('input[type="search"]');
      racingSearch.value='régi';racingSearch.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(resolve=>setTimeout(resolve,240));
      racingSearch.value='új';racingSearch.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(resolve=>setTimeout(resolve,240));
      const reply=name=>({ok:true,json:async()=>({ok:true,data:{assets:[{id:'6b1c2e65-e46e-4764-b234-123456789abc',name,mimeType:'image/png',previewUrl:'/media/test'}]}})});
      pendingAssets.get('új')(reply('Új találat'));await new Promise(resolve=>setTimeout(resolve,0));
      pendingAssets.get('régi')(reply('Régi találat'));pendingAssets.get('')(reply('Kezdeti találat'));await new Promise(resolve=>setTimeout(resolve,0));
      const latestSearchWins=racingPicker.querySelector('.editor-media-choice')?.textContent==='Új találat';window.fetch=originalFetch;
      const edits=[];
      const color=renderPropertyInput(getProperty('background.color'),'Háttérszín','#112233',v=>edits.push(v));
      host.append(color);
      const picker=color.querySelector('input[type=color]');
      picker.value='#abcdef';picker.dispatchEvent(new Event('change',{bubbles:true}));
      const box=renderPropertyInput(getProperty('spacing.padding'),'Belső térköz','8px',v=>edits.push(v));
      host.append(box);
      const sides=box.querySelectorAll('input');
      sides[1].value='12';sides[1].dispatchEvent(new Event('change',{bubbles:true}));
      const marginEdits=[];
      const marginBox=renderPropertyInput(getProperty('spacing.margin'),'Külső térköz','-4px 8% 2rem auto',value=>marginEdits.push(value));
      host.append(marginBox);
      const marginNumbers=[...marginBox.querySelectorAll('.typed-box-entry input')];
      const marginUnits=[...marginBox.querySelectorAll('.typed-box-entry select')];
      const initialMargin={numbers:marginNumbers.map(x=>x.value),units:marginUnits.map(x=>x.value)};
      marginUnits[1].value='vw';marginUnits[1].dispatchEvent(new Event('change',{bubbles:true}));
      marginUnits[3].value='px';marginUnits[3].dispatchEvent(new Event('change',{bubbles:true}));
      marginNumbers[3].value='5';marginNumbers[3].dispatchEvent(new Event('change',{bubbles:true}));
      const paddingEdits=[];
      const typedPadding=renderPropertyInput(getProperty('spacing.padding'),'Belső térköz','0',value=>paddingEdits.push(value));
      host.append(typedPadding);
      const paddingNum=typedPadding.querySelector('.typed-box-entry input');
      paddingNum.value='-3';paddingNum.dispatchEvent(new Event('change',{bubbles:true}));
      const paddingRejected=paddingEdits.length===0 && Boolean(typedPadding.querySelector('.property-validation')?.textContent);
      paddingNum.value='6';paddingNum.dispatchEvent(new Event('change',{bubbles:true}));
      const boxControls={initialMargin,marginEdits,paddingEdits,paddingRejected,
        paddingUnitOptions:[...typedPadding.querySelector('.typed-box-entry select').options].map(x=>x.value),
        marginUnitOptions:[...marginUnits[0].options].map(x=>x.value)};
      const presetResults={};
      for(const property of listProperties().filter(item=>item.presets?.length&&!['size.width','size.height'].includes(item.id))){
        const selected=property.presets[0];
        const control=renderPropertyInput(property,property.label,selected.value,value=>{presetResults[property.id]=value});host.append(control);
        if(['select','font','shadow'].includes(property.type)){
          if(control.querySelector('.property-presets'))throw new Error('Duplikált enum presetcsoport: '+property.id);
          const select=control.querySelector('select');
          for(const preset of property.presets){
            if(![...select.options].some(option=>option.value===preset.value))throw new Error('Hiányzó enum választás: '+property.id+' / '+preset.label);
            select.value=preset.value;select.dispatchEvent(new Event('change',{bubbles:true}));
            if(presetResults[property.id]!==preset.value)throw new Error('Az enum választás nem a mező callbacken keresztül ment: '+property.id);
          }
        }else for(const preset of property.presets){
            const button=control.querySelector(`.property-presets button[data-value="${CSS.escape(preset.value)}"]`);
            if(!button)throw new Error('Hiányzó preset: '+property.id+' / '+preset.label);
            button.click();
            if(presetResults[property.id]!==preset.value)throw new Error('A preset nem a mező callbacken keresztül ment: '+property.id);
        }
      }
      const unitOptions=Object.fromEntries(listProperties().filter(property=>property.type==='dimension').map(property=>{
        const control=renderPropertyInput(property,property.label,property.presets?.[0]?.value??'16px',()=>{});
        return [property.id,[...control.querySelector('.dimension-controls select').options].map(option=>option.value)];
      }));
      const importedWord=normalizeRichText(importRichTextClipboard({html:'<h2 style="text-align:center">Quarterly report</h2><p>Hello <strong>bold</strong>, <span style="color:rgb(12,34,56);background-color:#ffee99"><em>highlighted</em></span> <s>old</s><sub>2</sub><a href="javascript:alert(1)">unsafe link</a></p><ul><li>First</li><li>Second</li></ul><table><tr><th>Name</th><th>Value</th></tr><tr><td>Revenue</td><td>100</td></tr><tr><td>Year</td><td style="text-align:right;font-size:12pt;color:#112233">2026</td></tr></table><script>window.__pasteAttack=1</script>'}));
      const importedEditor=document.createElement('div');renderRichTextEditor(importedEditor,importedWord);const importedRoundTrip=normalizeRichText(richTextEditorToDocument(importedEditor));
      const officeStyles=normalizeRichText(importRichTextClipboard({html:'<p style="text-align:right;font-family:Calibri;font-size:18pt;color:#112233">Office typography</p>'}));
      const importedTsv=normalizeRichText(importRichTextClipboard({text:'Name\tValue\nRevenue\t100'}));
      let oversizedPasteRejected=false;try{importRichTextClipboard({text:'x'.repeat(250001)})}catch{oversizedPasteRejected=true}
      const model={
        schemaVersion:1,type:'richtext-document',
        blocks:[{type:'paragraph',children:[{type:'text',text:'Hello world',marks:[]}]}]
      };
      const editor=document.createElement('div');editor.contentEditable='true';host.append(editor);
      renderRichTextEditor(editor,model);
      const text=editor.querySelector('p span').firstChild;
      const backwardRange=document.createRange();backwardRange.setStart(text,1);backwardRange.setEnd(text,5);
      const backwardNative=window.getSelection();backwardNative.removeAllRanges();backwardNative.addRange(backwardRange);
      if(typeof backwardNative.setBaseAndExtent==='function')backwardNative.setBaseAndExtent(text,5,text,1);
      const inspectorBookmark={...getSelectionOffsets(editor)};
      const inspectorBookmarkKeepsDirection=inspectorBookmark.backward===true&&restoreSelectionOffsets(editor,inspectorBookmark)&&backwardNative.anchorOffset===5&&backwardNative.focusOffset===1;
      const range=document.createRange();range.setStart(text,6);range.setEnd(text,11);
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      const saved=getRichTextBlockSelection(editor);
      const linked=updateRichTextInlineLink(richTextEditorToDocument(editor),saved,'/p/home');
      renderRichTextEditor(editor,linked);
      const created=editor.querySelector('a');
      const linkPresent=created?.getAttribute('href')==='/p/home' && created.textContent==='world';
      const caret=document.createRange();caret.setStart(created.firstChild.firstChild,2);caret.collapse(true);
      selection.removeAllRanges();selection.addRange(caret);
      const editing=getRichTextBlockSelection(editor);
      const unlinked=updateRichTextInlineLink(richTextEditorToDocument(editor),editing,null);
      const styled=updateRichTextInlineStyle(linked,saved,'fontSize','24px');
      const family=updateRichTextInlineStyle(styled,saved,'fontFamily','Georgia');
      const marked=updateRichTextInlineMark(family,saved,'bold');
      renderRichTextEditor(editor,marked);
      const parsedMarked=richTextEditorToDocument(editor);
      const aligned=updateRichTextBlockAlignment(parsedMarked,0,'justify');
      const multiModel={schemaVersion:1,type:'richtext-document',blocks:[{type:'paragraph',children:[{type:'text',text:'First paragraph',marks:[]}]},{type:'heading',level:2,children:[{type:'text',text:'Second heading',marks:[]}]}]};
      const multiEditor=document.createElement('div');renderRichTextEditor(multiEditor,multiModel);host.append(multiEditor);
      const firstText=multiEditor.children[0].firstChild.firstChild,secondText=multiEditor.children[1].firstChild.firstChild,multiRange=document.createRange();multiRange.setStart(firstText,0);multiRange.setEnd(secondText,6);selection.removeAllRanges();selection.addRange(multiRange);
      const multiSelection=getRichTextFormattingSelection(multiEditor),multiMarked=updateRichTextInlineMark(multiModel,multiSelection,'italic'),multiStyled=updateRichTextInlineStyle(multiMarked,multiSelection,'fontSize','20px'),multiAligned=updateRichTextBlockAlignment(multiStyled,multiSelection.segments.map(segment=>segment.blockIndex),'center');
      const list=setBlockType(parsedMarked,0,11,'numbered-list');
      renderRichTextEditor(editor,list);
      const parsedList=richTextEditorToDocument(editor);
      return {edits,boxControls,presetResults,unitOptions,helpLengths,saved,editing,assetInitiallyClosed,assetExpanded,assetRejected,assetClosedAfterSelection,assetReopened,latestSearchWins,linkPresent,linksAfterRemoval:unlinked.blocks[0].children.filter(x=>x.link).length,
        importedBlocks:importedRoundTrip.blocks.map(block=>block.type),importedText:importedRoundTrip.blocks[0].children[0].text,importedAlignment:importedRoundTrip.blocks[0].align,
        importedMarks:importedRoundTrip.blocks[1].children.map(run=>run.marks),importedInlineStyles:importedRoundTrip.blocks[1].children.map(run=>run.styles??{}),
        importedLinks:importedRoundTrip.blocks[1].children.filter(run=>run.link).length,importedTable:importedRoundTrip.blocks[3].rows.map(row=>row.cells.map(cell=>cell.children.map(run=>run.text).join(''))),officeStyles:officeStyles.blocks[0],tableCell:importedRoundTrip.blocks[3].rows[2].cells[1],
        tsvType:importedTsv.blocks[0].type,tsvShape:[importedTsv.blocks[0].rows.length,importedTsv.blocks[0].rows[0].cells.length],oversizedPasteRejected,
        pasteAttack:window.__pasteAttack,
        markedRun:aligned.blocks[0].children.find(x=>x.text==='world'),alignment:aligned.blocks[0].align,
        multiSelection,multiBlocks:multiAligned.blocks,
        listType:parsedList.blocks[0].type,listText:parsedList.blocks[0].items[0].children.map(x=>x.text).join(''),
        hasHorizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,inspectorBookmarkKeepsDirection,fieldMatrix,invalidMatrix};
    });
    assert.deepEqual(data.edits,['#abcdef','8px 12px 8px 8px']);
    assert.equal(data.inspectorBookmarkKeepsDirection,true);
    assert.deepEqual(data.boxControls.initialMargin,{numbers:['-4','8','2',''],units:['px','%','rem','auto']});
    assert.deepEqual(data.boxControls.marginEdits,['-4px 8vw 2rem auto','-4px 8vw 2rem 0','-4px 8vw 2rem 5px']);
    assert.equal(data.boxControls.paddingRejected,true,'negative padding must not reach command callback');
    assert.deepEqual(data.boxControls.paddingEdits,['6px 0 0 0']);
    assert.ok(data.boxControls.marginUnitOptions.includes('auto'),'only margin supports Auto');
    assert.ok(!data.boxControls.paddingUnitOptions.includes('auto'),'padding cannot use Auto');

    assert.ok(data.assetInitiallyClosed&&data.assetExpanded&&data.assetRejected&&data.assetClosedAfterSelection&&data.assetReopened,'asset picker must expose its state, preserve rejected edits, and reopen after selection');
    assert.equal(data.latestSearchWins,true,'late search responses must not replace the newest Media results');
    assert.ok(Object.keys(data.presetResults).length>=20);
    assert.ok(data.helpLengths.length>=45);
    assert.ok(data.helpLengths.every(([,length])=>length>=100),`every property needs detailed guidance: ${data.helpLengths.filter(([,length])=>length<100).map(([id])=>id).join(', ')}`);
    assert.ok(data.fieldMatrix.length>=45,`every registered Inspector property should have a real browser control contract; saw ${data.fieldMatrix.length}`);
    assert.ok(data.fieldMatrix.filter(item=>item.type!=='asset').every(item=>item.callbackCount===1&&!item.error),`supported Inspector fields must reach their validated callback: ${JSON.stringify(data.fieldMatrix.filter(item=>item.type!=='asset'&&(item.callbackCount!==1||item.error)))}`);
    const contentTextControl=data.fieldMatrix.find(item=>item.id==='content.text');
    assert.deepEqual({tagName:contentTextControl.tagName,rows:contentTextControl.rows,value:contentTextControl.value,error:contentTextControl.error},
      {tagName:'TEXTAREA',rows:4,value:'  első sor\n második sor  ',error:''},
      'the multiline value contract renders a native textarea and preserves literal text');
    assert.ok(data.fieldMatrix.filter(item=>item.type==='url').every(item=>item.maxLength===2048),`URL controls must expose the validator's 2048-character limit: ${JSON.stringify(data.fieldMatrix.filter(item=>item.type==='url'))}`);
    assert.ok(data.fieldMatrix.filter(item=>item.type==='asset').every(item=>item.callbackCount===1&&item.value==='6b1c2e65-e46e-4764-b234-123456789abc'),`background picker must deliver the selected site asset ID: ${JSON.stringify(data.fieldMatrix.filter(item=>item.type==='asset'))}`);
    assert.ok(data.fieldMatrix.filter(item=>item.type==='asset').every(({accessibility})=>accessibility.role==='group'&&accessibility.labelId&&accessibility.labelledBy===accessibility.labelId&&accessibility.labelFor===''&&accessibility.groupDescriptionId===accessibility.errorId&&accessibility.controlDescriptionId===accessibility.errorId&&accessibility.required==='true'),`background picker must expose its field label and validation guidance accessibly: ${JSON.stringify(data.fieldMatrix.filter(item=>item.type==='asset'))}`);
    assert.ok(data.invalidMatrix.every(item=>item.callbackCount===0&&item.error),`invalid values must be rejected before reaching the command callback: ${JSON.stringify(data.invalidMatrix.filter(item=>item.callbackCount!==0||!item.error))}`);
    for(const [id,options] of Object.entries(data.unitOptions)){
      assert.deepEqual(options.slice(1),getSupportedUnitsForProperty(id));
    }
    assert.deepEqual(data.saved,{blockIndex:0,from:6,to:11});
    assert.deepEqual(data.editing,{blockIndex:0,from:6,to:11});
    assert.equal(data.linkPresent,true);
    assert.equal(data.linksAfterRemoval,0);
    assert.deepEqual(data.markedRun.marks,['bold']);
    assert.equal(data.markedRun.link.href,'/p/home');
    assert.equal(data.markedRun.styles.fontSize,'24px');assert.equal(data.markedRun.styles.fontFamily,'Georgia');assert.equal(data.alignment,'justify');
    assert.deepEqual(data.multiSelection,{segments:[{blockIndex:0,from:0,to:15},{blockIndex:1,from:0,to:6}]});
    assert.equal(data.multiBlocks[0].align,'center');assert.equal(data.multiBlocks[1].align,'center');
    assert.ok(data.multiBlocks[0].children[0].marks.includes('italic'));assert.ok(data.multiBlocks[1].children[0].marks.includes('italic'));
    assert.equal(data.multiBlocks[0].children[0].styles.fontSize,'20px');assert.equal(data.multiBlocks[1].children[0].styles.fontSize,'20px');
    assert.equal(data.listType,'numbered-list');
    assert.equal(data.listText,'Hello world');
    assert.deepEqual(data.importedBlocks,['heading','paragraph','bulleted-list','table']);
    assert.equal(data.importedText,'Quarterly report');
    assert.equal(data.importedAlignment,'center');
    assert.ok(data.importedMarks[3].includes('italic'));
    assert.ok(data.importedMarks[5].includes('strikethrough'));
    assert.ok(data.importedMarks[6].includes('subscript'));
    assert.deepEqual(data.importedInlineStyles[3],{color:'#0c2238',backgroundColor:'#ffee99'});
    assert.equal(data.importedLinks,0,'unsafe pasted links must be dropped without losing their text');
    assert.deepEqual(data.importedTable,[['Name','Value'],['Revenue','100'],['Year','2026']]);
    assert.equal(data.officeStyles.align,'right');assert.deepEqual(data.officeStyles.children[0].styles,{color:'#112233',fontSize:'24px',fontFamily:'Calibri'});
    assert.equal(data.tableCell.align,'right');assert.equal(data.tableCell.children[0].styles.fontSize,'16px');
    assert.equal(data.tsvType,'table');assert.deepEqual(data.tsvShape,[2,2]);assert.equal(data.oversizedPasteRejected,true);
    assert.equal(data.pasteAttack,undefined,'Office markup must be parsed as inert content');
    await page.close();
  }
});

function getSupportedUnitsForProperty(id){
  const units={
    'transform.rotate':['deg'],
    'size.width':['auto','px','%','vw','rem'],'size.height':['auto','px','%','vh','rem'],
    'size.minWidth':['px','%','vw','rem'],'size.maxWidth':['px','%','vw','rem'],
    'size.minHeight':['px','%','vh','rem'],'size.maxHeight':['px','%','vh','rem'],
    'position.x':['px','%','vw','rem'],'position.y':['px','%','vh','rem'],
    'typography.fontSize':['px','rem','em','vw'],'typography.letterSpacing':['px','rem','em'],
    'typography.wordSpacing':['px','rem','em'],'typography.textIndent':['px','rem','em','%'],
    'border.width':['px'],'radius.all':['px','rem','%'],'radius.topLeft':['px','rem','%'],
    'radius.topRight':['px','rem','%'],'radius.bottomRight':['px','rem','%'],'radius.bottomLeft':['px','rem','%'],
    'flex.gap':['px','rem','em','%'],'flex.basis':['auto','px','%','rem'],
    'grid.rowGap':['px','rem','em','%'],'grid.columnGap':['px','rem','em','%']
  };
  return units[id]??[];
}


test('shared Inspector color controls synchronize RGB, short HEX, alpha, transparent and presets',async t=>{
  const http=serve();await new Promise(resolve=>http.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(resolve=>http.close(resolve));});
  for(const width of [390,1366]){
    const page=await browser.newPage({viewport:{width,height:850}});
    await page.goto('http://127.0.0.1:'+http.address().port+'/editor-v2/index.html');
    const values=await page.evaluate(async()=>{
      const {renderPropertyInput}=await import('/editor-v2/ui/property-controls.js');
      const {getProperty}=await import('/editor-v2/core/property-registry.js');
      const committed=[];
      const root=renderPropertyInput(getProperty('background.color'),'Háttérszín','#abc',value=>{committed.push(value);return true});
      document.body.append(root);
      const picker=root.querySelector('input[type=color]'),hex=root.querySelector('input[type=text]');
      const start=[picker.value,hex.value];
      picker.value='#123456';picker.dispatchEvent(new Event('change',{bubbles:true}));
      const fromPicker=[picker.value,hex.value];
      hex.value='#fed';hex.dispatchEvent(new Event('change',{bubbles:true}));
      const fromShortHex=[picker.value,hex.value];
      hex.value='not-a-color';hex.dispatchEvent(new Event('change',{bubbles:true}));
      const invalid=[picker.value,hex.value,root.querySelector('.property-validation').textContent,committed.length];
      hex.value='#11223344';hex.dispatchEvent(new Event('change',{bubbles:true}));
      const alpha=[picker.value,hex.value,root.querySelector('.typed-color-status').textContent,picker.classList.contains('color-preview-limited')];
      hex.value='#abcd';hex.dispatchEvent(new Event('change',{bubbles:true}));
      const shortAlpha=[picker.value,hex.value,root.querySelector('.typed-color-status').textContent,picker.classList.contains('color-preview-limited')];
      hex.value='transparent';hex.dispatchEvent(new Event('change',{bubbles:true}));
      const transparent=[hex.value,root.querySelector('.typed-color-status').textContent,picker.classList.contains('color-preview-limited')];
      const preset=root.querySelector('.property-presets .property-preset-color');
      if(preset)preset.click();
      const fromPreset=preset?[picker.value,hex.value,root.querySelector('.property-validation').textContent]:null;
      return {start,fromPicker,fromShortHex,invalid,alpha,shortAlpha,transparent,fromPreset,presetValue:preset?.dataset.value,committed};
    });
    assert.deepEqual(values.start,['#aabbcc','#abc']);
    assert.deepEqual(values.fromPicker,['#123456','#123456']);
    assert.deepEqual(values.fromShortHex,['#ffeedd','#fed']);
    assert.equal(values.invalid[0],'#ffeedd');
    assert.equal(values.invalid[1],'not-a-color');
    assert.match(values.invalid[2],/HEX/);
    assert.equal(values.invalid[3],2,'invalid color must not reach Page Model command');
    assert.deepEqual(values.alpha.slice(0,2),['#112233','#11223344']);
    assert.ok(values.alpha[2].includes('RGB')&&values.alpha[3]);
    assert.deepEqual(values.shortAlpha.slice(0,2),['#aabbcc','#abcd']);
    assert.ok(values.shortAlpha[2].includes('RGB')&&values.shortAlpha[3]);
    assert.ok(values.transparent[1].includes('Átlátszó')&&values.transparent[2]);
    assert.equal(values.fromPreset?.[1],values.presetValue,'a preset must update the same HEX and swatch state');
    assert.equal(values.fromPreset?.[2],'','valid preset must clear prior errors');
    await page.close();
  }
});
