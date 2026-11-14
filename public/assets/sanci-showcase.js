/* SANCI DARK DEPTH — public, editorial-only presentation.
 * DOM enhancements do not own or persist Editor content. Editing still
 * happens through the canonical Page Model and separate Save / Publish.
 * No third-party scripts, media, API calls or invented LIVE indicators.
 */
const GLYPHS={
  twitch:'<path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>',
  youtube:'<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545S4.495 3.545 2.623 4.05A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
  tiktok:'<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
  discord:'<path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.516.074.074 0 00-.078.038c-.211.375-.445.865-.609 1.249-1.844-.276-3.68-.276-5.487 0-.164-.393-.406-.874-.618-1.249a.077.077 0 00-.078-.037 19.74 19.74 0 00-4.885 1.515.07.07 0 00-.032.028C.533 9.046-.319 13.58.099 18.058a.082.082 0 00.031.056c2.053 1.508 4.041 2.423 5.993 3.03a.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106 12.3 12.3 0 01-1.872-.892.077.077 0 01-.008-.128l.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.009l.373.292a.077.077 0 01-.007.128c-.597.343-1.219.644-1.873.891a.076.076 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.077.077 0 00.084.029c1.961-.607 3.949-1.522 6.003-3.029a.077.077 0 00.031-.055c.5-5.177-.838-9.674-3.548-13.66a.062.062 0 00-.031-.029z"/>',
  schedule:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16M8 13h3M13 13h3M8 17h3"/>',
  about:'<circle cx="12" cy="12" r="8"/><path d="M12 10v6M12 7.5h.01"/>',
  contact:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="m5 7 7 5 7-5"/>'
};
const SVG_NS='http://www.w3.org/2000/svg';
const brandIcons=new Set(['twitch','youtube','tiktok','discord']);

export function classifySanciDestination(href){
  if(typeof href!=='string'||href.startsWith('//'))return '';
  if(/^\/p\/twitch(?:[?#]|$)/.test(href)||/^https:\/\/(?:www\.)?twitch\.tv\/sanci9517(?:[/?#]|$)/i.test(href))return 'twitch';
  if(/^\/p\/youtube(?:[?#]|$)/.test(href)||/^https:\/\/(?:www\.)?youtube\.com\/@sanci9517vod(?:[/?#]|$)/i.test(href))return 'youtube';
  if(/^\/p\/tiktok(?:[?#]|$)/.test(href)||/^https:\/\/(?:www\.)?tiktok\.com\/@sanci9517(?:[/?#]|$)/i.test(href))return 'tiktok';
  if(/^\/p\/community(?:[?#]|$)/.test(href)||/^https:\/\/discord\.gg\/RWBCYNMqy(?:[/?#]|$)/i.test(href))return 'discord';
  if(/^\/p\/schedule(?:[?#]|$)/.test(href))return 'schedule';
  if(/^\/p\/about(?:[?#]|$)/.test(href))return 'about';
  if(/^\/p\/contact(?:[?#]|$)/.test(href)||href.startsWith('mailto:'))return 'contact';
  return '';
}
const activeObservers=new WeakMap();
function staticSymbol(kind){
  const symbol=document.createElement('span');
  symbol.className='sanci-cta-symbol';
  symbol.setAttribute('aria-hidden','true');
  const svg=document.createElementNS(SVG_NS,'svg');
  svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('focusable','false');
  if(!brandIcons.has(kind)){
    svg.setAttribute('fill','none');
    svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-width','1.8');
    svg.setAttribute('stroke-linecap','round');
    svg.setAttribute('stroke-linejoin','round');
  }else svg.setAttribute('fill','currentColor');
  // The constant SVGs originate from the project's existing platform icons.
  svg.innerHTML=GLYPHS[kind];
  symbol.append(svg);
  return symbol;
}
export function decorateSanciShowcase(canvas,page,{slug,enabled=false}={}){
  const previous=activeObservers.get(canvas);
  if(previous){previous.disconnect();activeObservers.delete(canvas)}
  if(!enabled||!canvas||!page?.nodes||typeof canvas.querySelectorAll!=='function')return {active:false};
  const elements=new Map([...canvas.querySelectorAll('[data-node-id]')]
    .filter(el=>el.dataset?.nodeId).map(el=>[el.dataset.nodeId,el]));
  const all=Object.values(page.nodes);
  const hero=all.find(n=>n.type==='container'&&typeof n.style?.backgroundAssetId==='string'&&elements.has(n.id));
  const heroElement=hero&&elements.get(hero.id);
  if(heroElement){
    heroElement.dataset.sanciRole='hero';
    const copy=hero.children?.map(id=>page.nodes[id]).find(n=>n?.type==='container');
    const copyElement=copy&&elements.get(copy.id);
    if(copyElement)copyElement.dataset.sanciRole='hero-copy';
  }
  let buttons=0;
  for(const n of all){
    if(!['button','link'].includes(n.type))continue;
    const el=elements.get(n.id);
    if(!el||el.tagName?.toLowerCase()!=='a')continue;
    const kind=classifySanciDestination(el.getAttribute('href'));
    if(!kind||el.querySelector('.sanci-cta-symbol'))continue;
    el.dataset.sanciPlatform=kind;
    el.classList.add('sanci-showcase-cta');
    el.prepend(staticSymbol(kind));
    buttons++;
  }
  const clocks=all.filter(n=>n.type==='countdown'&&n.props?.countdown?.source==='next-stream');
  for(const n of clocks)elements.get(n.id)?.setAttribute('data-sanci-role','next-stream');
  const main=hero?.parentId&&page.nodes[hero.parentId];
  const features=(main?.children||[]).filter(id=>id!==hero?.id).map(id=>elements.get(id)).filter(Boolean);
  for(const el of features)el.dataset.sanciRole='feature';
  // Optional progressive disclosure on the way into view. JS failure, reduced
  // motion and old browsers leave all editorial content fully visible.
  const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&typeof IntersectionObserver==='function'&&typeof window!=='undefined'){
    const below=features.filter(el=>el.getBoundingClientRect().top>window.innerHeight*.9);
    if(below.length){
      const observer=new IntersectionObserver(entries=>{
        for(const entry of entries){
          if(!entry.isIntersecting)continue;
          entry.target.classList.add('sanci-in-view');
          entry.target.classList.remove('sanci-await-view');
          observer.unobserve(entry.target);
        }
      },{rootMargin:'0px 0px -24px 0px',threshold:.08});
      for(const el of below){el.classList.add('sanci-await-view');observer.observe(el)}
      activeObservers.set(canvas,observer);
    }
  }
  return {active:true,slug:String(slug||''),hero:Boolean(heroElement),buttons,features:features.length,clocks:clocks.length};
}
