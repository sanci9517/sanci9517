# Release workflow

The repository owner wants successful runtime changes shipped to production by default, not left only in a local branch. For each runtime change:

1. Preserve all existing commits and worktree changes. Do not reset, force-push, or change branches to make a release easier.
2. Run the relevant local tests and required repository checks. Push the verified commit to `v2/foundation` using a normal fast-forward update.
3. Before a Worker deployment, run a read-only remote D1 migration preflight and `wrangler deploy --dry-run`. A verified push may trigger the repository's Cloudflare automatic deployment; verify that build and rollout. If no automatic deployment starts or succeeds, deploy the tested source with direct `npx wrangler deploy`. Do not use `npm run deploy`, which also applies D1 migrations.
4. Verify the resulting Cloudflare deployment and 100% traffic version, then smoke-test production health and compare changed public asset hashes against the deployed source. Record the commit, checks, deployment/version, and limitations in the canonical plan/evidence.
5. Test-only, documentation-only, or other changes that do not alter runtime behavior should still be pushed after validation, but do not create a redundant Worker deployment. State clearly when the runtime source is unchanged.

Never run a production D1 migration, production data mutation, or R2 deletion without a separate read-only preflight and explicit approval for that operation. A missing `GH_TOKEN` environment variable or an HTTP 401 alone is not a reason to request a new token; inspect available authenticated GitHub/Cloudflare connections first.

Keep Save and Publish behavior separate. Do not claim a push, deployment, test pass, or production result until it has been directly verified.

# Responsible autonomous development

The developer agent's default is maximum responsible autonomy. Starting from the canonical plan and actual code state, work in large, logically connected blocks at senior engineering quality: plan, implement, test, repair, and document. Do not request unnecessary intermediate approval or stop after a partial task. Ask for intervention only when a genuine user decision, permission, or security approval is required. Every feature reported as complete must have verifiable evidence.

This principle never overrides higher-priority safety, security, repository, release, or data-protection instructions. Preserve all existing work and follow the release workflow above.
