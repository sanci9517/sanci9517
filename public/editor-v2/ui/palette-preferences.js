export const PALETTE_FAVORITES_VERSION=1;
export const PALETTE_FAVORITES_KEY_PREFIX='sanci-editor-palette-favorites-v1:';
export const PALETTE_FAVORITE_LIMIT=32;

const validUserId=value=>typeof value==='string'&&/^[a-z0-9_-]{1,96}$/iu.test(value);
const validElementType=value=>typeof value==='string'&&/^[a-z][a-z0-9_-]{0,47}$/u.test(value);

export function paletteFavoritesKey(userId){
  return validUserId(userId)?`${PALETTE_FAVORITES_KEY_PREFIX}${userId}`:null;
}

export function normalizePaletteFavoriteTypes(value){
  if(!Array.isArray(value))return [];
  const seen=new Set(),result=[];
  for(const type of value){
    if(!validElementType(type)||seen.has(type))continue;
    seen.add(type);result.push(type);
    if(result.length>=PALETTE_FAVORITE_LIMIT)break;
  }
  return result;
}

export function readPaletteFavoriteTypes(userId,storage){
  const key=paletteFavoritesKey(userId);
  if(!key)return [];
  let source;
  try{source=storage===undefined?globalThis.localStorage:storage}catch{return []}
  try{
    const saved=source?.getItem(key);
    if(!saved)return [];
    const record=JSON.parse(saved);
    if(!record||typeof record!=='object'||Array.isArray(record)||record.version!==PALETTE_FAVORITES_VERSION||record.userId!==userId)return [];
    return normalizePaletteFavoriteTypes(record.types);
  }catch{return []}
}

export function writePaletteFavoriteTypes(userId,types,storage){
  const key=paletteFavoritesKey(userId);
  if(!key)return {saved:false,types:[]};
  let source;
  try{source=storage===undefined?globalThis.localStorage:storage}catch{return {saved:false,types:[]}}
  if(!source)return {saved:false,types:[]};
  const normalized=normalizePaletteFavoriteTypes(types);
  const serialized=JSON.stringify({version:PALETTE_FAVORITES_VERSION,userId,types:normalized});
  try{
    source.setItem(key,serialized);
    return {saved:source.getItem(key)===serialized,types:normalized};
  }catch{return {saved:false,types:normalized}}
}

export function togglePaletteFavoriteType(userId,type,currentTypes,storage){
  if(!validElementType(type))return {saved:false,types:normalizePaletteFavoriteTypes(currentTypes)};
  const current=normalizePaletteFavoriteTypes(currentTypes);
  const next=current.includes(type)?current.filter(value=>value!==type):[...current,type];
  if(next.length>PALETTE_FAVORITE_LIMIT)next.splice(0,next.length-PALETTE_FAVORITE_LIMIT);
  return writePaletteFavoriteTypes(userId,next,storage);
}
