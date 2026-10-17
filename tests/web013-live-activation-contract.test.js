import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("production tenant flags are enabled only for existing server-side guards", () => {
  const config = JSON.parse(read("../wrangler.jsonc"));
  assert.equal(config.vars?.SITE_MEMBERSHIP_ENFORCEMENT, "enabled");
  assert.equal(config.vars?.SITE_SCOPED_SETTINGS_ENABLED, "enabled");
  assert.equal(config.d1_databases?.[0]?.database_name, "sanci9517-db");

  const worker = read("../src/index.ts");
  const gate = read("../src/core/auth/admin-tenant-gate.ts");
  const settings = read("../src/routes/admin/settings.ts");
  const publicSettings = read("../src/routes/public/site-settings.ts");
  assert.match(worker, /enforceAdminTenantGate\(request, env, siteId, pathname\)/);
  assert.match(gate, /requireSiteGrant\(request, env, siteId, required\)/);
  assert.match(settings, /SITE_SCOPED_SETTINGS_ENABLED === "enabled"/);
  assert.match(publicSettings, /SITE_SCOPED_SETTINGS_ENABLED === "enabled"/);
  assert.match(gate, /if \(env\.SITE_MEMBERSHIP_ENFORCEMENT !== "enabled"\) return null/);
});

test("manual schema migrations stay out of the auto-applied folder and secrets do not enter config", () => {
  const config = JSON.parse(read("../wrangler.jsonc"));
  assert.deepEqual(Object.keys(config.vars).sort(), ["SITE_MEMBERSHIP_ENFORCEMENT", "SITE_SCOPED_SETTINGS_ENABLED"]);
  for (const file of ["0026_site_memberships.sql", "0027_site_scoped_settings.sql"]) {
    const text = read("../scripts/pending/" + file);
    assert.match(text, /CREATE TABLE site_/);
  }
  assert.match(read("../scripts/web013-migration-safety-gate.mjs"), /migration 0025 is already applied manually/);
});
