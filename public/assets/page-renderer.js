/* Sanci9517 canonical public Page Model renderer — Editor v2 compatible. */
import { resolveNodeStyle, STYLE_MAP, needsRelativeOffsetPosition, legacyBackgroundColor, safeCssText } from "../editor-v2/core/canvas-engine.js?v=20261123-edt040-in-view-motion-v1";
import { isAllowlistedMotionStyle, motionTriggerForStyle } from "../editor-v2/core/motion-style.js?v=20261123-edt040-in-view-motion-v1";
import { RICH_TEXT_FONT_FAMILIES } from "../editor-v2/core/schema.js?v=20261101-richtext-link-target";
import { resolveRichTextLinkTarget } from "../editor-v2/core/richtext-links.js?v=20261101-richtext-link-target";
import { LAYOUT_TYPES, isManagedLayout } from "../editor-v2/core/layout-presets.js";
import {isStructuredType,renderElementContent,activateStructuredContent,safeMediaUrl} from "../editor-v2/core/element-content.js?v=20261125-d06-structured-accordion-behavior-v1";
import {legacyImageSource,legacyPlayableSource,legacyPlaybackSettings,legacyImagePresentation,legacyImageCaption,applyReducedMotionVideoPlayback} from "../editor-v2/core/legacy-media-source.js?v=20261125-forms-service-v1";
import {iconById} from "../editor-v2/core/icon-options.js";
import {normalizeDividerStyle} from "../editor-v2/core/decorative-elements.js";
import {normalizeCardContent,cardImageSrc} from "../editor-v2/core/card-content.js?v=20261118-d02-card-cta-recovery-v1";
import {renderCountdownContent,activateCountdowns} from "../editor-v2/core/countdown-content.js?v=20261116-countdown-malformed-text-fallback-v1";
import {renderSocialLinksHtml} from "../editor-v2/core/social-links.js";
import {renderEmbedHtml,activateEmbeds} from "../editor-v2/core/creator-embed.js";
import {renderCodeSnippet,activateCodeBlocks} from "../editor-v2/core/code-snippet.js";
import {isAuthoredContent,CONTENT_TYPES,contentTag,contentAttributes,authoredNodeHtml,initContentInteractions,emitAcceptedPublicFormSubmission} from "../editor-v2/core/authored-content.js?v=20261127-edt039-form-submit-trusted-v2";
import {defaultTokens,applyTokenVariables} from "../editor-v2/core/design-tokens.js";
import {isVisibleOnDevice,collectVisibleDescendants,safeNodeChildIds} from "../editor-v2/core/visibility.js?v=20261112-safe-node-children";
import {applyStateStyles,hasStateStyles} from "../editor-v2/core/state-styles.js";
import {currentBudapestMonday,shiftScheduleWeek,renderScheduleWeek} from "../editor-v2/core/schedule-week.js";
import {backgroundImageValue,legacyBackgroundCompound,MEDIA_ASSET_ID} from "../editor-v2/core/background-asset.js?v=20261117-edt040-motion-style-route";
import {decorateSanciShowcase} from "./sanci-showcase.js?v=20261116-home-live-artwork-v1";
(()=>{
 const reducedMotionQuery=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
 const prefersReducedMotion=()=>reducedMotionQuery?.matches===true;
 // Draft preview may show authenticated assets without granting public access
 // to media that has not yet passed the separate Publish gate.
 const previewMedia = new URL(location.href).searchParams.get('preview') === '1';
 const esc=v=>{const text=v===null||v===undefined||typeof v==='object'?'':String(v);return text.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))};
 const safeUrl=v=>{const raw=safeMediaUrl(v);if(!raw)return '';try{return new URL(raw,location.origin).href}catch{return''}};
 const safeRichUrl=v=>{const raw=typeof v==='string'?v.trim():'';if(!raw||/[\u0000-\u001f\u007f\\]/.test(raw)||raw.startsWith('//'))return'';if(raw.startsWith('#')&&raw.length>1)return raw;if(raw.startsWith('/')&&!raw.startsWith('//'))return raw;try{const u=new URL(raw);return !u.username&&!u.password&&['http:','https:','mailto:'].includes(u.protocol)?raw:''}catch{return''}};
 const sanci={live:['🔴','Twitch Live','Élő adás állapota'],twitch:['🎮','Twitch Player','Twitch élő közvetítés'],youtube:['▶️','YouTube','Videók és feltöltések'],tiktok:['♪','TikTok','Rövid klipek és tartalmak'],discord:['👥','Discord','Közösség és beszélgetés'],schedule:['📅','Menetrend','Következő adások és időpontok'],streamcount:['📊','Stream statisztika','Aktuális adásstatisztikák'],followers:['👤','Követők','Követőszám'],subs:['⭐','Feliratkozók','Feliratkozói információk'],vod:['🎥','VOD','Korábbi adások'],support:['🤝','Támogatás','A csatorna támogatási lehetőségei'],community:['👥','Közösség','Csatlakozz a Sanci9517 közösséghez'],gamecard:['🎮','Játékkártya','Kiemelt játék'],gamelist:['🕹️','Játéklista','Játszott és tervezett játékok']};
 function sanciBlock(n){const d=sanci[n.type]||['✦',n.name||n.type,'Sanci9517 tartalom'];const text=n.props?.text&&n.props.text!==n.name?n.props.text:'';return `<div class="visual-sanci-icon">${d[0]}</div><div class="visual-sanci-copy"><strong>${esc(text||d[1])}</strong><span>${esc(d[2])}</span></div>`}
 function style(n){
  const values=resolveNodeStyle(n,currentDevice);let out='';
  const legacyRoot=n.type!=='root'||n.metadata?.rootStyleVersion===1||n.metadata?.editorRootVersion===1;
  const legacyCompound=legacyRoot?legacyBackgroundCompound(values.background):null;
  const legacyBackground=legacyRoot&&!legacyCompound?legacyBackgroundColor(values.background):'';
  if(legacyBackground)out+=`background:${esc(legacyBackground)};`;
  else if(legacyCompound?.color)out+=`background-color:${esc(legacyCompound.color)};`;
  // Preserve legacy shorthand defaults while allowing Inspector longhands to override them.
  const border=safeCssText(values.border);
  if(border&&CSS.supports('border',border))out+=`border:${esc(border)};`;
  for(const [key,property] of Object.entries(STYLE_MAP)){
    if(['backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat'].includes(key))continue;
   if(!isAllowlistedMotionStyle(key,values[key]))continue;
   const cssProperty=property.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase());
   const value=values[key];if(value===undefined||value===null||value==='')continue;
   const text=safeCssText(value);if(!text||/[\u0000-\u001f\u007f;]/.test(text)||!CSS.supports(cssProperty,text))continue;
   out+=`${cssProperty}:${esc(text)};`;
   if(currentDevice==='mobile'){if(key==='width')out+=`--editor-mobile-width:${esc(text)};`;if(key==='minWidth')out+=`--editor-mobile-min-width:${esc(text)};`;if(key==='maxWidth')out+=`--editor-mobile-max-width:${esc(text)};`;if(key==='height')out+=`--editor-mobile-height:${esc(text)};`;if(key==='minHeight')out+=`--editor-mobile-min-height:${esc(text)};`;if(key==='position')out+=`--editor-mobile-position:${esc(needsRelativeOffsetPosition(values)?'relative':text)};`}
  }
  // Keep drag/Inspector offsets identical to the Editor canvas. left/top do
  // not move a static element in CSS, while the canvas engine promotes it to
  // relative positioning for the same Page Model value.
  if(needsRelativeOffsetPosition(values))out+='position:relative;';
   for(const [legacy,property] of [['background','background']]){
   const value=safeCssText(values[legacy]);
   if(legacyRoot&&!legacyBackground&&!legacyCompound&&value&&CSS.supports(property,value))out+=`${property}:${esc(value)};`;
  }
   const background=backgroundImageValue(values,{legacyBackground:legacyRoot,editor:previewMedia});
   const hasCanonicalImage=values.backgroundImage!==undefined&&values.backgroundImage!==null&&values.backgroundImage!=='';
   if(background!=='none'||hasCanonicalImage)out+=`background-image:${esc(background)};`;
   const hasAsset=typeof values.backgroundAssetId==='string'&&MEDIA_ASSET_ID.test(values.backgroundAssetId);
   for(const [key,property,fallback] of [['backgroundSize','background-size','cover'],['backgroundPosition','background-position','center center'],['backgroundRepeat','background-repeat','no-repeat']]){
    const value=safeCssText(values[key])||(hasAsset?fallback:'');
    if(value&&CSS.supports(property,value))out+=`${property}:${esc(value)};`;
   }
  const radius=safeCssText(values.radius),fontSize=safeCssText(values.fontSize);
  if(radius!==''&&Number.isFinite(Number(radius)))out+=`border-radius:${Math.max(0,Number(radius))}px;`;
  if(fontSize!==''&&Number.isFinite(Number(fontSize)))out+=`font-size:${Math.max(8,Number(fontSize))}px;`;
  for(const [key,property] of [['x','left'],['y','top']]){
   const value=safeCssText(values[key]);if(value&&CSS.supports(property,value)){out+=`${property}:${esc(value)};`;if(currentDevice==='mobile')out+=`--editor-mobile-${property}:${esc(value)};`;}
  }
  return out;
 }
 function richTextHtml(value){
  if(value?.type!=='richtext-document'||value.schemaVersion!==1||!Array.isArray(value.blocks))return'';
  const inlines=items=>(Array.isArray(items)?items:[]).map(item=>{
   const runText=typeof item?.text==='string'?item.text:typeof item?.text==='number'&&Number.isFinite(item.text)?String(item.text):'';
   let label=esc(runText);
   // A page style can override .visual-text white-space. Keep explicit
   // Shift+Enter / clipboard hard breaks visible without changing textContent
   // (a <br> element would lose the canonical \\n on DOM roundtrip).
   if(runText.includes('\n'))label=`<span style="white-space:pre-wrap">${label}</span>`;
   for(const [mark,tag] of [['bold','strong'],['italic','em'],['underline','u'],['strikethrough','s'],['subscript','sub'],['superscript','sup'],['code','code']])if(Array.isArray(item?.marks)&&item.marks.includes(mark))label=`<${tag}>${label}</${tag}>`;
   const safeColor=value=>typeof value==='string'&&/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)?value:'';
   const styles=[];const color=safeColor(item?.styles?.color),highlight=safeColor(item?.styles?.backgroundColor);if(color)styles.push(`color:${color}`);if(highlight)styles.push(`background-color:${highlight}`);const fontSize=typeof item?.styles?.fontSize==='string'&&/^(?:[8-9]|[1-8]\d|9[0-6])px$/.test(item.styles.fontSize)?item.styles.fontSize:'';if(fontSize)styles.push(`font-size:${fontSize}`);const fontFamily=RICH_TEXT_FONT_FAMILIES.includes(item?.styles?.fontFamily)?item.styles.fontFamily:'';if(fontFamily)styles.push(`font-family:${esc(fontFamily)}`);if(styles.length)label=`<span style="${styles.join(';')}">${label}</span>`;
   const href=typeof item?.link?.href==='string'?safeRichUrl(item.link.href):'';
   if(!href)return label;
   const requestedTarget=['_self','_blank'].includes(item.link.target)?item.link.target:'auto';
   const target=resolveRichTextLinkTarget(href,requestedTarget);
   const targetAttributes=target==='_blank'?' target="_blank" rel="noopener noreferrer"':' target="_self"';
   const title=typeof item.link.title==='string'?` title="${esc(item.link.title)}"`:'';
   return `<a href="${esc(href)}"${targetAttributes}${title}>${label}</a>`;
  }).join('');
  return value.blocks.map(block=>{
   if(!block||typeof block!=='object'||Array.isArray(block))return '';
   if(block?.type==='table'&&Array.isArray(block.rows))return `<div class="visual-richtext-table-wrap"><table class="visual-richtext-table"><tbody>${block.rows.map(row=>`<tr>${(Array.isArray(row?.cells)?row.cells:[]).map(cell=>{const safeCell=cell&&typeof cell==='object'&&!Array.isArray(cell)?cell:{};const tag=safeCell.header?'th':'td',align=['left','center','right','justify'].includes(safeCell.align)?` style="text-align:${safeCell.align}"`:'';return `<${tag}${align}>${inlines(safeCell.children)}</${tag}>`}).join('')}</tr>`).join('')}</tbody></table></div>`;
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
 function renderNodeHtml(page,id,managed,seen){const n=page.nodes?.[id];if(!n||!isVisibleOnDevice(n,currentDevice))return'';const t=esc(n.props?.text??n.name??'');const p=n.props||{};// Leaf nodes must not consume descendants from other valid branches.
  // Resolve children only for templates that actually output them.
  let childCache;const children=()=>childCache??=(safeNodeChildIds(n).map(child=>nodeHtml(page,child,managed,seen)).join(''));const st=style(n);if(n.metadata?.contentVersion===1&&isAuthoredContent(n)){const tag=contentTag(n),attrs=Object.entries({...contentAttributes(n,{pageNodes:page.nodes}),'data-page-node-id':n.id}).map(([key,value])=>' '+key+'="'+esc(value)+'"').join('');return '<'+tag+' class="visual-editor-node creator-node" data-content-type="'+esc(n.type)+'"'+attrs+' style="'+st+'">'+authoredNodeHtml(n,{childrenHtml:CONTENT_TYPES.includes(n.type)?'':children(),device:currentDevice,reducedMotion:prefersReducedMotion(),pageId:page.id})+'</'+tag+'>'}if(n.type==='schedule')return scheduleHtml(n);if(sanci[n.type])return `<section class="visual-editor-node visual-sanci-block" style="${st}">${sanciBlock(n)}${children()}</section>`;if(isStructuredType(n.type)&&p.contentModel)return `<section class="visual-editor-node visual-structured" style="${st}">${renderElementContent(n.type,p.contentModel,n.id,{ariaLabel:p.ariaLabel,singleOpen:p.singleOpen,openFirst:p.openFirst})}</section>`;if(n.type==='code'&&n.metadata?.codeSnippetVersion===1)
 return `<section class="visual-editor-node visual-code-container" style="${st}">${renderCodeSnippet(p.codeSnippet)}${children()}</section>`;
if(n.type==='embed'&&n.metadata?.embedContentVersion===1)
 return `<section class="visual-editor-node visual-creator-embed" style="${st}">${renderEmbedHtml(p.embedContent)}${children()}</section>`;
if(n.type==='social'&&n.metadata?.socialLinksVersion===1)
 return `<section class="visual-editor-node visual-social" style="${st}">${renderSocialLinksHtml(p.socialLinks)}${children()}</section>`;
if(n.type==='countdown'&&n.metadata?.countdownVersion===1)
 return `<section class="visual-editor-node visual-countdown" style="${st}">${renderCountdownContent(p.countdown)}</section>`;
if(n.type==='card'&&n.metadata?.cardContentVersion===1){
 let cfg;try{cfg=normalizeCardContent(p.cardContent)}
 catch{return `<article class="visual-editor-node visual-card" style="${st}"><p>Hiányos kártyatartalom – javítsd a szerkesztőben.</p></article>`}
 const cardSrc=cardImageSrc(cfg);const media=cardSrc?`<img class="visual-card-media" src="${esc(cardSrc)}" alt="${esc(cfg.imageAlt)}" loading="lazy">`:'';
 const description=cfg.description?`<p class="visual-card-description">${esc(cfg.description)}</p>`:'';
 const action=cfg.actionHref?`<a class="visual-card-action" href="${esc(safeRichUrl(cfg.actionHref))}"${cfg.newWindow?' target="_blank" rel="noopener noreferrer"':''}>${esc(cfg.actionLabel)}</a>`:'';
 return `<article class="visual-editor-node visual-card visual-card-${cfg.variant}" style="${st}">${media}<h3 class="visual-card-title">${esc(cfg.title)}</h3>${description}${children()}${action}</article>`;
}if(n.type==='badge')return `<span class="visual-editor-node visual-badge" style="${st}">${esc(p.text??'')}</span>`;
 if(n.type==='quote')return `<blockquote class="visual-editor-node visual-quote" style="${st}"><p>${esc(p.text??'')}</p>${p.attribution?`<footer><cite>${esc(p.attribution)}</cite></footer>`:''}</blockquote>`;
 if(n.type==='icon'){const icon=iconById(p.icon);return `<span class="visual-editor-node visual-icon" role="img" aria-label="${esc(p.label||icon.label)}" style="${st}">${icon.glyph}</span>`;}
 if(n.type==='heading'){const level=Number.isInteger(p.level)&&p.level>=1&&p.level<=6?p.level:2;return `<h${level} class="visual-editor-node visual-heading" style="${st}">${t}</h${level}>`}if(n.type==='richtext')return `<div class="visual-editor-node visual-text visual-richtext" style="${st}">${p.richText?richTextHtml(p.richText):t}</div>`;if(n.type==='text')return `<div class="visual-editor-node visual-text" style="${st}">${t}</div>`;if(['button','submit'].includes(n.type)){const u=safeRichUrl(p.url||p.href);const blank=Boolean(p.newWindow);return u?`<a class="visual-editor-node visual-button" style="${st}" href="${esc(u)}"${blank?' target="_blank" rel="noopener noreferrer"':''}>${t}</a>`:`<div class="visual-editor-node visual-button" style="${st}">${t}</div>`}if(n.type==='link'){const u=safeRichUrl(p.url||p.href);const blank=Boolean(p.newWindow);return u?`<a class="visual-editor-node visual-button" style="${st}" href="${esc(u)}"${blank?' target="_blank" rel="noopener noreferrer"':''}>${t}</a>`:`<div class="visual-editor-node visual-text" style="${st}">${t}</div>`}if(n.type==='image'){
  const u=safeUrl(legacyImageSource(p,{editor:previewMedia})),cfg=legacyImagePresentation(p),caption=legacyImageCaption(p);
  if(!u)return `<div class="visual-editor-node visual-card" style="${st}">Kép</div>`;
  const image=`<img class="visual-image" style="object-fit:${cfg.fit};object-position:${cfg.objectPosition};aspect-ratio:${cfg.ratio};" src="${esc(u)}" alt="${esc(cfg.alt)}"${cfg.decorative?' role="presentation"':''} loading="${cfg.loading}">`;
  return caption?`<figure class="visual-editor-node visual-image-figure" style="margin:0;max-width:100%;${st}"><span style="display:block;max-width:100%;">${image}</span><figcaption style="display:block;padding-top:.5em;font-size:.85em;opacity:.8;white-space:pre-wrap;overflow-wrap:anywhere;">${esc(caption)}</figcaption></figure>`:`<img class="visual-editor-node visual-image" style="object-fit:${cfg.fit};object-position:${cfg.objectPosition};aspect-ratio:${cfg.ratio};${st}" src="${esc(u)}" alt="${esc(cfg.alt)}"${cfg.decorative?' role="presentation"':''} loading="${cfg.loading}">`;
}if(n.type==='video'){
  const u=safeUrl(legacyPlayableSource(p)),cfg=legacyPlaybackSettings(p,{video:true,reducedMotion:prefersReducedMotion()}),poster=safeUrl(cfg.poster);
  const motionAttrs=p.autoplay===true&&p.muted===true?` data-reduced-motion-autoplay="true" data-reduced-motion-controls="${p.controls!==false?'true':'false'}"`:'';
  return u?`<video class="visual-editor-node visual-video" style="${st}" src="${esc(u)}"${motionAttrs}${cfg.controls?' controls':''}${cfg.loop?' loop':''}${cfg.muted?' muted':''}${cfg.autoplay?' autoplay':''}${poster?` poster="${esc(poster)}"`:''} playsinline preload="metadata"></video>`:`<div class="visual-editor-node visual-card" style="${st}">Videó még nincs beállítva</div>`;
}if(n.type==='audio'){
  const u=safeUrl(legacyPlayableSource(p)),cfg=legacyPlaybackSettings(p);
  return u?`<audio class="visual-editor-node visual-audio" style="${st}" src="${esc(u)}"${cfg.controls?' controls':''}${cfg.loop?' loop':''} preload="none"></audio>`:`<div class="visual-editor-node visual-card" style="${st}">Hang még nincs beállítva</div>`;
}if(n.type==='divider'){
 if(n.metadata?.decorativeVersion===1){
  const cfg=normalizeDividerStyle(p.decoration);
  // The decoration profile provides defaults; shared responsive Inspector
  // styles must come last so explicit border width/style/color edits survive
  // into the published renderer just as they do on the Editor canvas.
  return `<hr class="visual-editor-node visual-divider" role="separator" style="border:0;border-top:${cfg.thickness}px ${cfg.lineStyle} ${cfg.color};${st}">`;
 }
 // Preserve the versionless fallback appearance but let explicitly saved
 // shared Inspector border properties override it, as on versioned dividers.
 return `<hr class="visual-editor-node" style="border:0;border-top:1px solid rgba(255,255,255,.16);${st}">`;
}if(n.type==='spacer'){
 const hasExplicitSpacerSize=/(?:^|;)(?:height|min-height|max-height|aspect-ratio):/.test(st);
 // Keep the legacy empty-space placeholder only when the Page Model has no
 // explicit responsive size; otherwise the fallback would cap Inspector edits.
 const legacyMinimum=hasExplicitSpacerSize?'':'min-height:60px;';
 return n.metadata?.spacerVersion===1
  ?`<div class="visual-editor-node visual-layout-managed visual-spacer" aria-hidden="true" style="min-height:0;${st}"></div>`
  :`<div class="visual-editor-node" style="${legacyMinimum}${st}"></div>`;
}if(managed&&LAYOUT_TYPES.includes(n.type))return `<section class="visual-editor-node visual-layout" style="${st}">${children()}</section>`;return `<section class="visual-editor-node visual-card" style="${st}">${children()||`<strong>${t}</strong>`}</section>`}
 function nodeHtml(page,id,managed=false,seen=new Set([page?.rootId])){
  // Persisted legacy trees may contain cycles and duplicate child references.
  // Match Canvas visibility's single-visit policy without modifying the model.
  if(seen.has(id))return '';
  const node=page.nodes?.[id];if(!node||!isVisibleOnDevice(node,currentDevice))return '';
  seen.add(id);
  managed=managed||isManagedLayout(node)||isAuthoredContent(node);
  let html=renderNodeHtml(page,id,managed,seen);if(!html)return html;
  const motionTrigger=motionTriggerForStyle(resolveNodeStyle(node,currentDevice));
  if(motionTrigger)html=html.replace(/^<([a-z0-9]+)(?=[ >])/,`<$1 data-motion-trigger="${motionTrigger}"`);
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
 function ensureStyle(){if(document.getElementById('visual-editor-renderer-style'))return;const s=document.createElement('style');s.id='visual-editor-renderer-style';s.textContent='.visual-hover-bg:hover{background-color:var(--sanci-hover-bg)!important}.visual-hover-text:hover{color:var(--sanci-hover-color)!important}.visual-focus-outline:focus-visible{outline:3px solid var(--sanci-focus-outline)!important;outline-offset:3px}.visual-heading,.visual-button{white-space:pre-wrap}.visual-badge{display:inline-flex;align-items:center;padding:6px 12px;border:1px solid currentColor;border-radius:999px;font-weight:700;font-size:.85em;max-width:100%;overflow-wrap:anywhere}.visual-code-container{min-width:0;max-width:100%}.visual-code-figure{--code-bg:#0f172a;--code-text:#e2e8f0;--code-line:#64748b;margin:0;max-width:100%;min-width:0;border:1px solid #475569;border-radius:14px;overflow:hidden;background:var(--code-bg);color:var(--code-text);font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.visual-code-light{--code-bg:#f8fafc;--code-text:#0f172a;--code-line:#64748b}.visual-code-figure figcaption{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;min-height:54px;padding:8px 14px;border-bottom:1px solid #64748b70;font:600 13px/1.4 system-ui}.visual-code-title{flex:1;min-width:110px;overflow-wrap:anywhere}.visual-code-language{padding:4px 8px;border:1px solid #64748b70;border-radius:6px;font-size:12px}.visual-code-copy{min-height:44px;min-width:86px;padding:6px 12px;border:1px solid #64748b;border-radius:8px;background:#334155;color:#fff;cursor:pointer;font:600 13px system-ui}.visual-code-copy:focus-visible{outline:3px solid #60a5fa;outline-offset:2px}.visual-code-figure pre{box-sizing:border-box;margin:0;padding:14px 18px;max-width:100%;overflow:auto;tab-size:2;white-space:pre;font:400 13px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace}.visual-code-figure pre:focus-visible{outline:2px solid #60a5fa;outline-offset:-3px}.visual-code-figure code{display:block;width:max-content;min-width:100%;font:inherit}.visual-code-line{display:block;min-height:1.6em}.visual-code-numbered .visual-code-line:before{content:attr(data-line);display:inline-block;width:3em;margin-right:1.25em;padding-right:.75em;border-right:1px solid #64748b70;text-align:right;user-select:none;color:var(--code-line)}.visual-code-wrap pre{white-space:pre-wrap;overflow-wrap:anywhere}.visual-code-wrap code{width:100%;white-space:pre-wrap;overflow-wrap:anywhere}.visual-code-wrap .visual-code-line{white-space:pre-wrap;overflow-wrap:anywhere}.code-preview .visual-code-copy{pointer-events:none}.visual-creator-embed{max-width:100%;min-width:0}.visual-embed-player{position:relative;width:100%;max-width:100%;aspect-ratio:16/9;min-height:200px;overflow:hidden;border-radius:14px;border:1px solid #64748b;background:linear-gradient(135deg,#172139,#080c15);color:#fff}.visual-embed-classic{aspect-ratio:4/3}.visual-embed-square{aspect-ratio:1}.visual-embed-portrait{aspect-ratio:9/16;max-width:480px}.visual-embed-load{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;position:absolute;inset:0;width:100%;height:100%;border:0;padding:20px;background:transparent;color:#f8fafc;cursor:pointer;text-align:center;font:700 clamp(14px,2vw,20px)/1.4 system-ui}.visual-embed-load>span:first-child{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:#dc2626;color:#fff;font-size:28px}.visual-embed-load small{display:block;max-width:460px;margin:8px auto 0;font-size:12px;font-weight:400;line-height:1.4;color:#cbd5e1}.visual-embed-load:focus-visible,.visual-embed-external:focus-visible{outline:3px solid #60a5fa;outline-offset:-4px}.visual-embed-load:hover{background:rgba(255,255,255,.06)}.visual-embed-frame{display:block;width:100%;height:100%;min-height:200px;border:0}.visual-embed-empty{min-height:180px;padding:28px;border:1px dashed #64748b;border-radius:14px;background:rgba(71,85,105,.13);color:inherit;display:grid;place-items:center;text-align:center;overflow-wrap:anywhere}.visual-embed-external{display:flex;align-items:center;justify-content:center;width:100%;height:100%;padding:24px;color:#fff;text-align:center;text-decoration:underline}.embed-preview .visual-embed-player{pointer-events:none}@media(prefers-reduced-motion:reduce){.visual-embed-load{transition:none}}.visual-social{min-width:0;max-width:100%}.visual-social-nav{width:100%;max-width:100%}.visual-social-list{list-style:none;display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;margin:0;padding:0}.visual-social-item{min-width:0}.visual-social-link{display:flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:10px 16px;max-width:100%;border-radius:999px;border:1px solid rgba(148,163,184,.55);background:rgba(30,41,59,.85);color:#f8fafc;text-decoration:none;font:600 14px/1.45 system-ui;overflow-wrap:anywhere;transition:background-color .15s ease,transform .15s ease}.visual-social-link:hover{background:#334155;transform:translateY(-1px)}.visual-social-link:focus-visible{outline:3px solid #60a5fa;outline-offset:3px}.visual-social-icon{display:inline-flex;align-items:center;justify-content:center;flex:none;min-width:20px;font-size:1.2em}.visual-social-text{min-width:0}.visual-social-cards .visual-social-link{border-radius:14px;padding:18px 22px;box-shadow:0 3px 14px rgba(0,0,0,.15)}.visual-social-minimal .visual-social-link{background:transparent;border-color:transparent;border-radius:6px;padding:8px 10px;text-decoration:underline;text-underline-offset:3px}.visual-social-stack .visual-social-list{flex-direction:column}.visual-social-stack .visual-social-item{width:100%}.visual-social-grid .visual-social-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr))}.visual-social-grid .visual-social-link{height:100%}.visual-social-missing{opacity:.68;cursor:not-allowed;flex-wrap:wrap}.visual-social-missing small{font:400 11px system-ui;color:#cbd5e1}.visual-social-empty{padding:14px;color:#cbd5e1}.social-preview .visual-social-nav{pointer-events:none}@media(prefers-reduced-motion:reduce){.visual-social-link{transition:none}.visual-social-link:hover{transform:none}}.visual-countdown{padding:18px 20px;border:1px solid #64748b;border-radius:14px;background:rgba(15,23,42,.75);color:#f8fafc;max-width:100%;overflow-wrap:anywhere}.visual-countdown-content{display:grid;gap:10px;text-align:center}.visual-countdown-heading{font-size:clamp(1rem,2vw,1.5rem)}.visual-countdown-clock{display:block;font-variant-numeric:tabular-nums;font-size:clamp(1.1rem,3vw,1.8rem);font-weight:800;line-height:1.35;white-space:normal;overflow-wrap:anywhere}.visual-card-outline{background:transparent;border:2px solid currentColor}.visual-card-glass{background:rgba(255,255,255,.10);backdrop-filter:blur(12px)}.visual-card-media{display:block;width:100%;max-height:380px;object-fit:cover;border-radius:12px;margin:0 0 12px}.visual-card-title{margin:0 0 8px;font-size:1.3em;line-height:1.3}.visual-card-description{margin:0 0 12px;white-space:pre-wrap;overflow-wrap:anywhere}.visual-card-action{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin-top:12px;padding:8px 16px;border-radius:8px;background:#fff;color:#101828;font-weight:700;text-decoration:none}.visual-card-action:focus-visible{outline:3px solid #60a5fa;outline-offset:2px}.visual-quote{border-left:4px solid currentColor;padding:8px 18px;margin:0;font-style:italic}.visual-quote p{margin:0 0 8px}.visual-quote cite{font-size:.85em;font-weight:600}.visual-icon{display:inline-flex;align-items:center;justify-content:center;font-size:1.6em;line-height:1;min-width:1em;min-height:1em}.visual-structured{min-width:0}.visual-structured-list{padding-left:1.5em}.visual-carousel-slide[hidden]{display:none!important}.visual-carousel-slide{padding:20px;border:1px solid #64748b;border-radius:12px;background:rgba(127,127,127,.08)}.visual-carousel-slide img{display:block;max-width:100%;max-height:400px;object-fit:contain;margin:auto}.visual-carousel-slide h3{margin:12px 0 6px}.visual-carousel-slide p{white-space:pre-wrap}.visual-carousel-controls{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:12px}.visual-carousel-controls button{min-width:44px;min-height:44px;border:1px solid #64748b;border-radius:8px;background:#334155;color:#fff;cursor:pointer}.visual-structured-table-scroll{max-width:100%;overflow:auto}.visual-structured-table{border-collapse:collapse;width:100%}.visual-structured-table th,.visual-structured-table td{border:1px solid currentColor;padding:8px 12px;text-align:left}.visual-structured-accordion details{padding:8px 0;border-bottom:1px solid rgba(127,127,127,.3)}.visual-structured-accordion summary{cursor:pointer;padding:8px}.visual-structured-tabs [role=tablist]{display:flex;gap:8px;flex-wrap:wrap}.visual-structured-tabs [role=tab]{cursor:pointer;border:1px solid #818a9a;border-radius:8px;padding:9px 14px;background:transparent;color:inherit}.visual-structured-tabs [role=tab][aria-selected=true]{background:#334155;color:#fff}.visual-structured-panel{padding:14px 6px;white-space:pre-wrap}.visual-structured-tabs [hidden]{display:none!important}.visual-structured-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}.visual-gallery-thumb{border:1px solid #94a3b8;border-radius:8px;overflow:hidden;background:transparent;color:inherit;cursor:zoom-in;padding:0}.visual-gallery-thumb img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}.visual-gallery-thumb span{display:block;padding:8px}.visual-gallery-dialog{max-width:95vw;max-height:95vh;border:none;border-radius:12px;padding:24px;background:#121a2b;color:#fff}.visual-gallery-dialog::backdrop{background:rgba(0,0,0,.78)}.visual-gallery-dialog img{display:block;max-width:85vw;max-height:75vh;object-fit:contain}.visual-gallery-close{position:absolute;right:10px;top:10px;font-size:25px;cursor:pointer}.visual-gallery-prev,.visual-gallery-next{min-width:44px;min-height:44px;padding:8px 12px;margin:8px;border:1px solid #64748b;border-radius:8px;background:#1f2937;color:#fff;cursor:pointer}.visual-gallery-empty{padding:30px;background:#38465e;color:#fff}.visual-video,.visual-audio{display:block;width:100%}.visual-video{max-height:80vh}.visual-editor-canvas{display:flex;flex-direction:column;gap:18px;min-height:400px}.visual-editor-node{box-sizing:border-box}.visual-layout-managed{position:relative;min-width:0}.visual-layout{margin:0;padding:0;border:0}.visual-text{white-space:pre-wrap}.visual-text table{border-collapse:collapse;max-width:100%;font:inherit;color:inherit}.visual-text th,.visual-text td{padding:8px 10px;border:1px solid currentColor;text-align:left;vertical-align:top}.visual-richtext-table-wrap{max-width:100%;overflow:auto}.visual-richtext-table{min-width:320px}.visual-richtext-table th{font-weight:700;background:rgba(127,127,127,.12)}.visual-heading{color:#fff;line-height:1.05;margin:0}.visual-button{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:10px;background:#f5f5f7;color:#101016;text-decoration:none;font-weight:850}.visual-image{display:block;width:100%;max-height:620px;object-fit:cover;border-radius:16px}.visual-card{padding:24px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:linear-gradient(135deg,rgba(14,22,38,.92),rgba(8,14,25,.88))}.visual-sanci-block{display:flex;align-items:center;gap:16px;padding:22px;border:1px solid rgba(225,6,0,.28);border-radius:18px;background:linear-gradient(145deg,rgba(34,18,24,.94),rgba(10,10,14,.96));box-shadow:0 18px 48px rgba(0,0,0,.24)}.visual-sanci-icon{width:52px;height:52px;display:grid;place-items:center;flex:none;border-radius:14px;background:linear-gradient(145deg,rgba(225,6,0,.22),rgba(109,18,33,.2));border:1px solid rgba(225,6,0,.28);font-size:25px}.visual-sanci-copy{display:flex;flex-direction:column;gap:5px}.visual-sanci-copy strong{font-size:18px;color:#fff}.visual-sanci-copy span{font-size:13px;color:#aeb8c8}.visual-schedule{padding:22px;border:1px solid rgba(225,6,0,.28);border-radius:18px;background:linear-gradient(145deg,rgba(34,18,24,.94),rgba(10,10,14,.96));box-shadow:0 18px 48px rgba(0,0,0,.24)}.visual-schedule-header{font-size:18px;color:#fff;margin-bottom:12px}.visual-schedule-card{padding:16px;margin-top:10px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(0,0,0,.12)}.visual-schedule-title{display:block;color:#fff;font-size:16px}.visual-schedule-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:7px;color:#aeb8c8;font-size:13px}.visual-schedule-status{display:inline-block;margin-top:8px;color:#dce2ee;font-size:12px}.visual-schedule-notes{margin:8px 0 0;color:#c6cedb;font-size:13px;white-space:pre-wrap}.visual-schedule-link{display:inline-flex;margin-top:10px;color:#fff;text-decoration:none;font-size:12px}.visual-schedule-empty{color:#aeb8c8;font-size:14px;padding:12px 0}.visual-schedule-error{margin:10px 0 0;padding:12px 14px;border:1px solid #987451;border-radius:10px;background:#392a20;color:#fff0d8;font-size:14px;line-height:1.5}.creator-form{display:grid;gap:16px;max-width:720px;padding:clamp(20px,4vw,36px);border:1px solid rgba(148,163,184,.28);border-radius:18px;background:rgba(15,23,42,.72);color:inherit}.creator-form h2{margin:0 0 4px}.creator-form-field{display:grid;gap:7px;min-width:0}.creator-form-field>span{font-weight:700}.creator-form-radio-group{min-width:0;margin:0;padding:12px 14px;border:1px solid #64748b;border-radius:10px}.creator-form-radio-group legend{padding:0 6px;font-weight:700}.creator-form-radio-option{display:flex;align-items:center;gap:10px;min-height:44px}.creator-form-radio-option input{width:20px;height:20px;flex:none}.creator-form-field input,.creator-form-field textarea,.creator-form-field select{box-sizing:border-box;width:100%;min-height:44px;padding:10px 12px;border:1px solid #64748b;border-radius:9px;background:#0b1220;color:inherit;font:inherit}.creator-form-field input[type=range]{padding:0;accent-color:#e14d61}.creator-form-slider-value{font-variant-numeric:tabular-nums;font-weight:700}.creator-form-field textarea{min-height:120px;resize:vertical}.creator-form-field small{color:#aeb8c8}.creator-form-field input:focus-visible,.creator-form-field textarea:focus-visible,.creator-form-field select:focus-visible,.creator-form-checkbox input:focus-visible,.creator-form-consent input:focus-visible,.creator-form button:focus-visible{outline:3px solid #60a5fa;outline-offset:2px}.creator-form-checkbox,.creator-form-consent{display:flex;align-items:flex-start;gap:10px;line-height:1.5}.creator-form-consent-wrap{display:grid;gap:6px}.creator-form-consent-wrap>a{justify-self:start;margin-left:30px;color:#ffaaa6}.creator-form-checkbox input,.creator-form-consent input{flex:none;min-width:20px;min-height:20px;margin:1px 0 0}.creator-form button{justify-self:start;min-width:120px;min-height:46px;padding:10px 18px;border:1px solid rgba(225,6,0,.45);border-radius:10px;background:linear-gradient(135deg,#e10600,#6d1221);color:#fff;font:700 14px system-ui;cursor:pointer}.creator-form button:disabled{opacity:.65;cursor:wait}.creator-form-status{min-height:1.5em;margin:0}.creator-form-honeypot{position:absolute!important;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.preview-toolbar{position:sticky;top:0;z-index:10000;display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;background:#090d16;color:#dce2ee;border-bottom:1px solid rgba(255,255,255,.12);font:600 13px system-ui}.preview-toolbar button{border:1px solid rgba(255,255,255,.15);background:#111827;color:#dce2ee;border-radius:8px;padding:8px 12px;cursor:pointer}.preview-toolbar button.active{background:#f5f5f7;color:#101016}.preview-shell{display:flex;justify-content:center;min-height:calc(100vh - 53px);padding:24px;background:#05070c}.preview-frame{width:1440px;max-width:100%;min-height:calc(100vh - 101px);background:#0b1020;box-shadow:0 12px 50px rgba(0,0,0,.35);overflow:hidden}.preview-frame.preview-mobile{width:390px}.preview-frame.preview-tablet{width:768px}.preview-frame.preview-desktop{width:1440px}.preview-frame>.site-header,.preview-frame>.page,.preview-frame>.footer{width:100%;box-sizing:border-box}.preview-frame .wrap{box-sizing:border-box}@media(max-width:700px){.builder-section,.builder-card{padding:20px}.builder-columns{grid-template-columns:1fr!important}.content-canvas.visual-editor-canvas:not(.visual-root-authored){display:block!important;min-height:0!important}.content-canvas.visual-editor-canvas>.visual-editor-node:not(.visual-layout-managed){position:var(--editor-mobile-position,relative)!important;left:var(--editor-mobile-left,0)!important;top:var(--editor-mobile-top,auto)!important;width:var(--editor-mobile-width,100%)!important;min-width:var(--editor-mobile-min-width,0)!important;max-width:var(--editor-mobile-max-width,100%)!important;height:var(--editor-mobile-height,auto)!important;min-height:var(--editor-mobile-min-height,80px)!important;margin:0 0 16px}.content-canvas.visual-editor-canvas>.visual-editor-node:not(.visual-layout-managed):last-child{margin-bottom:0}.content-canvas.visual-editor-canvas .visual-editor-node>.visual-editor-node:not(.visual-layout-managed){position:var(--editor-mobile-position,relative)!important;left:var(--editor-mobile-left,0)!important;top:var(--editor-mobile-top,auto)!important;width:var(--editor-mobile-width,100%)!important;max-width:var(--editor-mobile-max-width,100%)!important;height:var(--editor-mobile-height,auto)!important;margin:0 0 12px}}';s.textContent+='.creator-form-error-summary{margin:0 0 1rem;padding:1rem 1.1rem;border:2px solid #b42318;border-radius:12px;background:#fff4f2;color:#5b1711}.creator-form-error-summary h3{margin:0 0 .65rem;font-size:1rem}.creator-form-error-summary ul{margin:0;padding-left:1.35rem}.creator-form-error-summary li+li{margin-top:.4rem}.creator-form-error-summary a{color:inherit;text-decoration:underline;text-underline-offset:2px}.creator-form-error-summary a:focus-visible{outline:3px solid #b42318;outline-offset:3px}.creator-form-field-error{display:block;margin-top:.35rem;color:#a32118;font-weight:650}';document.head.appendChild(s)}
 let currentDevice=window.innerWidth<=700?'mobile':window.innerWidth<=900?'tablet':'desktop';
 let scheduleCache=new Map();
 let scheduleFailures=new Set();
 let scheduleWeekByNode=new Map();
 let scheduleActiveNodes=new Map();
 const scheduleWeekPending=new Set();
 let pageLoadToken=0;
 const scheduleDefaults={version:1,mode:'upcoming',limit:10,statuses:['scheduled','live'],platforms:[],order:'asc',showTitle:true,showPlatform:true,showTime:true,showEndTime:false,showStatus:false,showNotes:false,showArtwork:true,showLink:true,emptyText:'Nincs tervezett stream.'};
 function scheduleConfig(value){const v=value&&typeof value==='object'?value:{};const cfg={...scheduleDefaults,...v};if(cfg.version!==1||!['upcoming','all','next','week'].includes(cfg.mode)||!Number.isInteger(cfg.limit)||cfg.limit<1||cfg.limit>50||!Array.isArray(cfg.statuses)||!cfg.statuses.length||cfg.statuses.some(x=>!['scheduled','live','completed','cancelled'].includes(x))||!Array.isArray(cfg.platforms)||cfg.platforms.length>20||cfg.platforms.some(x=>typeof x!=='string'||!x.trim()||x.trim().length>40)||!['asc','desc'].includes(cfg.order))throw new Error('INVALID_SCHEDULE_CONFIG');for(const k of ['showTitle','showPlatform','showTime','showEndTime','showStatus','showNotes','showLink'])if(typeof cfg[k]!=='boolean')throw new Error('INVALID_SCHEDULE_CONFIG');if(typeof cfg.emptyText!=='string'||!cfg.emptyText.trim()||cfg.emptyText.trim().length>200)throw new Error('INVALID_SCHEDULE_CONFIG');return cfg}
 function scheduleKey(cfg,weekStart){return JSON.stringify(cfg)+(cfg.mode==='week'?'|'+weekStart:'')}
 function scheduleQuery(cfg,weekStart){const p=new URLSearchParams({mode:cfg.mode,limit:String(cfg.limit),statuses:cfg.statuses.join(','),order:cfg.order});if(cfg.platforms.length)p.set('platforms',cfg.platforms.join(','));if(cfg.mode==='week')p.set('weekStart',weekStart||currentBudapestMonday());return p.toString()}
 function scheduleDate(v){const d=new Date(v);return Number.isNaN(d.getTime())?String(v||''):new Intl.DateTimeFormat('hu-HU',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(d)}
 function unavailableScheduleHtml(n){return '<section class="visual-editor-node visual-schedule" style="'+style(n)+'"><div class="visual-schedule-header"><strong>Adásrend</strong></div><p class="visual-schedule-error" role="status">Az adásrend átmenetileg nem tölthető be. Kérjük, próbáld meg később.</p></section>'}
 function scheduleHtml(n){let cfg;try{cfg=scheduleConfig(n.props?.schedule)}catch{return unavailableScheduleHtml(n)}const weekStart=cfg.mode==='week'?(scheduleWeekByNode.get(n.id)||currentBudapestMonday()):null;const key=scheduleKey(cfg,weekStart);if(cfg.mode==='week'){const failed=scheduleFailures.has(key);const items=failed?[]:(scheduleCache.get(key)||[]);const notice=failed?'<p class="visual-schedule-error" role="status">Az adásrend most nem tölthető be. A hetet újra kiválasztva ismét próbálkozhatsz.</p>':'';return '<section class="visual-editor-node visual-schedule" data-schedule-week-node="'+esc(n.id)+'" style="'+style(n)+'">'+notice+renderScheduleWeek(items,weekStart,cfg)+'</section>'}if(scheduleFailures.has(key))return unavailableScheduleHtml(n);const items=scheduleCache.get(key)||[];let cards='';for(const item of items){let h='';if(cfg.showTitle)h+='<strong class="visual-schedule-title">'+esc(item.title)+'</strong>';let meta='';if(cfg.showPlatform)meta+='<span>'+esc(item.platform)+'</span>';if(cfg.showTime)meta+='<span>'+esc(scheduleDate(item.startsAt))+'</span>';if(cfg.showEndTime&&item.endsAt)meta+='<span>'+esc(scheduleDate(item.endsAt))+'</span>';if(meta)h+='<div class="visual-schedule-meta">'+meta+'</div>';if(cfg.showStatus)h+='<span class="visual-schedule-status">'+esc(item.status)+'</span>';if(cfg.showNotes&&item.notes)h+='<p class="visual-schedule-notes">'+esc(item.notes)+'</p>';if(cfg.showLink&&item.url){const u=safeUrl(item.url);if(u)h+='<a class="visual-schedule-link" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">Megnyitás</a>'}cards+='<article class="visual-schedule-card">'+h+'</article>'}return '<section class="visual-editor-node visual-schedule" style="'+style(n)+'"><div class="visual-schedule-header"><strong>Adásrend</strong></div>'+(cards||'<div class="visual-schedule-empty">'+esc(cfg.emptyText)+'</div>')+'</section>'}


 // Week navigation updates only the Schedule node, not the Page Model or the whole document.
 // The user's current selection survives viewport redraws but is not persisted as a draft.
 const scheduleCanvas=document.getElementById('content-canvas');
 scheduleCanvas?.addEventListener('click',async event=>{
  const target=event.target;
  if(!(target instanceof Element))return;
  const button=target.closest('button[data-schedule-week-action]');
  const host=button?.closest('section[data-schedule-week-node]');
  if(!button||!host)return;
  const nodeId=host.getAttribute('data-schedule-week-node'),node=scheduleActiveNodes.get(nodeId);
  if(!node||scheduleWeekPending.has(nodeId))return;
  let cfg;try{cfg=scheduleConfig(node.props?.schedule)}catch{return}
  if(cfg.mode!=='week')return;
  const previous=scheduleWeekByNode.get(nodeId)||currentBudapestMonday();
  const action=button.dataset.scheduleWeekAction;
  const selected=action==='today'?currentBudapestMonday():action==='previous'?shiftScheduleWeek(previous,-1):action==='next'?shiftScheduleWeek(previous,1):null;
  if(!selected)return;
  const key=scheduleKey(cfg,selected),token=pageLoadToken;
  scheduleWeekPending.add(nodeId);
  host.setAttribute('aria-busy','true');
  host.querySelectorAll('button[data-schedule-week-action]').forEach(b=>{b.disabled=true});
  try{
   if(!scheduleCache.has(key)){
    const response=await fetch('/api/public/schedule?'+scheduleQuery(cfg,selected),{cache:'no-store',credentials:'same-origin'});
    const result=await response.json().catch(()=>({}));
    if(!response.ok||!result.ok||!Array.isArray(result.data))throw new Error('schedule-fetch-failed');
    scheduleCache.set(key,result.data);
   }
   scheduleFailures.delete(key);
  }catch{scheduleFailures.add(key)}
  finally{
   scheduleWeekPending.delete(nodeId);
   if(token===pageLoadToken&&host.isConnected){
    scheduleWeekByNode.set(nodeId,selected);
    const failed=scheduleFailures.has(key);
    host.innerHTML=(failed?'<p class="visual-schedule-error" role="status">A heti adások nem tölthetők be. Próbáld újra.</p>':'')+renderScheduleWeek(failed?[]:(scheduleCache.get(key)||[]),selected,cfg);
    host.removeAttribute('aria-busy');
    host.querySelector('button[data-schedule-week-action="'+action+'"]')?.focus();
   }
  }
 });

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
 async function activatePublicForms(host,{preview=false}={}){
 if(preview){for(const mount of host.querySelectorAll("[data-public-form-id][data-public-page-id]")){const note=document.createElement("p");note.setAttribute("role","note");note.textContent="Az űrlap beküldése előnézetben ki van kapcsolva.";mount.replaceChildren(note)}return}

 for(const mount of host.querySelectorAll('[data-public-form-id][data-public-page-id]')){
  if(mount.dataset.formInitialized==='1')continue;
  mount.dataset.formInitialized='1';
  const formId=mount.dataset.publicFormId,pageId=mount.dataset.publicPageId;
  const showError=()=>{mount.replaceChildren();const message=document.createElement('p');message.setAttribute('role','status');message.textContent='Az űrlap most nem érhető el. Próbáld újra később.';mount.append(message)};
  if(!/^[0-9a-f-]{36}$/i.test(formId||'')||!/^[0-9a-f-]{36}$/i.test(pageId||'')){showError();continue}
  try{
   const response=await fetch('/api/public/forms?formId='+encodeURIComponent(formId)+'&pageId='+encodeURIComponent(pageId),{cache:'no-store',credentials:'same-origin'});
   const payload=await response.json().catch(()=>null);
   if(!response.ok||payload?.ok!==true||!Array.isArray(payload.data?.definition?.fields))throw new Error('form-load-failed');
   const data=payload.data,definition=data.definition,form=document.createElement('form');form.className='creator-form';form.noValidate=true;form.dataset.publicFormRuntime='1';
   const heading=document.createElement('h2');heading.textContent=definition.name;form.append(heading);
   const errorSummary=document.createElement('div');errorSummary.className='creator-form-error-summary';errorSummary.setAttribute('role','alert');errorSummary.setAttribute('aria-live','assertive');errorSummary.setAttribute('aria-atomic','true');errorSummary.tabIndex=-1;errorSummary.hidden=true;
   const errorHeading=document.createElement('h3');errorHeading.textContent='Ellenőrizd az űrlap hibáit';errorSummary.append(errorHeading);
   const errorList=document.createElement('ul');errorSummary.append(errorList);form.append(errorSummary);
   const fieldControls=new Map();
   const fieldWrappers=new Map();
   for(const [fieldIndex,field] of definition.fields.entries()){
    const label=document.createElement(field.type==='checkbox'||field.type==='radio'?'div':'label');label.className='creator-form-field';
     const fieldDomId='creator-form-field-'+fieldIndex;label.id=fieldDomId;fieldWrappers.set(field.id,label);
    const caption=document.createElement(field.type==='radio'?'legend':'span');caption.textContent=field.label;label.append(caption);if(field.type==='radio'){label.className='creator-form-radio-group';label.setAttribute('role','group')}
    let control,sliderOutput=null;
    if(field.type==='textarea')control=document.createElement('textarea');
    else if(field.type==='radio'){
     for(const [optionIndex,value] of (field.options||[]).entries()){const optionLabel=document.createElement('label');optionLabel.className='creator-form-radio-option';const option=document.createElement('input');option.type='radio';option.id=fieldDomId+'-'+optionIndex;option.name=field.id;option.value=value;option.required=field.required===true;const optionText=document.createElement('span');optionText.textContent=value;optionLabel.append(option,optionText);label.append(optionLabel)}
     if(field.helpText){const help=document.createElement('small');help.id=fieldDomId+'-help';help.textContent=field.helpText;label.append(help);for(const input of label.querySelectorAll('input[type="radio"]'))input.setAttribute('aria-describedby',help.id)}
     control=label;
    }else if(field.type==='select'){
     control=document.createElement('select');const empty=document.createElement('option');empty.value='';empty.textContent='Válassz…';control.append(empty);
     for(const value of field.options||[]){const option=document.createElement('option');option.value=value;option.textContent=value;control.append(option)}
    }else{control=document.createElement('input');control.type=field.type==='email'?'email':field.type==='tel'?'tel':field.type==='url'?'url':field.type==='number'?'number':field.type==='date'?'date':field.type==='checkbox'?'checkbox':field.type==='slider'?'range':'text';if(field.type==='number')control.step='any';if(field.type==='slider'){control.min=String(field.min);control.max=String(field.max);control.step=String(field.step);control.value=String((field.min+field.max)/2);sliderOutput=document.createElement('output');sliderOutput.className='creator-form-slider-value';sliderOutput.htmlFor='creator-form-field-'+fieldIndex;sliderOutput.setAttribute('aria-label',field.label+' aktuális értéke');sliderOutput.setAttribute('aria-live','polite');sliderOutput.textContent=control.value;control.addEventListener('input',()=>{sliderOutput.textContent=control.value})}}
    control.name=field.id;control.required=field.required===true;control.setAttribute('aria-label',field.label);
    if(field.type!=='radio')control.id=fieldDomId;
    if(field.type==='email')control.autocomplete='email';else if(field.type==='tel')control.autocomplete='tel';else if(field.type==='url')control.autocomplete='url';
    if(field.type==='checkbox'){
     const checkboxLabel=document.createElement('label');checkboxLabel.className='creator-form-checkbox';
     checkboxLabel.append(control,document.createTextNode(' '+field.label));label.replaceChildren(checkboxLabel);
    }else if(field.type!=='radio'){
     if(field.type==='email')control.maxLength=Math.min(Number.isInteger(field.maxLength)?field.maxLength:254,254);
     else if(['text','tel','url','textarea'].includes(field.type)&&Number.isInteger(field.maxLength))control.maxLength=field.maxLength;
     if(field.helpText){const help=document.createElement('small');help.id=fieldDomId+'-help';help.textContent=field.helpText;label.append(control,help);control.setAttribute('aria-describedby',help.id)}else label.append(control);
     if(sliderOutput)label.append(sliderOutput);
    }
    fieldControls.set(field.id,control);form.append(label);
   }
   const consentWrap=document.createElement('div');consentWrap.className='creator-form-consent-wrap';consentWrap.id='creator-form-consent';
   const consentLabel=document.createElement('label');consentLabel.className='creator-form-consent';
   const consent=document.createElement('input');consent.type='checkbox';consent.required=true;consent.name='consentAccepted';
   const consentCopy=document.createElement('span');consentCopy.textContent=definition.consent.text;
   consentLabel.append(consent,consentCopy);consentWrap.append(consentLabel);
   if(definition.consent.privacyUrl){const privacy=document.createElement('a');privacy.href=definition.consent.privacyUrl;privacy.textContent='Adatkezelési tájékoztató';privacy.rel='noopener noreferrer';consentWrap.append(privacy)}
   form.append(consentWrap);
   const trapWrap=document.createElement('div');trapWrap.className='creator-form-honeypot';trapWrap.setAttribute('aria-hidden','true');
   const trap=document.createElement('input');trap.type='text';trap.name='website';trap.tabIndex=-1;trap.autocomplete='off';trapWrap.append(trap);form.append(trapWrap);
   const status=document.createElement('p');status.className='creator-form-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
   const submit=document.createElement('button');submit.type='submit';submit.textContent='Küldés';form.append(submit,status);mount.replaceChildren(form);
   // Keep one opaque request key for a retry after an ambiguous network
   // failure. A changed payload or accepted submission starts a new attempt.
   let pendingSubmission=null;
   const validationMessage=(control,label)=>{
    const validity=control.validity;
    if(validity.valueMissing)return label==='Adatkezelési hozzájárulás'?'A beküldéshez el kell fogadnod az adatkezelési feltételeket.':`A(z) „${label}” mező kitöltése kötelező.`;
    if(validity.typeMismatch&&control.type==='email')return `A(z) „${label}” mezőben adj meg érvényes e-mail címet.`;
    if(validity.typeMismatch&&control.type==='url')return `A(z) „${label}” mezőben adj meg érvényes webcímet.`;
    if(validity.badInput)return `A(z) „${label}” mezőben ellenőrizd a megadott értéket.`;
    if(validity.tooLong)return `A(z) „${label}” mező legfeljebb ${control.maxLength} karakter lehet.`;
    return `A(z) „${label}” mező értéke nem megfelelő.`;
   };
    const conditionValue=(field)=>{
     const source=definition.fields.find(candidate=>candidate.id===field.condition?.fieldId);
     if(!source)return undefined;
     const control=fieldControls.get(source.id);
     if(source.type==='checkbox')return control?.checked===true;
     if(source.type==='radio')return control?.querySelector('input[type="radio"]:checked')?.value||'';
     return control?.value||'';
    };
    const clearFieldError=(wrapper,controls)=>{
     wrapper.querySelector('.creator-form-field-error')?.remove();
     for(const control of controls){control.removeAttribute('aria-invalid');const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==wrapper.id+'-error');if(ids.length)control.setAttribute('aria-describedby',ids.join(' '));else control.removeAttribute('aria-describedby')}
    };
    const updateConditionalFields=()=>{
     for(const field of definition.fields){
      if(!field.condition)continue;
      const wrapper=fieldWrappers.get(field.id),control=fieldControls.get(field.id);
      if(!wrapper||!control)continue;
      const visible=conditionValue(field)===field.condition.equals;
      wrapper.hidden=!visible;
      const controls=control.classList?.contains('creator-form-radio-group')?[...control.querySelectorAll('input[type="radio"]')]:[control];
      for(const item of controls){
       item.disabled=!visible;
       if(!visible){if(item.type==='checkbox'||item.type==='radio')item.checked=false;else item.value='';}
      }
      if(!visible)clearFieldError(wrapper,controls);
     }
    };
    updateConditionalFields();
    const updateValidationErrors=({focus=false}={})=>{
    const errors=[];
     const clearError=clearFieldError;
    const addError=(id,label,wrapper,controls,target)=>{
     clearError(wrapper,controls);
     const error=document.createElement('small');error.className='creator-form-field-error';error.id=wrapper.id+'-error';error.setAttribute('aria-live','polite');error.textContent=validationMessage(target,label);wrapper.append(error);
     for(const control of controls){control.setAttribute('aria-invalid','true');const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);if(!ids.includes(error.id))ids.push(error.id);control.setAttribute('aria-describedby',ids.join(' '))}
     errors.push({id,label,message:error.textContent,wrapper,target});
    };
    for(const [fieldId,wrapper] of fieldWrappers){
     const value=fieldControls.get(fieldId),controls=value?.classList?.contains('creator-form-radio-group')?[...value.querySelectorAll('input[type="radio"]')]:[value];
      if(wrapper.hidden){clearError(wrapper,controls);continue;}
     const invalid=controls.find(control=>control&&!control.validity.valid);
     if(invalid)addError(fieldId,definition.fields.find(field=>field.id===fieldId)?.label||fieldId,wrapper,controls,invalid);else clearError(wrapper,controls);
    }
    if(!consent.valid)addError('consentAccepted','Adatkezelési hozzájárulás',consentWrap,[consent],consent);else clearError(consentWrap,[consent]);
    errorList.replaceChildren();
    for(const item of errors){const row=document.createElement('li'),link=document.createElement('a');link.href='#'+item.wrapper.id;link.textContent=`${item.label}: ${item.message}`;link.addEventListener('click',event=>{event.preventDefault();item.target.focus()});row.append(link);errorList.append(row)}
    errorSummary.hidden=errors.length===0;
    if(focus&&errors.length)errorSummary.focus();
    return errors.length===0;
   };
    form.addEventListener('input',()=>{updateConditionalFields();if(!errorSummary.hidden)updateValidationErrors()});
    form.addEventListener('change',()=>{updateConditionalFields();if(!errorSummary.hidden)updateValidationErrors()});
   form.addEventListener('submit',async event=>{
     event.preventDefault();updateConditionalFields();if(!form.checkValidity()){updateValidationErrors({focus:true});return}updateValidationErrors();submit.disabled=true;status.textContent='Küldés…';
     const values=Object.fromEntries([...fieldControls].filter(([id])=>!fieldWrappers.get(id)?.hidden).map(([id,control])=>[id,control.classList?.contains('creator-form-radio-group')?(control.querySelector('input:checked')?.value||''):control.type==='checkbox'?control.checked:control.value]));
     const fingerprint=JSON.stringify({values,consentAccepted:consent.checked});
     if(!pendingSubmission||pendingSubmission.fingerprint!==fingerprint)pendingSubmission={fingerprint,key:crypto.randomUUID()};
    try{
     const result=await fetch('/api/public/forms?formId='+encodeURIComponent(formId)+'&pageId='+encodeURIComponent(pageId),{
      method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Idempotency-Key':pendingSubmission.key},
      body:JSON.stringify({values,consentAccepted:consent.checked,website:trap.value})
     });
     const resultPayload=await result.json().catch(()=>null);
     if(!result.ok||resultPayload?.ok!==true){
      if(result.status===409)pendingSubmission={fingerprint,key:crypto.randomUUID()};
      throw new Error(result.status===429?'Túl sok beküldés érkezett. Próbáld újra később.':result.status===409?'A beküldési adatok megváltoztak. Küldd el újra az űrlapot.':'A beküldést most nem tudtuk fogadni. Ellenőrizd az adatokat, majd próbáld újra.');
     }
      pendingSubmission=null;
      form.reset();updateConditionalFields();status.textContent=typeof resultPayload.data?.message==='string'?resultPayload.data.message:'Köszönöm, a beküldés megérkezett.';
     emitAcceptedPublicFormSubmission(form);
    }catch(error){status.textContent=error?.message||'A beküldés most nem sikerült. Próbáld újra később.'}
    finally{submit.disabled=false}
   });
  }catch{showError()}
 }
}
 async function loadPage(){const loadToken=++pageLoadToken,failures=new Set(),nextScheduleCache=new Map();const raw=location.pathname.startsWith('/p/')?location.pathname.slice(3).split('/')[0]:'';const slug=decodeURIComponent(raw||'home').trim();const title=document.getElementById('page-title'),desc=document.getElementById('page-description'),canvas=document.getElementById('content-canvas');if(!slug){title.textContent='Hiányzó oldal';canvas.innerHTML='<div class="content-error"><h1>Hiányzó oldal</h1></div>';return}try{const preview=new URL(location.href).searchParams.get('preview')==='1';const r=await fetch('/api/public/pages?slug='+encodeURIComponent(slug)+(preview?'&preview=1':''),{cache:'no-store',credentials:'same-origin'});const payload=await r.json().catch(()=>({}));if(!r.ok||!payload.ok)throw new Error(payload?.error?.message||'not-found');if(loadToken!==pageLoadToken)return;const p=payload.data||{},c=p.content||{};document.body.classList.toggle('sanci-editorial-page',document.body.dataset.sanciShell==='1'&&c.metadata?.sanciEditorialVersion===1);const isSanciShowcase=document.body.dataset.sanciShell==='1'&&c.metadata?.sanciEditorialVersion===1&&c.metadata?.heroOverlayVersion===1;document.body.toggleAttribute('data-sanci-showcase-ready',isSanciShowcase);if(isSanciShowcase){document.body.dataset.sanciShowcase='depth-v2';document.body.dataset.sanciPage=slug;}else{delete document.body.dataset.sanciShowcase;delete document.body.dataset.sanciPage;}document.title=(p.title||'Sanci9517')+' — Sanci9517';title.textContent=p.title||'Sanci9517';desc.textContent=p.description||'';ensureStyle();const rootId=c.rootId;const page=c;if(!rootId||!page.nodes?.[rootId])throw new Error('invalid-document');const root=page.nodes[rootId];const scheduleNodes=collectVisibleDescendants(page,currentDevice).filter(n=>n.type==='schedule');for(const node of scheduleNodes){let key;try{const cfg=scheduleConfig(node.props?.schedule);const weekStart=cfg.mode==='week'?(scheduleWeekByNode.get(node.id)||currentBudapestMonday()):null;key=scheduleKey(cfg,weekStart);if(!nextScheduleCache.has(key)&&!failures.has(key)){const sr=await fetch('/api/public/schedule?'+scheduleQuery(cfg,weekStart),{cache:'no-store',credentials:'same-origin'});const sp=await sr.json().catch(()=>({}));if(!sr.ok||!sp.ok||!Array.isArray(sp.data))throw new Error('schedule-load-failed');nextScheduleCache.set(key,sp.data)}}catch{if(key)failures.add(key)}if(loadToken!==pageLoadToken)return}scheduleCache=nextScheduleCache;scheduleFailures=failures;scheduleActiveNodes=new Map(scheduleNodes.map(node=>[node.id,node]));canvas.className='content-canvas visual-editor-canvas';canvas.style.cssText='';canvas.removeAttribute('data-node-id');

// Explicit root editing opts into the same responsive style as the canvas.
// The canvas keeps its technical ID; explicit root accessibility owns only these attributes.
for(const key of ['aria-label','lang']){const value=root.metadata?.a11yVersion===1?contentAttributes(root)[key]:undefined;if(value===undefined)canvas.removeAttribute(key);else canvas.setAttribute(key,value)}
if(root.metadata?.rootStyleVersion===1||root.metadata?.editorRootVersion===1){canvas.classList.add('visual-root-authored');if(root.metadata?.stateVersion===1)canvas.classList.add('creator-state-enabled');canvas.style.cssText=style(root);canvas.dataset.nodeId=root.id;const frame=canvas.closest('.preview-frame');if(frame){frame.style.maxWidth='none';frame.style.flex='0 0 auto';frame.style.margin='0 auto';frame.parentElement.style.overflowX='auto';frame.parentElement.style.justifyContent='flex-start'}}
const rendered=new Set([page.rootId]);canvas.innerHTML=safeNodeChildIds(root).map(id=>nodeHtml(page,id,false,rendered)).join('')||'<div class="builder-text">Az oldalnak még nincs tartalma.</div>';applyStateStyles(canvas,page,currentDevice);let tokens=defaultTokens();try{const tokenUrl='/api/public/presentation'+(preview?'?preview=1':'');const tokenResponse=await fetch(tokenUrl,{cache:'no-store',credentials:'same-origin'});const tokenPayload=await tokenResponse.json();if(loadToken!==pageLoadToken)return;if(tokenResponse.ok&&tokenPayload?.data?.tokens)tokens=tokenPayload.data.tokens}catch{}applyTokenVariables(canvas,tokens);initContentInteractions(canvas);activateStructuredContent(canvas);activateCountdowns(canvas);activateEmbeds(canvas);activateCodeBlocks(canvas);activatePublicForms(canvas,{preview});decorateSanciShowcase(canvas,page,{slug,enabled:isSanciShowcase});}catch(e){if(loadToken!==pageLoadToken)return;title.textContent='Az oldal nem található';desc.textContent='';canvas.innerHTML='<div class="content-error"><h1>404</h1><p>Ez az oldal nem létezik, vagy nincs publikálva.</p></div>'}}
 if(new URL(location.href).searchParams.get('preview')!=='1')window.addEventListener('resize',()=>{const next=window.innerWidth<=700?'mobile':window.innerWidth<=900?'tablet':'desktop';if(next!==currentDevice){currentDevice=next;loadPage()}});
if(reducedMotionQuery){const updateVideoPlayback=()=>applyReducedMotionVideoPlayback(document.getElementById('content-canvas'),{reducedMotion:prefersReducedMotion()});if(typeof reducedMotionQuery.addEventListener==='function')reducedMotionQuery.addEventListener('change',updateVideoPlayback);else reducedMotionQuery.addListener?.(updateVideoPlayback)}
 ensureStyle();if(!setupPreview())loadPage();
})();
