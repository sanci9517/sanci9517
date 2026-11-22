/**
 * 77.44.7.D / D-06 — review-only 0031 migration preparation.
 * Produces independently executed, idempotent SQL statements; never connects to D1.
 */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const MIGRATION_NAME='0031_media_archive_malformed_json_guard.sql';
export const FIXTURE_SHA256='6b3b00f50c1c2e4cb1f1d5fdb1f25aef6436a14f61fa96fd4cb80d5203847f64';
export const EXPECTED_NEW_TRIGGERS=Object.freeze([
 'media_archive_pages_insert_malformed_guard',
 'media_archive_pages_update_malformed_guard',
 'media_archive_revisions_insert_malformed_guard',
 'media_archive_revisions_update_malformed_guard'
]);
const sourceUrl=new URL('../fixtures/0031_media_archive_malformed_json_guard.sql',import.meta.url);

/** Returns sequential single-statement queries; triggers are inert until the final marker. */
export function build0031ReleaseStatements(){
 const source=readFileSync(sourceUrl,'utf8');
 if(createHash('sha256').update(source).digest('hex')!==FIXTURE_SHA256)
  throw new Error('D-06 0031 candidate source SHA-256 changed; independent review required');
 const body=source.split('\n').filter(line=>!line.trimStart().startsWith('--')).join('\n');
 const triggers=body.trim().split(/(?=^CREATE TRIGGER\s)/m).map(statement=>statement.trim()).filter(Boolean);
 const names=triggers.map(statement=>statement.match(/^CREATE TRIGGER IF NOT EXISTS\s+([a-z0-9_]+)/)?.[1]||null);
 if(JSON.stringify(names)!==JSON.stringify(EXPECTED_NEW_TRIGGERS)||triggers.some(statement=>!/^CREATE TRIGGER IF NOT EXISTS\s/.test(statement)||!statement.endsWith('END;')))
  throw new Error('D-06 unexpected 0031 trigger set');
 if(/\b(?:DROP\s+(?:TABLE|TRIGGER|INDEX)|DELETE\s+FROM|ALTER\s+TABLE)\b/i.test(body))
  throw new Error('D-06 0031 candidate must remain additive');
 const activation=[
  `INSERT INTO d1_migrations(name) SELECT '${MIGRATION_NAME}'`,
  'WHERE (SELECT COUNT(*) FROM d1_migrations)=36',
  " AND (SELECT name FROM d1_migrations ORDER BY id DESC LIMIT 1)='0030_media_library_organization.sql'",
  ` AND NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name='${MIGRATION_NAME}')`,
  " AND (SELECT COUNT(*) FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%')=11",
  ...triggers.map(statement=>{
   const name=statement.match(/^CREATE TRIGGER IF NOT EXISTS\s+([a-z0-9_]+)/)[1];
   const expected=statement.replace(/^CREATE TRIGGER IF NOT EXISTS\s+/,'CREATE TRIGGER ').replace(/;$/,'').replace(/'/g,"''");
   return ` AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='${name}' AND sql='${expected}')`;
  }),
  ' AND NOT EXISTS(SELECT 1 FROM pragma_foreign_key_check)',
  ';'
 ].join('\n');
 return [...triggers,activation];
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.length!==3||process.argv[2]!=='--print'){
  process.stderr.write('Usage: node tests/review/prepare-0031-release.mjs --print (review-only sequential D1 queries)\n');
  process.exitCode=2;
 }else process.stdout.write(JSON.stringify({mode:'sequential-idempotent',statements:build0031ReleaseStatements().map(sql=>({sql}))},null,2)+'\n');
}
