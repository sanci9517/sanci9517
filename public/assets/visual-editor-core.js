(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const uid=()=>crypto.randomUUID?crypto.randomUUID():`b-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone=o=>JSON.parse(JSON.stringify(o));
  const initial=()=>({version:3,blocks:[]});
  const layout=()=>({direction:'column',align:'stretch',justify:'start',gap:'16',width:'100%',valign:'top'});
  const defaults={
    section:{label:'Szakasz',icon:'▣',children:[],layout:{...layout(),width:'100%'},style:{padding:'42px 50px'}},
    container:{label:'Doboz / Box',icon:'▤',children:[],layout:layout(),style:{padding:'26px'}},
    heading:{label:'Címsor',icon:'H',content:{text:'Új címsor',level:'h2',align:'left'}},
    text:{label:'Szöveg',icon:'T',content:{text:'Ide kerül a szöveg.',align:'left'}},
    image:{label:'Kép',icon:'▧',content:{src:'',alt:'Kép'}},
    button:{label:'Gomb',icon:'→',content:{text:'Kattints ide',url:'#',align:'left'}},
    divider:{label:'Elválasztó',icon:'—'},
    spacer:{label:'Térköz',icon:'↕',style:{height:'40px'}},
    columns:{label:'Oszlopok',icon:'▥',children:[{id:uid(),type:'column',label:'Oszlop 1',children:[],layout:layout()},{id:uid(),type:'column',label:'Oszlop 2',children:[],layout:layout()}],layout:{...layout(),direction:'row',gap:'18',width:'100%'},style:{}},
    column:{label:'Oszlop',icon:'▥',children:[],layout:layout()}
  };
  const state={pages:[],page:null,selected:null,device:'desktop',history:[],future:[],dirty:false};
  const containerTypes=new Set(['section','container','columns','column']);
  function normalizeBlock(b){
    if(!b||typeof b!=='object')return null;
    b.id=b.id||uid();
    const d=defaults[b.type];
    if(d){b.label=b.label||d.label;b.icon=b.icon||d.icon;if(d.children&&!Array.isArray(b.children))b.children=clone(d.children);if(d.layout&&!b.layout)b.layout=clone(d.layout);if(d.style&&!b.style)b.style=clone(d.style);if(d.content)b.content={...clone(d.content),...(b.content||{})};}
    if(b.children) b.children=b.children.map(normalizeBlock).filter(Boolean);
    return b;
  }
  function normalizeContent(raw){
    if(!raw||typeof raw!=='object')return initial();
    if(Array.isArray(raw.blocks))return {version:raw.version||3,blocks:raw.blocks.map(normalizeBlock).filter(Boolean)};
    const c=initial();
    if(raw.headline)c.blocks.push(normalizeBlock({id:uid(),type:'heading',content:{text:raw.headline,level:'h1',align:'left'}}));
    if(raw.text)c.blocks.push(normalizeBlock({id:uid(),type:'text',content:{text:raw.text,align:'left'}}));
    if(raw.image)c.blocks.push(normalizeBlock({id:uid(),type:'image',content:{src:raw.image,alt:''}}));
    if(raw.buttonText)c.blocks.push(normalizeBlock({id:uid(),type:'button',content:{text:raw.buttonText,url:raw.buttonUrl||'#',align:'left'}}));
    return c;
  }
  function snapshot(){return clone(state.page?.content||initial())}
  function pushHistory(){if(!state.page)return;state.history.push(snapshot());if(state.history.length>40)state.history.shift();state.future=[];state.dirty=true}
  function applyContent(content){state.page.content=normalizeContent(content);state.selected=null;state.dirty=true;renderAll()}
  function findBlock(nodes,id,parent=null){for(const n of nodes){if(n.id===id)return{node:n,parent};if(n.children){const f=findBlock(n.children,id,n);if(f)return f}}return null}
  function rootNodes(){return state.page?.content?.blocks||[]}
  function addToTarget(type,targetId=null){
    pushHistory();const base=normalizeBlock({...clone(defaults[type]||defaults.text),id:uid(),type});
    const f=targetId?findBlock(rootNodes(),targetId):null;
    if(f&&containerTypes.has(f.node.type)){f.node.children=f.node.children||[];f.node.children.push(base)}
    else if(f&&f.parent){const arr=f.parent.children;arr.splice(arr.findIndex(x=>x.id===f.node.id)+1,0,base)}
    else rootNodes().push(base);
    state.selected=base.id;renderAll();
  }
  function removeSelected(){const f=state.selected&&findBlock(rootNodes(),state.selected);if(!f)return;pushHistory();const arr=f.parent?f.parent.children:rootNodes();arr.splice(arr.findIndex(x=>x.id===state.selected),1);state.selected=null;renderAll()}
  function moveSelected(dir){const f=state.selected&&findBlock(rootNodes(),state.selected);if(!f)return;const arr=f.parent?f.parent.children:rootNodes();const i=arr.findIndex(x=>x.id===state.selected),j=i+dir;if(j<0||j>=arr.length)return;pushHistory();[arr[i],arr[j]]=[arr[j],arr[i]];renderAll()}
  const directionCss={column:'column',row:'row', 'grid-2':'row','grid-3':'row'};
  function layoutStyle(b){if(!b.layout)return'';const l=b.layout;let d=directionCss[l.direction]||'column';let display=(l.direction==='grid-2'||l.direction==='grid-3')?'grid':'flex';let cols=l.direction==='grid-2'?'repeat(2,minmax(0,1fr))':l.direction==='grid-3'?'repeat(3,minmax(0,1fr))':'';return `display:${display};flex-direction:${d};${cols?`grid-template-columns:${cols};`:''}align-items:${l.align==='left'?'flex-start':l.align==='right'?'flex-end':l.align==='center'?'center':'stretch'};justify-content:${l.justify==='center'?'center':l.justify==='end'?'flex-end':l.justify==='space-between'?'space-between':'flex-start'};gap:${esc(l.gap||'0')}px;width:${esc(l.width||'100%')};${l.valign==='center'?'min-height:100%;':''}`}
  function contentAlign(b){const a=b.content?.align||'left';return a==='center'?'center':a==='right'?'right':a==='justify'?'justify':'left'}
  function renderBlock(b,preview=false){
    const selected=!preview&&state.selected===b.id?' selected':'';let inner='';
    if(b.type==='heading'){const level=['h1','h2','h3','h4'].includes(b.content?.level)?b.content.level:'h2';inner=`<${level} class="ve-heading" style="text-align:${contentAlign(b)}">${esc(b.content?.text||'')}</${level}>`}
    else if(b.type==='text')inner=`<div class="ve-text" style="text-align:${contentAlign(b)}">${esc(b.content?.text||'').replace(/\n/g,'<br>')}</div>`;
    else if(b.type==='image')inner=b.content?.src?`<img src="${esc(b.content.src)}" alt="${esc(b.content.alt||'')}" style="max-width:100%;height:auto;display:block;align-self:${b.content.align==='center'?'center':b.content.align==='right'?'flex-end':'flex-start'}">`:'<div class="ve-image-placeholder">Kép hozzáadása</div>';
    else if(b.type==='button')inner=`<div style="text-align:${contentAlign(b)}"><a class="ve-button" href="${esc(b.content?.url||'#')}" onclick="return false">${esc(b.content?.text||'Gomb')}</a></div>`;
    else if(b.type==='divider')inner='<div class="ve-divider"></div>';
    else if(b.type==='spacer')inner=`<div class="ve-spacer" style="height:${esc(b.style?.height||'40px')}"></div>`;
    else if(b.type==='columns'||b.type==='section'||b.type==='container'||b.type==='column')inner=(b.children||[]).map(x=>renderBlock(x,preview)).join('')||`<div class="ve-dropzone">${b.type==='column'?'Oszlop':'Doboz'} — adj hozzá elemet</div>`;
    else inner=`<div class="ve-dropzone">${esc(b.label||b.type)}</div>`;
    const style=`${b.style?Object.entries(b.style).filter(([k])=>!['width'].includes(k)).map(([k,v])=>`${k}:${esc(v)}`).join(';'):''}${containerTypes.has(b.type)?layoutStyle(b):''}`;
    return `<div class="ve-block ve-${b.type}${selected}" data-id="${b.id}" style="${style}">${inner}</div>`;
  }
  function renderCanvas(target='#ve-canvas',preview=false){const el=$(target);if(!el)return;el.className=`ve-canvas ${state.device==='tablet'?'ve-tablet':''}${state.device==='mobile'?'ve-mobile':''}`;el.innerHTML=rootNodes().length?rootNodes().map(b=>renderBlock(b,preview)).join(''):'<div class="ve-empty">Üres oldal — válassz egy elemet balról</div>';if(!preview)el.querySelectorAll('[data-id]').forEach(x=>x.onclick=e=>{e.preventDefault();e.stopPropagation();state.selected=x.dataset.id;renderAll()})}
  function renderPages(){const el=$('#ve-pages');if(!el)return;el.innerHTML=state.pages.map(p=>`<button class="ve-page ${state.page?.id===p.id?'active':''}" data-page="${p.id}">▧ <span>${esc(p.title)}<small>/${esc(p.slug)}</small></span></button>`).join('')||'<div style="padding:10px;color:#8e98a8;font-size:12px">Nincs még oldal.</div>';el.querySelectorAll('[data-page]').forEach(x=>x.onclick=()=>openPage(x.dataset.page))}
  function renderLayers(){const el=$('#ve-layers');if(!el)return;const walk=(nodes,depth=0)=>nodes.map(b=>`<div class="ve-layer ${state.selected===b.id?'active':''}" data-layer="${b.id}" style="padding-left:${10+depth*16}px"><span>${b.icon||'□'}</span><span>${esc(b.label||b.type)}</span></div>${b.children?walk(b.children,depth+1):''}`).join('');el.innerHTML=walk(rootNodes())||'<div class="ve-empty-inspector">Nincs elem.</div>';el.querySelectorAll('[data-layer]').forEach(x=>x.onclick=()=>{state.selected=x.dataset.layer;renderAll()})}
  function selectOptions(value,items){return items.map(([v,t])=>`<option value="${v}" ${value===v?'selected':''}>${t}</option>`).join('')}
  function renderInspector(){
    const el=$('#ve-inspector');if(!el)return;const f=state.selected&&findBlock(rootNodes(),state.selected);if(!f){el.innerHTML='<div class="ve-empty-inspector">Válassz ki egy elemet a vásznon vagy a Rétegek panelen.</div>';return}
    const b=f.node;let html=`<div class="ve-field"><label>Elem neve</label><input value="${esc(b.label||b.type)}" data-edit="label"></div>`;
    if(b.content?.text!==undefined)html+=`<div class="ve-field"><label>Szöveg</label><textarea data-edit="content.text">${esc(b.content.text)}</textarea></div>`;
    if(b.content?.level!==undefined)html+=`<div class="ve-field"><label>Címsor szint</label><select data-edit="content.level">${selectOptions(b.content.level,[['h1','H1'],['h2','H2'],['h3','H3'],['h4','H4']])}</select></div>`;
    if(b.content?.url!==undefined)html+=`<div class="ve-field"><label>Link</label><input value="${esc(b.content.url)}" data-edit="content.url"></div>`;
    if(b.content?.src!==undefined)html+=`<div class="ve-field"><label>Kép URL</label><input value="${esc(b.content.src)}" data-edit="content.src"></div>`;
    if(b.content?.alt!==undefined)html+=`<div class="ve-field"><label>Alt szöveg</label><input value="${esc(b.content.alt)}" data-edit="content.alt"></div>`;
    if(b.content?.align!==undefined)html+=`<div class="ve-field"><label>Szöveg pozíció</label><select data-edit="content.align">${selectOptions(b.content.align,[['left','Balra'],['center','Középre'],['right','Jobbra'],['justify','Sorkizárt']])}</select></div>`;
    if(containerTypes.has(b.type)){
      b.layout=b.layout||layout();
      html+=`<div class="ve-inspector-section"><strong>Box / elrendezés</strong></div><div class="ve-field"><label>Belső elrendezés</label><select data-edit="layout.direction">${selectOptions(b.layout.direction,[['column','Egymás alatt'],['row','Egymás mellett'],['grid-2','2 oszlop'],['grid-3','3 oszlop']])}</select></div><div class="ve-field"><label>Box pozíció</label><select data-edit="layout.align">${selectOptions(b.layout.align,[['left','Balra'],['center','Középre'],['right','Jobbra'],['stretch','Teljes szélesség']])}</select></div><div class="ve-field"><label>Függőleges igazítás</label><select data-edit="layout.valign">${selectOptions(b.layout.valign,[['top','Felül'],['center','Középen'],['bottom','Alul']])}</select></div><div class="ve-field"><label>Elemek közti távolság</label><select data-edit="layout.gap">${selectOptions(String(b.layout.gap),[['0','0 px'],['8','8 px'],['12','12 px'],['16','16 px'],['24','24 px'],['32','32 px']])}</select></div><div class="ve-field"><label>Box mérete</label><select data-edit="layout.width">${selectOptions(b.layout.width,[['auto','Automatikus'],['25%','25%'],['50%','50%'],['75%','75%'],['100%','100%']])}</select></div>`;
    }
    if(b.style?.height!==undefined)html+=`<div class="ve-field"><label>Magasság</label><select data-edit="style.height">${selectOptions(b.style.height,[['20px','20 px'],['40px','40 px'],['60px','60 px'],['80px','80 px'],['120px','120 px']])}</select></div>`;
    html+=`<div class="ve-field"><label>Háttér</label><input placeholder="#ffffff vagy transparent" value="${esc(b.style?.background||'')}" data-edit="style.background"></div><div class="ve-field"><label>Box belső tér</label><select data-edit="style.padding">${selectOptions(b.style?.padding||'26px',[['0','0 px'],['12px','12 px'],['20px','20 px'],['26px','26 px'],['32px','32 px'],['42px','42 px']])}</select></div><div class="ve-inspector-actions"><button class="ve-btn" id="ve-up">↑ Fel</button><button class="ve-btn" id="ve-down">↓ Le</button><button class="ve-btn danger" id="ve-delete">Törlés</button></div>`;
    el.innerHTML=html;
    el.querySelectorAll('[data-edit]').forEach(inp=>inp.onchange=()=>{pushHistory();const parts=inp.dataset.edit.split('.');if(parts.length===2){b[parts[0]]=b[parts[0]]||{};b[parts[0]][parts[1]]=inp.value}else b[inp.dataset.edit]=inp.value;renderAll()});
    $('#ve-up').onclick=()=>moveSelected(-1);$('#ve-down').onclick=()=>moveSelected(1);$('#ve-delete').onclick=removeSelected;
  }
  function renderAll(){renderPages();renderCanvas();renderLayers();renderInspector();const d=$('#ve-dirty');if(d)d.textContent=state.dirty?'●':'✓'}
  async function loadPages(){try{const r=await fetch('/api/admin/pages');const j=await r.json();state.pages=j?.data||[]}catch(e){state.pages=[];toast('Az oldalak betöltése sikertelen.')}}
  async function openPage(id){const p=state.pages.find(x=>x.id===id);if(!p)return;let content;try{content=typeof p.content_json==='string'?JSON.parse(p.content_json):p.content_json}catch(e){content=initial();toast('Az oldal tartalma hibás JSON volt; üres szerkezetként nyílt meg.')}state.page={...clone(p),content:normalizeContent(content)};state.selected=null;state.history=[];state.future=[];state.dirty=false;renderAll()}
  async function newPage(){const title=prompt('Új oldal neve?','Új oldal');if(!title)return;const slug=(prompt('URL slug?',title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))||'').trim().toLowerCase();if(!slug)return;const r=await fetch('/api/admin/pages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,slug,description:'',content:initial(),is_published:0})});const j=await r.json();if(!r.ok){toast(j?.error?.message||'Nem sikerült létrehozni');return}await loadPages();await openPage(j.data.id);toast('Oldal létrehozva')}
  async function save(){if(!state.page)return;const body={id:state.page.id,title:state.page.title,slug:state.page.slug,description:state.page.description||'',content:state.page.content,is_published:state.page.is_published?1:0};const r=await fetch('/api/admin/pages',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!r.ok){toast(j?.error?.message||'Mentési hiba');return}state.dirty=false;await loadPages();toast('Mentve')}
  function undo(){if(!state.history.length)return;state.future.push(snapshot());applyContent(state.history.pop())}
  function redo(){if(!state.future.length)return;state.history.push(snapshot());applyContent(state.future.pop())}
  function toast(t){const e=$('#ve-toast');if(!e)return;e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
  function bind(){
    $('#ve-new')?.addEventListener('click',newPage);$('#ve-save')?.addEventListener('click',save);$('#ve-undo')?.addEventListener('click',undo);$('#ve-redo')?.addEventListener('click',redo);
    $('#ve-preview')?.addEventListener('click',()=>{$('#ve-modal').hidden=false;renderCanvas('#ve-preview-canvas',true)});$('#ve-close')?.addEventListener('click',()=>$('#ve-modal').hidden=true);$('#ve-back')?.addEventListener('click',()=>location.href='/admin.html');
    document.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{state.device=b.dataset.device;document.querySelectorAll('[data-device]').forEach(x=>x.classList.toggle('active',x===b));renderCanvas()});
    document.querySelectorAll('[data-add]').forEach(b=>b.onclick=e=>{e.preventDefault();addToTarget(b.dataset.add,state.selected)});
  }
  window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo()}if(e.key==='Delete'&&state.selected&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))removeSelected()});
  window.VisualEditorCore={init:async()=>{await loadPages();bind();if(state.pages[0])await openPage(state.pages[0].id);else renderAll()}};
})();