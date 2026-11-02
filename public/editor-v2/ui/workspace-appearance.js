export const WORKSPACE_PREFERENCES_KEY='sanci-editor-workspace-preferences-v2';
export const LEGACY_WORKSPACE_PREFERENCES_KEY='sanci-editor-workspace-preferences-v1';
export const WORKSPACE_PREFERENCE_DEFAULTS=Object.freeze({version:2,layout:'canvas',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',profiles:[]});
const layouts=new Set(['balanced','canvas','inspector','custom']);
const themes=new Set(['graphite','aurora']);
const densities=new Set(['comfortable','compact']);
const dockOrders=new Set(['left-canvas-right','canvas-left-right','left-right-canvas','right-left-canvas','right-canvas-left','canvas-right-left']);
const leftTabs=new Set(['pages','elements','layers','schedule','navigation']);
const hexColor=/^#[0-9a-f]{6}$/iu;
const PROFILE_LIMIT=8;
const PROFILE_NAME_LIMIT=32;
export const WORKSPACE_PROFILE_TRANSFER_KIND='sanci-editor-workspace-profile';
export const WORKSPACE_PROFILE_TRANSFER_VERSION=1;
export const WORKSPACE_PROFILE_MAX_BYTES=16_384;

function linearChannel(channel){const value=channel/255;return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4}
function luminance(hex){return [1,3,5].map(index=>linearChannel(parseInt(hex.slice(index,index+2),16))).reduce((sum,value,index)=>sum+value*[0.2126,0.7152,0.0722][index],0)}
function contrast(left,right){const a=luminance(left),b=luminance(right);return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)}
function isRecord(value){return value&&typeof value==='object'&&!Array.isArray(value)}
function finiteWidth(value,min,max,fallback){const number=Number(value);return Number.isFinite(number)?Math.max(min,Math.min(max,number)):fallback}
function normalizeVisualPreferences(input={}){
  return {
    layout:layouts.has(input.layout)?input.layout:WORKSPACE_PREFERENCE_DEFAULTS.layout,
    theme:themes.has(input.theme)?input.theme:WORKSPACE_PREFERENCE_DEFAULTS.theme,
    density:densities.has(input.density)?input.density:WORKSPACE_PREFERENCE_DEFAULTS.density,
    accent:isAccessibleWorkspaceAccent(input.accent)?input.accent.toLowerCase():WORKSPACE_PREFERENCE_DEFAULTS.accent,
    dockOrder:dockOrders.has(input.dockOrder)?input.dockOrder:WORKSPACE_PREFERENCE_DEFAULTS.dockOrder,
  };
}
function normalizeDockState(value){
  const input=isRecord(value)?value:{};
  return {
    leftOpen:input.leftOpen===true,
    rightOpen:input.rightOpen===true,
    leftTab:leftTabs.has(input.leftTab)?input.leftTab:'pages',
    leftWidth:finiteWidth(input.leftWidth,250,460,310),
    rightWidth:finiteWidth(input.rightWidth,260,440,352),
  };
}
function normalizeProfiles(value){
  if(!Array.isArray(value))return [];
  const result=[],ids=new Set(),names=new Set();
  for(const profile of value){
    if(!isRecord(profile)||typeof profile.id!=='string'||!/^profile-[\da-z-]{1,72}$/iu.test(profile.id)||ids.has(profile.id))continue;
    const name=typeof profile.name==='string'?profile.name.trim().slice(0,PROFILE_NAME_LIMIT):'';
    const normalizedName=name.toLocaleLowerCase();
    if(!name||names.has(normalizedName))continue;
    ids.add(profile.id);names.add(normalizedName);
    result.push({
      id:profile.id,
      name,
      createdAt:Number.isSafeInteger(profile.createdAt)&&profile.createdAt>0?profile.createdAt:0,
      appearance:normalizeVisualPreferences(isRecord(profile.appearance)?profile.appearance:{}),
      dock:normalizeDockState(profile.dock),
    });
    if(result.length>=PROFILE_LIMIT)break;
  }
  return result;
}
export function serializeWorkspaceProfile(profile){
  const safe=normalizeProfiles([profile])[0];
  if(!safe)throw new TypeError('A valid workspace profile is required');
  return JSON.stringify({kind:WORKSPACE_PROFILE_TRANSFER_KIND,version:WORKSPACE_PROFILE_TRANSFER_VERSION,profile:safe},null,2);
}
export function parseWorkspaceProfileTransfer(source){
  if(typeof source!=='string'||source.length===0||new TextEncoder().encode(source).byteLength>WORKSPACE_PROFILE_MAX_BYTES)return null;
  let input;
  try{input=JSON.parse(source)}catch{return null}
  if(!isRecord(input)||input.kind!==WORKSPACE_PROFILE_TRANSFER_KIND||input.version!==WORKSPACE_PROFILE_TRANSFER_VERSION)return null;
  return normalizeProfiles([input.profile])[0]||null;
}
function profileFileName(name){
  const slug=String(name||'workspace').normalize('NFKD').replace(/[\u0300-\u036f]/gu,'').toLowerCase().replace(/[^a-z0-9]+/gu,'-').replace(/^-+|-+$/gu,'').slice(0,32);
  return `sanci-workspace-${slug||'profile'}.json`;
}
export function isAccessibleWorkspaceAccent(value){
  if(typeof value!=='string'||!hexColor.test(value))return false;
  const accent=value.toLowerCase();
  // The focus/selection accent must remain visible on both supported dark
  // surfaces. The picker never accepts arbitrary CSS or low-contrast colors.
  return contrast(accent,'#111a26')>=3&&contrast(accent,'#17162a')>=3;
}
export function normalizeWorkspacePreferences(value){
  const input=isRecord(value)?value:{};
  return {version:2,...normalizeVisualPreferences(input),profiles:normalizeProfiles(input.profiles)};
}
export function readWorkspacePreferences(storage){
  try{
    const source=storage===undefined?globalThis.localStorage:storage;
    const current=source?.getItem(WORKSPACE_PREFERENCES_KEY);
    const saved=current||source?.getItem(LEGACY_WORKSPACE_PREFERENCES_KEY)||'{}';
    return normalizeWorkspacePreferences(JSON.parse(saved));
  }
  catch{return {...WORKSPACE_PREFERENCE_DEFAULTS,profiles:[]}}
}
export function applyWorkspacePreferences(root,preferences){
  const value=normalizeWorkspacePreferences(preferences);
  root.dataset.workspaceTheme=value.theme;
  root.dataset.workspaceDensity=value.density;
  root.dataset.workspaceDockOrder=value.dockOrder;
  const workspace=root.matches?.('.workspace')?root:root.querySelector?.('.workspace');
  if(workspace)workspace.dataset.workspaceDockOrder=value.dockOrder;
  root.style.setProperty('--accent',value.accent);
  return value;
}
export function mountWorkspaceAppearance({documentRef=globalThis.document,root=documentRef?.querySelector('.editor-app'),onLayoutChange=()=>{},onReset=()=>{},readDockState=()=>({}),applyDockState=()=>{}}={}){
  if(!documentRef||!root)throw new Error('A document and editor root are required');
  const dialog=documentRef.querySelector('#workspaceAppearanceDialog');
  const openButton=documentRef.querySelector('#openWorkspaceAppearance');
  const closeButton=documentRef.querySelector('#closeWorkspaceAppearance');
  const resetButton=documentRef.querySelector('#resetWorkspaceAppearance');
  const saveProfileButton=documentRef.querySelector('#saveWorkspaceProfile');
  const loadProfileButton=documentRef.querySelector('#loadWorkspaceProfile');
  const deleteProfileButton=documentRef.querySelector('#deleteWorkspaceProfile');
  const undoButton=documentRef.querySelector('#undoWorkspaceLayout');
  const redoButton=documentRef.querySelector('#redoWorkspaceLayout');
  const importProfileButton=documentRef.querySelector('#importWorkspaceProfile');
  const exportProfileButton=documentRef.querySelector('#exportWorkspaceProfile');
  const profileFile=documentRef.querySelector('#workspaceProfileFile');
  const fields={
    layout:documentRef.querySelector('#workspaceLayout'),
    dockOrder:documentRef.querySelector('#workspaceDockOrder'),
    theme:documentRef.querySelector('#workspaceTheme'),
    density:documentRef.querySelector('#workspaceDensity'),
    accent:documentRef.querySelector('#workspaceAccent'),
    profileName:documentRef.querySelector('#workspaceProfileName'),
    profile:documentRef.querySelector('#workspaceProfile'),
  };
  const status=documentRef.querySelector('#workspaceAppearanceStatus');
  let storage=null;
  try{storage=documentRef.defaultView?.localStorage}catch{}
  let value=readWorkspacePreferences(storage);
  let undoStack=[],redoStack=[],idSequence=0;
  const persist=()=>{try{if(!storage)return false;storage.setItem(WORKSPACE_PREFERENCES_KEY,JSON.stringify(value));return true}catch{return false}};
  const currentDock=()=>{try{return normalizeDockState(readDockState())}catch{return normalizeDockState({})}};
  const snapshot=()=>({preferences:normalizeWorkspacePreferences(value),dock:currentDock()});
  const syncHistory=()=>{
    if(undoButton)undoButton.disabled=undoStack.length===0;
    if(redoButton)redoButton.disabled=redoStack.length===0;
  };
  const remember=()=>{
    undoStack.push(snapshot());
    if(undoStack.length>100)undoStack.shift();
    redoStack=[];syncHistory();
  };
  const renderProfiles=()=>{
    const field=fields.profile;if(!field)return;
    const selected=field.value;
    while(field.options.length>1)field.remove(1);
    for(const profile of value.profiles){
      const option=documentRef.createElement('option');
      option.value=profile.id;option.textContent=profile.name;field.append(option);
    }
    field.value=value.profiles.some(profile=>profile.id===selected)?selected:'';
    if(deleteProfileButton)deleteProfileButton.disabled=!field.value;
    if(loadProfileButton)loadProfileButton.disabled=!field.value;
    if(exportProfileButton)exportProfileButton.disabled=!field.value;
  };
  const paint=()=>{
    applyWorkspacePreferences(root,value);
    for(const key of ['layout','dockOrder','theme','density','accent'])if(fields[key])fields[key].value=value[key];
    renderProfiles();syncHistory();
  };
  const setLayout=(layout,{rememberChange=true}={})=>{
    if(!layouts.has(layout)||layout===value.layout)return false;
    if(rememberChange)remember();value={...value,layout};paint();persist();
    onLayoutChange(layout);
    if(status)status.textContent='Az elrendezés ezen az eszközön elmentve.';
    return true;
  };
  const setDockOrder=order=>{
    if(!dockOrders.has(order)||order===value.dockOrder)return false;
    remember();value={...value,dockOrder:order};paint();persist();
    if(status)status.textContent='A panelek sorrendje ezen az eszközön elmentve. Kis képernyőn a mobil fiók elrendezése marad.';
    return true;
  };
  const updateVisual=(key,next)=>{
    const normalized=normalizeVisualPreferences({...value,[key]:next});
    if(key==='accent'&&normalized.accent!==String(next).toLowerCase()){
      if(status)status.textContent='Válassz olyan hangsúlyszínt, amely jól látható mindkét sötét felületen.';
      if(fields.accent)fields.accent.value=value.accent;
      return false;
    }
    if(normalized[key]===value[key])return true;
    remember();value={...value,...normalized};paint();persist();
    if(status)status.textContent='A munkaterület beállítása ezen az eszközön elmentve.';
    return true;
  };
  const applySnapshot=entry=>{
    value=normalizeWorkspacePreferences(entry.preferences);paint();persist();
    onLayoutChange(value.layout);
    try{applyDockState(normalizeDockState(entry.dock))}catch{}
  };
  const undo=()=>{if(!undoStack.length)return false;redoStack.push(snapshot());applySnapshot(undoStack.pop());syncHistory();if(status)status.textContent='A munkaterület lépését visszavontad. Az oldal tartalma nem változott.';return true};
  const redo=()=>{if(!redoStack.length)return false;undoStack.push(snapshot());applySnapshot(redoStack.pop());syncHistory();if(status)status.textContent='A munkaterület lépését újra alkalmaztad. Az oldal tartalma nem változott.';return true};
  const open=()=>{if(!dialog)return;dialog.showModal();openButton?.setAttribute('aria-expanded','true');fields.layout?.focus({preventScroll:true})};
  const close=()=>{if(dialog?.open)dialog.close()};
  const reset=()=>{
    remember();value={...WORKSPACE_PREFERENCE_DEFAULTS,profiles:[]};paint();persist();
    onReset();onLayoutChange(value.layout);
    if(status)status.textContent='A munkaterület visszaállt az alapbeállításokra. Az oldal tartalma változatlan.';
  };
  const saveProfile=()=>{
    const name=fields.profileName?.value?.trim().slice(0,PROFILE_NAME_LIMIT)||'';
    if(!name){if(status)status.textContent='Adj rövid nevet a mentendő munkaterületnek.';fields.profileName?.focus();return false}
    if(value.profiles.length>=PROFILE_LIMIT){if(status)status.textContent='Legfeljebb nyolc munkaterület-profilt menthetsz. Törölj egy régit, majd próbáld újra.';return false}
    if(value.profiles.some(profile=>profile.name.localeCompare(name,undefined,{sensitivity:'base'})===0)){if(status)status.textContent='Már van ilyen nevű profil. Válassz másik nevet.';fields.profileName?.focus();return false}
    remember();idSequence+=1;
    const id=`profile-${Date.now().toString(36)}-${idSequence.toString(36)}`;
    value={...value,profiles:[...value.profiles,{id,name,createdAt:Date.now(),appearance:normalizeVisualPreferences(value),dock:currentDock()}]};
    paint();const saved=persist();if(fields.profile)fields.profile.value=id;renderProfiles();
    if(status)status.textContent=saved?`„${name}” munkaterület-profil elmentve ezen az eszközön.`:`„${name}” profil csak ebben a munkamenetben érhető el, mert a böngésző tárhelye nem használható.`;
    return true;
  };
  const loadProfile=()=>{
    const profile=value.profiles.find(item=>item.id===fields.profile?.value);
    if(!profile)return false;
    remember();value={...value,...profile.appearance};paint();persist();onLayoutChange(value.layout);
    try{applyDockState(normalizeDockState(profile.dock))}catch{}
    if(status)status.textContent=`„${profile.name}” munkaterület betöltve. Az oldal tartalma nem változott.`;
    return true;
  };
  const deleteProfile=()=>{
    const id=fields.profile?.value;
    if(!id||!value.profiles.some(profile=>profile.id===id))return false;
    const name=value.profiles.find(profile=>profile.id===id)?.name;
    remember();value={...value,profiles:value.profiles.filter(profile=>profile.id!==id)};paint();persist();
    if(status)status.textContent=`„${name}” munkaterület-profil törölve. Visszavonás elérhető.`;
    return true;
  };
  const exportProfile=()=>{
    const profile=value.profiles.find(item=>item.id===fields.profile?.value);
    if(!profile)return false;
    const blob=new Blob([serializeWorkspaceProfile(profile)],{type:'application/json'});
    const href=documentRef.defaultView.URL.createObjectURL(blob);
    const link=documentRef.createElement('a');link.href=href;link.download=profileFileName(profile.name);link.hidden=true;
    documentRef.body.append(link);link.click();link.remove();documentRef.defaultView.setTimeout(()=>documentRef.defaultView.URL.revokeObjectURL(href),0);
    if(status)status.textContent=`„${profile.name}” profilfájl letöltése elindult.`;
    return true;
  };
  const importProfile=async file=>{
    if(!file)return false;
    if(file.size>WORKSPACE_PROFILE_MAX_BYTES){if(status)status.textContent='A profilfájl túl nagy. Legfeljebb 16 KB-os JSON-fájlt válassz.';return false}
    let profile;
    try{profile=parseWorkspaceProfileTransfer(await file.text())}catch{profile=null}
    if(!profile){if(status)status.textContent='A profilfájl nem érvényes vagy nem támogatott formátumú. A mentett munkaterület nem változott.';return false}
    if(value.profiles.length>=PROFILE_LIMIT){if(status)status.textContent='Már nyolc profil van elmentve. Törölj egyet az importálás előtt.';return false}
    if(value.profiles.some(item=>item.name.localeCompare(profile.name,undefined,{sensitivity:'base'})===0)){if(status)status.textContent='Már van ilyen nevű profil. Nevezd át az importált profilt vagy töröld a meglévőt.';return false}
    remember();idSequence+=1;
    const imported={...profile,id:`profile-${Date.now().toString(36)}-${idSequence.toString(36)}`,createdAt:Date.now()};
    value={...value,profiles:[...value.profiles,imported]};paint();const saved=persist();if(fields.profile)fields.profile.value=imported.id;renderProfiles();
    if(status)status.textContent=saved?`„${imported.name}” profil ezen az eszközön elmentve. A küldött fájlban lévő futtatható kódot nem használjuk.`:`„${imported.name}” profil csak ebben a munkamenetben érhető el, mert a böngésző tárhelye nem használható. A fájlból származó futtatható kódot nem használjuk.`;
    return true;
  };
  openButton?.addEventListener('click',()=>{documentRef.querySelector('.more-actions')?.removeAttribute('open');open()});
  closeButton?.addEventListener('click',close);
  dialog?.addEventListener('close',()=>{
    openButton?.setAttribute('aria-expanded','false');
    documentRef.querySelector('.more-actions')?.setAttribute('open','');openButton?.focus({preventScroll:true});
  });
  fields.layout?.addEventListener('change',()=>setLayout(fields.layout.value));
  fields.dockOrder?.addEventListener('change',()=>setDockOrder(fields.dockOrder.value));
  fields.profile?.addEventListener('change',renderProfiles);
  fields.theme?.addEventListener('change',()=>updateVisual('theme',fields.theme.value));
  fields.density?.addEventListener('change',()=>updateVisual('density',fields.density.value));
  fields.accent?.addEventListener('input',()=>updateVisual('accent',fields.accent.value));
  saveProfileButton?.addEventListener('click',saveProfile);
  loadProfileButton?.addEventListener('click',loadProfile);
  deleteProfileButton?.addEventListener('click',deleteProfile);
  importProfileButton?.addEventListener('click',()=>profileFile?.click());
  exportProfileButton?.addEventListener('click',exportProfile);
  profileFile?.addEventListener('change',async()=>{
    const file=profileFile.files?.[0];
    await importProfile(file);
    profileFile.value='';
  });
  undoButton?.addEventListener('click',undo);redoButton?.addEventListener('click',redo);
  resetButton?.addEventListener('click',reset);
  paint();
  return {get value(){return normalizeWorkspacePreferences(value)},setLayout,setDockOrder,open,close,remember,undo,redo,saveProfile,loadProfile,deleteProfile,importProfile,exportProfile,reset};
}
