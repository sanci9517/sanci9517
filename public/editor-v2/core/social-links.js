/* Canonical static Social Links for the Page Model; no remote integrations. */
export const SOCIAL_PLATFORMS=Object.freeze([
 {id:'twitch',label:'Twitch',glyph:'♜'},{id:'youtube',label:'YouTube',glyph:'▶'},
 {id:'tiktok',label:'TikTok',glyph:'♪'},{id:'discord',label:'Discord',glyph:'♧'},
 {id:'instagram',label:'Instagram',glyph:'◎'},{id:'kick',label:'Kick',glyph:'K'},
 {id:'x',label:'X',glyph:'𝕏'},{id:'facebook',label:'Facebook',glyph:'f'},
 {id:'github',label:'GitHub',glyph:'⌘'},{id:'website',label:'Weboldal',glyph:'↗'},
 {id:'email',label:'E-mail',glyph:'@'}
]);
export const SOCIAL_VARIANTS=Object.freeze(['pills','cards','minimal']);
export const SOCIAL_LAYOUTS=Object.freeze(['wrap','stack','grid']);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const platformById=id=>SOCIAL_PLATFORMS.find(entry=>entry.id===id);
export function socialLinkUrl(value,platform='website'){
 if(typeof value!=='string')return '';
 const url=value.trim();
 if(!url||url.length>2048||[...url].some(ch=>{const n=ch.charCodeAt(0);return n<32||n===127||n===92}))return '';
 if(platform==='email')return /^mailto:[^@\s/?#]+@[^@\s/?#]+\.[^@\s/?#]+$/i.test(url)?url:'';
 if(url.startsWith('//'))return '';
 if(platform==='website'&&url.startsWith('/')&&!url.startsWith('//'))return url;
 if(platform==='website'&&/^#[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(url))return url;
 try{
  const parsed=new URL(url);
  return parsed.protocol==='https:'&&Boolean(parsed.hostname)&&!parsed.username&&!parsed.password?url:'';
 }catch{return ''}
}
export function defaultSocialLinks(){return {version:1,variant:'pills',layout:'wrap',showIcons:true,items:[]}}
export function defaultSocialEntry(platform='twitch',id=''){
 const p=platformById(platform)||SOCIAL_PLATFORMS[0];
 return {id,platform:p.id,label:p.label,href:'',newWindow:true};
}
export function normalizeSocialLinks(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1)throw Error('Hiányzó közösségi hivatkozásmodell');
 if(!SOCIAL_VARIANTS.includes(value.variant)||!SOCIAL_LAYOUTS.includes(value.layout)||typeof value.showIcons!=='boolean')throw Error('Érvénytelen közösségi megjelenés');
 if(!Array.isArray(value.items)||value.items.length<1||value.items.length>12)throw Error('Adj hozzá 1–12 közösségi hivatkozást');
 const ids=new Set();
 const items=value.items.map(entry=>{
  if(!entry||typeof entry!=='object'||Array.isArray(entry))throw Error('Érvénytelen közösségi hivatkozás');
  const id=String(entry.id??''),platform=String(entry.platform??''),label=String(entry.label??'').trim();
  const href=socialLinkUrl(entry.href,platform);
  if(!/^[A-Za-z0-9_-]{1,64}$/.test(id)||ids.has(id))throw Error('A közösségi elemazonosítónak egyedinek kell lennie');
  ids.add(id);
  if(!platformById(platform)||!label||label.length>70||!href||typeof entry.newWindow!=='boolean')throw Error('Minden közösségi hivatkozáshoz platform, felirat és biztonságos URL szükséges');
  return {id,platform,label,href,newWindow:entry.newWindow};
 });
 return {version:1,variant:value.variant,layout:value.layout,showIcons:value.showIcons,items};
}
export function renderSocialLinksHtml(value){
 // Partial drafts can be previewed, but invalid destinations are never clickable.
 const cfg=value&&typeof value==='object'&&!Array.isArray(value)?value:defaultSocialLinks();
 const variant=SOCIAL_VARIANTS.includes(cfg.variant)?cfg.variant:'pills';
 const layout=SOCIAL_LAYOUTS.includes(cfg.layout)?cfg.layout:'wrap';
 const items=Array.isArray(cfg.items)?cfg.items.slice(0,12):[];
 const links=items.map(entry=>{
  if(!entry||typeof entry!=='object')return '';
  const platform=platformById(entry.platform)||platformById('website');
  const label=String(entry.label||platform.label).slice(0,70);
  const href=socialLinkUrl(entry.href,entry.platform);
  const icon=cfg.showIcons===false?'':'<span class="visual-social-icon" aria-hidden="true">'+escapeHtml(platform.glyph)+'</span>';
  const caption=icon+'<span class="visual-social-text">'+escapeHtml(label)+'</span>';
  const anchor=href
   ?'<a class="visual-social-link" href="'+escapeHtml(href)+'"'+(entry.newWindow?' target="_blank" rel="noopener noreferrer"':'')+' aria-label="'+escapeHtml(label+(entry.newWindow?' (új lapon nyílik)':''))+'">'+caption+'</a>'
   :'<span class="visual-social-link visual-social-missing" aria-disabled="true">'+caption+'<small>Állíts be URL-t</small></span>';
  return '<li class="visual-social-item">'+anchor+'</li>';
 }).join('');
 return '<nav class="visual-social-nav visual-social-'+variant+' visual-social-'+layout+'" aria-label="Közösségi elérhetőségek"><ul class="visual-social-list">'+(links||'<li class="visual-social-empty">Adj hozzá közösségi linket a Tartalom panelen.</li>')+'</ul></nav>';
}
