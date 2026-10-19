/**
 * WEB-013 migration safety gate.
 *
 * Production already received 0025, 0026 and 0027 manually on 2026-10-17.
 * The 0025 SQL is a one-shot table rebuild. No part of this manual chain
 * may be copied into automatic migrations unchanged.
 *
 * This script is read-only: it inspects repository files, not D1.
 */
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrations = readdirSync(resolve(root, "migrations")).filter((name) => name.endsWith(".sql"));
const pending = readFileSync(resolve(root, "scripts/pending/0025_site_domains_and_site_slug.sql"), "utf8");
const memberships = readFileSync(resolve(root, "scripts/pending/0026_site_memberships.sql"), "utf8");
const settings = readFileSync(resolve(root, "scripts/pending/0027_site_scoped_settings.sql"), "utf8");
const mediaArchive = readFileSync(resolve(root,"scripts/pending/0028_media_archive.sql"),"utf8");

if (migrations.some((name) => /^002[5678][_-]/.test(name))) {
  console.error("BLOCK: migration 0025 is already applied manually in production; 0026 and 0027 are also manually installed, and 0028 requires controlled rollout. Do not auto-replay these SQL files. Reconcile the migration ledger and new-database bootstrap first.");
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
console.log("PASS: 0025-0028 stay manual-only. The production D1 rollout for 0028 must be separately verified; Wrangler ledger remains at 0024.");
