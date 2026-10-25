import assert from 'node:assert/strict';
import test from 'node:test';
import {NODE_TYPES} from '../core/schema.js';
import {getElementCapability,getElementInspectorContract} from '../core/capability-matrix.js';
import {listProperties,registerProperty} from '../core/property-registry.js?v=20261025-inspector-lifecycle-contract';
import {getInspectorValueContract} from '../core/property-values.js';
import {STYLE_MAP} from '../core/canvas-engine.js';

test('every declared type exposes its actual registry fields without certifying readiness',()=>{
 const covered=new Set();
 for(const type of Object.values(NODE_TYPES)){
  const contract=getElementInspectorContract(type),capability=getElementCapability(type);
  assert.equal(contract.acceptance,'NOT_CERTIFIED');assert.equal(contract.status,capability.status);
  const expected=capability.status==='PLANNED'?[]:listProperties({nodeType:type});
  assert.deepEqual(contract.fields.map(f=>f.id),expected.map(p=>p.id),type);
  assert.deepEqual(contract.groups,[...new Set(expected.map(p=>p.group))]);
  for(const [index,field] of contract.fields.entries()){
   covered.add(field.id);assert.ok(field.command);assert.ok(field.control);const property=expected[index];assert.equal(field.command,property.command);assert.equal(field.control,property.type);
   assert.equal(field.scope,property.responsive?'viewport':'node');assert.equal(field.reset,property.responsive?'inherit':'type-specific');
   assert.equal(field.key,property.key??null);assert.deepEqual(field.valueContract,getInspectorValueContract(property));
   assert.equal(field.initialValue.status,Object.hasOwn(property,'defaultValue')?'DECLARED':'NOT_DECLARED');
   assert.equal(field.resetContract.status,property.responsive?'SUPPORTED':'TYPE_SPECIFIC');
   assert.ok(Object.isFrozen(field));assert.ok(Object.isFrozen(field.valueContract));assert.ok(Object.isFrozen(field.resetContract));
  }
  assert.ok(Object.isFrozen(contract));assert.ok(Object.isFrozen(contract.fields));assert.ok(Object.isFrozen(contract.groups));
 }
 assert.deepEqual([...covered].sort(),listProperties().map(p=>p.id).sort());
});
test('Inspector value contracts expose the validator bounds and enumerations without inventing defaults',()=>{
 const byId=id=>getElementInspectorContract('text').fields.find(field=>field.id===id);
 assert.deepEqual(byId('typography.textAlign').valueContract,{kind:'enum',values:['left','center','right','justify'],tokens:[]});
 assert.deepEqual(byId('typography.fontSize').valueContract,{kind:'dimension',units:['px','rem','em','vw'],allowsZero:true,allowsAuto:false,negative:false,tokens:['typography.bodySize','typography.headingSize']});
 assert.deepEqual(byId('typography.lineHeight').valueContract,{kind:'number',min:0.5,max:5,tokens:['typography.lineHeight']});
 assert.deepEqual(byId('content.text').initialValue,{status:'NOT_DECLARED'});
 assert.equal(Object.isFrozen(byId('typography.textAlign').valueContract.values),true);
 const nodeName=getElementInspectorContract('text').fields.find(field=>field.id==='advanced.nodeName');
 assert.equal(nodeName.command,'element.update');assert.equal(nodeName.key,'name');
});
test('unknown, inherited object keys and planned form types never advertise working controls',()=>{
 for(const type of [null,undefined,{},'constructor','toString','__proto__','unknown','form','input']){
  assert.equal(getElementCapability(type).status,'PLANNED');assert.deepEqual(getElementInspectorContract(type).fields,[]);
 }
});
test('every responsive registry field has an explicit Inspector control and Canvas/public style route',()=>{
 const controlTypes=new Set(['asset','box','color','dimension','font','number','select','shadow','text','url']);
 const explicitRoutes={
  // Offsets are adapted to CSS left/top and static nodes become relative.
  x:'canvas-engine offset adapter',y:'canvas-engine offset adapter',
  // Background media is resolved to a safe CSS image by background-asset.js.
  backgroundAssetId:'background-image resolver'
 };
 const properties=listProperties().filter(property=>property.responsive);
 assert.equal(properties.length,65);
 for(const property of properties){
  assert.ok(controlTypes.has(property.type),`${property.id} has a renderer control`);
  assert.ok(property.command,`${property.id} dispatches through an Editor command`);
  assert.ok(property.key,`${property.id} maps to a Page Model style key`);
  assert.ok(Object.hasOwn(STYLE_MAP,property.key)||explicitRoutes[property.key],`${property.id} has a Canvas/public renderer route`);
  if(property.type==='select')assert.ok(property.options?.length,`${property.id} declares selectable values`);
  if(property.type==='dimension')assert.ok(property.units?.length,`${property.id} declares supported units`);
 }
 assert.equal(Object.keys(explicitRoutes).length,3,'all non-standard adapters are listed explicitly');
});
test('type restrictions and new property registration flow through the single registry',()=>{
 assert.ok(getElementInspectorContract('text').fields.some(p=>p.id==='content.text'));
 assert.equal(getElementInspectorContract('image').fields.some(p=>p.id==='content.text'),false);
 const id='test.contract.registered';
 registerProperty({id,group:'typography',label:'Test',type:'number',command:'responsive.set',responsive:true,key:'testContract',appliesTo:['text']});
 assert.equal(getElementInspectorContract('text').fields.find(p=>p.id===id).key,'testContract');
 assert.equal(getElementInspectorContract('image').fields.some(p=>p.id===id),false);
 assert.equal(getElementInspectorContract('form').fields.length,0);
});
