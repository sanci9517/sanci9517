(() => {
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    const request = args[0];
    const options = args[1] || {};
    const url = typeof request === 'string' ? request : request?.url || '';
    const method = String(typeof request === 'string' ? (options.method || 'GET') : (request?.method || 'GET')).toUpperCase();

    if (method === 'PUT' && url.includes('/api/admin/pages') && typeof options.body === 'string') {
      try {
        const body = JSON.parse(options.body);
        if (typeof body.content === 'string') {
          body.content = JSON.parse(body.content);
          options.body = JSON.stringify(body);
          args[1] = options;
        }
      } catch {}
    }

    const response = await nativeFetch(...args);
    try {
      if (method === 'GET' && url.includes('/api/admin/pages')) {
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

  async function createPage() {
    const title = prompt('Új oldal neve:', 'Új oldal');
    if (!title) return;
    const slugBase = title.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'uj-oldal';
    const slug = slugBase + '-' + Date.now().toString(36).slice(-5);
    const response = await nativeFetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: title.trim(), slug, description: '', content: {}, isPublished: true })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) throw new Error(payload.error?.message || 'Az oldal létrehozása sikertelen');
    if (typeof loadPages === 'function') await loadPages();
    show('Új oldal létrehozva');
  }

  function start() {
    if (typeof loadPages === 'function') loadPages().catch(e => {
      if (typeof setStatus === 'function') setStatus('Hiba');
      if (typeof show === 'function') show(e.message || 'Oldalak betöltési hiba');
    });
    bind('newPage', () => createPage().catch(e => show(e.message || 'Hiba')));
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
