export type ScheduleSource = "manual" | "twitch";

export type ScheduleSyncStatus =
  | "idle" | "running" | "success" | "source_empty"
  | "reauthorization_required" | "rate_limited" | "failed";

export type ScheduleSyncWindow = { startAt: string; endAt: string };

export type TwitchScheduleSegment = {
  id: string;
  startAt: string;
  endAt: string;
  title: string;
  canceledUntil: string | null;
  categoryId: string | null;
  categoryName: string | null;
  isRecurring: boolean;
};

export type TwitchScheduleSnapshot = {
  broadcasterId: string;
  broadcasterLogin: string;
  segments: TwitchScheduleSegment[];
};

export type CanonicalScheduleInput = {
  source: "twitch";
  sourceId: string;
  sourceAccountId: string;
  sourcePresence: "present";
  sourceSyncedAt: string;
  isRecurring: boolean;
  sourceCategoryId: string | null;
  sourceCategoryName: string | null;
  title: string;
  platform: "Twitch";
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "cancelled";
  url: string | null;
  notes: string;
};

export function normalizeScheduleSyncWindow(window: ScheduleSyncWindow): ScheduleSyncWindow {
  const start = Date.parse(window.startAt);
  const end = Date.parse(window.endAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error("INVALID_SCHEDULE_SYNC_WINDOW");
  }
  return { startAt: new Date(start).toISOString(), endAt: new Date(end).toISOString() };
}
