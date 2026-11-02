import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {EDITOR_ACTIONS,validateEditorActionCatalog} from '../public/editor-v2/ui/action-catalog.js';
import {EDITOR_ICON_NAMES,createEditorIcon} from '../public/editor-v2/ui/action-icons.js';

const html=await readFile(new URL('../public/editor-v2/index.html',import.meta.url),'utf8');

test('every declared Editor action has one distinct reviewed icon and a plain Hungarian explanation',()=>{
  assert.deepEqual(validateEditorActionCatalog(),[]);
  const assignments=Object.entries(EDITOR_ACTIONS);
  assert.ok(assignments.length>=25,'the shared shell action map covers all current shell controls');
  assert.equal(new Set(assignments.map(([,action])=>action.icon)).size,assignments.length,
    'a different action may not silently reuse another action icon');
  for(const [id,action] of assignments){
    assert.match(action.label,/^[A-ZÁÉÍÓÖŐÚÜŰ]/u,`${id} has a readable action name`);
    assert.ok(action.description.split(/\s+/u).length>=8,`${id} explains its actual outcome`);
    assert.ok(EDITOR_ICON_NAMES.includes(action.icon),`${id} references a rendered SVG shape`);
  }
});

test('all shell action hooks resolve and mirrored controls share only the same action icon',()=>{
  const ids=[...html.matchAll(/data-editor-action="([^"]+)"/gu)].map(match=>match[1]);
  const counts=ids.reduce((map,id)=>map.set(id,(map.get(id)||0)+1),new Map());
  assert.ok(ids.length>0);
  for(const id of new Set(ids))assert.ok(EDITOR_ACTIONS[id],`unregistered HTML shell action: ${id}`);
  for(const [id,action] of Object.entries(EDITOR_ACTIONS)){
    assert.ok(ids.includes(id),`catalog action ${id} has no rendered control`);
    assert.equal(html.includes(`data-editor-action="${id}" data-icon-only="true"`)||html.includes(`data-editor-action="${id}"`),true);
    assert.equal(EDITOR_ACTIONS[id].icon,action.icon);
  }
  assert.equal(counts.get('undo'),2,'the same Undo action is mirrored in the desktop header and phone toolbar');
  assert.equal(counts.get('deviceMobile'),2,'the same phone-preview action is mirrored in the top bar and canvas toolbar');
  assert.notEqual(EDITOR_ACTIONS.layers.icon,EDITOR_ACTIONS.navigation.icon,'Layers and Navigation have different meanings and icons');
  assert.notEqual(EDITOR_ACTIONS.selectTool.icon,EDITOR_ACTIONS.panTool.icon,'Select and Pan have different meanings and icons');
});

test('Save and Publish stay visibly separate and explain draft versus public changes',()=>{
  assert.match(html,/<button id="save"[^>]*>Mentés<\/button>/u);
  assert.match(html,/<button id="publish"[^>]*>Publikálás<\/button>/u);
  assert.notEqual(EDITOR_ACTIONS.saveDraft.icon,EDITOR_ACTIONS.publishDraft.icon);
  assert.match(EDITOR_ACTIONS.saveDraft.description,/piszkozat/u);
  assert.match(EDITOR_ACTIONS.saveDraft.description,/nem változik/u);
  assert.match(EDITOR_ACTIONS.publishDraft.description,/közzé/u);
  assert.match(EDITOR_ACTIONS.publishDraft.description,/külön lépés/u);
});

test('unknown icons fail closed instead of generating arbitrary SVG',()=>{
  assert.throws(()=>createEditorIcon('not-an-editor-icon'),/Unknown editor icon/u);
  assert.ok(EDITOR_ICON_NAMES.every(name=>/^[a-z0-9-]+$/u.test(name)));
});

test('invalid or reused icon declarations are rejected before rendering',()=>{
  const duplicate={first:{icon:'save',label:'Első művelet',description:'Mentsd el az első módosítást piszkozatként.'},second:{icon:'save',label:'Második művelet',description:'Nyisd meg a második művelet részleteit.'}};
  assert.match(validateEditorActionCatalog(duplicate,['save']).join('\n'),/already assigned/u);
  const unknown={first:{icon:'script',label:'Parancs',description:'Nyisd meg a művelet részletes leírását.'}};
  assert.match(validateEditorActionCatalog(unknown,['save']).join('\n'),/unknown icon/u);
  const vague={first:{icon:'save',label:'',description:''}};
  assert.match(validateEditorActionCatalog(vague,['save']).join('\n'),/missing plain-language/u);
});
