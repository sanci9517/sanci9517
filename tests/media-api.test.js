import assert from "node:assert/strict";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { adminMediaRoute } from "../src/routes/admin/media.ts";
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
    const headers = new Headers();
    if(role)headers.set("Cookie","sanci9517_session="+role);
    if(method==="POST") { headers.set("Origin",opts.origin||url.origin);headers.set("Content-Type",opts.contentType||"image/png"); }
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
