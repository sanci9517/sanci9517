import { error, json, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole, type AuthUser } from "../../core/auth/require-auth";
import { requireSiteGrant } from "../../core/auth/site-access";
import { DEFAULT_SITE_ID } from "../../core/site-context";
import type { Env } from "../../types/env";

const MAX_BODY_BYTES = 8 * 1024;
const MAX_FAVORITES = 32;
const VALID_ELEMENT_TYPE = /^[a-z][a-z0-9_-]{0,47}$/u;
const LEFT_TABS = ["pages", "elements", "layers", "schedule", "navigation"] as const;
const INSPECTOR_TABS = ["design", "content", "advanced"] as const;
const DOCK_ORDERS = ["left-canvas-right", "canvas-left-right", "left-right-canvas", "right-left-canvas", "right-canvas-left", "canvas-right-left"] as const;
const LAYOUTS = ["balanced", "canvas", "inspector", "custom"] as const;
const THEMES = ["graphite", "aurora", "ocean", "sage", "cinder"] as const;
const PANEL_MODES = ["separate", "tabbed", "floating"] as const;
const HEX_COLOR = /^#[0-9a-f]{6}$/iu;
const DOCK_TREE_ID = /^[a-z][a-z\d-]{0,63}$/iu;

type WorkspacePreferences = { version: 1; appearance: Record<string, unknown>; dock: Record<string, unknown>; viewport: Record<string, unknown> };
type PreferenceField = "paletteFavoriteTypes" | "workspace";
type StoredPreferences = {
  version: 1;
  paletteFavoriteTypes: string[];
  workspace: WorkspacePreferences | null;
  revisions: Record<PreferenceField, number>;
};
type PreferenceRow = { preferences_json: string; updated_at: string };

function defaults(): StoredPreferences {
  return { version: 1, paletteFavoriteTypes: [], workspace: null, revisions: { paletteFavoriteTypes: 0, workspace: 0 } };
}

function normalizeStored(value: unknown): StoredPreferences {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaults();
  const record = value as Record<string, unknown>;
  if (record.version !== 1) return defaults();
  const revisions = isRecord(record.revisions) ? record.revisions : {};
  const revision = (field: PreferenceField) => Number.isSafeInteger(revisions[field]) && Number(revisions[field]) >= 0
    ? Number(revisions[field]) : 0;
  return {
    version: 1,
    paletteFavoriteTypes: Array.isArray(record.paletteFavoriteTypes) ? normalizeFavoriteTypes(record.paletteFavoriteTypes) : [],
    workspace: normalizeWorkspace(record.workspace),
    revisions: { paletteFavoriteTypes: revision("paletteFavoriteTypes"), workspace: revision("workspace") }
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
}

function normalizeDockTree(value: unknown): Record<string, unknown> | null {
  const ids = new Set<string>();
  const leaves = new Set<string>();
  let count = 0;
  const visit = (input: unknown, depth: number, inTabs = false): Record<string, unknown> | null => {
    if (!isRecord(input) || depth > 8 || ++count > 31 || typeof input.id !== "string" || !DOCK_TREE_ID.test(input.id) || ids.has(input.id)) return null;
    ids.add(input.id);
    if (input.kind === "canvas") {
      if (inTabs || leaves.has("canvas")) return null;
      leaves.add("canvas");
      return { id: input.id, kind: "canvas" };
    }
    if (input.kind === "panel") {
      if ((input.side !== "left" && input.side !== "right") || leaves.has(input.side)) return null;
      leaves.add(input.side);
      return { id: input.id, kind: "panel", side: input.side };
    }
    if ((input.kind !== "split" && input.kind !== "tabs") || !Array.isArray(input.children)) return null;
    if (input.kind === "split") {
      if (input.children.length !== 2 || !["horizontal", "vertical"].includes(String(input.axis))) return null;
      const ratio = Number(input.ratio);
      if (!Number.isFinite(ratio) || ratio < 0.1 || ratio > 0.9) return null;
      const children = input.children.map(child => visit(child, depth + 1, inTabs));
      return children.every(Boolean) ? { id: input.id, kind: "split", axis: input.axis, ratio, children } : null;
    }
    if (input.children.length < 2 || input.children.length > 3) return null;
    const children = input.children.map(child => visit(child, depth + 1, true));
    if (!children.every(Boolean) || typeof input.activeId !== "string" || !children.some(child => child?.id === input.activeId)) return null;
    return { id: input.id, kind: "tabs", activeId: input.activeId, children };
  };
  const tree = visit(value, 0);
  return tree && leaves.size === 3 && ["canvas", "left", "right"].every(leaf => leaves.has(leaf)) ? tree : null;
}

function normalizeWorkspace(value: unknown): WorkspacePreferences | null {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.appearance) || !isRecord(value.dock) || !isRecord(value.viewport)) return null;
  const appearance = value.appearance;
  const dock = value.dock;
  const viewport = value.viewport;
  const layout = LAYOUTS.includes(appearance.layout as typeof LAYOUTS[number]) ? appearance.layout : "canvas";
  const theme = THEMES.includes(appearance.theme as typeof THEMES[number]) ? appearance.theme : "graphite";
  const density = appearance.density === "compact" ? "compact" : "comfortable";
  const accent = typeof appearance.accent === "string" && HEX_COLOR.test(appearance.accent) ? appearance.accent.toLowerCase() : "#5b8cff";
  const dockOrder = DOCK_ORDERS.includes(appearance.dockOrder as typeof DOCK_ORDERS[number]) ? appearance.dockOrder : "left-canvas-right";
  const panelMode = PANEL_MODES.includes(appearance.panelMode as typeof PANEL_MODES[number]) ? appearance.panelMode : "separate";
  const panelSide = appearance.panelSide === "left" ? "left" : "right";
  const floating = isRecord(appearance.floatingPosition) ? appearance.floatingPosition : {};
  const floatingSide = (side: "left" | "right") => isRecord(floating[side]) ? floating[side] as Record<string, unknown> : {};
  const appearanceValue: Record<string, unknown> = {
    layout, theme, density, accent, dockOrder, panelMode, panelSide,
    floatingPosition: {
      left: { x: Math.round(clampNumber(floatingSide("left").x, 0, 600, 0)), y: Math.round(clampNumber(floatingSide("left").y, 0, 600, 0)) },
      right: { x: Math.round(clampNumber(floatingSide("right").x, 0, 600, 0)), y: Math.round(clampNumber(floatingSide("right").y, 0, 600, 0)) }
    }
  };
  const dockTree = appearance.dockTree == null ? null : normalizeDockTree(appearance.dockTree);
  if (dockTree) appearanceValue.dockTree = dockTree;

  const leftTab = LEFT_TABS.includes(dock.leftTab as typeof LEFT_TABS[number]) ? dock.leftTab : "pages";
  const suppliedOrder = Array.isArray(dock.leftTabOrder) ? dock.leftTabOrder : [];
  const leftTabOrder = [...new Set(suppliedOrder.filter((item): item is typeof LEFT_TABS[number] => LEFT_TABS.includes(item as typeof LEFT_TABS[number])))];
  for (const tab of LEFT_TABS) if (!leftTabOrder.includes(tab)) leftTabOrder.push(tab);
  const inspectorTab = INSPECTOR_TABS.includes(dock.inspectorTab as typeof INSPECTOR_TABS[number]) ? dock.inspectorTab : "design";
  const panelActive = dock.panelActive === "right" ? "right" : "left";
  const device = ["desktop", "tablet", "mobile"].includes(String(viewport.device)) ? viewport.device : "desktop";
  const zoom = clampNumber(viewport.zoom, 0.35, 1.5, 1);
  return {
    version: 1,
    appearance: appearanceValue,
    dock: {
      leftOpen: dock.leftOpen === true,
      rightOpen: dock.rightOpen === true,
      leftTab,
      leftTabOrder,
      inspectorTab,
      panelActive,
      leftWidth: Math.round(clampNumber(dock.leftWidth, 250, 460, 310)),
      rightWidth: Math.round(clampNumber(dock.rightWidth, 260, 440, 352))
    },
    viewport: { device, zoom }
  };
}

function validWorkspaceInput(value: unknown): boolean {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.appearance) || !isRecord(value.dock) || !isRecord(value.viewport)) return false;
  if (Object.keys(value).some(key => !["version", "appearance", "dock", "viewport"].includes(key))) return false;
  if (Object.keys(value.appearance).some(key => !["version", "layout", "theme", "density", "accent", "dockOrder", "panelMode", "panelSide", "floatingPosition", "dockTree", "profiles"].includes(key))) return false;
  if (Object.keys(value.dock).some(key => !["leftOpen", "rightOpen", "leftTab", "leftTabOrder", "inspectorTab", "panelActive", "leftWidth", "rightWidth"].includes(key))) return false;
  if (Object.keys(value.viewport).some(key => !["device", "zoom"].includes(key))) return false;
  if (value.appearance.layout != null && !LAYOUTS.includes(value.appearance.layout as typeof LAYOUTS[number])) return false;
  if (value.appearance.theme != null && !THEMES.includes(value.appearance.theme as typeof THEMES[number])) return false;
  if (value.appearance.density != null && !["comfortable", "compact"].includes(String(value.appearance.density))) return false;
  if (value.appearance.dockOrder != null && !DOCK_ORDERS.includes(value.appearance.dockOrder as typeof DOCK_ORDERS[number])) return false;
  if (value.appearance.panelMode != null && !PANEL_MODES.includes(value.appearance.panelMode as typeof PANEL_MODES[number])) return false;
  if (value.appearance.panelSide != null && !["left", "right"].includes(String(value.appearance.panelSide))) return false;
  if (value.appearance.accent != null && (typeof value.appearance.accent !== "string" || !HEX_COLOR.test(value.appearance.accent))) return false;
  if (value.appearance.floatingPosition != null) {
    if (!isRecord(value.appearance.floatingPosition) || Object.keys(value.appearance.floatingPosition).some(key => !["left", "right"].includes(key))) return false;
    for (const side of ["left", "right"] as const) {
      const point = value.appearance.floatingPosition[side];
      if (point != null && (!isRecord(point) || Object.keys(point).some(key => !["x", "y"].includes(key)) || [point.x, point.y].some(item => item != null && !Number.isFinite(Number(item))))) return false;
    }
  }
  if (value.appearance.dockTree != null && !normalizeDockTree(value.appearance.dockTree)) return false;
  if (value.dock.leftTab != null && !LEFT_TABS.includes(value.dock.leftTab as typeof LEFT_TABS[number])) return false;
  if (value.dock.inspectorTab != null && !INSPECTOR_TABS.includes(value.dock.inspectorTab as typeof INSPECTOR_TABS[number])) return false;
  if (value.dock.panelActive != null && !["left", "right"].includes(String(value.dock.panelActive))) return false;
  if (value.dock.leftTabOrder != null && (!Array.isArray(value.dock.leftTabOrder) || value.dock.leftTabOrder.length > LEFT_TABS.length || value.dock.leftTabOrder.some(item => !LEFT_TABS.includes(item as typeof LEFT_TABS[number])))) return false;
  for (const key of ["leftWidth", "rightWidth"] as const) if (value.dock[key] != null && !Number.isFinite(Number(value.dock[key]))) return false;
  if (value.viewport.device != null && !["desktop", "tablet", "mobile"].includes(String(value.viewport.device))) return false;
  if (value.viewport.zoom != null && (!Number.isFinite(Number(value.viewport.zoom)) || Number(value.viewport.zoom) < 0.35 || Number(value.viewport.zoom) > 1.5)) return false;
  return true;
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
  const keys = Object.keys(record);
  if (!keys.length || keys.some(key => key !== "paletteFavoriteTypes" && key !== "workspace" && key !== "baseRevisions" && key !== "ownerUserId") ||
      ("paletteFavoriteTypes" in record && !Array.isArray(record.paletteFavoriteTypes))) {
    return error("INVALID_PREFERENCES", 400, "Csak a támogatott szerkesztői beállításokat lehet menteni.");
  }
  // A long-lived editor can outlive an account switch in another tab. Bind
  // preference writes to the identity the UI loaded so an old workspace is
  // never silently saved into the newly authenticated user's account.
  if ("ownerUserId" in record && (typeof record.ownerUserId !== "string" || record.ownerUserId !== user.id)) {
    return error("PREFERENCES_OWNER_CHANGED", 409, "A bejelentkezett fiók megváltozott. Töltsd újra a szerkesztőt, mielőtt mentenéd a munkaterületet.");
  }
  if (Array.isArray(record.paletteFavoriteTypes) && (record.paletteFavoriteTypes.length > MAX_FAVORITES ||
      record.paletteFavoriteTypes.some(item => typeof item !== "string" || !VALID_ELEMENT_TYPE.test(item)))) {
    return error("INVALID_PREFERENCES", 400, "A kedvencek listája érvénytelen vagy túl hosszú.");
  }
  if ("workspace" in record && !validWorkspaceInput(record.workspace)) return error("INVALID_PREFERENCES", 400, "A munkaterület beállítása érvénytelen.");

  const changedFields = (["paletteFavoriteTypes", "workspace"] as const).filter(field => field in record);
  if (!changedFields.length || !isRecord(record.baseRevisions) ||
      Object.keys(record.baseRevisions).some(field => !changedFields.includes(field as PreferenceField)) ||
      changedFields.some(field => !Object.hasOwn(record.baseRevisions as object, field) ||
        !Number.isSafeInteger((record.baseRevisions as Record<string, unknown>)[field]) ||
        Number((record.baseRevisions as Record<string, unknown>)[field]) < 0)) {
    return error("PREFERENCES_REVISION_REQUIRED", 428, "A fiókbeállítás verziója hiányzik vagy érvénytelen. Frissítsd a szerkesztőt, majd próbáld újra.");
  }
  const baseRevisions = record.baseRevisions as Record<PreferenceField, number>;

  try {
    // Merge only fields in this request, but compare a per-field revision in
    // the same SQLite statement. Independent fields commute; a stale write to
    // the same field is rejected instead of silently replacing newer state.
    const patch: Partial<StoredPreferences> = { version: 1 };
    if (Array.isArray(record.paletteFavoriteTypes)) patch.paletteFavoriteTypes = normalizeFavoriteTypes(record.paletteFavoriteTypes);
    if ("workspace" in record) patch.workspace = normalizeWorkspace(record.workspace);
    const serializedPatch = JSON.stringify(patch);
    const serializedDefaults = JSON.stringify(defaults());
    if (new TextEncoder().encode(serializedPatch).byteLength > MAX_BODY_BYTES) return error("PREFERENCES_TOO_LARGE", 413);
    const revisionExpression = (field: PreferenceField) => `CASE
      WHEN json_valid(editor_preferences.preferences_json)
        AND json_extract(editor_preferences.preferences_json, '$.version') = 1
      THEN COALESCE(CAST(json_extract(editor_preferences.preferences_json, '$.revisions.${field}') AS INTEGER), 0)
      ELSE 0
    END`;
    const initial = defaults();
    for (const field of changedFields) initial.revisions[field] = baseRevisions[field] + 1;
    const setRevisionSql = changedFields.map(field => `'$.revisions.${field}', ${revisionExpression(field)} + 1`).join(", ");
    const whereRevisionSql = changedFields.map(field => `${revisionExpression(field)} = ?`).join(" AND ");
    const insertRevisionSql = changedFields.map(() => "? = 0").join(" AND ");
    const result = await env.DB.prepare(`
      INSERT INTO editor_preferences (user_id, preferences_json, updated_at)
      SELECT ?, ?, CURRENT_TIMESTAMP
      WHERE ${insertRevisionSql}
      ON CONFLICT(user_id) DO UPDATE SET
        preferences_json = json_set(json_patch(
          CASE
            WHEN json_valid(editor_preferences.preferences_json)
              AND json_extract(editor_preferences.preferences_json, '$.version') = 1
            THEN editor_preferences.preferences_json
            ELSE ?
          END,
          ?
        ), ${setRevisionSql}),
        updated_at = CURRENT_TIMESTAMP
      WHERE ${whereRevisionSql}
    `).bind(user.id, JSON.stringify({ ...initial, ...patch, revisions: initial.revisions }),
      ...changedFields.map(field => baseRevisions[field]), serializedDefaults, serializedPatch,
      ...changedFields.map(field => baseRevisions[field])).run();
    const row = await env.DB.prepare("SELECT preferences_json, updated_at FROM editor_preferences WHERE user_id = ? LIMIT 1")
      .bind(user.id).first<PreferenceRow>();
    let saved: unknown = null;
    try { saved = row ? JSON.parse(row.preferences_json) as unknown : null; } catch { /* fail closed to safe defaults */ }
    const preferences = normalizeStored(saved);
    if (Number(result.meta?.changes ?? 0) === 0) {
      return json({ ok: false, error: { code: "PREFERENCES_CONFLICT", message: "Ezt a beállítást közben egy másik munkamenet módosította." },
        data: { ...preferences, updatedAt: row?.updated_at ?? null } }, 409);
    }
    return ok({ ...preferences, updatedAt: row?.updated_at ?? null });
  } catch {
    return error("PREFERENCES_UNAVAILABLE", 503, "A szerkesztői beállításokat most nem lehet menteni.");
  }
}
