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

# Responsible autonomous development

The developer agent's default is maximum responsible autonomy. Starting from the canonical plan and actual code state, work in large, logically connected blocks at senior engineering quality: plan, implement, test, repair, and document. Do not request unnecessary intermediate approval or stop after a partial task. Ask for intervention only when a genuine user decision, permission, or security approval is required. Every feature reported as complete must have verifiable evidence.

At the start of every work session and each materially new work block, reread this complete `AGENTS.md`, the repository's canonical plan, and any directly applicable local instructions. Establish the actual repository, branch, worktree, and runtime/deployment state before acting. Keep these principles active throughout the work; do not rely on the user to restate them. Recheck the relevant principles when scope or risk changes, and use them when choosing, implementing, testing, releasing, and reporting work.

For each task, actively look for relevant, proven open-source solutions and inspect their actual code and project fit before building equivalent functionality from scratch. Evaluate license compatibility, maintenance and security posture, API/architecture fit, accessibility, performance, and ongoing dependency cost. Reuse or adapt an existing solution when it meets the product and repository requirements; do not add it merely because it exists. Prefer already-approved, free, well-maintained options, avoid unnecessary dependencies, and discuss a material unavoidable cost before adopting it. Treat third-party code as input to review: verify its behavior and license, keep the integration narrow, and retain project-owned tests and security controls.

When this review reveals a useful capability that the product needs but does not yet provide, compare it with the canonical plan and current implementation. Automatically record a verified gap in the most relevant existing plan item, with its rationale, dependencies, scope, and observable acceptance criteria. If no suitable item exists, add a properly scoped planned requirement to the canonical plan and update its traceability as required. Do not silently expand product scope, duplicate an existing requirement, or treat a third-party feature as accepted merely because the source project provides it; material product-direction changes or unavoidable paid infrastructure still require the owner's decision.

This principle never overrides higher-priority safety, security, repository, release, or data-protection instructions. Preserve all existing work and follow the release workflow above.

# Efficient and reliable execution

- Prefer free, already-approved, reliable tools and open-source components when they meet the product requirements. Do not add paid infrastructure or incur avoidable cost; if a necessary solution would have a material cost, explain the tradeoff and ask the owner before adopting it.
- Parallelize only independent work whose results can be checked separately. Keep dependent edits, migrations, deployments, merges, and stateful external operations sequential.
- Optimize for correctness and repeatability, not elapsed time. Do not weaken checks, reduce meaningful coverage, or introduce flaky concurrency to make a task appear faster.
- Reuse existing project dependencies and platform capabilities before adding a new dependency. Evaluate maintenance, security, license, accessibility, and compatibility before adopting third-party code.
- Fix verified defects within the authorized scope, then run checks proportional to the change and record what was and was not verified.
