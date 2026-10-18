import {createDocument,createPage,getNode,NODE_TYPES,canContain,normalizeRichText} from './core/schema.js';
import {createEditorState,activePage,selectedNodes,setSelection,markSaved} from './core/state.js';
import {execute,executeCoalesced,executeBatch} from './core/commands.js';
import {applyNodeStyle,getNodeGeometry,resolveNodeStyle} from './core/canvas-engine.js?v=20261018-text-sync';
import {computeCanvasMinHeight} from './core/canvas-extent.js';
import {measureCanvasWorkspace} from './core/canvas-workspace.js';
import {hasResponsiveOverride,resolveResponsiveValue} from './core/responsive.js';
import {diagnostics} from './diagnostics.js?v=20260918-2';
import {plainTextToRichText,renderRichTextEditor,richTextEditorToDocument,restoreSelectionOffsets,getSelectionOffsets,setBlockType} from './core/richtext-engine.js';
import {renderSchedulePreview} from './core/schedule-preview.js';
import {normalizeScheduleConfig,SCHEDULE_MODES,SCHEDULE_ORDERS,SCHEDULE_STATUSES} from './core/schedule-schema.js';
import {listPropertyGroups,listProperties,getProperty} from './core/property-registry.js';
import {renderPropertyInput} from './ui/property-controls.js';
import {getRichTextBlockSelection,getRichTextFormattingSelection,getRichTextActiveBlockIndex,restoreRichTextBlockSelection,updateRichTextInlineLink,updateRichTextInlineMark,updateRichTextInlineStyle,updateRichTextBlockAlignment} from './core/richtext-links.js';
import {initialPageId,rememberPageId,requestedPageId} from './core/page-url.js';
import {getElementCapability} from './core/capability-matrix.js';
import {renderGeometryPresets} from './ui/geometry-presets.js';
import {importRichTextClipboard} from './core/richtext-import.js';
import {captureStyleSnapshot} from './core/style-snapshot.js';
import {LAYOUT_PRESETS,LAYOUT_TYPES,layoutMode,isManagedLayout,isLayoutPropertyRelevant,explicitGridColumnCount} from './core/layout-presets.js';
import {TYPOGRAPHY_PRESETS,typographyPresetPatch} from './core/typography-presets.js';
import {isStructuredType,createElementContent,normalizeElementContent,renderElementContent,activateStructuredContent} from './core/element-content.js';
import {renderStructuredInspector} from './ui/structured-inspector.js';
import {ICON_CHOICES,iconById} from './core/icon-options.js';
import {readRichTextSelectionFormatting,clearRichTextInlineFormatting} from './core/richtext-links.js';

let inspectorCategory='all';let richTextSelectionCleanup=null;let richTextToolTab='character';

let state=null;let pages=[];let archivedPages=[];let revisionHistory=[];let zoom=1;let inspectorTab='design';let inspectorQuery='';let flushRichTextDraft=null;let inlineEditingId=null;let richTextBookmark=null;let copiedStyleSnapshot=null;let canvasDrag=null;let canvasResize=null;let mobileTouch={active:false,timer:null,downId:null,startX:0,startY:0,snapshot:[],snapshotPrimary:null,suppressClick:false,longPressTriggered:false};let hierarchyDrag={nodeId:null,overId:null};let mobileHierarchyDrag={active:false,timer:null,nodeId:null,overId:null,startX:0,startY:0,suppressClick:false};
const $=s=>document.querySelector(s);const canvas=$('#canvas');const inspector=$('#inspectorBody');
const sizes={desktop:1440,tablet:768,mobile:390};
const validHexColor=value=>typeof value==='string'&&/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(value);
const ELEMENT_DESCRIPTIONS={Section:'Oldalszakasz vagy nagyobb tartalmi blokk.',Container:'Rendezett tartalmak befoglalója.',Stack:'Egymásba rendezett elemek csoportja.',Group:'Több elem közös csoportja.',Row:'Elemek egy sorban történő elrendezése.',Columns:'Több oszlopos elrendezés.',Flex:'Rugalmas Flexbox elrendezés.',Grid:'Rács alapú elrendezés.',Slot:'Fenntartott tartalomhely.',Spacer:'Üres tér létrehozása.',Heading:'Címsor H1–H6 szinttel.',Szöveg:'Egyszerű szöveges tartalom.',"Rich Text":'Formázott szöveg, lista, idézet és link.',Link:'Kattintható hivatkozás.',Gomb:'Kattintható műveleti gomb.',Breadcrumb:'Navigációs útvonal.',Kép:'Kép megjelenítése.',Galéria:'Több kép megjelenítése.',Videó:'Videótartalom.',Audio:'Hanglejátszás.',Ikon:'Grafikus ikon.',Carousel:'Lapozható tartalom.',Embed:'Beágyazott tartalom.',Iframe:'Külső oldal beágyazása.',Code:'Kód megjelenítése.',Card:'Önálló tartalmi kártya.',Lista:'Felsorolás vagy lista.',Táblázat:'Táblázatos adatmegjelenítés.',Tabs:'Fülek között váltható tartalom.',Accordion:'Nyitható-csukható blokkok.',Dropdown:'Lenyíló menü vagy választó.',Pagination:'Lapozás.',Search:'Keresési funkció.',Modal:'Felugró ablak.',Navbar:'Fő navigáció.',Menu:'Navigációs menü.',Sidebar:'Oldalsó sáv.',Footer:'Oldal alsó része.',Form:'Űrlap befoglaló.',Input:'Egysoros beviteli mező.',Textarea:'Többsoros beviteli mező.',Checkbox:'Jelölőnégyzet.',Radio:'Egyszeres választás.',Select:'Lenyíló választó.',Slider:'Csúszkás értékválasztó.',File:'Fájlfeltöltő mező.',Submit:'Űrlap beküldése.',"Social Links":'Közösségi hivatkozások.',Discord:'Discord tartalom vagy hivatkozás.',Twitch:'Twitch tartalom.',YouTube:'YouTube tartalom.',TikTok:'TikTok tartalom.',"Élő állapot":'Élő vagy offline állapot.',Countdown:'Visszaszámláló.',Adásrend:'Tervezett adások listája.',"Stream számláló":'Streamhez kapcsolódó számláló.',"Követők":'Követőszám.',"Feliratkozók":'Feliratkozószám.',VOD:'Korábbi stream vagy videó.',Támogatás:'Támogatási lehetőségek.',Közösség:'Közösségi tartalom.',"Játékkártya":'Játék kiemelt kártyája.',"Játéklista":'Játékok listája.',Komponens:'Újrafelhasználható komponens.',"Egyedi elem":'Egyedi testreszabható elem.',"Badge/Tag":'Címke vagy állapotjelző.',Quote:'Idézet.',Panel:'Tartalmi panel.',Overlay:'Más tartalom fölötti réteg.',Absolute:'Abszolút pozicionált elem.',Sticky:'Görgetés közben rögzített elem.',Tooltip:'Rövid magyarázó felirat.',Shorts:'Shorts tartalmi blokk.',Sponsor:'Szponzorációs tartalom.',"Business Contact":'Üzleti kapcsolatfelvétel.',"About Me":'Bemutatkozó tartalom.',"Sanci Button":'Sanci9517 egyedi gomb.'};
const groups=[
 ['Layout',[['Section',NODE_TYPES.SECTION],['Container',NODE_TYPES.CONTAINER],['Stack',NODE_TYPES.STACK],['Group',NODE_TYPES.GROUP],['Row',NODE_TYPES.ROW],['Columns',NODE_TYPES.COLUMNS],['Flex',NODE_TYPES.FLEX],['Grid',NODE_TYPES.GRID],['Slot',NODE_TYPES.SLOT],['Spacer',NODE_TYPES.SPACER]]],
 ['Szöveg',[['Heading',NODE_TYPES.HEADING],['Szöveg',NODE_TYPES.TEXT],['Rich Text',NODE_TYPES.RICHTEXT],['Link',NODE_TYPES.LINK],['Gomb',NODE_TYPES.BUTTON],['Breadcrumb',NODE_TYPES.BREADCRUMB]]],
 ['Média',[['Kép',NODE_TYPES.IMAGE],['Galéria',NODE_TYPES.GALLERY],['Videó',NODE_TYPES.VIDEO],['Audio',NODE_TYPES.AUDIO],['Ikon',NODE_TYPES.ICON],['Carousel',NODE_TYPES.CAROUSEL],['Embed',NODE_TYPES.EMBED],['Iframe',NODE_TYPES.IFRAME],['Code',NODE_TYPES.CODE]]],
 ['Tartalom',[['Card',NODE_TYPES.CARD],['Lista',NODE_TYPES.LIST],['Táblázat',NODE_TYPES.TABLE],['Tabs',NODE_TYPES.TABS],['Accordion',NODE_TYPES.ACCORDION],['Dropdown',NODE_TYPES.DROPDOWN],['Pagination',NODE_TYPES.PAGINATION],['Search',NODE_TYPES.SEARCH],['Modal',NODE_TYPES.MODAL]]],
 ['Navigáció',[['Navbar',NODE_TYPES.NAVBAR],['Menu',NODE_TYPES.MENU],['Sidebar',NODE_TYPES.SIDEBAR],['Footer',NODE_TYPES.FOOTER]]],
 ['Űrlapok',[['Form',NODE_TYPES.FORM],['Input',NODE_TYPES.INPUT],['Textarea',NODE_TYPES.TEXTAREA],['Checkbox',NODE_TYPES.CHECKBOX],['Radio',NODE_TYPES.RADIO],['Select',NODE_TYPES.SELECT],['Slider',NODE_TYPES.SLIDER],['File',NODE_TYPES.FILE],['Submit',NODE_TYPES.SUBMIT]]],
 ['Social / Web',[['Social Links',NODE_TYPES.SOCIAL],['Discord',NODE_TYPES.DISCORD],['Twitch',NODE_TYPES.TWITCH],['YouTube',NODE_TYPES.YOUTUBE],['TikTok',NODE_TYPES.TIKTOK]]],
 ['Sanci9517',[['Élő állapot',NODE_TYPES.LIVE],['Countdown',NODE_TYPES.COUNTDOWN],['Adásrend',NODE_TYPES.SCHEDULE],['Stream számláló',NODE_TYPES.STREAM_COUNT],['Követők',NODE_TYPES.FOLLOWERS],['Feliratkozók',NODE_TYPES.SUBS],['VOD',NODE_TYPES.VOD],['Támogatás',NODE_TYPES.SUPPORT],['Közösség',NODE_TYPES.COMMUNITY],['Játékkártya',NODE_TYPES.GAME_CARD],['Játéklista',NODE_TYPES.GAME_LIST],['Komponens',NODE_TYPES.COMPONENT],['Egyedi elem',NODE_TYPES.CUSTOM]]]
];
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const api=async(url,options={})=>{try{const response=await fetch(url,{credentials:'same-origin',headers:{'Content-Type':'application/json',...(options.headers||{})},...options});const data=await response.json().catch(()=>({}));if(!response.ok){const error=new Error(data?.error?.message||data?.message||`API hiba (${response.status})`);error.status=response.status;error.code=data?.error?.code||data?.code||null;error.apiUrl=url;diagnostics.add({source:'api',code:'SANCI-API-E001',message:error.message,context:url,error});throw error}return data}catch(e){if(!(e instanceof Error&&String(e.message).startsWith('API hiba')))diagnostics.add({source:'api',code:'SANCI-API-E002',message:e instanceof Error?e.message:String(e),context:url,error:e});throw e}};
const page=()=>state&&activePage(state);
async function loadTwitchConnection(){
  const button=$('#twitchConnection');
  if(!button)return;
  button.disabled=true;
  try{
    const result=await api('/api/integrations/twitch/connection');
    const connection=result?.data||result||{};
    if(connection.connected){
      const login=connection.broadcaster?.login||'csatorna';
      button.textContent=`Twitch: ${login} ✓`;
      button.title='Twitch csatlakoztatva — kattints a leválasztáshoz';
      button.dataset.connected='true';
      button.onclick=async()=>{
        if(!confirm(`Leválasztod a Twitch csatornát: ${login}?`))return;
        button.disabled=true;
        try{
          await api('/api/integrations/twitch/disconnect',{method:'POST',body:'{}'});
          await loadTwitchConnection();
        }catch(e){showError(e)}
      };
    }else{
      button.textContent='Twitch: csatlakoztatás';
      button.title='Twitch csatorna csatlakoztatása';
      button.dataset.connected='false';
      button.onclick=()=>{window.location.href='/api/integrations/twitch/connect'};
    }
  }catch(e){
    button.textContent='Twitch: hiba';
    button.title='A Twitch kapcsolat állapota nem ellenőrizhető';
    button.dataset.connected='error';
    button.onclick=()=>loadTwitchConnection();
  }finally{button.disabled=false}
}
const setStatus=t=>$('#saveStatus').textContent=t;
function showRevisionConflict(error,pageId){const panel=$('#revisionConflict');const message=$('#revisionConflictMessage');if(!panel||!message){alert(error instanceof Error?error.message:String(error));return}state.persistence.conflict={code:'REVISION_CONFLICT',pageId,message:error instanceof Error?error.message:String(error),localRevision:state.document.revision??0};message.textContent=`${state.persistence.conflict.message} A helyi módosításaid megmaradtak ebben a munkamenetben. Exportáld őket, mielőtt a frissebb szerververziót betöltöd.`;panel.hidden=false;setStatus('Verzióütközés — helyi változat megőrizve')}
function exportConflictDraft(){if(!state||!page())return;const meta=pages.find(x=>x.id===page().id);const payload={format:'sanci9517-editor-conflict-draft',exportedAt:new Date().toISOString(),pageId:page().id,title:meta?.title||page().name||page().slug,slug:page().slug,localRevision:state.document.revision??0,document:state.document};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const objectUrl=URL.createObjectURL(blob);const link=document.createElement('a');link.href=objectUrl;link.download=`sanci9517-${String(page().slug||page().id).replace(/[^a-z0-9-]/gi,'-')}-draft-conflict-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);setStatus('Helyi változat exportálása elindult')}
async function reloadLatestAfterConflict(){const conflict=state?.persistence?.conflict;if(!conflict)return;if(!confirm('A helyi szerkesztés felülíródik a szerver legfrissebb változatával. Előbb exportáltad a helyi JSON-vázlatot? Csak akkor folytasd, ha a helyi változatot megőrizted.'))return;try{await loadPage(conflict.pageId,{discardConfirmed:true});state.persistence.conflict=null;$('#revisionConflict').hidden=true;setStatus('Legfrissebb szerververzió betöltve')}catch(error){showError(error)}}
const canonical=(doc,id)=>Boolean(doc?.type==='sanci-page-document'&&doc?.schemaVersion===1&&doc?.activePageId===id&&doc?.pages?.[id]);
function verifyCommandResult(type,payload){if(type!=='element.add')return;const current=page();const nodeId=state?.selection?.primaryId;const node=nodeId&&current?getNode(current,nodeId):null;const parentId=payload?.parentId||current?.rootId;const parent=parentId&&current?getNode(current,parentId):null;const exists=Boolean(node&&node.id!==current?.rootId&&node.type===payload?.type&&node.parentId===parent?.id&&parent?.children?.includes(node.id));const canvasNode=nodeId?canvas.querySelector('[data-node-id="'+CSS.escape(nodeId)+'"]'):null;diagnostics.verify(exists,{code:'SANCI-VERIFY-E001',message:'Az elem hozzáadása lefutott, de az új node nem jött létre a várt Page Model helyen.',context:'element.add → Page Model'});diagnostics.verify(Boolean(canvasNode),{code:'SANCI-VERIFY-E002',message:'Az elem létrejött a Page Modelben, de nem jelent meg a Canvason.',context:'element.add → Canvas'});}
function command(type,payload,{render:shouldRender=true,typingGroup=null}={}){try{
  // A DOM-backed editor is an unsaved draft until its content reaches the Page Model.
  // Commit it before another command changes selection, history, or responsive state.
  if(!['richtext.content.set','element.content.set'].includes(type)&&flushRichTextDraft?.()===false)return false;
  if(typingGroup)executeCoalesced(state,{type,payload},typingGroup);else execute(state,{type,payload});if(shouldRender)render();if(shouldRender)verifyCommandResult(type,payload);if(type==='element.add'&&payload?.type===NODE_TYPES.RICHTEXT)beginRichTextEditing(state.selection.primaryId);return true
}catch(e){diagnostics.add({source:'command',code:'SANCI-CMD-E001',message:e instanceof Error?e.message:String(e),context:type,error:e});if(state?.persistence)state.persistence.error=e instanceof Error?e.message:String(e);setStatus('Szerkesztési hiba');alert(state.persistence.error);return false}}
function typeForElement(name){const map={'Badge/Tag':'badge','Quote':'quote','Panel':'panel','Overlay':'overlay','Absolute':'absolute','Sticky':'sticky','Tooltip':'tooltip','Shorts':'shorts','Sponsor':'sponsor','Business Contact':'business','About Me':'about','Sanci Button':'sanci-button'};if(map[name])return map[name];for(const items of groups)for(const [label,type] of items)if(label===name&&type)return type;return null}
function resolveAddParent(current,type){const selected=state.selection.primaryId?getNode(current,state.selection.primaryId):null;if(selected&&canContain(selected,type))return selected;if(selected?.parentId){const parent=getNode(current,selected.parentId);if(parent&&canContain(parent,type))return parent}return getNode(current,current.rootId)}
function renderPalette(filter=''){const root=$('#elementList');if(!root){diagnostics.add({source:'ui',code:'SANCI-UI-E002',message:'Az Elemek lista konténere nem található.'});return}root.replaceChildren();const q=String(filter||'').trim().toLowerCase();for(const[group,items]of groups){const matches=items.filter(([name,type])=>{const resolvedType=type||typeForElement(name);return name.toLowerCase().includes(q)&&Boolean(resolvedType)});if(!matches.length)continue;const section=document.createElement('section');section.className='element-group collapsed';const title=document.createElement('button');title.type='button';title.className='element-group-title';title.innerHTML='<span>'+group+'</span><b>'+matches.length+'</b>';const body=document.createElement('div');for(const[name,type]of matches){const resolvedType=type||typeForElement(name);const row=document.createElement('div');row.className='element-row';const b=document.createElement('button');b.type='button';b.className='element';b.innerHTML='<i>◇</i><span>'+name+'</span>';const capability=getElementCapability(resolvedType);const badge=document.createElement('small');badge.className='element-capability';badge.textContent=capability.status==='PARTIAL'?'Részleges':'Tervezett';b.append(badge);if(capability.status==='PLANNED'){b.disabled=true;b.title='Később: ez az elem még nem használható.'}else b.onclick=()=>{const current=page();if(!current)return;const parent=resolveAddParent(current,resolvedType);command('element.add',{type:resolvedType,name,parentId:parent?.id||current.rootId,props:resolvedType===NODE_TYPES.RICHTEXT?{}:{text:name}})};const info=document.createElement('button');info.type='button';info.className='element-info';info.textContent='i';info.title='Mi ez? '+name;info.setAttribute('aria-label','Mi ez? '+name);const help=document.createElement('div');help.className='element-description';help.textContent=(ELEMENT_DESCRIPTIONS[name]||name+' elem hozzáadására szolgál.')+' Inspector: '+capability.inspector+', publikus kimenet: '+capability.public+'.';help.hidden=true;info.onclick=e=>{e.stopPropagation();help.hidden=!help.hidden};row.append(b,info,help);body.append(row)}title.onclick=()=>section.classList.toggle('collapsed');section.append(title,body);root.append(section)}if(!root.children.length)diagnostics.add({source:'ui',code:'SANCI-UI-E003',message:'Az Elemek lista üres: egyetlen érvényes elem típus sem került a palettába.'})}
function syncHierarchyActions(){const current=page();const ids=state?.selection?.ids||[];const nodes=current?ids.map(id=>getNode(current,id)).filter(Boolean):[];const sameParent=nodes.length>=2&&nodes.every(node=>node.parentId===nodes[0].parentId);const groupLocked=nodes.some(node=>node.locked);const groupButton=$('#groupSelection');if(groupButton){groupButton.disabled=!sameParent||groupLocked||nodes.some(node=>node.id===current?.rootId)}const primary=current&&state?.selection?.primaryId?getNode(current,state.selection.primaryId):null;const ungroupButton=$('#ungroupSelection');if(ungroupButton)ungroupButton.disabled=!(primary?.type===NODE_TYPES.GROUP&&!primary.locked);const mobileGroup=$('#mobileGroup');if(mobileGroup)mobileGroup.disabled=!sameParent||groupLocked||nodes.some(node=>node.id===current?.rootId);const mobileUngroup=$('#mobileUngroup');if(mobileUngroup)mobileUngroup.disabled=!(primary?.type===NODE_TYPES.GROUP&&!primary.locked)}
function syncMobileMultiSelectUI(){const bar=$('#mobileMultiSelectBar');if(!bar)return;bar.hidden=!mobileTouch.active;const count=$('#mobileSelectionCount');if(count)count.textContent=`${state?.selection?.ids?.length||0} elem kijelölve`;syncHierarchyActions()}
function enterMobileMultiSelect(id){if(!state)return;const current=page();const target=current?getNode(current,id):null;if(!target||target.id===current?.rootId)return;mobileTouch.active=true;mobileTouch.snapshot=[...(state.selection.ids||[])];mobileTouch.snapshotPrimary=state.selection.primaryId;setSelection(state,[id],id);render()}
function toggleMobileSelection(id){if(!mobileTouch.active)return;const current=page();const target=current?getNode(current,id):null;if(!target||target.id===current?.rootId)return;const ids=state.selection.ids.includes(id)?state.selection.ids.filter(x=>x!==id):[...state.selection.ids,id];setSelection(state,ids,id);render()}
function finishMobileMultiSelect(){mobileTouch.active=false;mobileTouch.snapshot=[];mobileTouch.snapshotPrimary=null;mobileTouch.suppressClick=true;render();setTimeout(()=>{mobileTouch.suppressClick=false},300)}
function cancelMobileMultiSelect(){const snapshot=[...mobileTouch.snapshot];const primary=mobileTouch.snapshotPrimary;mobileTouch.active=false;mobileTouch.snapshot=[];mobileTouch.snapshotPrimary=null;clearTimeout(mobileTouch.timer);mobileTouch.timer=null;setSelection(state,snapshot,primary);mobileTouch.suppressClick=true;render();setTimeout(()=>{mobileTouch.suppressClick=false},300)}
function handleMobilePointerDown(id,event){if(event.pointerType!=='touch')return;clearTimeout(mobileTouch.timer);mobileTouch.downId=id;mobileTouch.startX=event.clientX;mobileTouch.startY=event.clientY;mobileTouch.longPressTriggered=false;mobileTouch.timer=setTimeout(()=>{mobileTouch.timer=null;mobileTouch.longPressTriggered=true;enterMobileMultiSelect(id);mobileTouch.suppressClick=true},450)}
function handleMobilePointerMove(event){if(event.pointerType!=='touch'||!mobileTouch.timer)return;const dx=Math.abs(event.clientX-mobileTouch.startX);const dy=Math.abs(event.clientY-mobileTouch.startY);if(dx>10||dy>10){clearTimeout(mobileTouch.timer);mobileTouch.timer=null}}
function handleMobilePointerUp(id,event){if(event.pointerType!=='touch')return;clearTimeout(mobileTouch.timer);mobileTouch.timer=null;if(mobileTouch.active&&mobileTouch.downId===id){event.preventDefault();if(!mobileTouch.longPressTriggered)toggleMobileSelection(id);mobileTouch.longPressTriggered=false;mobileTouch.suppressClick=true;setTimeout(()=>{mobileTouch.suppressClick=false},300)}}
function handleMobilePointerCancel(){clearTimeout(mobileTouch.timer);mobileTouch.timer=null}
function selectNodeInteraction(id,event){if(mobileTouch.suppressClick&&event?.pointerType!=='touch'){mobileTouch.suppressClick=false;return}const current=page();const target=current?getNode(current,id):null;if(!current||!target)return;const rootId=current.rootId;if(id===rootId){setSelection(state,[id]);render();return}const modifier=Boolean(event?.ctrlKey||event?.metaKey);const shift=Boolean(event?.shiftKey);if(shift){const primaryId=state.selection.primaryId;const anchor=primaryId?getNode(current,primaryId):null;if(anchor&&anchor.id!==rootId&&anchor.parentId===target.parentId){const parent=getNode(current,target.parentId);const siblings=parent?.children||[];const from=siblings.indexOf(anchor.id);const to=siblings.indexOf(target.id);if(from>=0&&to>=0){const start=Math.min(from,to);const end=Math.max(from,to);setSelection(state,siblings.slice(start,end+1),target.id);render();return}}setSelection(state,[id]);render();return}if(modifier){const ids=state.selection.ids.includes(id)?state.selection.ids.filter(x=>x!==id):[...state.selection.ids,id];setSelection(state,ids,id);render();return}setSelection(state,[id]);render()}
function beginCanvasDrag(id,event,element){
  const current=page();
  const node=current?getNode(current,id):null;
  if(!current||!node||id===current.rootId||node.locked||event.button!==0||!$('#selectTool')?.classList.contains('active'))return;
  if(event.target.closest('input,textarea,select,button,[contenteditable="true"],[role="textbox"]')){event.stopPropagation();return}
  if(event.ctrlKey||event.metaKey||event.shiftKey)return;
  setSelection(state,[id],id);
  element.classList.add('selected');
  const computed=getComputedStyle(element);
  const left=Number.parseFloat(computed.left);
  const top=Number.parseFloat(computed.top);
  canvasDrag={nodeId:id,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,startLeft:Number.isFinite(left)?left:0,startTop:Number.isFinite(top)?top:0,x:Number.isFinite(left)?left:0,y:Number.isFinite(top)?top:0,moved:false,element,device:state.viewport.device};
  try{element.setPointerCapture(event.pointerId)}catch{}
  element.style.cursor='grabbing';
  event.preventDefault();
  event.stopPropagation();
}
function moveCanvasDrag(id,event){
  const drag=canvasDrag;
  if(!drag||drag.nodeId!==id||drag.pointerId!==event.pointerId)return;
  const dx=(event.clientX-drag.startX)/(zoom||1);
  const dy=(event.clientY-drag.startY)/(zoom||1);
  if(Math.abs(dx)>3||Math.abs(dy)>3)drag.moved=true;
  if(!drag.moved)return;
  const snap=8;
  drag.x=Math.round((drag.startLeft+dx)/snap)*snap;
  drag.y=Math.round((drag.startTop+dy)/snap)*snap;
  drag.element.style.position='relative';
  drag.element.style.left=`${drag.x}px`;
  drag.element.style.top=`${drag.y}px`;
  drag.element.style.cursor='grabbing';
  updateCanvasExtent();
  event.preventDefault();
  event.stopPropagation();
}
function finishCanvasDrag(id,event,cancelled=false){
  const drag=canvasDrag;
  if(!drag||drag.nodeId!==id||drag.pointerId!==event.pointerId)return;
  canvasDrag=null;
  try{drag.element.releasePointerCapture(event.pointerId)}catch{}
  if(!cancelled&&drag.moved){
    try{command('responsive.set',{nodeId:id,device:drag.device,patch:{x:`${drag.x}px`,y:`${drag.y}px`}},{render:false})}catch(error){showError(error);return}
  }
  render();
}
function beginCanvasResize(id,event,element){const current=page();const node=current?getNode(current,id):null;if(!current||!node||id===current.rootId||node.locked||event.button!==0)return;const box=element.getBoundingClientRect();canvasResize={nodeId:id,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,startWidth:box.width/(zoom||1),startHeight:box.height/(zoom||1),width:box.width/(zoom||1),height:box.height/(zoom||1),element,device:state.viewport.device,moved:false,handle:event.currentTarget};try{event.currentTarget.setPointerCapture(event.pointerId)}catch{}event.preventDefault();event.stopPropagation()}
function moveCanvasResize(id,event){const r=canvasResize;if(!r||r.nodeId!==id||r.pointerId!==event.pointerId)return;const dx=(event.clientX-r.startX)/(zoom||1),dy=(event.clientY-r.startY)/(zoom||1);if(Math.abs(dx)>2||Math.abs(dy)>2)r.moved=true;if(!r.moved)return;r.width=Math.max(24,Math.round(r.startWidth+dx));r.height=Math.max(24,Math.round(r.startHeight+dy));r.element.style.width=r.width+'px';r.element.style.height=r.height+'px';updateCanvasExtent();event.preventDefault();event.stopPropagation()}
function finishCanvasResize(id,event,cancelled=false){const r=canvasResize;if(!r||r.nodeId!==id||r.pointerId!==event.pointerId)return;canvasResize=null;try{r.handle.releasePointerCapture(event.pointerId)}catch{}if(!cancelled&&r.moved){try{command('responsive.set',{nodeId:id,device:r.device,patch:{width:r.width+'px',height:r.height+'px'}},{render:false})}catch(error){showError(error);return}}render()}
function syncTextSurfaces(nodeId,value,source=null){
  const node=page()?.nodes?.[nodeId];if(!node)return;
  const canvasSurface=canvas.querySelector(`.node[data-node-id="${CSS.escape(nodeId)}"] > .node-content`);
  const inspectorSurface=inspector.querySelector(`[data-text-node-id="${CSS.escape(nodeId)}"]`);
  for(const surface of [canvasSurface,inspectorSurface]){
    if(!surface||surface===source)continue;
    if(node.type===NODE_TYPES.RICHTEXT)renderRichTextEditor(surface,value);
    else if(surface instanceof HTMLTextAreaElement)surface.value=value;
    else surface.textContent=value;
  }
  canvasSurface?.parentElement.classList.toggle('richtext-empty',node.type===NODE_TYPES.RICHTEXT&&!canvasSurface.textContent.trim());
  updateCanvasExtent();
}
function commitTextSurface(nodeId,surface,typingGroup){
  const node=page()?.nodes?.[nodeId];if(!node)return false;
  try{
    const value=node.type===NODE_TYPES.RICHTEXT?richTextEditorToDocument(surface):surface instanceof HTMLTextAreaElement?surface.value:surface.innerText;
    const saved=command(node.type===NODE_TYPES.RICHTEXT?'richtext.content.set':'element.content.set',
      node.type===NODE_TYPES.RICHTEXT?{nodeId,document:value}:{nodeId,content:value},{render:false,typingGroup});
    if(saved){syncTextSurfaces(nodeId,value,surface);setStatus('Nem mentett módosítás');syncPublishControls()}
    return saved;
  }catch(error){setStatus('A szöveg még nem menthető: '+(error instanceof Error?error.message:String(error)));return false}
}
function applyTextSurfaceStyle(surface,node){
  const canvasNode=canvas.querySelector(`.node[data-node-id="${CSS.escape(node.id)}"]`);
  const computed=canvasNode?getComputedStyle(canvasNode):null;
  for(const key of ['color','fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','textAlign','textTransform','textDecoration','textWrap','overflowWrap','wordSpacing','textIndent','textShadow']){
    if(computed?.[key])surface.style[key]=computed[key];
  }
  const background=resolveNodeStyle(node,state.viewport.device).backgroundColor;
  surface.style.backgroundColor=background&&background!=='transparent'?background:'#ffffff';
}
function renderPlainTextEditor(node){
  const section=document.createElement('section');section.className='field plain-text-content';
  const label=document.createElement('label');label.textContent='Szöveg';label.htmlFor='plain-text-content';
  const editor=document.createElement('textarea');editor.id='plain-text-content';editor.className='plain-text-editor';editor.dataset.textNodeId=node.id;editor.setAttribute('aria-label','Szöveg tartalma');editor.value=node.props?.text??node.props?.content??'';editor.disabled=Boolean(node.locked);applyTextSurfaceStyle(editor,node);
  const typingGroup=crypto.randomUUID();let composing=false,dirty=false;
  const flush=()=>{if(composing)return false;if(!dirty)return true;const saved=commitTextSurface(node.id,editor,typingGroup);if(saved)dirty=false;return saved};
  editor.onfocus=()=>{flushRichTextDraft=flush};editor.oninput=()=>{dirty=true;flushRichTextDraft=flush;if(!composing)flush()};
  editor.oncompositionstart=()=>{composing=true};editor.oncompositionend=()=>{composing=false;dirty=true;flush()};editor.onblur=flush;
  const help=document.createElement('small');help.className='text-sync-hint';help.textContent='Élő kapcsolat a vászonnal. Gépeléskor a piszkozat frissül; a látogatók csak a külön Publikálás után látják.';
  section.append(label,editor,help);return section;
}
function beginRichTextEditing(id){
  const node=page()&&getNode(page(),id);
  if(!['richtext','heading','text','button','link'].includes(node?.type)||node.locked)return;
  if(window.innerWidth<=850){
    inlineEditingId=null;
    inspectorTab='content';
    document.querySelectorAll('.inspector-tabs button').forEach((button,index)=>button.classList.toggle('active',index===1));
    renderInspector();
    window.sanciEditor?.openPanel?.('right');
    requestAnimationFrame(()=>inspector.querySelector('.richtext-editor-surface,.plain-text-editor')?.focus());
    return;
  }
  if(flushRichTextDraft?.()===false)return;
  inlineEditingId=id;
  inspectorTab='design';
  document.querySelectorAll('.inspector-tabs button').forEach((button,index)=>button.classList.toggle('active',index===0));
  render();
  requestAnimationFrame(()=>{const editor=canvas.querySelector('.node[data-node-id="'+CSS.escape(id)+'"] .richtext-inline-surface,.node[data-node-id="'+CSS.escape(id)+'"] .plain-text-inline-surface');if(!editor)return;editor.focus();const block=editor.querySelector('[data-rich-block]');if(block&&!editor.textContent.trim()){const range=document.createRange();range.selectNodeContents(block);range.collapse(false);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)}});
}
function pasteRichTextDocument(editor,documentModel){
  const selection=window.getSelection();
  const range=selection?.rangeCount?selection.getRangeAt(0):null;
  const topLevel=node=>{let current=node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement;while(current?.parentElement&&current.parentElement!==editor)current=current.parentElement;return current?.parentElement===editor?current:null};
  const startBlock=range&&range.startContainer===editor?editor.childNodes[range.startOffset]:(range&&editor.contains(range.startContainer)?topLevel(range.startContainer):null);
  const endBlock=range&&range.endContainer===editor?editor.childNodes[Math.max(0,range.endOffset-1)]:(range&&editor.contains(range.endContainer)?topLevel(range.endContainer):null);
  const imported=document.createElement('div');renderRichTextEditor(imported,normalizeRichText(documentModel));
  const incoming=[...imported.childNodes];if(!incoming.length)return false;
  if(!startBlock||!endBlock){editor.append(...incoming);return true}
  const children=[...editor.childNodes],first=children.indexOf(startBlock),last=children.indexOf(endBlock);
  if(first<0||last<first)return false;
  const prefix=document.createDocumentFragment(),suffix=document.createDocumentFragment();
  if(range.startContainer!==editor){const prefixRange=document.createRange();prefixRange.selectNodeContents(startBlock);prefixRange.setEnd(range.startContainer,range.startOffset);prefix.append(prefixRange.cloneContents())}
  if(range.endContainer!==editor){const suffixRange=document.createRange();suffixRange.selectNodeContents(endBlock);suffixRange.setStart(range.endContainer,range.endOffset);suffix.append(suffixRange.cloneContents())}
  const meaningful=fragment=>[...fragment.childNodes].some(node=>node.nodeType===Node.TEXT_NODE?Boolean(node.nodeValue):Boolean(node.textContent));
  const fragment=document.createDocumentFragment();
  if(meaningful(prefix)){const wrapper=startBlock.cloneNode(false);wrapper.removeAttribute('data-rich-block');wrapper.removeAttribute('data-richBlock');wrapper.append(prefix);fragment.append(wrapper)}
  fragment.append(...incoming);
  const marker=document.createElement('span');marker.className='richtext-paste-caret';marker.setAttribute('aria-hidden','true');fragment.append(marker);
  if(meaningful(suffix)){const wrapper=endBlock.cloneNode(false);wrapper.removeAttribute('data-rich-block');wrapper.removeAttribute('data-richBlock');wrapper.append(suffix);fragment.append(wrapper)}
  startBlock.before(fragment);
  for(const block of children.slice(first,last+1))block.remove();
  const caret=document.createRange();caret.setStartBefore(marker);caret.collapse(true);selection.removeAllRanges();selection.addRange(caret);marker.remove();
  return true;
}
function openRichTextFormatting(id){
  if(flushRichTextDraft?.()===false)return;
  inlineEditingId=window.innerWidth>850?id:null;flushRichTextDraft=null;
  setSelection(state,[id],id);
  inspectorTab='content';
  document.querySelectorAll('.inspector-tabs button').forEach((button,index)=>button.classList.toggle('active',index===1));
  render();window.sanciEditor?.openPanel?.('right');
  requestAnimationFrame(()=>inspector.querySelector('.richtext-editor-surface')?.focus());
}
function renderNode(currentPage,id,managed=false){const node=getNode(currentPage,id);if(!node)return null;managed=managed||isManagedLayout(node);const el=document.createElement('div');el.className=`node ${state.selection.ids.includes(id)?'selected':''}`;el.classList.toggle('managed-layout',managed);el.dataset.nodeId=id;el.dataset.device=state.viewport.device;applyNodeStyle(el,node,state.viewport.device);
 const validHex=value=>typeof value==='string'&&/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(value)?value:'';
 for(const [value,klass,variable] of [
  [node.states?.hover?.backgroundColor,'visual-hover-bg','--sanci-hover-bg'],
  [node.states?.hover?.color,'visual-hover-text','--sanci-hover-color'],
  [node.states?.focus?.outlineColor,'visual-focus-outline','--sanci-focus-outline']
 ]){const color=validHex(value);if(color){el.classList.add(klass);el.style.setProperty(variable,color)}}
 const head=document.createElement('div');head.className='node-head';const headName=document.createElement('span');headName.textContent=node.name||node.type;const headType=document.createElement('small');headType.textContent=node.type;head.append(headName,headType);el.append(head);
  if(node.type===NODE_TYPES.RICHTEXT){
    const c=document.createElement('div');c.className='node-content richtext-content';
    renderRichTextEditor(c,node.props?.richText);
    const empty=!c.textContent.trim();
    el.classList.toggle('richtext-empty',empty);
    if(inlineEditingId===id){
      c.classList.add('richtext-inline-surface');c.contentEditable='true';c.spellcheck=true;
      c.setAttribute('role','textbox');c.setAttribute('aria-label','Rich Text közvetlen szerkesztése');
      let dirty=false,composing=false;
      const typingGroup=crypto.randomUUID();
      const save=()=>{
        if(composing){setStatus('Fejezd be az aktuális szövegbevitelt.');return false}
        if(!dirty)return true;
        const saved=commitTextSurface(id,c,typingGroup);if(saved)dirty=false;return saved;
      };
      flushRichTextDraft=save;
      c.onfocus=()=>{flushRichTextDraft=save};
      c.oninput=()=>{dirty=true;flushRichTextDraft=save;richTextBookmark=null;if(!composing)save();el.classList.toggle('richtext-empty',!c.textContent.trim())};
      c.oncompositionstart=()=>{composing=true};
      c.oncompositionend=()=>{composing=false;dirty=true;save()};
      c.onpaste=event=>{event.preventDefault();try{const imported=normalizeRichText(importRichTextClipboard({html:event.clipboardData?.getData('text/html')||'',text:event.clipboardData?.getData('text/plain')||''}));if(pasteRichTextDocument(c,imported))c.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertFromPaste'}))}catch(error){setStatus(error.message)}};
      c.onblur=()=>{if(inlineEditingId===id)save()};
      c.onpointerdown=e=>e.stopPropagation();c.onclick=e=>e.stopPropagation();
      c.ondblclick=e=>e.stopPropagation();
    }
    el.append(c);
    if(inlineEditingId!==id&&!node.locked){
      const edit=document.createElement('button');edit.type='button';edit.className='canvas-edit-richtext';
      edit.textContent=empty?'Írj ide… · Tartalom szerkesztése':'Tartalom szerkesztése';
      edit.setAttribute('aria-label','Tartalom szerkesztése');
      edit.onpointerdown=e=>e.stopPropagation();edit.onclick=e=>{e.stopPropagation();setSelection(state,[id],id);beginRichTextEditing(id)};
      el.append(edit);
    }else if(!node.locked){
      const format=document.createElement('button');format.type='button';format.className='canvas-edit-richtext canvas-format-richtext';
      format.textContent='Formázás és linkek';
      format.onpointerdown=e=>{e.preventDefault();e.stopPropagation()};format.onclick=e=>{e.stopPropagation();openRichTextFormatting(id)};
      el.append(format);
    }
    el.ondblclick=e=>{e.stopPropagation();setSelection(state,[id],id);beginRichTextEditing(id)};
  }else if([NODE_TYPES.BADGE,NODE_TYPES.QUOTE,NODE_TYPES.ICON].includes(node.type)){
   const c=document.createElement('div');c.className='node-content basic-element-preview';
   if(node.type===NODE_TYPES.ICON){const icon=iconById(node.props?.icon);c.textContent=icon.glyph;c.setAttribute('role','img');c.setAttribute('aria-label',node.props?.label||icon.label);c.classList.add('visual-icon');}
   else if(node.type===NODE_TYPES.BADGE){c.textContent=node.props?.text||'Címke';c.classList.add('visual-badge');}
   else{const q=document.createElement('blockquote');q.className='visual-quote';const p=document.createElement('p');p.textContent=node.props?.text||'';q.append(p);if(node.props?.attribution){const cite=document.createElement('cite');cite.textContent=node.props.attribution;q.append(cite)}c.append(q)}
   el.append(c);
 }else if(node.type===NODE_TYPES.SCHEDULE){const c=document.createElement('div');c.className='node-content schedule-preview-host';renderSchedulePreview(c,node.props?.schedule);el.append(c)}else if([NODE_TYPES.IMAGE,NODE_TYPES.VIDEO,NODE_TYPES.AUDIO].includes(node.type)){
    const src=String(node.props?.src||'').trim();const c=document.createElement('div');c.className='node-content media-preview';
    if(src&&/^(https?:\/\/|\/(?!\/))/.test(src)){
      const media=document.createElement(node.type===NODE_TYPES.IMAGE?'img':node.type===NODE_TYPES.VIDEO?'video':'audio');
      media.src=src;media.style.maxWidth='100%';media.style.width='100%';
      if(node.type===NODE_TYPES.IMAGE){media.alt=String(node.props?.alt||'');media.style.objectFit=node.props?.objectFit==='contain'?'contain':'cover';}
      else{media.controls=true;media.preload='none';if(node.type===NODE_TYPES.VIDEO)media.playsInline=true;media.addEventListener('pointerdown',event=>event.stopPropagation());}
      c.append(media);
    }else{const placeholder=document.createElement('small');placeholder.textContent='Adj meg egy média URL-t a Tartalom panelen.';c.append(placeholder);}
    el.append(c);
   }else if(isStructuredType(node.type)){
    const c=document.createElement('div');c.className='node-content structured-preview';
    c.innerHTML=renderElementContent(node.type,node.props?.contentModel??createElementContent(node.type),node.id);
    for(const eventName of ['pointerdown','click','dblclick'])c.addEventListener(eventName,event=>{if(event.target.closest('button,summary,dialog'))event.stopPropagation()});
    el.append(c);activateStructuredContent(c);
  }else if([NODE_TYPES.HEADING,NODE_TYPES.TEXT,NODE_TYPES.BUTTON,NODE_TYPES.LINK].includes(node.type)){
    const c=document.createElement('div');c.className='node-content plain-text-content-surface';c.textContent=node.props?.text??node.props?.content??node.name;
    if(inlineEditingId===id){
      c.classList.add('plain-text-inline-surface');c.contentEditable='plaintext-only';c.setAttribute('role','textbox');c.setAttribute('aria-label','Szöveg közvetlen szerkesztése');
      const typingGroup=crypto.randomUUID();let composing=false,dirty=false;
      const flush=()=>{if(composing)return false;if(!dirty)return true;const saved=commitTextSurface(id,c,typingGroup);if(saved)dirty=false;return saved};
      c.onfocus=()=>{flushRichTextDraft=flush};c.oninput=()=>{dirty=true;flushRichTextDraft=flush;if(!composing)flush()};c.onblur=flush;
      c.oncompositionstart=()=>{composing=true};c.oncompositionend=()=>{composing=false;dirty=true;flush()};
      for(const type of ['pointerdown','click','dblclick'])c.addEventListener(type,event=>event.stopPropagation());
    }else if(!node.locked){
      const edit=document.createElement('button');edit.type='button';edit.className='canvas-edit-text';edit.textContent='Szöveg szerkesztése';edit.setAttribute('aria-label','Szöveg szerkesztése');edit.onpointerdown=event=>event.stopPropagation();edit.onclick=event=>{event.stopPropagation();setSelection(state,[id],id);beginRichTextEditing(id)};el.append(edit);
    }
    el.ondblclick=event=>{event.stopPropagation();setSelection(state,[id],id);beginRichTextEditing(id)};el.append(c);
  }
  for(const child of node.children||[]){const x=renderNode(currentPage,child,managed);if(x)el.append(x)}if(state.selection.primaryId===id&&id!==currentPage.rootId&&!node.locked){const handle=document.createElement('button');handle.type='button';handle.className='canvas-resize-handle';handle.setAttribute('aria-label','Elem átméretezése');handle.title='Átméretezés';handle.onpointerdown=e=>beginCanvasResize(id,e,el);handle.onpointermove=e=>moveCanvasResize(id,e);handle.onpointerup=e=>finishCanvasResize(id,e);handle.onpointercancel=e=>finishCanvasResize(id,e,true);el.append(handle)}el.onpointerdown=e=>{if(inlineEditingId===id)return;if(e.pointerType==='touch'){e.stopPropagation();handleMobilePointerDown(id,e);return}beginCanvasDrag(id,e,el)};el.onpointermove=e=>{if(canvasResize?.nodeId===id){moveCanvasResize(id,e);return}if(e.pointerType==='touch')handleMobilePointerMove(e);else moveCanvasDrag(id,e)};el.onpointerup=e=>{if(canvasResize?.nodeId===id){finishCanvasResize(id,e);return}if(e.pointerType==='touch'){e.stopPropagation();handleMobilePointerUp(id,e);return}finishCanvasDrag(id,e)};el.onpointercancel=e=>{if(canvasResize?.nodeId===id){finishCanvasResize(id,e,true);return}if(e.pointerType==='touch')handleMobilePointerCancel(e);else finishCanvasDrag(id,e,true)};el.onclick=e=>{e.stopPropagation();if(inlineEditingId===id)return;if(mobileTouch.active&&mobileTouch.suppressClick){mobileTouch.suppressClick=false;return}selectNodeInteraction(id,e)};return el}
function updateCanvasExtent(target=canvas.querySelector('.page-canvas')){if(!target)return;let pageRect=target.getBoundingClientRect();const bottoms=[...target.querySelectorAll('.node')].map(node=>node.getBoundingClientRect().bottom-pageRect.top);target.style.minHeight=`${computeCanvasMinHeight(bottoms,zoom,844,80)}px`;pageRect=target.getBoundingClientRect();const nodes=[...target.querySelectorAll('.node')];const extents=measureCanvasWorkspace(nodes.map(node=>{const rect=node.getBoundingClientRect();return {left:rect.left-pageRect.left,right:rect.right-pageRect.left,top:rect.top-pageRect.top,bottom:rect.bottom-pageRect.top}}),target.offsetWidth,target.offsetHeight,zoom);target.style.left=`${extents.left}px`;target.style.top=`${extents.top}px`;pageRect=target.getBoundingClientRect();for(const node of nodes){const rect=node.getBoundingClientRect();node.classList.toggle('outside-artboard',rect.left<pageRect.left-1||rect.right>pageRect.right+1||rect.top<pageRect.top-1||rect.bottom>pageRect.bottom+1)}const frame=target.parentElement;if(frame?.classList.contains('page-canvas-frame')){frame.style.width=`${(target.offsetWidth+extents.left+extents.right)*zoom}px`;frame.style.height=`${(target.offsetHeight+extents.top+extents.bottom)*zoom}px`}}
function renderCanvas(){canvas.querySelectorAll('.page-canvas-frame').forEach(x=>x.remove());const current=page();const device=state?.viewport?.device||'desktop';const width=sizes[device];const frame=document.createElement('div');frame.className='page-canvas-frame';const pc=document.createElement('div');pc.className='page-canvas';pc.dataset.device=device;pc.style.width=`${width}px`;pc.style.transform=`scale(${zoom})`;if(current)pc.append(renderNode(current,current.rootId));frame.append(pc);canvas.append(frame);updateCanvasExtent(pc);$('#canvasEmpty').hidden=Boolean(current);$('#canvasMode').textContent=`${device} · ${width}px`;$('#zoom').textContent=`${Math.round(zoom*100)}%`;syncDeviceButtons(device)}
function fitCanvasToViewport(){const device=state?.viewport?.device||'desktop';zoom=Math.max(.35,Math.min(1.2,(canvas.clientWidth-48)/sizes[device]));render();canvas.scrollTo({left:0,top:0,behavior:'instant'})}
function changeCanvasZoom(next){const frame=canvas.querySelector('.page-canvas-frame');const centerX=canvas.scrollLeft+canvas.clientWidth/2,centerY=canvas.scrollTop+canvas.clientHeight/2;const pointX=frame?(centerX-frame.offsetLeft)/zoom:0,pointY=frame?(centerY-frame.offsetTop)/zoom:0;zoom=next;render();requestAnimationFrame(()=>{const updated=canvas.querySelector('.page-canvas-frame');if(!updated)return;canvas.scrollTo({left:Math.max(0,updated.offsetLeft+pointX*zoom-canvas.clientWidth/2),top:Math.max(0,updated.offsetTop+pointY*zoom-canvas.clientHeight/2),behavior:'instant'})})}
function syncDeviceButtons(device){document.querySelectorAll('[data-device]').forEach(b=>b.classList.toggle('active',b.dataset.device===device));document.querySelectorAll('.canvas-device-btn').forEach(b=>b.classList.toggle('active',b.dataset.device===device))}
function field(label,value,onChange,readOnly=false,multiline=false){const f=document.createElement('label');f.className='field';const l=document.createElement('span');l.textContent=label;const input=multiline?document.createElement('textarea'):document.createElement('input');input.value=value??'';input.readOnly=readOnly;if(!readOnly){input.onchange=()=>{onChange(input.value)};if(!multiline)input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();input.blur()}}}f.append(l,input);return f}
function normalizeDimension(value,{allowAuto=false}={}){const raw=String(value??'').trim().toLowerCase();if(allowAuto&&raw==='auto')return 'auto';if(!raw)return undefined;if(/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|%|vw|vh|rem|em)$/.test(raw))return raw;if(/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw))return `${raw}px`;return raw}
function resolvedGeometry(node,device){return getNodeGeometry(node,device)}
function responsiveDisplay(node,property,device,fallback){const result=resolveResponsiveValue(node?.responsive,property,device);return result.value??fallback}
function setGeometry(node,device,property,value){const normalized=normalizeDimension(value,{allowAuto:property==='width'||property==='height'});if(normalized===undefined)return;command('responsive.set',{nodeId:node.id,device,patch:{[property]:normalized}})}
function renderGeometryInspector(node){
  const device=state.viewport.device, geometry=resolvedGeometry(node,device);
  const values={x:geometry.x,y:geometry.y,width:geometry.width,height:geometry.height,
    position:responsiveDisplay(node,'position',device,node.style?.position||'relative')};
  const section=document.createElement('section');section.className='inspector-group';
  section.dataset.inspectorCategory='layout';
  const title=document.createElement('div');title.className='inspector-group-title';
  title.innerHTML=`<strong>Geometria</strong><small>${device}</small>`;
  section.append(title);
  for(const [id,key] of [['position.x','x'],['position.y','y'],['size.width','width'],['size.height','height'],['position.position','position']]){
    const prop=getProperty(id);
    const apply=value=>command('responsive.set',{nodeId:node.id,device,patch:{[key]:value}});
    section.append(renderPropertyInput(prop,prop.label,values[key],apply));
    if(id==='size.width'||id==='size.height')section.append(renderGeometryPresets(id,values[key],apply));
    if(hasResponsiveOverride(node.responsive,key,device)){
      const reset=document.createElement('button');reset.type='button';reset.className='property-reset';
      reset.textContent='Visszaállítás az alapértékre';
      reset.onclick=()=>command('responsive.set',{nodeId:node.id,device,patch:{[key]:undefined}});
      section.append(reset);
    }
  }
  return section;
}
function renderScheduleInspector(node){
  const config=normalizeScheduleConfig(node.props?.schedule||{});
  const section=document.createElement('section');
  section.className='inspector-group schedule-inspector';
  const title=document.createElement('div');
  title.className='inspector-group-title';
  title.innerHTML='<strong>Adásrend</strong><small>Schedule konfiguráció</small>';
  section.append(title);

  const selectField=(label,value,options,onChange)=>{
    const wrap=document.createElement('label');wrap.className='field';
    const text=document.createElement('span');text.textContent=label;
    const select=document.createElement('select');
    for(const optionValue of options){const option=document.createElement('option');option.value=optionValue;option.textContent=optionValue;option.selected=optionValue===value;select.append(option)}
    select.onchange=()=>command('schedule.config.set',{nodeId:node.id,patch:{[label==='Mód'?'mode':label==='Sorrend'?'order':'__invalid']:select.value}});
    wrap.append(text,select);return wrap;
  };

  const mode=selectField('Mód',config.mode,SCHEDULE_MODES,()=>{});
  mode.querySelector('select').onchange=()=>command('schedule.config.set',{nodeId:node.id,patch:{mode:mode.querySelector('select').value}});
  const order=selectField('Sorrend',config.order,SCHEDULE_ORDERS,()=>{});
  order.querySelector('select').onchange=()=>command('schedule.config.set',{nodeId:node.id,patch:{order:order.querySelector('select').value}});
  section.append(mode,order);

  section.append(
    field('Elemszám',String(config.limit),v=>{
      const limit=Math.max(1,Math.min(50,Number.parseInt(v,10)||1));
      command('schedule.config.set',{nodeId:node.id,patch:{limit}});
    })
  );

  const statusWrap=document.createElement('div');statusWrap.className='field';
  const statusLabel=document.createElement('span');statusLabel.textContent='Státuszok';
  const statusGrid=document.createElement('div');statusGrid.className='schedule-check-grid';
  for(const status of SCHEDULE_STATUSES){
    const label=document.createElement('label');label.className='inspector-toggle';
    const input=document.createElement('input');input.type='checkbox';input.checked=config.statuses.includes(status);
    input.onchange=()=>{
      const next=statusGrid.querySelectorAll('input:checked');
      const values=[...next].map(x=>x.dataset.status);
      if(!values.length){input.checked=true;return}
      command('schedule.config.set',{nodeId:node.id,patch:{statuses:values}});
    };
    input.dataset.status=status;
    const span=document.createElement('span');span.textContent=status;
    label.append(input,span);statusGrid.append(label);
  }
  statusWrap.append(statusLabel,statusGrid);section.append(statusWrap);

  const toggles=[
    ['showTitle','Cím megjelenítése'],['showPlatform','Platform megjelenítése'],
    ['showTime','Kezdés megjelenítése'],['showEndTime','Befejezés megjelenítése'],
    ['showStatus','Státusz megjelenítése'],['showNotes','Megjegyzés megjelenítése'],
    ['showLink','Link megjelenítése']
  ];
  for(const [key,labelText] of toggles){
    const row=document.createElement('label');row.className='inspector-toggle';
    const input=document.createElement('input');input.type='checkbox';input.checked=Boolean(config[key]);
    input.onchange=()=>command('schedule.config.set',{nodeId:node.id,patch:{[key]:input.checked}});
    const span=document.createElement('span');span.textContent=labelText;row.append(input,span);section.append(row);
  }
  section.append(field('Üres állapot szövege',config.emptyText,v=>{
    const value=String(v).trim();if(!value)return;
    command('schedule.config.set',{nodeId:node.id,patch:{emptyText:value}});
  },false,true));
  return section;
}

function renderRegistryInspector(node,mode='primary'){
  const device=state.viewport.device,root=document.createDocumentFragment();
  const primaryGroups=new Set(['layout','size','spacing','flex','grid','position','typography','background','border','radius','shadow','opacity']);
  const duplicates=new Set(['content.text','content.href','advanced.nodeName',
    'position.x','position.y','size.width','size.height','position.position']);
  for(const group of listPropertyGroups()){
    if((mode==='primary')!==primaryGroups.has(group.id))continue;
    const parent=page()?.nodes?.[node.parentId];
    const properties=listProperties({group:group.id,...(!['flex','grid'].includes(group.id)?{nodeType:node.type}:{})})
      .filter(property=>!duplicates.has(property.id)&&isLayoutPropertyRelevant(property,node,parent,device));
    if(!properties.length)continue;
    const section=document.createElement('section');section.className='inspector-group';
    section.dataset.inspectorCategory=group.id==='typography'?'text':['background','border','radius','shadow','opacity'].includes(group.id)?'surface':'layout';
    const title=document.createElement('div');title.className='inspector-group-title';
    title.innerHTML='<strong></strong><small></small>';
    title.querySelector('strong').textContent=group.id==='flex'&&layoutMode(node,device)!=='flex'?(layoutMode(parent,device)==='grid'?'Gyermek igazítása':'Flex-gyermek'):group.id==='grid'&&layoutMode(node,device)!=='grid'?'Grid-gyermek':group.label;
    title.querySelector('small').textContent=String(properties.length);
    section.append(title);
    for(const property of properties){
      const key=property.key||property.id.split('.')[1];
      const resolved=property.responsive?resolveResponsiveValue(node.responsive,key,device):null;
      const rendered=canvas.querySelector(`.node[data-node-id="${CSS.escape(node.id)}"]`);
      const current=resolved?.value??node.style?.[key]??(['flex','grid','layout'].includes(property.group)&&rendered?getComputedStyle(rendered)[key]:'')??'';
      const label=property.responsive&&resolved?.inherited?property.label+' · örökölt':property.label;
      const apply=value=>{
        if(property.responsive)command(property.command,{nodeId:node.id,device,patch:{[key]:value}});
        else command(property.command,{nodeId:node.id,patch:{[key]:value}});
      };
      section.append(renderPropertyInput(property,label,current,apply));
      if(property.responsive&&hasResponsiveOverride(node.responsive,key,device)){
        const reset=document.createElement('button');reset.type='button';reset.className='property-reset';
        reset.textContent='Öröklés visszaállítása';
        reset.title=device+' nézet saját értékének törlése, a szélesebb nézet értékének öröklése';
        reset.onclick=()=>command('responsive.set',{nodeId:node.id,device,patch:{[key]:undefined}});
        section.append(reset);
      }
    }
    root.append(section);
  }
  return root;
}
function renderLayoutInspector(node){
  const section=document.createElement('section');section.className='inspector-group layout-recipes';section.dataset.inspectorCategory='layout';
  const title=document.createElement('div');title.className='inspector-group-title';
  const name=document.createElement('strong');name.textContent=LAYOUT_TYPES.includes(node.type)?'Elrendezési minták':'Szülő és elhelyezés';title.append(name);section.append(title);
  const device=state.viewport.device,parent=page()?.nodes?.[node.parentId];
  const modeName=mode=>({flex:'Flex',grid:'Grid',block:'Normál folyás'}[mode]);
  const context=document.createElement('p');context.className='layout-context';context.textContent=`Ez az elem: ${modeName(layoutMode(node,device))} · ${device}.`;
  section.append(context);
  if(parent){
    const parentButton=document.createElement('button');parentButton.type='button';parentButton.className='layout-parent';parentButton.textContent=`Szülő: ${parent.name||parent.type} · ${modeName(layoutMode(parent,device))}`;
    parentButton.title='A szülő tároló kijelölése. Az oszlopok, irány és a gyermekek közötti távolság ott állítható.';
    parentButton.onclick=()=>command('selection.set',{ids:[parent.id],primaryId:parent.id});section.append(parentButton);
  }
  const help=document.createElement('p');help.className='layout-help';help.textContent='A tároló rendezi el a gyermekeit. Flexnél az irány határozza meg az elosztás tengelyét; Gridnél az oszlopok és sorok adják a rácsot. A gyermek saját növekedése vagy rácshelye csak a megfelelő szülőben hat. A részletes mezők ezt a kapcsolatot követik.';section.append(help);
  if(LAYOUT_TYPES.includes(node.type)){
    const rendered=canvas.querySelector(`.node[data-node-id="${CSS.escape(node.id)}"]`);
    if(!rendered?.classList.contains('managed-layout')){
      const legacy=document.createElement('p');legacy.className='layout-help';legacy.textContent='Ez még a korábbi publikus megjelenést használja, annak automatikus kártyakeretével és mobilos tördelésével. Az alábbi minták valamelyikével bekapcsolható az új, vászonnal egyező elrendezés. Publikálás előtt ellenőrizd az előnézetet.';section.append(legacy);
    }
    const note=document.createElement('p');note.className='layout-help';note.textContent='Egy minta mindhárom nézet elrendezését beállítja, egyetlen visszavonható lépésben. Tartalmat nem cserél és nem publikál. Az elemek saját mérete, pozíciója és rácshelye megmarad; szükség esetén lent automatikus elhelyezés kérhető.';section.append(note);
    const grid=document.createElement('div');grid.className='layout-preset-grid';
    for(const preset of LAYOUT_PRESETS){
      const button=document.createElement('button');button.type='button';button.className='layout-preset';button.dataset.layoutPreset=preset.id;button.disabled=Boolean(node.locked);button.title=preset.help;button.setAttribute('aria-label',preset.label+' elrendezésminta');
      const preview=document.createElement('span');preview.className='layout-preset-preview';preview.setAttribute('aria-hidden','true');Object.assign(preview.style,preset.layouts[0]);
      const previewCount=explicitGridColumnCount(preset.layouts[0].gridTemplateColumns)||3;
      for(let index=0;index<previewCount;index++)preview.append(document.createElement('span'));
      const label=document.createElement('strong');label.textContent=preset.label;const hint=document.createElement('small');hint.textContent=preset.help;button.append(preview,label,hint);
      button.onclick=()=>{if(command('layout.preset.apply',{nodeId:node.id,presetId:preset.id}))setStatus('Reszponzív elrendezés beállítva. Mentés és Publikálás külön művelet.')};grid.append(button);
    }
    section.append(grid);
  }
  if(['grid','flex'].includes(layoutMode(node,device))&&node.children?.length){
    const auto=document.createElement('button');auto.type='button';auto.className='layout-auto';auto.textContent='Gyermekek automatikus elhelyezése';auto.disabled=Boolean(node.locked)||node.children.some(id=>page()?.nodes?.[id]?.locked);
    auto.title=auto.disabled?'Zárolt gyermek miatt az egész művelet nem végezhető el.':'Csak az aktuális nézetben állítja automatikusra a közvetlen gyermekek Flex/Grid elhelyezését. A méret, pozíció, tartalom és más nézetek megmaradnak.';
    auto.onclick=()=>command('layout.children.auto',{nodeId:node.id,device});section.append(auto);
  }
  if(parent&&layoutMode(parent,device)==='grid'){
    const values=resolveNodeStyle(node,device);
    const columns=explicitGridColumnCount(resolveNodeStyle(parent,device).gridTemplateColumns);
    const start=parseInt(values.gridColumn,10);
    if(columns&&start>columns){const warning=document.createElement('p');warning.className='layout-warning';warning.setAttribute('role','status');warning.textContent='A saját oszlophely új, nem tervezett oszlopot nyithat ebben a nézetben. Jelöld ki a szülőt, és válaszd a Gyermekek automatikus elhelyezése műveletet, vagy módosítsd az Oszlophely mezőt.';section.append(warning)}
  }
  return section;
}
function filterInspector(){
  const query=inspectorQuery.trim().toLocaleLowerCase('hu');
  const fields=[...inspector.querySelectorAll('.field,.typed-inspector-field,.richtext-editor,.typography-role,.layout-preset')];
  let matches=0;
  for(const item of new Set(fields)){
    const text=(item.dataset.propertyId||'')+' '+item.textContent+' '+(item.title||'');
    const visible=!query||text.toLocaleLowerCase('hu').includes(query);
    item.hidden=!visible;
    if(visible)matches++;
  }
  for(const group of inspector.querySelectorAll('.inspector-group')){
    const title=group.querySelector(':scope > .inspector-group-title')?.textContent||'';
    const groupFields=[...group.querySelectorAll('.field,.typed-inspector-field,.richtext-editor,.typography-role,.layout-preset')];
    const visible=query?title.toLocaleLowerCase('hu').includes(query)||groupFields.some(item=>!item.hidden):inspectorCategory==='all'||!group.dataset.inspectorCategory||group.dataset.inspectorCategory===inspectorCategory;
    group.hidden=!visible;
    if(query&&visible){group.classList.add('is-open');group.querySelector(':scope > .inspector-group-title')?.setAttribute('aria-expanded','true')}
  }
  const status=inspector.querySelector('.inspector-search-status');
  if(status)status.textContent=query?`${matches} találat`:'';
}
function renderInspectorSearch(){
  const wrap=document.createElement('label');wrap.className='inspector-search';
  const title=document.createElement('span');title.textContent='Beállítás keresése';
  const input=document.createElement('input');input.type='search';input.value=inspectorQuery;input.placeholder='Pl. szín, térköz, betűméret';input.setAttribute('aria-label','Beállítás keresése');
  input.oninput=()=>{inspectorQuery=input.value;filterInspector()};
  const status=document.createElement('small');status.className='inspector-search-status';status.setAttribute('aria-live','polite');
  wrap.append(title,input,status);inspector.append(wrap);
}
function renderInspectorCategories(){
  const nav=document.createElement('nav');nav.className='inspector-category-nav';nav.setAttribute('aria-label','Stílusbeállítások szűrése');
  for(const [id,label] of [['all','Összes'],['layout','Elrendezés'],['text','Szöveg'],['surface','Felület']]){
    const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.inspectorCategory=id;button.setAttribute('aria-pressed',String(inspectorCategory===id));
    button.onclick=()=>{inspectorCategory=id;nav.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));filterInspector()};nav.append(button);
  }
  return nav;
}
function renderTypographyPresets(node){
  const section=document.createElement('section');section.className='inspector-group typography-roles';section.dataset.inspectorCategory='text';
  const title=document.createElement('div');title.className='inspector-group-title';title.innerHTML='<strong>Szövegstílusok</strong><small>8 szerep</small>';section.append(title);
  const hint=document.createElement('p');hint.className='typography-role-hint';hint.textContent='Az egész elem alapstílusa az aktuális nézetben. A külön formázott szavak felülírhatják; ezek a Tartalom fülön visszaállíthatók.';section.append(hint);
  const grid=document.createElement('div');grid.className='typography-role-grid';
  for(const preset of TYPOGRAPHY_PRESETS){
    const button=document.createElement('button');button.type='button';button.className='typography-role';button.dataset.typographyPreset=preset.id;button.title=preset.help;button.setAttribute('aria-label',preset.label+' szövegstílus');
    const sample=document.createElement('span');sample.textContent=preset.sample;sample.className='typography-role-sample';sample.style.fontFamily=preset.patch.fontFamily||'system-ui';sample.style.fontWeight=preset.patch.fontWeight;sample.style.fontStyle=preset.patch.fontStyle||'normal';
    const label=document.createElement('strong');label.textContent=preset.label;button.append(sample,label);button.disabled=Boolean(node.locked);button.onclick=()=>command('responsive.set',{nodeId:node.id,device:state.viewport.device,patch:typographyPresetPatch(preset.id,state.viewport.device)});grid.append(button);
  }
  section.append(grid);return section;
}
function editorSiteScope(){return String(state?.document?.siteId||location.origin)}
function copySelectedAppearance(node){
  const snapshot=captureStyleSnapshot(node);
  const hasAppearance=Object.values(snapshot.style).length>0||['desktop','tablet','mobile'].some(device=>Object.keys(snapshot.responsive[device]||{}).length>0);
  if(!hasAppearance){setStatus('Ezen az elemen még nincs másolható megjelenési stílus.');return}
  copiedStyleSnapshot={...snapshot,siteId:editorSiteScope(),sourcePageId:page()?.id};
  setStatus(`Megjelenés másolva innen: ${node.name||node.type}. A tartalom, méret és pozíció kimarad.`);
  renderInspector();
}
function pasteSelectedAppearance(node){
  if(!copiedStyleSnapshot)return;
  if(editorSiteScope()!==copiedStyleSnapshot.siteId){setStatus('A másolt stílus másik webhelyről származik, ezért nem alkalmazható.');return}
  if(page()?.id===copiedStyleSnapshot.sourcePageId&&node.id===copiedStyleSnapshot.sourceNodeId){setStatus('A forrás elemen már ugyanaz a stílus van.');return}
  if(command('style.snapshot.apply',{nodeId:node.id,snapshot:copiedStyleSnapshot}))setStatus(`A másolt megjelenés alkalmazva: ${node.name||node.type}. Mentéshez használd a Mentés gombot.`);
}
function renderMultiInspector(nodes){
 const panel=document.createElement('section');panel.className='multi-inspector';
 const title=document.createElement('h3');title.textContent=`${nodes.length} elem közös beállításai`;panel.append(title);
 const locked=nodes.some(node=>node.locked);
 const note=document.createElement('small');note.textContent=locked?'Zárolt elem is van kijelölve: a közös módosítás ezért tiltva van.':'A változás az összes kijelölt elemre egyszerre érvényes. Egyetlen Visszavonás visszaállítja az előző állapotot.';panel.append(note);
 const device=state.viewport.device;
 const apply=patch=>{if(locked)return;try{
  executeBatch(state,nodes.map(node=>({type:'responsive.set',payload:{nodeId:node.id,device,patch}})),{label:'Több elem közös formázása'});
  render();setStatus(`${nodes.length} elem közös megjelenése módosult. Mentés szükséges.`);
 }catch(error){setStatus(error.message||'A közös formázás nem sikerült.')}};
 const make=(label,key,kind,defaultValue,unit='')=>{
  const row=document.createElement('label');row.className='multi-inspector-field';
  const text=document.createElement('span');text.textContent=label;row.append(text);
  const values=nodes.map(node=>resolveResponsiveValue(node.responsive,key,device)?.value);
  const same=values.every(value=>value===values[0]);
  const input=document.createElement('input');input.type=kind;
  input.disabled=locked;
  const value=same?values[0]:undefined;
  if(kind==='color'){input.value=validHexColor(value)?value:defaultValue;input.title=same?'':'Eltérő értékek';input.onchange=()=>apply({[key]:input.value});}
  else{
   input.value=value===undefined?'':String(value).replace(unit,'');input.placeholder=same?'Alapérték':'Eltérő értékek';
   input.min=key==='opacity'?'0':'0';input.max=key==='opacity'?'1':'2000';input.step=key==='opacity'?'0.05':'1';
   input.onchange=()=>{const v=Number(input.value);if(!input.value.trim()||!Number.isFinite(v)||v<0||(key==='opacity'&&v>1))return;apply({[key]:unit?`${v}${unit}`:v})};
  }
  row.append(input);if(unit){const u=document.createElement('small');u.textContent=unit;row.append(u)}
  panel.append(row);
 };
 make('Háttérszín','backgroundColor','color','#334155');
 make('Szövegszín','color','color','#ffffff');
 make('Betűméret','fontSize','number','16','px');
 make('Belső térköz','padding','number','16','px');
 make('Saroklekerekítés','borderRadius','number','8','px');
 make('Átlátszóság','opacity','number','1');
 return panel;
}
function renderInspector(){
  const previousScrollTop=inspector.scrollTop;
  const restoreScroll=()=>requestAnimationFrame(()=>{inspector.scrollTop=previousScrollTop});
  // Tab switches and direct selection changes do not pass through command().
  // Flush before removing the live contenteditable element from the DOM.
  if(!inlineEditingId){if(flushRichTextDraft?.()===false)return false;flushRichTextDraft=null;}
  richTextSelectionCleanup?.();richTextSelectionCleanup=null;
  inspector.replaceChildren();
  renderInspectorSearch();
  const nodes=state?selectedNodes(state):[];
  if(!nodes.length){inspector.insertAdjacentHTML('beforeend','<div class="inspector-empty"><b>Inspector</b><span>Válassz ki egy elemet a vásznon vagy a Rétegek panelen.</span></div>');filterInspector();restoreScroll();return}
  if(nodes.length>1){inspector.append(renderMultiInspector(nodes));filterInspector();restoreScroll();return}
  const node=nodes[0];
  const header=document.createElement('div');header.className='inspector-selection';
  const headerName=document.createElement('b');headerName.textContent=node.name||node.type;
  const headerType=document.createElement('small');headerType.textContent=node.type;
  header.append(headerName,headerType);
  const styleActions=document.createElement('div');styleActions.className='style-copy-actions';
  const copyStyle=document.createElement('button');copyStyle.type='button';copyStyle.className='style-copy-button';copyStyle.textContent='Megjelenés másolása';copyStyle.setAttribute('aria-label','Megjelenés másolása');copyStyle.title='Szín, tipográfia, térköz, keret, árnyék és áttetszőség másolása. A tartalom, méret és pozíció megmarad.';copyStyle.onclick=()=>copySelectedAppearance(node);
  const pasteStyle=document.createElement('button');pasteStyle.type='button';pasteStyle.className='style-paste-button';pasteStyle.textContent='Másolt stílus alkalmazása';pasteStyle.setAttribute('aria-label','Másolt stílus alkalmazása');pasteStyle.disabled=!copiedStyleSnapshot||editorSiteScope()!==copiedStyleSnapshot.siteId||(page()?.id===copiedStyleSnapshot.sourcePageId&&node.id===copiedStyleSnapshot.sourceNodeId)||Boolean(node.locked);pasteStyle.title='A másolt külső megjelenést alkalmazza erre az elemre; a tartalom, méret és pozíció változatlan marad.';pasteStyle.onclick=()=>pasteSelectedAppearance(node);
  styleActions.append(copyStyle,pasteStyle);
  const styleHelp=document.createElement('small');styleHelp.className='style-copy-help';styleHelp.textContent='Másik szövegnél ugyanazt a megjelenést használhatod. A méretet, pozíciót és tartalmat külön kezeli.';
  header.append(styleActions,styleHelp);inspector.append(header);

  if(inspectorTab==='design'){
    inspector.append(renderInspectorCategories());
    inspector.append(renderLayoutInspector(node));
    inspector.append(field('Elem neve',node.name,v=>command('element.update',{nodeId:node.id,patch:{name:v}})),renderGeometryInspector(node));
    if(['heading','text','richtext','button','link'].includes(node.type))inspector.append(renderTypographyPresets(node));
    if(node.type==='schedule')inspector.append(renderScheduleInspector(node));
    else inspector.append(renderRegistryInspector(node,'primary'));
    if(node.id!==page()?.rootId){
      const statesPanel=document.createElement('details');statesPanel.className='state-inspector';
      const heading=document.createElement('summary');heading.textContent='Rámutatás és fókusz';statesPanel.append(heading);
      const note=document.createElement('small');note.textContent='Egyszerű, külön állapotstílusok a látogatói oldalon. A fókuszjelölés a billentyűzetes navigációt segíti.';statesPanel.append(note);
      for(const [group,key,label,defaultColor] of [
        ['hover','backgroundColor','Rámutatás: háttér','#334155'],
        ['hover','color','Rámutatás: szöveg','#ffffff'],
        ['focus','outlineColor','Fókuszkeret színe','#2563eb']
      ]){
        const row=document.createElement('label');row.className='state-color-field';
        const caption=document.createElement('span');caption.textContent=label;row.append(caption);
        const value=node.states?.[group]?.[key];
        const picker=document.createElement('input');picker.type='color';picker.value=validHexColor(value)?value:defaultColor;picker.disabled=Boolean(node.locked);
        picker.onchange=()=>command('element.update',{nodeId:node.id,patch:{states:{...(node.states||{}),[group]:{...(node.states?.[group]||{}),[key]:picker.value}}}});
        const clear=document.createElement('button');clear.type='button';clear.textContent='Törlés';clear.disabled=Boolean(node.locked||!value);
        clear.onclick=()=>{const next={...(node.states?.[group]||{})};delete next[key];command('element.update',{nodeId:node.id,patch:{states:{...(node.states||{}),[group]:next}}})};
        row.append(picker,clear);statesPanel.append(row);
      }
      inspector.append(statesPanel);
    }
    const lockRow=document.createElement('label');lockRow.className='inspector-toggle';
    const lockInput=document.createElement('input');lockInput.type='checkbox';lockInput.checked=Boolean(node.locked);lockInput.disabled=node.id===page()?.rootId;
    lockInput.onchange=()=>command('element.lock.set',{nodeId:node.id,locked:lockInput.checked});
    const lockText=document.createElement('span');lockText.textContent='Zárolt elem';lockRow.append(lockInput,lockText);inspector.append(lockRow);
  }else if(inspectorTab==='content'){
    if(node.type==='schedule')inspector.append(renderScheduleInspector(node));
    else {
      const textTypes=new Set(['heading','text','richtext','button','link']);
      if(node.type==='richtext'){
        const currentRichText=node.props?.richText||plainTextToRichText('');
        const section=document.createElement('section');section.className='richtext-editor';
        const toolbar=document.createElement('div');toolbar.className='richtext-toolbar';
        const blockSelect=document.createElement('select');blockSelect.title='Aktuális blokk típusa';
        [['paragraph','Bekezdés'],['heading-1','H1'],['heading-2','H2'],['heading-3','H3'],
          ['heading-4','H4'],['heading-5','H5'],['heading-6','H6'],['bulleted-list','Felsorolás'],
          ['numbered-list','Számozott lista'],['quote','Idézet'],['code','Kódblokk']]
          .forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;blockSelect.append(option)});
        const alignmentSelect=document.createElement('select');alignmentSelect.className='richtext-align-select';alignmentSelect.title='A kurzor alatti bekezdés igazítása';alignmentSelect.setAttribute('aria-label','Bekezdés igazítása');
        [['left','Balra igazítás'],['center','Középre igazítás'],['right','Jobbra igazítás'],['justify','Sorkizárt']]
          .forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;alignmentSelect.append(option)});
        const paragraphTools=document.createElement('div');paragraphTools.className='richtext-tool-group';paragraphTools.setAttribute('aria-label','Bekezdés beállításai');
        const paragraphLabel=document.createElement('span');paragraphLabel.textContent='Bekezdés';paragraphLabel.className='richtext-tool-label';paragraphTools.append(paragraphLabel,blockSelect,alignmentSelect);toolbar.append(paragraphTools);
        const characterTools=document.createElement('div');characterTools.className='richtext-tool-group';characterTools.setAttribute('aria-label','Karakterformázás');
        const characterLabel=document.createElement('span');characterLabel.textContent='Karakter';characterLabel.className='richtext-tool-label';characterTools.append(characterLabel);toolbar.append(characterTools);
        const colorTools=document.createElement('div');colorTools.className='richtext-tool-group richtext-color-tools';colorTools.setAttribute('aria-label','Szövegszínek');
        const colorLabel=document.createElement('span');colorLabel.textContent='Színek';colorLabel.className='richtext-tool-label';colorTools.append(colorLabel);toolbar.append(colorTools);
        const toolTabs=document.createElement('div');toolTabs.className='richtext-tool-tabs';toolTabs.setAttribute('role','tablist');toolTabs.setAttribute('aria-label','Szövegformázási eszközök');
        for(const [id,label] of [['character','Karakter'],['paragraph','Bekezdés'],['color','Színek']]){
          const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('role','tab');button.tabIndex=richTextToolTab===id?0:-1;button.setAttribute('aria-selected',String(richTextToolTab===id));
          button.onclick=()=>{richTextToolTab=id;toolTabs.querySelectorAll('button').forEach(item=>{item.setAttribute('aria-selected',String(item===button));item.tabIndex=item===button?0:-1});characterTools.hidden=id!=='character';paragraphTools.hidden=id!=='paragraph';colorTools.hidden=id!=='color'};toolTabs.append(button);
        }
        characterTools.hidden=richTextToolTab!=='character';paragraphTools.hidden=richTextToolTab!=='paragraph';colorTools.hidden=richTextToolTab!=='color';toolbar.prepend(toolTabs);toolTabs.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const buttons=[...toolTabs.querySelectorAll('button')],index=buttons.indexOf(document.activeElement),next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;event.preventDefault();buttons[next].click();buttons[next].focus()};
        const fontFamilyLabel=document.createElement('label');fontFamilyLabel.className='richtext-typography-control';fontFamilyLabel.title='Kijelölt szövegrész betűcsaládja';fontFamilyLabel.append(document.createTextNode('Betűcsalád'));
        const fontFamilySelect=document.createElement('select');fontFamilySelect.setAttribute('aria-label','Betűcsalád');fontFamilySelect.title='Betűcsalád alkalmazása a kijelölt szövegre';
        [['','Alapértelmezett'],['Arial','Arial'],['Aptos','Aptos'],['Calibri','Calibri'],['Cambria','Cambria'],['Georgia','Georgia'],['Tahoma','Tahoma'],['Trebuchet MS','Trebuchet MS'],['Verdana','Verdana'],['Times New Roman','Times New Roman'],['Courier New','Courier New'],['system-ui','Rendszer'],['serif','Talpas'],['sans-serif','Talpatlan'],['monospace','Rögzített szélesség']]
          .forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;fontFamilySelect.append(option)});
        fontFamilyLabel.append(fontFamilySelect);characterTools.append(fontFamilyLabel);
        const fontSizeLabel=document.createElement('label');fontSizeLabel.className='richtext-typography-control richtext-size-control';fontSizeLabel.title='Kijelölt szöveg mérete 8 és 96 képpont között';fontSizeLabel.append(document.createTextNode('Méret'));
        const fontSizeInput=document.createElement('input');fontSizeInput.type='number';fontSizeInput.min='8';fontSizeInput.max='96';fontSizeInput.step='1';fontSizeInput.value='16';fontSizeInput.setAttribute('aria-label','Betűméret képpontban');fontSizeLabel.append(fontSizeInput);characterTools.append(fontSizeLabel);
        const editor=document.createElement('div');editor.className='richtext-content richtext-editor-surface';
        editor.dataset.textNodeId=node.id;editor.contentEditable=node.locked?'false':'true';applyTextSurfaceStyle(editor,node);editor.spellcheck=true;editor.setAttribute('role','textbox');
        editor.setAttribute('aria-label','Rich Text szerkesztő');
        renderRichTextEditor(editor,currentRichText);
        let richTextDirty=false, savedLinkSelection=richTextBookmark?.nodeId===node.id?richTextBookmark.range:null,
          savedFormatSelection=richTextBookmark?.nodeId===node.id?richTextBookmark.formatRange:null,
          savedBlockIndex=richTextBookmark?.nodeId===node.id?richTextBookmark.blockIndex:null,composing=false,
          savedSelectionOffsets=null;
        const typingGroup=crypto.randomUUID();let formattingSurface=editor;
        function refreshFormattingControls(range,surface){
          const model=richTextEditorToDocument(surface),format=readRichTextSelectionFormatting(model,range);
          const native=window.getSelection(),anchor=native?.anchorNode;
          const element=anchor&&surface.contains(anchor)?anchor.nodeType===Node.ELEMENT_NODE?anchor:anchor.parentElement:surface;
          const css=getComputedStyle(element);
          fontFamilySelect.value=format.mixed.includes('fontFamily')?'':format.styles.fontFamily||'';
          fontFamilySelect.title=format.mixed.includes('fontFamily')?'Vegyes betűcsalád':format.styles.fontFamily||css.fontFamily;
          if(fontSizeInput.dataset.pending!=='true')fontSizeInput.value=format.mixed.includes('fontSize')?'':String(parseFloat(format.styles.fontSize||css.fontSize)||16);
          fontSizeInput.placeholder=format.mixed.includes('fontSize')?'Vegyes':'';
          for(const button of characterTools.querySelectorAll('[data-mark]')){
            const tag={bold:'strong,b',italic:'em,i',underline:'u',strikethrough:'s,strike',subscript:'sub',superscript:'sup',code:'code'}[button.dataset.mark];
            const value=range?format.marks[button.dataset.mark]:Boolean(element.closest(tag)&&surface.contains(element.closest(tag)));
            button.setAttribute('aria-pressed',String(value));
          }
          for(const input of colorTools.querySelectorAll('input[data-style-key]')){
            const key=input.dataset.styleKey,value=format.styles[key]||css[key];
            const rgb=String(value).match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            const hex=/^#[\da-f]{6}$/i.test(value)?value:/^#[\da-f]{3}$/i.test(value)?'#'+value.slice(1).split('').map(x=>x+x).join(''):rgb?'#'+rgb.slice(1,4).map(x=>Number(x).toString(16).padStart(2,'0')).join(''):null;
            if(hex)input.value=hex;
            input.dataset.mixed=String(format.mixed.includes(key));
          }
          scope.textContent=range?'Kijelölt szövegrész · a vásznon és az Inspectorban ugyanaz':'Élő szöveg · jelölj ki szavakat a helyi formázáshoz';
        }
        const rememberSelection=()=>{
          const canvasEditor=canvas.querySelector(`.node[data-node-id="${CSS.escape(node.id)}"] .richtext-inline-surface`);
          const native=window.getSelection();
          const surface=canvasEditor&&native?.anchorNode&&canvasEditor.contains(native.anchorNode)?canvasEditor:editor;
          const offsets=getSelectionOffsets(surface);if(!offsets)return;
          formattingSurface=surface;savedSelectionOffsets={from:offsets.from,to:offsets.to};
          const format=getRichTextFormattingSelection(surface);savedFormatSelection=format;
          const next=getRichTextBlockSelection(surface);savedLinkSelection=next;
          const index=getRichTextActiveBlockIndex(surface);
          if(index!==null){
            savedBlockIndex=index;const active=richTextEditorToDocument(surface).blocks[index];
            if(active){blockSelect.value=active.type==='heading'?`heading-${active.level||1}`:active.type;blockSelect.disabled=active.type==='table';alignmentSelect.value=active.align||'left';alignmentSelect.disabled=!['paragraph','heading','quote'].includes(active.type)}
          }
          richTextBookmark={nodeId:node.id,range:savedLinkSelection,formatRange:savedFormatSelection,blockIndex:savedBlockIndex};
          refreshFormattingControls(format,surface);
        };
        const selectionObserver=()=>{if(!editor.isConnected){document.removeEventListener('selectionchange',selectionObserver);return}if(!toolbar.contains(document.activeElement)&&!linkControls.contains(document.activeElement))rememberSelection()};
        const refreshCanvasRichText=doc=>syncTextSurfaces(node.id,doc,editor);
        const commitWithoutRender=(doc,group=null)=>{const saved=command('richtext.content.set',{nodeId:node.id,document:doc},{render:false,typingGroup:group});if(saved){richTextDirty=false;refreshCanvasRichText(doc);setStatus('Nem mentett módosítás');syncPublishControls()}return saved};
        const formatStatus=document.createElement('small');formatStatus.className='richtext-format-feedback';formatStatus.setAttribute('role','status');
        const saveRich=()=>{
          if(composing){setStatus('Fejezd be az aktuális szövegbevitelt.');return false}if(!richTextDirty)return true;
          const saved=commitTextSurface(node.id,editor,typingGroup);
          if(saved)richTextDirty=false;
          return saved;
        };
        flushRichTextDraft=saveRich;
        toolbar.onpointerdown=rememberSelection;
        blockSelect.onchange=()=>{
          const doc=richTextEditorToDocument(editor);
          const index=savedBlockIndex??getRichTextActiveBlockIndex(editor);
          if(index===null){blockSelect.title='Előbb helyezd a kurzort egy szövegblokkba.';return}
          const block=doc.blocks[index];if(!block)return;
          if(block.type==='table'){blockSelect.title='A táblázat cellájában maradva nem változtatható meg a teljes táblázat blokkstílusa.';return}
          const before=doc.blocks.slice(0,index).reduce((sum,b)=>sum+(b.children??b.items?.flatMap(item=>item.children??item)??[]).reduce((n,x)=>n+x.text.length,0)+1,0);
          const type=blockSelect.value.startsWith('heading-')?'heading':blockSelect.value;
          const level=type==='heading'?Number(blockSelect.value.split('-')[1]):1;
          const next=setBlockType(doc,before,before+Math.max(1,(block.children??block.items?.flatMap(item=>item.children??item)??[]).reduce((n,x)=>n+x.text.length,0)),type,level);
          if(command('richtext.content.set',{nodeId:node.id,document:next},{render:false})){richTextDirty=false;renderRichTextEditor(editor,next);refreshCanvasRichText(next);if(savedSelectionOffsets)restoreSelectionOffsets(formattingSurface,savedSelectionOffsets);rememberSelection();setStatus('Nem mentett módosítás');syncPublishControls()}
        };
        alignmentSelect.onpointerdown=rememberSelection;
        alignmentSelect.onchange=()=>{
          const doc=richTextEditorToDocument(editor),index=savedBlockIndex??getRichTextActiveBlockIndex(editor);if(index===null){formatStatus.textContent='Előbb kattints abba a bekezdésbe, amelyet igazítani szeretnél.';return}
          try{const selection=savedFormatSelection||getRichTextFormattingSelection(editor),indices=selection?.segments?.map(segment=>segment.blockIndex)??[index],next=updateRichTextBlockAlignment(doc,indices,alignmentSelect.value);if(command('richtext.content.set',{nodeId:node.id,document:next},{render:false})){richTextDirty=false;renderRichTextEditor(editor,next);refreshCanvasRichText(next);if(savedSelectionOffsets)restoreSelectionOffsets(formattingSurface,savedSelectionOffsets);rememberSelection();setStatus('Nem mentett módosítás');syncPublishControls()}}catch(error){formatStatus.textContent=error instanceof Error?error.message:String(error)}
        };
        for(const [mark,label,glyph] of [['bold','Félkövér','B'],['italic','Dőlt','I'],['underline','Aláhúzott','U'],['strikethrough','Áthúzott','S'],['subscript','Alsó index','x₂'],['superscript','Felső index','x²'],['code','Kódformázás','</>']]){
          const button=document.createElement('button');button.type='button';button.textContent=glyph;button.dataset.mark=mark;button.title=label;
          button.setAttribute('aria-label',label);button.onpointerdown=event=>{rememberSelection();event.preventDefault()};
          button.onclick=()=>{
            const range=savedFormatSelection||getRichTextFormattingSelection(editor);
            const nativeSelection=window.getSelection();
            const hasNativeSelection=Boolean(nativeSelection?.rangeCount&&!nativeSelection.isCollapsed&&formattingSurface.contains(nativeSelection.anchorNode)&&formattingSurface.contains(nativeSelection.focusNode));
            if(!range&&!hasNativeSelection&&!savedSelectionOffsets){button.title='Előbb jelölj ki egy szövegrészt.';return}
            if(composing){button.title='Várd meg a mobilos szövegbevitel befejezését.';return}
            try{
              if(!range){
                const commands={bold:'bold',italic:'italic',underline:'underline',strikethrough:'strikeThrough',subscript:'subscript',superscript:'superscript'};
                if(!commands[mark])throw new Error('A több blokkra kiterjedő kódformázás még nem támogatott.');
                formattingSurface.focus();if(!hasNativeSelection&&savedSelectionOffsets)restoreSelectionOffsets(formattingSurface,savedSelectionOffsets);
                if(!document.execCommand(commands[mark],false,null))throw new Error('A böngésző nem tudta végrehajtani a formázást.');
                const doc=richTextEditorToDocument(formattingSurface);if(commitWithoutRender(doc)){renderRichTextEditor(editor,doc);rememberSelection();button.title=label+' alkalmazva';}return;
              }
              const doc=richTextEditorToDocument(editor),next=updateRichTextInlineMark(doc,range,mark);
              if(command('richtext.content.set',{nodeId:node.id,document:next},{render:false})){
                richTextDirty=false;renderRichTextEditor(editor,next);refreshCanvasRichText(next);if(savedSelectionOffsets)restoreSelectionOffsets(formattingSurface,savedSelectionOffsets);else if(range.blockIndex!==undefined)restoreRichTextBlockSelection(formattingSurface,range);rememberSelection();setStatus('Nem mentett módosítás');syncPublishControls();button.title=label+' alkalmazva';
              }
            }catch(e){button.title=e instanceof Error?e.message:String(e)}
          };
          characterTools.append(button);
        }
        const applyInlineStyle=(key,value)=>{
          const range=savedFormatSelection||getRichTextFormattingSelection(editor);if(!range){formatStatus.textContent='Előbb jelölj ki egy szövegrészt.';return false}
          try{const doc=richTextEditorToDocument(editor),next=updateRichTextInlineStyle(doc,range,key,value);if(command('richtext.content.set',{nodeId:node.id,document:next},{render:false})){richTextDirty=false;renderRichTextEditor(editor,next);refreshCanvasRichText(next);if(savedSelectionOffsets)restoreSelectionOffsets(formattingSurface,savedSelectionOffsets);else if(range.blockIndex!==undefined)restoreRichTextBlockSelection(formattingSurface,range);rememberSelection();setStatus('Nem mentett módosítás');syncPublishControls();return true}}catch(error){formatStatus.textContent=error instanceof Error?error.message:String(error)}return false
        };
        fontFamilySelect.onpointerdown=rememberSelection;fontFamilySelect.onchange=()=>applyInlineStyle('fontFamily',fontFamilySelect.value);
        fontSizeInput.onpointerdown=rememberSelection;fontSizeInput.oninput=()=>{fontSizeInput.dataset.pending='true'};fontSizeInput.onchange=()=>{const size=Number(fontSizeInput.value);delete fontSizeInput.dataset.pending;if(!Number.isInteger(size)||size<8||size>96){formatStatus.textContent='A betűméret 8 és 96 képpont között lehet.';return}applyInlineStyle('fontSize',`${size}px`)};
        fontSizeInput.onblur=()=>{if(fontSizeInput.dataset.pending==='true')fontSizeInput.onchange()};fontSizeInput.onkeydown=event=>{if(['Tab','Enter'].includes(event.key)&&fontSizeInput.dataset.pending==='true'){fontSizeInput.onchange();if(event.key==='Enter'){event.preventDefault();fontSizeInput.blur()}}};
        for(const [key,label] of [['color','Betűszín'],['backgroundColor','Kiemelés színe']]){
          const wrapper=document.createElement('label');wrapper.className='richtext-color-control';wrapper.title=label;
          const text=document.createElement('span');text.textContent=label;
          const input=document.createElement('input');input.type='color';input.value=key==='color'?'#243247':'#fff29a';input.setAttribute('aria-label',label);
          input.dataset.styleKey=key;input.onpointerdown=rememberSelection;input.onchange=()=>applyInlineStyle(key,input.value);
          wrapper.append(text,input);colorTools.append(wrapper);
        }
        formatStatus.textContent='Jelölj ki szavakat a vásznon vagy itt, majd formázd őket. Az alapstílus a Stílus fülön állítható.';
        formatStatus.classList.add('richtext-tool-help');toolbar.append(formatStatus);
        const helpDetails=document.createElement('details');helpDetails.className='richtext-editor-help';
        const helpSummary=document.createElement('summary');helpSummary.textContent='ⓘ Mit lehet itt szerkeszteni?';
        const helpContent=document.createElement('div');helpContent.innerHTML='<p><b>Bekezdés:</b> címsor, bekezdés, lista, idézet vagy kódblokk; a szöveg igazítása külön állítható.</p><p><b>Kijelölt szöveg:</b> félkövér, dőlt, aláhúzott/áthúzott, felső/alsó index, kód, betűcsalád és méret, szín, kiemelés és biztonságos hivatkozás.</p><p><b>Word és Excel:</b> a beillesztett szöveg, alapformázás, link, lista, egyszerű táblázat és cellaigazítás megmarad. A képek, megjegyzések, diagramok, egyesített cellák és a képletek működése nem része a szöveges importnak; a képlet nem fut le, legfeljebb a vágólapon látható értéke kerül be.</p><p>A beillesztés és a Mentés piszkozatot módosít. A webhely látogatói csak a külön <b>Publikálás</b> után látják.</p>';
        helpDetails.append(helpSummary,helpContent);toolbar.append(helpDetails);
        const linkControls=document.createElement('div');linkControls.className='richtext-link-controls';
        const url=document.createElement('input');url.type='url';url.placeholder='/p/home vagy https://...';
        url.setAttribute('aria-label','Hivatkozás címe');
        const addLink=document.createElement('button');addLink.type='button';addLink.textContent='Link beállítása';
        const removeLink=document.createElement('button');removeLink.type='button';removeLink.textContent='Link eltávolítása';
        const linkFeedback=document.createElement('small');linkFeedback.setAttribute('role','status');
        const changeLink=href=>{
          const range=savedLinkSelection||getRichTextBlockSelection(editor);
          if(!range){linkFeedback.textContent='Jelölj ki egy szövegrészt előbb.';return;}
          try{
            const doc=updateRichTextInlineLink(richTextEditorToDocument(editor),range,href);
            linkFeedback.textContent='';
            const offsets=getSelectionOffsets(formattingSurface);
            if(command('richtext.content.set',{nodeId:node.id,document:doc},{render:false})){
              richTextDirty=false;const temporary=document.createElement('div');renderRichTextEditor(temporary,doc);editor.replaceChildren(...temporary.childNodes);
              refreshCanvasRichText(doc);restoreSelectionOffsets(formattingSurface,offsets);setStatus('Nem mentett módosítás');syncPublishControls();rememberSelection();
            }
          }catch(e){linkFeedback.textContent=e instanceof Error?e.message:String(e)}
        };
        addLink.onclick=()=>changeLink(url.value);
        removeLink.onclick=()=>changeLink(null);
        editor.addEventListener('paste',event=>{
          event.preventDefault();
          try{
            const imported=normalizeRichText(importRichTextClipboard({html:event.clipboardData?.getData('text/html')||'',text:event.clipboardData?.getData('text/plain')||''}));
            if(!pasteRichTextDocument(editor,imported))throw new Error('A beillesztés helyét nem sikerült meghatározni.');
            editor.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertFromPaste'}));
            const tables=imported.blocks.filter(block=>block.type==='table').length;
            formatStatus.textContent=tables?'Táblázat beillesztve. Az Excel-képletek és makrók nem kerülnek át, csak a cellák megjelenített értékei.':'Biztonságos szövegformázás beillesztve. Képek, makrók és futtatható tartalom nem kerül át.';
            setStatus('Nem mentett módosítás');
          }catch(error){formatStatus.textContent=error instanceof Error?error.message:String(error)}
        });
        editor.addEventListener('input',()=>{richTextDirty=true;flushRichTextDraft=saveRich;savedLinkSelection=null;savedFormatSelection=null;savedSelectionOffsets=null;richTextBookmark=null;if(!composing)saveRich()});
        editor.addEventListener('focus',()=>{flushRichTextDraft=saveRich});
        editor.addEventListener('beforeinput',()=>{richTextDirty=true});
        editor.addEventListener('compositionstart',()=>{composing=true});
        editor.addEventListener('compositionupdate',()=>{composing=true});
        editor.addEventListener('compositionend',()=>{composing=false;richTextDirty=true;saveRich();requestAnimationFrame(rememberSelection)});
        document.addEventListener('selectionchange',selectionObserver);richTextSelectionCleanup=()=>document.removeEventListener('selectionchange',selectionObserver);
        editor.addEventListener('paste',()=>requestAnimationFrame(rememberSelection));
        editor.addEventListener('mouseup',rememberSelection);
        editor.addEventListener('keyup',rememberSelection);
        editor.addEventListener('touchend',()=>requestAnimationFrame(rememberSelection));
        editor.addEventListener('blur',event=>{
          if(richTextDirty&&!section.contains(event.relatedTarget))saveRich();
        });
        url.onfocus=()=>rememberSelection();
        linkControls.append(url,addLink,removeLink,linkFeedback);
        const clearFormat=document.createElement('button');clearFormat.type='button';clearFormat.textContent='Alapformázás';clearFormat.setAttribute('aria-label','Kijelölt szöveg formázásának törlése');clearFormat.title='Az elem alapstílusának visszaállítása a kijelölt szavakon. A szöveg és a linkek megmaradnak.';
        clearFormat.onpointerdown=event=>{rememberSelection();event.preventDefault()};
        clearFormat.onclick=()=>{const range=savedFormatSelection;if(!range){formatStatus.textContent='Előbb jelölj ki egy szövegrészt.';return}const doc=clearRichTextInlineFormatting(richTextEditorToDocument(editor),range);if(commitWithoutRender(doc)){renderRichTextEditor(editor,doc);if(savedSelectionOffsets)restoreSelectionOffsets(formattingSurface,savedSelectionOffsets);rememberSelection()}};
        characterTools.append(clearFormat);
        const scope=document.createElement('div');scope.className='richtext-scope-banner';scope.setAttribute('role','status');scope.textContent='Élő szöveg · kijelölt rész formázása';
        section.append(scope,editor,toolbar,linkControls);
        if(node.locked){toolbar.inert=true;linkControls.inert=true}
        requestAnimationFrame(()=>{if(editor.isConnected)refreshFormattingControls(null,editor)});
        inspector.append(section);
      }else if(textTypes.has(node.type))inspector.append(renderPlainTextEditor(node));
      
      if(node.type==='heading'){
        const levelField=document.createElement('label');levelField.className='field';levelField.append(document.createTextNode('Címsorszint'));
        const levelSelect=document.createElement('select');
        for(let level=1;level<=6;level++){const opt=document.createElement('option');opt.value=String(level);opt.textContent='H'+level;levelSelect.append(opt)}
        levelSelect.value=String(Number.isInteger(node.props?.level)?node.props.level:2);
        levelSelect.disabled=Boolean(node.locked);
        levelSelect.onchange=()=>command('element.update',{nodeId:node.id,patch:{props:{...(node.props||{}),level:Number(levelSelect.value)}}});
        levelField.append(levelSelect);inspector.append(levelField);
      }
      if(['button','link'].includes(node.type)){
        inspector.append(renderPropertyInput(getProperty('content.href'),'Link / URL',node.props?.href||'',v=>command('element.update',{nodeId:node.id,patch:{props:{...(node.props||{}),href:v}}})));
        const openNew=document.createElement('label');openNew.className='inspector-toggle';
        const checked=document.createElement('input');checked.type='checkbox';checked.checked=Boolean(node.props?.newWindow);checked.disabled=Boolean(node.locked);
        checked.onchange=()=>command('element.update',{nodeId:node.id,patch:{props:{...(node.props||{}),newWindow:checked.checked}}});
        openNew.append(checked,document.createTextNode('Megnyitás új lapon'));inspector.append(openNew);
      }
      else if(['badge','quote','icon'].includes(node.type)){
        const modify=patch=>command('element.update',{nodeId:node.id,patch:{props:{...(node.props||{}),...patch}}});
        if(node.type==='icon'){
          const row=document.createElement('label');row.className='field';row.append(document.createTextNode('Ikon kiválasztása'));
          const select=document.createElement('select');select.disabled=Boolean(node.locked);
          ICON_CHOICES.forEach(icon=>{const option=document.createElement('option');option.value=icon.id;option.textContent=icon.glyph+' '+icon.label;select.append(option)});
          select.value=iconById(node.props?.icon).id;select.onchange=()=>modify({icon:select.value,label:iconById(select.value).label});
          row.append(select);inspector.append(row);
          inspector.append(field('Ikon akadálymentes neve',node.props?.label||'',v=>modify({label:v})));
        }else{
          inspector.append(field(node.type==='quote'?'Idézet szövege':'Címke szövege',node.props?.text||'',v=>modify({text:v}),false,true));
          if(node.type==='quote')inspector.append(field('Forrás / szerző',node.props?.attribution||'',v=>modify({attribution:v})));
        }
      }
      else if(isStructuredType(node.type)){
        const content=renderStructuredInspector(node,model=>command('element.update',{nodeId:node.id,patch:{props:{...(node.props||{}),contentModel:model},metadata:{...(node.metadata||{}),structuredContentVersion:1}}}));
        if(content)inspector.append(content);
      }
      else if(['image','video','audio'].includes(node.type)){
        const setMedia=(patch)=>command('element.update',{nodeId:node.id,patch:{props:{...(node.props||{}),...patch}}});
        inspector.append(field('Média URL',node.props?.src??'',v=>setMedia({src:v.trim()})));
        if(node.type==='image'){
          inspector.append(field('Kép leírása (alt)',node.props?.alt??'',v=>setMedia({alt:v})));
          const fitLabel=document.createElement('label');fitLabel.className='field';fitLabel.append(document.createTextNode('Kép illesztése'));
          const fit=document.createElement('select');
          for(const [value,label] of [['cover','Kitöltés / vágás'],['contain','Teljes kép']]){const option=document.createElement('option');option.value=value;option.textContent=label;fit.append(option)}
          fit.value=node.props?.objectFit==='contain'?'contain':'cover';fit.onchange=()=>setMedia({objectFit:fit.value});fitLabel.append(fit);inspector.append(fitLabel);
          const decorative=document.createElement('label');decorative.className='inspector-toggle';
          const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=Boolean(node.accessibility?.decorative);
          checkbox.onchange=()=>command('element.update',{nodeId:node.id,patch:{accessibility:{...(node.accessibility||{}),decorative:checkbox.checked}}});
          decorative.append(checkbox,document.createTextNode('Csak díszítő kép (nem kell képleírás)'));inspector.append(decorative);
        }else{const hint=document.createElement('small');hint.textContent=node.type==='video'?'Közvetlen videófájl URL-je (pl. MP4), nem YouTube oldalhivatkozás.':'Közvetlen hangfájl URL-je (pl. MP3).';inspector.append(hint);}
      }
      else if(!textTypes.has(node.type))inspector.append(field('Tartalom',node.props?.content??'',v=>command('element.content.set',{nodeId:node.id,content:v})));
    }
  }else{
    inspector.append(renderRegistryInspector(node,'advanced'));
    const updateAccessibility=patch=>command('element.update',{nodeId:node.id,patch:{accessibility:{...(node.accessibility||{}),...patch}}});
    inspector.append(field('Hivatkozási azonosító (#)',node.accessibility?.anchorId||'',value=>{
      const id=value.trim();if(id&&!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(id)){setStatus('Az azonosító betűvel kezdődjön, betűt, számot, - és _ jelet tartalmazhat.');return}
      const current=page();const duplicate=Object.values(current?.nodes||{}).some(other=>other.id!==node.id&&other.accessibility?.anchorId===id&&Boolean(id));
      if(duplicate){setStatus('Az azonosító már létezik ezen az oldalon.');return}
      updateAccessibility({anchorId:id});
    }));
    inspector.append(field('Akadálymentes név',node.accessibility?.ariaLabel||'',value=>updateAccessibility({ariaLabel:value.slice(0,250)})));
    const help=document.createElement('small');help.textContent='A hivatkozási azonosítóhoz #azonosító formával készíthetsz belső linket. Az akadálymentes név a képernyőolvasóknak segít.';inspector.append(help);
    inspector.append(field('Node ID',node.id,()=>{},true),field('Típus',node.type,()=>{},true),field('Szülő ID',node.parentId||'',()=>{},true));
  }
  const actions=document.createElement('div');actions.className='inspector-actions';const del=document.createElement('button');del.type='button';del.className='danger-action';del.textContent='Törlés';del.disabled=node.id===page()?.rootId;del.title=del.disabled?'A gyökérelem nem törölhető':'Kijelölt elem törlése';del.onclick=()=>{if(!del.disabled)command('element.delete',{nodeId:node.id})};actions.append(del);inspector.append(actions);filterInspector();restoreScroll()
}
function clearHierarchyDrag(){hierarchyDrag.nodeId=null;hierarchyDrag.overId=null;document.querySelectorAll('.layer-row.drag-over,.layer-row.dragging').forEach(el=>el.classList.remove('drag-over','dragging'))}
function clearMobileHierarchyDrag(){clearTimeout(mobileHierarchyDrag.timer);mobileHierarchyDrag.active=false;mobileHierarchyDrag.timer=null;mobileHierarchyDrag.nodeId=null;mobileHierarchyDrag.overId=null;mobileHierarchyDrag.suppressClick=false;document.querySelectorAll('.layer-row.mobile-dragging,.layer-row.mobile-drag-over,.layer-drag-handle.armed').forEach(el=>el.classList.remove('mobile-dragging','mobile-drag-over','armed'))}
function isDescendant(current,nodeId,targetId){let cursor=getNode(current,targetId);while(cursor){if(cursor.id===nodeId)return true;cursor=cursor.parentId?getNode(current,cursor.parentId):null}return false}
function resolveLayerDrop(current,sourceId,targetId){const source=getNode(current,sourceId);const target=getNode(current,targetId);if(!source||!target||source.id===current.rootId||source.locked||target.locked||source.id===target.id)return null;if(isDescendant(current,sourceId,targetId))return null;if(canContain(target,source.type))return {type:'hierarchy.reparent',payload:{nodeId:sourceId,parentId:target.id,index:target.children?.length||0}};if(source.parentId!==target.parentId)return null;const parent=getNode(current,source.parentId);if(!parent)return null;let index=parent.children.indexOf(target.id);const sourceIndex=parent.children.indexOf(source.id);if(index<0||sourceIndex<0)return null;if(sourceIndex<index)index-=1;return {type:'hierarchy.reorder',payload:{nodeId:sourceId,index}}}
function handleLayerDragStart(id,event,row){const current=page();const node=current?getNode(current,id):null;if(!node||node.id===current?.rootId||node.locked){event.preventDefault();return}hierarchyDrag.nodeId=id;hierarchyDrag.overId=null;row.classList.add('dragging');if(event.dataTransfer){event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',id)}}
function handleLayerDragOver(id,event,row){const current=page();if(!hierarchyDrag.nodeId||!current){return}const action=resolveLayerDrop(current,hierarchyDrag.nodeId,id);if(!action){event.dataTransfer&&(event.dataTransfer.dropEffect='none');row.classList.remove('drag-over');return}event.preventDefault();hierarchyDrag.overId=id;if(event.dataTransfer)event.dataTransfer.dropEffect='move';document.querySelectorAll('.layer-row.drag-over').forEach(el=>el.classList.remove('drag-over'));row.classList.add('drag-over')}
function handleLayerDrop(id,event,row){event.preventDefault();const current=page();const sourceId=hierarchyDrag.nodeId;const action=sourceId&&current?resolveLayerDrop(current,sourceId,id):null;clearHierarchyDrag();if(action)command(action.type,action.payload)}
function handleMobileLayerDragStart(id,event,handle){if(event.pointerType!=='touch')return;event.preventDefault();event.stopPropagation();const current=page();const node=current?getNode(current,id):null;if(!node||node.id===current?.rootId||node.locked)return;clearMobileHierarchyDrag();mobileHierarchyDrag.nodeId=id;mobileHierarchyDrag.startX=event.clientX;mobileHierarchyDrag.startY=event.clientY;mobileHierarchyDrag.suppressClick=true;handle.classList.add('armed');mobileHierarchyDrag.timer=setTimeout(()=>{mobileHierarchyDrag.timer=null;mobileHierarchyDrag.active=true;const row=handle.closest('.layer-row');row?.classList.add('mobile-dragging')},450)}
function handleMobileLayerDragMove(event){if(event.pointerType!=='touch'||!mobileHierarchyDrag.nodeId)return;event.preventDefault();event.stopPropagation();const dx=Math.abs(event.clientX-mobileHierarchyDrag.startX);const dy=Math.abs(event.clientY-mobileHierarchyDrag.startY);if(!mobileHierarchyDrag.active){if(dx>10||dy>10){clearMobileHierarchyDrag();return}return}const row=document.elementFromPoint(event.clientX,event.clientY)?.closest('.layer-row');const targetId=row?.dataset.nodeId;const current=page();const action=current&&targetId?resolveLayerDrop(current,mobileHierarchyDrag.nodeId,targetId):null;document.querySelectorAll('.layer-row.mobile-drag-over').forEach(el=>el.classList.remove('mobile-drag-over'));if(action){mobileHierarchyDrag.overId=targetId;row.classList.add('mobile-drag-over')}else mobileHierarchyDrag.overId=null}
function handleMobileLayerDragEnd(event){if(event.pointerType!=='touch')return;event.preventDefault();event.stopPropagation();const current=page();const sourceId=mobileHierarchyDrag.nodeId;const targetId=mobileHierarchyDrag.overId;const action=current&&sourceId&&targetId?resolveLayerDrop(current,sourceId,targetId):null;const wasActive=mobileHierarchyDrag.active;clearMobileHierarchyDrag();if(wasActive&&action){event.preventDefault();command(action.type,action.payload)}}
function renderLayers(){const root=$('#layersTree');const current=page();if(!root||!current)return;root.replaceChildren();const walk=(id,depth=0)=>{const node=getNode(current,id);if(!node)return;const row=document.createElement('button');row.type='button';row.dataset.nodeId=id;row.draggable=node.id!==current.rootId&&!node.locked;row.className=`layer-row ${state.selection.primaryId===id?'active':''} ${node.locked?'locked':''}`;row.style.paddingLeft=`${8+depth*14}px`;row.innerHTML=`<span class="layer-caret">${node.children?.length?'▸':'·'}</span><strong>${escapeHtml(node.name||node.type)}</strong><small>${escapeHtml(node.type)}</small><span class="layer-drag-handle" role="button" tabindex="-1" aria-label="Elem mozgatása">⠿</span>${node.locked?'<span class="layer-lock" title="Zárolt elem" aria-label="Zárolt elem">🔐</span>':''}`;const handle=row.querySelector('.layer-drag-handle');row.ondragstart=e=>handleLayerDragStart(id,e,row);row.ondragover=e=>handleLayerDragOver(id,e,row);row.ondrop=e=>handleLayerDrop(id,e,row);row.ondragend=()=>clearHierarchyDrag();handle?.addEventListener('pointerdown',e=>handleMobileLayerDragStart(id,e,handle));handle?.addEventListener('pointermove',e=>handleMobileLayerDragMove(e));handle?.addEventListener('pointerup',e=>handleMobileLayerDragEnd(e));handle?.addEventListener('pointercancel',e=>clearMobileHierarchyDrag());row.onpointerdown=e=>{if(e.pointerType==='touch'){e.stopPropagation();handleMobilePointerDown(id,e)}};row.onpointermove=e=>{if(e.pointerType==='touch')handleMobilePointerMove(e)};row.onpointerup=e=>{if(e.pointerType==='touch'){e.stopPropagation();handleMobilePointerUp(id,e)}};row.onpointercancel=e=>{if(e.pointerType==='touch')handleMobilePointerCancel(e)};row.onclick=e=>{e.stopPropagation();if(mobileTouch.active&&mobileTouch.suppressClick){mobileTouch.suppressClick=false;return}selectNodeInteraction(id,e)};root.append(row);for(const child of node.children||[])walk(child,depth+1)};walk(current.rootId)}
function syncPublishControls(){const current=page();const meta=current&&pages.find(x=>x.id===current.id);const published=Boolean(meta?.isPublished);const dirty=Boolean(state?.persistence?.dirty);const draftAhead=published&&(Boolean(meta?.hasUnpublishedChanges)||Number(meta?.publishedRevisionVersion??0)<Number(meta?.revision??0));const publishLabel=published?(dirty||draftAhead?'Újrapublikálás':'Publikálva'):'Publikálás';const publishDisabled=!current||(!dirty&&!draftAhead&&published);const publish=$('#publish'),unpublish=$('#unpublish'),mobilePublish=$('#mobilePublish'),mobileUnpublish=$('#mobileUnpublish');if(publish){publish.textContent=publishLabel;publish.disabled=publishDisabled}if(unpublish)unpublish.hidden=!published;if(mobilePublish){mobilePublish.textContent=publishLabel;mobilePublish.disabled=publishDisabled}if(mobileUnpublish)mobileUnpublish.hidden=!published}
function renderRevisionPanel(){const root=$('#revisionList');if(!root)return;root.replaceChildren();if(!revisionHistory.length){const empty=document.createElement('div');empty.className='revision-empty';empty.textContent='Nincs korábbi revision.';root.append(empty);return}for(const rev of revisionHistory){const row=document.createElement('div');row.className='revision-row';const info=document.createElement('div');info.className='revision-info';const title=document.createElement('strong');title.textContent=`v${rev.version}`;const note=document.createElement('span');note.textContent=rev.note||'Editor mentés';const date=document.createElement('small');date.textContent=rev.created_at?new Date(rev.created_at).toLocaleString('hu-HU'):'—';info.append(title,note,date);const button=document.createElement('button');button.type='button';button.className='revision-restore';button.textContent='Visszaállítás';button.disabled=Number(rev.version)===Number(page()?.revision||0);button.title=button.disabled?'Ez az aktuális revision':'Ezt a revisiont állítja vissza új revisionként';button.onclick=()=>rollbackToRevision(Number(rev.version));row.append(info,button);root.append(row)}}
function renderPageList(){const select=$('#pageSelect'),list=$('#pageList');select.replaceChildren();list.replaceChildren();const ordered=[...pages].sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0));pages=ordered;for(const item of pages){const option=document.createElement('option');option.value=item.id;option.textContent=(item.parentPageId?'↳ ':'')+(item.title||item.slug);option.selected=item.id===page()?.id;select.append(option);const row=document.createElement('div');row.className='page-row '+(item.id===page()?.id?'active':'');const selectButton=document.createElement('button');selectButton.type='button';selectButton.className='page-row-select';selectButton.innerHTML='<span class="page-icon">▧</span><strong>'+escapeHtml(item.title||item.slug)+'</strong><small class="page-meta">'+(item.isPublished?(item.hasUnpublishedChanges?'ÉLŐ · MÓDOSÍTOTT PISZKOZAT':'ÉLŐ'):'PISZKOZAT')+(item.parentPageId?' · Szülő: '+escapeHtml(pages.find(p=>p.id===item.parentPageId)?.title||'ismeretlen'):'')+(item.isPublished&&item.publishedSlug&&item.slug!==item.publishedSlug?' · ÉLŐ URL: /p/'+escapeHtml(item.publishedSlug):'')+'</small>';selectButton.onclick=()=>loadPage(item.id).catch(showError);const upButton=document.createElement('button');upButton.type='button';upButton.className='page-order';upButton.textContent='↑';upButton.title='Oldal feljebb';upButton.setAttribute('aria-label','Oldal feljebb');upButton.disabled=(item.sortOrder??0)<=0;upButton.onclick=e=>{e.stopPropagation();movePage(item.id,-1).catch(showError)};const downButton=document.createElement('button');downButton.type='button';downButton.className='page-order';downButton.textContent='↓';downButton.title='Oldal lejjebb';downButton.setAttribute('aria-label','Oldal lejjebb');downButton.disabled=item===pages[pages.length-1];downButton.onclick=e=>{e.stopPropagation();movePage(item.id,1).catch(showError)};const editButton=document.createElement('button');editButton.type='button';editButton.className='page-edit';editButton.textContent='✎';editButton.title='Oldal beállításai: '+(item.title||item.slug);editButton.setAttribute('aria-label','Oldal beállításai: '+(item.title||item.slug));editButton.onclick=e=>{e.stopPropagation();editPageMeta(item.id).catch(showError)};const duplicateButton=document.createElement('button');duplicateButton.type='button';duplicateButton.className='page-duplicate';duplicateButton.textContent='⧉';duplicateButton.title='Oldal másolása: '+(item.title||item.slug);duplicateButton.setAttribute('aria-label','Oldal másolása: '+(item.title||item.slug));duplicateButton.onclick=e=>{e.stopPropagation();duplicatePage(item.id)};const deleteButton=document.createElement('button');deleteButton.type='button';deleteButton.className='page-delete';deleteButton.textContent='×';deleteButton.title='Oldal törlése: '+(item.title||item.slug);deleteButton.setAttribute('aria-label','Oldal törlése: '+(item.title||item.slug));deleteButton.onclick=e=>{e.stopPropagation();deletePage(item.id)};const actions=document.createElement('div');actions.className='page-row-actions';actions.setAttribute('aria-label','Oldal műveletei');const archiveButton=document.createElement('button');archiveButton.type='button';archiveButton.textContent='Archiválás';archiveButton.setAttribute('aria-label','Oldal archiválása: '+(item.title||item.slug));archiveButton.onclick=e=>{e.stopPropagation();changePageArchive(item.id,true).catch(showError)};const parentButton=document.createElement('button');parentButton.type='button';parentButton.textContent='Szülő';parentButton.title='Szülőoldal beállítása: '+(item.title||item.slug);parentButton.setAttribute('aria-label',parentButton.title);parentButton.onclick=e=>{e.stopPropagation();editPageParent(item.id).catch(showError)};actions.append(upButton,downButton,editButton,parentButton,duplicateButton,archiveButton,deleteButton);row.append(selectButton,actions);list.append(row)}if(archivedPages.length){const heading=document.createElement('h3');heading.textContent='Archivált oldalak';list.append(heading);for(const item of archivedPages){const row=document.createElement('div');row.className='page-row';const title=document.createElement('strong');title.textContent=item.title||item.slug;const restore=document.createElement('button');restore.type='button';restore.textContent='Visszaállítás piszkozatként';restore.setAttribute('aria-label','Oldal visszaállítása piszkozatként: '+(item.title||item.slug));restore.onclick=()=>changePageArchive(item.id,false).catch(showError);row.append(title,restore);list.append(row)}}}
function focusScheduleNode(){
  const current=page();
  if(!current)return false;
  const node=Object.values(current.nodes||{}).find(item=>item.type===NODE_TYPES.SCHEDULE);
  if(!node){setStatus('Nincs Adásrend elem az oldalon');return false}
  execute(state,{type:'selection.set',payload:{ids:[node.id],primaryId:node.id}});
  inspectorTab='design';
  document.querySelectorAll('.inspector-tabs button').forEach((button,index)=>button.classList.toggle('active',index===0));
  render();
  document.querySelector('#schedulePanelStatus')?.replaceChildren(document.createTextNode(`Kijelölve: ${node.name||'Adásrend'}`));
  window.sanciEditor?.openPanel?.('right');
  return true;
}
function render(){
  if(flushRichTextDraft?.()===false)return false;
  if(inlineEditingId&&state?.selection?.primaryId!==inlineEditingId)inlineEditingId=null;
  syncMobileMultiSelectUI();syncPublishControls();renderCanvas();renderInspector();renderLayers();renderRevisionPanel();
  if(state){$('#selection').textContent=`Kijelölés: ${state.selection.primaryId||'—'}`;$('#revision').textContent=`Revision: ${page()?.revision??0}`;setStatus(state.persistence.dirty?'Nem mentett módosítás':'Mentve')}
  const schedule=state?Object.values(page()?.nodes||{}).find(node=>node.type===NODE_TYPES.SCHEDULE):null;
  const scheduleStatus=$('#schedulePanelStatus');
  if(scheduleStatus)scheduleStatus.textContent=schedule?(state?.selection?.primaryId===schedule.id?`Kijelölve: ${schedule.name||'Adásrend'}`:'Adásrend elem elérhető — kattints a kiválasztáshoz.'):'Nincs Adásrend elem ezen az oldalon.';
}
function showError(e){const message=e instanceof Error?e.message:String(e);diagnostics.add({source:'ui',code:'SANCI-UI-E001',message,error:e});setStatus('Hiba');window.__sanciEditorBoot?.fail(message,e);alert(message)}
async function movePage(id,delta){const item=pages.find(x=>x.id===id);if(!item)return;const target=(item.sortOrder??0)+delta;if(target<0||target>=pages.length)return;setStatus('Oldalsorrend frissítése…');try{const result=await api('/api/admin/pages',{method:'PATCH',body:JSON.stringify({id,sortOrder:target})});const updated=result.data;if(updated){const index=pages.findIndex(x=>x.id===id);if(index>=0)pages[index]={...pages[index],...updated};}await loadPages();setStatus('Mentve')}catch(e){showError(e)}}
async function editPageMeta(id){if(flushRichTextDraft?.()===false)return;if(state?.persistence?.saving){alert('Várd meg a folyamatban lévő mentést.');return}if(page()?.id===id&&state?.persistence?.dirty){alert('Először mentsd az aktuális módosításokat, majd módosítsd az oldal beállításait.');return}const meta=pages.find(x=>x.id===id);if(!meta)return;const title=prompt('Oldal neve',meta.title||'');if(title===null)return;const trimmedTitle=title.trim();if(!trimmedTitle)return alert('Az oldal neve nem lehet üres.');const suggested=String(trimmedTitle).toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const slug=prompt('Slug (az új URL csak külön publikálás után lesz élő)',meta.slug||suggested);if(slug===null)return;const trimmedSlug=slug.trim().toLowerCase();if(!trimmedSlug)return alert('A slug nem lehet üres.');setStatus('Oldal frissítése…');try{const result=await api('/api/admin/pages',{method:'PATCH',body:JSON.stringify({id,title:trimmedTitle,slug:trimmedSlug,expectedVersion:Number(meta.revision||0)})});const updated=result.data;if(updated){const i=pages.findIndex(x=>x.id===id);if(i>=0)pages[i]={...pages[i],...updated,content:updated.content||pages[i].content};}renderPageList();if(page()?.id===id&&updated?.content){state=createEditorState(updated.content);state.document.revision=Number(updated.revision||0);markSaved(state,state.document.revision);render();}setStatus('Mentve')}catch(e){showError(e)}}
async function duplicatePage(id){if(flushRichTextDraft?.()===false)return;const meta=pages.find(x=>x.id===id);if(!meta)return;if(page()?.id===id&&state?.persistence?.dirty){alert('Először mentsd az aktuális módosításokat, majd készíts másolatot.');return}const title=prompt('Másolat neve',`${meta.title||meta.slug} másolata`);if(title===null)return;const trimmedTitle=title.trim();if(!trimmedTitle)return alert('Az oldal neve nem lehet üres.');const suggested=trimmedTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const slug=prompt('A másolat piszkozatának slugja',suggested);if(slug===null)return;const trimmedSlug=slug.trim().toLowerCase();if(!trimmedSlug)return alert('A slug nem lehet üres.');setStatus('Oldal másolása…');try{const result=await api('/api/admin/pages',{method:'POST',body:JSON.stringify({sourcePageId:id,title:trimmedTitle,slug:trimmedSlug})});const copy=result.data;if(!copy?.id)throw new Error('A másolat válasza hiányos.');await loadPages();await loadPage(copy.id);setStatus('Másolat piszkozatként létrehozva')}catch(e){showError(e)}}
async function editPageParent(id){
  const item=pages.find(p=>p.id===id);if(!item)return;
  const descendants=new Set([id]);let changed=true;while(changed){changed=false;for(const candidate of pages)if(!descendants.has(candidate.id)&&descendants.has(candidate.parentPageId)){descendants.add(candidate.id);changed=true}}const options=[{id:null,title:'Gyökéroldal'},...pages.filter(p=>!descendants.has(p.id)).map(p=>({id:p.id,title:p.title||p.slug}))];
  const lines=options.map((p,index)=>`${index}. ${p.title}${p.id===item.parentPageId?' (jelenlegi)':''}`).join('\n');
  const answer=prompt(`Szülőoldal: ${item.title||item.slug}\nVálassz számot. A módosítás piszkozat; az élő kapcsolat csak külön publikáláskor változik.\n${lines}`,String(options.findIndex(p=>p.id===item.parentPageId)));
  if(answer===null)return;const index=answer.trim()===''?NaN:Number(answer.trim());if(!Number.isInteger(index)||index<0||index>=options.length){alert('Érvénytelen szülőoldal.');return}
  const parentPageId=options[index].id;if(parentPageId===item.parentPageId)return;
  const result=await api('/api/admin/pages',{method:'PATCH',body:JSON.stringify({action:'setParent',id,parentPageId,expectedParentPageId:item.parentPageId??null})});
  await loadPages();setStatus('Szülőoldal piszkozat mentve');
}
async function changePageArchive(id,archive){if(flushRichTextDraft?.()===false)return;
 if(state?.persistence?.saving){alert('Várd meg a folyamatban lévő mentést.');return}
 if(state?.persistence?.dirty){alert('Először mentsd az aktuális módosításokat.');return}
 const item=(archive?pages:archivedPages).find(x=>x.id===id);if(!item)return;
 if(!confirm(archive?`Archiválod a(z) „${item.title||item.slug}” oldalt? A nyilvános oldal nem lesz elérhető; később piszkozatként visszaállítható.`:'Visszaállítod az oldalt piszkozatként? Nem kerül automatikusan publikálásra.'))return;
 await api('/api/admin/pages',{method:'PATCH',body:JSON.stringify({id,action:archive?'archive':'restore'})});
 if(archive&&page()?.id===id){state=null;revisionHistory=[];rememberPageId(null)}
 await loadPages();setStatus(archive?'Oldal archiválva':'Oldal visszaállítva — piszkozat');
}
async function deletePage(id){if(flushRichTextDraft?.()===false)return;if(page()?.id===id&&state?.persistence?.dirty){alert('Először mentsd az aktuális módosításokat, majd töröld az oldalt.');return}const meta=pages.find(x=>x.id===id);if(!meta)return;if(!confirm(`Biztosan törlöd ezt az oldalt?\\n\\n${meta.title||meta.slug}\\n\\nEz a művelet az oldal szerveroldali tartalmát is törli.`))return;const wasCurrent=page()?.id===id;setStatus('Oldal törlése…');try{await api('/api/admin/pages',{method:'DELETE',body:JSON.stringify({id})});if(wasCurrent)state=null;await loadPages();if(!state&&pages.length===0)setStatus('Nincs oldal');else setStatus('Mentve')}catch(e){showError(e)}}
async function loadPages(){setStatus('Oldalak betöltése…');const data=await api('/api/admin/pages');if(!Array.isArray(data.data))throw new Error('Hibás oldallistázó válasz');const archiveData=await api('/api/admin/pages?archived=1&meta=1');if(!Array.isArray(archiveData.data))throw new Error('Hibás archívum-válasz');pages=data.data;archivedPages=archiveData.data;renderPageList();const initialId=initialPageId(requestedPageId(),pages);if(!state&&initialId)await loadPage(initialId);else if(state){renderPageList();render();setStatus(state.persistence.dirty?'Nem mentett módosítás':'Mentve')}else{rememberPageId(null);setStatus('Nincs oldal')}}
async function loadPage(id,{discardConfirmed=false}={}){
  if(flushRichTextDraft?.()===false)return;
  if(state?.persistence?.dirty&&!discardConfirmed&&!confirm('Nem mentett módosítások vannak. Elveted őket az oldal betöltésével?')){renderPageList();return;}
  setStatus('Oldal betöltése…');const meta=pages.find(x=>x.id===id);if(!meta)throw new Error('Az oldal nem található.');const data=await api('/api/admin/editor?pageId='+encodeURIComponent(id));const document=data?.data?.page?.document||meta.content;const revisions=Array.isArray(data?.data?.revisions)?data.data.revisions:[];if(!canonical(document,id))throw new Error(`Az oldal (${meta.title||meta.slug}) nem canonical Editor v2 dokumentum.`);const rawRevision=revisions.length?Number(revisions[0]?.version):0;if(!Number.isInteger(rawRevision)||rawRevision<0)throw new Error('Hibás revision-válasz: a szerver revision-száma nem érvényes.');revisionHistory=revisions;const latestRevision=rawRevision;meta.revision=latestRevision;meta.publishedRevisionId=data?.data?.page?.publishedRevisionId??meta.publishedRevisionId??null;meta.publishedRevisionVersion=meta.publishedRevisionId?Number(revisions.find(rev=>rev.id===meta.publishedRevisionId)?.version||0):0;document.revision=latestRevision;document.pages[id].revision=latestRevision;state=createEditorState(document);markSaved(state,latestRevision);rememberPageId(id);renderPageList();render();setStatus('Mentve')}
async function rollbackToRevision(version){const current=page();const meta=current&&pages.find(x=>x.id===current.id);const latest=Number(revisionHistory[0]?.version||meta?.revision||0);if(!current||!meta||!Number.isInteger(version)||version<1)return;if(version===latest){return}if(!confirm(`Biztosan visszaállítod a(z) v${version} revisiont?\n\nA jelenlegi draft nem vész el véglegesen: a visszaállítás új revisionként jön létre.`))return;setStatus(`v${version} visszaállítása…`);try{await api('/api/admin/editor?pageId='+encodeURIComponent(current.id),{method:'PUT',body:JSON.stringify({pageId:current.id,version,expectedVersion:latest})});await loadPage(current.id,{discardConfirmed:true});setStatus(`v${version} visszaállítva`)}catch(e){showError(e)}}
async function createNew(){if(flushRichTextDraft?.()===false)return;if(state?.persistence?.dirty){alert('Először mentsd az aktuális módosításokat, majd hozz létre új oldalt.');return}const title=prompt('Új oldal neve','Új oldal');if(!title)return;const slug=prompt('Slug',title.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));if(!slug)return;const p=createPage({name:title,slug});await api('/api/admin/pages',{method:'POST',body:JSON.stringify({id:p.id,title,slug,description:'',document:createDocument(p)})});await loadPages();await loadPage(p.id)}
async function save(publish=false){if(state?.persistence?.saving){setStatus('Mentés folyamatban…');return;}if(flushRichTextDraft?.()===false){setStatus('Rich Text mentési hiba');return;}const current=page();if(!current)return;const meta=pages.find(x=>x.id===current.id);if(!meta)return;const stateAtStart=state;const pageId=current.id;const submittedDocument=structuredClone(stateAtStart.document);const submittedJson=JSON.stringify(submittedDocument);const expectedVersion=Number(meta.revision??stateAtStart.document.revision??0);setStatus(publish?'Publikálás…':'Mentés…');stateAtStart.persistence.saving=true;try{const result=await api(`/api/admin/editor?pageId=${encodeURIComponent(pageId)}`,{method:'POST',body:JSON.stringify({pageId,document:submittedDocument,publish,expectedVersion,expectedParentPageId:meta.parentPageId??null,note:publish?'Editor v2 publikálás':'Editor v2 mentés'})});const version=Number(result?.data?.version);if(result?.data?.pageId!==pageId||!Number.isInteger(version)||version<1)throw new Error('A mentés válasza hiányos vagy hibás revision-adatot tartalmaz; a helyi módosításokat nem jelöltük mentettnek.');const unchanged=state===stateAtStart&&JSON.stringify(stateAtStart.document)===submittedJson;stateAtStart.document.revision=version;if(stateAtStart.document.pages?.[pageId])stateAtStart.document.pages[pageId].revision=version;meta.revision=version;if(unchanged){markSaved(stateAtStart,version)}else{stateAtStart.persistence.saving=false;stateAtStart.persistence.dirty=true;stateAtStart.persistence.error=null;stateAtStart.persistence.lastSavedRevision=version}stateAtStart.persistence.conflict=null;const panel=$('#revisionConflict');if(panel&&state===stateAtStart)panel.hidden=true;const i=pages.findIndex(x=>x.id===pageId);if(i>=0){const previous=pages[i];pages[i]={...previous,content:submittedDocument,isPublished:publish||Boolean(previous.isPublished),hasUnpublishedChanges:!publish&&Boolean(previous.isPublished),publishedRevisionId:publish?result.data.revisionId:previous.publishedRevisionId,publishedParentPageId:publish?previous.parentPageId:previous.publishedParentPageId,publishedSlug:publish?previous.slug:previous.publishedSlug,publishedRevisionVersion:publish?version:Number(previous.publishedRevisionVersion??0),revision:version};}renderPageList();if(state===stateAtStart){render();setStatus(unchanged?(publish?'Publikálva':(pages.find(x=>x.id===pageId)?.isPublished?'Mentve — a nyilvános oldal változatlan':'Mentve')):'A mentett verzió elkészült; további helyi módosítások még nincsenek mentve')}return result}catch(e){stateAtStart.persistence.saving=false;stateAtStart.persistence.dirty=true;stateAtStart.persistence.error=e instanceof Error?e.message:String(e);if(state===stateAtStart&&e?.status===409&&e?.code==='REVISION_CONFLICT'){showRevisionConflict(e,pageId);return}if(state===stateAtStart){setStatus('Mentési hiba');alert(stateAtStart.persistence.error)}return}}
async function unpublishPage(){const current=page();const meta=current&&pages.find(x=>x.id===current.id);if(!current||!meta?.isPublished)return;if(!confirm('Biztosan visszavonod ennek az oldalnak a publikálását?'))return;setStatus('Publikálás visszavonása…');try{const result=await api('/api/admin/editor?pageId='+encodeURIComponent(current.id),{method:'POST',body:JSON.stringify({pageId:current.id,action:'unpublish'})});const i=pages.findIndex(x=>x.id===current.id);if(i>=0)pages[i]={...pages[i],isPublished:Boolean(result.data?.published),hasUnpublishedChanges:false};renderPageList();render();setStatus('Publikálás visszavonva')}catch(e){showError(e)}}
function setDevice(device){if(!state)return;state.viewport.device=device;zoom=device==='desktop'?1:Math.max(.35,Math.min(1,(canvas.clientWidth-48)/sizes[device]));render();canvas.scrollTo({left:0,top:0,behavior:'instant'})}
document.addEventListener('DOMContentLoaded',()=>{
 diagnostics.init();
 window.__sanciEditorDiagnostics=diagnostics;
 window.__sanciEditorBoot?.started();
 $('#elementSearch').oninput=e=>renderPalette(e.target.value);
 $('#scheduleSelectNode').onclick=()=>focusScheduleNode();
 $('#newPage').onclick=()=>createNew().catch(showError);$('#newPagePanel').onclick=()=>createNew().catch(showError);
 $('#pageSelect').onchange=e=>loadPage(e.target.value).catch(showError);
 $('#exportConflictDraft').onclick=()=>exportConflictDraft();$('#reloadConflictPage').onclick=()=>reloadLatestAfterConflict();
 $('#save').onclick=()=>save(false);$('#publish').onclick=()=>save(true);$('#unpublish').onclick=()=>unpublishPage().catch(showError);$('#mobilePublish').onclick=()=>save(true);$('#mobileUnpublish').onclick=()=>unpublishPage().catch(showError);
 $('#preview').onclick=()=>{const p=page();if(p)window.open(`/p/${encodeURIComponent(p.slug)}?preview=1`,'_blank','noopener,noreferrer')};
 $('#undo').onclick=()=>{if(state&&flushRichTextDraft?.()!==false){try{execute(state,{type:'history.undo'});render()}catch(e){showError(e)}}};$('#redo').onclick=()=>{if(state&&flushRichTextDraft?.()!==false){try{execute(state,{type:'history.redo'});render()}catch(e){showError(e)}}};
 $('#zoomIn').onclick=()=>changeCanvasZoom(Math.min(1.5,zoom+.1));$('#zoomOut').onclick=()=>changeCanvasZoom(Math.max(.35,zoom-.1));$('#fitCanvas').onclick=fitCanvasToViewport;
 $('#selectTool').onclick=()=>{$('#selectTool').classList.add('active');$('#panTool').classList.remove('active');canvas.style.cursor='default'};$('#groupSelection').onclick=()=>{if(!$('#groupSelection').disabled)command('hierarchy.group')};$('#ungroupSelection').onclick=()=>{if(!$('#ungroupSelection').disabled)command('hierarchy.ungroup')};$('#mobileGroup').onclick=()=>{if(!$('#mobileGroup').disabled)command('hierarchy.group')};$('#mobileUngroup').onclick=()=>{if(!$('#mobileUngroup').disabled)command('hierarchy.ungroup')};$('#mobileMultiDone').onclick=()=>finishMobileMultiSelect();$('#mobileMultiCancel').onclick=()=>cancelMobileMultiSelect();$('#panTool').onclick=()=>{$('#panTool').classList.add('active');$('#selectTool').classList.remove('active');canvas.style.cursor='grab'};
 document.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>setDevice(b.dataset.device));
 canvas.addEventListener('click',event=>{
   if(event.target.closest('.node')) return;
   if(state) { command('selection.clear'); }
 });
 document.querySelectorAll('.inspector-tabs button').forEach(b=>b.addEventListener('click',()=>{if(flushRichTextDraft?.()===false)return;const names=['design','content','advanced'];inspectorTab=names[[...document.querySelectorAll('.inspector-tabs button')].indexOf(b)]||'design';document.querySelectorAll('.inspector-tabs button').forEach(x=>x.classList.toggle('active',x===b));renderInspector()}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobileTouch.active){e.preventDefault();cancelMobileMultiSelect();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();save(false)}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();if(state&&flushRichTextDraft?.()!==false){execute(state,{type:e.shiftKey?'history.redo':'history.undo'});render()}}});
 renderPalette();loadTwitchConnection();loadPages().then(()=>window.__sanciEditorBoot?.ready()).catch(showError);
});
