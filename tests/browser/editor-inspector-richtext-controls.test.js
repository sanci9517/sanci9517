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
    await page.goto('http://127.0.0.1:'+server.address().port+'/editor-v2/index.html');
    const data=await page.evaluate(async()=>{
      const {renderPropertyInput}=await import('/editor-v2/ui/property-controls.js');
      const {getProperty,listProperties}=await import('/editor-v2/core/property-registry.js');
      const {getRichTextBlockSelection,getRichTextFormattingSelection,updateRichTextInlineLink,updateRichTextInlineMark,updateRichTextInlineStyle,updateRichTextBlockAlignment}=await import('/editor-v2/core/richtext-links.js');
      const {renderRichTextEditor,richTextEditorToDocument,setBlockType}=await import('/editor-v2/core/richtext-engine.js');
      const {importRichTextClipboard}=await import('/editor-v2/core/richtext-import.js');
      const {normalizeRichText}=await import('/editor-v2/core/schema.js');
      const host=document.createElement('div');document.body.append(host);
      const helpLengths=listProperties().map(property=>{
        const field=renderPropertyInput(property,property.label,'16px',()=>{});
        const description=field.querySelector('.property-help')?.textContent||'';
        return [property.id,description.length];
      });
      const edits=[];
      const color=renderPropertyInput(getProperty('background.color'),'Háttérszín','#112233',v=>edits.push(v));
      host.append(color);
      const picker=color.querySelector('input[type=color]');
      picker.value='#abcdef';picker.dispatchEvent(new Event('change',{bubbles:true}));
      const box=renderPropertyInput(getProperty('spacing.padding'),'Belső térköz','8px',v=>edits.push(v));
      host.append(box);
      const sides=box.querySelectorAll('input');
      sides[1].value='12px';sides[1].dispatchEvent(new Event('change',{bubbles:true}));
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
      return {edits,presetResults,unitOptions,helpLengths,saved,editing,linkPresent,linksAfterRemoval:unlinked.blocks[0].children.filter(x=>x.link).length,
        importedBlocks:importedRoundTrip.blocks.map(block=>block.type),importedText:importedRoundTrip.blocks[0].children[0].text,importedAlignment:importedRoundTrip.blocks[0].align,
        importedMarks:importedRoundTrip.blocks[1].children.map(run=>run.marks),importedInlineStyles:importedRoundTrip.blocks[1].children.map(run=>run.styles??{}),
        importedLinks:importedRoundTrip.blocks[1].children.filter(run=>run.link).length,importedTable:importedRoundTrip.blocks[3].rows.map(row=>row.cells.map(cell=>cell.children.map(run=>run.text).join(''))),officeStyles:officeStyles.blocks[0],tableCell:importedRoundTrip.blocks[3].rows[2].cells[1],
        tsvType:importedTsv.blocks[0].type,tsvShape:[importedTsv.blocks[0].rows.length,importedTsv.blocks[0].rows[0].cells.length],oversizedPasteRejected,
        pasteAttack:window.__pasteAttack,
        markedRun:aligned.blocks[0].children.find(x=>x.text==='world'),alignment:aligned.blocks[0].align,
        multiSelection,multiBlocks:multiAligned.blocks,
        listType:parsedList.blocks[0].type,listText:parsedList.blocks[0].items[0].children.map(x=>x.text).join(''),
        hasHorizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1};
    });
    assert.deepEqual(data.edits,['#abcdef','8px 12px 8px 8px']);
    assert.ok(Object.keys(data.presetResults).length>=20);
    assert.ok(data.helpLengths.length>=45);
    assert.ok(data.helpLengths.every(([,length])=>length>=100),`every property needs detailed guidance: ${data.helpLengths.filter(([,length])=>length<100).map(([id])=>id).join(', ')}`);
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
    'size.width':['auto','px','%','vw','rem'],'size.height':['auto','px','%','vh','rem'],
    'size.minWidth':['px','%','vw','rem'],'size.maxWidth':['px','%','vw','rem'],
    'size.minHeight':['px','%','vh','rem'],'size.maxHeight':['px','%','vh','rem'],
    'position.x':['px','%','vw','rem'],'position.y':['px','%','vh','rem'],
    'typography.fontSize':['px','rem','em','vw'],'typography.letterSpacing':['px','rem','em'],
    'border.width':['px'],'radius.all':['px','rem','%'],'radius.topLeft':['px','rem','%'],
    'radius.topRight':['px','rem','%'],'radius.bottomRight':['px','rem','%'],'radius.bottomLeft':['px','rem','%'],
    'flex.gap':['px','rem','em','%'],'flex.basis':['auto','px','%','rem'],
    'grid.rowGap':['px','rem','em','%'],'grid.columnGap':['px','rem','em','%']
  };
  return units[id]??[];
}
