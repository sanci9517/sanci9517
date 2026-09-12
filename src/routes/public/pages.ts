import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import type { Env } from "../../types/env";

type PageRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_json: string;
  updated_at: string;
};

function mapPage(row: PageRow) {
  let content: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(row.content_json);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      content = parsed as Record<string, unknown>;
    }
  } catch {
    content = {};
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content,
    updatedAt: row.updated_at
  };
}

export async function publicPagesRoute(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim().toLowerCase() || "";
  const preview = url.searchParams.get("preview") === "1";

  if (preview) {
    const user = await getAuthenticatedUser(request, env);
    if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
    if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");
  }

  if (!slug) {
    const result = await env.DB.prepare(
      preview
        ? `SELECT id,slug,title,description,content_json,updated_at FROM pages ORDER BY updated_at DESC, title ASC LIMIT 100`
        : `SELECT id,slug,title,description,content_json,updated_at FROM pages WHERE is_published = 1 ORDER BY updated_at DESC, title ASC LIMIT 100`
    ).all<PageRow>();

    return ok(result.results.map(mapPage));
  }

  const row = await env.DB.prepare(
    preview
      ? `SELECT id,slug,title,description,content_json,updated_at FROM pages WHERE slug = ?1 LIMIT 1`
      : `SELECT id,slug,title,description,content_json,updated_at FROM pages WHERE slug = ?1 AND is_published = 1 LIMIT 1`
  )
    .bind(slug)
    .first<PageRow>();

  if (!row) return error("PAGE_NOT_FOUND", 404);

  return ok(mapPage(row));
}
