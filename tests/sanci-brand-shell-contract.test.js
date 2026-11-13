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
  // Channel-specific external URLs now live in the published Editor pages,
  // not in three repeated footer/menu lists.
  assert.ok(shell.includes('mailto:sandor.bogadi95@gmail.com'));
  assert.ok(js.includes("twitch:'<path"));
  assert.ok(js.includes("youtube:'<path"));
  assert.ok(js.includes("tiktok:'<path"));
  assert.ok(js.includes("discord:'<path"));
  for(const href of ['/p/twitch','/p/youtube','/p/tiktok','/p/schedule','/p/community','/p/about','/p/contact']){
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

test('mobile footer does not concatenate copyright and tagline or strand the third column',()=>{
  assert.match(css,/Mobile footer repair/);
  assert.match(css,/max-width:480px/);
  assert.match(css,/public-footer-bottom\{display:flex;flex-direction:column/);
  assert.match(shell,/data-admin-shortcut hidden/);
  assert.match(js,/revealSignedInAdmin\(\)/);
  assert.match(js,/result\.data\?\.authenticated===true/);
});

test('SANCI branded page grid cannot retain three columns on phones or tablets',()=>{
  // The page HTML provides a weaker mobile 1fr rule; the canonical brand rule
  // previously had higher specificity and collapsed the middle grid track.
  assert.match(css,/body\[data-sanci-shell="1"\] \.public-page-layout\{grid-template-columns:minmax\(0,1fr\) minmax\(0,1320px\) minmax\(0,1fr\)\}/);
  assert.match(css,/@media\(max-width:1360px\)\{[\s\S]*?body\[data-sanci-shell="1"\] \.public-page-layout\{display:block;grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(css,/@media\(max-width:700px\)\{[\s\S]*?body\[data-sanci-shell="1"\] \.public-page-layout>\.content-page\{width:calc\(100% - 24px\)\}/);
  assert.match(shell,/site\.css\?v=20261113-sanci-nav-v6/);
});


test('retired video hub is no longer linked by the public shell',()=>{
  assert.equal(shell.includes('href="/p/videok"'),false);
  assert.equal(shell.includes('href="/p/alkotasok"'),false);
  assert.ok(worker.includes('"/p/videok": "/p/youtube"'));
  assert.ok(worker.includes('"/p/alkotasok": "/p/about"'));
});
test('navigation icons use real platform vector silhouettes rather than emoji placeholders',()=>{
  assert.match(js,/home:'<path/);
  for(const key of ['twitch','youtube','tiktok','discord'])assert.ok(js.includes(key+":'<path"),key);
  assert.ok(js.includes("menu-nav-icon-'+identity.name"),'dynamic icon wrapper');
  assert.match(js,/enhanceStaticNavigationIcons\(\)/);
  assert.match(css,/menu-nav-icon-youtube \.icon/);
  assert.match(css,/menu-nav-icon-tiktok \.icon/);
  assert.match(css,/menu-nav-icon-discord \.icon/);
});
