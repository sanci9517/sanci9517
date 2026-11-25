import test from 'node:test';
import assert from 'node:assert/strict';
import {renderStructuredInspector} from '../ui/structured-inspector.js';
import {malformedElementContentRowIndexes} from '../core/element-content.js';

class ElementStub {
 constructor(tagName){this.tagName=tagName.toUpperCase();this.dataset={};this.children=[];this.attributes={};this.disabled=false;}
 append(...children){this.children.push(...children);}
 setAttribute(name,value){this.attributes[name]=String(value);}
 getAttribute(name){return this.attributes[name]??null;}
 removeAttribute(name){delete this.attributes[name];}
 addEventListener(){}
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

test('structured table, tabs, accordion, gallery and carousel expose an independently persisted accessible name field',()=>{
 const previous=globalThis.document;
 globalThis.document={createElement:tag=>new ElementStub(tag),createTextNode:text=>({textContent:String(text)})};
 try{
  const models={table:{version:1,rows:[['Fejléc'],['Adat']]},tabs:{version:1,items:[{label:'Első',content:'Tartalom'}]},
   accordion:{version:1,items:[{label:'Első kérdés',content:'Válasz'}]},
   gallery:{version:1,items:[{src:'/image.jpg',alt:'Kép',caption:''}]},carousel:{version:1,items:[{label:'Első',content:'Tartalom',src:'',alt:''}]}};
  for(const [type,initial] of [['table','Táblázat a műhelyből'],['tabs','Műhely témái'],['accordion','Gyakori kérdések'],['gallery','Képek a műhelyből'],['carousel','Kiemelt pillanatok']]){
   const node={id:type,type,props:{ariaLabel:initial,contentModel:models[type]}};
   let changed;const panel=renderStructuredInspector(node,()=>true,{updateProperties:patch=>{changed=patch;return true}});
   const field=panel.children.find(child=>child.dataset?.inspectorKey==='props.ariaLabel');
   assert.ok(field,`${type} exposes the independent accessible name control`);
   assert.deepEqual({command:field.dataset.inspectorCommand,key:field.dataset.inspectorKey},{command:'element.update',key:'props.ariaLabel'});
   const editor=field.children.find(child=>child.tagName==='INPUT');
   assert.equal(editor.attributes['aria-label'],'Akadálymentes elnevezés');assert.equal(editor.maxLength,160);assert.equal(editor.value,initial);
   editor.value='Új elnevezés';editor.oninput({isComposing:false});
   assert.deepEqual(changed,{ariaLabel:'Új elnevezés'},`${type} persists the name as node props, outside the structured content model`);
   let lockedWrite=false;const locked=renderStructuredInspector({...node,locked:true},()=>true,{updateProperties:()=>{lockedWrite=true;return true}});
   const lockedInput=locked.children.find(child=>child.dataset?.inspectorKey==='props.ariaLabel').children.find(child=>child.tagName==='INPUT');
   assert.equal(lockedInput.disabled,true);lockedInput.oninput?.({isComposing:false});assert.equal(lockedWrite,false,'locked nodes cannot change the accessible name');
  }
  const malformed={toString(){throw Error('must not coerce saved object values')}},node={id:'malformed-name',type:'gallery',props:{ariaLabel:malformed,contentModel:{version:1,items:[{src:'/image.jpg',alt:'Kép',caption:''}]}}};
  let writes=0;const panel=renderStructuredInspector(node,()=>true,{updateProperties:()=>{writes++;return true}});
  const editor=panel.children.find(child=>child.dataset?.inspectorKey==='props.ariaLabel').children.find(child=>child.tagName==='INPUT');
  assert.equal(editor.value,'','malformed persisted name data is displayed safely as an empty field');
  assert.equal(node.props.ariaLabel,malformed,'displaying a malformed name does not mutate the persisted node');
  assert.equal(writes,0,'a render alone cannot repair or write malformed names');
 }finally{
  if(previous===undefined)delete globalThis.document;else globalThis.document=previous;
 }
});

test('structured Accordion behavior controls persist only explicit Page Model properties and respect locks',()=>{
 const previous=globalThis.document;
 globalThis.document={createElement:tag=>new ElementStub(tag),createTextNode:text=>({textContent:String(text)})};
 try{
  const node={id:'behavior',type:'accordion',props:{contentModel:{version:1,items:[{label:'Első',content:'Válasz'}]}}};
  const original=structuredClone(node.props);let writes=[];
  const panel=renderStructuredInspector(node,()=>true,{updateProperties:(props,options)=>{writes.push({props,options});return true}});
  const field=key=>panel.children.find(child=>child.dataset?.inspectorKey===`props.${key}`);
  const single=field('singleOpen'),openFirst=field('openFirst');
  assert.ok(single&&openFirst,'the Accordion Inspector exposes both documented behavior controls');
  assert.deepEqual([single.dataset.inspectorCommand,single.dataset.inspectorKey],['element.update','props.singleOpen']);
  assert.deepEqual([openFirst.dataset.inspectorCommand,openFirst.dataset.inspectorKey],['element.update','props.openFirst']);
  const checkbox=control=>control.children.find(child=>child.tagName==='INPUT');
  assert.equal(checkbox(single).checked,false,'single-open defaults off');
  assert.equal(checkbox(openFirst).checked,true,'the legacy first-open default stays enabled');
  assert.deepEqual(writes,[],'opening the Inspector is read-only');
  checkbox(single).checked=true;checkbox(single).onchange();
  checkbox(openFirst).checked=false;checkbox(openFirst).onchange();
  assert.deepEqual(writes,[{props:{singleOpen:true},options:undefined},{props:{openFirst:false},options:undefined}],
   'each toggle updates its own node property rather than the content model');
  assert.deepEqual(node.props,original,'editing controls do not mutate the input snapshot');

  const locked=renderStructuredInspector({...node,locked:true},()=>true,{updateProperties:()=>{throw Error('locked write')}});
  for(const key of ['singleOpen','openFirst']){
   const input=checkbox(locked.children.find(child=>child.dataset?.inspectorKey===`props.${key}`));
   assert.equal(input.disabled,true,`${key} is disabled for a locked node`);
   input.checked=!input.checked;input.onchange();
  }
  const rejected=renderStructuredInspector(node,()=>true,{updateProperties:()=>false});
  for(const [key,expected] of [['singleOpen',false],['openFirst',true]]){
   const input=checkbox(rejected.children.find(child=>child.dataset?.inspectorKey===`props.${key}`));
   input.checked=!expected;input.onchange();assert.equal(input.checked,expected,`${key} restores its prior value when the command rejects`);
  }
 }finally{
  if(previous===undefined)delete globalThis.document;else globalThis.document=previous;
 }
});

test('malformed saved repeater rows remain read-only until an explicit default replacement',()=>{
 assert.deepEqual(malformedElementContentRowIndexes('list',{version:1,items:['Megtartott sor',null,'Másik sor']}),[1]);
 assert.deepEqual(malformedElementContentRowIndexes('list',{version:1,items:[null,{},['tömb']]}),[0,1,2]);
 assert.deepEqual(malformedElementContentRowIndexes('tabs',{version:1,items:[{label:'Megmarad',content:'Tartalom'},[],null]}),[1,2]);
 assert.deepEqual(malformedElementContentRowIndexes('accordion',{version:1,items:[{label:'Kérdés',content:[]},{label:null,content:'Megengedett üres érték'}]}),[0]);
 assert.deepEqual(malformedElementContentRowIndexes('gallery',{version:1,items:[{src:'/kep.jpg',alt:{}}]}),[0]);
 assert.deepEqual(malformedElementContentRowIndexes('carousel',{version:1,items:[{label:'Dia',content:'Tartalom',src:'/kep.jpg',alt:[]}]}),[0]);
 assert.deepEqual(malformedElementContentRowIndexes('table',{version:1,rows:[['Fejléc','Megmarad'],[{rich:'nem szöveg'},'Második']]}),[1]);
 assert.deepEqual(malformedElementContentRowIndexes('table',{version:1,rows:[['Fejléc','Megmarad'],[['tömb'],'Második']]}),[1]);
 assert.deepEqual(malformedElementContentRowIndexes('table',{version:1,rows:[['Fejléc','Megmarad'],[null,undefined]]}),[],'intentional blank cells remain valid');
 assert.deepEqual(malformedElementContentRowIndexes('gallery',{version:1,items:[{src:'',alt:'Üres, de érvényes',caption:''}]}),[]);
 const previous=globalThis.document;
 globalThis.document={createElement:tag=>new ElementStub(tag)};
 try{
  const node={id:'legacy-list',type:'list',props:{contentModel:{version:1,ordered:true,items:['Első megtartandó sor',null,'Harmadik megtartandó sor']}}};
  const original=structuredClone(node.props.contentModel);let calls=0,repaired;
  const panel=renderStructuredInspector(node,value=>{calls++;repaired=value;return true;});
  const warning=panel.children.find(child=>child.attributes?.role==='alert');
  const repair=panel.children.find(child=>child.dataset?.structuredAction==='repair-invalid-rows');
  assert.equal(warning?.tagName,'P');
  assert.match(warning.textContent,/2\. sora.*nem támogatott/);
  assert.match(warning.textContent,/zárolva marad/);
  assert.deepEqual(panel.children.map(child=>child.tagName),['H3','P','BUTTON'],'a malformed repeater exposes no ordinary editing actions');
  assert.deepEqual({command:repair.dataset.inspectorCommand,key:repair.dataset.inspectorKey},{command:'element.update',key:'props.contentModel.items'},'recovery uses the audited Page Model command route');
  assert.deepEqual(node.props.contentModel,original,'the warning path does not mutate the persisted record');
  assert.equal(calls,0,'opening the Inspector never repairs data implicitly');
  assert.ok(repair);
  repair.click();
  assert.equal(calls,1,'the explicit action is the only write path');
  assert.deepEqual(repaired,{version:1,ordered:true,items:['Első megtartandó sor','','Harmadik megtartandó sor']});
  assert.deepEqual(node.props.contentModel,original,'repair produces a new model without mutating the old snapshot');

  let lockedCalls=0;
  const locked=renderStructuredInspector({...node,locked:true},()=>{lockedCalls++;});
  const lockedRepair=locked.children.find(child=>child.dataset?.structuredAction==='repair-invalid-rows');
  assert.equal(lockedRepair.disabled,true);
  lockedRepair.click();
  assert.equal(lockedCalls,0,'locked content cannot use the recovery action');

  const brokenTable={version:1,rows:[['Fejléc','Megmarad'],[{legacy:{value:'nem menthető cella'}},'További adat']]};
  let tableRepair;
  const tablePanel=renderStructuredInspector({id:'broken-table',type:'table',props:{contentModel:brokenTable}},value=>{tableRepair=value;return true;});
  const tableAction=tablePanel.children.find(child=>child.dataset?.structuredAction==='repair-invalid-rows');
  assert.match(tablePanel.children.find(child=>child.attributes?.role==='alert').textContent,/2\. sora.*nem támogatott/);
  assert.deepEqual({command:tableAction.dataset.inspectorCommand,key:tableAction.dataset.inspectorKey},{command:'element.update',key:'props.contentModel.rows'},'table recovery addresses the rows collection');
  assert.deepEqual(brokenTable.rows[1][0],{legacy:{value:'nem menthető cella'}},'opening recovery does not mutate the original non-text value');
  tableAction.click();
  assert.deepEqual(tableRepair,{version:1,rows:[['Fejléc','Megmarad'],['Oszlop 1','Oszlop 2']]},'explicit repair replaces only the malformed table row');
 }finally{
  if(previous===undefined)delete globalThis.document;else globalThis.document=previous;
 }
});
