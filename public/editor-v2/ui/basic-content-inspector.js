import {createCompositionInputs} from './composition-inputs.js';
import {ICON_CHOICES,isSupportedIcon} from '../core/icon-options.js';

export function renderBasicContentInspector(node,apply,{pending=()=>{}}={}){
 const model={...(node.props||{})},composition=createCompositionInputs(pending);
 const section=document.createElement('section');section.className='basic-content-inspector';
 const route=(control,key)=>{control.dataset.inspectorCommand='element.update';control.dataset.inspectorKey='props.'+key;return control;};
 const save=(patch,options)=>{
  const next={...model,...patch},result=apply(next,options);
  if(result!==false)Object.assign(model,next);
  return result;
 };
 const text=(label,key,multiline=false)=>{
  const wrap=route(document.createElement('label'),key);wrap.className='field';wrap.append(document.createTextNode(label));
  const input=document.createElement(multiline?'textarea':'input');input.value=model[key]||'';input.disabled=Boolean(node.locked);input.setAttribute('aria-label',label);
  wrap.append(input,composition.attach(input,(value,options)=>save({[key]:value},options)));section.append(wrap);
 };
 if(node.type==='badge')text('Címke szövege','text');
 else if(node.type==='quote'){
  text('Idézet szövege','text',true);text('Forrás vagy szerző','attribution');
 }else{
  const select=route(document.createElement('select'),'icon');select.setAttribute('aria-label','Ikon');select.disabled=Boolean(node.locked);
  const currentIcon=typeof model.icon==='string'&&model.icon?model.icon:'star';
  const hasUnsupportedIcon=!isSupportedIcon(currentIcon);
  if(hasUnsupportedIcon){
   const legacy=document.createElement('option');legacy.value=currentIcon;legacy.disabled=true;
   legacy.textContent=`Nem támogatott ikon (${currentIcon.slice(0,80)})`;select.append(legacy);
  }
  for(const {id,label} of ICON_CHOICES)select.append(Object.assign(document.createElement('option'),{value:id,textContent:label}));
  select.value=currentIcon;
  let unsupportedNotice;
  if(hasUnsupportedIcon){
   unsupportedNotice=document.createElement('p');unsupportedNotice.className='property-validation';
   unsupportedNotice.setAttribute('role','status');
   unsupportedNotice.textContent='A korábban mentett ikonazonosító nem támogatott. Válassz egy elérhető ikont a javításhoz; a megnyitás nem módosítja a piszkozatot.';
   section.append(unsupportedNotice);
  }
  select.onchange=()=>{
   if(save({icon:select.value})===false)select.value=model.icon||'star';
   else if(unsupportedNotice)unsupportedNotice.hidden=isSupportedIcon(model.icon);
  };
  text('Ikon leírása','label');section.append(select);
 }
 return section;
}
