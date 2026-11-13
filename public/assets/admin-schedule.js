import {weekScheduleDays,currentBudapestDate,currentBudapestMonday,shiftScheduleWeek} from '../editor-v2/core/schedule-week.js';

const $=id=>document.getElementById(id);
const form=$('event-form'),status=$('status'),select=$('image-select'),preview=$('image-preview');
const LABELS={scheduled:'Tervezett',live:'Élő',completed:'Lezajlott',cancelled:'Elmarad'};
const ASSET_ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let events=[],artwork=[],week=currentBudapestMonday(),editingId=null,mediaLoaded=false,busy=false;

function message(text,kind='info'){
  status.textContent=text;
  status.dataset.kind=kind;
}
async function request(path,options={}){
  const response=await fetch(path,{cache:'no-store',credentials:'same-origin',headers:{Accept:'application/json',...(options.body?{'Content-Type':'application/json'}:{})},...options});
  let body={};
  try{body=await response.json()}catch{}
  if(!response.ok||body.ok!==true){
    const reason=body?.error?.message||body?.error?.code||body?.error||('HTTP '+response.status);
    throw new Error(typeof reason==='string'?reason:JSON.stringify(reason));
  }
  return body.data;
}
const opt=(label,value)=>{const item=document.createElement('option');item.value=value;item.textContent=label;return item};
function assetLabel(a){return (a.name||a.altText||a.id||'Kép').slice(0,85)}
async function loadArtwork(){
  select.disabled=true;
  const assets=[],seen=new Set();
  let cursor=null;
  for(let i=0;i<10;i++){
    const params=new URLSearchParams({mime:'image',limit:'100'});
    if(cursor)params.set('before',cursor);
    const data=await request('/api/admin/media?'+params);
    for(const a of data.assets||[]){if(ASSET_ID.test(a.id)&&!seen.has(a.id)){seen.add(a.id);assets.push(a)}}
    if(!data.nextCursor)break;
    cursor=data.nextCursor;
  }
  artwork=assets;
  const selected=select.value;
  select.replaceChildren(opt('Nincs borítókép',''));
  for(const a of artwork)select.append(opt(assetLabel(a),a.id));
  if(selected&&artwork.some(a=>a.id===selected))select.value=selected;
  mediaLoaded=true;
  select.disabled=false;
  updatePreview();
}
function updatePreview(){
  const id=select.value;
  if(!ASSET_ID.test(id)){preview.hidden=true;preview.removeAttribute('src');return}
  preview.hidden=false;preview.src='/api/admin/media?id='+encodeURIComponent(id);
  preview.alt='Kiválasztott médiatári kép előnézete';
}
function selectImage(id){
  if(!mediaLoaded)return;
  const normalized=ASSET_ID.test(id||'')?id:'';
  if(normalized&&!artwork.some(a=>a.id===normalized))select.append(opt('Korábban kiválasztott kép',normalized));
  select.value=normalized;
  updatePreview();
}
function clear(){
  editingId=null;
  $('edit-title').textContent='Új adás felvétele';
  form.reset();
  selectImage('');
  $('save-event').textContent='Adás hozzáadása';
  message('Az új adáshoz adj meg valódi dátumot és kezdési időpontot.');
}
function edit(item){
  editingId=item.id;
  $('edit-title').textContent='Adás szerkesztése';
  for(const field of ['title','platform','startsAt','endsAt','status','url','notes']){
    const input=form.elements.namedItem(field);
    if(input)input.value=item[field]??'';
  }
  selectImage(item.imageAssetId||'');
  $('save-event').textContent='Módosítás mentése';
  message('A módosítás után az adásadatok a publikus menetrendben frissülnek.');
  document.getElementById('edit-title').scrollIntoView({behavior:'smooth',block:'start'});
  form.elements.namedItem('title')?.focus({preventScroll:true});
}
async function remove(item){
  if(busy||!confirm('Biztosan törlöd ezt az adást?\n'+item.title+'\n'+item.startsAt))return;
  busy=true;message('Adás törlése...');
  try{
    await request('/api/admin/schedule',{method:'DELETE',body:JSON.stringify({id:item.id})});
    await loadEvents();
    if(editingId===item.id)clear();
    message('Az adás törölve. A médiatárban tárolt kép megmaradt.','success');
  }catch(e){message(e.message,'error')}finally{busy=false}
}
function itemButton(label,handler,cls=''){
  const button=document.createElement('button');
  button.type='button';button.textContent=label;
  if(cls)button.className=cls;
  button.addEventListener('click',handler);return button;
}
function imageFor(item){
  if(!ASSET_ID.test(item.imageAssetId||''))return null;
  const img=document.createElement('img');
  img.src='/api/admin/media?id='+encodeURIComponent(item.imageAssetId);
  img.loading='lazy';img.alt='';img.setAttribute('aria-hidden','true');
  return img;
}
function render(){
  const days=weekScheduleDays(events,week),calendar=$('calendar');
  calendar.replaceChildren();
  $('week-label').textContent=days[0].date+' – '+days[6].date+' • Europe/Budapest';
  const now=currentBudapestDate();
  for(let i=0;i<days.length;i++){
    const day=days[i],section=document.createElement('section');
    section.className='day'+(day.date===now?' today':'');
    const heading=document.createElement('strong');
    heading.textContent=['Hétfő','Kedd','Szerda','Csütörtök','Péntek','Szombat','Vasárnap'][i]+' · '+day.date.slice(8)+'.';
    section.append(heading);
    if(!day.items.length){
      const empty=document.createElement('span');empty.className='empty';empty.textContent='Nincs meghirdetett adás';
      section.append(empty);
    }else{
      for(const item of day.items){
        const button=itemButton(item.displayTime+' · '+item.title,()=>edit(item));
        button.className='event';
        const img=imageFor(item);
        if(img)button.prepend(img);
        const meta=document.createElement('small');
        meta.textContent=item.platform+' · '+(LABELS[item.status]||item.status);
        button.append(meta);
        section.append(button);
      }
    }
    section.append(itemButton('+ Adás felvétele',()=>{
      clear();
      message(day.date+' kiválasztva. A pontos időpontot a Kezdés mezőben add meg.');
      form.elements.namedItem('startsAt')?.focus();
    },'action'));
    calendar.append(section);
  }
  const all=$('items');all.replaceChildren();
  if(!events.length){const empty=document.createElement('p');empty.textContent='Még nincs rögzített adás. A fenti űrlappal adhatsz hozzá egyet.';all.append(empty);return}
  for(const item of [...events].sort((a,b)=>a.startsAt.localeCompare(b.startsAt))){
    const container=document.createElement('article');container.className='item';
    const summary=document.createElement('div'),name=document.createElement('strong'),meta=document.createElement('small');
    name.textContent=item.title;
    meta.textContent=item.startsAt.replace('T',' ')+' · '+item.platform+' · '+(LABELS[item.status]||item.status)+(item.imageAssetId?' · Van borító':'');
    summary.append(name,meta);
    const actions=document.createElement('div');actions.className='item-actions';
    actions.append(itemButton('Szerkesztés',()=>edit(item)),itemButton('Törlés',()=>remove(item),'danger'));
    container.append(summary,actions);all.append(container);
  }
}
async function loadEvents(){
  const data=await request('/api/admin/schedule');
  if(!Array.isArray(data))throw new Error('Nem érkeztek meg az adások.');
  events=data;render();
}
async function save(event){
  event.preventDefault();
  if(busy||!form.reportValidity())return;
  busy=true;$('save-event').disabled=true;message('Adatok mentése...');
  const value=name=>form.elements.namedItem(name)?.value?.trim()||'';
  const payload={title:value('title'),platform:value('platform'),startsAt:value('startsAt'),endsAt:value('endsAt')||null,status:value('status'),url:value('url')||null,notes:value('notes')};
  const id=editingId;
  try{
    const saved=await request('/api/admin/schedule',{method:id?'PUT':'POST',body:JSON.stringify(id?{...payload,id}:payload)});
    const itemId=id||saved?.id;
    if(!itemId)throw new Error('Az adás azonosítója hiányzik; ellenőrizd az adáslistát.');
    let imageFailed=false;
    if(mediaLoaded){
      try{await request('/api/admin/schedule/media',{method:'PUT',body:JSON.stringify({itemId,assetId:select.value||null})})}
      catch{imageFailed=true}
    }
    await loadEvents();clear();
    message(imageFailed?'Az adás mentve, de a borító nem. Válaszd ki újra és mentsd el.':'Az adás és a kiválasztott borító mentve.','success');
  }catch(e){message(e.message,'error')}
  finally{busy=false;$('save-event').disabled=false}
}
$('prev-week').addEventListener('click',()=>{week=shiftScheduleWeek(week,-1);render()});
$('next-week').addEventListener('click',()=>{week=shiftScheduleWeek(week,1);render()});
$('current-week').addEventListener('click',()=>{week=currentBudapestMonday();render()});
$('clear-event').addEventListener('click',clear);
select.addEventListener('change',updatePreview);
form.addEventListener('submit',save);
Promise.allSettled([loadEvents(),loadArtwork()]).then(results=>{
  if(results[0].status==='rejected')message('A menetrend nem tölthető be: '+results[0].reason.message,'error');
  else if(results[1].status==='rejected')message('A menetrend elérhető, a médiatár képei most nem tölthetők be.','error');
  else clear();
});
