Warning: truncated output (original token count: 61104)
Total output lines: 2348

import {hasContentProfile} from './core/content-profiles.js?v=20261025-inspector-lifecycle-contract';
import {getNode,getChildren,NODE_TYPES,canContain,normalizeRichText} from './core/schema.js?v=20261125-edt016-child-reference-limit-v1';
import {instantiateEditorTemplate,listEditorTemplates} from './core/editor-templates.js?v=20261125-edt016-child-reference-limit-v1';
import {createEditorState,activePage,selectedNodes,setSelection,markSaved} from './core/state.js?v=20261125-edt016-child-reference-limit-v1';
import {execute,executeCoalesced,executeBatch} from './core/commands.js?v=20261125-edt016-child-reference-limit-v1';
import {applyNodeStyle,getNodeGeometry,resolveNodeStyle} from './core/canvas-engine.js?v=20261123-edt040-in-view-motion-v1';
import {motionTriggerForStyle} from './core/motion-style.js?v=20261123-edt040-in-view-motion-v1';
import {computeCanvasMinHeight} from './core/canvas-extent.js';
import {measureCanvasWorkspace} from './core/canvas-workspace.js';
import {hasResponsiveOverride,resolveResponsiveValue} from './core/responsive.js?v=20261122-edt024-responsive-prototype-safety-v1';
import {getNodeVisibilityState,isVisibleOnDevice} from './core/visibility.js';
import {diagnostics} from './diagnostics.js?v=20261119-edt042-safe-export-v2';
import {plainTextToRichText,renderRichTextEditor,richTextEditorToDocument,restoreSelectionOffsets,getSelectionOffsets,transformRichTextBlockTypes} from './core/richtext-engine.js?v=20261117-d03-invalid-media-id-guidance-v1';
import {renderSchedulePreview} from './core/schedule-preview.js';
import {normalizeScheduleConfig,SCHEDULE_MODES,SCHEDULE_ORDERS,SCHEDULE_STATUSES,SCHEDULE_EMPTY_TEXT_MAX,SCHEDULE_LIMIT_MAX} from './core/schedule-schema.js';
import {listPropertyGroups,listProperties,getProperty} from './core/property-registry.js?v=20261123-edt040-in-view-motion-v1';
import {renderPropertyInput} from './ui/property-controls.js?v=20261101-richtext-multiblock-links';
import {getInspectorValueContract,normalizeInspectorValue} from './core/property-values.js';
import {describeResponsiveOrigin} from './ui/responsive-origin.js';
import {responsiveGroupResetActions} from './ui/responsive-group-reset.js';
import {normalizePaletteFavoriteTypes,readPaletteFavoriteTypes,togglePaletteFavoriteType,writePaletteFavoriteTypes} from './ui/palette-preferences.js?v=20261121-edt044-account-preferences-v1';
import {getRichTextBlockSelection,getRichTextFormattingSelection,getRichTextBlockTransformSelection,getRichTextActiveBlockIndex,restoreRichTextBlockSelection,restoreRichTextFormattingSelection,updateRichTextInlineLink,updateRichTextInlineMark,updateRichTextInlineStyle,updateRichTextBlockAlignment} from './core/richtext-links.js?v=20261117-d03-invalid-media-id-guidance-v1';
import {initialPageId,rememberPageId,requestedPageId} from './core/page-url.js';
import {getElementCapability} from './core/capability-matrix.js?v=20261123-edt040-in-view-motion-v1';
import {renderFormsInspector} from './ui/forms-inspector.js?v=20261125-form-inspector-v1';
import {firstUnsupportedPublicationNode,unsupportedPublicationMessage} from './core/publication-recovery.js?v=20261124-edt042-publish-recovery-safe-label-v1';
import {renderGeometryPresets} from './ui/geometry-presets.js';
import {importRichTextClipboard} from './core/richtext-import.js?v=20261125-edt016-child-reference-limit-v1';
import {pasteRichTextDocument} from './core/richtext-paste.js?v=20261117-d03-invalid-media-id-guidance-v1';
import {createNodeClipboard,isNodeClipboardForPage} from './core/node-clipboard.js?v=20261118-edt038-node-clipboard-v1';
import {captureStyleSnapshot,STYLE_SNAPSHOT_PROPERTIES} from './core/style-snapshot.js';
import {LAYOUT_PRESETS,LAYOUT_TYPES,layoutMode,isManagedLayout,isLayoutPropertyRelevant,explicitGridColumnCount} from './core/layout-presets.js';
import {resolveElementInsertion} from './core/element-insertion.js';
import {TYPOGRAPHY_PRESETS,typographyPresetPatch} from './core/typography-presets.js';
import {isStructuredType,createElementContent,normalizeElementContent,renderElementContent,activateStructuredContent} from './core/element-content.js?v=20261125-d06-structured-accordion-behavior-v1';
import {legacyImageSource,legacyPlayableSource,legacyPlaybackSettings,legacyImagePresentation,legacyImageCaption,applyReducedMotionVideoPlayback} from './core/legacy-media-source.js?v=20261125-forms-service-v1';
import {renderStructuredInspector} from './ui/structured-inspector.js?v=20261125-d06-structured-accordion-behavior-v1';
import {ICON_CHOICES,iconById} from './core/icon-options.js';
import {DIVIDER_LINE_STYLES,normalizeDividerStyle} from './core/decorative-elements.js';
import {defaultCardContent,cardImageSrc} from './core/card-content.js?v=20261118-d02-card-cta-recovery-v1';
import {defaultCountdownContent,renderCountdownContent,activateCountdowns} from './core/countdown-content.js?v=20261114-next-stream-clock-v1';
import {renderCountdownInspector} from './ui/countdown-inspector.js?v=20261026-route-contract';
import {defaultSocialLinks,renderSocialLinksHtml} from './core/social-links.js';
import {renderSocialLinksInspector} from './ui/social-links-inspector.js?v=20261026-profile-route-contract';
import {defaultEmbedContent,renderEmbedHtml} from './core/creator-embed.js';
import {renderBasicContentInspector} from './ui/basic-content-inspector.js?v=20261121-d06-canonical-icon-registry-v1';
import {renderLegacyMediaInspector} from './ui/legacy-media-inspector.js?v=20261125-media-playback-guard-version-scope-v1';
import {renderCardInspector} from './ui/card-content-inspector.js?v=20261118-d02-card-cta-recovery-v1';
import {renderEmbedInspector} from './ui/creator-embed-inspector.js?v=20261026-profile-route-contract';
import {defaultCodeSnippet,renderCodeSnippet,activateCodeBlocks} from './core/code-snippet.js';
import {renderCodeSnippetInspector} from './ui/code-snippet-inspector.js?v=20261026-profile-route-contract';
import {readRichTextSelectionFormatting,readRichTextLinkTarget,readRichTextLinkHref,clearRichTextInlineFormatting} from './core/richtext-links.js?v=20261117-d03-invalid-media-id-guidance-v1';
import {renderAccessibilityFields} from './ui/accessibility-fields.js?v=20261026-accessibility-route-contract';
import {createCompositionInputs} from './ui/composition-inputs.js';
import {opaqueContrast} from './core/accessibility.js';
import {STATE_PROPERTY_IDS,applyStateStyles} from './core/state-styles.js';
import {defaultTokens,applyTokenVariables} from './core/design-tokens.js';
import {CONTENT_TYPES,STRUCTURAL_TYPES,validatePageForPublication,isAuthoredContent,authoredNodeHtml,contentAttributes,initContentInteractions,contentTag} from './core/authored-content.js?v=20261126-edt039-detached-action-timer-v1';
import {captureCanvasInteractionState,restoreCanvasInteractionState} from './core/canvas-interaction-state.js';
import {renderElementContentControls,pageLinkPicker} from './ui/element-content-controls.js?v=20261120-d06-authored-playable-asset-picker-v1';
import {renderPageInteractionControls} from './ui/page-interaction-controls.js?v=20261119-edt039-page-action-safe-labels-v1';

const reducedMotionQuery=typeof window.matchMedia==='function'?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
const prefersReducedMotion=()=>reducedMotionQuery?.matches===true;
let editorTokens=defaultTokens();
function propertyInput(property,label,current,onChange,options={}){
  return renderPropertyInput(property,label,current,onChange,{tokens:editorTokens,...options});
}
async function loadEditorTokens(){try{const response=await fetch('/api/public/presentation?preview=1',{cache:'no-store',credentials:'same-origin'});const result=await response.json();if(response.ok&&result?.data?.tokens){editorTokens=result.data.tokens;const target=canvas.querySelector('.page-canvas');if(target)applyTokenVariables(target,editorTokens)}}catch{} }
let statePreview='none';
let pendingLayerRename=null;
const collapsedLayerNodesByPage=new Map();
function flushLayerRename(){return pendingLayerRename?.()!==false}
let inspectorCategory='all';let richTextSelectionCleanup=null;let richTextToolTab='character';

let state=null;let pages=[];let archivedPages=[];let revisionHistory=[];let zoom=1;let inspectorTab='design';let inspectorQuery='';let flushRichTextDraft=null;let inlineEditingId=null;let richTextBookmark=null;let copiedStyleSnapshot=null;let nodeClipboard=null;let canvasDrag=null;let canvasResize=null;let pageStartTemplate='blank-page';let pageCreateBusy=false;let mobileTouch={active:false,timer:null,downId:null,startX:0,startY:0,snapshot:[],snapshotPrimary:null,suppressClick:false,longPressTriggered:false};let hierarchyDrag={nodeId:null,overId:null};let mobileHierarchyDrag={active:false,timer:null,nodeId:null,overId:null,startX:0,startY:0,suppressClick:false};let layerKeyboardRangeAnchorId=null;
let paletteFavoritesUserId=null;let paletteFavoriteTypes=[];let paletteFavoritesReady=false;let accountWorkspaceReady=false;let accountWorkspaceCachePresent=false;let accountWorkspaceTimer=null;let accountPreferenceWrite=Promise.resolve();let pendingAccountViewport=null;let accountPreferenceRevisions={paletteFavoriteTypes:0,workspace:0};let accountPreferenceConflicts=new Set();
const $=s=>document.querySelector(s);const canvas=$('#canvas');const inspector=$('#inspectorBody');
const sizes={desktop:1440,tablet:768,mobile:390};
const validHexColor=value=>typeof value==='string'&&/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(value);
const ELEMENT_DESCRIPTIONS={Section:'Oldalszakasz vagy nagyobb tartalmi blokk.',Container:'Rendezett tartalmak befoglalója.',Stack:'Egymásba rendezett elemek csoportja.',Group:'Több elem közös csoportja.',Row:'Elemek egy sorban történő elrendezése.',Columns:'Több oszlopos elrendezés.',Flex:'Rugalmas Flexbox elrendezés.',Grid:'Rács alapú elrendezés.',Slot:'Fenntartott tartalomhely.',Spacer:'Üres tér létrehozása.',Divider:'Vizuális elválasztó vonal.',Heading:'Címsor H1–H6 szinttel.',Szöveg:'Egyszerű szöveges tartalom.',"Rich Text":'Formázott szöveg, lista, idézet és link.',Link:'Kattintható hivatkozás.',Gomb:'Kattintható műveleti gomb.',Breadcrumb:'Navigációs útvonal.',Kép:'Kép megjelenítése.',Galéria:'Több kép megjelenítése.',Videó:'Videótartalom.',Audio:'Hanglejátszás.',Ikon:'Grafikus ikon.',Carousel:'Lapozható tartalom.',Embed:'Beágyazott tartalom.',Iframe:'Külső oldal beágyazása.',Code:'Kód megjelenítése.',Card:'Önálló tartalmi kártya.',Lista:'Felsorolás vagy lista.',Táblázat:'Táblázatos adatmegjelenítés.',Tabs:'Fülek között váltható tartalom.',Accordion:'Nyitható-csukható blokkok.',Dropdown:'Lenyíló menü vagy választó.',Pagination:'Lapozás.',Search:'Keresési funkció.',Modal:'Felugró ablak.',Navbar:'Fő navigáció.',Menu:'Navigációs menü.',Sidebar:'Oldalsó sáv.',Footer:'Oldal alsó része.',Form:'Űrlap befoglaló.',Input:'Egysoros beviteli mező.',Textarea:'Többsoros beviteli mező.',Checkbox:'Jelölőnégyzet.',Radio:'Egyszeres választás.',Select:'Lenyíló választó.',Slider:'Csúszkás értékválasztó.',File:'Fájlfeltöltő mező.',Submit:'Űrlap beküldése.',"Social Links":'Közösségi hivatkozások.',Discord:'Discord tartalom vagy hivatkozás.',Twitch:'Twitch tartalom.',YouTube:'YouTube tartalom.',TikTok:'TikTok tartalom.',"Élő állapot":'Élő vagy offline állapot.',Countdown:'Visszaszámláló.',Adásrend:'Tervezett adások listája.',"Stream számláló":'Streamhez kapcsolódó számláló.',"Követők":'Követőszám.',"Feliratkozók":'Feliratkozószám.',VOD:'Korábbi stream vagy videó.',Támogatás:'Támogatási lehetőségek.',Közösség:'Közösségi tartalom.',"Játékkártya":'Játék kiemelt kártyája.',"Játéklista":'Játékok listája.',Komponens:'Újrafelhasználható komponens.',"Egyedi elem":'Egyedi testreszabható elem.',"Badge/Tag":'Címke vagy állapotjelző.',Quote:'Idézet.',Panel:'Tartalmi panel.',Overlay:'Más tartalom fölötti réteg.',Absolute:'Abszolút pozicionált elem.',Sticky:'Görgetés közben rögzített elem.',Tooltip:'Rövid magyarázó felirat.',Shorts:'Shorts tartalmi blokk.',Sponsor:'Szponzorációs tartalom.',"Business Contact":'Üzleti kapcsolatfelvétel.',"About Me":'Bemutatkozó tartalom.',"Sanci Button":'Sanci9517 egyedi gomb.'};
const groups=[
 ['Layout',[['Section',NODE_TYPES.SECTION],['Container',NODE_TYPES.CONTAINER],['Stack',NODE_TYPES.STACK],['Group',NODE_TYPES.GROUP],['Row',NODE_TYPES.ROW],['Columns',NODE_TYPES.COLUMNS],['Flex',NODE_TYPES.FLEX],['Grid',NODE_TYPES.GRID],['Slot',NODE_TYPES.SLOT],['Spacer',NODE_TYPES.SPACER],['Divider',NODE_TYPES.DIVIDER],['Panel',NODE_TYPES.PANEL],['Overlay',NODE_TYPES.OVERLAY],['Absolute',NODE_TYPES.ABSOLUTE],['Sticky',NODE_TYPES.STICKY]]],
 ['Szöveg',[['Heading',NODE_TYPES.HEADING],['Szöveg',NODE_TYPES.TEXT],['Rich Text',NODE_TYPES.RICHTEXT],['Link',NODE_TYPES.LINK],['Gomb',NODE_TYPES.BUTTON],['Breadcrumb',NODE_TYPES.BREADCRUMB],['Badge/Tag',NODE_TYPES.BADGE],['Quote',NODE_TYPES.QUOTE],['Tooltip',NODE_TYPES.TOOLTIP]]],
 ['Média',[['Kép',NODE_TYPES.IMAGE],['Galéria',NODE_TYPES.GALLERY],['Videó',NODE_TYPES.VIDEO],['Audio',NODE_TYPES.AUDIO],['Ikon',NODE_TYPES.ICON],['Carousel',NODE_TYPES.CAROUSEL],['Embed',NODE_TYPES.EMBED],['Iframe',NODE_TYPES.IFRAME],['Code',NODE_TYPES.CODE]]],
 ['Tartalom',[['Card',NODE_TYPES.CARD],['Lista',NODE_TYPES.LIST],['Táblázat',NODE_TYPES.TABLE],['Tabs',NODE_TYPES.TABS],['Accordion',NODE_TYPES.ACCORDION],['Dropdown',NODE_TYPES.DROPDOWN],['Pagination',NODE_TYPES.PAGINATION],['Search',NODE_TYPES.SEARCH],['Modal',NODE_TYPES.MODAL]]],
 ['Navigáció',[['Navbar',NODE_TYPES.NAVBAR],['Menu',NODE_TYPES.MENU],['Sidebar',NODE_TYPES.SIDEBAR],['Footer',NODE_TYPES.FOOTER]]],
 ['Űrlapok',[['Form',NODE_TYPES.FORM],['Input',NODE_TYPES.INPUT],['Textarea',NODE_TYPES.TEXTAREA],['Checkbox',NODE_TYPES.CHECKBOX],['Radio',NODE_TYPES.RADIO],['Select',NODE_TYPES.SELECT],['Slider',NODE_TYPES.SLIDER],['File',NODE_TYPES.FILE],['Submit',NODE_TYPES.SUBMIT]]],
 ['Social / Web',[['Social Links',NODE_TYPES.SOCIAL],['Discord',NODE_TYPES.DISCORD],['Twitch',NODE_TYPES.TWITCH],['YouTube',NODE_TYPES.YOUTUBE],['TikTok',NODE_TYPES.TIKTOK]]],
 ['Sanci9517',[['Élő állapot',NODE_TYPES.LIVE],['Countdown',NODE_TYPES.COUNTDOWN],['Adásrend',NODE_TYPES.SCHEDULE],['Stream számláló',NODE_TYPES.STREAM_COUNT],['Követők',NODE_TYPES.FOLLOWERS],['Feliratkozók',NODE_TYPES.SUBS],['VOD',NODE_TYPES.VOD],['Támogatás',NODE_TYPES.SUPPORT],['Közösség',NODE_TYPES.COMMUNITY],['Játékkártya',NODE_TYPES.GAME_CARD],['Játéklista',NODE_TYPES.GAME_LIST],['Komponens',NODE_TYPES.COMPONENT],['Egyedi elem',NODE_TYPES.CUSTOM]]]
];
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const api=async(url,options={})=>{try{const response=await fetch(url,{credentials:'same-origin',headers:{'Content-Type':'application/json',...(options.headers||{})},...options});const data=await response.json().catch(()=>({}));if(!response.ok){const error=new Error(data?.error?.message||data?.message||`API hiba (${response.status})`);error.status=response.status;error.code=data?.error?.code||data?.code||null;error.apiUrl=url;error.isApiError=true;diagnostics.add({source:'api',code:'SANCI-API-E001',message:error.message,context:url,error});throw error}return data}catch(e){if(!e?.isApiError)diagnostics.add({source:'api',code:'SANCI-API-E002',message:e instanceof Error?e.message:String(e),context:url,error:e});throw e}};
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
function showRevisionConflict(error,pageId){const panel=$('#revisionConflict');const message=$('#revisionConflictMessage');if(!panel||!message){alert(error instanceof Error?error.message:String(error));return}state.persistence.conflict={code:'REVISION_CONFLICT',pageId,message:error instanceof Error?error.message:String(error),localRevision:state.document.revision??0};message.textContent=`${state.persistence.conflict.message} A helyi módosításaid megmaradtak ebben a munkamenetben. Exportáld őket, mielőtt a frissebb szerververziót betöltöd.`;panel.hidden=false;document.querySelector('.editor-app')?.classList.add('revision-conflict-open');setStatus('Verzióütközés — helyi változat megőrizve')}
function exportConflictDraft(){if(!state||!page())return;const meta=pages.find(x=>x.id===page().id);const payload={format:'sanci9517-editor-conflict-draft',exportedAt:new Date().toISOString(),pageId:page().id,title:meta?.title||page().name||page().slug,slug:page().slug,localRevision:state.document.revision??0,document:state.document};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const objectUrl=URL.createObjectURL(blob);const link=document.createElement('a');link.href=objectUrl;link.download=`sanci9517-${String(page().slug||page().id).replace(/[^a-z0-9-]/gi,'-')}-draft-conflict-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);setStatus('Helyi változat exportálása elindult')}
async function reloadLatestAfterConflict(){const conflict=state?.persistence?.conflict;if(!conflict)return;if(!confirm('A helyi szerkesztés felülíródik a szerver legfrissebb változatával. Előbb exportáltad a helyi JSON-vázlatot? Csak akkor folytasd, ha a helyi változatot megőrizted.'))return;try{await loadPage(conflict.pageId,{discardConfirmed:true});state.persistence.conflict=null;$('#revisionConflict').hidden=true;document.querySelector('.editor-app')?.classList.remove('revision-conflict-open');setStatus('Legfrissebb szerververzió betöltve')}catch(error){showError(error)}}
const canonical=(doc,id)=>{const page=doc?.pages?.[id];return Boolean(doc?.type==='sanci-page-document'&&doc?.schemaVersion===1&&doc?.activePageId===id&&page&&typeof page==='object'&&!Array.isArray(page))};
function verifyCommandResult(type,payload){if(type!=='element.add')return;const current=page();const nodeId=state?.selection?.primaryId;const node=nodeId&&current?getNode(current,nodeId):null;const parentId=payload?.parentId||current?.rootId;const parent=parentId&&current?getNode(current,parentId):null;const exists=Boolean(node&&node.id!==current?.rootId&&node.type===payload?.type&&node.parentId===parent?.id&&parent?.children?.includes(node.id)&&(!Number.isInteger(payload?.index)||parent.children[payload.index]===node.id));const canvasNode=nodeId?canvas.querySelector('[data-node-id="'+CSS.escape(nodeId)+'"]'):null;diagnostics.verify(exists,{code:'SANCI-VERIFY-E001',message:'Az elem hozzáadása lefutott, de az új node nem jött létre a várt Page Model helyen.',context:'element.add → Page Model'});diagnostics.verify(Boolean(canvasNode),{code:'SANCI-VERIFY-E002',message:'Az elem létrejött a Page Modelben, de nem jelent meg a Canvason.',context:'element.add → Canvas'});}
function command(type,payload,{render:shouldRender=true,typingGroup=null}={}){try{
  // A DOM-backed editor is an unsaved draft until its content reaches the Page Model.
  // Commit it before another command changes selection, history, or responsive state.
  if(!flushLayerRename())return false;
  if(!['richtext.content.set','element.content.set'].includes(type)&&flushRichTextDraft?.()===false)return false;
  if(typingGroup)executeCoalesced(state,{type,payload},typingGroup);else execute(state,{type,payload});if(shouldRender)render();if(shouldRender)verifyCommandResult(type,payload);if(type==='element.add'&&payload?.type===NODE_TYPES.RICHTEXT)beginRichTextEditing(state.selection.primaryId);return true
}catch(e){diagnostics.add({source:'command',code:'SANCI-CMD-E001',message:e instanceof Error?e.message:String(e),context:type,error:e});if(state?.persistence)state.persistence.error=e instanceof Error?e.message:String(e);setStatus('Szerkesztési hiba');alert(state.persistence.error);return false}}
function selectedClipboardRoots(current,ids){
 const selected=new Set(ids||[]),roots=[];
 for(const id of selected){let parent=current?.nodes?.[id]?.parentId,hasSelectedAncestor=false;while(parent){if(selected.has(parent)){hasSelectedAncestor=true;break}parent=current.nodes[parent]?.parentId??null}if(!hasSelectedAncestor)roots.push(id)}
 return roots;
}
function clipboardPasteTarget(){
 const current=page();if(!current||!isNodeClipboardForPage(nodeClipboard,current.id))return null;
 const types=nodeClipboard.rootIds.map(id=>nodeClipboard.nodes[id]?.type).filter(Boolean);
 const primary=state.selection.primaryId?getNode(current,state.selection.primaryId):null;
 const preferred=primary?.parentId?getNode(current,primary.parentId):null;
 const parent=preferred&&types.every(type=>canContain(preferred,type))?preferred:current.nodes[current.rootId];
 if(!parent||parent.locked||isNodeEffectivelyLocked(current,parent)||!types.every(type=>canContain(parent,type)))return null;
 const selectedRoots=selectedClipboardRoots(current,state.selection.ids).filter(id=>current.nodes[id]?.parentId===parent.id);
 const selectedIndexes=selectedRoots.map(id=>parent.children.indexOf(id)).filter(index=>index>=0);
 return {parent,index:selectedIndexes.length?Math.max(...selectedIndexes)+1:undefined};
}
function syncNodeClipboardActions(){
 const current=page(),ids=state?.selection?.ids||[];
 const canCopy=Boolean(current&&ids.length&&ids.every(id=>id!==current.rootId&&current.nodes[id]&&!isNodeEffectivelyLocked(current,current.nodes[id])));
 const canPaste=Boolean(clipboardPasteTarget());
 for(const id of ['copyNodes','mobileCopyNodes']){const button=$('#'+id);if(button)button.disabled=!canCopy}
 for(const id of ['pasteNodes','mobilePasteNodes']){const button=$('#'+id);if(button)button.disabled=!canPaste}
}
function copySelectedNodes(){
 if(!state||!flushLayerRename()||!commitActiveInspectorControl()||flushRichTextDraft?.()===false)return false;
 try{nodeClipboard=createNodeClipboard(page(),state.selection.ids);setStatus(`${nodeClipboard.rootIds.length} elem másolva ezen az oldalon`);syncNodeClipboardActions();return true}
 catch(error){setStatus(error instanceof Error?error.message:'A kijelölés nem másolható.');return false}
}
function pasteSelectedNodes(){
 if(!state||!flushLayerRename()||!commitActiveInspectorControl()||flushRichTextDraft?.()===false)return false;
 const target=clipboardPasteTarget();if(!target){setStatus('Ezen az oldalon nincs érvényes beillesztési hely.');return false}
 const pasted=command('element.paste',{clipboard:nodeClipboard,parentId:target.parent.id,index:target.index});
 if(pasted)setStatus(`${nodeClipboard.rootIds.length} elem beillesztve a piszkozatba`);
 return pasted;
}
function isCanvasDeleteShortcut(event){
 if(!['Delete','Backspace'].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return false;
 const target=event.target instanceof Element?event.target:null;
 const active=document.activeElement instanceof Element?document.activeElement:null;
 const editing='input,textarea,select,[contenteditable="true"],[role="textbox"],.rich-text-editor,.plain-text-editor';
 if(target?.closest(editing)||active?.closest(editing))return false;
 if(active?.closest('a,button,summary,video,audio,[role="button"]')&&!active.closest('.layer-row,.canvas-keyboard-move,.canvas-resize-handle'))return false;
 return Boolean(state?.selection?.ids?.length&&(document.activeElement===document.body||active?.closest('#canvas,#layersTree')));
}
function deleteSelectedNodes(){
 if(!state||!flushLayerRename()||!commitActiveInspectorControl()||flushRichTextDraft?.()===false)return false;
 const current=page(),ids=state.selection.ids||[],roots=selectedClipboardRoots(current,ids);
 if(!current||!ids.length||roots.length===0||ids.some(id=>{
   const node=current.nodes[id];return !node||id===current.rootId||isNodeEffectivelyLocked(current,node)
 })){
   setStatus('A gyökér-, zárolt vagy nem törölhető kijelölés változatlan maradt.');return false;
 }
 const focusId=current.nodes[roots[0]]?.parentId||current.rootId;
 try{
   executeBatch(state,roots.map(nodeId=>({type:'element.delete',payload:{nodeId}})),{label:'Kijelölt elemek törlése',atomic:true});
   setSelection(state,[focusId],focusId);
   render();
   const focusRow=$(`#layersTree .layer-row[data-node-id="${CSS.escape(focusId)}"]`);
   focusRow?.focus({preventScroll:true});focusRow?.scrollIntoView({block:'nearest'});
   setStatus(`${roots.length} kijelölt elem törölve a piszkozatból`);
   return true;
 }catch(error){
   diagnostics.add({source:'keyboard-delete',code:'SANCI-CMD-E001',message:error instanceof Error?error.message:String(error),context:'selection.delete',error});
   setStatus('A kijelölés nem törölhető.');return false;
 }
}
function isCanvasClipboardShortcut(event){
 const target=event.target instanceof Element?event.target:null;
 const active=document.activeElement instanceof Element?document.activeElement:null;
 const editing='input,textarea,select,[contenteditable="true"],[role="textbox"],.rich-text-editor,.plain-text-editor';
 if(target?.closest(editing)||active?.closest(editing))return false;
 return Boolean(document.activeElement===document.body&&state?.selection?.ids?.length)||Boolean(document.activeElement?.closest?.('#canvas,#layersTree'));
}
function typeForElement(name){const map={'Badge/Tag':'badge','Quote':'quote','Panel':'panel','Overlay':'overlay','Absolute':'absolute','Sticky':'sticky','Tooltip':'tooltip','Shorts':'shorts','Sponsor':'sponsor','Business Contact':'business','About Me':'about','Sanci Button':'sanci-button'};if(map[name])return map[name];for(const items of groups)for(const [label,type] of items)if(label===name&&type)return type;return null}
function addAuthoredElement(type,name,insertion){const authored=CONTENT_TYPES.includes(type)&&!['code','divider','spacer','heading','text','richtext','button','link'].includes(type);command('element.add',{type,name,...insertion,authored,props:[NODE_TYPES.RICHTEXT,NODE_TYPES.FORM].includes(type)?{}:{text:name}})}
function normalizePaletteSearch(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase()}
function paletteEntries(){return groups.flatMap(([group,items])=>items.map(([name,type])=>({group,name,type:type||typeForElement(name)})).filter(entry=>entry.type))}
function insertPaletteEntry(name,type){const current=page();if(!current)return;const insertion=resolveElementInsertion(current,state.selection.primaryId,type);if(insertion)addAuthoredElement(type,name,insertion)}
function updatePaletteFavorite(type,name,filter){
 const userId=paletteFavoritesUserId;
 const result=togglePaletteFavoriteType(paletteFavoritesUserId,type,paletteFavoriteTypes);
 paletteFavoriteTypes=result.types;
 const status=$('#elementPaletteStatus');
 if(status)status.textContent=result.saved?'Kedvencek mentése a fiókodhoz…':'Kedvenc módosítva; fiókszinkronizálás folyamatban…';
 renderPalette(filter);
 const focusTarget=$(`#elementList .element-favorite-toggle[data-element-type="${type}"]`);
 focusTarget?.focus();
 const types=[...paletteFavoriteTypes];
 if(accountPreferenceConflicts.has('paletteFavoriteTypes')){
  announceAccountPreferenceConflict('Egy másik munkamenet módosította a fiókkedvenceket. A mostani lista ezen az eszközön megmaradt; frissítsd az oldalt a fiók legújabb állapotához.');
  return Promise.resolve();
 }
 accountPreferenceWrite=accountPreferenceWrite.catch(()=>{}).then(async()=>{
  if(accountPreferenceConflicts.has('paletteFavoriteTypes'))return;
  const saved=await api('/api/admin/editor/preferences',{method:'PUT',body:JSON.stringify({ownerUserId:userId,paletteFavoriteTypes:types,baseRevisions:{paletteFavoriteTypes:accountPreferenceRevisions.paletteFavoriteTypes}})});
  if(Number.isSafeInteger(saved?.data?.revisions?.paletteFavoriteTypes))accountPreferenceRevisions.paletteFavoriteTypes=saved.data.revisions.paletteFavoriteTypes;
  if(paletteFavoritesUserId===userId&&paletteFavoriteTypes.join('\0')===types.join('\0')){
   writePaletteFavoriteTypes(userId,types);
   if(status)status.textContent=saved?.data?.paletteFavoriteTypes?'Kedvencek elmentve a fiókodhoz; más eszközön is visszatöltődnek.':'A kedvencek frissültek.';
  }
 }).catch(error=>{
  if(error?.code==='PREFERENCES_OWNER_CHANGED'){
   accountPreferenceConflicts.add('paletteFavoriteTypes');
   if(paletteFavoritesUserId===userId)announceAccountPreferenceConflict('A bejelentkezett fiók megváltozott. A helyi kedvencek megmaradtak, de nem kerültek át másik fiókba; töltsd újra a szerkesztőt.');
   return;
  }
  if(error?.code==='PREFERENCES_CONFLICT'){
   accountPreferenceConflicts.add('paletteFavoriteTypes');
   if(paletteFavoritesUserId===userId)announceAccountPreferenceConflict('Egy másik munkamenet módosította a fiókkedvenceket. A mostani lista ezen az eszközön megmaradt; frissítsd az oldalt a fiók legújabb állapotához.');
   return;
  }
  if(paletteFavoritesUserId===userId&&status)status.textContent=result.saved?'A kedvencek most csak ebben a böngészőben mentődtek; a fiókszinkron később újrapróbálható.':'A kedvencek csak ebben a munkamenetben érhetők el; a mentés nem sikerült.';
 });
 return accountPreferenceWrite;
}
function createPaletteFavoriteToggle(type,name,filter){
 const button=document.createElement('button');button.type='button';button.className='element-favorite-toggle';button.dataset.elementType=type;
 const selected=paletteFavoriteTypes.includes(type);button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-label',`${selected?'Eltávolítás a kedvencekből':'Hozzáadás a kedvencekhez'}: ${name}`);button.title=selected?'Eltávolítás a kedvencekből':'Hozzáadás a kedvencekhez';button.textContent=selected?'★':'☆';
 const capability=getElementCapability(type);button.disabled=!paletteFavoritesReady||!paletteFavoritesUserId||capability.status==='PLANNED';if(capability.status==='PLANNED')button.title='A még nem elérhető elem nem vehető fel a kedvencek közé.';button.onclick=()=>updatePaletteFavorite(type,name,filter);
 return button;
}
function createPaletteElementButton(name,type,{shortcut=false,filter=''}={}){
 const button=document.createElement('button');button.type='button';button.className=shortcut?'element-favorite-shortcut':'element';
 if(shortcut){button.textContent=name;button.setAttribute('aria-label',`Vászonra helyezés: ${name}`)}
 else{const icon=document.createElement('i');icon.textContent='◇';const label=document.createElement('span');label.textContent=name;button.append(icon,label)}
 const capability=getElementCapability(type);const badge=document.createElement('small');badge.className='element-capability';badge.textContent=capability.status==='PARTIAL'?'Részleges':'Tervezett';button.append(badge);
 button.disabled=capability.status==='PLANNED';if(button.disabled)button.title='Később: ez az elem még nem használható.';else button.onclick=()=>insertPaletteEntry(name,type);
 return button;
}
function accountWorkspaceSnapshot(){
 const snapshot=window.sanciEditor?.workspacePreferenceSnapshot?.();
 if(!snapshot?.appearance||!snapshot?.dock||!snapshot?.viewport)return null;
 return {version:1,appearance:snapshot.appearance,dock:snapshot.dock,viewport:{device:state?.viewport?.device||snapshot.viewport.device,zoom:Number.isFinite(zoom)?zoom:snapshot.viewport.zoom}};
}
function announceAccountPreferenceConflict(message){
 for(const selector of ['#elementPaletteStatus','#workspaceAppearanceStatus','#workspaceDockStatus']){
  const status=$(selector);if(status)status.textContent=message;
 }
}
function applyAccountViewport(viewport){
 if(!viewport||typeof viewport!=='object')return false;
 const next={device:['desktop','tablet','mobile'].includes(viewport.device)?viewport.device:'desktop',zoom:Number.isFinite(Number(viewport.zoom))?Math.max(.35,Math.min(1.5,Number(viewport.zoom))):1};
 pendingAccountViewport=next;
 if(!state)return true;
 const previous={device:state.viewport.device,zoom};state.viewport.device=next.device;zoom=next.zoom;
 if(render()===false){state.viewport.device=previous.device;zoom=previous.zoom;return false}
 pendingAccountViewport=null;window.sanciEditor?.setViewportPreference?.(next,{notify:false});return true;
}
function applyAccountWorkspace(workspace){
 if(!workspace||typeof workspace!=='object')return false;
 const applied=window.sanciEditor?.applyAccountWorkspacePreferences?.(workspace)===true;
 const nextInspectorTab=workspace?.dock?.inspectorTab;
 if(applied&&['design','content','advanced'].includes(nextInspectorTab))inspectorTab=nextInspectorTab;
 return applied&&applyAccountViewport(workspace.viewport);
}
function queueAccountWorkspaceWrite(){
 if(!accountWorkspaceReady||!paletteFavoritesUserId||accountPreferenceConflicts.has('workspace'))return;
 clearTimeout(accountWorkspaceTimer);
 accountWorkspaceTimer=setTimeout(()=>{
  const workspace=accountWorkspaceSnapshot(),ownerUserId=paletteFavoritesUserId;if(!workspace||!ownerUserId)return;
  accountPreferenceWrite=accountPreferenceWrite.catch(()=>{}).then(async()=>{
   if(accountPreferenceConflicts.has('workspace'))return;
   const saved=await api('/api/admin/editor/preferences',{method:'PUT',body:JSON.stringify({ownerUserId,workspace,baseRevisions:{workspace:accountPreferenceRevisions.workspace}})});
   if(Number.isSafeInteger(saved?.data?.revisions?.workspace))accountPreferenceRevisions.workspace=saved.data.revisions.workspace;
   const status=$('#elementPaletteStatus');if(status)status.textContent='A munkaterület beállításai a fiókodhoz szinkronizálva.';
  }).catch(error=>{
   if(error?.code==='PREFERENCES_OWNER_CHANGED'){
    accountPreferenceConflicts.add('workspace');
    announceAccountPreferenceConflict('A bejelentkezett fiók megváltozott. A munkaterület helyi nézete megmaradt, de nem került át másik fiókba; töltsd újra a szerkesztőt.');
    return;
   }
   if(error?.code==='PREFERENCES_CONFLICT'){
    accountPreferenceConflicts.add('workspace');
    announceAccountPreferenceConflict('Egy másik munkamenet közben módosította a munkaterületet. A helyi nézet ezen az eszközön megmaradt; frissítsd az oldalt a fiók legújabb állapotához.');
    return;
   }
   const status=$('#elementPaletteStatus');if(status)status.textContent='A munkaterület helyben elmentve; a fiókszinkron most nem érhető el.';
  });
 },250);
}
function renderPalette(filter=''){
 const root=$('#elementList');if(!root){diagnostics.add({source:'ui',code:'SANCI-UI-E002',message:'Az Elemek lista konténere nem található.'});return}
 root.replaceChildren();const q=normalizePaletteSearch(filter),searching=Boolean(q);let groupIndex=0,descriptionIndex=0;
 const entries=paletteEntries(),entryByType=new Map(entries.map(entry=>[entry.type,entry]));
 if(!searching&&paletteFavoriteTypes.length){
  const favorites=paletteFavoriteTypes.map(type=>entryByType.get(type)).filter(entry=>entry&&getElementCapability(entry.type).status!=='PLANNED');
  if(favorites.length){
   const section=document.createElement('section');section.className='element-group element-favorites';section.setAttribute('aria-label','Személyes kedvencek');
   const heading=document.createElement('div');heading.className='element-favorites-heading';const label=document.createElement('strong');label.textContent='Kedvencek';const count=document.createElement('span');count.textContent=String(favorites.length);heading.append(label,count);section.append(heading);
   for(const entry of favorites){const row=document.createElement('div');row.className='element-favorite-row';row.append(createPaletteElementButton(entry.name,entry.type,{shortcut:true,filter}),createPaletteFavoriteToggle(entry.type,entry.name,filter));section.append(row)}
   root.append(section);
  }
 }
 for(const[group,items]of groups){
  const matches=items.filter(([name,type])=>{const resolvedType=type||typeForElement(name);return normalizePaletteSearch(name).includes(q)&&Boolean(resolvedType)});if(!matches.length)continue;
  const section=document.createElement('section');section.className='element-group'+(searching?'':' collapsed');const title=document.createElement('button');title.type='button';title.className='element-group-title';const groupLabel=document.createElement('span');groupLabel.textContent=group;const groupCount=document.createElement('b');groupCount.textContent=String(matches.length);title.append(groupLabel,groupCount);title.setAttribute('aria-expanded',String(searching));
  const body=document.createElement('div');body.id='element-group-'+groupIndex++;title.setAttribute('aria-controls',body.id);
  for(const[name,type]of matches){
   const resolvedType=type||typeForElement(name),row=document.createElement('div');row.className='element-row';const element=createPaletteElementButton(name,resolvedType,{filter});const capability=getElementCapability(resolvedType);const favorite=createPaletteFavoriteToggle(resolvedType,name,filter);const info=document.createElement('button');info.type='button';info.className='element-info';info.textContent='i';info.title='Mi ez? '+name;info.setAttribute('aria-label','Mi ez? '+name);info.setAttribute('aria-expanded','false');
   const help=document.createElement('div');help.className='element-description';help.id='element-description-'+descriptionIndex++;help.textContent=(ELEMENT_DESCRIPTIONS[name]||name+' elem hozzáadására szolgál.')+' Inspector: '+capability.inspector+', publikus kimenet: '+capability.public+'.';help.hidden=true;info.setAttribute('aria-controls',help.id);info.onclick=e=>{e.stopPropagation();help.hidden=!help.hidden;info.setAttribute('aria-expanded',String(!help.hidden))};row.append(element,favorite,info,help);body.append(row);
  }
  title.onclick=()=>{const collapsed=section.classList.toggle('collapsed');title.setAttribute('aria-expanded',String(!collapsed))};section.append(title,body);root.append(section);
 }
 if(!root.children.length&&searching){const empty=document.createElement('p');empty.className='element-search-empty';empty.setAttribute('role','status');empty.textContent='Nincs találat a megadott keresésre.';root.append(empty)}else if(!root.children.length)diagnostics.add({source:'ui',code:'SANCI-UI-E003',message:'Az Elemek lista üres: egyetlen érvényes elem típus sem került a palettába.'});
}
async function loadPaletteFavorites(){
 const status=$('#elementPaletteStatus');
 try{
  const result=await api('/api/auth/session'),user=result?.data?.user;
  if(result?.data?.authenticated===true){
   if(typeof user?.id!=='string')throw new Error('A bejelentkezett fiók azonosítója érvénytelen.');
   if(window.sanciEditor?.setWorkspacePreferenceOwner?.(user.id)===false)throw new Error('A fiókhoz tartozó munkaterület-tárhely nem állítható be.');
   const ownedDock=window.sanciEditor?.workspacePreferenceSnapshot?.()?.dock;
   if(['design','content','advanced'].includes(ownedDock?.inspectorTab)){inspectorTab=ownedDock.inspectorTab;if(state)renderInspector()}
   accountWorkspaceCachePresent=window.sanciEditor?.hasWorkspacePreferenceCache?.()===true;
   paletteFavoritesUserId=user.id;
   paletteFavoriteTypes=readPaletteFavoriteTypes(user.id);
   try{
    const preferences=await api('/api/admin/editor/preferences');
    const revisions=preferences?.data?.revisions;
    accountPreferenceRevisions={
     paletteFavoriteTypes:Number.isSafeInteger(revisions?.paletteFavoriteTypes)&&revisions.paletteFavoriteTypes>=0?revisions.paletteFavoriteTypes:0,
     workspace:Number.isSafeInteger(revisions?.workspace)&&revisions.workspace>=0?revisions.workspace:0
    };
    if(Array.isArray(preferences?.data?.paletteFavoriteTypes)){
     paletteFavoriteTypes=normalizePaletteFavoriteTypes(preferences.data.paletteFavoriteTypes);
     writePaletteFavoriteTypes(user.id,paletteFavoriteTypes);
     if(status)status.textContent='Személyes kedvencek fiókodhoz mentve, ezen az eszközön is visszatöltve.';
    }else if(status)status.textContent='A fiókbeállítás válasza nem érvényes; csak a helyi gyorsítótár látható.';
    const hasWorkspace=Boolean(preferences?.data?.workspace);
    if(hasWorkspace){
     if(!applyAccountWorkspace(preferences.data.workspace)&&status)status.textContent='A fiók munkaterület-beállítása nem érvényes; a jelenlegi helyi nézet maradt aktív.';
    }
    accountWorkspaceReady=true;
    if(!hasWorkspace&&accountWorkspaceCachePresent)queueAccountWorkspaceWrite();
   }catch{if(status)status.textContent='A fiókbeállítás nem érhető el; a helyi kedvencek láthatók, a módosítások nem szinkronizálhatók.'}
  }else if(result?.data?.authenticated===false){
   if(window.sanciEditor?.setWorkspacePreferenceOwner?.(null)===false)throw new Error('A helyi munkaterület-tárhely nem állítható be.');
   const localDock=window.sanciEditor?.workspacePreferenceSnapshot?.()?.dock;
   if(['design','content','advanced'].includes(localDock?.inspectorTab)){inspectorTab=localDock.inspectorTab;if(state)renderInspector()}
   if(status)status.textContent='A kedvencek használatához jelentkezz be.'
  }else if(status)status.textContent='A munkaterület és a kedvencek betöltése most nem érhető el.'
 }catch{paletteFavoritesUserId=null;paletteFavoriteTypes=[];if(status)status.textContent='A kedvencek betöltése most nem érhető el.'}
 paletteFavoritesReady=true;renderPalette($('#elementSearch')?.value||'');
}
function syncHierarchyActions(){const current=page();const ids=state?.selection?.ids||[];const nodes=current?ids.map(id=>getNode(current,id)).filter(Boolean):[];const sameParent=nodes.length>=2&&nodes.every(node=>node.parentId===nodes[0].parentId);const groupLocked=nodes.some(node=>node.locked||isLockedParent(current,node));const groupButton=$('#groupSelection');if(groupButton){groupButton.disabled=!sameParent||groupLocked||nodes.some(node=>node.id===current?.rootId)}const primary=current&&state?.selection?.primaryId?getNode(current,state.selection.primaryId):null;const ungroupButton=$('#ungroupSelection');if(ungroupButton)ungroupButton.disabled=!(primary?.type===NODE_TYPES.GROUP&&!primary.locked&&!isLockedParent(current,primary));const mobileGroup=$('#mobileGroup');if(mobileGroup)mobileGroup.disabled=!sameParent||groupLocked||nodes.some(node=>node.id===current?.rootId);const mobileUngroup=$('#mobileUngroup');if(mobileUngroup)mobileUngroup.disabled=!(primary?.type===NODE_TYPES.GROUP&&!primary.locked&&!isLockedParent(current,primary));for(const [id,kind] of [['moveLayerUp','up'],['moveLayerDown','down'],['indentLayer','indent'],['outdentLayer','outdent']]){const button=$('#'+id);if(button)button.disabled=ids.length!==1||!primary||!getLayerMoveAction(current,primary.id,kind)}}
function syncMobileMultiSelectUI(){const bar=$('#mobileMultiSelectBar');if(!bar)return;bar.hidden=!mobileTouch.active;const count=$('#mobileSelectionCount');if(count)count.textContent=`${state?.selection?.ids?.length||0} elem kijelölve`;syncHierarchyActions()}
function enterMobileMultiSelect(id){layerKeyboardRangeAnchorId=null;if(!state||!flushLayerRename())return;const current=page();const target=current?getNode(current,id):null;if(!target||target.id===current?.rootId)return;mobileTouch.active=true;mobileTouch.snapshot=[...(state.selection.ids||[])];mobileTouch.snapshotPrimary=state.selection.primaryId;setSelection(state,[id],id);render()}
function toggleMobileSelection(id){layerKeyboardRangeAnchorId=null;if(!mobileTouch.active||!flushLayerRename())return;const current=page();const target=current?getNode(current,id):null;if(!target||target.id===current?.rootId)return;const ids=state.selection.ids.includes(id)?state.selection.ids.filter(x=>x!==id):[...state.selection.ids,id];setSelection(state,ids,id);render()}
function finishMobileMultiSelect(){layerKeyboardRangeAnchorId=null;if(!flushLayerRename())return;mobileTouch.active=false;mobileTouch.snapshot=[];mobileTouch.snapshotPrimary=null;mobileTouch.suppressClick=true;render();setTimeout(()=>{mobileTouch.suppressClick=false},300)}
function cancelMobileMultiSelect(){layerKeyboardRangeAnchorId=null;if(!flushLayerRename())return;const snapshot=[...mobileTouch.snapshot];const primary=mobileTouch.snapshotPrimary;mobileTouch.active=false;mobileTouch.snapshot=[];mobileTouch.snapshotPrimary=null;clearTimeout(mobileTouch.timer);mobileTouch.timer=null;setSelection(state,snapshot,primary);mobileTouch.suppressClick=true;render();setTimeout(()=>{mobileTouch.suppressClick=false},300)}
function handleMobilePointerDown(id,event){if(event.pointerType!=='touch')return;clearTimeout(mobileTouch.timer);mobileTouch.downId=id;mobileTouch.startX=event.clientX;mobileTouch.startY=event.clientY;mobileTouch.longPressTriggered=false;mobileTouch.timer=setTimeout(()=>{mobileTouch.timer=null;mobileTouch.longPressTriggered=true;enterMobileMultiSelect(id);mobileTouch.suppressClick=true},450)}
function handleMobilePointerMove(event){if(event.pointerType!=='touch'||!mobileTouch.timer)return;const dx=Math.abs(event.clientX-mobileTouch.startX);const dy=Math.abs(event.clientY-mobileTouch.startY);if(dx>10||dy>10){clearTimeout(mobileTouch.timer);mobileTouch.timer=null}}
function handleMobilePointerUp(id,event){if(event.pointerType!=='touch')return;clearTimeout(mobileTouch.timer);mobileTouch.timer=null;if(mobileTouch.active&&mobileTouch.downId===id){event.preventDefault();if(!mobileTouch.longPressTriggered)toggleMobileSelection(id);mobileTouch.longPressTriggered=false;mobileTouch.suppressClick=true;setTimeout(()=>{mobileTouch.suppressClick=false},300)}}
function handleMobilePointerCancel(){clearTimeout(mobileTouch.timer);mobileTouch.timer=null}
function renderLayerSelection(id,focusLayerRow=false){render();if(!focusLayerRow)return;const row=$('#layersTree')?.querySelector(`.layer-row[data-node-id="${CSS.escape(id)}"]`);if(row){row.focus({preventScroll:true});row.scrollIntoView({block:'nearest'})}}
function selectNodeInteraction(id,event,options={}){if(!flushLayerRename())return;if(mobileTouch.suppressClick&&event?.pointerType!=='touch'){mobileTouch.suppressClick=false;return}const current=page();const target=current?getNode(current,id):null;if(!current||!target)return;const rootId=current.rootId;if(id===rootId){layerKeyboardRangeAnchorId=null;setSelection(state,[id]);renderLayerSelection(id,options.focusLayerRow);return}const modifier=Boolean(event?.ctrlKey||event?.metaKey);const shift=Boolean(event?.shiftKey);if(shift){const primaryId=options.anchorId||layerKeyboardRangeAnchorId||state.selection.primaryId;const anchor=primaryId?getNode(current,primaryId):null;if(anchor&&anchor.id!==rootId&&anchor.parentId===target.parentId){const siblings=getChildren(current,target.parentId).map(node=>node.id);const from=siblings.indexOf(anchor.id);const to=siblings.indexOf(target.id);if(from>=0&&to>=0){const start=Math.min(from,to);const end=Math.max(from,to);layerKeyboardRangeAnchorId=anchor.id;setSelection(state,siblings.slice(start,end+1),target.id);renderLayerSelection(id,options.focusLayerRow);return}}layerKeyboardRangeAnchorId=primaryId||null;setSelection(state,[id]);renderLayerSelection(id,options.focusLayerRow);return}if(modifier){const ids=state.selection.ids.includes(id)?state.selection.ids.filter(x=>x!==id):[...state.selection.ids,id];layerKeyboardRangeAnchorId=options.keyboardAnchorId||id;setSelection(state,ids,id);renderLayerSelection(id,options.focusLayerRow);return}layerKeyboardRangeAnchorId=id;setSelection(state,[id]);renderLayerSelection(id,options.focusLayerRow)}
function beginCanvasDrag(id,event,element){
  const current=page();
  const node=current?getNode(current,id):null;
  if(!current||!node||id===current.rootId||isNodeEffectivelyLocked(current,node)||event.button!==0||!$('#selectTool')?.classList.contains('active'))return;
  if(event.target.closest('input,textarea,select,button,[contenteditable="true"],[role="textbox"]')){event.stopPropagation();return}
  if(event.ctrlKey||event.metaKey||event.shiftKey||!flushLayerRename())return;
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
function beginCanvasResize(id,event,element){const current=page();const node=current?getNode(current,id):null;if(!current||!node||id===current.rootId||isNodeEffectivelyLocked(current,node)||event.button!==0)return;const box=element.getBoundingClientRect();canvasResize={nodeId:id,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,startWidth:box.width/(zoom||1),startHeight:box.height/(zoom||1),width:box.width/(zoom||1),height:box.height/(zoom||1),element,device:state.viewport.device,moved:false,handle:event.currentTarget};try{event.currentTarget.setPointerCapture(event.pointerId)}catch{}event.preventDefault();event.stopPropagation()}
function moveCanvasResize(id,event){const r=canvasResize;if(!r||r.nodeId!==id||r.pointerId!==event.pointerId)return;const dx=(event.clientX-r.startX)/(zoom||1),dy=(event.clientY-r.startY)/(zoom||1);if(Math.abs(dx)>2||Math.abs(dy)>2)r.moved=true;if(!r.moved)return;r.width=Math.max(24,Math.round(r.startWidth+dx));r.height=Math.max(24,Math.round(r.startHeight+dy));r.element.style.width=r.width+'px';r.element.style.height=r.height+'px';updateCanvasExtent();event.preventDefault();event.stopPropagation()}
function finishCanvasResize(id,event,cancelled=false){const r=canvasResize;if(!r||r.nodeId!==id||r.pointerId!==event.pointerId)return;canvasResize=null;try{r.handle.releasePointerCapture(event.pointerId)}catch{}if(!cancelled&&r.moved){try{command('responsive.set',{nodeId:id,device:r.device,patch:{width:r.width+'px',height:r.height+'px'}},{render:false})}catch(error){showError(error);return}}render()}
function moveCanvasNodeByKeyboard(id,event){
  const direction={ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1}}[event.key];
  if(!direction||event.altKey||event.ctrlKey||event.metaKey)return;
  const current=page(),node=current?.nodes?.[id],element=canvas.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`);
  if(!node||!element||id===current.rootId||isNodeEffectivelyLocked(current,node))return;
  event.preventDefault();event.stopPropagation();
  const computed=getComputedStyle(element),left=Number.parseFloat(computed.left),top=Number.parseFloat(computed.top),step=event.shiftKey?10:1;
  const x=(Number.isFinite(left)?left:0)+direction.x*step,y=(Number.isFinite(top)?top:0)+direction.y*step,device=state.viewport.device;
  const saved=command('responsive.set',{nodeId:id,device,patch:{x:`${x}px`,y:`${y}px`}},{render:false,typingGroup:`canvas-keyboard-move:${id}:${device}`});
  if(!saved)return;
  render();
  canvas.querySelector(`.canvas-keyboard-move[data-node-id="${CSS.escape(id)}"]`)?.focus({preventScroll:true});
  setStatus(`Nem mentett módosítás · ${node.name||node.type} helye: ${x}px, ${y}px`);
}
function resizeCanvasNodeByKeyboard(id,event){
  const direction={ArrowLeft:{width:-1,height:0},ArrowRight:{width:1,height:0},ArrowUp:{width:0,height:-1},ArrowDown:{width:0,height:1}}[event.key];
  if(!direction||event.altKey||event.ctrlKey||event.metaKey)return;
  const current=page(),node=current?.nodes?.[id],element=canvas.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`);
  if(!node||!element||id===current.rootId||isNodeEffectivelyLocked(current,node))return;
  event.preventDefault();event.stopPropagation();
  const box=element.getBoundingClientRect(),step=event.shiftKey?10:1,device=state.viewport.device;
  const width=Math.max(24,Math.round(box.width/(zoom||1))+direction.width*step),height=Math.max(24,Math.round(box.height/(zoom||1))+direction.height*step);
  const saved=command('responsive.set',{nodeId:id,device,patch:{width:`${width}px`,height:`${height}px`}},{render:false,typingGroup:`canvas-keyboard-resize:${id}:${device}`});
  if(!saved)return;
  render();
  canvas.querySelector(`.canvas-resize-handle[data-node-id="${CSS.escape(id)}"]`)?.focus({preventScroll:true});
  setStatus(`Nem mentett módosítás · ${node.name||node.type} méret: ${width} × ${height} px`);
}
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
    const textProperty=getProperty('content.text');
    const saved=command(node.type===NODE_TYPES.RICHTEXT?'richtext.content.set':textProperty.command,
      node.type===NODE_TYPES.RICHTEXT?{nodeId,document:value}:{nodeId,content:value},{render:false,typingGroup});
    if(saved){
      syncTextSurfaces(nodeId,value,surface);
      // A Content fül külön szerkesztett szövege is ugyanazt a szerveroldali
      // kötelezőtartalom-útmutatást frissíti; nincs Inspector újrarender/IME-fókuszvesztés.
      if(node.type!==NODE_TYPES.RICHTEXT)inspector.querySelector('.element-content-controls')?.dispatchEvent(
        new CustomEvent('editor:external-content-updated',{detail:{nodeId,key:'text',value}})
      );
      setStatus('Nem mentett módosítás');syncPublishControls();
    }
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
  const property=getProperty('content.text');
  const section=document.createElement('section');section.className='field plain-text-content';
  section.dataset.propertyId=property.id;section.dataset.propertyCommand=property.command;section.dataset.propertyKey=property.key;
  const label=document.createElement('label');label.textContent='Szöveg';label.htmlFor='plain-text-content';
  const editor=document.createElement('textarea');editor.id='plain-text-content';editor.className='plain-text-editor';editor.dataset.textNodeId=node.id;editor.setAttribute('aria-label','Szöveg tartalma');editor.value=node.props?.text??node.props?.content??node.name??'';editor.disabled=isNodeEffectivelyLocked(page(),node);applyTextSurfaceStyle(editor,node);
  const typingGroup=crypto.randomUUID();let composing=false,dirty=false,compositionRevision=0;
  const flush=()=>{if(composing)return false;if(!dirty)return true;const saved=commitTextSurface(node.id,editor,typingGroup);if(saved)dirty=false;return saved};
  editor.onfocus=()=>{flushRichTextDraft=flush};editor.oninput=event=>{
    dirty=true;flushRichTextDraft=flush;
    if(event.isComposing){composing=true;return}
    // A confirmed non-composing input can be the final replacement after
    // compositionend, or the only final signal on some mobile keyboards.
    composing=false;flush();
  };
  editor.oncompositionstart=()=>{compositionRevision++;composing=true};
  editor.oncompositionend=()=>{
    dirty=true;const revision=compositionRevision;
    // A mobile IME may deliver the final input *after* compositionend.
    // Do not mirror or commit an intermediate character before that event.
    requestAnimationFrame(()=>{
      if(revision!==compositionRevision)return;
      composing=false;
      if(editor.isConnected)flush();
    });
  };
  editor.onblur=flush;
  const help=document.createElement('small');help.className='text-sync-hint';help.textContent='Élő kapcsolat a vászonnal. Gépeléskor a piszkozat frissül; a látogatók csak a külön Publikálás után látják.';
  section.append(label,editor,help);return section;
}
function beginRichTextEditing(id){
  const node=page()&&getNode(page(),id);
  if(!['richtext','heading','text','button','link'].includes(node?.type)||isNodeEffectivelyLocked(page(),node))return;
  if(window.innerWidth<=850){
    inlineEditingId=null;
    inspectorTab='content';window.sanciEditor?.setInspectorTab?.(inspectorTab,{notify:false});
    document.querySelectorAll('.inspector-tabs button').forEach((button,index)=>button.classList.toggle('active',index===1));
    renderInspector();
    window.sanciEditor?.openPanel?.('right');
    requestAnimationFrame(()=>inspector.querySelector('.richtext-editor-surface,.plain-text-editor')?.focus());
    return;
  }
  if(!flushLayerRename()||flushRichTextDraft?.()===false)return;
  inlineEditingId=id;
  inspectorTab='design';window.sanciEditor?.setInspectorTab?.(inspectorTab,{notify:false});
  document.querySelectorAll('.inspector-tabs button').forEach((button,index)=>button.classList.toggle('active',index===0));
  render();
  requestAnimationFrame(()=>{const editor=canvas.querySelector('.node[data-node-id="'+CSS.escape(id)+'"] .richtext-inline-surface,.node[data-node-id="'+CSS.escape(id)+'"] .plain-text-inline-surface');if(!editor)return;editor.focus();const block=editor.querySelector('[data-rich-block]');if(block&&!editor.textContent.trim()){const range=document.createRange();range.selectNodeContents(block);range.collapse(false);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)}});
}
function captureRichTextBookmark(id,surface){
  const offsets=getSelectionOffsets(surface);if(!offsets)return false;
  richTextBookmark={nodeId:id,range:getRichTextBlockSelection(surface),formatRange:getRichTextFormattingSelection(surface),
    blockIndex:getRichTextActiveBlockIndex(surface),transformSelection:getRichTextBlockTransformSelection(surface),selectionOffsets:{...offsets},
    source:surface.classList.contains('richtext-inline-surface')?'canvas':'inspector'};
  return true;
}
function openRichTextFormatting(id,{focusLink=false}={}){
  if(!flushLayerRename()||flushRichTextDraft?.()===false)return;
  const canvasEditor=canvas.querySelector(`.node[data-node-id="${CSS.escape(id)}"] .richtext-inline-surface`);
  if(canvasEditor)captureRichTextBookmark(id,canvasEditor);
  inlineEditingId=window.innerWidth>850?id:null;flushRichTextDraft=null;
  setSelection(state,[id],id);
  inspectorTab='content';window.sanciEditor?.setInspectorTab?.(inspectorTab,{notify:false});
  document.querySelectorAll('.inspector-tabs button').forEach((button,index)=>button.classList.toggle('active',index===1));
  render();window.sanciEditor?.openPanel?.('right');
  // A toolbar action can be followed immediately by the next keystroke. When
  // it started on the Canvas, restore that selection synchronously after the
  // render instead of waiting for the Inspector's next animation frame. Link
  // mode intentionally focuses its URL input below.
  if(!focusLink&&richTextBookmark?.nodeId===id&&richTextBookmark.source==='canvas'&&richTextBookmark.selectionOffsets){
    const restoredCanvas=canvas.querySelector(`.node[data-node-id="${CSS.escape(id)}"] .richtext-inline-surface`);
    if(restoredCanvas){
      restoredCanvas.focus({preventScroll:true});
      restoreSelectionOffsets(restoredCanvas,richTextBookmark.selectionOffsets);
    }
  }
  requestAnimationFrame(()=>{
    const editor=inspector.querySelector('.richtext-editor-surface');if(!editor)return;
    if(focusLink)editor.closest('.richtext-editor')?.querySelector('.richtext-link-controls input')?.focus({preventScroll:true});
  });
}
function renderNode(currentPage,id,managed=false){const node=getNode(currentPage,id);if(!node)return null;managed=managed||isManagedLayout(node)||isAuthoredContent(node);const el=document.createElement('div');el.className=`node ${state.selection.ids.includes(id)?'selected':''}`;el.classList.toggle('managed-layout',managed);el.dataset.nodeId=id;el.dataset.device=state.viewport.device;const visibility=getNodeVisibilityState(currentPage,id,state.viewport.device);if(node.type!=='root'&&!visibility.effectiveVisible){el.classList.add(visibility.ownVisible?'visibility-hidden-parent':'visibility-hidden-own');el.dataset.visibility='hidden';}if(isAuthoredContent(node)){el.classList.add('creator-node');el.dataset.contentType=node.type;if(['accordion','dropdown'].includes(node.type)){const props=node.props||{};el.dataset.detailsBehavior=`${props.singleOpen===true?'exclusive':'multiple'}:${props.openFirst===true?'open':'closed'}`}}if(node.metadata?.stateVersion===1){el.classList.add('creator-state-enabled');if(state.selection.primaryId===id&&statePreview!=='none')el.dataset.editorState=statePreview;el.tabIndex=0}for(const [key,value] of Object.entries(contentAttributes(node)))if(!['href','target','rel','type'].includes(key))el.setAttribute(key,value);const resolvedStyle=applyNodeStyle(el,node,state.viewport.device);const motionTrigger=motionTriggerForStyle(resolvedStyle);if(motionTrigger)el.dataset.motionTrigger=motionTrigger;
 const validHex=value=>typeof value==='string'&&/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(value)?value:'';
 for(const [value,klass,variable] of [
  [node.states?.hover?.backgroundColor,'visual-hover-bg','--sanci-hover-bg'],
  [node.states?.hover?.color,'visual-hover-text','--sanci-hover-color'],
  [node.states?.focus?.outlineColor,'visual-focus-outline','--sanci-focus-outline']
 ]){const color=validHex(value);if(color){el.classList.add(klass);el.style.setProperty(variable,color)}}
 const head=document.createElement('div');head.className='node-head';const headName=document.createElement('span');headName.textContent=node.name||node.type;const headType=document.createElement('small');headType.textContent=node.type;head.append(headName,headType);if(node.type!=='root'&&!visibility.effectiveVisible){const note=document.createElement('span');note.className='node-visibility-indicator';note.textContent=visibility.ownVisible?'Szülő miatt rejtve':'Rejtve';note.title='Ez az elem ebben a nézetben nem jelenik meg a publikus oldalon.';head.append(note)}if(state.selection.primaryId===id&&id!==currentPage.rootId&&!isNodeEffectivelyLocked(currentPage,node)){const move=document.createElement('button');move.type='button';move.className='canvas-keyboard-move';move.dataset.nodeId=id;move.textContent='Mozgatás';move.setAttribute('aria-label',`${node.name||node.type} elem mozgatása`);move.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown');move.setAttribute('aria-description','A nyilak 1 képponttal, a Shift és nyíl 10 képponttal mozgat. Ctrl+Z visszavon, Ctrl+Shift+Z újra végrehajt.');move.title='Nyilak: 1 képpont · Shift + nyíl: 10 képpont · Ctrl+Z: visszavonás';move.onpointerdown=event=>event.stopPropagation();move.onclick=event=>event.stopPropagation();move.onkeydown=event=>moveCanvasNodeByKeyboard(id,event);head.append(move)}el.append(head);
  if(node.type===NODE_TYPES.CODE&&node.metadata?.codeSnippetVersion===1){
    const host=document.createElement('div');host.className='node-content code-preview';
    host.innerHTML=renderCodeSnippet(node.props?.codeSnippet??defaultCodeSnippet());
    host.inert=true; // Preview cannot manipulate clipboard or steal Editor focus.
    el.append(host);
  }else if(node.type===NODE_TYPES.EMBED&&node.metadata?.embedContentVersion===1){
    const host=document.createElement('div');host.className='node-content embed-preview';
    host.innerHTML=renderEmbedHtml(node.props?.embedContent??defaultEmbedContent());
    host.inert=true; // No third-party requests or keyboard traps inside Editor canvas.
    el.append(host);
  }else if(node.type===NODE_TYPES.SOCIAL&&node.metadata?.socialLinksVersion===1){
    const host=document.createElement('div');host.className='node-content social-preview';
    host.innerHTML=renderSocialLinksHtml(node.props?.socialLinks??defaultSocialLinks());
    host.inert=true; // Links on the Editor canvas never navigate away or steal focus.
    el.append(host);
  }else if(node.type===NODE_TYPES.COUNTDOWN&&node.metadata?.countdownVersion===1){
    const host=document.createElement('div');host.className='node-content countdown-preview';
    host.innerHTML=renderCountdownContent(node.props?.countdown??defaultCountdownContent());
    el.append(host);
  }else if(node.type===NODE_TYPES.CARD&&node.metadata?.cardContentVersion===1){
    const model={...defaultCardContent(),...(node.props?.cardContent||{})};
    const body=document.createElement('div');body.className='node-content card-preview';
    body.style.cssText='box-sizing:border-box;max-width:100%;min-width:0;padding:16px;border-radius:12px;border:1px solid #64748b;background:rgba(127,127,127,.09)';
    if(model.variant==='outline')body.style.background='transparent';
    if(model.variant==='glass')body.style.background='rgba(255,255,255,.15)';
    const url=cardImageSrc(model,{editor:true});
    if(url){
      const image=document.createElement('img');image.src=url;image.alt=String(model.imageAlt||'');
      image.style.cssText='display:block;width:100%;max-height:250px;object-fit:cover;margin-bottom:12px;border-radius:8px';
      body.append(image);
    }
    const title=document.createElement('strong');title.className='card-preview-title';title.textContent=String(model.title||'Kártya címe');body.append(title);
    if(model.description){const description=document.createElement('p');description.textContent=String(model.description);description.style.whiteSpace='pre-wrap';body.append(description)}
    if(model.actionLabel){const button=document.createElement('span');button.textContent=String(model.actionLabel);button.className='card-preview-action';button.style.cssText='display:inline-flex;margin-top:8px;padding:8px 12px;border-radius:6px;background:#e2e8f0;color:#111827';body.append(button)}
    el.append(body);
  }else if(node.type===NODE_TYPES.DIVIDER&&node.metadata?.decorativeVersion===1){
    const config=normalizeDividerStyle(node.props?.decoration);
    const line=document.createElement('div');line.className='node-content divider-preview';
    line.style.cssText='box-sizing:border-box;width:100%;min-height:0;border:0;';
    line.style.borderTop=`${config.thickness}px ${config.lineStyle} ${config.color}`;
    line.style.pointerEvents='none';el.append(line);
  }else if(node.type===NODE_TYPES.SPACER&&node.metadata?.spacerVersion===1){
    const label=document.createElement('small');label.className='node-content spacer-preview';
    label.textContent='Üres tér · a Méret panelen vagy itt módosítható';
    label.style.cssText='pointer-events:none;position:absolute;left:8px;top:6px;opacity:.5;font-size:11px;';
    el.append(label);
  }else if(node.type===NODE_TYPES.RICHTEXT){
    const c=document.createElement('div');c.className='node-content richtext-content';
    renderRichTextEditor(c,node.props?.richText);
    const empty=!c.textContent.trim();
    el.classList.toggle('richtext-empty',empty);
    if(inlineEditingId===id&&!isNodeEffectivelyLocked(currentPage,node)){
      c.classList.add('richtext-inline-surface');c.contentEditable='true';c.spellcheck=true;
      c.setAttribute('role','textbox');c.setAttribute('aria-label','Rich Text közvetlen szerkesztése');
      let dirty=false,composing=false,compositionRevision=0;
      const typingGroup=crypto.randomUUID();
      const save=()=>{
        if(composing){setStatus('Fejezd be az aktuális szövegbevitelt.');return false}
        if(!dirty)return true;
        const saved=commitTextSurface(id,c,typingGroup);if(saved)dirty=false;return saved;
      };
      flushRichTextDraft=save;
      c.onfocus=()=>{flushRichTextDraft=save};
      c.oninput=()=>{dirty=true;flushRichTextDraft=save;richTextBookmark=null;if(!composing)save();el.classList.toggle('richtext-empty',!c.textContent.trim())};
      c.oncompositionstart=()=>{compositionRevision++;composing=true};
      c.oncompositionend=()=>{
        dirty=true;const revision=compositionRevision;
        // Some mobile IMEs dispatch their final input AFTER compositionend.
        // Keep the composition guard until the next paint so that neither
        // intermediate text nor a stale earlier composition is committed.
        requestAnimationFrame(()=>{
          if(revision!==compositionRevision)return;
          composing=false;
          if(c.isConnected&&inlineEditingId===id)save();
        });
      };
      c.onkeydown=event=>{
        if(!(event.ctrlKey||event.metaKey)||event.altKey)return;
        const key=event.key.toLowerCase();
        if(key==='k'){
          event.preventDefault();openRichTextFormatting(id,{focusLink:true});return;
        }
        const mark={b:'bold',i:'italic',u:'underline'}[key];
        if(!mark)return;
        event.preventDefault();
        if(composing){setStatus('Fejezd be a szövegbevitelt a formázás előtt.');return}
        // Canvas and Inspector use the same structured Rich Text commands;
        // never rely on execCommand or a second, browser-only formatting state.
        const range=getRichTextFormattingSelection(c),offsets=getSelectionOffsets(c);
        if(!range||!offsets||offsets.collapsed){
          setStatus('Előbb jelölj ki egy szövegrészt a formázáshoz.');return;
        }
        try{
          const next=updateRichTextInlineMark(richTextEditorToDocument(c),range,mark);
          if(!command('richtext.content.set',{nodeId:id,document:next},{render:false}))return;
          dirty=false;richTextBookmark=null;
          renderRichTextEditor(c,next);
          syncTextSurfaces(id,next,c);
          c.focus({preventScroll:true});
          if(!restoreSelectionOffsets(c,offsets))restoreRichTextFormattingSelection(c,range);
          setStatus('Nem mentett módosítás');syncPublishControls();
        }catch(error){setStatus(error instanceof Error?error.message:String(error))}
      };
      c.onpaste=event=>{event.preventDefault();try{const imported=normalizeRichText(importRichTextClipboard({html:event.clipboardData?.getData('text/html')||'',text:event.clipboardData?.getData('text/plain')||''}));if(pasteRichTextDocument(c,imported))c.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertFromPaste'}))}catch(error){setStatus(error.message)}};
      c.onblur=()=>{if(inlineEditingId===id)save()};
      c.onpointerdown=e=>e.stopPropagation();c.onclick=e=>e.stopPropagation();
      c.ondblclick=e=>e.stopPropagation();
    }
    el.append(c);
    if(inlineEditingId!==id&&!isNodeEffectivelyLocked(currentPage,node)){
      const edit=document.createElement('button');edit.type='button';edit.className='canvas-edit-richtext';
      edit.textContent=empty?'Írj ide… · Tartalom szerkesztése':'Tartalom szerkesztése';
      edit.setAttribute('aria-label','Tartalom szerkesztése');
      edit.onpointerdown=e=>e.stopPropagation();edit.onclick=e=>{e.stopPropagation();if(!flushLayerRename())return;setSelection(state,[id],id);beginRichTextEditing(id)};
      el.append(edit);
    }else if(!isNodeEffectivelyLocked(currentPage,node)){
      const format=document.createElement('button');format.type='button';format.className='canvas-edit-richtext canvas-format-richtext';
      format.textContent='Formázás és linkek';
      format.onpointerdown=e=>{e.preventDefault();e.stopPropagation()};format.onclick=e=>{e.stopPropagation();openRichTextFormatting(id)};
      el.append(format);
    }
    el.ondblclick=e=>{e.stopPropagation();if(!flushLayerRename())return;setSelection(state,[id],id);beginRichTextEditing(id)};
  }else if([NODE_TYPES.BADGE,NODE_TYPES.QUOTE,NODE_TYPES.ICON].includes(node.type)&&!isAuthoredContent(node)){
   const c=document.createElement('div');c.className='node-content basic-element-preview';
   if(node.type===NODE_TYPES.ICON){const icon=iconById(node.props?.icon);c.textContent=icon.glyph;c.setAttribute('role','img');c.setAttribute('aria-label',node.props?.label||icon.label);c.classList.add('visual-icon');}
   else if(node.type===NODE_TYPES.BADGE){c.textContent=node.props?.text||'Címke';c.classList.add('visual-badge');}
   else{const q=document.createElement('blockquote');q.className='visual-quote';const p=document.createElement('p');p.textContent=node.props?.text||'';q.append(p);if(node.props?.attribution){const cite=document.createElement('cite');cite.textContent=node.props.attribution;q.append(cite)}c.append(q)}
   el.append(c);
 }else if(node.type===NODE_TYPES.SCHEDULE){const c=document.createElement('div');c.className='node-content schedule-preview-host';renderSchedulePreview(c,node.props?.schedule);el.append(c)}else if([NODE_TYPES.IMAGE,NODE_TYPES.VIDEO,NODE_TYPES.AUDIO].includes(node.type)&&!isAuthoredContent(node)){
    const src=node.type===NODE_TYPES.IMAGE?legacyImageSource(node.props,{editor:true}):legacyPlayableSource(node.props,{editor:true});const c=document.createElement('div');c.className='node-content media-preview';
    if(src){
      const media=document.createElement(node.type===NODE_TYPES.IMAGE?'img':node.type===NODE_TYPES.VIDEO?'video':'audio');
      media.src=src;media.style.maxWidth='100%';media.style.width='100%';
      if(node.type===NODE_TYPES.IMAGE){
        const cfg=legacyImagePresentation(node.props);
        media.alt=cfg.alt;media.style.objectFit=cfg.fit;media.style.objectPosition=cfg.objectPosition;
        media.style.aspectRatio=cfg.ratio;media.loading=cfg.loading;
        if(cfg.decorative)media.setAttribute('role','presentation');
        const caption=legacyImageCaption(node.props);
        if(caption){
          const figure=document.createElement('figure');figure.className='legacy-image-figure';
          const text=document.createElement('figcaption');text.textContent=caption;
          figure.append(media,text);c.append(figure);
        }else c.append(media);
      }
      else{
        const cfg=legacyPlaybackSettings(node.props,{video:node.type===NODE_TYPES.VIDEO,editor:true,reducedMotion:prefersReducedMotion()});
        media.controls=cfg.controls;media.loop=cfg.loop;media.muted=cfg.muted;
        if(node.type===NODE_TYPES.VIDEO&&node.props?.autoplay===true&&node.props?.muted===true){media.dataset.reducedMotionAutoplay='true';media.dataset.reducedMotionControls=node.props.controls!==false?'true':'false'}
        media.autoplay=false;media.preload=node.type===NODE_TYPES.VIDEO?'metadata':'none';
        if(node.type===NODE_TYPES.VIDEO){media.playsInline=true;if(cfg.poster)media.poster=cfg.poster}
        media.addEventListener('pointerdown',event=>event.stopPropagation());
      }
      if(node.type!==NODE_TYPES.IMAGE)c.append(media);
    }else{const placeholder=document.createElement('small');placeholder.textContent='Adj meg egy média URL-t a Tartalom panelen.';c.append(placeholder);}
    el.append(c);
   }else if(isStructuredType(node.type)&&!isAuthoredContent(node)){
    const c=document.createElement('div');c.className='node-content structured-preview';
    c.innerHTML=renderElementContent(node.type,node.props?.contentModel??createElementContent(node.type),node.id,{ariaLabel:node.props?.ariaLabel,singleOpen:node.props?.singleOpen,openFirst:node.props?.openFirst});
    for(const eventName of ['pointerdown','click','dblclick'])c.addEventListener(eventName,event=>{if(event.target.closest('button,summary,dialog'))event.stopPropagation()});
    el.append(c);activateStructuredContent(c);
  }else if([NODE_TYPES.HEADING,NODE_TYPES.TEXT,NODE_TYPES.BUTTON,NODE_TYPES.LINK].includes(node.type)){
    const c=document.createElement('div');c.className='node-content plain-text-content-surface';c.textContent=node.props?.text??node.props?.content??node.name;
    if(inlineEditingId===id&&!isNodeEffectivelyLocked(currentPage,node)){
      c.classList.add('plain-text-inline-surface');c.contentEditable='plaintext-only';c.setAttribute('role','textbox');c.setAttribute('aria-label','Szöveg közvetlen szerkesztése');
      const typingGroup=crypto.randomUUID();let composing=false,dirty=false,compositionRevision=0;
      const flush=()=>{if(composing)return false;if(!dirty)return true;const saved=commitTextSurface(id,c,typingGroup);if(saved)dirty=false;return saved};
      c.onfocus=()=>{flushRichTextDraft=flush};c.oninput=event=>{
        dirty=true;flushRichTextDraft=flush;
        if(event.isComposing){composing=true;return}
        composing=false;flush();
      };c.onblur=flush;
      c.oncompositionstart=()=>{compositionRevision++;composing=true};
      c.oncompositionend=()=>{
        dirty=true;const revision=compositionRevision;
        requestAnimationFrame(()=>{
          if(revision!==compositionRevision)return;
          composing=false;
          if(c.isConnected&&inlineEditingId===id)flush();
        });
      };
      for(const type of ['pointerdown','click','dblclick'])c.addEventListener(type,event=>event.stopPropagation());
    }else if(!isNodeEffectivelyLocked(currentPage,node)){
      const edit=document.createElement('button');edit.type='button';edit.className='canvas-edit-text';edit.textContent='Szöveg szerkesztése';edit.setAttribute('aria-label','Szöveg szerkesztése');edit.onpointerdown=event=>event.stopPropagation();edit.onclick=event=>{event.stopPropagation();if(!flushLayerRename())return;setSelection(state,[id],id);beginRichTextEditing(id)};el.append(edit);
    }
    el.ondblclick=event=>{event.stopPropagation();if(!flushLayerRename())return;setSelection(state,[id],id);beginRichTextEditing(id)};el.append(c);
  }
  if(isAuthoredContent(node)&&!['code','embed','social','countdown','card','divider','spacer','richtext','heading','text','button','link'].includes(node.type)){
    // Structural authored containers (stack, grid, section, …) render their
    // children directly below. Their authored markup is empty in Canvas, so
    // adding a blank host would become an extra Flex/Grid item and create a
    // phantom gap that does not exist on the published page.
    const markup=authoredNodeHtml(node,{device:state.viewport.device,editor:true,reducedMotion:prefersReducedMotion()});
    if(markup){
      const host=document.createElement('div');host.className='node-content creator-content-host';host.innerHTML=markup;initContentInteractions(host);
      host.addEventListener('click',event=>{if(event.target.closest('a'))event.preventDefault()});
      host.addEventListener('pointerdown',event=>{if(event.target.closest('button,summary,video,audio'))event.stopPropagation()});el.append(host);
    }
  }
  for(const child of getChildren(currentPage,id)){const x=renderNode(currentPage,child.id,managed);if(x)el.append(x)}if(state.selection.primaryId===id&&id!==currentPage.rootId&&!isNodeEffectivelyLocked(currentPage,node)){const handle=document.createElement('button');handle.type='button';handle.className='canvas-resize-handle';handle.dataset.nodeId=id;const inverseZoom=1/(zoom||1);for(const property of ['width','height','minWidth','minHeight'])handle.style[property]=`${26*inverseZoom}px`;handle.style.right=`${-13*inverseZoom}px`;handle.style.bottom=`${-13*inverseZoom}px`;handle.setAttribute('aria-label',`${node.name||node.type} elem átméretezése`);handle.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown');handle.setAttribute('aria-description','Balra és jobbra a szélesség, fel és le a magasság módosul; Shift+nyíl 10 képpont. A minimum 24 képpont. Ctrl+Z visszavon, Ctrl+Shift+Z újra végrehajt.');handle.title='Nyilak: méret 1 képpont · Shift + nyíl: 10 képpont · minimum: 24 px';handle.onkeydown=e=>resizeCanvasNodeByKeyboard(id,e);handle.onpointerdown=e=>beginCanvasResize(id,e,el);handle.onpointermove=e=>moveCanvasResize(id,e);handle.onpointerup=e=>finishCanvasResize(id,e);handle.onpointercancel=e=>finishCanvasResize(id,e,true);el.append(handle)}el.onpointerdown=e=>{if(inlineEditingId===id)return;if(e.pointerType==='touch'){e.stopPropagation();handleMobilePointerDown(id,e);return}beginCanvasDrag(id,e,el)};el.onpointermove=e=>{if(canvasResize?.nodeId===id){moveCanvasResize(id,e);return}if(e.pointerType==='touch')handleMobilePointerMove(e);else moveCanvasDrag(id,e)};el.onpointerup=e=>{if(canvasResize?.nodeId===id){finishCanvasResize(id,e);return}if(e.pointerType==='touch'){e.stopPropagation();handleMobilePointerUp(id,e);return}finishCanvasDrag(id,e)};el.onpointercancel=e=>{if(canvasResize?.nodeId===id){finishCanvasResize(id,e,true);return}if(e.pointerType==='touch')handleMobilePointerCancel(e);else finishCanvasDrag(id,e,true)};el.onclick=e=>{e.stopPropagation();if(isAuthoredContent(node)&&e.target.closest('.creator-content-host')&&e.target.closest('button,summary,video,audio'))return;if(inlineEditingId===id)return;if(mobileTouch.active&&mobileTouch.suppressClick){mobileTouch.suppressClick=false;return}selectNodeInteraction(id,e)};return el}
function updateCanvasExtent(target=canvas.querySelector('.page-canvas')){if(!target)return;let pageRect=target.getBoundingClientRect();const bottoms=[...target.querySelectorAll('.node')].map(node=>node.getBoundingClientRect().bottom-pageRect.top);target.style.minHeight=`${computeCanvasMinHeight(bottoms,zoom,844,80)}px`;pageRect=target.getBoundingClientRect();const nodes=[...target.querySelectorAll('.node')];const extents=measureCanvasWorkspace(nodes.map(node=>{const rect=node.getBoundingClientRect();return {left:rect.left-pageRect.left,right:rect.right-pageRect.left,top:rect.top-pageRect.top,bottom:rect.bottom-pageRect.top}}),target.offsetWidth,target.offsetHeight,zoom);target.style.left=`${extents.left}px`;target.style.top=`${extents.top}px`;pageRect=target.getBoundingClientRect();for(const node of nodes){const rect=node.getBoundingClientRect();node.classList.toggle('outside-artboard',rect.left<pageRect.left-1||rect.right>pageRect.right+1||rect.top<pageRect.top-1||rect.bottom>pageRect.bottom+1)}const frame=target.parentElement;if(frame?.classList.contains('page-canvas-frame')){frame.style.width=`${(target.offsetWidth+extents.left+extents.right)*zoom}px`;frame.style.height=`${(target.offsetHeight+extents.top+extents.bottom)*zoom}px`}}
function renderCanvas(){const current=page();const previous=canvas.querySelector('.page-canvas');const preserved=previous?.dataset.pageId===current?.id?captureCanvasInteractionState(previous):null;canvas.querySelectorAll('.page-canvas-frame').forEach(x=>x.remove());const device=state?.viewport?.device||'desktop';const deviceLabel={desktop:'Asztali',tablet:'Tablet',mobile:'Telefon'}[device]||'Asztali';const width=sizes[device];const frame=document.createElement('div');frame.className='page-canvas-frame';const pc=document.createElement('div');pc.className='page-canvas';pc.dataset.device=device;pc.dataset.pageId=current?.id||'';pc.style.width=`${width}px`;applyTokenVariables(pc,editorTokens);pc.style.transform=`scale(${zoom})`;if(current){pc.append(renderNode(current,current.rootId));applyStateStyles(pc,current,device);activateCodeBlocks(pc)}frame.append(pc);canvas.append(frame);updateCanvasExtent(pc);restoreCanvasInteractionState(pc,preserved);$('#canvasEmpty').hidden=Boolean(current);$('#canvasMode').textContent=`${deviceLabel} · ${width}px`;$('#zoom').textContent=`${Math.round(zoom*100)}%`;syncDeviceButtons(device)}
function fitCanvasToViewport(){const device=state?.viewport?.device||'desktop';zoom=Math.max(.35,Math.min(1.2,(canvas.clientWidth-48)/sizes[device]));render();window.sanciEditor?.setViewportPreference?.({device,zoom});canvas.scrollTo({left:0,top:0,behavior:'instant'})}
function changeCanvasZoom(next){const frame=canvas.querySelector('.page-canvas-frame');const centerX=canvas.scrollLeft+canvas.clientWidth/2,centerY=canvas.scrollTop+canvas.clientHeight/2;const pointX=frame?(centerX-frame.offsetLeft)/zoom:0,pointY=frame?(centerY-frame.offsetTop)/zoom:0;zoom=next;render();window.sanciEditor?.setViewportPreference?.({device:state?.viewport?.device||'desktop',zoom});requestAnimationFrame(()=>{const updated=canvas.querySelector('.page-canvas-frame');if(!updated)return;canvas.scrollTo({left:Math.max(0,updated.offsetLeft+pointX*zoom-canvas.clientWidth/2),top:Math.max(0,updated.offsetTop+pointY*zoom-canvas.clientHeight/2),behavior:'instant'})})}
function syncDeviceButtons(device){document.querySelectorAll('[data-device]').forEach(b=>{const selected=b.dataset.device===device;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))})}
function syncCanvasToolButtons(tool){for(const [id,value] of [['selectTool','select'],['panTool','pan']]){const button=$('#'+id);const selected=value===tool;button?.classList.toggle('active',selected);button?.setAttribute('aria-pressed',String(selected))}}
function field(label,value,onChange,readOnly=false,multiline=false,composition=null,property=null){
 const wrap=document.createElement('label');wrap.className='field';
 const title=document.createElement('span');title.textContent=label;
 const input=document.createElement(multiline?'textarea':'input');input.value=value??'';input.readOnly=readOnly;if(composition)input.setAttribute('aria-label',label);wrap.append(title,input);
 if(property){
  const contract=getInspectorValueContract(property);
  input.setAttribute('aria-required',String(contract.required===true));
  input.setAttribute('aria-invalid','false');
 }
 if(!readOnly){
  if(composition)wrap.append(composition.attach(input,onChange));
  else{input.onchange=()=>onChange(input.value);if(!multiline)input.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();input.blur()}};}
 }
 return wrap;
}
function commitInspectorText(type,payload,options){
 const saved=command(type,payload,options);
 if(saved&&options?.render===false){renderCanvas();renderLayers();setStatus('Nem mentett módosítás');syncPublishControls();}
 return saved;
}
function normalizeDimension(value,{allowAuto=false}={}){const raw=String(value??'').trim().toLowerCase();if(allowAuto&&raw==='auto')return 'auto';if(!raw)return undefined;if(/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|%|vw|vh|rem|em)$/.test(raw))return raw;if(/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw))return `${raw}px`;return raw}
function resolvedGeometry(node,device){return getNodeGeometry(node,device)}
function responsiveDisplay(node,property,device,fallback){const result=resolveResponsiveValue(node?.responsive,property,device);return result.value??fallback}
function setGeometry(node,device,property,value){const normalized=normalizeDimension(value,{allowAuto:property==='width'||property==='height'});if(normalized===undefined)return;command('responsive.set',{nodeId:node.id,device,patch:{[property]:normalized}})}
function markResponsiveActionRoute(control,keys){
  const list=[...new Set((Array.isArray(keys)?keys:[keys]).filter(Boolean))];
  control.dataset.propertyCommand='responsive.set';
  if(list.length===1)control.dataset.propertyKey=list[0];
  else control.dataset.propertyKeys=JSON.stringify(list);
  return control;
}
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
    const control=propertyInput({...prop,disabled:isNodeEffectivelyLocked(page(),node)},prop.label,values[key],apply);
    const origin=describeResponsiveOrigin(node.responsive,key,device,{
      hasBaseStyle:node.style?.[key]!==undefined&&node.style?.[key]!==null
    });
    const status=document.createElement('small');
    status.className='responsive-origin';
    status.dataset.kind=origin.kind;
    if(origin.source)status.dataset.source=origin.source;
    status.textContent=origin.label;
    status.setAttribute('aria-label',prop.label+': '+origin.label);
    control.append(status);
    section.append(control);
    if(id==='size.width'||id==='size.height')section.append(renderGeometryPresets(id,values[key],apply));
    if(hasResponsiveOverride(node.responsive,key,device)){
      const reset=document.createElement('button');reset.type='button';reset.className='property-reset';
      markResponsiveActionRoute(reset,key);
      reset.textContent='Visszaállítás az örökölt értékre';
      reset.disabled=isNodeEffectivelyLocked(page(),node);
      reset.onclick=()=>{if(!isNodeEffectivelyLocked(page(),node))command('responsive.set',{nodeId:node.id,device,patch:{[key]:undefined}})};
      section.append(reset);
    }
  }
  // Geometry lives in its own Inspector section, outside the property
  // registry groups. Reuse the same canonical atomic reset planner.
  const geometryProperties=['position.x','position.y','size.width','size.height','position.position']
    .map(getProperty).filter(Boolean);
  const geometryResets=responsiveGroupResetActions(node,geometryProperties,device);
  if(geometryResets.length){
    const resetAll=document.createElement('button');
    resetAll.type='button';
    resetAll.className='group-responsive-reset';
    resetAll.textContent='Geometria saját értékeinek visszaállítása ('+geometryResets.length+')';
    markResponsiveActionRoute(resetAll,geometryResets.map(action=>Object.keys(action.payload.patch)[0]));
    resetAll.title='Csak az aktuális nézet X/Y pozíciója, szélessége, magassága és pozicionálási módja tér vissza az örökölt értékhez. Egyetlen Undo lépés.';
    resetAll.setAttribute('aria-label',resetAll.textContent);
    resetAll.disabled=isNodeEffectivelyLocked(page(),node);
    resetAll.onclick=()=>{
      if(isNodeEffectivelyLocked(page(),node)||!commitActiveInspectorControl()||flushRichTextDraft?.()===false)return;
      try{
        executeBatch(state,geometryResets,{label:'Geometria reszponzív visszaállítása',atomic:true});
        render();
      }catch(error){showError(error)}
    };
    section.append(resetAll);
  }
  return section;
}
function renderScheduleInspector(node,composition){
  const config=normalizeScheduleConfig(node.props?.schedule||{});
  const section=document.createElement('section');
  section.className='inspector-group schedule-inspector';
  const title=document.createElement('div');
  title.className='inspector-group-title';
  title.innerHTML='<strong>Adásrend</strong><small>Schedule konfiguráció</small>';
  section.append(title);

  const route=(control,key)=>{
    control.dataset.inspectorCommand='schedule.config.set';
    control.dataset.inspectorKey=key;
    return control;
  };
  const selectField=(label,key,value,options)=>{
    const wrap=route(document.createElement('label'),key);wrap.className='field';
    const text=document.createElement('span');text.textContent=label;
    const select=document.createElement('select');
    for(const optionValue of options){const option=document.createElement('option');option.value=optionValue;option.textContent=key==='mode'?({upcoming:'Következő adások',all:'Összes adás',next:'Egy következő adás',week:'Heti naptár'}[optionValue]||optionValue):optionValue;option.selected=optionValue===value;select.append(option)}
    select.onchange=()=>{
      const patch=key==='mode'&&select.value==='week'
        ?{mode:'week',limit:50,showStatus:true,showEndTime:true,showNotes:true}
        :{[key]:select.value};
      command('schedule.config.set',{nodeId:node.id,patch});
    };
    wrap.append(text,select);return wrap;
  };

  const mode=selectField('Mód','mode',config.mode,SCHEDULE_MODES);
  const order=selectField('Sorrend','order',config.order,SCHEDULE_ORDERS);
  section.append(mode,order);

  const limitField=route(field('Elemszám',String(config.limit),v=>{
    const limit=Math.max(1,Math.min(50,Number.parseInt(v,10)||1));
    command('schedule.config.set',{nodeId:node.id,patch:{limit}});
  }),'limit');
  const limitInput=limitField.querySelector('input');
  limitInput.type='number';limitInput.inputMode='numeric';limitInput.min='1';limitInput.max=String(SCHEDULE_LIMIT_MAX);limitInput.step='1';limitInput.required=true;
  section.append(limitField);

  const statusWrap=route(document.createElement('div'),'statuses');statusWrap.className='field';
  const statusLabel=document.createElement('span');statusLabel.id=`schedule-statuses-${node.id}`;statusLabel.textContent='Státuszok';
  const statusHint=document.createElement('p');statusHint.id=`schedule-statuses-hint-${node.id}`;statusHint.className='property-help';statusHint.textContent='Válassz ki legalább egy státuszt.';
  const statusGrid=document.createElement('div');statusGrid.className='schedule-check-grid';statusGrid.setAttribute('role','group');statusGrid.setAttribute('aria-labelledby',statusLabel.id);statusGrid.setAttribute('aria-describedby',statusHint.id);
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
  statusWrap.append(statusLabel,statusHint,statusGrid);section.append(statusWrap);

  const toggles=[
    ['showTitle','Cím megjelenítése'],['showPlatform','Platform megjelenítése'],
    ['showTime','Kezdés megjelenítése'],['showEndTime','Befejezés megjelenítése'],
    ['showStatus','Státusz megjelenítése'],['showNotes','Megjegyzés megjelenítése'],
    ['showArtwork','Borítóképek megjelenítése'],
    ['showLink','Link megjelenítése']
  ];
  for(const [key,labelText] of toggles){
    const row=route(document.createElement('label'),key);row.className='inspector-toggle';
    const input=document.createElement('input');input.type='checkbox';input.checked=Boolean(config[key]);
    input.onchange=()=>command('schedule.config.set',{nodeId:node.id,patch:{[key]:input.checked}});
    const span=document.createElement('span');span.textContent=labelText;row.append(input,span);section.append(row);
  }
  section.append(route(field('Üres állapot szövege',config.emptyText,(value,options)=>{
    // Validate before command() so an incomplete draft stays in this field,
    // without diagnostics alerts or an update to the canonical Schedule model.
    if(!value.trim())throw new Error('Adj meg szöveget az üres adásrendhez.');
    if(value.trim().length>SCHEDULE_EMPTY_TEXT_MAX)throw new Error(`Legfeljebb ${SCHEDULE_EMPTY_TEXT_MAX} karakter adható meg.`);
    const current=page()?.nodes?.[node.id]?.props?.schedule||{};
    const normalized=normalizeScheduleConfig({...current,emptyText:value});
    return commitInspectorText('schedule.config.set',{nodeId:node.id,patch:{emptyText:normalized.emptyText}},options);
  },isNodeEffectivelyLocked(page(),node),true,composition),'emptyText'));
  const link=document.createElement('a');link.href='/admin/schedule';link.target='_blank';link.rel='noopener noreferrer';
  link.textContent='Adások, időpontok és médiatári képek kezelése ↗';
  link.className='property-help';
  link.style.cssText='display:inline-flex;align-items:center;min-height:44px;margin-top:10px;text-decoration:underline';
  section.append(link);
  return section;
}

function renderRegistryInspector(node,mode='primary'){
  const device=state.viewport.device,root=document.createDocumentFragment();
  const rendered=canvas.querySelector(`.node[data-n…11104 tokens truncated…t blockSelect=document.createElement('select');blockSelect.title='Aktuális blokk típusa';
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
        const richTextTabIdBase='richtext-node-'+Array.from(String(node.id),character=>character.codePointAt(0).toString(16)).join('-');
        for(const [id,label,panel] of [['character','Karakter',characterTools],['paragraph','Bekezdés',paragraphTools],['color','Színek',colorTools]]){
          const button=document.createElement('button');button.type='button';button.id=`${richTextTabIdBase}-tab-${id}`;button.textContent=label;button.setAttribute('role','tab');button.setAttribute('aria-controls',`${richTextTabIdBase}-panel-${id}`);button.tabIndex=richTextToolTab===id?0:-1;button.setAttribute('aria-selected',String(richTextToolTab===id));
          panel.id=`${richTextTabIdBase}-panel-${id}`;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',button.id);
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
        editor.dataset.textNodeId=node.id;editor.contentEditable=isNodeEffectivelyLocked(page(),node)?'false':'true';applyTextSurfaceStyle(editor,node);editor.spellcheck=true;editor.setAttribute('role','textbox');
        editor.setAttribute('aria-label','Rich Text szerkesztő');
        renderRichTextEditor(editor,currentRichText);
        let linkTargetSelect;
        let richTextDirty=false, savedLinkSelection=richTextBookmark?.nodeId===node.id?richTextBookmark.range:null,
          savedFormatSelection=richTextBookmark?.nodeId===node.id?richTextBookmark.formatRange:null,
          savedBlockIndex=richTextBookmark?.nodeId===node.id?richTextBookmark.blockIndex:null,
          savedBlockTransformSelection=richTextBookmark?.nodeId===node.id?richTextBookmark.transformSelection:null,composing=false,compositionRevision=0,
          savedSelectionOffsets=richTextBookmark?.nodeId===node.id?richTextBookmark.selectionOffsets??null:null;
        const typingGroup=crypto.randomUUID();
        const bookmarkedCanvas=richTextBookmark?.nodeId===node.id&&richTextBookmark.source==='canvas'
          ?canvas.querySelector(`.node[data-node-id="${CSS.escape(node.id)}"] .richtext-inline-surface`):null;
        let formattingSurface=bookmarkedCanvas||editor;
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
        const rememberSelection=(syncLinkFields=true)=>{
          const canvasEditor=canvas.querySelector(`.node[data-node-id="${CSS.escape(node.id)}"] .richtext-inline-surface`);
          const native=window.getSelection();
          const surface=canvasEditor&&native?.anchorNode&&canvasEditor.contains(native.anchorNode)?canvasEditor:editor;
          const offsets=getSelectionOffsets(surface);if(!offsets)return;
          // Keep the native anchor/focus direction too. Toolbar focus moves
          // commonly remove the DOM Range on touch devices; reducing this to
          // from/to here would discard a backward selection before the shared
          // Rich Text restore path can reattach it.
          formattingSurface=surface;savedSelectionOffsets={...offsets};
          const format=getRichTextFormattingSelection(surface);savedFormatSelection=format;
          savedBlockTransformSelection=getRichTextBlockTransformSelection(surface);
          // Same-block selections retain caret-in-link expansion; when a
          // native selection spans paragraphs/lists/cells, use canonical
          // per-block segments instead of dropping the link selection.
          const next=getRichTextBlockSelection(surface)||getRichTextFormattingSelection(surface);savedLinkSelection=next;
          const currentRichText=richTextEditorToDocument(surface);
          if(linkTargetSelect)linkTargetSelect.value=readRichTextLinkTarget(currentRichText,next);
          if(syncLinkFields&&url){
            const href=readRichTextLinkHref(currentRichText,next);
            url.value=href==='mixed'?'':href;
            url.placeholder=href==='mixed'?'Vegyes hivatkozások':'/p/home vagy https://...';
            url.dispatchEvent(new Event('input',{bubbles:true}));
          }
          const index=getRichTextActiveBlockIndex(surface);
          if(index!==null){
            savedBlockIndex=index;const active=richTextEditorToDocument(surface).blocks[index];
            if(active){blockSelect.value=active.type==='heading'?`heading-${active.level||1}`:active.type;blockSelect.disabled=active.type==='table';alignmentSelect.value=active.align||'left';alignmentSelect.disabled=!['paragraph','heading','quote'].includes(active.type)}
          }
          richTextBookmark={nodeId:node.id,range:savedLinkSelection,formatRange:savedFormatSelection,blockIndex:savedBlockIndex,transformSelection:savedBlockTransformSelection,selectionOffsets:savedSelectionOffsets,source:surface===canvasEditor?'canvas':'inspector'};
          refreshFormattingControls(format,surface);
        };
        // Preserve a word selection when toolbar focus or DOM re-render removes the native Range.
        // Reattach to the Inspector copy if the original canvas surface is no longer mounted.
        const restoreFormattingSelection=()=>{
          if(!savedFormatSelection&&!savedSelectionOffsets)return false;
          const target=formattingSurface?.isConnected?formattingSurface:editor;
          if(!target.isConnected)return false;
          target.focus({preventScroll:true});
          // A per-block bookmark is authoritative for paragraph/list/table spans.
          // Flattened offsets do not include exactly the same block separators.
          const restored=(savedFormatSelection&&restoreRichTextFormattingSelection(target,savedFormatSelection))||
            (savedSelectionOffsets&&restoreSelectionOffsets(target,savedSelectionOffsets));
          if(!restored)return false;
          rememberSelection();return true;
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
        toolbar.onpointerdown=()=>rememberSelection(false);
        blockSelect.onpointerdown=()=>rememberSelection(false);
        blockSelect.setAttribute('aria-label','Szövegblokkok típusa');
        blockSelect.onchange=()=>{
          if(composing){formatStatus.textContent='Fejezd be a szövegbevitelt a blokk átalakítása előtt.';return}
          const doc=richTextEditorToDocument(editor);
          const targets=savedBlockTransformSelection||getRichTextBlockTransformSelection(editor)||
            savedFormatSelection?.segments;
          const indices=targets?.map(item=>item.blockIndex)??
            [savedBlockIndex??getRichTextActiveBlockIndex(editor)].filter(index=>index!==null);
          if(!indices.length){formatStatus.textContent='Előbb helyezd a kurzort egy szövegblokkba.';return}
          const type=blockSelect.value.startsWith('heading-')?'heading':blockSelect.value;
          const level=type==='heading'?Number(blockSelect.value.split('-')[1]):1;
          try{
            const next=transformRichTextBlockTypes(doc,indices,type,level,targets);
            // Block conversion changes top-level indices. Save the model-aligned
            // text offset rather than trying to restore obsolete block indices.
            const selectionOffsets=getSelectionOffsets(formattingSurface)||savedSelectionOffsets;
            if(command('richtext.content.set',{nodeId:node.id,document:next},{render:false})){
              richTextDirty=false;renderRichTextEditor(editor,next);refreshCanvasRichText(next);
              savedFormatSelection=null;savedLinkSelection=null;savedBlockIndex=null;
              savedBlockTransformSelection=null;richTextBookmark=null;formattingSurface=editor;
              savedSelectionOffsets=selectionOffsets;
              if(selectionOffsets&&restoreSelectionOffsets(editor,selectionOffsets))rememberSelection();
              setStatus('Nem mentett módosítás');syncPublishControls();
              formatStatus.textContent='Blokktípus módosítva. A külön Mentés nem publikálja az oldalt.';
            }
          }catch(error){
            formatStatus.textContent=error instanceof Error?error.message:String(error);
            const block=doc.blocks[indices[0]];
            if(block)blockSelect.value=block.type==='heading'?'heading-'+(block.level||1):block.type;
          }
        };
        alignmentSelect.onpointerdown=()=>rememberSelection(false);
        alignmentSelect.onchange=()=>{
          const doc=richTextEditorToDocument(editor),index=savedBlockIndex??getRichTextActiveBlockIndex(editor);if(index===null){formatStatus.textContent='Előbb kattints abba a bekezdésbe, amelyet igazítani szeretnél.';return}
          try{const selection=savedFormatSelection||getRichTextFormattingSelection(editor),indices=selection?.segments?.map(segment=>segment.blockIndex)??[index],next=updateRichTextBlockAlignment(doc,indices,alignmentSelect.value);if(command('richtext.content.set',{nodeId:node.id,document:next},{render:false})){richTextDirty=false;renderRichTextEditor(editor,next);refreshCanvasRichText(next);restoreFormattingSelection();setStatus('Nem mentett módosítás');syncPublishControls()}}catch(error){formatStatus.textContent=error instanceof Error?error.message:String(error)}
        };
        const applyMarkActions=new Map();
        for(const [mark,label,glyph] of [['bold','Félkövér','B'],['italic','Dőlt','I'],['underline','Aláhúzott','U'],['strikethrough','Áthúzott','S'],['subscript','Alsó index','x₂'],['superscript','Felső index','x²'],['code','Kódformázás','</>']]){
          const button=document.createElement('button');button.type='button';button.textContent=glyph;button.dataset.mark=mark;button.title=label;
          button.setAttribute('aria-label',label);button.onpointerdown=event=>{rememberSelection(false);event.preventDefault()};
          const applyMark=()=>{
            const nativeSelection=window.getSelection();
            const hasNativeSelection=Boolean(nativeSelection?.rangeCount&&!nativeSelection.isCollapsed&&formattingSurface.contains(nativeSelection.anchorNode)&&formattingSurface.contains(nativeSelection.focusNode));
            // The canvas and Inspector are two views of one document. Prefer a
            // live canvas selection when it exists, so all marks (including
            // multi-block code) use the structured Page Model operation rather
            // than the browser's legacy execCommand fallback.
            const nativeRange=hasNativeSelection?getRichTextFormattingSelection(formattingSurface):null;
            const range=nativeRange||savedFormatSelection||getRichTextFormattingSelection(editor);
            if(!range&&!hasNativeSelection&&!savedSelectionOffsets){button.title='Előbb jelölj ki egy szövegrészt.';return}
            if(composing){button.title='Várd meg a mobilos szövegbevitel befejezését.';return}
            try{
              if(!range){
                const commands={bold:'bold',italic:'italic',underline:'underline',strikethrough:'strikeThrough',subscript:'subscript',superscript:'superscript'};
                if(!commands[mark])throw new Error('A több blokkra kiterjedő kódformázás még nem támogatott.');
                formattingSurface.focus();if(!hasNativeSelection&&savedSelectionOffsets)restoreSelectionOffsets(formattingSurface,savedSelectionOffsets);
                if(!document.execCommand(commands[mark],false,null))throw new Error('A böngésző nem tudta végrehajtani a formázást.');
                const doc=richTextEditorToDocument(formattingSurface);if(commitWithoutRender(doc)){renderRichTextEditor(editor,doc);restoreFormattingSelection();button.title=label+' alkalmazva';}return;
              }
              const source=nativeRange?formattingSurface:editor;
              const doc=richTextEditorToDocument(source),next=updateRichTextInlineMark(doc,range,mark);
              if(command('richtext.content.set',{nodeId:node.id,document:next},{render:false})){
                richTextDirty=false;renderRichTextEditor(editor,next);refreshCanvasRichText(next);if(!restoreFormattingSelection()&&range.blockIndex!==undefined){restoreRichTextBlockSelection(editor,range);rememberSelection()}setStatus('Nem mentett módosítás');syncPublishControls();button.title=label+' alkalmazva';
              }
            }catch(e){button.title=e instanceof Error?e.message:String(e)}
          };
          button.onclick=applyMark;applyMarkActions.set(mark,applyMark);
          characterTools.append(button);
        }
        const applyInlineStyle=(key,value)=>{
          const range=savedFormatSelection||getRichTextFormattingSelection(editor);if(!range){formatStatus.textContent='Előbb jelölj ki egy szövegrészt.';return false}
          try{const doc=richTextEditorToDocument(editor),next=updateRichTextInlineStyle(doc,range,key,value);if(command('richtext.content.set',{nodeId:node.id,document:next},{render:false})){richTextDirty=false;renderRichTextEditor(editor,next);refreshCanvasRichText(next);if(!restoreFormattingSelection()&&range.blockIndex!==undefined){restoreRichTextBlockSelection(editor,range);rememberSelection()}setStatus('Nem mentett módosítás');syncPublishControls();return true}}catch(error){formatStatus.textContent=error instanceof Error?error.message:String(error)}return false
        };
        fontFamilySelect.onpointerdown=()=>rememberSelection(false);fontFamilySelect.onchange=()=>applyInlineStyle('fontFamily',fontFamilySelect.value);
        fontSizeInput.onpointerdown=()=>rememberSelection(false);fontSizeInput.oninput=()=>{fontSizeInput.dataset.pending='true'};fontSizeInput.onchange=()=>{const size=Number(fontSizeInput.value);delete fontSizeInput.dataset.pending;if(!Number.isInteger(size)||size<8||size>96){formatStatus.textContent='A betűméret 8 és 96 képpont között lehet.';return}applyInlineStyle('fontSize',`${size}px`)};
        fontSizeInput.onblur=()=>{if(fontSizeInput.dataset.pending==='true')fontSizeInput.onchange()};fontSizeInput.onkeydown=event=>{if(['Tab','Enter'].includes(event.key)&&fontSizeInput.dataset.pending==='true'){fontSizeInput.onchange();if(event.key==='Enter'){event.preventDefault();fontSizeInput.blur()}}};
        for(const [key,label] of [['color','Betűszín'],['backgroundColor','Kiemelés színe']]){
          const wrapper=document.createElement('label');wrapper.className='richtext-color-control';wrapper.title=label;
          const text=document.createElement('span');text.textContent=label;
          const input=document.createElement('input');input.type='color';input.value=key==='color'?'#243247':'#fff29a';input.setAttribute('aria-label',label);
          input.dataset.styleKey=key;input.onpointerdown=()=>rememberSelection(false);input.onchange=()=>applyInlineStyle(key,input.value);
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
        url.onpointerdown=()=>rememberSelection(false);
        linkTargetSelect=document.createElement('select');linkTargetSelect.setAttribute('aria-label','Link megnyitása');
        [['auto','Automatikus · külső link új lapon'],['_self','Ugyanebben a lapon'],['_blank','Új lapon'],['mixed','Vegyes · célok megőrzése']]
          .forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;if(value==='mixed')option.disabled=true;linkTargetSelect.append(option)});
        linkTargetSelect.onpointerdown=()=>rememberSelection(false);
        const addLink=document.createElement('button');addLink.type='button';addLink.textContent='Link beállítása';
        const removeLink=document.createElement('button');removeLink.type='button';removeLink.textContent='Link eltávolítása';
        const linkFeedback=document.createElement('small');linkFeedback.setAttribute('role','status');
        const changeLink=href=>{
          const range=savedLinkSelection||getRichTextBlockSelection(editor)||getRichTextFormattingSelection(editor);
          if(!range){linkFeedback.textContent='Jelölj ki egy szövegrészt előbb.';return;}
          try{
            const target=linkTargetSelect.value==='mixed'?'preserve':linkTargetSelect.value;
            const doc=updateRichTextInlineLink(richTextEditorToDocument(editor),range,href,target);
            linkFeedback.textContent='';
            const offsets=getSelectionOffsets(formattingSurface)||savedSelectionOffsets;
            if(command('richtext.content.set',{nodeId:node.id,document:doc},{render:false})){
              richTextDirty=false;const temporary=document.createElement('div');renderRichTextEditor(temporary,doc);editor.replaceChildren(...temporary.childNodes);
              refreshCanvasRichText(doc);savedSelectionOffsets=offsets;restoreFormattingSelection();setStatus('Nem mentett módosítás');syncPublishControls();
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
        editor.addEventListener('input',()=>{
          richTextDirty=true;flushRichTextDraft=saveRich;
          // The DOM has changed, so block/link ranges must be recalculated.
          // Keep a fresh text-offset bookmark after the browser has placed
          // the caret, otherwise Undo/Redo or an Inspector rebuild loses it.
          savedLinkSelection=null;savedFormatSelection=null;savedSelectionOffsets=null;richTextBookmark=null;
          requestAnimationFrame(()=>{if(editor.isConnected)rememberSelection()});
          if(!composing)saveRich();
        });
        editor.addEventListener('focus',()=>{flushRichTextDraft=saveRich});
        editor.addEventListener('keydown',event=>{
          if(!(event.ctrlKey||event.metaKey)||event.altKey)return;
          if(event.key.toLowerCase()==='k'){
            event.preventDefault();rememberSelection();
            url.focus({preventScroll:true});
            return;
          }
          const mark={b:'bold',i:'italic',u:'underline'}[event.key.toLowerCase()];
          if(!mark)return;
          event.preventDefault();rememberSelection();applyMarkActions.get(mark)?.();
        });
        editor.addEventListener('beforeinput',()=>{richTextDirty=true});
        editor.addEventListener('compositionstart',()=>{compositionRevision++;composing=true});
        editor.addEventListener('compositionupdate',()=>{composing=true});
        editor.addEventListener('compositionend',()=>{
          richTextDirty=true;const revision=compositionRevision;
          // Wait until the mobile keyboard has delivered its final input event
          // before reconciling the document or updating the canvas surface.
          requestAnimationFrame(()=>{
            if(revision!==compositionRevision)return;
            composing=false;
            if(editor.isConnected){saveRich();rememberSelection()}
          });
        });
        document.addEventListener('selectionchange',selectionObserver);richTextSelectionCleanup=()=>document.removeEventListener('selectionchange',selectionObserver);
        editor.addEventListener('paste',()=>requestAnimationFrame(rememberSelection));
        editor.addEventListener('mouseup',rememberSelection);
        editor.addEventListener('keyup',rememberSelection);
        editor.addEventListener('touchend',()=>requestAnimationFrame(rememberSelection));
        editor.addEventListener('blur',event=>{
          if(richTextDirty&&!section.contains(event.relatedTarget))saveRich();
        });
        url.onfocus=()=>rememberSelection();
        url.onkeydown=event=>{
          if(event.key==='Escape'){
            event.preventDefault();
            // The mobile shell also uses Escape to close its panels. This
            // field owns Escape while a Rich Text link edit is in progress:
            // keep the Inspector mounted so the exact selection can return.
            event.stopPropagation();
            // Returning from a URL input is a caret operation. Prefer the
            // exact text-offset bookmark over a structural formatting range,
            // which may no longer match after an Inspector rerender.
            const target=formattingSurface?.isConnected?formattingSurface:editor;
            target.focus({preventScroll:true});
            if(!savedSelectionOffsets||!restoreSelectionOffsets(target,savedSelectionOffsets))restoreFormattingSelection();
          }else if(event.key==='Enter'){
            event.preventDefault();
            changeLink(url.value);
          }
        };
        const pagePicker=pageLinkPicker(pages,url);pagePicker.onpointerdown=()=>rememberSelection(false);pagePicker.style.gridColumn='1 / -1';linkControls.append(url,pagePicker,linkTargetSelect,addLink,removeLink,linkFeedback);
        const clearFormat=document.createElement('button');clearFormat.type='button';clearFormat.textContent='Alapformázás';clearFormat.setAttribute('aria-label','Kijelölt szöveg formázásának törlése');clearFormat.title='Az elem alapstílusának visszaállítása a kijelölt szavakon. A szöveg és a linkek megmaradnak.';
        clearFormat.onpointerdown=event=>{rememberSelection(false);event.preventDefault()};
        clearFormat.onclick=()=>{const range=savedFormatSelection;if(!range){formatStatus.textContent='Előbb jelölj ki egy szövegrészt.';return}const doc=clearRichTextInlineFormatting(richTextEditorToDocument(editor),range);if(commitWithoutRender(doc)){renderRichTextEditor(editor,doc);restoreFormattingSelection()}};
        characterTools.append(clearFormat);
        const scope=document.createElement('div');scope.className='richtext-scope-banner';scope.setAttribute('role','status');scope.textContent='Élő szöveg · kijelölt rész formázása';
        section.append(scope,editor,toolbar,linkControls);
        if(isNodeEffectivelyLocked(page(),node)){toolbar.inert=true;linkControls.inert=true}
        requestAnimationFrame(()=>{
          if(!editor.isConnected)return;
          if(richTextBookmark?.nodeId===node.id&&savedSelectionOffsets){
            const target=formattingSurface?.isConnected?formattingSurface:editor;
            target.focus({preventScroll:true});
            restoreSelectionOffsets(target,savedSelectionOffsets);
          }
          refreshFormattingControls(null,formattingSurface?.isConnected?formattingSurface:editor);
        });
        inspector.append(section);
      }else if(textTypes.has(node.type))inspector.append(renderPlainTextEditor(node));
      if(hasContentProfile(node,'code-v1'))inspector.append(renderCodeSnippetInspector(node,(model,{render:fullRender=true,typingGroup}={})=>{
        const saved=command('element.update',{nodeId:node.id,patch:{props:{...(node.props||{}),codeSnippet:model}}},{render:fullRender,typingGroup});
        if(saved&&!fullRender){renderCanvas();setStatus('Nem mentett módosítás');syncPublishControls();}
        return saved;
      },{pending:flush=>{flushRichTextDraft=flush}}));
      else if(renderExistingContentInspector(node)){}
      else if(CONTENT_TYPES.includes(node.type))inspector.append(renderElementContentControls(node,{
        exclude:textTypes.has(node.type)?['text']:[],
        resolveExternalField:key=>key==='text'?inspector.querySelector(`.plain-text-editor[data-text-node-id="${CSS.escape(node.id)}"]`):null,
        pages,pageNodes:page()?.nodes,pending:flush=>{flushRichTextDraft=flush},
        apply:(patch,{typingGroup,render:fullRender=false}={})=>{const property=Object.hasOwn(patch,'href')?getProperty('content.href'):null;const saved=command(property?.command||'content.properties.set',{nodeId:node.id,patch},{render:fullRender,typingGroup});if(saved&&!fullRender){renderCanvas();setStatus('Nem mentett módosítás');syncPublishControls()}return saved}
      }));
      else if(STRUCTURAL_TYPES.includes(node.type))inspector.append(Object.assign(document.createElement('p'),{className:'content-field-help',textContent:'Ez a tároló a gyermekeit jeleníti meg. Tartalomhoz adj hozzá szöveget, képet vagy más elemet.'}));
      else if(!textTypes.has(node.type))inspector.append(Object.assign(document.createElement('p'),{className:'content-field-help',textContent:'Ehhez az elemhez a közös szolgáltatás és a részletes szerkesztő még hiányzik. A meglévő adatok megmaradnak.'}));
      if(isAuthoredContent(node)&&node.type==='button')inspector.append(renderPageInteractionControls(node,page(),interactions=>command('element.update',{nodeId:node.id,patch:{interactions}}),effectivelyLocked));
    }
  }else{
    inspector.append(renderRegistryInspector(node,'advanced'));
    inspector.append(renderAccessibilityInspector(node),renderStatesInspector(node));
    inspector.append(field('Node ID',node.id,()=>{},true),field('Típus',node.type,()=>{},true),field('Szülő ID',node.parentId||'',()=>{},true));
  }
  const actions=document.createElement('div');actions.className='inspector-actions';const del=document.createElement('button');del.type='button';del.className='danger-action';del.dataset.inspectorCommand='element.delete';del.dataset.inspectorNodeId=node.id;const deleteIds=[node.id],pageNodes=page()?.nodes??{};for(let index=0;index<deleteIds.length;index++)deleteIds.push(...(pageNodes[deleteIds[index]]?.children??[]));del.dataset.inspectorKeys=JSON.stringify([...deleteIds.map(id=>`nodes.${id}`),...(node.parentId?[`nodes.${node.parentId}.children`]:[])]);del.textContent='Törlés';const lockedParent=isLockedParent(page(),node);del.disabled=node.id===page()?.rootId||isNodeEffectivelyLocked(page(),node)||lockedParent;del.title=lockedParent?'A zárolt szülő gyerekei nem törölhetők':del.disabled?'A gyökér- vagy zárolt elem nem törölhető':'Kijelölt elem törlése';del.onclick=()=>{if(!del.disabled)command('element.delete',{nodeId:node.id})};actions.append(del);inspector.append(actions);
  if(effectivelyLocked){
    // Content and legacy inspectors share this boundary with typed Style fields.
    // Disable every mutation at the DOM boundary, but preserve search, category
    // navigation, state preview, explanations and the way back out of the lock.
    for(const control of inspector.querySelectorAll('input,select,textarea,button')){
      if((control.matches('.inspector-lock-toggle')&&!lockedAncestor)||control.matches('.property-info-toggle,.style-copy-button,[aria-label="Állapot előnézete"]')||control.closest('.inspector-search,.inspector-category-nav,.richtext-tool-tabs'))continue;
      control.disabled=true;
    }
    for(const editor of inspector.querySelectorAll('[contenteditable]'))editor.contentEditable='false';
  }
  filterInspector();restoreScroll()
}
function clearHierarchyDrag(){hierarchyDrag.nodeId=null;hierarchyDrag.overId=null;document.querySelectorAll('.layer-row.drag-over,.layer-row.dragging').forEach(el=>el.classList.remove('drag-over','dragging'))}
function clearMobileHierarchyDrag(){clearTimeout(mobileHierarchyDrag.timer);mobileHierarchyDrag.active=false;mobileHierarchyDrag.timer=null;mobileHierarchyDrag.nodeId=null;mobileHierarchyDrag.overId=null;mobileHierarchyDrag.suppressClick=false;document.querySelectorAll('.layer-row.mobile-dragging,.layer-row.mobile-drag-over,.layer-drag-handle.armed').forEach(el=>el.classList.remove('mobile-dragging','mobile-drag-over','armed'))}
function isDescendant(current,nodeId,targetId){let cursor=getNode(current,targetId);while(cursor){if(cursor.id===nodeId)return true;cursor=cursor.parentId?getNode(current,cursor.parentId):null}return false}
function isLockedParent(current,node){let ancestorId=node?.parentId;while(ancestorId){const ancestor=getNode(current,ancestorId);if(!ancestor)return false;if(ancestor.locked)return true;ancestorId=ancestor.parentId}return false}
function isNodeEffectivelyLocked(current,node){return Boolean(node?.locked||isLockedParent(current,node))}
function getLayerMoveAction(current,nodeId,kind){const node=current&&getNode(current,nodeId);if(!node||node.id===current.rootId||isNodeEffectivelyLocked(current,node)||!node.parentId)return null;const parent=getNode(current,node.parentId);if(!parent||isNodeEffectivelyLocked(current,parent))return null;const siblings=getChildren(current,parent.id).map(child=>child.id);const index=siblings.indexOf(node.id);if(index<0)return null;if(kind==='up'&&index>0)return{type:'hierarchy.reorder',payload:{nodeId,index:index-1}};if(kind==='down'&&index<siblings.length-1)return{type:'hierarchy.reorder',payload:{nodeId,index:index+1}};if(kind==='indent'&&index>0){const previous=getNode(current,siblings[index-1]);if(previous&&!isNodeEffectivelyLocked(current,previous)&&canContain(previous,node.type))return{type:'hierarchy.reparent',payload:{nodeId,parentId:previous.id,index:getChildren(current,previous.id).length}}}if(kind==='outdent'&&parent.parentId){const grandparent=getNode(current,parent.parentId);const grandparentChildren=grandparent?getChildren(current,grandparent.id).map(child=>child.id):[];const parentIndex=grandparentChildren.indexOf(parent.id);if(grandparent&&!isNodeEffectivelyLocked(current,grandparent)&&canContain(grandparent,node.type)&&parentIndex>=0)return{type:'hierarchy.reparent',payload:{nodeId,parentId:grandparent.id,index:parentIndex+1}}}return null}
function moveSelectedLayer(kind,{restoreFocus=false}={}){const current=page(),nodeId=state?.selection?.ids?.length===1?state.selection.primaryId:null,action=nodeId&&current?getLayerMoveAction(current,nodeId,kind):null;if(!action)return false;const moved=command(action.type,action.payload);if(moved){setStatus('Rétegsorrend frissítve — mentés szükséges');if(restoreFocus){const row=$(`#layersTree .layer-row[data-node-id="${CSS.escape(nodeId)}"]`);row?.focus({preventScroll:true});row?.scrollIntoView({block:'nearest'})}}return moved}
function resolveLayerDrop(current,sourceId,targetId){const source=getNode(current,sourceId);const target=getNode(current,targetId);if(!source||!target||source.id===current.rootId||isNodeEffectivelyLocked(current,source)||isNodeEffectivelyLocked(current,target)||source.id===target.id)return null;if(isDescendant(current,sourceId,targetId))return null;if(canContain(target,source.type))return {type:'hierarchy.reparent',payload:{nodeId:sourceId,parentId:target.id,index:getChildren(current,target.id).length}};if(source.parentId!==target.parentId)return null;const parent=getNode(current,source.parentId);if(!parent||isNodeEffectivelyLocked(current,parent))return null;const siblings=getChildren(current,parent.id).map(child=>child.id);let index=siblings.indexOf(target.id);const sourceIndex=siblings.indexOf(source.id);if(index<0||sourceIndex<0)return null;if(sourceIndex<index)index-=1;return {type:'hierarchy.reorder',payload:{nodeId:sourceId,index}}}
function handleLayerDragStart(id,event,row){const current=page();const node=current?getNode(current,id):null;if(!node||node.id===current?.rootId||isNodeEffectivelyLocked(current,node)){event.preventDefault();return}hierarchyDrag.nodeId=id;hierarchyDrag.overId=null;row.classList.add('dragging');if(event.dataTransfer){event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',id)}}
function handleLayerDragOver(id,event,row){const current=page();if(!hierarchyDrag.nodeId||!current){return}event.preventDefault();const action=resolveLayerDrop(current,hierarchyDrag.nodeId,id);if(!action){if(event.dataTransfer)event.dataTransfer.dropEffect='none';row.classList.remove('drag-over');hierarchyDrag.overId=null;return}hierarchyDrag.overId=id;if(event.dataTransfer)event.dataTransfer.dropEffect='move';document.querySelectorAll('.layer-row.drag-over').forEach(el=>el.classList.remove('drag-over'));row.classList.add('drag-over')}
function handleLayerDrop(id,event,row){event.preventDefault();const current=page();const sourceId=hierarchyDrag.nodeId;const action=sourceId&&current?resolveLayerDrop(current,sourceId,id):null;clearHierarchyDrag();if(action)command(action.type,action.payload)}
function handleMobileLayerDragStart(id,event,handle){if(event.pointerType!=='touch')return;event.preventDefault();event.stopPropagation();const current=page();const node=current?getNode(current,id):null;if(!node||node.id===current?.rootId||isNodeEffectivelyLocked(current,node))return;clearMobileHierarchyDrag();mobileHierarchyDrag.nodeId=id;mobileHierarchyDrag.startX=event.clientX;mobileHierarchyDrag.startY=event.clientY;mobileHierarchyDrag.suppressClick=true;handle.classList.add('armed');mobileHierarchyDrag.timer=setTimeout(()=>{mobileHierarchyDrag.timer=null;mobileHierarchyDrag.active=true;const row=handle.closest('.layer-row');row?.classList.add('mobile-dragging')},450)}
function handleMobileLayerDragMove(event){if(event.pointerType!=='touch'||!mobileHierarchyDrag.nodeId)return;event.preventDefault();event.stopPropagation();const dx=Math.abs(event.clientX-mobileHierarchyDrag.startX);const dy=Math.abs(event.clientY-mobileHierarchyDrag.startY);if(!mobileHierarchyDrag.active){if(dx>10||dy>10){clearMobileHierarchyDrag();return}return}const row=document.elementFromPoint(event.clientX,event.clientY)?.closest('.layer-row');const targetId=row?.dataset.nodeId;const current=page();const action=current&&targetId?resolveLayerDrop(current,mobileHierarchyDrag.nodeId,targetId):null;document.querySelectorAll('.layer-row.mobile-drag-over').forEach(el=>el.classList.remove('mobile-drag-over'));if(action){mobileHierarchyDrag.overId=targetId;row.classList.add('mobile-drag-over')}else mobileHierarchyDrag.overId=null}
function handleMobileLayerDragEnd(event){if(event.pointerType!=='touch')return;event.preventDefault();event.stopPropagation();const current=page();const sourceId=mobileHierarchyDrag.nodeId;const targetId=mobileHierarchyDrag.overId;const action=current&&sourceId&&targetId?resolveLayerDrop(current,sourceId,targetId):null;const wasActive=mobileHierarchyDrag.active;clearMobileHierarchyDrag();if(wasActive&&action){event.preventDefault();command(action.type,action.payload)}}
function beginLayerRename(id){
  if(!flushLayerRename())return false;
  const current=page();
  const node=current?getNode(current,id):null;
  if(!node||node.id===current.rootId||isNodeEffectivelyLocked(current,node))return false;
  const entry=document.querySelector(`#layersTree .layer-entry[data-node-id="${CSS.escape(id)}"]`);
  if(!entry)return false;
  entry.querySelector('.layer-rename-editor')?.remove();
  const form=document.createElement('form');
  form.className='layer-rename-editor';
  form.noValidate=true;
  form.setAttribute('aria-label',`Réteg átnevezése: ${node.name||node.type}`);
  const input=document.createElement('input');
  input.type='text';
  input.value=node.name||'';
  input.required=true;
  input.setAttribute('aria-required','true');
  input.setAttribute('aria-invalid','false');
  input.setAttribute('aria-label','Réteg neve');
  const status=document.createElement('small');
  status.className='layer-rename-status';
  status.id=`layer-rename-status-${crypto.randomUUID()}`;
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  input.setAttribute('aria-describedby',status.id);
  let composing=false,compositionRevision=0;
  const save=document.createElement('button');
  save.type='submit';
  save.textContent='Mentés';
  const cancel=document.createElement('button');
  cancel.type='button';
  cancel.textContent='Mégse';
  cancel.setAttribute('aria-label','Réteg átnevezésének megszakítása');
  const renameState=state,renamePageId=current.id;
  const close=(focus=true)=>{if(pendingLayerRename===commit)pendingLayerRename=null;form.remove();syncPublishControls();if(focus)entry.querySelector('.layer-row')?.focus()};
  form.append(input,save,cancel,status);
  const commit=()=>{
    if(composing){setStatus('Fejezd be a szövegbevitelt a folytatás előtt.');input.focus();return false}
    const name=input.value.trim();
    if(!name){input.setAttribute('aria-invalid','true');status.textContent='A réteg neve nem lehet üres.';input.focus();return false}
    if(state!==renameState||page()?.id!==renamePageId||!getNode(page(),id)){setStatus('A réteg már nem érhető el.');input.focus();return false}
    const latest=getNode(page(),id);
    if(name===(latest.name||'')){close(false);return true}
    pendingLayerRename=null;
    if(!command('element.update',{nodeId:id,patch:{name}},{render:false})){pendingLayerRename=commit;input.focus();return false}
    close(false);setStatus('Nem mentett módosítás');syncPublishControls();return true;
  };
  commit.dirty=()=>input.value.trim()!==(getNode(page(),id)?.name||'');
  pendingLayerRename=commit;
  form.addEventListener('submit',event=>{
    event.preventDefault();event.stopPropagation();
    if(commit()){render();document.querySelector(`#layersTree .layer-row[data-node-id="${CSS.escape(id)}"]`)?.focus()}
  });
  input.addEventListener('input',()=>{input.setAttribute('aria-invalid','false');status.textContent='';syncPublishControls()});
  input.addEventListener('compositionstart',()=>{compositionRevision++;composing=true});
  input.addEventListener('compositionend',()=>{
    composing=true;
    const revision=++compositionRevision;
    // Some mobile IMEs deliver the confirmed replacement after compositionend.
    // Keep Enter/Escape inert until that final input can update this field.
    requestAnimationFrame(()=>{if(revision===compositionRevision&&form.isConnected)composing=false});
  });
  input.addEventListener('keydown',event=>{
    if(composing||event.isComposing||event.keyCode===229){
      if(event.key==='Enter'||event.key==='Escape')event.preventDefault();
      event.stopPropagation();
      return;
    }
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close()}
  });
  cancel.addEventListener('click',close);
  entry.append(form);
  input.focus();
  input.select();
  return true;
}
function renderLayers({focusId=null}={}){
  if(!flushLayerRename())return;
  $('#leftPanelLayers')?.querySelector('[data-validation-kind="publication"][data-recovery-kind="unsupported-node"]')?.remove();
  const root=$('#layersTree');
  const current=page();
  if(!root||!current)return;
  root.replaceChildren();
  const collapsedLayerNodes=collapsedLayerNodesByPage.get(current.id)||new Set();
  collapsedLayerNodesByPage.set(current.id,collapsedLayerNodes);
  let layerGroupSequence=0;
  const walk=(id,depth=0,siblingIndex=0,siblingCount=1)=>{
    const node=getNode(current,id);
    if(!node)return;
    const locked=isNodeEffectivelyLocked(current,node);
    const inheritedLock=isLockedParent(current,node);
    const entry=document.createElement('div');
    entry.className='layer-entry';
    entry.dataset.nodeId=id;
    entry.setAttribute('role','none');
    const row=document.createElement('button');
    row.type='button';
    row.dataset.nodeId=id;
    row.draggable=node.id!==current.rootId&&!locked;
    row.className=`layer-row ${state.selection.primaryId===id?'active':''} ${locked?'locked':''} ${inheritedLock?'locked-ancestor':''}`;
    row.tabIndex=state.selection.primaryId===id?0:-1;
    row.setAttribute('role','treeitem');
    row.setAttribute('aria-level',String(depth+1));
    row.setAttribute('aria-posinset',String(siblingIndex+1));
    row.setAttribute('aria-setsize',String(siblingCount));
    row.setAttribute('aria-selected',String(state.selection.ids.includes(id)));
    row.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight Home End Shift+ArrowUp Shift+ArrowDown Control+Space Meta+Space Alt+ArrowUp Alt+ArrowDown Delete Backspace');
    row.setAttribute('aria-description','Fel/le: rétegnavigáció; Home/End: első/utolsó látható réteg; balra: összecsukás vagy szülő; jobbra: kinyitás vagy első gyermek; Shift+fel/le: tartomány kijelölése; Ctrl vagy Command+Space: többes kijelölés; Alt+fel/le: egy kijelölt réteg átrendezése; Delete vagy Backspace: kijelölt elemek törlése; F2: átnevezés. A gyökér és a zárolt elemek nem mozgathatók vagy törölhetők.');
    row.style.paddingLeft=`${8+depth*14}px`;
    const children=getChildren(current,id);
    const collapsed=children.length>0&&collapsedLayerNodes.has(id);
    if(children.length)row.setAttribute('aria-expanded',String(!collapsed));
    row.innerHTML=`<span class="layer-caret" aria-hidden="true">${children.length?(collapsed?'▸':'▾'):'·'}</span><strong>${escapeHtml(node.name||node.type)}</strong><small>${escapeHtml(node.type)}</small><span class="layer-drag-handle" aria-hidden="true">⠿</span>${locked?`<span class="layer-lock" title="${node.locked?'Zárolt elem':'Zárolt tároló része'}" aria-label="${node.locked?'Zárolt elem':'Zárolt tároló része'}">🔐</span>`:''}`;
    let childGroup=null;
    if(children.length){
      childGroup=document.createElement('div');
      childGroup.className='layer-children';
      childGroup.id=`layer-children-${++layerGroupSequence}`;
      childGroup.setAttribute('role','group');
      childGroup.hidden=collapsed;
      row.setAttribute('aria-owns',childGroup.id);
    }
    row.addEventListener('keydown',event=>{
      if(event.key==='F2'&&node.id!==current.rootId&&!locked){event.preventDefault();event.stopPropagation();beginLayerRename(id)}
      if(event.altKey&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&['ArrowUp','ArrowDown'].includes(event.key)){
        event.preventDefault();event.stopPropagation();
        if(state.selection.ids.length!==1||state.selection.primaryId!==id){setStatus('Réteg-átrendezéshez pontosan egy elemet jelölj ki.');return}
        const moved=moveSelectedLayer(event.key==='ArrowUp'?'up':'down',{restoreFocus:true});
        if(!moved)setStatus(locked||node.id===current.rootId?'A gyökér vagy zárolt réteg nem rendezhető át.':'Nincs átrendezhető réteg ebbe az irányba.');
        return;
      }
      if(!event.altKey&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&['ArrowLeft','ArrowRight'].includes(event.key)){
        event.preventDefault();event.stopPropagation();
        const collapsedNow=collapsedLayerNodes.has(id);
        if(event.key==='ArrowLeft'){
          if(children.length&&!collapsedNow){collapsedLayerNodes.add(id);renderLayers({focusId:id});return}
          if(node.parentId)selectNodeInteraction(node.parentId,event,{focusLayerRow:true});
          return;
        }
        if(children.length&&collapsedNow){collapsedLayerNodes.delete(id);renderLayers({focusId:id});return}
        const firstChild=children[0];if(firstChild)selectNodeInteraction(firstChild.id,event,{focusLayerRow:true});
        return;
      }
      const modifier=event.ctrlKey||event.metaKey;
      if(modifier&&!event.altKey&&event.shiftKey===false&&(event.key===' '||event.code==='Space')){
        event.preventDefault();event.stopPropagation();
        if(node.id===current.rootId)return;
        selectNodeInteraction(id,event,{keyboardAnchorId:layerKeyboardRangeAnchorId||state.selection.primaryId||id});
        const target=root.querySelector(`.layer-row[data-node-id="${CSS.escape(id)}"]`);
        if(target){target.focus({preventScroll:true});target.scrollIntoView({block:'nearest'})}
        return;
      }
      if(event.altKey||modifier||!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
      const rows=[...root.querySelectorAll('.layer-row')].filter(candidate=>!candidate.closest('.layer-children[hidden]')),index=rows.indexOf(row);
      if(index<0||rows.length===0)return;
      const nextIndex=event.key==='Home'?0:event.key==='End'?rows.length-1:index+(event.key==='ArrowDown'?1:-1);
      event.preventDefault();event.stopPropagation();
      const targetId=rows[Math.max(0,Math.min(rows.length-1,nextIndex))]?.dataset.nodeId;
      if(!targetId||targetId===id)return;
      const anchorId=event.shiftKey?(layerKeyboardRangeAnchorId||state.selection.primaryId||id):null;
      if(!event.shiftKey)layerKeyboardRangeAnchorId=null;
      selectNodeInteraction(targetId,event,{anchorId});
      if(state.selection.primaryId!==targetId)return;
      const target=root.querySelector(`.layer-row[data-node-id="${CSS.escape(targetId)}"]`);
      if(target){target.focus({preventScroll:true});target.scrollIntoView({block:'nearest'})}
    });
    const handle=row.querySelector('.layer-drag-handle');
    row.ondragstart=event=>handleLayerDragStart(id,event,row);
    row.ondragover=event=>handleLayerDragOver(id,event,row);
    row.ondrop=event=>handleLayerDrop(id,event,row);
    row.ondragend=()=>clearHierarchyDrag();
    handle?.addEventListener('pointerdown',event=>handleMobileLayerDragStart(id,event,handle));
    handle?.addEventListener('pointermove',event=>handleMobileLayerDragMove(event));
    handle?.addEventListener('pointerup',event=>handleMobileLayerDragEnd(event));
    handle?.addEventListener('pointercancel',()=>clearMobileHierarchyDrag());
    row.onpointerdown=event=>{if(event.pointerType==='touch'){event.stopPropagation();handleMobilePointerDown(id,event)}};
    row.onpointermove=event=>{if(event.pointerType==='touch')handleMobilePointerMove(event)};
    row.onpointerup=event=>{if(event.pointerType==='touch'){event.stopPropagation();handleMobilePointerUp(id,event)}};
    row.onpointercancel=event=>{if(event.pointerType==='touch')handleMobilePointerCancel(event)};
    row.onclick=event=>{event.stopPropagation();if(mobileTouch.active&&mobileTouch.suppressClick){mobileTouch.suppressClick=false;return}if(event.target?.closest('.layer-caret')&&children.length){selectNodeInteraction(id,event);toggleLayerCollapsed(id);return}selectNodeInteraction(id,event,{focusLayerRow:true})};
    entry.append(row);
    if(node.id!==current.rootId){
      const rename=document.createElement('button');
      rename.type='button';
      rename.className='layer-rename';
      rename.dataset.nodeId=id;
      rename.textContent='✎';
      rename.setAttribute('aria-label',`Réteg átnevezése: ${node.name||node.type}`);
      rename.title=locked?(inheritedLock?'A zárolt tároló része; a szülő feloldása után nevezhető át':'A zárolt elem nem nevezhető át'):'Réteg átnevezése';
      rename.disabled=locked;
      rename.onclick=event=>{event.preventDefault();event.stopPropagation();beginLayerRename(id)};
      entry.append(rename);
      const visible=isVisibleOnDevice(node,state.viewport.device);
      const toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='layer-visibility-toggle';
      toggle.dataset.nodeId=id;
      toggle.dataset.device=state.viewport.device;
      toggle.setAttribute('aria-pressed',String(visible));
      toggle.setAttribute('aria-label',`${visible?'Elrejtés':'Megjelenítés'}: ${node.name||node.type} (${state.viewport.device})`);
      toggle.title=`${visible?'Elrejtés':'Megjelenítés'} ezen az eszközön: ${state.viewport.device}`;
      toggle.textContent=visible?'◉':'○';
      toggle.disabled=locked;
      toggle.onclick=event=>{
        event.preventDefault();event.stopPropagation();
        if(command('element.visibility.set',{nodeId:id,device:state.viewport.device,visible:!visible})){renderCanvas();renderLayers();setStatus('Nem mentett módosítás');syncPublishControls()}
      };
      entry.append(toggle);
    }
    if(childGroup){
      entry.append(childGroup);
      children.forEach((child,index)=>childGroup.append(walk(child.id,depth+1,index,children.length)));
    }
    root.append(entry);
    return entry;
  };
  walk(current.rootId,0,0,1);
  if(focusId){const focused=root.querySelector(`.layer-row[data-node-id="${CSS.escape(focusId)}"]`);focused?.focus({preventScroll:true});focused?.scrollIntoView({block:'nearest'})}
}
function toggleLayerCollapsed(nodeId){
  const current=page(),node=current&&getNode(current,nodeId),children=current&&node?getChildren(current,nodeId):[];
  if(!current||!node||children.length===0)return false;
  let collapsed=collapsedLayerNodesByPage.get(current.id);if(!collapsed){collapsed=new Set();collapsedLayerNodesByPage.set(current.id,collapsed)}
  if(collapsed.has(nodeId))collapsed.delete(nodeId);else collapsed.add(nodeId);
  renderLayers({focusId:nodeId});return true;
}
function syncPublishControls(){const current=page();const meta=current&&pages.find(x=>x.id===current.id);const published=Boolean(meta?.isPublished);const dirty=Boolean(state?.persistence?.dirty||pendingLayerRename?.dirty?.());const draftAhead=published&&(Boolean(meta?.hasUnpublishedChanges)||Number(meta?.publishedRevisionVersion??0)<Number(meta?.revision??0));const publishLabel=published?(dirty||draftAhead?'Újrapublikálás':'Publikálva'):'Publikálás';const publishDisabled=!current||(!dirty&&!draftAhead&&published);const publish=$('#publish'),unpublish=$('#unpublish'),mobilePublish=$('#mobilePublish'),mobileUnpublish=$('#mobileUnpublish');if(publish){publish.textContent=publishLabel;publish.disabled=publishDisabled}if(unpublish)unpublish.hidden=!published;if(mobilePublish){mobilePublish.textContent=publishLabel;mobilePublish.disabled=publishDisabled}if(mobileUnpublish)mobileUnpublish.hidden=!published}
function showUnsupportedPublishRecovery(){
  const current=page();
  const unsupported=firstUnsupportedPublicationNode(current);
  const message=unsupportedPublicationMessage(unsupported);
  if(current){
    if(unsupported)setSelection(state,[unsupported.id],unsupported.id);
    window.sanciEditor?.showLeftTab?.('layers',{save:false});
    render();
    const layers=$('#leftPanelLayers'),tree=$('#layersTree');
    if(layers&&tree){
      // A retry can encounter another unsupported node. Keep one current
      // recovery announcement instead of accumulating stale aria-alerts.
      layers.querySelectorAll('[data-recovery-kind="unsupported-node"]').forEach(note=>note.remove());
      const note=document.createElement('p');note.className='property-validation';note.dataset.validationKind='publication';note.dataset.recoveryKind='unsupported-node';note.setAttribute('role','alert');note.textContent=message;layers.insertBefore(note,tree);
      if(unsupported){const row=tree.querySelector(`.layer-row[data-node-id="${CSS.escape(unsupported.id)}"]`);requestAnimationFrame(()=>{if(row?.isConnected){row.focus({preventScroll:true});row.scrollIntoView({block:'nearest',behavior:'smooth'})}})}
    }
  }
  setStatus(message);
}
function showStaleUnsupportedPublishResponse(){
  // The server validated the immutable snapshot sent with the request. If the
  // user changed the Page Model while that request was in flight, that error
  // cannot identify a blocker in the current draft. Never focus or announce a
  // node from the stale snapshot as though it still existed.
  $('#leftPanelLayers')?.querySelectorAll('[data-recovery-kind="unsupported-node"]').forEach(note=>note.remove());
  setStatus('A piszkozat a publikálási kérés óta módosult. A szerver az elküldött korábbi változatot utasította el; ellenőrizd a mostani piszkozatot, majd külön próbáld újra a publikálást.');
}
function renderRevisionPanel(){const root=$('#revisionList');if(!root)return;root.replaceChildren();if(!revisionHistory.length){const empty=document.createElement('div');empty.className='revision-empty';empty.textContent='Nincs korábbi revision.';root.append(empty);return}for(const rev of revisionHistory){const row=document.createElement('div');row.className='revision-row';const info=document.createElement('div');info.className='revision-info';const title=document.createElement('strong');title.textContent=`v${rev.version}`;const note=document.createElement('span');note.textContent=rev.note||'Editor mentés';const date=document.createElement('small');date.textContent=rev.created_at?new Date(rev.created_at).toLocaleString('hu-HU'):'—';info.append(title,note,date);const button=document.createElement('button');button.type='button';button.className='revision-restore';button.textContent='Visszaállítás';button.disabled=Number(rev.version)===Number(page()?.revision||0);button.title=button.disabled?'Ez az aktuális revision':'Ezt a revisiont állítja vissza új revisionként';button.onclick=()=>rollbackToRevision(Number(rev.version));row.append(info,button);root.append(row)}}
function renderPageList(){const select=$('#pageSelect'),list=$('#pageList');select.replaceChildren();list.replaceChildren();const ordered=[...pages].sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0));pages=ordered;for(const item of pages){const option=document.createElement('option');option.value=item.id;option.textContent=(item.parentPageId?'↳ ':'')+(item.title||item.slug);option.selected=item.id===page()?.id;select.append(option);const row=document.createElement('div');row.className='page-row '+(item.id===page()?.id?'active':'');const selectButton=document.createElement('button');selectButton.type='button';selectButton.className='page-row-select';selectButton.innerHTML='<span class="page-icon">▧</span><strong>'+escapeHtml(item.title||item.slug)+'</strong><small class="page-meta">'+(item.isPublished?(item.hasUnpublishedChanges?'ÉLŐ · MÓDOSÍTOTT PISZKOZAT':'ÉLŐ'):'PISZKOZAT')+(item.parentPageId?' · Szülő: '+escapeHtml(pages.find(p=>p.id===item.parentPageId)?.title||'ismeretlen'):'')+'</small>';const paths=document.createElement('small');paths.className='page-meta page-paths';paths.textContent='Piszkozat: /p/'+item.slug+(item.isPublished&&item.publishedSlug?' · Élő: /p/'+item.publishedSlug:' · Nincs élő URL');selectButton.append(paths);selectButton.onclick=()=>loadPage(item.id).catch(showError);const upButton=document.createElement('button');upButton.type='button';upButton.className='page-order';upButton.textContent='↑';upButton.title='Oldal feljebb';upButton.setAttribute('aria-label','Oldal feljebb');upButton.disabled=(item.sortOrder??0)<=0;upButton.onclick=e=>{e.stopPropagation();movePage(item.id,-1).catch(showError)};const downButton=document.createElement('button');downButton.type='button';downButton.className='page-order';downButton.textContent='↓';downButton.title='Oldal lejjebb';downButton.setAttribute('aria-label','Oldal lejjebb');downButton.disabled=item===pages[pages.length-1];downButton.onclick=e=>{e.stopPropagation();movePage(item.id,1).catch(showError)};const editButton=document.createElement('button');editButton.type='button';editButton.className='page-edit';editButton.textContent='✎';editButton.title='Oldal beállításai: '+(item.title||item.slug);editButton.setAttribute('aria-label','Oldal beállításai: '+(item.title||item.slug));editButton.onclick=e=>{e.stopPropagation();editPageMeta(item.id).catch(showError)};const duplicateButton=document.createElement('button');duplicateButton.type='button';duplicateButton.className='page-duplicate';duplicateButton.textContent='⧉';duplicateButton.title='Oldal másolása: '+(item.title||item.slug);duplicateButton.setAttribute('aria-label','Oldal másolása: '+(item.title||item.slug));duplicateButton.onclick=e=>{e.stopPropagation();duplicatePage(item.id)};const deleteButton=document.createElement('button');deleteButton.type='button';deleteButton.className='page-delete';deleteButton.textContent='×';deleteButton.title='Oldal törlése: '+(item.title||item.slug);deleteButton.setAttribute('aria-label','Oldal törlése: '+(item.title||item.slug));deleteButton.onclick=e=>{e.stopPropagation();deletePage(item.id)};const actions=document.createElement('div');actions.className='page-row-actions';actions.setAttribute('aria-label','Oldal műveletei');const archiveButton=document.createElement('button');archiveButton.type='button';archiveButton.textContent='Archiválás';archiveButton.setAttribute('aria-label','Oldal archiválása: '+(item.title||item.slug));archiveButton.onclick=e=>{e.stopPropagation();changePageArchive(item.id,true).catch(showError)};const parentButton=document.createElement('button');parentButton.type='button';parentButton.textContent='Szülő';parentButton.title='Szülőoldal beállítása: '+(item.title||item.slug);parentButton.setAttribute('aria-label',parentButton.title);parentButton.onclick=e=>{e.stopPropagation();editPageParent(item.id).catch(showError)};actions.append(upButton,downButton,editButton,parentButton,duplicateButton,archiveButton,deleteButton);row.append(selectButton,actions);list.append(row)}if(archivedPages.length){const heading=document.createElement('h3');heading.textContent='Archivált oldalak';list.append(heading);for(const item of archivedPages){const row=document.createElement('div');row.className='page-row';const title=document.createElement('strong');title.textContent=item.title||item.slug;const restore=document.createElement('button');restore.type='button';restore.textContent='Visszaállítás piszkozatként';restore.setAttribute('aria-label','Oldal visszaállítása piszkozatként: '+(item.title||item.slug));restore.onclick=()=>changePageArchive(item.id,false).catch(showError);row.append(title,restore);list.append(row)}}}
function focusScheduleNode(){
  if(!flushLayerRename())return false;
  const current=page();
  if(!current)return false;
  const node=Object.values(current.nodes||{}).find(item=>item.type===NODE_TYPES.SCHEDULE);
  if(!node){setStatus('Nincs Adásrend elem az oldalon');return false}
  execute(state,{type:'selection.set',payload:{ids:[node.id],primaryId:node.id}});
  inspectorTab='design';window.sanciEditor?.setInspectorTab?.(inspectorTab,{notify:false});
  document.querySelectorAll('.inspector-tabs button').forEach((button,index)=>button.classList.toggle('active',index===0));
  render();
  document.querySelector('#schedulePanelStatus')?.replaceChildren(document.createTextNode(`Kijelölve: ${node.name||'Adásrend'}`));
  window.sanciEditor?.openPanel?.('right');
  return true;
}
function render(){
  if(!flushLayerRename()||flushRichTextDraft?.()===false)return false;
  if(inlineEditingId&&state?.selection?.primaryId!==inlineEditingId)inlineEditingId=null;
  syncMobileMultiSelectUI();syncNodeClipboardActions();syncPublishControls();renderCanvas();renderInspector();renderLayers();renderRevisionPanel();
  if(state){$('#selection').textContent=`Kijelölés: ${state.selection.primaryId||'—'}`;$('#revision').textContent=`Mentés verziója: ${page()?.revision??0}`;setStatus(state.persistence.dirty?'Nem mentett módosítás':'Mentve')}
  const schedule=state?Object.values(page()?.nodes||{}).find(node=>node.type===NODE_TYPES.SCHEDULE):null;
  const scheduleStatus=$('#schedulePanelStatus');
  if(scheduleStatus)scheduleStatus.textContent=schedule?(state?.selection?.primaryId===schedule.id?`Kijelölve: ${schedule.name||'Adásrend'}`:'Adásrend elem elérhető — kattints a kiválasztáshoz.'):'Nincs Adásrend elem ezen az oldalon.';
}
function showError(e){const message=e instanceof Error?e.message:String(e);diagnostics.add({source:'ui',code:'SANCI-UI-E001',message,error:e});setStatus('Hiba');window.__sanciEditorBoot?.fail(message,e);alert(message)}
async function movePage(id,delta){const item=pages.find(x=>x.id===id);if(!item)return;const target=(item.sortOrder??0)+delta;if(target<0||target>=pages.length)return;setStatus('Oldalsorrend frissítése…');try{const result=await api('/api/admin/pages',{method:'PATCH',body:JSON.stringify({id,sortOrder:target})});const updated=result.data;if(updated){const index=pages.findIndex(x=>x.id===id);if(index>=0)pages[index]={...pages[index],...updated};}await loadPages();setStatus('Mentve')}catch(e){showError(e)}}
async function editPageMeta(id){if(!flushLayerRename()||flushRichTextDraft?.()===false)return;if(state?.persistence?.saving){alert('Várd meg a folyamatban lévő mentést.');return}if(page()?.id===id&&state?.persistence?.dirty){alert('Először mentsd az aktuális módosításokat, majd módosítsd az oldal beállításait.');return}const meta=pages.find(x=>x.id===id);if(!meta)return;const title=prompt('Oldal neve',meta.title||'');if(title===null)return;const trimmedTitle=title.trim();if(!trimmedTitle)return alert('Az oldal neve nem lehet üres.');const suggested=String(trimmedTitle).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const slug=prompt('Slug (az új URL csak külön publikálás után lesz élő)',meta.slug||suggested);if(slug===null)return;const trimmedSlug=slug.trim().toLowerCase();if(!trimmedSlug)return alert('A slug nem lehet üres.');setStatus('Oldal frissítése…');try{const result=await api('/api/admin/pages',{method:'PATCH',body:JSON.stringify({id,title:trimmedTitle,slug:trimmedSlug,expectedVersion:Number(meta.revision||0)})});const updated=result.data;if(updated){const i=pages.findIndex(x=>x.id===id);if(i>=0)pages[i]={...pages[i],...updated,content:updated.content||pages[i].content};}renderPageList();if(page()?.id===id&&updated?.content){state=createEditorState(updated.content,{allowInvalidAuthoredContent:true,allowInvalidPageInteractions:true});state.document.revision=Number(updated.revision||0);markSaved(state,state.document.revision);render();}setStatus('Mentve')}catch(e){showError(e)}}
async function duplicatePage(id){if(!flushLayerRename()||flushRichTextDraft?.()===false)return;const meta=pages.find(x=>x.id===id);if(!meta)return;if(page()?.id===id&&state?.persistence?.dirty){alert('Először mentsd az aktuális módosításokat, majd készíts másolatot.');return}const title=prompt('Másolat neve',`${meta.title||meta.slug} másolata`);if(title===null)return;const trimmedTitle=title.trim();if(!trimmedTitle)return alert('Az oldal neve nem lehet üres.');const suggested=trimmedTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const slug=prompt('A másolat piszkozatának slugja',suggested);if(slug===null)return;const trimmedSlug=slug.trim().toLowerCase();if(!trimmedSlug)return alert('A slug nem lehet üres.');setStatus('Oldal másolása…');try{const result=await api('/api/admin/pages',{method:'POST',body:JSON.stringify({sourcePageId:id,title:trimmedTitle,slug:trimmedSlug})});const copy=result.data;if(!copy?.id)throw new Error('A másolat válasza hiányos.');await loadPages();await loadPage(copy.id);setStatus('Másolat piszkozatként létrehozva')}catch(e){showError(e)}}
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
async function changePageArchive(id,archive){if(!flushLayerRename()||flushRichTextDraft?.()===false)return;
 if(state?.persistence?.saving){alert('Várd meg a folyamatban lévő mentést.');return}
 if(state?.persistence?.dirty){alert('Először mentsd az aktuális módosításokat.');return}
 const item=(archive?pages:archivedPages).find(x=>x.id===id);if(!item)return;
 if(!confirm(archive?`Archiválod a(z) „${item.title||item.slug}” oldalt? A nyilvános oldal nem lesz elérhető; később piszkozatként visszaállítható.`:'Visszaállítod az oldalt piszkozatként? Nem kerül automatikusan publikálásra.'))return;
 await api('/api/admin/pages',{method:'PATCH',body:JSON.stringify({id,action:archive?'archive':'restore'})});
 if(archive&&page()?.id===id){state=null;revisionHistory=[];rememberPageId(null)}
 await loadPages();setStatus(archive?'Oldal archiválva':'Oldal visszaállítva — piszkozat');
}
async function deletePage(id){if(!flushLayerRename()||flushRichTextDraft?.()===false)return;if(page()?.id===id&&state?.persistence?.dirty){alert('Először mentsd az aktuális módosításokat, majd töröld az oldalt.');return}const meta=pages.find(x=>x.id===id);if(!meta)return;if(!confirm(`Biztosan törlöd ezt az oldalt?\\n\\n${meta.title||meta.slug}\\n\\nEz a művelet az oldal szerveroldali tartalmát is törli.`))return;const wasCurrent=page()?.id===id;setStatus('Oldal törlése…');try{await api('/api/admin/pages',{method:'DELETE',body:JSON.stringify({id})});if(wasCurrent)state=null;await loadPages();if(!state&&pages.length===0)setStatus('Nincs oldal');else setStatus('Mentve')}catch(e){showError(e)}}
async function loadPages(){setStatus('Oldalak betöltése…');const data=await api('/api/admin/pages');if(!Array.isArray(data.data))throw new Error('Hibás oldallistázó válasz');const archiveData=await api('/api/admin/pages?archived=1&meta=1');if(!Array.isArray(archiveData.data))throw new Error('Hibás archívum-válasz');pages=data.data;archivedPages=archiveData.data;renderPageList();const initialId=initialPageId(requestedPageId(),pages);if(!state&&initialId)await loadPage(initialId);else if(state){renderPageList();render();setStatus(state.persistence.dirty?'Nem mentett módosítás':'Mentve')}else{rememberPageId(null);setStatus('Nincs oldal')}}
async function loadPage(id,{discardConfirmed=false}={}){
  if(!flushLayerRename()||flushRichTextDraft?.()===false)return;
  if(state?.persistence?.dirty&&!discardConfirmed&&!confirm('Nem mentett módosítások vannak. Elveted őket az oldal betöltésével?')){renderPageList();return;}
  const loadingState=state,loadingSnapshot=JSON.stringify(state?.document??null);
  setStatus('Oldal betöltése…');const meta=pages.find(x=>x.id===id);if(!meta)throw new Error('Az oldal nem található.');const data=await api('/api/admin/editor?pageId='+encodeURIComponent(id));if(state!==loadingState||!flushLayerRename()||flushRichTextDraft?.()===false||JSON.stringify(state?.document??null)!==loadingSnapshot){renderPageList();render();setStatus('Az oldal betöltése megszakadt: közben helyi módosítás történt.');return}const document=data?.data?.page?.document||meta.content;const revisions=Array.isArray(data?.data?.revisions)?data.data.revisions:[];if(!canonical(document,id))throw new Error(`Az oldal (${meta.title||meta.slug}) nem canonical Editor v2 dokumentum.`);const rawRevision=revisions.length?Number(revisions[0]?.version):0;if(!Number.isInteger(rawRevision)||rawRevision<0)throw new Error('Hibás revision-válasz: a szerver revision-száma nem érvényes.');revisionHistory=revisions;const latestRevision=rawRevision;meta.revision=latestRevision;meta.publishedRevisionId=data?.data?.page?.publishedRevisionId??meta.publishedRevisionId??null;meta.publishedRevisionVersion=meta.publishedRevisionId?Number(revisions.find(rev=>rev.id===meta.publishedRevisionId)?.version||0):0;state=createEditorState(document,{allowInvalidAuthoredContent:true,allowInvalidPageInteractions:true});state.document.revision=latestRevision;state.document.pages[id].revision=latestRevision;markSaved(state,latestRevision);rememberPageId(id);renderPageList();render();setStatus('Mentve')}
async function rollbackToRevision(version){const hadPendingRename=Boolean(pendingLayerRename?.dirty?.());if(!flushLayerRename()||flushRichTextDraft?.()===false)return;if(hadPendingRename){setStatus('Előbb mentsd a rétegnév módosítását a visszaállításhoz.');return}const current=page();const meta=current&&pages.find(x=>x.id===current.id);const latest=Number(revisionHistory[0]?.version||meta?.revision||0);if(!current||!meta||!Number.isInteger(version)||version<1)return;if(version===latest){return}if(!confirm(`Biztosan visszaállítod a(z) v${version} revisiont?\n\nA jelenlegi draft nem vész el véglegesen: a visszaállítás új revisionként jön létre.`))return;const rollbackState=state,rollbackSnapshot=JSON.stringify(state.document);setStatus(`v${version} visszaállítása…`);try{await api('/api/admin/editor?pageId='+encodeURIComponent(current.id),{method:'PUT',body:JSON.stringify({pageId:current.id,version,expectedVersion:latest})});if(state!==rollbackState||!flushLayerRename()||flushRichTextDraft?.()===false||JSON.stringify(state.document)!==rollbackSnapshot){if(state===rollbackState){render();showRevisionConflict(new Error('A visszaállítás elkészült, de közben helyi módosítás keletkezett; a helyi változatot megőriztük.'),current.id)}return}await loadPage(current.id,{discardConfirmed:true});setStatus(`v${version} visszaállítva`)}catch(e){showError(e)}}
function pageSlugFromTitle(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80).replace(/-+$/g,'')}
function renderPageStartTemplate(templateId=pageStartTemplate){
  const template=listEditorTemplates().find(item=>item.id===templateId);if(!template)return false;
  pageStartTemplate=template.id;
  const cards=$('#newPageTemplates'),preview=$('#newPagePreviewContent'),title=$('#newPagePreviewTitle');if(!cards||!preview||!title)return false;
  for(const card of cards.querySelectorAll('[data-template-id]')){const selected=card.dataset.templateId===template.id;card.setAttribute('aria-checked',String(selected));card.tabIndex=selected?0:-1}
  title.textContent=template.label;preview.replaceChildren();for(const line of template.preview){const item=document.createElement('li');item.textContent=line;preview.append(item)}
  $('#newPageTemplateStatus').textContent=`Kiválasztva: ${template.label}. A sablon ${template.version}. verziója kompatibilis az Editor ${template.schemaVersion}. sémájával.`;
  return true;
}
function initializePageStartDialog(){
  const cards=$('#newPageTemplates');if(!cards)return;
  cards.replaceChildren();for(const template of listEditorTemplates()){
    const card=document.createElement('button');card.type='button';card.className='new-page-template';card.dataset.templateId=template.id;card.setAttribute('role','radio');card.setAttribute('aria-checked','false');card.tabIndex=-1;
    const name=document.createElement('strong');name.textContent=template.label;const description=document.createElement('span');description.textContent=template.description;const version=document.createElement('small');version.textContent=`Sablon ${template.version} · Editor séma ${template.schemaVersion}`;card.append(name,description,version);card.onclick=()=>renderPageStartTemplate(template.id);cards.append(card);
  }
  cards.onkeydown=event=>{if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(event.key))return;const items=[...cards.querySelectorAll('[role="radio"]')];if(!items.length)return;event.preventDefault();const current=Math.max(0,items.indexOf(document.activeElement)),step=['ArrowRight','ArrowDown'].includes(event.key)?1:-1,next=(current+step+items.length)%items.length;items[next].focus();items[next].click()};
  renderPageStartTemplate('blank-page');
  const title=$('#newPageName'),slug=$('#newPageSlug'),dialog=$('#newPageDialog'),form=$('#newPageForm');
  title.oninput=()=>{if(slug.dataset.touched!=='true')slug.value=pageSlugFromTitle(title.value)};slug.oninput=()=>{slug.dataset.touched='true';slug.value=slug.value.toLowerCase()};
  const close=()=>dialog?.close();$('#cancelNewPage')?.addEventListener('click',close);$('#cancelNewPageClose')?.addEventListener('click',close);
  form?.addEventListener('submit',async event=>{
    event.preventDefault();if(pageCreateBusy)return;
    const cleanTitle=title.value.trim(),cleanSlug=slug.value.trim().toLowerCase(),error=$('#newPageError'),button=$('#createNewPage');error.hidden=true;error.textContent='';
    if(!cleanTitle||cleanTitle.length>160){error.textContent='Az oldal neve 1–160 karakter legyen.';error.hidden=false;title.focus();return}
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)||cleanSlug.length>80){error.textContent='A slug kisbetűt, számot és egyes kötőjeleket tartalmazhat.';error.hidden=false;slug.focus();return}
    if(!flushLayerRename()||flushRichTextDraft?.()===false){error.textContent='Előbb fejezd be a mező szerkesztését.';error.hidden=false;return}
    if(state?.persistence?.saving){error.textContent='Várd meg az aktuális mentés végét.';error.hidden=false;return}
    if(state?.persistence?.dirty){error.textContent='Előbb mentsd az aktuális módosításokat. A helyi változtatások megmaradnak.';error.hidden=false;return}
    let createdId=null;pageCreateBusy=true;button.disabled=true;title.disabled=true;slug.disabled=true;cards.setAttribute('aria-busy','true');$('#newPageTemplateStatus').textContent='A sablon előkészítése…';
    try{
      const document=instantiateEditorTemplate(pageStartTemplate,{title:cleanTitle,slug:cleanSlug});const id=document.activePageId;
      const result=await api('/api/admin/pages',{method:'POST',body:JSON.stringify({id,title:cleanTitle,slug:cleanSlug,description:'',document})});
      if(result?.data?.id!==id||result?.data?.isPublished===true)throw new Error('A szerver nem igazolta vissza az új piszkozatot. Ellenőrizd az oldallistát, mielőtt újra próbálkozol.');
      createdId=id;dialog.close();setStatus('Új oldal piszkozatként létrehozva');await loadPages();await loadPage(id);setStatus('Új piszkozat megnyitva — mentés és publikálás külön történik.');
    }catch(e){if(createdId){setStatus('A piszkozat létrejött, de nem sikerült automatikusan megnyitni. Frissítsd az oldallistát.');try{await loadPages()}catch{}}else{error.textContent=e instanceof Error?e.message:String(e);error.hidden=false;$('#newPageTemplateStatus').textContent='A létrehozás nem sikerült. A kiválasztott sablon és az űrlap adatai megmaradtak.';}}
    finally{pageCreateBusy=false;button.disabled=false;title.disabled=false;slug.disabled=false;cards.removeAttribute('aria-busy')}
  });
}
async function createNew(){if(!flushLayerRename()||flushRichTextDraft?.()===false)return;if(state?.persistence?.saving){setStatus('Várd meg az aktuális mentés végét az új oldalhoz.');return}if(state?.persistence?.dirty){setStatus('Előbb mentsd az aktuális módosításokat; a helyi munka megmarad.');return}const dialog=$('#newPageDialog');if(!dialog)return;pageStartTemplate='blank-page';$('#newPageName').value='Új oldal';$('#newPageSlug').value='uj-oldal';$('#newPageSlug').dataset.touched='false';$('#newPageError').hidden=true;renderPageStartTemplate('blank-page');if(!dialog.open)dialog.showModal();$('#newPageName').focus()}
function commitActiveInspectorControl(){
  const input=document.activeElement;if(!input||!inspector.contains(input)||!input.matches('input,textarea,select'))return true;
  if(typeof input.onchange==='function'&&input.dataset.focusValue!==String(input.type==='checkbox'?input.checked:input.value)){
    input.dispatchEvent(new Event('change',{bubbles:true}));if(state?.persistence?.error)return false;
  }
  return !input.closest('.field')?.querySelector('.property-validation')?.textContent&&!input.matches('[aria-invalid="true"]');
}
function inspectorValidationError({visibleOnly=false}={}){
  // Publication-only requirements do not invalidate a draft save. They are
  // independently checked again by validatePageForPublication on Publish.
  return [...inspector.querySelectorAll('.property-validation')]
    .find(element=>element.dataset.validationKind!=='publication'&&
      element.textContent.trim()&&(!visibleOnly||element.getClientRects().length>0));
}
function revealInspectorValidationError(error){
  if(!error||!inspector.contains(error))return;
  // Search and category filters must not hide the field explaining why a
  // Save/Publish attempt was rejected. Keep the authored input intact.
  inspectorQuery='';
  inspectorCategory='all';
  const search=inspector.querySelector('.inspector-search input[type="search"]');
  if(search)search.value='';
  inspector.querySelectorAll('.inspector-category-nav button').forEach(button=>{
    button.setAttribute('aria-pressed',String(button.dataset.inspectorCategory==='all'));
  });
  filterInspector();
  const group=error.closest('.inspector-group');
  if(group){
    group.hidden=false;
    const title=group.querySelector(':scope > .inspector-group-title');
    if(!group.classList.contains('is-open')){
      // Existing accordion click also updates its persisted openGroups map.
      if(title?.getAttribute('role')==='button')title.click();
      else{
        group.classList.add('is-open');
        title?.setAttribute('aria-expanded','true');
      }
    }
  }
  window.sanciEditor?.openPanel?.('right');
  requestAnimationFrame(()=>{
    if(!error.isConnected)return;
    const field=error.closest('.typed-inspector-field,.field,.multi-inspector-field');
    const input=field?.querySelector('input:not(:disabled),textarea:not(:disabled),select:not(:disabled)');
    if(input?.getClientRects().length)input.focus({preventScroll:true});
    error.scrollIntoView({block:'nearest',behavior:'smooth'});
  });
}

inspector.addEventListener('focusin',event=>{const input=event.target;if(input.matches('input,textarea,select'))input.dataset.focusValue=String(input.type==='checkbox'?input.checked:input.value)});
inspector.addEventListener('change',event=>{const input=event.target;if(input.matches('input,textarea,select'))input.dataset.focusValue=String(input.type==='checkbox'?input.checked:input.value)});
async function save(publish=false){
  if(!flushLayerRename())return;
  if(!commitActiveInspectorControl()||inspectorValidationError()){
    // Validation can outlive focus: a toolbar click moves focus away from
    // the invalid field. Never silently save/publish an older Page Model.
    setStatus('Javítsd a jelzett mezőt mentés vagy publikálás előtt.');
    revealInspectorValidationError(inspectorValidationError());
    return;
  }
  if(state?.persistence?.saving){setStatus('Mentés folyamatban…');return;}if(flushRichTextDraft?.()===false){setStatus('Javítsd a jelzett tartalommezőt mentés előtt.');return;}const current=page();if(!current)return;if(publish){try{validatePageForPublication(current)}catch(error){if(error.nodeId){setSelection(state,[error.nodeId],error.nodeId);inspectorTab='content';window.sanciEditor?.setInspectorTab?.(inspectorTab,{notify:false});render();window.sanciEditor?.openPanel?.('right');const note=document.createElement('p');note.className='property-validation';note.dataset.validationKind='publication';note.setAttribute('role','alert');note.textContent=error.message;inspector.prepend(note)}setStatus(error.message);return}}const meta=pages.find(x=>x.id===current.id);if(!meta)return;const stateAtStart=state;const pageId=current.id;const submittedDocument=structuredClone(stateAtStart.document);const submittedJson=JSON.stringify(submittedDocument);const expectedVersion=Number(meta.revision??stateAtStart.document.revision??0);setStatus(publish?'Publikálás…':'Mentés…');stateAtStart.persistence.saving=true;try{const result=await api(`/api/admin/editor?pageId=${encodeURIComponent(pageId)}`,{method:'POST',body:JSON.stringify({pageId,document:submittedDocument,publish,expectedVersion,expectedParentPageId:meta.parentPageId??null,note:publish?'Editor v2 publikálás':'Editor v2 mentés'})});const version=Number(result?.data?.version);if(result?.data?.pageId!==pageId||!Number.isInteger(version)||version<1)throw new Error('A mentés válasza hiányos vagy hibás revision-adatot tartalmaz; a helyi módosításokat nem jelöltük mentettnek.');const renameReady=state!==stateAtStart||flushLayerRename();const unchanged=state===stateAtStart&&renameReady&&JSON.stringify(stateAtStart.document)===submittedJson;stateAtStart.document.revision=version;if(stateAtStart.document.pages?.[pageId])stateAtStart.document.pages[pageId].revision=version;meta.revision=version;if(unchanged){markSaved(stateAtStart,version)}else{stateAtStart.persistence.saving=false;stateAtStart.persistence.dirty=true;stateAtStart.persistence.error=null;stateAtStart.persistence.lastSavedRevision=version}stateAtStart.persistence.conflict=null;const panel=$('#revisionConflict');if(panel&&state===stateAtStart){panel.hidden=true;document.querySelector('.editor-app')?.classList.remove('revision-conflict-open')}const i=pages.findIndex(x=>x.id===pageId);if(i>=0){const previous=pages[i];pages[i]={...previous,content:submittedDocument,isPublished:publish||Boolean(previous.isPublished),hasUnpublishedChanges:!publish&&Boolean(previous.isPublished),publishedRevisionId:publish?result.data.revisionId:previous.publishedRevisionId,publishedParentPageId:publish?previous.parentPageId:previous.publishedParentPageId,publishedSlug:publish?previous.slug:previous.publishedSlug,publishedRevisionVersion:publish?version:Number(previous.publishedRevisionVersion??0),revision:version};}renderPageList();if(state===stateAtStart){render();setStatus(unchanged?(publish?'Publikálva':(pages.find(x=>x.id===pageId)?.isPublished?'Mentve — a nyilvános oldal változatlan':'Mentve')):'A mentett verzió elkészült; további helyi módosítások még nincsenek mentve')}return result}catch(e){stateAtStart.persistence.saving=false;stateAtStart.persistence.error=e instanceof Error?e.message:String(e);if(state===stateAtStart&&publish&&e?.status===409&&e?.code==='UNSUPPORTED_EDITOR_NODE_TYPE'){if(JSON.stringify(stateAtStart.document)===submittedJson)showUnsupportedPublishRecovery();else showStaleUnsupportedPublishResponse();syncPublishControls();return}stateAtStart.persistence.dirty=true;if(state===stateAtStart&&e?.status===409&&e?.code==='REVISION_CONFLICT'){showRevisionConflict(e,pageId);return}if(state===stateAtStart){setStatus('Mentési hiba');alert(stateAtStart.persistence.error)}return}}
async function unpublishPage(){if(!flushLayerRename()||flushRichTextDraft?.()===false)return;const current=page();const meta=current&&pages.find(x=>x.id===current.id);if(!current||!meta?.isPublished)return;if(!confirm('Biztosan visszavonod ennek az oldalnak a publikálását?'))return;setStatus('Publikálás visszavonása…');try{const result=await api('/api/admin/editor?pageId='+encodeURIComponent(current.id),{method:'POST',body:JSON.stringify({pageId:current.id,action:'unpublish'})});const i=pages.findIndex(x=>x.id===current.id);if(i>=0)pages[i]={...pages[i],isPublished:Boolean(result.data?.published),publishedSlug:null,hasUnpublishedChanges:false};renderPageList();render();setStatus('Publikálás visszavonva')}catch(e){showError(e)}}
function setDevice(device){
 if(!state||!Object.hasOwn(sizes,device))return false;
 if(state.viewport.device===device)return true;
 if(!flushLayerRename()||!commitActiveInspectorControl()||
    inspectorValidationError({visibleOnly:true})||
    flushRichTextDraft?.()===false){
   setStatus('Javítsd a hibás mezőt a nézetváltás előtt.');
   return false;
 }
 const previousDevice=state.viewport.device,previousZoom=zoom;
 state.viewport.device=device;
 zoom=device==='desktop'?1:Math.max(.35,Math.min(1,(canvas.clientWidth-48)/sizes[device]));
 if(render()===false){
   state.viewport.device=previousDevice;zoom=previousZoom;
   setStatus('A nézetváltás nem sikerült. A módosítások megmaradtak.');
   return false;
 }
 window.sanciEditor?.setViewportPreference?.({device,zoom});
 canvas.scrollTo({left:0,top:0,behavior:'instant'});
 return true;
}
document.addEventListener('DOMContentLoaded',()=>{
 diagnostics.init();
 window.__sanciEditorDiagnostics=diagnostics;
 window.__sanciEditorBoot?.started();
 $('#elementSearch').oninput=e=>renderPalette(e.target.value);
 $('#scheduleSelectNode').onclick=()=>focusScheduleNode();
 initializePageStartDialog();$('#newPage').onclick=()=>createNew().catch(showError);$('#newPagePanel').onclick=()=>createNew().catch(showError);
 $('#pageSelect').onchange=e=>loadPage(e.target.value).catch(showError);
 $('#exportConflictDraft').onclick=()=>exportConflictDraft();$('#reloadConflictPage').onclick=()=>reloadLatestAfterConflict();
 $('#save').onclick=()=>save(false);$('#publish').onclick=()=>save(true);$('#unpublish').onclick=()=>unpublishPage().catch(showError);$('#mobilePublish').onclick=()=>save(true);$('#mobileUnpublish').onclick=()=>unpublishPage().catch(showError);
 $('#preview').onclick=()=>{const p=page();if(p)window.open(`/p/${encodeURIComponent(p.slug)}?preview=1`,'_blank','noopener,noreferrer')};
 $('#undo').onclick=()=>{if(state&&flushLayerRename()&&commitActiveInspectorControl()&&flushRichTextDraft?.()!==false){try{execute(state,{type:'history.undo'});render()}catch(e){showError(e)}}};$('#redo').onclick=()=>{if(state&&flushLayerRename()&&commitActiveInspectorControl()&&flushRichTextDraft?.()!==false){try{execute(state,{type:'history.redo'});render()}catch(e){showError(e)}}};
 $('#copyNodes').onclick=copySelectedNodes;$('#pasteNodes').onclick=pasteSelectedNodes;$('#mobileCopyNodes').onclick=copySelectedNodes;$('#mobilePasteNodes').onclick=pasteSelectedNodes;
 $('#zoomIn').onclick=()=>changeCanvasZoom(Math.min(1.5,zoom+.1));$('#zoomOut').onclick=()=>changeCanvasZoom(Math.max(.35,zoom-.1));$('#fitCanvas').onclick=fitCanvasToViewport;
 $('#selectTool').onclick=()=>{syncCanvasToolButtons('select');canvas.style.cursor='default'};$('#groupSelection').onclick=()=>{if(!$('#groupSelection').disabled)command('hierarchy.group')};$('#ungroupSelection').onclick=()=>{if(!$('#ungroupSelection').disabled)command('hierarchy.ungroup')};$('#moveLayerUp').onclick=()=>{if(!$('#moveLayerUp').disabled)moveSelectedLayer('up')};$('#moveLayerDown').onclick=()=>{if(!$('#moveLayerDown').disabled)moveSelectedLayer('down')};$('#indentLayer').onclick=()=>{if(!$('#indentLayer').disabled)moveSelectedLayer('indent')};$('#outdentLayer').onclick=()=>{if(!$('#outdentLayer').disabled)moveSelectedLayer('outdent')};$('#mobileGroup').onclick=()=>{if(!$('#mobileGroup').disabled)command('hierarchy.group')};$('#mobileUngroup').onclick=()=>{if(!$('#mobileUngroup').disabled)command('hierarchy.ungroup')};$('#mobileMultiDone').onclick=()=>finishMobileMultiSelect();$('#mobileMultiCancel').onclick=()=>cancelMobileMultiSelect();$('#panTool').onclick=()=>{syncCanvasToolButtons('pan');canvas.style.cursor='grab'};
 document.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>setDevice(b.dataset.device));
 canvas.addEventListener('click',event=>{
   if(event.target.closest('.node')) return;
   if(state) { command('selection.clear'); }
 });
 const inspectorTablist=$('.inspector-tabs');
 window.sanciEditor?.on?.('workspace:preferences-change',queueAccountWorkspaceWrite);
 if(reducedMotionQuery){const updateCanvasVideoPlayback=()=>applyReducedMotionVideoPlayback(canvas,{reducedMotion:prefersReducedMotion(),editor:true});if(typeof reducedMotionQuery.addEventListener==='function')reducedMotionQuery.addEventListener('change',updateCanvasVideoPlayback);else reducedMotionQuery.addListener?.(updateCanvasVideoPlayback)}
 window.sanciEditor?.on?.('panel:inspector-tab',({tab}={})=>activateInspectorTab(tab,{persist:false}));
 inspectorTablist?.addEventListener('click',event=>{
   const button=event.target.closest('[role="tab"]');
   if(!button||!inspectorTablist.contains(button))return;
   const index=[...inspectorTablist.querySelectorAll('[role="tab"]')].indexOf(button);
   activateInspectorTab(INSPECTOR_TABS[index]);
 });
 inspectorTablist?.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   const tabs=[...inspectorTablist.querySelectorAll('[role="tab"]')];
   const currentIndex=tabs.indexOf(document.activeElement);
   if(currentIndex<0||!tabs.length)return;
   const direction=document.documentElement.dir==='rtl'?-1:1;
   const nextIndex=event.key==='Home'?0:event.key==='End'?tabs.length-1:
     (currentIndex+(event.key==='ArrowRight'?direction:-direction)+tabs.length)%tabs.length;
   event.preventDefault();
   activateInspectorTab(INSPECTOR_TABS[nextIndex],{focus:true});
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobileTouch.active){e.preventDefault();cancelMobileMultiSelect();return}if(isCanvasDeleteShortcut(e)){e.preventDefault();deleteSelectedNodes();return}if((e.ctrlKey||e.metaKey)&&['c','v'].includes(e.key.toLowerCase())&&isCanvasClipboardShortcut(e)){e.preventDefault();if(e.key.toLowerCase()==='c')copySelectedNodes();else pasteSelectedNodes();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();save(false)}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();if(state&&flushLayerRename()&&commitActiveInspectorControl()&&flushRichTextDraft?.()!==false){execute(state,{type:e.shiftKey?'history.redo':'history.undo'});render()}}});
 renderPalette();loadTwitchConnection();Promise.all([loadPages(),loadPaletteFavorites()]).then(()=>{if(pendingAccountViewport)applyAccountViewport(pendingAccountViewport);return accountPreferenceWrite}).then(()=>window.__sanciEditorBoot?.ready()).catch(showError);
});

loadEditorTokens();window.addEventListener('focus',()=>loadEditorTokens());
