import {TOKEN_SPECS,defaultTokens,normalizeTokens,tokenValue,applyTokenVariables} from '../editor-v2/core/design-tokens.js';
const $=selector=>document.querySelector(selector);
let documentState=null,tokens=defaultTokens(),dirty=false,undo=[],invalid=new Set();
const groupNames={colors:'Színek',typography:'Tipográfia',spacing:'Térközök',radii:'Lekerekítés',shadows:'Árnyékok'};
const status=message=>{$('#status').textContent=message};
function storageKey(){return 'creator-design-draft:'+documentState?.draft?.siteId}
function preview(){applyTokenVariables($('#preview'),tokens);$('#save').disabled=!documentState||!dirty||invalid.size>0;$('#publish').disabled=!documentState||invalid.size>0;$('#undo').disabled=!undo.length}
function persistLocal(){try{localStorage.setItem(storageKey(),JSON.stringify({revision:documentState.revision,tokens}))}catch{}}
function change(id,value,input){
  try{const [group,key]=id.split('.'),next=structuredClone(tokens);next[group][key]=value;const normalized=normalizeTokens(next);if(tokenValue(tokens,id)!==tokenValue(normalized,id)){undo.push(structuredClone(tokens));if(undo.length>50)undo.shift();tokens=normalized;dirty=true;persistLocal()}invalid.delete(id);input.removeAttribute('aria-invalid');status('Nem mentett stílusváltoztatások.');preview()}
  catch(error){invalid.add(id);input.setAttribute('aria-invalid','true');status(error.message);preview()}
}
function controls(){
  const host=$('#controls');host.replaceChildren();invalid.clear();
  for(const [group,label] of Object.entries(groupNames)){
    const section=document.createElement('details');section.open=group==='colors';const summary=document.createElement('summary');summary.textContent=label;section.append(summary);
    for(const [id,spec] of Object.entries(TOKEN_SPECS).filter(([id])=>id.startsWith(group+'.'))){
      const row=document.createElement('div');row.className='token-field';const label=document.createElement('label');label.textContent=spec.label;label.htmlFor=id;const inputs=document.createElement('div');inputs.className='token-inputs';
      let input;
      if(['font','shadow'].includes(spec.kind)){input=document.createElement('select');const values=spec.kind==='font'?['system-ui','Arial','Georgia','Verdana','monospace','sans-serif','serif']:['none','0 2px 8px #0003','0 8px 24px #0005','0 16px 48px #0007'];for(const value of values){const option=document.createElement('option');option.value=value;option.textContent=value;input.append(option)}}
      else {input=document.createElement('input');input.type='text';input.maxLength=80}
      input.id=id;input.value=tokenValue(tokens,id);input.addEventListener(spec.kind==='font'||spec.kind==='shadow'?'change':'input',()=>change(id,input.value,input));
      if(spec.kind==='color'){const picker=document.createElement('input');picker.type='color';picker.value=/^#[\da-f]{6}$/i.test(input.value)?input.value:'#7047eb';picker.setAttribute('aria-label',spec.label+' színválasztó');picker.oninput=()=>{input.value=picker.value;change(id,input.value,input)};inputs.append(picker)}
      inputs.append(input);const help=document.createElement('small');help.textContent=spec.kind==='length'?'Példa: 16px vagy 1rem. Csak az ehhez a közös értékhez kapcsolt mezők változnak.':'Az Editorban a mező Közös stílus választójával kapcsolhatod hozzá az elemeket.';row.append(label,inputs,help);section.append(row);
    }
    host.append(section);
  }
  const history=$('#history');history.replaceChildren();const entries=[documentState.published,...(documentState.history||[]).toReversed()].filter(Boolean),seen=new Set();
  for(const entry of entries){if(seen.has(entry.revision))continue;seen.add(entry.revision);const option=document.createElement('option');option.value=String(entry.revision);option.textContent=`${entry.revision}. változat · ${entry.status==='published'?'publikált':'piszkozat'} · ${new Date(entry.updatedAt).toLocaleString('hu-HU')}`;history.append(option)}$('#restore').disabled=!entries.length;
  preview();
}
async function load(){
  const response=await fetch('/api/admin/presentation',{cache:'no-store',credentials:'same-origin'}),body=await response.json();
  if(!response.ok||!body.ok)throw new Error(response.status===403?'A közös webhelystílusok kezeléséhez adminisztrátori jogosultság szükséges.':body.error?.message||'A stíluskészlet nem tölthető be.');
  documentState=body.data;tokens=normalizeTokens(documentState.draft.tokens);dirty=false;undo=[];
  try{const local=JSON.parse(localStorage.getItem(storageKey())||'null');if(local?.revision===documentState.revision){tokens=normalizeTokens(local.tokens);dirty=true;status('A helyi nem mentett stílusokat visszaállítottuk.')}else status('Betöltve · '+documentState.revision+'. változat')}catch{status('A szerverváltozat betöltve; a sérült helyi mentést nem alkalmaztuk.')}
  $('#reload').hidden=true;controls();
}
async function write(publish=false,restoreRevision){
  if(!documentState||invalid.size)return;const before=structuredClone(tokens);$('#save').disabled=true;$('#publish').disabled=true;
  try{
    const response=await fetch('/api/admin/presentation',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision:documentState.revision,...(restoreRevision!==undefined?{restoreRevision:Number(restoreRevision)}:{tokens,publish})})}),body=await response.json();
    if(!response.ok||!body.ok){if(response.status===409)$('#reload').hidden=false;throw new Error(body.error?.message||'A mentés nem sikerült.')}
    documentState=body.data;tokens=normalizeTokens(documentState.draft.tokens);dirty=false;undo.push(before);try{localStorage.removeItem(storageKey())}catch{}controls();status(restoreRevision!==undefined?'Korábbi változat visszaállítva piszkozatként.':publish?'A közös webhelystílusok publikálva.':'Piszkozat mentve. Az élő oldalak változatlanok.');
  }catch(error){tokens=before;dirty=true;persistLocal();status(error.message)}finally{preview()}
}
$('#save').onclick=()=>write(false);$('#publish').onclick=()=>write(true);$('#restore').onclick=()=>write(false,$('#history').value);
$('#undo').onclick=()=>{if(!undo.length)return;tokens=undo.pop();dirty=true;persistLocal();controls();status('Helyi módosítás visszavonva. A szerver csak a Mentés után változik.')};
$('#device').onchange=()=>$('#preview').classList.toggle('mobile',$('#device').value==='mobile');
$('#reload').onclick=()=>{if(dirty&&!confirm('A helyi stílusváltozatot a szerver aktuális változatára cseréled?'))return;try{localStorage.removeItem(storageKey())}catch{}load().catch(error=>status(error.message))};
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue=''}});
load().catch(error=>status(error.message));
