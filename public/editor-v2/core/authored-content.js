import { validatedLinkHref } from './richtext-links.js?v=20261117-d03-invalid-media-id-guidance-v1';
import { PAGE_ACTION_TIMER_DELAYS_MS, pageInteractionAttributes, safePageInteraction } from './page-interactions.js?v=20261121-edt039-single-auto-action-v1';
import { safeContentDomId } from './element-content.js?v=20261125-d06-carousel-control-relationship-v1';

export const CONTENT_VERSION=1;
// Shared by the editor picker and the server-side media upload/list contract.
export const IMAGE_MIMES=Object.freeze(['image/png','image/jpeg','image/gif','image/webp']);
export const PLAYABLE_MEDIA_MIMES=Object.freeze({audio:Object.freeze(['audio/mpeg','audio/ogg','audio/wav']),video:Object.freeze(['video/webm'])});
export const AUTHORED_TABLE_LIMITS=Object.freeze({rows:100,columns:16,cellCharacters:2000});
// Page Save/Publish currently caps the complete serialized Page Model at
// 180,000 characters. Reserve space for the node/document envelope and other
// content so a table cannot be valid in the Inspector but impossible to save.
export const MAX_AUTHORED_TABLE_JSON_CHARS=120_000;
// The TSV textarea has a larger input ceiling than the persisted table budget.
// Normalization below is authoritative and rejects oversized tables without
// relying on the browser's maxLength (which could silently truncate a paste).
export const MAX_AUTHORED_TABLE_TSV_CHARS=180_000;
const MEDIA_ASSET_ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const field=(key,label,type='text',extra={})=>({key,label,type,...extra});
const text=field('text','Szöveg','textarea',{max:20000});
const href=field('href','Hivatkozás','url',{help:'Belső /p/oldal vagy #azonosító, illetve teljes https:// vagy mailto: cím. Üresen az elem nem navigál.'});
const linkFields=[href,field('target','Megnyitás','select',{options:{_self:'Ebben az ablakban',_blank:'Új ablakban'}}),field('ariaLabel','Akadálymentes elnevezés','text',{max:160})];
const media=[field('src','Külső média címe','media-url',{help:'Régi vagy külső HTTPS-képforráshoz. A Médiatárból választott fájl lentebb rögzített assetazonosítót használ.'}),field('assetId','Médiatár','asset',{help:'A kiválasztott képet a webhely saját, hozzáférés-ellenőrzött Médiatára szolgálja ki. A piszkozat mentése nem teszi nyilvánossá.'})];
const externalMedia=[field('src','Külső média címe','media-url',{help:'HTTPS vagy webhelyen belüli, ellenőrzött médiaforrás.'})];
const playableAsset=(kind,label)=>field('assetId',label,'asset',{mimes:PLAYABLE_MEDIA_MIMES[kind],selectedKind:kind,help:`A kiválasztott ${kind==='video'?'videó':'hang'} a webhely hozzáférés-ellenőrzött Médiatárából töltődik be. A piszkozat mentése önmagában nem teszi nyilvánossá.`});
const focalFields=[field('focalX','Kivágás vízszintesen','range',{min:0,max:100,step:1,help:'A kép látható részét balról jobbra igazítja.'}),field('focalY','Kivágás függőlegesen','range',{min:0,max:100,step:1,help:'A kép látható részét felülről lefelé igazítja.'})];
const imageFields=[...media,field('alt','Kép szöveges leírása','text',{max:500}),field('decorative','Csak díszítő kép','boolean'),field('caption','Képaláírás','textarea',{max:1000}),field('fit','Kép illesztése','select',{options:{cover:'Kitöltés, vágással',contain:'Teljes kép',fill:'Nyújtás',none:'Eredeti méret', 'scale-down':'Csak kicsinyítés'}}),field('ratio','Képarány','select',{options:{auto:'Eredeti','16 / 9':'16:9','4 / 3':'4:3','1 / 1':'Négyzet','3 / 4':'Álló 3:4'}}),...focalFields,field('loading','Betöltés','select',{options:{lazy:'Késleltetett',eager:'Azonnali'}})];
export const CONTENT_FIELDS=Object.freeze({
  heading:[text,field('level','Címsor szemantikai szintje','select',{options:{1:'H1 – főcím',2:'H2 – szakaszcím',3:'H3',4:'H4',5:'H5',6:'H6'}})],
  text:[text],button:[text,...linkFields],link:[text,...linkFields],quote:[text,field('citation','Forrás / szerző')],badge:[text],icon:[field('icon','Ikon','select',{options:{star:'Csillag',heart:'Szív',play:'Lejátszás',check:'Pipa',arrow:'Nyíl',bolt:'Villám',camera:'Kamera',music:'Zene',globe:'Web',mail:'Levél'}}),field('ariaLabel','Ikon leírása','text',{max:160})],
  image:imageFields,video:[...externalMedia,playableAsset('video','Videó a Médiatárból'),field('poster','Külső borítókép címe','media-url',{help:'Meglévő HTTPS vagy belső kép-URL. A Médiatárból választott borítókép elsőbbséget kap.'}),field('posterAssetId','Borítókép a Médiatárból','asset',{help:'A videó továbbra is URL-ből játszódik le; csak a borítókép kerül a privát kép-Médiatárból az oldalra.'}),field('controls','Lejátszó vezérlők','boolean'),field('muted','Némítás','boolean'),field('loop','Ismétlés','boolean'),field('autoplay','Automatikus indítás némítva','boolean')],audio:[...externalMedia,playableAsset('audio','Hang a Médiatárból'),field('controls','Lejátszó vezérlők','boolean'),field('loop','Ismétlés','boolean')],
  list:[field('ordered','Számozott lista','boolean'),field('items','Listaelemek','repeater',{itemFields:[text,href]})],
  table:[field('caption','Táblázat címe'),field('header','Az első sor fejléc','boolean'),field('rows','Táblázat sorai','table',{max:MAX_AUTHORED_TABLE_TSV_CHARS,help:'A menthető táblázattartalom legfeljebb 120 000 karakteres; ennél nagyobb adatnál csökkentsd a cellák vagy sorok tartalmát.'})],
  tabs:[field('ariaLabel','Fülcsoport elnevezése','text',{max:160}),field('items','Fülek','repeater',{itemFields:[field('title','Fül címe'),text]})],accordion:[field('ariaLabel','Harmonikacsoport elnevezése','text',{max:160}),field('singleOpen','Egyszerre csak egy nyitott rész','boolean'),field('openFirst','Első rész kezdetben nyitva','boolean'),field('items','Lenyitható részek','repeater',{itemFields:[field('title','Rész címe'),text]})],dropdown:[field('ariaLabel','Lenyitható csoport elnevezése','text',{max:160}),field('singleOpen','Egyszerre csak egy nyitott rész','boolean'),field('openFirst','Első rész kezdetben nyitva','boolean'),field('items','Lenyitható részek','repeater',{itemFields:[field('title','Rész címe'),text]})],
  gallery:[field('ariaLabel','Képgaléria elnevezése','text',{max:160}),field('columns','Oszlopok asztalon','select',{options:{2:'2 oszlop',3:'3 oszlop',4:'4 oszlop'}}),field('items','Képek','repeater',{itemFields:[...media,field('alt','Képleírás'),field('caption','Képaláírás'),field('fit','Kép illesztése','select',{options:{cover:'Kitöltés, vágással',contain:'Teljes kép'}}),...focalFields]})],
  carousel:[field('ariaLabel','Galéria elnevezése'),field('items','Lapozható képek','repeater',{itemFields:[...media,field('alt','Képleírás'),field('caption','Képaláírás'),field('fit','Kép illesztése','select',{options:{cover:'Kitöltés, vágással',contain:'Teljes kép'}}),...focalFields]})],
  code:[field('code','Megjelenített kód','textarea',{max:20000}),field('wrap','Hosszú sorok tördelése','boolean')],tooltip:[field('text','Gomb felirata'),field('description','Magyarázat','textarea',{max:2000})],divider:[],spacer:[]
});
export const CONTENT_TYPES=Object.freeze(Object.keys(CONTENT_FIELDS));
const FOCAL_PRESETS=Object.freeze({center:[50,50],top:[50,0],bottom:[50,100],left:[0,50],right:[100,50]});
// Resolve a view without adding numeric axes to a persisted legacy image.
export function imageFocalPosition(item={}){
  if(!item||typeof item!=='object'||Array.isArray(item))item={};
  const preset=typeof item.focalPoint==='string'&&Object.hasOwn(FOCAL_PRESETS,item.focalPoint)?FOCAL_PRESETS[item.focalPoint]:FOCAL_PRESETS.center;
  const axis=(value,fallback)=>{try{const number=Number(value);return Number.isFinite(number)?Math.max(0,Math.min(100,number)):fallback}catch{return fallback}};
  return {focalX:axis(item.focalX,preset[0]),focalY:axis(item.focalY,preset[1])};
}
export function contentProperties(node){
  const defaults={level:'2',columns:'3',controls:true,target:'_self',fit:'cover',ratio:'auto',focalPoint:'center',loading:'lazy',icon:'star'};
  const props={...Object.fromEntries((CONTENT_FIELDS[node.type]||[]).filter(field=>Object.hasOwn(defaults,field.key)).map(field=>[field.key,defaults[field.key]])),...node.props};
  if(['image','gallery','carousel'].includes(node.type)){
    const legacy=imageFocalPosition({focalPoint:props.focalPoint});
    props.focalX??=legacy.focalX;props.focalY??=legacy.focalY;
  }
  return props;
}
export const STRUCTURAL_TYPES=Object.freeze(['section','container','row','columns','flex','grid','stack','group','slot','card','panel','navbar','menu','footer','sidebar','absolute','sticky','overlay']);
export function isAuthoredContent(node){return node?.metadata?.contentVersion===CONTENT_VERSION}
export function safeMediaUrl(value){
  const raw=String(value??'').trim();if(!raw)return '';
  const valid=validatedLinkHref(raw,{allowEditorMediaPreview:true});
  if(valid.startsWith('/')&&!valid.startsWith('//')&&!valid.startsWith('/\\'))return valid;
  const url=new URL(valid);if(url.protocol!=='https:')throw new Error('A médiaforrás csak HTTPS vagy belső útvonal lehet.');return valid;
}
// The authenticated Editor may preview /api/admin/media, but a public page
// must never publish that private route. Decode repeatedly because old drafts
// can contain nested percent-encoding and the request path may be normalized
// by more than one layer before route matching.
function isEditorOnlyMediaUrl(value){
  if(typeof value!=='string'||!value.trim())return false;
  try{
    let path=new URL(value,'https://sanci.invalid').pathname;
    for(let pass=0;pass<10;pass++){
      // A decoded leading slash can turn /%2Fapi/... into //api/...; browsers
      // normalize that form as a network-path reference, so treat any run of
      // leading slashes as the private route boundary.
      if(/^\/+api\/admin(?:\/|$)/i.test(path))return true;
      const decoded=decodeURIComponent(path);
      if(decoded===path)return false;
      path=decoded;
    }
    return true;
  }catch{return true}
}
function safePublishedMediaUrl(value){
  const source=safeSrc(value);
  return source&&isEditorOnlyMediaUrl(source)?'':source;
}
export function normalizeContentField(definition,value){
  if(definition.type==='boolean'){if(typeof value!=='boolean')throw new Error('Logikai érték szükséges.');return value}
  if(definition.type==='repeater'){
    if(!Array.isArray(value)||value.length>40)throw new Error('Legfeljebb 40 elem adható meg.');
    return value.map(item=>{if(!item||typeof item!=='object'||Array.isArray(item))throw new Error('Hibás listaelem.');const result={...item};for(const def of definition.itemFields)if(item[def.key]!==undefined)result[def.key]=normalizeContentField(def,item[def.key]);return result});
  }
  if(definition.type==='table'){
    if(!Array.isArray(value)||value.length>AUTHORED_TABLE_LIMITS.rows)throw new Error(`Legfeljebb ${AUTHORED_TABLE_LIMITS.rows} sor adható meg.`);
    const width=value[0]?.length;
    if(!Number.isInteger(width)||width<1||width>AUTHORED_TABLE_LIMITS.columns)throw new Error(`A táblázatban 1–${AUTHORED_TABLE_LIMITS.columns} oszlop használható.`);
    const rows=value.map(row=>{if(!Array.isArray(row)||row.length!==width)throw new Error('A táblázat sorainak azonos számú oszlopot kell tartalmazniuk.');return row.map(cell=>normalizeContentField({type:'text',max:AUTHORED_TABLE_LIMITS.cellCharacters},cell))});
    if(JSON.stringify(rows).length>MAX_AUTHORED_TABLE_JSON_CHARS)throw new Error(`A mentett táblázattartalom legfeljebb ${MAX_AUTHORED_TABLE_JSON_CHARS.toLocaleString('hu-HU')} karakter lehet.`);
    return rows;
  }
  if(definition.type==='range'){
    const number=typeof value==='number'?value:Number(value);
    if(!Number.isFinite(number)||number<(definition.min??0)||number>(definition.max??100))throw new Error(`Az érték ${definition.min??0} és ${definition.max??100} közé essen.`);
    return number;
  }
  if(definition.type==='asset'){
    const result=String(value??'');if(result&&!MEDIA_ASSET_ID.test(result))throw new Error('Érvénytelen Médiatár-azonosító.');return result;
  }
  if(typeof value!=='string'&&typeof value!=='number')throw new Error('Szöveges érték szükséges.');
  const result=String(value);if(result.length>(definition.max||2048))throw new Error('Túl hosszú érték.');
  if(definition.type==='select'&&!Object.hasOwn(definition.options,result))throw new Error('Érvénytelen választás.');
  if(definition.type==='url')return result.trim()?validatedLinkHref(result):'';
  if(definition.type==='media-url')return safeMediaUrl(result);
  return result;
}
export function normalizeElementContent(node,patch){
  const fields=CONTENT_FIELDS[node?.type];if(!fields)throw new Error('Ehhez az elemhez még nincs tartalomszerződés.');
  if(!patch||typeof patch!=='object'||Array.isArray(patch))throw new Error('Hibás tartalommódosítás.');
  const props=contentProperties(node);
  for(const [key,value] of Object.entries(patch)){
    const definition=fields.find(item=>item.key===key);if(!definition)throw new Error('Ismeretlen tartalommező: '+key);
    props[key]=normalizeContentField(definition,value);
  }
  if(props.autoplay===true&&props.muted!==true)throw new Error('Automatikus videó csak némítva indulhat.');
  return props;
}
export function validateElementContent(node){
  if(!isAuthoredContent(node)||!CONTENT_FIELDS[node.type])return;
  const patch=Object.fromEntries(CONTENT_FIELDS[node.type].filter(field=>node.props?.[field.key]!==undefined).map(field=>[field.key,node.props[field.key]]));
  normalizeElementContent(node,patch);
  const props=contentProperties(node),hasAsset=id=>typeof id==='string'&&MEDIA_ASSET_ID.test(id);
  const assertPublicSource=(value,assetId,field)=>{
    if(!hasAsset(assetId)&&isEditorOnlyMediaUrl(safeSrc(value)||value))throw new Error(`${field}: a privát szerkesztői előnézet nem publikálható.`);
  };
  if(['image','video','audio'].includes(node.type))assertPublicSource(props.src,props.assetId,'src');
  if(node.type==='video')assertPublicSource(props.poster,props.posterAssetId,'poster');
  if(['gallery','carousel'].includes(node.type))for(const [index,item] of (Array.isArray(props.items)?props.items:[]).entries()){
    if(item&&typeof item==='object'&&!Array.isArray(item))assertPublicSource(item.src,item.assetId,`items.${index}.src`);
  }
}
// Single source for the visible authored-content publication gate. The Inspector can
// read this without mutating a draft; the server uses the same decision.
// One authoritative source for the authored-content publication message and
// the Inspector target. Keep publication precedence identical to the server gate.
export function getPublicationContentGuidance(node,{pageNodes=null}={}){
  if(!isAuthoredContent(node)||!CONTENT_FIELDS[node?.type])return null;
  const p=contentProperties(node);
  const hasText=value=>typeof value==='string'?Boolean(value.trim()):typeof value==='number'&&Number.isFinite(value);
  const hasMediaSource=value=>typeof value==='string'&&Boolean(value.trim())&&Boolean(safePublishedMediaUrl(value));
  const hasAssetId=value=>typeof value==='string'&&MEDIA_ASSET_ID.test(value);
  const hasInvalidAssetId=value=>value!==undefined&&value!==null&&value!==''&&!hasAssetId(value);
  const items=Array.isArray(p.items)?p.items:[];
  const rows=Array.isArray(p.rows)?p.rows:[];
  let missing=null;
  const requireField=(fieldKey,message)=>{missing={fieldKey,message}};
  if(['image','video','audio'].includes(node.type)&&hasInvalidAssetId(p.assetId))requireField('assetId','A Médiatár-azonosító érvénytelen. Válassz új fájlt, vagy töröld a Médiatár-választást.');
  if(node.type==='video'&&hasInvalidAssetId(p.posterAssetId))requireField('posterAssetId','A borítókép Médiatár-azonosítója érvénytelen. Válassz új borítóképet, vagy töröld a választást.');
  if(['image','video','audio'].includes(node.type)&&!missing&&!hasMediaSource(p.src)&&!hasAssetId(p.assetId))requireField('src','Válassz Médiatár-fájlt vagy adj meg médiaforrást.');
  if(node.type==='video'&&!missing&&!hasAssetId(p.posterAssetId)&&isEditorOnlyMediaUrl(safeSrc(p.poster)||p.poster))requireField('poster','A szerkesztői előnézeti útvonal nem használható videó-borítóképként a publikált oldalon.');
  if(node.type==='image'&&(hasMediaSource(p.src)||hasAssetId(p.assetId))&&!p.decorative&&!hasText(p.alt))requireField('alt','Adj meg képleírást, vagy jelöld a képet díszítőnek.');
  if(node.type==='link'&&!safeHref(p.href))requireField('href','Adj meg hivatkozási célt.');
  if(node.type==='button'&&!safeHref(p.href)&&!safePageInteraction(node,pageNodes))requireField('href','Adj meg hivatkozási célt. Művelet nélküli gomb nem publikálható.');
  if(node.type==='heading'&&!hasText(p.text))requireField('text','A címsor nem lehet üres.');
  if(['gallery','carousel'].includes(node.type)&&items.some(item=>item&&typeof item==='object'&&!Array.isArray(item)&&hasInvalidAssetId(item.assetId)))requireField('items','Egy kép Médiatár-azonosítója érvénytelen. Válassz új fájlt, vagy töröld az adott választást.');
  const hasIncompleteMediaItem=item=>!item||typeof item!=='object'||Array.isArray(item)||(!hasMediaSource(item.src)&&!hasAssetId(item.assetId))||!(hasText(item.alt)||hasText(item.caption));
  if(['gallery','carousel'].includes(node.type)&&!missing&&(!items.length||items.some(hasIncompleteMediaItem)))requireField('items','A képekhez Médiatár-fájl vagy forrás, és leírás vagy képaláírás szükséges.');
  if(['tabs','accordion','dropdown'].includes(node.type)&&(!items.length||items.some(item=>!item||typeof item!=='object'||Array.isArray(item)||!hasText(item.title))))requireField('items','Legalább egy elnevezett rész szükséges.');
  if(node.type==='table'&&(!rows.length||!rows.some(row=>Array.isArray(row)&&row.some(hasText))))requireField('rows','A táblázatnak legyen tartalma.');
  if(node.type==='list'&&(!items.length||items.some(item=>!item||typeof item!=='object'||Array.isArray(item)||!hasText(item.text))))requireField('items','Adj meg legalább egy nem üres listaelemet.');
  if(node.type==='tooltip'&&(!hasText(p.text)||!hasText(p.description)))requireField(!hasText(p.text)?'text':'description','Felirat és magyarázat is szükséges.');
  if(node.type==='audio'&&p.controls===false)requireField('controls','A hanglejátszó vezérlőit nem rejtheted el.');
  if(node.type==='video'&&p.controls===false&&!(p.autoplay&&p.muted))requireField('controls','Vezérlők nélküli háttérvideó csak némítva, automatikusan indulhat.');
  return missing?Object.freeze(missing):null;
}
export function getPublicationContentIssue(node,options){
  return getPublicationContentGuidance(node,options)?.message??null;
}

export function validatePageForPublication(page){
  const seen=new Set();
  const pending=[{id:page.rootId,visible:[true,true,true]}];
  while(pending.length){
    const {id,visible}=pending.pop();
    if(seen.has(id))continue;
    seen.add(id);
    const node=page.nodes?.[id];if(!node)continue;
    const modes=['desktop','tablet','mobile'].map((device,index)=>visible[index]&&node.visibility!==false&&node.visibility?.[device]!==false);
    if(isAuthoredContent(node)&&modes.some(Boolean)){
      const missing=getPublicationContentIssue(node,{pageNodes:page.nodes});
      if(missing){const error=new Error(`${node.name||node.type}: ${missing}`);error.nodeId=node.id;throw error}
    }
    const children=Array.isArray(node.children)?node.children:[];
    for(let index=children.length-1;index>=0;index--)pending.push({id:children[index],visible:modes});
  }
}
export function contentDefaults(node,device='desktop'){
  if(node?.type==='root'&&node.metadata?.editorRootVersion===1)return {display:'block',backgroundColor:'#ffffff',color:'#182335',fontFamily:'system-ui',fontSize:'16px',lineHeight:'1.6'};
  if(!isAuthoredContent(node))return {};
  const common={fontFamily:'system-ui',fontSize:'16px',lineHeight:'1.6',color:'inherit'};
  if(['row','flex','navbar','menu'].includes(node.type))return {...common,display:'flex',flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:'16px',minHeight:'48px'};
  if(['grid','columns'].includes(node.type))return {...common,display:'grid',gridTemplateColumns:device==='mobile'?'1fr':'repeat(2, minmax(0, 1fr))',gap:'16px',minHeight:'48px'};
  if(node.type==='stack')return {...common,display:'flex',flexDirection:'column',gap:'16px',minHeight:'48px'};
  if(node.type==='absolute')return {...common,position:'absolute',left:'0px',top:'0px',width:'240px',minHeight:'48px'};
  if(node.type==='sticky')return {...common,position:'sticky',top:'0px',zIndex:'1',minHeight:'48px'};
  if(node.type==='overlay')return {...common,position:'absolute',left:'0px',top:'0px',width:'100%',height:'100%',backgroundColor:'#00000080',zIndex:'10'};
  if(['section','container','group','slot','footer','sidebar'].includes(node.type))return {...common,minHeight:'48px'};
  if(node.type==='icon')return {...common,fontSize:'32px',lineHeight:'1'};
  if(node.type==='heading'){
    const rawLevel=node.props?.level;
    const level=typeof rawLevel==='string'||typeof rawLevel==='number'?String(rawLevel):'2';
    return {...common,fontSize:({1:'48px',2:'36px',3:'28px',4:'24px',5:'20px',6:'18px'})[level]||'36px',fontWeight:'700',lineHeight:'1.2',margin:'0'};
  }
  if(node.type==='button')return {...common,display:'inline-flex',alignItems:'center',justifyContent:'center',padding:'12px 18px',backgroundColor:'#7047eb',color:'#ffffff',borderRadius:'10px',fontWeight:'600',textDecoration:'none'};
  if(node.type==='link')return {...common,textDecoration:'underline'};
  if(['card','panel'].includes(node.type))return {padding:'24px',borderWidth:'1px',borderStyle:'solid',borderColor:'#dce2eb',borderRadius:'16px',backgroundColor:'#ffffff',color:'#182335'};
  if(node.type==='spacer')return {height:'48px'};
  return common;
}
const renderableText=value=>typeof value==='string'?value:typeof value==='number'&&Number.isFinite(value)?String(value):'';
const displayText=value=>renderableText(value).trim();
const esc=value=>renderableText(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeHref=value=>{try{return value?validatedLinkHref(value):''}catch{return ''}};
const safeSrc=value=>{try{return typeof value==='string'?safeMediaUrl(value):''}catch{return ''}};
const trimmedText=value=>typeof value==='string'?value.trim():'';
const imageAlt=item=>item?.decorative?'':trimmedText(item?.alt);
const imageCaption=item=>trimmedText(item?.caption);
export function contentTag(node){const level=node.props?.level,number=typeof level==='string'||typeof level==='number'?Number(level):NaN;return node.type==='heading'?'h'+([1,2,3,4,5,6].includes(number)?number:2):['button','link'].includes(node.type)&&safeHref(node.props?.href)?'a':node.type==='button'?'button':node.type==='image'?'figure':node.type==='quote'?'blockquote':['footer','navbar','menu','sidebar'].includes(node.type)?{footer:'footer',navbar:'nav',menu:'nav',sidebar:'aside'}[node.type]:'div'}
export function contentAttributes(node,{pageNodes=null}={}){
  const p=node.props||{},a=node.accessibility||{},attributes={};
  const target=['_self','_blank'].includes(p.target)?p.target:'_self';
  if(['button','link'].includes(node.type)&&safeHref(p.href)){attributes.href=safeHref(p.href);attributes.target=target;if(target==='_blank')attributes.rel='noopener noreferrer'}
  if(node.type==='button'&&!attributes.href)attributes.type='button';
  // Legacy snapshots can still carry ariaLabel/anchorId. Resolve them here,
  // once, so Editor canvas and published HTML share the same attributes.
  const legacyLabel=!['image','video','audio'].includes(node.type)?trimmedText(a.ariaLabel):'';
  const label=legacyLabel||trimmedText(p.ariaLabel)||trimmedText(a.label);
  if(label)attributes['aria-label']=String(label).slice(0,legacyLabel?250:160);
  if(node.type==='icon'){if(attributes['aria-label'])attributes.role='img';else attributes['aria-hidden']='true'}
  const legacyAnchor=typeof a.anchorId==='string'&&/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(a.anchorId)?a.anchorId:'';
  if(legacyAnchor)attributes.id=legacyAnchor;
  else if(typeof a.id==='string'&&/^[A-Za-z][\w-]{0,79}$/.test(a.id))attributes.id=a.id;
  if(['en','hu','de','fr','es','it','pt','pl','ja','ko','zh'].includes(a.lang))attributes.lang=a.lang;
  if(a.decorative===true)attributes['aria-hidden']='true';
  if(pageNodes)Object.assign(attributes,pageInteractionAttributes(node,pageNodes));
  return attributes;
}
export function authoredNodeHtml(node,{childrenHtml='',device='desktop',editor=false,reducedMotion=false}={}){
  const p=contentProperties(node),text=esc(p.text??p.content??node.name??''),id='creator-'+safeContentDomId(node.id);
  const imageSource=item=>typeof item.assetId==='string'&&MEDIA_ASSET_ID.test(item.assetId)?`/${editor?'api/admin/media?id=':'media/'}${encodeURIComponent(item.assetId)}`:editor?safeSrc(item.src):safePublishedMediaUrl(item.src);
  const image=item=>{const src=imageSource(item),{focalX:x,focalY:y}=imageFocalPosition(item);return src?`<img src="${esc(src)}" alt="${esc(imageAlt(item))}" loading="${item.loading==='eager'?'eager':'lazy'}" decoding="async" style="object-fit:${['cover','contain','fill','none','scale-down'].includes(item.fit)?item.fit:'cover'};object-position:${x}% ${y}%">`:`<span class="creator-media-empty">${editor?'Válassz képet a Médiatárból vagy adj meg képcímet.':'A kép nem érhető el.'}</span>`};
  const items=Array.isArray(p.items)?p.items.slice(0,40).map(item=>item&&typeof item==='object'&&!Array.isArray(item)?item:{}):[];
  const authoredLabel=trimmedText(p.ariaLabel).slice(0,160);
  const carouselName=authoredLabel||'Képgaléria';
  const galleryName=authoredLabel||'Képek';
  const tablistName=authoredLabel||'Fülek';
  if(['heading','text','button','link','badge'].includes(node.type))return text;
  if(node.type==='quote'){const citation=displayText(p.citation);return `<div>${text}</div>${citation?`<cite>${esc(citation)}</cite>`:''}`}
  if(node.type==='icon'){const icon=typeof p.icon==='string'?p.icon:'';return `<span aria-hidden="true">${({star:'★',heart:'♥',play:'▶',check:'✓',arrow:'➜',bolt:'ϟ',camera:'📷',music:'♫',globe:'◎',mail:'✉'})[icon]||'★'}</span>`}
  if(node.type==='image')return `<div class="creator-image-frame"${['16 / 9','4 / 3','1 / 1','3 / 4'].includes(p.ratio)?` style="aspect-ratio:${p.ratio}"`:''}>${image(p)}</div>${imageCaption(p)?`<figcaption>${esc(imageCaption(p))}</figcaption>`:''}`;
  if(['video','audio'].includes(node.type)){
    const asset=typeof p.assetId==='string'&&MEDIA_ASSET_ID.test(p.assetId)?`/${editor?'api/admin/media?id=':'media/'}${encodeURIComponent(p.assetId)}`:'';const src=asset||(editor?safeSrc(p.src):safePublishedMediaUrl(p.src));if(!src)return `<span class="creator-media-empty">${editor?'Válassz fájlt a Médiatárból vagy adj meg médiaforrást.':'A média nem érhető el.'}</span>`;
    const tag=node.type,poster=tag==='video'?imageSource({assetId:p.posterAssetId,src:p.poster}):'',backgroundAutoplay=tag==='video'&&p.autoplay===true&&p.muted===true,autoplay=backgroundAutoplay&&!editor&&reducedMotion!==true,suppressAutoplay=editor||reducedMotion===true,controls=p.controls!==false||(backgroundAutoplay&&suppressAutoplay),motionAttrs=backgroundAutoplay?` data-reduced-motion-autoplay="true" data-reduced-motion-controls="${p.controls!==false?'true':'false'}"`:'';return `<${tag} src="${esc(src)}" preload="metadata"${motionAttrs}${controls?' controls':''}${p.loop?' loop':''}${p.muted?' muted':''}${autoplay?' autoplay':''}${tag==='video'?' playsinline':''}${poster?` poster="${esc(poster)}"`:''}></${tag}>`;
  }
  if(node.type==='list')return `<${p.ordered?'ol':'ul'}>${items.map(item=>{const href=safeHref(item.href),label=displayText(item.text);return `<li>${href?`<a href="${esc(href)}">${esc(label||'Hivatkozás')}</a>`:esc(item.text)}</li>`}).join('')}</${p.ordered?'ol':'ul'}>`;
  if(node.type==='table'){const caption=trimmedText(p.caption),tableName=caption||'Táblázat';return `<div class="creator-table-scroll" role="region" aria-label="${esc(tableName)}" tabindex="0"><table aria-label="${esc(tableName)}">${caption?`<caption>${esc(caption)}</caption>`:''}<tbody>${(Array.isArray(p.rows)?p.rows:[]).slice(0,100).map((row,index)=>`<tr>${(Array.isArray(row)?row:[]).slice(0,16).map(cell=>`<${p.header&&index===0?'th scope="col"':'td'}>${esc(cell)}</${p.header&&index===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table></div>`}
  if(node.type==='tabs')return `<div class="creator-tabs"><div role="tablist" aria-label="${esc(tablistName)}">${items.map((item,index)=>{const title=displayText(item?.title)||'Fül '+(index+1);return `<button type="button" role="tab" id="${id}-tab-${index}" aria-controls="${id}-panel-${index}" aria-selected="${index===0}" tabindex="${index===0?'0':'-1'}">${esc(title)}</button>`}).join('')}</div>${items.map((item,index)=>`<div role="tabpanel" id="${id}-panel-${index}" aria-labelledby="${id}-tab-${index}" tabindex="0"${index?' hidden':''}>${esc(item.text)}</div>`).join('')}</div>`;
  if(['accordion','dropdown'].includes(node.type)){
    const groupName=authoredLabel||(node.type==='accordion'?'Harmonika':'Lenyitható részek');
    // Native details name enforces single-open without event races and keeps
    // keyboard/Summary semantics intact on both canvas and published pages.
    const name=p.singleOpen===true?' name="creator-details-'+id+'"':'';
    return `<div class="creator-accordion" role="group" aria-label="${esc(groupName)}">${items.map((item,index)=>{const title=displayText(item?.title)||'Részletek';return `<details${name}${p.openFirst===true&&index===0?' open':''}><summary>${esc(title)}</summary><div>${esc(item.text)}</div></details>`}).join('')}</div>`;
  }
  if(['gallery','carousel'].includes(node.type)){
    const columns=typeof p.columns==='string'||typeof p.columns==='number'?Number(p.columns):NaN;
    const layout=node.type==='gallery'
      ?` role="region" aria-label="${esc(galleryName)}" style="grid-template-columns:repeat(${device==='mobile'?1:device==='tablet'?2:[2,3,4].includes(columns)?columns:3},minmax(0,1fr))"`
      :` id="${id}-carousel" tabindex="0" role="region" aria-roledescription="képgaléria" aria-label="${esc(carouselName)}"`;
    const figures=items.map(item=>{const alt=imageAlt(item),caption=imageCaption(item),accessibleName=caption||alt||'kép';return `<figure><button type="button" class="creator-image-zoom" data-lightbox-src="${esc(imageSource(item))}" data-lightbox-alt="${esc(alt||caption)}" data-lightbox-caption="${esc(caption)}" aria-haspopup="dialog" aria-label="${esc('Kép nagyítása: '+accessibleName)}">${image(item)}</button>${caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`}).join('');
    const singleSlide=items.length<=1;
    const controls=node.type==='carousel'?`<div class="creator-carousel-controls"><button type="button" data-carousel-step="-1" aria-controls="${id}-carousel" aria-label="Előző kép"${singleSlide?' disabled':''}>←</button><button type="button" data-carousel-step="1" aria-controls="${id}-carousel" aria-label="Következő kép"${singleSlide?' disabled':''}>→</button></div>`:'';
    return `<div class="creator-${node.type}"${layout}>${figures}</div>${controls}`;
  }
  if(node.type==='code')return `<pre${p.wrap?' class="creator-code-wrap"':''}><code>${esc(p.code)}</code></pre>`;
  if(node.type==='tooltip'){const description=displayText(p.description);return `<span class="creator-tooltip"><button type="button"${description?` aria-describedby="${id}-tip"`:''}>${text}</button>${description?`<span role="tooltip" id="${id}-tip">${esc(description)}</span>`:''}</span>`}
  if(node.type==='divider')return '<hr>';
  return childrenHtml;
}

export function initContentInteractions(root){
  if(root.dataset.contentInteractions==='1')return;root.dataset.contentInteractions='1';
  const view=root.ownerDocument?.defaultView,tabQueryKey='creator-tab',maxTabQueryEntries=40;
  const editorCanvas=Boolean(root.closest?.('.node-content'));
  const pendingTimers=new Map();
  const cancelTimer=targetId=>{const timer=pendingTimers.get(targetId);if(timer===undefined)return;view?.clearTimeout?.(timer);pendingTimers.delete(targetId)};
  const cancelTimers=()=>{for(const targetId of pendingTimers.keys())cancelTimer(targetId)};
  const cancelTimerForEvent=event=>{const target=event.target?.closest?.('[data-page-node-id]');if(target&&root.contains(target))cancelTimer(target.dataset.pageNodeId)};
  const scheduleTooltipPosition=wrapper=>{
    if(!view||!wrapper)return;
    const request=view.requestAnimationFrame?.bind(view)||((callback)=>view.setTimeout(callback,0));
    request(()=>{
      if(!wrapper.isConnected)return;
      if(!wrapper.matches(':hover,:focus-within')){
        wrapper.removeAttribute('data-tooltip-placement');
        wrapper.style.removeProperty('--creator-tooltip-shift-x');
        wrapper.style.removeProperty('--creator-tooltip-shift-y');
        return;
      }
      const tooltip=wrapper.querySelector('[role="tooltip"]'),trigger=wrapper.querySelector('button');
      if(!tooltip||!trigger)return;
      const viewport=view.visualViewport,padding=8;
      const left=viewport?.offsetLeft||0,top=viewport?.offsetTop||0;
      const right=left+(viewport?.width||view.innerWidth)-padding;
      const bottom=top+(viewport?.height||view.innerHeight)-padding;
      const triggerRect=trigger.getBoundingClientRect();
      wrapper.dataset.tooltipPlacement='above';
      wrapper.style.setProperty('--creator-tooltip-shift-x','0px');
      wrapper.style.setProperty('--creator-tooltip-shift-y','0px');
      let rect=tooltip.getBoundingClientRect();
      const spaceAbove=triggerRect.top-top-padding,spaceBelow=bottom-triggerRect.bottom;
      if(rect.top<top+padding&&spaceBelow>spaceAbove){
        wrapper.dataset.tooltipPlacement='below';
        rect=tooltip.getBoundingClientRect();
      }
      let shiftX=0,shiftY=0;
      if(rect.left+shiftX<left+padding)shiftX=left+padding-rect.left;
      if(rect.right+shiftX>right)shiftX+=right-(rect.right+shiftX);
      if(rect.top+shiftY<top+padding)shiftY=top+padding-rect.top;
      if(rect.bottom+shiftY>bottom)shiftY+=bottom-(rect.bottom+shiftY);
      wrapper.style.setProperty('--creator-tooltip-shift-x',`${shiftX}px`);
      wrapper.style.setProperty('--creator-tooltip-shift-y',`${shiftY}px`);
    });
  };
  const refreshVisibleTooltips=()=>{
    for(const wrapper of root.querySelectorAll('.creator-tooltip'))if(wrapper.matches(':hover,:focus-within'))scheduleTooltipPosition(wrapper);
  };
  const parseTabEntry=value=>{
    if(typeof value!=='string'||value.length>128)return null;
    const separator=value.lastIndexOf(':');if(separator<1)return null;
    const targetId=value.slice(0,separator),indexText=value.slice(separator+1);
    if(!/^[A-Za-z0-9_-]{1,120}$/.test(targetId)||!/^(0|[1-9]\d{0,2})$/.test(indexText))return null;
    const index=Number(indexText);return Number.isSafeInteger(index)&&index<40?{targetId,index}:null;
  };
  const tabNode=tab=>tab?.closest?.('[data-page-node-id]');
  const writeTabUrlState=tab=>{
    if(editorCanvas||!view?.history?.pushState||!view.location)return;
    const node=tabNode(tab),tabs=tab.closest('.creator-tabs')?.querySelectorAll('[role="tab"]');
    const index=tabs?[...tabs].indexOf(tab):-1,targetId=node?.dataset?.pageNodeId;
    if(typeof targetId!=='string'||!/^[A-Za-z0-9_-]{1,120}$/.test(targetId)||index<0||index>=40)return;
    try{
      const url=new URL(view.location.href),entries=url.searchParams.getAll(tabQueryKey).map(parseTabEntry).filter(Boolean).filter(entry=>entry.targetId!==targetId);
      entries.push({targetId,index});url.searchParams.delete(tabQueryKey);
      for(const entry of entries.slice(-maxTabQueryEntries))url.searchParams.append(tabQueryKey,`${entry.targetId}:${entry.index}`);
      if(url.href!==view.location.href)view.history.pushState(view.history.state,'',url);
    }catch{/* URL state is an enhancement; a tab action still works without history support. */}
  };
  const activate=(tab,{writeUrl=true}={})=>{const group=tab.closest('.creator-tabs');if(!group)return;for(const button of group.querySelectorAll('[role="tab"]')){const selected=button===tab;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;const panel=group.querySelector('[id="'+button.getAttribute('aria-controls')+'"]');if(panel)panel.hidden=!selected}if(writeUrl)writeTabUrlState(tab)};
  const readTabUrlState=()=>{
    const entries=new Map();
    if(!view?.location)return entries;
    for(const value of new URL(view.location.href).searchParams.getAll(tabQueryKey).slice(-maxTabQueryEntries)){
      const entry=parseTabEntry(value);if(entry)entries.set(entry.targetId,entry.index);
    }
    return entries;
  };
  const applyTabUrlState=(entries=readTabUrlState())=>{
    if(!view?.location)return;
    for(const target of root.querySelectorAll('[data-page-node-id]')){
      const tabs=target.querySelectorAll('.creator-tabs [role="tab"]');if(!tabs.length)continue;
      const requested=entries.get(target.dataset.pageNodeId),index=Number.isInteger(requested)&&requested>=0&&requested<tabs.length?requested:0;
      activate(tabs[index],{writeUrl:false});
    }
  };
  const runPageAction=(source,{writeUrl=true}={})=>{
    const action=source?.dataset?.pageAction,targetId=source?.dataset?.pageActionTarget;
    if(!['scroll-to','select-tab','open-disclosure','close-disclosure','toggle-disclosure'].includes(action)||typeof targetId!=='string'||!/^[A-Za-z0-9_-]{1,120}$/.test(targetId))return false;
    // Page Model IDs use this strict allowlist, so an exact same-page selector
    // is safe and avoids allocating/scanning every page node per activation.
    const target=root.querySelector(`[data-page-node-id="${targetId}"]`);
    if(!target)return false;
    if(action==='scroll-to'){
      const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
      try{target.scrollIntoView({behavior,block:'start'})}catch{target.scrollIntoView()}
      return true;
    }
    const index=Number(source.dataset.pageActionIndex);
    if(!Number.isInteger(index)||index<0)return false;
    if(action==='select-tab'){
      const tab=target.querySelectorAll('.creator-tabs [role="tab"]')[index];
      if(!tab)return false;
      activate(tab,{writeUrl});
      return true;
    }
    const group=target.querySelector('.creator-accordion');
    const details=group?.querySelectorAll('details')?.[index];
    if(!details)return false;
    const willOpen=action==='open-disclosure'?true:action==='close-disclosure'?false:!details.open;
    if(willOpen&&details.hasAttribute('name')){
      for(const item of group.querySelectorAll('details'))item.open=false;
    }
    details.open=willOpen;
    return true;
  };
  const scrollCarousel=(track,key)=>{
    if(!track)return;
    const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
    if(key==='Home'||key==='End'){
      track.scrollTo({left:key==='Home'?0:track.scrollWidth,behavior});
    }else{
      track.scrollBy({left:(key==='ArrowRight'?1:-1)*track.clientWidth,behavior});
    }
  };
  root.addEventListener('focusin',event=>{
    scheduleTooltipPosition(event.target?.closest?.('.creator-tooltip'));
    cancelTimerForEvent(event);const actionSource=event.target?.closest?.('[data-page-action]');
    if(actionSource&&root.contains(actionSource)&&actionSource.dataset.pageActionEvent==='focus')runPageAction(actionSource);
  });
  root.addEventListener('focusout',event=>scheduleTooltipPosition(event.target?.closest?.('.creator-tooltip')));
  root.addEventListener('pointerdown',cancelTimerForEvent);
  root.addEventListener('pointerover',event=>{
    const tooltip=event.target?.closest?.('.creator-tooltip');
    if(tooltip&&root.contains(tooltip)&&(event.pointerType==='mouse'||event.pointerType==='pen')&&(!event.relatedTarget||!tooltip.contains(event.relatedTarget)))scheduleTooltipPosition(tooltip);
    if(event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    const actionSource=event.target?.closest?.('[data-page-action]');
    if(!actionSource||!root.contains(actionSource)||actionSource.dataset.pageActionEvent!=='hover')return;
    // pointerover bubbles across descendants; only enter the authored trigger
    // once, and never turn a touch-generated pointer event into a hover action.
    if(event.relatedTarget&&actionSource.contains(event.relatedTarget))return;
    runPageAction(actionSource);
  });
  root.addEventListener('pointerout',event=>{
    const tooltip=event.target?.closest?.('.creator-tooltip');
    if(tooltip&&root.contains(tooltip)&&(!event.relatedTarget||!tooltip.contains(event.relatedTarget)))scheduleTooltipPosition(tooltip);
  });
  root.addEventListener('click',event=>{const selectedTab=event.target.closest('[role="tab"]');if(selectedTab&&root.contains(selectedTab)){const target=selectedTab.closest('[data-page-node-id]');if(target)cancelTimer(target.dataset.pageNodeId)}const actionSource=event.target.closest('[data-page-action]'),actionEvent=actionSource?.dataset?.pageActionEvent;if(actionSource&&root.contains(actionSource)&&(actionEvent==='click'||actionEvent==='hover')&&runPageAction(actionSource))event.preventDefault();const zoom=event.target.closest('[data-lightbox-src]');if(zoom&&root.contains(zoom)&&safeSrc(zoom.dataset.lightboxSrc)){
    // The preview is scoped to its own gallery/carousel; nested galleries
    // elsewhere on the page never leak into this lightbox's navigation.
    const container=zoom.closest('.creator-gallery,.creator-carousel');
    const choices=[...(container||root).querySelectorAll('.creator-image-zoom[data-lightbox-src]')]
      .filter(button=>Boolean(safeSrc(button.dataset.lightboxSrc)));
    let activeIndex=Math.max(0,choices.indexOf(zoom));
    const dialog=document.createElement('dialog');dialog.className='creator-lightbox';dialog.setAttribute('aria-label','Kép előnézete');
    const close=document.createElement('button');close.type='button';close.textContent='Bezárás';
    const img=document.createElement('img');
    const caption=document.createElement('p');caption.className='creator-lightbox-caption';
    const nav=document.createElement('div');nav.className='creator-lightbox-nav';
    const previous=document.createElement('button');previous.type='button';previous.textContent='←';previous.setAttribute('aria-label','Előző kép');
    const count=document.createElement('span');count.setAttribute('role','status');count.setAttribute('aria-live','polite');
    const next=document.createElement('button');next.type='button';next.textContent='→';next.setAttribute('aria-label','Következő kép');
    nav.append(previous,count,next);nav.hidden=choices.length<=1;
    const show=index=>{
      activeIndex=(index+choices.length)%choices.length;
      const selected=choices[activeIndex];
      img.src=safeSrc(selected.dataset.lightboxSrc);
      img.alt=selected.dataset.lightboxAlt||'';
      caption.textContent=selected.dataset.lightboxCaption||'';
      caption.hidden=!caption.textContent;
      count.textContent=(activeIndex+1)+' / '+choices.length;
    };
    previous.onclick=()=>show(activeIndex-1);
    next.onclick=()=>show(activeIndex+1);
    dialog.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||choices.length<=1)return;
      event.preventDefault();
      show(event.key==='Home'?0:event.key==='End'?choices.length-1:activeIndex+(event.key==='ArrowRight'?1:-1));
    });
    dialog.append(close,img,caption,nav);document.body.append(dialog);show(activeIndex);
    close.onclick=()=>dialog.close();
    dialog.onclick=event=>{if(event.target===dialog)dialog.close()};
    dialog.onclose=()=>{
      const focused=document.activeElement;
      const restore=focused===document.body||dialog.contains(focused)||focused===zoom;
      dialog.remove();
      if(restore&&zoom.isConnected)zoom.focus();
    };
    dialog.showModal();close.focus();
  }const tab=event.target.closest('[role="tab"]');if(tab&&root.contains(tab))activate(tab);const step=event.target.closest('[data-carousel-step]');if(step&&root.contains(step)){const track=step.parentElement.previousElementSibling;if(track?.querySelectorAll('figure').length>1)scrollCarousel(track,Number(step.dataset.carouselStep)>0?'ArrowRight':'ArrowLeft')}});
  // The carousel region is intentionally keyboard-focusable. Arrow keys and
  // Home/End must operate the same viewport used by its visible buttons;
  // do not hijack keys while a nested image/lightbox button is focused.
  root.addEventListener('keydown',event=>{
    const track=event.target.closest('.creator-carousel[role="region"]');
    if(!track||!root.contains(track)||event.target!==track||track.querySelectorAll('figure').length<2||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    scrollCarousel(track,event.key);
  });
  root.addEventListener('keydown',event=>{const tab=event.target.closest('[role="tab"]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const tabs=[...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')],index=tabs.indexOf(tab);const next=tabs[event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];event.preventDefault();activate(next);next.focus()});
  if(view&&!editorCanvas){
    view.addEventListener('resize',refreshVisibleTooltips);
    view.addEventListener('scroll',refreshVisibleTooltips,true);
    view.visualViewport?.addEventListener('resize',refreshVisibleTooltips);
    view.visualViewport?.addEventListener('scroll',refreshVisibleTooltips);
    const applyLoadBaseline=urlState=>{
      const claimedTargets=new Set(urlState.keys());
      const loadTargets=new Set();
      for(const source of root.querySelectorAll('[data-page-action-event="load"]')){
        const targetId=source.dataset.pageActionTarget;
        if(typeof targetId!=='string'||claimedTargets.has(targetId)||loadTargets.has(targetId))continue;
        if(runPageAction(source,{writeUrl:false})){loadTargets.add(targetId);claimedTargets.add(targetId)}
      }
      return loadTargets;
    };
    const urlState=readTabUrlState();
    applyTabUrlState(urlState);
    const loadTargets=applyLoadBaseline(urlState);
    if(!view.document?.hidden){
      for(const source of root.querySelectorAll('[data-page-action-event="timer"]')){
        const targetId=source.dataset.pageActionTarget,delayMs=Number(source.dataset.pageActionDelayMs);
        if(typeof targetId!=='string'||urlState.has(targetId)||loadTargets.has(targetId)||pendingTimers.has(targetId)||!PAGE_ACTION_TIMER_DELAYS_MS.includes(delayMs))continue;
        const timer=view.setTimeout(()=>{
          pendingTimers.delete(targetId);
          if(root.isConnected&&!view.document?.hidden)runPageAction(source,{writeUrl:false});
        },delayMs);
        pendingTimers.set(targetId,timer);
      }
    }
    view.addEventListener('popstate',()=>{cancelTimers();const nextState=readTabUrlState();applyTabUrlState(nextState);applyLoadBaseline(nextState)});
    view.document?.addEventListener('visibilitychange',()=>{if(view.document.hidden)cancelTimers()});
    if(pendingTimers.size)view.addEventListener('pagehide',cancelTimers,{once:true});
  }
}
