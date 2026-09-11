(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : `b-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const initial = () => ({version:2,blocks:[]});
  const defaults = {
    section:{label:'Szakasz',icon:'▣',children:[],style:{padding:'42px 50px'}},
    container:{label:'Kártya / doboz',icon:'▤',children:[],style:{padding:'26px'}},
    heading:{label:'Címsor',icon:'H',content:{text:'Új címsor',level:'h2'}},
    text:{label:'Szöveg',icon:'T',content:{text:'Ide kerül a szöveg.'}},
    image:{label:'Kép',icon:'▧',content:{src:'',alt:'Kép'}},
    button:{label:'Gomb',icon:'→',content:{text:'Kattints ide',url:'#'}},
    divider:{label:'Elválasztó',icon:'—'},
    spacer:{label:'Térköz',icon:'↕',style:{height:'40px'}},
    columns:{label:'Oszlopok',icon:'▥',children:[{id:uid(),type:'column',children:[]},{id:uid(),type:'column',children:[]}],style:{}} ,
    column:{label:'Oszlop',icon:'▥',children:[]}
  };
  const state = {pages:[],page:null,selected:null,device:'desktop',history:[],future:[],dirty:false};
  function normalizeContent(raw){
    if(!raw || typeof raw !== 'object') return initial();
    if(Array.isArray(raw.blocks)) return raw;
    const c=initial();
    if(raw.headline)c.blocks.push({id:uid(),type:'heading',content:{text:raw.headline,level:'h1'}});
    if(raw.text)c.blocks.push({id:uid(),type:'text',content:{text:raw.text}});
    if(raw.image)c.blocks.push({id:uid(),type:'image',content:{src:raw.image,alt:''}});
    if(raw.buttonText)c.blocks.push({id:uid(),type:'button',content:{text:raw.buttonText,url:raw.buttonUrl||'#'}});
    return c;
  }
  function snapshot(){return clone(state.page?.content || initial())}
  function pushHistory(){if(!state.page)return;state.history.push(snapshot());if(state.history.length>40)state.history.shift();state.future=[];state.dirty=true}
  function applyContent(content){state.page.content=normalizeContent(content);state.selected=null;state.dirty=true;renderAll()}
  function findBlock(nodes,id,parent=null){for(const n of nodes){if(n.id===id)return {node:n,parent};if(n.children){const f=findBlock(n.children,id,n);if(f)return f}}return null}
  function rootNodes(){return state.page?.content?.blocks || []}
  function addToTarget(type,targetId=null){
    pushHistory();const base=clone(defaults[type]||defaults.text);base.id=uid();base.type=type;
    const target=targetId&&findBlock(rootNodes(),targetId)?.node;
    if(target && (target.children||type==='column')){target.children=target.children||[];target.children.push(base)}
    else rootNodes().push(base);
    state.selected=base.id;renderAll();
  }
  function removeSelected(){if(!state.selected)return;const found=findBlock(rootNodes(),state.selected);if(!found)return;pushHistory();const arr=found.parent?found.parent.children:rootNodes();const i=arr.findIndex(x=>x.id===state.selected);if(i>=0)arr.splice(i,1);state.selected=null;renderAll()}
  function moveSelected(dir){if(!state.selected)return;const f=findBlock(rootNodes(),state.selected);if(!f)return;const arr=f.parent?f.parent.children:rootNodes();const i=arr.findIndex(x=>x.id===state.selected);const j=i+dir;if(j<0||j>=arr.length)return;pushHistory();[arr[i],arr[j]]=[arr[j],arr[i]];renderAll()}
  function renderBlock(b, interactive=true){
    const selected=state.selected===b.id?' selected':'';let inner='';
    if(b.type==='heading')inner=`<${b.content?.level||'h2'} class="ve-heading">${esc(b.content?.text||'')}</${b.content?.level||'h2'}>`;
    else if(b.type==='text')inner=`<div class="ve-text">${esc(b.content?.text||'').replace(/\n/g,'<br>')}</div>`;
    else if(b.type==='image')inner=b.content?.src?`<img src="${esc(b.content.src)}" alt="${esc(b.content.alt)}" style="max-width:100%;display:block">`:'<div style="padding:45px;text-align:center;background:#f1f3f6;color:#7b8492">Kép hozzáadása</div>';
    else if(b.type==='button')inner=`<a class="ve-button" href="${esc(b.content?.url||'#')}" onclick="return false">${esc(b.content?.text||'Gomb')}</a>`;
    else if(b.type==='divider')inner='<div class="ve-divider"></div>';
    else if(b.type==='spacer')inner='<div class="ve-spacer"></div>';
    else if(b.type==='columns')inner=`<div class="ve-columns">${(b.children||[]).map(renderBlock).join('')}</div>`;
    else if(b.type==='column')inner=(b.children||[]).map(renderBlock).join('')||'<div style="padding:25px;text-align:center;color:#8b94a1">Oszlop</div>';
    else inner=`<div style="padding:20px;border:1px solid #ccd3dd">${esc(b.label||b.type)}${(b.children||[]).map(renderBlock).join('')}</div>`;
    const cls=`ve-block ve-${b.type}${selected}`;
    const style=b.style?Object.entries(b.style).map(([k,v])=>`${k}:${esc(v)}`).join(';'):'';
    return `<div class="${cls}" data-id="${b.id}" style="${style}">${inner}</div>`;
  }
  function renderCanvas(target='#ve-canvas',preview=false){const el=$(target);if(!el)return;el.className=`ve-canvas ${state.device==='tablet'?'ve-tablet':''}${state.device==='mobile'?'ve-mobile':''}`;const blocks=rootNodes();el.innerHTML=blocks.length?blocks.map(b=>renderBlock(b,!preview)).join(''):'<div class="ve-empty">Üres oldal — válassz egy elemet balról</div>';if(!preview)el.querySelectorAll('[data-id]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.selected=x.dataset.id;renderAll()}));}
  function renderPages(){const el=$('#ve-pages');if(!el)return;el.innerHTML=state.pages.map(p=>`<button class="ve-page ${state.page?.id===p.id?'active':''}" data-page="${p.id}">▧ <span>${esc(p.title)}<small>/${esc(p.slug)}</small></span></button>`).join('')||'<div style="padding:10px;color:#8e98a8;font-size:12px">Nincs még oldal.</div>';el.querySelectorAll('[data-page]').forEach(x=>x.onclick=()=>openPage(x.dataset.page))}
  function renderLayers(){const el=$('#ve-layers');if(!el)return;const walk=(nodes,depth=0)=>nodes.map(b=>`<div class="ve-layer ${state.selected===b.id?'active':''}" data-layer="${b.id}"><span>${b.icon||'□'}</span><span>${esc(b.label||b.type)}</span><span class="indent">${depth}</span></div>${b.children?walk(b.children,depth+1):''}`).join('');el.innerHTML=walk(rootNodes())||'<div class="ve-empty-inspector">Nincs elem.</div>';el.querySelectorAll('[data-layer]').forEach(x=>x.onclick=()=>{state.selected=x.dataset.layer;renderAll()})}
  function renderInspector(){const el=$('#ve-inspector');if(!el)return;const f=state.selected&&findBlock(rootNodes(),state.selected);if(!f){el.innerHTML='<div class="ve-empty-inspector">Válassz ki egy elemet a vásznon vagy a Rétegek panelen.</div>';return}const b=f.node;let html=`<div class="ve-field"><label>Elem</label><input value="${esc(b.label||b.type)}" data-edit="label"></div>`;if(b.content?.text!==undefined)html+=`<div class="ve-field"><label>Szöveg</label><textarea data-edit="content.text">${esc(b.content.text)}</textarea></div>`;if(b.content?.url!==undefined)html+=`<div class="ve-field"><label>Link</label><input value="${esc(b.content.url)}" data-edit="content.url"></div>`;if(b.content?.src!==undefined)html+=`<div class="ve-field"><label>Kép URL</label><input value="${esc(b.content.src)}" data-edit="content.src"></div>`;if(b.content?.alt!==undefined)html+=`<div class="ve-field"><label>Alt szöveg</label><input value="${esc(b.content.alt)}" data-edit="content.alt"></div>`;html+=`<div class="ve-field"><label>Szélesség</label><select data-edit="style.width"><option value="">Alap</option><option value="100%">100%</option><option value="80%">80%</option><option value="50%">50%</option></select></div><div class="ve-field"><label>Háttér</label><input placeholder="#ffffff vagy transparent" data-edit="style.background"></div><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="ve-btn" id="ve-up">↑ Fel</button><button class="ve-btn" id="ve-down">↓ Le</button><button class="ve-btn" id="ve-delete">Törlés</button></div>`;el.innerHTML=html;el.querySelectorAll('[data-edit]').forEach(inp=>{const key=inp.dataset.edit;inp.onchange=()=>{pushHistory();const parts=key.split('.');if(parts.length===2){b[parts[0]]=b[parts[0]]||{};b[parts[0]][parts[1]]=inp.value}else b[key]=inp.value;renderAll()}});$('#ve-up').onclick=()=>moveSelected(-1);$('#ve-down').onclick=()=>moveSelected(1);$('#ve-delete').onclick=removeSelected;}
  function renderAll(){renderPages();renderCanvas();renderLayers();renderInspector();const dirty=$('#ve-dirty');if(dirty)dirty.textContent=state.dirty?'●':'✓';}
  async function loadPages(){try{const r=await fetch('/api/admin/pages');const j=await r.json();state.pages=j?.data||[];}catch(e){state.pages=[];toast('Az oldalak betöltése sikertelen.')}}
  async function openPage(id){const p=state.pages.find(x=>x.id===id);if(!p)return;state.page={...clone(p),content:normalizeContent(typeof p.content_json==='string'?JSON.parse(p.content_json):p.content_json)};state.selected=null;state.history=[];state.future=[];state.dirty=false;renderAll()}
  async function newPage(){const title=prompt('Új oldal neve?','Új oldal');if(!title)return;const slug=(prompt('URL slug?','uj-oldal')||'').trim().toLowerCase();if(!slug)return;const r=await fetch('/api/admin/pages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,slug,description:'',content:initial(),is_published:0})});const j=await r.json();if(!r.ok){toast(j?.error?.message||'Nem sikerült létrehozni');return}await loadPages();await openPage(j.data.id);toast('Oldal létrehozva')}
  async function save(){if(!state.page)return;const body={id:state.page.id,title:state.page.title,slug:state.page.slug,description:state.page.description||'',content:state.page.content,is_published:state.page.is_published?1:0};const r=await fetch('/api/admin/pages',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!r.ok){toast(j?.error?.message||'Mentési hiba');return}state.dirty=false;await loadPages();toast('Mentve')}
  function undo(){if(!state.history.length)return;state.future.push(snapshot());applyContent(state.history.pop())}
  function redo(){if(!state.future.length)return;state.history.push(snapshot());applyContent(state.future.pop())}
  function toast(t){const e=$('#ve-toast');if(!e)return;e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
  function bind(){document.addEventListener('click',e=>{const a=e.target.closest('[data-add]');if(a){e.preventDefault();addToTarget(a.dataset.add,state.selected)}});$('#ve-new')?.addEventListener('click',newPage);$('#ve-save')?.addEventListener('click',save);$('#ve-undo')?.addEventListener('click',undo);$('#ve-redo')?.addEventListener('click',redo);$('#ve-preview')?.addEventListener('click',()=>{$('#ve-modal').hidden=false;renderCanvas('#ve-preview-canvas',true)});$('#ve-close')?.addEventListener('click',()=>$('#ve-modal').hidden=true);$('#ve-back')?.addEventListener('click',()=>location.href='/admin.html');document.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{state.device=b.dataset.device;document.querySelectorAll('[data-device]').forEach(x=>x.classList.toggle('active',x===b));renderCanvas()});document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>addToTarget(b.dataset.add,state.selected));}
  window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo()}if(e.key==='Delete'&&state.selected&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))removeSelected()});
  window.VisualEditorCore={init:async()=>{await loadPages();bind();if(state.pages[0])await openPage(state.pages[0].id);else renderAll()}};
})();