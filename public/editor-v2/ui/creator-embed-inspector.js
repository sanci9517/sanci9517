/* Safe single-video embedding controls; drafts can remain incomplete. */
import {defaultEmbedContent,EMBED_PROVIDERS,EMBED_RATIOS,parseEmbedSource} from '../core/creator-embed.js';

export function renderEmbedInspector(node,update){
 const saved=node.props?.embedContent;
 const model={...defaultEmbedContent(),...(saved&&typeof saved==='object'?saved:{})};
 const section=document.createElement('section');section.className='creator-embed-inspector';
 const heading=document.createElement('h3');heading.textContent='Videó vagy élőadás beágyazása';section.append(heading);
 const notice=document.createElement('p');notice.className='structured-inspector-help';
 notice.textContent='YouTube, Twitch élő/VOD és Vimeo. Ide videólink vagy azonosító kell, nem másolt HTML/iframe kód.';section.append(notice);
 const save=patch=>update({...model,...patch,version:1});
 const select=(label,choices,value,onChange)=>{
  const wrap=document.createElement('label');wrap.className='field';wrap.append(document.createTextNode(label));
  const field=document.createElement('select');field.setAttribute('aria-label',label);field.disabled=Boolean(node.locked);
  for(const [key,text] of choices){const option=document.createElement('option');option.value=key;option.textContent=text;field.append(option)}
  field.value=value;field.onchange=()=>onChange(field.value);wrap.append(field);section.append(wrap);
 };
 const input=(label,value,onChange,placeholder)=>{
  const wrap=document.createElement('label');wrap.className='field';wrap.append(document.createTextNode(label));
  const field=document.createElement('input');field.type='text';field.value=value??'';field.placeholder=placeholder||'';
  field.setAttribute('aria-label',label);field.disabled=Boolean(node.locked);field.onchange=()=>onChange(field.value);
  wrap.append(field);section.append(wrap);
 };
 select('Videóplatform',EMBED_PROVIDERS.map(p=>[p.id,p.label]),model.provider,provider=>save({provider,source:''}));
 input('Videó URL vagy azonosító',model.source,value=>save({source:value.trim()}),'https://...');
 input('Lejátszó címe',model.title,value=>save({title:value}));
 select('Videó arány',[
  ['landscape','16:9 – széles videó'],['classic','4:3 – hagyományos'],['square','1:1 – négyzetes'],['portrait','9:16 – álló videó']
 ],EMBED_RATIOS.includes(model.ratio)?model.ratio:'landscape',ratio=>save({ratio}));
 const toggle=document.createElement('label');toggle.className='inspector-toggle';
 const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=Boolean(model.clickToLoad);checkbox.disabled=Boolean(node.locked);
 checkbox.onchange=()=>save({clickToLoad:checkbox.checked});toggle.append(checkbox,document.createTextNode('Betöltés csak látogatói kattintásra'));section.append(toggle);
 const status=document.createElement('small');status.className='embed-inspector-status';status.setAttribute('role','status');
 if(!model.source)status.textContent='Előbb add meg a videólinket. Piszkozatként menthető, de publikáláshoz kötelező.';
 else try{parseEmbedSource(model.provider,model.source);status.textContent='Támogatott videóazonosító. Előnézet a publikus oldalon, kattintás után.'}
 catch(e){status.textContent=e instanceof Error?e.message:'Érvénytelen videólink';status.classList.add('invalid')}
 section.append(status);
 const details=document.createElement('small');details.className='structured-inspector-help';
 details.textContent='A Twitch-hez a publikus domain automatikusan bekerül a lejátszó címébe. Külső tartalom csak a kiválasztott szolgáltatótól tölthető be. A privát/tiltott videók lejátszását a szolgáltató továbbra is megtagadhatja. Mentés ≠ Publikálás.';section.append(details);
 return section;
}
