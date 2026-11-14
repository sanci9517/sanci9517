# Release workflow

The repository owner wants successful runtime changes shipped to production by default, not left only in a local branch. For each runtime change:

1. Preserve all existing commits and worktree changes. Do not reset, force-push, or change branches to make a release easier.
2. Run the relevant local tests and required repository checks. Push the verified commit to `v2/foundation` using a normal fast-forward update.
3. Before a Worker deployment, run a genuinely read-only remote D1 preflight using SELECT-only SQL through the Cloudflare D1 query API, and run `wrangler deploy --dry-run`. Do not use `wrangler d1 migrations list --remote` as a read-only check: Wrangler 4.130.0 initializes `d1_migrations` with `CREATE TABLE IF NOT EXISTS` before listing. A verified push may trigger the repository's Cloudflare automatic deployment; verify that build and rollout. If no automatic deployment starts or succeeds, use `npm run deploy:safe`, which runs the repository migration safety gate and then deploys without applying D1 migrations. Never use `npm run deploy` for routine release; it also applies D1 migrations.
4. Verify the resulting Cloudflare deployment and 100% traffic version, then smoke-test production health and compare changed public asset hashes against the deployed source. Record the commit, checks, deployment/version, and limitations in the canonical plan/evidence.
5. Test-only, documentation-only, or other changes that do not alter runtime behavior should still be pushed after validation, but do not create a redundant Worker deployment. State clearly when the runtime source is unchanged.

The verified Cloudflare Worker Build configuration uses `npm run deploy:safe` and excludes `docs/**`, `tests/**` and root `AGENTS.md`; it deploys from `v2/foundation`. Documentation-only and root test-only commits may be pushed after validation and must not trigger a redundant Worker deployment. Runtime changes follow the release workflow above. This exact trigger configuration was authorized to prevent test-only commits from causing production deploys and its live configuration GET was verified on 2026-10-28; do not infer authorization to make unrelated persistent Cloudflare setting changes.

Never run a production D1 migration, production data mutation, or R2 deletion without a separate read-only preflight and explicit approval for that operation. A missing `GH_TOKEN` environment variable or an HTTP 401 alone is not a reason to request a new token; inspect available authenticated GitHub/Cloudflare connections first.

Keep Save and Publish behavior separate. Do not claim a push, deployment, test pass, or production result until it has been directly verified.

## Protect the oversized canonical master plan from silent truncation

- The ONE canonical `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` was **1,555,044 bytes** at verified Git blob `6388d6d67f4719cfcde6000e69976c9d09d071b0` on 2026-11-14. GitHub Contents API and `fetch_file` can return empty/partial text for files over 1 MiB, **while still returning a SHA**. **Never** append to or replace the canonical file from such a result using `update_file`/Contents API. An empty or implausibly short read is an error, NOT an empty plan.
- For this file, require source byte-size and exact blob verification *before any write*, and a complete, lossless diff that preserves all existing sections and other agents' commits. Do not overwrite it if the complete source bytes are unavailable. Do not bypass the 12-part master/cursor/396-feature structural checks by adding `[skip ci]` to a risky rewrite.
- Store independent audit findings in `docs/evidence/` instead of rewriting a 1.55 MB master just to append evidence. A plan change must remain the **same one canonical plan**, not a second roadmap, and must be verified before and after the write. A Git tree referencing the exact existing master blob plus a new evidence blob is a safe alternative when only evidence is needed.
- A truncated or missing master is an urgent repair: retrieve the last proven intact blob from the immediately preceding correct commit, preserve all later *legitimate* new notes separately, restore through a normal, non-force commit and expected-head lease, then verify the restored Git tree's exact blob SHA and size. Never reset the main branch or lose concurrent runtime commits. Existing plan contracts must run on any future deliberate master rewrite; if they are skipped, the change is **NOT CERTIFIED**.

# Responsible autonomous development

The developer agent's default is maximum responsible autonomy. Starting from the canonical plan and actual code state, work in large, logically connected blocks at senior engineering quality: plan, implement, test, repair, and document. Do not request unnecessary intermediate approval or stop after a partial task. Ask for intervention only when a genuine user decision, permission, or security approval is required. Every feature reported as complete must have verifiable evidence.

At the start of every work session and each materially new work block, reread this complete `AGENTS.md`, the repository's canonical plan, and any directly applicable local instructions. Establish the actual repository, branch, worktree, and runtime/deployment state before acting. Keep these principles active throughout the work; do not rely on the user to restate them. Recheck the relevant principles when scope or risk changes, and use them when choosing, implementing, testing, releasing, and reporting work.

For each task, actively look for relevant, proven open-source solutions and inspect their actual code and project fit before building equivalent functionality from scratch. Evaluate license compatibility, maintenance and security posture, API/architecture fit, accessibility, performance, and ongoing dependency cost. Reuse or adapt an existing solution when it meets the product and repository requirements; do not add it merely because it exists. Prefer already-approved, free, well-maintained options, avoid unnecessary dependencies, and discuss a material unavoidable cost before adopting it. Treat third-party code as input to review: verify its behavior and license, keep the integration narrow, and retain project-owned tests and security controls.

When this review reveals a useful capability that the product needs but does not yet provide, compare it with the canonical plan and current implementation. Automatically record a verified gap in the most relevant existing plan item, with its rationale, dependencies, scope, and observable acceptance criteria. If no suitable item exists, add a properly scoped planned requirement to the canonical plan and update its traceability as required. Do not silently expand product scope, duplicate an existing requirement, or treat a third-party feature as accepted merely because the source project provides it; material product-direction changes or unavoidable paid infrastructure still require the owner's decision.

This principle never overrides higher-priority safety, security, repository, release, or data-protection instructions. Preserve all existing work and follow the release workflow above.

## Visual Editor manual acceptance timing

For the SANCI9517 Creator Platform, defer user-facing manual acceptance and physical-device acceptance of the Visual Editor until the complete Visual Editor scope in the canonical plan is implemented. Do not ask the owner to manually test partial feature slices. Continue automated unit, integration, real-browser, regression, and authorized read-only release checks during development. Once the full editor reaches its planned acceptance gate, conduct one consolidated manual acceptance pass and record the result; a deferred manual check is neither a pass nor a failure.

# Efficient and reliable execution

- Prefer free, already-approved, reliable tools and open-source components when they meet the product requirements. Do not add paid infrastructure or incur avoidable cost; if a necessary solution would have a material cost, explain the tradeoff and ask the owner before adopting it.
- Parallelize only independent work whose results can be checked separately. Keep dependent edits, migrations, deployments, merges, and stateful external operations sequential.
- Optimize for correctness and repeatability, not elapsed time. Do not weaken checks, reduce meaningful coverage, or introduce flaky concurrency to make a task appear faster.
- Reuse existing project dependencies and platform capabilities before adding a new dependency. Evaluate maintenance, security, license, accessibility, and compatibility before adopting third-party code.
- Fix verified defects within the authorized scope, then run checks proportional to the change and record what was and was not verified.

## GitHub Actions quota and artifact storage

- Keep both GitHub Actions compute minutes and artifact storage within the owner's explicit 0-cost limit. Prefer validated local checks; do not dispatch, rerun, or broaden a workflow unless it is required for a release/acceptance gate and the available free quota is known. If quota or billing is uncertain, mark the remote gate BLOCKED/UNVERIFIED rather than enabling paid use.
- For documentation/evidence-only and test-harness-only changes, use the repository's `[skip ci]` convention after the relevant local checks, and verify that no workflow was claimed as PASS. Do not skip required CI for runtime releases or weaken test coverage.
- Do not commit generated build directories, APK/AAB/AAR binaries, screenshots, or other reproducible outputs. Upload only artifacts needed to diagnose a failed check or preserve a current acceptance result; give them the shortest retention that still serves that purpose (normally 7 days for screenshots and 30 days for small audit text).
- Before deleting an existing Actions artifact, verify its age, size, workflow/run, and whether current canonical evidence or a release/acceptance still references it. Preserve the newest useful exact-SHA evidence; remove only superseded completed-run artifacts, never source, release packages, or active-run outputs. If the available authenticated tools cannot delete artifacts, record that blocker and do not substitute deletion of workflow runs or repository source.

## Uniform development status report

At the end of every autonomous development block (including scheduled runs), report in Hungarian using the same concise, evidence-based fields:

- **Aktív tervpont:** the exact current item in the one canonical master plan, and its OPEN / PASS / BLOCKED status.
- **Elvégzett munka:** verified implemented changes; distinguish code, tests, documentation, and planning from each other.
- **GitHub / éles kiadás:** branch, commit/PR link, deployed Worker version and production checks, or explicitly `NOT DONE` / `UNVERIFIED`.
- **Ellenőrzések:** precise test commands and PASS/FAIL/NOT RUN outcomes; missing CI is not PASS.
- **Költség:** confirm no newly authorized spending and note exhausted/unknown free quotas.
- **Blokkolók:** permissions, quotas, failed checks, risks, and required owner approval.
- **Következő lépés:** next authorized plan item and whether owner action is needed.

For scheduled work, do not claim execution beyond tools and access actually available in that run. If coding or production verification cannot be performed, describe the concrete blocker and leave the status OPEN/BLOCKED rather than presenting a proposal as finished implementation. Never change the canonical plan's order just to make an automated report look complete.

## Fejlesztési időmérés — 0 Ft, ellenőrizhető futások

- A kötelező AGENTS.md és a teljes kanonikus MASTER-terv elolvasása, valamint a munkafa ellenőrzése után minden **tényleges Codex-fejlesztési blokk** elején futtasd: `node tests/dev-metrics.mjs start --task=<KANONIKUS_TERVPONT> --trigger=scheduled` (kézi futás esetén `manual`). Őrizd meg a visszaadott run ID-t; hiányzó/parancsvégrehajtás nélküli futásból ne gyárts időadatot.
- Ha a munka ténylegesen szünetel, használd a `pause`/`resume` parancsot. A blokk végén, a valós eredmény és teszt alapján, `finish --id=... --status=pass|partial|blocked|failed --kind=code|test|docs|mixed|none --summary=... --evidence=...` paranccsal zárd. PASS kód/teszt esetén adj valódi teszt/commit/evidence hivatkozást; a script nem ellenőrzi a hivatkozás valódiságát.
- Egy futás JSON-ja a `docs/evidence/dev-metrics/runs/YYYY-MM-DD/` alá kerül. Az adatot az engedélyezett forrás-/evidence-commit részeként őrizd meg; csak dokumentációs mérőnapló-commitnál `[skip ci]`, runtime-változásnál a kötelező kiadási/CI kapuk maradnak. Ne indíts külön CI-t vagy Worker deployt kizárólag a naplózáshoz. Ha a push quota vagy hálózat miatt blokkolt, a lokális JSON-t őrizd meg és jelentsd NOT PUSHED állapotként.
- Ha egy előző, nyitott munkamenet megszakadt, és a tényleges lezárása nem ismert, használd a `node tests/dev-metrics.mjs abandon --id=... --reason=...` parancsot. A megszakadt futás JSON-ja `measured_seconds: null`, és soha nem növelheti a mért órákat vagy a várható elkészülési ütemet; csak ezután indíts új mérést. Ne zárd le utólag `finish` paranccsal a többórás tétlenséget mérési időként.
- A `node tests/dev-metrics.mjs report --days=7 --remaining-hours=300` csak indikatív ütemet mutat: a mért eltelt idő **nem** azonos a bizonyított aktív Codex munkaórával, a 300 óra munkabecslés, nem automatikusan csökkenő tényadat. A befejezési dátum kizárólag valós feladatlezárásokkal és tesztekkel együtt értelmezhető. Részletes szerződés: `docs/evidence/dev-metrics/README.md`.
- Ez a mérés nem módosíthatja a Visual Editor tervsorrendjét, a Save/Publish elkülönítését vagy a 0 Ft-os költségplafont. Ha a mérő nem elérhető, a fejlesztést folytasd a meglévő szabályok szerint, és a mérés hiányát jelöld, ne hamisíts adatot.
