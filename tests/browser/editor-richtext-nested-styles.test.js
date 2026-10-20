import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(import.meta.dirname,'../../public');

test('Rich Text nested CSS uses closest visible style after DOM-to-model and editor roundtrip at mobile/desktop widths',async t=>{
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
      const {richTextEditorToDocument,renderRichTextEditor}=await import('/editor-v2/core/richtext-engine.js');
      const {normalizeRichText}=await import('/editor-v2/core/schema.js');
      const surface=document.getElementById('fixture');
      surface.contentEditable='true';
      surface.innerHTML=`
        <p data-rich-block="0"><span style="color:#112233;background-color:#ffee00;font-size:18px;font-family:Arial">
          <span style="color:#8899aa;font-size:26px;font-family:Georgia"><strong>INNER</strong></span><span> OUTER</span>
        </span></p>
        <ul data-rich-block="1"><li><span style="color:#445566;font-size:21px">
          <span style="color:#aabbcc;font-size:24px"><em>LIST</em></span> NEXT
        </span></li></ul>
        <table data-rich-block="2"><tbody><tr>
          <th style="text-align:center"><span style="color:#123456"><a href="/p/safe"><span style="color:#abcdef"><strong>HEADER</strong></span></a></span></th>
          <td style="text-align:right"><span style="background-color:#ffdd00;font-family:Arial">
            <span style="background-color:#aabbcc;font-family:Cambria">CELL</span> OTHER
          </span></td>
        </tr></tbody></table>`;
      const observed={
        inner:getComputedStyle(surface.querySelector('p strong')).color,
        outer:getComputedStyle(surface.querySelector('p span:last-child')).color
      };
      const model=normalizeRichText(richTextEditorToDocument(surface));
      const roundtrip=document.createElement('div');
      renderRichTextEditor(roundtrip,model);
      document.body.append(roundtrip);
      const roundtripModel=normalizeRichText(richTextEditorToDocument(roundtrip));
      const rendered={
        inner:getComputedStyle(roundtrip.querySelector('p strong')).color,
        outer:getComputedStyle(roundtrip.querySelector('p span:last-child')).color,
        header:roundtrip.querySelector('table th')?.style.textAlign,
        cell:roundtrip.querySelector('table td')?.style.textAlign,
        href:roundtrip.querySelector('table th a')?.getAttribute('href')
      };
      const pRuns=model.blocks[0].children;
      const listRuns=model.blocks[1].items[0];
      const cells=model.blocks[2].rows[0].cells;
      return {observed,rendered,modelEqual:JSON.stringify(model)===JSON.stringify(roundtripModel),
        p:pRuns.filter(run=>run.text.trim()).map(run=>({text:run.text.trim(),styles:run.styles,marks:run.marks})),
        li:listRuns.filter(run=>run.text.trim()).map(run=>({text:run.text.trim(),styles:run.styles,marks:run.marks})),
        th:cells[0],td:cells[1]};
    });
    assert.deepEqual(result.p,[
      {text:'INNER',styles:{color:'#8899aa',backgroundColor:'#ffee00',fontFamily:'Georgia',fontSize:'26px'},marks:['bold']},
      {text:'OUTER',styles:{color:'#112233',backgroundColor:'#ffee00',fontFamily:'Arial',fontSize:'18px'},marks:[]}
    ],'closest color/size/family wins, unspecified highlight inherits outer');
    assert.deepEqual(result.li,[
      {text:'LIST',styles:{color:'#aabbcc',fontSize:'24px'},marks:['italic']},
      {text:'NEXT',styles:{color:'#445566',fontSize:'21px'},marks:[]}
    ],'nested LI marks and nearest colors survive DOM bridge');
    assert.equal(result.th.header,true);
    assert.equal(result.th.align,'center');
    assert.equal(result.th.children.find(run=>run.text==='HEADER')?.styles?.color,'#abcdef');
    assert.equal(result.th.children.find(run=>run.text==='HEADER')?.link?.href,'/p/safe');
    assert.equal(result.td.align,'right');
    assert.equal(result.td.children.find(run=>run.text==='CELL')?.styles?.backgroundColor,'#aabbcc');
    assert.equal(result.td.children.find(run=>run.text==='CELL')?.styles?.fontFamily,'Cambria');
    assert.equal(result.td.children.find(run=>run.text.trim()==='OTHER')?.styles?.backgroundColor,'#ffdd00');
    assert.equal(result.modelEqual,true,'canonical saved model stable after inspector rerender');
    assert.equal(result.observed.inner,result.rendered.inner,'inner visible color must survive model serialization');
    assert.equal(result.observed.outer,result.rendered.outer,'outer visible color must survive model serialization');
    assert.equal(result.rendered.header,'center');
    assert.equal(result.rendered.cell,'right');
    assert.equal(result.rendered.href,'/p/safe');
    await page.close();
  }
});
