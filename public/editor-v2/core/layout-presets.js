import { resolveNodeStyle } from './canvas-engine.js';

// An explicit, versioned layout opts a subtree out of legacy public card/mobile
// fallbacks. Old documents are not migrated or restyled on load.
export const LAYOUT_VERSION = 1;
export const LAYOUT_TYPES = Object.freeze(['section','container','row','columns','flex','grid','stack','group','slot']);
const grid = columns => ({display:'grid',gridTemplateColumns:columns,gridTemplateRows:'auto'});
const flex = (direction, extra={}) => ({display:'flex',flexDirection:direction,flexWrap:'nowrap',justifyContent:'flex-start',alignItems:'stretch',...extra});
export const LAYOUT_PRESETS = Object.freeze([
  {id:'stack',label:'Tartalmi oszlop',help:'Szöveg, kép és gomb egymás alatt, minden nézetben.',layouts:[flex('column'),flex('column'),flex('column')]},
  {id:'split',label:'Két egyenlő oszlop',help:'Bemutatkozás vagy kép és szöveg két oszlopban; telefonon egymás alatt.',layouts:[grid('repeat(2, minmax(0, 1fr))'),grid('repeat(2, minmax(0, 1fr))'),grid('1fr')]},
  {id:'editorial',label:'Tartalom és oldalsáv',help:'Kétharmad tartalom, egyharmad kiegészítés; tableten és telefonon egy oszlop.',layouts:[grid('minmax(0, 2fr) minmax(0, 1fr)'),grid('1fr'),grid('1fr')]},
  {id:'cards',label:'Három kártya',help:'Projektek vagy videók rácsa: asztali 3, tablet 2, mobil 1 oszlop.',layouts:[grid('repeat(3, minmax(0, 1fr))'),grid('repeat(2, minmax(0, 1fr))'),grid('1fr')]},
  {id:'gallery',label:'Négyes galériarács',help:'Sűrűbb tartalomrács: asztali 4, tablet és mobil 2 oszlop.',layouts:[grid('repeat(4, minmax(0, 1fr))'),grid('repeat(2, minmax(0, 1fr))'),grid('repeat(2, minmax(0, 1fr))')]},
  {id:'centered',label:'Középre rendezett',help:'Bemutatkozó vagy felhívás elemei függőlegesen, középre igazítva.',layouts:[flex('column',{alignItems:'center'}),flex('column',{alignItems:'center'}),flex('column',{alignItems:'center'})]},
  {id:'actions',label:'Tördelődő gombsor',help:'A gombok vagy linkek sorba kerülnek, és kevés helyen új sorba törnek.',layouts:[flex('row',{flexWrap:'wrap',alignItems:'center'}),flex('row',{flexWrap:'wrap',alignItems:'center'}),flex('row',{flexWrap:'wrap',alignItems:'center'})]},
  {id:'spread',label:'Két szélre rendezett',help:'Logó és műveletek két szélen; telefonon áttekinthető függőleges sor.',layouts:[flex('row',{justifyContent:'space-between',alignItems:'center'}),flex('row',{justifyContent:'space-between',alignItems:'center'}),flex('column')]}
].map(preset=>Object.freeze({...preset,layouts:Object.freeze(preset.layouts.map(layout=>Object.freeze(layout)))})));

export function isManagedLayout(node) {
  return LAYOUT_TYPES.includes(node?.type) && node.metadata?.layoutVersion === LAYOUT_VERSION;
}

export function layoutMode(node, device='desktop') {
  const display=resolveNodeStyle(node,device).display;
  return ['flex','inline-flex'].includes(display)?'flex':['grid','inline-grid'].includes(display)?'grid':'block';
}

export function explicitGridColumnCount(template) {
  const value=String(template||'').trim();
  if(!value||value==='none'||value.includes('auto-fit')||value.includes('auto-fill'))return null;
  const repeated=value.match(/^repeat\(\s*(\d+)\s*,/);if(repeated)return Number(repeated[1]);
  let depth=0,count=0,inToken=false;
  for(const char of value){
    if(char==='(')depth++;if(char===')')depth--;
    if(/\s/.test(char)&&depth===0)inToken=false;
    else if(!inToken){count++;inToken=true}
  }
  return count||null;
}

export function layoutPresetPatch(node, id) {
  if (!LAYOUT_TYPES.includes(node?.type)) throw new Error('Elrendezésminta csak elrendezési tárolóra alkalmazható.');
  const preset=LAYOUT_PRESETS.find(item=>item.id===id);
  if (!preset) throw new Error('Ismeretlen elrendezésminta.');
  // Replace layout only. Geometry, paint, content, child placement and metadata
  // outside this contract are preserved; each device gets an explicit recipe.
  const layoutKeys=['display','flexDirection','flexWrap','justifyContent','alignItems','gridTemplateColumns','gridTemplateRows','gap','rowGap','columnGap'];
  const withoutLayout=source=>Object.fromEntries(Object.entries(source||{}).filter(([key])=>!layoutKeys.includes(key)));
  const responsive=Object.fromEntries(['desktop','tablet','mobile'].map((device,index)=>[device,{
    ...withoutLayout(node.responsive?.[device]),
    display:'block',flexDirection:'row',flexWrap:'nowrap',justifyContent:'flex-start',alignItems:'stretch',
    gridTemplateColumns:'1fr',gridTemplateRows:'auto',gap:index===2?'16px':'24px',
    ...preset.layouts[index]
  }]));
  return {style:withoutLayout(node.style),responsive,metadata:{...node.metadata,layoutVersion:LAYOUT_VERSION,layoutPresetId:preset.id}};
}

const flexChild=new Set(['flexGrow','flexShrink','flexBasis','alignSelf']);
const gridChild=new Set(['gridColumn','gridRow']);
export function isLayoutPropertyRelevant(property,node,parent,device='desktop') {
  if (!['flex','grid'].includes(property.group)) return true;
  const mode=layoutMode(node,device),parentMode=layoutMode(parent,device);
  if (flexChild.has(property.key)) return property.key==='alignSelf'?['flex','grid'].includes(parentMode):parentMode==='flex';
  if (gridChild.has(property.key)) return parentMode==='grid';
  return property.group===mode;
}

export const CHILD_LAYOUT_DEFAULTS=Object.freeze({gridColumn:'auto',gridRow:'auto',flexGrow:'0',flexShrink:'1',flexBasis:'auto',alignSelf:'auto'});
