/* Sanci9517 Visual Editor — central operation validation. */
(function(){
  const S=window.SanciEditorSchema;
  const State=window.SanciEditorState;
  function parentOf(state,id){const map=State.nodeMap(state);let result=null;map.forEach(n=>(n.children||[]).some(c=>{if(c.id===id){result=n;return true}return false}));return result;}
  function isDescendant(state,ancestorId,id){const ancestor=State.getNode(state,ancestorId);let found=false;S.walk(ancestor, n=>{if(n.id===id)found=true});return found&&ancestorId!==id;}
  function can(state,action){
    if(!action||!action.type)return {ok:false,reason:'Hiányzó művelettípus.'};
    const ids=action.ids||[]; const target=action.id?State.getNode(state,action.id):null;
    if(['move','resize','delete','duplicate','style.set','layout.set','content.set','visibility.set','lock.set'].some(x=>action.type===`element.${x}`||action.type===x)){
      if(!target && !ids.length)return {ok:false,reason:'A cél elem nem található.'};
    }
    if(target?.locked && !['element.lock.set'].includes(action.type))return {ok:false,reason:'A zárolt elem nem módosítható.'};
    if(action.type==='hierarchy.reparent'){
      const child=State.getNode(state,action.id),parent=State.getNode(state,action.parentId);
      if(!child||!parent)return {ok:false,reason:'Hiányzó elem vagy cél parent.'};
      if(child.id===parent.id)return {ok:false,reason:'Elem nem helyezhető önmagába.'};
      if(isDescendant(state,child.id,parent.id))return {ok:false,reason:'Elem nem helyezhető saját leszármazottjába.'};
      if(parent.type==='text'||parent.type==='heading'||parent.type==='button'||parent.type==='image')return {ok:false,reason:'Ez az elem nem lehet parent.'};
    }
    return {ok:true};
  }
  function validateDocument(document){return S.validate(document);}
  window.SanciEditorValidation={parentOf,isDescendant,can,validateDocument};
})();
