// Editor-only transient DOM state; never write this to the canonical Page Model.
// Preserve interaction previews across Inspector-triggered canvas re-renders,
// while letting changed authored defaults (singleOpen/openFirst) take precedence.
const interactiveHost=node=>node.querySelector(':scope > .creator-content-host');
const findFocus=(host,active)=>{
  if(!active||!host.contains(active))return null;
  for(const [type,selector] of [
    ['tab','.creator-tabs [role="tab"]'],
    ['summary','.creator-accordion summary'],
    ['carousel','.creator-carousel[role="region"]'],
    ['image','.creator-image-zoom']
  ]){
    const elements=[...host.querySelectorAll(selector)];
    const index=elements.indexOf(active);
    if(index>=0)return {type,index};
  }
  return null;
};
export function captureCanvasInteractionState(root){
  if(!root)return null;
  const active=document.activeElement,entries=[];
  for(const node of root.querySelectorAll('.node[data-node-id]')){
    const host=interactiveHost(node);
    if(!host)continue;
    const type=node.dataset.contentType;
    if(!['tabs','accordion','dropdown','carousel'].includes(type))continue;
    const entry={id:node.dataset.nodeId,type,focus:findFocus(host,active)};
    if(type==='tabs'){
      entry.activeTab=[...host.querySelectorAll('.creator-tabs [role="tab"]')].findIndex(tab=>tab.getAttribute('aria-selected')==='true');
    }else if(type==='accordion'||type==='dropdown'){
      entry.detailsConfig=node.dataset.detailsBehavior||'';
      entry.detailsOpen=[...host.querySelectorAll('.creator-accordion > details')].map(el=>el.open);
    }else if(type==='carousel'){
      entry.scrollLeft=host.querySelector('.creator-carousel')?.scrollLeft??0;
    }
    entries.push(entry);
  }
  return entries;
}
export function restoreCanvasInteractionState(root,entries){
  if(!root||!Array.isArray(entries))return;
  const nodes=new Map([...root.querySelectorAll('.node[data-node-id]')].map(node=>[node.dataset.nodeId,node]));
  let focusTarget=null;
  for(const entry of entries){
    const node=nodes.get(entry.id);
    if(!node||node.dataset.contentType!==entry.type)continue;
    const host=interactiveHost(node);
    if(!host)continue;
    if(entry.type==='tabs'){
      const tabs=[...host.querySelectorAll('.creator-tabs [role="tab"]')];
      if(tabs.length&&Number.isInteger(entry.activeTab)&&entry.activeTab>=0){
        const index=Math.min(entry.activeTab,tabs.length-1);
        for(const [i,tab] of tabs.entries()){
          const selected=i===index;
          tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
          const panel=host.querySelector('[role="tabpanel"][id="'+tab.getAttribute('aria-controls')+'"]');
          if(panel)panel.hidden=!selected;
        }
      }
    }else if(entry.type==='accordion'||entry.type==='dropdown'){
      const details=[...host.querySelectorAll('.creator-accordion > details')];
      if(entry.detailsConfig===node.dataset.detailsBehavior&&entry.detailsOpen?.length===details.length){
        // Programmatic exclusivity is reapplied atomically: details with the
        // same native name cannot accidentally leave two open on a re-render.
        details.forEach(el=>{el.open=false});
        if(details.some(el=>el.hasAttribute('name'))){
          const selected=entry.detailsOpen.findIndex(Boolean);
          if(selected>=0)details[selected].open=true;
        }else details.forEach((el,i)=>{el.open=Boolean(entry.detailsOpen[i])});
      }
    }else if(entry.type==='carousel'){
      const track=host.querySelector('.creator-carousel');
      if(track&&Number.isFinite(entry.scrollLeft))track.scrollLeft=Math.max(0,entry.scrollLeft);
    }
    if(entry.focus){
      const selectors={tab:'.creator-tabs [role="tab"]',summary:'.creator-accordion summary',carousel:'.creator-carousel[role="region"]',image:'.creator-image-zoom'};
      const targets=[...host.querySelectorAll(selectors[entry.focus.type]||'[data-unmatched]')];
      focusTarget=targets[entry.focus.index]||focusTarget;
    }
  }
  // Focus only when the old canvas itself held it. Inspector inputs must
  // never lose focus to a newly created canvas node while the user types.
  if(focusTarget&&document.activeElement===document.body)focusTarget.focus({preventScroll:true});
}
