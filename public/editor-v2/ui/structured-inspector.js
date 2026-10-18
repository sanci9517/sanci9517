/* Inspector-only controls for canonical static content. All edits call the command API. */
import {createElementContent,normalizeElementContent,isStructuredType} from '../core/element-content.js';
const typeLabels={list:'Lista',table:'Táblázat',tabs:'Fülek',accordion:'Lenyitható blokkok',gallery:'Galéria',carousel:'Tartalom-carousel'};
export function renderStructuredInspector(node,update){
 if(!isStructuredType(node.type))return null;
 let model;try{model=normalizeElementContent(node.type,node.props?.contentModel??createElementContent(node.type))}
 catch{model=createElementContent(node.type)}
 const section=document.createElement('section');section.className='structured-inspector';
 const title=document.createElement('h3');title.textContent=typeLabels[node.type];section.append(title);
 const help=document.createElement('p');help.className='structured-inspector-help';
 help.textContent='A változtatások piszkozatban maradnak. A publikus oldal csak külön publikálás után frissül.';section.append(help);
 const save=next=>update(normalizeElementContent(node.type,next));
 const action=(label,fn,disabled=false)=>{
  const button=document.createElement('button');button.type='button';button.className='structured-action';button.textContent=label;button.disabled=Boolean(node.locked||disabled);button.onclick=fn;return button;
 };
 const input=(name,value,onChange,multi=false)=>{
  const label=document.createElement('label');label.className='field structured-input';
  const caption=document.createElement('span');caption.textContent=name;
  const editor=document.createElement(multi?'textarea':'input');editor.value=value??'';editor.disabled=Boolean(node.locked);
  editor.onchange=()=>onChange(editor.value);label.append(caption,editor);return label;
 };
 const tools=document.createElement('div');tools.className='structured-actions';
 if(node.type==='list'){
  const ordered=document.createElement('label');ordered.className='inspector-toggle';
  const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=model.ordered;checkbox.disabled=Boolean(node.locked);
  checkbox.onchange=()=>save({...model,ordered:checkbox.checked});
  ordered.append(checkbox,document.createTextNode('Számozott lista'));section.append(ordered);
 }
 if(node.type==='table'){
  const cols=model.rows[0].length;
  tools.append(action('＋ Sor',()=>save({...model,rows:[...model.rows,Array(cols).fill('')]}),model.rows.length>=40),
   action('＋ Oszlop',()=>save({...model,rows:model.rows.map(r=>[...r,''])}),cols>=12),
   action('− Utolsó oszlop',()=>save({...model,rows:model.rows.map(r=>r.slice(0,-1))}),cols<=1));
  section.append(tools);
  model.rows.forEach((row,ri)=>{
   const item=document.createElement('fieldset');item.className='structured-item';const legend=document.createElement('legend');legend.textContent=ri===0?'Fejléc':`Sor ${ri}`;item.append(legend);
   row.forEach((v,ci)=>item.append(input(`Oszlop ${ci+1}`,v,val=>{const rows=model.rows.map(r=>[...r]);rows[ri][ci]=val;save({...model,rows})})));
   item.append(action('Sor törlése',()=>save({...model,rows:model.rows.filter((_,i)=>i!==ri)}),model.rows.length===1||ri===0));
   section.append(item);
  });
 }else{
  const items=model.items;
  const defaults={list:()=>'',tabs:()=>({label:'Új fül',content:'Írd ide a tartalmat'}),accordion:()=>({label:'Új kérdés',content:'Írd ide a választ'}),gallery:()=>({src:'',alt:'',caption:''}),carousel:()=>({label:'Új dia',content:'Írd ide a tartalmat',src:'',alt:''})};
  tools.append(action('＋ Új elem',()=>save({...model,items:[...items,defaults[node.type]()] }),items.length>=40));
  section.append(tools);
  items.forEach((entry,i)=>{
   const item=document.createElement('fieldset');item.className='structured-item';
   const legend=document.createElement('legend');legend.textContent=`Elem ${i+1}`;item.append(legend);
   const change=patch=>save({...model,items:items.map((v,index)=>index===i?patch:v)});
   if(node.type==='list')item.append(input('Szöveg',entry,val=>change(val),true));
   if(['tabs','accordion','carousel'].includes(node.type)){
    item.append(input(node.type==='tabs'?'Fül neve':'Cím',entry.label,val=>change({...entry,label:val})));
    item.append(input('Tartalom',entry.content,val=>change({...entry,content:val}),true));
   }
   if(node.type==='carousel'){
    item.append(input('Kép URL (opcionális)',entry.src,val=>change({...entry,src:val.trim()})));
    item.append(input('Kép leírása',entry.alt,val=>change({...entry,alt:val})));
   }
   if(node.type==='gallery'){
    item.append(input('Kép URL',entry.src,val=>change({...entry,src:val.trim()})));
    item.append(input('Kép leírása (alt)',entry.alt,val=>change({...entry,alt:val})));
    item.append(input('Képaláírás',entry.caption,val=>change({...entry,caption:val})));
   }
   const controls=document.createElement('div');controls.className='structured-actions';
   controls.append(
    action('↑ Fel',()=>{const copy=[...items];[copy[i-1],copy[i]]=[copy[i],copy[i-1]];save({...model,items:copy})},i===0),
    action('↓ Le',()=>{const copy=[...items];[copy[i+1],copy[i]]=[copy[i],copy[i+1]];save({...model,items:copy})},i===items.length-1),
    action('× Törlés',()=>save({...model,items:items.filter((_,index)=>index!==i)}),items.length<=1)
   );item.append(controls);section.append(item);
  });
 }
 const note=document.createElement('small');note.className='structured-inspector-help';note.textContent=node.type==='gallery'?'Publikálás előtt minden képhez URL és képleírás szükséges.':['tabs','accordion','carousel'].includes(node.type)?'Minden címhez tartalom szükséges a publikáláshoz.':'Az elemek sorrendje a publikus oldalon is megmarad.';
 section.append(note);
 return section;
}
