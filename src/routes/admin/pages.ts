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

function serialize(row: PageRow) {
  let content: unknown = {};
  try { content = JSON.parse(row.content_json); } catch {}
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content,
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function validSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

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
    return ok(rows.results.map(serialize));
  }

  let body: PageBody;
  try { body = await request.json() as PageBody; }
  catch { return error("INVALID_JSON", 400); }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const content = body.content === undefined ? {} : body.content;
  const isPublished = body.isPublished === undefined ? true : Boolean(body.isPublished);

  if (!title || title.length > 160 || !validSlug(slug) || slug.length > 80 || description.length > 500) {
    return error("INVALID_PAGE", 400);
  }

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
      const message = String(e);
      if (message.toLowerCase().includes("unique")) return error("SLUG_EXISTS", 409, "Slug already exists");
      throw e;
    }
    await audit(env, user.id, "page.create", id, { slug, title });
    return ok({ id, slug, title, description, content, isPublished }, 201);
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
      const message = String(e);
      if (message.toLowerCase().includes("unique")) return error("SLUG_EXISTS", 409, "Slug already exists");
      throw e;
    }
    await audit(env, user.id, "page.update", id, { slug, title, isPublished });
    return ok({ id, slug, title, description, content, isPublished });
  }

  if (request.method === "DELETE") {
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return error("INVALID_PAGE_ID", 400);
    const result = await env.DB.prepare("DELETE FROM pages WHERE id = ?").bind(id).run();
    if (!result.meta.changes) return error("PAGE_NOT_FOUND", 404);
    await audit(env, user.id, "page.delete", id, {});
    return ok({ id, deleted: true });
  }

  return error("METHOD_NOT_ALLOWED", 405);
}
