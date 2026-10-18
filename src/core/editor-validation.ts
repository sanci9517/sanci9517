import {validateElementContent,isStructuredType} from '../../public/editor-v2/core/element-content.js';
import {isSupportedIcon} from '../../public/editor-v2/core/icon-options.js';

function validateScheduleConfig(config:any):boolean{
 if(!config||typeof config!=='object'||config.version!==1)return false;
 if(!['upcoming','all','next'].includes(config.mode))return false;
 if(!Number.isInteger(config.limit)||config.limit<1||config.limit>50)return false;
 if(!Array.isArray(config.statuses)||config.statuses.length===0||config.statuses.some((v:any)=>!['scheduled','live','completed'].includes(v)))return false;
 if(!Array.isArray(config.platforms)||config.platforms.length>20||config.platforms.some((v:any)=>typeof v!=='string'||!v.trim()||v.trim().length>40))return false;
 if(!['asc','desc'].includes(config.order))return false;
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
function validateMediaNode(node:any):string|null{
 if(node.metadata?.editorContentVersion!==1||!['image','video','audio'].includes(node.type))return null;
 if(!validMediaSource(node.props?.src))return 'INVALID_MEDIA_SOURCE';
 if(node.type==='image'&&!node.accessibility?.decorative&&!String(node.props?.alt||'').trim())return 'IMAGE_ALT_REQUIRED';
 return null;
}

export function validatePublishDocument(document:any,pageId:string){const page=document?.pages?.[pageId];if(!(document&&document.type==='sanci-page-document'&&document.schemaVersion===1&&document.activePageId===pageId&&page?.id===pageId&&page.rootId&&page.nodes&&typeof page.nodes==='object'))return 'INVALID_EDITOR_DOCUMENT';const nodes=page.nodes;const ids=Object.keys(nodes);if(!ids.length||!nodes[page.rootId])return 'INVALID_PAGE_ROOT';const seen=new Set<string>();const anchors=new Set<string>();for(const id of ids){if(seen.has(id))return 'DUPLICATE_NODE_ID';seen.add(id);const node=nodes[id];if(!node||node.id!==id)return 'INVALID_NODE';const anchor=node.accessibility?.anchorId;if(anchor){if(typeof anchor!=='string'||!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(anchor))return 'INVALID_ELEMENT_ANCHOR';if(anchors.has(anchor))return 'DUPLICATE_ELEMENT_ANCHOR';anchors.add(anchor)}if(node.type==='schedule'&&!validateScheduleConfig(node.props?.schedule))return 'INVALID_SCHEDULE_CONFIG';const mediaError=validateMediaNode(node);if(mediaError)return mediaError;if(node.metadata?.basicContentVersion===1){if(['badge','quote'].includes(node.type)&&!String(node.props?.text||'').trim())return 'EMPTY_BASIC_CONTENT';if(node.type==='icon'&&!isSupportedIcon(node.props?.icon))return 'INVALID_ICON_TYPE';}if(isStructuredType(node.type)&&node.metadata?.structuredContentVersion===1){const structuredError=validateElementContent(node.type,node.props?.contentModel);if(structuredError)return structuredError;}if(id===page.rootId){if(node.parentId!==null&&node.parentId!==undefined&&node.parentId!=='')return 'INVALID_ROOT_PARENT'}else{if(typeof node.parentId!=='string'||!nodes[node.parentId])return 'INVALID_NODE_PARENT';const parent=nodes[node.parentId];if(!Array.isArray(parent.children)||!parent.children.includes(id))return 'INVALID_PARENT_CHILD_LINK'}}for(const id of ids){const node=nodes[id];for(const childId of Array.isArray(node.children)?node.children:[]){if(!nodes[childId]||nodes[childId].parentId!==id)return 'INVALID_CHILD_LINK'}}const visited=new Set<string>();const walk=(id:string)=>{if(visited.has(id))return false;visited.add(id);const node=nodes[id];for(const childId of Array.isArray(node.children)?node.children:[]){if(!walk(childId))return false}return true};if(!walk(page.rootId)||visited.size!==ids.length)return 'INVALID_HIERARCHY';return null}