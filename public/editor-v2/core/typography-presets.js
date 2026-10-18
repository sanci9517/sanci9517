/* Visual roles for creator pages. They only change the selected element's
 * current breakpoint; content and semantic heading levels remain independent. */
export const TYPOGRAPHY_PRESETS = Object.freeze([
  {id:'hero',label:'Hero cím',sample:'Nagy történetek.',help:'Nyitó szakasz fő üzenete, nagy méret és szoros sorvezetés.',size:[72,56,40],patch:{fontWeight:'800',lineHeight:'1.1',letterSpacing:'-0.04em',textWrap:'balance'}},
  {id:'section',label:'Szakaszcím',sample:'A következő fejezet',help:'Videók, projektek és bemutatkozó részek jól elkülönített címe.',size:[40,34,28],patch:{fontWeight:'700',lineHeight:'1.2',letterSpacing:'-0.02em',textWrap:'balance'}},
  {id:'eyebrow',label:'Kiemelő felirat',sample:'KULISSZÁK MÖGÖTT',help:'Rövid kategória vagy sorozatcím a fő üzenet felett.',size:[12,12,11],patch:{fontWeight:'700',lineHeight:'1.4',letterSpacing:'0.14em',textTransform:'uppercase'}},
  {id:'lead',label:'Bevezető',sample:'Ötletekből élmény.',help:'Rövid, hangsúlyos bevezetés a főcím és a részletes tartalom között.',size:[24,22,20],patch:{fontWeight:'400',lineHeight:'1.55',textWrap:'pretty'}},
  {id:'body',label:'Olvasószöveg',sample:'Meséld el a történeted.',help:'Hosszabb bemutatkozás és leírás kényelmes sormagassággal.',size:[18,17,16],patch:{fontWeight:'400',lineHeight:'1.7',textWrap:'pretty'}},
  {id:'quote',label:'Idézet',sample:'„Merj alkotni.”',help:'Személyes mottó vagy ajánlás kiemelésére.',size:[32,28,24],patch:{fontFamily:'Georgia',fontWeight:'400',fontStyle:'italic',lineHeight:'1.45',textWrap:'balance'}},
  {id:'stat',label:'Kiemelt szám',sample:'1.2M',help:'Valódi mérföldkő vagy statisztika vizuális kiemelésére; adatot nem hoz létre.',size:[64,52,40],patch:{fontWeight:'800',lineHeight:'1',letterSpacing:'-0.04em'}},
  {id:'caption',label:'Képaláírás',sample:'Egy pillanat a stúdióból',help:'Képhez, videóhoz vagy rövid kiegészítő információhoz.',size:[14,14,13],patch:{fontWeight:'400',lineHeight:'1.5'}}
].map(value=>Object.freeze({...value,size:Object.freeze(value.size),patch:Object.freeze(value.patch)})));

export function typographyPresetPatch(id, device='desktop') {
  const preset=TYPOGRAPHY_PRESETS.find(value=>value.id===id);
  const index=['desktop','tablet','mobile'].indexOf(device);
  if(!preset||index<0)throw new Error('Ismeretlen szövegstílus vagy nézet.');
  return {fontFamily:'system-ui',fontStyle:'normal',textTransform:'none',textDecoration:'none',letterSpacing:'0',textShadow:'none',textIndent:'0',wordSpacing:'0',textWrap:'wrap',overflowWrap:'anywhere',...preset.patch,fontSize:`${preset.size[index]}px`};
}
