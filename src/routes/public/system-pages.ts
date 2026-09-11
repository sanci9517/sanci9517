import { ok } from "../../core/response";
import type { Env } from "../../types/env";

const SYSTEM_PATHS = new Set(["/", "/twitch.html", "/youtube.html", "/tiktok.html", "/schedule.html", "/vod.html", "/community.html", "/about.html", "/contact.html"]);

type Row = { path: string; content_json: string; updated_at: string };

function mapRow(row: Row) {
  let content: unknown = { version: 1, blocks: [] };
  try { content = JSON.parse(row.content_json); } catch {}
  return { path: row.path, content, updatedAt: row.updated_at };
}

export async function publicSystemPagesRoute(request: Request, env: Env): Promise<Response> {
  const path = new URL(request.url).searchParams.get("path")?.trim() || "";
  if (!path || !SYSTEM_PATHS.has(path)) return ok({ path, content: { version: 1, blocks: [] } });
  const row = await env.DB.prepare("SELECT path,content_json,updated_at FROM system_page_content WHERE path=? LIMIT 1").bind(path).first<Row>();
  return ok(row ? mapRow(row) : { path, content: { version: 1, blocks: [] }, updatedAt: null });
}
