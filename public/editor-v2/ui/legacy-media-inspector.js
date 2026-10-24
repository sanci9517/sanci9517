import {legacyMediaInspectorValues,legacyImagePresentation,legacyImageCaption} from '../core/legacy-media-source.js';
import {safeMediaUrl} from '../core/element-content.js';
import {createCompositionInputs} from './composition-inputs.js';
import {mediaAssetPicker,setMediaAssetPickerSelection} from './element-content-controls.js';

export function renderLegacyMediaInspector(node,apply,{pending=()=>{}}={}){
 const model={...(node.props||{})},composition=createCompositionInputs(pending);
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
 const text=(label,value,onChange)=>{
  const wrap=document.createElement('label');wrap.className='field';wrap.append(document.createTextNode(label));
  const input=document.createElement('input');input.value=value??'';input.disabled=Boolean(node.locked);input.setAttribute('aria-label',label);
  wrap.append(input,composition.attach(input,onChange));return wrap;
 };
 const section=document.createElement('section');section.className='legacy-media-inspector';
 const mediaLabel={image:'Kép',video:'Videó',audio:'Hang'}[node.type];
 const values=legacyMediaInspectorValues(model);
 section.append(text(mediaLabel+' URL',values.src,(value,options)=>save({src:value.trim(),assetId:''},options)));
 if(node.type==='image'){
   section.append(sourcePicker=mediaAssetPicker(values.assetId,(id,asset)=>{
     const alt=typeof asset?.altText==='string'?asset.altText.trim().slice(0,250):'';
     const next={...(model||{}),assetId:id,...(!id?{src:''}:alt&&!legacyMediaInspectorValues(model).alt.trim()?{alt}:{})};
     return save(next);
   },{disabled:Boolean(node.locked)}));
   section.append(text('Kép leírása (alt)',values.alt,(value,options)=>save({alt:value},options)));
   section.append(text('Képaláírás (opcionális)',legacyImageCaption(model),(value,options)=>save({caption:value},options)));
   const objectFit=document.createElement('select');objectFit.setAttribute('aria-label','Kép illesztése');
   for(const [value,label] of [['cover','Kitöltés (vágással)'],['contain','Teljes kép (vágás nélkül)'],['fill','Nyújtás'],['none','Eredeti méret'],['scale-down','Csak kicsinyítés']]){
     const option=document.createElement('option');option.value=value;option.textContent=label;objectFit.append(option)
   }
   const appearance=legacyImagePresentation(model);
   objectFit.value=appearance.fit;
   objectFit.disabled=Boolean(node.locked);objectFit.onchange=()=>{if(update('objectFit',objectFit.value)===false)objectFit.value=appearance.fit;};section.append(objectFit);
   const ratio=document.createElement('select');ratio.setAttribute('aria-label','Képarány');
   for(const [value,label] of [['auto','Eredeti'],['16 / 9','16:9 – széles'],['4 / 3','4:3'],['1 / 1','1:1 – négyzet'],['3 / 4','3:4 – álló']]){
     const option=document.createElement('option');option.value=value;option.textContent=label;ratio.append(option);
   }
   ratio.value=appearance.ratio;ratio.disabled=Boolean(node.locked);ratio.onchange=()=>{if(update('ratio',ratio.value)===false)ratio.value=appearance.ratio;};section.append(ratio);
   for(const [key,label,value] of [['focalX','Kivágás vízszintesen',appearance.focalX],['focalY','Kivágás függőlegesen',appearance.focalY]]){
     const row=document.createElement('label');row.className='inspector-image-focal';
     const title=document.createElement('span');title.textContent=label;
     const range=document.createElement('input');range.type='range';range.min='0';range.max='100';range.step='1';
     range.value=String(value);range.setAttribute('aria-label',label);range.disabled=Boolean(node.locked);
     const output=document.createElement('output');output.textContent=range.value+'%';
     range.oninput=()=>{output.textContent=range.value+'%'};
     range.onchange=()=>{if(update(key,Number(range.value))===false){range.value=String(value);output.textContent=range.value+'%';}};
     row.append(title,range,output);section.append(row);
   }
   const loading=document.createElement('select');loading.setAttribute('aria-label','Kép betöltése');
   for(const [value,label] of [['lazy','Késleltetett betöltés'],['eager','Azonnali betöltés']]){
     const option=document.createElement('option');option.value=value;option.textContent=label;loading.append(option);
   }
   loading.value=appearance.loading;loading.disabled=Boolean(node.locked);loading.onchange=()=>{if(update('loading',loading.value)===false)loading.value=appearance.loading;};section.append(loading);
   const decoration=document.createElement('label');decoration.className='inspector-toggle';
   const decorative=document.createElement('input');decorative.type='checkbox';
   decorative.setAttribute('aria-label','Csak díszítő kép');decorative.checked=appearance.decorative;decorative.disabled=Boolean(node.locked);
   decorative.onchange=()=>{if(update('decorative',decorative.checked)===false)decorative.checked=appearance.decorative;};
   decoration.append(decorative,document.createTextNode('Csak díszítő kép (üres alt szöveg)'));section.append(decoration);
 }else{
   const isVideo=node.type==='video';
   const playableMimes=isVideo?['video/webm']:['audio/mpeg','audio/ogg','audio/wav'];
   section.append(sourcePicker=mediaAssetPicker(values.assetId,id=>save({assetId:id,...(id?{src:''}:{})}),{disabled:Boolean(node.locked),mimes:playableMimes}));
   const toggles=[
     ['controls','Lejátszóvezérlők megjelenítése',model?.controls!==false],
     ['loop','Folyamatos ismétlés',model?.loop===true],
     ...(isVideo?[
       ['muted','Videó némítása',model?.muted===true],
       ['autoplay','Automatikus videóindítás (csak némítva)',model?.autoplay===true]
     ]:[])
   ];
   for(const [key,labelText,checked] of toggles){
     const row=document.createElement('label');row.className='inspector-toggle';
     const input=document.createElement('input');input.type='checkbox';
     input.checked=checked;input.disabled=Boolean(node.locked);
     input.setAttribute('aria-label',labelText);
     input.onchange=()=>{if(update(key,input.checked)===false)input.checked=checked;};
     row.append(input,document.createTextNode(labelText));section.append(row);
   }
   if(isVideo){
     section.append(text('Videó borítókép URL',values.poster,(value,options)=>save({poster:value.trim(),posterAssetId:''},options)));
     section.append(posterPicker=mediaAssetPicker(values.posterAssetId,id=>save({posterAssetId:id,...(!id?{poster:''}:{})}),{disabled:Boolean(node.locked)}));
     const notice=document.createElement('small');notice.className='content-field-help';
     notice.textContent='A videó a szerkesztőben nem indul automatikusan. Publikálva az automatikus indítás csak némított videónál aktív.';
     section.append(notice);
   }
 }
 const help=document.createElement('p');help.className='content-field-help';
 help.textContent='HTTPS/HTTP hivatkozás vagy / jellel kezdődő webhelyútvonal használható. A szerkesztő és a publikus oldal ugyanúgy ellenőrzi.';
 section.append(help);
 const warnings=document.createElement('div');section.append(warnings);
 function refreshWarnings(){
  const nextWarnings=document.createElement('div');
  const values=legacyMediaInspectorValues(model);
    const usedFields=['src','assetId',...(node.type==='image'?['alt']:node.type==='video'?['poster','posterAssetId']:[])];
    if(values.invalidFields.some(key=>usedFields.includes(key))){
      const warning=document.createElement('p');warning.className='property-validation legacy-media-type-warning';warning.setAttribute('role','status');
      warning.textContent='Sérült médiaadat található az elemben. A hibás mező üresen jelenik meg; válassz fájlt vagy adj meg új értéket a javításhoz. A megnyitás nem módosítja a mentett adatot.';
      nextWarnings.append(warning);
    }
    if(node.type==='video'){
        const poster=values.poster.trim();
        if(poster&&!safeMediaUrl(poster)&&!model?.posterAssetId){
          const warning=document.createElement('p');warning.className='property-validation';warning.setAttribute('role','status');
          warning.textContent='Érvénytelen borítókép URL. Használj biztonságos HTTPS vagy belső képútvonalat.';
          nextWarnings.append(warning);
        }
    }
    const source=values.src.trim();
    if(source&&!safeMediaUrl(source)){
      const warning=document.createElement('p');warning.className='property-validation';warning.setAttribute('role','status');
      warning.textContent='Ez a média-URL nem biztonságos vagy nem támogatott; a publikus oldalon sem töltődik be.';
      nextWarnings.append(warning);
    }

  if(warnings.textContent!==nextWarnings.textContent)warnings.replaceChildren(...nextWarnings.childNodes);
 }
 refreshWarnings();return section;
}
