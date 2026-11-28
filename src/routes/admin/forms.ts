import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole, type AuthUser } from "../../core/auth/require-auth";
import { requireSiteGrant } from "../../core/auth/site-access";
import { DEFAULT_SITE_ID } from "../../core/site-context";
import { MAX_FORM_FIELDS, normalizeFormDefinition } from "../../core/forms-contract";
import type { Env } from "../../types/env";

const MAX_FORM_EXPORT_ROWS = 500;
const MAX_FORM_EXPORT_COLUMNS = MAX_FORM_FIELDS * 4;
const MAX_FORM_EXPORT_BYTES = 16 * 1024 * 1024;

type FormRow = {
  id: string; name: string; status: "draft" | "published" | "archived";
  current_version: number; published_version: number | null; retention_days: number;
  created_at: string; updated_at: string;
};

const hasOnlyKeys = (value: Record<string, unknown>, allowed: string[]) =>
  Object.keys(value).every(key => allowed.includes(key));

async function authorize(request: Request, env: Env, siteId: string): Promise<AuthUser | Response> {
  if (!siteId.trim()) return error("SITE_CONTEXT_INVALID", 403);
  if (env.SITE_MEMBERSHIP_ENFORCEMENT === "enabled") {
    const grant = await requireSiteGrant(request, env, siteId, "editor");
    if (grant instanceof Response) return grant;
    return grant.user;
  }
  if (siteId !== DEFAULT_SITE_ID) return error("SITE_ACCESS_DENIED", 403);
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");
  return user;
}

async function authorizeAdmin(request: Request, env: Env, siteId: string): Promise<AuthUser | Response> {
  if (env.SITE_MEMBERSHIP_ENFORCEMENT === "enabled") {
    const grant = await requireSiteGrant(request, env, siteId, "admin");
    if (grant instanceof Response) return grant;
    return grant.user;
  }
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (siteId !== DEFAULT_SITE_ID || !hasRole(user, "admin")) return error("FORBIDDEN", 403, "Admin role required");
  return user;
}

function requireSameOriginJson(request: Request): Response | null {
  const url = new URL(request.url);
  if (request.headers.get("Origin") !== url.origin || request.headers.get("Sec-Fetch-Site") === "cross-site") {
    return error("INVALID_ORIGIN", 403);
  }
  if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get("Content-Type") || "")) {
    return error("INVALID_CONTENT_TYPE", 415);
  }
  return null;
}

async function readJson(request: Request, maximumBytes: number): Promise<Record<string, unknown> | Response> {
  const declared = request.headers.get("Content-Length");
  if (declared && (!/^\d+$/.test(declared) || !Number.isSafeInteger(Number(declared)) || Number(declared) > maximumBytes)) return error("REQUEST_TOO_LARGE", 413);
  const reader = request.body?.getReader();
  if (!reader) return error("INVALID_JSON", 400);
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        await reader.cancel().catch(() => undefined);
        return error("REQUEST_TOO_LARGE", 413);
      }
      chunks.push(value);
    }
  } catch {
    return error("INVALID_JSON", 400);
  }
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let text: string;
  try { text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }).decode(bytes); }
  catch { return error("INVALID_JSON", 400); }
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) return error("INVALID_JSON", 400);
    return value as Record<string, unknown>;
  } catch {
    return error("INVALID_JSON", 400);
  }
}

function isResponse(value: unknown): value is Response { return value instanceof Response; }
function auditAfterChange(env: Env, userId: string, action: string, entityType: string, entityId: string, metadata: unknown) {
  // D1 batches execute in order. `changes()` binds this record to the
  // immediately preceding conditional write, so a stale/no-op mutation never
  // leaves an audit entry that claims it succeeded.
  return env.DB.prepare(`INSERT INTO audit_log(id,user_id,action,entity_type,entity_id,metadata_json)
    SELECT ?,?,?,?,?,? WHERE changes()=1`)
    .bind(crypto.randomUUID(), userId, action, entityType, entityId, JSON.stringify(metadata));
}
function requiredString(value: unknown, maximum: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maximum;
}

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  // Prefix spreadsheet formulas with a literal apostrophe before CSV quoting.
  // Quoting alone does not prevent Excel/Sheets from evaluating user input.
  const isFiniteNumber = typeof value === "number" && Number.isFinite(value);
  const safe = !isFiniteNumber && /^[\u0000-\u0020]*[=+@-]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

async function exportSubmissions(env: Env, siteId: string, formId: string, query: string, userId: string): Promise<Response> {
  if (!/^[0-9a-f-]{36}$/i.test(formId)) return error("INVALID_FORM_ID", 400);
  if (query.length > 100) return error("INVALID_SEARCH", 400);
  const form = await env.DB.prepare("SELECT id,name FROM forms WHERE id=? AND site_id=? LIMIT 1")
    .bind(formId, siteId).first<{ id: string; name: string }>();
  if (!form) return error("FORM_NOT_FOUND", 404);
  const rows = await env.DB.prepare(`SELECT s.id,s.form_version AS formVersion,s.values_json AS valuesJson,
      s.consent_text AS consentText,s.consent_version AS consentVersion,
      s.consent_accepted_at AS consentAcceptedAt,s.status,s.received_at AS receivedAt,
      r.definition_json AS definitionJson
    FROM form_submissions s
    LEFT JOIN form_revisions r ON r.site_id=s.site_id AND r.form_id=s.form_id AND r.version=s.form_version
    WHERE s.site_id=? AND s.form_id=? AND s.expires_at>CURRENT_TIMESTAMP
      AND (?='' OR lower(s.values_json) LIKE lower(?))
    ORDER BY s.received_at DESC,s.id DESC LIMIT ?`)
    .bind(siteId, formId, query, `%${query}%`, MAX_FORM_EXPORT_ROWS + 1)
    .all<Record<string, unknown>>();
  if (rows.results.length > MAX_FORM_EXPORT_ROWS) return error("FORM_EXPORT_TOO_LARGE", 413,
    `Az export legfeljebb ${MAX_FORM_EXPORT_ROWS} aktív beküldést tartalmazhat. Szűkítsd a keresést, és próbáld újra.`);

  const fields = new Map<string, string>();
  const entries: Array<{ row: Record<string, unknown>; values: Record<string, string | number | boolean> }> = [];
  for (const row of rows.results) {
    let rawDefinition: unknown;
    let values: unknown;
    try {
      rawDefinition = JSON.parse(String(row.definitionJson || "null"));
      values = JSON.parse(String(row.valuesJson || "null"));
    } catch {
      return error("FORM_EXPORT_DATA_UNAVAILABLE", 503, "Egy beküldés vagy űrlapséma nem olvasható, ezért az exportot megszakítottuk.");
    }
    const definition = normalizeFormDefinition(rawDefinition);
    if (!definition.ok || !values || typeof values !== "object" || Array.isArray(values) ||
        Object.values(values as Record<string, unknown>).some(value =>
          !(typeof value === "string" || typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))))) {
      return error("FORM_EXPORT_DATA_UNAVAILABLE", 503, "Egy beküldés vagy űrlapséma nem érvényes, ezért az exportot megszakítottuk.");
    }
    const fieldIds = new Set(definition.value.fields.map(field => field.id));
    if (Object.keys(values).some(id => !fieldIds.has(id))) {
      return error("FORM_EXPORT_DATA_UNAVAILABLE", 503, "Egy beküldés ismeretlen mezőt tartalmaz, ezért az exportot megszakítottuk.");
    }
    for (const field of definition.value.fields) {
      if (!fields.has(field.id)) fields.set(field.id, field.label);
      if (fields.size > MAX_FORM_EXPORT_COLUMNS) return error("FORM_EXPORT_TOO_WIDE", 413,
        "Az export túl sok korábbi mezőváltozatot tartalmaz. Szűkítsd a keresést, és próbáld újra.");
    }
    entries.push({ row, values: values as Record<string, string | number | boolean> });
  }

  const fixedHeaders = ["Beküldés azonosítója", "Beküldés ideje", "Állapot", "Űrlapséma verzió", "Hozzájárulás verzió", "Elfogadva", "Hozzájárulási szöveg"];
  const fieldHeaders = [...fields].map(([id, label]) => `${label} · ${id}`);
  const encoder = new TextEncoder();
  const lines = [[...fixedHeaders, ...fieldHeaders].map(csvCell).join(",")];
  let csvBytes = encoder.encode(lines[0]).byteLength + 2;
  for (const { row, values } of entries) {
    const line = [
      row.id,
      row.receivedAt, row.status, row.formVersion, row.consentVersion,
      row.consentAcceptedAt, row.consentText,
      ...[...fields.keys()].map(id => values[id] ?? "")
    ].map(csvCell).join(",");
    csvBytes += encoder.encode(line).byteLength + 2;
    if (csvBytes > MAX_FORM_EXPORT_BYTES) return error("FORM_EXPORT_TOO_LARGE", 413,
      "Az export fájlmérete meghaladja a 16 MiB-os biztonságos korlátot. Szűkítsd a keresést, és próbáld újra.");
    lines.push(line);
  }
  const csv = `\uFEFF${lines.join("\r\n")}\r\n`;
  const filenameBase = form.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "urlap";
  await env.DB.prepare(`INSERT INTO audit_log(id,user_id,action,entity_type,entity_id,metadata_json)
    VALUES(?,?,'form.submission.export','form',?,?)`)
    .bind(crypto.randomUUID(), userId, formId, JSON.stringify({ rows: entries.length, filtered: Boolean(query), format: "csv" })).run();
  return new Response(csv, { status: 200, headers: {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filenameBase}-${formId.slice(-8)}.csv"`,
    "Cache-Control": "private, no-store",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "X-Export-Rows": String(entries.length)
  } });
}

async function listSubmissions(request: Request, env: Env, siteId: string): Promise<Response> {
  const url = new URL(request.url);
  const formId = url.searchParams.get("submissions") || "";
  if (!/^[0-9a-f-]{36}$/i.test(formId)) return error("INVALID_FORM_ID", 400);
  const form = await env.DB.prepare("SELECT id FROM forms WHERE id=? AND site_id=? LIMIT 1").bind(formId, siteId).first<{ id: string }>();
  if (!form) return error("FORM_NOT_FOUND", 404);
  const query = url.searchParams.get("q")?.trim() || "";
  if (query.length > 100) return error("INVALID_SEARCH", 400);
  const cursor = url.searchParams.get("before") || "";
  if (cursor && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\|[0-9a-f-]{36}$/i.test(cursor)) return error("INVALID_CURSOR", 400);
  const [beforeTime, beforeId] = cursor ? cursor.split("|") : ["", ""];
  const requestedLimit = Number(url.searchParams.get("limit") || 50);
  if (!Number.isInteger(requestedLimit)) return error("INVALID_LIMIT", 400);
  const limit = Math.min(100, Math.max(1, requestedLimit));
  const rows = await env.DB.prepare(`SELECT id,form_id AS formId,form_version AS formVersion,page_id AS pageId,
      page_revision_id AS pageRevisionId,values_json AS valuesJson,consent_text AS consentText,
      consent_version AS consentVersion,consent_accepted_at AS consentAcceptedAt,status,
      received_at AS receivedAt,expires_at AS expiresAt,reviewed_at AS reviewedAt
    FROM form_submissions
    WHERE site_id=? AND form_id=? AND expires_at>CURRENT_TIMESTAMP
      AND (?='' OR lower(values_json) LIKE lower(?))
      AND (?='' OR received_at<? OR (received_at=? AND id<?))
    ORDER BY received_at DESC,id DESC LIMIT ?`)
    .bind(siteId, formId, query, `%${query}%`, beforeTime, beforeTime, beforeTime, beforeId, limit)
    .all<Record<string, unknown>>();
  const items: Array<Record<string, unknown> & { id: string; receivedAt: string; values: unknown }> = rows.results.map(row => {
    let values: unknown = {};
    try { values = JSON.parse(String(row.valuesJson)); } catch { /* malformed legacy payload stays redacted */ }
    return { ...row, id: String(row.id), receivedAt: String(row.receivedAt), values };
  });
  const last = items.at(-1);
  return ok({ items, nextCursor: items.length === limit && last ? `${last.receivedAt}|${last.id}` : null });
}

async function countNewSubmissions(env: Env, siteId: string, formId: string): Promise<Response> {
  if (!/^[0-9a-f-]{36}$/i.test(formId)) return error("INVALID_FORM_ID", 400);
  const result = await env.DB.prepare(`SELECT
      (SELECT COUNT(*) FROM form_submissions s
        WHERE s.site_id=f.site_id AND s.form_id=f.id AND s.status='new'
          AND s.expires_at>CURRENT_TIMESTAMP) AS count
    FROM forms f WHERE f.id=? AND f.site_id=? LIMIT 1`)
    .bind(formId, siteId).first<{ count: number }>();
  if (!result) return error("FORM_NOT_FOUND", 404);
  return ok({ count: Math.max(0, Number(result.count) || 0) });
}

export async function adminFormsRoute(request: Request, env: Env, siteId: string): Promise<Response> {
  const grant = await authorize(request, env, siteId);
  if (grant instanceof Response) return grant;
  try {
    if (request.method === "GET") {
      const url = new URL(request.url);
      if (url.searchParams.has("newCount")) return await countNewSubmissions(env, siteId, url.searchParams.get("newCount") || "");
      if (url.searchParams.has("submissions")) return await listSubmissions(request, env, siteId);
      const selectedFormId = url.searchParams.get("formId");
      if (selectedFormId !== null) {
        if (!/^[0-9a-f-]{36}$/i.test(selectedFormId)) return error("INVALID_FORM_ID", 400);
        const selected = await env.DB.prepare(`SELECT f.id,f.name,f.status,f.current_version AS currentVersion,
          f.published_version AS publishedVersion,f.retention_days AS retentionDays,r.definition_json AS definitionJson
          FROM forms f LEFT JOIN form_revisions r
            ON r.site_id=f.site_id AND r.form_id=f.id AND r.version=f.current_version
          WHERE f.id=? AND f.site_id=? LIMIT 1`).bind(selectedFormId, siteId)
          .first<Record<string, unknown> & { definitionJson?: string | null }>();
        if (!selected) return error("FORM_NOT_FOUND", 404);
        let raw: unknown;
        try { raw = JSON.parse(String(selected.definitionJson || "null")); } catch { return error("FORM_SCHEMA_UNAVAILABLE", 503); }
        const definition = normalizeFormDefinition(raw);
        if (!definition.ok) return error("FORM_SCHEMA_UNAVAILABLE", 503);
        const { definitionJson: _definitionJson, ...form } = selected;
        return ok({ ...form, definition: definition.value });
      }
      const forms = await env.DB.prepare(`SELECT id,name,status,current_version AS currentVersion,
        published_version AS publishedVersion,retention_days AS retentionDays,created_at AS createdAt,updated_at AS updatedAt
        FROM forms WHERE site_id=? ORDER BY updated_at DESC,id LIMIT 200`).bind(siteId).all<Record<string, unknown>>();
      return ok(forms.results);
    }

    const originError = requireSameOriginJson(request);
    if (originError) return originError;
    const body = await readJson(request, 24_576);
    if (isResponse(body)) return body;

    if (request.method === "POST") {
      const action = body.action;
      if (action === "export") {
        if (!hasOnlyKeys(body, ["action", "formId", "query"])) return error("INVALID_FORM_ACTION", 400);
        const admin = await authorizeAdmin(request, env, siteId);
        if (admin instanceof Response) return admin;
        const formId = typeof body.formId === "string" ? body.formId : "";
        const query = typeof body.query === "string" ? body.query.trim() : "";
        if (body.query !== undefined && typeof body.query !== "string") return error("INVALID_SEARCH", 400);
        return await exportSubmissions(env, siteId, formId, query, admin.id);
      }
      if (action === "create") {
        if (!hasOnlyKeys(body, ["action", "name", "definition"])) return error("INVALID_FORM_ACTION", 400);
        const definition = normalizeFormDefinition(body.definition);
        if (!definition.ok) return error(definition.code, 400);
        const id = crypto.randomUUID();
        const name = requiredString(body.name, 100) ? body.name.trim() : definition.value.name;
        const nowVersion = 1;
        const insert = await env.DB.batch([
          env.DB.prepare(`INSERT INTO forms(id,site_id,name,status,current_version,published_version,retention_days,created_by,updated_by)
            VALUES(?,?,?,'draft',?,NULL,?,?,?)`).bind(id, siteId, name, nowVersion, definition.value.retentionDays, grant.id, grant.id),
          env.DB.prepare(`INSERT INTO form_revisions(site_id,form_id,version,definition_json,created_by)
            SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM forms WHERE id=? AND site_id=?)`)
            .bind(siteId, id, nowVersion, JSON.stringify(definition.value), grant.id, id, siteId),
          auditAfterChange(env, grant.id, "form.create", "form", id, { version: nowVersion })
        ]);
        if (Number(insert[0]?.meta?.changes || 0) !== 1 || Number(insert[1]?.meta?.changes || 0) !== 1) return error("FORM_SAVE_FAILED", 503);
        return ok({ id, name, status: "draft", currentVersion: nowVersion, publishedVersion: null });
      }
      if (action === "save") {
        if (!hasOnlyKeys(body, ["action", "formId", "expectedVersion", "name", "definition"])) return error("INVALID_FORM_ACTION", 400);
        const formId = typeof body.formId === "string" ? body.formId : "";
        const expectedVersion = Number(body.expectedVersion);
        if (!/^[0-9a-f-]{36}$/i.test(formId) || !Number.isInteger(expectedVersion) || expectedVersion < 1) return error("INVALID_FORM_REVISION", 400);
        const definition = normalizeFormDefinition(body.definition);
        if (!definition.ok) return error(definition.code, 400);
        const current = await env.DB.prepare("SELECT current_version AS version,status FROM forms WHERE id=? AND site_id=? LIMIT 1")
          .bind(formId, siteId).first<{ version: number; status: string }>();
        if (!current) return error("FORM_NOT_FOUND", 404);
        if (current.status === "archived") return error("FORM_ARCHIVED", 409);
        if (current.version !== expectedVersion) return error("FORM_REVISION_CONFLICT", 409);
        const version = current.version + 1;
        const name = requiredString(body.name, 100) ? body.name.trim() : definition.value.name;
        const saved = await env.DB.batch([
          env.DB.prepare(`INSERT INTO form_revisions(site_id,form_id,version,definition_json,created_by)
            SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM forms WHERE id=? AND site_id=? AND current_version=? AND status<>'archived')`)
            .bind(siteId, formId, version, JSON.stringify(definition.value), grant.id, formId, siteId, expectedVersion),
          env.DB.prepare(`UPDATE forms SET name=?,current_version=?,retention_days=?,updated_by=?,updated_at=CURRENT_TIMESTAMP
            WHERE id=? AND site_id=? AND current_version=? AND EXISTS(SELECT 1 FROM form_revisions WHERE site_id=? AND form_id=? AND version=?)`)
            .bind(name, version, definition.value.retentionDays, grant.id, formId, siteId, expectedVersion, siteId, formId, version),
          auditAfterChange(env, grant.id, "form.save", "form", formId, { version })
        ]);
        if (Number(saved[0]?.meta?.changes || 0) !== 1 || Number(saved[1]?.meta?.changes || 0) !== 1) return error("FORM_REVISION_CONFLICT", 409);
        return ok({ id: formId, name, status: current.status, currentVersion: version });
      }
      if (action === "publish" || action === "archive") {
        if (!hasOnlyKeys(body, ["action", "formId", "expectedVersion"])) return error("INVALID_FORM_ACTION", 400);
        const formId = typeof body.formId === "string" ? body.formId : "";
        const expectedVersion = Number(body.expectedVersion);
        if (!/^[0-9a-f-]{36}$/i.test(formId) || !Number.isInteger(expectedVersion) || expectedVersion < 1) return error("INVALID_FORM_REVISION", 400);
        const current = await env.DB.prepare(`SELECT f.current_version AS version,f.status,r.definition_json AS definitionJson
          FROM forms f LEFT JOIN form_revisions r ON r.site_id=f.site_id AND r.form_id=f.id AND r.version=f.current_version
          WHERE f.id=? AND f.site_id=? LIMIT 1`)
          .bind(formId, siteId).first<{ version: number; status: string; definitionJson?: string | null }>();
        if (!current) return error("FORM_NOT_FOUND", 404);
        if (current.status === "archived") return error("FORM_ARCHIVED", 409);
        if (current.version !== expectedVersion) return error("FORM_REVISION_CONFLICT", 409);
        if (action === "publish") {
          let rawDefinition: unknown;
          try { rawDefinition = JSON.parse(current.definitionJson || "null"); } catch { return error("FORM_SCHEMA_UNAVAILABLE", 503); }
          const publishDefinition = normalizeFormDefinition(rawDefinition);
          if (!publishDefinition.ok) return error("FORM_SCHEMA_UNAVAILABLE", 503);
          if (!publishDefinition.value.consent.privacyUrl) return error("FORM_PRIVACY_NOTICE_REQUIRED", 409,
            "Publikálás előtt adj meg HTTPS adatkezelési tájékoztató hivatkozást.");
          const changed = await env.DB.batch([
            env.DB.prepare(`UPDATE forms SET status='published',published_version=current_version,updated_by=?,updated_at=CURRENT_TIMESTAMP
              WHERE id=? AND site_id=? AND status<>'archived'
                AND current_version=?
                AND EXISTS(SELECT 1 FROM form_revisions WHERE site_id=? AND form_id=? AND version=?)`)
              .bind(grant.id, formId, siteId, expectedVersion, siteId, formId, expectedVersion),
            auditAfterChange(env, grant.id, "form.publish", "form", formId, { version: current.version })
          ]);
          if (Number(changed[0]?.meta?.changes || 0) !== 1) return error("FORM_REVISION_CONFLICT", 409);
          return ok({ id: formId, status: "published", publishedVersion: current.version });
        }
        const changed = await env.DB.batch([
          env.DB.prepare("UPDATE forms SET status='archived',updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND site_id=? AND current_version=? AND status<>'archived'")
            .bind(grant.id, formId, siteId, expectedVersion),
          auditAfterChange(env, grant.id, "form.archive", "form", formId, {})
        ]);
        if (Number(changed[0]?.meta?.changes || 0) !== 1) return error("FORM_REVISION_CONFLICT", 409);
        return ok({ id: formId, status: "archived" });
      }
      return error("INVALID_FORM_ACTION", 400);
    }

    if (request.method === "PATCH" || request.method === "DELETE") {
      if (!hasOnlyKeys(body, request.method === "PATCH" ? ["formId", "submissionId", "status"] : ["formId", "submissionId"])) return error("INVALID_FORM_SUBMISSION", 400);
      const formId = typeof body.formId === "string" ? body.formId : "";
      const submissionId = typeof body.submissionId === "string" ? body.submissionId : "";
      if (!/^[0-9a-f-]{36}$/i.test(formId) || !/^[0-9a-f-]{36}$/i.test(submissionId)) return error("INVALID_FORM_SUBMISSION_ID", 400);
      const existing = await env.DB.prepare("SELECT id,status FROM form_submissions WHERE id=? AND form_id=? AND site_id=? LIMIT 1")
        .bind(submissionId, formId, siteId).first<{ id: string; status: string }>();
      if (!existing) return error("FORM_SUBMISSION_NOT_FOUND", 404);
      if (request.method === "DELETE") {
        const admin = await authorizeAdmin(request, env, siteId);
        if (admin instanceof Response) return admin;
        const removed = await env.DB.batch([
          env.DB.prepare("DELETE FROM form_submissions WHERE id=? AND form_id=? AND site_id=?").bind(submissionId, formId, siteId),
          auditAfterChange(env, admin.id, "form.submission.delete", "form_submission", submissionId, { formId })
        ]);
        if (Number(removed[0]?.meta?.changes || 0) !== 1) return error("FORM_SUBMISSION_NOT_FOUND", 404);
        return ok({ id: submissionId, deleted: true });
      }
      if (!(["new", "reviewed", "archived"] as unknown[]).includes(body.status)) return error("INVALID_FORM_SUBMISSION_STATUS", 400);
      const changed = await env.DB.batch([
        env.DB.prepare("UPDATE form_submissions SET status=?,reviewed_by=?,reviewed_at=CURRENT_TIMESTAMP WHERE id=? AND form_id=? AND site_id=? AND status=?")
          .bind(body.status, grant.id, submissionId, formId, siteId, existing.status),
        auditAfterChange(env, grant.id, "form.submission.status", "form_submission", submissionId, { formId, status: body.status })
      ]);
      if (Number(changed[0]?.meta?.changes || 0) !== 1) return error("FORM_SUBMISSION_CONFLICT", 409);
      return ok({ id: submissionId, status: body.status });
    }

    return error("METHOD_NOT_ALLOWED", 405);
  } catch {
    // Missing or pending Forms schema must fail closed instead of implying a
    // successful save, publish, or submission.
    return error("FORMS_UNAVAILABLE", 503, "Az űrlap szolgáltatás jelenleg nem érhető el.");
  }
}
