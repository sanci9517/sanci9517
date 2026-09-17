import { createEventBus } from './events.js';
import { panelRegistry, featureRegistry } from './registry.js';

const bus = createEventBus();
const workspace = document.querySelector('.workspace');
const panels = { left: document.querySelector('#leftDock'), right: document.querySelector('#rightDock') };
function emit(type,payload={}){bus.emit(type,payload)}
function setPanel(side,open){const panel=panels[side];if(!panel)return;panel.classList.toggle('closed',!open);workspace.classList.toggle(`${side}-closed`,!open);emit('panel:change',{side,open})}
function togglePanel(side){const panel=panels[side];setPanel(side,panel?.classList.contains('closed')??false)}
for(const button of document.querySelectorAll('[data-collapse]'))button.addEventListener('click',()=>togglePanel(button.dataset.collapse));
document.querySelectorAll('.rail-btn').forEach(tab=>tab.addEventListener('click',()=>{const target=tab.dataset.tab;document.querySelectorAll('.rail-btn').forEach(item=>item.classList.toggle('active',item===tab));document.querySelectorAll('[data-content]').forEach(content=>content.classList.toggle('hidden',content.dataset.content!==target));if(panels.left.classList.contains('closed'))setPanel('left',true);emit('panel:tab',{tab:target})}));
document.querySelector('.panel-toggle')?.addEventListener('click',()=>togglePanel('left'));
window.sanciEditor={version:1,bus,panels:panelRegistry,features:featureRegistry,on:bus.on,emit};
featureRegistry.register('shell-runtime',{version:2});emit('shell:ready',{version:2});
