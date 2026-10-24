// Per-mounted Inspector text drafts. PageModel updates stay in the caller's command.
export function createCompositionInputs(pending=()=>{}){
 const drafts=new Set(),ready=()=>[...drafts].every(valid=>valid());
 const attach=(input,commit)=>{
  const error=document.createElement('span');error.className='property-validation';error.setAttribute('role','status');error.id='composition-error-'+crypto.randomUUID();
  input.setAttribute('aria-describedby',[input.getAttribute('aria-describedby'),error.id].filter(Boolean).join(' '));
  if(input.disabled)return error;
  let committed=input.value,composing=false,dirty=false,revision=0,typingGroup=crypto.randomUUID();
  const clear=()=>{input.removeAttribute('aria-invalid');error.textContent='';};
  drafts.add(()=>!composing&&!dirty&&!input.hasAttribute('aria-invalid'));
  const flush=()=>{
   if(composing)return false;
   if(input.value===committed){dirty=false;clear();return true;}
   dirty=false;clear();
   try{
    if(commit(input.value,{render:false,typingGroup})===false)throw Error('A módosítás nem alkalmazható.');
    committed=input.value;return true;
   }catch(cause){dirty=true;input.setAttribute('aria-invalid','true');error.textContent=cause.message;return false;}
  };
  input.onfocus=()=>{typingGroup=crypto.randomUUID();pending(ready);};
  input.oninput=event=>{dirty=true;if(event.isComposing)composing=true;if(!composing)flush();};
  input.onchange=flush;input.onblur=()=>{if(!composing)flush();};
  input.addEventListener('compositionstart',()=>{revision++;composing=true;pending(ready);});
  input.addEventListener('compositionend',()=>{
   dirty=true;composing=true;const current=++revision;
   // Keep late Android final input pending; a newer composition or Escape
   // invalidates this callback before it can commit a stale candidate.
   requestAnimationFrame(()=>{if(current!==revision||!input.isConnected)return;composing=false;flush();});
  });
  input.onkeydown=event=>{if(event.key!=='Escape')return;event.stopPropagation();revision++;composing=false;dirty=false;input.value=committed;clear();};
  return error;
 };
 return {attach};
}
