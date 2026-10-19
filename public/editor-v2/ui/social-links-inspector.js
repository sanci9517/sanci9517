/* Contextual Social Links Inspector. All edits use the Page Model command callback. */
import {SOCIAL_PLATFORMS,SOCIAL_VARIANTS,SOCIAL_LAYOUTS,defaultSocialLinks,defaultSocialEntry} from '../core/social-links.js';

export function renderSocialLinksInspector(node,update){
 const saved=node.props?.socialLinks;
 const model={...defaultSocialLinks(),...(saved&&typeof saved==='object'?saved:{}),items:Array.isArray(saved?.items)?saved.items:[]};
 const section=document.createElement('section');section.className='social-links-inspector';
 const heading=document.createElement('h3');heading.textContent='Közösségi hivatkozások';section.append(heading);
 const intro=document.createElement('p');intro.className='structured-inspector-help';
 intro.textContent='Twitch, YouTube, TikTok, Discord és további elérhetőségek egyedi feliratokkal. A mentés nem publikál automatikusan.';section.append(intro);
 const save=next=>update({...next,version:1});
 const action=(name,handler,disabled=false)=>{
  const button=document.createElement('button');button.type='button';button.className='structured-action';button.textContent=name;
  button.disabled=Boolean(node.locked||disabled);button.onclick=handler;return button;
 };
 const select=(label,choices,value,handler)=>{
  const wrap=document.createElement('label');wrap.className='field social-link-field';wrap.append(document.createTextNode(label));
  const input=document.createElement('select');input.setAttribute('aria-label',label);input.disabled=Boolean(node.locked);
  for(const [id,text] of choices){const option=document.createElement('option');option.value=id;option.textContent=text;input.append(option)}
  input.value=value;input.onchange=()=>handler(input.value);wrap.append(input);return wrap;
 };
 const text=(label,value,handler,placeholder='')=>{
  const wrap=document.createElement('label');wrap.className='field social-link-field';wrap.append(document.createTextNode(label));
  const input=document.createElement('input');input.type='text';input.value=String(value??'');input.placeholder=placeholder;
  input.disabled=Boolean(node.locked);input.setAttribute('aria-label',label);input.onchange=()=>handler(input.value);
  wrap.append(input);return wrap;
 };
 const toggle=(label,checked,handler)=>{
  const wrap=document.createElement('label');wrap.className='inspector-toggle';
  const input=document.createElement('input');input.type='checkbox';input.checked=Boolean(checked);input.disabled=Boolean(node.locked);
  input.onchange=()=>handler(input.checked);wrap.append(input,document.createTextNode(label));return wrap;
 };
 section.append(
  select('Megjelenés',[['pills','Lekerekített gombok'],['cards','Kártyák'],['minimal','Minimalista linkek']],model.variant,value=>save({...model,variant:value})),
  select('Elrendezés',[['wrap','Tördelődő sor'],['stack','Egymás alatt'],['grid','Automatikus rács']],model.layout,value=>save({...model,layout:value})),
  toggle('Ikonok megjelenítése',model.showIcons,value=>save({...model,showIcons:value}))
 );
 const items=model.items;
 const actions=document.createElement('div');actions.className='structured-actions';
 actions.append(action('＋ Új közösségi link',()=>{
  const entry=defaultSocialEntry('twitch','s'+crypto.randomUUID().replace(/-/g,''));
  save({...model,items:[...items,entry]});
 },items.length>=12));
 section.append(actions);
 if(!items.length){
  const empty=document.createElement('p');empty.className='structured-inspector-help';
  empty.textContent='Még nincs link. Adj hozzá legalább egy elérhetőséget; üres listával piszkozat menthető, de publikálás nem.';section.append(empty);
 }
 items.forEach((entry,index)=>{
  const item=document.createElement('fieldset');item.className='social-link-item structured-item';item.dataset.socialEntryId=entry.id;
  const legend=document.createElement('legend');legend.textContent='Hivatkozás '+(index+1);item.append(legend);
  const change=patch=>save({...model,items:items.map((current,i)=>i===index?{...current,...patch}:current)});
  item.append(select('Platform',SOCIAL_PLATFORMS.map(p=>[p.id,p.label]),entry.platform,next=>{
   const previous=SOCIAL_PLATFORMS.find(p=>p.id===entry.platform);
   const selected=SOCIAL_PLATFORMS.find(p=>p.id===next);
   change({platform:next,label:entry.label===previous?.label?selected.label:entry.label,newWindow:next==='email'?false:entry.newWindow});
  }));
  item.append(text('Felirat',entry.label,value=>change({label:value}),'Pl. Nézz meg Twitch-en'));
  item.append(text('Hivatkozás URL',entry.href,value=>change({href:value.trim()}),entry.platform==='email'?'mailto:nev@example.com':'https://...'));
  item.append(toggle('Megnyitás új lapon',entry.newWindow,value=>change({newWindow:value})));
  const reorder=document.createElement('div');reorder.className='structured-actions';
  reorder.append(
   action('↑ Fel',()=>{const next=[...items];[next[index-1],next[index]]=[next[index],next[index-1]];save({...model,items:next})},index===0),
   action('↓ Le',()=>{const next=[...items];[next[index+1],next[index]]=[next[index],next[index+1]];save({...model,items:next})},index===items.length-1),
   action('× Törlés',()=>save({...model,items:items.filter((_,i)=>i!==index)}))
  );
  item.append(reorder);section.append(item);
 });
 const help=document.createElement('small');help.className='structured-inspector-help';
 help.textContent='Külső oldalhoz HTTPS-linket használj. A Weboldal platform belső /p/... linket, az E-mail mailto: címet is elfogad. Hibás vagy üres link publikáláskor megáll, piszkozatban javítható. A sorrend és a mobilos tördelés a publikus oldalon is megmarad.';section.append(help);
 return section;
}
