/* Sanci9517 Visual Editor — history independent from rendering. */
(function(){
  const S=window.SanciEditorSchema;
  function snapshot(document){return S.clone(document);}
  function record(state,previousDocument,action=null){state.history.past.push({document:snapshot(previousDocument),action:S.clone(action),at:new Date().toISOString()});if(state.history.past.length>state.history.limit)state.history.past.shift();state.history.future=[];state.dirty=true;state.meta.updatedAt=new Date().toISOString();return state;}
  function undo(state){const entry=state.history.past.pop();if(!entry)return false;state.history.future.push({document:snapshot(state.document),action:entry.action,at:new Date().toISOString()});state.document=snapshot(entry.document);state.selection=[];state.dirty=true;return true;}
  function redo(state){const entry=state.history.future.pop();if(!entry)return false;state.history.past.push({document:snapshot(state.document),action:entry.action,at:new Date().toISOString()});state.document=snapshot(entry.document);state.selection=[];state.dirty=true;return true;}
  function clear(state){state.history.past=[];state.history.future=[];return state;}
  window.SanciEditorHistory={snapshot,record,undo,redo,clear};
})();
