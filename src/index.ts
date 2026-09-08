import { healthRoute } from "./routes/health";
import { notFound } from "./core/router";
import type { Env } from "./types/env";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return healthRoute();
    }

    return notFound();
  }
};
