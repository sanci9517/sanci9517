import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import worker from '../src/index.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';
import { resolvePublishedPageRedirect } from '../src/core/page-redirects.ts';
import { publicPagesRoute } from '../src/routes/public/pages.ts';
import { publicNavigationRoute } from '../src/routes/public/navigation.ts';
import { sitemapRoute } from '../src/routes/public/seo.ts';

const origin = 'https://example.test';
const shell = readFileSync(new URL('../public/visual-page.html', import.meta.url), 'utf8');
const document = (id, nodes = {}) => JSON.stringify({
  type: 'sanci-page-document', schemaVersion: 1, activePageId: id,
  pages: { [id]: { id, rootId: 'root', nodes: { root: { id: 'root', type: 'root', children: [], props: {} }, ...nodes } } }
});

async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    CREATE TABLE sites(id TEXT PRIMARY KEY,name TEXT,status TEXT);
    INSERT INTO sites VALUES ('site-default','Sanci9517','active'),('other-site','Other site','active');
    CREATE TABLE site_domains(hostname TEXT PRIMARY KEY,site_id TEXT,status TEXT,verified_at TEXT);
    INSERT INTO site_domains VALUES ('example.test','site-default','verified','2026-10-17'),('other.example.test','other-site','verified','2026-10-17');
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,slug TEXT,title TEXT,description TEXT,
      content_json TEXT,published_content_json TEXT,is_published INTEGER,published_slug TEXT,
      published_title TEXT,published_description TEXT,sort_order INTEGER,updated_at TEXT,published_at TEXT,archived_at TEXT);
    CREATE TABLE site_navigation(site_id TEXT PRIMARY KEY,published_json TEXT);
    CREATE TABLE page_slug_redirects(site_id TEXT,from_slug TEXT,page_id TEXT);
  `);
  for (const role of ['editor', 'viewer']) {
    db.prepare('INSERT INTO users VALUES (?,?,?,?,1)').run(role, `${role}@example.test`, role, role);
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(await hashSessionToken(role), role, '2999-01-01');
  }
  const richText = '<a href="/p/new?from=page&amp;source=web">Current</a>' +
    '<a href="/p/old">Old alias</a><a class="cta" href="/p/missing">Broken</a>' +
    '<a data-href="/p/ghost">No real link</a>';
  const structuredRichText = { type: 'richtext-document', schemaVersion: 1, blocks: [
    { type: 'paragraph', children: [
      { type: 'text', text: 'Current', marks: [], link: { href: 'https://example.test/p/new?from=richtext' } },
      { type: 'text', text: 'Missing', marks: [], link: { href: '/p/missing-rich' } },
      { type: 'text', text: 'Foreign', marks: [], link: { href: 'https://other.example.test/p/foreign' } }
    ] },
    { type: 'bulleted-list', items: [[
      { type: 'text', text: 'Old', marks: [], link: { href: '/p/old' } }
    ]] },
    { type: 'table', rows: [{cells:[{header:true,children:[{type:'text',text:'Reference',marks:[]}]},{header:false,children:[{type:'text',text:'Missing table link',marks:[],link:{href:'/p/missing-table'}}]}]}] }
  ] };
  const homePublished = document('home', {
    content: { id: 'content', props: { html: richText, url: 'https://example.test/p/foreign' } },
    structured: { id: 'structured', type: 'richtext', props: { richText: structuredRichText } }
  });
  const homeDraft = document('home', { content: { id: 'content', props: { href: '/p/draft-secret' } } });
  const rows = [
    ['home', 'site-default', 'youtube-draft', 'Draft secret', 'Draft description', homeDraft, homePublished, 1, 'youtube', 'Live & <Now>', 'Published "safe" & useful', null],
    ['target', 'site-default', 'new', 'New', 'New description', document('target'), document('target'), 1, 'new', 'New', 'New description', null],
    ['draft', 'site-default', 'draft-only', 'Draft', 'Draft', document('draft'), null, 0, null, null, null, null],
    ['archived', 'site-default', 'archived', 'Archived', 'Archived', document('archived'), document('archived'), 1, 'archived', 'Archived', 'Archived', '2026-10-01'],
    ['foreign', 'other-site', 'foreign', 'Foreign', 'Foreign', document('foreign'), document('foreign'), 1, 'foreign', 'Foreign', 'Foreign', null],
    ['overlap', 'other-site', 'youtube', 'Other YouTube', 'Other', document('overlap'), document('overlap'), 1, 'youtube', 'Other YouTube', 'Other', null]
  ];
  const insert = db.prepare(`INSERT INTO pages(id,site_id,slug,title,description,content_json,published_content_json,
    is_published,published_slug,published_title,published_description,archived_at,sort_order,updated_at,published_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,'2026-10-17','2026-10-17')`);
  for (const row of rows) insert.run(...row);
  db.prepare('INSERT INTO page_slug_redirects VALUES (?,?,?)').run('site-default', 'old', 'target');
  db.prepare('INSERT INTO page_slug_redirects VALUES (?,?,?)').run('other-site', 'foreign-old', 'foreign');
  db.prepare('INSERT INTO site_navigation VALUES (?,?)').run('site-default', JSON.stringify({ schemaVersion: 1, items: [
    { id: 'good', type: 'page', pageId: 'home', label: 'Home' },
    { id: 'gone', type: 'page', pageId: 'absent', label: 'Gone' },
    { id: 'other', type: 'page', pageId: 'foreign', label: 'Foreign' },
    { id: 'hidden', type: 'page', pageId: 'draft', label: 'Draft' },
    { id: 'archive', type: 'page', pageId: 'archived', label: 'Archive' },
    { id: 'old-url', type: 'external', url: 'https://example.test/p/old', label: 'Old URL' },
    { id: 'foreign-url', type: 'external', url: 'https://example.test/p/foreign-old', label: 'Foreign alias' },
    { id: 'outside', type: 'external', url: 'https://other.example.test/p/ghost', label: 'Other site' }
  ] }));
  const env = {
    SITE_HOST_BINDINGS: JSON.stringify({ 'example.test': 'site-default', 'other.example.test': 'other-site' }),
    DB: { prepare(sql) {
      const statement = db.prepare(sql.replace(/\?\d+/g, '?'));
      let values = [];
      return { bind(...args) { values = args; return this; },
        async first() { return statement.get(...values) ?? null; },
        async all() { return { results: statement.all(...values) }; } };
    } },
    ASSETS: { async fetch() { return new Response(shell, { headers: { 'Content-Type': 'text/html' } }); } }
  };
  const fetch = (path, role) => worker.fetch(new Request(origin + path, {
    headers: role ? { Cookie: `sanci9517_session=${role}` } : {}
  }), env, {});
  return { db, env, fetch };
}

test('published HTML exposes only published SEO metadata, escaped for HTML', async t => {
  const { fetch } = await fixture(t);
  const response = await fetch('/p/youtube?source=test');
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /<title>Live &amp; &lt;Now&gt;<\/title>/);
  assert.match(html, /<meta name="description" content="Published &quot;safe&quot; &amp; useful">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/example\.test\/p\/youtube">/);
  assert.match(html, /<meta property="og:title" content="Live &amp; &lt;Now&gt;">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/example\.test\/p\/youtube">/);
  assert.doesNotMatch(html, /Draft secret|youtube-draft|source=test/);
});

test('preview and error HTML are noindex without canonical or social URL', async t => {
  const { fetch } = await fixture(t);
  const preview = await fetch('/p/youtube-draft?preview=1', 'editor');
  const previewHtml = await preview.text();
  assert.equal(preview.status, 200);
  assert.match(previewHtml, /<title>Draft secret<\/title>/);
  assert.match(previewHtml, /<meta name="robots" content="noindex,nofollow">/);
  assert.doesNotMatch(previewHtml, /rel="canonical"|property="og:url"/);
  assert.equal(preview.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  for (const path of ['/p/youtube-draft?preview=1', '/p/missing']) {
    const response = await fetch(path);
    const html = await response.text();
    assert.equal(response.status, path.includes('preview') ? 401 : 404);
    assert.match(html, /noindex,nofollow/);
    assert.doesNotMatch(html, /rel="canonical"|property="og:url"/);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  }
});

test('old published URLs redirect once; sitemap and robots exclude draft, archive and foreign pages', async t => {
  const { fetch } = await fixture(t);
  const redirect = await fetch('/p/old?ref=bookmark');
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('Location'), '/p/new?ref=bookmark');
  assert.equal((await fetch('/p/foreign-old')).status, 404, 'another site’s alias must never redirect here');
  const sitemap = await fetch('/sitemap.xml');
  const xml = await sitemap.text();
  assert.equal(sitemap.status, 200);
  assert.match(xml, /https:\/\/example\.test\/p\/youtube/);
  assert.match(xml, /https:\/\/example\.test\/p\/new/);
  assert.doesNotMatch(xml, /draft-only|archived|foreign|\/p\/old/);
  const robots = await fetch('/robots.txt');
  assert.match(await robots.text(), /Disallow: \/admin\nDisallow: \/api\/\nSitemap: https:\/\/example\.test\/sitemap\.xml/);
});

test('sitemap includes published pages beyond the former 1000-page cutoff', async t => {
  const { db, fetch } = await fixture(t);
  const insert = db.prepare(`INSERT INTO pages(id,site_id,slug,title,description,content_json,published_content_json,
    is_published,published_slug,published_title,published_description,archived_at,sort_order,updated_at,published_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,'2026-10-17','2026-10-17')`);
  for (let i = 0; i < 1001; i++) {
    const slug = `extra-${String(i).padStart(4, '0')}`;
    insert.run(slug, 'site-default', slug, slug, '', '{}', '{}', 1, slug, slug, '', null);
  }
  const response = await fetch('/sitemap.xml');
  const xml = await response.text();
  assert.equal(response.status, 200);
  assert.match(xml, /\/p\/extra-0000<\/loc>/);
  assert.match(xml, /\/p\/extra-1000<\/loc>/);
  assert.equal((xml.match(/<url>/g) || []).length, 1004);
});

test('public URL services keep explicit site identities separate', async t => {
  const { db, env, fetch } = await fixture(t);
  assert.equal((await fetch('/p/foreign')).status, 404);
  assert.equal(await resolvePublishedPageRedirect(env, 'foreign-old'), null);
  assert.equal(await resolvePublishedPageRedirect(env, 'foreign-old', 'other-site'), 'foreign');
  const foreignPage = await publicPagesRoute(new Request(origin + '/api/public/pages?slug=foreign'), env, 'other-site');
  assert.equal(foreignPage.status, 200);
  assert.equal((await foreignPage.json()).data.title, 'Foreign');
  const foreignSitemap = await sitemapRoute(new Request(origin + '/sitemap.xml'), env, 'other-site');
  const xml = await foreignSitemap.text();
  assert.match(xml, /\/p\/foreign<\/loc>/);
  assert.doesNotMatch(xml, /\/p\/new/);
  db.prepare('INSERT INTO site_navigation VALUES (?,?)').run('other-site', JSON.stringify({ schemaVersion: 1, items: [
    { id: 'foreign-nav', type: 'page', pageId: 'foreign', label: 'Foreign', children: [] }
  ] }));
  const navigation = await publicNavigationRoute(env, 'other-site');
  assert.equal((await navigation.json()).data.items[0].href, '/p/foreign');
});

test('Worker serves only verified host/site pairs and isolates overlapping public slugs', async t => {
  const { db, env, fetch } = await fixture(t);
  const bootstrapEnv = { ...env, SITE_HOST_BINDINGS: undefined };
  assert.equal((await worker.fetch(new Request('https://sanci9517-streamer-brand.sandor-bogadi95.workers.dev/p/youtube'), bootstrapEnv, {})).status, 200,
    'current Worker hostname keeps the existing single-site route before the pending migration');
  const attemptedBootstrapRemap = { ...env, SITE_HOST_BINDINGS: JSON.stringify({ 'sanci9517-streamer-brand.sandor-bogadi95.workers.dev': 'other-site' }) };
  assert.match(await (await worker.fetch(new Request('https://sanci9517-streamer-brand.sandor-bogadi95.workers.dev/p/youtube'), attemptedBootstrapRemap, {})).text(),
    /Live &amp; &lt;Now&gt;/, 'bootstrap hostname cannot be reassigned by a binding');
  assert.match(await (await fetch('/p/youtube')).text(), /Live &amp; &lt;Now&gt;/);
  const foreign = await worker.fetch(new Request('https://other.example.test/p/youtube'), env, {});
  assert.equal(foreign.status, 200);
  assert.match(await foreign.text(), /Other YouTube/);
  const foreignAlias = await worker.fetch(new Request('https://other.example.test/p/foreign-old'), env, {});
  assert.equal(foreignAlias.status, 308);
  assert.equal(foreignAlias.headers.get('Location'), '/p/foreign');
  const settings = await worker.fetch(new Request('https://other.example.test/api/public/site-settings'), env, {});
  assert.equal((await settings.json()).siteName, 'Other site');
  assert.equal((await worker.fetch(new Request('https://other.example.test/api/admin/pages'), env, {})).status, 403);
  assert.equal((await worker.fetch(new Request('https://other.example.test/p/youtube?preview=1', { headers: { Cookie: 'sanci9517_session=editor' } }), env, {})).status, 403);
  assert.equal((await worker.fetch(new Request('https://other.example.test/api/public/pages?slug=youtube&preview=1', { headers: { Cookie: 'sanci9517_session=editor' } }), env, {})).status, 403);
  assert.equal((await worker.fetch(new Request('https://unknown.example.test/p/youtube', { headers: { 'X-Forwarded-Host': 'example.test' } }), env, {})).status, 421);
  const wrongBinding = { ...env, SITE_HOST_BINDINGS: JSON.stringify({ 'other.example.test': 'site-default' }) };
  assert.equal((await worker.fetch(new Request('https://other.example.test/p/youtube'), wrongBinding, {})).status, 421);
  db.prepare("UPDATE site_domains SET status='revoked' WHERE hostname='other.example.test'").run();
  assert.equal((await worker.fetch(new Request('https://other.example.test/p/youtube'), env, {})).status, 421);
  db.prepare("UPDATE site_domains SET status='verified',verified_at=NULL WHERE hostname='other.example.test'").run();
  assert.equal((await worker.fetch(new Request('https://other.example.test/p/youtube'), env, {})).status, 421);
  db.prepare("UPDATE site_domains SET verified_at='2026-10-17'").run();
  db.prepare("UPDATE sites SET status='archived' WHERE id='other-site'").run();
  assert.equal((await worker.fetch(new Request('https://other.example.test/p/youtube'), env, {})).status, 421);
});

test('authenticated link report checks published rich text, redirects and site-scoped navigation', async t => {
  const { fetch } = await fixture(t);
  assert.equal((await fetch('/api/admin/link-report')).status, 401);
  assert.equal((await fetch('/api/admin/link-report', 'viewer')).status, 403);
  const response = await fetch('/api/admin/link-report', 'editor');
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Cache-Control'), /no-store/);
  assert.equal(body.data.checkedContentLinks, 8);
  assert.deepEqual(body.data.contentFindings.map(item => item.href), ['https://example.test/p/foreign', '/p/missing', '/p/missing-rich', '/p/missing-table']);
  assert.deepEqual(body.data.redirectedContentLinks.map(item => [item.href, item.targetPageId]), [['/p/old', 'target'], ['/p/old', 'target']]);
  assert.deepEqual(body.data.navigationUrlFindings.map(item => [item.itemId, item.href]), [['foreign-url', 'https://example.test/p/foreign-old']]);
  assert.deepEqual(body.data.redirectedNavigationLinks.map(item => [item.itemId, item.targetPageId]), [['old-url', 'target']]);
  assert.deepEqual(body.data.findings.map(item => [item.itemId, item.reason]), [
    ['gone', 'PAGE_NOT_FOUND'], ['other', 'PAGE_NOT_FOUND'], ['hidden', 'PAGE_NOT_PUBLISHED'], ['archive', 'PAGE_ARCHIVED']
  ]);
  assert.equal(body.data.missingPublishedContentPages, 0);
  assert.equal(body.data.unparseablePublishedPages, 0);
  assert.equal(body.data.unsupportedPublishedDocuments, 0);
});
