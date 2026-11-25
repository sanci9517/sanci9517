import {hasContentProfile} from '../../public/editor-v2/core/content-profiles.js';
import {validateElementContent} from '../../public/editor-v2/core/element-content.js';
import {isSupportedIcon} from '../../public/editor-v2/core/icon-options.js';
import {normalizeDividerStyle} from '../../public/editor-v2/core/decorative-elements.js';
import {normalizeCardContent} from '../../public/editor-v2/core/card-content.js';
import {normalizeCountdownContent} from '../../public/editor-v2/core/countdown-content.js';
import {normalizeSocialLinks} from '../../public/editor-v2/core/social-links.js';
import {normalizeEmbedContent} from '../../public/editor-v2/core/creator-embed.js';
import {normalizeCodeSnippet} from '../../public/editor-v2/core/code-snippet.js';
import {validateAccessibility} from '../../public/editor-v2/core/accessibility.js';
import {validateStateStyles} from '../../public/editor-v2/core/state-styles.js';
import {validatePageForPublication,validateElementContent as validateAuthoredElementContent} from '../../public/editor-v2/core/authored-content.js';
import {getElementCapability} from '../../public/editor-v2/core/capability-matrix.js';
import {validateInspectorStyleContract} from '../../public/editor-v2/core/inspector-style-contract.js';
import {MEDIA_ASSET_ID} from '../../public/editor-v2/core/background-asset.js';
import {MAX_PAGE_HIERARCHY_DEPTH,hasExcessPageNodes} from '../../public/editor-v2/core/hierarchy-limits.js';

function validateScheduleConfig(config:any):boolean{
 if(!config||typeof config!=='object'||config.version!==1)return false;
 if(!['upcoming','all','next','week'].includes(config.mode))return false;
 if(!Number.isInteger(config.limit)||config.limit<1||config.limit>50)return false;
 if(!Array.isArray(config.statuses)||config.statuses.length===0||config.statuses.some((v:any)=>!['scheduled','live','completed','cancelled'].includes(v)))return false;
 if(!Array.isArray(config.platforms)||config.platforms.length>20||config.platforms.some((v:any)=>typeof v!=='string'||!v.trim()||v.trim().length>40))return false;
 if(!['asc','desc'].includes(config.order))return false;
 if(config.showArtwork!==undefined&&typeof config.showArtwork!=='boolean')return false;
 for(const key of ['showTitle','showPlatform','showTime','showEndTime','showStatus','showNotes','showLink'])if(typeof config[key]!=='boolean')return false;
 if(typeof config.emptyText!=='string'||!config.emptyText.trim()||config.emptyText.trim().length>200)return false;
 return true;
}

// Only newly authored media nodes use this content contract. Existing saved
// documents remain readable and publishable until explicitly migrated.
function validMediaSource(value:unknown):boolean{
 if(typeof value!=='string')return false;
 const raw=value.trim();
 if(!raw||raw.startsWith('//')||[...raw].some(ch=>{const n=ch.charCodeAt(0);return n<32||n===127||n===92;}))return false;
 if(!(raw.startsWith('/')||raw.startsWith('https://')||raw.startsWith('http://')))return false;
 try{const url=new URL(raw,'https://editor.invalid');return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password;}
 catch{return false}
}
function validateBackgroundAssets(node:any):string|null{
 for(const scope of [node.style,node.responsive?.desktop,node.responsive?.tablet,node.responsive?.mobile]){
  const id=scope?.backgroundAssetId;
  if(id!==undefined&&id!==null&&id!==''&&id!=='none'&&(typeof id!=='string'||!MEDIA_ASSET_ID.test(id)))return 'INVALID_BACKGROUND_ASSET';
 }
 return null;
}
// Corrupt JSON may contain {toString:null}; Publish must reject it as content,
// never throw or turn an object into an accessible label.
function hasVisibleContentText(value:unknown):boolean{
 return typeof value==='string'?Boolean(value.trim()):typeof value==='number'&&Number.isFinite(value);
}
function validateMediaNode(node:any):string|null{
 if(!hasContentProfile(node,'media-v1'))return null;
 if(node.props?.assetId!==undefined&&typeof node.props.assetId==='string'&&MEDIA_ASSET_ID.test(node.props.assetId)){}else if(!validMediaSource(node.props?.src))return 'INVALID_MEDIA_SOURCE';
 if(node.type==='image'&&!node.accessibility?.decorative&&!hasVisibleContentText(node.props?.alt))return 'IMAGE_ALT_REQUIRED';
 // Keep the legacy media-v1 publication contract aligned with the Inspector's
 // supported playback modes. A hidden player must remain usable and autoplay
 // must never publish without mute consent.
 if(node.type==='audio'&&node.props?.controls===false)return 'AUDIO_CONTROLS_REQUIRED';
 if(node.type==='video'){
  if(node.props?.autoplay===true&&node.props?.muted!==true)return 'VIDEO_AUTOPLAY_REQUIRES_MUTED';
  if(node.props?.controls===false&&!(node.props?.autoplay===true&&node.props?.muted===true))return 'VIDEO_CONTROLS_REQUIRED';
 }
 return null;
}
function hasPublicRendererContract(node:any):boolean{
 return getElementCapability(node?.type).public==='PARTIAL';
}

export function validatePublishDocument(document:any,pageId:string){const page=document?.pages?.[pageId];if(!(document&&document.type==='sanci-page-document'&&document.schemaVersion===1&&document.activePageId===pageId&&page?.id===pageId&&page.rootId&&page.nodes&&typeof page.nodes==='object'&&!Array.isArray(page.nodes)))return 'INVALID_EDITOR_DOCUMENT';if(hasExcessPageNodes(page.nodes))return 'EDITOR_NODE_LIMIT_EXCEEDED';try{validateAccessibility(page)}catch{return 'INVALID_EDITOR_ACCESSIBILITY'};try{validatePageForPublication(page)}catch{return 'INCOMPLETE_EDITOR_CONTENT'};const nodes=page.nodes;const ids=Object.keys(nodes);if(!ids.length||!nodes[page.rootId])return 'INVALID_PAGE_ROOT';const seen=new Set<string>();const anchors=new Set<string>();for(const id of ids){if(seen.has(id))return 'DUPLICATE_NODE_ID';seen.add(id);const node=nodes[id];if(!node||node.id!==id)return 'INVALID_NODE';if(!hasPublicRendererContract(node))return 'UNSUPPORTED_EDITOR_NODE_TYPE';try{validateAuthoredElementContent(node);validateStateStyles(node)}catch{return 'INVALID_EDITOR_CONTENT'};if(!validateInspectorStyleContract(node))return 'INVALID_INSPECTOR_STYLE';const backgroundError=validateBackgroundAssets(node);if(backgroundError)return backgroundError;const anchor=node.accessibility?.anchorId;if(anchor){if(typeof anchor!=='string'||!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(anchor))return 'INVALID_ELEMENT_ANCHOR';if(anchors.has(anchor))return 'DUPLICATE_ELEMENT_ANCHOR';anchors.add(anchor)}if(hasContentProfile(node,'schedule')&&!validateScheduleConfig(node.props?.schedule))return 'INVALID_SCHEDULE_CONFIG';const mediaError=validateMediaNode(node);if(mediaError)return mediaError;if(hasContentProfile(node,'divider-v1')){try{normalizeDividerStyle(node.props?.decoration)}catch{return 'INVALID_DIVIDER_CONFIG';}}if(hasContentProfile(node,'card-v1')){try{normalizeCardContent(node.props?.cardContent)}catch{return 'INVALID_CARD_CONTENT';}}if(hasContentProfile(node,'countdown-v1')){try{normalizeCountdownContent(node.props?.countdown)}catch{return 'INVALID_COUNTDOWN_CONTENT';}}if(hasContentProfile(node,'social-v1')){try{normalizeSocialLinks(node.props?.socialLinks)}catch{return 'INVALID_SOCIAL_LINKS';}}if(hasContentProfile(node,'embed-v1')){try{normalizeEmbedContent(node.props?.embedContent)}catch{return 'INVALID_EMBED_CONTENT';}}if(hasContentProfile(node,'code-v1')){try{normalizeCodeSnippet(node.props?.codeSnippet)}catch{return 'INVALID_CODE_SNIPPET';}}if(hasContentProfile(node,'basic-v1')){if(['badge','quote'].includes(node.type)&&!hasVisibleContentText(node.props?.text))return 'EMPTY_BASIC_CONTENT';if(node.type==='icon'&&!isSupportedIcon(node.props?.icon))return 'INVALID_ICON_TYPE';}if(hasContentProfile(node,'structured-v1')){const structuredError=validateElementContent(node.type,node.props?.contentModel);if(structuredError)return structuredError;}if(id===page.rootId){if(node.parentId!==null&&node.parentId!==undefined&&node.parentId!=='')return 'INVALID_ROOT_PARENT'}else{if(typeof node.parentId!=='string'||!nodes[node.parentId])return 'INVALID_NODE_PARENT';const parent=nodes[node.parentId];if(!Array.isArray(parent.children)||!parent.children.includes(id))return 'INVALID_PARENT_CHILD_LINK'}}for(const id of ids){const node=nodes[id];for(const childId of Array.isArray(node.children)?node.children:[]){if(!nodes[childId]||nodes[childId].parentId!==id)return 'INVALID_CHILD_LINK'}}const visited=new Set<string>();const pending:{id:string;depth:number}[]=[{id:page.rootId,depth:0}];while(pending.length){const current=pending.pop()!;if(visited.has(current.id)||current.depth>MAX_PAGE_HIERARCHY_DEPTH)return 'INVALID_HIERARCHY';visited.add(current.id);const children=Array.isArray(nodes[current.id].children)?nodes[current.id].children:[];for(let index=children.length-1;index>=0;index--)pending.push({id:children[index],depth:current.depth+1})}if(visited.size!==ids.length)return 'INVALID_HIERARCHY';return null}
