// Time-zone aware, deterministic countdown. Source of truth is the ISO timestamp.
const unsafeText=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export function defaultCountdownContent(){
 return {version:1,title:'Következő stream',targetISO:'',finishText:'Az esemény elkezdődött.',showSeconds:true};
}
export function normalizeCountdownContent(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1)throw new Error('Hiányzó visszaszámláló-beállítások');
 const title=String(value.title??'').trim(),finishText=String(value.finishText??'').trim();
 if(!title||title.length>120||!finishText||finishText.length>150)throw new Error('A cím és a lejárati üzenet kötelező, rövid szöveg');
 if(typeof value.showSeconds!=='boolean')throw new Error('Hibás másodperckijelzési beállítás');
 const targetISO=String(value.targetISO??'').trim();
 // Require a timezone: otherwise the editor machine and public browser disagree.
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(targetISO))throw new Error('A dátumhoz időzóna is szükséges');
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
 const target=typeof cfg.targetISO==='string'&&Number.isFinite(Date.parse(cfg.targetISO))?cfg.targetISO:'';
 const finishText=String(cfg.finishText||'Az esemény elkezdődött.');
 const text=remainingText(target,Date.now(),Boolean(cfg.showSeconds),finishText);
 return `<div class="visual-countdown-content" data-countdown-target="${unsafeText(target)}" data-countdown-finish="${unsafeText(finishText)}" data-countdown-seconds="${cfg.showSeconds?'true':'false'}"><strong class="visual-countdown-heading">${title}</strong><time class="visual-countdown-clock" aria-live="off" datetime="${unsafeText(target)}">${unsafeText(text)}</time></div>`;
}
const countdownTimers=new WeakMap();
export function activateCountdowns(root){
 if(!root||typeof root.querySelectorAll!=='function')return;
 for(const host of root.querySelectorAll('.visual-countdown-content[data-countdown-target]')){
  if(countdownTimers.has(host))continue;
  const time=host.querySelector('.visual-countdown-clock');
  if(!time)continue;
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
