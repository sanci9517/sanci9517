export type TwitchScheduleResponseErrorCode =
  | "TWITCH_SCHEDULE_REAUTHORIZATION_REQUIRED"
  | "TWITCH_SCHEDULE_SOURCE_EMPTY"
  | "TWITCH_SCHEDULE_RATE_LIMITED"
  | "TWITCH_SCHEDULE_BAD_RESPONSE"
  | "TWITCH_SCHEDULE_TRANSIENT_FAILURE";

export function isTwitchScheduleResponseError(error: unknown): error is { code: TwitchScheduleResponseErrorCode } {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  const code = (error as { code?: unknown }).code;
  return code === "TWITCH_SCHEDULE_REAUTHORIZATION_REQUIRED"
    || code === "TWITCH_SCHEDULE_SOURCE_EMPTY"
    || code === "TWITCH_SCHEDULE_RATE_LIMITED"
    || code === "TWITCH_SCHEDULE_BAD_RESPONSE"
    || code === "TWITCH_SCHEDULE_TRANSIENT_FAILURE";
}

export function mapTwitchScheduleResponseStatus(
  status: number
): TwitchScheduleResponseErrorCode | null {
  if (status === 401) return "TWITCH_SCHEDULE_REAUTHORIZATION_REQUIRED";
  if (status === 404) return "TWITCH_SCHEDULE_SOURCE_EMPTY";
  if (status === 429) return "TWITCH_SCHEDULE_RATE_LIMITED";
  if (status >= 500) return "TWITCH_SCHEDULE_TRANSIENT_FAILURE";
  if (status < 200 || status >= 300) return "TWITCH_SCHEDULE_BAD_RESPONSE";
  return null;
}
