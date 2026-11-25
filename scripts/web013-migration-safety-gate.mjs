/**
 * WEB-013 migration safety gate.
 *
 * Production received 0025-0032 through the reviewed manual release chain.
 * Applied manual migrations stay outside automatic migrations.
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
const packageJson = JSON.parse(readFileSync(resolve(root,"package.json"),"utf8"));
const safeDeploy = packageJson.scripts?.["deploy:safe"]?.trim() ?? "";
if (!/^npm run test:web013:migration-gate\s*&&\s*wrangler deploy(?:\s|$)/.test(safeDeploy) || /db:migrations:apply|migrations\s+apply/.test(safeDeploy)) {
  console.error("BLOCK: deploy:safe must run the repository migration safety gate before Wrangler deploy and must never apply D1 migrations.");
  process.exit(1);
}
const migrations = readdirSync(resolve(root, "migrations")).filter((name) => name.endsWith(".sql"));
const pending = readFileSync(resolve(root, "scripts/pending/0025_site_domains_and_site_slug.sql"), "utf8");
const memberships = readFileSync(resolve(root, "scripts/pending/0026_site_memberships.sql"), "utf8");
const settings = readFileSync(resolve(root, "scripts/pending/0027_site_scoped_settings.sql"), "utf8");
const mediaArchive = readFileSync(resolve(root,"scripts/pending/0028_media_archive.sql"),"utf8");
const mediaArchiveUnicode = readFileSync(resolve(root,"tests/fixtures/0029_media_archive_unicode_additive.sql"),"utf8");
const mediaOrganization = readFileSync(resolve(root,"scripts/pending/0030_media_library_organization.sql"),"utf8");
const mediaArchiveMalformed = readFileSync(resolve(root,"tests/fixtures/0031_media_archive_malformed_json_guard.sql"),"utf8");
const formsCandidate = readFileSync(resolve(root,"scripts/pending/0032_forms_service.sql"),"utf8");
const manualManifest = JSON.parse(readFileSync(resolve(root, "scripts/d1/manual-migrations.json"), "utf8"));
const candidateManifest = JSON.parse(readFileSync(resolve(root,"scripts/d1/review-only-candidates.json"),"utf8"));
const expectedNames = ["0025_site_domains_and_site_slug.sql", "0026_site_memberships.sql", "0027_site_scoped_settings.sql", "0028_media_archive.sql", "0029_media_archive_unicode_additive.sql", "0030_media_library_organization.sql", "0031_media_archive_malformed_json_guard.sql", "0032_forms_service.sql"];
const expectedPaths = new Map(expectedNames.map((name,index)=>[name,index===4||index===6?"tests/fixtures/"+name:"scripts/pending/"+name]));
if (JSON.stringify(manualManifest.map(entry => entry.name)) !== JSON.stringify(expectedNames)) {
  throw new Error("Applied/manual migration registry must preserve exactly the reviewed 0025-0032 chain");
}
if (candidateManifest.length !== 0) {
  throw new Error("All manually applied D1 candidates must be removed from the review-only registry");
}
for (const entry of manualManifest) {
  if (entry.path !== expectedPaths.get(entry.name) ||
      createHash("sha256").update(readFileSync(resolve(root, entry.path))).digest("hex") !== entry.sha256) {
    throw new Error(`Manual migration hash/path mismatch: ${entry.name}`);
  }
}
const retention = readFileSync(resolve(root,"scripts/pending/media_retention_requests.sql"),"utf8");

if (migrations.some((name) => /^(?:002[5-9]|003[0-2])[_-]/.test(name))) {
  console.error("BLOCK: migrations 0025-0032 are reserved for manually reviewed rollout; never auto-replay them from deploy:safe.");
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
const unicodeBody=mediaArchiveUnicode.split("\n").filter(line=>!line.trimStart().startsWith("--")).join("\n");
const organizationBody=mediaOrganization.split("\n").filter(line=>!line.trimStart().startsWith("--")).join("\n");
const malformedBody=mediaArchiveMalformed.split("\n").filter(line=>!line.trimStart().startsWith("--")).join("\n");
if (!unicodeBody.includes("CREATE TRIGGER media_archive_pages_insert_unicode_guard") ||
    !organizationBody.includes("CREATE TABLE media_folders") || !organizationBody.includes("CREATE TABLE media_tags") ||
    !organizationBody.includes("CREATE TABLE media_collections") || !organizationBody.includes("ALTER TABLE media ADD COLUMN folder_id") ||
    !organizationBody.includes("FOREIGN KEY(site_id,asset_id) REFERENCES media(site_id,id)") ||
    /\b(?:DROP\s+(?:TABLE|TRIGGER|INDEX)|DELETE\s+FROM|INSERT\s+INTO|UPDATE\s+[a-z_]+\s+SET)\b/i.test(organizationBody) ||
    !malformedBody.includes("CREATE TRIGGER IF NOT EXISTS media_archive_pages_insert_malformed_guard") ||
    !malformedBody.includes("CREATE TRIGGER IF NOT EXISTS media_archive_pages_update_malformed_guard") ||
    !malformedBody.includes("CREATE TRIGGER IF NOT EXISTS media_archive_revisions_insert_malformed_guard") ||
    !malformedBody.includes("CREATE TRIGGER IF NOT EXISTS media_archive_revisions_update_malformed_guard") ||
    !malformedBody.includes("WHEN EXISTS (SELECT 1 FROM d1_migrations WHERE name='0031_media_archive_malformed_json_guard.sql')") ||
    /\b(?:DROP\s+(?:TABLE|TRIGGER|INDEX)|DELETE\s+FROM|ALTER\s+TABLE)\b/i.test(malformedBody)) {
  console.error("BLOCK: staged 0029-0031 manual SQL must remain exact, additive-only and outside automatic migrations.");
  process.exit(1);
}
const formsBody=formsCandidate.split("\n").filter(line=>!line.trimStart().startsWith("--")).join("\n");
if (!formsBody.includes("CREATE TABLE forms") || !formsBody.includes("CREATE TABLE form_revisions") ||
    !formsBody.includes("CREATE TABLE form_submissions") || !formsBody.includes("CREATE TABLE form_submission_rate_limits") ||
    !formsBody.includes("FOREIGN KEY (site_id,form_id,form_version)") ||
    !formsBody.includes("FOREIGN KEY (site_id,id,published_version)") ||
    !formsBody.includes("consent_accepted_at TEXT NOT NULL") || !formsBody.includes("expires_at TEXT NOT NULL") ||
    /\b(?:DROP\s+(?:TABLE|TRIGGER|INDEX)|DELETE\s+FROM|UPDATE\s+[a-z_]+\s+SET|ALTER\s+TABLE)\b/i.test(formsBody)) {
  throw new Error("0032 Forms migration must remain additive, site-scoped, consent-aware and expiry-bounded.");
}
console.log("PASS: deploy:safe runs the repository migration gate and never applies D1 migrations; manually applied 0025-0032 SQL stays outside automatic migrations. Retention stays manual-only.");
