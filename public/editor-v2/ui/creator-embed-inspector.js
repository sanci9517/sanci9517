import {createCompositionInputs} from './composition-inputs.js';
/* Safe single-video embedding controls; drafts can remain incomplete. */
import {defaultEmbedContent,EMBED_PROVIDERS,EMBED_RATIOS,parseEmbedSource} from '../core/creator-embed.js';

export function renderEmbedInspector(node,update,{pending=()=>{}}={}){
 const composition=createCompositionInputs(pending);
 const saved=node.props?.embedContent;
 const model={...defaultEmbedContent(),...(saved&&typeof saved==='object'?saved:{})};
 const section=document.createElement('section');section.className='creator-embed-inspector';
 const heading=document.createElement('h3');heading.textContent='Videó vagy élőadás beágyazása';section.append(heading);
 const notice=document.createElement('p');notice.className='structured-inspector-help';
 notice.textContent='YouTube, Twitch élő/VOD és Vimeo. Ide videólink vagy azonosító kell, nem másolt HTML/iframe kód.';section.append(notice);
 const status=document.createElement('small');status.className='embed-inspector-status';status.setAttribute('role','status');
 const route=(control,key)=>{control.dataset.inspectorCommand='element.update';control.dataset.inspectorKey='props.embedContent.'+key;return control;};
 const refreshStatus=()=>{
  let text,invalid=false;
  if(!model.source)text='Előbb add meg a videólinket. Piszkozatként menthető, de publikáláshoz kötelező.';
  else try{parseEmbedSource(model.provider,model.source);text='Támogatott videóazonosító. Előnézet a publikus oldalon, kattintás után.';}
  catch(error){text=error.message||'Érvénytelen videólink';invalid=true;}
  if(status.textContent!==text)status.textContent=text;
  status.classList.toggle('invalid',invalid);
 };
 const save=(patch,options)=>{
  const next={...model,...patch,version:1},result=update(next,options);
  if(result!==false){Object.assign(model,next);refreshStatus();}
  return result;
 };
 const select=(key,label,choices,value,onChange)=>{
  const wrap=route(document.createElement('label'),key);wrap.className='field';wrap.append(document.createTextNode(label));
  const field=document.createElement('select');field.setAttribute('aria-label',label);field.disabled=Boolean(node.locked);
  for(const [key,text] of choices){const option=document.createElement('option');option.value=key;option.textContent=text;field.append(option)}
  field.value=value;field.onchange=()=>{if(onChange(field.value)===false)field.value=value;};wrap.append(field);section.append(wrap);
 };
 const input=(key,label,value,onChange,placeholder)=>{
  const wrap=route(document.createElement('label'),key);wrap.className='field';wrap.append(document.createTextNode(label));
  const field=document.createElement('input');field.type='text';field.value=value??'';field.placeholder=placeholder||'';
  field.setAttribute('aria-label',label);field.disabled=Boolean(node.locked);
  wrap.append(field,composition.attach(field,onChange));section.append(wrap);
 };
 select('provider','Videóplatform',EMBED_PROVIDERS.map(p=>[p.id,p.label]),model.provider,provider=>save({provider,source:''}));
 input('source','Videó URL vagy azonosító',model.source,(value,options)=>save({source:value.trim()},options),'https://...');
 input('title','Lejátszó címe',model.title,(value,options)=>save({title:value},options));
 select('ratio','Videó arány',[
  ['landscape','16:9 – széles videó'],['classic','4:3 – hagyományos'],['square','1:1 – négyzetes'],['portrait','9:16 – álló videó']
 ],EMBED_RATIOS.includes(model.ratio)?model.ratio:'landscape',ratio=>save({ratio}));
 const toggle=route(document.createElement('label'),'clickToLoad');toggle.className='inspector-toggle';
 const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=Boolean(model.clickToLoad);checkbox.disabled=Boolean(node.locked);
 checkbox.onchange=()=>{if(save({clickToLoad:checkbox.checked})===false)checkbox.checked=Boolean(model.clickToLoad);};toggle.append(checkbox,document.createTextNode('Betöltés csak látogatói kattintásra'));section.append(toggle);
 refreshStatus();
 section.append(status);
 const details=document.createElement('small');details.className='structured-inspector-help';
 details.textContent='A Twitch-hez a publikus domain automatikusan bekerül a lejátszó címébe. Külső tartalom csak a kiválasztott szolgáltatótól tölthető be. A privát/tiltott videók lejátszását a szolgáltató továbbra is megtagadhatja. Mentés ≠ Publikálás.';section.append(details);
 return section;
}
