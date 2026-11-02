import test from 'node:test';
import assert from 'node:assert/strict';
import {contentAttributes} from '../public/editor-v2/core/authored-content.js';

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
