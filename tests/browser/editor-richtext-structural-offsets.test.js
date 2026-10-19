import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(import.meta.dirname,'../../public');

test('Rich Text list/table/cross-block DOM range offsets match Page Model at mobile and desktop widths',async t=>{
  const server=createServer(async(req,res)=>{
    const path=new URL(req.url,'http://localhost').pathname;
    if(path==='/'){res.setHeader('content-type','text/html');res.end('<!doctype html><html><body><main id="fixture"></main></body></html>');return}
    const file=resolve(root,'.'+path);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.js':'text/javascript','.css':'text/css','.html':'text/html'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  for(const width of [390,1366]){
    const page=await browser.newPage({viewport:{width,height:850}});
    await page.goto('http://127.0.0.1:'+server.address().port+'/');
    const result=await page.evaluate(async()=>{
      const {renderRichTextEditor,getSelectionOffsets,restoreSelectionOffsets}=await import('/editor-v2/core/richtext-engine.js');
      const {getRichTextBlockSelection,getRichTextFormattingSelection,restoreRichTextFormattingSelection,updateRichTextInlineLink,updateRichTextInlineMark,updateRichTextInlineStyle,clearRichTextInlineFormatting}=await import('/editor-v2/core/richtext-links.js');
      const fixture={
        schemaVersion:1,type:'richtext-document',blocks:[
          {type:'bulleted-list',items:[
            [{type:'text',text:'Alpha',marks:[]}],
            [{type:'text',text:'Beta',marks:['bold']}]
          ]},
          {type:'table',rows:[{cells:[
            {header:true,align:'center',children:[{type:'text',text:'Gamma',marks:[]}]},
            {header:false,align:'right',children:[{type:'text',text:'Delta',marks:['italic']}]}
          ]}]},
          {type:'paragraph',children:[{type:'text',text:'Omega',marks:[]}]}
        ]
      };
      const root=document.getElementById('fixture');
      root.contentEditable='true';renderRichTextEditor(root,fixture);
      const nodes=()=>[...root.querySelectorAll('li,th,td,p')].map(el=>document.createTreeWalker(el,NodeFilter.SHOW_TEXT).nextNode());
      const set=(first,from,last,to)=>{
        const texts=nodes(),r=document.createRange();
        r.setStart(texts[first],from);r.setEnd(texts[last],to);
        const selection=window.getSelection();selection.removeAllRanges();selection.addRange(r);
        return selection.toString();
      };
      const snapshots=[];
      // One top-level list block contains two differently marked LI targets.
      const listVisible=set(0,2,1,3);
      const listLink=getRichTextBlockSelection(root);
      const listFormat=getRichTextFormattingSelection(root);
      const listGlobal=getSelectionOffsets(root);
      const linkedList=updateRichTextInlineLink(fixture,listLink,'/p/item');
      const markedList=updateRichTextInlineMark(fixture,listFormat,'underline');
      const listSelectionRestored=restoreRichTextFormattingSelection(root,listFormat);
      snapshots.push({key:'list',visible:listVisible,link:listLink,format:listFormat,global:listGlobal,
        restored:listSelectionRestored,roundtrip:getRichTextFormattingSelection(root),
        linkedItems:linkedList.blocks[0].items.map(item=>item.filter(run=>run.link).map(run=>run.text).join('')),
        markedItems:markedList.blocks[0].items.map(item=>item.filter(run=>run.marks.includes('underline')).map(run=>run.text).join(''))});
      // One table block spans th and td, preserving cell-specific metadata.
      const tableVisible=set(2,2,3,3);
      const tableLink=getRichTextBlockSelection(root);
      const tableFormat=getRichTextFormattingSelection(root);
      const tableGlobal=getSelectionOffsets(root);
      const linkedTable=updateRichTextInlineLink(fixture,tableLink,'https://example.org/table');
      const styledTable=updateRichTextInlineStyle(fixture,tableFormat,'color','#112233');
      const tableSelectionRestored=restoreRichTextFormattingSelection(root,tableFormat);
      snapshots.push({key:'table',visible:tableVisible,link:tableLink,format:tableFormat,global:tableGlobal,
        restored:tableSelectionRestored,roundtrip:getRichTextFormattingSelection(root),
        linkedCells:linkedTable.blocks[1].rows[0].cells.map(cell=>cell.children.filter(run=>run.link).map(run=>run.text).join('')),
        styledCells:styledTable.blocks[1].rows[0].cells.map(cell=>cell.children.filter(run=>run.styles?.color).map(run=>run.text).join('')),
        header:linkedTable.blocks[1].rows[0].cells[0].header,align:linkedTable.blocks[1].rows[0].cells[1].align});
      // Across a list, a table and a paragraph: no artificial DOM separators.
      const acrossVisible=set(1,1,4,3);
      const across=getRichTextFormattingSelection(root);
      const acrossMark=updateRichTextInlineMark(fixture,across,'underline');
      const acrossRestore=restoreRichTextFormattingSelection(root,across);
      const acrossAfter=getRichTextFormattingSelection(root);
      const acrossGlobal=getSelectionOffsets(root);
      const acrossOffsetRestore=restoreSelectionOffsets(root,acrossGlobal);
      const cleared=clearRichTextInlineFormatting(acrossMark,across);
      snapshots.push({key:'cross',visible:acrossVisible,segments:across?.segments,restored:acrossRestore,
        after:acrossAfter?.segments,global:acrossGlobal,fallback:acrossOffsetRestore,
        list:acrossMark.blocks[0].items[1].filter(run=>run.marks.includes('underline')).map(run=>run.text).join(''),
        table:acrossMark.blocks[1].rows[0].cells.map(cell=>cell.children.filter(run=>run.marks.includes('underline')).map(run=>run.text).join('')),
        para:acrossMark.blocks[2].children.filter(run=>run.marks.includes('underline')).map(run=>run.text).join(''),
        cleared:cleared.blocks.every(block=>{
          const runs=block.children??block.items?.flatMap(item=>item)??block.rows?.flatMap(row=>row.cells.flatMap(cell=>cell.children))??[];
          return runs.every(run=>!run.marks.includes('underline'));
        })});
      // A collapsed caret inside a previously formatted nested anchor edits that link.
      renderRichTextEditor(root,linkedTable);
      const anchor=root.querySelector('td a');
      const nested=anchor.querySelector('span')?.firstChild??anchor.firstChild;
      const caret=document.createRange();caret.setStart(nested,1);caret.collapse(true);
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(caret);
      snapshots.push({key:'caret',range:getRichTextBlockSelection(root)});
      return snapshots;
    });
    const [list,table,cross,caret]=result;
    assert.deepEqual(list.link,{blockIndex:0,from:2,to:8},'list item separator must not be counted');
    assert.deepEqual(list.format,{segments:[list.link]});
    assert.deepEqual(list.global,{from:2,to:8,collapsed:false});
    assert.deepEqual(list.roundtrip,list.format);
    assert.equal(list.restored,true);
    assert.deepEqual(list.linkedItems,['pha','Bet']);
    assert.deepEqual(list.markedItems,['pha','Bet']);

    assert.deepEqual(table.link,{blockIndex:1,from:2,to:8},'table cell separator must not be counted');
    assert.deepEqual(table.format,{segments:[table.link]});
    assert.deepEqual(table.global,{from:11,to:17,collapsed:false},'global offset must sum list and table text, without implicit separators');
    assert.deepEqual(table.roundtrip,table.format);
    assert.equal(table.restored,true);
    assert.deepEqual(table.linkedCells,['mma','Del']);
    assert.deepEqual(table.styledCells,['mma','Del']);
    assert.equal(table.header,true);
    assert.equal(table.align,'right');

    assert.deepEqual(cross.segments,[
      {blockIndex:0,from:6,to:9},
      {blockIndex:1,from:0,to:10},
      {blockIndex:2,from:0,to:3}
    ]);
    assert.deepEqual(cross.after,cross.segments);
    assert.equal(cross.restored,true);
    assert.deepEqual(cross.global,{from:6,to:21,collapsed:false});
    assert.equal(cross.fallback,true);
    assert.equal(cross.list,'eta');
    assert.deepEqual(cross.table,['Gamma','Delta']);
    assert.equal(cross.para,'Ome');
    assert.equal(cross.cleared,true);
    assert.deepEqual(caret.range,{blockIndex:1,from:5,to:8},'collapsed caret expands to the nested linked fragment');
    await page.close();
  }
});
