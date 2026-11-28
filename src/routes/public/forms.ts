import { error, ok } from "../../core/response";
import { MAX_FORM_SUBMISSION_BYTES, normalizeFormDefinition, normalizeFormSubmission, type FormDefinition } from "../../core/forms-contract";
import type { Env } from "../../types/env";

type PublishedForm = {
  id: string; name: string; retention_days: number; version: number; definition_json: string;
};
type PublishedPage = { id: string; published_revision_id: string | null; published_content_json: string | null };
type ExistingSubmission = {
  id: string; site_id: string; form_id: string; form_version: number; page_id: string;
  page_revision_id: string | null; values_json: string; consent_text: string; consent_version: string;
};

function validIdempotencyKey(value: string): boolean {
  // The browser uses crypto.randomUUID(). Keep the key inside the submission
  // primary key so retries need no second index or schema migration.
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function sameSubmission(existing: ExistingSubmission, expected: Omit<ExistingSubmission, "id">): boolean {
  return existing.site_id === expected.site_id && existing.form_id === expected.form_id &&
    existing.form_version === expected.form_version && existing.page_id === expected.page_id &&
    existing.page_revision_id === expected.page_revision_id && existing.values_json === expected.values_json &&
    existing.consent_text === expected.consent_text && existing.consent_version === expected.consent_version;
}

async function resolveIdempotencyReplay(
  env: Env, key: string, expected: Omit<ExistingSubmission, "id">,
  successMessage: string
): Promise<Response | null> {
  const existing = await env.DB.prepare(`SELECT id,site_id,form_id,form_version,page_id,page_revision_id,
      values_json,consent_text,consent_version FROM form_submissions WHERE id=? LIMIT 1`)
    .bind(key).first<ExistingSubmission>();
  if (!existing) return null;
  return sameSubmission(existing, expected)
    ? ok({ submitted: true, message: successMessage })
    : error("IDEMPOTENCY_KEY_REUSED", 409, "A beküldési kulcs már más adatokhoz tartozik. Frissítsd az oldalt, majd próbáld újra.");
}

function safeFormBinding(page: PublishedPage, formId: string): boolean {
  try {
    const document = JSON.parse(page.published_content_json || "null");
    const pageModel = document?.pages?.[page.id];
    if (!pageModel || !pageModel.nodes || typeof pageModel.nodes !== "object" || Array.isArray(pageModel.nodes)) return false;
    return Object.values(pageModel.nodes).some((node: any) =>
      node?.type === "form" && node?.props?.formId === formId && node?.props?.formBindingVersion === 1);
  } catch {
    return false;
  }
}

async function loadPublishedForm(env: Env, siteId: string, pageId: string, formId: string): Promise<{
  form: PublishedForm; page: PublishedPage; definition: FormDefinition;
} | null> {
  const page = await env.DB.prepare(`SELECT id,published_revision_id,published_content_json FROM pages
    WHERE id=? AND site_id=? AND is_published=1 AND archived_at IS NULL LIMIT 1`)
    .bind(pageId, siteId).first<PublishedPage>();
  if (!page || !safeFormBinding(page, formId)) return null;
  const form = await env.DB.prepare(`SELECT f.id,f.name,f.retention_days,
      r.version,r.definition_json
    FROM forms f JOIN form_revisions r
      ON r.site_id=f.site_id AND r.form_id=f.id AND r.version=f.published_version
    WHERE f.id=? AND f.site_id=? AND f.status='published' AND f.published_version IS NOT NULL LIMIT 1`)
    .bind(formId, siteId).first<PublishedForm>();
  if (!form) return null;
  let raw: unknown;
  try { raw = JSON.parse(form.definition_json); } catch { return null; }
  const normalized = normalizeFormDefinition(raw);
  // A database row marked published through an old/manual path must not bypass
  // the current publication gate for a user-visible privacy notice.
  if (!normalized.ok || !normalized.value.consent.privacyUrl) return null;
  return { form, page, definition: normalized.value };
}

function sameOriginJson(request: Request): Response | null {
  const url = new URL(request.url);
  if (request.headers.get("Origin") !== url.origin || request.headers.get("Sec-Fetch-Site") === "cross-site") return error("INVALID_ORIGIN", 403);
  if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get("Content-Type") || "")) return error("INVALID_CONTENT_TYPE", 415);
  return null;
}

async function readBody(request: Request): Promise<Record<string, unknown> | Response> {
  const declared = request.headers.get("Content-Length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > MAX_FORM_SUBMISSION_BYTES)) return error("REQUEST_TOO_LARGE", 413);
  const reader = request.body?.getReader();
  if (!reader) return error("INVALID_JSON", 400);
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_FORM_SUBMISSION_BYTES) {
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

async function clientDigest(siteId: string, formId: string, clientIp: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${siteId}\0${formId}\0${clientIp}`)));
  return [...signature].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function publicFormRoute(request: Request, env: Env, siteId: string): Promise<Response> {
  const url = new URL(request.url);
  const formId = url.searchParams.get("formId") || "";
  const pageId = url.searchParams.get("pageId") || "";
  if (!/^[0-9a-f-]{36}$/i.test(formId) || !/^[0-9a-f-]{36}$/i.test(pageId)) return error("INVALID_FORM_REFERENCE", 400);
  try {
    const published = await loadPublishedForm(env, siteId, pageId, formId);
    if (!published) return error("FORM_NOT_FOUND", 404);
    if (request.method === "GET") return ok({
      id: published.form.id,
      name: published.form.name,
      version: published.form.version,
      definition: published.definition
    });
    if (request.method !== "POST") return error("METHOD_NOT_ALLOWED", 405);
    const originError = sameOriginJson(request);
    if (originError) return originError;
    const body = await readBody(request);
    if (isResponse(body)) return body;
    if (Object.keys(body).some(key => !["values", "consentAccepted", "website"].includes(key))) return error("INVALID_FORM_SUBMISSION", 400);
    const suppliedKey = request.headers.get("Idempotency-Key");
    if (suppliedKey !== null && !validIdempotencyKey(suppliedKey)) return error("INVALID_IDEMPOTENCY_KEY", 400);
    const normalized = normalizeFormSubmission(published.definition, body);
    if (!normalized.ok) return error(normalized.code, 400);
    if (normalized.value.spam) return error("FORM_REJECTED", 422, "A beküldést nem tudtuk feldolgozni.");
    const clientIp = request.headers.get("CF-Connecting-IP") || "";
    if (!clientIp || !env.SESSION_SECRET) return error("FORMS_UNAVAILABLE", 503, "A beküldés jelenleg nem érhető el.");

    const nowSeconds = Math.floor(Date.now() / 1000);
    const windowSeconds = 900;
    const windowStart = Math.floor(nowSeconds / windowSeconds) * windowSeconds;
    const clientHash = await clientDigest(siteId, formId, clientIp, env.SESSION_SECRET);
    const submissionId = suppliedKey?.toLowerCase() || crypto.randomUUID();
    const consentAcceptedAt = new Date().toISOString();
    const valuesJson = JSON.stringify(normalized.value.values);
    const expectedSubmission = {
      site_id: siteId, form_id: formId, form_version: published.form.version, page_id: pageId,
      page_revision_id: published.page.published_revision_id, values_json: valuesJson,
      consent_text: published.definition.consent.text, consent_version: published.definition.consent.version
    };
    if (suppliedKey) {
      const replay = await resolveIdempotencyReplay(env, submissionId, expectedSubmission, published.definition.successMessage);
      if (replay) return replay;
    }
    await env.DB.prepare(`DELETE FROM form_submission_rate_limits
      WHERE expires_at<=? AND rowid IN (SELECT rowid FROM form_submission_rate_limits WHERE expires_at<=? LIMIT 100)`)
      .bind(nowSeconds, nowSeconds).run();
    const result = await env.DB.batch([
      env.DB.prepare(`INSERT INTO form_submission_rate_limits(site_id,form_id,client_hash,window_start,attempts,expires_at)
        SELECT ?,?,?,?,1,? WHERE NOT EXISTS(SELECT 1 FROM form_submissions WHERE id=?)
        ON CONFLICT(site_id,form_id,client_hash,window_start) DO UPDATE SET attempts=form_submission_rate_limits.attempts+1
        WHERE form_submission_rate_limits.attempts<5 AND NOT EXISTS(SELECT 1 FROM form_submissions WHERE id=?)`)
        .bind(siteId, formId, clientHash, windowStart, windowStart + windowSeconds * 2, submissionId, submissionId),
      env.DB.prepare(`INSERT INTO form_submissions
        (id,site_id,form_id,form_version,page_id,page_revision_id,values_json,consent_text,consent_version,consent_accepted_at,received_at,expires_at)
        SELECT ?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,datetime('now','+' || ? || ' days')
        WHERE changes()=1 AND NOT EXISTS(SELECT 1 FROM form_submissions WHERE id=?)
        ON CONFLICT(id) DO NOTHING`)
        .bind(submissionId, siteId, formId, published.form.version, pageId, published.page.published_revision_id,
          valuesJson, published.definition.consent.text, published.definition.consent.version,
          consentAcceptedAt, published.definition.retentionDays, submissionId)
    ]);
    if (Number(result[1]?.meta?.changes || 0) !== 1) {
      if (suppliedKey) {
        // A concurrent request may have committed the same key after the
        // initial lookup. Resolve it without revealing any other submission.
        const replay = await resolveIdempotencyReplay(env, submissionId, expectedSubmission, published.definition.successMessage);
        if (replay) return replay;
      }
    }
    if (Number(result[0]?.meta?.changes || 0) !== 1 || Number(result[1]?.meta?.changes || 0) !== 1) {
      return error("FORM_RATE_LIMITED", 429, "Túl sok beküldés érkezett. Próbáld újra később.");
    }
    return ok({ submitted: true, message: published.definition.successMessage });
  } catch {
    // In particular, an unapplied review-only D1 migration never produces
    // a fake success response.
    return error("FORMS_UNAVAILABLE", 503, "Az űrlap szolgáltatás jelenleg nem érhető el.");
  }
}
