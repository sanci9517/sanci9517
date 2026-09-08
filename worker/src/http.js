const DEFAULT_ADMIN_ORIGIN = 'https://sanci9517.github.io';

export function corsHeaders(request, env) {
  const origin = request.headers.get('origin');
  const allowedOrigin = String(env.ADMIN_ORIGIN || DEFAULT_ADMIN_ORIGIN).replace(/\/$/, '');
  const headers = {
    'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
    'access-control-allow-credentials': 'true',
    'access-control-max-age': '600',
    vary: 'Origin',
  };
  if (!origin || origin === allowedOrigin) headers['access-control-allow-origin'] = origin || allowedOrigin;
  return headers;
}

export function json(data, status = 200, extraHeaders = {}, request = null, env = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(request ? corsHeaders(request, env) : {}),
      ...extraHeaders,
    },
  });
}
