import {createEventBus} from './events.js';
import {panelRegistry,featureRegistry} from './registry.js';

const bus=createEventBus();
const workspace=document.querySelector('.workspace');
const root=document.documentElement;
const panels={left:document.querySelector('#leftDock'),right:document.querySelector('#rightDock')};
const resizeLimits={left:{min:250,max:460},right:{min:260,max:440}};
function emit(type,payload={}){bus.emit(type,payload)}
function setPanel(side,open){const panel=panels[side];if(!panel)return;panel.classList.toggle('closed',!open);workspace?.classList.toggle(`${side}-closed`,!open);workspace?.classList.toggle(`${side}-open`,open);if(side==='right')panel.style.display=open?'block':'none';emit('panel:change',{side,open})}
function showLeftTab(tab){setPanel('left',true);document.querySelectorAll('.rail-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));document.querySelectorAll('[data-content]').forEach(x=>x.classList.toggle('hidden',x.dataset.content!==tab));emit('panel:tab',{tab})}
function clamp(value,limits){return Math.max(limits.min,Math.min(limits.max,value))}
function resizeDock(side,startX,startWidth){const limits=resizeLimits[side];const onMove=event=>{const delta=side==='left'?event.clientX-startX:startX-event.clientX;const width=clamp(startWidth+delta,limits);root.style.setProperty(side==='left'?'--left-dock-width':'--right-dock-width',`${width}px`);emit('panel:resize',{side,width})};const onUp=()=>{document.body.classList.remove('resizing-dock');window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp);};document.body.classList.add('resizing-dock');window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp,{once:true})}
function setupResizers(){document.querySelectorAll('.dock-resizer').forEach(handle=>handle.addEventListener('pointerdown',event=>{if(window.matchMedia('(max-width: 850px)').matches)return;const side=handle.dataset.resize;const current=parseFloat(getComputedStyle(root).getPropertyValue(side==='left'?'--left-dock-width':'--right-dock-width'))|| (side==='left'?310:300);handle.setPointerCapture?.(event.pointerId);resizeDock(side,event.clientX,current);event.preventDefault();}))}
setPanel('left',false);setPanel('right',false);
document.querySelector('#editorMenu')?.addEventListener('click',()=>{if(panels.left?.classList.contains('closed'))showLeftTab('pages');else setPanel('left',false)});
document.querySelectorAll('[data-collapse]').forEach(b=>b.addEventListener('click',()=>{const side=b.dataset.collapse;setPanel(side,panels[side]?.classList.contains('closed')??true)}));
document.querySelector('#openInspector')?.addEventListener('click',()=>setPanel('right',true));
document.querySelectorAll('.rail-btn').forEach(b=>b.addEventListener('click',()=>showLeftTab(b.dataset.tab)));
setupResizers();
window.sanciEditor={version:6,bus,panels:panelRegistry,features:featureRegistry,on:bus.on,emit,openPanel:s=>setPanel(s,true),closePanel:s=>setPanel(s,false),showLeftTab,resizeDock};
featureRegistry.register('shell-runtime',{version:6});
emit('shell:ready',{version:6});
