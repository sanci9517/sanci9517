import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {NODE_TYPES} from '../public/editor-v2/core/schema.js';
import {getElementCapability} from '../public/editor-v2/core/capability-matrix.js';

const source=readFileSync(new URL('../public/editor-v2/app.js',import.meta.url),'utf8');
const palette=source.match(/const groups=\[([\s\S]*?)\n\];/)?.[1]??'';
const paletteTypes=[...palette.matchAll(/NODE_TYPES\.([A-Z_]+)/g)].map(([,key])=>NODE_TYPES[key]);

test('palette entries are unique declared node types with an available add capability',()=>{
 assert.ok(palette,'palette group catalog is present');
 assert.equal(new Set(paletteTypes).size,paletteTypes.length,'a type appears in only one palette group');
 for(const type of paletteTypes){
  assert.ok(type,`palette reference resolves: ${type}`);
  assert.ok(['PARTIAL','PLANNED'].includes(getElementCapability(type).status),`${type} has an explicit capability status`);
 }
});

test('implemented partial types are discoverable and unfinished schema placeholders stay hidden',()=>{
 for(const type of ['divider','badge','quote','panel','overlay','absolute','sticky','tooltip']){
  assert.ok(paletteTypes.includes(type),`${type} is implemented but must be discoverable`);
  assert.equal(getElementCapability(type).status,'PARTIAL');
 }
 assert.ok(!paletteTypes.includes('root'),'the page root cannot be inserted as a child');
 for(const type of ['shorts','sponsor','business','about','sanci-button']){
  assert.ok(!paletteTypes.includes(type),`${type} has no verified creation flow`);
  assert.equal(getElementCapability(type).status,'PLANNED');
 }
 for(const label of ['Divider:','"Badge/Tag":','Quote:','Panel:','Overlay:','Absolute:','Sticky:','Tooltip:'])
  assert.ok(source.includes(label),`${label} has a user-facing description`);
});
