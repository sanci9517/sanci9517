import test from 'node:test';
import assert from 'node:assert/strict';
import {authoredNodeHtml,contentAttributes,contentDefaults,getPublicationContentGuidance,validateElementContent} from '../public/editor-v2/core/authored-content.js';

test('blank accessibility labels do not create empty accessible names',()=>{
  const blankIcon={type:'icon',props:{ariaLabel:'   '},accessibility:{}};
  assert.deepEqual(contentAttributes(blankIcon),{'aria-hidden':'true'});

  const paddedIcon={type:'icon',props:{ariaLabel:'  Kedvenc  '},accessibility:{}};
  assert.deepEqual(contentAttributes(paddedIcon),{'aria-label':'Kedvenc',role:'img'});

  const blankText={type:'text',props:{ariaLabel:'   '},accessibility:{label:'  \t '}};
  assert.equal(contentAttributes(blankText)['aria-label'],undefined);

  const malformedLabel={type:'icon',props:{ariaLabel:{toString:null}},accessibility:{label:['empty']}};
  assert.deepEqual(contentAttributes(malformedLabel),{'aria-hidden':'true'});
});

test('image descriptions and captions are trimmed, string-only and shared with gallery controls',()=>{
  const image=authoredNodeHtml({id:'image-1',type:'image',metadata:{contentVersion:1},props:{src:'/logo.svg',alt:'  Márkajel  ',caption:'  A csatorna logója  '}},{editor:true});
  assert.match(image,/<img src="\/logo\.svg" alt="Márkajel"/);
  assert.match(image,/<figcaption>A csatorna logója<\/figcaption>/);

  const malformed={toString:null};
  const gallery=authoredNodeHtml({id:'gallery-1',type:'gallery',metadata:{contentVersion:1},props:{items:[
    {src:'/captioned.svg',alt:'  \t ',caption:'  Egy fontos kép  '},
    {src:'/invalid.svg',alt:malformed,caption:malformed}
  ]}},{editor:true});
  assert.match(gallery,/<img src="\/captioned\.svg" alt=""/,'blank image descriptions stay intentionally empty');
  assert.match(gallery,/data-lightbox-alt="Egy fontos kép" data-lightbox-caption="Egy fontos kép" aria-haspopup="dialog" aria-label="Kép nagyítása: Egy fontos kép"/,
    'a non-empty caption is used consistently by the zoom button and preview');
  assert.match(gallery,/data-lightbox-alt="" data-lightbox-caption="" aria-haspopup="dialog" aria-label="Kép nagyítása: kép"/,
    'malformed saved labels do not throw or become misleading object strings');
});

test('malformed authored group labels use safe names and valid labels are normalized',()=>{
  const malformed={toString:null};
  const cases=[
    ['gallery','aria-label="Képek"'],
    ['carousel','aria-label="Képgaléria"'],
    ['tabs','aria-label="Fülek"'],
    ['accordion','aria-label="Harmonika"'],
    ['dropdown','aria-label="Lenyitható részek"']
  ];
  for(const [type,expected] of cases){
    const html=authoredNodeHtml({id:'bad-label',type,props:{ariaLabel:malformed,items:[]}});
    assert.ok(html.includes(expected),`${type} should render its safe accessible name`);
    assert.doesNotMatch(html,/(?:\[object Object\]|toString)/);
  }

  const padded=authoredNodeHtml({id:'good-label',type:'tabs',props:{ariaLabel:'  Projektek  ',items:[]}});
  assert.match(padded,/role="tablist" aria-label="Projektek"/);
  assert.equal(authoredNodeHtml({id:'bad-caption',type:'table',props:{caption:malformed,rows:[]}}),
    '<div class="creator-table-scroll" role="region" aria-label="Táblázat" tabindex="0"><table><tbody></tbody></table></div>');
  const caption=authoredNodeHtml({id:'good-caption',type:'table',props:{caption:'  Bevétel  ',rows:[]}});
  assert.match(caption,/role="region" aria-label="Bevétel"/);
  assert.match(caption,/<caption>Bevétel<\/caption>/);
});

test('malformed nested authored text does not interrupt Canvas or published rendering',()=>{
  const malformed={toString:null};
  const render=(type,props)=>authoredNodeHtml({id:'safe-text',type,metadata:{contentVersion:1},props});

  assert.equal(render('text',{text:malformed}),'');
  assert.equal(render('text',{text:42}),'42','numeric text accepted by the existing schema remains renderable');
  assert.equal(render('icon',{icon:malformed}),'<span aria-hidden="true">★</span>','an invalid icon key uses the established default');
  const image=render('image',{src:'/safe.svg',focalX:malformed,focalY:malformed});
  assert.match(image,/object-position:50% 50%/,'invalid crop axes fall back to centered framing');
  const gallery=render('gallery',{columns:malformed,items:[{src:'/safe.svg',alt:'Kép',focalX:malformed}]});
  assert.match(gallery,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/,'invalid column counts use the existing three-column default');
  assert.match(gallery,/object-position:50% 50%/);
  assert.equal(render('quote',{text:'  <quote>  ',citation:malformed}),'<div>  &lt;quote&gt;  </div>');
  assert.equal(render('list',{items:[{text:malformed},{text:malformed,href:'/p/home'}]}),
    '<ul><li></li><li><a href="/p/home">Hivatkozás</a></li></ul>');
  assert.match(render('table',{rows:[[malformed,'<cell>']]}),/<td><\/td><td>&lt;cell&gt;<\/td>/);

  const tabs=render('tabs',{items:[{title:malformed,text:malformed}]});
  assert.match(tabs,/<button[^>]*role="tab"[^>]*>Fül 1<\/button>/,'an invalid tab title cannot create an unnamed tab');
  assert.match(tabs,/<div role="tabpanel"[^>]*><\/div>/);
  const accordion=render('accordion',{items:[{title:malformed,text:malformed}]});
  assert.match(accordion,/<summary>Részletek<\/summary><div><\/div>/,'an invalid disclosure title receives a safe name');
  assert.equal(render('tooltip',{text:'Info',description:malformed}),
    '<span class="creator-tooltip"><button type="button">Info</button></span>','an invalid description leaves no dangling tooltip reference');

  const malformedItems=type=>render(type,{items:[null]});
  assert.equal(malformedItems('list'),'<ul><li></li></ul>','a null repeater row degrades to an empty item');
  assert.match(malformedItems('tabs'),/<button[^>]*role="tab"[^>]*>Fül 1<\/button>/);
  assert.match(malformedItems('tabs'),/<div role="tabpanel"[^>]*><\/div>/);
  assert.match(malformedItems('accordion'),/<summary>Részletek<\/summary><div><\/div>/);
  assert.match(malformedItems('dropdown'),/<summary>Részletek<\/summary><div><\/div>/);
  assert.match(malformedItems('gallery'),/A kép nem érhető el\./);
  assert.match(malformedItems('carousel'),/A kép nem érhető el\./);
});

test('malformed saved values produce publication guidance instead of crashing Inspector or Canvas defaults',()=>{
  const malformed={toString:null};
  const guidance=(type,props)=>getPublicationContentGuidance({type,props,metadata:{contentVersion:1}});

  assert.equal(contentDefaults({type:'heading',props:{level:malformed},metadata:{contentVersion:1}}).fontSize,'36px',
    'an uncoercible heading level falls back to the standard H2 Canvas size');
  assert.deepEqual(guidance('heading',{text:malformed}),{fieldKey:'text',message:'A címsor nem lehet üres.'});
  assert.deepEqual(guidance('image',{src:malformed,assetId:''}),{fieldKey:'src',message:'Válassz Médiatár-fájlt vagy adj meg médiaforrást.'});
  assert.deepEqual(guidance('image',{src:'/image.svg',alt:malformed,decorative:false}),
    {fieldKey:'alt',message:'Adj meg képleírást, vagy jelöld a képet díszítőnek.'});
  assert.deepEqual(guidance('gallery',{items:[null]}),
    {fieldKey:'items',message:'A képekhez Médiatár-fájl vagy forrás, és leírás vagy képaláírás szükséges.'});
  assert.deepEqual(guidance('tabs',{items:[null]}),{fieldKey:'items',message:'Legalább egy elnevezett rész szükséges.'});
  assert.deepEqual(guidance('table',{rows:[null]}),{fieldKey:'rows',message:'A táblázatnak legyen tartalma.'});
  assert.deepEqual(guidance('table',{rows:[[malformed]]}),{fieldKey:'rows',message:'A táblázatnak legyen tartalma.'});
  assert.deepEqual(guidance('list',{items:[null]}),{fieldKey:'items',message:'Adj meg legalább egy nem üres listaelemet.'});

  assert.equal(guidance('heading',{text:'  Valós címsor  '}),null);
  assert.equal(guidance('image',{assetId:'known-asset',decorative:true}),null);
  assert.equal(guidance('gallery',{items:[{assetId:'known-asset',alt:'Tájkép'}]}),null);
  assert.equal(guidance('tabs',{items:[{title:'Munkáim'}]}),null);
  assert.equal(guidance('table',{rows:[['Hónap'],['Június']]}),null);
  assert.equal(guidance('list',{items:[{text:'Első pont'}]}),null);
});

test('private editor media previews remain editable but cannot pass Publish or render publicly',()=>{
  const privateSources=[
    '/api/admin/media?id=asset',
    '/API/admin/media?id=asset',
    '/%61pi/admin/media?id=asset',
    '/api%2Fadmin/media?id=asset',
    '/%252Fapi%252Fadmin%252Fmedia?id=asset'
  ];
  for(const src of privateSources){
    const image={id:'private-image',type:'image',metadata:{contentVersion:1},props:{src,alt:'Privát előnézet'}};
    assert.match(authoredNodeHtml(image,{editor:true}),new RegExp(src.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),
      'the authenticated Editor retains its media preview');
    assert.doesNotMatch(authoredNodeHtml(image),/src="[^"]*api[^\"]*admin/i,
      'public rendering never emits an authenticated Editor endpoint');
    assert.deepEqual(getPublicationContentGuidance(image),{
      fieldKey:'src',message:'Válassz Médiatár-fájlt vagy adj meg médiaforrást.'
    });
    assert.throws(()=>validateElementContent(image),/privát szerkesztői előnézet/,
      'the server-side Publish validation rejects legacy private preview paths');
  }

  const video={id:'private-poster',type:'video',metadata:{contentVersion:1},props:{src:'https://media.example/video.mp4',poster:'/api/admin/media?id=poster'}};
  assert.match(authoredNodeHtml(video,{editor:true}),/poster="\/api\/admin\/media\?id=poster"/);
  assert.doesNotMatch(authoredNodeHtml(video),/poster="[^"]*api\/admin/i);
  assert.deepEqual(getPublicationContentGuidance(video),{
    fieldKey:'poster',message:'A szerkesztői előnézeti útvonal nem használható videó-borítóképként a publikált oldalon.'
  });
  assert.throws(()=>validateElementContent(video),/privát szerkesztői előnézet/);

  const gallery={id:'private-gallery',type:'gallery',metadata:{contentVersion:1},props:{items:[{src:'/api/admin/media?id=gallery-image',alt:'Képgaléria'}]}};
  assert.match(authoredNodeHtml(gallery,{editor:true}),/src="\/api\/admin\/media\?id=gallery-image"/);
  assert.doesNotMatch(authoredNodeHtml(gallery),/src="[^"]*api\/admin/i);
  assert.throws(()=>validateElementContent(gallery),/privát szerkesztői előnézet/);

  const publicAsset={id:'public-asset',type:'image',metadata:{contentVersion:1},props:{assetId:'123e4567-e89b-42d3-a456-426614174000',alt:'Nyilvános kép'}};
  assert.match(authoredNodeHtml(publicAsset),/src="\/media\/123e4567-e89b-42d3-a456-426614174000"/,
    'the approved public media proxy is unchanged');
  assert.equal(getPublicationContentGuidance(publicAsset),null);
  assert.doesNotThrow(()=>validateElementContent(publicAsset));

  assert.equal(getPublicationContentGuidance({type:'link',metadata:{contentVersion:1},props:{href:'mailto:creator@example.com'}}),null,
    'media-route filtering does not reject an intentionally supported mailto link');
  assert.equal(getPublicationContentGuidance({type:'button',metadata:{contentVersion:1},props:{href:'/p/portfolio'}}),null,
    'ordinary internal links keep the existing publication contract');
});
