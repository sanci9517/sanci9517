import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import type { Env } from "../../types/env";

const SYSTEM_PATHS = new Set(["/", "/twitch.html", "/youtube.html", "/tiktok.html", "/schedule.html", "/vod.html", "/community.html", "/about.html", "/contact.html"]);

type Body = { path?: unknown; content?: unknown };
type Row = { path: string; content_json: string; updated_at: string };

function parseContent(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  try {
    const json = JSON.stringify(value);
    if (json.length > 100000) return null;
    return value as Record<string, unknown>;
  } catch { return null; }
}

function mapRow(row: Row) {
  let content: unknown = { version: 1, blocks: [] };
  try { content = JSON.parse(row.content_json); } catch {}
  return { path: row.path, content, updatedAt: row.updated_at };
}

export async function adminSystemPagesRoute(request: Request, env: Env): Promise<Response> {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");

  if (request.method === "GET") {
    const path = new URL(request.url).searchParams.get("path")?.trim() || "";
    if (path && !SYSTEM_PATHS.has(path)) return error("SYSTEM_PAGE_NOT_FOUND", 404);
    const rows = path
      ? await env.DB.prepare("SELECT path,content_json,updated_at FROM system_page_content WHERE path=? LIMIT 1").bind(path).all<Row>()
      : await env.DB.prepare("SELECT path,content_json,updated_at FROM system_page_content ORDER BY path ASC").all<Row>();
    return ok(rows.results.map(mapRow));
  }

  if (request.method !== "PUT") return error("METHOD_NOT_ALLOWED", 405);

  let body: Body;
  try { body = await request.json() as Body; } catch { return error("INVALID_JSON", 400); }
  const path = typeof body.path === "string" ? body.path.trim() : "";
  if (!SYSTEM_PATHS.has(path)) return error("SYSTEM_PAGE_NOT_FOUND", 404);
  const content = parseContent(body.content);
  if (!content) return error("INVALID_CONTENT", 400);
  const contentJson = JSON.stringify(content);

  await env.DB.prepare(
    `INSERT INTO system_page_content (path,content_json,updated_at)
     VALUES (?,?,CURRENT_TIMESTAMP)
     ON CONFLICT(path) DO UPDATE SET content_json=excluded.content_json, updated_at=CURRENT_TIMESTAMP`
  ).bind(path, contentJson).run();

  await env.DB.prepare(
    `INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json)
     VALUES (?,?,?,?,?,?)`
  ).bind(crypto.randomUUID(), user.id, "system_page.update", "system_page", path, JSON.stringify({ path })).run();

  return ok({ path, content });
}
