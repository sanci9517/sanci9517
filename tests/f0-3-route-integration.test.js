import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { adminPagesRoute } from '../src/routes/admin/pages.ts';
import { adminEditorRoute } from '../src/routes/admin/editor.ts';
import { publicPagesRoute } from '../src/routes/public/pages.ts';
import worker from '../src/index.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';
import { defaultCardContent } from '../public/editor-v2/core/card-content.js';

// Executes production route SQL against SQLite. The adapter models D1's atomic
// batch contract; it does not claim to exercise the deployed Worker or D1.
async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    CREATE TABLE sites(id TEXT PRIMARY KEY,slug TEXT,name TEXT,status TEXT NOT NULL DEFAULT 'active');
    INSERT INTO sites(id,slug,name) VALUES('site-default','sanci9517','Sanci9517'),('other-site','other','Other');
    CREATE TABLE site_domains(hostname TEXT PRIMARY KEY,site_id TEXT,status TEXT,verified_at TEXT);
    INSERT INTO site_domains VALUES('example.test','site-default','verified','2026-10-17');
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE pages(archived_at TEXT,id TEXT PRIMARY KEY,site_id TEXT,slug TEXT,title TEXT,description TEXT,
      content_json TEXT,published_content_json TEXT,published_revision_id TEXT,is_published INTEGER,
      published_slug TEXT,published_title TEXT,published_description TEXT,sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,published_at TEXT);
    CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,
      created_by TEXT,note TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(page_id,version));
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
  `);
  db.exec('ALTER TABLE pages ADD COLUMN parent_page_id TEXT');
  db.exec('ALTER TABLE pages ADD COLUMN published_parent_page_id TEXT');
  db.exec(readFileSync(new URL('../migrations/0024_page_slug_redirects.sql',import.meta.url),'utf8'));
  for (const role of ['editor', 'viewer']) {
    db.prepare('INSERT INTO users VALUES (?,?,?,?,1)').run(role, `${role}@example.test`, role, role);
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(await hashSessionToken(role), role, '2999-01-01');
  }
  const document = (text, id = 'p') => ({ type: 'sanci-page-document', schemaVersion: 1, activePageId: id,
    pages: { [id]: { id, rootId: 'root', nodes: { root: { id: 'root', type: 'root', parentId: null,
      children: [], props: { text } } } } } });
  for (const [id, site] of [['p', 'site-default'], ['foreign', 'other-site']]) {
    const json = JSON.stringify(document('original', id));
    db.prepare(`INSERT INTO pages(id,site_id,slug,title,description,content_json,published_content_json,
      published_revision_id,is_published,published_slug,published_title,published_description)
      VALUES (?,?,?,?,?,?,?,?,1,?,?,?)`).run(id, site, id, 'Original', 'Description', json, json, `r-${id}`, id, 'Original', 'Description');
    db.prepare('INSERT INTO editor_revisions(id,page_id,version,document_json) VALUES (?,?,1,?)').run(`r-${id}`, id, json);
  }
  const env = { SITE_HOST_BINDINGS: '{"example.test":"site-default"}', DB: {
    beforeBatch: null,
    prepare(sql) {
      // D1 supports indexed placeholders; these queries bind each index once.
      const statement = db.prepare(sql.replace(/\?\d+/g, '?'));
      let values = [];
      return { bind(...args) { values = args; return this; },
        async first() { return statement.get(...values) ?? null; },
        async all() { return { results: statement.all(...values) }; },
        run() { return { meta: { changes: Number(statement.run(...values).changes) } }; } };
    },
    async batch(statements) {
      const hook = this.beforeBatch; this.beforeBatch = null;
      if (hook) await hook();
      db.exec('BEGIN');
      try { const results = statements.map(s => s.run()); db.exec('COMMIT'); return results; }
      catch (error) { db.exec('ROLLBACK'); throw error; }
    }
  } };
  const edit = (body, method = 'POST', role = 'editor') => adminEditorRoute(new Request('https://example.test/api/admin/editor', {
    method, headers: role ? { Cookie: `sanci9517_session=${role}` } : {}, body: JSON.stringify(body)
  }), env);
  const read = (query = '?slug=p', role = '') => publicPagesRoute(new Request(`https://example.test/api/public/pages${query}`, {
    headers: role ? { Cookie: `sanci9517_session=${role}` } : {}
  }), env);
  const publish = text => ({ pageId: 'p', expectedVersion: 1, document: document(text), publish: true });
  const state = () => ({ pages: db.prepare('SELECT * FROM pages ORDER BY id').all(),
    revisions: db.prepare('SELECT * FROM editor_revisions ORDER BY id').all(), audit: db.prepare('SELECT * FROM audit_log ORDER BY id').all() });
  return { db, env, document, edit, read, publish, state };
}

test('anonymous/viewer preview and write attempts are denied without mutations', async t => {
  const f = await fixture(t), before = f.state();
  for (const [role, status] of [['', 401], ['viewer', 403]]) {
    for (const query of ['?preview=1', '?preview=1&slug=p']) {
      const response = await f.read(query, role);
      assert.equal(response.status, status);
      assert.match(response.headers.get('Cache-Control'), /no-store/);
    }
    assert.equal((await f.edit(f.publish('forbidden'), 'POST', role)).status, status);
    assert.equal((await f.edit({pageId:'p', version:1, expectedVersion:1}, 'PUT', role)).status, status);
  }
  assert.deepEqual(f.state(), before);
});

test('save isolates draft, publish exposes it, rollback remains draft until republished', async t => {
  const f = await fixture(t);
  assert.equal((await f.edit({...f.publish('draft-only'), publish:false})).status, 200);
  const publicResponse = await f.read('?slug=p', 'editor');
  assert.match(publicResponse.headers.get('Cache-Control'), /no-store/);
  assert.equal(publicResponse.headers.get('Vary'), 'Cookie');
  assert.doesNotMatch(JSON.stringify(await publicResponse.json()), /draft-only/);
  assert.match(JSON.stringify(await (await f.read('?slug=p&preview=1', 'editor')).json()), /draft-only/);
  assert.equal((await f.edit({...f.publish('published-new'), expectedVersion:2})).status, 200);
  assert.match(JSON.stringify(await (await f.read()).json()), /published-new/);
  assert.equal((await f.edit({pageId:'p', version:1, expectedVersion:3}, 'PUT')).status, 200);
  assert.match(JSON.stringify(await (await f.read()).json()), /published-new/);
  assert.match(JSON.stringify(await (await f.read('?slug=p&preview=1', 'editor')).json()), /original/);
  const restored = JSON.parse(f.db.prepare("SELECT content_json FROM pages WHERE id='p'").get().content_json);
  assert.equal((await f.edit({...f.publish('unused'), document:restored, expectedVersion:4})).status, 200);
  assert.match(JSON.stringify(await (await f.read()).json()), /original/);
});

test('oversized Editor pages are rejected before saves, publishes, rollback, or duplication mutate state',async t=>{
 const f=await fixture(t),document=f.document('bounded');
 const nodes=document.pages.p.nodes;
 for(let index=0;index<1000;index++)nodes[`excess-${index}`]={id:`excess-${index}`,type:'section',parentId:'root',children:[]};
 assert.equal(Object.keys(nodes).length,1001);
 f.db.prepare("UPDATE pages SET content_json=? WHERE id='p'").run(JSON.stringify(document));
 const readBefore=f.state();
 const editorRead=await adminEditorRoute(new Request('https://example.test/api/admin/editor?pageId=p',{method:'GET',headers:{Cookie:'sanci9517_session=editor'}}),f.env);
 assert.equal(editorRead.status,413);
 assert.equal((await editorRead.json()).error.code,'EDITOR_NODE_LIMIT_EXCEEDED');
 assert.deepEqual(f.state(),readBefore,'Editor boot refuses oversized persisted input before normalization');
 const pageList=await adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'GET',headers:{Cookie:'sanci9517_session=editor'}}),f.env);
 const oversizedRow=(await pageList.json()).data.find(row=>row.id==='p');
 assert.equal(oversizedRow.editorNodeLimitExceeded,true);
 assert.equal(Object.hasOwn(oversizedRow,'content'),false,'list responses must not ship an oversized Page Model');
 assert.deepEqual(f.state(),readBefore,'oversized list handling is read-only');
 const metadataPatch=await adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor'},body:JSON.stringify({id:'p',title:'Changed title',expectedVersion:1})}),f.env);
 assert.equal(metadataPatch.status,413);
 assert.equal((await metadataPatch.json()).error.code,'EDITOR_NODE_LIMIT_EXCEEDED');
 assert.deepEqual(f.state(),readBefore,'metadata writes must not reserialize oversized Page Models');
 for(const publish of [false,true]){
  const response=await f.edit({pageId:'p',expectedVersion:1,document,publish});
  assert.equal(response.status,413);
  assert.equal((await response.json()).error.code,'EDITOR_NODE_LIMIT_EXCEEDED');
  assert.deepEqual(f.state(),readBefore,'oversized data must not add a draft revision, change the page, or publish');
 }
 const oversizedCreate=f.document('large','oversized-next');
 for(let index=0;index<1000;index++)oversizedCreate.pages['oversized-next'].nodes[`excess-${index}`]={id:`excess-${index}`,type:'section',parentId:'root',children:[]};
 const createRejected=await adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'POST',headers:{Cookie:'sanci9517_session=editor'},body:JSON.stringify({id:'oversized-next',title:'Oversized next',slug:'oversized-next',description:'',document:oversizedCreate})}),f.env);
 assert.equal(createRejected.status,413);
 assert.equal((await createRejected.json()).error.code,'EDITOR_NODE_LIMIT_EXCEEDED');
 assert.deepEqual(f.state(),readBefore,'page creation must reject oversized content before inserting its page or revision');
 const oversizedRevision=f.document('restored');
 for(let index=0;index<1000;index++)oversizedRevision.pages.p.nodes[`excess-${index}`]={id:`excess-${index}`,type:'section',parentId:'root',children:[]};
 f.db.prepare('INSERT INTO editor_revisions(id,page_id,version,document_json,created_by,note) VALUES(?,?,?,?,?,?)').run('oversized-revision','p',2,JSON.stringify(oversizedRevision),'editor','fixture');
 const rollbackBefore=f.state();
 const rollback=await f.edit({pageId:'p',version:2,expectedVersion:2},'PUT');
 assert.equal(rollback.status,413);
 assert.equal((await rollback.json()).error.code,'EDITOR_NODE_LIMIT_EXCEEDED');
 assert.deepEqual(f.state(),rollbackBefore,'oversized archived content must not be restored over the current draft');
 const oversizedSource=f.document('source');
 for(let index=0;index<1000;index++)oversizedSource.pages.p.nodes[`excess-${index}`]={id:`excess-${index}`,type:'section',parentId:'root',children:[]};
 f.db.prepare("UPDATE pages SET content_json=? WHERE id='p'").run(JSON.stringify(oversizedSource));
 const duplicateBefore=f.state();
 const duplicate=await adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'POST',headers:{Cookie:'sanci9517_session=editor'},body:JSON.stringify({sourcePageId:'p',title:'Duplicate oversized',slug:'duplicate-oversized'})}),f.env);
 assert.equal(duplicate.status,413);
 assert.equal((await duplicate.json()).error.code,'EDITOR_NODE_LIMIT_EXCEEDED');
 assert.deepEqual(f.state(),duplicateBefore,'oversized source duplication must stop before allocating a cloned node map or writing rows');
});

test('direct Publish rejects planned and unknown block types without changing the saved or published revision', async t => {
  const f = await fixture(t);
  for (const type of ['form', 'unknown-block']) {
    const document = f.document('root-content');
    const page = document.pages.p;
    page.nodes.root.children = ['unsupported'];
    page.nodes.unsupported = {
      id:'unsupported', type, name:'Unsupported block', parentId:'root', children:[],
      props:{}, style:{}, responsive:{desktop:{},tablet:{},mobile:{}}, states:{}, accessibility:{}, metadata:{}
    };
    const before = f.state();
    const response = await f.edit({pageId:'p', expectedVersion:1, document, publish:true});
    assert.equal(response.status,409,`${type} is rejected at the server Publish boundary`);
    assert.deepEqual(f.state(),before,`${type} rejection must not write a draft, revision, audit, or published snapshot`);
  }
});

test('malformed authored CTA drafts save separately but cannot replace the published snapshot', async t => {
  const f = await fixture(t), document = f.document('root-content');
  const page = document.pages.p, root = page.nodes.root;
  root.children = ['cta'];
  page.nodes.cta = {
    id:'cta',type:'button',name:'Publikált CTA',parentId:'root',children:[],
    props:{text:'Publikált hivatkozás',href:'/p/valid-target'},style:{},
    responsive:{desktop:{},tablet:{},mobile:{}},states:{},accessibility:{},
    metadata:{contentVersion:1}
  };
  const initial = await f.edit({...f.publish('unused'),document,publish:true});
  assert.equal(initial.status,200,'a valid authored CTA establishes the live baseline');
  const liveBefore = await f.read();
  const liveBody = await liveBefore.json();
  assert.equal(liveBody.data.content.nodes.cta.props.href,'/p/valid-target');
  const publishedSnapshot = f.db.prepare("SELECT published_content_json,published_revision_id FROM pages WHERE id='p'").get();

  const invalidDraft = structuredClone(document);
  invalidDraft.pages.p.nodes.cta.props.href = {toString:null};
  const saved = await f.edit({pageId:'p',document:invalidDraft,publish:false,expectedVersion:2});
  assert.equal(saved.status,200,'Save preserves malformed historical/API data as an unpublished draft');
  assert.equal((await saved.json()).data.published,false,'Save never implicitly publishes');
  const stored = f.db.prepare("SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id='p'").get();
  assert.deepEqual(JSON.parse(stored.content_json).pages.p.nodes.cta.props.href,{toString:null});
  assert.equal(stored.published_content_json,publishedSnapshot.published_content_json,'draft Save preserves the already-published serialized snapshot');
  assert.equal(stored.published_revision_id,publishedSnapshot.published_revision_id);
  assert.equal(stored.is_published,1);

  const beforeRejectedPublish = f.state();
  const rejected = await f.edit({pageId:'p',document:invalidDraft,publish:true,expectedVersion:3});
  assert.equal(rejected.status,409,'the server independently rejects invalid authored CTA data on Publish');
  assert.equal((await rejected.json()).error.code,'INCOMPLETE_EDITOR_CONTENT');
  assert.deepEqual(f.state(),beforeRejectedPublish,'rejected Publish inserts no revision and performs no snapshot write');
  const liveAfter = await f.read();
  assert.equal(liveAfter.status,200);
  assert.deepEqual(await liveAfter.json(),liveBody,'public content remains identical to the valid pre-error publication');
});

test('malformed saved Card CTA remains a draft and cannot replace its published snapshot', async t => {
  const f = await fixture(t), document = f.document('root-content');
  const page = document.pages.p, root = page.nodes.root;
  root.children = ['card'];
  page.nodes.card = {
    id:'card',type:'card',name:'Kártya CTA',parentId:'root',children:[],
    props:{cardContent:{...defaultCardContent(),title:'Publikált kártya',actionLabel:'Megnyitás',actionHref:'/p/valid-target'}},style:{},
    responsive:{desktop:{},tablet:{},mobile:{}},states:{},accessibility:{},
    metadata:{cardContentVersion:1}
  };
  const initial = await f.edit({...f.publish('unused'),document,publish:true});
  assert.equal(initial.status,200,'valid Card content establishes the public baseline');
  const liveBefore = await f.read(), liveBody = await liveBefore.json();
  const publishedSnapshot = f.db.prepare("SELECT published_content_json,published_revision_id FROM pages WHERE id='p'").get();

  const invalidDraft = structuredClone(document);
  invalidDraft.pages.p.nodes.card.props.cardContent.actionHref = {toString:null};
  const saved = await f.edit({pageId:'p',document:invalidDraft,publish:false,expectedVersion:2});
  assert.equal(saved.status,200,'Save preserves a malformed historical Card CTA only in the draft');
  assert.equal((await saved.json()).data.published,false,'Card Save does not implicitly publish');
  const stored = f.db.prepare("SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id='p'").get();
  assert.deepEqual(JSON.parse(stored.content_json).pages.p.nodes.card.props.cardContent.actionHref,{toString:null});
  assert.equal(stored.published_content_json,publishedSnapshot.published_content_json,'draft Save preserves the published Card snapshot');
  assert.equal(stored.published_revision_id,publishedSnapshot.published_revision_id);
  assert.equal(stored.is_published,1);

  const beforeRejectedPublish = f.state();
  const rejected = await f.edit({pageId:'p',document:invalidDraft,publish:true,expectedVersion:3});
  assert.equal(rejected.status,409,'Worker-side publication validation rejects malformed Card CTA objects');
  assert.equal((await rejected.json()).error.code,'INVALID_CARD_CONTENT');
  assert.deepEqual(f.state(),beforeRejectedPublish,'rejected Card Publish performs no revision or snapshot write');
  assert.deepEqual(await (await f.read()).json(),liveBody,'the public Card remains identical to its pre-error snapshot');
});

test('D authored audio without native controls saves only as a draft and server rejects Publish', async t => {
  const f = await fixture(t), document = f.document('root-content');
  const page = document.pages.p, root = page.nodes.root;
  root.children = ['audio'];
  page.nodes.audio = {
    id:'audio',type:'audio',name:'Hanganyag',parentId:'root',children:[],
    props:{src:'/audio.ogg',controls:true,loop:false},style:{},
    responsive:{desktop:{},tablet:{},mobile:{}},states:{},accessibility:{},
    metadata:{contentVersion:1,editorContentVersion:1}
  };
  const initial = await f.edit({...f.publish('unused'),document,publish:true});
  assert.equal(initial.status,200,'valid audio establishes a published baseline');
  const liveBefore = await f.read();
  const liveBody = await liveBefore.json();
  assert.equal(liveBody.data.content.nodes.audio.props.controls,true);
  const publishedSnapshot = f.db.prepare("SELECT published_content_json,published_revision_id FROM pages WHERE id='p'").get();

  const invalidDraft = structuredClone(document);
  invalidDraft.pages.p.nodes.audio.props.controls = false;
  invalidDraft.pages.p.nodes.audio.props.loop = true;
  const saved = await f.edit({pageId:'p',document:invalidDraft,publish:false,expectedVersion:2});
  assert.equal(saved.status,200,'the incomplete audio configuration remains editable and Save stays draft-only');
  assert.equal((await saved.json()).data.published,false);
  const stored = f.db.prepare("SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id='p'").get();
  const draft = JSON.parse(stored.content_json).pages.p.nodes.audio.props;
  assert.equal(draft.controls,false);
  assert.equal(draft.loop,true);
  assert.equal(stored.published_content_json,publishedSnapshot.published_content_json);
  assert.equal(stored.published_revision_id,publishedSnapshot.published_revision_id);
  assert.equal(stored.is_published,1);

  const beforeRejectedPublish = f.state();
  const rejected = await f.edit({pageId:'p',document:invalidDraft,publish:true,expectedVersion:3});
  assert.equal(rejected.status,409,'the server independently rejects hiding native audio controls');
  assert.equal((await rejected.json()).error.code,'INCOMPLETE_EDITOR_CONTENT');
  assert.deepEqual(f.state(),beforeRejectedPublish,'rejected Publish inserts no revision and performs no snapshot write');
  const liveAfter = await f.read();
  assert.equal(liveAfter.status,200);
  assert.deepEqual(await liveAfter.json(),liveBody,'the valid public audio remains unchanged after rejected Publish');
});

test('D versioned legacy video playback rejects unmuted autoplay and controls-free foreground media', async t => {
  const f = await fixture(t), document = f.document('root-content');
  const page = document.pages.p, root = page.nodes.root;
  root.children = ['video'];
  page.nodes.video = {
    id:'video',type:'video',name:'Videó',parentId:'root',children:[],
    props:{src:'/video.webm',poster:'',posterAssetId:'',controls:true,muted:false,autoplay:false,loop:false},style:{},
    responsive:{desktop:{},tablet:{},mobile:{}},states:{},accessibility:{},
    metadata:{editorContentVersion:1}
  };
  assert.equal(page.nodes.video.metadata.contentVersion,undefined,'exercise the independent media-v1 gate, not authored-v1');
  const initial = await f.edit({...f.publish('unused'),document,publish:true});
  assert.equal(initial.status,200,'valid controls establish a published baseline');
  const liveBody = await (await f.read()).json();
  const publishedSnapshot = f.db.prepare("SELECT published_content_json,published_revision_id FROM pages WHERE id='p'").get();

  const unmutedAutoplay = structuredClone(document);
  Object.assign(unmutedAutoplay.pages.p.nodes.video.props,{autoplay:true,muted:false});
  const saved = await f.edit({pageId:'p',document:unmutedAutoplay,publish:false,expectedVersion:2});
  assert.equal(saved.status,200,'an incomplete playback setup remains recoverable as a draft');
  const stored = f.db.prepare("SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id='p'").get();
  assert.equal(JSON.parse(stored.content_json).pages.p.nodes.video.props.autoplay,true);
  assert.equal(stored.published_content_json,publishedSnapshot.published_content_json,'Save does not replace the valid public video');
  assert.equal(stored.published_revision_id,publishedSnapshot.published_revision_id);
  assert.equal(stored.is_published,1);

  const beforeRejected = f.state();
  const rejected = await f.edit({pageId:'p',document:unmutedAutoplay,publish:true,expectedVersion:3});
  assert.equal(rejected.status,409);
  assert.equal((await rejected.json()).error.code,'VIDEO_AUTOPLAY_REQUIRES_MUTED');
  assert.deepEqual(f.state(),beforeRejected,'rejected Publish creates no revision or audit mutation');
  assert.deepEqual(await (await f.read()).json(),liveBody,'the prior valid video remains public');

  const controlsFreeForeground = structuredClone(document);
  Object.assign(controlsFreeForeground.pages.p.nodes.video.props,{controls:false,autoplay:false,muted:false});
  const savedForeground = await f.edit({pageId:'p',document:controlsFreeForeground,publish:false,expectedVersion:3});
  assert.equal(savedForeground.status,200,'the user can repair the saved draft without losing it');
  const rejectedForeground = await f.edit({pageId:'p',document:controlsFreeForeground,publish:true,expectedVersion:4});
  assert.equal(rejectedForeground.status,409);
  assert.equal((await rejectedForeground.json()).error.code,'VIDEO_CONTROLS_REQUIRED');

  const mutedBackground = structuredClone(document);
  Object.assign(mutedBackground.pages.p.nodes.video.props,{controls:false,autoplay:true,muted:true});
  const publishedBackground = await f.edit({pageId:'p',document:mutedBackground,publish:true,expectedVersion:4});
  assert.equal(publishedBackground.status,200,'an explicit muted autoplay background video remains supported');
});

test('D versioned legacy audio without native controls saves as a repairable draft but cannot publish', async t => {
  const f = await fixture(t), document = f.document('root-content');
  const page = document.pages.p, root = page.nodes.root;
  root.children = ['audio'];
  page.nodes.audio = {
    id:'audio',type:'audio',name:'Hang',parentId:'root',children:[],
    props:{src:'/audio.ogg',controls:false,loop:false},style:{},
    responsive:{desktop:{},tablet:{},mobile:{}},states:{},accessibility:{},
    metadata:{editorContentVersion:1}
  };
  const valid = structuredClone(document);
  valid.pages.p.nodes.audio.props.controls = true;
  assert.equal((await f.edit({...f.publish('unused'),document:valid,publish:true})).status,200,'native controls establish a valid published baseline');
  const publishedBefore = f.db.prepare("SELECT published_content_json,published_revision_id FROM pages WHERE id='p'").get();

  assert.equal((await f.edit({pageId:'p',document,publish:false,expectedVersion:2})).status,200,'an unsupported playback preference remains recoverable in a saved draft');
  const draft = JSON.parse(f.db.prepare("SELECT content_json FROM pages WHERE id='p'").get().content_json);
  assert.equal(draft.pages.p.nodes.audio.props.controls,false);
  const beforeRejected = f.state();
  const rejected = await f.edit({pageId:'p',document,publish:true,expectedVersion:3});
  assert.equal(rejected.status,409);
  assert.equal((await rejected.json()).error.code,'AUDIO_CONTROLS_REQUIRED');
  assert.deepEqual(f.state(),beforeRejected,'rejected legacy audio Publish creates no revision or audit mutation');
  const stillPublished = f.db.prepare("SELECT published_content_json,published_revision_id FROM pages WHERE id='p'").get();
  assert.deepEqual(stillPublished,publishedBefore,'the existing playable audio remains the public version');

  const repaired = structuredClone(document);
  repaired.pages.p.nodes.audio.props.controls = true;
  assert.equal((await f.edit({pageId:'p',document:repaired,publish:true,expectedVersion:3})).status,200,'restoring native controls completes the explicit Publish');
});

test('two publishers reading the same version yield one winner and one conflict', async t => {
  const f = await fixture(t);
  f.env.DB.beforeBatch = async () => assert.equal((await f.edit(f.publish('winner'))).status, 200);
  const loser = await f.edit(f.publish('loser'));
  assert.equal(loser.status, 409);
  assert.equal((await loser.json()).error.code, 'REVISION_CONFLICT');
  assert.match(JSON.stringify(await (await f.read()).json()), /winner/);
  assert.doesNotMatch(JSON.stringify(f.state()), /loser/);
  assert.equal(f.state().audit.length, 1);
  assert.equal(f.state().revisions.length, 3); // initial revisions for two sites + winner
});

test('audit SQL failure rolls back revision, draft and published pointer together', async t => {
  const f = await fixture(t), before = f.state();
  f.db.exec("CREATE TRIGGER fail_audit BEFORE INSERT ON audit_log BEGIN SELECT RAISE(ABORT,'injected audit failure'); END");
  await assert.rejects(f.edit(f.publish('must-rollback')), /injected audit failure/);
  assert.deepEqual(f.state(), before);
});

test('unpublish racing a new publish conflicts without recording a false audit', async t => {
  const f = await fixture(t);
  f.env.DB.beforeBatch = async () => assert.equal((await f.edit(f.publish('new-public'))).status, 200);
  assert.equal((await f.edit({pageId:'p', action:'unpublish'})).status, 409);
  assert.match(JSON.stringify(await (await f.read()).json()), /new-public/);
  assert.deepEqual(f.state().audit.map(a => a.action), ['page.publish']);
  assert.equal((await f.edit({pageId:'p', action:'unpublish'})).status, 200);
  assert.equal((await f.read()).status, 404);
  assert.equal((await f.edit({pageId:'p', action:'unpublish'})).status, 200);
  assert.deepEqual(f.state().audit.map(a => a.action).sort(), ['page.publish', 'page.unpublish']);
});

test('foreign-site pages cannot be read, saved, restored or unpublished', async t => {
  const f = await fixture(t), before = f.state();
  assert.equal((await f.read('?slug=foreign')).status, 404);
  assert.equal((await f.read('?slug=foreign&preview=1', 'editor')).status, 404);
  for (const query of ['', '?preview=1']) {
    assert.doesNotMatch(JSON.stringify(await (await f.read(query, 'editor')).json()), /foreign/);
  }
  assert.equal((await f.edit({pageId:'foreign', expectedVersion:1, document:f.document('bad', 'foreign'), publish:true})).status, 404);
  assert.equal((await f.edit({pageId:'foreign', expectedVersion:1, version:1}, 'PUT')).status, 404);
  assert.equal((await f.edit({pageId:'foreign', action:'unpublish'})).status, 404);
  assert.deepEqual(f.state(), before);
});

test('rollback losing a race with publish preserves the winning revision and audit', async t => {
  const f = await fixture(t);
  f.env.DB.beforeBatch = async () => assert.equal((await f.edit(f.publish('winner'))).status, 200);
  assert.equal((await f.edit({pageId:'p', version:1, expectedVersion:1}, 'PUT')).status, 409);
  assert.match(JSON.stringify(await (await f.read()).json()), /winner/);
  assert.deepEqual(f.state().audit.map(a => a.action), ['page.publish']);
  assert.equal(f.state().revisions.length, 3);
});

test('missing/stale revision and invalid publish hierarchy leave all persisted state untouched', async t => {
  const f = await fixture(t), before = f.state();
  assert.equal((await f.edit({...f.publish('bad'), expectedVersion:undefined})).status, 428);
  assert.equal((await f.edit({...f.publish('bad'), expectedVersion:0})).status, 409);
  const invalid = f.publish('bad');
  invalid.document.pages.p.nodes.root.children = ['missing'];
  assert.equal((await f.edit(invalid)).status, 409);
  assert.deepEqual(f.state(), before);
});

test('page metadata PATCH requires expectedVersion and atomically rejects a concurrent stale writer',async t=>{
 const f=await fixture(t);
 const patch=body=>adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'p',...body})}),f.env);
 const before=f.state();
 const missing=await patch({title:'Missing version'});
 assert.equal(missing.status,428);assert.equal((await missing.json()).error.code,'EXPECTED_VERSION_REQUIRED');assert.deepEqual(f.state(),before);
 const stale=await patch({title:'Stale version',expectedVersion:0});
 assert.equal(stale.status,409);assert.equal((await stale.json()).error.code,'REVISION_CONFLICT');assert.deepEqual(f.state(),before);
 const malformed=await patch({title:'Malformed version',expectedVersion:'1'});
 assert.equal(malformed.status,400);assert.equal((await malformed.json()).error.code,'INVALID_EXPECTED_VERSION');assert.deepEqual(f.state(),before);
 assert.equal((await patch({sortOrder:0})).status,200,'sort-only request remains compatible without a revision token');assert.deepEqual(f.state(),before);

 const qDocument=JSON.stringify(f.document('second-page','q'));
 f.db.prepare('INSERT INTO pages(id,site_id,slug,title,description,content_json,sort_order) VALUES(?,?,?,?,?,?,?)').run('q','site-default','q','Second page','',qDocument,1);
 f.env.DB.beforeBatch=async()=>assert.equal((await patch({title:'Winner',expectedVersion:1})).status,200);
 const loser=await patch({slug:'loser',sortOrder:0,expectedVersion:1});
 assert.equal(loser.status,409);assert.equal((await loser.json()).error.code,'REVISION_CONFLICT');
 const saved={...f.db.prepare("SELECT title,slug FROM pages WHERE id='p'").get()};
 assert.deepEqual(saved,{title:'Winner',slug:'p'});
 assert.deepEqual(f.db.prepare("SELECT id,sort_order FROM pages WHERE site_id='site-default' ORDER BY id").all().map(row=>({...row})),[
  {id:'p',sort_order:0},{id:'q',sort_order:1}
 ],'losing CAS must not partially reorder pages');
 assert.deepEqual(f.db.prepare("SELECT version,note FROM editor_revisions WHERE page_id='p' ORDER BY version").all().map(row=>({...row})),[
  {version:1,note:null},{version:2,note:'Oldal metaadat módosítás'}
 ]);
 assert.deepEqual(f.state().audit.map(row=>row.metadata_json),[JSON.stringify({oldTitle:'Original',title:'Winner',oldSlug:'p',slug:'p',oldDescription:'Description',description:'Description',oldSortOrder:0,sortOrder:0,version:2,revisionId:f.state().revisions.find(row=>row.version===2).id})]);
});


test('page list distinguishes saved drafts from LIVE snapshots through save, metadata change, publish, rollback and unpublish',async t=>{
 const f=await fixture(t);
 const list=async(meta=false)=>{
  const response=await adminPagesRoute(new Request('https://example.test/api/admin/pages'+(meta?'?meta=1':''),{headers:{Cookie:'sanci9517_session=editor'}}),f.env);
  assert.equal(response.status,200);
  return (await response.json()).data;
 };
 let rows=await list();assert.equal(rows.length,1);assert.equal(rows[0].hasUnpublishedChanges,false);
 assert.equal((await f.edit({...f.publish('pending'),publish:false})).status,200);
 rows=await list(true);assert.equal(rows[0].hasUnpublishedChanges,true);assert.equal(rows[0].isPublished,true);assert.equal('content' in rows[0],false);
 const changed=await adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'p',title:'Renamed',slug:'new-slug',expectedVersion:2})}),f.env);
 assert.equal(changed.status,200);const metadata=(await changed.json()).data;assert.equal(metadata.hasUnpublishedChanges,true);
 assert.equal((await f.read('?slug=p')).status,200);assert.equal((await f.read('?slug=new-slug')).status,404);
 assert.equal((await f.edit({pageId:'p',expectedVersion:3,document:metadata.content,publish:true})).status,200);
 rows=await list();assert.equal(rows[0].hasUnpublishedChanges,false);assert.equal((await f.read('?slug=new-slug')).status,200);
 assert.equal((await f.edit({pageId:'p',version:1,expectedVersion:4},'PUT')).status,200);assert.equal((await list())[0].hasUnpublishedChanges,true);
 assert.equal((await f.edit({pageId:'p',action:'unpublish'})).status,200);rows=await list();assert.equal(rows[0].isPublished,false);assert.equal(rows[0].hasUnpublishedChanges,false);
});

function urlFixture(f){
 f.env.ASSETS={fetch:async()=>new Response('<!doctype html><title>Public page</title>',{headers:{'Content-Type':'text/html'}})};
 const patch=body=>adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'p',...body})}),f.env);
 const visit=(slug,query='')=>worker.fetch(new Request(`https://example.test/p/${slug}${query}`),f.env,{});
 const publish=(version,text)=>f.edit({pageId:'p',expectedVersion:version,document:f.document(text),publish:true});
 return {patch,visit,publish};
}

test('WEB-013 published rename creates a one-hop same-origin redirect; draft save and preview do not redirect',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 assert.equal((await u.visit('p')).status,200,'old URL remains LIVE before explicit publish');
 assert.equal((await u.visit('renamed')).status,404,'draft URL is not public');
 assert.equal((await u.visit('p','?preview=1')).status,401,'anonymous preview is never redirected');
 assert.equal((await u.publish(2,'new published')).status,200);
 const redirect=await u.visit('p','?ref=phone');
 assert.equal(redirect.status,308);assert.equal(redirect.headers.get('Location'),'/p/renamed?ref=phone');
 assert.equal(redirect.headers.get('Cache-Control'),'private, no-store, max-age=0');
 assert.equal((await u.visit('renamed')).status,200);
 assert.equal((await f.read('?slug=p')).status,404,'content API does not expose a historical slug as a page');
 assert.deepEqual(f.db.prepare('SELECT site_id,from_slug,page_id FROM page_slug_redirects').all().map(row=>({...row})),[{site_id:'site-default',from_slug:'p',page_id:'p'}]);
});

test('WEB-013 repeat rename and return to an old slug never create chains or loops',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 assert.equal((await u.patch({slug:'second',expectedVersion:1})).status,200);
 assert.equal((await u.publish(2,'second')).status,200);
 assert.equal((await u.patch({slug:'third',expectedVersion:3})).status,200);
 assert.equal((await u.publish(4,'third')).status,200);
 for(const old of ['p','second'])assert.equal((await u.visit(old)).headers.get('Location'),'/p/third');
 assert.equal((await u.patch({slug:'p',expectedVersion:5})).status,200,'own historical slug is reusable');
 assert.equal((await u.publish(6,'returned')).status,200);
 assert.equal((await u.visit('p')).status,200);
 for(const old of ['second','third'])assert.equal((await u.visit(old)).headers.get('Location'),'/p/p');
 assert.deepEqual(f.db.prepare('SELECT from_slug FROM page_slug_redirects ORDER BY from_slug').all().map(r=>r.from_slug),['second','third']);
 assert.equal((await u.visit('missing')).status,404);
});

test('WEB-013 reservations reject shadowing and cross-site ownership while preserving site-scoped aliases',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 const json=JSON.stringify(f.document('other','q'));
 f.db.prepare('INSERT INTO pages(id,site_id,slug,title,description,content_json,is_published,sort_order) VALUES(?,?,?,?,?,?,0,1)').run('q','site-default','q','Q','',json);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 assert.equal((await u.publish(2,'renamed')).status,200);
 const qPatch=slug=>adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'q',slug,expectedVersion:0})}),f.env);
 for(const slug of ['p','renamed']){
  const response=await qPatch(slug);assert.equal(response.status,409,slug);assert.equal((await response.json()).error.code,'SLUG_RESERVED');
 }
 assert.equal(f.db.prepare('SELECT slug FROM pages WHERE id=?').get('q').slug,'q');
 assert.throws(()=>f.db.prepare('INSERT INTO page_slug_redirects(site_id,from_slug,page_id) VALUES(?,?,?)').run('site-default','outside','foreign'),/REDIRECT_SITE_MISMATCH/);
 f.db.prepare('INSERT INTO page_slug_redirects(site_id,from_slug,page_id) VALUES(?,?,?)').run('other-site','p','foreign');
 assert.equal((await u.visit('p')).headers.get('Location'),'/p/renamed','foreign-site alias must not leak');
 assert.equal((await adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'DELETE',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'p'})}),f.env)).status,409,'history owner cannot be permanently deleted');
});

test('WEB-013 failed redirect write rolls back revision, published URL and history atomically',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 f.db.exec("CREATE TRIGGER fail_redirect BEFORE INSERT ON page_slug_redirects BEGIN SELECT RAISE(ABORT,'injected redirect failure'); END;");
 const before=f.state();
 await assert.rejects(()=>u.publish(2,'would be new'),/injected redirect failure/);
 assert.deepEqual(f.state(),before);
 assert.equal(f.db.prepare('SELECT COUNT(*) n FROM page_slug_redirects').get().n,0);
 assert.equal((await u.visit('p')).status,200);
 assert.equal((await u.visit('renamed')).status,404);
});

test('WEB-013 aliases go dark on unpublish and revive only after explicit republish',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 assert.equal((await u.publish(2,'renamed')).status,200);
 assert.equal((await f.edit({pageId:'p',action:'unpublish'})).status,200);
 assert.equal((await u.visit('p')).status,404);
 assert.equal((await u.visit('renamed')).status,404);
 assert.equal((await u.publish(3,'republished')).status,200);
 assert.equal((await u.visit('p')).status,308);
});

test('WEB-013 archived alias stays reserved but returns 404 until explicit republish after restore',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 const json=JSON.stringify(f.document('other','q'));
 f.db.prepare('INSERT INTO pages(id,site_id,slug,title,description,content_json,is_published,sort_order) VALUES(?,?,?,?,?,?,0,1)').run('q','site-default','q','Q','',json);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 assert.equal((await u.publish(2,'renamed')).status,200);
 const action=action=>adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'p',action})}),f.env);
 assert.equal((await action('archive')).status,200);
 assert.equal((await u.visit('p')).status,404);
 assert.equal(f.db.prepare('SELECT COUNT(*) n FROM page_slug_redirects WHERE from_slug=?').get('p').n,1);
 assert.equal((await action('restore')).status,200);
 assert.equal((await u.visit('p')).status,404,'restore does not publish');
 assert.equal((await u.publish(3,'republished')).status,200);
 assert.equal((await u.visit('p')).headers.get('Location'),'/p/renamed');
});

test('legacy border and background colors with Inspector overrides survive separate Save and Publish',async t=>{
 const f=await fixture(t),document=f.document('original');
 const page=document.pages.p;page.nodes.root.children=['legacy'];
 page.nodes.legacy={id:'legacy',type:'divider',name:'Legacy',parentId:'root',children:[],props:{},style:{border:'7px solid red',background:'#f00'},responsive:{desktop:{borderStyle:'dashed',borderWidth:'3px',borderColor:'#0000ff',backgroundColor:'#0000ff'}},metadata:{inspectorStyleContract:{version:1,fields:['desktop:backgroundColor','desktop:borderColor','desktop:borderStyle','desktop:borderWidth']}}};
 const saved=await f.edit({pageId:'p',expectedVersion:1,document,publish:false});
 assert.equal(saved.status,200,'the editor accepts the legacy style as a draft');
 let stored=f.db.prepare("SELECT content_json,published_content_json FROM pages WHERE id='p'").get();
 assert.deepEqual(JSON.parse(stored.content_json).pages.p.nodes.legacy.style,{border:'7px solid red',background:'#f00'});
 assert.equal(JSON.parse(stored.published_content_json).pages.p.nodes.legacy,undefined,'Save keeps the previously published snapshot');
 const published=await f.edit({pageId:'p',expectedVersion:2,document,publish:true});
 assert.equal(published.status,200,'the Inspector-tracked overrides pass production publication validation');
 stored=f.db.prepare("SELECT published_content_json FROM pages WHERE id='p'").get();
 const node=JSON.parse(stored.published_content_json).pages.p.nodes.legacy;
 assert.deepEqual(node.style,{border:'7px solid red',background:'#f00'});
 assert.deepEqual(node.responsive.desktop,{borderStyle:'dashed',borderWidth:'3px',borderColor:'#0000ff',backgroundColor:'#0000ff'});
});
