export const WORKSPACE_PREFERENCES_KEY='sanci-editor-workspace-preferences-v1';
export const WORKSPACE_PREFERENCE_DEFAULTS=Object.freeze({version:1,layout:'canvas',theme:'graphite',density:'comfortable',accent:'#5b8cff'});
const layouts=new Set(['balanced','canvas','inspector','custom']);
const themes=new Set(['graphite','aurora']);
const densities=new Set(['comfortable','compact']);
const hexColor=/^#[0-9a-f]{6}$/iu;

function linearChannel(channel){const value=channel/255;return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4}
function luminance(hex){return [1,3,5].map(index=>linearChannel(parseInt(hex.slice(index,index+2),16))).reduce((sum,value,index)=>sum+value*[0.2126,0.7152,0.0722][index],0)}
function contrast(left,right){const a=luminance(left),b=luminance(right);return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)}
export function isAccessibleWorkspaceAccent(value){
  if(typeof value!=='string'||!hexColor.test(value))return false;
  const accent=value.toLowerCase();
  // The focus/selection accent must remain visible on both supported dark
  // surfaces. The picker never accepts arbitrary CSS or low-contrast colors.
  return contrast(accent,'#111a26')>=3&&contrast(accent,'#17162a')>=3;
}
export function normalizeWorkspacePreferences(value){
  const input=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
  return {
    version:1,
    layout:layouts.has(input.layout)?input.layout:WORKSPACE_PREFERENCE_DEFAULTS.layout,
    theme:themes.has(input.theme)?input.theme:WORKSPACE_PREFERENCE_DEFAULTS.theme,
    density:densities.has(input.density)?input.density:WORKSPACE_PREFERENCE_DEFAULTS.density,
    accent:isAccessibleWorkspaceAccent(input.accent)?input.accent.toLowerCase():WORKSPACE_PREFERENCE_DEFAULTS.accent,
  };
}
export function readWorkspacePreferences(storage){
  try{
    const source=storage===undefined?globalThis.localStorage:storage;
    return normalizeWorkspacePreferences(JSON.parse(source?.getItem(WORKSPACE_PREFERENCES_KEY)||'{}'))
  }
  catch{return {...WORKSPACE_PREFERENCE_DEFAULTS}}
}
export function applyWorkspacePreferences(root,preferences){
  const value=normalizeWorkspacePreferences(preferences);
  root.dataset.workspaceTheme=value.theme;
  root.dataset.workspaceDensity=value.density;
  root.style.setProperty('--accent',value.accent);
  return value;
}
export function mountWorkspaceAppearance({documentRef=globalThis.document,root=documentRef?.querySelector('.editor-app'),onLayoutChange=()=>{},onReset=()=>{}}={}){
  if(!documentRef||!root)throw new Error('A document and editor root are required');
  const dialog=documentRef.querySelector('#workspaceAppearanceDialog');
  const openButton=documentRef.querySelector('#openWorkspaceAppearance');
  const closeButton=documentRef.querySelector('#closeWorkspaceAppearance');
  const resetButton=documentRef.querySelector('#resetWorkspaceAppearance');
  const fields={
    layout:documentRef.querySelector('#workspaceLayout'),
    theme:documentRef.querySelector('#workspaceTheme'),
    density:documentRef.querySelector('#workspaceDensity'),
    accent:documentRef.querySelector('#workspaceAccent'),
  };
  const status=documentRef.querySelector('#workspaceAppearanceStatus');
  let storage=null;
  try{storage=documentRef.defaultView?.localStorage}catch{}
  let value=readWorkspacePreferences(storage);
  const persist=()=>{try{storage?.setItem(WORKSPACE_PREFERENCES_KEY,JSON.stringify(value))}catch{}}
  const paint=()=>{
    applyWorkspacePreferences(root,value);
    for(const [key,field] of Object.entries(fields))if(field)field.value=value[key];
  };
  const setLayout=layout=>{
    if(!layouts.has(layout))return false;
    value={...value,layout};
    paint();persist();
    if(fields.layout)fields.layout.value=layout;
    onLayoutChange(layout);
    return true;
  };
  const updateVisual=(key,next)=>{
    const normalized=normalizeWorkspacePreferences({...value,[key]:next});
    if(key==='accent'&&normalized.accent!==String(next).toLowerCase()){
      if(status)status.textContent='Válassz olyan hangsúlyszínt, amely jól látható mindkét sötét felületen.';
      if(fields.accent)fields.accent.value=value.accent;
      return false;
    }
    value=normalized;paint();persist();
    if(status)status.textContent='A munkaterület beállítása ezen az eszközön elmentve.';
    return true;
  };
  const open=()=>{if(!dialog)return;dialog.showModal();openButton?.setAttribute('aria-expanded','true');fields.layout?.focus({preventScroll:true})};
  const close=()=>{if(dialog?.open)dialog.close()};
  openButton?.addEventListener('click',()=>{documentRef.querySelector('.more-actions')?.removeAttribute('open');open()});
  closeButton?.addEventListener('click',close);
  dialog?.addEventListener('close',()=>{
    openButton?.setAttribute('aria-expanded','false');
    documentRef.querySelector('.more-actions')?.setAttribute('open','');
    openButton?.focus({preventScroll:true});
  });
  fields.layout?.addEventListener('change',()=>setLayout(fields.layout.value));
  fields.theme?.addEventListener('change',()=>updateVisual('theme',fields.theme.value));
  fields.density?.addEventListener('change',()=>updateVisual('density',fields.density.value));
  fields.accent?.addEventListener('input',()=>updateVisual('accent',fields.accent.value));
  resetButton?.addEventListener('click',()=>{
    value={...WORKSPACE_PREFERENCE_DEFAULTS};paint();persist();
    onReset();
    onLayoutChange(value.layout);
    if(status)status.textContent='A munkaterület visszaállt az alapbeállításokra. Az oldal tartalma változatlan.';
  });
  paint();
  return {get value(){return {...value}},setLayout,open,close,reset(){value={...WORKSPACE_PREFERENCE_DEFAULTS};paint();persist();onLayoutChange(value.layout)}};
}
