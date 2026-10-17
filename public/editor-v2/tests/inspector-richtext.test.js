import assert from 'node:assert/strict';
import test from 'node:test';
import { createDocument, NODE_TYPES } from '../core/schema.js';
import { createEditorState, activePage } from '../core/state.js';
import { execute } from '../core/commands.js';
import { resolveNodeStyle } from '../core/canvas-engine.js';
import { getProperty } from '../core/property-registry.js';
import { normalizeInspectorValue } from '../core/property-values.js';
import { updateRichTextInlineLink, validatedLinkHref } from '../core/richtext-links.js';

test('typed Inspector controls validate display values before the command path', () => {
  const width = getProperty('size.width');
  assert.equal(normalizeInspectorValue(width,'50%'),'50%');
  assert.equal(normalizeInspectorValue(width,'auto'),'auto');
  assert.throws(()=>normalizeInspectorValue(width,'calc(1px + url(javascript:x))'));
  assert.throws(()=>normalizeInspectorValue(width,'2em'));
  assert.equal(normalizeInspectorValue(getProperty('spacing.padding'),'8px 16px 8px 16px'),'8px 16px 8px 16px');
  assert.throws(()=>normalizeInspectorValue(getProperty('spacing.padding'),'8px 8px 8px 8px 8px'));
  assert.equal(normalizeInspectorValue(getProperty('opacity.value'),'0.5'),'0.5');
  assert.throws(()=>normalizeInspectorValue(getProperty('opacity.value'),'7'));
  assert.throws(()=>normalizeInspectorValue(getProperty('opacity.value'),'not-a-number'));
  assert.equal(normalizeInspectorValue(getProperty('background.color'),'#abc123'),'#abc123');
  assert.throws(()=>normalizeInspectorValue(getProperty('background.color'),'red;url(http://bad)'));
  assert.equal(normalizeInspectorValue(getProperty('typography.fontFamily'),'Georgia'),'Georgia');
  assert.throws(()=>normalizeInspectorValue(getProperty('typography.fontFamily'),'UnapprovedFont'));
  assert.equal(normalizeInspectorValue(getProperty('shadow.box'),'none'),'none');
  assert.throws(()=>normalizeInspectorValue(getProperty('background.image'),'javascript:1'));
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
