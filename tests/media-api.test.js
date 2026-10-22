import assert from "node:assert/strict";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { adminMediaRoute, publishedMediaRoute } from "../src/routes/admin/media.ts";
import { hashSessionToken } from "../src/core/auth/session.ts";

const png = Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1]);
const gif = new TextEncoder().encode("GIF89aTEST");
const wav = Uint8Array.from([82,73,70,70,0,0,0,0,87,65,86,69,102,109,116,32]);
const webm = Uint8Array.from([0x1a,0x45,0xdf,0xa3,0x93,0x42,0x82,0x84]);

async function fixture(t) {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec([
    "CREATE TABLE sites(id TEXT PRIMARY KEY,status TEXT NOT NULL);",
    "INSERT INTO sites VALUES('site-default','active'),('other','active');",
    "CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);",
    "CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);",
    "CREATE TABLE site_memberships(site_id TEXT,user_id TEXT,role TEXT,status TEXT);",
    "CREATE TABLE media(id TEXT PRIMARY KEY, object_key TEXT UNIQUE NOT NULL,",
    "original_name TEXT NOT NULL, mime_type TEXT NOT NULL, size_bytes INTEGER NOT NULL,",
    "alt_text TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "site_id TEXT NOT NULL, archived_at TEXT DEFAULT NULL);",
    "CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,archived_at TEXT,is_published INTEGER,published_content_json TEXT,content_json TEXT,title TEXT,slug TEXT);",
    "CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT);",
    "CREATE INDEX idx_media_site_id ON media(site_id);",
    "CREATE TRIGGER media_archive_pages_insert_guard BEFORE INSERT ON pages WHEN EXISTS (SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL AND (instr(COALESCE(NEW.content_json,''),m.id)>0 OR instr(COALESCE(NEW.published_content_json,''),m.id)>0)) BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;",
    "CREATE TRIGGER media_archive_pages_update_guard BEFORE UPDATE OF content_json,published_content_json ON pages WHEN EXISTS (SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL AND (instr(COALESCE(NEW.content_json,''),m.id)>0 OR instr(COALESCE(NEW.published_content_json,''),m.id)>0)) BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;",
    "CREATE TRIGGER media_archive_revisions_insert_guard BEFORE INSERT ON editor_revisions WHEN EXISTS (SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL AND instr(NEW.document_json,m.id)>0) BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;"
  ].join("\n"));
  for (const role of ["editor","viewer"]) {
    db.prepare("INSERT INTO users VALUES (?,?,?,?,1)").run(role,role+"@test.local",role,role);
    db.prepare("INSERT INTO site_memberships VALUES (?,?,?,'active')").run("site-default",role,role);
    db.prepare("INSERT INTO sessions VALUES (?,?,?)").run(await hashSessionToken(role),role,"2999-01-01");
  }
  const files = new Map();
  const bucket = {
    async put(key,bytes) { files.set(key,Uint8Array.from(bytes)); },
    async get(key) { const bytes=files.get(key); return bytes ? {body:new Blob([bytes]).stream()} : null; },
    async delete(key) { files.delete(key); },
    async head(key) { return files.has(key) ? {size:files.get(key).length} : null; },
    async list({prefix,limit,cursor}) {
      const keys=[...files.keys()].filter(key=>key.startsWith(prefix)).sort();
      const start=cursor?Number(cursor):0;
      const slice=keys.slice(start,start+limit);
      const next=start+slice.length;
      return {objects:slice.map(key=>({key})),truncated:next<keys.length,cursor:String(next)};
    }
  };
  const env = { SITE_MEMBERSHIP_ENFORCEMENT:"enabled", MEDIA:bucket, DB:{
    prepare(sql) {
      const stmt=db.prepare(sql);let args=[];
      return {
        bind(...values) { args=values;return this; },
        async first() { return stmt.get(...args)||null; },
        async all() { return { results:stmt.all(...args) }; },
        async run() { return {meta:{changes:stmt.run(...args).changes}}; }
      };
    }
  }};
  const call = (method,role="editor",body=null,opts={}) => {
    const url=new URL("https://example.test/api/admin/media");
    if(opts.id)url.searchParams.set("id",opts.id);
    if(opts.name)url.searchParams.set("name",opts.name);
    if(opts.q)url.searchParams.set("q",opts.q);
    if(opts.before!==undefined)url.searchParams.set("before",opts.before);
    if(opts.limit!==undefined)url.searchParams.set("limit",String(opts.limit));
    if(opts.state)url.searchParams.set("state",opts.state);
    if(opts.usage)url.searchParams.set("usage",opts.usage);
    if(opts.mime)url.searchParams.set("mime",opts.mime);
    if(opts.orphanAudit)url.searchParams.set("orphanAudit","1");
    if(opts.missingAudit)url.searchParams.set("missingAudit","1");
    if(opts.cursor!==undefined)url.searchParams.set("cursor",opts.cursor);
    const headers = new Headers();
    if(role)headers.set("Cookie","sanci9517_session="+role);
    if(method==="POST"||method==="PATCH") { headers.set("Origin",opts.origin||url.origin);headers.set("Content-Type",opts.contentType||(method==="PATCH"?"application/json":"image/png")); }
    return adminMediaRoute(new Request(url,{method,headers,...(body?{body}: {})}),env,opts.site||"site-default");
  };
  return {db,env,files,call};
}

test("authenticated image upload produces private asset and site-scoped listing",async t=>{
  const f=await fixture(t);
  const result=await f.call("POST","editor",png,{name:"avatar.png"});
  assert.equal(result.status,201);
  const asset=(await result.json()).data;
  assert.ok(/^[a-f0-9-]{36}$/.test(asset.id));
  assert.equal(f.files.size,1);
  assert.equal(f.db.prepare("SELECT site_id FROM media").get().site_id,"site-default");
  const list=await f.call("GET");
  assert.equal((await list.json()).data.assets.length,1);
  const blob=await f.call("GET","editor",null,{id:asset.id});
  assert.equal(blob.status,200);
  assert.equal(blob.headers.get("X-Content-Type-Options"),"nosniff");
  assert.equal(blob.headers.get("Cache-Control"),"private, no-store");
  assert.deepEqual(new Uint8Array(await blob.arrayBuffer()),png);
  assert.equal((await f.call("GET","editor",null,{id:asset.id,site:"other"})).status,403);
});

test("authenticated playable media remains site-scoped and becomes public only through its matching rendered node",async t=>{
  const f=await fixture(t);
  const uploaded=await f.call("POST","editor",webm,{name:"intro.webm",contentType:"video/webm"});
  assert.equal(uploaded.status,201);
  const video=(await uploaded.json()).data;
  const audioUpload=await f.call("POST","editor",wav,{name:"theme.wav",contentType:"audio/wav"});
  assert.equal(audioUpload.status,201);
  const audio=(await audioUpload.json()).data;
  assert.equal((await f.call("POST","editor",webm,{name:"wrong.mp3",contentType:"audio/mpeg"})).status,415,"declared type cannot override the binary signature");
  const videos=(await (await f.call("GET","editor",null,{mime:"video"})).json()).data.assets;
  const sounds=(await (await f.call("GET","editor",null,{mime:"audio"})).json()).data.assets;
  assert.deepEqual(videos.map(asset=>asset.id),[video.id]);
  assert.deepEqual(sounds.map(asset=>asset.id),[audio.id]);
  const publish=nodes=>f.db.prepare("INSERT INTO pages (id,site_id,archived_at,is_published,published_content_json,content_json,title,slug) VALUES(?,?,?,?,?,?,?,?)").run("playable-page","site-default",null,1,JSON.stringify({pages:{"playable-page":{rootId:"root",nodes:{root:{type:"root",children:Object.keys(nodes)},...nodes}}}}),"{}","Playable","playable");
  publish({movie:{type:"video",metadata:{editorContentVersion:1},props:{assetId:video.id}}});
  const videoDelivery=await publishedMediaRoute(new Request("https://example.test/media/"+video.id),f.env,"site-default",video.id);
  assert.equal(videoDelivery.status,200);
  assert.equal(videoDelivery.headers.get("Content-Type"),"video/webm");
  assert.deepEqual(new Uint8Array(await videoDelivery.arrayBuffer()),webm);
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+audio.id),f.env,"site-default",audio.id)).status,404,"unreferenced audio stays private");
  f.db.prepare("UPDATE pages SET published_content_json=? WHERE id='playable-page'").run(JSON.stringify({pages:{"playable-page":{rootId:"root",nodes:{root:{type:"root",children:["wrong"]},wrong:{type:"audio",metadata:{editorContentVersion:1},props:{assetId:video.id}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+video.id),f.env,"site-default",video.id)).status,404,"a video asset cannot be exposed through an audio node");
});


test("site quota telemetry includes archived assets, excludes other sites and is filter-independent",async t=>{
  const f=await fixture(t);
  f.db.prepare("INSERT INTO site_memberships VALUES('other','editor','editor','active')").run();
  const initial=(await (await f.call("GET")).json()).data;
  assert.deepEqual(initial.quota,{usedBytes:0,archivedBytes:0,activeBytes:0,remainingBytes:5_000_000_000});
  const image=(await (await f.call("POST","editor",png,{name:"quota.png"})).json()).data;
  await f.call("POST","editor",gif,{name:"other.gif",contentType:"image/gif",site:"other"});
  const active=(await (await f.call("GET","editor",null,{q:"no-match"})).json()).data;
  assert.equal(active.assets.length,0);
  assert.deepEqual(active.quota,{usedBytes:png.length,archivedBytes:0,activeBytes:png.length,remainingBytes:5_000_000_000-png.length});
  assert.equal((await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:image.id})).status,200);
  const archived=(await (await f.call("GET","editor",null,{state:"archived"})).json()).data;
  assert.deepEqual(archived.quota,{usedBytes:png.length,archivedBytes:png.length,activeBytes:0,remainingBytes:5_000_000_000-png.length});
  const other=(await (await f.call("GET","editor",null,{site:"other"})).json()).data;
  assert.equal(other.quota.usedBytes,gif.length);
  assert.equal(other.quota.archivedBytes,0);
});

test("media list cursor can reach every image beyond 50 while remaining site- and state-scoped",async t=>{
  const f=await fixture(t);
  const assetId=index=>`00000000-0000-4000-8000-${String(index).padStart(12,'0')}`;
  const insert=(id,name,site="site-default",archived=null)=>{
    f.db.prepare("INSERT INTO media(id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,site_id,archived_at) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(id,"objects/"+id,name,"image/png",png.length,"", "2026-10-21 10:00:00",site,archived);
  };
  for(let index=0;index<117;index++)insert(assetId(index),`artwork-${index}.png`);
  const crossSite=assetId(999),archived=assetId(998);
  insert(crossSite,"cross-site.png","other");
  insert(archived,"archived.png","site-default","2026-10-21 10:01:00");
  const seen=[];
  let before=null,rounds=0;
  do{
    const response=await f.call("GET","editor",null,before?{before}:{});
    assert.equal(response.status,200);
    const {assets,nextCursor}= (await response.json()).data;
    assert.ok(assets.length>0 && assets.length<=50);
    seen.push(...assets.map(asset=>asset.id));
    before=nextCursor;rounds++;
    assert.ok(rounds<6,"cursor must terminate, not loop at timestamp ties");
  }while(before);
  assert.deepEqual(seen,Array.from({length:117},(_,i)=>assetId(116-i)),
    "identical created_at timestamps must paginate by the ID tiebreaker with no duplicates or omissions");
  assert.equal(rounds,3);
  assert.equal((await (await f.call("GET","editor",null,{q:"artwork-11",limit:10})).json()).data.assets.length,8,
    "a new filtered query starts from the beginning rather than an old cursor");
  const malformed=await f.call("GET","editor",null,{before:"../private"});
  assert.equal(malformed.status,400);
  assert.equal((await malformed.json()).error.code,"INVALID_MEDIA_CURSOR");
  for(const inaccessible of [crossSite,archived,assetId(997)]){
    const result=await f.call("GET","editor",null,{before:inaccessible});
    assert.equal(result.status,400,"cross-site, archived and missing anchors cannot be used as active cursors");
  }
  assert.equal((await f.call("GET","viewer",null,{before:assetId(100)})).status,403);
  const archivedPage=(await (await f.call("GET","editor",null,{state:"archived"})).json()).data;
  assert.equal(archivedPage.assets.length,1);
  assert.equal(archivedPage.assets[0].id,archived);
  assert.equal(archivedPage.nextCursor,null);
});

test("repeated image content reuses the same site asset without extra R2 storage or losing metadata",async t=>{
  const f=await fixture(t);
  const first=await f.call("POST","editor",png,{name:"first.png"});
  assert.equal(first.status,201);
  const original=(await first.json()).data;
  assert.equal(original.duplicate,false);
  await f.call("PATCH","editor",JSON.stringify({altText:"Egyedi képleírás"}),{id:original.id});
  const same=await f.call("POST","editor",png,{name:"renamed.png"});
  assert.equal(same.status,200);
  const reused=(await same.json()).data;
  assert.equal(reused.id,original.id);
  assert.equal(reused.name,"first.png","duplicate must retain the original name");
  assert.equal(reused.altText,"Egyedi képleírás","duplicate must retain metadata");
  assert.equal(reused.duplicate,true);
  assert.equal(f.files.size,1,"sequential duplicate must not create another R2 object");
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM media").get().n,1,"one D1 asset reference");
  const changed=Uint8Array.from(png);changed[changed.length-1]^=1;
  const second=await f.call("POST","editor",changed,{name:"different.png"});
  assert.equal(second.status,201);
  assert.notEqual((await second.json()).data.id,original.id,"different binary content must create a distinct asset");
  assert.equal(f.files.size,2);
});

test("fingerprints are site-scoped and parallel uploads clean up only their losing R2 object",async t=>{
  const f=await fixture(t);
  f.db.prepare("INSERT INTO site_memberships VALUES('other','editor','editor','active')").run();
  const other=await f.call("POST","editor",png,{name:"other.png",site:"other"});
  assert.equal(other.status,201);
  const original=(await other.json()).data;
  const a=await f.call("POST","editor",png,{name:"first.png"});
  assert.equal(a.status,201);
  const secondSite=(await a.json()).data;
  assert.notEqual(original.id,secondSite.id,"cross-site identical content needs an unrelated asset ID");
  assert.equal(f.files.size,2);
  const concurrent=await Promise.all([
    f.call("POST","editor",gif,{name:"a.gif",contentType:"image/gif"}),
    f.call("POST","editor",gif,{name:"b.gif",contentType:"image/gif"})
  ]);
  assert.deepEqual(concurrent.map(x=>x.status).sort(),[200,201]);
  const assets=await Promise.all(concurrent.map(x=>x.json()));
  assert.equal(assets[0].data.id,assets[1].data.id);
  assert.equal(f.files.size,3,"parallel duplicate loser must remove only its random R2 object");
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM media").get().n,3);
  const read=await f.call("GET","editor",null,{id:assets[0].data.id});
  assert.equal(read.status,200);
  assert.deepEqual(new Uint8Array(await read.arrayBuffer()),gif);
});

test("a stale object or inaccessible cross-site match must never become duplicate success",async t=>{
  const f=await fixture(t);
  const first=await f.call("POST","editor",png,{name:"original.png"});
  const id=(await first.json()).data.id;
  const key=f.db.prepare("SELECT object_key FROM media WHERE id=?").get(id).object_key;
  f.files.delete(key);
  const duplicate=await f.call("POST","editor",png,{name:"again.png"});
  assert.equal(duplicate.status,409,"do not return success when stored asset is missing");
  assert.equal((await duplicate.json()).error.code,"MEDIA_DUPLICATE_CONFLICT");
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM media").get().n,1);
  assert.equal(f.files.size,0);
});


test("a D1 acknowledgement lost after commit must not delete the successfully stored image",async t=>{
  const f=await fixture(t);
  const originalPrepare=f.env.DB.prepare;
  let injected=false;
  f.env.DB.prepare=sql=>{
    const statement=originalPrepare(sql);
    if(sql.startsWith("INSERT INTO media(")) {
      const oldRun=statement.run;
      statement.run=async()=>{
        const result=await oldRun();
        if(!injected){injected=true;throw new Error("lost acknowledgement after D1 commit");}
        return result;
      };
    }
    return statement;
  };
  const response=await f.call("POST","editor",png,{name:"committed.png"});
  assert.equal(response.status,201);
  const asset=(await response.json()).data;
  assert.equal(asset.duplicate,false);
  assert.equal(f.files.size,1,"the already committed R2 object must not be deleted");
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM media").get().n,1);
  const read=await f.call("GET","editor",null,{id:asset.id});
  assert.equal(read.status,200);
  assert.deepEqual(new Uint8Array(await read.arrayBuffer()),png);
});


test("archived media stays in R2 and quota, disappears from picker and returns with identity and metadata",async t=>{
 const f=await fixture(t);
 const created=await f.call("POST","editor",png,{name:"archive.png"});
 const asset=(await created.json()).data;
 const renamed=await f.call("PATCH","editor",JSON.stringify({altText:"Megőrzött képleírás"}),{id:asset.id});
 assert.equal(renamed.status,200);
 const archived=await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:asset.id});
 assert.equal(archived.status,200);
 assert.equal((await archived.json()).data.archived,true);
 assert.equal(f.files.size,1);
 assert.equal(f.db.prepare("SELECT SUM(size_bytes) AS total FROM media").get().total,png.length,"archived objects retain storage quota");
 assert.equal((await (await f.call("GET")).json()).data.assets.length,0,"default picker sees active only");
 const list=await f.call("GET","editor",null,{state:"archived"});
 assert.equal(list.status,200);
 const archivedAssets=(await list.json()).data.assets;
 assert.equal(archivedAssets.length,1);
 assert.equal(archivedAssets[0].id,asset.id);
 assert.ok(archivedAssets[0].archivedAt);
 assert.equal(archivedAssets[0].altText,"Megőrzött képleírás");
 assert.equal((await f.call("GET","editor",null,{id:asset.id})).status,200,"editor can preview an archived asset for restoration");
 assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404);
 const repeated=await f.call("POST","editor",png,{name:"retry.png"});
 assert.equal(repeated.status,409,"same archived content must not silently restore or re-upload");
 assert.equal((await repeated.json()).error.code,"MEDIA_ARCHIVED_EXISTS");
 assert.equal(f.files.size,1);
 const restored=await f.call("PATCH","editor",JSON.stringify({archived:false}),{id:asset.id});
 assert.equal(restored.status,200);
 assert.equal((await restored.json()).data.changed,true);
 assert.equal((await (await f.call("GET")).json()).data.assets[0].id,asset.id);
 assert.equal((await (await f.call("GET","editor",null,{state:"archived"})).json()).data.assets.length,0);
 assert.equal(f.db.prepare("SELECT alt_text FROM media WHERE id=?").get(asset.id).alt_text,"Megőrzött képleírás");
 const restoreAgain=await f.call("PATCH","editor",JSON.stringify({archived:false}),{id:asset.id});
 assert.equal((await restoreAgain.json()).data.changed,false);
});

test("archive refuses any live, draft, old revision or unverified usage and remains site-scoped",async t=>{
 const f=await fixture(t);
 const created=await f.call("POST","editor",png,{name:"used.png"});
 const asset=(await created.json()).data;
 const json=nodes=>JSON.stringify({pages:{"page-1":{nodes}}});
 const refs=json({picture:{type:"image",props:{assetId:asset.id}}});
 f.db.prepare("INSERT INTO pages (id,site_id,archived_at,is_published,published_content_json,content_json,title,slug) VALUES (?,?,?,?,?,?,?,?)").run("page-1","site-default",null,1,refs,"{}","Használt kép","used");
 assert.equal((await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:asset.id})).status,409,"published image cannot be archived");
 f.db.prepare("UPDATE pages SET is_published=0,published_content_json=NULL,content_json=?").run(refs);
 assert.equal((await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:asset.id})).status,409,"draft image cannot be archived");
 f.db.prepare("UPDATE pages SET content_json='{}'").run();
 f.db.prepare("INSERT INTO editor_revisions VALUES (?,?,?,?)").run("rev-1","page-1",1,refs);
 assert.equal((await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:asset.id})).status,409,"historical references cannot be broken");
 f.db.prepare("DELETE FROM editor_revisions").run();
 f.db.prepare("UPDATE pages SET content_json=?").run("{not-json "+asset.id);
 assert.equal((await (await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:asset.id})).json()).error.code,"MEDIA_USAGE_INCOMPLETE");
 assert.equal(f.db.prepare("SELECT archived_at FROM media").get().archived_at,null);
 f.db.prepare("UPDATE pages SET content_json='{}'").run();
 assert.equal((await f.call("PATCH","viewer",JSON.stringify({archived:true}),{id:asset.id})).status,403);
 assert.equal((await f.call("PATCH","",JSON.stringify({archived:true}),{id:asset.id})).status,401);
 assert.equal((await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:asset.id,site:"other"})).status,403);
 assert.equal((await f.call("PATCH","editor",JSON.stringify({archived:"true"}),{id:asset.id})).status,400);
 assert.equal((await f.call("PATCH","editor",JSON.stringify({archived:true,altText:"bad"}),{id:asset.id})).status,400);
 assert.equal((await f.call("GET","editor",null,{state:"nonsense"})).status,400);
 assert.equal((await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:asset.id,origin:"https://evil.test"})).status,403);
});


test("database guards prevent creating new references to archived images after concurrent preflight",async t=>{
 const f=await fixture(t);
 const image=(await (await f.call("POST","editor",png,{name:"guard.png"})).json()).data;
 const archive=await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:image.id});
 assert.equal(archive.status,200);
 const doc=JSON.stringify({pages:{'page-1':{nodes:{photo:{props:{assetId:image.id}}}}}});
 assert.throws(()=>f.db.prepare("INSERT INTO pages (id,site_id,archived_at,is_published,published_content_json,content_json,title,slug) VALUES(?,?,?,?,?,?,?,?)").run("page-1","site-default",null,0,null,doc,"Test","test"),/ARCHIVED_MEDIA_REFERENCE/);
 f.db.prepare("INSERT INTO pages (id,site_id,archived_at,is_published,published_content_json,content_json,title,slug) VALUES(?,?,?,?,?,?,?,?)").run("page-1","site-default",null,0,null,"{}","Test","test");
 assert.throws(()=>f.db.prepare("UPDATE pages SET published_content_json=? WHERE id='page-1'").run(doc),/ARCHIVED_MEDIA_REFERENCE/);
 assert.throws(()=>f.db.prepare("INSERT INTO editor_revisions VALUES (?,?,?,?)").run("rev-block","page-1",1,doc),/ARCHIVED_MEDIA_REFERENCE/);
 assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM editor_revisions").get().n,0);
 assert.equal(f.db.prepare("SELECT content_json FROM pages WHERE id='page-1'").get().content_json,"{}");
});

test("restoring missing R2 binary fails closed, without exposing published archived media",async t=>{
 const f=await fixture(t);
 const asset=(await (await f.call("POST","editor",png,{name:"gone.png"})).json()).data;
 await f.call("PATCH","editor",JSON.stringify({archived:true}),{id:asset.id});
 const key=f.db.prepare("SELECT object_key FROM media WHERE id=?").get(asset.id).object_key;
 f.files.delete(key);
 const restored=await f.call("PATCH","editor",JSON.stringify({archived:false}),{id:asset.id});
 assert.equal(restored.status,409);
 assert.equal((await restored.json()).error.code,"MEDIA_OBJECT_MISSING");
 assert.ok(f.db.prepare("SELECT archived_at FROM media").get().archived_at);
});

test("site-scoped search, safe alt metadata and published-only delivery",async t=>{
  const f=await fixture(t);
  const uploaded=await f.call("POST","editor",png,{name:"creator portrait.png"});
  const asset=(await uploaded.json()).data;
  const media=()=>publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id);
  const tree=(nodes,root={})=>({rootId:"root",nodes:{root:{type:"root",children:Object.keys(nodes),...root},...nodes}});
  const publish=page=>f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{"page-1":page}}));
  const image={type:"image",metadata:{contentVersion:1},props:{assetId:asset.id,alt:"Portrait"}};
  const gallery={type:"gallery",metadata:{contentVersion:1},props:{items:[{assetId:asset.id,alt:"Portrait"}]}};
  const byName=await f.call("GET","editor",null,{q:"portrait"});
  assert.equal((await byName.json()).data.assets[0].id,asset.id);
  const byAlt=await f.call("PATCH","editor",JSON.stringify({altText:"Alkotó portré"}),{id:asset.id});
  assert.equal(byAlt.status,200);
  assert.equal(f.db.prepare("SELECT alt_text FROM media WHERE id=?").get(asset.id).alt_text,"Alkotó portré");
  assert.equal((await f.call("PATCH","editor",JSON.stringify({altText:"x"}),{id:asset.id,site:"other"})).status,403);
  assert.equal((await media()).status,404);
  assert.equal((await publishedMediaRoute(new Request("https://other.test/media/"+asset.id),f.env,"other",asset.id)).status,404,"an unrelated site cannot resolve this asset ID");
  f.db.prepare("INSERT INTO pages (id,site_id,archived_at,is_published,published_content_json,content_json,title,slug) VALUES('page-1','site-default',NULL,1,?,?,?,?)").run(JSON.stringify({pages:{"page-1":tree({image})}}),"{}","Page 1","page-1");
  const delivered=await media();
  assert.equal(delivered.status,200);
  assert.equal(delivered.headers.get("Cache-Control"),"public, max-age=300, s-maxage=300");
  assert.deepEqual(new Uint8Array(await delivered.arrayBuffer()),png);
  publish(tree({}));
  assert.equal((await media()).status,404,"a draft page cannot expose the asset");
  publish(tree({section:{type:"section",responsive:{desktop:{backgroundAssetId:asset.id}}}}));
  assert.equal((await media()).status,200,"a visible published background can deliver the image");
  publish(tree({image:{type:"text",props:{unused:{assetId:asset.id}}}}));
  assert.equal((await media()).status,404,"unused properties cannot expose a private image");
  publish(tree({image:{...image,visibility:{desktop:false,tablet:false,mobile:false}}}));
  assert.equal((await media()).status,404,"an entirely hidden node cannot expose its image");
  publish({rootId:"root",nodes:{root:{type:"root",children:[]},image}});
  assert.equal((await media()).status,404,"a detached node outside the published tree cannot expose its image");
  publish({nodes:{image}});
  assert.equal((await media()).status,404,"a snapshot without a root cannot expose an asset");
  publish({rootId:"missing",nodes:{image}});
  assert.equal((await media()).status,404,"a missing root node cannot expose an asset");
  publish({rootId:"root",nodes:{root:{type:"root",children:["hidden"]},hidden:{type:"section",visibility:false,children:["image"]},image}});
  assert.equal((await media()).status,404,"a hidden ancestor keeps its descendant image private");
  publish({rootId:"root",nodes:{root:{type:"root",children:["leaf"]},leaf:{type:"text",children:["image"]},image}});
  assert.equal((await media()).status,404,"a child discarded beneath a leaf cannot expose media");
  publish({rootId:"root",nodes:{root:{type:"root",children:["leaf"]},leaf:{type:"tooltip",metadata:{contentVersion:1},children:["image"]},image}});
  assert.equal((await media()).status,404,"an authored content node that discards children cannot expose media");
  publish({rootId:"root",nodes:{root:{type:"root",children:["card"]},card:{type:"card",metadata:{cardContentVersion:1},props:{cardContent:{}},children:["image"]},image}});
  assert.equal((await media()).status,404,"a malformed Card fallback cannot expose its discarded child");
  const deep={root:{type:"root",children:["section-0"]}};
  for(let depth=0;depth<40;depth++)deep[`section-${depth}`]={type:"section",children:[depth===39?"image":`section-${depth+1}`]};
  deep.image=image;
  publish({rootId:"root",nodes:deep});
  assert.equal((await media()).status,200,"a visible image deeper than 32 levels remains available");
  publish({rootId:"root",nodes:{root:{type:"root",children:["parent"]},parent:{type:"section",visibility:{desktop:true,tablet:false,mobile:false},children:["image"]},image:{...image,visibility:{desktop:false,tablet:true,mobile:true}}}});
  assert.equal((await media()).status,404,"no common visible viewport keeps a descendant image private");
  publish({rootId:"root",nodes:{root:{type:"root",children:["parent"]},parent:{type:"section",visibility:{desktop:true,tablet:false,mobile:false},children:["image"]},image}});
  assert.equal((await media()).status,200,"a descendant visible on a common viewport remains available");
  publish(tree({section:{type:"section",visibility:{desktop:true,tablet:true,mobile:false},responsive:{mobile:{backgroundAssetId:asset.id}}}}));
  assert.equal((await media()).status,404,"a mobile-only background hidden on mobile must not expose the asset");
  publish(tree({section:{type:"section",visibility:{desktop:false,tablet:false,mobile:true},responsive:{desktop:{backgroundAssetId:asset.id}}}}));
  assert.equal((await media()).status,200,"an inherited desktop background visible on mobile remains available");
  publish(tree({section:{type:"section",style:{backgroundAssetId:asset.id},responsive:{desktop:{backgroundAssetId:"none"}}}}));
  assert.equal((await media()).status,404,"a background overridden on every viewport must not expose the old asset");
  publish(tree({}, {style:{backgroundAssetId:asset.id}}));
  assert.equal((await media()).status,404,"legacy root style without opt-in cannot expose media");
  publish(tree({}, {metadata:{rootStyleVersion:1},style:{backgroundAssetId:asset.id}}));
  assert.equal((await media()).status,200,"an authored root background remains available");
  publish(tree({}, {type:"image",metadata:{contentVersion:1},props:{assetId:asset.id}}));
  assert.equal((await media()).status,404,"root content properties are not rendered as an image");
  publish(tree({image:{type:"image",props:{assetId:asset.id}}}));
  assert.equal((await media()).status,404,"legacy image props are not rendered by the authored image path");
  publish(tree({gallery:{type:"gallery",props:gallery.props}}));
  assert.equal((await media()).status,404,"legacy gallery props are not rendered by the authored gallery path");
  publish(tree({gallery}));
  assert.equal((await media()).status,200,"an authored gallery image remains available");
  publish(tree({gallery:{...gallery,props:{items:[...Array.from({length:40},()=>({alt:"Other"})),{assetId:asset.id}]}}}));
  assert.equal((await media()).status,404,"gallery items past the rendered 40-item limit stay private");
  publish(tree({section:{responsive:{desktop:{backgroundAssetId:"wrong"}}}}));
  assert.equal((await media()).status,404,"a stale background reference cannot expose the image");
  const cardNode={type:"card",metadata:{cardContentVersion:1},props:{cardContent:{version:1,title:"Alkotó",description:"",variant:"solid",imageSrc:"",imageAssetId:asset.id,imageAlt:"Portrait",actionLabel:"",actionHref:"",newWindow:false}}};
  publish(tree({card:cardNode}));
  assert.equal((await media()).status,200,"published Card asset is reachable");
  publish(tree({card:{...cardNode,props:{cardContent:{imageAssetId:asset.id}}}}));
  assert.equal((await media()).status,404,"malformed Card content renders no image");
  publish(tree({card:{...cardNode,metadata:{}}}));
  assert.equal((await media()).status,404,"legacy Card cannot expose an unvalidated asset");
  publish(tree({card:{...cardNode,type:"text"}}));
  assert.equal((await media()).status,404,"other node types cannot pretend to be a Card");
  publish({rootId:"root",nodes:{root:{type:"root",children:[]},card:cardNode}});
  assert.equal((await media()).status,404,"detached Card cannot expose a private asset");
  const posterNode={type:"video",metadata:{contentVersion:1},props:{src:"/videos/external.webm",posterAssetId:asset.id}};
  publish(tree({video:posterNode}));
  assert.equal((await media()).status,200,"published video poster is available");
  publish(tree({video:{...posterNode,props:{posterAssetId:asset.id}}}));
  assert.equal((await media()).status,404,"a video without a source renders no poster");
  publish(tree({video:{...posterNode,props:{src:"javascript:alert(1)",posterAssetId:asset.id}}}));
  assert.equal((await media()).status,404,"an unsafe video source renders no poster");
  publish(tree({video:{...posterNode,metadata:{}}}));
  assert.equal((await media()).status,404,"legacy video cannot expose unvalidated private poster");
  publish(tree({video:{...posterNode,type:"text"}}));
  assert.equal((await media()).status,404,"unrelated nodes cannot expose private poster");
  publish(tree({video:{...posterNode,visibility:{desktop:false,tablet:false,mobile:false}}}));
  assert.equal((await media()).status,404,"invisible video poster stays private");
  publish({rootId:"root",nodes:{root:{type:"root",children:[]},video:posterNode}});
  assert.equal((await media()).status,404,"unreachable video poster stays private");
  f.db.prepare("UPDATE pages SET is_published=0").run();
  assert.equal((await media()).status,404);
});

test("usage report includes exact site-scoped draft, published, archived and revision references",async t=>{
  const f=await fixture(t);
  const asset=(await (await f.call("POST","editor",png,{name:"used.png"})).json()).data;
  const doc=(pageId, nodes)=>JSON.stringify({pages:{[pageId]:{nodes}}});
  const draft=doc("page-1",{hero:{name:"Fő kép",props:{items:[{assetId:asset.id}]},responsive:{mobile:{backgroundAssetId:asset.id}}}});
  const live=doc("page-1",{hero:{name:"Fő kép",props:{assetId:asset.id}}});
  const older=doc("page-1",{hero:{name:"Fő kép",style:{backgroundAssetId:asset.id}}});
  f.db.prepare("INSERT INTO pages (id,site_id,archived_at,is_published,published_content_json,content_json,title,slug) VALUES(?,?,?,?,?,?,?,?)").run("page-1","site-default",null,1,live,draft,"Bemutatkozás","about");
  f.db.prepare("INSERT INTO editor_revisions VALUES(?,?,?,?)").run("rev-1","page-1",1,older);
  f.db.prepare("INSERT INTO pages (id,site_id,archived_at,is_published,published_content_json,content_json,title,slug) VALUES(?,?,?,?,?,?,?,?)").run("archived","site-default","2026-10-19",0,null,doc("archived",{image:{props:{assetId:asset.id}}}),"Régi oldal","old");
  f.db.prepare("INSERT INTO pages (id,site_id,archived_at,is_published,published_content_json,content_json,title,slug) VALUES(?,?,?,?,?,?,?,?)").run("other","other",null,1,doc("other",{image:{props:{assetId:asset.id}}}),doc("other",{image:{props:{assetId:asset.id}}}),"Másik oldal","other");
  const result=await f.call("GET","editor",null,{usage:asset.id});
  assert.equal(result.status,200);
  assert.equal(result.headers.get("Cache-Control"),"no-store");
  const usage=(await result.json()).data;
  assert.equal(usage.complete,true);
  assert.equal(usage.references.length,5);
  assert.deepEqual(new Set(usage.references.map(ref=>ref.source)),new Set(["draft","published","revision"]));
  assert.ok(usage.references.some(ref=>ref.path==="responsive.mobile.backgroundAssetId"&&ref.pageId==="page-1"));
  assert.ok(usage.references.some(ref=>ref.version===1&&ref.path==="style.backgroundAssetId"));
  assert.ok(usage.references.some(ref=>ref.archived&&ref.pageId==="archived"));
  assert.ok(usage.references.every(ref=>ref.pageId!=="other"));
  assert.equal((await f.call("GET","viewer",null,{usage:asset.id})).status,403);
  assert.equal((await f.call("GET","",null,{usage:asset.id})).status,401);
  assert.equal((await f.call("GET","editor",null,{usage:"not-an-id"})).status,404);
  f.db.prepare("UPDATE pages SET content_json=? WHERE id='page-1'").run(`{${asset.id}`);
  assert.equal((await (await f.call("GET","editor",null,{usage:asset.id})).json()).data.complete,false,"corrupt saved data must not produce an authoritative empty-usage report");
});

test("anonymous, viewer and cross-origin writers cannot read or create media",async t=>{
  const f=await fixture(t);
  assert.equal((await f.call("GET","")).status,401);
  assert.equal((await f.call("POST","",png,{name:"x.png"})).status,401);
  assert.equal((await f.call("GET","viewer")).status,403);
  assert.equal((await f.call("POST","viewer",png,{name:"x.png"})).status,403);
  assert.equal((await f.call("POST","editor",png,{name:"x.png",origin:"https://evil.test"})).status,403);
  assert.equal(f.files.size,0);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM media").get().n,0);
});

test("rejects invalid media names, script payloads, wrong declared types and excessive data",async t=>{
  const f=await fixture(t);
  assert.equal((await f.call("POST","editor",png)).status,400);
  assert.equal((await f.call("POST","editor",new TextEncoder().encode("<svg onload=alert(1)>"),{name:"evil.svg",contentType:"image/svg+xml"})).status,415);
  assert.equal((await f.call("POST","editor",gif,{name:"not-png.png"})).status,415);
  assert.equal((await f.call("POST","editor",new Uint8Array(4*1024*1024+1),{name:"big.png"})).status,413);
  assert.equal(f.files.size,0);
});

test("atomic D1 quota rejection deletes newly uploaded R2 object",async t=>{
  const f=await fixture(t);
  f.db.prepare("INSERT INTO media (id,object_key,original_name,mime_type,size_bytes,alt_text,site_id) VALUES (?,?,?,?,?,?,?)").run(
    "existing","sites/site-default/media/existing","large.jpg","image/jpeg",5_000_000_000,"","site-default");
  const result=await f.call("POST","editor",png,{name:"new.png"});
  assert.equal(result.status,409);
  assert.equal((await result.json()).error.code,"MEDIA_QUOTA_EXCEEDED");
  assert.equal(f.files.size,0);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM media").get().n,1);
});

test("R2 failure never registers a D1 asset; missing R2 object stays private",async t=>{
  const f=await fixture(t);
  f.env.MEDIA.put=async()=>{throw Error("storage outage")};
  assert.equal((await f.call("POST","editor",png,{name:"x.png"})).status,503);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM media").get().n,0);
  assert.equal((await f.call("GET","editor",null,{id:"00000000-0000-4000-8000-000000000000"})).status,404);
});

test("orphan audit is site-scoped, read-only and never authorizes deletion", async t => {
  const f=await fixture(t);
  const uploaded=await (await f.call("POST","editor",png,{name:"owned.png"})).json();
  assert.equal(uploaded.ok,true);
  f.files.set("sites/site-default/media/unregistered",png);
  f.files.set("sites/other/media/private",png);
  const result=await f.call("GET","editor",null,{orphanAudit:true});
  assert.equal(result.status,200);
  const report=(await result.json()).data;
  assert.equal(report.mode,"read-only");
  assert.equal(report.deletionAuthorized,false);
  assert.deepEqual(report.unregisteredCandidates,["sites/site-default/media/unregistered"]);
  assert.equal(report.checked,2);
  assert.equal(report.complete,true);
  assert.equal(f.files.size,3);
  assert.equal((await f.call("GET","viewer",null,{orphanAudit:true})).status,403);
  assert.equal((await f.call("GET","",null,{orphanAudit:true})).status,401);
  assert.equal((await f.call("GET","editor",null,{orphanAudit:true,site:"other"})).status,403);
  assert.equal((await f.call("GET","editor",null,{orphanAudit:true,cursor:"!bad"})).status,400);
});

test("orphan audit paginates large R2 listings without deleting candidates", async t => {
  const f=await fixture(t);
  for (let i=0;i<101;i++) f.files.set("sites/site-default/media/unregistered-"+String(i).padStart(3,"0"),png);
  const first=(await (await f.call("GET","editor",null,{orphanAudit:true})).json()).data;
  assert.equal(first.checked,100);
  assert.equal(first.complete,false);
  assert.equal(first.unregisteredCandidates.length,100);
  assert.ok(first.nextCursor);
  const second=(await (await f.call("GET","editor",null,{orphanAudit:true,cursor:first.nextCursor})).json()).data;
  assert.equal(second.checked,1);
  assert.equal(second.complete,true);
  assert.equal(second.unregisteredCandidates.length,1);
  assert.equal(new Set([...first.unregisteredCandidates,...second.unregisteredCandidates]).size,101);
  assert.equal(f.files.size,101);
});

test("D1-to-R2 missing audit is read-only and scoped to editor permissions",async t=>{
  const f=await fixture(t);
  const asset=(await (await f.call("POST","editor",png,{name:"media.png"})).json()).data;
  const key=f.db.prepare("SELECT object_key FROM media WHERE id=?").get(asset.id).object_key;
  const complete=await (await f.call("GET","editor",null,{missingAudit:true})).json();
  assert.equal(complete.data.checked,1);
  assert.deepEqual(complete.data.missing,[]);
  f.files.delete(key);
  const found=await (await f.call("GET","editor",null,{missingAudit:true})).json();
  assert.deepEqual(found.data.missing,[{id:asset.id,name:"media.png",archived:false}]);
  assert.equal(found.data.repairAuthorized,false);
  assert.equal(f.db.prepare("SELECT COUNT(*) n FROM media").get().n,1);
  assert.equal((await f.call("GET","viewer",null,{missingAudit:true})).status,403);
  assert.equal((await f.call("GET","",null,{missingAudit:true})).status,401);
  assert.equal((await f.call("GET","editor",null,{missingAudit:true,site:"other"})).status,403);
  assert.equal((await f.call("GET","editor",null,{missingAudit:true,before:"invalid"})).status,400);
});

test("media audits reject malformed and conflicting flags without changing data",async t=>{
  const f=await fixture(t);
  for (const query of [
    "?orphanAudit=0","?missingAudit=true","?orphanAudit=1&orphanAudit=1",
    "?missingAudit=1&missingAudit=1","?orphanAudit=1&missingAudit=1"
  ]) {
    const response=await adminMediaRoute(
      new Request("https://example.test/api/admin/media"+query,{headers:{"Cookie":"sanci9517_session=editor"}}),
      f.env,"site-default"
    );
    assert.equal(response.status,400,query);
    assert.equal((await response.json()).error.code,"INVALID_MEDIA_AUDIT");
  }
  assert.equal(f.files.size,0);
  assert.equal(f.db.prepare("SELECT COUNT(*) n FROM media").get().n,0);
});

test("D1-to-R2 missing audit paginates 101 assets without mutating records",async t=>{
  const f=await fixture(t);
  const insert=f.db.prepare("INSERT INTO media(id,object_key,original_name,mime_type,size_bytes,alt_text,site_id) VALUES(?,?,?,?,?,?,?)");
  for(let i=0;i<101;i++){
    const id="00000000-0000-4000-8000-"+String(i).padStart(12,"0");
    const key="sites/site-default/media/"+String(i);
    insert.run(id,key,"media-"+i+".png","image/png",png.length,"","site-default");
    if(i%2===0)f.files.set(key,png);
  }
  const first=(await (await f.call("GET","editor",null,{missingAudit:true})).json()).data;
  assert.equal(first.checked,100);
  assert.equal(first.complete,false);
  assert.ok(first.nextCursor);
  assert.equal(first.missing.length,50);
  const second=(await (await f.call("GET","editor",null,{missingAudit:true,before:first.nextCursor})).json()).data;
  assert.equal(second.checked,1);
  assert.equal(second.complete,true);
  assert.equal(second.missing.length,0);
  assert.equal(f.db.prepare("SELECT COUNT(*) n FROM media").get().n,101);
  assert.equal(f.files.size,51);
});
test("D1-to-R2 missing audit fails closed on storage outage",async t=>{
  const f=await fixture(t);
  await f.call("POST","editor",png,{name:"media.png"});
  f.env.MEDIA.head=async()=>{throw new Error("unavailable");};
  const response=await f.call("GET","editor",null,{missingAudit:true});
  assert.equal(response.status,503);
  assert.equal((await response.json()).error.code,"MEDIA_STORAGE_FAILED");
  assert.equal(f.db.prepare("SELECT COUNT(*) n FROM media").get().n,1);
});
