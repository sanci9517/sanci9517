// Canonical static Card content. This does not introduce a second CMS or shop.
// Explicitly authored cards opt in; legacy layout cards retain their behavior.
export const CARD_VARIANTS=Object.freeze(['solid','outline','glass']);
const ASSET_ID=/^[0-9a-f-]{36}$/i;
export function cardImageSrc(content,{editor=false}={}){
 const id=content?.imageAssetId;
 if(typeof id==='string'&&ASSET_ID.test(id))return editor?'/api/admin/media?id='+encodeURIComponent(id):'/media/'+encodeURIComponent(id);
 const src=content?.imageSrc;
 return typeof src==='string'&&safeUrl(src,{image:true})?src.trim():'';
}
const safeUrl=(raw,{image=false}={})=>{
 if(typeof raw!=='string'||!raw.trim())return false;
 const value=raw.trim();
 if([...value].some(ch=>{const n=ch.charCodeAt(0);return n<32||n===127||n===92})||value.startsWith('//'))return false;
 if(!image&&value.startsWith('#')&&value.length>1)return true;
 if(value.startsWith('/')&&!value.startsWith('//'))return true;
 try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password;}
 catch{return false}
};
export function defaultCardContent(){
 return {version:1,title:'Új kártya',description:'',variant:'solid',imageSrc:'',imageAssetId:'',imageAlt:'',actionLabel:'',actionHref:'',newWindow:false};
}
export function normalizeCardContent(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1)throw new Error('A kártya tartalma hiányzik');
 const title=String(value.title??'').trim(),description=String(value.description??'');
 const imageSrc=String(value.imageSrc??'').trim(),imageAlt=String(value.imageAlt??'').trim();
 const imageAssetId=value.imageAssetId??'';
 if(typeof imageAssetId!=='string'||(imageAssetId!==''&&!ASSET_ID.test(imageAssetId)))throw new Error('Érvénytelen Médiatár-azonosító');
 const actionLabel=String(value.actionLabel??'').trim(),actionHref=String(value.actionHref??'').trim();
 if(!title||title.length>160)throw new Error('A kártya címe 1–160 karakter lehet');
 if(description.length>1200)throw new Error('A kártya leírása legfeljebb 1200 karakter');
 if(!CARD_VARIANTS.includes(value.variant))throw new Error('Ismeretlen kártyamegjelenés');
 if(imageSrc&&!safeUrl(imageSrc,{image:true}))throw new Error('A képhez biztonságos URL kell');
 if((imageSrc||imageAssetId)&&(!imageAlt||imageAlt.length>250))throw new Error('A képhez képleírás kell');
 if(imageAlt.length>250)throw new Error('A képleírás legfeljebb 250 karakter');
 if(Boolean(actionLabel)!==Boolean(actionHref))throw new Error('A kártyagomb címét és linkjét együtt add meg');
 if(actionLabel.length>100||(actionHref&&!safeUrl(actionHref)))throw new Error('Érvénytelen kártyagomb-hivatkozás');
 if(typeof value.newWindow!=='boolean')throw new Error('Érvénytelen újablak-beállítás');
 return {version:1,title,description,variant:value.variant,imageSrc,imageAssetId,imageAlt,actionLabel,actionHref,newWindow:value.newWindow};
}
