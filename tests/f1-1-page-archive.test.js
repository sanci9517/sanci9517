import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { adminPagesRoute } from '../src/routes/admin/pages.ts';
import { adminEditorRoute } from '../src/routes/admin/editor.ts';
import { publicPagesRoute } from '../src/routes/public/pages.ts';
import { adminNavigationRoute } from '../src/routes/admin/navigation.ts';
import { publicNavigationRoute } from '../src/routes/public/navigation.ts';
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
    CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,created_by TEXT,note TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
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
  db.exec('ALTER TABLE site_navigation ADD COLUMN updated_at TEXT');
  db.exec(readFileSync(new URL('../migrations/0022_page_archive.sql',import.meta.url),'utf8'));
  db.exec(readFileSync(new URL('../migrations/0023_page_hierarchy.sql',import.meta.url),'utf8'));
  db.exec(readFileSync(new URL('../migrations/0024_page_slug_redirects.sql',import.meta.url),'utf8'));
  const DB = {
    beforeBatch:null,
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
      const hook=this.beforeBatch;this.beforeBatch=null;if(hook)await hook();
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
  const req=(path,method='GET',body,token='editor-token')=>new Request('https://example.test'+path,{method,headers:{Cookie:`sanci9517_session=${token}`,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const action=(action,id='source-page',token='editor-token')=>adminPagesRoute(req('/api/admin/pages','PATCH',{id,action},token),{DB});
  const list=(archived=false)=>adminPagesRoute(req('/api/admin/pages'+(archived?'?archived=1&meta=1':'')),{DB});
  const clearNav=()=>db.prepare('UPDATE site_navigation SET draft_json=?,published_json=?').run('{"schemaVersion":1,"items":[]}','{"schemaVersion":1,"items":[]}');
  await duplicate({sourcePageId:'source-page',title:'Second',slug:'second'});
  return {db,DB,req,action,list,clearNav,duplicate,document};
}


test('archive hides public/preview/editor data, preserves draft/revisions, restore stays unpublished until explicit publish',async t=>{
 const f=await fixture(t);f.clearNav();
 const before=f.db.prepare('SELECT content_json FROM pages WHERE id=?').get('source-page');
 const revisionCount=f.db.prepare('SELECT COUNT(*) n FROM editor_revisions').get().n;
 assert.equal((await f.action('archive')).status,200);
 const stored=f.db.prepare('SELECT * FROM pages WHERE id=?').get('source-page');
 assert.ok(stored.archived_at);assert.equal(stored.content_json,before.content_json);
 for(const key of ['published_content_json','published_revision_id','published_slug','published_title','published_description','published_at'])assert.equal(stored[key],null,key);
 assert.equal(stored.is_published,0);
 assert.equal(f.db.prepare('SELECT COUNT(*) n FROM editor_revisions').get().n,revisionCount);
 assert.ok(!(await (await f.list()).json()).data.some(p=>p.id==='source-page'));
 assert.equal((await (await f.list(true)).json()).data[0].id,'source-page');
 for(const query of ['?slug=youtube','?slug=youtube&preview=1'])assert.equal((await publicPagesRoute(f.req('/api/public/pages'+query),{DB:f.DB})).status,404);
 for(const method of ['GET','POST','PUT']){
  const response=await adminEditorRoute(f.req('/api/admin/editor?pageId=source-page',method,method==='GET'?undefined:{pageId:'source-page',document:f.document,expectedVersion:0,version:1,publish:true}),{DB:f.DB});
  assert.equal(response.status,404);
 }
 const active=(await (await f.list()).json()).data;assert.deepEqual(active.map(p=>p.sortOrder),[0]);
 assert.equal((await f.action('restore')).status,200);
 const restored=f.db.prepare('SELECT * FROM pages WHERE id=?').get('source-page');assert.equal(restored.archived_at,null);assert.equal(restored.is_published,0);assert.equal(restored.published_content_json,null);assert.equal(restored.content_json,before.content_json);
 assert.equal((await publicPagesRoute(f.req('/api/public/pages?slug=youtube'),{DB:f.DB})).status,404);
 assert.equal((await adminEditorRoute(f.req('/api/admin/editor?pageId=source-page','POST',{pageId:'source-page',document:f.document,expectedVersion:0,publish:true}),{DB:f.DB})).status,200);
 assert.equal((await publicPagesRoute(f.req('/api/public/pages?slug=youtube'),{DB:f.DB})).status,200);
 assert.deepEqual(f.db.prepare("SELECT action FROM audit_log WHERE action IN ('page.archive','page.restore') ORDER BY rowid").all().map(x=>x.action),['page.archive','page.restore']);
});

test('both nested draft and published navigation references block archive atomically',async t=>{
 const f=await fixture(t);
 const tree=JSON.stringify({schemaVersion:1,items:[{id:'external',type:'external',url:'https://example.test',label:'Menu',children:[{id:'nested',type:'page',pageId:'source-page',children:[]}]}]});
 const empty='{"schemaVersion":1,"items":[]}';
 for(const [draft,live] of [[tree,empty],[empty,tree]]){
  f.db.prepare('UPDATE site_navigation SET draft_json=?,published_json=?').run(draft,live);
  const response=await f.action('archive');assert.equal(response.status,409);assert.equal((await response.json()).error.code,'PAGE_IN_USE');
  assert.equal(f.db.prepare('SELECT is_published FROM pages WHERE id=?').get('source-page').is_published,1);
 }
 assert.equal(f.db.prepare("SELECT COUNT(*) n FROM audit_log WHERE action='page.archive'").get().n,0);
});

test('archive/restore authorization, site isolation, unknown action, last active page and idempotence',async t=>{
 const f=await fixture(t);f.clearNav();
 f.db.exec("INSERT INTO users VALUES('viewer','viewer@example.test','Viewer','viewer',1)");
 f.db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(await hashSessionToken('viewer'),'viewer','2999-01-01');
 assert.equal((await f.action('archive','source-page','')).status,401);
 assert.equal((await f.action('archive','source-page','viewer')).status,403);
 assert.equal((await f.action('archive','foreign-page')).status,404);
 assert.equal((await f.action('restore','missing')).status,404);
 assert.equal((await f.action('typo')).status,400);
 assert.equal((await f.action('archive')).status,200);
 const repeat=await f.action('archive');assert.equal((await repeat.json()).data.changed,false);
 const second=f.db.prepare("SELECT id FROM pages WHERE site_id='site-default' AND archived_at IS NULL").get().id;
 const last=await f.action('archive',second);assert.equal(last.status,409);assert.equal((await last.json()).error.code,'LAST_PAGE');
 assert.equal((await f.action('restore')).status,200);assert.equal((await (await f.action('restore')).json()).data.changed,false);
 assert.equal(f.db.prepare("SELECT COUNT(*) n FROM audit_log WHERE action='page.archive'").get().n,1);
});

test('archive and audit failure roll back publication and ordering together',async t=>{
 const f=await fixture(t);f.clearNav();
 f.db.exec("CREATE TRIGGER fail_archive_audit BEFORE INSERT ON audit_log WHEN NEW.action='page.archive' BEGIN SELECT RAISE(ABORT,'audit unavailable'); END");
 await assert.rejects(()=>f.action('archive'),/audit unavailable/);
 assert.equal(f.db.prepare('SELECT archived_at FROM pages WHERE id=?').get('source-page').archived_at,null);
 assert.equal(f.db.prepare('SELECT is_published FROM pages WHERE id=?').get('source-page').is_published,1);
 assert.deepEqual(f.db.prepare("SELECT sort_order FROM pages WHERE site_id='site-default' ORDER BY sort_order").all().map(p=>p.sort_order),[0,1]);
});

test('archive racing navigation save is rejected by the database and cannot leave a dangling menu',async t=>{
 const f=await fixture(t);f.clearNav();
 const tree={schemaVersion:1,items:[{id:'target',type:'page',pageId:'source-page',children:[]}]};
 f.DB.beforeBatch=async()=>{assert.equal((await f.action('archive')).status,200)};
 const response=await adminNavigationRoute(f.req('/api/admin/navigation','PUT',{tree,expectedRevision:1}),{DB:f.DB});
 assert.equal(response.status,409);assert.equal((await response.json()).error.code,'NAVIGATION_TARGET_ARCHIVED');
 assert.deepEqual(JSON.parse(f.db.prepare('SELECT draft_json FROM site_navigation').get().draft_json).items,[]);
 assert.equal(f.db.prepare("SELECT COUNT(*) n FROM audit_log WHERE action='navigation.update'").get().n,0);
 // Direct SQL insert is protected too.
 f.db.exec("DELETE FROM site_navigation WHERE site_id='site-default'");
 assert.throws(()=>f.db.prepare('INSERT INTO site_navigation(site_id,draft_json,published_json,revision,published_revision) VALUES(?,?,?,?,?)').run('site-default',JSON.stringify(tree),JSON.stringify(tree),1,1),/NAVIGATION_TARGET_ARCHIVED/);
});

test('archive racing explicit publish rolls back the stale revision and publish audit',async t=>{
 const f=await fixture(t);f.clearNav();
 f.DB.beforeBatch=async()=>{assert.equal((await f.action('archive')).status,200)};
 const response=await adminEditorRoute(f.req('/api/admin/editor?pageId=source-page','POST',{pageId:'source-page',document:f.document,expectedVersion:0,publish:true}),{DB:f.DB});
 assert.equal(response.status,409);assert.equal((await response.json()).error.code,'PAGE_ARCHIVED');
 assert.equal(f.db.prepare("SELECT COUNT(*) n FROM editor_revisions WHERE page_id='source-page'").get().n,0);
 assert.equal(f.db.prepare("SELECT COUNT(*) n FROM audit_log WHERE action='page.publish'").get().n,0);
 const row=f.db.prepare("SELECT is_published,published_content_json FROM pages WHERE id='source-page'").get();assert.equal(row.is_published,0);assert.equal(row.published_content_json,null);
 assert.throws(()=>f.db.exec("UPDATE pages SET is_published=1 WHERE id='source-page'"),/PAGE_ARCHIVED/);
});

test('archived pages are not offered as navigation targets and cannot be newly linked or duplicated',async t=>{
 const f=await fixture(t);f.clearNav();await f.action('archive');
 const response=await adminNavigationRoute(f.req('/api/admin/navigation'),{DB:f.DB});assert.equal(response.status,200);
 assert.ok(!(await response.json()).data.pages.some(p=>p.id==='source-page'));
 const tree={schemaVersion:1,items:[{id:'archived',type:'page',pageId:'source-page',children:[]}]};
 assert.equal((await adminNavigationRoute(f.req('/api/admin/navigation','PUT',{tree,expectedRevision:1}),{DB:f.DB})).status,400);
 assert.equal((await f.duplicate({sourcePageId:'source-page',title:'No',slug:'no'})).status,404);
 assert.equal((await publicNavigationRoute({DB:f.DB})).status,200);
});

test('a concurrent archive cannot compact the active ordering twice or emit a duplicate audit',async t=>{
 const f=await fixture(t);f.clearNav();
 f.DB.beforeBatch=async()=>{assert.equal((await f.action('archive')).status,200)};
 assert.equal((await f.action('archive')).status,409);
 assert.deepEqual(f.db.prepare("SELECT sort_order FROM pages WHERE site_id='site-default' AND archived_at IS NULL").all().map(p=>p.sort_order),[0]);
 assert.equal(f.db.prepare("SELECT COUNT(*) n FROM audit_log WHERE action='page.archive'").get().n,1);
});

test('restore audit failure leaves the page archived and its reserved slug intact',async t=>{
 const f=await fixture(t);f.clearNav();await f.action('archive');
 f.db.exec("CREATE TRIGGER fail_restore_audit BEFORE INSERT ON audit_log WHEN NEW.action='page.restore' BEGIN SELECT RAISE(ABORT,'restore audit unavailable'); END");
 await assert.rejects(()=>f.action('restore'),/restore audit unavailable/);
 assert.ok(f.db.prepare("SELECT archived_at FROM pages WHERE id='source-page'").get().archived_at);
 const second=f.db.prepare("SELECT id FROM pages WHERE site_id='site-default' AND archived_at IS NULL").get().id;
 assert.equal((await f.duplicate({sourcePageId:second,title:'Collision',slug:'youtube'})).status,409);
});

test('WEB-002 draft hierarchy rejects foreign, missing, self and cyclic parents without changing LIVE routes',async t=>{
 const f=await fixture(t);f.clearNav();
 const second=f.db.prepare("SELECT id,content_json FROM pages WHERE slug='second'").get();
 const setParent=(id,parentPageId,expectedParentPageId=null)=>adminPagesRoute(f.req('/api/admin/pages','PATCH',{action:'setParent',id,parentPageId,expectedParentPageId}),{DB:f.DB});
 for(const parent of ['foreign-page','missing-page',second.id]){
  const response=await setParent(second.id,parent);
  assert.equal(response.status,409,parent);
 }
 assert.equal((await setParent(second.id,'source-page')).status,200);
 assert.equal((await setParent('source-page',second.id)).status,409);
 assert.equal((await setParent(second.id,null)).status,409,'stale expected parent must fail');
 const draft=(await (await f.list()).json()).data.find(p=>p.id===second.id);
 assert.equal(draft.parentPageId,'source-page');assert.equal(draft.publishedParentPageId,null);
 assert.equal(f.db.prepare('SELECT published_parent_page_id FROM pages WHERE id=?').get(second.id).published_parent_page_id,null);
 assert.equal((await publicPagesRoute(f.req('/api/public/pages?slug=second'),{DB:f.DB})).status,404);
 assert.equal((await publicPagesRoute(f.req('/api/public/pages?slug=youtube'),{DB:f.DB})).status,200);
 assert.equal((await setParent(second.id,null,'source-page')).status,200);
 assert.equal(f.db.prepare('SELECT parent_page_id FROM pages WHERE id=?').get(second.id).parent_page_id,null);
});

test('WEB-002 explicit publish snapshots hierarchy; parent lifecycle guards protect active and LIVE children',async t=>{
 const f=await fixture(t);f.clearNav();
 const child=f.db.prepare("SELECT id,content_json FROM pages WHERE slug='second'").get();
 const setParent=(id,parentPageId,expectedParentPageId=null)=>adminPagesRoute(f.req('/api/admin/pages','PATCH',{action:'setParent',id,parentPageId,expectedParentPageId}),{DB:f.DB});
 assert.equal((await setParent(child.id,'source-page')).status,200);
 assert.equal((await f.action('archive')).status,409,'draft child blocks parent archive');
 assert.equal((await adminEditorRoute(f.req('/api/admin/editor?pageId='+child.id,'POST',{pageId:child.id,document:JSON.parse(child.content_json),expectedVersion:1,expectedParentPageId:null,publish:true}),{DB:f.DB})).status,409,'stale editor must not publish a new parent');
 assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM editor_revisions WHERE page_id=?').get(child.id).n,1);
 assert.equal((await adminEditorRoute(f.req('/api/admin/editor?pageId='+child.id,'POST',{pageId:child.id,document:JSON.parse(child.content_json),expectedVersion:1,expectedParentPageId:'source-page',publish:true}),{DB:f.DB})).status,200);
 assert.equal(f.db.prepare('SELECT published_parent_page_id FROM pages WHERE id=?').get(child.id).published_parent_page_id,'source-page');
 assert.equal((await publicPagesRoute(f.req('/api/public/pages?slug=second'),{DB:f.DB})).status,200);
 assert.equal((await adminEditorRoute(f.req('/api/admin/editor?pageId=source-page','POST',{pageId:'source-page',action:'unpublish'}),{DB:f.DB})).status,409);
 assert.equal((await adminPagesRoute(f.req('/api/admin/pages','DELETE',{id:'source-page'}),{DB:f.DB})).status,409);
 assert.equal((await setParent(child.id,null,'source-page')).status,200);
 assert.equal(f.db.prepare('SELECT published_parent_page_id FROM pages WHERE id=?').get(child.id).published_parent_page_id,'source-page','draft reparent must not change LIVE snapshot');
 assert.equal((await setParent('source-page',child.id)).status,200);
 assert.equal((await adminEditorRoute(f.req('/api/admin/editor?pageId=source-page','POST',{pageId:'source-page',document:f.document,expectedVersion:0,expectedParentPageId:child.id,publish:true}),{DB:f.DB})).status,409,'published hierarchy cycle must fail atomically');
 assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM editor_revisions WHERE page_id=?').get('source-page').n,0);
 assert.equal((await setParent('source-page',null,child.id)).status,200);
 assert.equal((await f.action('archive')).status,409,'published child still blocks archive');
 assert.equal((await adminEditorRoute(f.req('/api/admin/editor?pageId='+child.id,'POST',{pageId:child.id,document:JSON.parse(child.content_json),expectedVersion:2,expectedParentPageId:null,publish:true}),{DB:f.DB})).status,200);
 assert.equal(f.db.prepare('SELECT published_parent_page_id FROM pages WHERE id=?').get(child.id).published_parent_page_id,null);
 assert.equal((await adminEditorRoute(f.req('/api/admin/editor?pageId=source-page','POST',{pageId:'source-page',action:'unpublish'}),{DB:f.DB})).status,200);
 assert.equal((await publicPagesRoute(f.req('/api/public/pages?slug=second'),{DB:f.DB})).status,200);
});

test('WEB-002 publishing a child requires an active published parent and leaves revision atomic on failure',async t=>{
 const f=await fixture(t);f.clearNav();
 const child=f.db.prepare("SELECT id,content_json FROM pages WHERE slug='second'").get();
 const setParent=(id,parentPageId)=>adminPagesRoute(f.req('/api/admin/pages','PATCH',{action:'setParent',id,parentPageId,expectedParentPageId:null}),{DB:f.DB});
 assert.equal((await adminEditorRoute(f.req('/api/admin/editor?pageId=source-page','POST',{pageId:'source-page',action:'unpublish'}),{DB:f.DB})).status,200);
 assert.equal((await setParent(child.id,'source-page')).status,200);
 const before=f.db.prepare('SELECT COUNT(*) AS n FROM editor_revisions WHERE page_id=?').get(child.id).n;
 const response=await adminEditorRoute(f.req('/api/admin/editor?pageId='+child.id,'POST',{pageId:child.id,document:JSON.parse(child.content_json),expectedVersion:1,expectedParentPageId:'source-page',publish:true}),{DB:f.DB});
 assert.equal(response.status,409);
 assert.equal((await response.json()).error.code,'INVALID_PUBLISHED_PAGE_PARENT');
 assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM editor_revisions WHERE page_id=?').get(child.id).n,before);
 assert.equal(f.db.prepare('SELECT is_published FROM pages WHERE id=?').get(child.id).is_published,0);
});
