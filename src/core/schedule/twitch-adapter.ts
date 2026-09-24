import type { Env } from "../../types/env";
import { getValidTwitchAccessToken } from "../twitch-oauth";
import { normalizeScheduleSyncWindow, type ScheduleSyncWindow, type TwitchScheduleSegment, type TwitchScheduleSnapshot } from "./types";

const TWITCH_SCHEDULE_URL = "https://api.twitch.tv/helix/schedule";
const PAGE_SIZE = 25;
const DEFAULT_MAX_PAGES = 100;

type TwitchPayload = {
  data?: {
    segments?: Array<{
      id?: unknown; start_time?: unknown; end_time?: unknown; title?: unknown;
      canceled_until?: unknown; category?: { id?: unknown; name?: unknown } | null;
      is_recurring?: unknown;
    }>;
  };
  pagination?: { cursor?: unknown };
};

export type TwitchScheduleResponseErrorCode =
  | "TWITCH_SCHEDULE_REAUTHORIZATION_REQUIRED"
  | "TWITCH_SCHEDULE_SOURCE_EMPTY"
  | "TWITCH_SCHEDULE_RATE_LIMITED"
  | "TWITCH_SCHEDULE_BAD_RESPONSE"
  | "TWITCH_SCHEDULE_TRANSIENT_FAILURE";

export function mapTwitchScheduleResponseStatus(status: number): TwitchScheduleResponseErrorCode | null {
  if (status === 401) return "TWITCH_SCHEDULE_REAUTHORIZATION_REQUIRED";
  if (status === 404) return "TWITCH_SCHEDULE_SOURCE_EMPTY";
  if (status === 429) return "TWITCH_SCHEDULE_RATE_LIMITED";
  if (status >= 500) return "TWITCH_SCHEDULE_TRANSIENT_FAILURE";
  if (status < 200 || status >= 300) return "TWITCH_SCHEDULE_BAD_RESPONSE";
  return null;
}

export class TwitchScheduleAdapterError extends Error {
  constructor(public readonly code:
    | TwitchScheduleResponseErrorCode
    | "TWITCH_SCHEDULE_PAGE_LIMIT") {
    super(code);
    this.name = "TwitchScheduleAdapterError";
  }
}

async function readIdentity(env: Env, connectionId: string): Promise<{ broadcasterId: string; broadcasterLogin: string }> {
  const row = await env.DB.prepare(
    "SELECT broadcaster_id AS broadcasterId,broadcaster_login AS broadcasterLogin FROM twitch_connections WHERE id=? LIMIT 1"
  ).bind(connectionId).first<{ broadcasterId: string; broadcasterLogin: string }>();
  if (!row?.broadcasterId) throw new Error("TWITCH_CONNECTION_NOT_FOUND");
  return row;
}

function parseSegment(raw: NonNullable<NonNullable<TwitchPayload["data"]>["segments"]>[number]): TwitchScheduleSegment {
  if (
    typeof raw.id !== "string" || typeof raw.start_time !== "string" ||
    typeof raw.end_time !== "string" || typeof raw.title !== "string" ||
    (raw.canceled_until !== null && typeof raw.canceled_until !== "string") ||
    (raw.category !== null && typeof raw.category !== "object") ||
    typeof raw.is_recurring !== "boolean"
  ) throw new TwitchScheduleAdapterError("TWITCH_SCHEDULE_BAD_RESPONSE");

  const start = Date.parse(raw.start_time);
  const end = Date.parse(raw.end_time);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new TwitchScheduleAdapterError("TWITCH_SCHEDULE_BAD_RESPONSE");
  }

  return {
    id: raw.id,
    startAt: new Date(start).toISOString(),
    endAt: new Date(end).toISOString(),
    title: raw.title,
    canceledUntil: raw.canceled_until,
    categoryId: raw.category && typeof raw.category.id === "string" ? raw.category.id : null,
    categoryName: raw.category && typeof raw.category.name === "string" ? raw.category.name : null,
    isRecurring: raw.is_recurring
  };
}

export async function fetchTwitchSchedule(
  env: Env, connectionId: string, window: ScheduleSyncWindow,
  options: { maxPages?: number; fetchImpl?: typeof fetch } = {}
): Promise<TwitchScheduleSnapshot> {
  const normalized = normalizeScheduleSyncWindow(window);
  const identity = await readIdentity(env, connectionId);
  const token = await getValidTwitchAccessToken(env, connectionId);
  if (!env.TWITCH_CLIENT_ID) throw new Error("TWITCH_INTEGRATION_NOT_CONFIGURED");

  const maxPages = options.maxPages ?? DEFAULT_MAX_PAGES;
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 1000) throw new Error("INVALID_TWITCH_SCHEDULE_MAX_PAGES");
  const fetchImpl = options.fetchImpl ?? fetch;
  const segments: TwitchScheduleSegment[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const url = new URL(TWITCH_SCHEDULE_URL);
    url.searchParams.set("broadcaster_id", identity.broadcasterId);
    url.searchParams.set("start_time", normalized.startAt);
    url.searchParams.set("first", String(PAGE_SIZE));
    if (cursor) url.searchParams.set("after", cursor);

    const response = await fetchImpl(url, {
      headers: { Authorization: `Bearer ${token}`, "Client-Id": env.TWITCH_CLIENT_ID }
    });

    const responseError = mapTwitchScheduleResponseStatus(response.status);
    if (responseError) throw new TwitchScheduleAdapterError(responseError);

    let payload: TwitchPayload;
    try { payload = await response.json() as TwitchPayload; }
    catch { throw new TwitchScheduleAdapterError("TWITCH_SCHEDULE_BAD_RESPONSE"); }

    if (!payload.data || !Array.isArray(payload.data.segments)) {
      throw new TwitchScheduleAdapterError("TWITCH_SCHEDULE_BAD_RESPONSE");
    }

    for (const raw of payload.data.segments) {
      const segment = parseSegment(raw);
      if (segment.startAt >= normalized.startAt && segment.startAt < normalized.endAt) segments.push(segment);
    }

    const next = typeof payload.pagination?.cursor === "string" && payload.pagination.cursor
      ? payload.pagination.cursor : undefined;
    if (!next) return { broadcasterId: identity.broadcasterId, broadcasterLogin: identity.broadcasterLogin ?? "", segments };
    cursor = next;
  }

  throw new TwitchScheduleAdapterError("TWITCH_SCHEDULE_PAGE_LIMIT");
}
