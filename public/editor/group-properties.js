(() => {
  const $ = id => document.getElementById(id);
  let lastSignature = '';

  function isGroupedSelection() {
    const layers = $('layers');
    if (!layers) return false;
    const selectedRows = [...layers.querySelectorAll('.layer.selected')];
    return selectedRows.length > 1 && selectedRows.every(row => row.textContent.includes('◉'));
  }

  function render() {
    const inspector = $('inspector');
    if (!inspector) return;
    const selected = document.querySelectorAll('#canvas .node.selected');
    const count = selected.length;
    const grouped = count > 1 && isGroupedSelection();
    const signature = `${count}:${grouped}`;
    if (signature === lastSignature) return;
    lastSignature = signature;
    if (!grouped) return;

    const panel = document.createElement('div');
    panel.dataset.groupProperties = '1';
    panel.className = 'group-properties';
    panel.innerHTML = '<div class="hint"><b>Csoport tulajdonságai</b><br>Egy módosítás az egész csoport minden elemére vonatkozik.</div>' +
      '<div class="field"><label>Átlátszóság</label><input data-group-key="opacity" type="number" min="0" max="1" step="0.05" value="1"></div>';
    inspector.innerHTML = '';
    inspector.appendChild(panel);
    panel.querySelector('[data-group-key="opacity"]').addEventListener('change', e => applyOpacity(Number(e.target.value)));
  }

  function applyOpacity(value) {
    if (typeof allNodes !== 'function' || typeof commit !== 'function' || typeof render !== 'function') return;
    const ids = new Set([...document.querySelectorAll('#canvas .node.selected')].map(el => el.dataset.id));
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
