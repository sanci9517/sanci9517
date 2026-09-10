import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import type { Env } from "../../types/env";

type ScheduleBody = {
  id?: unknown;
  title?: unknown;
  platform?: unknown;
  startsAt?: unknown;
  endsAt?: unknown;
  status?: unknown;
  url?: unknown;
  notes?: unknown;
};

type ScheduleRow = {
  id: string;
  title: string;
  platform: string;
  starts_at: string;
  ends_at: string | null;
  status: string;
  url: string | null;
  notes: string;
};

const STATUSES = new Set(["scheduled", "live", "completed", "cancelled"]);

function normalize(body: ScheduleBody) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const platform = typeof body.platform === "string" ? body.platform.trim() : "";
  const startsAt = typeof body.startsAt === "string" ? body.startsAt.trim() : "";
  const endsAt = typeof body.endsAt === "string" && body.endsAt.trim() ? body.endsAt.trim() : null;
  const status = typeof body.status === "string" ? body.status.trim() : "scheduled";
  const url = typeof body.url === "string" && body.url.trim() ? body.url.trim() : null;
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  if (!title || title.length > 160 || !platform || platform.length > 40 || !startsAt || startsAt.length > 40 || !STATUSES.has(status) || (url && url.length > 500) || notes.length > 500) return null;
  return { title, platform, startsAt, endsAt, status, url, notes };
}

function mapRow(row: ScheduleRow) {
  return { id: row.id, title: row.title, platform: row.platform, startsAt: row.starts_at, endsAt: row.ends_at, status: row.status, url: row.url, notes: row.notes };
}

export async function adminScheduleRoute(request: Request, env: Env): Promise<Response> {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");

  if (request.method === "GET") {
    const rows = await env.DB.prepare(
      "SELECT id,title,platform,starts_at,ends_at,status,url,notes FROM schedule_items ORDER BY starts_at ASC"
    ).all<ScheduleRow>();
    return ok(rows.results.map(mapRow));
  }

  let body: ScheduleBody;
  try { body = (await request.json()) as ScheduleBody; } catch { return error("INVALID_JSON", 400); }

  if (request.method === "POST") {
    const data = normalize(body);
    if (!data) return error("INVALID_SCHEDULE_ITEM", 400);
    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO schedule_items (id,title,platform,starts_at,ends_at,status,url,notes)
       VALUES (?,?,?,?,?,?,?,?)`
    ).bind(id, data.title, data.platform, data.startsAt, data.endsAt, data.status, data.url, data.notes).run();
    await env.DB.prepare(
      `INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) VALUES (?,?,?,?,?,?)`
    ).bind(crypto.randomUUID(), user.id, "schedule.create", "schedule_item", id, JSON.stringify(data)).run();
    return ok({ id, ...data }, 201);
  }

  if (request.method === "PUT") {
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const data = normalize(body);
    if (!id || !data) return error("INVALID_SCHEDULE_ITEM", 400);
    const result = await env.DB.prepare(
      `UPDATE schedule_items SET title=?,platform=?,starts_at=?,ends_at=?,status=?,url=?,notes=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).bind(data.title, data.platform, data.startsAt, data.endsAt, data.status, data.url, data.notes, id).run();
    if (!result.meta.changes) return error("NOT_FOUND", 404, "Schedule item not found");
    await env.DB.prepare(
      `INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) VALUES (?,?,?,?,?,?)`
    ).bind(crypto.randomUUID(), user.id, "schedule.update", "schedule_item", id, JSON.stringify(data)).run();
    return ok({ id, ...data });
  }

  if (request.method === "DELETE") {
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id) return error("INVALID_SCHEDULE_ITEM", 400);
    const result = await env.DB.prepare("DELETE FROM schedule_items WHERE id=?").bind(id).run();
    if (!result.meta.changes) return error("NOT_FOUND", 404, "Schedule item not found");
    await env.DB.prepare(
      `INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) VALUES (?,?,?,?,?,?)`
    ).bind(crypto.randomUUID(), user.id, "schedule.delete", "schedule_item", id, "{}").run();
    return ok({ id, deleted: true });
  }

  return error("METHOD_NOT_ALLOWED", 405);
}
