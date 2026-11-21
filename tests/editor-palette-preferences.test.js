import assert from 'node:assert/strict';
import test from 'node:test';
import {PALETTE_FAVORITE_LIMIT,PALETTE_FAVORITES_KEY_PREFIX,normalizePaletteFavoriteTypes,paletteFavoritesKey,readPaletteFavoriteTypes,togglePaletteFavoriteType,writePaletteFavoriteTypes} from '../public/editor-v2/ui/palette-preferences.js';

function storage(initial={}){
  const values=new Map(Object.entries(initial));
  return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value))};
}

test('palette favorites are validated, bounded, unique, and namespaced by authenticated user id',()=>{
  assert.equal(paletteFavoritesKey('user-a'),`${PALETTE_FAVORITES_KEY_PREFIX}user-a`);
  assert.equal(paletteFavoritesKey('../other-user'),null);
  assert.deepEqual(normalizePaletteFavoriteTypes(['heading','heading','javascript:alert(1)','../x','richtext']),['heading','richtext']);
  const types=Array.from({length:PALETTE_FAVORITE_LIMIT+3},(_,index)=>`type-${index}`);
  assert.equal(normalizePaletteFavoriteTypes(types).length,PALETTE_FAVORITE_LIMIT);
  const saved=storage();
  assert.equal(writePaletteFavoriteTypes('user-a',['heading','text'],saved).saved,true);
  assert.deepEqual(readPaletteFavoriteTypes('user-a',saved),['heading','text']);
  assert.deepEqual(readPaletteFavoriteTypes('user-b',saved),[],'one authenticated user never reads another user’s local favorites');
});

test('palette favorite toggles read back persisted storage and fail safely when storage rejects a write',()=>{
  const saved=storage();
  assert.deepEqual(togglePaletteFavoriteType('user-a','heading',[],saved),{saved:true,types:['heading']});
  assert.deepEqual(togglePaletteFavoriteType('user-a','heading',['heading'],saved),{saved:true,types:[]});
  assert.deepEqual(togglePaletteFavoriteType('user-a','unknown type',[],saved),{saved:false,types:[]});
  const ignored={getItem:()=>null,setItem(){}};
  assert.deepEqual(togglePaletteFavoriteType('user-a','heading',[],ignored),{saved:false,types:['heading']});
  const blocked={getItem(){throw new Error('SecurityError')},setItem(){throw new Error('SecurityError')}};
  assert.deepEqual(readPaletteFavoriteTypes('user-a',blocked),[]);
  assert.equal(writePaletteFavoriteTypes('user-a',['heading'],blocked).saved,false);
});

test('adding a favorite at the limit evicts only the oldest entry and keeps a stable maximum',()=>{
  const saved=storage(),types=Array.from({length:PALETTE_FAVORITE_LIMIT},(_,index)=>`type-${index}`);
  const result=togglePaletteFavoriteType('user-a','new-type',types,saved);
  assert.equal(result.saved,true);
  assert.equal(result.types.length,PALETTE_FAVORITE_LIMIT);
  assert.equal(result.types.includes('type-0'),false);
  assert.equal(result.types.at(-1),'new-type');
  assert.deepEqual(readPaletteFavoriteTypes('user-a',saved),result.types);
});
