/**
 * WEB-013 migration safety gate.
 *
 * The 0025 SQL is a one-shot table rebuild that was manually applied to
 * production on 2026-10-17. It must never be copied into the automatic
 * migrations directory unchanged.
 *
 * This script is read-only: it inspects repository files, not D1.
 */
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrations = readdirSync(resolve(root, "migrations")).filter((name) => name.endsWith(".sql"));
const pending = readFileSync(resolve(root, "scripts/pending/0025_site_domains_and_site_slug.sql"), "utf8");

if (migrations.some((name) => /^0025[_-]/.test(name))) {
  console.error("BLOCK: migration 0025 is already applied manually in production. Never auto-run the table rebuild. Reconcile the migration ledger and fresh-database bootstrap first.");
  process.exit(1);
}
if (!pending.includes("CREATE UNIQUE INDEX idx_pages_site_slug ON pages(site_id,slug)") ||
    !pending.includes("CREATE TABLE site_domains") ||
    !pending.includes("PRAGMA defer_foreign_keys = ON")) {
  console.error("BLOCK: pending 0025 migration no longer matches the verified production schema contract.");
  process.exit(1);
}
console.log("PASS: 0025 remains manual-only; production D1 schema was verified separately. Wrangler ledger is still at 0024 and must not be changed automatically.");
