/* Sanci9517 Visual Editor — canonical editor instance. No DOM ownership here. */
(function(){
  const S=window.SanciEditorSchema, State=window.SanciEditorState, Commands=window.SanciEditorCommands;
  if(!S||!State||!Commands)throw new Error('SanciEditor core dependencies missing');
  const state=State.createState();
  const listeners=new Set();
  function emit(){listeners.forEach(fn=>{try{fn(state)}catch(e){console.error(e)}});}
  function dispatch(action){const result=Commands.execute(state,action);if(result.ok)emit();return result;}
  function load(document){const check=S.validate(document);if(!check.valid)throw new Error(check.errors.join(' '));state.document=S.clone(document);state.selection=[];state.history.past=[];state.history.future=[];state.dirty=false;emit();return state;}
  function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}
  function getState(){return state;}
  function can(action){return window.SanciEditorValidation.can(state,action);}
  window.SanciEditor={schemaVersion:S.VERSION,apiVersion:1,state,getState,dispatch,load,subscribe,can,commands:Commands};
})();
