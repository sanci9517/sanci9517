import {legacyMediaInspectorValues,legacyImagePresentation,legacyImageCaption} from '../core/legacy-media-source.js';
import {safeMediaUrl} from '../core/element-content.js';
import {createCompositionInputs} from './composition-inputs.js';
import {mediaAssetPicker,setMediaAssetPickerSelection} from './element-content-controls.js?v=20261029-media-picker-a11y';

export function renderLegacyMediaInspector(node,apply,{pending=()=>{}}={}){
 const model={...(node.props||{})},composition=createCompositionInputs(pending);
 const route=(control,key)=>{control.dataset.inspectorCommand='element.update';control.dataset.inspectorKey='props.'+key;return control;};
 let sourcePicker,posterPicker;
 const save=(patch,options)=>{
  const next={...model,...patch},oldSource=model.assetId,oldPoster=model.posterAssetId;
  const result=apply(next,options);
  if(result!==false){
   Object.assign(model,next);
   const current=legacyMediaInspectorValues(model);
   if(oldSource!==model.assetId&&sourcePicker?.isConnected)setMediaAssetPickerSelection(sourcePicker,current.assetId);
   if(oldPoster!==model.posterAssetId&&posterPicker?.isConnected)setMediaAssetPickerSelection(posterPicker,current.posterAssetId);
   refreshWarnings();
  }
  return result;
 };
 const update=(key,value)=>save({[key]:value});
 const updateMediaUrl=(key,assetKey,value,options)=>{
  const normalized=value.trim();
  if(normalized&&!safeMediaUrl(normalized))throw new Error('Adj meg HTTP(S)-címet vagy / jellel kezdődő webhelyútvonalat.');
  return save({[key]:normalized,[assetKey]:''},options);
 };
 const text=(label,key,value,onChange)=>{
  const wrap=route(document.createElement('label'),key);wrap.className='field';wrap.append(document.createTextNode(label));
  const input=document.createElement('input');input.value=value??'';input.disabled=Boolean(node.locked);input.setAttribute('aria-label',label);
  wrap.append(input,composition.attach(input,onChange));return wrap;
 };
 const section=document.createElement('section');section.className='legacy-media-inspector';
 const mediaLabel={image:'Kép',video:'Videó',audio:'Hang'}[node.type];
 const mediaPickerLabel=label=>{
   const field=document.createElement('div');field.className='field';
   const title=document.createElement('span');title.id='legacy-media-label-'+crypto.randomUUID();title.textContent=label;field.append(title);section.append(field);return title.id;
 };
 const values=legacyMediaInspectorValues(model);
 section.append(text(mediaLabel+' URL','src',values.src,(value,options)=>updateMediaUrl('src','assetId',value,options)));
 if(node.type==='image'){
   const sourceLabelId=mediaPickerLabel('Kép a Médiatárból');
   section.append(sourcePicker=mediaAssetPicker(values.assetId,(id,asset)=>{
     const alt=typeof asset?.altText==='string'?asset.altText.trim().slice(0,250):'';
     const next={...(model||{}),assetId:id,...(!id?{src:''}:alt&&!legacyMediaInspectorValues(model).alt.trim()?{alt}:{})};
     return save(next);
   },{disabled:Boolean(node.locked),ariaLabelledBy:sourceLabelId}));route(sourcePicker,'assetId');
   section.append(text('Kép leírása (alt)','alt',values.alt,(value,options)=>save({alt:value},options)));
   section.append(text('Képaláírás (opcionális)','caption',legacyImageCaption(model),(value,options)=>save({caption:value},options)));
   const objectFit=route(document.createElement('select'),'objectFit');objectFit.setAttribute('aria-label','Kép illesztése');
   for(const [value,label] of [['cover','Kitöltés (vágással)'],['contain','Teljes kép (vágás nélkül)'],['fill','Nyújtás'],['none','Eredeti méret'],['scale-down','Csak kicsinyítés']]){
     const option=document.createElement('option');option.value=value;option.textContent=label;objectFit.append(option)
   }
   const appearance=legacyImagePresentation(model);
   objectFit.value=appearance.fit;
   objectFit.disabled=Boolean(node.locked);objectFit.onchange=()=>{if(update('objectFit',objectFit.value)===false)objectFit.value=appearance.fit;};section.append(objectFit);
   const ratio=route(document.createElement('select'),'ratio');ratio.setAttribute('aria-label','Képarány');
   for(const [value,label] of [['auto','Eredeti'],['16 / 9','16:9 – széles'],['4 / 3','4:3'],['1 / 1','1:1 – négyzet'],['3 / 4','3:4 – álló']]){
     const option=document.createElement('option');option.value=value;option.textContent=label;ratio.append(option);
   }
   ratio.value=appearance.ratio;ratio.disabled=Boolean(node.locked);ratio.onchange=()=>{if(update('ratio',ratio.value)===false)ratio.value=appearance.ratio;};section.append(ratio);
   for(const [key,label,value] of [['focalX','Kivágás vízszintesen',appearance.focalX],['focalY','Kivágás függőlegesen',appearance.focalY]]){
     const row=route(document.createElement('label'),key);row.className='inspector-image-focal';
     const title=document.createElement('span');title.textContent=label;
     const range=document.createElement('input');range.type='range';range.min='0';range.max='100';range.step='1';
     range.value=String(value);range.setAttribute('aria-label',label);range.disabled=Boolean(node.locked);
     const output=document.createElement('output');output.textContent=range.value+'%';
     range.oninput=()=>{output.textContent=range.value+'%'};
     range.onchange=()=>{if(update(key,Number(range.value))===false){range.value=String(value);output.textContent=range.value+'%';}};
     row.append(title,range,output);section.append(row);
   }
   const loading=route(document.createElement('select'),'loading');loading.setAttribute('aria-label','Kép betöltése');
   for(const [value,label] of [['lazy','Késleltetett betöltés'],['eager','Azonnali betöltés']]){
     const option=document.createElement('option');option.value=value;option.textContent=label;loading.append(option);
   }
   loading.value=appearance.loading;loading.disabled=Boolean(node.locked);loading.onchange=()=>{if(update('loading',loading.value)===false)loading.value=appearance.loading;};section.append(loading);
   const decoration=route(document.createElement('label'),'decorative');decoration.className='inspector-toggle';
   const decorative=document.createElement('input');decorative.type='checkbox';
   decorative.setAttribute('aria-label','Csak díszítő kép');decorative.checked=appearance.decorative;decorative.disabled=Boolean(node.locked);
   decorative.onchange=()=>{if(update('decorative',decorative.checked)===false)decorative.checked=appearance.decorative;};
   decoration.append(decorative,document.createTextNode('Csak díszítő kép (üres alt szöveg)'));section.append(decoration);
 }else{
   const isVideo=node.type==='video';
   const playableMimes=isVideo?['video/webm']:['audio/mpeg','audio/ogg','audio/wav'];
   const sourceLabelId=mediaPickerLabel((isVideo?'Videó':'Hang')+' a Médiatárból');
   section.append(sourcePicker=mediaAssetPicker(values.assetId,id=>save({assetId:id,...(id?{src:''}:{})}),{disabled:Boolean(node.locked),mimes:playableMimes,ariaLabelledBy:sourceLabelId}));route(sourcePicker,'assetId');
   const toggles=[
     ['controls','Lejátszóvezérlők megjelenítése',model?.controls!==false],
     ['loop','Folyamatos ismétlés',model?.loop===true],
     ...(isVideo?[
       ['muted','Videó némítása',model?.muted===true],
       ['autoplay','Automatikus videóindítás (csak némítva)',model?.autoplay===true]
     ]:[])
   ];
   for(const [key,labelText,checked] of toggles){
     const row=route(document.createElement('label'),key);row.className='inspector-toggle';
     const input=document.createElement('input');input.type='checkbox';
     input.checked=checked;input.disabled=Boolean(node.locked);
     input.setAttribute('aria-label',labelText);
     input.onchange=()=>{if(update(key,input.checked)===false)input.checked=checked;};
     row.append(input,document.createTextNode(labelText));section.append(row);
   }
   if(isVideo){
     section.append(text('Videó borítókép URL','poster',values.poster,(value,options)=>updateMediaUrl('poster','posterAssetId',value,options)));
     const posterLabelId=mediaPickerLabel('Videó borítóképe a Médiatárból');
     section.append(posterPicker=mediaAssetPicker(values.posterAssetId,id=>save({posterAssetId:id,...(!id?{poster:''}:{})}),{disabled:Boolean(node.locked),ariaLabelledBy:posterLabelId}));route(posterPicker,'posterAssetId');
     const notice=document.createElement('small');notice.className='content-field-help';
     notice.textContent='A videó a szerkesztőben nem indul automatikusan. Publikálva az automatikus indítás csak némított videónál aktív.';
     section.append(notice);
   }
 }
 const help=document.createElement('p');help.className='content-field-help';
 help.textContent='HTTPS/HTTP hivatkozás vagy / jellel kezdődő webhelyútvonal használható. A szerkesztő és a publikus oldal ugyanúgy ellenőrzi.';
 section.append(help);
 const warnings=document.createElement('div');section.append(warnings);
 const warningIds=new Map();
 const warning=(text,keys)=>{
  const message=document.createElement('p');
  if(!warningIds.has(text))warningIds.set(text,'legacy-media-validation-'+crypto.randomUUID());
  message.id=warningIds.get(text);message.className='property-validation';message.setAttribute('role','status');message.textContent=text;
  for(const key of keys){
   const routeControl=section.querySelector(`[data-inspector-key="props.${key}"]`);
   if(!routeControl)continue;
   const controls=routeControl.matches('input,select,textarea,button')?[routeControl]:routeControl.querySelectorAll('input:not([type="hidden"]),select,textarea,button[aria-controls]');
   for(const control of controls){
    const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
    if(!ids.includes(message.id))control.setAttribute('aria-describedby',[...ids,message.id].join(' '));
   }
  }
  return message;
 };
 function refreshWarnings(){
  for(const old of warnings.querySelectorAll('[id]'))for(const control of section.querySelectorAll('[aria-describedby]')){
   const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==old.id);
   if(ids.length)control.setAttribute('aria-describedby',ids.join(' '));else control.removeAttribute('aria-describedby');
  }
  const nextWarnings=document.createElement('div');
  const values=legacyMediaInspectorValues(model);
    const usedFields=['src','assetId',...(node.type==='image'?['alt']:node.type==='video'?['poster','posterAssetId']:[])];
    if(values.invalidFields.some(key=>usedFields.includes(key))){
      const invalid=values.invalidFields.filter(key=>usedFields.includes(key));
      const message=warning('Sérült médiaadat található az elemben. A hibás mező üresen jelenik meg; válassz fájlt vagy adj meg új értéket a javításhoz. A megnyitás nem módosítja a mentett adatot.',invalid);
      message.classList.add('legacy-media-type-warning');nextWarnings.append(message);
    }
    if(node.type==='video'){
        const poster=values.poster.trim();
        if(poster&&!safeMediaUrl(poster)&&!model?.posterAssetId){
          nextWarnings.append(warning('Érvénytelen borítókép URL. Használj biztonságos HTTPS vagy belső képútvonalat.',['poster','posterAssetId']));
        }
    }
    const source=values.src.trim();
    if(source&&!safeMediaUrl(source)){
      nextWarnings.append(warning('Ez a média-URL nem biztonságos vagy nem támogatott; a publikus oldalon sem töltődik be.',['src','assetId']));
    }

  if(warnings.textContent!==nextWarnings.textContent)warnings.replaceChildren(...nextWarnings.childNodes);
 }
 refreshWarnings();return section;
}
