import { MAX_PAGE_CHILD_REFERENCE_COUNT, MAX_PAGE_HIERARCHY_DEPTH, MAX_PAGE_NODE_COUNT, hasExcessPageChildReferences, hasExcessPageNodes } from '../../public/editor-v2/core/hierarchy-limits.js';

type AnyRecord=Record<string,any>;

function hasExcessPageHierarchyDepth(nodes:AnyRecord,rootId:string):boolean{
 const pending=[{id:rootId,depth:0}],visitedDepth=new Map<string,number>();
 while(pending.length){const current=pending.pop()!;if(current.depth>MAX_PAGE_HIERARCHY_DEPTH)return true;const priorDepth=visitedDepth.get(current.id);if(priorDepth!==undefined&&priorDepth>=current.depth)continue;visitedDepth.set(current.id,current.depth);const node=nodes[current.id];if(!node||typeof node!=='object'||Array.isArray(node))continue;for(const child of Array.isArray(node.children)?node.children:[])if(typeof child==='string')pending.push({id:child,depth:current.depth+1})}
 return false;
}

function hasExcessLegacyPageHierarchy(root:any):boolean{
 if(!root||typeof root!=='object'||Array.isArray(root))return false;
 let references=0;const pending=[{node:root,depth:0}],visitedDepth=new Map<object,number>();
 while(pending.length){const current=pending.pop()!;if(current.depth>MAX_PAGE_HIERARCHY_DEPTH)return true;const node=current.node;if(!node||typeof node!=='object'||Array.isArray(node))continue;const priorDepth=visitedDepth.get(node);if(priorDepth!==undefined&&priorDepth>=current.depth)continue;visitedDepth.set(node,current.depth);const children=Array.isArray(node.children)?node.children:[];if(children.length>MAX_PAGE_CHILD_REFERENCE_COUNT-references)return true;references+=children.length;for(const child of children)if(child&&typeof child==='object'&&!Array.isArray(child))pending.push({node:child,depth:current.depth+1});if(references>=MAX_PAGE_NODE_COUNT)return true}
 return false;
}
function clone(value:any){return value==null?value:structuredClone(value)}
function nodeId(prefix:string,id:any){return typeof id==='string'&&id?id:`${prefix}-${crypto.randomUUID()}`}
function convertLegacyNode(source:any,parentId:string):AnyRecord{
 const id=nodeId('node',source?.id);const children=Array.isArray(source?.children)?source.children:[];
 const node:any={id,type:typeof source?.type==='string'&&source.type?source.type:'custom',name:typeof source?.name==='string'&&source.name?source.name:(source?.content?.text||source?.type||'Elem'),parentId,children:[],props:clone(source?.props&&typeof source.props==='object'?source.props:source?.content&&typeof source.content==='object'?source.content:{}),style:clone(source?.style&&typeof source.style==='object'?source.style:{}),responsive:clone(source?.responsive&&typeof source.responsive==='object'?source.responsive:{desktop:{},tablet:{},mobile:{}}),states:{},visibility:typeof source?.visibility==='object'?clone(source.visibility):{desktop:source?.visibility!==false,tablet:source?.visibility!==false,mobile:source?.visibility!==false},locked:Boolean(source?.locked),component:null,dataBindings:clone(source?.dataBindings||{}),interactions:clone(source?.interactions||[]),accessibility:clone(source?.accessibility||{}),metadata:{...(clone(source?.metadata)||{}),...(source?.layout?{legacyLayout:clone(source.layout)}:{})}};
 for(const child of children){const converted=convertLegacyNode(child,id);node.children.push(converted.id);node.__children=node.__children||[];node.__children.push(converted)}
 return node;
}
function flatten(node:any,map:AnyRecord){const copy={...node};const children=copy.__children||[];delete copy.__children;map[copy.id]=copy;for(const child of children)flatten(child,map)}
export function normalizeEditorDocument(value:any,pageId:string,title='',slug='',description=''):AnyRecord|null{
 if(!value||typeof value!=='object')return null;
 if(value.type==='sanci-page-document'&&value.schemaVersion===1){const page=value.pages?.[pageId];if(page?.id===pageId&&page.rootId&&page.nodes&&typeof page.nodes==='object'&&!Array.isArray(page.nodes)&&!hasExcessPageNodes(page.nodes)&&!hasExcessPageChildReferences(page.nodes)&&!hasExcessPageHierarchyDepth(page.nodes,page.rootId))return value}
 if(value.type!=='sanci-document'||!Array.isArray(value.pages)||!value.pages.length)return null;
 const legacy=value.pages.find((p:any)=>p?.id===pageId)||value.pages[0];if(!legacy)return null;
 const rootSource=legacy.root||{name:'Oldal',children:[]};const rootId=`root-${pageId}`;
 if(hasExcessLegacyPageHierarchy(rootSource))return null;
 const root:any={id:rootId,type:'root',name:rootSource.name||'Oldal gyökér',parentId:null,children:[],props:{},style:{},responsive:{desktop:{},tablet:{},mobile:{}},states:{},visibility:{desktop:true,tablet:true,mobile:true},locked:false,component:null,dataBindings:{},interactions:[],accessibility:{},metadata:{}};
 const nodes:AnyRecord={[rootId]:root};for(const source of Array.isArray(rootSource.children)?rootSource.children:[]){const converted=convertLegacyNode(source,rootId);flatten(converted,nodes);root.children.push(converted.id)}
 return {schemaVersion:1,type:'sanci-page-document',siteId:value.siteId||null,activePageId:pageId,pages:{[pageId]:{id:pageId,name:legacy.name||title||slug||'Oldal',slug:legacy.slug||slug||'',status:'draft',metadata:{title:title||legacy.name||'',description:description||'',canonical:'',openGraph:{},...(legacy.metadata||{})},settings:legacy.settings||{templateId:null,access:'public',customCode:{head:'',bodyStart:'',bodyEnd:''}},schemaVersion:1,rootId,nodes,revision:Number(legacy.revision||0)}},metadata:{...(value.metadata&&typeof value.metadata==='object'?clone(value.metadata):{}),migratedFrom:'legacy-sanci-document'}};
}
