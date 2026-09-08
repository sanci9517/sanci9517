export function createWorkerRouter({ json, routes }) {
  return async function dispatch(request, env) {
    const url = new URL(request.url);
    const methodRoutes = routes[request.method] || [];
    const route = methodRoutes.find((entry) => entry.path === url.pathname);
    if (!route) return null;
    return route.handle(request, env, json);
  };
}
