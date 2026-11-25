/**
 * WEB-020 Forms: review-only, resumable production D1 installation.
 * Produces standalone statements; it never connects to Cloudflare or writes D1.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const MIGRATION_NAME = "0032_forms_service.sql";
export const CANDIDATE_SHA256 = "92023857b2518db65976f5a19a5684b79eb44de42bba38da652db8350e908f5f";
export const EXPECTED_OBJECTS = Object.freeze([
  "forms", "idx_forms_site_status_updated", "form_revisions", "form_submissions",
  "idx_form_submissions_inbox", "idx_form_submissions_expiry", "form_submission_rate_limits",
  "idx_form_rate_limit_expiry"
]);

const sourceUrl = new URL("../../scripts/pending/0032_forms_service.sql", import.meta.url);

function normalizedSource() {
  const source = readFileSync(sourceUrl, "utf8");
  if (createHash("sha256").update(source).digest("hex") !== CANDIDATE_SHA256) {
    throw new Error("WEB-020 0032 candidate SHA-256 changed; independent review required");
  }
  const body = source.split("\n").filter(line => !line.trimStart().startsWith("--")).join("\n");
  const statements = body.split(";").map(statement => statement.trim()).filter(Boolean);
  if (statements.length !== EXPECTED_OBJECTS.length ||
      statements.some(statement => !/^CREATE (?:TABLE|INDEX)\b/i.test(statement) ||
        /^\s*(?:DROP|DELETE|ALTER|UPDATE|INSERT|REPLACE)\b/im.test(statement))) {
    throw new Error("WEB-020 0032 candidate must remain eight additive CREATE statements");
  }
  const actualNames = statements.map(statement => statement.match(/^CREATE (?:TABLE|INDEX)\s+(?:IF NOT EXISTS\s+)?([a-z0-9_]+)/i)?.[1]);
  if (JSON.stringify(actualNames) !== JSON.stringify(EXPECTED_OBJECTS)) {
    throw new Error("WEB-020 0032 candidate object set/order changed; independent review required");
  }
  return statements.map(expected => ({
    expected,
    idempotent: expected
      .replace(/^CREATE TABLE\s+/i, "CREATE TABLE IF NOT EXISTS ")
      .replace(/^CREATE INDEX\s+/i, "CREATE INDEX IF NOT EXISTS ")
  }));
}

/** Returns one independently executable CREATE statement per object, then a guarded ledger activation. */
export function build0032ReleaseStatements() {
  const statements = normalizedSource();
  const activation = [
    `INSERT INTO d1_migrations(name) SELECT '${MIGRATION_NAME}'`,
    "WHERE (SELECT COUNT(*) FROM d1_migrations)=37",
    " AND (SELECT name FROM d1_migrations ORDER BY id DESC LIMIT 1)='0031_media_archive_malformed_json_guard.sql'",
    ` AND NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name='${MIGRATION_NAME}')`,
    ...statements.map(({ expected, idempotent }) => {
      const name = idempotent.match(/^CREATE (?:TABLE|INDEX) IF NOT EXISTS\s+([a-z0-9_]+)/i)[1];
      return ` AND EXISTS(SELECT 1 FROM sqlite_master WHERE name='${name}' AND sql='${expected.replace(/'/g, "''")}')`;
    }),
    " AND NOT EXISTS(SELECT 1 FROM pragma_foreign_key_check)",
    ";"
  ].join("\n");
  return [...statements.map(({ idempotent }) => idempotent), activation];
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 3 || process.argv[2] !== "--print") {
    process.stderr.write("Usage: node tests/review/prepare-0032-release.mjs --print (review-only sequential D1 statements)\n");
    process.exitCode = 2;
  } else {
    process.stdout.write(JSON.stringify({ mode: "sequential-idempotent", statements: build0032ReleaseStatements().map(sql => ({ sql })) }, null, 2) + "\n");
  }
}
