(() => {
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    const response = await nativeFetch(...args);
    try {
      const request = args[0];
      const url = typeof request === 'string' ? request : request?.url || '';
      const method = typeof request === 'string' ? (args[1]?.method || 'GET') : (request?.method || 'GET');
      if (method.toUpperCase() === 'GET' && url.includes('/api/admin/pages')) {
        const data = await response.clone().json();
        if (!Array.isArray(data?.pages) && Array.isArray(data?.data)) {
          return new Response(JSON.stringify({ pages: data.data }), {
            status: response.status,
            statusText: response.statusText,
            headers: { 'content-type': 'application/json' }
          });
        }
      }
    } catch {}
    return response;
  };

  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el) el.onclick = fn;
  }

  function start() {
    if (typeof loadPages === 'function') loadPages().catch(e => {
      if (typeof setStatus === 'function') setStatus('Hiba');
      if (typeof show === 'function') show(e.message || 'Oldalak betöltési hiba');
    });
    bind('undo', () => typeof undo === 'function' && undo());
    bind('redo', () => typeof redo === 'function' && redo());
    bind('groupBtn', () => typeof groupSelected === 'function' && groupSelected());
    bind('ungroupBtn', () => typeof ungroupSelected === 'function' && ungroupSelected());
    bind('duplicateBtn', () => typeof duplicate === 'function' && duplicate());
    bind('deleteBtn', () => typeof remove === 'function' && remove());
    bind('layersBtn', () => document.getElementById('layers')?.classList.toggle('open'));
    bind('saveBtn', () => typeof save === 'function' && save());
    bind('publishBtn', () => typeof save === 'function' && save());
    bind('fullscreenBtn', () => document.documentElement.requestFullscreen?.());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
