# Sanci9517 architecture baseline

## Goal

Keep the existing multi-folder architecture, but enforce the boundaries used by mature SaaS, creator dashboards, CMS/admin systems, and Cloudflare-native applications.

## Layers

- `pages/` — public page composition only.
- `components/` — reusable public UI only.
- `styles/` — public/admin styling separated; public mobile behavior is not coupled to admin.
- `core/` — shared runtime primitives: config, routing, API transport, state and device behavior.
- `data/` — public/static data models and defaults.
- `schemas/` — explicit data contracts.
- `integrations/` — platform clients and platform-specific logic.
- `admin/` — private control-plane UI and authenticated client transport.
- `worker/src/routes/` — backend route boundary; public, health, auth, admin and integration routes stay separated.
- `worker/src/` — backend services and security primitives.
- `worker/migrations/` — versioned D1 schema changes only.
- `.github/workflows/` — validation/deployment gates.

## Control-plane rule

The browser never receives Cloudflare secrets. Admin credentials and integration secrets remain Worker bindings. The admin UI authenticates against the Worker and then uses the authenticated API boundary.

## Deployment rule

1. Validate source and architecture.
2. Apply D1 migrations remotely.
3. Deploy the Worker with current Wrangler.
4. Smoke-test health, storage, integration registry, unauthenticated admin protection and CORS.
5. Only after the new path works may obsolete compatibility code be removed.
6. Re-run validation after cleanup.

## Reference patterns adopted

The design was compared against more than 50 public implementations and templates spanning Cloudflare Workers/D1/Hono applications, SaaS dashboards, CMS/admin control planes, React/TypeScript dashboards, and livestream operator dashboards. Common durable patterns were: explicit module boundaries, one authenticated API boundary, schema/migration discipline, isolated integration clients, responsive dashboard layout, centralized state/transport, CI validation, and post-deploy smoke tests.

## Deliberate non-goals for this phase

- Do not replace the existing public site with a framework migration just for fashion.
- Do not collapse the multi-folder structure into a monolith.
- Do not alter the already-approved public mobile design.
- Do not delete compatibility modules until import usage is proven absent and the replacement has passed tests.
