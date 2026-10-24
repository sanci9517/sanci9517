import {createCompositionInputs} from './composition-inputs.js';

export function renderBasicContentInspector(node,apply,{pending=()=>{}}={}){
 const model={...(node.props||{})},composition=createCompositionInputs(pending);
 const section=document.createElement('section');section.className='basic-content-inspector';
 const save=(patch,options)=>{
  const next={...model,...patch},result=apply(next,options);
  if(result!==false)Object.assign(model,next);
  return result;
 };
 const text=(label,key,multiline=false)=>{
  const wrap=document.createElement('label');wrap.className='field';wrap.append(document.createTextNode(label));
  const input=document.createElement(multiline?'textarea':'input');input.value=model[key]||'';input.disabled=Boolean(node.locked);input.setAttribute('aria-label',label);
  wrap.append(input,composition.attach(input,(value,options)=>save({[key]:value},options)));section.append(wrap);
 };
 if(node.type==='badge')text('Címke szövege','text');
 else if(node.type==='quote'){
  text('Idézet szövege','text',true);text('Forrás vagy szerző','attribution');
 }else{
  const select=document.createElement('select');select.setAttribute('aria-label','Ikon');select.disabled=Boolean(node.locked);
  for(const [value,label] of [['star','Csillag'],['heart','Szív'],['play','Lejátszás'],['check','Pipa'],['arrow','Nyíl'],['bolt','Villám'],['camera','Kamera'],['music','Zene'],['globe','Web'],['mail','Levél']]){
   select.append(Object.assign(document.createElement('option'),{value,textContent:label}));
  }
  select.value=model.icon||'star';select.onchange=()=>{if(save({icon:select.value})===false)select.value=model.icon||'star';};
  text('Ikon leírása','label');section.append(select);
 }
 return section;
}
