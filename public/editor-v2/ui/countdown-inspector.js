import {defaultCountdownContent} from '../core/countdown-content.js';
import {createCompositionInputs} from './composition-inputs.js';
import {renderCountdownDateControl} from './countdown-date-control.js';

export function renderCountdownInspector(node,update,{pending=()=>{}}={}){
 const model={...defaultCountdownContent(),...(node.props?.countdown||{})};
 // Focusing one field must not forget another field's invalid or composing
 // state. Each family keeps its guard; the Editor receives their conjunction.
 const guards=new Map();
 const watch=key=>check=>{guards.set(key,check);pending(()=>[...guards.values()].every(valid=>valid()));};
 const composition=createCompositionInputs(watch('text'));
 const route=(control,key)=>{
  control.dataset.inspectorCommand='element.update';
  control.dataset.inspectorKey='props.countdown.'+key;
  return control;
 };
 const save=(patch,options)=>{
  const next={...model,...patch},result=update(next,options);
  if(result!==false)Object.assign(model,next);
  return result;
 };
 const section=document.createElement('section');section.className='countdown-inspector';
 section.append(Object.assign(document.createElement('h3'),{textContent:'Visszaszámláló'}));
 const text=(label,key)=>{
  const wrap=route(document.createElement('label'),key);wrap.className='field';wrap.append(document.createTextNode(label));
  const input=document.createElement('input');input.value=model[key]??'';input.disabled=Boolean(node.locked);input.setAttribute('aria-label',label);
  wrap.append(input,composition.attach(input,(value,options)=>save({[key]:value},options)));section.append(wrap);
 };
 text('Esemény neve','title');
 section.append(route(renderCountdownDateControl(model.targetISO,{
  apply:targetISO=>save({targetISO},{render:false}),pending:watch('date'),disabled:Boolean(node.locked)
 }),'targetISO'));
 text('Lejáratkor megjelenő üzenet','finishText');
 const toggle=document.createElement('input');toggle.type='checkbox';toggle.checked=Boolean(model.showSeconds);toggle.disabled=Boolean(node.locked);
 toggle.setAttribute('aria-label','Másodpercek megjelenítése');
 toggle.onchange=()=>{if(save({showSeconds:toggle.checked})===false)toggle.checked=Boolean(model.showSeconds);};
 const label=route(document.createElement('label'),'showSeconds');label.className='inspector-toggle';label.append(toggle,document.createTextNode('Másodpercek megjelenítése'));
 section.append(label,Object.assign(document.createElement('small'),{textContent:'Mentés és publikálás külön művelet.'}));
 return section;
}
