/* Sanci9517 Editor v2 — geometry preset controls.
 * Presets intentionally drive the existing Inspector inputs so the canonical
 * Command -> Page Model -> Canvas -> History path remains the only mutation path.
 */

const PRESETS = Object.freeze({
  width: [
    ['Auto', 'auto'],
    ['Fill', '100%'],
    ['Fit', 'fit-content']
  ],
  height: [
    ['Auto', 'auto'],
    ['Fit', 'fit-content']
  ],
  position: [
    ['Static', 'static'],
    ['Relative', 'relative'],
    ['Absolute', 'absolute']
  ]
});

const STYLE_ID = 'sanci-geometry-presets-style';

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .geometry-presets{display:flex;flex-wrap:wrap;gap:6px;margin:-2px 0 9px}
    .geometry-presets button{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.045);color:inherit;border-radius:6px;padding:5px 8px;font:inherit;font-size:11px;cursor:pointer}
    .geometry-presets button:hover{background:rgba(255,255,255,.09)}
    .geometry-presets button.active{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.12)}
  `;
  document.head.append(style);
}

function findField(group, labelText) {
  return [...group.querySelectorAll('.field')].find((field) =>
    field.querySelector('span')?.textContent?.trim() === labelText
  );
}

function addPresets(group, labelText, values, input) {
  const field = findField(group, labelText);
  if (!field || field.previousElementSibling?.classList.contains('geometry-presets')) return;

  const presets = document.createElement('div');
  presets.className = 'geometry-presets';
  presets.setAttribute('aria-label', `${labelText} gyorsbeállítások`);

  for (const [label, value] of values) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.dataset.value = value;
    button.onclick = () => {
      input.value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    presets.append(button);
  }

  field.before(presets);
}

function enhance() {
  installStyle();
  const inspector = document.querySelector('#inspectorBody');
  if (!inspector) return;
  const group = [...inspector.querySelectorAll('.inspector-group')].find((item) =>
    item.querySelector('.inspector-group-title strong')?.textContent?.trim() === 'Geometria'
  );
  if (!group) return;

  addPresets(group, 'Szélesség', PRESETS.width, findField(group, 'Szélesség')?.querySelector('input'));
  addPresets(group, 'Magasság', PRESETS.height, findField(group, 'Magasság')?.querySelector('input'));
  addPresets(group, 'Pozícionálás', PRESETS.position, findField(group, 'Pozícionálás')?.querySelector('input'));
}

const observer = new MutationObserver(enhance);
observer.observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', enhance);
