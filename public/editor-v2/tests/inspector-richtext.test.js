import assert from 'node:assert/strict';
import test from 'node:test';
import { createDocument, NODE_TYPES } from '../core/schema.js';
import { describeResponsiveOrigin } from '../ui/responsive-origin.js';
import {responsiveGroupResetActions} from '../ui/responsive-group-reset.js';
import { createEditorState, activePage } from '../core/state.js';
import { execute, executeCoalesced, executeBatch } from '../core/commands.js';
import { resolveNodeStyle } from '../core/canvas-engine.js';
import { getProperty, listProperties } from '../core/property-registry.js';
import { STYLE_MAP } from '../core/canvas-engine.js';
import { normalizeInspectorValue } from '../core/property-values.js';
import { updateRichTextInlineLink, updateRichTextInlineMark, validatedLinkHref } from '../core/richtext-links.js';
import { normalizeRichText } from '../core/schema.js';
import { setBlockType } from '../core/richtext-engine.js';
import { ELEMENT_CAPABILITIES, getElementCapability } from '../core/capability-matrix.js';
import { TYPOGRAPHY_PRESETS, typographyPresetPatch } from '../core/typography-presets.js';
import { readRichTextSelectionFormatting, clearRichTextInlineFormatting } from '../core/richtext-links.js';

test('live typing reaches the model immediately and a burst undoes as one edit',()=>{
  const state=createEditorState(createDocument());execute(state,{type:'element.add',payload:{type:'text',props:{text:'Start'}}});
  const nodeId=state.selection.primaryId;
  for(const content of ['Start a','Start ab','Start abc']){
    executeCoalesced(state,{type:'element.content.set',payload:{nodeId,content}},'session-a');
    assert.equal(activePage(state).nodes[nodeId].props.text,content);
  }
  assert.equal(state.history.past.length,2);
  execute(state,{type:'history.undo'});assert.equal(activePage(state).nodes[nodeId].props.text,'Start');
  execute(state,{type:'history.redo'});assert.equal(activePage(state).nodes[nodeId].props.text,'Start abc');
  execute(state,{type:'style.set',payload:{nodeId,patch:{color:'#123456'}}});
  executeCoalesced(state,{type:'element.content.set',payload:{nodeId,content:'Next'}},'session-a');
  assert.equal(state.history.past.length,4,'a style command separates typing bursts');
  state.history.limit=1;state.history.past=state.history.past.slice(-1);
  executeCoalesced(state,{type:'element.content.set',payload:{nodeId,content:'Next b'}},'session-a');
  assert.equal(state.history.past.length,1,'history truncation must not remove the only undo entry');
});

test('selection formatting reflects mixed values and clearing overrides preserves links',()=>{
  const model=normalizeRichText({schemaVersion:1,type:'richtext-document',blocks:[{type:'paragraph',children:[
    {type:'text',text:'Hello',marks:['bold'],styles:{fontSize:'24px',fontFamily:'Georgia'},link:{href:'/p/home'}},
    {type:'text',text:' world',marks:[],styles:{fontSize:'16px'}}
  ]}]});
  const range={segments:[{blockIndex:0,from:0,to:11}]};
  const format=readRichTextSelectionFormatting(model,range);
  assert.equal(format.marks.bold,'mixed');assert.ok(format.mixed.includes('fontSize'));assert.ok(format.mixed.includes('fontFamily'));
  const reset=clearRichTextInlineFormatting(model,range);
  assert.equal(reset.blocks[0].children[0].link.href,'/p/home');
  assert.equal(reset.blocks[0].children.map(run=>run.text).join(''),'Hello world');
  assert.ok(reset.blocks[0].children.every(run=>!run.marks.length&&!run.styles));
  assert.equal(model.blocks[0].children[0].styles.fontSize,'24px','source content remains immutable');
});

test('creator typography roles use valid shared properties at every breakpoint',()=>{
  for(const preset of TYPOGRAPHY_PRESETS)for(const device of ['desktop','tablet','mobile']){
    const patch=typographyPresetPatch(preset.id,device);
    for(const [key,value] of Object.entries(patch)){
      const property=listProperties().find(item=>item.key===key);
      assert.ok(property,`${preset.id}: ${key}`);assert.equal(STYLE_MAP[key],key);
      assert.equal(normalizeInspectorValue(property,value),value);
    }
  }
  assert.equal(typographyPresetPatch('hero','mobile').fontSize,'40px');
  assert.throws(()=>typographyPresetPatch('unknown','desktop'));
});

test('typed Inspector controls validate display values before the command path', () => {
  const width = getProperty('size.width');
  assert.equal(normalizeInspectorValue(width,'50%'),'50%');
  assert.equal(normalizeInspectorValue(width,'auto'),'auto');
  assert.throws(()=>normalizeInspectorValue(width,'calc(1px + url(javascript:x))'));
  assert.throws(()=>normalizeInspectorValue(width,'2em'));
  assert.throws(()=>normalizeInspectorValue(width,'-20px'));
  assert.equal(normalizeInspectorValue(getProperty('spacing.padding'),'8px 16px 8px 16px'),'8px 16px 8px 16px');
  assert.throws(()=>normalizeInspectorValue(getProperty('spacing.padding'),'8px 8px 8px 8px 8px'));
  assert.throws(()=>normalizeInspectorValue(getProperty('spacing.padding'),'-8px'));
  assert.equal(normalizeInspectorValue(getProperty('opacity.value'),'0.5'),'0.5');
  assert.throws(()=>normalizeInspectorValue(getProperty('opacity.value'),'7'));
  assert.throws(()=>normalizeInspectorValue(getProperty('opacity.value'),'not-a-number'));
  assert.equal(normalizeInspectorValue(getProperty('background.color'),'#abc123'),'#abc123');
  assert.throws(()=>normalizeInspectorValue(getProperty('background.color'),'red;url(http://bad)'));
  assert.equal(normalizeInspectorValue(getProperty('typography.fontFamily'),'Georgia'),'Georgia');
  assert.throws(()=>normalizeInspectorValue(getProperty('typography.fontFamily'),'UnapprovedFont'));
  assert.equal(normalizeInspectorValue(getProperty('shadow.box'),'none'),'none');
  assert.throws(()=>normalizeInspectorValue(getProperty('background.image'),'javascript:1'));
  assert.equal(normalizeInspectorValue(getProperty('background.image'),'6b1c2e65-e46e-4764-b234-123456789abc'),'6b1c2e65-e46e-4764-b234-123456789abc');
  assert.equal(normalizeInspectorValue(getProperty('content.href'),'/p/home'),'/p/home');
  assert.equal(normalizeInspectorValue(getProperty('content.href'),'mailto:team@example.org'),'mailto:team@example.org');
  assert.throws(()=>normalizeInspectorValue(getProperty('content.href'),'javascript:alert(1)'));
  assert.equal(normalizeInspectorValue(getProperty('size.maxWidth'),'80vw'),'80vw');
  assert.throws(()=>normalizeInspectorValue(getProperty('size.minHeight'),'-1px'));
  assert.equal(normalizeInspectorValue(getProperty('radius.topLeft'),'12px'),'12px');
  assert.throws(()=>normalizeInspectorValue(getProperty('radius.topLeft'),'12px;display:none'));
  assert.equal(normalizeInspectorValue(getProperty('flex.basis'),'auto'),'auto');
  assert.equal(normalizeInspectorValue(getProperty('grid.column'),'1 / -1'),'1 / -1');
  assert.throws(()=>normalizeInspectorValue(getProperty('grid.column'),'999 / -1'));
});

test('box spacing accepts CSS lengths and margin auto but rejects invalid padding and units',()=>{
  const margin=getProperty('spacing.margin'),padding=getProperty('spacing.padding');
  assert.equal(normalizeInspectorValue(margin,'0 auto'),'0 auto');
  assert.equal(normalizeInspectorValue(margin,' -4px   5vw  2rem  auto '),'-4px 5vw 2rem auto');
  assert.equal(normalizeInspectorValue(padding,'1em 2vh 3vw 4%'),'1em 2vh 3vw 4%');
  for(const value of ['auto','8px auto','0 auto 0 0','-2px','1fr','2ch','calc(2px + 1px)']){
    assert.throws(()=>normalizeInspectorValue(padding,value),undefined,`padding: ${value}`);
  }
  for(const value of ['1fr','2ch','calc(2px + 1px)']){
    assert.throws(()=>normalizeInspectorValue(margin,value),undefined,`margin: ${value}`);
  }
});

test('every registry style preset is accepted by its canonical property validator',()=>{
  const withPresets=listProperties().filter(property=>property.presets?.length);
  assert.ok(withPresets.length>=20,'the common visual groups expose useful presets');
  for(const property of withPresets){
    for(const preset of property.presets){
      assert.equal(normalizeInspectorValue(property,preset.value),preset.value,`${property.id}: ${preset.label}`);
    }
  }
});

test('expanded typography fields use the canonical CSS renderer allowlist',()=>{
  const fields={
    'typography.fontStyle':['normal','italic'],
    'typography.textTransform':['none','uppercase','lowercase','capitalize'],
    'typography.textDecoration':['none','underline','line-through','overline']
  };
  for(const [id,values] of Object.entries(fields)){
    const property=getProperty(id);
    assert.ok(property,`${id} is registered`);
    assert.equal(STYLE_MAP[property.key],property.key,`${id} is rendered on the canvas and public page`);
    for(const value of values)assert.equal(normalizeInspectorValue(property,value),value);
  }
});

test('typed changes use Page Model commands, responsive overrides and undo', () => {
  const state = createEditorState(createDocument());
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT}});
  const nodeId = state.selection.primaryId;
  execute(state,{type:'responsive.set',payload:{
    nodeId,device:'desktop',patch:{
      width:normalizeInspectorValue(getProperty('size.width'),'300px'),
      backgroundColor:normalizeInspectorValue(getProperty('background.color'),'#123456')
    }
  }});
  execute(state,{type:'responsive.set',payload:{
    nodeId,device:'mobile',patch:{width:normalizeInspectorValue(getProperty('size.width'),'100%')}
  }});
  const node = activePage(state).nodes[nodeId];
  assert.equal(resolveNodeStyle(node,'mobile').width,'100%');
  assert.equal(resolveNodeStyle(node,'tablet').width,'300px');
  assert.equal(resolveNodeStyle(node,'desktop').backgroundColor,'#123456');
  execute(state,{type:'history.undo'});
  assert.notEqual(resolveNodeStyle(activePage(state).nodes[nodeId],'mobile').width,'100%');
});

test('Flex and Grid Inspector properties resolve from the same responsive Page Model on canvas', () => {
  const state=createEditorState(createDocument());
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.GRID}});
  const nodeId=state.selection.primaryId;
  const columns=getProperty('grid.columns');
  execute(state,{type:'responsive.set',payload:{nodeId,device:'desktop',patch:{
    display:normalizeInspectorValue(getProperty('layout.display'),'grid'),
    gridTemplateColumns:normalizeInspectorValue(columns,'repeat(2, minmax(0, 1fr))')
  }}});
  execute(state,{type:'responsive.set',payload:{nodeId,device:'mobile',patch:{
    gridTemplateColumns:normalizeInspectorValue(columns,'1fr')
  }}});
  const node=activePage(state).nodes[nodeId];
  assert.equal(resolveNodeStyle(node,'desktop').gridTemplateColumns,'repeat(2, minmax(0, 1fr))');
  assert.equal(resolveNodeStyle(node,'tablet').gridTemplateColumns,'repeat(2, minmax(0, 1fr))');
  assert.equal(resolveNodeStyle(node,'mobile').gridTemplateColumns,'1fr');
  execute(state,{type:'history.undo'});
  assert.equal(resolveNodeStyle(activePage(state).nodes[nodeId],'mobile').gridTemplateColumns,'repeat(2, minmax(0, 1fr))');
});

test('every palette node type has an explicit honest capability classification', () => {
  assert.deepEqual(Object.keys(ELEMENT_CAPABILITIES).sort(),Object.values(NODE_TYPES).sort());
  for(const type of Object.values(NODE_TYPES)){
    const capability=getElementCapability(type);
    assert.ok(['PARTIAL','PLANNED'].includes(capability.status));
    assert.ok(['PARTIAL','PLANNED'].includes(capability.inspector));
    assert.ok(['PARTIAL','PLANNED'].includes(capability.public));
  }
  assert.equal(getElementCapability(NODE_TYPES.RICHTEXT).status,'PARTIAL');
  assert.equal(getElementCapability(NODE_TYPES.FORM).public,'PLANNED');
  assert.equal(getElementCapability(NODE_TYPES.TABLE).public,'PARTIAL');
});

const documentModel = {
  schemaVersion:1,type:'richtext-document',
  blocks:[{type:'paragraph',children:[
    {type:'text',text:'Hello ',marks:[]},
    {type:'text',text:'world',marks:[]},
    {type:'text',text:' again',marks:[]}
  ]}]
};

test('Rich Text creates, updates and removes safe structured links without rewriting neighboring runs', () => {
  const link=updateRichTextInlineLink(documentModel,{blockIndex:0,from:6,to:11},'/p/home');
  assert.deepEqual(link.blocks[0].children.map(x=>x.text),['Hello ','world',' again']);
  assert.equal(link.blocks[0].children[1].link.href,'/p/home');
  assert.equal(documentModel.blocks[0].children[1].link,undefined);
  const replacement=updateRichTextInlineLink(link,{blockIndex:0,from:6,to:11},'https://example.org/');
  assert.equal(replacement.blocks[0].children[1].link.target,'_blank');
  assert.equal(replacement.blocks[0].children[1].link.rel,'noopener noreferrer');
  const unlinked=updateRichTextInlineLink(replacement,{blockIndex:0,from:6,to:11},null);
  assert.equal(unlinked.blocks[0].children[0].text,'Hello world again');
  assert.equal(unlinked.blocks[0].children[0].link,undefined);
});

test('Rich Text link edits save through the real command, keep Undo/Redo, never publish', () => {
  const state=createEditorState(createDocument());
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:documentModel}});
  const before=JSON.stringify(activePage(state).nodes[nodeId].props.richText);
  const linked=updateRichTextInlineLink(documentModel,{blockIndex:0,from:6,to:11},'/p/home');
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:linked}});
  assert.equal(activePage(state).nodes[nodeId].props.richText.blocks[0].children[1].link.href,'/p/home');
  execute(state,{type:'history.undo'});
  assert.equal(JSON.stringify(activePage(state).nodes[nodeId].props.richText),before);
  execute(state,{type:'history.redo'});
  assert.equal(activePage(state).nodes[nodeId].props.richText.blocks[0].children[1].link.href,'/p/home');
  assert.notEqual(activePage(state).status,'published');
});

test('unsafe schemes and invalid/empty selections are rejected without changing the document', () => {
  for (const href of ['javascript:alert(1)','data:text/html,foo','//phishing.test','https://u:p@example.org','https://bad\\path','']) {
    assert.throws(()=>validatedLinkHref(href),{name:'Error'});
  }
  assert.equal(validatedLinkHref('/p/about'),'/p/about');
  assert.equal(validatedLinkHref('mailto:hello@example.org'),'mailto:hello@example.org');
  assert.throws(()=>updateRichTextInlineLink(documentModel,{blockIndex:0,from:5,to:5},'/p/home'));
  assert.throws(()=>updateRichTextInlineLink(documentModel,{blockIndex:0,from:0,to:500},'/p/home'));
  assert.throws(()=>updateRichTextInlineLink(documentModel,{blockIndex:99,from:0,to:2},'/p/home'));
});

test('inline marks, link and block transforms preserve content through commands and undo', () => {
  const state=createEditorState(createDocument());
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT}});
  const nodeId=state.selection.primaryId;
  const bold=updateRichTextInlineMark(documentModel,{blockIndex:0,from:6,to:11},'bold');
  const linked=updateRichTextInlineLink(bold,{blockIndex:0,from:6,to:11},'/p/home');
  const list=setBlockType(linked,0,17,'bulleted-list');
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:list}});
  const persisted=activePage(state).nodes[nodeId].props.richText;
  assert.equal(persisted.blocks[0].type,'bulleted-list');
  assert.deepEqual(persisted.blocks[0].items[0][1].marks,['bold']);
  assert.equal(persisted.blocks[0].items[0][1].link.href,'/p/home');
  assert.deepEqual(normalizeRichText(persisted),persisted);
  execute(state,{type:'history.undo'});
  assert.equal(activePage(state).nodes[nodeId].props.richText.blocks[0].type,'paragraph');
  execute(state,{type:'history.redo'});
  assert.deepEqual(activePage(state).nodes[nodeId].props.richText,persisted);
  const unbold=updateRichTextInlineMark(bold,{blockIndex:0,from:6,to:11},'bold');
  assert.equal(unbold.blocks[0].children.every(run=>run.marks.length===0),true);
  assert.throws(()=>updateRichTextInlineMark(documentModel,{blockIndex:0,from:0,to:2},'script'));
});


test('group breakpoint reset is atomic and preserves other groups, devices and one-step Undo',()=>{
  const state=createEditorState(createDocument());
  const rootId=activePage(state).rootId;
  execute(state,{type:'element.add',payload:{type:'text',parentId:rootId}});
  const id=state.selection.primaryId;
  execute(state,{type:'responsive.set',payload:{nodeId:id,device:'desktop',patch:{margin:'4px',padding:'8px',color:'#112233'}}});
  execute(state,{type:'responsive.set',payload:{nodeId:id,device:'mobile',patch:{margin:'12px',padding:'16px',color:'#abcdef'}}});
  const original=structuredClone(state.document);
  const node=activePage(state).nodes[id];
  const actions=responsiveGroupResetActions(node,[getProperty('spacing.margin'),getProperty('spacing.padding'),getProperty('spacing.margin'),getProperty('typography.color')].slice(0,3),'mobile');
  assert.equal(actions.length,2,'duplicate props must not produce duplicate mutations');
  assert.equal(responsiveGroupResetActions(node,[getProperty('spacing.margin')],'tablet').length,0,'no tablet overrides to reset');
  const beforeCount=state.history.past.length;
  executeBatch(state,actions,{label:'Térközök visszaállítása',atomic:true});
  assert.equal(state.history.past.length,beforeCount+1,'all sides undo as one operation');
  const values=activePage(state).nodes[id].responsive;
  assert.equal(values.mobile?.margin,undefined);
  assert.equal(values.mobile?.padding,undefined);
  assert.equal(values.mobile?.color,'#abcdef','unrelated typography remains unchanged');
  assert.equal(values.desktop?.margin,'4px','desktop values remain unchanged');
  execute(state,{type:'history.undo'});
  assert.deepEqual(state.document,original,'one Undo restores all original values');
  execute(state,{type:'history.redo'});
  assert.equal(activePage(state).nodes[id].responsive.mobile?.padding,undefined);
});


test('responsive property origin is canonical, device-scoped and describes base fallback',()=>{
  const values={desktop:{fontSize:'32px'},tablet:{fontSize:'25px'},mobile:{}};
  assert.deepEqual(describeResponsiveOrigin(values,'fontSize','desktop'),{kind:'own',source:'desktop',label:'Saját érték · Asztali'});
  assert.deepEqual(describeResponsiveOrigin(values,'fontSize','tablet'),{kind:'own',source:'tablet',label:'Saját érték · Tablet'});
  assert.deepEqual(describeResponsiveOrigin(values,'fontSize','mobile'),{kind:'inherited',source:'tablet',label:'Örökölt · Tablet'});
  assert.deepEqual(describeResponsiveOrigin({desktop:{fontSize:'32px'}},'fontSize','mobile'),{kind:'inherited',source:'desktop',label:'Örökölt · Asztali'});
  assert.deepEqual(describeResponsiveOrigin({},'fontSize','mobile',{hasBaseStyle:true}),{kind:'base',source:null,label:'Alapstílus'});
  assert.deepEqual(describeResponsiveOrigin({},'fontSize','mobile'),{kind:'base',source:null,label:'Alapértelmezett'});
  assert.throws(()=>describeResponsiveOrigin({},'fontSize','unsupported'),/Ismeretlen/);
});
