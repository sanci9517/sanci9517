import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {NODE_TYPES,getPage,getNode,getChildren,validatePage,validateDocument} from '../public/editor-v2/core/schema.js';
import {getElementCapability} from '../public/editor-v2/core/capability-matrix.js';

const source=readFileSync(new URL('../public/editor-v2/app.js',import.meta.url),'utf8');
const palette=source.match(/const groups=\[([\s\S]*?)\n\];/)?.[1]??'';
const paletteTypes=[...palette.matchAll(/NODE_TYPES\.([A-Z_]+)/g)].map(([,key])=>NODE_TYPES[key]);

test('palette entries are unique declared node types with an available add capability',()=>{
 assert.ok(palette,'palette group catalog is present');
 assert.equal(new Set(paletteTypes).size,paletteTypes.length,'a type appears in only one palette group');
 for(const type of paletteTypes){
  assert.ok(type,`palette reference resolves: ${type}`);
  assert.ok(['PARTIAL','PLANNED'].includes(getElementCapability(type).status),`${type} has an explicit capability status`);
 }
});

test('implemented partial types are discoverable and unfinished schema placeholders stay hidden',()=>{
 for(const type of ['divider','badge','quote','panel','overlay','absolute','sticky','tooltip']){
  assert.ok(paletteTypes.includes(type),`${type} is implemented but must be discoverable`);
  assert.equal(getElementCapability(type).status,'PARTIAL');
 }
 assert.ok(!paletteTypes.includes('root'),'the page root cannot be inserted as a child');
 for(const type of ['shorts','sponsor','business','about','sanci-button']){
  assert.ok(!paletteTypes.includes(type),`${type} has no verified creation flow`);
  assert.equal(getElementCapability(type).status,'PLANNED');
 }
 for(const label of ['Divider:','"Badge/Tag":','Quote:','Panel:','Overlay:','Absolute:','Sticky:','Tooltip:'])
  assert.ok(source.includes(label),`${label} has a user-facing description`);
});

test('D-07 malformed Page Model child lists and null nodes return validation errors, not exceptions',()=>{
 const page={id:'page-a',rootId:'root',nodes:{
  root:{id:'root',type:NODE_TYPES.ROOT,parentId:null,children:['child']},
  child:{id:'child',type:NODE_TYPES.TEXT,parentId:'root',children:[]}
 }};
 assert.equal(validatePage(page).length,0,'valid pages retain normal behavior');
 assert.deepEqual(getChildren(page,'root'),[page.nodes.child]);
 page.nodes.root.children={unexpected:'object'};
 page.nodes.child=null;
 assert.deepEqual(getChildren(page,'root'),[],'a corrupt children list cannot crash the Editor tree');
 const errors=validatePage(page);
 assert.ok(errors.includes('children must be an array: root'));
 assert.ok(errors.includes('invalid node: child'));
 assert.ok(validatePage({...page,nodes:[]}).includes('page.nodes must be an object'));
 assert.ok(validatePage({...page,nodes:null}).includes('page.nodes must be an object'));
});

test('D-07 imported inherited page/node identifiers cannot resolve through Object.prototype',()=>{
 const page={id:'page-a',rootId:'root',nodes:{
  root:{id:'root',type:NODE_TYPES.ROOT,parentId:null,children:['__proto__','constructor']}
 }};
 const doc={type:'sanci-page-document',schemaVersion:1,activePageId:'page-a',pages:{'page-a':page}};
 assert.equal(getPage(doc,'__proto__'),null);
 assert.equal(getPage(doc,'constructor'),null);
 assert.equal(getNode(page,'__proto__'),null);
 assert.equal(getNode(page,'constructor'),null);
 assert.deepEqual(getChildren(page,'root'),[]);
 assert.ok(validatePage(page).includes('missing child __proto__ referenced by root'));
 assert.ok(validatePage(page).includes('missing child constructor referenced by root'));
 const corrupt={...doc,activePageId:'__proto__',pages:{'page-a':page,missing:null}};
 const errors=validateDocument(corrupt);
 assert.ok(errors.includes('activePageId must reference an existing page'));
 assert.ok(errors.includes('page missing: page must be an object'));
 assert.ok(validateDocument({...doc,pages:[]}).includes('document.pages must be an object'));
});
