export function normalizeAccessibility(node,patch,nodes={}){
  const result={...node.accessibility};
  for(const [key,value] of Object.entries(patch||{})){
    if(['label','id','lang'].includes(key)){
      if(typeof value!=='string'||value.length>(key==='label'?160:80))throw new Error('Érvénytelen akadálymentességi mező.');
      if(key==='id'&&value){
        if(node.type==='root')throw new Error('Az oldalgyökér technikai azonosítója védett.');
        if(!/^[A-Za-z][\w-]{0,79}$/.test(value))throw new Error('Az azonosító betűvel kezdődjön; betű, szám, - és _ használható.');
        if(Object.values(nodes).some(other=>other.id!==node.id&&other.accessibility?.id===value))throw new Error('Ez az oldalbeli azonosító már foglalt.');
      }
      if(key==='lang'&&value&&!['en','hu','de','fr','es','it','pt','pl','ja','ko','zh'].includes(value))throw new Error('Nem támogatott nyelv.');
      result[key]=value;
    }else if(key==='decorative'&&typeof value==='boolean'&&['image','icon','divider','spacer'].includes(node.type))result[key]=value;
    else throw new Error('Nem támogatott akadálymentességi mező.');
  }
  return result;
}
export function validateAccessibility(page){
  for(const node of Object.values(page?.nodes||{}))if(node.metadata?.a11yVersion===1){const patch=Object.fromEntries(['label','id','lang','decorative'].filter(key=>node.accessibility?.[key]!==undefined).map(key=>[key,node.accessibility[key]]));normalizeAccessibility(node,patch,page.nodes)}
}

export function remapDuplicateAnchors(copies,existingNodes){
  const used=new Set(Object.values(existingNodes).map(node=>node.accessibility?.id).filter(Boolean)),aliases=new Map();
  for(const copy of copies){const old=copy.accessibility?.id;if(!old)continue;let next;do{next='copy-'+crypto.randomUUID().replaceAll('-','').slice(0,20)}while(used.has(next));used.add(next);aliases.set(old,next);copy.accessibility={...copy.accessibility,id:next}}
  const link=value=>typeof value==='string'&&value.startsWith('#')&&aliases.has(value.slice(1))?'#'+aliases.get(value.slice(1)):value;
  const rich=value=>{if(!value||typeof value!=='object')return;if(value.link?.href)value.link.href=link(value.link.href);for(const child of Object.values(value))if(child&&typeof child==='object')rich(child)};
  for(const copy of copies){if(copy.props?.href)copy.props.href=link(copy.props.href);if(Array.isArray(copy.props?.items))for(const item of copy.props.items)if(item?.href)item.href=link(item.href);if(copy.props?.richText)rich(copy.props.richText)}
}

export function opaqueContrast(foreground,background){
  const rgb=value=>{const match=String(value).match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)$/);return match&&(!match[4]||Number(match[4])===1)?match.slice(1,4).map(Number):null};
  const first=rgb(foreground),second=rgb(background);if(!first||!second)return null;
  const luminance=channels=>channels.map(value=>{const srgb=value/255;return srgb<=.04045?srgb/12.92:((srgb+.055)/1.055)**2.4}).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
  const a=luminance(first),b=luminance(second);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
