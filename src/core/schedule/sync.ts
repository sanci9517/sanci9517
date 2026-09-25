import type { D1Database } from "@cloudflare/workers-types";
import type { Env } from "../../types/env";
import { fetchTwitchSchedule } from "./twitch-adapter";
import { mapTwitchScheduleSegment } from "./mapper";
import { isTwitchScheduleResponseError } from "./twitch-errors";
import { normalizeScheduleSyncWindow, type ScheduleSyncStatus, type ScheduleSyncWindow, type TwitchScheduleSnapshot } from "./types";

const SOURCE = "twitch";

export type ScheduleSyncFetcher = (window: ScheduleSyncWindow) => Promise<TwitchScheduleSnapshot>;

export type CanonicalScheduleSyncResult = {
  status: ScheduleSyncStatus;
  seenCount: number;
  upsertedCount: number;
  missingCount: number;
};

async function beginSync(db: D1Database, accountId: string, window: ScheduleSyncWindow): Promise<void> {
  await db.prepare(
    "INSERT OR IGNORE INTO schedule_sync_state " +
    "(id,source,source_account_id,status,window_start_at,window_end_at,updated_at) VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP)"
  ).bind(crypto.randomUUID(), SOURCE, accountId, "idle", window.startAt, window.endAt).run();

  const result = await db.prepare(
    "UPDATE schedule_sync_state SET status='running',window_start_at=?,window_end_at=?," +
    "last_started_at=CURRENT_TIMESTAMP,last_error_code=NULL,last_error_at=NULL,updated_at=CURRENT_TIMESTAMP " +
    "WHERE source=? AND source_account_id=? AND status!='running'"
  ).bind(window.startAt, window.endAt, SOURCE, accountId).run();

  if (result.meta.changes !== 1) throw new Error("SCHEDULE_SYNC_ALREADY_RUNNING");
}

async function finishSync(
  db: D1Database, accountId: string, status: ScheduleSyncStatus,
  seenCount: number, errorCode: string | null
): Promise<void> {
  await db.prepare(
    "UPDATE schedule_sync_state SET status=?,last_seen_count=?," +
    "last_succeeded_at=CASE WHEN ? IN ('success','source_empty') THEN CURRENT_TIMESTAMP ELSE last_succeeded_at END," +
    "last_completed_at=CURRENT_TIMESTAMP,last_error_code=?," +
    "last_error_at=CASE WHEN ? IS NULL THEN last_error_at ELSE CURRENT_TIMESTAMP END," +
    "updated_at=CURRENT_TIMESTAMP WHERE source=? AND source_account_id=?"
  ).bind(status, seenCount, status, errorCode, errorCode, SOURCE, accountId).run();
}

async function upsert(db: D1Database, item: ReturnType<typeof mapTwitchScheduleSegment>): Promise<void> {
  await db.prepare(
    "INSERT INTO schedule_items " +
    "(id,title,platform,starts_at,ends_at,status,url,notes,source,source_id,source_account_id," +
    "source_presence,source_synced_at,source_missing_at,is_recurring,source_category_id,source_category_name,updated_at) " +
    "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,NULL,?,?,?,CURRENT_TIMESTAMP) " +
    "ON CONFLICT(source,source_account_id,source_id) DO UPDATE SET " +
    "title=excluded.title,platform=excluded.platform,starts_at=excluded.starts_at,ends_at=excluded.ends_at," +
    "status=excluded.status,url=excluded.url,source_presence='present',source_synced_at=excluded.source_synced_at," +
    "source_missing_at=NULL,is_recurring=excluded.is_recurring,source_category_id=excluded.source_category_id," +
    "source_category_name=excluded.source_category_name,updated_at=CURRENT_TIMESTAMP"
  ).bind(
    crypto.randomUUID(), item.title, item.platform, item.startsAt, item.endsAt, item.status,
    item.url, item.notes, item.source, item.sourceId, item.sourceAccountId, item.sourcePresence,
    item.sourceSyncedAt, item.isRecurring ? 1 : 0, item.sourceCategoryId, item.sourceCategoryName
  ).run();
}

async function reconcileMissing(
  db: D1Database, accountId: string, window: ScheduleSyncWindow, seenIds: Set<string>
): Promise<number> {
  const rows = await db.prepare(
    "SELECT id,source_id AS sourceId FROM schedule_items " +
    "WHERE source=? AND source_account_id=? AND source_presence='present' AND starts_at>=? AND starts_at<?"
  ).bind(SOURCE, accountId, window.startAt, window.endAt)
    .all<{ id: string; sourceId: string | null }>();

  const statements = rows.results
    .filter(row => row.sourceId && !seenIds.has(row.sourceId))
    .map(row => db.prepare(
      "UPDATE schedule_items SET source_presence='missing',source_missing_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=?"
    ).bind(row.id));

  if (statements.length) await db.batch(statements);
  return statements.length;
}

export async function syncCanonicalTwitchSchedule(
  db: D1Database, window: ScheduleSyncWindow, fetcher: ScheduleSyncFetcher, accountId?: string
): Promise<CanonicalScheduleSyncResult> {
  const normalized = normalizeScheduleSyncWindow(window);
  let syncAccountId = accountId ?? "";
  let snapshot: TwitchScheduleSnapshot | null = null;

  if (syncAccountId) await beginSync(db, syncAccountId, normalized);

  try {
    snapshot = await fetcher(normalized);
    syncAccountId = snapshot.broadcasterId;

    if (!accountId) await beginSync(db, syncAccountId, normalized);

    const syncedAt = new Date().toISOString();
    const seenIds = new Set<string>();
    let upsertedCount = 0;

    for (const segment of snapshot.segments) {
      const item = mapTwitchScheduleSegment(segment, snapshot.broadcasterId, snapshot.broadcasterLogin, syncedAt);
      await upsert(db, item);
      seenIds.add(item.sourceId);
      upsertedCount++;
    }

    const missingCount = await reconcileMissing(db, snapshot.broadcasterId, normalized, seenIds);
    await finishSync(db, snapshot.broadcasterId, "success", snapshot.segments.length, null);
    return { status: "success", seenCount: snapshot.segments.length, upsertedCount, missingCount };
  } catch (error) {
    const code = error instanceof Error ? error.message : "SCHEDULE_SYNC_FAILED";
    if (syncAccountId && code !== "SCHEDULE_SYNC_ALREADY_RUNNING") {
      const status: ScheduleSyncStatus =
        isTwitchScheduleResponseError(error) && error.code === "TWITCH_SCHEDULE_REAUTHORIZATION_REQUIRED" ? "reauthorization_required" :
        isTwitchScheduleResponseError(error) && error.code === "TWITCH_SCHEDULE_RATE_LIMITED" ? "rate_limited" :
        isTwitchScheduleResponseError(error) && error.code === "TWITCH_SCHEDULE_SOURCE_EMPTY" ? "source_empty" : "failed";
      await finishSync(db, syncAccountId, status, snapshot?.segments.length ?? 0, code);
    }
    throw error;
  }
}

export async function syncTwitchSchedule(
  env: Env, connectionId: string, window: ScheduleSyncWindow, options: { maxPages?: number } = {}
): Promise<CanonicalScheduleSyncResult> {
  const normalized = normalizeScheduleSyncWindow(window);
  const row = await env.DB.prepare(
    "SELECT broadcaster_id AS broadcasterId FROM twitch_connections WHERE id=? LIMIT 1"
  ).bind(connectionId).first<{ broadcasterId: string }>();

  if (!row?.broadcasterId) throw new Error("TWITCH_CONNECTION_NOT_FOUND");

  return syncCanonicalTwitchSchedule(
    env.DB,
    normalized,
    async () => fetchTwitchSchedule(env, connectionId, normalized, options),
    row.broadcasterId
  );
}
