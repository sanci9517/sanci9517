/* Sanci9517 Visual Editor — single mutation/action authority. */
(function(){
  const S=window.SanciEditorSchema, State=window.SanciEditorState, V=window.SanciEditorValidation, H=window.SanciEditorHistory;
  const registry=new Map();
  const labels={text:'Szöveg',heading:'Címsor',paragraph:'Bekezdés',button:'Gomb',image:'Kép',section:'Szakasz',container:'Konténer',group:'Csoport',card:'Kártya',live:'Twitch Live',schedule:'Menetrend',youtube:'YouTube',tiktok:'TikTok',discord:'Discord'};
  function register(type,handler,options={}){registry.set(type,{handler,history:options.history!==false});}
  function execute(state,action){
    const command=registry.get(action?.type); if(!command)return {ok:false,error:`Ismeretlen művelet: ${action?.type||'—'}`};
    const permission=V.can(state,action); if(!permission.ok)return {ok:false,error:permission.reason};
    const before=S.clone(state.document); const result=command.handler(state,action);
    if(!result?.ok)return result||{ok:false,error:'A művelet sikertelen.'};
    if(command.history)H.record(state,before,action);
    state.runtime.lastError=null; return {ok:true,state,value:result.value};
  }
  function selection(state,ids){state.selection=[...new Set(ids||[])].filter(id=>State.getNode(state,id));return {ok:true};}
  function parent(state,id){return V.parentOf(state,id);}
  function removeFrom(node,id){node.children=(node.children||[]).filter(x=>x.id!==id);}
  function cloneNode(node){const n=S.clone(node);const remap=new Map();S.walk(n,x=>{const old=x.id;x.id=S.uid(x.type||'node');remap.set(old,x.id);});S.walk(n,x=>{x.parentId=x.parentId?remap.get(x.parentId)||null:null;});return n;}
  function canParent(node){return !['text','heading','paragraph','button','image','video','audio','icon','svg','divider','spacer','input','textarea','checkbox','radio','select','slider','file','submit'].includes(node.type);}

  register('selection.set',(state,a)=>selection(state,a.ids||[]),{history:false});
  register('selection.clear',state=>selection(state,[]),{history:false});

  register('element.add',(state,a)=>{
    const root=state.document.page.root, p=a.parentId?State.getNode(state,a.parentId):root;
    if(!p||!canParent(p))return {ok:false,error:'Ez az elem nem lehet szülő.'};
    const node=S.emptyNode(a.nodeType||'container',{name:a.name||labels[a.nodeType]||a.nodeType,content:{text:a.text||labels[a.nodeType]||a.nodeType},layout:a.layout||{x:40,y:40,width:320,height:100,position:'absolute'},style:a.style||{}});
    node.parentId=p.id;p.children.push(node);state.selection=[node.id];return {ok:true,value:node};
  });
  register('element.duplicate',(state,a)=>{
    const source=State.getNode(state,a.id), p=parent(state,a.id); if(!source||!p)return {ok:false,error:'A duplikálandó elem nem található.'};
    const copy=cloneNode(source);copy.parentId=p.id;const index=p.children.findIndex(x=>x.id===source.id);p.children.splice(index+1,0,copy);state.selection=[copy.id];return {ok:true,value:copy};
  });
  register('element.delete',(state,a)=>{const node=State.getNode(state,a.id),p=parent(state,a.id);if(!node||!p)return {ok:false,error:'Törlendő elem nem található.'};removeFrom(p,node.id);state.selection=state.selection.filter(id=>id!==node.id);return {ok:true};});
  register('element.content.set',(state,a)=>{const n=State.getNode(state,a.id);if(!n)return {ok:false,error:'Elem nem található.'};n.content={...n.content,...(a.patch||{})};return {ok:true};});
  register('element.style.set',(state,a)=>{const n=State.getNode(state,a.id);if(!n)return {ok:false,error:'Elem nem található.'};n.style={...n.style,...(a.patch||{})};return {ok:true};});
  register('element.layout.set',(state,a)=>{const n=State.getNode(state,a.id);if(!n)return {ok:false,error:'Elem nem található.'};n.layout={...n.layout,...(a.patch||{})};return {ok:true};});
  register('element.lock.set',(state,a)=>{const n=State.getNode(state,a.id);if(!n)return {ok:false,error:'Elem nem található.'};n.locked=Boolean(a.value);return {ok:true};});
  register('element.visibility.set',(state,a)=>{const n=State.getNode(state,a.id);if(!n)return {ok:false,error:'Elem nem található.'};n.visibility=a.value!==false;return {ok:true};});

  register('hierarchy.reparent',(state,a)=>{const child=State.getNode(state,a.id),old=parent(state,a.id),p=State.getNode(state,a.parentId);if(!child||!p)return {ok:false,error:'Elem vagy cél nem található.'};if(!canParent(p))return {ok:false,error:'Ez az elem nem lehet szülő.'};if(V.isDescendant(state,child.id,p.id))return {ok:false,error:'Elem nem helyezhető saját leszármazottjába.'};if(old)removeFrom(old,child.id);child.parentId=p.id;p.children.splice(Math.max(0,a.index??p.children.length),0,child);return {ok:true};});
  register('hierarchy.addChild',(state,a)=>registry.get('hierarchy.reparent').handler(state,a));
  register('hierarchy.removeChild',(state,a)=>{const child=State.getNode(state,a.id),old=parent(state,a.id),root=state.document.page.root;if(!child||!old)return {ok:false,error:'Elem vagy parent nem található.'};removeFrom(old,child.id);child.parentId=root.id;root.children.push(child);return {ok:true};});

  function reorder(state,id,mode){const n=State.getNode(state,id),p=parent(state,id);if(!n||!p)return {ok:false,error:'Elem nem található.'};const i=p.children.findIndex(x=>x.id===id),last=p.children.length-1;let j=i;if(mode==='forward')j=Math.min(last,i+1);if(mode==='backward')j=Math.max(0,i-1);if(mode==='front')j=last;if(mode==='back')j=0;if(j===i)return {ok:true};p.children.splice(i,1);p.children.splice(j,0,n);return {ok:true};}
  register('layer.forward',(s,a)=>reorder(s,a.id,'forward'));register('layer.backward',(s,a)=>reorder(s,a.id,'backward'));register('layer.front',(s,a)=>reorder(s,a.id,'front'));register('layer.back',(s,a)=>reorder(s,a.id,'back'));

  register('group.create',(state,a)=>{const ids=[...(a.ids||[])].filter(id=>State.getNode(state,id));if(ids.length<2)return {ok:false,error:'Legalább két elem kell a csoporthoz.'};const first=State.getNode(state,ids[0]),p=parent(state,first.id);if(!p)return {ok:false,error:'Érvénytelen szülő.'};const group=S.emptyNode('group',{name:a.name||'Csoport',parentId:p.id,layout:{x:0,y:0,width:100,height:100,position:'relative'}});const set=new Set(ids);p.children=p.children.filter(n=>!set.has(n.id));ids.forEach(id=>{const n=State.getNode(state,id);n.parentId=group.id;group.children.push(n);});p.children.push(group);state.selection=[group.id];return {ok:true,value:group};});
  register('group.ungroup',(state,a)=>{const g=State.getNode(state,a.id),p=parent(state,a.id);if(!g||g.type!=='group'||!p)return {ok:false,error:'Csoport nem található.'};const i=p.children.findIndex(n=>n.id===g.id);p.children.splice(i,1,...g.children);g.children.forEach(n=>n.parentId=p.id);state.selection=g.children.map(n=>n.id);return {ok:true};});

  register('history.undo',state=>H.undo(state)?{ok:true}:{ok:false,error:'Nincs visszavonható művelet.'},{history:false});
  register('history.redo',state=>H.redo(state)?{ok:true}:{ok:false,error:'Nincs újra végrehajtható művelet.'},{history:false});
  register('document.validate',state=>{const r=S.validate(state.document);return r.valid?{ok:true,value:r}:{ok:false,error:r.errors.join(' ')};},{history:false});
  window.SanciEditorCommands={register,execute,has:type=>registry.has(type),list:()=>[...registry.keys()]};
})();