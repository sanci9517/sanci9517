# D-06 – Schedule artwork atomic reference release evidence (2026-11-14)

**Canonical point:** `77.44.7.D / D-06`, **OPEN / NOT_CERTIFIED**. This is a verified *partial runtime release*, not full D acceptance.

## Scope
- [PR #339](https://github.com/sanci9517/sanci9517/pull/339) head `27ffde068c9be51e142538a2926c04655de261b2`.
- Verified normal two-parent GitHub merge `e09ee0b445dd65f6f532da9eb71814d04f4d98ba`; no force-push; parallel SANCI brand/editor commits retained.
- `src/core/schedule-artwork.ts` makes stale, archived, nonimage and wrong-site schedule sidecar IDs invisible to the public DTO; atomic image UPSERT rechecks site, live event, active safe-image MIME; `src/routes/admin/media.ts` final archive UPDATE atomically rejects a currently referenced schedule image. Isolated SQLite regression tests added in `tests/schedule-artwork-contract.test.js`.

## Source gates and release
- On exact PR head: F0 `43572933614` **SUCCESS**, Twitch `43572933609` **SUCCESS**, Worker release dry-run `43572933646` **SUCCESS**, Editor Core `43572933659` **SUCCESS** including full Chromium and isolated Worker+D1+R2. Full Editor manual acceptance **DEFERRED**.
- Fresh authenticated production D1 preflight was **SELECT/PRAGMA-only**: 34 migrations, last `0028_media_archive.sql`, 3 pre-existing case-sensitive media archive triggers, `PRAGMA quick_check=ok`, `foreign_key_check` 0 rows; all checks `changed_db=false`, `rows_written=0`, `changes=0`.
- Cloudflare automatic Workers Build `f4ab5c0c-f9a9-4e72-9aa6-3911af020742`: **success**; exact source commit `e09ee0b445dd65f6f532da9eb71814d04f4d98ba`, command `npm run typecheck` then `npm run deploy:safe`.
- Deployment `47ddb89d-7112-489e-96cf-577cbbf4508e`, Worker version `ff91afe8-0ab0-4875-9c70-0826f3fc324b`, **100% traffic** at verified Cloudflare readback 2026-11-14 08:15 UTC. Later legitimate brand commits can supersede the version while preserving this normal merge.
- A direct `workers.dev` production HTTP/source-byte smoke could not be independently fetched from the present network environment; **HTTP source-smoke NOT VERIFIED**. Do not confuse 100% deployment with HTTP/content proof.

## Safeguards and remaining gates
No production `0029` migration applied, no direct production D1 write or R2 deletion in this work block, no new paid resource, no redundant manual deployment. Save and Publish remain separate. The 0029 SQL literal export/import-to-isolated-restore gate, up-to-date full restore, explicit migration approval and D-01–D-07 cross-type Editor capability/lifecycle matrix remain **OPEN / BLOCKED** as previously documented.

Source traceability for the updated `src/routes/admin/media.ts` and concurrent `public/assets/page-renderer.js` was reviewed and refreshed without modifying or truncating the canonical 1.55 MB master plan. The original plan remains the sole roadmap.
