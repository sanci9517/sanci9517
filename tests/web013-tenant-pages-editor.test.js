import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { hashSessionToken } from '../src/core/auth/session.ts';
import { adminPagesRoute } from '../src/routes/admin/pages.ts';
import { adminEditorRoute } from '../src/routes/admin/editor.ts';

async function fixture(t, enabled=true) {
  const db=new DatabaseSync(':memory:');t.after(()=>db.close());
  db.exec(`
    CREATE TABLE sites(id TEXT PRIMARY KEY,status TEXT);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE site_memberships(site_id TEXT,user_id TEXT,role TEXT,status TEXT,PRIMARY KEY(site_id,user_id));
    CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,slug TEXT,title TEXT,description TEXT,content_json TEXT,
      published_content_json TEXT,published_revision_id TEXT,is_published INTEGER,sort_order INTEGER DEFAULT 0,
      archived_at TEXT,published_slug TEXT,published_title TEXT,published_description TEXT,published_at TEXT,
      parent_page_id TEXT,published_parent_page_id TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,
      created_by TEXT,note TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(page_id,version));
    CREATE TABLE page_slug_redirects(site_id TEXT,from_slug TEXT,page_id TEXT,PRIMARY KEY(site_id,from_slug));
    CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,object_key TEXT NOT NULL,mime_type TEXT NOT NULL,original_name TEXT NOT NULL,size_bytes INTEGER NOT NULL,alt_text TEXT NOT NULL DEFAULT '',created_at TEXT DEFAULT CURRENT_TIMESTAMP,archived_at TEXT DEFAULT NULL);
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
    INSERT INTO sites VALUES ('site-default','active'),('other','active');
    INSERT INTO users VALUES ('admin','a@test','Admin','admin',1),('editor','e@test','Editor','viewer',1),('viewer','v@test','Viewer','viewer',1);
    INSERT INTO site_memberships VALUES ('site-default','admin','admin','active'),('other','editor','editor','active'),('other','viewer','viewer','active');
    CREATE TRIGGER pages_draft_parent_guard BEFORE UPDATE OF parent_page_id ON pages
    WHEN NEW.parent_page_id IS NOT NULL BEGIN
      SELECT RAISE(ABORT,'INVALID_PAGE_PARENT') WHERE NEW.archived_at IS NOT NULL OR NOT EXISTS (
        SELECT 1 FROM pages parent WHERE parent.id=NEW.parent_page_id AND parent.site_id=NEW.site_id AND parent.archived_at IS NULL
      );
    END;
  `);
  for(const name of ['admin','editor','viewer'])db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(await hashSessionToken(name),name,'2999-01-01');
  const document=(id,text='Original')=>({type:'sanci-page-document',schemaVersion:1,activePageId:id,revision:1,pages:{[id]:{id,rootId:'root',nodes:{root:{id:'root',type:'root',parentId:null,children:[],props:{text}}}}}});
  for(const [id,site] of [['a','site-default'],['b','other']]){
    const json=JSON.stringify(document(id));
    db.prepare(`INSERT INTO pages(id,site_id,slug,title,description,content_json,published_content_json,
      published_revision_id,is_published,published_slug,published_title,published_description)
      VALUES(?,?,?,?,?,?,?,?,1,?,?,?)`).run(id,site,id,'Title','Description',json,json,`r-${id}`,id,'Title','Description');
    db.prepare('INSERT INTO editor_revisions(id,page_id,version,document_json) VALUES(?,?,1,?)').run(`r-${id}`,id,json);
  }
  const env={...(enabled?{SITE_MEMBERSHIP_ENFORCEMENT:'enabled'}:{}),DB:{
    prepare(sql){const stmt=db.prepare(sql);let params=[];return {bind(...values){params=values;return this;},async first(){return stmt.get(...params)??null;},async all(){return {results:stmt.all(...params)};},run(){return {meta:{changes:Number(stmt.run(...params).changes)}};}};},
    async batch(statements){db.exec('BEGIN');try{const result=statements.map(s=>s.run());db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}}
  }};
  const call=(route,user,site,method='GET',body,query='')=>route(new Request(`https://example.test/api/admin/${route===adminPagesRoute?'pages':'editor'}${query||(route===adminEditorRoute&&method==='GET'?`?pageId=${site==='site-default'?'a':'b'}`:'')}`,{
    method,headers:user?{Cookie:`sanci9517_session=${user}`}:{},...(body!==undefined?{body:JSON.stringify(body)}:{})
  }),env,site);
  return {db,env,document,pages:(...args)=>call(adminPagesRoute,...args),editor:(...args)=>call(adminEditorRoute,...args)};
}

test('Pages and Editor enforce tenant membership before reads and writes',async t=>{
  const f=await fixture(t);const before=f.db.prepare('SELECT COUNT(*) AS n FROM audit_log').get().n;
  for(const route of [f.pages,f.editor]){
    assert.equal((await route('', 'other')).status,401);
    assert.equal((await route('admin','other')).status,403);
    assert.equal((await route('viewer','other')).status,403);
    assert.equal((await route('editor','other')).status,200);
    assert.equal((await route('editor','site-default')).status,403);
    if(route===f.editor)assert.equal((await route('editor','other','POST',{pageId:'a',expectedVersion:1,document:f.document('a'),publish:false})).status,404);
  }
  assert.equal((await f.pages('editor','other','PATCH',{id:'a',title:'Intrusion'})).status,404);
  assert.equal((await f.pages('editor','other','DELETE',{id:'a'})).status,404);
  assert.equal((await f.pages('editor','other','POST',{sourcePageId:'a',slug:'copy',title:'Copy'})).status,404);
  assert.equal((await f.editor('editor','other','PUT',{pageId:'a',version:1,expectedVersion:1})).status,404);
  assert.equal(f.db.prepare('SELECT title FROM pages WHERE id=?').get('a').title,'Title');
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM audit_log').get().n,before);
});

test('site editor saves, publishes and rolls back only own page; revocation fails closed',async t=>{
  const f=await fixture(t);
  const draft=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:1,document:f.document('b','Draft'),publish:false});
  assert.equal(draft.status,200);
  assert.equal(f.db.prepare('SELECT is_published,published_revision_id FROM pages WHERE id=?').get('b').published_revision_id,'r-b');
  const published=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:2,document:f.document('b','Live'),publish:true});
  assert.equal(published.status,200);
  const publishedRevisionId=(await published.json()).data.revisionId;
  assert.equal(f.db.prepare('SELECT published_revision_id FROM pages WHERE id=?').get('b').published_revision_id,publishedRevisionId);
  const rollback=await f.editor('editor','other','PUT',{pageId:'b',version:1,expectedVersion:3});
  assert.equal(rollback.status,200);
  assert.equal(f.db.prepare('SELECT published_revision_id FROM pages WHERE id=?').get('b').published_revision_id,publishedRevisionId);
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM editor_revisions WHERE page_id=?').get('a').n,1);
  f.db.prepare("UPDATE site_memberships SET status='revoked' WHERE user_id='editor' AND site_id='other'").run();
  assert.equal((await f.editor('editor','other','POST',{pageId:'b',expectedVersion:4,document:f.document('b'),publish:false})).status,403);
  assert.equal((await f.pages('editor','other','DELETE',{id:'b'})).status,403);
});

test('asset references save as private drafts and Publish accepts only media owned by the page site',async t=>{
  const f=await fixture(t),own='6b1c2e65-e46e-4764-b234-123456789abc',foreign='cdb85522-f682-4561-bd61-bfb83c4381b2';
  f.db.prepare('INSERT INTO media(id,site_id,object_key,mime_type,original_name,size_bytes) VALUES(?,?,?,?,?,?)').run(own,'other','sites/other/media/'+own,'image/png','own.png',100);
  f.db.prepare('INSERT INTO media(id,site_id,object_key,mime_type,original_name,size_bytes) VALUES(?,?,?,?,?,?)').run(foreign,'site-default','sites/site-default/media/'+foreign,'image/png','foreign.png',100);
  const withAsset=id=>({type:'sanci-page-document',schemaVersion:1,activePageId:'b',revision:1,pages:{b:{id:'b',rootId:'root',nodes:{root:{id:'root',type:'root',parentId:null,children:['image'],props:{}},image:{id:'image',type:'image',parentId:'root',children:[],metadata:{contentVersion:1,editorContentVersion:1},props:{assetId:id,alt:'Leírt kép'}}}}}});
  const saved=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:1,document:withAsset(own),publish:false});
  assert.equal(saved.status,200);
  assert.equal(f.db.prepare('SELECT json_extract(published_content_json,\'$.pages.b.nodes.image.props.assetId\') AS asset FROM pages WHERE id=?').get('b').asset,null,'Save preserves the published snapshot');
  const wrongSite=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:2,document:withAsset(foreign),publish:true});
  assert.equal(wrongSite.status,409);
  assert.equal((await wrongSite.json()).error.code,'MEDIA_NOT_FOUND');
  assert.equal(f.db.prepare('SELECT json_extract(published_content_json,\'$.pages.b.nodes.image.props.assetId\') AS asset FROM pages WHERE id=?').get('b').asset,null);
  const background=withAsset(own);background.pages.b.nodes.root.responsive={desktop:{backgroundAssetId:foreign}};
  const foreignBackground=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:2,document:background,publish:true});
  assert.equal(foreignBackground.status,409,'a foreign-site background is rejected before Publish');
  assert.equal((await foreignBackground.json()).error.code,'MEDIA_NOT_FOUND');
  background.pages.b.nodes.root.responsive.desktop.backgroundAssetId='javascript:alert(1)';
  const unsafe=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:2,document:background,publish:true});
  assert.equal(unsafe.status,409);
  assert.equal((await unsafe.json()).error.code,'INVALID_BACKGROUND_ASSET');
  background.pages.b.nodes.root.responsive.desktop.backgroundAssetId=own;
  background.pages.b.nodes.root.responsive.mobile={backgroundAssetId:'none'};
  const publishedBackground=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:2,document:background,publish:true});
  assert.equal(publishedBackground.status,200);
  assert.equal(f.db.prepare('SELECT json_extract(published_content_json,\'$.pages.b.nodes.root.responsive.desktop.backgroundAssetId\') AS asset FROM pages WHERE id=?').get('b').asset,own);
});

test('missing membership schema returns 503 and legacy role is default-site only',async t=>{
  const f=await fixture(t);f.db.exec('DROP TABLE site_memberships');
  assert.equal((await f.pages('admin','site-default')).status,503);
  assert.equal((await f.editor('admin','site-default')).status,503);
  const legacy=await fixture(t,false);
  assert.equal((await legacy.pages('admin','site-default')).status,200);
  assert.equal((await legacy.editor('admin','site-default')).status,200);
  assert.equal((await legacy.pages('admin','other')).status,403);
  assert.equal((await legacy.editor('admin','other')).status,403);
});

test('page lifecycle keeps create, ordering, archive and restore inside one site',async t=>{
  const f=await fixture(t);
  const created=await f.pages('editor','other','POST',{id:'c',slug:'new-page',title:'New page',description:'New',document:f.document('c')});
  assert.equal(created.status,200);
  assert.equal(f.db.prepare('SELECT site_id,is_published FROM pages WHERE id=?').get('c').site_id,'other');
  assert.equal(f.db.prepare('SELECT is_published FROM pages WHERE id=?').get('c').is_published,0);
  assert.equal((await f.pages('editor','other','PATCH',{id:'c',sortOrder:0})).status,200);
  assert.equal(f.db.prepare('SELECT sort_order FROM pages WHERE id=?').get('c').sort_order,0);
  assert.equal((await f.pages('editor','other','PATCH',{id:'c',action:'archive'})).status,200);
  assert.ok(f.db.prepare('SELECT archived_at FROM pages WHERE id=?').get('c').archived_at);
  assert.equal((await f.pages('editor','other','PATCH',{id:'c',action:'restore'})).status,200);
  assert.equal(f.db.prepare('SELECT archived_at,is_published FROM pages WHERE id=?').get('c').is_published,0);
  assert.equal(f.db.prepare('SELECT title FROM pages WHERE id=?').get('a').title,'Title');
  assert.equal((await f.editor('editor','other','GET',undefined,'?pageId=a')).status,404);
  assert.equal((await f.pages('editor','other','DELETE',{id:'a'})).status,404);
});

test('inactive site and inactive user are denied even with a matching grant',async t=>{
  const f=await fixture(t);
  f.db.prepare("UPDATE sites SET status='inactive' WHERE id='other'").run();
  assert.equal((await f.pages('editor','other')).status,403);
  assert.equal((await f.editor('editor','other')).status,403);
  f.db.prepare("UPDATE sites SET status='active' WHERE id='other'").run();
  f.db.prepare("UPDATE users SET is_active=0 WHERE id='editor'").run();
  assert.equal((await f.pages('editor','other')).status,401);
});

test('tenant metadata and publish URL history never modify the other site',async t=>{
  const f=await fixture(t);
  const renamed=await f.pages('editor','other','PATCH',{id:'b',slug:'renamed',title:'Renamed',expectedVersion:1});
  assert.equal(renamed.status,200);
  assert.equal(f.db.prepare('SELECT slug,published_slug FROM pages WHERE id=?').get('b').published_slug,'b');
  assert.equal(f.db.prepare('SELECT slug FROM pages WHERE id=?').get('a').slug,'a');
  const result=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:2,document:f.document('b'),publish:true});
  assert.equal(result.status,200);
  assert.deepEqual({...f.db.prepare('SELECT site_id,from_slug,page_id FROM page_slug_redirects').get()},
    {site_id:'other',from_slug:'b',page_id:'b'});
  assert.equal(f.db.prepare('SELECT published_slug FROM pages WHERE id=?').get('b').published_slug,'renamed');
  assert.equal(f.db.prepare('SELECT published_slug FROM pages WHERE id=?').get('a').published_slug,'a');
});

test('tenant copy, hierarchy and revision conflicts stay within the authorized site',async t=>{
  const f=await fixture(t);
  assert.equal((await f.pages('editor','other','POST',{sourcePageId:'a',slug:'stolen',title:'Stolen'})).status,404);
  assert.equal((await f.pages('editor','other','PATCH',{id:'a',action:'archive'})).status,404);
  assert.equal((await f.pages('editor','other','PATCH',{id:'a',action:'setParent',parentPageId:'b',expectedParentPageId:null})).status,404);
  const copied=await f.pages('editor','other','POST',{sourcePageId:'b',slug:'copy',title:'Copy'});
  assert.equal(copied.status,200);
  const copyId=(await copied.json()).data.id;
  assert.equal(f.db.prepare('SELECT site_id,is_published FROM pages WHERE id=?').get(copyId).site_id,'other');
  assert.equal(f.db.prepare('SELECT is_published FROM pages WHERE id=?').get(copyId).is_published,0);
  assert.equal((await f.pages('editor','other','PATCH',{id:copyId,action:'setParent',parentPageId:'b',expectedParentPageId:null})).status,200);
  assert.equal(f.db.prepare('SELECT parent_page_id FROM pages WHERE id=?').get(copyId).parent_page_id,'b');
  assert.equal((await f.pages('editor','other','PATCH',{id:copyId,action:'setParent',parentPageId:'a',expectedParentPageId:'b'})).status,409);
  assert.equal(f.db.prepare('SELECT parent_page_id FROM pages WHERE id=?').get(copyId).parent_page_id,'b');
  assert.equal(f.db.prepare('SELECT parent_page_id FROM pages WHERE id=?').get('a').parent_page_id,null);
  assert.equal((await f.editor('editor','other','POST',{pageId:'b',expectedVersion:0,document:f.document('b'),publish:false})).status,409);
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM editor_revisions WHERE page_id=?').get('b').n,1);
});

test('Countdown publication rejects impossible calendar dates without revisions, audit or live changes',async t=>{
  const f=await fixture(t),document=f.document('b');
  document.pages.b.nodes.root.children=['deadline'];
  document.pages.b.nodes.deadline={id:'deadline',name:'Esemény',type:'countdown',parentId:'root',children:[],metadata:{countdownVersion:1},props:{countdown:{version:1,title:'Premiere',finishText:'Elindult',showSeconds:true,targetISO:'2030-02-30T12:00:00Z'}}};
  const saved=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:1,document,publish:false});
  assert.equal(saved.status,200,'an incomplete or invalid draft can still be repaired');
  const snapshots=()=>({page:f.db.prepare('SELECT * FROM pages WHERE id=?').get('b'),revisions:f.db.prepare('SELECT * FROM editor_revisions ORDER BY id').all(),audit:f.db.prepare('SELECT * FROM audit_log ORDER BY id').all()});
  const before=snapshots();
  for(const targetISO of ['2030-02-30T12:00:00Z','2030-04-31T12:00:00+02:00','2030-12-31T24:00:00Z','2100-02-29T12:00:00Z']){
    document.pages.b.nodes.deadline.props.countdown.targetISO=targetISO;
    const response=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:2,document,publish:true});
    assert.equal(response.status,409,targetISO);assert.equal((await response.json()).error.code,'INVALID_COUNTDOWN_CONTENT');
    assert.deepEqual(snapshots(),before,'a rejected publication must not mutate any page/revision/audit record');
  }
  const targetISO='2032-02-29T00:30:42.123+01:00';document.pages.b.nodes.deadline.props.countdown.targetISO=targetISO;
  const repaired=await f.editor('editor','other','POST',{pageId:'b',expectedVersion:2,document,publish:true});
  assert.equal(repaired.status,200,'a real leap day and explicit offset can be published');
  const after=snapshots();assert.equal(after.revisions.length,before.revisions.length+1);assert.equal(after.audit.length,before.audit.length+1);
  const live=JSON.parse(after.page.published_content_json);
  assert.equal(live.pages.b.nodes.deadline.props.countdown.targetISO,targetISO,'validation must not silently rewrite the authored timestamp');
});
