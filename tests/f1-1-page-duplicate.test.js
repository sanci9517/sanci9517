import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { adminPagesRoute } from '../src/routes/admin/pages.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    CREATE TABLE sites(id TEXT PRIMARY KEY,slug TEXT NOT NULL UNIQUE,name TEXT NOT NULL);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE pages(
      id TEXT PRIMARY KEY,site_id TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,title TEXT NOT NULL,description TEXT NOT NULL,
      content_json TEXT NOT NULL,published_content_json TEXT,is_published INTEGER NOT NULL,published_revision_id TEXT,
      sort_order INTEGER NOT NULL,published_slug TEXT,published_title TEXT,published_description TEXT,published_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,created_by TEXT,note TEXT);
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
    CREATE TABLE site_navigation(site_id TEXT PRIMARY KEY,draft_json TEXT NOT NULL,published_json TEXT NOT NULL,revision INTEGER NOT NULL,published_revision INTEGER NOT NULL);
    INSERT INTO sites VALUES('site-default','sanci9517','Sanci9517'),('other-site','other','Other');
    INSERT INTO users VALUES('editor','editor@example.test','Editor','editor',1);
  `);
  db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(await hashSessionToken('editor-token'), 'editor', '2999-01-01');
  const document = {
    schemaVersion: 1,
    type: 'sanci-page-document',
    activePageId: 'source-page',
    pages: {
      'source-page': {
        id: 'source-page', name: 'YouTube', slug: 'youtube', status: 'published', revision: 2,
        rootId: 'root-source-page', metadata: { title: 'YouTube', description: 'Channel', canonical: '/p/youtube' },
        settings: { templateId: null, access: 'public', customCode: { head: '', bodyStart: '', bodyEnd: '' } },
        nodes: {
          'root-source-page': { id: 'root-source-page', type: 'root', parentId: null, children: ['hero'], props: {} },
          hero: { id: 'hero', type: 'section', parentId: 'root-source-page', children: ['heading'], props: { text: 'Source content' } },
          heading: { id: 'heading', type: 'heading', parentId: 'hero', children: [], props: { text: 'Channel heading' } }
        }
      }
    }
  };
  db.prepare(`INSERT INTO pages(id,site_id,slug,title,description,content_json,published_content_json,is_published,
    published_revision_id,sort_order,published_slug,published_title,published_description,published_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`).run('source-page','site-default','youtube','YouTube','Channel',JSON.stringify(document),JSON.stringify(document),1,'published-rev',0,'youtube','YouTube','Channel');
  db.prepare('INSERT INTO pages(id,site_id,slug,title,description,content_json,is_published,sort_order) VALUES(?,?,?,?,?,?,?,?)')
    .run('foreign-page','other-site','foreign','Foreign','',JSON.stringify({}),0,0);
  db.prepare('INSERT INTO site_navigation VALUES(?,?,?,?,?)').run('site-default',JSON.stringify({schemaVersion:1,items:[{id:'page:source-page',type:'page',pageId:'source-page',children:[]}]}),JSON.stringify({schemaVersion:1,items:[{id:'page:source-page',type:'page',pageId:'source-page',children:[]}]}),1,1);
  const DB = {
    prepare(sql) {
      const statement = db.prepare(sql.replace(/\?\d+/g, '?'));
      let values = [];
      return {
        bind(...args) { values = [...args]; return this; },
        async first() { return statement.get(...values) ?? null; },
        async all() { return { results: statement.all(...values) }; },
        async run() { return { meta: { changes: Number(statement.run(...values).changes) } }; }
      };
    },
    async batch(statements) {
      db.exec('BEGIN');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        db.exec('COMMIT');
        return results;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    }
  };
  const duplicate = body => adminPagesRoute(new Request('https://example.test/api/admin/pages', {
    method: 'POST',
    headers: { Cookie: 'sanci9517_session=editor-token', 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }), { DB });
  return { db, duplicate, sourceDocument: document };
}

test('page duplication copies the canonical page into a new unpublished draft without adding it to navigation', async t => {
  const f = await fixture(t);
  const sourceBefore = f.db.prepare('SELECT content_json,published_content_json,is_published,published_slug FROM pages WHERE id=?').get('source-page');
  const response = await f.duplicate({ sourcePageId: 'source-page', title: 'YouTube másolata', slug: 'youtube-copy' });
  assert.equal(response.status, 200);
  const payload = (await response.json()).data;
  assert.notEqual(payload.id, 'source-page');
  assert.equal(payload.isPublished, false);
  assert.equal(payload.version, 1);
  const stored = f.db.prepare('SELECT * FROM pages WHERE id=?').get(payload.id);
  assert.equal(stored.site_id, 'site-default');
  assert.equal(stored.is_published, 0);
  assert.equal(stored.published_content_json, null);
  assert.equal(stored.published_slug, null);
  assert.equal(stored.sort_order, 1);
  const copied = JSON.parse(stored.content_json);
  const page = copied.pages[payload.id];
  assert.equal(copied.activePageId, payload.id);
  assert.equal(page.name, 'YouTube másolata');
  assert.equal(page.slug, 'youtube-copy');
  assert.equal(page.status, 'draft');
  assert.equal(page.metadata.canonical, '');
  assert.notEqual(page.rootId, 'root-source-page');
  const copiedIds = new Set(Object.keys(page.nodes));
  assert.equal(copiedIds.has('hero'), false);
  assert.equal(copiedIds.has('heading'), false);
  const sectionId = page.nodes[page.rootId].children[0];
  const headingId = page.nodes[sectionId].children[0];
  assert.equal(page.nodes[sectionId].parentId, page.rootId);
  assert.equal(page.nodes[headingId].parentId, sectionId);
  assert.equal(page.nodes[sectionId].children.length, 1);
  assert.deepEqual(f.db.prepare('SELECT content_json,published_content_json,is_published,published_slug FROM pages WHERE id=?').get('source-page'), sourceBefore);
  const nav = JSON.parse(f.db.prepare('SELECT draft_json FROM site_navigation WHERE site_id=?').get('site-default').draft_json);
  assert.deepEqual(nav.items.map(item => item.pageId), ['source-page']);
  assert.equal(f.db.prepare('SELECT version FROM editor_revisions WHERE page_id=?').get(payload.id).version, 1);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='page.duplicate' AND entity_id=?").get(payload.id).n, 1);
});

test('page duplication is site-scoped and rejects invalid or conflicting slugs without writes', async t => {
  const f = await fixture(t);
  const foreign = await f.duplicate({ sourcePageId: 'foreign-page', title: 'Foreign copy', slug: 'foreign-copy' });
  assert.equal(foreign.status, 404);
  assert.equal((await foreign.json()).error.code, 'PAGE_NOT_FOUND');

  const invalid = await f.duplicate({ sourcePageId: 'source-page', title: 'Copy', slug: 'not a slug' });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).error.code, 'INVALID_PAGE');

  const conflict = await f.duplicate({ sourcePageId: 'source-page', title: 'Copy', slug: 'youtube' });
  assert.equal(conflict.status, 409);
  assert.equal((await conflict.json()).error.code, 'SLUG_EXISTS');
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM pages').get().n, 2);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='page.duplicate'").get().n, 0);
});


test('Editor exposes an accessible duplicate action and blocks copying unsaved source edits', () => {
  const app = readFileSync(new URL('../public/editor-v2/app.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../public/editor-v2/editor.css', import.meta.url), 'utf8');
  assert.match(app, /className='page-duplicate'/);
  assert.match(app, /aria-label','Oldal másolása:/);
  assert.match(app, /sourcePageId:id,title:trimmedTitle,slug:trimmedSlug/);
  assert.match(app, /Először mentsd az aktuális módosításokat/);
  assert.match(css, /\.page-duplicate\{/);
});
