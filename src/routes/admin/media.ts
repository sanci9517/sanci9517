import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import { requireSiteGrant } from "../../core/auth/site-access";
import { DEFAULT_SITE_ID } from "../../core/site-context";
import type { Env } from "../../types/env";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const SITE_MEDIA_LIMIT_BYTES = 5 * 1000 * 1000 * 1000;

type MediaRow = {
  id: string; site_id: string; object_key: string; original_name: string;
  mime_type: string; size_bytes: number; alt_text: string; created_at: string;
};

function imageMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v)) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
  if (bytes.length >= 6 && /^GIF8[79]a$/.test(String.fromCharCode(...bytes.subarray(0,6)))) return "image/gif";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.subarray(0,4)) === "RIFF" &&
      String.fromCharCode(...bytes.subarray(8,12)) === "WEBP") return "image/webp";
  return null;
}

async function boundedBody(request: Request): Promise<Uint8Array | null> {
  if (!request.body) return null;
  const length = request.headers.get("Content-Length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_IMAGE_BYTES)) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > MAX_IMAGE_BYTES) {
        await reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(next.value);
    }
  } finally {
    reader.releaseLock();
  }
  if (!size) return null;
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}

function dto(row: MediaRow) {
  return {
    id: row.id, name: row.original_name, mimeType: row.mime_type,
    sizeBytes: row.size_bytes, altText: row.alt_text, createdAt: row.created_at,
    previewUrl: "/api/admin/media?id=" + encodeURIComponent(row.id)
  };
}

function escapeLike(value: string): string { return value.replace(/[\^%_]/g, "^$&"); }

async function grantEditor(request: Request, env: Env, siteId: string): Promise<Response | null> {
  if (env.SITE_MEMBERSHIP_ENFORCEMENT === "enabled") {
    const grant = await requireSiteGrant(request, env, siteId, "editor");
    return grant instanceof Response ? grant : null;
  }
  if (siteId !== DEFAULT_SITE_ID) return error("SITE_ACCESS_DENIED", 403);
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401);
  return hasRole(user, "editor") ? null : error("FORBIDDEN", 403);
}

async function removeOrphan(env: Env, key: string): Promise<void> {
  try { await env.MEDIA.delete(key); }
  catch { console.error("MEDIA_ORPHAN_CLEANUP_FAILED"); }
}

/** Private image storage API. Publication and asset-picker integration are separate gates. */
export async function adminMediaRoute(request: Request, env: Env, siteId: string): Promise<Response> {
  const denied = await grantEditor(request, env, siteId);
  if (denied) return denied;
  if (!env.MEDIA) return error("MEDIA_STORAGE_UNAVAILABLE", 503);
  const url = new URL(request.url);
  if (request.method === "GET") {
    const id = url.searchParams.get("id");
    if (!id) {
      const query = (url.searchParams.get("q") || "").trim().slice(0, 100);
      const mime = url.searchParams.get("mime") || "";
      const allowedMime = ["", "image/png", "image/jpeg", "image/gif", "image/webp"];
      if (!allowedMime.includes(mime)) return error("INVALID_MEDIA_FILTER", 400);
      const limitRaw = url.searchParams.get("limit") || "50";
      const limit = Number(limitRaw);
      if (!/^\d+$/.test(limitRaw) || limit < 1 || limit > 100) return error("INVALID_MEDIA_LIMIT", 400);
      const clauses = ["site_id=?"];
      const binds: (string | number)[] = [siteId];
      if (query) { clauses.push("(original_name LIKE ? ESCAPE '^' OR alt_text LIKE ? ESCAPE '^')"); const pattern = `%${escapeLike(query)}%`; binds.push(pattern, pattern); }
      if (mime) { clauses.push("mime_type=?"); binds.push(mime); }
      const rows = await env.DB.prepare(
        `SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at FROM media WHERE ${clauses.join(" AND ")} ORDER BY created_at DESC,id DESC LIMIT ${limit}`
      ).bind(...binds).all<MediaRow>();
      return ok({ assets: rows.results.map(dto), maxUploadBytes: MAX_IMAGE_BYTES, siteQuotaBytes: SITE_MEDIA_LIMIT_BYTES });
    }
    if (!/^[0-9a-f-]{36}$/.test(id)) return error("MEDIA_NOT_FOUND", 404);
    const row = await env.DB.prepare(
      "SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at FROM media WHERE id=? AND site_id=? LIMIT 1"
    ).bind(id, siteId).first<MediaRow>();
    if (!row || !["image/png","image/jpeg","image/gif","image/webp"].includes(row.mime_type)) {
      return error("MEDIA_NOT_FOUND", 404);
    }
    const object = await env.MEDIA.get(row.object_key);
    if (!object) return error("MEDIA_OBJECT_MISSING", 404);
    return new Response(object.body, { headers: {
      "Content-Type": row.mime_type,
      "Cache-Control": "private, no-store",
      "Vary": "Cookie",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline"
    } });
  }
  if (request.method === "PATCH") {
    if (request.headers.get("Origin") !== url.origin || request.headers.get("Sec-Fetch-Site") === "cross-site") return error("INVALID_ORIGIN", 403);
    const id = url.searchParams.get("id") || "";
    if (!/^[0-9a-f-]{36}$/.test(id)) return error("MEDIA_NOT_FOUND", 404);
    let body: unknown; try { body = await request.json(); } catch { return error("INVALID_JSON", 400); }
    if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body as object).some(key => key !== "altText")) return error("INVALID_MEDIA_METADATA", 400);
    const altText = (body as { altText?: unknown }).altText;
    if (typeof altText !== "string" || altText.length > 500 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(altText)) return error("INVALID_ALT_TEXT", 400);
    const result = await env.DB.prepare("UPDATE media SET alt_text=? WHERE id=? AND site_id=?").bind(altText.trim(), id, siteId).run();
    if (Number(result.meta?.changes ?? 0) !== 1) return error("MEDIA_NOT_FOUND", 404);
    return ok({ id, altText: altText.trim() });
  }
  if (request.method !== "POST") return error("METHOD_NOT_ALLOWED", 405);
  if (request.headers.get("Origin") !== url.origin ||
      request.headers.get("Sec-Fetch-Site") === "cross-site") return error("INVALID_ORIGIN", 403);
  const filename = (url.searchParams.get("name") || "").trim()
    .replace(/[/\\\x00-\x1f\x7f]/g, "_").slice(0, 160);
  if (!filename) return error("INVALID_MEDIA_NAME", 400);
  const bytes = await boundedBody(request);
  if (!bytes) return error("MEDIA_SIZE_INVALID", 413);
  const mime = imageMime(bytes);
  if (!mime) return error("MEDIA_TYPE_UNSUPPORTED", 415);
  const declared = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (declared && declared !== "application/octet-stream" && declared !== mime) {
    return error("MEDIA_TYPE_MISMATCH", 415);
  }
  const id = crypto.randomUUID();
  const key = "sites/" + encodeURIComponent(siteId) + "/media/" + id;
  try {
    await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: mime } });
  } catch {
    return error("MEDIA_STORAGE_FAILED", 503);
  }
  try {
    const saved = await env.DB.prepare(
      "INSERT INTO media(id,object_key,original_name,mime_type,size_bytes,alt_text,site_id) " +
      "SELECT ?,?,?,?,?,?,? WHERE " +
      "(SELECT COALESCE(SUM(size_bytes),0) FROM media WHERE site_id=?) + ? <= ?"
    ).bind(id,key,filename,mime,bytes.byteLength,"",siteId,siteId,bytes.byteLength,SITE_MEDIA_LIMIT_BYTES).run();
    if (Number(saved.meta?.changes ?? 0) !== 1) {
      await removeOrphan(env,key);
      return error("MEDIA_QUOTA_EXCEEDED", 409);
    }
  } catch {
    await removeOrphan(env,key);
    return error("MEDIA_METADATA_FAILED", 503);
  }
  return Response.json({ ok: true, data: {
    id, name: filename, mimeType: mime, sizeBytes: bytes.byteLength, altText: "",
    previewUrl: "/api/admin/media?id=" + encodeURIComponent(id)
  } }, { status: 201, headers: { "Cache-Control": "no-store" } });
}

function containsAssetReference(value: unknown, assetId: string, depth = 0): boolean {
  if (depth > 32 || value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(item => containsAssetReference(item, assetId, depth + 1));
  const record = value as Record<string, unknown>;
  if (record.assetId === assetId) return true;
  return Object.values(record).some(item => containsAssetReference(item, assetId, depth + 1));
}

/** Public delivery is granted only while an active published page in this site references the asset. */
export async function publishedMediaRoute(request: Request, env: Env, siteId: string, assetId: string): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") return error("METHOD_NOT_ALLOWED", 405);
  if (!/^[0-9a-f-]{36}$/.test(assetId) || !env.MEDIA) return error("MEDIA_NOT_FOUND", 404);
  const row = await env.DB.prepare(
    "SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at FROM media WHERE id=? AND site_id=? LIMIT 1"
  ).bind(assetId, siteId).first<MediaRow>();
  if (!row || !["image/png", "image/jpeg", "image/gif", "image/webp"].includes(row.mime_type)) return error("MEDIA_NOT_FOUND", 404);
  const pages = await env.DB.prepare(
    "SELECT published_content_json FROM pages WHERE site_id=? AND archived_at IS NULL AND is_published=1 AND published_content_json IS NOT NULL AND instr(published_content_json,?)>0"
  ).bind(siteId, assetId).all<{ published_content_json: string }>();
  const allowed = pages.results.some(page => {
    try { return containsAssetReference(JSON.parse(page.published_content_json), assetId); } catch { return false; }
  });
  if (!allowed) return error("MEDIA_NOT_FOUND", 404);
  const object = await env.MEDIA.get(row.object_key);
  if (!object) return error("MEDIA_OBJECT_MISSING", 404);
  const headers = new Headers({
    "Content-Type": row.mime_type,
    "Cache-Control": "public, max-age=300, s-maxage=300",
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": "inline",
    "Content-Length": String(row.size_bytes)
  });
  return new Response(request.method === "HEAD" ? null : object.body, { headers });
}
