import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import { requireSiteGrant } from "../../core/auth/site-access";
import { DEFAULT_SITE_ID } from "../../core/site-context";
import type { Env } from "../../types/env";
import { normalizeCardContent } from "../../../public/editor-v2/core/card-content.js";
import { CONTENT_TYPES, safeMediaUrl } from "../../../public/editor-v2/core/authored-content.js";
import { isLeafType } from "../../../public/editor-v2/core/schema.js";
import { isStructuredType } from "../../../public/editor-v2/core/element-content.js";

// Keep playable uploads inside the existing low-cost, application-level cap.
// This is not a provider billing ceiling and deliberately excludes large video.
const MAX_MEDIA_BYTES = 4 * 1024 * 1024;
const SITE_MEDIA_LIMIT_BYTES = 5 * 1000 * 1000 * 1000;
const MAX_USAGE_SNAPSHOTS = 100;
const MAX_USAGE_REFERENCES = 100;

type MediaRow = {
  id: string; site_id: string; object_key: string; original_name: string;
  mime_type: string; size_bytes: number; alt_text: string; created_at: string; archived_at: string | null;
};

const IMAGE_MIMES = ["image/png", "image/jpeg", "image/gif", "image/webp"] as const;
const PLAYABLE_MIMES = ["audio/mpeg", "audio/ogg", "audio/wav", "video/webm"] as const;
const MEDIA_MIMES = [...IMAGE_MIMES, ...PLAYABLE_MIMES] as const;
function mediaMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v)) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
  if (bytes.length >= 6 && /^GIF8[79]a$/.test(String.fromCharCode(...bytes.subarray(0,6)))) return "image/gif";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.subarray(0,4)) === "RIFF" &&
      String.fromCharCode(...bytes.subarray(8,12)) === "WEBP") return "image/webp";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.subarray(0,4)) === "RIFF" &&
      String.fromCharCode(...bytes.subarray(8,12)) === "WAVE") return "audio/wav";
  if (bytes.length >= 4 && String.fromCharCode(...bytes.subarray(0,4)) === "OggS") return "audio/ogg";
  if (bytes.length >= 3 && String.fromCharCode(...bytes.subarray(0,3)) === "ID3") return "audio/mpeg";
  if (bytes.length >= 4 && bytes[0] === 255 && (bytes[1] & 0xe0) === 0xe0) return "audio/mpeg";
  if (bytes.length >= 4 && [0x1a,0x45,0xdf,0xa3].every((v,i)=>bytes[i]===v)) return "video/webm";
  return null;
}

async function boundedBody(request: Request): Promise<Uint8Array | null> {
  if (!request.body) return null;
  const length = request.headers.get("Content-Length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_MEDIA_BYTES)) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > MAX_MEDIA_BYTES) {
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

// Stable UUIDv4-shaped asset ID from a site-scoped SHA-256 fingerprint.
// Legacy assets retain their randomly generated IDs. Object keys stay random
// so simultaneous retries never delete or overwrite one another's R2 objects.
async function fingerprintId(siteId: string, bytes: Uint8Array): Promise<string> {
  const prefix = new TextEncoder().encode(siteId);
  const material = new Uint8Array(prefix.length + 1 + bytes.length);
  material.set(prefix);
  material.set(bytes, prefix.length + 1);
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", material));
  hash[6] = (hash[6] & 15) | 64;
  hash[8] = (hash[8] & 63) | 128;
  const hex = Array.from(hash.subarray(0, 16), value => value.toString(16).padStart(2,"0")).join("");
  return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20,32)].join("-");
}

async function sameStoredImage(env: Env, row: MediaRow, bytes: Uint8Array, mime: string): Promise<boolean> {
  if (row.size_bytes !== bytes.byteLength || row.mime_type !== mime) return false;
  const object = await env.MEDIA.get(row.object_key);
  if (!object) return false;
  const stored = new Uint8Array(await new Response(object.body).arrayBuffer());
  return stored.length === bytes.length && stored.every((byte, index) => byte === bytes[index]);
}

function dto(row: MediaRow) {
  return {
    id: row.id, name: row.original_name, mimeType: row.mime_type,
    sizeBytes: row.size_bytes, altText: row.alt_text, createdAt: row.created_at,
    archivedAt: row.archived_at,
    previewUrl: "/api/admin/media?id=" + encodeURIComponent(row.id)
  };
}

function escapeLike(value: string): string { return value.replace(/[\^%_]/g, "^$&"); }

function assetPaths(value: unknown, assetId: string, path = "", depth = 0): string[] {
  if (depth > 16 || !value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap((item, index) => assetPaths(item, assetId, `${path}[${index}]`, depth + 1));
  const record = value as Record<string, unknown>;
  const paths: string[] = [];
  for (const [key, item] of Object.entries(record)) {
    const next = path ? `${path}.${key}` : key;
    if ((key === "assetId" || key === "backgroundAssetId" || key === "imageAssetId" || key === "posterAssetId") && item === assetId) paths.push(next);
    else if (item && typeof item === "object") paths.push(...assetPaths(item, assetId, next, depth + 1));
  }
  return paths;
}

function documentAssetReferences(json: string, pageId: string, assetId: string, publicOnly = false, mime = ""): { nodeId: string; nodeName: string; path: string }[] {
  const model = JSON.parse(json) as { pages?: Record<string, { rootId?: string; nodes?: Record<string, { name?: string; type?: string; metadata?: {cardContentVersion?: number;contentVersion?: number;editorContentVersion?: number;rootStyleVersion?: number;editorRootVersion?: number}; props?: unknown; style?: unknown; responsive?: unknown; visibility?: unknown; children?: string[] }> }> };
  const page = model?.pages?.[pageId];
  const nodes = page?.nodes;
  if (!nodes || typeof nodes !== "object") return [];
  const visibleAt = new Map<string, Set<string>>();
  if (publicOnly) {
    // The public renderer rejects a document without its root. A media URL
    // must never grant access from a detached node in that invalid snapshot.
    if (!page?.rootId || !nodes[page.rootId]) return [];
    for (const device of ["desktop", "tablet", "mobile"]) {
      const visited = new Set<string>();
      const pending = [page.rootId];
      while (pending.length) {
        const id = pending.pop()!;
        const node = nodes[id];
        if (visited.has(id) || !node || node.visibility === false ||
            node.visibility && typeof node.visibility === "object" && (node.visibility as Record<string, unknown>)[device] === false) continue;
        visited.add(id);
        if (!visibleAt.has(id)) visibleAt.set(id, new Set());
        visibleAt.get(id)!.add(device);
        // Some saved/legacy snapshots contain children under leaf nodes even
        // though the public renderer discards their HTML. Such descendants
        // must not grant public access to otherwise private media.
        const dropsChildren = isLeafType(node.type || "") || node.type === "schedule" ||
          node.metadata?.contentVersion === 1 && CONTENT_TYPES.includes(node.type || "") && node.type !== "spacer" ||
          isStructuredType(node.type || "") && Boolean((node.props as Record<string, unknown> | undefined)?.contentModel);
        if (node.type === "card" && node.metadata?.cardContentVersion === 1) {
          try { normalizeCardContent((node.props as Record<string, unknown> | undefined)?.cardContent); }
          catch { continue; } // A malformed Card renders only its fallback, without children.
        }
        if (!dropsChildren) for (const child of Array.isArray(node.children) ? node.children : []) if (typeof child === "string") pending.push(child);
      }
    }
  }
  return Object.entries(nodes).flatMap(([nodeId, node]) => {
    const visibleDevices = visibleAt.get(nodeId);
    if (publicOnly && !visibleDevices?.size) return [];
    if (!node || typeof node !== "object") return [];
    const visibility = node.visibility;
    if (publicOnly && (visibility === false || visibility && typeof visibility === "object" && ["desktop", "tablet", "mobile"].every(device => (visibility as Record<string, unknown>)[device] === false))) return [];
    const nodeName = typeof node.name === "string" && node.name.trim() ? node.name : node.type || nodeId;
    const props = node.props as Record<string, unknown> | undefined;
    const validCardImage = () => {
      try { return normalizeCardContent(props?.cardContent).imageAssetId === assetId; }
      catch { return false; }
    };
    const validVideoSource = () => {
      try { return typeof props?.src === "string" && Boolean(safeMediaUrl(props.src)); }
      catch { return false; }
    };
    const renderedBackground = (path: string): boolean => {
      if (!/^(?:style|responsive\.(?:desktop|tablet|mobile))\.backgroundAssetId$/.test(path)) return false;
      if (nodeId === page.rootId && node.metadata?.rootStyleVersion !== 1 && node.metadata?.editorRootVersion !== 1) return false;
      const style = node.style as Record<string, unknown> | undefined;
      const responsive = node.responsive as Record<string, Record<string, unknown>> | undefined;
      return [...(visibleDevices || [])].some(device => {
        const order = device === "mobile" ? ["mobile", "tablet", "desktop"] : device === "tablet" ? ["tablet", "desktop"] : ["desktop"];
        let effective = style?.backgroundAssetId;
        for (const viewport of order.reverse()) {
          const override = responsive?.[viewport]?.backgroundAssetId;
          if (override !== undefined && override !== null && override !== "") effective = override;
        }
        return effective === assetId;
      });
    };
    const renderedReference = (path: string): boolean => {
      if (!publicOnly) return true;
      if (nodeId === page.rootId) return renderedBackground(path);
      const compatible = (kind: "image" | "video" | "audio") => !mime ||
        kind === "image" ? (IMAGE_MIMES as readonly string[]).includes(mime) :
        kind === "video" ? mime === "video/webm" : (PLAYABLE_MIMES as readonly string[]).includes(mime) && mime !== "video/webm";
      return path === "props.assetId" && node.type === "image" && node.metadata?.contentVersion === 1 && compatible("image") ||
        path === "props.assetId" && node.type === "video" && node.metadata?.editorContentVersion === 1 && compatible("video") ||
        path === "props.assetId" && node.type === "audio" && node.metadata?.editorContentVersion === 1 && compatible("audio") ||
        path === "props.cardContent.imageAssetId" && node.type === "card" && node.metadata?.cardContentVersion === 1 && validCardImage() ||
        path === "props.posterAssetId" && node.type === "video" && node.metadata?.contentVersion === 1 && validVideoSource() ||
        /^props\.items\[\d+\]\.assetId$/.test(path) && Number(path.match(/\[(\d+)\]/)?.[1]) < 40 && ["gallery", "carousel"].includes(node.type || "") && node.metadata?.contentVersion === 1 ||
        renderedBackground(path);
    };
    return ["props", "style", "responsive"].flatMap(field =>
      assetPaths(node[field as keyof typeof node], assetId, field)
        .filter(renderedReference)
        .map(path => ({ nodeId, nodeName, path })));
  });
}

async function mediaUsage(env: Env, siteId: string, assetId: string): Promise<Response> {
  const asset = await env.DB.prepare("SELECT id FROM media WHERE id=? AND site_id=? LIMIT 1").bind(assetId, siteId).first<{ id: string }>();
  if (!asset) return error("MEDIA_NOT_FOUND", 404);
  const pages = await env.DB.prepare(
    `SELECT id,title,slug,archived_at,content_json,published_content_json,is_published FROM pages WHERE site_id=? AND (instr(content_json,?)>0 OR instr(published_content_json,?)>0) ORDER BY id LIMIT ${MAX_USAGE_SNAPSHOTS + 1}`
  ).bind(siteId, assetId, assetId).all<{ id: string; title: string; slug: string; archived_at: string | null; content_json: string; published_content_json: string | null; is_published: number }>();
  const revisions = await env.DB.prepare(
    `SELECT p.id AS page_id,p.title,p.slug,p.archived_at,er.version,er.document_json FROM editor_revisions er JOIN pages p ON p.id=er.page_id WHERE p.site_id=? AND instr(er.document_json,?)>0 ORDER BY er.version DESC,er.id DESC LIMIT ${MAX_USAGE_SNAPSHOTS + 1}`
  ).bind(siteId, assetId).all<{ page_id: string; title: string; slug: string; archived_at: string | null; version: number; document_json: string }>();
  const references: { pageId: string; pageTitle: string; slug: string; archived: boolean; source: "draft" | "published" | "revision"; version?: number; nodeId: string; nodeName: string; path: string }[] = [];
  let complete = pages.results.length <= MAX_USAGE_SNAPSHOTS && revisions.results.length <= MAX_USAGE_SNAPSHOTS;
  const add = (json: string | null, page: { id: string; title: string; slug: string; archived_at: string | null }, source: "draft" | "published" | "revision", version?: number) => {
    if (!json || !json.includes(assetId)) return;
    try {
      for (const ref of documentAssetReferences(json, page.id, assetId)) {
        if (references.length >= MAX_USAGE_REFERENCES) { complete = false; return; }
        references.push({ pageId: page.id, pageTitle: page.title, slug: page.slug, archived: Boolean(page.archived_at), source, ...(version === undefined ? {} : { version }), ...ref });
      }
    } catch { complete = false; }
  };
  for (const page of pages.results.slice(0, MAX_USAGE_SNAPSHOTS)) {
    add(page.content_json, page, "draft");
    if (page.is_published) add(page.published_content_json, page, "published");
  }
  for (const revision of revisions.results.slice(0, MAX_USAGE_SNAPSHOTS)) add(revision.document_json, { ...revision, id: revision.page_id }, "revision", revision.version);
  return ok({ assetId, references, complete });
}

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
    if (url.searchParams.get("deletePreflight") === "1") {
    const id=url.searchParams.get("id") || "";
    if (!/^[0-9a-f-]{36}$/.test(id)) return error("MEDIA_NOT_FOUND",404);
    const existing=await env.DB.prepare(
      "SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,archived_at FROM media WHERE id=? AND site_id=? LIMIT 1"
    ).bind(id,siteId).first<MediaRow>();
    if(!existing) return error("MEDIA_NOT_FOUND",404);
    const report=await mediaUsage(env,siteId,id);
    if(!report.ok) return error("MEDIA_USAGE_INCOMPLETE",409);
    const payload=await report.json() as {data?:{complete?:boolean;references?:unknown[]}};
    const complete=payload.data?.complete===true;
    const references=payload.data?.references || [];
    let objectPresent: boolean;
    try { objectPresent=Boolean(await env.MEDIA.head(existing.object_key)); }
    catch { return error("MEDIA_STORAGE_FAILED",503); }
    return ok({
      assetId:id,archived:Boolean(existing.archived_at),objectPresent,
      references:references.length,usageComplete:complete,
      // Advisory only: a second locked recheck and durable retention state
      // are required before an irreversible operation is allowed.
      eligibleForRetention:complete && references.length===0 && Boolean(existing.archived_at),
      permanentDeletionAuthorized:false
    });
  }

    const usageId = url.searchParams.get("usage");
    // An audit must have exactly one explicit mode; never silently fall back
    // to a normal media list for malformed diagnostic requests.
    const missingFlags = url.searchParams.getAll("missingAudit");
    const orphanFlags = url.searchParams.getAll("orphanAudit");
    if ((missingFlags.length && (missingFlags.length !== 1 || missingFlags[0] !== "1")) ||
        (orphanFlags.length && (orphanFlags.length !== 1 || orphanFlags[0] !== "1")) ||
        (missingFlags.length && orphanFlags.length)) return error("INVALID_MEDIA_AUDIT", 400);
    // Diagnostic only: never infer that a recently uploaded object is safe
    // to delete merely because its D1 INSERT has not completed yet.
    if (url.searchParams.get("missingAudit") === "1") {
      if (id !== null || usageId !== null || url.searchParams.has("orphanAudit")) return error("INVALID_MEDIA_AUDIT", 400);
      const before = url.searchParams.get("before");
      if (before !== null && !/^[0-9a-f-]{36}$/.test(before)) return error("INVALID_MEDIA_CURSOR", 400);
      const rows = await env.DB.prepare(
        "SELECT id,object_key,original_name,archived_at FROM media WHERE site_id=? " +
        (before ? "AND id > ? " : "") + "ORDER BY id ASC LIMIT 101"
      ).bind(...(before ? [siteId,before] : [siteId])).all<Pick<MediaRow,"id"|"object_key"|"original_name"|"archived_at">>();
      const batch = rows.results.slice(0,100);
      const missing: { id:string; name:string; archived:boolean }[]=[];
      for (const row of batch) {
        let object;
        try { object = await env.MEDIA.head(row.object_key); }
        catch { return error("MEDIA_STORAGE_FAILED",503); }
        if (!object) missing.push({id:row.id,name:row.original_name,archived:Boolean(row.archived_at)});
      }
      return ok({
        mode:"read-only",checked:batch.length,missing,
        nextCursor:rows.results.length>100 ? batch[batch.length-1]?.id : null,
        complete:rows.results.length<=100,repairAuthorized:false
      });
    }
    if (url.searchParams.get("orphanAudit") === "1") {
      if (id !== null || usageId !== null) return error("INVALID_MEDIA_AUDIT", 400);
      const requestedCursor = url.searchParams.get("cursor");
      if (requestedCursor !== null && (requestedCursor.length > 1024 || !/^[A-Za-z0-9_+\/=:-]+$/.test(requestedCursor)))
        return error("INVALID_MEDIA_CURSOR", 400);
      const prefix = "sites/" + encodeURIComponent(siteId) + "/media/";
      let listing: Awaited<ReturnType<typeof env.MEDIA.list>>;
      try {
        listing = await env.MEDIA.list({
          prefix, limit: 100,
          ...(requestedCursor ? { cursor: requestedCursor } : {})
        });
      } catch { return error("MEDIA_STORAGE_FAILED", 503); }
      const keys = listing.objects.map(item => item.key).filter(key => key.startsWith(prefix));
      const registered = new Set<string>();
      if (keys.length) {
        try {
          const placeholders = keys.map(() => "?").join(",");
          const rows = await env.DB.prepare(
            `SELECT object_key FROM media WHERE site_id=? AND object_key IN (${placeholders})`
          ).bind(siteId, ...keys).all<{ object_key: string }>();
          for (const row of rows.results) registered.add(row.object_key);
        } catch { return error("MEDIA_METADATA_FAILED", 503); }
      }
      return ok({
        mode: "read-only", siteId,
        checked: keys.length,
        // Only candidates: an in-flight upload may legitimately not have
        // committed its D1 row yet. No deletion is authorized by this report.
        unregisteredCandidates: keys.filter(key => !registered.has(key)),
        // These are informational counts, not a deletion plan.
        registeredCount: keys.filter(key => registered.has(key)).length,
        nextCursor: listing.truncated ? listing.cursor : null,
        complete: !listing.truncated,
        deletionAuthorized: false
      });
    }
    if (usageId !== null) {
      if (id !== null || !/^[0-9a-f-]{36}$/.test(usageId)) return error("MEDIA_NOT_FOUND", 404);
      return mediaUsage(env, siteId, usageId);
    }
    if (!id) {
      const query = (url.searchParams.get("q") || "").trim().slice(0, 100);
      const mime = url.searchParams.get("mime") || "";
      const allowedMime = ["", ...MEDIA_MIMES, "audio", "video"];
      if (!allowedMime.includes(mime)) return error("INVALID_MEDIA_FILTER", 400);
      const limitRaw = url.searchParams.get("limit") || "50";
      const limit = Number(limitRaw);
      if (!/^\d+$/.test(limitRaw) || limit < 1 || limit > 100) return error("INVALID_MEDIA_LIMIT", 400);
      const state = url.searchParams.get('state') || 'active';
      if (!['active','archived'].includes(state)) return error('INVALID_MEDIA_STATE',400);
      const before = url.searchParams.get('before');
      if (before !== null && !/^[0-9a-f-]{36}$/.test(before)) return error('INVALID_MEDIA_CURSOR',400);
      const clauses = ['site_id=?', state === 'archived' ? 'archived_at IS NOT NULL' : 'archived_at IS NULL'];
      const binds: (string | number)[] = [siteId];
      if (query) { clauses.push("(original_name LIKE ? ESCAPE '^' OR alt_text LIKE ? ESCAPE '^')"); const pattern = `%${escapeLike(query)}%`; binds.push(pattern, pattern); }
      if (mime === "audio") clauses.push("mime_type LIKE 'audio/%'");
      else if (mime === "video") clauses.push("mime_type LIKE 'video/%'");
      else if (mime) { clauses.push("mime_type=?"); binds.push(mime); }
      if (before !== null) {
        // Resolve the cursor inside the authorized site and requested archive state.
        // The created_at + id pair exactly matches the stable descending sort,
        // including images uploaded within the same database timestamp.
        const cursor = await env.DB.prepare(
          `SELECT created_at,id FROM media WHERE id=? AND site_id=? AND ${state === 'archived' ? 'archived_at IS NOT NULL' : 'archived_at IS NULL'} LIMIT 1`
        ).bind(before,siteId).first<{ created_at:string; id:string }>();
        if (!cursor) return error('INVALID_MEDIA_CURSOR',400);
        clauses.push('(created_at < ? OR (created_at = ? AND id < ?))');
        binds.push(cursor.created_at,cursor.created_at,cursor.id);
      }
      // Fetch one extra record to distinguish the final page from a full page
      // without exposing quota details or making a separate count query.
      const rows = await env.DB.prepare(
        `SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,archived_at FROM media WHERE ${clauses.join(" AND ")} ORDER BY created_at DESC,id DESC LIMIT ${limit + 1}`
      ).bind(...binds).all<MediaRow>();
      // All stored objects count against the application quota, including archived
      // assets. This is D1 metadata usage, not provider-side R2 billing.
      const quota = await env.DB.prepare(
        "SELECT COALESCE(SUM(size_bytes),0) AS used, " +
        "COALESCE(SUM(CASE WHEN archived_at IS NOT NULL THEN size_bytes ELSE 0 END),0) AS archived " +
        "FROM media WHERE site_id=?"
      ).bind(siteId).first<{ used: number; archived: number }>();
      const usedBytes = Number(quota?.used ?? 0);
      const archivedBytes = Number(quota?.archived ?? 0);
      if (!Number.isSafeInteger(usedBytes) || usedBytes < 0 ||
          !Number.isSafeInteger(archivedBytes) || archivedBytes < 0 ||
          archivedBytes > usedBytes) return error("MEDIA_QUOTA_UNAVAILABLE", 503);
      return ok({
        assets: rows.results.slice(0,limit).map(dto),
        nextCursor: rows.results.length > limit ? rows.results[limit-1].id : null,
        maxUploadBytes: MAX_MEDIA_BYTES,
        siteQuotaBytes: SITE_MEDIA_LIMIT_BYTES,
        quota: { usedBytes, archivedBytes,
          activeBytes: usedBytes - archivedBytes,
          remainingBytes: Math.max(0, SITE_MEDIA_LIMIT_BYTES - usedBytes) }
      });
    }
    if (!/^[0-9a-f-]{36}$/.test(id)) return error("MEDIA_NOT_FOUND", 404);
    const row = await env.DB.prepare(
      "SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,archived_at FROM media WHERE id=? AND site_id=? LIMIT 1"
    ).bind(id, siteId).first<MediaRow>();
    if (!row || !(MEDIA_MIMES as readonly string[]).includes(row.mime_type)) {
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
    if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body as object).length !== 1) return error("INVALID_MEDIA_METADATA",400);
    if (Object.prototype.hasOwnProperty.call(body,'archived')) {
      const archived=(body as {archived?:unknown}).archived;
      if (typeof archived !== 'boolean') return error('INVALID_MEDIA_METADATA',400);
      const existing=await env.DB.prepare(
        'SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,archived_at FROM media WHERE id=? AND site_id=? LIMIT 1'
      ).bind(id,siteId).first<MediaRow>();
      if (!existing) return error('MEDIA_NOT_FOUND',404);
      if (Boolean(existing.archived_at)===archived) return ok({id,archived,changed:false});
      if (archived) {
        const report=await mediaUsage(env,siteId,id);
        if (!report.ok) return error('MEDIA_USAGE_INCOMPLETE',409);
        const data=await report.json() as {data?:{complete?:boolean;references?:unknown[]}};
        if (!data.data?.complete) return error('MEDIA_USAGE_INCOMPLETE',409);
        if (data.data.references?.length) return error('MEDIA_ASSET_IN_USE',409);
        // Atomic predicate prevents archiving an asset referenced by an
        // existing draft, live snapshot, archived page or editor revision.
        const changed=await env.DB.prepare(
          "UPDATE media SET archived_at=CURRENT_TIMESTAMP WHERE id=? AND site_id=? AND archived_at IS NULL "+
          "AND NOT EXISTS (SELECT 1 FROM pages p WHERE p.site_id=? AND (instr(COALESCE(p.content_json,''),?)>0 OR instr(COALESCE(p.published_content_json,''),?)>0)) "+
          "AND NOT EXISTS (SELECT 1 FROM editor_revisions er JOIN pages p ON p.id=er.page_id WHERE p.site_id=? AND instr(er.document_json,?)>0)"
        ).bind(id,siteId,siteId,id,id,siteId,id).run();
        if (Number(changed.meta?.changes??0)!==1) return error('MEDIA_ASSET_IN_USE',409);
      } else {
        let present:unknown;
        try { present=await env.MEDIA.get(existing.object_key); }
        catch { return error('MEDIA_STORAGE_FAILED',503); }
        if (!present) return error('MEDIA_OBJECT_MISSING',409);
        const changed=await env.DB.prepare(
          'UPDATE media SET archived_at=NULL WHERE id=? AND site_id=? AND archived_at IS NOT NULL'
        ).bind(id,siteId).run();
        if (Number(changed.meta?.changes??0)!==1) return error('MEDIA_ARCHIVE_CONFLICT',409);
      }
      return ok({id,archived,changed:true});
    }
    if (Object.keys(body as object)[0] !== 'altText') return error('INVALID_MEDIA_METADATA',400);
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
  const mime = mediaMime(bytes);
  if (!mime) return error("MEDIA_TYPE_UNSUPPORTED", 415);
  const declared = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (declared && declared !== "application/octet-stream" && declared !== mime) {
    return error("MEDIA_TYPE_MISMATCH", 415);
  }
  const id = await fingerprintId(siteId, bytes);
  const matching = await env.DB.prepare(
    "SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,archived_at FROM media WHERE id=? AND site_id=? LIMIT 1"
  ).bind(id,siteId).first<MediaRow>();
  if (matching) {
    if (matching.archived_at) return error('MEDIA_ARCHIVED_EXISTS',409);
    try {
      if (!await sameStoredImage(env, matching, bytes, mime)) return error("MEDIA_DUPLICATE_CONFLICT", 409);
    } catch { return error("MEDIA_STORAGE_FAILED", 503); }
    return Response.json({ok:true,data:{...dto(matching),duplicate:true}}, {status:200,headers:{"Cache-Control":"no-store"}});
  }
  // Never share an R2 key between requests: only the losing request's object
  // may be deleted when a concurrent INSERT collides on the deterministic ID.
  const key = "sites/" + encodeURIComponent(siteId) + "/media/" + crypto.randomUUID();
  try {
    await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: mime } });
  } catch {
    return error("MEDIA_STORAGE_FAILED", 503);
  }
  let inserted = false;
  try {
    const saved = await env.DB.prepare(
      "INSERT INTO media(id,object_key,original_name,mime_type,size_bytes,alt_text,site_id) " +
      "SELECT ?,?,?,?,?,?,? WHERE " +
      "(SELECT COALESCE(SUM(size_bytes),0) FROM media WHERE site_id=?) + ? <= ?"
    ).bind(id,key,filename,mime,bytes.byteLength,"",siteId,siteId,bytes.byteLength,SITE_MEDIA_LIMIT_BYTES).run();
    inserted = Number(saved.meta?.changes ?? 0) === 1;
  } catch {
    // A concurrent upload may have committed the same content. In either
    // case our randomly named R2 object is not owned by the winning row.
  }
  if (!inserted) {
    let existing: MediaRow | null = null;
    try {
      existing = await env.DB.prepare(
        "SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,archived_at FROM media WHERE id=? AND site_id=? LIMIT 1"
      ).bind(id,siteId).first<MediaRow>();
      if (existing) {
        if (existing.archived_at) { await removeOrphan(env,key); return error('MEDIA_ARCHIVED_EXISTS',409); }
        // A D1 client error can occur after a committed INSERT. Never delete
        // the object that a successfully committed row actually owns.
        if (existing.object_key === key) {
          return Response.json({ok:true,data:{...dto(existing),duplicate:false}}, {status:201,headers:{"Cache-Control":"no-store"}});
        }
        await removeOrphan(env,key);
        if (!await sameStoredImage(env, existing, bytes, mime)) return error("MEDIA_DUPLICATE_CONFLICT", 409);
        return Response.json({ok:true,data:{...dto(existing),duplicate:true}}, {status:200,headers:{"Cache-Control":"no-store"}});
      }
    } catch { await removeOrphan(env,key); return error("MEDIA_METADATA_FAILED",503); }
    await removeOrphan(env,key);
    // Either quota rejection or a DB failure. Do not claim quota exhaustion
    // until the condition can actually be verified.
    try {
      const usage=await env.DB.prepare(
        "SELECT COALESCE(SUM(size_bytes),0) AS total FROM media WHERE site_id=?"
      ).bind(siteId).first<{total:number}>();
      if (Number(usage?.total??0)+bytes.byteLength>SITE_MEDIA_LIMIT_BYTES) return error("MEDIA_QUOTA_EXCEEDED",409);
    } catch { /* Report metadata failure below. */ }
    return error("MEDIA_METADATA_FAILED",503);
  }
  return Response.json({ ok: true, data: {
    id, name: filename, mimeType: mime, sizeBytes: bytes.byteLength, altText: "", duplicate:false,
    previewUrl: "/api/admin/media?id=" + encodeURIComponent(id)
  } }, { status: 201, headers: { "Cache-Control": "no-store" } });
}

/** Public delivery is granted only while an active published page in this site references the asset. */
export async function publishedMediaRoute(request: Request, env: Env, siteId: string, assetId: string): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") return error("METHOD_NOT_ALLOWED", 405);
  if (!/^[0-9a-f-]{36}$/.test(assetId) || !env.MEDIA) return error("MEDIA_NOT_FOUND", 404);
  const row = await env.DB.prepare(
    "SELECT id,site_id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,archived_at FROM media WHERE id=? AND site_id=? LIMIT 1"
  ).bind(assetId, siteId).first<MediaRow>();
  if (!row || row.archived_at || !(MEDIA_MIMES as readonly string[]).includes(row.mime_type)) return error("MEDIA_NOT_FOUND", 404);
  const pages = await env.DB.prepare(
    "SELECT id,published_content_json FROM pages WHERE site_id=? AND archived_at IS NULL AND is_published=1 AND published_content_json IS NOT NULL AND instr(published_content_json,?)>0"
  ).bind(siteId, assetId).all<{ id: string; published_content_json: string }>();
  const allowed = pages.results.some(page => {
    try { return documentAssetReferences(page.published_content_json, page.id, assetId, true, row.mime_type).length > 0; } catch { return false; }
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
