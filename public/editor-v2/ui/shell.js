import {createEventBus} from './events.js';
import {panelRegistry,featureRegistry} from './registry.js';
const bus=createEventBus(),workspace=document.querySelector('.workspace'),panels={left:document.querySelector('#leftDock'),right:document.querySelector('#rightDock')};
function emit(type,payload={}){bus.emit(type,payload)}
function setPanel(side,open){const p=panels[side];if(!p)return;p.classList.toggle('closed',!open);if(side==='right')p.style.display=open?'block':'none';workspace.classList.toggle(`${side}-closed`,!open);emit('panel:change',{side,open})}
setPanel('left',false);setPanel('right',false);
document.querySelectorAll('[data-collapse]').forEach(b=>b.addEventListener('click',()=>setPanel(b.dataset.collapse,panels[b.dataset.collapse]?.classList.contains('closed')??true)));
document.querySelector('#openInspector')?.addEventListener('click',()=>setPanel('right',true));
document.querySelectorAll('.rail-btn').forEach(tab=>tab.addEventListener('click',()=>{setPanel('left',true);document.querySelectorAll('.rail-btn').forEach(x=>x.classList.toggle('active',x===tab));document.querySelectorAll('[data-content]').forEach(x=>x.classList.toggle('hidden',x.dataset.content!==tab.dataset.tab));emit('panel:tab',{tab:tab.dataset.tab})}));
window.sanciEditor={version:3,bus,panels:panelRegistry,features:featureRegistry,on:bus.on,emit,openPanel:s=>setPanel(s,true),closePanel:s=>setPanel(s,false)};featureRegistry.register('shell-runtime',{version:3});emit('shell:ready',{version:3});
