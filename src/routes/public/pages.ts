import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
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

function pageModel(value: string | null | undefined, pageId: string): Record<string, unknown> {
  const document = parse(value);
  if (document.type === "sanci-document" && Array.isArray(document.pages)) {
    const page = document.pages.find((p: any) => p?.id === pageId) || document.pages[0];
    if (page && typeof page === "object") return { ...(page as Record<string, unknown>), type: "sanci-document" };
  }
  return document;
}

function mapPage(row: PageRow, preview = false) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: pageModel(preview ? row.content_json : row.published_content_json, row.id),
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
      `SELECT id,slug,title,description,published_content_json,content_json,updated_at
       FROM pages ${preview ? "" : "WHERE is_published=1"}
       ORDER BY updated_at DESC,title ASC LIMIT 100`
    ).all<PageRow>();
    return ok(result.results.map(row => mapPage(row, preview)));
  }

  const row = await env.DB.prepare(
    `SELECT id,slug,title,description,published_content_json,content_json,updated_at
     FROM pages WHERE slug=?1 ${preview ? "" : "AND is_published=1"} LIMIT 1`
  ).bind(slug).first<PageRow>();

  if (!row) return error("PAGE_NOT_FOUND", 404);
  return ok(mapPage(row, preview));
}
