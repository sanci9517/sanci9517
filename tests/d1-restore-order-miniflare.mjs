// Synthetic export-order regression only. No remote access or production data.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/d1-export-order-miniflare.json',import.meta.url),'utf8'));
const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:'',d1Databases:{DB:'restore-order-regression'}}));
try {
 const db=await mf.getD1Database('DB');
 const batch=s=>db.batch(s.map(q=>db.prepare(q)));
 await assert.rejects(batch(fixture.original),/no such table: main.editor_revisions/);
 await batch(fixture.ordered);
 assert.deepEqual(await db.prepare('PRAGMA quick_check').raw(),[['ok']]);
 assert.deepEqual(await db.prepare('PRAGMA foreign_key_check').raw(),[]);
 assert.deepEqual(await db.prepare(fixture.schemaQuery).raw(),fixture.schema);
 for(const [table,expected] of Object.entries(fixture.tables)) {
  assert.deepEqual(await db.prepare(`SELECT * FROM ${table} ORDER BY 1`).raw(),expected);
 }
 await assert.rejects(db.prepare("UPDATE pages SET body='' WHERE id='page'").run(),/empty;body/);
 await assert.rejects(batch([
  db.prepare('PRAGMA defer_foreign_keys=ON'),
  db.prepare("UPDATE pages SET revision_id='missing-revision' WHERE id='page'")
 ]));
 assert.deepEqual(await db.prepare("SELECT revision_id FROM pages WHERE id='page'").raw(),[['revision']]);
 assert.deepEqual(await db.prepare('PRAGMA foreign_key_check').raw(),[]);
 console.log('PASS: original export-order failure reproduced; complete reordered local D1 restore, schema, data, constraints and triggers preserved');
} finally {await mf.dispose();}
