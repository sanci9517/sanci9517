import {CONTENT_FIELDS,normalizeContentField,contentProperties,imageFocalPosition} from '../core/authored-content.js';

export function pageLinkPicker(pages,input){
  const select=document.createElement('select');select.className='content-page-picker';select.setAttribute('aria-label','Belső oldal kiválasztása');
  const empty=document.createElement('option');empty.value='';empty.textContent='Válassz belső oldalt…';select.append(empty);
  for(const page of pages||[]){if(!page.slug)continue;const option=document.createElement('option');option.value='/p/'+encodeURIComponent(page.isPublished?(page.publishedSlug||page.slug):page.slug);option.textContent=(page.title||page.slug)+(page.isPublished?'':' · még nincs publikálva');select.append(option)}
  select.value=[...select.options].some(option=>option.value===input.value)?input.value:'';
  select.onchange=()=>{if(select.value){input.value=select.value;input.dispatchEvent(new Event('input',{bubbles:true}))}};return select;
}
async function loadAssets(query='',before=null,mimes=[]){
  const url=new URL('/api/admin/media',location.origin);
  url.searchParams.set('limit','50');
  if(query)url.searchParams.set('q',query);
  if(before)url.searchParams.set('before',before);
  const families=[...new Set(mimes.map(mime=>mime.split('/')[0]))];
  if(families.length===1&&['audio','video'].includes(families[0]))url.searchParams.set('mime',families[0]);
  else if(mimes.length===1)url.searchParams.set('mime',mimes[0]);
  const response=await fetch(url,{credentials:'same-origin',headers:{Accept:'application/json'}});
  const payload=await response.json().catch(()=>null);
  if(!response.ok||payload?.ok!==true)throw new Error(payload?.error?.message||'A Médiatár nem érhető el.');
  return {assets:payload.data?.assets||[],nextCursor:payload.data?.nextCursor||null};
}
export function mediaAssetPicker(selectedId,onSelect,{disabled=false,mimes=[]}={}){
  const root=document.createElement('div');root.className='editor-media-picker';
  const status=document.createElement('p');status.className='content-field-help';status.setAttribute('role','status');
  const current=document.createElement('div');current.className='editor-media-current';current.id='media-choices-'+crypto.randomUUID();current.setAttribute('role','region');current.setAttribute('aria-label','Médiatár találatok');
  const selection=document.createElement('div');selection.className='editor-media-selection';
  const renderSelected=(id,asset=null)=>{
    selection.replaceChildren();if(!id)return;
    const isImage=!asset||!asset.mimeType||asset.mimeType.startsWith('image/');
    const preview=document.createElement(isImage?'img':'span');preview.className='editor-media-selected';
    if(isImage){preview.src='/api/admin/media?id='+encodeURIComponent(id);preview.alt='Kiválasztott kép'}
    else{preview.textContent=asset.mimeType?.startsWith('video/')?'🎬 Kiválasztott videó':'🔊 Kiválasztott hang';preview.setAttribute('aria-label','Kiválasztott médiafájl')}
    const clear=document.createElement('button');clear.type='button';clear.textContent=isImage?'Kép eltávolítása':'Médiafájl eltávolítása';clear.disabled=disabled;
    clear.onclick=()=>{if(onSelect('')===false)return;renderSelected('');status.textContent='A kiválasztott médiafájl eltávolítva.'};
    selection.append(preview,clear);
  };
  const search=document.createElement('input');search.type='search';search.placeholder='Keresés név vagy leírás alapján';search.setAttribute('aria-label','Keresés a Médiatárban');search.disabled=disabled;
  const open=document.createElement('button');open.type='button';open.disabled=disabled;open.setAttribute('aria-controls',current.id);
  const more=document.createElement('button');more.type='button';more.className='editor-media-more';more.textContent='További médiafájl betöltése';more.disabled=disabled;
  let latestRequest=0,nextCursor=null,shown=0,timer;
  const setOpen=value=>{
    current.hidden=!value;search.hidden=!value;more.hidden=!value||!nextCursor;
    open.setAttribute('aria-expanded',String(value));
    open.textContent=value?'Médiatár bezárása':'Médiatár megnyitása';
    if(!value){latestRequest++;clearTimeout(timer);current.setAttribute('aria-busy','false')}
  };
  const refresh=async(append=false)=>{
    const request=++latestRequest,query=search.value.trim(),before=append?nextCursor:null;
    if(append){if(!before)return;more.disabled=true}
    else{current.replaceChildren();shown=0;nextCursor=null;more.hidden=true}
    current.setAttribute('aria-busy','true');status.textContent=append?'További médiafájlok betöltése…':'Médiatár betöltése…';
    try{
      const {assets,nextCursor:cursor}=await loadAssets(query,before,mimes);
      if(request!==latestRequest||current.hidden)return;
      let firstNewChoice=null;
      for(const asset of assets){
        if(mimes.length&&!mimes.includes(asset.mimeType))continue;
        const button=document.createElement('button');button.type='button';button.className='editor-media-choice';button.disabled=disabled;
        button.setAttribute('aria-label',`${asset.name} kiválasztása`);
        const preview=!asset.mimeType||asset.mimeType.startsWith('image/')?document.createElement('img'):document.createElement('span');
        if(preview.tagName==='IMG'){preview.src=asset.previewUrl;preview.alt='';preview.loading='lazy'}else{preview.textContent=asset.mimeType?.startsWith('video/')?'🎬':'🔊';preview.setAttribute('aria-hidden','true')}
        const name=document.createElement('span');name.textContent=asset.name;button.append(preview,name);
        button.onclick=()=>{if(onSelect(asset.id,asset)===false)return;renderSelected(asset.id,asset);setOpen(false);status.textContent=`Kiválasztva: ${asset.name}`;open.focus()};
        if(!firstNewChoice)firstNewChoice=button;
        current.append(button);
      }
      shown+=assets.length;nextCursor=cursor;more.hidden=!nextCursor;more.disabled=disabled;
      current.setAttribute('aria-busy','false');
      status.textContent=shown?`${shown} médiafájl betöltve${query?' a kereséshez':''}`:'Nincs találat. Tölts fel médiafájlt az Admin → Médiatár oldalon.';
      // Newly appended tiles precede the "Load more" button in DOM order.
      // Move keyboard focus there even when this was the final page and
      // the previously focused pagination button becomes hidden.
      if(append)(firstNewChoice||more).focus({preventScroll:false});
    }catch(error){
      if(request!==latestRequest||current.hidden)return;
      current.setAttribute('aria-busy','false');
      more.hidden=!nextCursor;more.disabled=disabled;
      status.textContent=error.message||'A Médiatár betöltése nem sikerült.';
      if(append&&!more.hidden)more.focus({preventScroll:true});
    }
  };
  search.oninput=()=>{
    latestRequest++;clearTimeout(timer);more.hidden=true;
    if(!current.hidden){status.textContent='Keresés…';timer=setTimeout(()=>refresh(),220)}
  };
  open.onclick=()=>{const next=current.hidden;setOpen(next);if(next)refresh()};
  // Escape closes only this picker, preventing the global Editor shell from
  // closing the entire Inspector sheet or discarding a draft selection.
  root.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||current.hidden)return;
    event.preventDefault();event.stopPropagation();setOpen(false);open.focus({preventScroll:true});
  });
  more.onclick=()=>refresh(true);
  renderSelected(selectedId);setOpen(false);root.append(selection,open,search,current,more,status);
  return root;
}
const selectedAlt=asset=>typeof asset?.altText==='string'?asset.altText.trim().slice(0,500):'';
export function renderElementContentControls(node,{apply,pending,exclude=[],pages=[]}){
  const root=document.createElement('section');root.className='element-content-controls';
  const fail=document.createElement('p');fail.className='property-validation';fail.setAttribute('role','status');
  const control=(definition,value,save,onAsset)=>{
    const wrap=document.createElement('div');wrap.className='field content-schema-field';wrap.dataset.contentKey=definition.key;
    const label=document.createElement('span');label.textContent=definition.label;wrap.append(label);
    let input;
    if(definition.type==='select'){input=document.createElement('select');for(const [value,text] of Object.entries(definition.options)){const option=document.createElement('option');option.value=value;option.textContent=text;input.append(option)}input.value=String(value??Object.keys(definition.options)[0])}
    else if(definition.type==='boolean'){input=document.createElement('input');input.type='checkbox';input.checked=Boolean(value)}
    else if(definition.type==='asset'){input=null}
    else {input=document.createElement(definition.type==='textarea'?'textarea':'input');if(input.tagName==='INPUT'){input.type=definition.type==='range'?'range':'text';if(definition.type==='range'){input.min=String(definition.min??0);input.max=String(definition.max??100);input.step=String(definition.step??1)}}input.value=value??'';if(definition.type!=='range')input.maxLength=definition.max||2048}
    if(definition.type==='asset'){
      wrap.append(mediaAssetPicker(String(value||''),(id,asset)=>{try{if(id&&onAsset)onAsset(id,asset);else save(id);fail.textContent='';return true}catch(error){fail.textContent=error.message;return false}} ,{disabled:Boolean(node.locked)}));
      if(definition.help){const help=document.createElement('small');help.className='content-field-help';help.textContent=definition.help;wrap.append(help)}return wrap;
    }
    input.setAttribute('aria-label',definition.label);input.disabled=Boolean(node.locked);input.dataset.typingGroup=crypto.randomUUID();
    const rangeOutput=definition.type==='range'?document.createElement('output'):null;if(rangeOutput){rangeOutput.className='content-range-value';rangeOutput.value=String(input.value);rangeOutput.textContent=`${input.value}%`;rangeOutput.setAttribute('aria-live','polite')}
    let committed=value,composing=false,dirty=false,compositionRevision=0;
    const canCompose=input.tagName==='TEXTAREA'||(input.tagName==='INPUT'&&input.type==='text');
    const update=()=>{
      try{
        const next=normalizeContentField(definition,definition.type==='boolean'?input.checked:definition.type==='range'?input.valueAsNumber:input.value);
        // Clear an earlier validation error before command() runs: its
        // Inspector pending guard rejects edits while any field is invalid.
        input.removeAttribute('aria-invalid');fail.textContent='';
        dirty=false;
        save(next,input.dataset.typingGroup);
        committed=next;
        if(rangeOutput){rangeOutput.value=String(next);rangeOutput.textContent=`${next}%`}
        return true;
      }catch(error){dirty=true;input.setAttribute('aria-invalid','true');fail.textContent=error.message;return false}
    };
    const flush=()=>!composing&&(!dirty||update());
    if(canCompose){
      input.addEventListener('compositionstart',()=>{compositionRevision++;composing=true});
      input.addEventListener('compositionend',()=>{
        dirty=true;const revision=compositionRevision;
        // Some Android IMEs deliver the confirmed replacement after
        // compositionend. Read the live value on the next animation frame;
        // never persist the unfinished phonetic/composition candidate.
        requestAnimationFrame(()=>{
          if(revision!==compositionRevision||!input.isConnected)return;
          composing=false;flush();
        });
      });
      input.addEventListener('input',event=>{
        dirty=true;
        if(event.isComposing||composing)return;
        flush();
      });
      input.addEventListener('blur',()=>{if(!composing)flush()});
    }else input.addEventListener(['select','boolean'].includes(definition.type)?'change':'input',update);
    input.addEventListener('focus',()=>pending(()=>!composing&&!root.querySelector('[aria-invalid="true"]')));
    input.addEventListener('keydown',event=>{
      if(event.key!=='Escape')return;
      compositionRevision++;composing=false;dirty=false;
      input.value=committed??'';
      if(definition.type==='boolean')input.checked=Boolean(committed);
      input.removeAttribute('aria-invalid');fail.textContent='';
    });
    wrap.append(input);if(rangeOutput)wrap.append(rangeOutput);if(definition.type==='url'){const picker=pageLinkPicker(pages,input);picker.disabled=Boolean(node.locked);wrap.append(picker)}if(definition.help){const help=document.createElement('small');help.className='content-field-help';help.textContent=definition.help;wrap.append(help)}return wrap;
  };
  for(const definition of CONTENT_FIELDS[node.type]||[]){
    if(exclude.includes(definition.key))continue;
    const save=(value,typingGroup,render=false)=>{const result=apply({[definition.key]:value},{typingGroup,render});if(result===false)throw new Error('A módosítás nem alkalmazható.');return result};
    if(definition.type==='repeater'){
      const section=document.createElement('details');section.className='content-repeater';section.dataset.contentKey=definition.key;section.open=true;
      // Structural edits replace the Inspector DOM. Continue from the edited
      // row after the render, unless focus has moved to another live control.
      const restoreRowFocus=({rowIndex,preferredAction='',editField=false}={})=>requestAnimationFrame(()=>{
        if(document.activeElement!==document.body)return;
        const inspector=document.getElementById('inspectorBody');
        const current=[...(inspector?.querySelectorAll('.content-repeater')||[])]
          .find(el=>el.dataset.contentKey===definition.key);
        if(!current||!current.open)return;
        const rows=[...current.querySelectorAll(':scope > fieldset')];
        const row=rows[Math.min(Math.max(0,rowIndex??0),rows.length-1)];
        const input=row?.querySelector('.content-schema-field input:not([disabled]),.content-schema-field textarea:not([disabled]),.content-schema-field select:not([disabled])');
        const buttons=[...(row?.querySelectorAll('.content-repeater-actions button:not([disabled])')||[])];
        const action=buttons.find(el=>el.textContent===preferredAction);
        const add=current.querySelector(':scope > button:last-child:not([disabled])');
        const target=editField?(input||action||buttons[0]||add):(action||buttons[0]||input||add);
        if(target&&target.getClientRects().length)target.focus({preventScroll:true});
      });
      const summary=document.createElement('summary');summary.textContent=definition.label;section.append(summary);
      const items=Array.isArray(node.props?.[definition.key])?node.props[definition.key]:[];
      items.forEach((item,index)=>{
        const crop=['gallery','carousel'].includes(node.type)?imageFocalPosition(item):{};
        const card=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=`${index+1}. elem`;card.append(legend);
        for(const child of definition.itemFields)card.append(control(child,Object.hasOwn(crop,child.key)?crop[child.key]:item[child.key],(value,group)=>{const next=structuredClone(node.props?.[definition.key]||items);next[index][child.key]=value;save(next,group)},child.key==='assetId'?(id,asset)=>{const next=structuredClone(node.props?.[definition.key]||items);next[index].assetId=id;const alt=selectedAlt(asset);if(alt&&!String(next[index].alt||'').trim())next[index].alt=alt;save(next)}:undefined));
        const actions=document.createElement('div');actions.className='content-repeater-actions';
        for(const [label,offset] of [['Fel',-1],['Le',1],['Eltávolítás',0]]){
          const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-label',`${index+1}. elem: ${label}`);button.disabled=Boolean(node.locked)||(offset<0&&index===0)||(offset>0&&index===items.length-1);
          button.onclick=()=>{
            const keepFocus=document.activeElement===button;
            const next=structuredClone(node.props?.[definition.key]||items);
            if(!offset)next.splice(index,1);else [next[index],next[index+offset]]=[next[index+offset],next[index]];
            save(next,null,true);
            if(keepFocus)restoreRowFocus({
              rowIndex:offset?index+offset:Math.min(index,next.length-1),
              preferredAction:offset<0?'Le':offset>0?'Fel':'',
              editField:offset===0
            });
          };actions.append(button);
        }
        card.append(actions);section.append(card);
      });
      const add=document.createElement('button');add.type='button';add.textContent=definition.label+' hozzáadása';add.disabled=Boolean(node.locked)||items.length>=40;
      add.onclick=()=>{
        const keepFocus=document.activeElement===add;
        const next=[...(node.props?.[definition.key]||[]),{}];
        save(next,null,true);
        if(keepFocus)restoreRowFocus({rowIndex:next.length-1,editField:true});
      };
      section.append(add);root.append(section);
    }else if(definition.type==='table'){
      const note=document.createElement('p');note.className='content-field-help';note.textContent='Soronként egy sor, tabulátorral elválasztott cellák. Excelből másolt egyszerű táblázat is beilleszthető. A cellák szöveget tárolnak, képletek nem futnak.';root.append(note);
      root.append(control({...definition,type:'textarea',max:40000},(node.props?.rows||[]).map(row=>row.join('\t')).join('\n'),(value,group)=>save(value.split('\n').map(row=>row.split('\t')),group)));
    }else root.append(control(definition,contentProperties(node)[definition.key],save,node.type==='image'&&definition.key==='assetId'?(id,asset)=>{const patch={assetId:id},alt=selectedAlt(asset);if(alt&&!node.props?.decorative&&!String(node.props?.alt||'').trim())patch.alt=alt;const result=apply(patch);if(result===false)throw new Error('A módosítás nem alkalmazható.')} : undefined));
  }
  root.append(fail);return root;
}
