/* Sanci9517 Visual Editor — single editor state container. */
(function(){
  const S=window.SanciEditorSchema;
  if(!S) throw new Error('SanciEditorSchema missing');
  function createState(page={}){
    const document=S.emptyDocument(page);
    return {
      document, selection:[], zoom:1, grid:false, snap:true,
      mode:'design', dirty:false, status:'idle',
      history:{past:[],future:[],limit:100},
      runtime:{activeAction:null,lastError:null},
      meta:{createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}
    };
  }
  function cloneState(state){ return S.clone(state); }
  function nodeMap(state){ return S.index(state.document); }
  function getNode(state,id){ return nodeMap(state).get(id)||null; }
  function allNodes(state){ const out=[]; S.walk(state.document?.page?.root,n=>out.push(n)); return out; }
  window.SanciEditorState={createState,cloneState,nodeMap,getNode,allNodes};
})();
