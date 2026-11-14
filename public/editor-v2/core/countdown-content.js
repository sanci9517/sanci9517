// Time-zone aware, deterministic countdown. Source of truth is the ISO timestamp.
import {scheduleStartEpoch} from './schedule-time.js';
const unsafeText=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export function defaultCountdownContent(){
 return {version:1,title:'Következő stream',targetISO:'',finishText:'Az esemény elkezdődött.',showSeconds:true};
}
export function normalizeCountdownContent(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1)throw new Error('Hiányzó visszaszámláló-beállítások');
 const title=String(value.title??'').trim(),finishText=String(value.finishText??'').trim();
 if(!title||title.length>120||!finishText||finishText.length>150)throw new Error('A cím és a lejárati üzenet kötelező, rövid szöveg');
 if(typeof value.showSeconds!=='boolean')throw new Error('Hibás másodperckijelzési beállítás');
 const source=value.source===undefined?'manual':value.source;
 if(source!=='manual'&&source!=='next-stream')throw new Error('Hibás visszaszámláló-forrás');
 // Dynamic mode has no authored date: the public Schedule is its source of truth.
 if(source==='next-stream')return {version:1,title,targetISO:'',finishText,showSeconds:value.showSeconds,source};
 const targetISO=String(value.targetISO??'').trim();
 // Require a timezone: otherwise the editor machine and public browser disagree.
 const fields=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(?:Z|[+-](\d{2}):(\d{2}))$/.exec(targetISO);
 if(!fields)throw new Error('A dátumhoz időzóna is szükséges');
 const [year,month,day,hour,minute,second]=fields.slice(1,7).map(Number);
 const leap=year%4===0&&(year%100!==0||year%400===0);
 const days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
 // Date.parse rolls February 30 and 24:00 into a different date. Validate
 // the authored calendar fields before applying its explicit UTC offset.
 if(month<1||month>12||day<1||day>days[month-1]||hour>23||minute>59||second>59||
    (fields[7]!==undefined&&(Number(fields[7])>23||Number(fields[8])>59)))throw new Error('Érvénytelen eseményidőpont');
 const date=Date.parse(targetISO);
 if(!Number.isFinite(date)||new Date(date).getUTCFullYear()<2000||new Date(date).getUTCFullYear()>2100)throw new Error('Érvénytelen eseményidőpont');
 return {version:1,title,targetISO:new Date(date).toISOString(),finishText,showSeconds:value.showSeconds};
}
export function remainingParts(targetISO,now=Date.now()){
 const timestamp=Date.parse(String(targetISO??''));
 if(!Number.isFinite(timestamp))return null;
 const seconds=Math.max(0,Math.ceil((timestamp-now)/1000));
 return {expired:seconds===0,days:Math.floor(seconds/86400),hours:Math.floor(seconds%86400/3600),minutes:Math.floor(seconds%3600/60),seconds:seconds%60};
}
export function remainingText(targetISO,now=Date.now(),showSeconds=true,finishText='Az esemény elkezdődött.'){
 const parts=remainingParts(targetISO,now);
 if(!parts)return 'Állíts be egy időpontot a Tartalom panelen.';
 if(parts.expired)return finishText;
 const segments=[parts.days+' nap',String(parts.hours).padStart(2,'0')+' óra',String(parts.minutes).padStart(2,'0')+' perc'];
 if(showSeconds)segments.push(String(parts.seconds).padStart(2,'0')+' mp');
 return segments.join(' · ');
}
export function renderCountdownContent(value){
 const cfg=value&&typeof value==='object'?{...defaultCountdownContent(),...value}:defaultCountdownContent();
 const title=unsafeText(cfg.title||'Visszaszámláló');
 const dynamic=cfg.source==='next-stream';
 const target=dynamic?'':typeof cfg.targetISO==='string'&&Number.isFinite(Date.parse(cfg.targetISO))?cfg.targetISO:'';
 const finishText=String(cfg.finishText||'Az esemény elkezdődött.');
 const text=dynamic?'Következő adás keresése…':remainingText(target,Date.now(),Boolean(cfg.showSeconds),finishText);
 const detail=dynamic?'<span class="visual-countdown-details" role="status" aria-live="polite">A meghirdetett adásokból frissül.</span>':'';
 return `<div class="visual-countdown-content" data-countdown-source="${dynamic?'next-stream':'manual'}" data-countdown-target="${unsafeText(target)}" data-countdown-finish="${unsafeText(finishText)}" data-countdown-seconds="${cfg.showSeconds?'true':'false'}"><strong class="visual-countdown-heading">${title}</strong><time class="visual-countdown-clock" aria-live="off" datetime="${unsafeText(target)}">${unsafeText(text)}</time>${detail}</div>`;
}
const countdownTimers=new WeakMap();
const budapestDisplay=new Intl.DateTimeFormat('hu-HU',{timeZone:'Europe/Budapest',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});
const liveStates=new WeakMap();
function renderDynamicClock(time,epoch,showSeconds){
 const parts=remainingParts(new Date(epoch).toISOString());
 if(!parts||parts.expired)return false;
 const cells=[['nap',String(parts.days)],['óra',String(parts.hours).padStart(2,'0')],['perc',String(parts.minutes).padStart(2,'0')]];
 if(showSeconds)cells.push(['mp',String(parts.seconds).padStart(2,'0')]);
 const previous=time.querySelectorAll('.sanci-timer-value');
 if(previous.length!==cells.length){
  const fragment=document.createDocumentFragment();
  for(const [label,value] of cells){
   const cell=document.createElement('span');cell.className='sanci-timer-cell';
   const val=document.createElement('span');val.className='sanci-timer-value';val.textContent=value;
   const caption=document.createElement('span');caption.className='sanci-timer-unit';caption.textContent=label;
   cell.append(val,caption);fragment.append(cell);
  }
  time.replaceChildren(fragment);
 }else cells.forEach(([,value],i)=>{if(previous[i].textContent!==value)previous[i].textContent=value});
 time.setAttribute('datetime',new Date(epoch).toISOString());
 time.setAttribute('aria-label',remainingText(new Date(epoch).toISOString(),Date.now(),showSeconds));
 return true;
}
function activateNextStreamCountdown(host,time){
 if(liveStates.has(host))return;
 const state={epoch:null,event:null,lastRequest:0,loading:false};
 liveStates.set(host,state);
 const details=host.querySelector('.visual-countdown-details');
 const showSeconds=host.dataset.countdownSeconds==='true';
 const showInfo=value=>{if(details&&details.textContent!==value)details.textContent=value};
 const showMessage=value=>{time.textContent=value;time.removeAttribute('datetime');time.removeAttribute('aria-label')};
 const load=async()=>{
  if(state.loading||!host.isConnected)return;
  state.loading=true;state.lastRequest=Date.now();
  try{
   const response=await fetch('/api/public/schedule?mode=next&statuses=scheduled&limit=1',
      {credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}});
   if(!response.ok)throw new Error('schedule-unavailable');
   const payload=await response.json();
   if(payload?.ok!==true||!Array.isArray(payload?.data))throw new Error('schedule-invalid');
   if(!host.isConnected)return;
   const event=payload.data.find(item=>item?.status==='scheduled'&&scheduleStartEpoch(item?.startsAt)>Date.now());
   const epoch=event?scheduleStartEpoch(event.startsAt):null;
   if(epoch!==null&&epoch!==undefined){
    state.epoch=epoch;state.event=event;
    const name=typeof event.title==='string'?event.title.trim().slice(0,140):'';
    const platform=typeof event.platform==='string'?event.platform.trim().slice(0,30):'';
    showInfo([name,budapestDisplay.format(epoch),platform].filter(Boolean).join(' · '));
   }else{
    state.epoch=null;state.event=null;
    showMessage('Még nincs meghirdetett adás.');
    showInfo('Az új időpontok a menetrendben jelennek meg.');
   }
  }catch{
   if(!host.isConnected)return;
   if(state.epoch===null){
    showMessage('Az időpont most nem érhető el.');
    showInfo('Próbáld meg később, vagy nézd meg a menetrendet.');
   }
  }finally{state.loading=false}
 };
 const update=()=>{
  if(!host.isConnected){const timer=countdownTimers.get(host);if(timer)clearInterval(timer);countdownTimers.delete(host);liveStates.delete(host);return}
  const now=Date.now();
  if(state.epoch!==null){
   if(now<state.epoch)renderDynamicClock(time,state.epoch,showSeconds);
   else{
    state.epoch=null;state.event=null;state.lastRequest=0;
    showMessage(host.dataset.countdownFinish||'Az adás kezdése elérkezett.');
    showInfo('Ha már elindult, a Twitch oldalon tudsz csatlakozni.');
   }
  }
  if(now-state.lastRequest>=60000&&!state.loading)void load();
 };
 // Never start with a guessed timestamp or a fake LIVE indicator.
 const timer=setInterval(update,1000);
 countdownTimers.set(host,timer);
 void load().then(update);
}
export function activateCountdowns(root){
 if(!root||typeof root.querySelectorAll!=='function')return;
 for(const host of root.querySelectorAll('.visual-countdown-content[data-countdown-target]')){
  if(countdownTimers.has(host))continue;
  const time=host.querySelector('.visual-countdown-clock');
  if(!time)continue;
  if(host.dataset.countdownSource==='next-stream'){activateNextStreamCountdown(host,time);continue}
  const update=()=>{
   if(!host.isConnected){clearInterval(countdownTimers.get(host));countdownTimers.delete(host);return;}
   const text=remainingText(host.dataset.countdownTarget,Date.now(),host.dataset.countdownSeconds==='true',host.dataset.countdownFinish||'Az esemény elkezdődött.');
   time.textContent=text;
   if(Number.isFinite(Date.parse(host.dataset.countdownTarget))&&Date.now()>=Date.parse(host.dataset.countdownTarget)){
    clearInterval(countdownTimers.get(host));countdownTimers.delete(host);
   }
  };
  // No timers for empty drafts, and expired elements remain readable.
  if(!host.dataset.countdownTarget){time.textContent='Állíts be egy időpontot a Tartalom panelen.';continue}
  update();
  if(host.isConnected&&Date.now()<Date.parse(host.dataset.countdownTarget))countdownTimers.set(host,setInterval(update,1000));
 }
}
