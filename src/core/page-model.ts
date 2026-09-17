type AnyRecord=Record<string,any>;

function clone(value:any){return value==null?value:structuredClone(value)}
function nodeId(prefix:string,id:any){return typeof id==='string'&&id? id : `${prefix}-${crypto.randomUUID()}`}

function convertLegacyNode(source:any,parentId:string):AnyRecord{
  const id=nodeId('node',source?.id);
  const children=Array.isArray(source?.children)?source.children:[];
  const node:any={
    id,
    type:typeof source?.type==='string'&&source.type?source.type:'custom',
    name:typeof source?.name==='string'&&source.name?source.name:(source?.content?.text||source?.type||'Elem'),
    parentId,
    children:[],
    props:clone(source?.props&&typeof source.props==='object'?source.props:source?.content&&typeof source.content==='object'?source.content:{}),
    style:clone(source?.style&&typeof source.style==='object'?source.style:{}),
    responsive:clone(source?.responsive&&typeof source.responsive==='object'?source.responsive:{desktop:{},tablet:{},mobile:{}}),
    states:{},
    visibility:typeof source?.visibility==='object'?clone(source.visibility):{desktop:Boolean(source?.visibility!==false),tablet:Boolean(source?.visibility!==false),mobile:Boolean(source?.visibility!==false)},
    locked:Boolean(source?.locked),
    component:null,
    dataBindings:clone(source?.dataBindings||{}),
    interactions:clone(source?.interactions||source?.interaction? [source.interaction]:[]),
    accessibility:clone(source?.accessibility||{}),
    metadata:{...(clone(source?.metadata)||{}),...(source?.layout?{legacyLayout:clone(source.layout)}:{})}
  };
  node.children=children.map((child:any)=>{const converted=convertLegacyNode(child,id);return converted.id});
  for(const child of children){const converted=convertLegacyNode(child,id);node.__children=node.__children||[];node.__children.push(converted)}
  return node;
}

function flatten(node:any,map:AnyRecord){
  const copy={...node};const children=copy.__children||[];delete copy.__children;map[copy.id]=copy;for(const child of children)flatten(child,map)
}

export function normalizeEditorDocument(value:any,pageId:string,title='',slug='',description=''):AnyRecord|null{
  if(!value||typeof value!=='object')return null;
  if(value.type==='sanci-page-document'&&value.schemaVersion===1){const page=value.pages?.[pageId];if(page?.id===pageId&&page.rootId&&page.nodes&&typeof page.nodes==='object')return value}
  if(value.type!=='sanci-document'||!Array.isArray(value.pages)||!value.pages.length)return null;
  const legacy=value.pages.find((p:any)=>p?.id===pageId)||value.pages[0];if(!legacy)return null;
  const rootSource=legacy.root||{id:`root-${pageId}`,type:'root',name:'Oldal',children:[]};
  const rootId=`root-${pageId}`;
  const root:any={id:rootId,type:'root',name:rootSource.name||'Oldal gyökér',parentId:null,children:[],props:{},style:{},responsive:{desktop:{},tablet:{},mobile:{}},states:{},visibility:{desktop:true,tablet:true,mobile:true},locked:false,component:null,dataBindings:{},interactions:[],accessibility:{},metadata:{}};
  const nodes:AnyRecord={[rootId]:root};
  const legacyChildren=Array.isArray(rootSource.children)?rootSource.children:[];
  for(const source of legacyChildren){const converted=convertLegacyNode(source,rootId);flatten(converted,nodes);root.children.push(converted.id)}
  return {schemaVersion:1,type:'sanci-page-document',siteId:value.siteId||null,activePageId:pageId,pages:{[pageId]:{id:pageId,name:legacy.name||title||slug||'Oldal',slug:legacy.slug||slug||'',status:'draft',metadata:{title:title||legacy.name||'',description:description||'',canonical:'',openGraph:{},...(legacy.metadata||{})},settings:legacy.settings||{templateId:null,access:'public',customCode:{head:'',bodyStart:'',bodyEnd:''}},schemaVersion:1,rootId,nodes,revision:Number(legacy.revision||0)}},metadata:{migratedFrom:'legacy-sanci-document'}};
}
