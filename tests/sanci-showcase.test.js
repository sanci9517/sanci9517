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
  this.className='';this.classes=[];
  this.classList={add:name=>this.classes.push(name)};
 }
 getAttribute(key){return this.attrs[key]??null}
 setAttribute(key,value){this.attrs[key]=value}
 append(...nodes){this.children.push(...nodes)}
 prepend(node){this.children.unshift(node)}
 querySelector(selector){return selector==='.sanci-cta-symbol'
  ?this.children.find(x=>x.className==='sanci-cta-symbol')||null:null}
 getBoundingClientRect(){return {top:0}}
}

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
 const activation=renderer.indexOf('activateStructuredContent(canvas);activateCountdowns(canvas);activateEmbeds(canvas);activateCodeBlocks(canvas);');
 const decoration=renderer.indexOf('decorateSanciShowcase(canvas,page,{slug,enabled:isSanciShowcase});');
 assert.ok(activation>0&&decoration>activation,'icons, autograph and highlights are attached after activation');
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
 assert.match(html,/\/assets\/sanci-showcase\.css\?v=20261114-depth-v4/);
});
