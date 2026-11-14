import test from 'node:test';
import assert from 'node:assert/strict';
import {renderStructuredInspector} from '../ui/structured-inspector.js';

class ElementStub {
 constructor(tagName){this.tagName=tagName.toUpperCase();this.dataset={};this.children=[];this.attributes={};this.disabled=false;}
 append(...children){this.children.push(...children);}
 setAttribute(name,value){this.attributes[name]=String(value);}
 click(){if(!this.disabled)this.onclick?.();}
}

test('malformed saved structured content is read-only until explicit recovery',()=>{
 const previous=globalThis.document;
 globalThis.document={createElement:tag=>new ElementStub(tag)};
 try{
  const node={id:'broken-table',type:'table',props:{contentModel:{version:1,rows:[['Fejléc','Megmaradó adat'],['Rövid sor']]}}};
  const original=structuredClone(node.props);let calls=0,recovered;
  const panel=renderStructuredInspector(node,value=>{calls++;recovered=value;return true;});
  const warning=panel.children.find(child=>child.attributes?.role==='alert');
  const reset=panel.children.find(child=>child.dataset?.structuredAction==='reset-invalid');
  assert.equal(warning?.tagName,'P');
  assert.match(warning.textContent,/hibás|támogatott formátum/i);
  assert.deepEqual(panel.children.map(child=>child.tagName),['H3','P','BUTTON'],'invalid content exposes no editing controls');
  assert.deepEqual(node.props,original,'rendering the warning leaves persisted content untouched');
  assert.equal(calls,0,'rendering cannot replace data');
  assert.ok(reset,'the explicit recovery action is visible');
  reset.click();
  assert.equal(calls,1,'only an explicit button click invokes the update callback');
  assert.deepEqual(recovered,{version:1,rows:[['Oszlop 1','Oszlop 2'],['Adat 1','Adat 2']]});

  let lockedCalls=0;
  const locked=renderStructuredInspector({...node,locked:true},()=>{lockedCalls++;});
  const lockedReset=locked.children.find(child=>child.dataset?.structuredAction==='reset-invalid');
  assert.equal(lockedReset.disabled,true);
  lockedReset.click();
  assert.equal(lockedCalls,0,'locked content cannot be reset');
 }finally{
  if(previous===undefined)delete globalThis.document;else globalThis.document=previous;
 }
});
