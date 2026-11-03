import {EDITOR_ACTIONS} from './action-catalog.js?v=20261103-canvas-focus-mode';
import {createEditorIcon} from './action-icons.js?v=20261103-canvas-focus-mode';

const ACTION_SELECTOR='[data-editor-action]';
const DESCRIPTION_ROOT_ID='editorActionDescriptions';
const TOOLTIP_ID='editorActionTooltip';

function describedByIds(element){return new Set((element.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean))}
function setDescribedBy(element,ids){
  if(ids.size)element.setAttribute('aria-describedby',[...ids].join(' '));
  else element.removeAttribute('aria-describedby');
}

export function enhanceEditorActionControls(root=document){
  const doc=root.ownerDocument||root;
  let descriptionRoot=doc.getElementById(DESCRIPTION_ROOT_ID);
  if(!descriptionRoot){
    descriptionRoot=doc.createElement('div');
    descriptionRoot.id=DESCRIPTION_ROOT_ID;
    descriptionRoot.className='editor-action-descriptions sr-only';
    descriptionRoot.setAttribute('aria-label','Szerkesztőműveletek leírásai');
    (doc.querySelector('.editor-app')||doc.body).append(descriptionRoot);
  }
  let tooltip=doc.getElementById(TOOLTIP_ID);
  if(!tooltip){
    tooltip=doc.createElement('div');
    tooltip.id=TOOLTIP_ID;
    tooltip.className='editor-action-tooltip';
    tooltip.setAttribute('role','tooltip');
    tooltip.hidden=true;
    (doc.querySelector('.editor-app')||doc.body).append(tooltip);
  }
  const mobileHelp=doc.getElementById('mobileActionHelp');
  const buttons=[...root.querySelectorAll(ACTION_SELECTOR)];
  const ensureDescription=actionId=>{
    const action=EDITOR_ACTIONS[actionId];
    if(!action)throw new Error(`Unregistered editor action: ${actionId}`);
    const descriptionId=`editor-action-description-${actionId}`;
    if(!doc.getElementById(descriptionId)){
      const description=doc.createElement('span');
      description.id=descriptionId;
      description.textContent=action.description;
      descriptionRoot.append(description);
    }
    return descriptionId;
  };
  const applyAction=(button,actionId)=>{
    const action=EDITOR_ACTIONS[actionId];
    if(!action)throw new Error(`Unregistered editor action: ${actionId}`);
    const ids=describedByIds(button);
    const previous=button.dataset.editorAction;
    if(previous)ids.delete(`editor-action-description-${previous}`);
    button.dataset.editorAction=actionId;
    button.dataset.editorIcon=action.icon;
    const icon=createEditorIcon(action.icon,doc);
    icon.classList.add('editor-action-icon');
    const slot=button.querySelector('[data-action-icon]');
    if(slot)slot.replaceChildren(icon);
    else if(button.dataset.iconOnly==='true')button.replaceChildren(icon);
    else{
      const oldIcon=button.querySelector(':scope > .editor-action-icon');
      if(oldIcon)oldIcon.replaceWith(icon);else button.prepend(icon);
    }
    // A native title would open a second browser-controlled tooltip beside
    // the accessible, dismissible and hoverable explanation below.
    button.removeAttribute('title');
    if(button.dataset.iconOnly==='true'||!button.textContent.trim())button.setAttribute('aria-label',action.label);
    else button.removeAttribute('aria-label');
    const descriptionId=ensureDescription(actionId);
    ids.add(descriptionId);
    setDescribedBy(button,ids);
  };
  for(const button of buttons)applyAction(button,button.dataset.editorAction);

  let activeButton=null;
  let showTimer=null;
  let hideTimer=null;
  let lastPointer=null;
  const canHover=()=>doc.defaultView?.matchMedia?.('(hover: hover) and (pointer: fine)').matches??false;
  const isCoarse=()=>doc.defaultView?.matchMedia?.('(pointer: coarse)').matches??false;
  const positionTooltip=()=>{
    if(!activeButton||tooltip.hidden)return;
    const rect=activeButton.getBoundingClientRect();
    const width=Math.min(320,doc.documentElement.clientWidth-16);
    const height=tooltip.getBoundingClientRect().height;
    const left=Math.max(8,Math.min(rect.left,doc.documentElement.clientWidth-width-8));
    const top=rect.bottom+8+height<doc.defaultView.innerHeight?rect.bottom+8:Math.max(8,rect.top-height-8);
    tooltip.style.left=`${left}px`;
    tooltip.style.top=`${top}px`;
  };
  const closeTooltip=()=>{
    clearTimeout(showTimer);clearTimeout(hideTimer);
    tooltip.hidden=true;
    if(activeButton){const ids=describedByIds(activeButton);ids.delete(TOOLTIP_ID);setDescribedBy(activeButton,ids)}
    activeButton=null;
  };
  const openTooltip=button=>{
    clearTimeout(showTimer);clearTimeout(hideTimer);
    const action=EDITOR_ACTIONS[button.dataset.editorAction];
    if(!action)return;
    if(activeButton&&activeButton!==button){const ids=describedByIds(activeButton);ids.delete(TOOLTIP_ID);setDescribedBy(activeButton,ids)}
    activeButton=button;
    tooltip.textContent=action.description;
    tooltip.hidden=false;
    const ids=describedByIds(button);ids.add(TOOLTIP_ID);setDescribedBy(button,ids);
    positionTooltip();
  };
  const queueClose=()=>{
    clearTimeout(showTimer);clearTimeout(hideTimer);
    hideTimer=setTimeout(()=>{
      const rect=tooltip.getBoundingClientRect();
      const pointerInsideTooltip=lastPointer&&lastPointer.x>=rect.left&&lastPointer.x<=rect.right&&lastPointer.y>=rect.top&&lastPointer.y<=rect.bottom;
      if(activeButton?.matches(':hover')||pointerInsideTooltip||activeButton===doc.activeElement)return;
      closeTooltip();
    },450);
  };
  const updateMobileHelp=button=>{
    const action=EDITOR_ACTIONS[button?.dataset.editorAction];
    if(!mobileHelp||!action)return;
    mobileHelp.replaceChildren();
    const strong=doc.createElement('strong');strong.textContent=`${action.label}: `;
    const text=doc.createElement('span');text.textContent=action.description;
    mobileHelp.append(strong,text);
    mobileHelp.hidden=false;
    mobileHelp.dataset.action=button.dataset.editorAction;
  };
  const setAction=(button,actionId)=>{
    if(!buttons.includes(button))throw new Error('Editor action control is not registered');
    const previous=button.dataset.editorAction;
    if(previous===actionId)return;
    applyAction(button,actionId);
    if(activeButton===button&&!tooltip.hidden)openTooltip(button);
    if(mobileHelp?.dataset.action===previous)updateMobileHelp(button);
  };

  for(const button of buttons){
    button.addEventListener('pointerenter',event=>{
      if(event.pointerType==='touch'){updateMobileHelp(button);return}
      if(!canHover())return;
      clearTimeout(showTimer);showTimer=setTimeout(()=>openTooltip(button),350);
    });
    button.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch')queueClose()});
    button.addEventListener('focus',()=>{
      if(canHover())openTooltip(button);
      else if(isCoarse())updateMobileHelp(button);
    });
    button.addEventListener('blur',queueClose);
    button.addEventListener('click',event=>{if(event.detail>0&&isCoarse())updateMobileHelp(button)});
  }
  doc.addEventListener('pointermove',event=>{
    lastPointer={x:event.clientX,y:event.clientY};
    if(!activeButton||tooltip.hidden)return;
    const rect=tooltip.getBoundingClientRect();
    const pointerInsideTooltip=lastPointer.x>=rect.left&&lastPointer.x<=rect.right&&lastPointer.y>=rect.top&&lastPointer.y<=rect.bottom;
    if(pointerInsideTooltip){clearTimeout(hideTimer);return}
    if(!activeButton.matches(':hover')&&activeButton!==doc.activeElement)queueClose();
  });
  doc.addEventListener('keydown',event=>{if(event.key==='Escape'&&!tooltip.hidden)closeTooltip()});
  doc.defaultView?.addEventListener('resize',positionTooltip);
  doc.defaultView?.addEventListener('scroll',positionTooltip,true);
  return {buttons,tooltip,mobileHelp,closeTooltip,setAction};
}
