# SANCI9517 public home schedule artwork — PR #346 release evidence

**Date:** 2026-11-16 (Europe/Budapest)  
**Runtime status:** MERGED / DEPLOYED; browser acceptance beyond automated CI is not certified.  
**GitHub PR:** https://github.com/sanci9517/sanci9517/pull/346  
**Merged commit:** `69359aa120796778ad726e34976aa369106cccd7`  
**Source branch head:** `a9a11eea9d829cd237e393e8528ff24d0999745d`  

## Runtime change

The existing Editor-owned SANCI home `next-stream` countdown is decorated with the published schedule image used by the weekly timetable. The public schedule API is refreshed every 60 seconds. A current schedule record marked `live` receives an animated LIVE treatment, with upcoming-image fallback and reduced-motion support. The code validates UUID-based `/media/:id` URLs. No Editor Page Model rewrite, Save/Publish conflation, data mutation, or D1 migration was performed. This indicates **schedule status**, not independently verified real-time Twitch online state.

Changed runtime source files: `public/assets/sanci-showcase.js`, `public/assets/sanci-showcase.css`, `public/assets/page-renderer.js` and `public/visual-page.html`. Updated unit and browser tests are `tests/sanci-showcase.test.js` and `tests/browser/sanci-showcase.test.js`.

## Pre-merge release gates

- GitHub PR head `a9a11ee...`: **PASS** for `editor-core` (including Chromium showcase tests, entire editor-browser layout suite, schedule and related tests), `verify`, `twitch-integration` and `Verify Worker bundle without deploying` (Wrangler `deploy --dry-run`). Cloudflare Workers Builds: **PASS**.
- Source branch was 2 commits behind `v2/foundation`; GitHub mergeability was `clean`, and the two intervening base changes did not overlap the six PR files. No force push or branch reset. GitHub merge recorded as `69359aa...`.
- Cloudflare D1 **SELECT-only** preflight returned `changed_db=false`. The next published scheduled item was Fortnite, 2026-11-17 18:00 Europe/Budapest, with `imageAssetId=75afc3a8-25c7-4354-ba2d-c6bf353440b2`.

## Production readback

- Cloudflare Worker: `sanci9517-streamer-brand`; deployment `3a7eaf05-652f-43fa-bfaa-d84be5e40411`; version `84f94c3a-8fa9-4438-8fb6-c42a9bcd23d1` reported as **100% traffic** at 2026-11-16T19:49:41Z.
- GitHub Actions job **Verify live health and exact changed public source bytes** on merge commit `69359aa...`: **PASS** (https://github.com/sanci9517/sanci9517/actions/runs/43943319140). Its logged readback fetched `/api/health` (HTTP 200) and compared SHA-256 of eight files against the deployed site; `public/visual-page.html` and `public/assets/page-renderer.js` were among the matched files.
- GitHub merged-commit `verify`, `twitch-integration` and Cloudflare Workers Builds checks: **PASS**. The merged-commit `editor-core` was still **IN PROGRESS** at the last observation; the PR-head `editor-core` was already **PASS** in full.
- The production-source smoke workflow does not currently hash-check the other two changed public files `sanci-showcase.js` and `sanci-showcase.css`; their exact production byte identity is therefore **NOT DIRECTLY VERIFIED**, despite the successful build and all PR-head tests. A local direct HTTP readback was inaccessible due to network DNS restrictions; only the authenticated CI production readback is claimed.
- No post-merge physical-device/editor manual acceptance was performed; it remains deferred per the existing Visual Editor acceptance contract.

## Cost and scope

No paid infrastructure, GitHub Actions reruns or new services were authorized, and no D1 mutations or R2 deletions occurred. This is a release evidence note inside the existing canonical plan structure, **not a second plan**. The oversized canonical master plan was not edited.
