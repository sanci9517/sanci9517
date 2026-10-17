import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve, extname} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(import.meta.dirname,'../..','public');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const widths=[1920,1600,1440,1366,1280,1100,1024,900,768,430,390,360];
const scales=[1,1.25,1.5];
const actionable='.topbar button,.topbar summary,.topbar select,.canvas-toolbar button,.mobile-bottom-bar button,.dock:not(.closed) button,.dock:not(.closed) input,.dock:not(.closed) select,.dock:not(.closed) textarea';

function server(){return createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname.startsWith('/api/')){res.setHeader('content-type','application/json');res.end('{}');return}
  const file=resolve(root,'.'+(pathname==='/'?'/editor-v2/index.html':pathname));
  if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
  try{const body=await readFile(file);res.setHeader('content-type',mime[extname(file)]||'application/octet-stream');res.end(body)}
  catch{res.writeHead(404).end()}
})}

async function audit(page,label){
  const issues=await page.evaluate(selector=>{
    const errors=[];
    const visible=el=>{if(el.matches('.dock-resizer'))return false;/* Resize handles intentionally overlay dock edges. */const s=getComputedStyle(el);const r=el.getBoundingClientRect();if(s.visibility==='hidden'||s.display==='none'||r.width<=0||r.height<=0||!el.getClientRects().length)return false;const scroller=el.closest('.dock-content');if(scroller){const c=scroller.getBoundingClientRect();if(r.bottom<=c.top||r.top>=c.bottom||r.right<=c.left||r.left>=c.right)return false}return true};
    const sheetOpen=innerWidth<=1024 && document.querySelector('.workspace')?.matches('.left-open,.right-open');
    const menuOpen=innerWidth<=1024 && document.querySelector('.more-actions')?.open;
    // An open mobile drawer intentionally covers the canvas and its toolbar.
    const nodes=[...document.querySelectorAll(selector)].filter(el=>visible(el)&&!((sheetOpen||menuOpen)&&el.closest('.canvas-toolbar')));
    for(const id of ['save','publish'])if(!visible(document.getElementById(id)))errors.push(`${id} not visible`);
    const boxes=nodes.map(el=>({id:el.id||el.textContent.trim().slice(0,25),el,r:el.getBoundingClientRect()}));
    const width=document.documentElement.clientWidth;
    if(document.documentElement.scrollWidth>width+1)errors.push(`document horizontal overflow ${document.documentElement.scrollWidth}>${width}`);
    for(const {id,el,r} of boxes){
      if(r.left<-1||r.right>width+1||r.top<-1||r.bottom>innerHeight+1)errors.push(`${id} outside viewport`);
      if(innerWidth<=1024 && el.closest('.topbar,.mobile-bottom-bar') && (r.width<43||r.height<43))errors.push(`${id} touch target <44px`);
      const parent=el.closest('.topbar,.canvas-toolbar,.mobile-bottom-bar');
      const p=parent?.getBoundingClientRect();
      if(p&&!el.closest('.more-actions-menu')&&(r.left<p.left-1||r.right>p.right+1||r.top<p.top-1||r.bottom>p.bottom+1))errors.push(`${id} clipped by ${parent.className}`);
      const center=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
      if(!el.contains(center)&&!center?.contains(el))errors.push(`${id} blocked at center by ${center?.id||center?.className||center?.tagName}`);
    }
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
      const a=boxes[i],b=boxes[j];
      // The fixed mobile action bar intentionally overlays the scrollable canvas,
      // but interactive shell controls must never overlap one another.
      if(Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>2 && Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>2)
        errors.push(`${a.id} overlaps ${b.id}`);
    }
    return errors;
  },actionable);
  assert.deepEqual(issues,[],label+': '+issues.join('; '));
}

test('Editor shell has no inaccessible or overlapping controls across widths and effective zoom',async t=>{
  const http=server();await new Promise(r=>http.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(r=>http.close(r))});
  const base=`http://127.0.0.1:${http.address().port}/editor-v2/index.html`;
  for(const width of widths)for(const zoom of scales){
    const effective=Math.floor(width/zoom);
    const page=await browser.newPage({viewport:{width:effective,height:900},deviceScaleFactor:1});
    await page.goto(base,{waitUntil:'load'});
    await page.waitForSelector('#editorMenu');
    await page.locator('#pageSelect').evaluate(el=>{el.innerHTML='<option>Rendkívül hosszú magyar oldalcím és állapotjelzés</option>'});
    await page.locator('#saveStatus').evaluate(el=>{el.textContent='A mentés folyamatban, kérjük várj a visszajelzésre'});
    await audit(page,`${width}px/${zoom*100}% closed`);
    if(zoom===1&&[1440,768,390].includes(width))await page.screenshot({path:`/tmp/editor-issue42-${width}-closed.png`,fullPage:true});
    if(zoom===1){
      await page.locator('#editorMenu').click();
      if([1440,768,390].includes(width)){
        await page.locator('#pageList').evaluate(el=>{
          const row=document.createElement('div');row.className='page-row';
          row.innerHTML='<button class="page-row-select"><span class="page-icon">▧</span><strong>Rendkívül hosszú magyar gyermekoldal címe</strong><small class="page-meta">ÉLŐ · MÓDOSÍTOTT PISZKOZAT · Szülő: Nagyon hosszú szülőoldal</small></button><div class="page-row-actions"><button class="page-order">↑</button><button class="page-order">↓</button><button class="page-edit">✎</button><button>Szülő</button><button class="page-duplicate">⧉</button><button>Archiválás</button><button class="page-delete">×</button></div>';
          el.append(row);el.style.minHeight='1500px';
        });
        const scrolled=await page.locator('.dock-content[data-content=pages]').evaluate(el=>{el.scrollTop=250;return el.scrollTop});
        assert.ok(scrolled>0,`${width}px dock must scroll independently`);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollTop),0);
        await page.locator('.dock-content[data-content=pages]').evaluate(el=>{el.scrollTop=0});
      }
      await audit(page,`${width}px left open`);
      await page.locator('.rail-btn[data-tab="navigation"]').click();
      await audit(page,`${width}px navigation`);
      await page.locator('.rail-btn[data-tab="layers"]').click();
      await audit(page,`${width}px layers`);
      if(width===1440){
        const resized=await page.evaluate(()=>{
          const root=document.documentElement;const before=parseFloat(getComputedStyle(root).getPropertyValue('--left-dock-width'));
          window.sanciEditor.resizeDock('left',100,before);
          window.dispatchEvent(new PointerEvent('pointermove',{clientX:150}));
          window.dispatchEvent(new PointerEvent('pointerup'));
          return parseFloat(getComputedStyle(root).getPropertyValue('--left-dock-width'))-before;
        });
        assert.equal(resized,50,'desktop dock resize must change panel width');
        await audit(page,'1440px resized dock');
      }
      await page.locator('#openInspector').click();
      if([1440,768,390].includes(width))await page.locator('#inspectorBody').evaluate(el=>{el.innerHTML='<div class="inspector-selection"><b>Rendkívül hosszú kijelölt elem neve</b></div><label class="field"><span>Hosszú magyar Inspector mezőfelirat</span><input aria-label="Inspector próba" value="Minta"></label><div class="inspector-actions"><button class="danger-action">Kijelölt elem törlése</button></div>'});
      await audit(page,`${width}px inspector`);
      await page.locator('.more-actions summary').click();
      await page.waitForTimeout(30);
      await audit(page,`${width}px overflow menu`);
      if([1440,768,390].includes(width))await page.screenshot({path:`/tmp/editor-issue42-${width}.png`,fullPage:true});
    }
    await page.close();
  }
});
