import assert from 'node:assert/strict';
import test from 'node:test';
import {NODE_TYPES} from '../core/schema.js';
import {getElementCapability,getElementInspectorContract} from '../core/capability-matrix.js';
import {getProperty,listProperties,registerProperty} from '../core/property-registry.js?v=20261030-inspector-value-metadata-contract';
import {getInspectorValueContract,normalizeInspectorValue} from '../core/property-values.js';
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
   assert.deepEqual(field.layoutContext,property.layoutContext??null);
   assert.equal(field.initialValue.status,Object.hasOwn(property,'defaultValue')?'DECLARED':'NOT_DECLARED');
   if(property.responsive){assert.equal(field.initialValue.source.strategy,'resolved-style');assert.equal(field.initialValue.source.key,property.key);assert.deepEqual(field.initialValue.source.precedence,['responsive-cascade','node.style','authored-content-default']);}
   else if(property.id==='content.text')assert.deepEqual(field.initialValue.source,{strategy:'node-props',keys:['text','content'],fallback:'node.name'});
   else if(property.id==='content.href')assert.deepEqual(field.initialValue.source,{strategy:'node-props',keys:['href'],fallback:'empty'});
   else assert.deepEqual(field.initialValue.source,{strategy:'node-field',key:'name',fallback:'node.type'});
   assert.ok(Object.isFrozen(field.initialValue.source));
   assert.equal(field.resetContract.status,property.responsive?'SUPPORTED':'TYPE_SPECIFIC');
   assert.ok(Object.isFrozen(field));assert.ok(Object.isFrozen(field.valueContract));assert.ok(Object.isFrozen(field.resetContract));
  }
  assert.ok(Object.isFrozen(contract));assert.ok(Object.isFrozen(contract.fields));assert.ok(Object.isFrozen(contract.groups));
 }
 assert.deepEqual([...covered].sort(),listProperties().map(p=>p.id).sort());
});
test('root Inspector does not advertise overflow that the public page must keep visible',()=>{
 const overflow=getProperty('layout.overflow');
 assert.equal(overflow.appliesTo.includes(NODE_TYPES.ROOT),false);
 assert.equal(getElementInspectorContract(NODE_TYPES.ROOT).fields.some(field=>field.id==='layout.overflow'),false);
 assert.equal(getElementInspectorContract(NODE_TYPES.CONTAINER).fields.some(field=>field.id==='layout.overflow'),true,'ordinary layout nodes retain the responsive overflow control');
});
test('root Inspector hides flex/grid item fields because its published wrapper is normal flow',()=>{
 const itemFields=['flex.grow','flex.shrink','flex.basis','flex.alignSelf','grid.column','grid.row'];
 const rootFields=getElementInspectorContract(NODE_TYPES.ROOT).fields.map(field=>field.id);
 const containerFields=getElementInspectorContract(NODE_TYPES.CONTAINER).fields.map(field=>field.id);
 for(const id of itemFields){
  assert.equal(getProperty(id).appliesTo.includes(NODE_TYPES.ROOT),false,`${id}: root is not an applicable flex/grid item`);
  assert.equal(rootFields.includes(id),false,`${id}: root Inspector hides the ineffective control`);
  assert.equal(containerFields.includes(id),true,`${id}: non-root elements retain the context-sensitive item control`);
 }
});
test('Inspector value contracts expose the validator bounds and enumerations without inventing defaults',()=>{
 const byId=id=>getElementInspectorContract('text').fields.find(field=>field.id===id);
 assert.deepEqual(byId('typography.textAlign').valueContract,{kind:'enum',values:['left','center','right','justify'],tokens:[],required:true,trimmed:true});
 assert.deepEqual(byId('typography.fontSize').valueContract,{kind:'dimension',units:['px','rem','em','vw'],allowsZero:true,allowsAuto:false,negative:false,tokens:['typography.bodySize','typography.headingSize'],required:true,trimmed:true});
 assert.deepEqual(byId('typography.lineHeight').valueContract,{kind:'number',min:0.5,max:5,step:0.1,tokens:['typography.lineHeight'],required:true,trimmed:true});
 assert.deepEqual(byId('background.color').valueContract,{kind:'color',formats:['hex','transparent'],hexDigitCounts:[3,4,6,8],tokens:['colors.primary','colors.text','colors.surface','colors.border'],required:true,trimmed:true});
 assert.deepEqual(byId('position.zIndex').valueContract,{kind:'number',min:-9999,max:9999,step:1,integer:true,tokens:[],required:true,trimmed:true});
 assert.deepEqual(byId('transform.scale').valueContract,{kind:'number',min:0.1,max:4,step:0.1,tokens:[],required:true,trimmed:true});
 assert.deepEqual(byId('flex.grow').valueContract,{kind:'number',min:0,max:100,step:'any',tokens:[],required:true,trimmed:true});
 assert.equal(byId('size.width').valueContract.negative,false,'ordinary dimensions are non-negative');
 assert.equal(byId('size.width').valueContract.allowsZero,true);
 assert.deepEqual({min:byId('transform.rotate').valueContract.min,max:byId('transform.rotate').valueContract.max},{min:-360,max:360});
 assert.equal(byId('position.x').valueContract.negative,true,'canvas offsets retain signed values');
 const spacingTokens=['spacing.small','spacing.medium','spacing.large'];
 assert.deepEqual(byId('spacing.margin').valueContract,{kind:'box',maxParts:4,units:['px','%','vh','vw','rem','em'],allowsAuto:true,negativeMargin:true,negativePadding:false,tokens:spacingTokens,required:true,trimmed:true});
 assert.deepEqual(byId('spacing.padding').valueContract,{kind:'box',maxParts:4,units:['px','%','vh','vw','rem','em'],allowsAuto:false,negativeMargin:false,negativePadding:false,tokens:spacingTokens,required:true,trimmed:true});
 assert.deepEqual(byId('content.text').valueContract,{kind:'text',multiline:true,tokens:[],required:false,trimmed:false});
 assert.deepEqual(byId('content.text').initialValue,{status:'NOT_DECLARED',source:{strategy:'node-props',keys:['text','content'],fallback:'node.name'}});
 assert.equal(Object.isFrozen(byId('typography.textAlign').valueContract.values),true);
 const nodeName=getElementInspectorContract('text').fields.find(field=>field.id==='advanced.nodeName');
 assert.equal(nodeName.command,'element.update');assert.equal(nodeName.key,'name');
});
test('Inspector value contracts match required, trimming, and literal content-text semantics',()=>{
 for(const property of listProperties()){
  const contract=getInspectorValueContract(property);
  const literalContent=property.id==='content.text';
  assert.equal(contract.required,!literalContent,property.id);
  assert.equal(contract.trimmed,!literalContent,property.id);
  if(literalContent){
   assert.equal(contract.multiline,true);
   assert.equal(normalizeInspectorValue(property,''),'');
   assert.equal(normalizeInspectorValue(property,'   '),'   ');
   assert.equal(normalizeInspectorValue(property,'  hello  '),'  hello  ');
  }else assert.throws(()=>normalizeInspectorValue(property,'   '),undefined,property.id);
 }
 assert.equal(normalizeInspectorValue(getProperty('typography.textAlign'),' center '),'center');
 assert.equal(normalizeInspectorValue(getProperty('typography.fontSize'),' 24px '),'24px');
 assert.equal(normalizeInspectorValue(getProperty('advanced.nodeName'),' hello '),'hello');
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
 assert.equal(getElementInspectorContract('richtext').fields.some(p=>p.id==='content.text'),false,'Rich Text uses its structured editor contract instead of a plain-text field');
 assert.equal(getElementInspectorContract('image').fields.some(p=>p.id==='content.text'),false);
 const id='test.contract.registered';
 registerProperty({id,group:'typography',label:'Test',type:'number',command:'responsive.set',responsive:true,key:'testContract',appliesTo:['text']});
 assert.equal(getElementInspectorContract('text').fields.find(p=>p.id===id).key,'testContract');
 assert.equal(getElementInspectorContract('image').fields.some(p=>p.id===id),false);
 assert.equal(getElementInspectorContract('form').fields.length,0);
});
test('registered defaults and presets use the shared Inspector validator before becoming contract metadata',()=>{
 const numberDefault=registerProperty({id:'test.contract.default.number',group:'typography',label:'Default number',type:'number',command:'responsive.set',responsive:true,key:'testDefaultNumber',defaultValue:0.85,presets:[{label:'  Subtle  ',value:' 0.90 '}],appliesTo:['text']});
 assert.equal(numberDefault.defaultValue,'0.85','numeric defaults are stored in the same canonical string format as Inspector values');
 assert.deepEqual(numberDefault.presets,[{label:'Subtle',value:'0.9'}],'preset values and labels are normalized before registry insertion');
 const field=getElementInspectorContract('text').fields.find(item=>item.id===numberDefault.id);
 assert.deepEqual(field.initialValue,{status:'DECLARED',value:'0.85',source:{strategy:'resolved-style',key:'testDefaultNumber',precedence:['responsive-cascade','node.style','authored-content-default'],fallback:'css-initial-or-inherited'}});
 const invalidId='test.contract.default.invalid';
 assert.throws(()=>registerProperty({id:invalidId,group:'layout',label:'Invalid default',type:'select',command:'responsive.set',responsive:true,key:'testInvalidDefault',options:['visible','hidden'],defaultValue:'sideways',appliesTo:['text']}),/Érvénytelen választási lehetőség/);
 assert.equal(getProperty(invalidId),null,'invalid defaults never enter the shared registry');
 assert.equal(getElementInspectorContract('text').fields.some(item=>item.id===invalidId),false);
 const invalidPresetId='test.contract.preset.invalid';
 assert.throws(()=>registerProperty({id:invalidPresetId,group:'layout',label:'Invalid preset',type:'select',command:'responsive.set',responsive:true,key:'testInvalidPreset',options:['visible','hidden'],presets:[{label:'Unsupported',value:'sideways'}],appliesTo:['text']}),/Érvénytelen választási lehetőség/);
 assert.equal(getProperty(invalidPresetId),null,'invalid presets never enter the shared registry');
 assert.throws(()=>registerProperty({id:'test.contract.preset.out-of-range',group:'opacity',label:'Out of range preset',type:'number',command:'responsive.set',responsive:true,key:'opacity',presets:[{label:'Too much',value:'1.5'}],appliesTo:['text']}),/megengedett tartományon kívül/);
 assert.throws(()=>registerProperty({id:'test.contract.preset.duplicate-label',group:'typography',label:'Duplicate preset',type:'number',command:'responsive.set',responsive:true,key:'testDuplicatePreset',presets:[{label:'Same',value:'0.5'},{label:' Same ',value:'0.6'}],appliesTo:['text']}),/preset címkéi egyediek/);
 assert.throws(()=>registerProperty({id:'test.contract.default.object',group:'content',label:'Object default',type:'text',command:'element.content.set',responsive:false,key:'text',defaultValue:{unsafe:true},appliesTo:['text']}),/alapértéke szöveg/);
});
