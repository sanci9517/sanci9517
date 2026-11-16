import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {classifySanciDestination,decorateSanciShowcase} from '../public/assets/sanci-showcase.js';

test('SANCI pill icons activate only for real platform destinations',()=>{
 const good=[
 ['/p/twitch','twitch'],
 ['https://www.twitch.tv/sanci9517','twitch'],
 ['/p/youtube','youtube'],
 ['https://www.youtube.com/@sanci9517vod','youtube'],
 ['/p/tiktok','tiktok'],
 ['https://www.tiktok.com/@sanci9517','tiktok'],
 ['https://discord.gg/RWBCYNMqy','discord'],
 ['/p/community','discord'],
 ['/p/schedule','schedule'],
 ['/p/about','about'],
 ['/p/contact','contact']
 ];
 for(const [url,expected] of good)assert.equal(classifySanciDestination(url),expected,url);
 for(const url of ['','//evil.example','javascript:alert(1)','https://www.youtube.com/@someoneelse',
  '/p/twitch-copied','https://discord.gg/unrelated','https://www.twitch.tv/another']){
  assert.equal(classifySanciDestination(url),'',url);
 }
});

class FakeNode{
 constructor(id,tag='SECTION',href=''){
  this.dataset={nodeId:id};this.tagName=tag;this.attrs={href};this.children=[];
  this.className='';this.classes=new Set();
  this.listeners=new Map();this.style={values:{},setProperty(key,value){this.values[key]=value}};
  this.classList={
   add:(...names)=>names.forEach(name=>this.classes.add(name)),
   remove:(...names)=>names.forEach(name=>this.classes.delete(name)),
   contains:name=>this.classes.has(name)
  };
 }
 getAttribute(key){return this.attrs[key]??null}
 setAttribute(key,value){this.attrs[key]=value}
 append(...nodes){for(const node of nodes)node.parent=this;this.children.push(...nodes)}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(node=>node!==this)}
 addEventListener(type,handler){this.listeners.set(type,handler)}
 removeEventListener(type,handler){if(this.listeners.get(type)===handler)this.listeners.delete(type)}
 prepend(node){this.children.unshift(node)}
 querySelector(selector){return selector==='.sanci-cta-symbol'
  ?this.children.find(x=>x.className==='sanci-cta-symbol')||null:null}
 getBoundingClientRect(){return {top:0}}
}

test('rerendering or disabling the showcase restores content hidden for pending scroll reveals',()=>{
 const previous={observer:globalThis.IntersectionObserver,window:globalThis.window,matchMedia:globalThis.matchMedia};
 const observers=[];
 globalThis.IntersectionObserver=class{
  constructor(callback){this.callback=callback;this.observed=[];this.disconnected=false;observers.push(this)}
  observe(element){this.observed.push(element)}
  unobserve(element){this.observed=this.observed.filter(item=>item!==element)}
  disconnect(){this.disconnected=true;this.observed=[]}
 };
 globalThis.window={innerHeight:500};
 globalThis.matchMedia=()=>({matches:false});
 try{
  const nodes={
   root:{id:'root',type:'root',children:['hero','feature']},
   hero:{id:'hero',type:'container',parentId:'root',style:{backgroundAssetId:'valid'},children:['copy']},
   copy:{id:'copy',type:'container',parentId:'hero',children:[]},
   feature:{id:'feature',type:'container',parentId:'root',children:[]}
  };
  const elements=[new FakeNode('hero'),new FakeNode('copy'),new FakeNode('feature')];
  elements[2].getBoundingClientRect=()=>({top:1200});
  const canvas={querySelectorAll(selector){
   if(selector==='[data-node-id]')return elements;
   if(selector==='.sanci-await-view,.sanci-in-view')return elements.filter(el=>el.classList.contains('sanci-await-view')||el.classList.contains('sanci-in-view'));
   return [];
  }};
  assert.equal(decorateSanciShowcase(canvas,{nodes},{slug:'home',enabled:true}).active,true);
  assert.equal(elements[2].classList.contains('sanci-await-view'),true,'offscreen feature is pending its reveal');
  assert.equal(observers.length,1);
  observers[0].callback([{target:elements[2],isIntersecting:true}]);
  assert.equal(elements[2].classList.contains('sanci-in-view'),true,'an intersecting feature enters its visible state');
  assert.equal(decorateSanciShowcase(canvas,{nodes},{slug:'home',enabled:true}).active,true,'same-canvas rerender can initialize a fresh reveal');
  assert.equal(observers[0].disconnected,true,'the rerender detaches the previous observer');
  assert.equal(elements[2].classList.contains('sanci-in-view'),false,'a stale completion class cannot leak into a new render');
  assert.equal(elements[2].classList.contains('sanci-await-view'),true,'the new observer owns the pending state');
  assert.equal(observers.length,2);
  assert.equal(decorateSanciShowcase(canvas,{nodes},{slug:'home',enabled:false}).active,false);
  assert.equal(observers[1].disconnected,true,'the active observer is disconnected before cleanup');
  assert.equal(elements[2].classList.contains('sanci-await-view'),false,'content is visible when the feature is disabled');
  assert.equal(elements[2].classList.contains('sanci-in-view'),false,'stale reveal state is removed on the same canvas');
 }finally{
  for(const [key,value] of Object.entries({IntersectionObserver:previous.observer,window:previous.window,matchMedia:previous.matchMedia})){
   if(value===undefined)delete globalThis[key];else globalThis[key]=value;
  }
 }
});

test('SANCI hero spotlight follows a fine pointer and is removed on cleanup',()=>{
 const previous={document:globalThis.document,window:globalThis.window,matchMedia:globalThis.matchMedia,IntersectionObserver:globalThis.IntersectionObserver};
 globalThis.document={createElement:tag=>new FakeNode('spotlight',tag.toUpperCase())};
 globalThis.window={innerHeight:500};
 globalThis.matchMedia=query=>({matches:query.includes('hover: hover')});
 delete globalThis.IntersectionObserver;
 try{
  const nodes={root:{id:'root',type:'root',children:['hero']},hero:{id:'hero',type:'container',parentId:'root',style:{backgroundAssetId:'key-art'},children:[]}};
  const hero=new FakeNode('hero');
  hero.getBoundingClientRect=()=>({left:10,top:20,width:300,height:200});
  const canvas={querySelectorAll:selector=>selector==='[data-node-id]'?[hero]:[]};
  decorateSanciShowcase(canvas,{nodes},{slug:'home',enabled:true});
  const layer=hero.children.find(child=>child.className==='sanci-hero-spotlight');
  assert.ok(layer,'the interactive light is a separate decorative layer');
  assert.equal(layer.attrs['aria-hidden'],'true');
  hero.listeners.get('pointermove')({pointerType:'touch',clientX:100,clientY:120});
  assert.deepEqual(layer.style.values,{},'touch never starts the spotlight');
  hero.listeners.get('pointermove')({pointerType:'mouse',clientX:110,clientY:70});
  assert.equal(layer.style.values['--sanci-spotlight-x'],'100px');
  assert.equal(layer.style.values['--sanci-spotlight-y'],'50px');
  assert.equal(layer.classList.contains('is-active'),true);
  hero.listeners.get('pointerleave')();
  assert.equal(layer.classList.contains('is-active'),false,'leaving the hero restores the composed artwork');
  decorateSanciShowcase(canvas,{nodes},{slug:'home',enabled:false});
  assert.equal(hero.children.includes(layer),false,'rerender removes the detached enhancement layer');
  assert.equal(hero.listeners.size,0,'rerender also detaches pointer handlers');
  globalThis.matchMedia=query=>({matches:query.includes('prefers-reduced-motion')});
  decorateSanciShowcase(canvas,{nodes},{slug:'home',enabled:true});
  assert.equal(hero.children.length,0,'reduced-motion users receive the authored artwork without pointer effects');
  assert.equal(hero.listeners.size,0);
 }finally{
  for(const [key,value] of Object.entries(previous)){
   if(value===undefined)delete globalThis[key];else globalThis[key]=value;
  }
 }
});

test('original signature, icons and next-stream roles decorate SANCI only, without duplicating links',()=>{
 const previous=globalThis.document;
 globalThis.document={
  createElement:tag=>new FakeNode('new',tag.toUpperCase()),
  createElementNS:(_ns,tag)=>new FakeNode('svg',tag.toUpperCase())
 };
 try{
  const nodes={
   root:{id:'root',type:'root',children:['hero','feature']},
   hero:{id:'hero',type:'container',parentId:'root',style:{backgroundAssetId:'valid'},children:['copy']},
   copy:{id:'copy',type:'container',parentId:'hero',children:['signature','button']},
   signature:{id:'signature',type:'text',parentId:'copy',metadata:{sanciSignature:1}},
   button:{id:'button',type:'button',parentId:'copy'},
   feature:{id:'feature',type:'container',parentId:'root',children:['clock']},
   clock:{id:'clock',type:'countdown',parentId:'feature',props:{countdown:{source:'next-stream'}}}
  };
  const elements=[
   new FakeNode('hero'),new FakeNode('copy'),new FakeNode('signature','P'),
   new FakeNode('button','A','/p/twitch'),new FakeNode('feature'),new FakeNode('clock')
  ];
  const canvas={querySelectorAll:()=>elements};
  const page={nodes,metadata:{sanciSignatureVersion:1}};
  const first=decorateSanciShowcase(canvas,page,{slug:'home',enabled:true});
  const second=decorateSanciShowcase(canvas,page,{slug:'home',enabled:true});
  assert.deepEqual([first.hero,first.buttons,first.features,first.clocks,first.signatures],
    [true,1,1,1,1]);
  assert.equal(second.active,true);
  assert.equal(elements[2].attrs['data-sanci-role'],'signature');
  assert.equal(elements[5].attrs['data-sanci-role'],'next-stream');
  assert.equal(elements[3].dataset.sanciPlatform,'twitch');
  assert.equal(elements[3].children.length,1,'redecorating must not duplicate platform SVGs');
  const before=elements[3].children.length;
  assert.equal(decorateSanciShowcase(canvas,page,{slug:'home',enabled:false}).active,false);
  assert.equal(elements[3].children.length,before,'other creator sites cannot acquire SANCI branding');
 }finally{
  if(previous===undefined)delete globalThis.document;else globalThis.document=previous;
 }
});


test('outlined icons retain their stroke, and navigation keeps its existing icon system',()=>{
 const css=readFileSync(new URL('../public/assets/sanci-showcase.css',import.meta.url),'utf8');
 const siteJS=readFileSync(new URL('../public/assets/site.js',import.meta.url),'utf8');
 const showcaseJS=readFileSync(new URL('../public/assets/sanci-showcase.js',import.meta.url),'utf8');
 assert.match(css,/\.sanci-cta-symbol svg\[fill="none"\]\s*\{\s*fill:none;/);
 assert.match(css,/background-image:none;/,'SANCI CTA must honor user-authored backgroundColor');
 assert.match(siteJS,/function enhanceStaticNavigationIcons\(/);
 assert.match(siteJS,/menu-nav-icon/);
 assert.doesNotMatch(showcaseJS,/querySelectorAll\(['"]\.desktop-primary-nav/);
 assert.match(css,/prefers-reduced-motion:\s*reduce/);
 assert.match(css,/data-sanci-role="signature"/);
});


test('decorations run after all authored content activators, not before their DOM rewrites',()=>{
 const renderer=readFileSync(new URL('../public/assets/page-renderer.js',import.meta.url),'utf8');
 const shell=readFileSync(new URL('../public/visual-page.html',import.meta.url),'utf8');
 const activation=renderer.indexOf('activateStructuredContent(canvas);activateCountdowns(canvas);activateEmbeds(canvas);activateCodeBlocks(canvas);');
 const decoration=renderer.indexOf('decorateSanciShowcase(canvas,page,{slug,enabled:isSanciShowcase});');
 assert.ok(activation>0&&decoration>activation,'icons, autograph and highlights are attached after activation');
 assert.match(renderer,/sanci-showcase\.js\?v=20261116-hero-spotlight-v1/);
 assert.match(shell,/page-renderer\.js\?v=20261116-hero-spotlight-v1/,
  'the page shell must request the runtime that contains the observer cleanup');
 assert.equal(renderer.indexOf('decorateSanciShowcase(canvas,page,{slug,enabled:isSanciShowcase});',decoration+1),-1);
});


test('compact footer is SANCI-only, preserves original link order and large touch targets',()=>{
 const css=readFileSync(new URL('../public/assets/sanci-showcase.css',import.meta.url),'utf8');
 const html=readFileSync(new URL('../public/visual-page.html',import.meta.url),'utf8');
 const intro=css.indexOf('SANCI compact footer v3');
 const block=css.slice(intro);
 assert.ok(intro>0,'mobile footer scope exists');
 assert.match(block,/body\.sanci-editorial-page\[data-sanci-showcase="depth-v2"\]\s+\.public-footer-grid/);
 assert.match(block,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(block,/min-height:44px/);
 assert.match(block,/\.public-footer-column:last-child/);
 const footer=html.split('<footer class="footer public-footer">')[1]?.split('</footer>')[0];
 assert.ok(footer,'the canonical HTML footer must exist');
 const destinations=['/p/twitch','/p/youtube','/p/tiktok','/p/schedule',
  '/p/community','/p/about','/p/contact','mailto:sandor.bogadi95@gmail.com'];
 for(const href of destinations)assert.ok(footer.includes('href="'+href+'"'),href);
 assert.match(html,/\/assets\/sanci-showcase\.css\?v=20261116-live-status-pulse-v1/);
});

test('wide SANCI hero overlays are capped so authored key art stays visible, with full-width mobile copy',()=>{
 const css=readFileSync(new URL('../public/assets/sanci-showcase.css',import.meta.url),'utf8');
 const rule=css.slice(css.indexOf('Let SANCI\'s authored key art breathe'));
 assert.match(rule,/body\.sanci-editorial-page\[data-sanci-showcase="depth-v2"\]\s+\[data-sanci-role="hero-copy"\]/);
 assert.match(rule,/width:min\(100%,800px\)!important/);
 assert.match(rule,/max-width:min\(100%,800px\)!important/);
 assert.match(rule,/@media\(min-width:701px\)/);
 assert.match(rule,/padding:clamp\(26px,2\.6vw,38px\)!important/);
 assert.match(rule,/@media\(max-width:700px\)[\s\S]*width:100%!important[\s\S]*max-width:100%!important/);
 assert.ok(rule.includes('body.sanci-editorial-page[data-sanci-showcase="depth-v2"]'),
   'the art-reveal treatment is scoped to the SANCI public brand only');
});

test('weekly schedule cards get SANCI-only focus, live-state and reduced-motion-safe polish',()=>{
 const css=readFileSync(new URL('../public/assets/sanci-showcase.css',import.meta.url),'utf8');
 const scope='body.sanci-editorial-page[data-sanci-showcase="depth-v2"]';
 assert.ok(css.includes(`${scope} .sanci-week-event{`),
  'schedule polish is scoped to the canonical SANCI editorial pages');
 assert.ok(css.includes(`${scope} .sanci-week-event.is-live{`),
  'the authored live state has its own treatment');
 assert.ok(css.includes(`${scope} .sanci-week-event.is-live .sanci-week-event-status{`),
  'the existing status toggle controls whether a textual live label is shown');
 assert.ok(css.includes(`${scope} .sanci-week-event.is-live .sanci-week-event-status::before{`)&&css.includes('@keyframes sanci-live-indicator-pulse'),
  'only the authored live state gets the decorative pulse');
 assert.ok(css.includes(`${scope} .sanci-week-event:focus-within{`),
  'keyboard focus remains visible');
 assert.match(css,/@media\(hover:hover\) and \(pointer:fine\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.sanci-week-event:hover\{\s*transform:none!important/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.sanci-week-event\.is-live \.sanci-week-event-status::before\{\s*animation:none!important/);
 const html=readFileSync(new URL('../public/visual-page.html',import.meta.url),'utf8');
 assert.match(html,/sanci-showcase\.css\?v=20261116-live-status-pulse-v1/,
  'the page shell must bypass a cached previous schedule treatment');
});
