export type RouteHandler<Env> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => Response | Promise<Response>;

export function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export function notFound(): Response {
  return json({ ok: false, error: "NOT_FOUND" }, 404);
}
