/* Contextual Code block Inspector; the source is always text, never executable HTML. */
import {defaultCodeSnippet,SNIPPET_LANGUAGES} from '../core/code-snippet.js';
export function renderCodeSnippetInspector(node,update){
 const model={...defaultCodeSnippet(),...(node.props?.codeSnippet||{})};
 const section=document.createElement('section');section.className='code-snippet-inspector';
 const heading=document.createElement('h3');heading.textContent='Kód- és parancsblokk';section.append(heading);
 const help=document.createElement('p');help.className='structured-inspector-help';
 help.textContent='OBS, Discord, PowerShell, konfigurációk vagy technikai útmutatók. A kód csak szövegként jelenik meg, soha nem futtatódik.';section.append(help);
 const save=patch=>update({...model,...patch,version:1});
 const field=(name,value,handler,multi=false)=>{
  const label=document.createElement('label');label.className='field';label.append(document.createTextNode(name));
  const input=document.createElement(multi?'textarea':'input');
  if(!multi)input.type='text';else{input.rows=12;input.spellcheck=false;input.wrap='off';input.className='code-snippet-source'}
  input.setAttribute('aria-label',name);input.value=value??'';input.disabled=Boolean(node.locked);
  input.onchange=()=>handler(input.value);label.append(input);section.append(label);
 };
 const select=(name,choices,value,handler)=>{
  const label=document.createElement('label');label.className='field';label.append(document.createTextNode(name));
  const input=document.createElement('select');input.setAttribute('aria-label',name);input.disabled=Boolean(node.locked);
  for(const [key,text] of choices){const option=document.createElement('option');option.value=key;option.textContent=text;input.append(option)}
  input.value=value;input.onchange=()=>handler(input.value);label.append(input);section.append(label);
 };
 const toggle=(label,checked,handler)=>{
  const wrap=document.createElement('label');wrap.className='inspector-toggle';
  const input=document.createElement('input');input.type='checkbox';input.checked=Boolean(checked);input.disabled=Boolean(node.locked);
  input.onchange=()=>handler(input.checked);wrap.append(input,document.createTextNode(label));section.append(wrap);
 };
 field('Blokk címe',model.title,value=>save({title:value}));
 select('Kód nyelve',SNIPPET_LANGUAGES,model.language,value=>save({language:value}));
 select('Színséma',[['dark','Sötét'],['light','Világos']],model.theme,value=>save({theme:value}));
 toggle('Sorszámok mutatása',model.showLineNumbers,value=>save({showLineNumbers:value}));
 toggle('Hosszú sorok tördelése',model.wrapLines,value=>save({wrapLines:value}));
 field('Kód vagy parancs szövege',model.code,value=>save({code:value}),true);
 const note=document.createElement('small');note.className='structured-inspector-help';
 note.textContent='Maximum 40 000 karakter és 500 sor. A Másolás gomb a publikus oldalon működik. Üres tartalommal piszkozat menthető, de nem publikálható. A módosításokhoz külön Publikálás szükséges.';section.append(note);
 return section;
}
