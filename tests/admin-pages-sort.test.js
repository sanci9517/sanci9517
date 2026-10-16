import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { adminPagesRoute } from '../src/routes/admin/pages.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE pages(archived_at TEXT,id TEXT PRIMARY KEY,site_id TEXT,slug TEXT,title TEXT,description TEXT,content_json TEXT,
      published_content_json TEXT,is_published INTEGER,published_revision_id TEXT,sort_order INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER);
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
  `);
  db.exec('ALTER TABLE pages ADD COLUMN parent_page_id TEXT');
  db.exec('ALTER TABLE pages ADD COLUMN published_parent_page_id TEXT');
  db.prepare('INSERT INTO users VALUES (?,?,?,?,1)').run('editor', 'editor@example.test', 'Editor', 'editor');
  db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(await hashSessionToken('editor-token'), 'editor', '2999-01-01');
  const insert = db.prepare(`INSERT INTO pages(id,site_id,slug,title,description,content_json,published_content_json,
    is_published,published_revision_id,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)`);
  for (const [i, id] of ['a', 'b', 'c', 'd'].entries()) {
    const document = { type: 'sanci-page-document', schemaVersion: 1, activePageId: id,
      pages: { [id]: { id, rootId: 'root', nodes: { root: { id: 'root', type: 'root', parentId: null, children: [], props: {} } } } } };
    insert.run(id, 'site-default', id, id.toUpperCase(), '', JSON.stringify(document), null, 0, null, i);
  }
  const foreignDocument = { type: 'sanci-page-document', schemaVersion: 1, activePageId: 'foreign',
    pages: { foreign: { id: 'foreign', rootId: 'root', nodes: { root: { id: 'root', type: 'root', parentId: null, children: [], props: {} } } } } };
  insert.run('foreign', 'other-site', 'foreign', 'Foreign', '', JSON.stringify(foreignDocument), null, 0, null, 0);
  const env = { DB: {
    prepare(sql) {
      const statement = db.prepare(sql.replace(/\?\d+/g, '?'));
      let values = [];
      return { bind(...args) { values = [...args]; return this; },
        async first() { return statement.get(...values) ?? null; },
        async all() { return { results: statement.all(...values) }; },
        run() { return { meta: { changes: Number(statement.run(...values).changes) } }; } };
    },
    async batch(statements) {
      db.exec('BEGIN');
      try { const results = statements.map(statement => statement.run()); db.exec('COMMIT'); return results; }
      catch (error) { db.exec('ROLLBACK'); throw error; }
    }
  } };
  const patch = (body) => adminPagesRoute(new Request('https://example.test/api/admin/pages', {
    method: 'PATCH', headers: { Cookie: 'sanci9517_session=editor-token', 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  }), env);
  const ordered = () => db.prepare('SELECT id,sort_order AS sortOrder FROM pages WHERE site_id=? ORDER BY sort_order,id').all('site-default').map(row => ({ ...row }));
  return { db, patch, ordered };
}

test('page reorder moves to the requested index and keeps every page order contiguous', async t => {
  const f = await fixture(t);
  const response = await f.patch({ id: 'a', sortOrder: 2 });
  assert.equal(response.status, 200);
  assert.deepEqual(f.ordered(), [
    { id: 'b', sortOrder: 0 },
    { id: 'c', sortOrder: 1 },
    { id: 'a', sortOrder: 2 },
    { id: 'd', sortOrder: 3 }
  ]);
  assert.equal((await response.json()).data.sortOrder, 2);
});

test('page reorder rejects indices outside the site page list without mutation', async t => {
  const f = await fixture(t);
  const before = f.ordered();
  const response = await f.patch({ id: 'a', sortOrder: 4 });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, 'INVALID_PAGE_ORDER');
  assert.deepEqual(f.ordered(), before);
});

test('page reorder cannot target a page owned by another site', async t => {
  const f = await fixture(t);
  const response = await f.patch({ id: 'foreign', sortOrder: 0 });
  assert.equal(response.status, 404);
  assert.equal(f.db.prepare('SELECT sort_order FROM pages WHERE id=?').get('foreign').sort_order, 0);
  assert.deepEqual(f.ordered().map(page => page.id), ['a', 'b', 'c', 'd']);
});
