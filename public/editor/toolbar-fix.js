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

  function injectLayout() {
    if (document.getElementById('sanci-editor-layout-style')) return;
    const style = document.createElement('style');
    style.id = 'sanci-editor-layout-style';
    style.textContent = `
      .workspace{grid-template-columns:330px minmax(460px,1fr) 325px!important;position:relative}
      .canvas-wrap{justify-content:flex-start!important;padding-left:30px;padding-right:30px}
      .canvas-stage{margin-left:max(0px,calc((100% - 1120px)/2))!important;margin-right:0!important}
      .editor-panel-toggle{position:absolute;top:58px;width:34px;height:34px;border:1px solid #39465a;border-radius:9px;background:#101720;color:#e7edf6;z-index:80;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px #0008}
      .editor-panel-toggle.left{left:8px}.editor-panel-toggle.right{right:8px}
      .editor-panel-toggle:hover{border-color:#6ea8fe;background:#172231}
      .workspace.panel-left-closed{grid-template-columns:0 minmax(460px,1fr) 325px!important}
      .workspace.panel-right-closed{grid-template-columns:330px minmax(460px,1fr) 0!important}
      .workspace.panel-left-closed.panel-right-closed{grid-template-columns:0 minmax(460px,1fr) 0!important}
      .workspace.panel-left-closed>.left,.workspace.panel-right-closed>.right{display:none!important}
      .panel-collapse{display:flex;align-items:center;justify-content:space-between;padding:0 10px 0 14px}
      .panel-collapse button{border:0;background:transparent;color:#aeb9c9;cursor:pointer;font-size:18px;line-height:1}
      .group-properties{border:1px solid #344155;border-radius:10px;background:#0e1219;padding:10px;margin-bottom:10px}
      .group-properties .group-title{font-weight:800;font-size:13px;margin-bottom:4px}
      .group-properties .group-subtitle{font-size:10px;color:#8d98aa;margin-bottom:10px;line-height:1.4}
      .group-properties .mixed{color:#8d98aa;font-size:10px;margin-top:4px}
      .group-properties .field{margin-bottom:9px}
      .group-properties input,.group-properties select{width:100%;background:#0c1016;border:1px solid #293140;color:#eef2f7;border-radius:7px;padding:8px}
      .group-properties .gp-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
      .group-properties .gp-row{display:flex;align-items:center;gap:7px;margin:7px 0;font-size:11px;color:#cbd4e0}
    `;
    document.head.appendChild(style);
  }

  function injectPanelButtons() {
    if (document.getElementById('toggleLeftPanel')) return;
    const ws = document.querySelector('.workspace');
    if (!ws) return;
    const left = document.createElement('button');
    left.id = 'toggleLeftPanel'; left.className = 'editor-panel-toggle left'; left.type='button'; left.title='Elemek panel nyitása/zárása'; left.textContent='‹';
    const right = document.createElement('button');
    right.id = 'toggleRightPanel'; right.className = 'editor-panel-toggle right'; right.type='button'; right.title='Tulajdonságok panel nyitása/zárása'; right.textContent='›';
    ws.append(left,right);
    const leftPanel=ws.querySelector('.left'), rightPanel=ws.querySelector('.right');
    const lh=leftPanel?.querySelector('.panel-head'), rh=rightPanel?.querySelector('.panel-head');
    if(lh&&!lh.querySelector('.panel-close')){const b=document.createElement('button');b.className='panel-close';b.type='button';b.textContent='‹';b.title='Bezárás';b.onclick=()=>ws.classList.add('panel-left-closed');lh.classList.add('panel-collapse');lh.appendChild(b)}
    if(rh&&!rh.querySelector('.panel-close')){const b=document.createElement('button');b.className='panel-close';b.type='button';b.textContent='›';b.title='Bezárás';b.onclick=()=>ws.classList.add('panel-right-closed');rh.classList.add('panel-collapse');rh.appendChild(b)}
    left.onclick=()=>{ws.classList.toggle('panel-left-closed');left.textContent=ws.classList.contains('panel-left-closed')?'›':'‹'};
    right.onclick=()=>{ws.classList.toggle('panel-right-closed');right.textContent=ws.classList.contains('panel-right-closed')?'‹':'›'};
  }

  function exposeEditorApi(){
    window.SanciEditor = { state, allNodes, find, commit, render, show, setPath, getPath };
  }

  function loadGroupProperties() {
    if (document.querySelector('script[data-group-properties]')) return;
    const s = document.createElement('script');
    s.src = '/editor/group-properties.js';
    s.dataset.groupProperties = '1';
    document.body.appendChild(s);
  }

  function start() {
    injectLayout();
    injectPanelButtons();
    exposeEditorApi();
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
    loadGroupProperties();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
