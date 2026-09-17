import {createEventBus} from './events.js';
import {panelRegistry,featureRegistry} from './registry.js';

const bus=createEventBus();
const workspace=document.querySelector('.workspace');
const panels={left:document.querySelector('#leftDock'),right:document.querySelector('#rightDock')};
function emit(type,payload={}){bus.emit(type,payload)}
function setPanel(side,open){const panel=panels[side];if(!panel)return;panel.classList.toggle('closed',!open);if(side==='right')panel.style.display=open?'block':'none';workspace?.classList.toggle(`${side}-closed`,!open);emit('panel:change',{side,open})}
function showLeftTab(tab){setPanel('left',true);document.querySelectorAll('.rail-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));document.querySelectorAll('[data-content]').forEach(x=>x.classList.toggle('hidden',x.dataset.content!==tab));emit('panel:tab',{tab})}
setPanel('left',false);setPanel('right',false);
document.querySelector('#editorMenu')?.addEventListener('click',()=>{if(panels.left?.classList.contains('closed'))showLeftTab('pages');else setPanel('left',false)});
document.querySelectorAll('[data-collapse]').forEach(b=>b.addEventListener('click',()=>{const side=b.dataset.collapse;setPanel(side,panels[side]?.classList.contains('closed')??true)}));
document.querySelector('#openInspector')?.addEventListener('click',()=>setPanel('right',true));
document.querySelectorAll('.rail-btn').forEach(b=>b.addEventListener('click',()=>showLeftTab(b.dataset.tab)));
window.sanciEditor={version:4,bus,panels:panelRegistry,features:featureRegistry,on:bus.on,emit,openPanel:s=>setPanel(s,true),closePanel:s=>setPanel(s,false),showLeftTab};
featureRegistry.register('shell-runtime',{version:4});
emit('shell:ready',{version:4});
