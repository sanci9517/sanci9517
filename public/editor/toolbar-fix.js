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

  function selectedGroup() {
    const els = [...document.querySelectorAll('#canvas .node.selected')];
    if (!els.length || typeof find !== 'function') return null;
    const nodes = els.map(el => find(el.dataset.id)).filter(Boolean);
    if (!nodes.length) return null;
    const gid = nodes[0].groupId;
    if (!gid || nodes.some(n => n.groupId !== gid)) return null;
    const members = typeof groupMembers === 'function' ? groupMembers(gid) : nodes;
    return members.length ? { gid, members } : null;
  }

  function groupBounds(members) {
    const xs=members.map(n=>Number(n.layout?.x)||0), ys=members.map(n=>Number(n.layout?.y)||0);
    const rs=members.map(n=>(Number(n.layout?.x)||0)+(Number(n.layout?.width)||0));
    const bs=members.map(n=>(Number(n.layout?.y)||0)+(Number(n.layout?.height)||0));
    const x=Math.min(...xs), y=Math.min(...ys), r=Math.max(...rs), b=Math.max(...bs);
    return {x,y,w:Math.max(1,r-x),h:Math.max(1,b-y)};
  }

  function renderGroupProperties() {
    const box=document.getElementById('inspector');
    if(!box) return;
    box.querySelector('.group-props')?.remove();
    const g=selectedGroup();
    if(!g) return;
    const b=groupBounds(g.members);
    const section=document.createElement('details');
    section.className='inspect-section group-props';
    section.open=true;
    section.innerHTML=`<summary>Csoport tulajdonságai</summary><div class="inspect-body"><div class="hint">Egy csoport van kijelölve. A módosítás minden csoporttagra vonatkozik.</div><div class="field-row"><div class="field"><label>X</label><input data-gp="x" type="number" value="${Math.round(b.x)}"></div><div class="field"><label>Y</label><input data-gp="y" type="number" value="${Math.round(b.y)}"></div></div><div class="field-row"><div class="field"><label>Szélesség</label><input data-gp="w" type="number" min="1" value="${Math.round(b.w)}"></div><div class="field"><label>Magasság</label><input data-gp="h" type="number" min="1" value="${Math.round(b.h)}"></div></div></div>`;
    box.appendChild(section);
    section.querySelectorAll('[data-gp]').forEach(input => input.addEventListener('change', () => applyGroupProperty(g, input.dataset.gp, Number(input.value))));
  }

  function applyGroupProperty(g,key,value){
    if(!Number.isFinite(value) || value < 1 || typeof commit !== 'function') return;
    const before=groupBounds(g.members);
    commit();
    if(key==='x'||key==='y'){
      const dx=key==='x'?value-before.x:0, dy=key==='y'?value-before.y:0;
      g.members.forEach(n=>{n.layout.x=Math.round((Number(n.layout.x)||0)+dx);n.layout.y=Math.round((Number(n.layout.y)||0)+dy)});
    } else {
      const sx=key==='w'?value/before.w:1, sy=key==='h'?value/before.h:1;
      g.members.forEach(n=>{
        n.layout.x=Math.round(before.x+((Number(n.layout.x)||0)-before.x)*sx);
        n.layout.y=Math.round(before.y+((Number(n.layout.y)||0)-before.y)*sy);
        if(key==='w') n.layout.width=Math.max(20,Math.round((Number(n.layout.width)||20)*sx));
        if(key==='h') n.layout.height=Math.max(20,Math.round((Number(n.layout.height)||20)*sy));
      });
    }
    if(typeof render==='function') render();
    if(typeof show==='function') show('Csoport tulajdonsága módosítva');
  }

  function startGroupInspector(){
    const canvas=document.getElementById('canvas');
    if(!canvas) return;
    let last='';
    const refresh=()=>{
      const g=selectedGroup();
      const key=g ? g.gid+':'+document.querySelectorAll('#canvas .node.selected').length : '';
      if(key!==last){last=key;renderGroupProperties();}
    };
    new MutationObserver(refresh).observe(canvas,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    refresh();
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
    startGroupInspector();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
