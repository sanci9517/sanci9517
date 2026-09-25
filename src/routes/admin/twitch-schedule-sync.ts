import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import { syncTwitchSchedule } from "../../core/schedule/twitch-sync";
import type { Env } from "../../types/env";

type Body = {
  connectionId?: unknown;
  startAt?: unknown;
  endAt?: unknown;
};

function normalize(body: Body) {
  const connectionId = typeof body.connectionId === "string" ? body.connectionId.trim() : "";
  const startAt = typeof body.startAt === "string" ? body.startAt.trim() : "";
  const endAt = typeof body.endAt === "string" ? body.endAt.trim() : "";
  if (!connectionId || !startAt || !endAt) return null;
  if (!Number.isFinite(Date.parse(startAt)) || !Number.isFinite(Date.parse(endAt)) || Date.parse(endAt) <= Date.parse(startAt)) {
    return null;
  }
  return { connectionId, startAt, endAt };
}

export async function adminTwitchScheduleSyncRoute(request: Request, env: Env): Promise<Response> {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return error("UNAUTHORIZED", 401, "Authentication required");
  if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");
  if (request.method !== "POST") return error("METHOD_NOT_ALLOWED", 405);

  let body: Body;
  try { body = await request.json() as Body; } catch { return error("INVALID_JSON", 400); }
  const data = normalize(body);
  if (!data) return error("INVALID_SCHEDULE_SYNC_REQUEST", 400);

  try {
    const result = await syncTwitchSchedule(env, data.connectionId, {
      startAt: data.startAt,
      endAt: data.endAt
    });
    return ok(result);
  } catch (e) {
    const code = e instanceof Error ? e.message : "SCHEDULE_SYNC_FAILED";
    if (code === "SCHEDULE_SYNC_ALREADY_RUNNING") return error(code, 409, "Schedule sync is already running");
    if (code === "TWITCH_CONNECTION_NOT_FOUND") return error(code, 404, "Twitch connection not found");
    if (code === "TWITCH_SCHEDULE_REAUTHORIZATION_REQUIRED") return error(code, 401, "Twitch authorization must be renewed");
    if (code === "TWITCH_SCHEDULE_RATE_LIMITED") return error(code, 429, "Twitch schedule rate limited");
    if (code === "TWITCH_SCHEDULE_SOURCE_EMPTY") return ok({
      status: "source_empty",
      seenCount: 0,
      upsertedCount: 0,
      missingCount: 0
    });
    return error("SCHEDULE_SYNC_FAILED", 502, "Twitch schedule sync failed");
  }
}
