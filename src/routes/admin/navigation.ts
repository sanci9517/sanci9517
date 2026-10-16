import { error, ok } from "../../core/response";
import { auditStatement } from "../../core/audit";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import { getCanonicalSiteContext } from "../../core/site-context";
import type { Env } from "../../types/env";

type NavItem = {
  id: string;
  type: "page" | "external";
  pageId?: string;
  url?: string;
  label?: string;
  children: NavItem[];
};
type NavTree = { schemaVersion: 1; items: NavItem[] };
type PageRow = { id: string; title: string; slug: string; published_title: string | null; published_slug: string | null; is_published: number };
type NavRow = { draft_json: string; published_json: string; revision: number; published_revision: number };

function parse(value: string): unknown {
  try { return JSON.parse(value); } catch { return null; }
}

function validateTree(value: unknown): { tree?: NavTree; pageIds: string[]; code?: string } {
  if (!value || typeof value !== "object") return { pageIds: [], code: "INVALID_NAVIGATION" };
  const root = value as Record<string, unknown>;
  if (root.schemaVersion !== 1 || !Array.isArray(root.items)) return { pageIds: [], code: "INVALID_NAVIGATION" };
  const ids = new Set<string>();
  const pageIds: string[] = [];
  let count = 0;

  const walk = (items: unknown[], depth: number): NavItem[] | null => {
    if (depth > 5) return null;
    const result: NavItem[] = [];
    for (const candidate of items) {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
      const item = candidate as Record<string, unknown>;
      if (typeof item.id !== "string" || item.id.length < 1 || item.id.length > 128 || ids.has(item.id)) return null;
      if (!Array.isArray(item.children)) return null;
      if (item.label !== undefined && typeof item.label !== "string") return null;
      ids.add(item.id);
      if (++count > 100) return null;
      const children = walk(item.children, depth + 1);
      if (!children) return null;
      const label = typeof item.label === "string" ? item.label.trim() : undefined;
      if (label !== undefined && (!label || label.length > 80)) return null;

      if (item.type === "page") {
        if (typeof item.pageId !== "string" || !item.pageId || item.pageId.length > 128 || item.url !== undefined) return null;
        pageIds.push(item.pageId);
        result.push({ id: item.id, type: "page", pageId: item.pageId, ...(label ? { label } : {}), children });
      } else if (item.type === "external") {
        if (typeof item.url !== "string" || item.url.length > 2048 || typeof item.label !== "string") return null;
        let normalizedUrl = "";
        try {
          const url = new URL(item.url);
          if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return null;
          normalizedUrl = url.href;
        } catch { return null; }
        result.push({ id: item.id, type: "external", url: normalizedUrl, label: label ?? item.label.trim(), children });
        if (!result[result.length - 1].label) return null;
      } else return null;
    }
    return result;
  };

  const items = walk(root.items, 1);
  if (!items) return { pageIds: [], code: "INVALID_NAVIGATION" };
  return { tree: { schemaVersion: 1, items }, pageIds };
}

function parseTree(value: string): NavTree | null {
  const parsed = parse(value);
  return validateTree(parsed).tree ?? null;
}

async function adminNavigationRouteImpl(request: Request, env: Env): Promise<Response> {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");
  const { siteId } = getCanonicalSiteContext();

  if (request.method === "GET") {
    const row = await env.DB.prepare("SELECT draft_json,published_json,revision,published_revision FROM site_navigation WHERE site_id=? LIMIT 1").bind(siteId).first<NavRow>();
    if (!row) return error("NAVIGATION_NOT_INITIALIZED", 503, "A navigációs adattár még nincs inicializálva.");
    const pages = await env.DB.prepare("SELECT id,title,slug,published_title,published_slug,is_published FROM pages WHERE archived_at IS NULL AND site_id=? ORDER BY sort_order,id").bind(siteId).all<PageRow>();
    return ok({ draft: parseTree(row.draft_json), published: parseTree(row.published_json), revision: row.revision, publishedRevision: row.published_revision,
      pages: pages.results.map(page => ({ id: page.id, title: page.title, slug: page.slug, isPublished: Boolean(page.is_published), publishedTitle: page.published_title, publishedSlug: page.published_slug })) });
  }

  if (request.method !== "PUT" && request.method !== "POST") return error("METHOD_NOT_ALLOWED", 405);
  let body: Record<string, unknown>;
  try {
    const value = await request.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) return error("INVALID_JSON", 400);
    body = value as Record<string, unknown>;
  } catch { return error("INVALID_JSON", 400); }

  if (request.method === "POST" && body.action !== "publish") return error("INVALID_NAVIGATION_ACTION", 400, "Ismeretlen navigációs művelet.");

  const expectedRevision = Number(body.expectedRevision);
  if (!Number.isInteger(expectedRevision) || expectedRevision < 1) return error("EXPECTED_REVISION_REQUIRED", 428);
  const row = await env.DB.prepare("SELECT draft_json,published_json,revision,published_revision FROM site_navigation WHERE site_id=? LIMIT 1").bind(siteId).first<NavRow>();
  if (!row) return error("NAVIGATION_NOT_INITIALIZED", 503, "A navigációs adattár még nincs inicializálva.");
  if (row.revision !== expectedRevision) return error("REVISION_CONFLICT", 409, "A navigáció időközben módosult. Töltsd újra a legfrissebb verziót.");

  if (request.method === "PUT") {
    const checked = validateTree(body.tree);
    if (!checked.tree) return error(checked.code ?? "INVALID_NAVIGATION", 400, "A navigációs fa szerkezete hibás.");
    const pages = await env.DB.prepare("SELECT id FROM pages WHERE archived_at IS NULL AND site_id=?").bind(siteId).all<{ id: string }>();
    const pageIds = new Set(pages.results.map(page => page.id));
    if (checked.pageIds.some(id => !pageIds.has(id))) return error("NAVIGATION_TARGET_NOT_FOUND", 400, "A navigáció olyan oldalt céloz, amely nem ezen a webhelyen található.");
    const nextRevision = expectedRevision + 1;
    if (JSON.stringify(checked.tree).length > 180_000) return error("NAVIGATION_TOO_LARGE", 400, "A navigációs fa túl nagy a mentéshez.");
    const result = await env.DB.batch([
      env.DB.prepare("UPDATE site_navigation SET draft_json=?,revision=?,updated_at=CURRENT_TIMESTAMP WHERE site_id=? AND revision=?").bind(JSON.stringify(checked.tree), nextRevision, siteId, expectedRevision),
      env.DB.prepare("INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) SELECT ?,?,?,?,?,? WHERE changes()=1").bind(crypto.randomUUID(), user.id, "navigation.update", "site", siteId, JSON.stringify({ oldRevision: expectedRevision, revision: nextRevision, itemCount: checked.pageIds.length }))
    ]);
    if (Number(result[0]?.meta?.changes ?? 0) !== 1) return error("REVISION_CONFLICT", 409, "A navigáció időközben módosult. Töltsd újra a legfrissebb verziót.");
    return ok({ draft: checked.tree, revision: nextRevision, publishedRevision: row.published_revision });
  }

  const tree = parseTree(row.draft_json);
  if (!tree) return error("INVALID_NAVIGATION", 409, "A mentett navigációs fa sérült.");
  const references: string[] = [];
  const collect = (items: NavItem[]) => items.forEach(item => { if (item.type === "page" && item.pageId) references.push(item.pageId); collect(item.children); });
  collect(tree.items);
  const pages = await env.DB.prepare("SELECT id,is_published,published_slug FROM pages WHERE archived_at IS NULL AND site_id=?").bind(siteId).all<{ id: string; is_published: number; published_slug: string | null }>();
  const byId = new Map(pages.results.map(page => [page.id, page]));
  if (references.some(id => !byId.get(id)?.is_published || !byId.get(id)?.published_slug)) return error("NAVIGATION_TARGET_UNPUBLISHED", 409, "Csak létező és publikált oldal tehető közzétett navigációba.");

  const result = await env.DB.batch([
    env.DB.prepare("UPDATE site_navigation SET published_json=draft_json,published_revision=revision,updated_at=CURRENT_TIMESTAMP WHERE site_id=? AND revision=?").bind(siteId, expectedRevision),
    env.DB.prepare("INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) SELECT ?,?,?,?,?,? WHERE changes()=1").bind(crypto.randomUUID(), user.id, "navigation.publish", "site", siteId, JSON.stringify({ revision: expectedRevision }))
  ]);
  if (Number(result[0]?.meta?.changes ?? 0) !== 1) return error("REVISION_CONFLICT", 409, "A navigáció időközben módosult. Töltsd újra a legfrissebb verziót.");
  return ok({ published: true, revision: expectedRevision, publishedRevision: expectedRevision });
}

export async function adminNavigationRoute(request:Request,env:Env):Promise<Response>{
 try{return await adminNavigationRouteImpl(request,env)}catch(e){
  if(String(e).includes('NAVIGATION_TARGET_ARCHIVED'))return error('NAVIGATION_TARGET_ARCHIVED',409,'Archivált oldal nem szerepelhet a navigációban. Töltsd újra az oldallistát.');
  throw e;
 }
}
