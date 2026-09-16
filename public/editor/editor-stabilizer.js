/* Sanci9517 editor runtime stabilizer: final interaction authority over legacy/core listeners. */
(()=>{
 const start=()=>{
  if(!window.state||!window.SanciEditor)return;
  const s=window.state, core=window.SanciEditor, oldRender=window.render;
  const clone=v=>JSON.parse(JSON.stringify(v));
  const walk=(a,fn)=>{for(const n of a||[]){fn(n);walk(n.children||[],fn)}};
  const all=()=>{const r=[];walk(s.doc?.root?.children,n=>r.push(n));return r};
  const find=id=>all().find(n=>n.id===id);
  const group=gid=>gid?all().filter(n=>n.groupId===gid):[];
  const idsFor=id=>{const n=find(id);return n?.groupId?group(n.groupId).map(x=>x.id):[id]};
  const render=()=>{oldRender?.();};
  const focus=id=>requestAnimationFrame(()=>document.querySelector(`[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({block:'center',inline:'center',behavior:'smooth'}));
  const select=(id,e={})=>{const n=find(id);if(!n)return[];const ids=idsFor(id),multi=e.ctrlKey||e.metaKey;if(multi){const set=new Set(s.selected),on=ids.every(x=>set.has(x));ids.forEach(x=>on?set.delete(x):set.add(x));s.selected=[...set]}else s.selected=[...ids];render();focus(id);return [...s.selected]};
  const clear=()=>{s.selected=[];render()};
  const commit=(label='Módosítás')=>{if(!s.doc)return false;s.history.push(clone(s.doc));if(s.history.length>100)s.history.shift();s.future=[];s.dirty=true;s.lastAction=label;window.updateSaveState?.();return true};
  const undo=()=>{if(!s.history.length){window.show?.('Nincs visszavonható művelet');return false}s.future.push(clone(s.doc));s.doc=s.history.pop();s.selected=[];render();window.show?.('Visszavonva');return true};
  const redo=()=>{if(!s.future.length){window.show?.('Nincs ismételhető művelet');return false}s.history.push(clone(s.doc));s.doc=s.future.pop();s.selected=[];render();window.show?.('Ismételve');return true};
  let drag=null,skipClick=false;
  const snap=v=>s.snap?Math.round(v/8)*8:Math.round(v);
  const down=(e,id)=>{const n=find(id);if(!n||n.locked)return;const resize=e.target.closest?.('.resize');let ids=s.selected.includes(id)&&s.selected.length>1?[...s.selected]:idsFor(id);s.selected=[...ids];drag={ids,startX:e.clientX,startY:e.clientY,resize:!!resize,changed:false,nodes:ids.map(x=>{const m=find(x);return{id:x,x:+m.layout.x||0,y:+m.layout.y||0,w:+m.layout.width||200,h:+m.layout.height||80}})};render();window.addEventListener('pointermove',move);window.addEventListener('pointerup',up,{once:true});e.preventDefault()};
  const move=e=>{if(!drag)return;const dx=(e.clientX-drag.startX)/(s.zoom||1),dy=(e.clientY-drag.startY)/(s.zoom||1);if(!drag.changed){if(Math.abs(dx)<2&&Math.abs(dy)<2)return;commit(drag.resize?'resize':'move');drag.changed=true}if(drag.resize&&drag.nodes.length===1){const n=find(drag.nodes[0].id);n.layout.width=Math.max(20,Math.round(drag.nodes[0].w+dx));n.layout.height=Math.max(20,Math.round(drag.nodes[0].h+dy))}else drag.nodes.forEach(b=>{const n=find(b.id);if(n){n.layout.x=snap(b.x+dx);n.layout.y=snap(b.y+dy)}});render()};
  const up=()=>{if(!drag)return;drag=null;window.removeEventListener('pointermove',move)};
  document.addEventListener('pointerdown',e=>{const t=e.target instanceof Element?e.target:null;if(!t)return;if(t.closest('#layers'))return;if(t.closest('.node')){const n=t.closest('.node');if(e.ctrlKey||e.metaKey){select(n.dataset.id,e);skipClick=true;e.stopImmediatePropagation();return}down(e,n.dataset.id);skipClick=true;e.stopImmediatePropagation();return}if(s.selected.length&&!t.closest('.canvas-tools,.topbar,.bottom,.panel')){clear();e.stopImmediatePropagation()}},true);
  document.addEventListener('click',e=>{if(skipClick){skipClick=false;e.stopImmediatePropagation();return}const t=e.target instanceof Element?e.target:null;if(!t)return;const row=t.closest('#layers .layer');if(row){const id=row.dataset.nodeId;if(id){select(id,e);focus(id);e.preventDefault();e.stopImmediatePropagation()}return}if(t.closest('.node')){const n=t.closest('.node');select(n.dataset.id,e);e.preventDefault();e.stopImmediatePropagation()}},true);
  document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&k==='z'){e.preventDefault();e.stopImmediatePropagation();e.shiftKey?redo():undo()}else if((e.ctrlKey||e.metaKey)&&k==='y'){e.preventDefault();e.stopImmediatePropagation();redo()}else if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();clear()}},true);
  window.select=select;window.clearSelection=clear;window.commit=commit;window.undo=undo;window.redo=redo;
  window.SanciEditor.select=select;window.SanciEditor.clearSelection=clear;window.SanciEditor.commit=commit;window.SanciEditor.undo=undo;window.SanciEditor.redo=redo;
  window.groupSelected=()=>{if(s.selected.length<2){window.show?.('Legalább 2 elem kijelölése szükséges');return false}if(s.selected.some(id=>find(id)?.groupId)){window.show?.('A kijelölésben már van csoportosított elem');return false}commit('group.create');const gid='group-'+crypto.randomUUID().slice(0,8);s.selected.forEach(id=>{const n=find(id);if(n)n.groupId=gid});render();window.show?.('Csoport létrehozva');return true};
  window.ungroupSelected=()=>{const gids=new Set(s.selected.map(id=>find(id)?.groupId).filter(Boolean));if(!gids.size){window.show?.('A kijelölésben nincs csoport');return false}commit('group.ungroup');all().forEach(n=>{if(gids.has(n.groupId))delete n.groupId});render();window.show?.('Csoport feloldva');return true};
  window.SanciEditor.capabilities={...window.SanciEditor.capabilities,groupSelection:true,multiMove:true,snap:true,viewportFocus:true,centralKeyboard:true};
  window.SanciEditor.schemaVersion=4;window.SanciEditor.apiVersion=2;
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
