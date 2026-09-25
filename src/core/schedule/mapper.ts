import type { CanonicalScheduleInput, TwitchScheduleSegment } from "./types.ts";

export function mapTwitchScheduleSegment(
  segment: TwitchScheduleSegment,
  sourceAccountId: string,
  broadcasterLogin: string,
  syncedAt: string
): CanonicalScheduleInput {
  if (!segment.id || !segment.startAt || !segment.endAt || !segment.title) {
    throw new Error("INVALID_TWITCH_SCHEDULE_SEGMENT");
  }
  const start = Date.parse(segment.startAt);
  const end = Date.parse(segment.endAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error("INVALID_TWITCH_SCHEDULE_SEGMENT");
  }
  return {
    source: "twitch",
    sourceId: segment.id,
    sourceAccountId,
    sourcePresence: "present",
    sourceSyncedAt: syncedAt,
    isRecurring: segment.isRecurring,
    sourceCategoryId: segment.categoryId,
    sourceCategoryName: segment.categoryName,
    title: segment.title,
    platform: "Twitch",
    startsAt: new Date(start).toISOString(),
    endsAt: new Date(end).toISOString(),
    status: segment.canceledUntil ? "cancelled" : "scheduled",
    url: broadcasterLogin ? `https://www.twitch.tv/${encodeURIComponent(broadcasterLogin)}` : null,
    notes: ""
  };
}
