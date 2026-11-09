import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorkspaceDockTree,moveWorkspaceDockTreeLeaf,normalizeWorkspaceDockTree,workspaceDockTreeSignature} from '../ui/workspace-dock-tree.js';
import {WORKSPACE_PREFERENCES_KEY,mountWorkspaceAppearance,normalizeWorkspacePreferences,parseWorkspaceProfileTransfer,serializeWorkspaceProfile} from '../ui/workspace-appearance.js';

const tree={id:'root',kind:'split',axis:'horizontal',ratio:0.28,children:[
  {id:'left',kind:'panel',side:'left'},
  {id:'main',kind:'split',axis:'horizontal',ratio:0.7,children:[
    {id:'canvas',kind:'canvas'},
    {id:'right',kind:'panel',side:'right'},
  ]},
]};

test('workspace dock tree supports nested split and tab groups while preserving every required surface',()=>{
  const valid={id:'root',kind:'split',axis:'horizontal',ratio:0.25,children:[
    {id:'tools',kind:'tabs',activeId:'left',children:[{id:'left',kind:'panel',side:'left'},{id:'right',kind:'panel',side:'right'}]},
    {id:'canvas',kind:'canvas'},
  ]};
  assert.deepEqual(normalizeWorkspaceDockTree(valid),valid);
  assert.equal(normalizeWorkspaceDockTree({ ...valid, children:[valid.children[0],{id:'canvas',kind:'canvas'},{id:'extra',kind:'panel',side:'right'}] }),null);
});

test('dock tree normalization rejects unsafe IDs, duplicate leaves, hidden canvas tabs, invalid splits and resource exhaustion',()=>{
  const badTrees=[
    {...tree,id:'bad id'},
    {...tree,children:[tree.children[0],tree.children[0]]},
    {id:'root',kind:'tabs',activeId:'canvas',children:[{id:'canvas',kind:'canvas'},{id:'left',kind:'panel',side:'left'},{id:'right',kind:'panel',side:'right'}]},
    {id:'root',kind:'tabs',activeId:'missing',children:[{id:'left',kind:'panel',side:'left'},{id:'right',kind:'panel',side:'right'},{id:'canvas',kind:'canvas'}]},
    {...tree,axis:'diagonal'},
    {...tree,ratio:0.99},
  ];
  for(const invalid of badTrees)assert.equal(normalizeWorkspaceDockTree(invalid),null);
  let deep={id:'canvas',kind:'canvas'};
  for(let index=0;index<10;index++)deep={id:`split-${index}`,kind:'split',axis:'horizontal',ratio:0.5,children:[deep,{id:`panel-${index}`,kind:'panel',side:index%2?'left':'right'}]};
  assert.equal(normalizeWorkspaceDockTree(deep),null,'depth and node limits bound imported profile work');
});

test('dock tree signature uses only validated canonical data',()=>{
  assert.equal(workspaceDockTreeSignature(tree),JSON.stringify(tree));
  assert.equal(workspaceDockTreeSignature({...tree,unsafe:'ignored'}),JSON.stringify(tree));
  assert.equal(workspaceDockTreeSignature({id:'root',kind:'split'}),'');
});

test('first dock tree follows each saved dock order and selected panel grouping without hiding the canvas',()=>{
  const orders=['left-canvas-right','canvas-left-right','left-right-canvas','right-left-canvas','right-canvas-left','canvas-right-left'];
  for(const dockOrder of orders){
    const created=createWorkspaceDockTree({dockOrder},{leftWidth:460,rightWidth:440});
    assert.ok(created,dockOrder);
    assert.deepEqual(normalizeWorkspaceDockTree(created),created,dockOrder);
    const leaves=[];
    const visit=node=>{if(node.kind==='panel')leaves.push(node.side);else if(node.kind==='canvas')leaves.push('canvas');else node.children.forEach(visit)};
    visit(created);
    assert.deepEqual(leaves,dockOrder.split('-'),dockOrder);
    const canvasShare=node=>node.kind==='canvas'?1:node.kind==='panel'?0:node.kind==='tabs'?0:node.ratio*canvasShare(node.children[0])+(1-node.ratio)*canvasShare(node.children[1]);
    assert.ok(1025*canvasShare(created)-16>=400,dockOrder,'wide-desktop starting ratios leave the planned 400px canvas after separator hit areas');
  }
  for(const panelMode of ['tabbed','floating'])for(const panelSide of ['left','right']){
    const grouped=createWorkspaceDockTree({panelMode,panelSide,dockOrder:'right-canvas-left'},{leftWidth:460,rightWidth:440});
    assert.ok(grouped,`${panelMode}/${panelSide}`);
    const tabs=grouped.children.find(node=>node.kind==='tabs');
    assert.equal(tabs?.activeId,panelSide,`${panelMode}/${panelSide}`);
    assert.deepEqual(tabs?.children.map(node=>node.side),['left','right']);
    assert.ok(grouped.children.some(node=>node.kind==='canvas'));
    const canvasShare=node=>node.kind==='canvas'?1:node.kind==='panel'?0:node.kind==='tabs'?0:node.ratio*canvasShare(node.children[0])+(1-node.ratio)*canvasShare(node.children[1]);
    assert.ok(1025*canvasShare(grouped)-8>=400,`${panelMode}/${panelSide} starting layout preserves the 400px canvas`);
  }
  assert.equal(createWorkspaceDockTree({dockOrder:'canvas-right-left;danger'}),null);
});

test('dock-tree moves split leaves, group only two panels as tabs, and reject moves that would hide the canvas',()=>{
  const beside=moveWorkspaceDockTreeLeaf(tree,'right','canvas','after',{axis:'vertical',before:false});
  assert.ok(beside);
  assert.deepEqual(beside.children[1],{
    id:'split-right-canvas',kind:'split',axis:'vertical',ratio:0.5,
    children:[{id:'canvas',kind:'canvas'},{id:'right',kind:'panel',side:'right'}],
  });
  const grouped=moveWorkspaceDockTreeLeaf(tree,'left','right','tab');
  assert.ok(grouped);
  const find=node=>node.id==='tabs-left-right'?node:node.children?.map(find).find(Boolean);
  assert.deepEqual(find(grouped),{id:'tabs-left-right',kind:'tabs',activeId:'left',children:[{id:'left',kind:'panel',side:'left'},{id:'right',kind:'panel',side:'right'}]});
  assert.equal(moveWorkspaceDockTreeLeaf(tree,'canvas','right','tab'),null);
  assert.equal(moveWorkspaceDockTreeLeaf(tree,'left','left','after'),null);
  assert.deepEqual(tree,{
    id:'root',kind:'split',axis:'horizontal',ratio:0.28,children:[
      {id:'left',kind:'panel',side:'left'},
      {id:'main',kind:'split',axis:'horizontal',ratio:0.7,children:[{id:'canvas',kind:'canvas'},{id:'right',kind:'panel',side:'right'}]},
    ],
  },'tree operations do not mutate saved input');
});

test('nested dock tree survives preference persistence, Undo/Redo and portable profile transfer',()=>{
  const saved=new Map(),storage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,String(value))};
  const root={dataset:{},style:{setProperty(){}},matches:()=>true};
  const documentRef={defaultView:{localStorage:storage,addEventListener(){},removeEventListener(){}},querySelector:()=>null};
  const appearance=mountWorkspaceAppearance({documentRef,root});
  assert.equal(appearance.setDockTree(tree),true);
  assert.deepEqual(appearance.value.dockTree,tree);
  assert.deepEqual(JSON.parse(root.dataset.workspaceDockTree),tree);
  assert.deepEqual(normalizeWorkspacePreferences(JSON.parse(saved.get(WORKSPACE_PREFERENCES_KEY))).dockTree,tree);
  assert.equal(appearance.undo(),true);
  assert.equal(appearance.value.dockTree,undefined);
  assert.equal('workspaceDockTree' in root.dataset,false);
  assert.equal(appearance.redo(),true);
  assert.deepEqual(appearance.value.dockTree,tree);
  assert.equal(appearance.setDockTree({id:'bad',kind:'canvas'}),false,'invalid imported groups never replace the last good layout');
  assert.equal(appearance.setDockTree(null),true,'the user can return to the legacy classic dock layout');
  assert.equal(appearance.value.dockTree,undefined);
  assert.equal(appearance.undo(),true);
  assert.deepEqual(appearance.value.dockTree,tree);
  assert.equal(appearance.redo(),true);
  assert.equal(appearance.value.dockTree,undefined);

  const raw=serializeWorkspaceProfile({id:'profile-tree',name:'Rekurzív panelok',appearance:{dockTree:tree}});
  assert.deepEqual(parseWorkspaceProfileTransfer(raw).appearance.dockTree,tree);
  appearance.destroy();
});
