import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeWorkspaceDockTree,workspaceDockTreeSignature} from '../ui/workspace-dock-tree.js';
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

  const raw=serializeWorkspaceProfile({id:'profile-tree',name:'Rekurzív panelok',appearance:{dockTree:tree}});
  assert.deepEqual(parseWorkspaceProfileTransfer(raw).appearance.dockTree,tree);
  appearance.destroy();
});
