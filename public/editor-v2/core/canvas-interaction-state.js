// Editor-only transient DOM state; never write this to the canonical Page Model.
// Preserve interaction previews across Inspector-triggered canvas re-renders,
// while letting changed authored defaults (singleOpen/openFirst) take precedence.
const interactiveHost=node=>node.querySelector(':scope > .creator-content-host');
// Repeater items have no persistent item ID in the v1 Page Model. Match a
// unique visible title/body instead of a stale position when reordered. If
// an item was edited or duplicated, prefer the unambiguous surviving field;
// otherwise retain the legacy positional fallback.
const identity=(title,body)=>({title:title?.textContent||'',body:body?.textContent||''});
const uniqueIndex=(previous,items)=>{
  if(!previous)return -1;
  for(const same of [
    item=>item.title===previous.title&&item.body===previous.body,
    item=>Boolean(previous.title)&&item.title===previous.title,
    item=>Boolean(previous.body)&&item.body===previous.body
  ]){
    const hits=items.map((item,index)=>same(item)?index:-1).filter(index=>index>=0);
    if(hits.length===1)return hits[0];
  }
  return -1;
};
const tabItems=host=>[...host.querySelectorAll('.creator-tabs [role="tab"]')].map(tab=>
  identity(tab,host.querySelector('[role="tabpanel"][id="'+tab.getAttribute('aria-controls')+'"]')));
const detailsItems=host=>[...host.querySelectorAll('.creator-accordion > details')].map(el=>
  identity(el.querySelector('summary'),el.querySelector(':scope > div')));
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
      entry.tabItems=tabItems(host);
      entry.activeIdentity=entry.tabItems[entry.activeTab]||null;
    }else if(type==='accordion'||type==='dropdown'){
      entry.detailsConfig=node.dataset.detailsBehavior||'';
      entry.detailsOpen=[...host.querySelectorAll('.creator-accordion > details')].map(el=>el.open);
      entry.detailsItems=detailsItems(host);
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
        const matched=uniqueIndex(entry.activeIdentity,tabItems(host));
        const index=matched>=0?matched:Math.min(entry.activeTab,tabs.length-1);
        for(const [i,tab] of tabs.entries()){
          const selected=i===index;
          tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
          const panel=host.querySelector('[role="tabpanel"][id="'+tab.getAttribute('aria-controls')+'"]');
          if(panel)panel.hidden=!selected;
        }
      }
    }else if(entry.type==='accordion'||entry.type==='dropdown'){
      const details=[...host.querySelectorAll('.creator-accordion > details')];
      if(entry.detailsConfig===node.dataset.detailsBehavior&&Array.isArray(entry.detailsOpen)){
        const currentItems=detailsItems(host);
        const open=details.map(()=>false);
        for(const [index,wasOpen] of entry.detailsOpen.entries()){
          if(!wasOpen)continue;
          const matched=uniqueIndex(entry.detailsItems?.[index],currentItems);
          const target=matched>=0?matched:entry.detailsOpen.length===details.length?index:-1;
          if(target>=0&&target<open.length)open[target]=true;
        }
        // Programmatic exclusivity is reapplied atomically: details with the
        // same native name cannot accidentally leave two open on a re-render.
        details.forEach(el=>{el.open=false});
        if(details.some(el=>el.hasAttribute('name'))){
          const selected=open.findIndex(Boolean);
          if(selected>=0)details[selected].open=true;
        }else details.forEach((el,i)=>{el.open=open[i]});
      }
    }else if(entry.type==='carousel'){
      const track=host.querySelector('.creator-carousel');
      if(track&&Number.isFinite(entry.scrollLeft))track.scrollLeft=Math.max(0,entry.scrollLeft);
    }
    if(entry.focus){
      const selectors={tab:'.creator-tabs [role="tab"]',summary:'.creator-accordion summary',carousel:'.creator-carousel[role="region"]',image:'.creator-image-zoom'};
      const targets=[...host.querySelectorAll(selectors[entry.focus.type]||'[data-unmatched]')];
      let focusIndex=entry.focus.index;
      if(entry.focus.type==='tab'&&entry.tabItems){
        const matched=uniqueIndex(entry.tabItems[focusIndex],tabItems(host));
        if(matched>=0)focusIndex=matched;
      }
      if(entry.focus.type==='summary'&&entry.detailsItems){
        const matched=uniqueIndex(entry.detailsItems[focusIndex],detailsItems(host));
        if(matched>=0)focusIndex=matched;
      }
      focusTarget=targets[focusIndex]||focusTarget;
    }
  }
  // Focus only when the old canvas itself held it. Inspector inputs must
  // never lose focus to a newly created canvas node while the user types.
  if(focusTarget&&document.activeElement===document.body)focusTarget.focus({preventScroll:true});
}
