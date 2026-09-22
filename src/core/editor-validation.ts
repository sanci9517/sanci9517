
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

export function validatePublishDocument(document:any,pageId:string){const page=document?.pages?.[pageId];if(!(document&&document.type==='sanci-page-document'&&document.schemaVersion===1&&document.activePageId===pageId&&page?.id===pageId&&page.rootId&&page.nodes&&typeof page.nodes==='object'))return 'INVALID_EDITOR_DOCUMENT';const nodes=page.nodes;const ids=Object.keys(nodes);if(!ids.length||!nodes[page.rootId])return 'INVALID_PAGE_ROOT';const seen=new Set<string>();for(const id of ids){if(seen.has(id))return 'DUPLICATE_NODE_ID';seen.add(id);const node=nodes[id];if(!node||node.id!==id)return 'INVALID_NODE';if(node.type==='schedule'&&!validateScheduleConfig(node.props?.schedule))return 'INVALID_SCHEDULE_CONFIG';if(id===page.rootId){if(node.parentId!==null&&node.parentId!==undefined&&node.parentId!=='')return 'INVALID_ROOT_PARENT'}else{if(typeof node.parentId!=='string'||!nodes[node.parentId])return 'INVALID_NODE_PARENT';const parent=nodes[node.parentId];if(!Array.isArray(parent.children)||!parent.children.includes(id))return 'INVALID_PARENT_CHILD_LINK'}}for(const id of ids){const node=nodes[id];for(const childId of Array.isArray(node.children)?node.children:[]){if(!nodes[childId]||nodes[childId].parentId!==id)return 'INVALID_CHILD_LINK'}}const visited=new Set<string>();const walk=(id:string)=>{if(visited.has(id))return false;visited.add(id);const node=nodes[id];for(const childId of Array.isArray(node.children)?node.children:[]){if(!walk(childId))return false}return true};if(!walk(page.rootId)||visited.size!==ids.length)return 'INVALID_HIERARCHY';return null}