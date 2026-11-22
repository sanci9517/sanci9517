/**
 * 77.44.7.D / D-06 — review-only 0031 migration preparation.
 * Generates one atomic SQL batch; it never connects to a database.
 */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const MIGRATION_NAME='0031_media_archive_malformed_json_guard.sql';
export const FIXTURE_SHA256='0af93a5212c9ff87eed55e192d143c0f31c416f658404b40030f60b111ec559b';
export const EXPECTED_NEW_TRIGGERS=Object.freeze([
 'media_archive_pages_insert_malformed_guard',
 'media_archive_pages_update_malformed_guard',
 'media_archive_revisions_insert_malformed_guard',
 'media_archive_revisions_update_malformed_guard'
]);
const sourceUrl=new URL('../fixtures/0031_media_archive_malformed_json_guard.sql',import.meta.url);

/** Returns a one-shot batch only; no HTTP, D1 or write capability exists here. */
export function build0031ReleaseSql(){
 const source=readFileSync(sourceUrl,'utf8');
 if(createHash('sha256').update(source).digest('hex')!==FIXTURE_SHA256)
  throw new Error('D-06 0031 candidate source SHA-256 changed; independent review required');
 const body=source.split('\n').filter(line=>!line.trimStart().startsWith('--')).join('\n');
 const names=[...body.matchAll(/^CREATE TRIGGER\s+([a-z0-9_]+)/gm)].map(match=>match[1]);
 if(JSON.stringify(names)!==JSON.stringify(EXPECTED_NEW_TRIGGERS))throw new Error('D-06 unexpected 0031 trigger set');
 if(/\b(?:DROP\s+(?:TABLE|TRIGGER|INDEX)|DELETE\s+FROM|ALTER\s+TABLE)\b/i.test(body))
  throw new Error('D-06 0031 candidate must remain additive');
 const guard=[
  'CREATE TABLE __d06_0031_release_guard(ok INTEGER NOT NULL CHECK(ok=1));',
  'INSERT INTO __d06_0031_release_guard(ok) SELECT CASE WHEN',
  ' (SELECT COUNT(*) FROM d1_migrations)=36',
  " AND (SELECT name FROM d1_migrations ORDER BY id DESC LIMIT 1)='0030_media_library_organization.sql'",
  " AND NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name LIKE '0031_%')",
  " AND (SELECT COUNT(*) FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%')=7",
  ...EXPECTED_NEW_TRIGGERS.map(name=>` AND NOT EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='${name}')`),
  ' AND NOT EXISTS(SELECT 1 FROM pragma_foreign_key_check)',
  ' THEN 1 ELSE 0 END;'
 ].join('\n');
 return [
  '-- REVIEW ONLY: one atomic D1 REST /query call after exact preflight and owner approval.',
  '-- No production migration is run by this generator or deploy:safe.',
  guard,body.trim(),
  `INSERT INTO d1_migrations(name) VALUES('${MIGRATION_NAME}');`,
  'DROP TABLE __d06_0031_release_guard;',''
 ].join('\n');
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.length!==3||process.argv[2]!=='--print'){
  process.stderr.write('Usage: node tests/review/prepare-0031-release.mjs --print (review only)\n');
  process.exitCode=2;
 }else process.stdout.write(build0031ReleaseSql());
}
