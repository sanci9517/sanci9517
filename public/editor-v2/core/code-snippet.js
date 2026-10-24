/* Versioned, non-executing code snippet. Never insert authored code as HTML. */
export const SNIPPET_LANGUAGES=Object.freeze([
 ['text','Egyszerű szöveg'],['bash','Bash'],['powershell','PowerShell'],
 ['javascript','JavaScript'],['typescript','TypeScript'],['json','JSON'],
 ['html','HTML'],['css','CSS'],['python','Python'],['sql','SQL'],
 ['yaml','YAML'],['markdown','Markdown']
]);
export const SNIPPET_THEMES=Object.freeze(['dark','light']);
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export function defaultCodeSnippet(){
 return {version:1,title:'Parancs vagy kódrészlet',language:'text',code:'',theme:'dark',showLineNumbers:false,wrapLines:false};
}
export function normalizeCodeSnippet(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1)throw Error('Hiányzó kódblokk-beállítás');
 const title=String(value.title??'').trim();
 const code=String(value.code??'').replace(/\r\n?/g,'\n');
 if(!title||title.length>120)throw Error('Adj meg 1–120 karakteres címet');
 if(!code.trim()||code.length>40000||code.split('\n').length>500||code.includes('\0'))throw Error('A kódblokk nem lehet üres, legfeljebb 500 sor és 40 000 karakter lehet');
 if(!SNIPPET_LANGUAGES.some(([id])=>id===value.language))throw Error('Nem támogatott kódnyelv');
 if(!SNIPPET_THEMES.includes(value.theme))throw Error('Nem támogatott kódtéma');
 if(typeof value.showLineNumbers!=='boolean'||typeof value.wrapLines!=='boolean')throw Error('Érvénytelen kódmegjelenítési beállítás');
 return {version:1,title,language:value.language,code,theme:value.theme,showLineNumbers:value.showLineNumbers,wrapLines:value.wrapLines};
}
export function renderCodeSnippet(value){
 const model=value&&typeof value==='object'&&!Array.isArray(value)?{...defaultCodeSnippet(),...value}:defaultCodeSnippet();
 const language=SNIPPET_LANGUAGES.find(([id])=>id===model.language)?.[0]||'text';
 const theme=SNIPPET_THEMES.includes(model.theme)?model.theme:'dark';
 const raw=String(model.code??'').replace(/\r\n?/g,'\n').slice(0,40000);
 const lines=raw.split('\n').slice(0,500);
 const body=lines.map((line,i)=>'<span class="visual-code-line" data-line="'+(i+1)+'">'+esc(line)+'</span>').join('\n');
 const classes='visual-code-figure visual-code-'+theme+(model.showLineNumbers?' visual-code-numbered':'')+(model.wrapLines?' visual-code-wrap':'');
 const title=String(model.title||'Kódrészlet').slice(0,120);
 const copy='<button type="button" class="visual-code-copy" aria-label="'+esc(title)+' másolása">Másolás</button>';
 return '<figure class="'+classes+'" role="group" aria-label="'+esc(title)+'"><figcaption><strong class="visual-code-title">'+esc(title)+'</strong><span class="visual-code-language">'+esc(language)+'</span>'+copy+'</figcaption><pre tabindex="0"><code>'+body+'</code></pre></figure>';
}
const wired=new WeakSet();
export function activateCodeBlocks(root){
 if(!root||typeof root.querySelectorAll!=='function')return;
 for(const figure of root.querySelectorAll('.visual-code-figure')){
  if(wired.has(figure))continue;wired.add(figure);
  const button=figure.querySelector('button.visual-code-copy'),code=figure.querySelector('pre code');
  if(!button||!code)continue;
  button.addEventListener('click',async()=>{
   const value=code.textContent??'';
   try{
    if(!navigator.clipboard?.writeText)throw Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(value);
    button.textContent='Másolva ✓';
    button.setAttribute('aria-label','Kód a vágólapra másolva');
   }catch{
    const selection=window.getSelection(),range=document.createRange();
    range.selectNodeContents(code);selection?.removeAllRanges();selection?.addRange(range);
    button.textContent='Kijelölve – másold ki';
    button.setAttribute('aria-label','Kód kijelölve, másold kézzel');
   }
  });
 }
}
