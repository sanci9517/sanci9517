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
      const {getProperty}=await import('/editor-v2/core/property-registry.js');
      const {getRichTextBlockSelection,updateRichTextInlineLink,updateRichTextInlineMark}=await import('/editor-v2/core/richtext-links.js');
      const {renderRichTextEditor,richTextEditorToDocument,setBlockType}=await import('/editor-v2/core/richtext-engine.js');
      const host=document.createElement('div');document.body.append(host);
      const edits=[];
      const color=renderPropertyInput(getProperty('background.color'),'Háttérszín','#112233',v=>edits.push(v));
      host.append(color);
      const picker=color.querySelector('input[type=color]');
      picker.value='#abcdef';picker.dispatchEvent(new Event('change',{bubbles:true}));
      const box=renderPropertyInput(getProperty('spacing.padding'),'Belső térköz','8px',v=>edits.push(v));
      host.append(box);
      const sides=box.querySelectorAll('input');
      sides[1].value='12px';sides[1].dispatchEvent(new Event('change',{bubbles:true}));
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
      const marked=updateRichTextInlineMark(linked,saved,'bold');
      renderRichTextEditor(editor,marked);
      const parsedMarked=richTextEditorToDocument(editor);
      const list=setBlockType(parsedMarked,0,11,'numbered-list');
      renderRichTextEditor(editor,list);
      const parsedList=richTextEditorToDocument(editor);
      return {edits,saved,editing,linkPresent,linksAfterRemoval:unlinked.blocks[0].children.filter(x=>x.link).length,
        markedRun:parsedMarked.blocks[0].children.find(x=>x.text==='world'),
        listType:parsedList.blocks[0].type,listText:parsedList.blocks[0].items[0].children.map(x=>x.text).join(''),
        hasHorizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1};
    });
    assert.deepEqual(data.edits,['#abcdef','8px 12px 8px 8px']);
    assert.deepEqual(data.saved,{blockIndex:0,from:6,to:11});
    assert.deepEqual(data.editing,{blockIndex:0,from:6,to:11});
    assert.equal(data.linkPresent,true);
    assert.equal(data.linksAfterRemoval,0);
    assert.deepEqual(data.markedRun.marks,['bold']);
    assert.equal(data.markedRun.link.href,'/p/home');
    assert.equal(data.listType,'numbered-list');
    assert.equal(data.listText,'Hello world');
    await page.close();
  }
});
