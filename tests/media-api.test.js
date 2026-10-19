import assert from "node:assert/strict";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { adminMediaRoute, publishedMediaRoute } from "../src/routes/admin/media.ts";
import { hashSessionToken } from "../src/core/auth/session.ts";

const png = Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1]);
const gif = new TextEncoder().encode("GIF89aTEST");

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
    "site_id TEXT NOT NULL);",
    "CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,archived_at TEXT,is_published INTEGER,published_content_json TEXT,content_json TEXT,title TEXT,slug TEXT);",
    "CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT);",
    "CREATE INDEX idx_media_site_id ON media(site_id);"
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
    async delete(key) { files.delete(key); }
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
    if(opts.usage)url.searchParams.set("usage",opts.usage);
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

test("site-scoped search, safe alt metadata and published-only delivery",async t=>{
  const f=await fixture(t);
  const uploaded=await f.call("POST","editor",png,{name:"creator portrait.png"});
  const asset=(await uploaded.json()).data;
  const byName=await f.call("GET","editor",null,{q:"portrait"});
  assert.equal((await byName.json()).data.assets[0].id,asset.id);
  const byAlt=await f.call("PATCH","editor",JSON.stringify({altText:"Alkotó portré"}),{id:asset.id});
  assert.equal(byAlt.status,200);
  assert.equal(f.db.prepare("SELECT alt_text FROM media WHERE id=?").get(asset.id).alt_text,"Alkotó portré");
  assert.equal((await f.call("PATCH","editor",JSON.stringify({altText:"x"}),{id:asset.id,site:"other"})).status,403);
  const publicUrl=await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id);
  assert.equal(publicUrl.status,404);
  assert.equal((await publishedMediaRoute(new Request("https://other.test/media/"+asset.id),f.env,"other",asset.id)).status,404,"an unrelated site cannot resolve this asset ID");
  const publishedDocument = {pages:{'page-1':{nodes:{image:{type:'image',props:{assetId:asset.id}}}}}};
  f.db.prepare("INSERT INTO pages (id,site_id,archived_at,is_published,published_content_json,content_json,title,slug) VALUES('page-1','site-default',NULL,1,?,?,?,?)").run(JSON.stringify(publishedDocument),"{}","Page 1","page-1");
  const delivered=await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id);
  assert.equal(delivered.status,200);
  assert.equal(delivered.headers.get("Cache-Control"),"public, max-age=300, s-maxage=300");
  assert.deepEqual(new Uint8Array(await delivered.arrayBuffer()),png);
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{}},'unpublished-page':{nodes:{image:{props:{assetId:asset.id}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"an unrelated draft page inside a published document cannot expose the asset");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{section:{type:'section',responsive:{desktop:{backgroundAssetId:asset.id}}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,200,"a published background reference can deliver the image");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{image:{type:'text',props:{unused:{assetId:asset.id}}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"unused properties cannot expose a private image");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{image:{type:'image',visibility:{desktop:false,tablet:false,mobile:false},props:{assetId:asset.id}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"an entirely hidden node cannot expose its image");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{rootId:'root',nodes:{root:{type:'root',children:[]},image:{type:'image',props:{assetId:asset.id}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"a detached node outside the published tree cannot expose its image");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{section:{responsive:{desktop:{backgroundAssetId:'wrong'}}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"a stale background reference cannot expose the image");
  // A Card cannot expose a private R2 asset until the exact published Card version references it.
  const cardNode={type:'card',metadata:{cardContentVersion:1},props:{cardContent:{imageAssetId:asset.id}}};
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{card:cardNode}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,200,"published Card asset is reachable");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{card:{...cardNode,metadata:{}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"legacy Card cannot expose an unvalidated asset");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{card:{...cardNode,type:'text'}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"other node types cannot pretend to be a Card");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{rootId:'root',nodes:{root:{type:'root',children:[]},card:cardNode}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"detached Card cannot expose a private asset");
  // Authored video poster uses an image asset; video playback stays an external URL.
  const posterNode={type:'video',metadata:{contentVersion:1},props:{src:'/videos/external.webm',posterAssetId:asset.id}};
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{video:posterNode}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,200,"published video poster is available");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{video:{...posterNode,metadata:{}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"legacy video cannot expose unvalidated private poster");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{video:{...posterNode,type:'text'}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"unrelated nodes cannot expose private poster");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{nodes:{video:{...posterNode,visibility:{desktop:false,tablet:false,mobile:false}}}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"invisible video poster stays private");
  f.db.prepare("UPDATE pages SET published_content_json=?").run(JSON.stringify({pages:{'page-1':{rootId:'root',nodes:{root:{type:'root',children:[]},video:posterNode}}}}));
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404,"unreachable video poster stays private");
  f.db.prepare("UPDATE pages SET is_published=0").run();
  assert.equal((await publishedMediaRoute(new Request("https://example.test/media/"+asset.id),f.env,"site-default",asset.id)).status,404);
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
  f.db.prepare("INSERT INTO media VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP,?)").run(
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
