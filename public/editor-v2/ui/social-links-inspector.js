import {createCompositionInputs} from './composition-inputs.js';
/* Contextual Social Links Inspector. All edits use the Page Model command callback. */
import {SOCIAL_PLATFORMS,SOCIAL_VARIANTS,SOCIAL_LAYOUTS,defaultSocialLinks,defaultSocialEntry} from '../core/social-links.js';

export function renderSocialLinksInspector(node,update,{pending=()=>{}}={}){
 const composition=createCompositionInputs(pending);
 const saved=node.props?.socialLinks;
 const model={...defaultSocialLinks(),...(saved&&typeof saved==='object'?saved:{}),items:Array.isArray(saved?.items)?saved.items:[]};
 const section=document.createElement('section');section.className='social-links-inspector';section.dataset.nodeId=node.id;
 const heading=document.createElement('h3');heading.textContent='Közösségi hivatkozások';section.append(heading);
 const intro=document.createElement('p');intro.className='structured-inspector-help';
 intro.textContent='Twitch, YouTube, TikTok, Discord és további elérhetőségek egyedi feliratokkal. A mentés nem publikál automatikusan.';section.append(intro);
 const save=(next,options)=>{const result=update({...next,version:1},options);if(result!==false)Object.assign(model,next);return result;};
 const saveItems=(items,restoreFocus,{entryId,preferredAction}={})=>{
  const result=save({...model,items});
  if(!restoreFocus||result===false)return;
  requestAnimationFrame(()=>{
   // A command replaces the Inspector. Restore keyboard focus only if the
   // removed button owned it, and no newer interaction has placed it elsewhere.
   if(document.activeElement!==document.body)return;
   const current=[...document.querySelectorAll('#inspectorBody .social-links-inspector')]
    .find(section=>section.dataset.nodeId===node.id);
   if(!current)return;
   const row=[...current.querySelectorAll('.social-link-item')].find(row=>row.dataset.socialEntryId===entryId);
   const buttons=[...(row?.querySelectorAll('.social-link-actions button:not(:disabled)')||[])];
   const preferred=buttons.find(button=>button.dataset.socialAction===preferredAction);
   const target=(preferredAction?(preferred||buttons[0]):row?.querySelector('input:not(:disabled)'))
    ||current.querySelector('[data-social-action="add"]:not(:disabled)');
   if(target?.getClientRects().length)target.focus({preventScroll:false});
  });
 };
 const action=(name,handler,disabled=false,kind='')=>{
  const button=document.createElement('button');button.type='button';button.className='structured-action';button.textContent=name;
  if(kind)button.dataset.socialAction=kind;
  button.disabled=Boolean(node.locked||disabled);button.onclick=()=>handler(document.activeElement===button);return button;
 };
 const select=(label,choices,value,handler)=>{
  const wrap=document.createElement('label');wrap.className='field social-link-field';wrap.append(document.createTextNode(label));
  const input=document.createElement('select');input.setAttribute('aria-label',label);input.disabled=Boolean(node.locked);
  for(const [id,text] of choices){const option=document.createElement('option');option.value=id;option.textContent=text;input.append(option)}
  input.value=value;input.onchange=()=>{if(handler(input.value)===false)input.value=value;};wrap.append(input);return wrap;
 };
 const text=(label,value,handler,placeholder='')=>{
  const wrap=document.createElement('label');wrap.className='field social-link-field';wrap.append(document.createTextNode(label));
  const input=document.createElement('input');input.type='text';input.value=String(value??'');input.placeholder=placeholder;
  input.disabled=Boolean(node.locked);input.setAttribute('aria-label',label);
  wrap.append(input,composition.attach(input,handler));return wrap;
 };
 const toggle=(label,checked,handler)=>{
  const wrap=document.createElement('label');wrap.className='inspector-toggle';
  const input=document.createElement('input');input.type='checkbox';input.checked=Boolean(checked);input.disabled=Boolean(node.locked);
  input.onchange=()=>{if(handler(input.checked)===false)input.checked=Boolean(checked);};wrap.append(input,document.createTextNode(label));return wrap;
 };
 section.append(
  select('Megjelenés',[['pills','Lekerekített gombok'],['cards','Kártyák'],['minimal','Minimalista linkek']],model.variant,value=>save({...model,variant:value})),
  select('Elrendezés',[['wrap','Tördelődő sor'],['stack','Egymás alatt'],['grid','Automatikus rács']],model.layout,value=>save({...model,layout:value})),
  toggle('Ikonok megjelenítése',model.showIcons,value=>save({...model,showIcons:value}))
 );
 const items=model.items;
 const actions=document.createElement('div');actions.className='structured-actions';
 actions.append(action('＋ Új közösségi link',restoreFocus=>{
  const entry=defaultSocialEntry('twitch','s'+crypto.randomUUID().replace(/-/g,''));
  saveItems([...model.items,entry],restoreFocus,{entryId:entry.id});
 },items.length>=12,'add'));
 section.append(actions);
 if(!items.length){
  const empty=document.createElement('p');empty.className='structured-inspector-help';
  empty.textContent='Még nincs link. Adj hozzá legalább egy elérhetőséget; üres listával piszkozat menthető, de publikálás nem.';section.append(empty);
 }
 items.forEach((entry,index)=>{
  const item=document.createElement('fieldset');item.className='social-link-item structured-item';item.dataset.socialEntryId=entry.id;
  const legend=document.createElement('legend');legend.textContent='Hivatkozás '+(index+1);item.append(legend);
  const change=(patch,options)=>save({...model,items:model.items.map(current=>current.id===entry.id?{...current,...patch}:current)},options);
  item.append(select('Platform',SOCIAL_PLATFORMS.map(p=>[p.id,p.label]),entry.platform,next=>{
   const current=model.items.find(item=>item.id===entry.id);
   const previous=SOCIAL_PLATFORMS.find(p=>p.id===current.platform);
   const selected=SOCIAL_PLATFORMS.find(p=>p.id===next);
   return change({platform:next,label:current.label===previous?.label?selected.label:current.label,newWindow:next==='email'?false:current.newWindow});
  }));
  item.append(text('Felirat',entry.label,(value,options)=>change({label:value},options),'Pl. Nézz meg Twitch-en'));
  item.append(text('Hivatkozás URL',entry.href,(value,options)=>change({href:value.trim()},options),entry.platform==='email'?'mailto:nev@example.com':'https://...'));
  item.append(toggle('Megnyitás új lapon',entry.newWindow,value=>change({newWindow:value})));
  const reorder=document.createElement('div');reorder.className='structured-actions social-link-actions';
  reorder.append(
   action('↑ Fel',restoreFocus=>{const next=[...model.items];[next[index-1],next[index]]=[next[index],next[index-1]];saveItems(next,restoreFocus,{entryId:entry.id,preferredAction:'up'})},index===0,'up'),
   action('↓ Le',restoreFocus=>{const next=[...model.items];[next[index+1],next[index]]=[next[index],next[index+1]];saveItems(next,restoreFocus,{entryId:entry.id,preferredAction:'down'})},index===items.length-1,'down'),
   action('× Törlés',restoreFocus=>{const next=model.items.filter((_,i)=>i!==index);saveItems(next,restoreFocus,{entryId:next[Math.min(index,next.length-1)]?.id})},false,'remove')
  );
  item.append(reorder);section.append(item);
 });
 const help=document.createElement('small');help.className='structured-inspector-help';
 help.textContent='Külső oldalhoz HTTPS-linket használj. A Weboldal platform belső /p/... linket, az E-mail mailto: címet is elfogad. Hibás vagy üres link publikáláskor megáll, piszkozatban javítható. A sorrend és a mobilos tördelés a publikus oldalon is megmarad.';section.append(help);
 return section;
}
