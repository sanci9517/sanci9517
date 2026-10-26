import {createCompositionInputs} from './composition-inputs.js';
import {normalizeAccessibility} from '../core/accessibility.js';
import {contentAttributes} from '../core/authored-content.js';

export function renderAccessibilityFields(node,apply,{nodes=()=>({}),pending=()=>{}}={}){
 const root=document.createElement('div');root.className='accessibility-fields';
 const composition=createCompositionInputs(pending);let model={...(node.accessibility||{})};
 const attributes=contentAttributes(node);
 for(const [key,label,attribute] of [['label','Képernyőolvasó elnevezés','aria-label'],['id','Oldalbeli hivatkozási azonosító','id'],['lang','Tartalom nyelve (pl. hu)','lang']]){
  if(node.type==='root'&&key==='id')continue;
  const wrap=document.createElement('label');wrap.className='field';wrap.dataset.inspectorCommand='accessibility.set';wrap.dataset.inspectorKey='accessibility.'+key;wrap.append(Object.assign(document.createElement('span'),{textContent:label}));
  const input=document.createElement('input');input.value=attributes[attribute]||'';input.maxLength=key==='label'?160:80;input.disabled=Boolean(node.locked);input.setAttribute('aria-label',label);
  wrap.append(input,composition.attach(input,(value,options)=>{
   // Validate transient syntax/uniqueness locally. An invalid candidate stays
   // in its input, without a command error dialog or rebuilding the Inspector.
   const patch={[key]:value},next=normalizeAccessibility({...node,accessibility:model},patch,nodes());
   const result=apply(patch,options);if(result!==false)model=next;return result;
  }));root.append(wrap);
 }
 return root;
}
