import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const page=readFileSync(new URL('../../visual-page.html',import.meta.url),'utf8');

test('public page keeps one continuous scroll and empty responsive side zones',()=>{
  assert.match(page,/<main class="page public-page-layout">/);
  assert.match(page,/<a class="public-skip-link" href="#content-canvas">Ugrás a tartalomhoz<\/a>/);
  assert.match(page,/<section id="content-canvas" class="content-canvas" tabindex="-1">/);
  assert.match(page,/\.public-skip-link:focus-visible\{transform:none/);
  assert.equal((page.match(/class="public-side-zone public-side-zone-(?:left|right)"/g)||[]).length,2);
  assert.match(page,/public-side-zone-left" aria-hidden="true"/);
  assert.match(page,/public-side-zone-right" aria-hidden="true"/);
  assert.match(page,/\.public-page-layout\{display:grid;grid-template-columns:/);
  assert.match(page,/\.public-side-zone\{[^}]*background:transparent;pointer-events:none/);
  assert.match(page,/@media\(max-width:700px\)\{\.public-page-layout\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(page,/\.public-side-zone\{display:none\}/);
  assert.match(page,/\.content-canvas\.visual-root-authored\{overflow:visible!important/);
  assert.doesNotMatch(page,/\.content-canvas\.visual-root-authored\{[^}]*height:auto!important/);
  assert.doesNotMatch(page,/\.public-side-zone\{[^}]*overflow:\s*(?:auto|scroll)/);
});
