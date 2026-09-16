/* Sanci9517 Visual Editor — history independent from rendering. */
(function(){
  const S=window.SanciEditorSchema;
  function snapshot(state){return S.clone(state.document);}
  function commit(state,document,meta={}){state.history.past.push({document:snapshot({document}),action:meta.action||null,at:new Date().toISOString()});if(state.history.past.length>state.history.limit)state.history.past.shift();state.history.future=[];state.document=document;state.dirty=true;state.meta.updatedAt=new Date().toISOString();return state;}
  function undo(state){const entry=state.history.past.pop();if(!entry)return false;state.history.future.push({document:snapshot({document:state.document}),action:entry.action,at:new Date().toISOString()});state.document=S.clone(entry.document);state.selection=[];state.dirty=true;return true;}
  function redo(state){const entry=state.history.future.pop();if(!entry)return false;state.history.past.push({document:snapshot({document:state.document}),action:entry.action,at:new Date().toISOString()});state.document=S.clone(entry.document);state.selection=[];state.dirty=true;return true;}
  function clear(state){state.history.past=[];state.history.future=[];return state;}
  window.SanciEditorHistory={snapshot,commit,undo,redo,clear};
})();
