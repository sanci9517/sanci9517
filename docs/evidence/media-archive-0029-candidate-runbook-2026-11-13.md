# D-06 / 0029 — manual-only release verification record (2026-11-13)

**Not a second development plan.** The only product roadmap is `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`. This is evidence and an operational safety gate, not a release instruction to run now.

## Prepared, not deployed

The SQL candidate `tests/fixtures/media-archive-casefold-0029.sql` updates the three previously installed 0028 archived-media guards to use `instr(lower(...),lower(m.id))`, and inserts exactly one `0029_media_archive_casefold_guards.sql` record into `d1_migrations`. It does not change the immutable 0028 migration, delete R2 objects, or modify Editor Save/Publish.

It is deliberately in `tests/fixtures/`, not a Wrangler migration directory or release script. In particular, **never execute this file line-by-line or in unverified Cloudflare REST /query calls**: its precondition staging, trigger DROP/CREATE, ledger insert and cleanup must all succeed or all roll back. The precondition only checks expected trigger shapes, not cryptographic identity: compare the exact three live `sqlite_master.sql` sources against the 0028 source in a separate fresh read-only review before any approved action.

## Verified

- `node --test tests/media-archive-trigger-casefold.test.js` with Node v22.16.0 and isolated `node:sqlite`: **4/4 PASS**. Cases: absent 0028 lineage, existing 0029 marker/tampered trigger, uppercase references across draft/published/update/revisions while preserving site boundaries, and late-failure full rollback including ledger.
- Existing `npm run test:media` flow includes these four tests through `tests/media-retention-migration.test.js` import, without changing `package.json` or the production build.
- Exact local tested Git blobs: SQL `05ad3f70e9f2c75632610c103c2bc80e8761d7f7`; test `a317ed22ff9ec23f90abbb757f85ab057e86fc0c`.
- Production read-only D1 inspection: 34 ledger rows, last `0028_media_archive.sql`; 0029 count zero; 3 original case-sensitive trigger sources; `quick_check=ok`; FK violations zero; `changed_db=false`, `rows_written=0`. A Time Travel **bookmark is available**; it is not a proven export/restore drill.
- Separate prior 2026-11-13 D1/R2 check: 6 of 6 exact object key and byte-size matches, no orphan or missing objects, 0 archived assets. No asset bytes were downloaded.

## Mandatory gates before any production migration

1. Confirm explicit approval specifically covering the three production trigger replacements and their ledger entry, in addition to the general permission to continue development.
2. Produce a D1 backup/export and demonstrate isolated restore; retain a verified Time Travel point as supplementary recovery evidence, never as the sole rollback test.
3. Demonstrate **atomic DDL + ledger insertion on an isolated Cloudflare D1 instance using the exact execution path** chosen for production. The local SQLite transaction test does not establish REST /query atomicity or a production Worker Binding batch implementation. Do not assume a multi-statement HTTP POST is atomic.
4. Recheck production schema, all trigger source text, ledger, actual site ownership, integrity and any concurrent operator modifications **immediately before** the release.
5. After a verified atomic run, check all three actual trigger definitions, the one new 0029 ledger marker, `quick_check`, FK integrity and protected 409/404/200 media behavior; prove no cross-site access, no Save→Publish shortcut and no asset deletion.

The old `draft/77-44-7-d-archive-trigger-casefold-manual-20261112` branch has an earlier candidate without the new ledger-in-the-same-transaction and trigger-shape gates; **do not apply that older draft**. This new fixture is also **NOT approved for immediate production use** until the cloud-atomic and recovery tests are completed.

**Status: offline candidate test PASS, production migration NOT DONE, D-06 and full 77.44.7.D OPEN / NOT_CERTIFIED.**
