# 77.44.7.D / D-06 — #342 atomic Schedule artwork success-audit production evidence (2026-11-14)

**Current acceptance: OPEN / NOT_CERTIFIED.** This evidence certifies the narrow runtime fix, not the full 0029 migration or the D-01–D-07 Editor acceptance matrix.

## Git and verified behavior
- [PR #342](https://github.com/sanci9517/sanci9517/pull/342), exact reviewed head `ba70bc8a6ca50c03c4057c2dcc4804ba93dc647b`; normal two-parent merge `9994fe2c3b89ffb77fb02530e72cfe9a1bc98c3e`, preserving earlier and parallel work.
- Schedule image UPSERT and its audit now execute in the same D1 atomic batch. A second `INSERT ... SELECT ... WHERE EXISTS` checks that the event and active same-site media and exact committed sidecar still exist; zero committed UPSERT or removed event means **zero false successful audit rows**, returned 409. Idempotent clear is logged as an authorized request only while the event still exists. Existing Save and Publish remain independent.
- Targeted isolated SQLite tests verify normal [1 write,1 audit], archived-image race [0,0], missing-event [0,0], other-site denial and valid clear; no production data was written for these regressions.

## Exact-head release gates
- F0 baseline checks `43587129976`: **SUCCESS**.
- Twitch Integration Check `43587130009`: **SUCCESS**.
- Worker release dry-run `43587129929`: **SUCCESS**.
- Editor Core Test `43587129992`: **SUCCESS**, including TypeScript, Editor/media suites, isolated Worker/D1/R2 and full real Chromium layout regression. An earlier PR-head `70f729da...` failed only a mis-escaped static source-test regex. Fixed by `ba70bc8a...`; all four checks re-ran and passed on the final exact head.

## Production preflight, deployment and current metadata
- Cloudflare production D1 (`sanci9517-db`) fresh read-only REST `SELECT` and `PRAGMA`: migration ledger 34, latest `0028_media_archive.sql`; `PRAGMA quick_check=ok`, `foreign_key_check` empty; every statement `changed_db=false`, `rows_written=0`. The 0029 migration has **NOT** been applied.
- Cloudflare automatic Workers Build `2b3def2f-246c-45f8-9789-3193295db2f7`, build outcome **success** from exact merged source `9994fe2c3b89ffb77fb02530e72cfe9a1bc98c3e`, command `npm run typecheck`, deploy command `npm run deploy:safe`.
- Cloudflare deployment `c2210e18-06e4-4478-a00b-11617cfd9f53`, Worker version `3687b298-4922-4a09-a9ce-edc9d7bcb37f`, **100%** traffic at verified readback, created 2026-11-14T11:14:56Z. A later legitimate release may supersede the version; this proves exactly which source was deployed.
- Additional isolated read-only D1 inventory: 23 media records (1 archived), 4 Schedule events, 1 Schedule artwork sidecar, 0 malformed sidecars, 0 invalid/dangling artwork links; original-site active administrator membership count 1. No individual or secret data exported.
- Direct `workers.dev` HTTP health/source-byte smoke is **NOT VERIFIED** (inaccessible in current tool environment); do not substitute the Cloudflare deployment receipt for a direct HTTP check.

## Remaining D-06 / D
- No production D1 schema/data mutation, no R2 deletion, no added paid resource. 0029 Unicode-safe trigger migration requires separately approved production change management, fresh backup and successful literal SQL export→isolated import/restore, and its exact release gates. Complete D-01–D-07 Editor capability/Inspector→Canvas→Save/reload→separate Publish→public/tenant lifecycle matrix remains **OPEN / NOT_CERTIFIED**; combined manual/physical Editor acceptance **DEFERRED**.
- Following [PR #343](https://github.com/sanci9517/sanci9517/pull/343) is a separate DRAFT review for Schedule site membership and inactive retention SQL guard. Its implementation/CI is **not covered by this release evidence**.
- The one canonical master plan is the unchanged 1,555,044-byte Git blob `6388d6d67f4719cfcde6000e69976c9d09d071b0`; this note is independent historical evidence, not another plan.
