import { error, ok } from "../../core/response";
import type { Env } from "../../types/env";

type PageRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  published_content_json: string | null;
  content_json: string;
  updated_at: string;
};

function parse(value: string | null | undefined): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function mapPage(row: PageRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: parse(row.published_content_json),
    updatedAt: row.updated_at
  };
}

export async function publicPagesRoute(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim().toLowerCase() || "";
  const preview = url.searchParams.get("preview") === "1";

  if (preview) {
    const { getAuthenticatedUser, hasRole } = await import("../../core/auth/require-auth");
    const user = await getAuthenticatedUser(request, env);
    if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
    if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");
  }

  const select = `SELECT id,slug,title,description,published_content_json,content_json,updated_at FROM pages`;
  const result = !slug
    ? await env.DB.prepare(`${select} ${preview ? "" : "WHERE is_published=1"} ORDER BY updated_at DESC,title ASC LIMIT 100`).all<PageRow>()
    : await env.DB.prepare(`${select} WHERE slug=?1 ${preview ? "" : "AND is_published=1"} LIMIT 1`).bind(slug).first<PageRow>();

  if (!slug) return ok(result.results.map(mapPage));
  if (!result) return error("PAGE_NOT_FOUND", 404);

  if (preview) {
    return ok({ ...mapPage(result), content: parse(result.content_json) });
  }

  return ok(mapPage(result));
}
