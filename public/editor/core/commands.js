/* Sanci9517 Visual Editor — single mutation/action authority. */
(function(){
  const S=window.SanciEditorSchema, State=window.SanciEditorState, V=window.SanciEditorValidation, H=window.SanciEditorHistory;
  const registry=new Map();
  function register(type,handler,options={}){registry.set(type,{handler,history:options.history!==false});}
  function execute(state,action){
    const command=registry.get(action?.type);if(!command)return {ok:false,error:`Ismeretlen action: ${action?.type||'—'}`};
    const permission=V.can(state,action);if(!permission.ok)return {ok:false,error:permission.reason};
    const before=S.clone(state.document);const result=command.handler(state,action);
    if(!result?.ok)return result||{ok:false,error:'A művelet sikertelen.'};
    if(command.history)H.record(state,before,action);
    state.runtime.lastError=null;return {ok:true,state,value:result.value};
  }
  function selection(state,ids){state.selection=[...new Set(ids||[])].filter(id=>State.getNode(state,id));return {ok:true};}
  register('selection.set',(state,a)=>selection(state,a.ids||[]),{history:false});
  register('selection.clear',state=>selection(state,[]),{history:false});
  register('hierarchy.reparent',(state,a)=>{const child=State.getNode(state,a.id),old=V.parentOf(state,a.id),parent=State.getNode(state,a.parentId);if(old)old.children=old.children.filter(x=>x.id!==child.id);child.parentId=parent.id;parent.children.push(child);return {ok:true};});
  register('hierarchy.addChild',(state,a)=>{const child=State.getNode(state,a.id),parent=State.getNode(state,a.parentId);if(!child||!parent)return {ok:false,error:'Elem vagy parent nem található.'};const old=V.parentOf(state,child.id);if(old)old.children=old.children.filter(x=>x.id!==child.id);child.parentId=parent.id;parent.children.push(child);return {ok:true};});
  register('hierarchy.removeChild',(state,a)=>{const child=State.getNode(state,a.id),old=V.parentOf(state,a.id);if(!child||!old)return {ok:false,error:'Elem vagy parent nem található.'};old.children=old.children.filter(x=>x.id!==child.id);const root=state.document.page.root;child.parentId=root.id;root.children.push(child);return {ok:true};});
  register('element.delete',(state,a)=>{const node=State.getNode(state,a.id),parent=V.parentOf(state,a.id);if(!node||!parent)return {ok:false,error:'Törlendő elem nem található.'};parent.children=parent.children.filter(x=>x.id!==node.id);return {ok:true};});
  register('element.content.set',(state,a)=>{const node=State.getNode(state,a.id);if(!node)return {ok:false,error:'Elem nem található.'};node.content={...node.content,...(a.patch||{})};return {ok:true};});
  register('element.style.set',(state,a)=>{const node=State.getNode(state,a.id);if(!node)return {ok:false,error:'Elem nem található.'};node.style={...node.style,...(a.patch||{})};return {ok:true};});
  register('element.layout.set',(state,a)=>{const node=State.getNode(state,a.id);if(!node)return {ok:false,error:'Elem nem található.'};node.layout={...node.layout,...(a.patch||{})};return {ok:true};});
  register('history.undo',state=>H.undo(state)?{ok:true}:{ok:false,error:'Nincs visszavonható művelet.'},{history:false});
  register('history.redo',state=>H.redo(state)?{ok:true}:{ok:false,error:'Nincs újra végrehajtható művelet.'},{history:false});
  register('document.validate',state=>{const result=S.validate(state.document);return result.valid?{ok:true,value:result}:{ok:false,error:result.errors.join(' ')};},{history:false});
  window.SanciEditorCommands={register,execute,has:type=>registry.has(type),list:()=>[...registry.keys()]};
})();
