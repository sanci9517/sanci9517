# D-06 / 0029 — manual-only release verification record (2026-11-13)

**Not a second development plan.** The only product roadmap is `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`. This is evidence and an operational safety gate, not a release instruction to run now.

## Prepared, not deployed

The SQL candidate `tests/fixtures/media-archive-casefold-0029.sql` updates the three previously installed 0028 archived-media guards to use `instr(lower(...),lower(m.id))`, and inserts exactly one `0029_media_archive_casefold_guards.sql` record into `d1_migrations`. It does not change the immutable 0028 migration, delete R2 objects, or modify Editor Save/Publish.

It is deliberately in `tests/fixtures/`, not a Wrangler migration directory or release script. In particular, **never execute this file line-by-line or in unverified Cloudflare REST /query calls**: its precondition staging, trigger DROP/CREATE, ledger insert and cleanup must all succeed or all roll back. The precondition only checks expected trigger shapes, not cryptographic identity: compare the exact three live `sqlite_master.sql` sources against the 0028 source in a separate fresh read-only review before any approved action.

## Verified

- `node --test tests/media-archive-trigger-casefold.test.js` with Node v22.16.0 and isolated `node:sqlite`: **5/5 PASS**. Cases: absent 0028 lineage, existing 0029 marker/tampered trigger, uppercase references across draft/published/update/revisions while preserving site boundaries, and late-failure full rollback including ledger.
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

## Additional JSON Unicode-escape audit — 2026-11-13

A real isolated SQLite bypass was reproduced against the earlier casefold-only candidate: a stored JSON string like `{"assetId":"\\u00611b2c3d4-..."}` decodes to the archived UUID but the raw `instr(lower(json),lower(id))` guard missed it. The replacement candidate inspects decoded JSON string leaves via `json_tree()` only when a raw `\\u` sequence occurs, with `json_valid()` fallback for malformed legacy text. All three page insert/update and revision guards are protected. The new fifth isolated Node.js test demonstrates rejection for both drafts and published snapshots, page updates, revisions, plus cross-site and unrelated-escape acceptance. `node --test tests/media-archive-trigger-casefold.test.js` **5/5 PASS**; `node --test tests/media-retention-migration.test.js` **6/6 PASS**.

**Open linked runtime gap:** Existing production `src/routes/admin/media.ts` usage-index and public-media SQL prefilters, its archive atomic UPDATE, and `src/core/media-retention-queries.js` still only seek raw UUID text. A JSON Unicode-escaped UUID can therefore evade their candidate scan and archive/retention safeguards. The offline 0029 trigger upgrade alone cannot close this full lifecycle gap. Do **not** apply 0029 to production until those runtime query paths are repaired and negative 200/404/409/site-scope tests pass. Cloudflare D1 atomic DDL and isolated restore remain UNVERIFIED. No production mutation is justified from these local tests.

## Isolated Cloudflare D1 atomic REST and Time Travel proof — 2026-11-13

An actual disposable Cloudflare D1 database (NOT production) was initialized with the old 0028 DDL and migration ledger. The exact latest 0029 candidate was run through `POST /query` multi-statement SQL with an intentionally failing final statement. HTTP 400 followed; read-only inspection proved that the 0029 marker and all three trigger replacements had rolled back. The same exact candidate then successfully applied in 10 statements: 0029 ledger once and 3 decoded JSON guards. Rejected same-site uppercase and `\\u`-escaped archived references; allowed other site and unrelated text. An actual isolated Time Travel restore to the pre-0029 bookmark restored the original three guards and removed 0029 and test media rows. The throwaway D1 was then deleted, leaving only the production D1.

This closes the empirical REST execution/rollback and isolated Time Travel drill gates **for the tested route**. It does **not** demonstrate a verified **full production export + independent restore of that export**, nor production readiness under live concurrency. A full production export can temporarily block live D1 query service according to Cloudflare's API documentation; do not initiate it casually. Production trigger replacement remains NOT APPROVED/NOT APPLIED while the exact production backup/restore procedure and #334 runtime CI/release remain open. Machine record: `docs/evidence/editor-d06-cloudflare-isolated-atomic-2026-11-13.json`.
