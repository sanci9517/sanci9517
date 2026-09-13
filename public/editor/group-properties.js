(() => {
  const $ = id => document.getElementById(id);
  let lastSignature = '';

  function getGroupIds() {
    const layers = $('layers');
    if (!layers) return [];
    const rows = [...layers.querySelectorAll('.layer')];
    const selected = rows.filter(r => r.classList.contains('selected'));
    if (!selected.length) return [];
    return selected.map(r => r.textContent.includes('◉') ? r : null).filter(Boolean).length ? ['group'] : [];
  }

  function render() {
    const inspector = $('inspector');
    if (!inspector) return;
    const selected = document.querySelectorAll('#canvas .node.selected');
    const count = selected.length;
    const grouped = count > 1 && [...selected].every(el => el.dataset.id);
    const signature = `${count}:${grouped}`;
    if (signature === lastSignature) return;
    lastSignature = signature;
    if (!grouped) return;

    const old = inspector.querySelector('[data-group-properties]');
    if (old) old.remove();
    const panel = document.createElement('div');
    panel.dataset.groupProperties = '1';
    panel.className = 'group-properties';
    panel.innerHTML = '<div class="hint"><b>Csoport tulajdonságai</b><br>A csoport minden kijelölt eleme együtt módosítható.</div>' +
      '<div class="field"><label>Átlátszóság</label><input data-group-key="opacity" type="number" min="0" max="1" step="0.05" value="1"></div>';
    inspector.innerHTML = '';
    inspector.appendChild(panel);
    panel.querySelector('[data-group-key="opacity"]').addEventListener('change', e => applyOpacity(Number(e.target.value)));
  }

  function applyOpacity(value) {
    if (typeof allNodes !== 'function' || typeof commit !== 'function' || typeof render !== 'function') return;
    const selectedEls = [...document.querySelectorAll('#canvas .node.selected')];
    const ids = new Set(selectedEls.map(el => el.dataset.id));
    const nodes = allNodes().filter(n => ids.has(n.id));
    if (!nodes.length) return;
    commit();
    nodes.forEach(n => { n.style = n.style || {}; n.style.opacity = value; });
    render();
    if (typeof show === 'function') show('Csoport átlátszósága módosítva');
  }

  const observer = new MutationObserver(render);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
