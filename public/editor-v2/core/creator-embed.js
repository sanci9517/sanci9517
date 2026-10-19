/* Curated, click-to-load creator video embed. Only known HTTPS player origins. */
export const EMBED_PROVIDERS=Object.freeze([
 {id:'youtube',label:'YouTube-videó'},
 {id:'twitch-live',label:'Twitch élő csatorna'},
 {id:'twitch-vod',label:'Twitch VOD'},
 {id:'vimeo',label:'Vimeo-videó'}
]);
export const EMBED_RATIOS=Object.freeze(['landscape','classic','square','portrait']);
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const cleanInput=value=>{
 const text=String(value??'').trim();
 if(!text||text.length>2048||[...text].some(ch=>{const n=ch.charCodeAt(0);return n<32||n===127||n===92}))throw Error('Érvénytelen vagy túl hosszú videóhivatkozás');
 return text;
};
const youtubeId=value=>/^[A-Za-z0-9_-]{11}$/.test(value)?value:'';
const twitchName=value=>/^[A-Za-z0-9_]{3,25}$/.test(value)?value:'';
const twitchVideo=value=>/^(?:v)?([0-9]{1,16})$/.exec(value)?.[1]||'';
const vimeoId=value=>/^[0-9]{1,16}$/.test(value)?value:'';
export function parseEmbedSource(provider,source){
 const raw=cleanInput(source);
 if(!EMBED_PROVIDERS.some(x=>x.id===provider))throw Error('Nem támogatott videós platform');
 const direct=provider==='youtube'?youtubeId(raw):provider==='twitch-live'?twitchName(raw):provider==='twitch-vod'?twitchVideo(raw):vimeoId(raw);
 if(direct)return {provider,id:direct,hash:''};
 let url;
 try{url=new URL(raw)}catch{throw Error('Adj meg egy támogatott platformon található videólinket vagy azonosítót')}
 if(url.protocol!=='https:'||url.username||url.password)throw Error('Csak biztonságos HTTPS videólink fogadható el');
 const host=url.hostname.toLowerCase(),parts=url.pathname.split('/').filter(Boolean);
 let id='',hash='';
 if(provider==='youtube'){
  if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host)){
   if(parts[0]==='watch'&&parts.length===1)id=youtubeId(url.searchParams.get('v')||'');
   else if(['embed','shorts','live','v'].includes(parts[0])&&parts.length===2)id=youtubeId(parts[1]);
  }else if(['youtu.be','www.youtu.be'].includes(host)&&parts.length===1)id=youtubeId(parts[0]);
 }else if(provider==='twitch-live'){
  if(['www.twitch.tv','twitch.tv','m.twitch.tv'].includes(host)&&parts.length===1)id=twitchName(parts[0]);
 }else if(provider==='twitch-vod'){
  if(['www.twitch.tv','twitch.tv','m.twitch.tv'].includes(host)&&parts[0]==='videos'&&parts.length===2)id=twitchVideo(parts[1]);
 }else if(provider==='vimeo'){
  if(['vimeo.com','www.vimeo.com'].includes(host)&&(parts.length===1||parts.length===2)){
   id=vimeoId(parts[0]);hash=parts[1]||'';
  }
  if(host==='player.vimeo.com'&&parts[0]==='video'&&parts.length===2){
   id=vimeoId(parts[1]);hash=url.searchParams.get('h')||'';
  }
  if(hash&&!/^[A-Za-z0-9]{6,128}$/.test(hash))id='';
 }
 if(!id)throw Error('A videó URL-je nem felel meg a kiválasztott platformnak');
 return {provider,id,hash};
}
export function defaultEmbedContent(){
 return {version:1,provider:'youtube',source:'',title:'Videó vagy élő adás',ratio:'landscape',clickToLoad:true};
}
export function normalizeEmbedContent(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1)throw Error('Hiányzó beágyazási adatok');
 const title=String(value.title??'').trim(),source=String(value.source??'').trim();
 if(!title||title.length>140)throw Error('Adj a videónak érthető címet (legfeljebb 140 karakter)');
 if(!EMBED_RATIOS.includes(value.ratio)||typeof value.clickToLoad!=='boolean')throw Error('Érvénytelen videómegjelenés');
 parseEmbedSource(value.provider,source);
 return {version:1,provider:value.provider,source,title,ratio:value.ratio,clickToLoad:value.clickToLoad};
}
export function buildEmbedUrl(config,parentHost=''){
 let parsed;
 try{parsed=parseEmbedSource(config.provider,config.source)}catch{return ''}
 const id=parsed.id;
 if(parsed.provider==='youtube')return 'https://www.youtube-nocookie.com/embed/'+id+'?rel=0';
 if(parsed.provider==='vimeo')return 'https://player.vimeo.com/video/'+id+(parsed.hash?'?h='+parsed.hash+'&dnt=1':'?dnt=1');
 const host=String(parentHost??'').trim().toLowerCase();
 if(!/^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$/.test(host)||host.includes('..'))return '';
 return 'https://player.twitch.tv/?'+(parsed.provider==='twitch-live'?'channel='+encodeURIComponent(id):'video='+encodeURIComponent('v'+id))+'&parent='+encodeURIComponent(host)+'&autoplay=false';
}
export function renderEmbedHtml(value){
 const cfg=value&&typeof value==='object'&&!Array.isArray(value)?{...defaultEmbedContent(),...value}:defaultEmbedContent();
 const ratio=EMBED_RATIOS.includes(cfg.ratio)?cfg.ratio:'landscape';
 let valid=false;
 try{parseEmbedSource(cfg.provider,cfg.source);valid=true}catch{}
 if(!valid)return '<div class="visual-embed-empty">Adj meg érvényes videólinket a Tartalom panelen. A lejátszó nincs betöltve.</div>';
 const button='<button type="button" class="visual-embed-load" aria-label="'+esc(String(cfg.title)+' – külső videólejátszó betöltése')+'"><span aria-hidden="true">▶</span><span>'+esc(cfg.title)+'<small>A lejátszó csak aktiváláskor kapcsolódik a külső szolgáltatóhoz.</small></span></button>';
 return '<div class="visual-embed-player visual-embed-'+ratio+'" data-embed-provider="'+esc(cfg.provider)+'" data-embed-source="'+esc(cfg.source)+'" data-embed-title="'+esc(cfg.title)+'" data-embed-click="'+(cfg.clickToLoad?'true':'false')+'">'+button+'</div>';
}
const activated=new WeakSet();
export function activateEmbeds(root){
 if(!root||typeof root.querySelectorAll!=='function')return;
 for(const host of root.querySelectorAll('.visual-embed-player[data-embed-provider]')){
  if(activated.has(host))continue;
  activated.add(host);
  const load=()=>{
   // Twitch documents a 400px minimum player width. On narrower cards,
   // offer the verified canonical link instead of pretending the embed works.
   if(String(host.dataset.embedProvider).startsWith('twitch-')&&host.getBoundingClientRect().width<400){
    try{
     const parsed=parseEmbedSource(host.dataset.embedProvider,host.dataset.embedSource);
     const link=document.createElement('a');link.className='visual-embed-external';
     link.href=parsed.provider==='twitch-live'?'https://www.twitch.tv/'+encodeURIComponent(parsed.id):'https://www.twitch.tv/videos/'+encodeURIComponent(parsed.id);
     link.target='_blank';link.rel='noopener noreferrer';
     link.textContent='A Twitch-lejátszóhoz szélesebb hely kell. Megnyitás Twitch-en (új lapon).';
     host.replaceChildren(link);
    }catch{}
    return;
   }
   const url=buildEmbedUrl({provider:host.dataset.embedProvider,source:host.dataset.embedSource},location.hostname);
   if(!url)return;
   const iframe=document.createElement('iframe');
   iframe.className='visual-embed-frame';
   iframe.src=url;iframe.title=host.dataset.embedTitle||'Beágyazott videó';
   iframe.loading='lazy';iframe.referrerPolicy='strict-origin-when-cross-origin';
   iframe.allow='encrypted-media; picture-in-picture; fullscreen';
   iframe.allowFullscreen=true;
   host.replaceChildren(iframe);
  };
  const button=host.querySelector('button.visual-embed-load');
  if(button)button.addEventListener('click',load,{once:true});
  if(host.dataset.embedClick==='false')load();
 }
}
