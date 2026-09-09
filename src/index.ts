import { notFound } from "./core/router";
import { dbHealthRoute } from "./routes/db-health";
import { authLoginRoute } from "./routes/auth/login";
import { authSessionRoute } from "./routes/auth/session";
import { healthRoute } from "./routes/health";
import type { Env } from "./types/env";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return healthRoute();
    }

    if (url.pathname === "/api/db-health") {
      return dbHealthRoute(env);
    }

    if (url.pathname === "/api/auth/login") {
      return authLoginRoute(request, env);
    }

    if (url.pathname === "/api/auth/session") {
      return authSessionRoute(request, env);
    }

    return notFound();
  }
};
