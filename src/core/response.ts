export function json<T>(data: T, status = 200, headers: HeadersInit = {}): Response {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers
    }
  });
}

export function ok<T>(data: T): Response {
  return json({ ok: true, data });
}

export function error(code: string, status: number, message?: string): Response {
  return json(
    {
      ok: false,
      error: {
        code,
        message: message ?? code
      }
    },
    status
  );
}
