import type { D1Database } from "@cloudflare/workers-types";

export const SCHEDULE_READ_MODES = ["upcoming", "all", "next"] as const;
export const SCHEDULE_READ_ORDERS = ["asc", "desc"] as const;
export const SCHEDULE_READ_STATUSES = ["scheduled", "live", "completed"] as const;

export type ScheduleReadConfig = {
  mode?: string;
  limit?: number;
  statuses?: string[];
  platforms?: string[];
  order?: string;
};

export type PublicScheduleItem = {
  id: string;
  title: string;
  platform: string;
  startsAt: string;
  endsAt: string | null;
  status: string;
  url: string | null;
  notes: string;
};

const DEFAULTS = {
  mode: "upcoming",
  limit: 10,
  statuses: ["scheduled", "live"],
  platforms: [],
  order: "asc"
} as const;

function normalizeConfig(input: ScheduleReadConfig = {}) {
  const mode = input.mode ?? DEFAULTS.mode;
  if (!(SCHEDULE_READ_MODES as readonly string[]).includes(mode)) throw new Error("Invalid schedule mode");

  const limit = input.limit ?? DEFAULTS.limit;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error("Invalid schedule limit");

  const statuses = input.statuses ?? [...DEFAULTS.statuses];
  if (!Array.isArray(statuses) || statuses.length === 0 || statuses.some(status => !(SCHEDULE_READ_STATUSES as readonly string[]).includes(status))) {
    throw new Error("Invalid schedule statuses");
  }

  const platforms = input.platforms ?? [];
  if (!Array.isArray(platforms) || platforms.length > 20 || platforms.some(platform => typeof platform !== "string" || !platform.trim() || platform.trim().length > 40)) {
    throw new Error("Invalid schedule platforms");
  }

  const order = input.order ?? DEFAULTS.order;
  if (!(SCHEDULE_READ_ORDERS as readonly string[]).includes(order)) throw new Error("Invalid schedule order");

  return {
    mode: mode as typeof SCHEDULE_READ_MODES[number],
    limit: mode === "next" ? 1 : limit,
    statuses: [...new Set(statuses)],
    platforms: [...new Set(platforms.map(platform => platform.trim()))],
    order: order as typeof SCHEDULE_READ_ORDERS[number]
  };
}

export async function readPublicSchedule(db: D1Database, input: ScheduleReadConfig = {}): Promise<PublicScheduleItem[]> {
  const config = normalizeConfig(input);
  const where = ["status != 'cancelled'"];
  const binds: unknown[] = [];

  where.push(`status IN (${config.statuses.map(() => "?").join(",")})`);
  binds.push(...config.statuses);

  if (config.mode === "upcoming" || config.mode === "next") {
    where.push("starts_at >= ?");
    binds.push(new Date().toISOString());
  }

  if (config.platforms.length) {
    where.push(`platform IN (${config.platforms.map(() => "?").join(",")})`);
    binds.push(...config.platforms);
  }

  const rows = await db.prepare(
    `SELECT id,title,platform,starts_at,ends_at,status,url,notes
     FROM schedule_items
     WHERE ${where.join(" AND ")}
     ORDER BY starts_at ${config.order === "desc" ? "DESC" : "ASC"}
     LIMIT ${config.limit}`
  ).bind(...binds).all<{
    id: string; title: string; platform: string; starts_at: string;
    ends_at: string | null; status: string; url: string | null; notes: string;
  }>();

  return rows.results.map(row => ({
    id: row.id,
    title: row.title,
    platform: row.platform,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    url: row.url,
    notes: row.notes
  }));
}
