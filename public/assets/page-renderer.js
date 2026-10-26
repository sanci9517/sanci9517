/* Sanci9517 canonical public Page Model renderer — Editor v2 compatible. */
import { resolveNodeStyle, STYLE_MAP, needsRelativeOffsetPosition } from "../editor-v2/core/canvas-engine.js?v=20261020-position";
import { RICH_TEXT_FONT_FAMILIES } from "../editor-v2/core/schema.js";
import { LAYOUT_TYPES, isManagedLayout } from "../editor-v2/core/layout-presets.js";
import {isStructuredType,renderElementContent,activateStructuredContent,safeMediaUrl} from "../editor-v2/core/element-content.js";
import {legacyImageSource,legacyPlayableSource,legacyPlaybackSettings,legacyImagePresentation,legacyImageCaption} from "../editor-v2/core/legacy-media-source.js";
import {iconById} from "../editor-v2/core/icon-options.js";
import {normalizeDividerStyle} from "../editor-v2/core/decorative-elements.js";
import {normalizeCardContent,cardImageSrc} from "../editor-v2/core/card-content.js";
import {renderCountdownContent,activateCountdowns} from "../editor-v2/core/countdown-content.js";
import {renderSocialLinksHtml} from "../editor-v2/core/social-links.js";
import {renderEmbedHtml,activateEmbeds} from "../editor-v2/core/creator-embed.js";
import {renderCodeSnippet,activateCodeBlocks} from "../editor-v2/core/code-snippet.js";
import {isAuthoredContent,contentTag,contentAttributes,authoredNodeHtml,initContentInteractions} from "../editor-v2/core/authored-content.js";
import {defaultTokens,applyTokenVariables} from "../editor-v2/core/design-tokens.js";
import {isVisibleOnDevice,collectVisibleDescendants} from "../editor-v2/core/visibility.js";
import {applyStateStyles,hasStateStyles} from "../editor-v2/core/state-styles.js";
import {backgroundImageValue,MEDIA_ASSET_ID} from "../editor-v2/core/background-asset.js";
(()=>{
 const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const safeUrl=v=>{const raw=safeMediaUrl(v);if(!raw)return '';try{return new URL(raw,location.origin).href}catch{return''}};
 const safeRichUrl=v=>{const raw=String(v??'').trim();if(!raw||/[\u0000-\u001f\u007f\\]/.test(raw)||raw.startsWith('//'))return'';if(raw.startsWith('#')&&raw.length>1)return raw;if(raw.startsWith('/')&&!raw.startsWith('//'))return raw;try{const u=new URL(raw);return !u.username&&!u.password&&['http:','https:','mailto:'].includes(u.protocol)?raw:''}catch{return''}};
 const sanci={live:['🔴','Twitch Live','Élő adás állapota'],twitch:['🎮','Twitch Player','Twitch élő közvetítés'],youtube:['▶️','YouTube','Videók és feltöltések'],tiktok:['♪','TikTok','Rövid klipek és tartalmak'],discord:['👥','Discord','Közösség és beszélgetés'],schedule:['📅','Menetrend','Következő adások és időpontok'],streamcount:['📊','Stream statisztika','Aktuális adásstatisztikák'],followers:['👤','Követők','Követőszám'],subs:['⭐','Feliratkozók','Feliratkozói információk'],vod:['🎥','VOD','Korábbi adások'],support:['🤝','Támogatás','A csatorna támogatási lehetőségei'],community:['👥','Közösség','Csatlakozz a Sanci9517 közösséghez'],gamecard:['🎮','Játékkártya','Kiemelt játék'],gamelist:['🕹️','Játéklista','Játszott és tervezett játékok']};
 function sanciBlock(n){const d=sanci[n.type]||['✦',n.name||n.type,'Sanci9517 tartalom'];const text=n.props?.text&&n.props.text!==n.name?n.props.text:'';return `<div class="visual-sanci-icon">${d[0]}</div><div class="visual-sanci-copy"><strong>${esc(text||d[1])}</strong><span>${esc(d[2])}</span></div>`}
 function style(n){
  const values=resolveNodeStyle(n,currentDevice);let out='';
  for(const [key,property] of Object.entries(STYLE_MAP)){
    if(['backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat'].includes(key))continue;
   const cssProperty=property.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase());
   const value=values[key];if(value===undefined||value===null||value==='')continue;
   const text=String(value);if(/[\u0000-\u001f\u007f;]/.test(text)||!CSS.supports(cssProperty,text))continue;
   out+=`${cssProperty}:${esc(text)};`;
   if(key==='width'&&currentDevice==='mobile')out+=`--editor-mobile-width:${esc(text)};`;
  }
  // Keep drag/Inspector offsets identical to the Editor canvas. left/top do
  // not move a static element in CSS, while the canvas engine promotes it to
  // relative positioning for the same Page Model value.
  if(needsRelativeOffsetPosition(values))out+='position:relative;';
   for(const [legacy,property] of [['background','background'],['border','border']]){
   if(values[legacy]&&CSS.supports(property,String(values[legacy])))out+=`${property}:${esc(values[legacy])};`;
  }
   const background=backgroundImageValue(values);if(background!=='none')out+=`background-image:${esc(background)};`;
   const hasAsset=MEDIA_ASSET_ID.test(String(values.backgroundAssetId||''));
   for(const [key,property,fallback] of [['backgroundSize','background-size','cover'],['backgroundPosition','background-position','center center'],['backgroundRepeat','background-repeat','no-repeat']]){
    const value=values[key]||(hasAsset?fallback:'');
    if(value&&CSS.supports(property,String(value)))out+=`${property}:${esc(value)};`;
   }
  if(values.radius!==undefined&&Number.isFinite(Number(values.radius)))out+=`border-radius:${Math.max(0,Number(values.radius))}px;`;
  if(values.fontSize!==undefined&&Number.isFinite(Number(values.fontSize)))out+=`font-size:${Math.max(8,Number(values.fontSize))}px;`;
  for(const [key,property] of [['x','left'],['y','top']]){
   const value=values[key];if(value!==undefined&&CSS.supports(property,String(value)))out+=`${property}:${esc(value)};`;
  }
  return out;
 }
 function richTextHtml(value){
  if(value?.type!=='richtext-document'||value.schemaVersion!==1||!Array.isArray(value.blocks))return'';
  const inlines=items=>(Array.isArray(items)?items:[]).map(item=>{
   let label=esc(item?.text??'');
   // A page style can override .visual-text white-space. Keep explicit
   // Shift+Enter / clipboard hard breaks visible without changing textContent
   // (a <br> element would lose the canonical \\n on DOM roundtrip).
   if(String(item?.text??'').includes('\n'))label=`<span style="white-space:pre-wrap">${label}</span>`;
   for(const [mark,tag] of [['bold','strong'],['italic','em'],['underline','u'],['strikethrough','s'],['subscript','sub'],['superscript','sup'],['code','code']])if(item?.marks?.includes(mark))label=`<${tag}>${label}</${tag}>`;
   const safeColor=value=>typeof value==='string'&&/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)?value:'';
   const styles=[];const color=safeColor(item?.styles?.color),highlight=safeColor(item?.styles?.backgroundColor);if(color)styles.push(`color:${color}`);if(highlight)styles.push(`background-color:${highlight}`);const fontSize=typeof item?.styles?.fontSize==='string'&&/^(?:[8-9]|[1-8]\d|9[0-6])px$/.test(item.styles.fontSize)?item.styles.fontSize:'';if(fontSize)styles.push(`font-size:${fontSize}`);const fontFamily=RICH_TEXT_FONT_FAMILIES.includes(item?.styles?.fontFamily)?item.styles.fontFamily:'';if(fontFamily)styles.push(`font-family:${esc(fontFamily)}`);if(styles.length)label=`<span style="${styles.join(';')}">${label}</span>`;
   const href=typeof item?.link?.href==='string'?safeRichUrl(item.link.href):'';
   if(!href)return label;
   const blank=item.link.target==='_blank';const title=typeof item.link.title==='string'?` title="${esc(item.link.title)}"`:'';
   return `<a href="${esc(href)}"${blank?' target="_blank" rel="noopener noreferrer"':''}${title}>${label}</a>`;
  }).join('');
  return value.blocks.map(block=>{
   if(block?.type==='table'&&Array.isArray(block.rows))return `<div class="visual-richtext-table-wrap"><table class="visual-richtext-table"><tbody>${block.rows.map(row=>`<tr>${(row.cells||[]).map(cell=>{const tag=cell.header?'th':'td',align=['left','center','right','justify'].includes(cell.align)?` style="text-align:${cell.align}"`:'';return `<${tag}${align}>${inlines(cell.children)}</${tag}>`}).join('')}</tr>`).join('')}</tbody></table></div>`;
   if(block?.type==='bulleted-list'||block?.type==='numbered-list'){
    const tag=block.type==='bulleted-list'?'ul':'ol';
    const items=Array.isArray(block.items)?block.items:[];
    return `<${tag}>${items.map(item=>`<li>${inlines(Array.isArray(item)?item:item?.children)}</li>`).join('')}</${tag}>`;
   }
   const tag=block?.type==='heading'&&Number.isInteger(block.level)&&block.level>=1&&block.level<=6?`h${block.level}`:block?.type==='quote'?'blockquote':block?.type==='code'?'pre':'p';
   const align=['left','center','right','justify'].includes(block?.align)?` style="text-align:${block.align}"`:'';
   return `<${tag}${align}>${inlines(block?.children)}</${tag}>`;
  }).join('');
 }
 function renderNodeHtml(page,id,managed){const n=page.nodes?.[id];if(!n||!isVisibleOnDevice(n,currentDevice))return'';const t=esc(n.props?.text??n.name??'');const p=n.props||{};const children=(n.children||[]).map(child=>nodeHtml(page,child,managed)).join('');const st=style(n);if(n.metadata?.contentVersion===1&&isAuthoredContent(n)){const tag=contentTag(n),attrs=Object.entries(contentAttributes(n)).map(([key,value])=>' '+key+'="'+esc(value)+'"').join('');return '<'+tag+' class="visual-editor-node creator-node" data-content-type="'+esc(n.type)+'"'+attrs+' style="'+st+'">'+authoredNodeHtml(n,{childrenHtml:children,device:currentDevice})+'</'+tag+'>'}if(n.type==='schedule')return scheduleHtml(n);if(sanci[n.type])return `<section class="visual-editor-node visual-sanci-block" style="${st}">${sanciBlock(n)}${children}</section>`;if(isStructuredType(n.type)&&p.contentModel)return `<section class="visual-editor-node visual-structured" style="${st}">${renderElementContent(n.type,p.contentModel,n.id)}</section>`;if(n.type==='code'&&n.metadata?.codeSnippetVersion===1)
 return `<section class="visual-editor-node visual-code-container" style="${st}">${renderCodeSnippet(p.codeSnippet)}${children}</section>`;
if(n.type==='embed'&&n.metadata?.embedContentVersion===1)
 return `<section class="visual-editor-node visual-creator-embed" style="${st}">${renderEmbedHtml(p.embedContent)}${children}</section>`;
if(n.type==='social'&&n.metadata?.socialLinksVersion===1)
 return `<section class="visual-editor-node visual-social" style="${st}">${renderSocialLinksHtml(p.socialLinks)}${children}</section>`;
if(n.type==='countdown'&&n.metadata?.countdownVersion===1)
 return `<section class="visual-editor-node visual-countdown" style="${st}">${renderCountdownContent(p.countdown)}</section>`;
if(n.type==='card'&&n.metadata?.cardContentVersion===1){
 let cfg;try{cfg=normalizeCardContent(p.cardContent)}
 catch{return `<article class="visual-editor-node visual-card" style="${st}"><p>Hiányos kártyatartalom – javítsd a szerkesztőben.</p></article>`}
 const cardSrc=cardImageSrc(cfg);const media=cardSrc?`<img class="visual-card-media" src="${esc(cardSrc)}" alt="${esc(cfg.imageAlt)}" loading="lazy">`:'';
 const description=cfg.description?`<p class="visual-card-description">${esc(cfg.description)}</p>`:'';
 const action=cfg.actionHref?`<a class="visual-card-action" href="${esc(safeRichUrl(cfg.actionHref))}"${cfg.newWindow?' target="_blank" rel="noopener noreferrer"':''}>${esc(cfg.actionLabel)}</a>`:'';
 return `<article class="visual-editor-node visual-card visual-card-${cfg.variant}" style="${st}">${media}<h3 class="visual-card-title">${esc(cfg.title)}</h3>${description}${children}${action}</article>`;
}if(n.type==='badge')return `<span class="visual-editor-node visual-badge" style="${st}">${esc(p.text??'')}</span>`;
 if(n.type==='quote')return `<blockquote class="visual-editor-node visual-quote" style="${st}"><p>${esc(p.text??'')}</p>${p.attribution?`<footer><cite>${esc(p.attribution)}</cite></footer>`:''}</blockquote>`;
 if(n.type==='icon'){const icon=iconById(p.icon);return `<span class="visual-editor-node visual-icon" role="img" aria-label="${esc(p.label||icon.label)}" style="${st}">${icon.glyph}</span>`;}
 if(n.type==='heading'){const level=Number.isInteger(p.level)&&p.level>=1&&p.level<=6?p.level:2;return `<h${level} class="visual-editor-node visual-heading" style="${st}">${t}</h${level}>`}if(n.type==='richtext')return `<div class="visual-editor-node visual-text visual-richtext" style="${st}">${p.richText?richTextHtml(p.richText):t}</div>`;if(n.type==='text')return `<div class="visual-editor-node visual-text" style="${st}">${t}</div>`;if(['button','submit'].includes(n.type)){const u=safeRichUrl(p.url||p.href);const blank=Boolean(p.newWindow);return u?`<a class="visual-editor-node visual-button" style="${st}" href="${esc(u)}"${blank?' target="_blank" rel="noopener noreferrer"':''}>${t}</a>`:`<div class="visual-editor-node visual-button" style="${st}">${t}</div>`}if(n.type==='link'){const u=safeRichUrl(p.url||p.href);const blank=Boolean(p.newWindow);return u?`<a class="visual-editor-node visual-button" style="${st}" href="${esc(u)}"${blank?' target="_blank" rel="noopener noreferrer"':''}>${t}</a>`:`<div class="visual-editor-node visual-text" style="${st}">${t}</div>`}if(n.type==='image'){
  const u=safeUrl(legacyImageSource(p)),cfg=legacyImagePresentation(p),caption=legacyImageCaption(p);
  if(!u)return `<div class="visual-editor-node visual-card" style="${st}">Kép</div>`;
  const image=`<img class="visual-image" style="object-fit:${cfg.fit};object-position:${cfg.objectPosition};aspect-ratio:${cfg.ratio};" src="${esc(u)}" alt="${esc(cfg.alt)}"${cfg.decorative?' role="presentation"':''} loading="${cfg.loading}">`;
  return caption?`<figure class="visual-editor-node visual-image-figure" style="${st}margin:0;max-width:100%;"><span style="display:block;max-width:100%;">${image}</span><figcaption style="display:block;padding-top:.5em;font-size:.85em;opacity:.8;white-space:pre-wrap;overflow-wrap:anywhere;">${esc(caption)}</figcaption></figure>`:`<img class="visual-editor-node visual-image" style="${st}object-fit:${cfg.fit};object-position:${cfg.objectPosition};aspect-ratio:${cfg.ratio};" src="${esc(u)}" alt="${esc(cfg.alt)}"${cfg.decorative?' role="presentation"':''} loading="${cfg.loading}">`;
}if(n.type==='video'){
  const u=safeUrl(legacyPlayableSource(p)),cfg=legacyPlaybackSettings(p,{video:true}),poster=safeUrl(cfg.poster);
  return u?`<video class="visual-editor-node visual-video" style="${st}" src="${esc(u)}"${cfg.controls?' controls':''}${cfg.loop?' loop':''}${cfg.muted?' muted':''}${cfg.autoplay?' autoplay':''}${poster?` poster="${esc(poster)}"`:''} playsinline preload="metadata"></video>`:`<div class="visual-editor-node visual-card" style="${st}">Videó még nincs beállítva</div>`;
}if(n.type==='audio'){
  const u=safeUrl(legacyPlayableSource(p)),cfg=legacyPlaybackSettings(p);
  return u?`<audio class="visual-editor-node visual-audio" style="${st}" src="${esc(u)}"${cfg.controls?' controls':''}${cfg.loop?' loop':''} preload="none"></audio>`:`<div class="visual-editor-node visual-card" style="${st}">Hang még nincs beállítva</div>`;
}if(n.type==='divider'){
 if(n.metadata?.decorativeVersion===1){
  const cfg=normalizeDividerStyle(p.decoration);
  return `<hr class="visual-editor-node visual-divider" role="separator" style="${st}border:0;border-top:${cfg.thickness}px ${cfg.lineStyle} ${cfg.color};">`;
 }
 return `<hr class="visual-editor-node" style="${st}border:0;border-top:1px solid rgba(255,255,255,.16);">`;
}if(n.type==='spacer'){
 return n.metadata?.spacerVersion===1
  ?`<div class="visual-editor-node visual-layout-managed visual-spacer" aria-hidden="true" style="min-height:0;${st}"></div>`
  :`<div class="visual-editor-node" style="${st}min-height:60px"></div>`;
}if(managed&&LAYOUT_TYPES.includes(n.type))return `<section class="visual-editor-node visual-layout" style="${st}">${children}</section>`;return `<section class="visual-editor-node visual-card" style="${st}">${children||`<strong>${t}</strong>`}</section>`}
 function nodeHtml(page,id,managed=false){
  const node=page.nodes?.[id];if(!node)return '';managed=managed||isManagedLayout(node)||isAuthoredContent(node);
  let html=renderNodeHtml(page,id,managed);if(!html)return html;
  html=html.replace(/^<([a-z0-9]+)(?=[ >])/,`<$1 data-node-id="${esc(id)}"`);
  if(node.metadata?.stateVersion===1)html=html.replace('class="','class="creator-state-enabled ');
  const opening=html.match(/^<([a-z0-9]+)\b([^>]*)>/i),tag=opening?.[1]?.toLowerCase(),attrs=opening?.[2]||'';
  if(hasStateStyles(node,'focus-visible',currentDevice)&&!/\baria-hidden\s*=\s*["']?true\b/i.test(attrs)){
   const alreadyFocusable=/\btabindex\s*=|\bcontenteditable\s*=\s*["']?true\b/i.test(attrs)||['button','input','select','textarea','summary','iframe','object','embed'].includes(tag)||(['audio','video'].includes(tag)&&/\bcontrols(?:\s|=|$)/i.test(attrs))||(['a','area'].includes(tag)&&/\bhref\s*=/i.test(attrs));
   if(!alreadyFocusable)html=html.replace(/^<([a-z0-9]+)(?=\s|>)/i,'<$1 tabindex="0"');
  }
  // Root attributes for legacy elements use the same mapping as Editor canvas.
  // Authored elements already receive these attributes in renderNodeHtml.
  if(!isAuthoredContent(node)){
   const attrs=contentAttributes(node);
   for(const key of ['id','aria-label','lang']){
    const value=attrs[key];if(value===undefined)continue;
    const opening=html.match(/^<[a-z0-9]+\b[^>]*>/i)?.[0]||'';
    if([...opening.matchAll(/\s([^\s=/>]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g)].some(match=>match[1].toLowerCase()===key))continue;
    html=html.replace(/^<([a-z0-9]+)/,`<$1 ${key}="${esc(value)}"`);
   }
  }
  const safeHex=value=>typeof value==='string'&&/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)?value:'';
  for(const [value,klass,variable] of [
   [node.states?.hover?.backgroundColor,'visual-hover-bg','--sanci-hover-bg'],
   [node.states?.hover?.color,'visual-hover-text','--sanci-hover-color'],
   [node.states?.focus?.outlineColor,'visual-focus-outline','--sanci-focus-outline']
  ]){
   const color=safeHex(value);if(!color)continue;
   html=html.replace('class="',`class="${klass} `);
   html=html.replace('style="',`style="${variable}:${color};`);
  }
  return managed?html.replace('class="','class="visual-layout-managed '):html;
 }
 function ensureStyle(){if(document.getElementById('visual-editor-renderer-style'))return;const s=document.createElement('style');s.id='visual-editor-renderer-style';s.textContent='.visual-hover-bg:hover{background-color:var(--sanci-hover-bg)!important}.visual-hover-text:hover{color:var(--sanci-hover-color)!important}.visual-focus-outline:focus-visible{outline:3px solid var(--sanci-focus-outline)!important;outline-offset:3px}.visual-badge{display:inline-flex;align-items:center;padding:6px 12px;border:1px solid currentColor;border-radius:999px;font-weight:700;font-size:.85em;max-width:100%;overflow-wrap:anywhere}.visual-code-container{min-width:0;max-width:100%}.visual-code-figure{--code-bg:#0f172a;--code-text:#e2e8f0;--code-line:#64748b;margin:0;max-width:100%;min-width:0;border:1px solid #475569;border-radius:14px;overflow:hidden;background:var(--code-bg);color:var(--code-text);font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.visual-code-light{--code-bg:#f8fafc;--code-text:#0f172a;--code-line:#64748b}.visual-code-figure figcaption{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;min-height:54px;padding:8px 14px;border-bottom:1px solid #64748b70;font:600 13px/1.4 system-ui}.visual-code-title{flex:1;min-width:110px;overflow-wrap:anywhere}.visual-code-language{padding:4px 8px;border:1px solid #64748b70;border-radius:6px;font-size:12px}.visual-code-copy{min-height:44px;min-width:86px;padding:6px 12px;border:1px solid #64748b;border-radius:8px;background:#334155;color:#fff;cursor:pointer;font:600 13px system-ui}.visual-code-copy:focus-visible{outline:3px solid #60a5fa;outline-offset:2px}.visual-code-figure pre{box-sizing:border-box;margin:0;padding:14px 18px;max-width:100%;overflow:auto;tab-size:2;white-space:pre;font:400 13px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace}.visual-code-figure pre:focus-visible{outline:2px solid #60a5fa;outline-offset:-3px}.visual-code-figure code{display:block;width:max-content;min-width:100%;font:inherit}.visual-code-line{display:block;min-height:1.6em}.visual-code-numbered .visual-code-line:before{content:attr(data-line);display:inline-block;width:3em;margin-right:1.25em;padding-right:.75em;border-right:1px solid #64748b70;text-align:right;user-select:none;color:var(--code-line)}.visual-code-wrap pre{white-space:pre-wrap;overflow-wrap:anywhere}.visual-code-wrap code{width:100%;white-space:pre-wrap;overflow-wrap:anywhere}.visual-code-wrap .visual-code-line{white-space:pre-wrap;overflow-wrap:anywhere}.code-preview .visual-code-copy{pointer-events:none}.visual-creator-embed{max-width:100%;min-width:0}.visual-embed-player{position:relative;width:100%;max-width:100%;aspect-ratio:16/9;min-height:200px;overflow:hidden;border-radius:14px;border:1px solid #64748b;background:linear-gradient(135deg,#172139,#080c15);color:#fff}.visual-embed-classic{aspect-ratio:4/3}.visual-embed-square{aspect-ratio:1}.visual-embed-portrait{aspect-ratio:9/16;max-width:480px}.visual-embed-load{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;position:absolute;inset:0;width:100%;height:100%;border:0;padding:20px;background:transparent;color:#f8fafc;cursor:pointer;text-align:center;font:700 clamp(14px,2vw,20px)/1.4 system-ui}.visual-embed-load>span:first-child{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:#dc2626;color:#fff;font-size:28px}.visual-embed-load small{display:block;max-width:460px;margin:8px auto 0;font-size:12px;font-weight:400;line-height:1.4;color:#cbd5e1}.visual-embed-load:focus-visible,.visual-embed-external:focus-visible{outline:3px solid #60a5fa;outline-offset:-4px}.visual-embed-load:hover{background:rgba(255,255,255,.06)}.visual-embed-frame{display:block;width:100%;height:100%;min-height:200px;border:0}.visual-embed-empty{min-height:180px;padding:28px;border:1px dashed #64748b;border-radius:14px;background:rgba(71,85,105,.13);color:inherit;display:grid;place-items:center;text-align:center;overflow-wrap:anywhere}.visual-embed-external{display:flex;align-items:center;justify-content:center;width:100%;height:100%;padding:24px;color:#fff;text-align:center;text-decoration:underline}.embed-preview .visual-embed-player{pointer-events:none}@media(prefers-reduced-motion:reduce){.visual-embed-load{transition:none}}.visual-social{min-width:0;max-width:100%}.visual-social-nav{width:100%;max-width:100%}.visual-social-list{list-style:none;display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;margin:0;padding:0}.visual-social-item{min-width:0}.visual-social-link{display:flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:10px 16px;max-width:100%;border-radius:999px;border:1px solid rgba(148,163,184,.55);background:rgba(30,41,59,.85);color:#f8fafc;text-decoration:none;font:600 14px/1.45 system-ui;overflow-wrap:anywhere;transition:background-color .15s ease,transform .15s ease}.visual-social-link:hover{background:#334155;transform:translateY(-1px)}.visual-social-link:focus-visible{outline:3px solid #60a5fa;outline-offset:3px}.visual-social-icon{display:inline-flex;align-items:center;justify-content:center;flex:none;min-width:20px;font-size:1.2em}.visual-social-text{min-width:0}.visual-social-cards .visual-social-link{border-radius:14px;padding:18px 22px;box-shadow:0 3px 14px rgba(0,0,0,.15)}.visual-social-minimal .visual-social-link{background:transparent;border-color:transparent;border-radius:6px;padding:8px 10px;text-decoration:underline;text-underline-offset:3px}.visual-social-stack .visual-social-list{flex-direction:column}.visual-social-stack .visual-social-item{width:100%}.visual-social-grid .visual-social-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr))}.visual-social-grid .visual-social-link{height:100%}.visual-social-missing{opacity:.68;cursor:not-allowed;flex-wrap:wrap}.visual-social-missing small{font:400 11px system-ui;color:#cbd5e1}.visual-social-empty{padding:14px;color:#cbd5e1}.social-preview .visual-social-nav{pointer-events:none}@media(prefers-reduced-motion:reduce){.visual-social-link{transition:none}.visual-social-link:hover{transform:none}}.visual-countdown{padding:18px 20px;border:1px solid #64748b;border-radius:14px;background:rgba(15,23,42,.75);color:#f8fafc;max-width:100%;overflow-wrap:anywhere}.visual-countdown-content{display:grid;gap:10px;text-align:center}.visual-countdown-heading{font-size:clamp(1rem,2vw,1.5rem)}.visual-countdown-clock{display:block;font-variant-numeric:tabular-nums;font-size:clamp(1.1rem,3vw,1.8rem);font-weight:800;line-height:1.35;white-space:normal;overflow-wrap:anywhere}.visual-card-outline{background:transparent;border:2px solid currentColor}.visual-card-glass{background:rgba(255,255,255,.10);backdrop-filter:blur(12px)}.visual-card-media{display:block;width:100%;max-height:380px;object-fit:cover;border-radius:12px;margin:0 0 12px}.visual-card-title{margin:0 0 8px;font-size:1.3em;line-height:1.3}.visual-card-description{margin:0 0 12px;white-space:pre-wrap;overflow-wrap:anywhere}.visual-card-action{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin-top:12px;padding:8px 16px;border-radius:8px;background:#fff;color:#101828;font-weight:700;text-decoration:none}.visual-card-action:focus-visible{outline:3px solid #60a5fa;outline-offset:2px}.visual-quote{border-left:4px solid currentColor;padding:8px 18px;margin:0;font-style:italic}.visual-quote p{margin:0 0 8px}.visual-quote cite{font-size:.85em;font-weight:600}.visual-icon{display:inline-flex;align-items:center;justify-content:center;font-size:1.6em;line-height:1;min-width:1em;min-height:1em}.visual-structured{min-width:0}.visual-structured-list{padding-left:1.5em}.visual-carousel-slide[hidden]{display:none!important}.visual-carousel-slide{padding:20px;border:1px solid #64748b;border-radius:12px;background:rgba(127,127,127,.08)}.visual-carousel-slide img{display:block;max-width:100%;max-height:400px;object-fit:contain;margin:auto}.visual-carousel-slide h3{margin:12px 0 6px}.visual-carousel-slide p{white-space:pre-wrap}.visual-carousel-controls{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:12px}.visual-carousel-controls button{min-width:44px;min-height:44px;border:1px solid #64748b;border-radius:8px;background:#334155;color:#fff;cursor:pointer}.visual-structured-table-scroll{max-width:100%;overflow:auto}.visual-structured-table{border-collapse:collapse;width:100%}.visual-structured-table th,.visual-structured-table td{border:1px solid currentColor;padding:8px 12px;text-align:left}.visual-structured-accordion details{padding:8px 0;border-bottom:1px solid rgba(127,127,127,.3)}.visual-structured-accordion summary{cursor:pointer;padding:8px}.visual-structured-tabs [role=tablist]{display:flex;gap:8px;flex-wrap:wrap}.visual-structured-tabs [role=tab]{cursor:pointer;border:1px solid #818a9a;border-radius:8px;padding:9px 14px;background:transparent;color:inherit}.visual-structured-tabs [role=tab][aria-selected=true]{background:#334155;color:#fff}.visual-structured-panel{padding:14px 6px;white-space:pre-wrap}.visual-structured-tabs [hidden]{display:none!important}.visual-structured-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}.visual-gallery-thumb{border:1px solid #94a3b8;border-radius:8px;overflow:hidden;background:transparent;color:inherit;cursor:zoom-in;padding:0}.visual-gallery-thumb img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}.visual-gallery-thumb span{display:block;padding:8px}.visual-gallery-dialog{max-width:95vw;max-height:95vh;border:none;border-radius:12px;padding:24px;background:#121a2b;color:#fff}.visual-gallery-dialog::backdrop{background:rgba(0,0,0,.78)}.visual-gallery-dialog img{display:block;max-width:85vw;max-height:75vh;object-fit:contain}.visual-gallery-close{position:absolute;right:10px;top:10px;font-size:25px;cursor:pointer}.visual-gallery-prev,.visual-gallery-next{min-width:44px;min-height:44px;padding:8px 12px;margin:8px;border:1px solid #64748b;border-radius:8px;background:#1f2937;color:#fff;cursor:pointer}.visual-gallery-empty{padding:30px;background:#38465e;color:#fff}.visual-video,.visual-audio{display:block;width:100%}.visual-video{max-height:80vh}.visual-editor-canvas{display:flex;flex-direction:column;gap:18px;min-height:400px}.visual-editor-node{box-sizing:border-box}.visual-layout-managed{position:relative;min-width:0}.visual-layout{margin:0;padding:0;border:0}.visual-text{white-space:pre-wrap}.visual-text table{border-collapse:collapse;max-width:100%;font:inherit;color:inherit}.visual-text th,.visual-text td{padding:8px 10px;border:1px solid currentColor;text-align:left;vertical-align:top}.visual-richtext-table-wrap{max-width:100%;overflow:auto}.visual-richtext-table{min-width:320px}.visual-richtext-table th{font-weight:700;background:rgba(127,127,127,.12)}.visual-heading{color:#fff;line-height:1.05;margin:0}.visual-button{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:10px;background:#f5f5f7;color:#101016;text-decoration:none;font-weight:850}.visual-image{display:block;width:100%;max-height:620px;object-fit:cover;border-radius:16px}.visual-card{padding:24px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:linear-gradient(135deg,rgba(14,22,38,.92),rgba(8,14,25,.88))}.visual-sanci-block{display:flex;align-items:center;gap:16px;padding:22px;border:1px solid rgba(143,156,255,.25);border-radius:18px;background:linear-gradient(135deg,rgba(24,31,55,.96),rgba(10,16,29,.94))}.visual-sanci-icon{width:52px;height:52px;display:grid;place-items:center;flex:none;border-radius:14px;background:rgba(143,156,255,.12);font-size:25px}.visual-sanci-copy{display:flex;flex-direction:column;gap:5px}.visual-sanci-copy strong{font-size:18px;color:#fff}.visual-sanci-copy span{font-size:13px;color:#aeb8c8}.visual-schedule{padding:22px;border:1px solid rgba(143,156,255,.25);border-radius:18px;background:linear-gradient(135deg,rgba(24,31,55,.96),rgba(10,16,29,.94))}.visual-schedule-header{font-size:18px;color:#fff;margin-bottom:12px}.visual-schedule-card{padding:16px;margin-top:10px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(0,0,0,.12)}.visual-schedule-title{display:block;color:#fff;font-size:16px}.visual-schedule-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:7px;color:#aeb8c8;font-size:13px}.visual-schedule-status{display:inline-block;margin-top:8px;color:#dce2ee;font-size:12px}.visual-schedule-notes{margin:8px 0 0;color:#c6cedb;font-size:13px;white-space:pre-wrap}.visual-schedule-link{display:inline-flex;margin-top:10px;color:#fff;text-decoration:none;font-size:12px}.visual-schedule-empty{color:#aeb8c8;font-size:14px;padding:12px 0}.visual-schedule-error{margin:10px 0 0;padding:12px 14px;border:1px solid #987451;border-radius:10px;background:#392a20;color:#fff0d8;font-size:14px;line-height:1.5}.preview-toolbar{position:sticky;top:0;z-index:10000;display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;background:#090d16;color:#dce2ee;border-bottom:1px solid rgba(255,255,255,.12);font:600 13px system-ui}.preview-toolbar button{border:1px solid rgba(255,255,255,.15);background:#111827;color:#dce2ee;border-radius:8px;padding:8px 12px;cursor:pointer}.preview-toolbar button.active{background:#f5f5f7;color:#101016}.preview-shell{display:flex;justify-content:center;min-height:calc(100vh - 53px);padding:24px;background:#05070c}.preview-frame{width:1440px;max-width:100%;min-height:calc(100vh - 101px);background:#0b1020;box-shadow:0 12px 50px rgba(0,0,0,.35);overflow:hidden}.preview-frame.preview-mobile{width:390px}.preview-frame.preview-tablet{width:768px}.preview-frame.preview-desktop{width:1440px}.preview-frame>.site-header,.preview-frame>.page,.preview-frame>.footer{width:100%;box-sizing:border-box}.preview-frame .wrap{box-sizing:border-box}@media(max-width:700px){.builder-section,.builder-card{padding:20px}.builder-columns{grid-template-columns:1fr!important}.content-canvas.visual-editor-canvas{display:block!important;min-height:0!important}.content-canvas.visual-editor-canvas>.visual-editor-node:not(.visual-layout-managed){position:relative!important;left:0!important;top:auto!important;width:var(--editor-mobile-width,100%)!important;min-width:0!important;max-width:100%!important;height:auto!important;margin:0 0 16px!important}.content-canvas.visual-editor-canvas>.visual-editor-node:not(.visual-layout-managed):last-child{margin-bottom:0!important}.content-canvas.visual-editor-canvas .visual-editor-node>.visual-editor-node:not(.visual-layout-managed){position:relative!important;left:0!important;top:auto!important;width:var(--editor-mobile-width,100%)!important;max-width:100%!important;height:auto!important;margin:0 0 12px!important}}';document.head.appendChild(s)}
 let currentDevice=window.innerWidth<=700?'mobile':window.innerWidth<=900?'tablet':'desktop';
 let scheduleCache=new Map();
 let scheduleFailures=new Set();
 let pageLoadToken=0;
 const scheduleDefaults={version:1,mode:'upcoming',limit:10,statuses:['scheduled','live'],platforms:[],order:'asc',showTitle:true,showPlatform:true,showTime:true,showEndTime:false,showStatus:false,showNotes:false,showLink:true,emptyText:'Nincs tervezett stream.'};
 function scheduleConfig(value){const v=value&&typeof value==='object'?value:{};const cfg={...scheduleDefaults,...v};if(cfg.version!==1||!['upcoming','all','next'].includes(cfg.mode)||!Number.isInteger(cfg.limit)||cfg.limit<1||cfg.limit>50||!Array.isArray(cfg.statuses)||!cfg.statuses.length||cfg.statuses.some(x=>!['scheduled','live','completed'].includes(x))||!Array.isArray(cfg.platforms)||cfg.platforms.length>20||cfg.platforms.some(x=>typeof x!=='string'||!x.trim()||x.trim().length>40)||!['asc','desc'].includes(cfg.order))throw new Error('INVALID_SCHEDULE_CONFIG');for(const k of ['showTitle','showPlatform','showTime','showEndTime','showStatus','showNotes','showLink'])if(typeof cfg[k]!=='boolean')throw new Error('INVALID_SCHEDULE_CONFIG');if(typeof cfg.emptyText!=='string'||!cfg.emptyText.trim()||cfg.emptyText.trim().length>200)throw new Error('INVALID_SCHEDULE_CONFIG');return cfg}
 function scheduleQuery(cfg){const p=new URLSearchParams({mode:cfg.mode,limit:String(cfg.limit),statuses:cfg.statuses.join(','),order:cfg.order});if(cfg.platforms.length)p.set('platforms',cfg.platforms.join(','));return p.toString()}
 function scheduleDate(v){const d=new Date(v);return Number.isNaN(d.getTime())?String(v||''):new Intl.DateTimeFormat('hu-HU',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(d)}
 function unavailableScheduleHtml(n){return '<section class="visual-editor-node visual-schedule" style="'+style(n)+'"><div class="visual-schedule-header"><strong>Adásrend</strong></div><p class="visual-schedule-error" role="status">Az adásrend átmenetileg nem tölthető be. Kérjük, próbáld meg később.</p></section>'}
 function scheduleHtml(n){let cfg;try{cfg=scheduleConfig(n.props?.schedule)}catch{return unavailableScheduleHtml(n)}const key=JSON.stringify(cfg);if(scheduleFailures.has(key))return unavailableScheduleHtml(n);const items=scheduleCache.get(key)||[];let cards='';for(const item of items){let h='';if(cfg.showTitle)h+='<strong class="visual-schedule-title">'+esc(item.title)+'</strong>';let meta='';if(cfg.showPlatform)meta+='<span>'+esc(item.platform)+'</span>';if(cfg.showTime)meta+='<span>'+esc(scheduleDate(item.startsAt))+'</span>';if(cfg.showEndTime&&item.endsAt)meta+='<span>'+esc(scheduleDate(item.endsAt))+'</span>';if(meta)h+='<div class="visual-schedule-meta">'+meta+'</div>';if(cfg.showStatus)h+='<span class="visual-schedule-status">'+esc(item.status)+'</span>';if(cfg.showNotes&&item.notes)h+='<p class="visual-schedule-notes">'+esc(item.notes)+'</p>';if(cfg.showLink&&item.url){const u=safeUrl(item.url);if(u)h+='<a class="visual-schedule-link" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">Megnyitás</a>'}cards+='<article class="visual-schedule-card">'+h+'</article>'}return '<section class="visual-editor-node visual-schedule" style="'+style(n)+'"><div class="visual-schedule-header"><strong>Adásrend</strong></div>'+(cards||'<div class="visual-schedule-empty">'+esc(cfg.emptyText)+'</div>')+'</section>'}

 function setupPreview(){
  const params=new URL(location.href).searchParams;
  // An embedded preview is an ordinary page at the iframe's real CSS viewport.
  // It keeps the existing authenticated preview API, not a second renderer.
  if(params.get('preview')!=='1'||params.get('embed')==='1')return false;
  const body=document.body;
  const toolbar=document.createElement('div');
  toolbar.className='preview-toolbar';
  toolbar.setAttribute('role','group');
  toolbar.setAttribute('aria-label','Előnézeti képernyőméret');
  toolbar.innerHTML='<span>Előnézet</span><button type="button" data-preview-device="desktop">Asztali</button><button type="button" data-preview-device="tablet">Tablet</button><button type="button" data-preview-device="mobile">Mobil</button>';
  const shell=document.createElement('div');
  shell.className='preview-shell';
  shell.style.justifyContent='flex-start';
  shell.style.overflowX='auto';
  const frame=document.createElement('div');
  frame.className='preview-frame';
  // Fixed viewport widths must not be capped by the parent window.
  frame.style.cssText='flex:0 0 auto;max-width:none;margin:0 auto;overflow:visible';
  const iframe=document.createElement('iframe');
  iframe.className='preview-viewport';
  iframe.title='Weboldal előnézete';
  iframe.referrerPolicy='same-origin';
  iframe.style.cssText='display:block;width:100%;height:max(480px,calc(100dvh - 140px));border:0;background:#fff';
  frame.append(iframe);shell.append(frame);body.replaceChildren(toolbar,shell);
  const setDevice=device=>{
   if(!['desktop','tablet','mobile'].includes(device))return;
   currentDevice=device;frame.className='preview-frame preview-'+device;
   toolbar.querySelectorAll('[data-preview-device]').forEach(button=>{
    const active=button.dataset.previewDevice===device;
    button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
   });
   const url=new URL(location.href);
   url.searchParams.set('preview','1');url.searchParams.set('device',device);
   url.searchParams.delete('embed');
   history.replaceState(null,'',url.toString());
   // The iframe width, JS device resolution and CSS @media rules now agree.
   const embedded=new URL(url);
   embedded.searchParams.set('embed','1');
   iframe.src=embedded.toString();
  };
  toolbar.querySelectorAll('[data-preview-device]').forEach(button=>button.onclick=()=>setDevice(button.dataset.previewDevice));
  setDevice(['desktop','tablet','mobile'].includes(params.get('device'))?params.get('device'):'desktop');
  return true;
 }
 async function loadPage(){const loadToken=++pageLoadToken,failures=new Set(),nextScheduleCache=new Map();const raw=location.pathname.startsWith('/p/')?location.pathname.slice(3).split('/')[0]:'';const slug=decodeURIComponent(raw||'home').trim();const title=document.getElementById('page-title'),desc=document.getElementById('page-description'),canvas=document.getElementById('content-canvas');if(!slug){title.textContent='Hiányzó oldal';canvas.innerHTML='<div class="content-error"><h1>Hiányzó oldal</h1></div>';return}try{const preview=new URL(location.href).searchParams.get('preview')==='1';const r=await fetch('/api/public/pages?slug='+encodeURIComponent(slug)+(preview?'&preview=1':''),{cache:'no-store',credentials:'same-origin'});const payload=await r.json().catch(()=>({}));if(!r.ok||!payload.ok)throw new Error(payload?.error?.message||'not-found');if(loadToken!==pageLoadToken)return;const p=payload.data||{},c=p.content||{};document.title=(p.title||'Sanci9517')+' — Sanci9517';title.textContent=p.title||'Sanci9517';desc.textContent=p.description||'';ensureStyle();const rootId=c.rootId;const page=c;if(!rootId||!page.nodes?.[rootId])throw new Error('invalid-document');const root=page.nodes[rootId];const scheduleNodes=collectVisibleDescendants(page,currentDevice).filter(n=>n.type==='schedule');for(const node of scheduleNodes){let key;try{const cfg=scheduleConfig(node.props?.schedule);key=JSON.stringify(cfg);if(!nextScheduleCache.has(key)&&!failures.has(key)){const sr=await fetch('/api/public/schedule?'+scheduleQuery(cfg),{cache:'no-store',credentials:'same-origin'});const sp=await sr.json().catch(()=>({}));if(!sr.ok||!sp.ok||!Array.isArray(sp.data))throw new Error('schedule-load-failed');nextScheduleCache.set(key,sp.data)}}catch{if(key)failures.add(key)}if(loadToken!==pageLoadToken)return}scheduleCache=nextScheduleCache;scheduleFailures=failures;canvas.className='content-canvas visual-editor-canvas';canvas.style.cssText='';canvas.removeAttribute('data-node-id');
// Explicit root editing opts into the same responsive style as the canvas.
// The canvas keeps its technical ID; explicit root accessibility owns only these attributes.
for(const key of ['aria-label','lang']){const value=root.metadata?.a11yVersion===1?contentAttributes(root)[key]:undefined;if(value===undefined)canvas.removeAttribute(key);else canvas.setAttribute(key,value)}
if(root.metadata?.rootStyleVersion===1||root.metadata?.editorRootVersion===1){canvas.classList.add('visual-root-authored');canvas.style.cssText=style(root);canvas.dataset.nodeId=root.id;const frame=canvas.closest('.preview-frame');if(frame){frame.style.maxWidth='none';frame.style.flex='0 0 auto';frame.style.margin='0 auto';frame.parentElement.style.overflowX='auto';frame.parentElement.style.justifyContent='flex-start'}}
canvas.innerHTML=(root.children||[]).map(id=>nodeHtml(page,id)).join('')||'<div class="builder-text">Az oldalnak még nincs tartalma.</div>';let tokens=defaultTokens();try{const tokenUrl='/api/public/presentation'+(preview?'?preview=1':'');const tokenResponse=await fetch(tokenUrl,{cache:'no-store',credentials:'same-origin'});const tokenPayload=await tokenResponse.json();if(loadToken!==pageLoadToken)return;if(tokenResponse.ok&&tokenPayload?.data?.tokens)tokens=tokenPayload.data.tokens}catch{}applyTokenVariables(canvas,tokens);initContentInteractions(canvas);applyStateStyles(canvas,page,currentDevice);activateStructuredContent(canvas);activateCountdowns(canvas);activateEmbeds(canvas);activateCodeBlocks(canvas);}catch(e){if(loadToken!==pageLoadToken)return;title.textContent='Az oldal nem található';desc.textContent='';canvas.innerHTML='<div class="content-error"><h1>404</h1><p>Ez az oldal nem létezik, vagy nincs publikálva.</p></div>'}}
 if(new URL(location.href).searchParams.get('preview')!=='1')window.addEventListener('resize',()=>{const next=window.innerWidth<=700?'mobile':window.innerWidth<=900?'tablet':'desktop';if(next!==currentDevice){currentDevice=next;loadPage()}});
 ensureStyle();if(!setupPreview())loadPage();
})();
