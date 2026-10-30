import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import test from 'node:test';
const app=readFileSync(new URL('../public/editor-v2/app.js',import.meta.url),'utf8');
function fixture(locked=false){
 const batches=[];let renders=0;
 const element=()=>({children:[],dataset:{},attributes:{},append(...xs){this.children.push(...xs)},setAttribute(k,v){this.attributes[k]=v}});
 const context={document:{createElement:element},state:{viewport:{device:'desktop'}},page:()=>({id:'page'}),resolveResponsiveValue:()=>({value:16}),validHexColor:()=>false,isNodeEffectivelyLocked:(_page,node)=>Boolean(node?.locked),executeBatch:(_s,commands)=>batches.push(commands),render:()=>renders++,setStatus:()=>{}};
 runInNewContext(app.slice(app.indexOf('function renderMultiInspector('),app.indexOf('function renderExistingContentInspector('))+';this.make=renderMultiInspector',context);
 const panel=context.make([{id:'a',locked},{id:'b',locked:false}]);
 const field=key=>{const row=panel.children.find(el=>el.dataset?.propertyId===key);return {row,input:row.children.find(el=>el.type==='number'),error:row.children.find(el=>el.className==='property-validation')}};
 return {field,batches,get renders(){return renders}};
}
test('invalid shared numeric edits explain rejection and preserve all selected nodes',()=>{
 const f=fixture();for(const [key,value] of [['width',''],['width','2001'],['padding','-1'],['opacity','1.1'],['width','NaN']]){
  const {input,error}=f.field(key);input.value=value;input.oninput();input.onchange();
  assert.equal(input.attributes['aria-invalid'],'true');assert.match(error.textContent,/közötti számot/);assert.equal(input.attributes['aria-describedby'],error.id);
 }
 assert.equal(f.batches.length,0);assert.equal(f.renders,0);
});
test('repair clears validation and applies one atomic batch; locked fields stay disabled',()=>{
 const f=fixture(),{input,error}=f.field('opacity');input.value='2';input.oninput();input.value='0.5';input.oninput();
 assert.equal(error.textContent,'');assert.equal(input.attributes['aria-invalid'],'false');input.onchange();
 assert.equal(f.batches.length,1);assert.equal(f.renders,1);assert.deepEqual(JSON.parse(JSON.stringify(f.batches[0])),['a','b'].map(nodeId=>({type:'responsive.set',payload:{nodeId,device:'desktop',patch:{opacity:0.5}}})));
 assert.equal(fixture(true).field('width').input.disabled,true);
});
