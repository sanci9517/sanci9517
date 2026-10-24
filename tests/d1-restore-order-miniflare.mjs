// Synthetic export-order regression only. No remote access or production data.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
const fixture=JSON.parse(execFileSync('python3',['-c',`
import importlib.util,json,sqlite3
from pathlib import Path
spec=importlib.util.spec_from_file_location('restore','scripts/d1/restore-order.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
source=Path('tests/fixtures/d1-export-order.sql').read_text()
ordered,_=m.ordered_export(source)
ref=sqlite3.connect(':memory:');ref.executescript(source)
query="SELECT type,name,tbl_name,sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' AND name NOT GLOB '_cf_*' ORDER BY type,name"
print(json.dumps({'original':m.statements(source)[0],'ordered':m.statements(ordered)[0],
 'schema':ref.execute(query).fetchall(),'tables':{t:ref.execute('SELECT * FROM '+t+' ORDER BY 1').fetchall() for t in ['pages','editor_revisions','events','sqlite_sequence']},'schemaQuery':query}))
`],{encoding:'utf8'}));
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
 console.log('PASS: original export-order failure reproduced; complete reordered local D1 restore, schema, data, constraints and triggers preserved');
} finally {await mf.dispose();}
