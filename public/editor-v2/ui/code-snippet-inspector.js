/* Contextual Code block Inspector; the source is always text, never executable HTML. */
import {defaultCodeSnippet,SNIPPET_LANGUAGES} from '../core/code-snippet.js';
export function renderCodeSnippetInspector(node,update,{pending=()=>{}}={}){
 const model={...defaultCodeSnippet(),...(node.props?.codeSnippet||{})};
 const section=document.createElement('section');section.className='code-snippet-inspector';
 const route=(control,key)=>{control.dataset.inspectorCommand='element.update';control.dataset.inspectorKey='props.codeSnippet.'+key;return control;};
 const heading=document.createElement('h3');heading.textContent='Kód- és parancsblokk';section.append(heading);
 const help=document.createElement('p');help.className='structured-inspector-help';
 help.textContent='OBS, Discord, PowerShell, konfigurációk vagy technikai útmutatók. A kód csak szövegként jelenik meg, soha nem futtatódik.';section.append(help);
 const drafts=new Set();
 const ready=()=>[...drafts].every(valid=>valid());
 const save=(patch,options)=>{
  const next={...model,...patch,version:1},result=update(next,options);
  if(result!==false)Object.assign(model,next);
  return result;
 };
 const field=(key,name,value,handler,multi=false)=>{
  const label=route(document.createElement('label'),key);label.className='field';label.append(document.createTextNode(name));
  const input=document.createElement(multi?'textarea':'input');
  if(!multi)input.type='text';else{input.rows=12;input.spellcheck=false;input.wrap='off';input.className='code-snippet-source'}
  input.setAttribute('aria-label',name);input.value=value??'';input.disabled=Boolean(node.locked);
  const error=document.createElement('span');error.id='code-snippet-validation-'+crypto.randomUUID();error.className='property-validation';error.setAttribute('role','status');
  input.setAttribute('aria-describedby',[input.getAttribute('aria-describedby'),error.id].filter(Boolean).join(' '));
  let committed=input.value,composing=false,dirty=false,revision=0,typingGroup=crypto.randomUUID();
  const clear=()=>{input.removeAttribute('aria-invalid');error.textContent='';};
  drafts.add(()=>!composing&&!dirty&&!input.hasAttribute('aria-invalid'));
  const flush=()=>{
   if(composing)return false;
   if(input.value===committed){dirty=false;clear();return true;}
   dirty=false;clear();
   try{
    if(handler(input.value,{render:false,typingGroup})===false)throw Error('A módosítás nem alkalmazható.');
    committed=input.value;return true;
   }catch(cause){dirty=true;input.setAttribute('aria-invalid','true');error.textContent=cause.message;return false;}
  };
  input.onfocus=()=>{typingGroup=crypto.randomUUID();pending(ready);};
  input.oninput=event=>{
   dirty=true;
   if(event.isComposing)composing=true;
   if(!composing)flush();
  };
  input.onchange=flush;
  input.onblur=()=>{if(!composing)flush();};
  input.addEventListener('compositionstart',()=>{revision++;composing=true;pending(ready);});
  input.addEventListener('compositionend',()=>{
   dirty=true;composing=true;const current=++revision;
   // Android may deliver the confirmed replacement after compositionend.
   // Keep Save/Publish blocked until that input has arrived on the live field.
   requestAnimationFrame(()=>{if(current!==revision||!input.isConnected)return;composing=false;flush();});
  });
  input.onkeydown=event=>{
   if(event.key!=='Escape')return;
   event.stopPropagation();revision++;composing=false;dirty=false;input.value=committed;clear();
  };
  label.append(input,error);section.append(label);
 };
 const select=(key,name,choices,value,handler)=>{
  const label=route(document.createElement('label'),key);label.className='field';label.append(document.createTextNode(name));
  const input=document.createElement('select');input.setAttribute('aria-label',name);input.disabled=Boolean(node.locked);
  for(const [key,text] of choices){const option=document.createElement('option');option.value=key;option.textContent=text;input.append(option)}
  input.value=value;input.onchange=()=>{if(handler(input.value)===false)input.value=value;};label.append(input);section.append(label);
 };
 const toggle=(key,label,checked,handler)=>{
  const wrap=route(document.createElement('label'),key);wrap.className='inspector-toggle';
  const input=document.createElement('input');input.type='checkbox';input.checked=Boolean(checked);input.disabled=Boolean(node.locked);
  input.onchange=()=>{if(handler(input.checked)===false)input.checked=Boolean(checked);};wrap.append(input,document.createTextNode(label));section.append(wrap);
 };
 field('title','Blokk címe',model.title,(value,options)=>save({title:value},options));
 select('language','Kód nyelve',SNIPPET_LANGUAGES,model.language,value=>save({language:value}));
 select('theme','Színséma',[['dark','Sötét'],['light','Világos']],model.theme,value=>save({theme:value}));
 toggle('showLineNumbers','Sorszámok mutatása',model.showLineNumbers,value=>save({showLineNumbers:value}));
 toggle('wrapLines','Hosszú sorok tördelése',model.wrapLines,value=>save({wrapLines:value}));
 field('code','Kód vagy parancs szövege',model.code,(value,options)=>save({code:value},options),true);
 const note=document.createElement('small');note.className='structured-inspector-help';
 note.textContent='Maximum 40 000 karakter és 500 sor. A Másolás gomb a publikus oldalon működik. Üres tartalommal piszkozat menthető, de nem publikálható. A módosításokhoz külön Publikálás szükséges.';section.append(note);
 return section;
}
