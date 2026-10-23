// Uses the same local D1 adapter as Wrangler 4.130.0. No remote access.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
const fixture = JSON.parse(execFileSync('python3', ['-c', `
import json,sqlite3
from pathlib import Path
root=Path.cwd()
e=json.loads((root/'docs/evidence/d1-ledger-preflight.json').read_text())
q=lambda s:"'"+s.replace("'","''")+"'"
objects=e['result'][0]['results']
setup=[o['sql'] for kind in ('table','index','trigger','view') for o in objects if o['type']==kind and not o['name'].startswith('_cf_')]
setup += ["INSERT INTO d1_migrations(id,name,applied_at) VALUES(%s,%s,%s)"%(r['id'],q(r['name']),q(r['applied_at'])) for r in e['result'][1]['results']]
setup += ["INSERT INTO sites(id,slug,name) VALUES('site-default','default','Fixture')", "INSERT INTO site_domains(hostname,site_id,status,verified_at,verification_method) VALUES('sanci9517-streamer-brand.sandor-bogadi95.workers.dev','site-default','verified','2026-10-17','cloudflare-worker-route')"]
statements=[]; buffer=''
for line in (root/'scripts/d1/reconcile-0025-0028.sql').read_text().splitlines(True):
 buffer+=line
 if sqlite3.complete_statement(buffer): statements.append(buffer); buffer=''
assert not buffer.strip()
print(json.dumps({'setup':setup,'statements':statements}))
`], {encoding:'utf8'}));
const mf = new Miniflare(convertV4MiniflareOptions({modules:true,script:'',d1Databases:{DB:'ledger-fixture'}}));
try {
 const db=await mf.getD1Database('DB');
 const batch=sql=>db.batch(sql.map(s=>db.prepare(s)));
 const count=async()=> (await db.prepare('SELECT COUNT(*) n FROM d1_migrations').first()).n;
 await batch(fixture.setup);
 await batch(fixture.statements);
 assert.equal(await count(),34);
 const first=await db.prepare('SELECT * FROM d1_migrations ORDER BY id').all();
 await batch(fixture.statements);
 assert.deepEqual((await db.prepare('SELECT * FROM d1_migrations ORDER BY id').all()).results,first.results);
 await db.prepare("DELETE FROM d1_migrations WHERE name GLOB '002[5-8]*'").run();
 await assert.rejects(batch([...fixture.statements,"INSERT INTO d1_migrations(name) VALUES('0024_page_slug_redirects.sql')"]));
 assert.equal(await count(),30,'late batch failure must roll back all four ledger inserts');
 await db.prepare('DROP TRIGGER media_archive_pages_update_guard').run();
 await assert.rejects(batch(fixture.statements));
 assert.equal(await count(),30);
 assert.equal(await db.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE name='__ledger_reconcile_guard'").first('n'),0);
 console.log('PASS: local D1 actual reconciliation, idempotence, late failure rollback and schema drift rejection');
} finally { await mf.dispose(); }
