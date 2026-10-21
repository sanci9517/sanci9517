import { validatedLinkHref } from './richtext-links.js';

export const CONTENT_VERSION=1;
const field=(key,label,type='text',extra={})=>({key,label,type,...extra});
const text=field('text','Szöveg','textarea',{max:20000});
const href=field('href','Hivatkozás','url',{help:'Belső /p/oldal vagy #azonosító, illetve teljes https:// vagy mailto: cím. Üresen az elem nem navigál.'});
const linkFields=[href,field('target','Megnyitás','select',{options:{_self:'Ebben az ablakban',_blank:'Új ablakban'}}),field('ariaLabel','Akadálymentes elnevezés','text',{max:160})];
const media=[field('src','Külső média címe','media-url',{help:'Régi vagy külső HTTPS-képforráshoz. A Médiatárból választott fájl lentebb rögzített assetazonosítót használ.'}),field('assetId','Médiatár','asset',{help:'A kiválasztott képet a webhely saját, hozzáférés-ellenőrzött Médiatára szolgálja ki. A piszkozat mentése nem teszi nyilvánossá.'})];
const externalMedia=[field('src','Külső média címe','media-url',{help:'HTTPS vagy webhelyen belüli, ellenőrzött médiaforrás.'})];
const focalFields=[field('focalX','Kivágás vízszintesen','range',{min:0,max:100,step:1,help:'A kép látható részét balról jobbra igazítja.'}),field('focalY','Kivágás függőlegesen','range',{min:0,max:100,step:1,help:'A kép látható részét felülről lefelé igazítja.'})];
const imageFields=[...media,field('alt','Kép szöveges leírása','text',{max:500}),field('decorative','Csak díszítő kép','boolean'),field('caption','Képaláírás','textarea',{max:1000}),field('fit','Kép illesztése','select',{options:{cover:'Kitöltés, vágással',contain:'Teljes kép',fill:'Nyújtás',none:'Eredeti méret', 'scale-down':'Csak kicsinyítés'}}),field('ratio','Képarány','select',{options:{auto:'Eredeti','16 / 9':'16:9','4 / 3':'4:3','1 / 1':'Négyzet','3 / 4':'Álló 3:4'}}),...focalFields,field('loading','Betöltés','select',{options:{lazy:'Késleltetett',eager:'Azonnali'}})];
export const CONTENT_FIELDS=Object.freeze({
  heading:[text,field('level','Címsor szemantikai szintje','select',{options:{1:'H1 – főcím',2:'H2 – szakaszcím',3:'H3',4:'H4',5:'H5',6:'H6'}})],
  text:[text],button:[text,...linkFields],link:[text,...linkFields],quote:[text,field('citation','Forrás / szerző')],badge:[text],icon:[field('icon','Ikon','select',{options:{star:'Csillag',heart:'Szív',play:'Lejátszás',check:'Pipa',arrow:'Nyíl',bolt:'Villám',camera:'Kamera',music:'Zene',globe:'Web',mail:'Levél'}}),field('ariaLabel','Ikon leírása','text',{max:160})],
  image:imageFields,video:[...externalMedia,field('poster','Külső borítókép címe','media-url',{help:'Meglévő HTTPS vagy belső kép-URL. A Médiatárból választott borítókép elsőbbséget kap.'}),field('posterAssetId','Borítókép a Médiatárból','asset',{help:'A videó továbbra is URL-ből játszódik le; csak a borítókép kerül a privát kép-Médiatárból az oldalra.'}),field('controls','Lejátszó vezérlők','boolean'),field('muted','Némítás','boolean'),field('loop','Ismétlés','boolean'),field('autoplay','Automatikus indítás némítva','boolean')],audio:[...externalMedia,field('controls','Lejátszó vezérlők','boolean'),field('loop','Ismétlés','boolean')],
  list:[field('ordered','Számozott lista','boolean'),field('items','Listaelemek','repeater',{itemFields:[text,href]})],
  table:[field('caption','Táblázat címe'),field('header','Az első sor fejléc','boolean'),field('rows','Táblázat sorai','table')],
  tabs:[field('ariaLabel','Fülcsoport elnevezése','text',{max:160}),field('items','Fülek','repeater',{itemFields:[field('title','Fül címe'),text]})],accordion:[field('ariaLabel','Harmonikacsoport elnevezése','text',{max:160}),field('singleOpen','Egyszerre csak egy nyitott rész','boolean'),field('openFirst','Első rész kezdetben nyitva','boolean'),field('items','Lenyitható részek','repeater',{itemFields:[field('title','Rész címe'),text]})],dropdown:[field('ariaLabel','Lenyitható csoport elnevezése','text',{max:160}),field('singleOpen','Egyszerre csak egy nyitott rész','boolean'),field('openFirst','Első rész kezdetben nyitva','boolean'),field('items','Lenyitható részek','repeater',{itemFields:[field('title','Rész címe'),text]})],
  gallery:[field('ariaLabel','Képgaléria elnevezése','text',{max:160}),field('columns','Oszlopok asztalon','select',{options:{2:'2 oszlop',3:'3 oszlop',4:'4 oszlop'}}),field('items','Képek','repeater',{itemFields:[...media,field('alt','Képleírás'),field('caption','Képaláírás'),field('fit','Kép illesztése','select',{options:{cover:'Kitöltés, vágással',contain:'Teljes kép'}}),...focalFields]})],
  carousel:[field('ariaLabel','Galéria elnevezése'),field('items','Lapozható képek','repeater',{itemFields:[...media,field('alt','Képleírás'),field('caption','Képaláírás'),field('fit','Kép illesztése','select',{options:{cover:'Kitöltés, vágással',contain:'Teljes kép'}}),...focalFields]})],
  code:[field('code','Megjelenített kód','textarea',{max:20000}),field('wrap','Hosszú sorok tördelése','boolean')],tooltip:[field('text','Gomb felirata'),field('description','Magyarázat','textarea',{max:2000})],divider:[],spacer:[]
});
export const CONTENT_TYPES=Object.freeze(Object.keys(CONTENT_FIELDS));
export function contentProperties(node){
  const defaults={level:'2',columns:'3',controls:true,target:'_self',fit:'cover',ratio:'auto',focalPoint:'center',loading:'lazy',icon:'star'};
  const props={...Object.fromEntries((CONTENT_FIELDS[node.type]||[]).filter(field=>Object.hasOwn(defaults,field.key)).map(field=>[field.key,defaults[field.key]])),...node.props};
  if(['image','gallery','carousel'].includes(node.type)){
    const legacy={center:[50,50],top:[50,0],bottom:[50,100],left:[0,50],right:[100,50]}[props.focalPoint]||[50,50];
    props.focalX??=legacy[0];props.focalY??=legacy[1];
  }
  return props;
}
export const STRUCTURAL_TYPES=Object.freeze(['section','container','row','columns','flex','grid','stack','group','slot','card','panel','navbar','menu','footer','sidebar','absolute','sticky','overlay']);
export function isAuthoredContent(node){return node?.metadata?.contentVersion===CONTENT_VERSION}
export function safeMediaUrl(value){
  const raw=String(value??'').trim();if(!raw)return '';
  const valid=validatedLinkHref(raw);
  if(valid.startsWith('/')&&!valid.startsWith('//')&&!valid.startsWith('/\\'))return valid;
  const url=new URL(valid);if(url.protocol!=='https:')throw new Error('A médiaforrás csak HTTPS vagy belső útvonal lehet.');return valid;
}
export function normalizeContentField(definition,value){
  if(definition.type==='boolean'){if(typeof value!=='boolean')throw new Error('Logikai érték szükséges.');return value}
  if(definition.type==='repeater'){
    if(!Array.isArray(value)||value.length>40)throw new Error('Legfeljebb 40 elem adható meg.');
    return value.map(item=>{if(!item||typeof item!=='object'||Array.isArray(item))throw new Error('Hibás listaelem.');const result={...item};for(const def of definition.itemFields)if(item[def.key]!==undefined)result[def.key]=normalizeContentField(def,item[def.key]);return result});
  }
  if(definition.type==='table'){
    if(!Array.isArray(value)||value.length>100)throw new Error('Legfeljebb 100 sor adható meg.');
    return value.map(row=>{if(!Array.isArray(row)||row.length>16)throw new Error('Legfeljebb 16 oszlop használható.');return row.map(cell=>normalizeContentField({type:'text',max:2000},cell))});
  }
  if(definition.type==='range'){
    const number=typeof value==='number'?value:Number(value);
    if(!Number.isFinite(number)||number<(definition.min??0)||number>(definition.max??100))throw new Error(`Az érték ${definition.min??0} és ${definition.max??100} közé essen.`);
    return number;
  }
  if(definition.type==='asset'){
    const result=String(value??'');if(result&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result))throw new Error('Érvénytelen Médiatár-azonosító.');return result;
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
}
export function validatePageForPublication(page){
  const seen=new Set();
  const visit=(id,visible)=>{if(seen.has(id))return;seen.add(id);const node=page.nodes?.[id];if(!node)return;
    const modes=['desktop','tablet','mobile'].map((device,index)=>visible[index]&&node.visibility!==false&&node.visibility?.[device]!==false),p=contentProperties(node);
    if(isAuthoredContent(node)&&modes.some(Boolean)){
      let missing='';
      if(['image','video','audio'].includes(node.type)&&!p.src?.trim()&&!p.assetId)missing='Válassz Médiatár-fájlt vagy adj meg médiaforrást.';
      if(node.type==='image'&&(p.src||p.assetId)&&!p.decorative&&!p.alt?.trim())missing='Adj meg képleírást, vagy jelöld a képet díszítőnek.';
      if(['link','button'].includes(node.type)&&!p.href?.trim())missing='Adj meg hivatkozási célt. Művelet nélküli gomb nem publikálható.';
      if(node.type==='heading'&&!p.text?.trim())missing='A címsor nem lehet üres.';
      if(['gallery','carousel'].includes(node.type)&&(!p.items?.length||p.items.some(item=>(!item.src?.trim()&&!item.assetId)||!(item.alt?.trim()||item.caption?.trim()))))missing='A képekhez Médiatár-fájl vagy forrás, és leírás vagy képaláírás szükséges.';
      if(['tabs','accordion','dropdown'].includes(node.type)&&(!p.items?.length||p.items.some(item=>!item.title?.trim())))missing='Legalább egy elnevezett rész szükséges.';
      if(node.type==='table'&&(!p.rows?.length||!p.rows.some(row=>row.some(cell=>String(cell).trim()))))missing='A táblázatnak legyen tartalma.';
      if(node.type==='list'&&(!p.items?.length||p.items.some(item=>!item.text?.trim())))missing='Adj meg legalább egy nem üres listaelemet.';
      if(node.type==='tooltip'&&(!p.text?.trim()||!p.description?.trim()))missing='Felirat és magyarázat is szükséges.';
      if(node.type==='audio'&&p.controls===false)missing='A hanglejátszó vezérlőit nem rejtheted el.';
      if(node.type==='video'&&p.controls===false&&!(p.autoplay&&p.muted))missing='Vezérlők nélküli háttérvideó csak némítva, automatikusan indulhat.';
      if(missing){const error=new Error(`${node.name||node.type}: ${missing}`);error.nodeId=node.id;throw error}
    }
    for(const child of node.children||[])visit(child,modes);
  };
  visit(page.rootId,[true,true,true]);
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
  if(node.type==='heading')return {...common,fontSize:({1:'48px',2:'36px',3:'28px',4:'24px',5:'20px',6:'18px'})[node.props?.level||2]||'36px',fontWeight:'700',lineHeight:'1.2',margin:'0'};
  if(node.type==='button')return {...common,display:'inline-flex',alignItems:'center',justifyContent:'center',padding:'12px 18px',backgroundColor:'#7047eb',color:'#ffffff',borderRadius:'10px',fontWeight:'600',textDecoration:'none'};
  if(node.type==='link')return {...common,textDecoration:'underline'};
  if(['card','panel'].includes(node.type))return {padding:'24px',borderWidth:'1px',borderStyle:'solid',borderColor:'#dce2eb',borderRadius:'16px',backgroundColor:'#ffffff',color:'#182335'};
  if(node.type==='spacer')return {height:'48px'};
  return common;
}
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeHref=value=>{try{return value?validatedLinkHref(value):''}catch{return ''}};
const safeSrc=value=>{try{return safeMediaUrl(value)}catch{return ''}};
export function contentTag(node){return node.type==='heading'?'h'+([1,2,3,4,5,6].includes(Number(node.props?.level))?Number(node.props.level):2):['button','link'].includes(node.type)&&safeHref(node.props?.href)?'a':node.type==='button'?'button':node.type==='image'?'figure':node.type==='quote'?'blockquote':['footer','navbar','menu','sidebar'].includes(node.type)?{footer:'footer',navbar:'nav',menu:'nav',sidebar:'aside'}[node.type]:'div'}
export function contentAttributes(node){
  const p=node.props||{},a=node.accessibility||{},attributes={};
  const target=['_self','_blank'].includes(p.target)?p.target:'_self';
  if(['button','link'].includes(node.type)&&safeHref(p.href)){attributes.href=safeHref(p.href);attributes.target=target;if(target==='_blank')attributes.rel='noopener noreferrer'}
  if(node.type==='button'&&!attributes.href)attributes.type='button';
  // Legacy snapshots can still carry ariaLabel/anchorId. Resolve them here,
  // once, so Editor canvas and published HTML share the same attributes.
  const legacyLabel=!['image','video','audio'].includes(node.type)&&typeof a.ariaLabel==='string'?a.ariaLabel.trim():'';
  const label=legacyLabel||p.ariaLabel||a.label;
  if(label)attributes['aria-label']=String(label).slice(0,legacyLabel?250:160);
  if(node.type==='icon'){if(attributes['aria-label'])attributes.role='img';else attributes['aria-hidden']='true'}
  const legacyAnchor=typeof a.anchorId==='string'&&/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(a.anchorId)?a.anchorId:'';
  if(legacyAnchor)attributes.id=legacyAnchor;
  else if(a.id&&/^[A-Za-z][\w-]{0,79}$/.test(a.id))attributes.id=a.id;
  if(['en','hu','de','fr','es','it','pt','pl','ja','ko','zh'].includes(a.lang))attributes.lang=a.lang;
  if(a.decorative===true)attributes['aria-hidden']='true';
  return attributes;
}
export function authoredNodeHtml(node,{childrenHtml='',device='desktop',editor=false}={}){
  const p=contentProperties(node),text=esc(p.text??p.content??node.name??''),id='creator-'+String(node.id).replace(/[^\w-]/g,'-');
  const imageSource=item=>typeof item.assetId==='string'&&/^[0-9a-f-]{36}$/i.test(item.assetId)?`/${editor?'api/admin/media?id=':'media/'}${encodeURIComponent(item.assetId)}`:safeSrc(item.src);
  const image=item=>{const src=imageSource(item),legacy={center:[50,50],top:[50,0],bottom:[50,100],left:[0,50],right:[100,50]}[item.focalPoint]||[50,50],x=Number.isFinite(Number(item.focalX))?Math.max(0,Math.min(100,Number(item.focalX))):legacy[0],y=Number.isFinite(Number(item.focalY))?Math.max(0,Math.min(100,Number(item.focalY))):legacy[1];return src?`<img src="${esc(src)}" alt="${esc(item.decorative?'':item.alt||'')}" loading="${item.loading==='eager'?'eager':'lazy'}" decoding="async" style="object-fit:${['cover','contain','fill','none','scale-down'].includes(item.fit)?item.fit:'cover'};object-position:${x}% ${y}%">`:`<span class="creator-media-empty">${editor?'Válassz képet a Médiatárból vagy adj meg képcímet.':'A kép nem érhető el.'}</span>`};
  const items=Array.isArray(p.items)?p.items.slice(0,40):[];
  const carouselName=String(p.ariaLabel??'').trim().slice(0,160)||'Képgaléria';
  const galleryName=String(p.ariaLabel??'').trim().slice(0,160)||'Képek';
  const tablistName=String(p.ariaLabel??'').trim().slice(0,160)||'Fülek';
  if(['heading','text','button','link','badge'].includes(node.type))return text;
  if(node.type==='quote')return `<div>${text}</div>${p.citation?`<cite>${esc(p.citation)}</cite>`:''}`;
  if(node.type==='icon')return `<span aria-hidden="true">${({star:'★',heart:'♥',play:'▶',check:'✓',arrow:'➜',bolt:'ϟ',camera:'📷',music:'♫',globe:'◎',mail:'✉'})[p.icon]||'★'}</span>`;
  if(node.type==='image')return `<div class="creator-image-frame"${['16 / 9','4 / 3','1 / 1','3 / 4'].includes(p.ratio)?` style="aspect-ratio:${p.ratio}"`:''}>${image(p)}</div>${p.caption?`<figcaption>${esc(p.caption)}</figcaption>`:''}`;
  if(['video','audio'].includes(node.type)){
    const asset=typeof p.assetId==='string'&&/^[0-9a-f-]{36}$/i.test(p.assetId)?`/${editor?'api/admin/media?id=':'media/'}${encodeURIComponent(p.assetId)}`:'';const src=asset||safeSrc(p.src);if(!src)return `<span class="creator-media-empty">${editor?'Válassz fájlt a Médiatárból vagy adj meg médiaforrást.':'A média nem érhető el.'}</span>`;
    const tag=node.type,poster=tag==='video'?imageSource({assetId:p.posterAssetId,src:p.poster}):'';return `<${tag} src="${esc(src)}" preload="metadata"${p.controls!==false?' controls':''}${p.loop?' loop':''}${p.muted?' muted':''}${p.autoplay&&p.muted&&!editor?' autoplay':''}${tag==='video'?' playsinline':''}${poster?` poster="${esc(poster)}"`:''}></${tag}>`;
  }
  if(node.type==='list')return `<${p.ordered?'ol':'ul'}>${items.map(item=>`<li>${safeHref(item.href)?`<a href="${esc(safeHref(item.href))}">${esc(item.text)}</a>`:esc(item.text)}</li>`).join('')}</${p.ordered?'ol':'ul'}>`;
  if(node.type==='table')return `<div class="creator-table-scroll" role="region" aria-label="${esc(p.caption||'Táblázat')}" tabindex="0"><table>${p.caption?`<caption>${esc(p.caption)}</caption>`:''}<tbody>${(Array.isArray(p.rows)?p.rows:[]).slice(0,100).map((row,index)=>`<tr>${(Array.isArray(row)?row:[]).slice(0,16).map(cell=>`<${p.header&&index===0?'th scope="col"':'td'}>${esc(cell)}</${p.header&&index===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if(node.type==='tabs')return `<div class="creator-tabs"><div role="tablist" aria-label="${esc(tablistName)}">${items.map((item,index)=>`<button type="button" role="tab" id="${id}-tab-${index}" aria-controls="${id}-panel-${index}" aria-selected="${index===0}" tabindex="${index===0?'0':'-1'}">${esc(item.title||'Fül '+(index+1))}</button>`).join('')}</div>${items.map((item,index)=>`<div role="tabpanel" id="${id}-panel-${index}" aria-labelledby="${id}-tab-${index}" tabindex="0"${index?' hidden':''}>${esc(item.text)}</div>`).join('')}</div>`;
  if(['accordion','dropdown'].includes(node.type)){
    const groupName=String(p.ariaLabel??'').trim().slice(0,160)||(node.type==='accordion'?'Harmonika':'Lenyitható részek');
    // Native details name enforces single-open without event races and keeps
    // keyboard/Summary semantics intact on both canvas and published pages.
    const name=p.singleOpen===true?' name="creator-details-'+id+'"':'';
    return `<div class="creator-accordion" role="group" aria-label="${esc(groupName)}">${items.map((item,index)=>`<details${name}${p.openFirst===true&&index===0?' open':''}><summary>${esc(item.title||'Részletek')}</summary><div>${esc(item.text)}</div></details>`).join('')}</div>`;
  }
  if(['gallery','carousel'].includes(node.type))return `<div class="creator-${node.type}"${node.type==='gallery'?` role="region" aria-label="${esc(galleryName)}" style="grid-template-columns:repeat(${device==='mobile'?1:device==='tablet'?2:[2,3,4].includes(Number(p.columns))?Number(p.columns):3},minmax(0,1fr))"`:` tabindex="0" role="region" aria-roledescription="képgaléria" aria-label="${esc(carouselName)}"`}>${items.map(item=>`<figure><button type="button" class="creator-image-zoom" data-lightbox-src="${esc(imageSource(item))}" data-lightbox-alt="${esc(item.alt||item.caption||'')}" data-lightbox-caption="${esc(item.caption||'')}" aria-haspopup="dialog" aria-label="${esc('Kép nagyítása: '+(item.caption||item.alt||'kép'))}">${image(item)}</button>${item.caption?`<figcaption>${esc(item.caption)}</figcaption>`:''}</figure>`).join('')}</div>${node.type==='carousel'?'<div class="creator-carousel-controls"><button type="button" data-carousel-step="-1" aria-label="Előző kép">←</button><button type="button" data-carousel-step="1" aria-label="Következő kép">→</button></div>':''}`;
  if(node.type==='code')return `<pre${p.wrap?' class="creator-code-wrap"':''}><code>${esc(p.code)}</code></pre>`;
  if(node.type==='tooltip')return `<span class="creator-tooltip"><button type="button" aria-describedby="${id}-tip">${text}</button><span role="tooltip" id="${id}-tip">${esc(p.description)}</span></span>`;
  if(node.type==='divider')return '<hr>';
  return childrenHtml;
}

export function initContentInteractions(root){
  if(root.dataset.contentInteractions==='1')return;root.dataset.contentInteractions='1';
  const activate=tab=>{const group=tab.closest('.creator-tabs');if(!group)return;for(const button of group.querySelectorAll('[role="tab"]')){const selected=button===tab;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;const panel=group.querySelector('[id="'+button.getAttribute('aria-controls')+'"]');if(panel)panel.hidden=!selected}};
  const scrollCarousel=(track,key)=>{
    if(!track)return;
    const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
    if(key==='Home'||key==='End'){
      track.scrollTo({left:key==='Home'?0:track.scrollWidth,behavior});
    }else{
      track.scrollBy({left:(key==='ArrowRight'?1:-1)*track.clientWidth,behavior});
    }
  };
  root.addEventListener('click',event=>{const zoom=event.target.closest('[data-lightbox-src]');if(zoom&&root.contains(zoom)&&safeSrc(zoom.dataset.lightboxSrc)){
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
  }const tab=event.target.closest('[role="tab"]');if(tab&&root.contains(tab))activate(tab);const step=event.target.closest('[data-carousel-step]');if(step&&root.contains(step)){const track=step.parentElement.previousElementSibling;scrollCarousel(track,Number(step.dataset.carouselStep)>0?'ArrowRight':'ArrowLeft')}});
  // The carousel region is intentionally keyboard-focusable. Arrow keys and
  // Home/End must operate the same viewport used by its visible buttons;
  // do not hijack keys while a nested image/lightbox button is focused.
  root.addEventListener('keydown',event=>{
    const track=event.target.closest('.creator-carousel[role="region"]');
    if(!track||!root.contains(track)||event.target!==track||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    scrollCarousel(track,event.key);
  });
  root.addEventListener('keydown',event=>{const tab=event.target.closest('[role="tab"]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const tabs=[...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')],index=tabs.indexOf(tab);const next=tabs[event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];event.preventDefault();activate(next);next.focus()});
}
