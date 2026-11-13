import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const file=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const shell=file('../public/visual-page.html');
const worker=file('../src/index.ts');
const media=file('../src/routes/admin/media.ts');
const renderer=file('../public/assets/page-renderer.js');
const css=file('../public/assets/site.css');
const js=file('../public/assets/site.js');

test('brand shell does not contain placeholder S, dead hrefs or invented live status',()=>{
  assert.doesNotMatch(shell,/class="brand-mark"[^>]*>S</);
  assert.doesNotMatch(shell,/href="#"/);
  assert.doesNotMatch(shell,/Creator hub online|\bLIVE NOW\b/i);
  assert.match(shell,/data-sanci-brand-slot/);
  assert.match(shell,/data-canonical-menu/);
});

test('canonical SANCI identity and external channels are real source-of-truth URLs',()=>{
  for(const url of ['https://www.twitch.tv/sanci9517','https://www.youtube.com/@sanci9517vod','https://www.tiktok.com/@sanci9517','https://discord.gg/RWBCYNMqy','mailto:sandor.bogadi95@gmail.com']){
    assert.ok(shell.includes(url),url);
  }
  for(const href of ['/p/twitch','/p/videok','/p/schedule','/p/community','/p/about','/p/contact']){
    assert.ok(shell.includes('href="'+href+'"'),href);
  }
});

test('only canonical site receives SANCI imagery and its footer',()=>{
  assert.match(worker,/siteId === getCanonicalSiteContext\(\)\.siteId/);
  assert.match(worker,/data-sanci-brand-slot/);
  assert.match(worker,/if \(!canonicalBrand\)/);
  assert.match(worker,/<footer class="footer public-footer">/);
  assert.match(worker,/desktop-primary-nav/);
});

test('SANCI global logo media exception is restricted to approved ID and canonical site',()=>{
  assert.match(media,/siteId === DEFAULT_SITE_ID && normalizedAssetId === "67045b51-9df7-45b0-a426-6b015ab985f1"/);
  assert.match(media,/row\.mime_type === "image\/png"/);
  assert.match(media,/documentAssetReferences\(page\.published_content_json/);
});

test('private drafts use authenticated media without making all images public',()=>{
  assert.match(renderer,/previewMedia/);
  assert.match(renderer,/legacyImageSource\(p,\{editor:previewMedia\}\)/);
  assert.match(renderer,/backgroundImageValue\(values,\{legacyBackground:legacyRoot,editor:previewMedia\}\)/);
  assert.match(renderer,/sanciEditorialVersion===1/);
  assert.match(css,/body\.sanci-editorial-page\[data-sanci-shell="1"\] \.content-hero\{display:none\}/);
});

test('navigational focus, keyboard menu and reduced motion are preserved',()=>{
  assert.match(js,/markActiveNavigation\(\)/);
  assert.match(js,/e\.key==='Escape'/);
  assert.match(css,/desktop-primary-nav a:focus-visible/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});
