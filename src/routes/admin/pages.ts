import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import type { Env } from "../../types/env";

type PageRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_json: string;
  is_published: number;
  created_at: string;
  updated_at: string;
};

type PageBody = {
  id?: unknown;
  slug?: unknown;
  title?: unknown;
  description?: unknown;
  content?: unknown;
  isPublished?: unknown;
};

function parse(value: string): unknown { try { return JSON.parse(value); } catch { return {}; } }

function canonicalDocument(id: string, title: string, slug: string, html: string) {
  const pageId = id;
  const rootId = `root-${id}`;
  const nodeId = `legacy-${id}`;
  return {
    schemaVersion: 2,
    type: "sanci-document",
    pages: [{
      id: pageId,
      name: title,
      slug,
      metadata: { source: "legacy-html", migrationStatus: "imported" },
      settings: {},
      responsive: { desktop: {}, tablet: {}, mobile: {} },
      root: {
        id: rootId,
        type: "root",
        name: "Oldal",
        parentId: null,
        children: [{
          id: nodeId,
          type: "custom",
          name: "Importált oldal tartalma",
          parentId: rootId,
          children: [],
          content: { html },
          layout: { position: "absolute", x: 0, y: 0, width: 1120, height: 1600 },
          style: {},
          responsive: { desktop: {}, tablet: {}, mobile: {} },
          interaction: {},
          visibility: true,
          locked: false,
          metadata: { source: "legacy-html" },
          dataBindings: {},
          capabilities: { editHtml: true }
        }]
      }
    }],
    activePageId: pageId
  };
}

async function legacyEditorDocument(request: Request, env: Env, row: PageRow) {
  const content = parse(row.content_json) as Record<string, unknown>;
  if (!content || typeof content !== "object") return null;
  if (content.type === "sanci-document" && Array.isArray(content.pages)) return content;
  const source = typeof content.legacySource === "string" ? content.legacySource : "";
  if (!source) return null;

  try {
    const response = await env.ASSETS.fetch(assetRequest(source, request));
    if (!response.ok) return null;
    let html = await response.text();
    const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
    html = mainMatch?.[1] || html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html;
    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
    html = html.trim();
    if (!html) return null;
    return canonicalDocument(row.id, row.title, row.slug, html);
  } catch {
    return null;
  }
}

async function serialize(request: Request, env: Env, row: PageRow) {
  const content = parse(row.content_json);
  const editorDocument = await legacyEditorDocument(request, env, row);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content,
    editorDocument,
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function validSlug(value: string): boolean { return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value); }

async function audit(env: Env, userId: string, action: string, id: string, metadata: unknown) {
  await env.DB.prepare(
    `INSERT INTO audit_log (id, user_id, action, entity_type, entity_id, metadata_json)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(crypto.randomUUID(), userId, action, "page", id, JSON.stringify(metadata)).run();
}

export async function adminPagesRoute(request: Request, env: Env): Promise<Response> {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");

  if (request.method === "GET") {
    const rows = await env.DB.prepare(
      `SELECT id, slug, title, description, content_json, is_published, created_at, updated_at
       FROM pages ORDER BY updated_at DESC, title ASC`
    ).all<PageRow>();
    const result = await Promise.all(rows.results.map(row => serialize(request, env, row)));
    return ok(result);
  }

  if (request.method === "DELETE") {
    let body: PageBody;
    try { body = await request.json() as PageBody; }
    catch { return error("INVALID_JSON", 400); }
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return error("INVALID_PAGE_ID", 400);
    const result = await env.DB.prepare("DELETE FROM pages WHERE id = ?").bind(id).run();
    if (!result.meta.changes) return error("PAGE_NOT_FOUND", 404);
    await audit(env, user.id, "page.delete", id, {});
    return ok({ id, deleted: true });
  }

  let body: PageBody;
  try { body = await request.json() as PageBody; }
  catch { return error("INVALID_JSON", 400); }

  if (request.method === "PATCH") {
    const id = typeof body.id === "string" ? body.id : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!id) return error("INVALID_PAGE_ID", 400);
    if (!title || title.length > 160) return error("INVALID_PAGE_TITLE", 400);
    const existing = await env.DB.prepare(
      `SELECT id, slug, title, description, content_json, is_published, created_at, updated_at
       FROM pages WHERE id = ? LIMIT 1`
    ).bind(id).first<PageRow>();
    if (!existing) return error("PAGE_NOT_FOUND", 404);
    await env.DB.prepare(`UPDATE pages SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(title, id).run();
    await audit(env, user.id, "page.rename", id, { oldTitle: existing.title, title });
    const updated = { ...existing, title };
    return ok(await serialize(request, env, updated));
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const content = body.content === undefined ? {} : body.content;
  const isPublished = body.isPublished === undefined ? true : Boolean(body.isPublished);

  if (!title || title.length > 160 || !validSlug(slug) || slug.length > 80 || description.length > 500) return error("INVALID_PAGE", 400);

  let contentJson: string;
  try {
    contentJson = JSON.stringify(content ?? {});
    if (contentJson.length > 100000) return error("PAGE_TOO_LARGE", 400);
  } catch { return error("INVALID_CONTENT", 400); }

  if (request.method === "POST") {
    const id = crypto.randomUUID();
    try {
      await env.DB.prepare(
        `INSERT INTO pages (id, slug, title, description, content_json, is_published, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(id, slug, title, description, contentJson, isPublished ? 1 : 0).run();
    } catch (e) {
      if (String(e).toLowerCase().includes("unique")) return error("SLUG_EXISTS", 409, "Slug already exists");
      throw e;
    }
    await audit(env, user.id, "page.create", id, { slug, title });
    return ok({ id, slug, title, description, content, isPublished });
  }

  if (request.method === "PUT") {
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return error("INVALID_PAGE_ID", 400);
    const existing = await env.DB.prepare("SELECT id FROM pages WHERE id = ? LIMIT 1").bind(id).first<{id:string}>();
    if (!existing) return error("PAGE_NOT_FOUND", 404);
    try {
      await env.DB.prepare(
        `UPDATE pages SET slug = ?, title = ?, description = ?, content_json = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).bind(slug, title, description, contentJson, isPublished ? 1 : 0, id).run();
    } catch (e) {
      if (String(e).toLowerCase().includes("unique")) return error("SLUG_EXISTS", 409, "Slug already exists");
      throw e;
    }
    await audit(env, user.id, "page.update", id, { slug, title, isPublished });
    return ok({ id, slug, title, description, content, isPublished });
  }

  return error("METHOD_NOT_ALLOWED", 405);
}

function assetRequest(pathname: string, request: Request): Request {
  const url = new URL(pathname, request.url);
  return new Request(url.toString(), { method: "GET", headers: request.headers });
}
