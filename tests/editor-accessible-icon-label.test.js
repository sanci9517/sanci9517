import test from 'node:test';
import assert from 'node:assert/strict';
import {authoredNodeHtml,contentAttributes} from '../public/editor-v2/core/authored-content.js';

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
