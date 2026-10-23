import {countdownISOToLocal,countdownLocalToISO} from '../core/countdown-local-time.js';
export function renderCountdownDateControl(targetISO,{apply,pending,disabled=false}){
 const field=document.createElement('label');field.className='field countdown-date-field';field.append(document.createTextNode('Esemény időpontja'));
 const date=document.createElement('input');date.type='datetime-local';date.step='any';date.disabled=disabled;date.setAttribute('aria-label','Esemény időpontja');date.value=countdownISOToLocal(targetISO);
 let committed=date.value;
 const error=document.createElement('span');error.className='property-validation';error.id='countdown-date-error-'+crypto.randomUUID();error.setAttribute('role','status');
 const help=document.createElement('small');help.id='countdown-date-zone-'+crypto.randomUUID();help.textContent='Időzóna: '+Intl.DateTimeFormat().resolvedOptions().timeZone+'. Az időpont minden látogatónál ugyanaz.';
 date.setAttribute('aria-describedby',help.id+' '+error.id);
 const valid=()=>!date.validity.badInput&&!date.hasAttribute('aria-invalid');
 const clear=()=>{date.removeAttribute('aria-invalid');error.textContent='';};
 date.onfocus=()=>pending(valid);
 date.onchange=()=>{
  if(disabled)return false;
  try{
   if(date.validity.badInput)throw Error('Adj meg teljes, érvényes helyi időpontot.');
   // An unchanged value may be the later instant in an autumn DST overlap.
   // Keep the original ISO instant rather than choosing an offset again.
   if(date.value===committed){clear();return true;}
   const next=countdownLocalToISO(date.value);clear();
   if(apply(next)===false)throw Error('Az időpont módosítása nem alkalmazható.');
   committed=date.value;return true;
  }catch(cause){date.setAttribute('aria-invalid','true');error.textContent=cause.message;pending(valid);return false;}
 };
 date.onkeydown=event=>{
  if(event.key!=='Escape')return;
  event.stopPropagation();date.value=committed;clear();
 };
 field.append(date,help,error);return field;
}
