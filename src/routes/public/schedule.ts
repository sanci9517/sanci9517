import { ok } from "../../core/response";
import type { Env } from "../../types/env";

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

export async function publicScheduleRoute(env: Env): Promise<Response> {
  const rows = await env.DB.prepare(
    `SELECT id,title,platform,starts_at,ends_at,status,url,notes
     FROM schedule_items
     WHERE status != 'cancelled'
     ORDER BY starts_at ASC
     LIMIT 50`
  ).all<ScheduleRow>();

  return ok(rows.results.map(row => ({
    id: row.id,
    title: row.title,
    platform: row.platform,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    url: row.url,
    notes: row.notes
  })));
}
