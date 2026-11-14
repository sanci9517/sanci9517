# 77.44.7.D / D-06 — #341 decoded Schedule artwork lifecycle production evidence (2026-11-14)

**Execution state: OPEN / NOT_CERTIFIED** (partial D-06 corrective release, not full Editor acceptance).

## Patch and exact-head proof
- [PR #341](https://github.com/sanci9517/sanci9517/pull/341), exact head `c577387ce6302a8eb786f5d888cbb7f479a7de31`, normal GitHub merge `f199efa4129fca7742fc04670dbfcbb0dd887e12`; all parallel branch work preserved.
- `src/core/schedule-artwork.ts` uses a shared decoded, casefolded, site-scoped JSON asset matcher and canonical active-image projection. `src/routes/admin/media.ts` now evaluates that same matcher in read-only media usage and public asset authorization; `tests/schedule-artwork-contract.test.js` and `tests/media-api.test.js` cover uppercase UUID, formatted JSON, JSON Unicode escape, malformed JSON, tenant isolation, public object body and archive 409.
- **Exact-head GitHub CI**: Editor Core + full Chromium + isolated Worker/D1/R2 `43575612083` **SUCCESS**, F0 `43575612085` **SUCCESS**, Twitch `43575612162` **SUCCESS**, Worker dry-run `43575612164` **SUCCESS**.

## Production zero-write gate and deployed SHA
- Production D1 (`sanci9517-db`) read-only REST `SELECT`/`PRAGMA` preflight: 34 migration entries, latest `0028_media_archive.sql`, `quick_check=ok`, `foreign_key_check` zero rows, exactly 3 existing case-sensitive `media_archive_*` triggers. Every query `changed_db=false`, `rows_written=0`, `changes=0`; no `0029` applied.
- Automated Cloudflare Workers Build `ec798418-84f6-4099-a3c4-64bc4352b696` **success**, built from exact merged commit `f199efa4129fca7742fc04670dbfcbb0dd887e12`, `npm run typecheck` and `npm run deploy:safe`. Deployment `6cfedcc0-5ade-4519-a321-272950a173d8` started 2026-11-14T08:57:44.232861Z, Worker version `e24fa716-127f-48fc-a2b1-3680639abf1c` **100%** traffic at Cloudflare verified readback. Another legitimate source release may supersede this version.
- Direct public `workers.dev` HTTP `/api/health` and asset SHA smoke **NOT VERIFIED** because the network tools could not resolve/access this domain. No claim of browser/manual production QA; the prior GitHub exact-head tests and Cloudflare rollout are separate evidence.
- Traceability SHA-256 for the two source files modified since the last crosswalk was reconciled: `public/assets/page-renderer.js` (parallel brand work) and `src/routes/admin/media.ts`. Exactly 396 feature rows, 74 source paths, no acceptance fabricated.

## Safety and next gate
The 1,555,044-byte canonical master Git blob `6388d6d67f4719cfcde6000e69976c9d09d071b0` was *reused unchanged* while adding this separate evidence. No direct production D1 write, R2 deletion, schema change or paid service; Save ≠ Publish. Pending: export SQL → independent import/restore gate; explicit 0029 schema approval; D-01 through D-07 Inspector→Canvas→Save/reload→separate Publish→public/tenant capability and media lifecycle matrix; final combined manual Editor acceptance **DEFERRED**.
