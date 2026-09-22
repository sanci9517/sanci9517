import { error, ok } from "../../core/response";
import { readPublicSchedule } from "../../core/schedule-read";
import type { Env } from "../../types/env";

const parseList = (value: string | null) => value
  ? value.split(",").map(item => item.trim()).filter(Boolean)
  : undefined;

export async function publicScheduleRoute(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  try {
    const items = await readPublicSchedule(env.DB, {
      mode: url.searchParams.get("mode") ?? undefined,
      limit: url.searchParams.has("limit") ? Number(url.searchParams.get("limit")) : undefined,
      statuses: parseList(url.searchParams.get("statuses")),
      platforms: parseList(url.searchParams.get("platforms")),
      order: url.searchParams.get("order") ?? undefined
    });
    return ok(items);
  } catch {
    return error("INVALID_SCHEDULE_QUERY", 400, "Invalid schedule query");
  }
}
