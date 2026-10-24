import {defaultCardContent,CARD_VARIANTS} from '../core/card-content.js';
import {createCompositionInputs} from './composition-inputs.js';
import {mediaAssetPicker,setMediaAssetPickerSelection} from './element-content-controls.js';

export function renderCardInspector(node,update,{pending=()=>{}}={}){
 const model={...defaultCardContent(),...(node.props?.cardContent||{})};
 const composition=createCompositionInputs(pending);
 const section=document.createElement('section');section.className='card-content-inspector';
 section.append(Object.assign(document.createElement('h3'),{textContent:'Kártya tartalma'}));
 let picker;
 const save=(patch,options)=>{
  const next={...model,...patch},previousAsset=model.imageAssetId;
  const result=update(next,options);
  if(result!==false){
   Object.assign(model,next);
   // A live URL edit clears only the picker view, without a second command
   // or replacing the composing text field. Structural picker edits rerender.
   if(previousAsset!==model.imageAssetId&&picker?.isConnected)setMediaAssetPickerSelection(picker,model.imageAssetId);
  }
  return result;
 };
 const text=(label,key,{multiline=false,source=false,trim=false}={})=>{
  const wrap=document.createElement('label');wrap.className='field';wrap.append(Object.assign(document.createElement('span'),{textContent:label}));
  const input=document.createElement(multiline?'textarea':'input');input.value=model[key]??'';input.disabled=Boolean(node.locked);
  input.setAttribute('aria-label',label);
  wrap.append(input,composition.attach(input,(value,options)=>save({[key]:trim?value.trim():value,...(source?{imageAssetId:''}:{})},options)));
  section.append(wrap);
 };
 text('Kártya címe','title');text('Rövid leírás','description',{multiline:true});
 const variant=document.createElement('select');variant.setAttribute('aria-label','Kártya megjelenése');variant.disabled=Boolean(node.locked);
 const labels={solid:'Telített',outline:'Körvonal',glass:'Üveghatás'};
 for(const value of CARD_VARIANTS)variant.append(Object.assign(document.createElement('option'),{value,textContent:labels[value]}));
 variant.value=model.variant;variant.onchange=()=>{if(save({variant:variant.value})===false)variant.value=model.variant;};
 picker=mediaAssetPicker(model.imageAssetId||'',(id,asset)=>{
  const alt=typeof asset?.altText==='string'?asset.altText.trim().slice(0,250):'';
  return save({imageAssetId:id,imageSrc:'',...(alt&&!model.imageAlt.trim()?{imageAlt:alt}:{})})!==false;
 },{disabled:Boolean(node.locked)});
 section.append(variant,picker);
 text('Kép URL (opcionális)','imageSrc',{source:true,trim:true});text('Kép leírása','imageAlt');
 text('Gomb felirata (opcionális)','actionLabel');text('Gomb hivatkozása','actionHref',{trim:true});
 const check=document.createElement('input');check.type='checkbox';check.checked=Boolean(model.newWindow);check.disabled=Boolean(node.locked);
 check.onchange=()=>{if(save({newWindow:check.checked})===false)check.checked=Boolean(model.newWindow);};
 const label=document.createElement('label');label.className='inspector-toggle';label.append(check,document.createTextNode('Gomb megnyitása új lapon'));section.append(label);
 return section;
}
