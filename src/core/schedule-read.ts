import type { D1Database } from "@cloudflare/workers-types";
import { DEFAULT_SITE_ID } from "./site-context.ts";

export const SCHEDULE_READ_MODES = ["upcoming", "all", "next", "week"] as const;
export const SCHEDULE_READ_ORDERS = ["asc", "desc"] as const;
export const SCHEDULE_READ_STATUSES = ["scheduled", "live", "completed", "cancelled"] as const;

export type ScheduleReadConfig = {
  siteId?: string;
  mode?: string;
  limit?: number;
  statuses?: string[];
  platforms?: string[];
  order?: string;
  weekStart?: string;
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

export function normalizeScheduleReadConfig(input: ScheduleReadConfig = {}) {
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

  // Week boundaries are calendar dates in Europe/Budapest, not UTC timestamps.
  // Only a valid Monday is accepted; callers cannot request arbitrary ranges.
  const weekStart = input.weekStart;
  if (mode === "week") {
    if (typeof weekStart !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) throw new Error("Invalid week start");
    const date = new Date(weekStart + "T12:00:00Z");
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== weekStart || date.getUTCDay() !== 1) throw new Error("Week start must be Monday");
  } else if (weekStart !== undefined) throw new Error("weekStart requires week mode");

  return {
    siteId: input.siteId ?? DEFAULT_SITE_ID,
    mode: mode as typeof SCHEDULE_READ_MODES[number],
    limit: mode === "next" ? 1 : limit,
    statuses: [...new Set(statuses)],
    platforms: [...new Set(platforms.map(platform => platform.trim()))],
    order: order as typeof SCHEDULE_READ_ORDERS[number],
    weekStart: mode === "week" ? weekStart : undefined
  };
}

const budapestDay = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Budapest", year: "numeric", month: "2-digit", day: "2-digit" });
function dayKey(value: string): string {
  // Manual entries are stored without offset and already represent local time.
  if (!/(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) return value.slice(0, 10);
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return "";
  const p = Object.fromEntries(budapestDay.formatToParts(parsed).filter(x => x.type !== "literal").map(x => [x.type, x.value]));
  return p.year + "-" + p.month + "-" + p.day;
}
function plusDays(day: string, amount: number): string {
  const date = new Date(day + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export async function readPublicSchedule(db: D1Database, input: ScheduleReadConfig = {}): Promise<PublicScheduleItem[]> {
  const config = normalizeScheduleReadConfig(input);
  const where = ["site_id = ?"]; // The requested status list controls cancellations.
  const binds: unknown[] = [config.siteId ?? DEFAULT_SITE_ID];

  where.push(`status IN (${config.statuses.map(() => "?").join(",")})`);
  binds.push(...config.statuses);

  if (config.mode === "upcoming" || config.mode === "next") {
    where.push("starts_at >= datetime('now')");
  }

  if (config.mode === "week" && config.weekStart) {
    // One day on both sides accounts for UTC/offest events crossing local midnight.
    // Exact Europe/Budapest day filtering happens after retrieval.
    where.push("substr(starts_at, 1, 10) >= ? AND substr(starts_at, 1, 10) < ?");
    binds.push(plusDays(config.weekStart, -1), plusDays(config.weekStart, 8));
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
     LIMIT ${config.mode === "week" ? 300 : config.limit}`
  ).bind(...binds).all<{
    id: string; title: string; platform: string; starts_at: string;
    ends_at: string | null; status: string; url: string | null; notes: string;
  }>();

  const mapped = rows.results.map(row => ({
    id: row.id,
    title: row.title,
    platform: row.platform,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    url: row.url,
    notes: row.notes
  }));
  if (config.mode !== "week" || !config.weekStart) return mapped;
  const lastExclusive = plusDays(config.weekStart, 7);
  const weekly = mapped.filter(row => {
    const localDay = dayKey(row.startsAt);
    return localDay >= config.weekStart! && localDay < lastExclusive;
  }).sort((a, b) => {
    const dateOrder = dayKey(a.startsAt).localeCompare(dayKey(b.startsAt));
    return dateOrder || a.startsAt.localeCompare(b.startsAt);
  });
  if (config.order === "desc") weekly.reverse();
  return weekly.slice(0, config.limit);
}
