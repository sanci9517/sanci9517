import assert from 'node:assert/strict';
import test from 'node:test';
import {NODE_TYPES} from '../core/schema.js';
import {getElementCapability,getElementInspectorContract} from '../core/capability-matrix.js';
import {listProperties,registerProperty} from '../core/property-registry.js';

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
   assert.equal(field.key,property.key??null);assert.ok(Object.isFrozen(field));
  }
  assert.ok(Object.isFrozen(contract));assert.ok(Object.isFrozen(contract.fields));assert.ok(Object.isFrozen(contract.groups));
 }
 assert.deepEqual([...covered].sort(),listProperties().map(p=>p.id).sort());
});
test('unknown, inherited object keys and planned form types never advertise working controls',()=>{
 for(const type of [null,undefined,{},'constructor','toString','__proto__','unknown','form','input']){
  assert.equal(getElementCapability(type).status,'PLANNED');assert.deepEqual(getElementInspectorContract(type).fields,[]);
 }
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
