import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole, type AuthUser } from "../../core/auth/require-auth";
import { requireSiteGrant } from "../../core/auth/site-access";
import { DEFAULT_SITE_ID } from "../../core/site-context";
import type { Env } from "../../types/env";

const MAX_BODY_BYTES = 8 * 1024;
const MAX_FAVORITES = 32;
const VALID_ELEMENT_TYPE = /^[a-z][a-z0-9_-]{0,47}$/u;

type StoredPreferences = { version: 1; paletteFavoriteTypes: string[] };
type PreferenceRow = { preferences_json: string; updated_at: string };

function defaults(): StoredPreferences {
  return { version: 1, paletteFavoriteTypes: [] };
}

function normalizeStored(value: unknown): StoredPreferences {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaults();
  const record = value as Record<string, unknown>;
  if (record.version !== 1 || !Array.isArray(record.paletteFavoriteTypes)) return defaults();
  return { version: 1, paletteFavoriteTypes: normalizeFavoriteTypes(record.paletteFavoriteTypes) };
}

function normalizeFavoriteTypes(value: unknown[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item !== "string" || !VALID_ELEMENT_TYPE.test(item) || seen.has(item)) continue;
    seen.add(item);
    result.push(item);
    if (result.length === MAX_FAVORITES) break;
  }
  return result;
}

async function readBoundedJson(request: Request): Promise<unknown | Response> {
  const declaredLength = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return error("PREFERENCES_TOO_LARGE", 413);
  }
  if (!request.body) return error("INVALID_JSON", 400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        return error("PREFERENCES_TOO_LARGE", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    return error("INVALID_JSON", 400);
  }
}

async function resolveEditorUser(request: Request, env: Env, siteId: string): Promise<AuthUser | Response> {
  if (!siteId || !siteId.trim()) return error("SITE_CONTEXT_INVALID", 403);
  if (env.SITE_MEMBERSHIP_ENFORCEMENT === "enabled") {
    const grant = await requireSiteGrant(request, env, siteId, "editor");
    return grant instanceof Response ? grant : grant.user;
  }
  if (siteId !== DEFAULT_SITE_ID) return error("SITE_ACCESS_DENIED", 403);
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");
  return user;
}

export async function editorPreferencesRoute(request: Request, env: Env, siteId = DEFAULT_SITE_ID): Promise<Response> {
  if (request.method !== "GET" && request.method !== "PUT") return error("METHOD_NOT_ALLOWED", 405);
  const user = await resolveEditorUser(request, env, siteId);
  if (user instanceof Response) return user;

  if (request.method === "GET") {
    try {
      const row = await env.DB.prepare(
        "SELECT preferences_json, updated_at FROM editor_preferences WHERE user_id = ? LIMIT 1"
      ).bind(user.id).first<PreferenceRow>();
      let parsed: unknown = null;
      try { parsed = row ? JSON.parse(row.preferences_json) as unknown : null; } catch { /* recover to safe defaults */ }
      const preferences = normalizeStored(parsed);
      return ok({ ...preferences, updatedAt: row?.updated_at ?? null });
    } catch {
      return error("PREFERENCES_UNAVAILABLE", 503, "A szerkesztői beállítások most nem tölthetők be.");
    }
  }

  const body = await readBoundedJson(request);
  if (body instanceof Response) return body;
  if (!body || typeof body !== "object" || Array.isArray(body)) return error("INVALID_PREFERENCES", 400);
  const record = body as Record<string, unknown>;
  if (Object.keys(record).some(key => key !== "paletteFavoriteTypes") || !Array.isArray(record.paletteFavoriteTypes)) {
    return error("INVALID_PREFERENCES", 400, "Csak a támogatott szerkesztői kedvenceket lehet menteni.");
  }
  if (record.paletteFavoriteTypes.length > MAX_FAVORITES ||
      record.paletteFavoriteTypes.some(item => typeof item !== "string" || !VALID_ELEMENT_TYPE.test(item))) {
    return error("INVALID_PREFERENCES", 400, "A kedvencek listája érvénytelen vagy túl hosszú.");
  }

  try {
    const current = await env.DB.prepare(
      "SELECT preferences_json FROM editor_preferences WHERE user_id = ? LIMIT 1"
    ).bind(user.id).first<{ preferences_json: string }>();
    let existing: Record<string, unknown> = {};
    try {
      const parsed: unknown = current ? JSON.parse(current.preferences_json) as unknown : null;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) existing = parsed as Record<string, unknown>;
    } catch { /* replace malformed legacy JSON with the supported versioned record */ }
    const preferences = { ...existing, version: 1, paletteFavoriteTypes: normalizeFavoriteTypes(record.paletteFavoriteTypes) };
    const serialized = JSON.stringify(preferences);
    if (new TextEncoder().encode(serialized).byteLength > MAX_BODY_BYTES) return error("PREFERENCES_TOO_LARGE", 413);
    await env.DB.prepare(`
      INSERT INTO editor_preferences (user_id, preferences_json, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        preferences_json = excluded.preferences_json,
        updated_at = CURRENT_TIMESTAMP
    `).bind(user.id, serialized).run();
    const row = await env.DB.prepare("SELECT updated_at FROM editor_preferences WHERE user_id = ? LIMIT 1")
      .bind(user.id).first<{ updated_at: string }>();
    return ok({ ...preferences, updatedAt: row?.updated_at ?? null });
  } catch {
    return error("PREFERENCES_UNAVAILABLE", 503, "A szerkesztői beállításokat most nem lehet menteni.");
  }
}
