/**
 * 77.44.7.D / D-06 — review-only 0029 migration preparation.
 *
 * This module has NO network, database client, or write capability.
 * It generates a one-shot, fail-closed SQL batch for independent approval.
 * Submit the complete output as ONE D1 REST /query call only after an
 * approved production backup/import gate and a new read-only preflight.
 *
 * Do not put this file or its output into migrations/; deploy:safe never
 * applies D1 schema changes. Save and Publish remain distinct.
 */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const MIGRATION_NAME='0029_media_archive_unicode_additive.sql';
export const FIXTURE_SHA256='911df535238d48bcdda3db2702bbe716c3c8e6c62c841334a0ebd143394c9ac8';
export const EXPECTED_NEW_TRIGGERS=Object.freeze([
 'media_archive_pages_insert_unicode_guard',
 'media_archive_pages_update_unicode_guard',
 'media_archive_revisions_insert_unicode_guard',
 'media_archive_revisions_update_unicode_guard'
]);
const candidateUrl=new URL('../fixtures/0029_media_archive_unicode_additive.sql',import.meta.url);

/** Returns a single D1 REST transaction batch; it NEVER executes the SQL. */
export function build0029ReleaseSql(){
 const source=readFileSync(candidateUrl,'utf8');
 const actual=createHash('sha256').update(source).digest('hex');
 if(actual!==FIXTURE_SHA256)throw new Error('D-06 0029 candidate source SHA-256 changed; independent review required');
 const uncommented=source.split('\n').filter(line=>!line.trimStart().startsWith('--')).join('\n');
 const names=[...uncommented.matchAll(/^CREATE TRIGGER\s+([a-z0-9_]+)/gm)].map(match=>match[1]);
 if(JSON.stringify(names)!==JSON.stringify(EXPECTED_NEW_TRIGGERS))throw new Error('D-06 unexpected 0029 trigger set');
 if(/\b(?:DROP\s+(?:TABLE|TRIGGER)|DELETE\s+FROM|ALTER\s+TABLE)\b/i.test(uncommented))throw new Error('D-06 0029 candidate is not additive');
 const before=[
  '-- REVIEW ONLY: one atomic D1 REST /query call; never automatic migration.',
  '-- Do not apply without explicit operation approval, off-account SQL restore evidence,',
  '-- fresh production SELECT/PRAGMA preflight, exact-head CI, and zero-cost check.',
  '-- A mismatch aborts the complete batch via CHECK(ok=1), including any DDL.',
  'CREATE TABLE __d06_0029_release_guard(ok INTEGER NOT NULL CHECK(ok=1));',
  'INSERT INTO __d06_0029_release_guard(ok)',
  'SELECT CASE WHEN',
  '  (SELECT COUNT(*) FROM d1_migrations)=34',
  "  AND (SELECT name FROM d1_migrations ORDER BY id DESC LIMIT 1)='0028_media_archive.sql'",
  "  AND NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name LIKE '0029_%')",
  "  AND (SELECT COUNT(*) FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%')=3",
  "  AND (SELECT COUNT(*) FROM sqlite_master WHERE type='trigger' AND name IN ('media_archive_pages_insert_guard','media_archive_pages_update_guard','media_archive_revisions_insert_guard'))=3",
  "  AND NOT EXISTS(SELECT 1 FROM sqlite_master WHERE name LIKE 'media_archive_%_unicode_guard')",
  '  AND NOT EXISTS(SELECT 1 FROM pragma_foreign_key_check)',
  'THEN 1 ELSE 0 END;'
 ].join('\n');
 const after=[
  "INSERT INTO d1_migrations(name) VALUES('"+MIGRATION_NAME+"');",
  'DROP TABLE __d06_0029_release_guard;'
 ].join('\n');
 return before+'\n'+uncommented.trim()+'\n'+after+'\n';
}

const runningDirectly=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(runningDirectly){
 if(process.argv.length!==3||process.argv[2]!=='--print'){
  process.stderr.write('Usage: node tests/review/prepare-0029-release.mjs --print (review only)\n');
  process.exitCode=2;
 }else process.stdout.write(build0029ReleaseSql());
}
