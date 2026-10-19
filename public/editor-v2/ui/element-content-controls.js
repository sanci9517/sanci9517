import {CONTENT_FIELDS,normalizeContentField,contentProperties} from '../core/authored-content.js';

export function pageLinkPicker(pages,input){
  const select=document.createElement('select');select.className='content-page-picker';select.setAttribute('aria-label','Belső oldal kiválasztása');
  const empty=document.createElement('option');empty.value='';empty.textContent='Válassz belső oldalt…';select.append(empty);
  for(const page of pages||[]){if(!page.slug)continue;const option=document.createElement('option');option.value='/p/'+encodeURIComponent(page.isPublished?(page.publishedSlug||page.slug):page.slug);option.textContent=(page.title||page.slug)+(page.isPublished?'':' · még nincs publikálva');select.append(option)}
  select.value=[...select.options].some(option=>option.value===input.value)?input.value:'';
  select.onchange=()=>{if(select.value){input.value=select.value;input.dispatchEvent(new Event('input',{bubbles:true}))}};return select;
}
export function renderElementContentControls(node,{apply,pending,exclude=[],pages=[]}){
  const root=document.createElement('section');root.className='element-content-controls';
  const fail=document.createElement('p');fail.className='property-validation';fail.setAttribute('role','status');
  const control=(definition,value,save)=>{
    const wrap=document.createElement('label');wrap.className='field content-schema-field';wrap.dataset.contentKey=definition.key;
    const label=document.createElement('span');label.textContent=definition.label;wrap.append(label);
    let input;
    if(definition.type==='select'){input=document.createElement('select');for(const [value,text] of Object.entries(definition.options)){const option=document.createElement('option');option.value=value;option.textContent=text;input.append(option)}input.value=String(value??Object.keys(definition.options)[0])}
    else if(definition.type==='boolean'){input=document.createElement('input');input.type='checkbox';input.checked=Boolean(value)}
    else {input=document.createElement(definition.type==='textarea'?'textarea':'input');if(input.tagName==='INPUT'){input.type=definition.type==='range'?'range':'text';if(definition.type==='range'){input.min=String(definition.min??0);input.max=String(definition.max??100);input.step=String(definition.step??1)}}input.value=value??'';if(definition.type!=='range')input.maxLength=definition.max||2048}
    input.setAttribute('aria-label',definition.label);input.disabled=Boolean(node.locked);input.dataset.typingGroup=crypto.randomUUID();
    const rangeOutput=definition.type==='range'?document.createElement('output'):null;if(rangeOutput){rangeOutput.className='content-range-value';rangeOutput.value=String(input.value);rangeOutput.textContent=`${input.value}%`;rangeOutput.setAttribute('aria-live','polite')}
    let committed=value;
    const update=()=>{try{const next=normalizeContentField(definition,definition.type==='boolean'?input.checked:definition.type==='range'?input.valueAsNumber:input.value);input.removeAttribute('aria-invalid');fail.textContent='';save(next,input.dataset.typingGroup);committed=next;if(rangeOutput){rangeOutput.value=String(next);rangeOutput.textContent=`${next}%`}}catch(error){input.setAttribute('aria-invalid','true');fail.textContent=error.message}};
    input.addEventListener(['select','boolean'].includes(definition.type)?'change':'input',update);
    input.addEventListener('focus',()=>pending(()=>!root.querySelector('[aria-invalid="true"]')));
    input.addEventListener('keydown',event=>{if(event.key==='Escape'){input.value=committed??'';if(definition.type==='boolean')input.checked=Boolean(committed);input.removeAttribute('aria-invalid');fail.textContent=''}});
    wrap.append(input);if(rangeOutput)wrap.append(rangeOutput);if(definition.type==='url'){const picker=pageLinkPicker(pages,input);picker.disabled=Boolean(node.locked);wrap.append(picker)}if(definition.help){const help=document.createElement('small');help.className='content-field-help';help.textContent=definition.help;wrap.append(help)}return wrap;
  };
  for(const definition of CONTENT_FIELDS[node.type]||[]){
    if(exclude.includes(definition.key))continue;
    const save=(value,typingGroup,render=false)=>{const result=apply({[definition.key]:value},{typingGroup,render});if(result===false)throw new Error('A módosítás nem alkalmazható.');return result};
    if(definition.type==='repeater'){
      const section=document.createElement('details');section.className='content-repeater';section.open=true;
      const summary=document.createElement('summary');summary.textContent=definition.label;section.append(summary);
      const items=Array.isArray(node.props?.[definition.key])?node.props[definition.key]:[];
      items.forEach((item,index)=>{
        const card=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=`${index+1}. elem`;card.append(legend);
        for(const child of definition.itemFields)card.append(control(child,item[child.key],(value,group)=>{const next=structuredClone(node.props?.[definition.key]||items);next[index][child.key]=value;save(next,group)}));
        const actions=document.createElement('div');actions.className='content-repeater-actions';
        for(const [label,offset] of [['Fel',-1],['Le',1],['Eltávolítás',0]]){
          const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-label',`${index+1}. elem: ${label}`);button.disabled=Boolean(node.locked)||(offset<0&&index===0)||(offset>0&&index===items.length-1);
          button.onclick=()=>{const next=structuredClone(node.props?.[definition.key]||items);if(!offset)next.splice(index,1);else [next[index],next[index+offset]]=[next[index+offset],next[index]];save(next,null,true)};actions.append(button);
        }
        card.append(actions);section.append(card);
      });
      const add=document.createElement('button');add.type='button';add.textContent=definition.label+' hozzáadása';add.disabled=Boolean(node.locked)||items.length>=40;add.onclick=()=>save([...node.props?.[definition.key]||[],{}],null,true);section.append(add);root.append(section);
    }else if(definition.type==='table'){
      const note=document.createElement('p');note.className='content-field-help';note.textContent='Soronként egy sor, tabulátorral elválasztott cellák. Excelből másolt egyszerű táblázat is beilleszthető. A cellák szöveget tárolnak, képletek nem futnak.';root.append(note);
      root.append(control({...definition,type:'textarea',max:40000},(node.props?.rows||[]).map(row=>row.join('\t')).join('\n'),(value,group)=>save(value.split('\n').map(row=>row.split('\t')),group)));
    }else root.append(control(definition,contentProperties(node)[definition.key],save));
  }
  root.append(fail);return root;
}
