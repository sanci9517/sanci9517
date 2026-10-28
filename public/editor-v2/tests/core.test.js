import {ICON_CHOICES,iconById,isSupportedIcon} from '../core/icon-options.js';
import {createElementContent,normalizeElementContent,validateElementContent,renderElementContent,safeMediaUrl} from '../core/element-content.js';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SourceTextModule } from 'node:vm';
import test from 'node:test';

import { createDocument, createNode, NODE_TYPES, normalizeRichText } from '../core/schema.js';
import { assertValidEditorDocument } from '../core/validation.js';
import { createEditorState, activePage } from '../core/state.js';
import { beginTransaction, commitTransaction, execute, executeBatch, rollbackTransaction } from '../core/commands.js';
import { getProperty, listProperties, listPropertyGroups, registerProperty } from '../core/property-registry.js?v=20261025-content-property-route-contract';
import { hasResponsiveOverride, resolveResponsiveValue, setResponsiveValue } from '../core/responsive.js';
import {collectVisibleDescendants} from '../core/visibility.js';
import {normalizeVisibility,isVisibleOnDevice,getNodeVisibilityState} from '../core/visibility.js';
import { plainTextToRichText } from '../core/richtext-engine.js';
import { createDefaultScheduleConfig, normalizeScheduleConfig, validateScheduleConfig } from '../core/schedule-schema.js';
import { getSchedulePreviewItems } from '../core/schedule-preview.js';
import { computeCanvasMinHeight } from '../core/canvas-extent.js';
import { measureCanvasWorkspace } from '../core/canvas-workspace.js';
import { needsRelativeOffsetPosition } from '../core/canvas-engine.js';
import { validatePublishDocument } from '../../../src/core/editor-validation.ts';

test('canvas minimum height follows content below the default page extent', () => {
  assert.equal(computeCanvasMinHeight([], 1), 844);
  assert.equal(computeCanvasMinHeight([500], 1), 844);
  assert.equal(computeCanvasMinHeight([1200], 1), 1280);
  assert.equal(computeCanvasMinHeight([2400], 2), 1280);
  assert.equal(computeCanvasMinHeight([Number.NaN, 1200], 1, 900, 64), 1264);
});

test('canvas workspace expands in every direction without changing artboard coordinates', () => {
  assert.deepEqual(measureCanvasWorkspace([{left:-120,right:420,top:-40,bottom:1100}],300,800,1),{left:120,top:40,right:120,bottom:300});
  assert.deepEqual(measureCanvasWorkspace([{left:-120,right:420,top:-40,bottom:1100}],300,800,.5),{left:240,top:80,right:540,bottom:1400});
  assert.deepEqual(measureCanvasWorkspace([{left:10,right:290,top:10,bottom:790}],300,800,1),{left:0,top:0,right:0,bottom:0});
});

test('responsive drag offsets promote only static nodes to relative positioning', () => {
  assert.equal(needsRelativeOffsetPosition({}), false);
  assert.equal(needsRelativeOffsetPosition({ x: '24px' }), true);
  assert.equal(needsRelativeOffsetPosition({ y: '-12px', position: 'static' }), true);
  assert.equal(needsRelativeOffsetPosition({ x: '24px', position: 'absolute' }), false);
  assert.equal(needsRelativeOffsetPosition({ x: '24px', position: 'sticky' }), false);
});

test('Rich Text schema normalizes Office-friendly tables, safe inline styles and extended semantic marks',()=>{
  const document=normalizeRichText({schemaVersion:1,type:'richtext-document',blocks:[
    {type:'paragraph',align:'center',children:[{type:'text',text:'Marked',marks:['bold','strikethrough','superscript'],styles:{color:'#AbC',backgroundColor:'#ffee99'}}]},
    {type:'table',rows:[{cells:[{header:true,children:[{type:'text',text:'Revenue',marks:[]}]},{header:true,children:[{type:'text',text:'Year',marks:[]}]}]},{cells:[{header:false,children:[{type:'text',text:'100',marks:[]}]},{header:false,children:[{type:'text',text:'2026',marks:[]}]}]}]}
  ]});
  assert.equal(document.blocks[0].align,'center');
  assert.deepEqual(document.blocks[0].children[0].marks,['bold','strikethrough','superscript']);
  assert.equal(document.blocks[0].children[0].styles.color,'#abc');
  assert.equal(document.blocks[1].rows[1].cells[0].children[0].text,'100');
  const office=normalizeRichText({schemaVersion:1,type:'richtext-document',blocks:[{type:'paragraph',children:[{type:'text',text:'Office',marks:['bold'],styles:{fontFamily:'Calibri',fontSize:'24px',color:'#abc'}}]}]});
  assert.deepEqual(office.blocks[0].children[0].styles,{color:'#abc',fontSize:'24px',fontFamily:'Calibri'});
  assert.throws(()=>normalizeRichText({schemaVersion:1,type:'richtext-document',blocks:[{type:'paragraph',children:[{type:'text',text:'bad font',marks:[],styles:{fontFamily:'url(javascript:alert(1))'}}]}]}));
  assert.throws(()=>normalizeRichText({schemaVersion:1,type:'richtext-document',blocks:[{type:'paragraph',children:[{type:'text',text:'too big',marks:[],styles:{fontSize:'120px'}}]}]}));
  assert.throws(()=>normalizeRichText({schemaVersion:1,type:'richtext-document',blocks:[{type:'paragraph',children:[{type:'text',text:'bad',marks:[],styles:{color:'red;background:url(javascript:1)'}}]}]}));
  assert.throws(()=>normalizeRichText({schemaVersion:1,type:'richtext-document',blocks:[{type:'table',rows:[{cells:Array.from({length:25},()=>({children:[]}))}]}]}));
});

test('Editor browser module parses before it is shipped', () => {
  const appPath = fileURLToPath(new URL('../app.js', import.meta.url));
  new SourceTextModule(readFileSync(appPath, 'utf8'), { identifier: appPath });
});

test('Schedule config uses canonical defaults and normalizes valid input', () => {
  const defaults = createDefaultScheduleConfig();
  assert.deepEqual(defaults, {
    version: 1,
    mode: 'upcoming',
    limit: 10,
    statuses: ['scheduled', 'live'],
    platforms: [],
    order: 'asc',
    showTitle: true,
    showPlatform: true,
    showTime: true,
    showEndTime: false,
    showStatus: false,
    showNotes: false,
    showLink: true,
    emptyText: 'Nincs tervezett stream.'
  });

  const normalized = normalizeScheduleConfig({
    mode: 'all',
    limit: 25,
    statuses: [' live ', 'scheduled', 'live'],
    platforms: [' Twitch ', 'YouTube'],
    order: 'desc',
    showTitle: false,
    showPlatform: true,
    showTime: false,
    showEndTime: true,
    showStatus: true,
    showNotes: false,
    showLink: false,
    emptyText: '  Nincs következő stream.  '
  });

  assert.deepEqual(normalized, {
    version: 1,
    mode: 'all',
    limit: 25,
    statuses: ['live', 'scheduled'],
    platforms: ['Twitch', 'YouTube'],
    order: 'desc',
    showTitle: false,
    showPlatform: true,
    showTime: false,
    showEndTime: true,
    showStatus: true,
    showNotes: false,
    showLink: false,
    emptyText: 'Nincs következő stream.'
  });
});

test('Schedule config rejects unsupported or unsafe values', () => {
  assert.throws(() => normalizeScheduleConfig({ mode: 'random' }));
  assert.throws(() => normalizeScheduleConfig({ limit: 0 }));
  assert.throws(() => normalizeScheduleConfig({ limit: 51 }));
  assert.throws(() => normalizeScheduleConfig({ statuses: ['cancelled'] }));
  assert.throws(() => normalizeScheduleConfig({ statuses: [] }));
  assert.throws(() => normalizeScheduleConfig({ platforms: ['   '] }));
  assert.throws(() => normalizeScheduleConfig({ showTitle: 'true' }));
  assert.throws(() => normalizeScheduleConfig({ emptyText: '   ' }));
  assert.equal(validateScheduleConfig({ mode: 'all', limit: 5 }).length, 0);
  assert.equal(validateScheduleConfig({ mode: 'invalid' }).length, 1);
});

test('Schedule nodes receive canonical defaults and validate through the Page Model', () => {
  const created = createNode(NODE_TYPES.SCHEDULE);
  assert.deepEqual(created.props.schedule, createDefaultScheduleConfig());

  const document = createDocument();
  const page = document.pages[document.activePageId];
  const schedule = {
    id: 'schedule_test',
    type: NODE_TYPES.SCHEDULE,
    name: 'Menetrend',
    parentId: page.rootId,
    children: [],
    props: { schedule: createDefaultScheduleConfig() },
    style: {},
    responsive: { desktop: {}, tablet: {}, mobile: {} },
    states: {},
    visibility: { desktop: true, tablet: true, mobile: true },
    locked: false,
    component: null,
    dataBindings: {},
    interactions: [],
    accessibility: {},
    metadata: {}
  };
  page.nodes[schedule.id] = schedule;
  page.nodes[page.rootId].children.push(schedule.id);
  assertValidEditorDocument(document);

  const invalid = structuredClone(document);
  invalid.pages[invalid.activePageId].nodes[schedule.id].props.schedule.limit = 0;
  assert.throws(() => assertValidEditorDocument(invalid));
});

test('new document is structurally valid', () => {
  const document = createDocument();
  assertValidEditorDocument(document);
  assert.equal(document.pages[document.activePageId].nodes[document.pages[document.activePageId].rootId].children.length, 0);
});

test('property registry exposes extensible inspector groups and properties', () => {
  assert.ok(listPropertyGroups().some((group) => group.id === 'typography'));
  assert.ok(listPropertyGroups().some((group) => group.id === 'responsive'));
  assert.equal(getProperty('size.width').responsive, true);
  assert.equal(getProperty('size.width').key, 'width');
  assert.equal(getProperty('size.width').command, 'responsive.set');
  assert.equal(getProperty('background.color').key, 'backgroundColor');
  assert.equal(getProperty('radius.all').key, 'borderRadius');
  assert.equal(getProperty('content.text').command, 'element.content.set');
  assert.equal(getProperty('content.text').key, 'text');
  assert.equal(getProperty('content.href').command, 'content.properties.set');
  assert.equal(getProperty('content.href').key, 'href');
  assert.ok(listProperties({ group: 'size' }).some((property) => property.id === 'size.width'));
});

test('property registry freezes nested metadata and validates newly registered controls',()=>{
  const display=getProperty('layout.display');
  assert.ok(Object.isFrozen(display));
  assert.ok(Object.isFrozen(display.options));
  assert.throws(()=>display.options.push('script'),TypeError);
  const shadow=getProperty('shadow.box');
  assert.ok(Object.isFrozen(shadow.optionLabels));
  assert.throws(()=>{shadow.optionLabels.none='Modified';},TypeError);
  const flexChild=getProperty('flex.grow');
  assert.ok(Object.isFrozen(flexChild.layoutContext));assert.ok(Object.isFrozen(flexChild.layoutContext.parentModes));

  const options=['one','two'];
  const optionLabels={one:'Első',two:'Második'};
  const property=registerProperty({id:'test.registry.immutable',group:'typography',label:'Teszt',type:'select',options,optionLabels,command:'responsive.set',responsive:true,key:'registryImmutable'});
  options.push('three');optionLabels.one='Külső módosítás';
  assert.deepEqual(property.options,['one','two'],'registration copies caller-owned option arrays');
  assert.deepEqual(property.optionLabels,{one:'Első',two:'Második'},'registration copies caller-owned label maps');
  assert.ok(Object.isFrozen(property.options));
  assert.ok(Object.isFrozen(property.optionLabels));
  assert.throws(()=>registerProperty({id:'test.registry.invalid-command',group:'typography',label:'Teszt',type:'text',command:'arbitrary.execute'}),/command/);
  assert.throws(()=>registerProperty({id:'test.registry.invalid-responsive',group:'typography',label:'Teszt',type:'number',command:'responsive.set',responsive:true}),/key/);
  assert.throws(()=>registerProperty({id:'test.registry.invalid-select',group:'typography',label:'Teszt',type:'select',command:'element.update',key:'value',responsive:false,options:[]}),/options/);
  assert.throws(()=>registerProperty({id:'test.registry.command-scope',group:'typography',label:'Teszt',type:'number',command:'responsive.set',key:'wrong',responsive:false}),/flagnek és commandnak/);
  assert.throws(()=>registerProperty({id:'test.registry.duplicate-options',group:'typography',label:'Teszt',type:'select',command:'element.update',key:'value',responsive:false,options:['one','one']}),/egyedi/);
  assert.throws(()=>registerProperty({id:'test.registry.foreign-label',group:'typography',label:'Teszt',type:'select',command:'element.update',key:'value',responsive:false,options:['one'],optionLabels:{other:'Más'}}),/optionLabels/);
  assert.throws(()=>registerProperty({id:'test.registry.invalid-dimension',group:'typography',label:'Teszt',type:'dimension',command:'element.update',key:'value',responsive:false,units:['px','px']}),/egyedi/);
  assert.throws(()=>registerProperty({id:'test.registry.invalid-applies-to',group:'typography',label:'Teszt',type:'text',command:'element.update',key:'name',responsive:false,appliesTo:['text','text']}),/appliesTo/);
  assert.throws(()=>registerProperty({id:'test.registry.unknown-node-type',group:'typography',label:'Teszt',type:'text',command:'element.update',key:'name',responsive:false,appliesTo:['imaginary']}),/ismert/);
  assert.throws(()=>registerProperty({id:'test.registry.missing-layout-context',group:'flex',label:'Teszt',type:'number',command:'responsive.set',responsive:true,key:'flexGrow'}),/layoutContext/);
  assert.throws(()=>registerProperty({id:'test.registry.invalid-layout-context',group:'grid',label:'Teszt',type:'number',command:'responsive.set',responsive:true,key:'gridColumn',layoutContext:{kind:'item',parentModes:['block']}}),/layoutContext/);
});

test('all static Inspector descriptors satisfy the same key, scope and value-metadata contract',()=>{
  const commands=new Set(['content.properties.set','element.content.set','element.update','responsive.set']);
  for(const property of listProperties()){
    assert.equal(typeof property.key,'string',`${property.id} key`);
    assert.ok(property.key.trim(),`${property.id} non-empty key`);
    assert.equal(typeof property.responsive,'boolean',`${property.id} explicit responsive scope`);
    assert.ok(commands.has(property.command),`${property.id} known command`);
    assert.equal(property.responsive,property.command==='responsive.set',`${property.id} command matches scope`);
    if(property.type==='select'){
      assert.ok(property.options?.length,`${property.id} options`);
      assert.equal(new Set(property.options).size,property.options.length,`${property.id} unique options`);
      for(const [option,label] of Object.entries(property.optionLabels||{})){
        assert.ok(property.options.includes(option),`${property.id} label references a known option`);
        assert.equal(typeof label,'string',`${property.id} option label type`);
      }
    }
    if(property.type==='dimension'){
      assert.ok(property.units?.length,`${property.id} units`);
      assert.equal(new Set(property.units).size,property.units.length,`${property.id} unique units`);
    }
    if(property.appliesTo){
      assert.equal(new Set(property.appliesTo).size,property.appliesTo.length,`${property.id} unique type filters`);
      for(const nodeType of property.appliesTo)assert.ok(Object.values(NODE_TYPES).includes(nodeType),`${property.id} appliesTo registered node type`);
    }
  }
});

test('visibility switches normalize legacy Page Models, preserve independent devices and allow ancestor discovery', () => {
  const state=createEditorState(),page=activePage(state);
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:page.rootId}});
  const parentId=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId}});
  const childId=state.selection.primaryId;
  assert.deepEqual(getNodeVisibilityState(activePage(state),childId,'mobile'),{ownVisible:true,effectiveVisible:true,hiddenByAncestorId:null});
  execute(state,{type:'element.update',payload:{nodeId:parentId,patch:{visibility:false}}});
  assert.equal(isVisibleOnDevice(activePage(state).nodes[parentId],'mobile'),false);
  assert.deepEqual(normalizeVisibility(false),{desktop:false,tablet:false,mobile:false});
  assert.deepEqual(getNodeVisibilityState(activePage(state),childId,'mobile'),{ownVisible:true,effectiveVisible:false,hiddenByAncestorId:parentId});
  execute(state,{type:'element.visibility.set',payload:{nodeId:parentId,device:'mobile',visible:true}});
  assert.deepEqual(activePage(state).nodes[parentId].visibility,{desktop:false,tablet:false,mobile:true});
  assert.equal(getNodeVisibilityState(activePage(state),childId,'mobile').effectiveVisible,true);
  assert.equal(getNodeVisibilityState(activePage(state),childId,'desktop').effectiveVisible,false);
  execute(state,{type:'history.undo'});
  assert.equal(activePage(state).nodes[parentId].visibility,false,'undo restores the exact legacy snapshot');
  execute(state,{type:'history.redo'});
  assert.equal(getNodeVisibilityState(activePage(state),childId,'mobile').effectiveVisible,true);
  execute(state,{type:'element.visibility.set',payload:{nodeId:childId,device:'mobile',visible:false}});
  assert.equal(getNodeVisibilityState(activePage(state),childId,'mobile').ownVisible,false);
  assert.equal(getNodeVisibilityState(activePage(state),childId,'mobile').effectiveVisible,false);
  assert.throws(()=>execute(state,{type:'element.visibility.set',payload:{nodeId:page.rootId,device:'desktop',visible:false}}),/Root visibility/);
  assert.throws(()=>execute(state,{type:'element.visibility.set',payload:{nodeId:parentId,device:'watch',visible:false}}),/Invalid responsive device/);
  assert.equal(activePage(state).nodes[parentId].visibility.mobile,true,'invalid actions never corrupt visibility');
  assert.equal(isVisibleOnDevice(null,'desktop'),false);
});

test('visible descendant walk never preloads hidden schedules or orphan nodes', () => {
  const state=createEditorState(createDocument());
  const root=activePage(state).rootId;
  execute(state,{type:'element.add',payload:{type:'schedule',parentId:root}});
  const visibleId=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:'container',parentId:root}});
  const parentId=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:'schedule',parentId}});
  const childId=state.selection.primaryId;
  execute(state,{type:'element.visibility.set',payload:{nodeId:parentId,device:'mobile',visible:false}});
  const page=activePage(state);
  assert.deepEqual(collectVisibleDescendants(page,'mobile').map(n=>n.id),[visibleId]);
  assert.deepEqual(collectVisibleDescendants(page,'tablet').map(n=>n.id),[visibleId,parentId,childId]);
  assert.deepEqual(collectVisibleDescendants(page,'desktop').map(n=>n.id),[visibleId,parentId,childId]);
  execute(state,{type:'element.visibility.set',payload:{nodeId:visibleId,device:'mobile',visible:false}});
  assert.deepEqual(collectVisibleDescendants(activePage(state),'mobile'),[]);
  execute(state,{type:'history.undo'});
  assert.deepEqual(collectVisibleDescendants(activePage(state),'mobile').map(n=>n.id),[visibleId]);
});

test('responsive values inherit from wider viewports and can be overridden/reset', () => {
  let responsive = setResponsiveValue({}, 'width', 'desktop', '1200px');
  responsive = setResponsiveValue(responsive, 'width', 'tablet', '90%');
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'desktop'), { value: '1200px', source: 'desktop', inherited: false });
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'tablet'), { value: '90%', source: 'tablet', inherited: false });
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'mobile'), { value: '90%', source: 'tablet', inherited: true });
  assert.equal(hasResponsiveOverride(responsive, 'width', 'mobile'), false);
  responsive = setResponsiveValue(responsive, 'width', 'mobile', '100%');
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'mobile'), { value: '100%', source: 'mobile', inherited: false });
  responsive = setResponsiveValue(responsive, 'width', 'mobile', undefined);
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'mobile'), { value: '90%', source: 'tablet', inherited: true });
});

test('element add creates a real parent-child relationship', () => {
  const state = createEditorState();
  const page = activePage(state);
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const section = page.nodes[state.selection.primaryId];
  assert.equal(section.parentId, page.rootId);
  assert.deepEqual(page.nodes[page.rootId].children, [section.id]);
  assert.equal(state.document.revision, 1);
  assert.equal(state.persistence.dirty, true);
  assertValidEditorDocument(state.document);
});

test('Rich Text creates canonical structured content and accepts valid updates', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.RICHTEXT } });
  const id = state.selection.primaryId;
  const node = activePage(state).nodes[id];

  assert.equal(node.type, NODE_TYPES.RICHTEXT);
  assert.equal(node.props.richText.type, 'richtext-document');
  assert.equal(node.props.richText.schemaVersion, 1);
  assert.equal(node.props.richText.blocks[0].type, 'paragraph');

  const richText = {
    schemaVersion: 1,
    type: 'richtext-document',
    blocks: [
      {
        type: 'heading',
        level: 2,
        children: [{ type: 'text', text: 'Sanci9517', marks: [] }]
      },
      {
        type: 'paragraph',
        children: [{
          type: 'text',
          text: 'Twitch',
          marks: [],
          link: { href: 'https://www.twitch.tv/sanci9517', target: '_blank' }
        }]
      },
      {
        type: 'bulleted-list',
        items: [{ children: [{ type: 'text', text: 'Fortnite', marks: [] }] }]
      },
      {
        type: 'quote',
        children: [{ type: 'text', text: 'Stream', marks: [] }]
      },
      {
        type: 'code',
        children: [{ type: 'text', text: 'const sanci = true;', marks: [] }]
      }
    ]
  };

  execute(state, { type: 'richtext.content.set', payload: { nodeId: id, document: richText } });

  const updated = activePage(state).nodes[id].props.richText;
  assert.equal(updated.blocks[0].level, 2);
  assert.equal(updated.blocks[0].children[0].marks.length, 0);
  assert.equal(updated.blocks[1].children[0].link.href, 'https://www.twitch.tv/sanci9517');
  assert.equal(updated.blocks[2].items[0][0].text, 'Fortnite');
  assert.equal(updated.blocks[3].children[0].marks.length, 0);
  assert.equal(updated.blocks[4].children[0].marks.length, 0);
  assert.equal(state.persistence.dirty, true);
  assert.equal(state.document.revision, 2);
  assertValidEditorDocument(state.document);
});

test('invalid Rich Text is rejected and the document rolls back exactly', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.RICHTEXT } });
  const id = state.selection.primaryId;
  const before = structuredClone(state.document);
  const historyBefore = state.history.past.length;

  assert.throws(() => execute(state, {
    type: 'richtext.content.set',
    payload: {
      nodeId: id,
      document: {
        schemaVersion: 1,
        type: 'richtext-document',
        blocks: [{
          type: 'paragraph',
          children: [{ type: 'text', text: 'Hiba', marks: ['unknown-mark'] }]
        }]
      }
    }
  }));

  assert.deepEqual(state.document, before);
  assert.equal(state.history.past.length, historyBefore);
  assertValidEditorDocument(state.document);
});


test('Rich Text stores plain text without inline marks', () => {
  const document = plainTextToRichText('Sanci9517');
  assert.deepEqual(document.blocks[0].children, [{ type: 'text', text: 'Sanci9517', marks: [] }]);
  assert.equal(document.blocks[0].children[0].marks.length, 0);
});

test('Rich Text Undo and Redo restore the exact structured document', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.RICHTEXT } });
  const id = state.selection.primaryId;
  const richText = {
    schemaVersion: 1,
    type: 'richtext-document',
    blocks: [{
      type: 'paragraph',
      children: [{ type: 'text', text: 'Első változat', marks: [] }]
    }]
  };

  execute(state, { type: 'richtext.content.set', payload: { nodeId: id, document: richText } });
  const afterSet = structuredClone(state.document);

  execute(state, { type: 'history.undo' });
  const undone = activePage(state).nodes[id];
  assert.deepEqual(undone.props.richText, {
    schemaVersion: 1,
    type: 'richtext-document',
    blocks: [{ type: 'paragraph', children: [{ type: 'text', text: '', marks: [] }] }]
  });

  execute(state, { type: 'history.redo' });
  assert.deepEqual(state.document, afterSet);
  assertValidEditorDocument(state.document);
});

test('content, style and responsive commands mutate only through the command engine', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  const id = state.selection.primaryId;

  execute(state, { type: 'element.content.set', payload: { nodeId: id, content: 'Sanci' } });
  execute(state, { type: 'style.set', payload: { nodeId: id, patch: { color: '#fff', fontSize: '24px' } } });
  execute(state, { type: 'responsive.set', payload: { nodeId: id, device: 'mobile', patch: { fontSize: '18px' } } });

  const node = activePage(state).nodes[id];
  assert.equal(node.props.content, 'Sanci');
  assert.equal(node.style.color, '#fff');
  assert.equal(node.responsive.mobile.fontSize, '18px');
  assert.equal(hasResponsiveOverride(node.responsive, 'fontSize', 'mobile'), true);

  execute(state, { type: 'responsive.set', payload: { nodeId: id, device: 'mobile', patch: { fontSize: undefined } } });
  assert.equal(Object.hasOwn(node.responsive.mobile, 'fontSize'), false);
  assert.equal(hasResponsiveOverride(node.responsive, 'fontSize', 'mobile'), false);
  assert.equal(node.style.fontSize, '24px');
  assertValidEditorDocument(state.document);
});

test('reparent moves the node and preserves hierarchy invariants', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.CONTAINER, parentId: activePage(state).rootId } });
  const second = state.selection.primaryId;
  execute(state, { type: 'hierarchy.reparent', payload: { nodeId: second, parentId: first } });
  const page = activePage(state);
  assert.equal(page.nodes[second].parentId, first);
  assert.deepEqual(page.nodes[first].children, [second]);
  assert.deepEqual(page.nodes[page.rootId].children, [first]);
  assertValidEditorDocument(state.document);
});

test('reorder changes sibling order without changing parent', () => {
  const state = createEditorState();
  const rootId = activePage(state).rootId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION, parentId: rootId } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION, parentId: rootId } });
  const second = state.selection.primaryId;
  execute(state, { type: 'hierarchy.reorder', payload: { nodeId: first, index: 1 } });
  assert.deepEqual(activePage(state).nodes[activePage(state).rootId].children, [second, first]);
  assert.equal(activePage(state).nodes[first].parentId, activePage(state).rootId);
  assertValidEditorDocument(state.document);
});

test('duplicate copies an entire subtree with new ids', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const section = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: section } });
  const text = state.selection.primaryId;
  execute(state, { type: 'element.duplicate', payload: { nodeId: section } });

  const page = activePage(state);
  const duplicate = page.nodes[state.selection.primaryId];
  assert.notEqual(duplicate.id, section);
  assert.equal(duplicate.parentId, page.rootId);
  assert.equal(duplicate.children.length, 1);
  assert.notEqual(duplicate.children[0], text);
  assert.equal(page.nodes[duplicate.children[0]].parentId, duplicate.id);
  assertValidEditorDocument(state.document);
});

test('invalid reparent rolls back the mutation', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  const text = state.selection.primaryId;
  const before = structuredClone(state.document);
  assert.throws(() => execute(state, {
    type: 'hierarchy.reparent',
    payload: { nodeId: first, parentId: text }
  }));
  assert.deepEqual(state.document, before);
  assertValidEditorDocument(state.document);
});

test('locked elements reject mutation but can be explicitly unlocked', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  const id = state.selection.primaryId;
  execute(state, { type: 'element.lock.set', payload: { nodeId: id, locked: true } });
  assert.throws(() => execute(state, { type: 'element.content.set', payload: { nodeId: id, content: 'blocked' } }));
  execute(state, { type: 'element.lock.set', payload: { nodeId: id, locked: false } });
  execute(state, { type: 'element.content.set', payload: { nodeId: id, content: 'allowed' } });
  assert.equal(activePage(state).nodes[id].props.content, 'allowed');
});

test('group creates one deterministic GROUP from same-parent selection', () => {
  const state = createEditorState();
  const rootId = activePage(state).rootId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION, parentId: rootId } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: rootId } });
  const second = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.BUTTON, parentId: rootId } });
  const third = state.selection.primaryId;

  execute(state, { type: 'selection.set', payload: { ids: [third, first, second], primaryId: second } });
  const historyBefore = state.history.past.length;
  execute(state, { type: 'hierarchy.group' });

  const page = activePage(state);
  const group = page.nodes[state.selection.primaryId];
  assert.equal(group.type, NODE_TYPES.GROUP);
  assert.equal(group.parentId, rootId);
  assert.deepEqual(page.nodes[rootId].children, [group.id]);
  assert.deepEqual(group.children, [first, second, third]);
  assert.deepEqual(group.children.map((id) => page.nodes[id].parentId), [group.id, group.id, group.id]);
  assert.equal(state.history.past.length, historyBefore + 1);
  assertValidEditorDocument(state.document);
});

test('group rejects mixed parents, root, locked nodes and rolls back exactly', () => {
  const state = createEditorState();
  const rootId = activePage(state).rootId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION, parentId: rootId } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: rootId } });
  const second = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.CONTAINER, parentId: first } });
  const nested = state.selection.primaryId;

  execute(state, { type: 'selection.set', payload: { ids: [first, nested] } });
  const beforeMixed = structuredClone(state.document);
  assert.throws(() => execute(state, { type: 'hierarchy.group' }));
  assert.deepEqual(state.document, beforeMixed);

  execute(state, { type: 'selection.set', payload: { ids: [rootId, second] } });
  const beforeRoot = structuredClone(state.document);
  assert.throws(() => execute(state, { type: 'hierarchy.group' }));
  assert.deepEqual(state.document, beforeRoot);

  execute(state, { type: 'element.lock.set', payload: { nodeId: second, locked: true } });
  execute(state, { type: 'selection.set', payload: { ids: [first, second] } });
  const beforeLocked = structuredClone(state.document);
  assert.throws(() => execute(state, { type: 'hierarchy.group' }));
  assert.deepEqual(state.document, beforeLocked);
  assertValidEditorDocument(state.document);
});

test('ungroup restores children at the group position and preserves order', () => {
  const state = createEditorState();
  const rootId = activePage(state).rootId;
  for (const type of [NODE_TYPES.SECTION, NODE_TYPES.TEXT, NODE_TYPES.BUTTON]) {
    execute(state, { type: 'element.add', payload: { type, parentId: rootId } });
  }
  const original = [...activePage(state).nodes[rootId].children];
  execute(state, { type: 'selection.set', payload: { ids: [original[0], original[1], original[2]] } });
  execute(state, { type: 'hierarchy.group' });
  const groupId = state.selection.primaryId;

  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.IMAGE, parentId: rootId } });
  const trailing = state.selection.primaryId;
  const beforeUngroup = [...activePage(state).nodes[rootId].children];

  execute(state, { type: 'hierarchy.ungroup', payload: { nodeId: groupId } });
  const page = activePage(state);
  assert.equal(page.nodes[groupId], undefined);
  assert.deepEqual(page.nodes[rootId].children, [original[0], original[1], original[2], trailing]);
  assert.deepEqual(state.selection.ids, original);
  assert.equal(state.selection.primaryId, original[2]);
  assert.equal(beforeUngroup[0], groupId);
  assertValidEditorDocument(state.document);
});

test('ungroup rejects non-group, locked group and locked child with exact rollback', () => {
  const state = createEditorState();
  const rootId = activePage(state).rootId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION, parentId: rootId } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: rootId } });
  const second = state.selection.primaryId;

  execute(state, { type: 'selection.set', payload: { ids: [first, second] } });
  execute(state, { type: 'hierarchy.group' });
  const groupId = state.selection.primaryId;

  assert.throws(() => execute(state, { type: 'hierarchy.ungroup', payload: { nodeId: first } }));
  assert.equal(activePage(state).nodes[groupId].type, NODE_TYPES.GROUP);

  execute(state, { type: 'element.lock.set', payload: { nodeId: groupId, locked: true } });
  const beforeLockedGroup = structuredClone(state.document);
  assert.throws(() => execute(state, { type: 'hierarchy.ungroup', payload: { nodeId: groupId } }));
  assert.deepEqual(state.document, beforeLockedGroup);

  execute(state, { type: 'element.lock.set', payload: { nodeId: groupId, locked: false } });
  execute(state, { type: 'element.lock.set', payload: { nodeId: first, locked: true } });
  const beforeLockedChild = structuredClone(state.document);
  assert.throws(() => execute(state, { type: 'hierarchy.ungroup', payload: { nodeId: groupId } }));
  assert.deepEqual(state.document, beforeLockedChild);
  assertValidEditorDocument(state.document);
});

test('group and ungroup each use one history entry and undo/redo restore exact documents', () => {
  const state = createEditorState();
  const rootId = activePage(state).rootId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: rootId } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: rootId } });
  const second = state.selection.primaryId;
  execute(state, { type: 'selection.set', payload: { ids: [first, second] } });

  const beforeGroup = structuredClone(state.document);
  const historyBeforeGroup = state.history.past.length;
  execute(state, { type: 'hierarchy.group' });
  const afterGroup = structuredClone(state.document);
  assert.equal(state.history.past.length, historyBeforeGroup + 1);

  execute(state, { type: 'history.undo' });
  assert.deepEqual(state.document, beforeGroup);
  execute(state, { type: 'history.redo' });
  assert.deepEqual(state.document, afterGroup);

  const groupId = state.selection.primaryId;
  const beforeUngroup = structuredClone(state.document);
  const historyBeforeUngroup = state.history.past.length;
  execute(state, { type: 'hierarchy.ungroup', payload: { nodeId: groupId } });
  const afterUngroup = structuredClone(state.document);
  assert.equal(state.history.past.length, historyBeforeUngroup + 1);

  execute(state, { type: 'history.undo' });
  assert.deepEqual(state.document, beforeUngroup);
  execute(state, { type: 'history.redo' });
  assert.deepEqual(state.document, afterUngroup);
  assertValidEditorDocument(state.document);
});

test('undo and redo restore exact document snapshots', () => {
  const state = createEditorState();
  const initial = structuredClone(state.document);
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  assert.notDeepEqual(state.document, initial);
  execute(state, { type: 'history.undo' });
  assert.deepEqual(state.document, initial);
  execute(state, { type: 'history.redo' });
  assert.equal(Object.keys(activePage(state).nodes).length, 2);
  assertValidEditorDocument(state.document);
});

test('batch commands are grouped into one undo entry', () => {
  const state = createEditorState();
  const rootId = activePage(state).rootId;
  executeBatch(state, [
    { type: 'element.add', payload: { type: NODE_TYPES.SECTION, parentId: rootId } },
    { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: rootId } }
  ], { label: 'Create section and text' });
  assert.equal(state.history.past.length, 1);
  assert.equal(activePage(state).nodes[activePage(state).rootId].children.length, 2);
  execute(state, { type: 'history.undo' });
  assert.equal(Object.keys(activePage(state).nodes).length, 1);
  execute(state, { type: 'history.redo' });
  assert.equal(Object.keys(activePage(state).nodes).length, 3);
  assertValidEditorDocument(state.document);
});

test('manual transaction can be committed or rolled back', () => {
  const state = createEditorState();
  beginTransaction(state, 'manual');
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  commitTransaction(state);
  assert.equal(state.history.past.length, 1);

  const before = structuredClone(state.document);
  beginTransaction(state, 'rollback');
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  rollbackTransaction(state);
  assert.deepEqual(state.document, before);  assertValidEditorDocument(state.document);
});

test('unknown command fails without corrupting the document', () => {
  const state = createEditorState();
  const before = structuredClone(state.document);
  assert.throws(() => execute(state, { type: 'does.not.exist' }));
  assert.deepEqual(state.document, before);
  assert.equal(state.runtime.activeCommand, null);
  assertValidEditorDocument(state.document);
});


test('publish validator blocks invalid Page Model and accepts valid document', () => {
  const valid = createDocument();
  const pageId = valid.activePageId;
  assert.equal(validatePublishDocument(valid, pageId), null);

  const missingRoot = structuredClone(valid);
  const page = missingRoot.pages[pageId];
  delete page.nodes[page.rootId];
  assert.equal(validatePublishDocument(missingRoot, pageId), 'INVALID_PAGE_ROOT');

  const invalidParent = structuredClone(valid);
  const root = invalidParent.pages[pageId].nodes[invalidParent.pages[pageId].rootId];
  const childId = 'invalid-child';
  root.children = [childId];
  invalidParent.pages[pageId].nodes[childId] = {
    id: childId,
    type: NODE_TYPES.TEXT,
    name: 'Invalid child',
    parentId: 'missing-parent',
    children: [],
    props: {},
    style: {},
    responsive: { desktop: {}, tablet: {}, mobile: {} },
    states: {}
  };
  assert.equal(validatePublishDocument(invalidParent, pageId), 'INVALID_NODE_PARENT');

  const cycle = structuredClone(valid);
  const cycleA = 'cycle-a';
  const cycleB = 'cycle-b';
  const cycleRoot = cycle.pages[pageId].nodes[cycle.pages[pageId].rootId];
  cycleRoot.children = [];
  cycle.pages[pageId].nodes[cycleA] = {
    id: cycleA,
    type: NODE_TYPES.TEXT,
    name: 'Cycle A',
    parentId: cycleB,
    children: [cycleB],
    props: {},
    style: {},
    responsive: { desktop: {}, tablet: {}, mobile: {} },
    states: {}
  };
  cycle.pages[pageId].nodes[cycleB] = {
    id: cycleB,
    type: NODE_TYPES.TEXT,
    name: 'Cycle B',
    parentId: cycleA,
    children: [cycleA],
    props: {},
    style: {},
    responsive: { desktop: {}, tablet: {}, mobile: {} },
    states: {}
  };
  assert.equal(validatePublishDocument(cycle, pageId), 'INVALID_HIERARCHY');
});

test('Schedule preview renderer uses canonical config without mutating domain data', () => {
  const defaults = createDefaultScheduleConfig();
  const upcoming = getSchedulePreviewItems(defaults);
  assert.equal(upcoming.length, 2);
  assert.equal(upcoming[0].platform, 'Twitch');

  const next = getSchedulePreviewItems({ ...defaults, mode: 'next', limit: 50 });
  assert.equal(next.length, 1);
  assert.equal(next[0].id, 'preview-1');

  const youtube = getSchedulePreviewItems({ ...defaults, platforms: ['YouTube'] });
  assert.equal(youtube.length, 1);
  assert.equal(youtube[0].platform, 'YouTube');

  const completedOnly = getSchedulePreviewItems({ ...defaults, statuses: ['completed'] });
  assert.equal(completedOnly.length, 0);
});
 
test('schedule nodes receive the canonical domain binding', () => {
  const node = createNode(NODE_TYPES.SCHEDULE);
  assert.deepEqual(node.dataBindings, {
    schedule: { source: 'schedule_items', version: 1 }
  });
});

test('schedule read config normalizes canonical query constraints', async () => {
  const { normalizeScheduleReadConfig } = await import('../../../src/core/schedule-read.ts');
  assert.deepEqual(normalizeScheduleReadConfig({ mode: 'next', limit: 50, statuses: ['live', 'live'], platforms: [' Twitch '], order: 'desc' }), {
    siteId: 'site-default',
    mode: 'next',
    limit: 1,
    statuses: ['live'],
    platforms: ['Twitch'],
    order: 'desc'
  });
  assert.throws(() => normalizeScheduleReadConfig({ limit: 51 }));
  assert.throws(() => normalizeScheduleReadConfig({ statuses: ['cancelled'] }));
  assert.throws(() => normalizeScheduleReadConfig({ platforms: [''] }));
});


test('undo and redo restore selection with the corresponding Page Model snapshot', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const sectionId = state.selection.primaryId;

  execute(state, { type: 'history.undo' });
  assert.equal(activePage(state).nodes[sectionId], undefined);
  assert.deepEqual(state.selection, { ids: [], primaryId: null });

  execute(state, { type: 'history.redo' });
  assert.ok(activePage(state).nodes[sectionId]);
  assert.deepEqual(state.selection, { ids: [sectionId], primaryId: sectionId });

  execute(state, { type: 'element.delete', payload: { nodeId: sectionId } });
  assert.deepEqual(state.selection, { ids: [], primaryId: null });
  execute(state, { type: 'history.undo' });
  assert.ok(activePage(state).nodes[sectionId]);
  assert.deepEqual(state.selection, { ids: [sectionId], primaryId: sectionId });
  execute(state, { type: 'history.redo' });
  assert.equal(activePage(state).nodes[sectionId], undefined);
  assert.deepEqual(state.selection, { ids: [], primaryId: null });
});

test('transaction rollback restores selection as well as the document', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const sectionId = state.selection.primaryId;
  const before = structuredClone(state.document);
  beginTransaction(state, 'selection rollback');
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: sectionId } });
  assert.notEqual(state.selection.primaryId, sectionId);
  rollbackTransaction(state);
  assert.deepEqual(state.document, before);
  assert.deepEqual(state.selection, { ids: [sectionId], primaryId: sectionId });
  assertValidEditorDocument(state.document);
});


test('failed atomic batch restores selection, redo history, and persistence state', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const sectionId = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: sectionId } });
  execute(state, { type: 'history.undo' });

  const documentBefore = structuredClone(state.document);
  const selectionBefore = structuredClone(state.selection);
  const pastBefore = structuredClone(state.history.past);
  const futureBefore = structuredClone(state.history.future);
  const persistenceBefore = structuredClone(state.persistence);

  assert.throws(() => executeBatch(state, [
    { type: 'element.add', payload: { type: NODE_TYPES.BUTTON, parentId: sectionId } },
    { type: 'hierarchy.reparent', payload: { nodeId: sectionId, parentId: 'missing-parent' } }
  ], { label: 'must rollback atomically' }));

  assert.deepEqual(state.document, documentBefore);
  assert.deepEqual(state.selection, selectionBefore);
  assert.deepEqual(state.history.past, pastBefore);
  assert.deepEqual(state.history.future, futureBefore);
  assert.deepEqual(state.persistence, persistenceBefore);
  assertValidEditorDocument(state.document);
});


test('non-atomic batch records its successful prefix as one undoable history entry', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const sectionId = state.selection.primaryId;
  const historyBefore = state.history.past.length;

  assert.throws(() => executeBatch(state, [
    { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: sectionId } },
    { type: 'hierarchy.reparent', payload: { nodeId: sectionId, parentId: 'missing-parent' } }
  ], { label: 'keep successful prefix', atomic: false }));

  const page = activePage(state);
  assert.equal(page.nodes[sectionId].children.length, 1);
  const textId = page.nodes[sectionId].children[0];
  assert.equal(page.nodes[textId].type, NODE_TYPES.TEXT);
  assert.equal(state.history.past.length, historyBefore + 1);
  assert.equal(state.history.past.at(-1).action.type, 'transaction');
  assert.equal(state.persistence.dirty, true);
  execute(state, { type: 'history.undo' });
  assert.deepEqual(activePage(state).nodes[sectionId].children, []);
  assert.deepEqual(state.selection, { ids: [sectionId], primaryId: sectionId });
  execute(state, { type: 'history.redo' });
  assert.deepEqual(activePage(state).nodes[sectionId].children, [textId]);
  assert.deepEqual(state.selection, { ids: [textId], primaryId: textId });
  assertValidEditorDocument(state.document);
});


test('Editor save conflict exposes recoverable local-draft export and explicit reload', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(app, /error\.status=response\.status;error\.code=data\?\.error\?\.code/);
  assert.match(app, /e\?\.status===409&&e\?\.code==='REVISION_CONFLICT'/);
  assert.match(app, /function exportConflictDraft\(\)[\s\S]*?URL\.createObjectURL/);
  assert.match(app, /function reloadLatestAfterConflict\(\)[\s\S]*?await loadPage\(conflict\.pageId,\{discardConfirmed:true\}\)/);
  assert.match(app, /async function loadPage\(id,\{discardConfirmed=false\}=\{\}\)[\s\S]*?state\?\.persistence\?\.dirty&&!discardConfirmed/);
  assert.match(html, /id="revisionConflict"[^>]*role="alert"[^>]*hidden/);
  assert.match(html, /id="exportConflictDraft"/);
  assert.match(html, /id="reloadConflictPage"/);
});


test('Editor save/reload uses server revision and fails closed on incomplete save responses', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const loadPage = app.slice(app.indexOf('async function loadPage('), app.indexOf('async function rollbackToRevision('));
  const save = app.slice(app.indexOf('async function save('), app.indexOf('async function unpublishPage('));

  assert.match(loadPage, /const rawRevision=revisions\.length\?Number\(revisions\[0\]\?\.version\):0/);
  assert.match(loadPage, /document\.revision=latestRevision;document\.pages\[id\]\.revision=latestRevision/);
  assert.doesNotMatch(loadPage, /revisions\[0\]\?\.version\|\|meta\.revision/);
  assert.match(save, /const submittedDocument=structuredClone\(stateAtStart\.document\)/);
  assert.match(save, /JSON\.stringify\(stateAtStart\.document\)===submittedJson/);
  assert.match(save, /!Number\.isInteger\(version\)\|\|version<1/);
  assert.match(save, /stateAtStart\.persistence\.dirty=true/);
  assert.match(save, /további helyi módosítások még nincsenek mentve/);
});


test('Editor save and rollback require revision preconditions on the server', () => {
  const route = readFileSync(new URL('../../../src/routes/admin/editor.ts', import.meta.url), 'utf8');
  const save = route.slice(route.indexOf("if(request.method==='POST')"), route.indexOf("if(request.method==='PUT')"));
  const rollback = route.slice(route.indexOf("if(request.method==='PUT')"));
  assert.match(save, /EXPECTED_VERSION_REQUIRED/);
  assert.match(rollback, /EXPECTED_VERSION_REQUIRED/);
  assert.match(save, /REVISION_CONFLICT/);
  assert.match(rollback, /REVISION_CONFLICT/);
  assert.match(save, /pageId&&pageId!==id/);
  assert.match(rollback, /pageId&&pageId!==id/);
});

test('Editor UI submits revision preconditions and prevents overlapping local saves', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const save = app.slice(app.indexOf('async function save('), app.indexOf('async function unpublishPage('));
  const rollback = app.slice(app.indexOf('async function rollbackToRevision('), app.indexOf('async function createNew('));
  assert.match(save, /state\?\.persistence\?\.saving/);
  assert.match(save, /expectedVersion/);
  assert.match(rollback, /expectedVersion:latest/);
});

test('Editor save and rollback use database-level conditional revision inserts', () => {
  const route = readFileSync(new URL('../../../src/routes/admin/editor.ts', import.meta.url), 'utf8');
  const save = route.slice(route.indexOf("if(request.method==='POST')"), route.indexOf("if(request.method==='PUT')"));
  const rollback = route.slice(route.indexOf("if(request.method==='PUT')"));
  for (const block of [save, rollback]) {
    assert.match(block, /INSERT INTO editor_revisions[^\x60]*SELECT \?,\?,\?,\?,\?,\? WHERE \(SELECT COALESCE\(MAX\(version\),0\) FROM editor_revisions WHERE page_id=\?\)=\?/);
    assert.match(block, /results\[0\]\?\.meta\?\.changes/);
    assert.match(block, /EXISTS \(SELECT 1 FROM editor_revisions WHERE id=\?\)/);
  }
});

test('Editor publish update requires the successful save revision', () => {
  const route = readFileSync(new URL('../../../src/routes/admin/editor.ts', import.meta.url), 'utf8');
  const save = route.slice(route.indexOf("if(request.method==='POST')"), route.indexOf("if(request.method==='PUT')"));
  assert.match(save, /UPDATE pages SET published_content_json=[^\x60]*EXISTS \(SELECT 1 FROM editor_revisions WHERE id=\?\)/);
  assert.match(save, /bind\(json,revId,id,siteId,revId\)/);
});

test('Editor audit entries are conditional on a successfully inserted revision', () => {
  const route = readFileSync(new URL('../../../src/routes/admin/editor.ts', import.meta.url), 'utf8');
  const save = route.slice(route.indexOf("if(request.method==='POST')"), route.indexOf("if(request.method==='PUT')"));
  const rollback = route.slice(route.indexOf("if(request.method==='PUT')"));
  for (const block of [save, rollback]) {
    assert.match(block, /INSERT INTO audit_log[^\x27]*SELECT \?,\?,\?,\?,\?,\? WHERE EXISTS \(SELECT 1 FROM editor_revisions WHERE id=\?\)/);
  }
  assert.match(save, /'page.publish'/);
  assert.match(rollback, /'page.rollback'/);
});

test('Editor failed save retains dirty state and does not mark changes saved', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const save = app.slice(app.indexOf('async function save('), app.indexOf('async function unpublishPage('));
  const failure = save.slice(save.indexOf('}catch(e){'));
  assert.match(failure, /stateAtStart\.persistence\.saving=false;stateAtStart\.persistence\.dirty=true/);
  assert.doesNotMatch(failure, /markSaved\(/);
  assert.match(failure, /stateAtStart\.persistence\.error=/);
});

test('Editor preserves edits made while a save request is in flight', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const save = app.slice(app.indexOf('async function save('), app.indexOf('async function unpublishPage('));
  assert.match(save, /const submittedDocument=structuredClone\(stateAtStart\.document\)/);
  assert.match(save, /const submittedJson=JSON\.stringify\(submittedDocument\)/);
  assert.match(save, /const unchanged=state===stateAtStart&&JSON\.stringify\(stateAtStart\.document\)===submittedJson/);
  assert.match(save, /if\(unchanged\)\{markSaved\(stateAtStart,version\)\}else\{stateAtStart\.persistence\.saving=false;stateAtStart\.persistence\.dirty=true/);
  assert.match(save, /meta\.revision=version/);
  assert.match(save, /további helyi módosítások még nincsenek mentve/);
});

test('Authored video uses site-scoped poster assets without exposing video upload or changing legacy poster', async () => {
 const {authoredNodeHtml,normalizeContentField,CONTENT_FIELDS}=await import('../core/authored-content.js');
 const state=createEditorState(),root=activePage(state).rootId,id='6b1c2e65-e46e-4764-b234-123456789abc';
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.VIDEO,parentId:root}});
 const videoId=state.selection.primaryId,pageId=state.document.activePageId;
 execute(state,{type:'content.properties.set',payload:{nodeId:videoId,patch:{src:'https://cdn.example.com/clip.mp4',poster:'/images/legacy.jpg',controls:true}}});
 let video=activePage(state).nodes[videoId];
 assert.match(authoredNodeHtml(video),/poster="\/images\/legacy.jpg"/);
 const poster=CONTENT_FIELDS.video.find(f=>f.key==='posterAssetId');
 assert.equal(poster.type,'asset');
 assert.throws(()=>normalizeContentField(poster,'../../wrong'));
 const before=structuredClone(state.document);
 assert.throws(()=>execute(state,{type:'content.properties.set',payload:{nodeId:videoId,patch:{posterAssetId:'javascript:alert(1)'}}}));
 assert.deepEqual(state.document,before);
 execute(state,{type:'content.properties.set',payload:{nodeId:videoId,patch:{posterAssetId:id}}});
 video=activePage(state).nodes[videoId];
 assert.match(authoredNodeHtml(video,{editor:true}),new RegExp('poster="/api/admin/media\\?id='+id+'"'));
 assert.match(authoredNodeHtml(video),new RegExp('poster="/media/'+id+'"'));
 assert.equal(video.props.poster,'/images/legacy.jpg','legacy URL retained as fallback');
 assert.equal(validatePublishDocument(state.document,pageId),null);
 execute(state,{type:'history.undo'});
 assert.match(authoredNodeHtml(activePage(state).nodes[videoId]),/poster="\/images\/legacy.jpg"/);
 execute(state,{type:'history.redo'});
 assert.match(authoredNodeHtml(activePage(state).nodes[videoId]),new RegExp('poster="/media/'+id+'"'));
 const invalid=structuredClone(state.document);
 invalid.pages[pageId].nodes[videoId].props.posterAssetId='invalid';
 assert.equal(validatePublishDocument(invalid,pageId),'INVALID_EDITOR_CONTENT');
});

test('new media remains editable as draft and publish requires a safe source and accessible image', () => {
  const state=createEditorState();
  const root=activePage(state).rootId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.IMAGE,parentId:root}});
  const imageId=state.selection.primaryId;
  const publish=()=>validatePublishDocument(state.document,state.document.activePageId);
  assert.equal(publish(),'INVALID_MEDIA_SOURCE');
  execute(state,{type:'element.update',payload:{nodeId:imageId,patch:{props:{src:'/uploads/banner.png'}}}});
  assert.equal(publish(),'IMAGE_ALT_REQUIRED');
  execute(state,{type:'element.update',payload:{nodeId:imageId,patch:{props:{src:'/uploads/banner.png',alt:'Borítókép'}}}});
  assert.equal(publish(),null);
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.VIDEO,parentId:root,props:{src:'javascript:alert(1)'}}});
  const videoId=state.selection.primaryId;
  assert.equal(publish(),'INVALID_MEDIA_SOURCE');
  execute(state,{type:'element.update',payload:{nodeId:videoId,patch:{props:{src:'https://cdn.example.com/intro.mp4'}}}});
  assert.equal(publish(),null);
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.AUDIO,parentId:root,props:{src:'/media/theme.mp3'}}});
  assert.equal(publish(),null);
  assertValidEditorDocument(state.document);
  execute(state,{type:'element.update',payload:{nodeId:imageId,patch:{accessibility:{decorative:true},props:{src:'/uploads/decor.png'}}}});
  assert.equal(publish(),null);
  // Previously saved pages without the new contract are not silently migrated.
  const legacy=structuredClone(state.document);
  const img=legacy.pages[legacy.activePageId].nodes[imageId];
  delete img.metadata.editorContentVersion;
  img.props={};
  assert.equal(validatePublishDocument(legacy,legacy.activePageId),null);
  const publicRenderer=readFileSync(new URL('../../assets/page-renderer.js',import.meta.url),'utf8');
  assert.match(publicRenderer,/visual-video/);
  assert.match(publicRenderer,/visual-audio/);
});

test('structured elements share a versioned content contract, publish guard and undo',()=>{
 for(const type of ['list','table','tabs','accordion','gallery','carousel']){
  const state=createEditorState(),root=activePage(state).rootId;
  execute(state,{type:'element.add',payload:{type,parentId:root}});
  const id=state.selection.primaryId,n=activePage(state).nodes[id];
  assert.equal(n.metadata.structuredContentVersion,1);
  assert.deepEqual(n.props.contentModel,createElementContent(type));
  assertValidEditorDocument(state.document);
  const err=validatePublishDocument(state.document,state.document.activePageId);
  assert.equal(err,type==='gallery'?'INVALID_GALLERY_IMAGE':null,type);
  const html=renderElementContent(type,n.props.contentModel,id);
  assert.ok(html.length>20);
  if(type==='gallery'){
   const model={version:1,items:[{src:'/media/safe.png',alt:'Magyar felirat',caption:'Képaláírás'}]};
   execute(state,{type:'element.update',payload:{nodeId:id,patch:{props:{...n.props,contentModel:model}}}});
   assert.equal(validatePublishDocument(state.document,state.document.activePageId),null);
   const bad={version:1,items:[{src:'javascript:alert(1)',alt:'Teszt',caption:''}]};
   assert.equal(validateElementContent('gallery',bad),'INVALID_GALLERY_IMAGE');
  }
  execute(state,{type:'history.undo'});
  assertValidEditorDocument(state.document);
 }
});
test('structured models sanitize content and strictly validate dimensions',()=>{
 assert.equal(safeMediaUrl('javascript:alert(1)'),'');
 assert.equal(safeMediaUrl('//attacker.example/image.png'),'');
 assert.equal(safeMediaUrl('/image.png'),'/image.png');
 assert.equal(safeMediaUrl('https://cdn.example.com/photo.jpg'),'https://cdn.example.com/photo.jpg');
 assert.throws(()=>normalizeElementContent('table',{version:1,rows:[['a','b'],['c']]}));
 assert.equal(validateElementContent('tabs',{version:1,items:[{label:'',content:'content'}]}),'INCOMPLETE_INTERACTIVE_CONTENT');
 assert.equal(validateElementContent('gallery',{version:1,items:[{src:'/photo.jpg',alt:'',caption:''}]}),'GALLERY_ALT_REQUIRED');
 const malicious={version:1,items:[{label:'<script>alert(1)</script>',content:'<img src=x onerror=alert(1)>'}]};
 const html=renderElementContent('tabs',malicious,'abc');
 assert.ok(html.includes('&lt;script&gt;'));
 assert.ok(!html.includes('<script>'));
 assert.ok(html.includes('role="tab"'));
 assert.ok(html.includes('role="tabpanel"'));
 const details=renderElementContent('accordion',{version:1,items:[{label:'FAQ',content:'Details'}]},'faq');
 assert.ok(details.includes('<details'));
 assert.ok(details.includes('<summary'));
 const table=renderElementContent('table',{version:1,rows:[['Header'],['Data']]},'table');
 assert.ok(table.includes('<th scope="col">Header</th>'));
});

test('heading levels and safe external link targets reach the public renderer without script injection',()=>{
 const source=readFileSync(new URL('../../assets/page-renderer.js',import.meta.url),'utf8');
 assert.match(source,/const level=Number.isInteger\(p.level\)/);
 assert.match(source,/target="\_blank" rel="noopener noreferrer"/);
 assert.match(source,/safeRichUrl\(p.url\|\|p.href\)/);
 const state=createEditorState(),root=activePage(state).rootId;
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.HEADING,parentId:root}});
 const id=state.selection.primaryId;
 execute(state,{type:'element.update',payload:{nodeId:id,patch:{props:{text:'Kezdőlap',level:1}}}});
 assert.equal(activePage(state).nodes[id].props.level,1);
 assertValidEditorDocument(state.document);
});

test('copying an anchor regenerates a distinct element URL fragment',()=>{
 const state=createEditorState(),root=activePage(state).rootId;
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:root}});
 const id=state.selection.primaryId;
 execute(state,{type:'element.update',payload:{nodeId:id,patch:{accessibility:{anchorId:'profile',ariaLabel:'Profil szakasz'}}}});
 execute(state,{type:'element.duplicate',payload:{nodeId:id}});
 const clone=activePage(state).nodes[state.selection.primaryId];
 assert.equal(clone.accessibility.anchorId,'profile-copy');
 assert.equal(clone.accessibility.ariaLabel,'Profil szakasz');
 assert.equal(validatePublishDocument(state.document,state.document.activePageId),null);
 const broken=structuredClone(state.document);
 broken.pages[broken.activePageId].nodes[clone.id].accessibility.anchorId='profile';
 assert.equal(validatePublishDocument(broken,broken.activePageId),'DUPLICATE_ELEMENT_ANCHOR');
 const renderer=readFileSync(new URL('../../assets/page-renderer.js',import.meta.url),'utf8');
 assert.match(renderer,/aria-label/);
 // Legacy fragment attributes now resolve through the same canonical helper
 // as the Canvas and authored public nodes, rather than duplicate injections.
 assert.match(renderer,/contentAttributes\(node\)/);
 assert.doesNotMatch(renderer,/accessibility\?\.anchorId/);
});

test('carousel content validates optional media and accessible slide labels',()=>{
 const model=createElementContent('carousel');
 assert.equal(validateElementContent('carousel',model),null);
 model.items[0].src='/slides/screen.png';
 assert.equal(validateElementContent('carousel',model),'CAROUSEL_ALT_REQUIRED');
 model.items[0].alt='A stream képernyőképe';
 assert.equal(validateElementContent('carousel',model),null);
 const html=renderElementContent('carousel',model,'carousel-demo');
 assert.match(html,/aria-roledescription="carousel"/);
 assert.match(html,/aria-roledescription="dia"/);
 assert.match(html,/visual-carousel-next/);
});

test('hover/focus appearance writes into canonical node states and is undoable',()=>{
 const state=createEditorState();
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.BUTTON}});
 const id=state.selection.primaryId;
 execute(state,{type:'element.update',payload:{nodeId:id,patch:{states:{hover:{backgroundColor:'#123456',color:'#ffffff'},focus:{outlineColor:'#00ff00'}}}}});
 assert.equal(activePage(state).nodes[id].states.hover.backgroundColor,'#123456');
 assert.equal(validatePublishDocument(state.document,state.document.activePageId),null);
 execute(state,{type:'history.undo'});
 assert.equal(activePage(state).nodes[id].states.hover,undefined);
 const pub=readFileSync(new URL('../../assets/page-renderer.js',import.meta.url),'utf8');
 assert.match(pub,/visual-hover-bg/);
 assert.match(pub,/visual-focus-outline/);
});

test('atomic multi-selection appearance can be reverted with one undo and rejects locked nodes',()=>{
 const state=createEditorState(),root=activePage(state).rootId;
 for(let i=0;i<2;i++)execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:root}});
 const ids=[...activePage(state).nodes[root].children];
 const actions=ids.map(nodeId=>({type:'responsive.set',payload:{nodeId,device:'desktop',patch:{backgroundColor:'#112233',fontSize:'18px'}}}));
 executeBatch(state,actions,{label:'Közös megjelenés'});
 assert.deepEqual(ids.map(id=>activePage(state).nodes[id].responsive.desktop.backgroundColor),['#112233','#112233']);
 execute(state,{type:'history.undo'});
 assert.deepEqual(ids.map(id=>activePage(state).nodes[id].responsive.desktop.backgroundColor),[undefined,undefined]);
 execute(state,{type:'element.lock.set',payload:{nodeId:ids[1],locked:true}});
 const snapshot=structuredClone(state.document);
 assert.throws(()=>executeBatch(state,actions,{label:'Közös megjelenés'}));
 assert.deepEqual(state.document,snapshot);
});

test('badge, quote and icon use real defaults, safe publish validation and undo',()=>{
 const state=createEditorState(),root=activePage(state).rootId;
 for(const type of ['badge','quote','icon']){
  execute(state,{type:'element.add',payload:{type,parentId:root}});
  const n=activePage(state).nodes[state.selection.primaryId];
  assert.equal(n.metadata.basicContentVersion,1);
  assert.equal(validatePublishDocument(state.document,state.document.activePageId),null);
 }
 const nodes=Object.values(activePage(state).nodes);
 const quote=nodes.find(n=>n.type==='quote'),badge=nodes.find(n=>n.type==='badge'),icon=nodes.find(n=>n.type==='icon');
 assert.ok(quote.props.text.trim()&&badge.props.text.trim());
 assert.equal(iconById(icon.props.icon).glyph,'★');
 assert.equal(ICON_CHOICES.length,10);
 execute(state,{type:'element.update',payload:{nodeId:icon.id,patch:{props:{icon:'<script>'}}}});
 assert.equal(validatePublishDocument(state.document,state.document.activePageId),'INVALID_ICON_TYPE');
 execute(state,{type:'history.undo'});
 assert.equal(isSupportedIcon(activePage(state).nodes[icon.id].props.icon),true);
 execute(state,{type:'element.update',payload:{nodeId:quote.id,patch:{props:{text:''}}}});
 assert.equal(validatePublishDocument(state.document,state.document.activePageId),'EMPTY_BASIC_CONTENT');
 const source=readFileSync(new URL('../../assets/page-renderer.js',import.meta.url),'utf8');
 assert.match(source,/visual-badge/);
 assert.match(source,/visual-quote/);
 assert.match(source,/iconById/);
});

test('root appearance opts in only after an explicit edit and supports Undo/Redo without affecting child styles', () => {
  const state=createEditorState(),pageId=state.document.activePageId;
  const page=activePage(state),rootId=page.rootId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:rootId,props:{text:'Tartalom'}}});
  const child=state.selection.primaryId;
  assert.equal(page.nodes[rootId].metadata.rootStyleVersion,undefined,'unchanged pages retain legacy canvas');
  execute(state,{type:'responsive.set',payload:{nodeId:rootId,device:'desktop',patch:{backgroundColor:'#112233',padding:'24px',color:'#ffffff'}}});
  assert.equal(page.nodes[rootId].metadata.rootStyleVersion,1);
  assert.equal(page.nodes[rootId].responsive.desktop.padding,'24px');
  assert.equal(page.nodes[child].responsive.desktop.backgroundColor,undefined,'root edit does not alter child');
  execute(state,{type:'responsive.set',payload:{nodeId:rootId,device:'mobile',patch:{backgroundColor:'#abcdef'}}});
  assert.equal(page.nodes[rootId].responsive.mobile.backgroundColor,'#abcdef');
  execute(state,{type:'history.undo'});
  assert.equal(activePage(state).nodes[rootId].responsive.mobile.backgroundColor,undefined);
  execute(state,{type:'history.redo'});
  assert.equal(activePage(state).nodes[rootId].responsive.mobile.backgroundColor,'#abcdef');
  assert.equal(validatePublishDocument(state.document,pageId),null);
  const old=createDocument();
  old.pages[old.activePageId].nodes[old.pages[old.activePageId].rootId].style.backgroundColor='#f00';
  assert.equal(old.pages[old.activePageId].nodes[old.pages[old.activePageId].rootId].metadata.rootStyleVersion,undefined);
});

test('new divider and spacer keep their canonical visual contract without changing legacy pages', () => {
 const state=createEditorState(),root=activePage(state).rootId;
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.DIVIDER,parentId:root}});
 const dividerId=state.selection.primaryId,divider=activePage(state).nodes[dividerId];
 assert.equal(divider.metadata.decorativeVersion,1);
 assert.deepEqual(divider.props.decoration,{version:1,thickness:2,color:'#94a3b8',lineStyle:'solid'});
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.SPACER,parentId:root}});
 const spacerId=state.selection.primaryId,spacer=activePage(state).nodes[spacerId];
 assert.equal(spacer.metadata.spacerVersion,1);
 assert.equal(spacer.style.height,'64px');
 execute(state,{type:'responsive.set',payload:{nodeId:spacerId,device:'mobile',patch:{height:'40px'}}});
 assert.equal(spacer.responsive.mobile.height,'40px');
 execute(state,{type:'history.undo'});
 assert.equal(activePage(state).nodes[spacerId].responsive.mobile.height,undefined);
 execute(state,{type:'history.redo'});
 assert.equal(activePage(state).nodes[spacerId].responsive.mobile.height,'40px');
 const pageId=state.document.activePageId;
 assert.equal(validatePublishDocument(state.document,pageId),null);
 const invalid=structuredClone(state.document);
 invalid.pages[pageId].nodes[dividerId].props.decoration={version:1,thickness:500,color:'#abc',lineStyle:'solid'};
 assert.equal(validatePublishDocument(invalid,pageId),'INVALID_DIVIDER_CONFIG');
 const legacy=structuredClone(state.document);
 delete legacy.pages[pageId].nodes[dividerId].metadata.decorativeVersion;
 legacy.pages[pageId].nodes[dividerId].props.decoration={version:1,thickness:500,color:'bogus',lineStyle:'none'};
 assert.equal(validatePublishDocument(legacy,pageId),null,'old content is unchanged until opt-in');
 assertValidEditorDocument(state.document);
});

test('Card content model preserves nested elements and rejects unsafe links on Publish', () => {
 const state=createEditorState(),root=activePage(state).rootId;
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.CARD,parentId:root}});
 const cardId=state.selection.primaryId,card=activePage(state).nodes[cardId];
 assert.equal(card.metadata.cardContentVersion,1);
 assert.equal(card.props.cardContent.title,'Új kártya');
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:cardId,props:{text:'Egyedi belső tartalom'}}});
 const childId=state.selection.primaryId;
 assert.ok(activePage(state).nodes[cardId].children.includes(childId),'Card remains a real container');
 const pageId=state.document.activePageId;
 assert.equal(validatePublishDocument(state.document,pageId),null);
 execute(state,{type:'element.update',payload:{nodeId:cardId,patch:{props:{cardContent:{
  version:1,title:'Kreatív kártya',description:'Bemutatkozó kártya',variant:'glass',
  imageSrc:'/images/hero.jpg',imageAlt:'Fénykép',actionLabel:'Részletek',actionHref:'/p/about',newWindow:false
 }}}}});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 const invalid=structuredClone(state.document);
 invalid.pages[pageId].nodes[cardId].props.cardContent.actionHref='javascript:alert(1)';
 assert.equal(validatePublishDocument(invalid,pageId),'INVALID_CARD_CONTENT');
 invalid.pages[pageId].nodes[cardId].props.cardContent.actionHref='/p/about';
 invalid.pages[pageId].nodes[cardId].props.cardContent.imageAlt='';
 assert.equal(validatePublishDocument(invalid,pageId),'INVALID_CARD_CONTENT');
 const legacy=structuredClone(state.document);
 const oldCard=legacy.pages[pageId].nodes[cardId];
 delete oldCard.metadata.cardContentVersion;
 oldCard.props.cardContent={bad:'old'};
 assert.equal(validatePublishDocument(legacy,pageId),null,'old card appearance is not migrated automatically');
 assertValidEditorDocument(state.document);
});

test('Card shared Media IDs preserve legacy URLs and reject malformed unpublished IDs', async () => {
 const {normalizeCardContent,defaultCardContent,cardImageSrc}=await import('../core/card-content.js');
 const id='11111111-2222-4333-8444-555555555555';
 const original={...defaultCardContent(),imageSrc:'/images/legacy.jpg',imageAlt:'Kártya fénykép'};
 assert.equal(normalizeCardContent(original).imageAssetId,'','legacy URL cards need no migration');
 assert.equal(cardImageSrc(original),'/images/legacy.jpg');
 const selected={...original,imageAssetId:id};
 assert.equal(cardImageSrc(selected,{editor:true}),'/api/admin/media?id='+id);
 assert.equal(cardImageSrc(selected),'/media/'+id);
 assert.equal(normalizeCardContent(selected).imageAssetId,id);
 assert.throws(()=>normalizeCardContent({...selected,imageAssetId:'javascript:alert(1)'}));
 assert.throws(()=>normalizeCardContent({...selected,imageAlt:''}));
 const state=createEditorState(),root=activePage(state).rootId;
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.CARD,parentId:root}});
 const cardId=state.selection.primaryId,pageId=state.document.activePageId;
 execute(state,{type:'element.update',payload:{nodeId:cardId,patch:{props:{cardContent:selected}}}});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 execute(state,{type:'history.undo'});
 assert.equal(activePage(state).nodes[cardId].props.cardContent.imageAssetId,'');
 execute(state,{type:'history.redo'});
 assert.equal(activePage(state).nodes[cardId].props.cardContent.imageAssetId,id);
 const invalid=structuredClone(state.document);invalid.pages[pageId].nodes[cardId].props.cardContent.imageAssetId='not-a-uuid';
 assert.equal(validatePublishDocument(invalid,pageId),'INVALID_CARD_CONTENT');
});

test('Countdown deadline is stable, editable and blocked at Publish if incomplete',async()=>{
 const {remainingText,remainingParts,normalizeCountdownContent,defaultCountdownContent}=await import('../core/countdown-content.js');
 const state=createEditorState(),root=activePage(state).rootId;
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.COUNTDOWN,parentId:root}});
 const id=state.selection.primaryId,pageId=state.document.activePageId;
 const node=activePage(state).nodes[id];
 assert.equal(node.metadata.countdownVersion,1);
 assert.equal(validatePublishDocument(state.document,pageId),'INVALID_COUNTDOWN_CONTENT');
 assert.equal(remainingParts('',0),null);
 const target='2026-12-25T20:00:00.000Z';
 assert.deepEqual(remainingParts(target,Date.parse('2026-12-24T18:29:30Z')),{expired:false,days:1,hours:1,minutes:30,seconds:30});
 assert.match(remainingText(target,Date.parse('2026-12-24T18:29:30Z')),/1 nap · 01 óra · 30 perc · 30 mp/);
 assert.equal(remainingText(target,Date.parse(target)+1,true,'Vége'),'Vége');
 const valid={...defaultCountdownContent(),targetISO:target,title:'Élő adás',finishText:'Már élőben!'};
 assert.deepEqual(normalizeCountdownContent(valid),valid);
 execute(state,{type:'element.update',payload:{nodeId:id,patch:{props:{countdown:valid}}}});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 execute(state,{type:'history.undo'});
 assert.equal(validatePublishDocument(state.document,pageId),'INVALID_COUNTDOWN_CONTENT');
 execute(state,{type:'history.redo'});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 assert.throws(()=>normalizeCountdownContent({...valid,targetISO:'2026-12-25T20:00:00'}));
 assert.throws(()=>normalizeCountdownContent({...valid,targetISO:'javascript:alert(1)'}));
 const broken=structuredClone(state.document);
 broken.pages[pageId].nodes[id].props.countdown.targetISO='bad date';
 assert.equal(validatePublishDocument(broken,pageId),'INVALID_COUNTDOWN_CONTENT');
 const legacy=structuredClone(state.document);
 delete legacy.pages[pageId].nodes[id].metadata.countdownVersion;
 legacy.pages[pageId].nodes[id].props.countdown={bad:'old'};
 assert.equal(validatePublishDocument(legacy,pageId),null);
 assertValidEditorDocument(state.document);
});

test('Social Links: typed platforms, safe URLs, empty draft, accessible output, Undo/Redo and legacy isolation',async()=>{
 const {defaultSocialLinks,defaultSocialEntry,normalizeSocialLinks,socialLinkUrl,renderSocialLinksHtml}=await import('../core/social-links.js');
 assert.equal(socialLinkUrl('https://twitch.tv/example','twitch'),'https://twitch.tv/example');
 assert.equal(socialLinkUrl('/p/about','website'),'/p/about');
 assert.equal(socialLinkUrl('#contact','website'),'#contact');
 assert.equal(socialLinkUrl('mailto:hello@example.com','email'),'mailto:hello@example.com');
 for(const malicious of ['javascript:alert(1)','data:text/html,hello','http://unsafe.example','//evil.example','https://user:secret@example.com','https://site.example/\nscript','https://site.example\\@evil.com']){
  assert.equal(socialLinkUrl(malicious,'website'),'','Unsafe social link accepted: '+malicious);
 }
 assert.equal(socialLinkUrl('/internal','twitch'),'','platform-specific links require HTTPS');
 const state=createEditorState(),root=activePage(state).rootId,pageId=state.document.activePageId;
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.SOCIAL,parentId:root}});
 const id=state.selection.primaryId,node=activePage(state).nodes[id];
 assert.equal(node.metadata.socialLinksVersion,1);
 assert.deepEqual(node.props.socialLinks,defaultSocialLinks());
 assert.equal(validatePublishDocument(state.document,pageId),'INVALID_SOCIAL_LINKS','incomplete draft cannot be published');
 const entries=[
  {...defaultSocialEntry('twitch','link1'),label:'Nézd a <streamet>',href:'https://twitch.tv/example'},
  {...defaultSocialEntry('website','link2'),label:'Részletek',href:'/p/about',newWindow:false},
  {...defaultSocialEntry('email','link3'),label:'Írj nekem',href:'mailto:hello@example.com',newWindow:false}
 ];
 const valid={version:1,variant:'cards',layout:'grid',showIcons:true,items:entries};
 assert.deepEqual(normalizeSocialLinks(valid),valid);
 execute(state,{type:'element.update',payload:{nodeId:id,patch:{props:{...node.props,socialLinks:valid}}}});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 const markup=renderSocialLinksHtml(valid);
 assert.match(markup,/visual-social-cards/);
 assert.match(markup,/visual-social-grid/);
 assert.match(markup,/aria-label="Közösségi elérhetőségek"/);
 assert.ok(!markup.includes('<streamet>'),'HTML injection in link label');
 assert.match(markup,/&lt;streamet&gt;/);
 assert.match(markup,/rel="noopener noreferrer"/);
 assert.match(markup,/href="mailto:hello@example.com"/);
 assert.equal((markup.match(/<li class="visual-social-item">/g)||[]).length,3);
 const draft={...valid,items:[{...entries[0],href:'javascript:alert(1)'}]};
 const invalidOutput=renderSocialLinksHtml(draft);
 assert.ok(!invalidOutput.includes('href="javascript:'));
 assert.match(invalidOutput,/aria-disabled="true"/);
 const fail=structuredClone(state.document);
 fail.pages[pageId].nodes[id].props.socialLinks=draft;
 assert.equal(validatePublishDocument(fail,pageId),'INVALID_SOCIAL_LINKS');
 fail.pages[pageId].nodes[id].props.socialLinks={...valid,items:[entries[0],{...entries[0]}]};
 assert.equal(validatePublishDocument(fail,pageId),'INVALID_SOCIAL_LINKS','duplicate entry id is blocked');
 execute(state,{type:'history.undo'});
 assert.equal(validatePublishDocument(state.document,pageId),'INVALID_SOCIAL_LINKS');
 execute(state,{type:'history.redo'});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 const legacy=structuredClone(state.document);
 delete legacy.pages[pageId].nodes[id].metadata.socialLinksVersion;
 legacy.pages[pageId].nodes[id].props.socialLinks={version:9};
 assert.equal(validatePublishDocument(legacy,pageId),null,'older published Social widgets are not migrated');
 assertValidEditorDocument(state.document);
});

test('Creator Embed: allowlisted platform URLs, privacy URL, Twitch parent, XSS and Publish contract',async()=>{
 const {parseEmbedSource,normalizeEmbedContent,defaultEmbedContent,buildEmbedUrl,renderEmbedHtml}=await import('../core/creator-embed.js');
 const testId='M7lc1UVf-VE';
 for(const source of [testId,'https://youtu.be/'+testId,'https://www.youtube.com/watch?v='+testId,
  'https://www.youtube.com/shorts/'+testId,'https://www.youtube.com/embed/'+testId]){
  assert.deepEqual(parseEmbedSource('youtube',source),{provider:'youtube',id:testId,hash:''});
 }
 for(const bad of ['javascript:alert(1)','http://youtube.com/watch?v='+testId,'https://youtube.com.evil.example/watch?v='+testId,
  'https://user:pass@youtube.com/watch?v='+testId,'https://youtu.be/invalid','https://vimeo.com/123']){
  assert.throws(()=>parseEmbedSource('youtube',bad),'untrusted video source accepted: '+bad);
 }
 assert.deepEqual(parseEmbedSource('twitch-live','https://www.twitch.tv/sanci9517'),{provider:'twitch-live',id:'sanci9517',hash:''});
 assert.deepEqual(parseEmbedSource('twitch-vod','https://www.twitch.tv/videos/12345'),{provider:'twitch-vod',id:'12345',hash:''});
 assert.deepEqual(parseEmbedSource('vimeo','https://player.vimeo.com/video/12345?h=abcdef1234'),{provider:'vimeo',id:'12345',hash:'abcdef1234'});
 assert.equal(buildEmbedUrl({provider:'youtube',source:testId}),'https://www.youtube-nocookie.com/embed/'+testId+'?rel=0');
 assert.equal(buildEmbedUrl({provider:'twitch-live',source:'sanci9517'},'creator.example.com'),'https://player.twitch.tv/?channel=sanci9517&parent=creator.example.com&autoplay=false');
 assert.equal(buildEmbedUrl({provider:'twitch-vod',source:'12345'},'creator.example.com'),'https://player.twitch.tv/?video=v12345&parent=creator.example.com&autoplay=false');
 assert.equal(buildEmbedUrl({provider:'twitch-live',source:'sanci9517'},''),'','Twitch requires a verified hostname');
 assert.equal(buildEmbedUrl({provider:'vimeo',source:'https://player.vimeo.com/video/12345?h=abcdef1234'}),
  'https://player.vimeo.com/video/12345?h=abcdef1234&dnt=1');
 const state=createEditorState(),root=activePage(state).rootId,pageId=state.document.activePageId;
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.EMBED,parentId:root}});
 const id=state.selection.primaryId,node=activePage(state).nodes[id];
 assert.equal(node.metadata.embedContentVersion,1);
 assert.deepEqual(node.props.embedContent,defaultEmbedContent());
 assert.equal(validatePublishDocument(state.document,pageId),'INVALID_EMBED_CONTENT');
 const valid={...defaultEmbedContent(),source:'https://youtu.be/'+testId,title:'Egyedi <script>alert(1)</script>',ratio:'classic',clickToLoad:true};
 assert.deepEqual(normalizeEmbedContent(valid),valid);
 execute(state,{type:'element.update',payload:{nodeId:id,patch:{props:{embedContent:valid}}}});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 const html=renderEmbedHtml(valid);
 assert.ok(!html.includes('<iframe'),'third-party content loads only after consent');
 assert.ok(!html.includes('<script>'));
 assert.match(html,/&lt;script&gt;/);
 assert.match(html,/data-embed-click="true"/);
 assert.ok(!renderEmbedHtml({...valid,source:'javascript:alert(1)'}).includes('data-embed-source='));
 execute(state,{type:'history.undo'});
 assert.equal(validatePublishDocument(state.document,pageId),'INVALID_EMBED_CONTENT');
 execute(state,{type:'history.redo'});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 const unsafe=structuredClone(state.document);
 unsafe.pages[pageId].nodes[id].props.embedContent.source='https://evil.example/malware';
 assert.equal(validatePublishDocument(unsafe,pageId),'INVALID_EMBED_CONTENT');
 const legacy=structuredClone(state.document);
 delete legacy.pages[pageId].nodes[id].metadata.embedContentVersion;
 legacy.pages[pageId].nodes[id].props.embedContent={version:9};
 assert.equal(validatePublishDocument(legacy,pageId),null,'legacy Embed nodes retain their previous behavior');
 assertValidEditorDocument(state.document);
});

test('Code snippet model keeps source inert and copyable, validates size and preserves Undo/legacy',async()=>{
 const {defaultCodeSnippet,normalizeCodeSnippet,renderCodeSnippet}=await import('../core/code-snippet.js');
 const state=createEditorState(),root=activePage(state).rootId,pageId=state.document.activePageId;
 execute(state,{type:'element.add',payload:{type:NODE_TYPES.CODE,parentId:root}});
 const id=state.selection.primaryId,node=activePage(state).nodes[id];
 assert.equal(node.metadata.codeSnippetVersion,1);
 assert.deepEqual(node.props.codeSnippet,defaultCodeSnippet());
 assert.equal(validatePublishDocument(state.document,pageId),'INVALID_CODE_SNIPPET');
 const code='console.log("<script>alert(1)</script>");\nconst message = "Hello!";';
 const cfg={version:1,title:'Példa <img src=x onerror=alert(1)>',language:'javascript',code,theme:'light',showLineNumbers:true,wrapLines:true};
 assert.deepEqual(normalizeCodeSnippet(cfg),cfg);
 const html=renderCodeSnippet(cfg);
 assert.ok(!html.includes('<script>'),'source must not become executable HTML');
 assert.ok(!html.includes('<img '),'title must be escaped');
 assert.match(html,/&lt;script&gt;/);
 assert.match(html,/&lt;img/);
 assert.match(html,/visual-code-numbered/);
 assert.match(html,/visual-code-wrap/);
 assert.match(html,/data-line="2"/);
 execute(state,{type:'element.update',payload:{nodeId:id,patch:{props:{codeSnippet:cfg}}}});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 execute(state,{type:'history.undo'});
 assert.equal(validatePublishDocument(state.document,pageId),'INVALID_CODE_SNIPPET');
 execute(state,{type:'history.redo'});
 assert.equal(validatePublishDocument(state.document,pageId),null);
 assert.throws(()=>normalizeCodeSnippet({...cfg,language:'execute-javascript'}));
 assert.throws(()=>normalizeCodeSnippet({...cfg,code:' '.repeat(12)}));
 assert.throws(()=>normalizeCodeSnippet({...cfg,code:'x\n'.repeat(501)}));
 assert.throws(()=>normalizeCodeSnippet({...cfg,code:'x'.repeat(40001)}));
 const unsafe=structuredClone(state.document);
 unsafe.pages[pageId].nodes[id].props.codeSnippet.code='';
 assert.equal(validatePublishDocument(unsafe,pageId),'INVALID_CODE_SNIPPET');
 const legacy=structuredClone(state.document);
 delete legacy.pages[pageId].nodes[id].metadata.codeSnippetVersion;
 legacy.pages[pageId].nodes[id].props.codeSnippet={version:99};
 assert.equal(validatePublishDocument(legacy,pageId),null,'legacy Code does not get an implicit schema migration');
 assertValidEditorDocument(state.document);
});

test('Countdown rejects impossible authored calendar dates before UTC normalization',async()=>{
 const {normalizeCountdownContent,defaultCountdownContent}=await import('../core/countdown-content.js');
 const base=defaultCountdownContent();
 for(const targetISO of ['2030-02-29T12:00:00Z','2030-02-30T12:00:00Z','2030-02-31T12:00:00+02:00','2030-04-31T12:00:00Z','2100-02-29T12:00:00Z','2030-12-31T24:00:00Z','2030-01-00T12:00:00Z','2030-13-01T12:00:00Z','2030-01-01T12:60:00Z','2030-01-01T12:00:60Z','2030-01-01T12:00:00+24:00','2030-01-01T12:00:00+01:60']){
  assert.throws(()=>normalizeCountdownContent({...base,targetISO}),/Érvénytelen eseményidőpont/,targetISO);
 }
});
test('Countdown preserves valid leap days, sub-second precision and offset boundary semantics',async()=>{
 const {normalizeCountdownContent,defaultCountdownContent}=await import('../core/countdown-content.js');
 for(const [targetISO,expected] of [
  ['2000-02-29T12:00:00Z','2000-02-29T12:00:00.000Z'],
  ['2032-02-29T00:30:42.123+01:00','2032-02-28T23:30:42.123Z'],
  ['2030-01-01T00:30:00+02:00','2029-12-31T22:30:00.000Z'],
  ['2030-12-31T23:30:00-02:30','2031-01-01T02:00:00.000Z'],
  ['1999-12-31T23:30:00-01:00','2000-01-01T00:30:00.000Z'],
  ['2101-01-01T00:30:00+01:00','2100-12-31T23:30:00.000Z'],
  ['2030-12-31T20:30:00.007Z','2030-12-31T20:30:00.007Z']]){
  const input=Object.freeze({...defaultCountdownContent(),targetISO});
  assert.equal(normalizeCountdownContent(input).targetISO,expected);
  assert.equal(input.targetISO,targetISO,'normalization cannot mutate the original draft');
 }
});
