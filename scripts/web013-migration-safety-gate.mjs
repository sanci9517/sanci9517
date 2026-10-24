/**
 * WEB-013 migration safety gate.
 *
 * Production already received 0025, 0026 and 0027 manually on 2026-10-17.
 * The 0025 SQL is a one-shot table rebuild. No part of this manual chain
 * may be copied into automatic migrations unchanged.
 *
 * This script is read-only: it inspects repository files, not D1.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrations = readdirSync(resolve(root, "migrations")).filter((name) => name.endsWith(".sql"));
const pending = readFileSync(resolve(root, "scripts/pending/0025_site_domains_and_site_slug.sql"), "utf8");
const memberships = readFileSync(resolve(root, "scripts/pending/0026_site_memberships.sql"), "utf8");
const settings = readFileSync(resolve(root, "scripts/pending/0027_site_scoped_settings.sql"), "utf8");
const mediaArchive = readFileSync(resolve(root,"scripts/pending/0028_media_archive.sql"),"utf8");
const manualManifest = JSON.parse(readFileSync(resolve(root, "scripts/d1/manual-migrations.json"), "utf8"));
const expectedNames = ["0025_site_domains_and_site_slug.sql", "0026_site_memberships.sql", "0027_site_scoped_settings.sql", "0028_media_archive.sql"];
if (JSON.stringify(manualManifest.map(entry => entry.name)) !== JSON.stringify(expectedNames)) {
  throw new Error("Manual migration registry must reserve exactly 0025-0028");
}
for (const entry of manualManifest) {
  if (entry.path !== `scripts/pending/${entry.name}` ||
      createHash("sha256").update(readFileSync(resolve(root, entry.path))).digest("hex") !== entry.sha256) {
    throw new Error(`Manual migration hash/path mismatch: ${entry.name}`);
  }
}
const retention = readFileSync(resolve(root,"scripts/pending/media_retention_requests.sql"),"utf8");

if (migrations.some((name) => /^002[5678][_-]/.test(name))) {
  console.error("BLOCK: migration 0025 is already applied manually in production; 0026 and 0027 are also manually installed, and 0028 requires controlled rollout. Do not auto-replay these SQL files. Reconcile the migration ledger and new-database bootstrap first.");
  process.exit(1);
}
if (!retention.includes("CREATE TABLE IF NOT EXISTS media_retention_requests") ||
    !retention.includes("UNIQUE(site_id,asset_id)") ||
    !retention.includes("FOREIGN KEY(asset_id) REFERENCES media(id)") ||
    /(?:^|\n)\s*(?:DELETE\s+FROM|DROP\s+TABLE|CREATE\s+TRIGGER)/im.test(retention)) {
  console.error("BLOCK: manual-only retention proposal was changed or became destructive.");
  process.exit(1);
}
if (!pending.includes("CREATE UNIQUE INDEX idx_pages_site_slug ON pages(site_id,slug)") ||
    !pending.includes("CREATE TABLE site_domains") ||
    !pending.includes("PRAGMA defer_foreign_keys = ON") ||
    !memberships.includes("CREATE TABLE site_memberships") ||
    !settings.includes("CREATE TABLE site_scoped_settings") ||
    !mediaArchive.includes("ALTER TABLE media ADD COLUMN archived_at") ||
    !mediaArchive.includes("CREATE TRIGGER media_archive_pages_update_guard") ||
    !mediaArchive.includes("CREATE TRIGGER media_archive_revisions_insert_guard")) {
  console.error("BLOCK: pending 0025/0026/0027 migrations no longer match the verified production schema contract.");
  process.exit(1);
}
console.log("PASS: immutable 0025-0028 registry reserved; manual SQL cannot auto-replay. Use the reviewed ledger reconciliation and fresh bootstrap runbook; production ledger state requires live verification. Retention stays manual-only.");
