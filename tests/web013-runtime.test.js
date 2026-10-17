import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import worker from '../src/index.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

const origin = 'https://example.test';
const shell = '<!doctype html><html><head><meta name="robots" content="index,follow"><title>Sanci9517</title></head><body>Public shell</body></html>';
const document = (id, nodes = {}) => JSON.stringify({
  type: 'sanci-page-document', schemaVersion: 1, activePageId: id,
  pages: { [id]: { id, rootId: 'root', nodes: { root: { id: 'root', type: 'root', children: [], props: {} }, ...nodes } } }
});

async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
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
  const homePublished = document('home', { content: { id: 'content', props: { html: richText } } });
  const homeDraft = document('home', { content: { id: 'content', props: { href: '/p/draft-secret' } } });
  const rows = [
    ['home', 'site-default', 'youtube-draft', 'Draft secret', 'Draft description', homeDraft, homePublished, 1, 'youtube', 'Live & <Now>', 'Published "safe" & useful', null],
    ['target', 'site-default', 'new', 'New', 'New description', document('target'), document('target'), 1, 'new', 'New', 'New description', null],
    ['draft', 'site-default', 'draft-only', 'Draft', 'Draft', document('draft'), null, 0, null, null, null, null],
    ['archived', 'site-default', 'archived', 'Archived', 'Archived', document('archived'), document('archived'), 1, 'archived', 'Archived', 'Archived', '2026-10-01'],
    ['foreign', 'other-site', 'foreign', 'Foreign', 'Foreign', document('foreign'), document('foreign'), 1, 'foreign', 'Foreign', 'Foreign', null]
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
    { id: 'archive', type: 'page', pageId: 'archived', label: 'Archive' }
  ] }));
  const env = {
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
  return { db, fetch };
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

test('authenticated link report checks published rich text, redirects and site-scoped navigation', async t => {
  const { fetch } = await fixture(t);
  assert.equal((await fetch('/api/admin/link-report')).status, 401);
  assert.equal((await fetch('/api/admin/link-report', 'viewer')).status, 403);
  const response = await fetch('/api/admin/link-report', 'editor');
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Cache-Control'), /no-store/);
  assert.equal(body.data.checkedContentLinks, 3);
  assert.deepEqual(body.data.contentFindings.map(item => item.href), ['/p/missing']);
  assert.deepEqual(body.data.redirectedContentLinks.map(item => [item.href, item.targetPageId]), [['/p/old', 'target']]);
  assert.deepEqual(body.data.findings.map(item => [item.itemId, item.reason]), [
    ['gone', 'PAGE_NOT_FOUND'], ['other', 'PAGE_NOT_FOUND'], ['hidden', 'PAGE_NOT_PUBLISHED'], ['archive', 'PAGE_ARCHIVED']
  ]);
  assert.equal(body.data.missingPublishedContentPages, 0);
  assert.equal(body.data.unparseablePublishedPages, 0);
  assert.equal(body.data.unsupportedPublishedDocuments, 0);
});
